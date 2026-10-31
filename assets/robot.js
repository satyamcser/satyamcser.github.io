// Interactive 3D robot arm for the Robotics section. The end effector follows the pointer
// using analytic inverse kinematics; without a pointer it traces a pick-and-place path.
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js";

const canvas = document.getElementById("robot-3d");
const stage = canvas && canvas.parentElement;
const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

let renderer = null;
if (canvas) {
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  } catch (error) {
    renderer = null;
  }
}


const C = {
  cyan: 0x69e6ff,
  violet: 0xbd7cff,
  green: 0x65ffc8,
  pink: 0xff7ad9,
  body: 0x0b1430
};

function edged(geo, edge, fill = C.body) {
  const group = new THREE.Group();
  group.add(new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ color: fill })));
  group.add(new THREE.LineSegments(
    new THREE.EdgesGeometry(geo, 25),
    new THREE.LineBasicMaterial({ color: edge, transparent: true, opacity: 0.95 })
  ));
  return group;
}

function joint(radius, color) {
  const geo = new THREE.CylinderGeometry(radius, radius, radius * 1.5, 20);
  geo.rotateZ(Math.PI / 2);
  return edged(geo, color);
}

function start() {
  stage.classList.add("has-robot");

  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0x050816, 9, 18);
  const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 50);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
  renderer.setClearColor(0x050816, 0);

  // Workspace floor: polar grid and reach circle.
  const floor = new THREE.Group();
  const polar = new THREE.PolarGridHelper(3.4, 12, 6, 64, C.cyan, C.cyan);
  polar.material.transparent = true;
  polar.material.opacity = 0.18;
  floor.add(polar);
  const reach = new THREE.Mesh(
    new THREE.RingGeometry(2.72, 2.76, 96),
    new THREE.MeshBasicMaterial({ color: C.violet, transparent: true, opacity: 0.6, side: THREE.DoubleSide })
  );
  reach.rotation.x = -Math.PI / 2;
  reach.position.y = 0.005;
  floor.add(reach);
  scene.add(floor);

  // Parts on the floor for the arm to "pick".
  const parts = [];
  [[1.9, 0.9, C.green], [-1.4, 1.7, C.pink], [0.4, -2.1, C.cyan]].forEach(([x, z, color]) => {
    const part = edged(new THREE.BoxGeometry(0.34, 0.34, 0.34), color);
    part.position.set(x, 0.17, z);
    scene.add(part);
    parts.push(part);
  });

  // Arm kinematic chain: base yaw -> shoulder -> elbow -> wrist -> gripper.
  const H = 0.95;
  const L1 = 1.55;
  const L2 = 1.3;
  const L3 = 0.5;

  const base = new THREE.Group();
  const plinth = edged(new THREE.CylinderGeometry(0.62, 0.72, 0.3, 32), C.cyan);
  plinth.position.y = 0.15;
  const turret = edged(new THREE.CylinderGeometry(0.42, 0.48, H - 0.3, 24), C.cyan);
  turret.position.y = 0.3 + (H - 0.3) / 2;
  scene.add(plinth);
  base.add(turret);
  scene.add(base);

  const shoulder = new THREE.Group();
  shoulder.position.y = H;
  shoulder.add(joint(0.3, C.green));
  const link1 = edged(new THREE.BoxGeometry(0.26, L1, 0.3), C.cyan);
  link1.position.y = L1 / 2;
  shoulder.add(link1);
  base.add(shoulder);

  const elbow = new THREE.Group();
  elbow.position.y = L1;
  elbow.add(joint(0.24, C.green));
  const link2 = edged(new THREE.BoxGeometry(0.2, L2, 0.24), C.cyan);
  link2.position.y = L2 / 2;
  elbow.add(link2);
  shoulder.add(elbow);

  const wrist = new THREE.Group();
  wrist.position.y = L2;
  wrist.add(joint(0.17, C.green));
  const palm = edged(new THREE.BoxGeometry(0.42, 0.14, 0.2), C.violet);
  palm.position.y = 0.2;
  wrist.add(palm);
  const fingers = [-1, 1].map((side) => {
    const finger = edged(new THREE.BoxGeometry(0.06, 0.3, 0.14), C.violet);
    finger.position.set(side * 0.14, 0.38, 0);
    wrist.add(finger);
    return finger;
  });
  const tool = new THREE.Mesh(new THREE.SphereGeometry(0.05, 12, 12), new THREE.MeshBasicMaterial({ color: C.pink }));
  tool.position.y = L3;
  wrist.add(tool);
  elbow.add(wrist);

  // Target marker and end-effector trail.
  const target = new THREE.Group();
  const targetRing = new THREE.Mesh(
    new THREE.RingGeometry(0.16, 0.2, 40),
    new THREE.MeshBasicMaterial({ color: C.pink, side: THREE.DoubleSide, transparent: true, opacity: 0.9 })
  );
  targetRing.rotation.x = -Math.PI / 2;
  target.add(targetRing);
  const drop = new THREE.Line(
    new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 3, 0)]),
    new THREE.LineDashedMaterial({ color: C.pink, dashSize: 0.08, gapSize: 0.08, transparent: true, opacity: 0.6 })
  );
  drop.computeLineDistances();
  target.add(drop);
  scene.add(target);

  const TRAIL = 90;
  const trailPos = new Float32Array(TRAIL * 3);
  const trailGeo = new THREE.BufferGeometry();
  trailGeo.setAttribute("position", new THREE.BufferAttribute(trailPos, 3));
  const trail = new THREE.Line(trailGeo, new THREE.LineBasicMaterial({ color: C.pink, transparent: true, opacity: 0.55 }));
  scene.add(trail);
  let trailFilled = false;

  // Pointer -> floor target.
  const raycaster = new THREE.Raycaster();
  const ndc = new THREE.Vector2();
  const ground = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
  const hit = new THREE.Vector3();
  const goal = new THREE.Vector3(1.6, 0.3, 1.2);
  const aim = goal.clone();
  let pointerActive = false;
  let lastPointer = 0;

  function onPointer(event) {
    const rect = canvas.getBoundingClientRect();
    ndc.set(((event.clientX - rect.left) / rect.width) * 2 - 1, -((event.clientY - rect.top) / rect.height) * 2 + 1);
    raycaster.setFromCamera(ndc, camera);
    if (raycaster.ray.intersectPlane(ground, hit)) {
      pointerActive = true;
      lastPointer = performance.now();
      goal.set(hit.x, 0.3, hit.z);
    }
  }
  if (!reduce) {
    stage.addEventListener("pointermove", onPointer);
    stage.addEventListener("pointerdown", onPointer);
    stage.addEventListener("pointerleave", () => { pointerActive = false; });
  }

  const readout = {
    j1: document.getElementById("robot-j1"),
    j2: document.getElementById("robot-j2"),
    j3: document.getElementById("robot-j3"),
    grip: document.getElementById("robot-grip")
  };
  const deg = (r) => `${(r * 180 / Math.PI).toFixed(0)}°`;

  function solve(time) {
    // Keep the goal inside the reachable annulus.
    const r0 = Math.hypot(goal.x, goal.z);
    const r = Math.min(2.7, Math.max(0.9, r0 || 1));
    const scale = r0 ? r / r0 : 1;
    aim.lerp(new THREE.Vector3(goal.x * scale, goal.y, goal.z * scale), reduce ? 1 : 0.08);

    const yaw = Math.atan2(aim.x, aim.z);
    const reachR = Math.hypot(aim.x, aim.z);
    const h = aim.y + L3 - H;
    const d = Math.min(L1 + L2 - 0.02, Math.max(Math.abs(L1 - L2) + 0.02, Math.hypot(reachR, h)));
    const alpha = Math.atan2(reachR, h);
    const beta = Math.acos((L1 * L1 + d * d - L2 * L2) / (2 * L1 * d));
    const t1 = alpha - beta;
    const t2 = Math.PI - Math.acos((L1 * L1 + L2 * L2 - d * d) / (2 * L1 * L2));
    const t3 = Math.PI - t1 - t2;

    base.rotation.y = yaw;
    shoulder.rotation.x = t1;
    elbow.rotation.x = t2;
    wrist.rotation.x = t3;

    const grip = 0.5 + 0.5 * Math.sin(time * 2.2);
    fingers[0].position.x = -0.08 - grip * 0.08;
    fingers[1].position.x = 0.08 + grip * 0.08;

    target.position.set(aim.x, 0.01, aim.z);
    targetRing.scale.setScalar(1 + 0.15 * Math.sin(time * 4));

    if (readout.j1) {
      readout.j1.textContent = deg(yaw);
      readout.j2.textContent = deg(t1);
      readout.j3.textContent = deg(t2);
      readout.grip.textContent = `${Math.round(grip * 100)}%`;
    }
  }

  const toolWorld = new THREE.Vector3();
  function updateTrail() {
    tool.getWorldPosition(toolWorld);
    if (!trailFilled) {
      for (let i = 0; i < TRAIL; i += 1) trailPos.set([toolWorld.x, toolWorld.y, toolWorld.z], i * 3);
      trailFilled = true;
    }
    trailPos.copyWithin(0, 3);
    trailPos.set([toolWorld.x, toolWorld.y, toolWorld.z], (TRAIL - 1) * 3);
    trailGeo.attributes.position.needsUpdate = true;
  }

  function autoGoal(time) {
    // Visit each part in turn, lifting between them.
    const n = parts.length;
    const phase = (time / 3.2) % n;
    const i = Math.floor(phase);
    const f = phase - i;
    const a = parts[i].position;
    const b = parts[(i + 1) % n].position;
    const s = f * f * (3 - 2 * f);
    goal.set(a.x + (b.x - a.x) * s, 0.4 + Math.sin(s * Math.PI) * 1.1, a.z + (b.z - a.z) * s);
  }

  function resize() {
    const w = stage.clientWidth;
    const h = stage.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    const dist = camera.aspect < 0.9 ? 8.6 : 7.3;
    camera.position.set(dist * 0.62, dist * 0.5, dist * 0.6);
    camera.lookAt(0, 1.2, 0);
    camera.updateProjectionMatrix();
  }

  let visible = false;
  let running = false;
  function render(now) {
    const time = now / 1000;
    if (!pointerActive || now - lastPointer > 2500) autoGoal(time);
    solve(time);
    updateTrail();
    floor.rotation.y = time * 0.05;
    parts.forEach((p, i) => { p.rotation.y = time * 0.6 + i; });
    renderer.render(scene, camera);
    if (visible) requestAnimationFrame(render);
    else running = false;
  }

  function kick() {
    if (running || reduce) return;
    running = true;
    requestAnimationFrame(render);
  }

  resize();
  window.addEventListener("resize", () => {
    resize();
    if (reduce) renderStill();
  });

  function renderStill() {
    autoGoal(1.2);
    solve(1.2);
    updateTrail();
    renderer.render(scene, camera);
  }

  if (reduce) {
    renderStill();
  } else if ("IntersectionObserver" in window) {
    new IntersectionObserver((entries) => {
      visible = entries[0].isIntersecting;
      if (visible) kick();
    }).observe(stage);
  } else {
    visible = true;
    kick();
  }
}

if (renderer) start();
