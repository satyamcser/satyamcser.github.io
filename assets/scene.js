// 3D autonomous-driving background: ego vehicle, LiDAR sweep, tracked objects,
// planned trajectory, and a camera that moves from chase view to bird's-eye view on scroll.
// If WebGL or the CDN is unavailable, site.js falls back to the 2D neural canvas.
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js";

const canvas = document.getElementById("scene-3d");
const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const mobile = window.matchMedia("(max-width: 820px)").matches;

const COLORS = {
  bg: 0x050816,
  cyan: 0x69e6ff,
  blue: 0x7a8cff,
  violet: 0xbd7cff,
  green: 0x65ffc8,
  pink: 0xff7ad9,
  body: 0x0b1430
};

const LANES = [-3.6, 0, 3.6];
const ROAD_HALF = 5.4;
const LIDAR_RANGE = 42;
const LIDAR_HEIGHT = 1.95;

let renderer = null;
try {
  renderer = new THREE.WebGLRenderer({ canvas, antialias: !mobile, alpha: true, powerPreference: "high-performance" });
} catch (error) {
  renderer = null;
}

if (renderer) start();

function rand(min, max) {
  return min + Math.random() * (max - min);
}

function smoothstep(edge0, edge1, x) {
  const t = Math.min(1, Math.max(0, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

function boxEdges(cx, cy, cz, w, h, d, out) {
  const x0 = cx - w / 2, x1 = cx + w / 2;
  const y0 = cy - h / 2, y1 = cy + h / 2;
  const z0 = cz - d / 2, z1 = cz + d / 2;
  const c = [
    [x0, y0, z0], [x1, y0, z0], [x1, y1, z0], [x0, y1, z0],
    [x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1]
  ];
  const pairs = [[0, 1], [1, 2], [2, 3], [3, 0], [4, 5], [5, 6], [6, 7], [7, 4], [0, 4], [1, 5], [2, 6], [3, 7]];
  pairs.forEach(([a, b]) => out.push(...c[a], ...c[b]));
}

function lineMaterial(color, opacity) {
  return new THREE.LineBasicMaterial({ color, transparent: true, opacity });
}

function edgedBox(w, h, d, fill, edge, edgeOpacity = 0.9) {
  const group = new THREE.Group();
  const geo = new THREE.BoxGeometry(w, h, d);
  group.add(new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ color: fill })));
  group.add(new THREE.LineSegments(new THREE.EdgesGeometry(geo), lineMaterial(edge, edgeOpacity)));
  return group;
}

function makeCar(edgeColor) {
  const car = new THREE.Group();
  const body = edgedBox(1.9, 0.62, 4.4, COLORS.body, edgeColor);
  body.position.y = 0.6;
  const cabin = edgedBox(1.6, 0.55, 2.2, COLORS.body, edgeColor);
  cabin.position.set(0, 1.18, 0.25);
  car.add(body, cabin);

  const wheelGeo = new THREE.CylinderGeometry(0.36, 0.36, 0.3, 14);
  wheelGeo.rotateZ(Math.PI / 2);
  const wheelMat = new THREE.MeshBasicMaterial({ color: 0x02040c });
  const wheelEdge = new THREE.EdgesGeometry(wheelGeo, 30);
  [[-0.95, -1.4], [0.95, -1.4], [-0.95, 1.4], [0.95, 1.4]].forEach(([x, z]) => {
    const wheel = new THREE.Mesh(wheelGeo, wheelMat);
    wheel.position.set(x, 0.36, z);
    const rim = new THREE.LineSegments(wheelEdge, lineMaterial(edgeColor, 0.5));
    rim.position.copy(wheel.position);
    car.add(wheel, rim);
  });

  const tail = new THREE.MeshBasicMaterial({ color: 0xff3d6e });
  [-0.7, 0.7].forEach((x) => {
    const light = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.1, 0.05), tail);
    light.position.set(x, 0.75, 2.22);
    car.add(light);
  });
  return car;
}

function makeLabel(text, color) {
  const c = document.createElement("canvas");
  c.width = 256;
  c.height = 64;
  const ctx = c.getContext("2d");
  ctx.fillStyle = "rgba(5, 8, 22, 0.78)";
  ctx.strokeStyle = color;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.roundRect(4, 8, 248, 48, 10);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = color;
  ctx.font = "600 26px 'JetBrains Mono', ui-monospace, monospace";
  ctx.textBaseline = "middle";
  ctx.fillText(text, 18, 33);
  const texture = new THREE.CanvasTexture(c);
  texture.colorSpace = THREE.SRGBColorSpace;
  const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: texture, transparent: true, depthWrite: false }));
  sprite.scale.set(2.6, 0.65, 1);
  return sprite;
}

function glowTexture(rgb) {
  const c = document.createElement("canvas");
  c.width = c.height = 128;
  const ctx = c.getContext("2d");
  const grd = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
  grd.addColorStop(0, `rgba(${rgb}, 0.55)`);
  grd.addColorStop(1, `rgba(${rgb}, 0)`);
  ctx.fillStyle = grd;
  ctx.fillRect(0, 0, 128, 128);
  return new THREE.CanvasTexture(c);
}

function start() {
  window.__scene3d = true;
  document.documentElement.classList.add("has-3d");

  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(COLORS.bg, 22, 105);

  const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 220);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, mobile ? 1.25 : 1.75));
  renderer.setClearColor(COLORS.bg, 0);

  // Ground grid that scrolls toward the camera.
  const GRID_STEP = 4;
  const gridPts = [];
  for (let x = -120; x <= 120; x += GRID_STEP) gridPts.push(x, 0, -200, x, 0, 40);
  for (let z = -200; z <= 40; z += GRID_STEP) gridPts.push(-120, 0, z, 120, 0, z);
  const gridGeo = new THREE.BufferGeometry();
  gridGeo.setAttribute("position", new THREE.Float32BufferAttribute(gridPts, 3));
  const grid = new THREE.LineSegments(gridGeo, lineMaterial(COLORS.blue, 0.16));
  scene.add(grid);

  // Road surface, edge lines and dashed lane dividers.
  const road = new THREE.Mesh(
    new THREE.PlaneGeometry(ROAD_HALF * 2 + 0.6, 260),
    new THREE.MeshBasicMaterial({ color: 0x060a1c })
  );
  road.rotation.x = -Math.PI / 2;
  road.position.set(0, 0.01, -90);
  scene.add(road);

  const edgeMat = new THREE.MeshBasicMaterial({ color: COLORS.cyan });
  [-ROAD_HALF, ROAD_HALF].forEach((x) => {
    const edge = new THREE.Mesh(new THREE.PlaneGeometry(0.14, 260), edgeMat);
    edge.rotation.x = -Math.PI / 2;
    edge.position.set(x, 0.02, -90);
    scene.add(edge);
  });

  const DASH_PERIOD = 6;
  const dashes = new THREE.Group();
  const dashGeo = new THREE.PlaneGeometry(0.12, 2.6);
  dashGeo.rotateX(-Math.PI / 2);
  const dashMat = new THREE.MeshBasicMaterial({ color: 0xa8b6d3, transparent: true, opacity: 0.55 });
  [-1.8, 1.8].forEach((x) => {
    for (let z = 24; z > -170; z -= DASH_PERIOD) {
      const dash = new THREE.Mesh(dashGeo, dashMat);
      dash.position.set(x, 0.02, z);
      dashes.add(dash);
    }
  });
  scene.add(dashes);

  // City blocks in two recycled tiles. Building boxes are kept for LiDAR hits.
  const TILE = 110;
  const tiles = [];
  const fillMat = new THREE.MeshBasicMaterial({ color: 0x0a1230, transparent: true, opacity: 0.9 });
  const windowMat = new THREE.PointsMaterial({ size: 0.22, color: COLORS.violet, transparent: true, opacity: 0.8 });
  for (let t = 0; t < 2; t += 1) {
    const tile = new THREE.Group();
    tile.position.z = -t * TILE;
    tile.userData.boxes = [];
    const edges = [];
    const windows = [];
    const solid = new THREE.InstancedMesh(new THREE.BoxGeometry(1, 1, 1), fillMat, 80);
    let count = 0;
    [-1, 1].forEach((side) => {
      let z = -rand(0, 4);
      while (z > -TILE + 6 && count < 80) {
        const w = rand(4, 9);
        const d = rand(5, 12);
        const h = Math.random() < 0.15 ? rand(22, 36) : rand(5, 18);
        const cx = side * (9.5 + w / 2 + rand(0, 5));
        const cz = z - d / 2;
        const matrix = new THREE.Matrix4().compose(
          new THREE.Vector3(cx, h / 2, cz),
          new THREE.Quaternion(),
          new THREE.Vector3(w, h, d)
        );
        solid.setMatrixAt(count, matrix);
        count += 1;
        boxEdges(cx, h / 2, cz, w, h, d, edges);
        tile.userData.boxes.push({ min: [cx - w / 2, 0, cz - d / 2], max: [cx + w / 2, h, cz + d / 2] });

        const faceX = cx - side * (w / 2 + 0.05);
        for (let wy = 2; wy < h - 1; wy += 1.6) {
          for (let wz = cz - d / 2 + 1; wz < cz + d / 2 - 0.5; wz += 1.4) {
            if (Math.random() < 0.28) windows.push(faceX, wy, wz);
          }
        }
        z -= d + rand(1.5, 6);
      }
    });
    solid.count = count;
    const edgeGeo = new THREE.BufferGeometry();
    edgeGeo.setAttribute("position", new THREE.Float32BufferAttribute(edges, 3));
    const winGeo = new THREE.BufferGeometry();
    winGeo.setAttribute("position", new THREE.Float32BufferAttribute(windows, 3));
    tile.add(solid, new THREE.LineSegments(edgeGeo, lineMaterial(COLORS.blue, 0.5)), new THREE.Points(winGeo, windowMat));
    scene.add(tile);
    tiles.push(tile);
  }

  // Ego vehicle with spinning LiDAR, headlight beams and underglow.
  const ego = makeCar(COLORS.cyan);
  const puck = edgedBox(0.5, 0.22, 0.5, 0x0e1a3a, COLORS.green);
  puck.position.set(0, 1.58, 0.25);
  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(0.34, 0.025, 6, 32),
    new THREE.MeshBasicMaterial({ color: COLORS.green })
  );
  ring.rotation.x = Math.PI / 2;
  ring.position.set(0, 1.6, 0.25);
  ego.add(puck, ring);

  const beamMat = new THREE.MeshBasicMaterial({
    color: COLORS.cyan,
    transparent: true,
    opacity: 0.07,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });
  [-0.65, 0.65].forEach((x) => {
    const beam = new THREE.Mesh(new THREE.ConeGeometry(2.2, 16, 24, 1, true), beamMat);
    beam.rotation.x = Math.PI / 2;
    beam.position.set(x, 0.65, -10.2);
    ego.add(beam);
    const lamp = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.1, 0.05), new THREE.MeshBasicMaterial({ color: 0xe8fbff }));
    lamp.position.set(x, 0.72, -2.22);
    ego.add(lamp);
  });

  const glow = new THREE.Mesh(
    new THREE.PlaneGeometry(6, 8),
    new THREE.MeshBasicMaterial({
      map: glowTexture("105, 230, 255"),
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    })
  );
  glow.rotation.x = -Math.PI / 2;
  glow.position.y = 0.03;
  ego.add(glow);
  scene.add(ego);

  // Tracked agents: cars in adjacent lanes and small robots on the sidewalks.
  const agents = [];
  const trackColor = "#65ffc8";
  for (let i = 0; i < (mobile ? 4 : 6); i += 1) {
    const group = makeCar(COLORS.blue);
    const bbox = new THREE.LineSegments(
      new THREE.EdgesGeometry(new THREE.BoxGeometry(2.3, 1.8, 4.9)),
      lineMaterial(COLORS.green, 0.95)
    );
    bbox.position.y = 0.9;
    const label = makeLabel(`car  0.${90 + Math.floor(Math.random() * 9)}  #${String(i + 1).padStart(2, "0")}`, trackColor);
    label.position.set(0, 2.45, 0);
    const predGeo = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0.05, -2.5), new THREE.Vector3(0, 0.05, -11)]);
    const pred = new THREE.Line(predGeo, lineMaterial(COLORS.violet, 0.75));
    group.add(bbox, label, pred);
    group.position.set(LANES[i % 3], 0, -20 - i * 16);
    scene.add(group);
    agents.push({ group, kind: "car", speed: rand(17, 25), half: [1.15, 0.9, 2.45] });
  }

  for (let i = 0; i < (mobile ? 2 : 4); i += 1) {
    const group = new THREE.Group();
    const bot = edgedBox(0.7, 0.55, 0.9, COLORS.body, COLORS.pink);
    bot.position.y = 0.42;
    const mast = edgedBox(0.08, 0.5, 0.08, COLORS.body, COLORS.pink);
    mast.position.set(0, 0.95, 0.3);
    const beacon = new THREE.Mesh(new THREE.SphereGeometry(0.09, 10, 10), new THREE.MeshBasicMaterial({ color: COLORS.pink }));
    beacon.position.set(0, 1.25, 0.3);
    const bbox = new THREE.LineSegments(
      new THREE.EdgesGeometry(new THREE.BoxGeometry(1.05, 1.45, 1.25)),
      lineMaterial(COLORS.pink, 0.9)
    );
    bbox.position.y = 0.72;
    const label = makeLabel(`robot  0.9${4 + i}`, "#ff7ad9");
    label.scale.set(2.1, 0.52, 1);
    label.position.set(0, 1.95, 0);
    group.add(bot, mast, beacon, bbox, label);
    const side = i % 2 ? 1 : -1;
    group.position.set(side * 7.3, 0, -14 - i * 22);
    group.rotation.y = side > 0 ? 0 : Math.PI;
    group.userData.beacon = beacon;
    scene.add(group);
    agents.push({ group, kind: "robot", speed: side > 0 ? 1.2 : -1.2, half: [0.5, 0.7, 0.6] });
  }

  // Survey drone flying ahead of the ego vehicle.
  const drone = new THREE.Group();
  drone.add(edgedBox(0.55, 0.14, 0.55, COLORS.body, COLORS.violet));
  const rotors = [];
  [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([x, z]) => {
    const arm = edgedBox(0.06, 0.04, 0.62, COLORS.body, COLORS.violet, 0.6);
    arm.position.set(x * 0.25, 0, z * 0.25);
    arm.rotation.y = Math.atan2(x, z);
    const rotor = new THREE.Mesh(
      new THREE.RingGeometry(0.16, 0.24, 20),
      new THREE.MeshBasicMaterial({ color: COLORS.violet, transparent: true, opacity: 0.55, side: THREE.DoubleSide })
    );
    rotor.rotation.x = -Math.PI / 2;
    rotor.position.set(x * 0.46, 0.08, z * 0.46);
    drone.add(arm, rotor);
    rotors.push(rotor);
  });
  const droneBox = new THREE.LineSegments(
    new THREE.EdgesGeometry(new THREE.BoxGeometry(1.35, 0.5, 1.35)),
    lineMaterial(COLORS.violet, 0.9)
  );
  const droneLabel = makeLabel("drone  0.96", "#bd7cff");
  droneLabel.scale.set(2.1, 0.52, 1);
  droneLabel.position.y = 0.75;
  drone.add(droneBox, droneLabel);
  scene.add(drone);

  // Planned trajectory ribbon with moving chevrons.
  const PATH_SEGS = 48;
  const PATH_LEN = 36;
  const pathPos = new Float32Array((PATH_SEGS + 1) * 2 * 3);
  const pathT = new Float32Array((PATH_SEGS + 1) * 2);
  const pathIndex = [];
  for (let i = 0; i <= PATH_SEGS; i += 1) {
    pathT[i * 2] = pathT[i * 2 + 1] = i / PATH_SEGS;
    if (i < PATH_SEGS) {
      const a = i * 2;
      pathIndex.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
    }
  }
  const pathGeo = new THREE.BufferGeometry();
  pathGeo.setAttribute("position", new THREE.BufferAttribute(pathPos, 3));
  pathGeo.setAttribute("t", new THREE.BufferAttribute(pathT, 1));
  pathGeo.setIndex(pathIndex);
  const pathMat = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide,
    uniforms: { time: { value: 0 } },
    vertexShader: `
      attribute float t;
      varying float vT;
      void main() {
        vT = t;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }`,
    fragmentShader: `
      uniform float time;
      varying float vT;
      void main() {
        float stripe = step(0.55, fract(vT * 16.0 - time * 1.6));
        vec3 col = mix(vec3(0.40, 1.0, 0.78), vec3(0.41, 0.90, 1.0), vT);
        float alpha = (1.0 - vT) * (0.16 + 0.42 * stripe);
        gl_FragColor = vec4(col, alpha);
      }`
  });
  const path = new THREE.Mesh(pathGeo, pathMat);
  scene.add(path);

  // LiDAR point cloud computed from rays against ground, buildings and agents.
  const AZ = mobile ? 160 : 300;
  const ELEV = [-24, -18, -14, -11, -8.5, -6.5, -5, -3.6, -2.2, -0.8, 0.6, 2.2, 4].map((d) => (d * Math.PI) / 180);
  const N = AZ * ELEV.length;
  const lidarPos = new Float32Array(N * 3);
  const lidarCol = new Float32Array(N * 3);
  const lidarAz = new Float32Array(N);
  const lidarDist = new Float32Array(N);
  const lidarGeo = new THREE.BufferGeometry();
  lidarGeo.setAttribute("position", new THREE.BufferAttribute(lidarPos, 3));
  lidarGeo.setAttribute("color", new THREE.BufferAttribute(lidarCol, 3));
  const lidar = new THREE.Points(
    lidarGeo,
    new THREE.PointsMaterial({
      size: mobile ? 0.2 : 0.15,
      vertexColors: true,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    })
  );
  scene.add(lidar);
  const near = new THREE.Color(COLORS.cyan);
  const mid = new THREE.Color(COLORS.violet);
  const far = new THREE.Color(COLORS.pink);
  const tmp = new THREE.Color();

  function rayBox(ox, oy, oz, dx, dy, dz, min, max) {
    let tmin = 0;
    let tmax = LIDAR_RANGE;
    const o = [ox, oy, oz];
    const d = [dx, dy, dz];
    for (let k = 0; k < 3; k += 1) {
      if (Math.abs(d[k]) < 1e-6) {
        if (o[k] < min[k] || o[k] > max[k]) return Infinity;
      } else {
        let t1 = (min[k] - o[k]) / d[k];
        let t2 = (max[k] - o[k]) / d[k];
        if (t1 > t2) [t1, t2] = [t2, t1];
        if (t1 > tmin) tmin = t1;
        if (t2 < tmax) tmax = t2;
        if (tmin > tmax) return Infinity;
      }
    }
    return tmin;
  }

  let pointCount = 0;
  function scanLidar() {
    const ox = ego.position.x;
    const oy = LIDAR_HEIGHT;
    const oz = ego.position.z + 0.25;
    const boxes = [];
    tiles.forEach((tile) => {
      tile.userData.boxes.forEach((b) => {
        const zMin = b.min[2] + tile.position.z;
        const zMax = b.max[2] + tile.position.z;
        if (zMax > oz - LIDAR_RANGE && zMin < oz + LIDAR_RANGE) {
          boxes.push({ min: [b.min[0], b.min[1], zMin], max: [b.max[0], b.max[1], zMax] });
        }
      });
    });
    agents.forEach((a) => {
      const p = a.group.position;
      if (Math.abs(p.z - oz) < LIDAR_RANGE) {
        boxes.push({
          min: [p.x - a.half[0], 0, p.z - a.half[2]],
          max: [p.x + a.half[0], a.half[1] * 2, p.z + a.half[2]]
        });
      }
    });

    let n = 0;
    for (let i = 0; i < AZ; i += 1) {
      const az = (i / AZ) * Math.PI * 2;
      const sx = Math.sin(az);
      const sz = -Math.cos(az);
      for (let e = 0; e < ELEV.length; e += 1) {
        const ce = Math.cos(ELEV[e]);
        const dx = sx * ce;
        const dy = Math.sin(ELEV[e]);
        const dz = sz * ce;
        let t = dy < 0 ? -oy / dy : Infinity;
        if (t < 2.6) continue;
        for (let b = 0; b < boxes.length; b += 1) {
          const hit = rayBox(ox, oy, oz, dx, dy, dz, boxes[b].min, boxes[b].max);
          if (hit < t) t = hit;
        }
        if (t > LIDAR_RANGE) continue;
        lidarPos[n * 3] = ox + dx * t;
        lidarPos[n * 3 + 1] = Math.max(0.04, oy + dy * t);
        lidarPos[n * 3 + 2] = oz + dz * t;
        lidarAz[n] = az;
        lidarDist[n] = t;
        n += 1;
      }
    }
    pointCount = n;
    lidarGeo.setDrawRange(0, n);
    lidarGeo.attributes.position.needsUpdate = true;
  }

  function colorLidar(sweep) {
    for (let i = 0; i < pointCount; i += 1) {
      const d = lidarDist[i] / LIDAR_RANGE;
      if (d < 0.5) tmp.copy(near).lerp(mid, d * 2);
      else tmp.copy(mid).lerp(far, (d - 0.5) * 2);
      let behind = sweep - lidarAz[i];
      behind = ((behind % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
      const k = 0.22 + 0.78 * Math.exp(-behind * 1.6);
      lidarCol[i * 3] = tmp.r * k;
      lidarCol[i * 3 + 1] = tmp.g * k;
      lidarCol[i * 3 + 2] = tmp.b * k;
    }
    lidarGeo.attributes.color.needsUpdate = true;
  }

  // Simple planner: pick a lane with clearance every few seconds.
  let egoLane = 1;
  let nextPlan = 4;
  function laneClear(lane) {
    return agents.every((a) => a.kind !== "car" || Math.abs(a.group.position.x - LANES[lane]) > 1 || a.group.position.z > 10 || a.group.position.z < -30);
  }
  function plan(time) {
    if (time < nextPlan) return;
    nextPlan = time + rand(5, 9);
    const options = [egoLane - 1, egoLane + 1].filter((l) => l >= 0 && l < LANES.length && laneClear(l));
    if (options.length) egoLane = options[Math.floor(Math.random() * options.length)];
  }

  function updatePath(targetX) {
    const egoX = ego.position.x;
    for (let i = 0; i <= PATH_SEGS; i += 1) {
      const s = i / PATH_SEGS;
      const z = -2.4 - s * PATH_LEN;
      const x = egoX + (targetX - egoX) * smoothstep(0, 0.55, s);
      const xn = egoX + (targetX - egoX) * smoothstep(0, 0.55, s + 0.02);
      const angle = Math.atan2(xn - x, 0.02 * PATH_LEN);
      const half = 0.85 * (1 - s * 0.35);
      const nx = Math.cos(angle) * half;
      const nz = Math.sin(angle) * half;
      pathPos.set([x - nx, 0.04, z - nz, x + nx, 0.04, z + nz], i * 6);
    }
    pathGeo.attributes.position.needsUpdate = true;
  }

  // Camera rig: chase view at the top of the page, bird's-eye view after scrolling.
  const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
  if (!reduce) {
    window.addEventListener("pointermove", (event) => {
      pointer.tx = event.clientX / window.innerWidth - 0.5;
      pointer.ty = event.clientY / window.innerHeight - 0.5;
    }, { passive: true });
  }
  const camPos = new THREE.Vector3();
  const camLook = new THREE.Vector3();
  const chasePos = new THREE.Vector3();
  const chaseLook = new THREE.Vector3();
  const bevPos = new THREE.Vector3();
  const bevLook = new THREE.Vector3();

  function scrollProgress() {
    if (reduce) return 0;
    return smoothstep(0, 1, window.scrollY / (window.innerHeight * 1.15));
  }

  function placeCamera(time) {
    const p = scrollProgress();
    const ex = ego.position.x;
    const wide = camera.aspect < 1 ? 1.35 : 1;
    pointer.x += (pointer.tx - pointer.x) * 0.05;
    pointer.y += (pointer.ty - pointer.y) * 0.05;
    chasePos.set(ex * 0.55 + pointer.x * 2.4 + Math.sin(time * 0.3) * 0.4, 3.3 * wide - pointer.y * 1.2, 9.5 * wide);
    chaseLook.set(ex * 0.8 + pointer.x * 1.2, 0.9, -12);
    bevPos.set(ex * 0.3 + pointer.x * 3, 44 * wide, 9 + Math.sin(time * 0.15) * 2);
    bevLook.set(ex * 0.3, 0, -8);
    camPos.lerpVectors(chasePos, bevPos, p);
    camLook.lerpVectors(chaseLook, bevLook, p);
    camera.position.copy(camPos);
    camera.lookAt(camLook);
    canvas.style.opacity = String(1 - 0.5 * p);
    return p;
  }

  // HUD telemetry in the hero.
  const hud = {
    speed: document.getElementById("hud-speed"),
    steer: document.getElementById("hud-steer"),
    pts: document.getElementById("hud-pts"),
    obj: document.getElementById("hud-obj"),
    view: document.getElementById("hud-view")
  };
  let lastHud = 0;
  function updateHud(time, speed, steer, p) {
    if (time - lastHud < 0.2 || !hud.speed) return;
    lastHud = time;
    hud.speed.textContent = String(Math.round(speed * 3.6));
    hud.steer.textContent = (steer >= 0 ? "+" : "") + steer.toFixed(1);
    hud.pts.textContent = pointCount.toLocaleString("en-US");
    const tracked = agents.filter((a) => Math.abs(a.group.position.z) < LIDAR_RANGE).length + 1;
    hud.obj.textContent = String(tracked);
    hud.view.textContent = p > 0.5 ? "BEV" : "CHASE";
  }

  function resize() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    // On wide screens, frame the ego car in the open lower-right area below the portrait card.
    if (w / h > 1.25 && w > 1080) camera.setViewOffset(w, h, -w * 0.2, -h * 0.13, w, h);
    else camera.clearViewOffset();
    camera.updateProjectionMatrix();
  }

  let dist = 0;
  let frame = 0;
  let last = performance.now();
  let speed = 22;

  function step(dt, time) {
    speed = 22 + Math.sin(time * 0.21) * 2.2;
    dist += speed * dt;
    grid.position.z = dist % GRID_STEP;
    dashes.position.z = dist % DASH_PERIOD;
    tiles.forEach((tile) => {
      tile.position.z += speed * dt;
      if (tile.position.z - TILE > 14) tile.position.z -= TILE * tiles.length;
    });

    plan(time);
    const targetX = LANES[egoLane];
    const prevX = ego.position.x;
    ego.position.x += (targetX - ego.position.x) * (1 - Math.exp(-dt * 1.1));
    const steer = (ego.position.x - prevX) / Math.max(dt, 1e-3);
    ego.rotation.y = -steer * 0.05;
    ring.rotation.z = time * 9;

    agents.forEach((a) => {
      const g = a.group;
      if (a.kind === "car") {
        const sameLane = Math.abs(g.position.x - ego.position.x) < 1.9 || Math.abs(g.position.x - targetX) < 1;
        if (sameLane && g.position.z < 0 && g.position.z > -18) a.speed = Math.max(a.speed, speed + 2);
        if (sameLane && g.position.z >= 0 && g.position.z < 12) a.speed = Math.min(a.speed, speed - 2);
        g.position.z += (speed - a.speed) * dt;
        if (g.position.z > 26 || g.position.z < -120) {
          g.position.z = g.position.z > 26 ? rand(-110, -80) : 22;
          a.speed = rand(17, 25);
          const free = LANES.filter((x) => agents.every((o) => o === a || o.kind !== "car" || Math.abs(o.group.position.x - x) > 1 || Math.abs(o.group.position.z - g.position.z) > 12));
          g.position.x = free.length ? free[Math.floor(Math.random() * free.length)] : LANES[0];
        }
      } else {
        g.position.z += (speed - a.speed) * dt;
        g.userData.beacon.visible = Math.sin(time * 6 + g.position.x) > -0.2;
        if (g.position.z > 24) g.position.z -= rand(110, 130);
      }
    });

    drone.position.set(Math.sin(time * 0.35) * 4.5, 5.2 + Math.sin(time * 1.3) * 0.35, -15 + Math.sin(time * 0.22) * 6);
    drone.rotation.z = -Math.cos(time * 0.35) * 0.18;
    rotors.forEach((r, i) => { r.rotation.z = time * (i % 2 ? 30 : -30); });

    updatePath(targetX);
    pathMat.uniforms.time.value = time;
    if (frame % 2 === 0) scanLidar();
    colorLidar((time * Math.PI * 2 * 0.7) % (Math.PI * 2));
    return (-steer * 6);
  }

  function render(now) {
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    frame += 1;
    const time = now / 1000;
    const deep = window.scrollY > window.innerHeight * 2.4;
    if (!deep || frame % 2 === 0) {
      const steer = step(deep ? dt * 2 : dt, time);
      const p = placeCamera(time);
      renderer.render(scene, camera);
      updateHud(time, speed, steer, p);
    }
    requestAnimationFrame(render);
  }

  resize();
  window.addEventListener("resize", () => {
    resize();
    if (reduce) renderStatic();
  });

  function renderStatic() {
    placeCamera(0);
    renderer.render(scene, camera);
    updateHud(1, speed, 0, 0);
  }

  if (reduce) {
    step(0.016, 0);
    scanLidar();
    colorLidar(0);
    renderStatic();
  } else {
    requestAnimationFrame(render);
  }
}
