const fullPublications = [
  {
    title: "Automated Robot (Car) using Artificial Intelligence",
    authors: "S. Mishra, C. S. Minh, H. T. Chuc, T. V. Long, T. T. Nguyen",
    venue: "2021 International Seminar on Machine Learning, Optimization, and Data Science",
    year: "2022",
    citations: "28",
    note: "First author"
  },
  {
    title: "SATMeas - Object Detection and Measurement: Canny Edge Detection Algorithm",
    authors: "L. T. T. Satyam Mishra",
    venue: "Artificial Intelligence and Mobile Services, AIMS 2022, LNCS",
    year: "2022",
    citations: "25",
    note: "SJR Q2"
  },
  {
    title: "Using Security Metrics to Determine Security Program Effectiveness",
    authors: "S. Mishra, P. T. Vi, V. M. Phuc, O. Damilola",
    venue: "Human Factors in Cybersecurity",
    year: "2022",
    citations: "12",
    note: "First author"
  },
  {
    title: "Lightweight Authentication Encryption to Improve DTLS, Quark Combined with Overhearing to Prevent DoS and MITM on Low-Resource IoT Devices",
    authors: "N. V. Tanh, Satyam Mishra, V. M. Phuc",
    venue: "Internet of Things, ICIOT 2022, LNCS 13735, 108-122",
    year: "2023",
    citations: "11",
    note: "First author"
  },
  {
    title: "Integrating State-of-the-Art Face Recognition and Anti-Spoofing Techniques into Enterprise Information Systems",
    authors: "S. Mishra, N. T. B. Thuy, C. D. Truong",
    venue: "Artificial Intelligence and Mobile Services, AIMS 2023, 14202, 71-84",
    year: "2023",
    citations: "9",
    note: "First author"
  },
  {
    title: "KAN-PDEs: A Novel Approach to Solving Partial Differential Equations Using Kolmogorov-Arnold Networks, Enhanced Accuracy and Efficiency",
    authors: "S. Yeo, P. A. Nguyen, A. N. Le, S. Mishra",
    venue: "International Conference on Electrical and Electronics Engineering, 43-62",
    year: "2024",
    citations: "8",
    note: ""
  },
  {
    title: "User Interface Design and Usability in Information Systems",
    authors: "N. V. Tanh, Phung Thao Vi, Satyam Mishra",
    venue: "Creative Approaches Towards Development of Computing and Multidisciplinary IT Solutions",
    year: "2024",
    citations: "8",
    note: ""
  },
  {
    title: "Mitigating the Threat of Multi-Factor Authentication Bypass Through Man-in-the-Middle Attacks Using EvilGinx2",
    authors: "S. Mishra, S. Mishra, Y. C. Toh, S. Mishra, P. T. Vi",
    venue: "Creative Approaches Towards Development of Computing and Multidisciplinary IT Solutions",
    year: "2024",
    citations: "7",
    note: ""
  },
  {
    title: "VIS-NLP: Vaccination Inventory System for Justified User Using Natural Language Processing",
    authors: "V. M. Phuc, S. Mishra, O. D. Igbagbo, L. T. Thanh",
    venue: "Conference publication",
    year: "2023",
    citations: "7",
    note: ""
  },
  {
    title: "BNIS-Bot Node Isolation Strategy to Prevent DoS Attacks: An Improved Overhearing Solution",
    authors: "S. Mishra, N. Van Tanh, V. M. Phuc, O. D. Igbagbo",
    venue: "6th International Conference on Computer Applications and Information Processing Technology",
    year: "2023",
    citations: "6",
    note: "First author"
  },
  {
    title: "Immersive Virtual Painting: Pushing Boundaries in Real-Time Computer Vision using OpenCV with C++",
    authors: "S. Mishra, V. D. Trung, Le Anh Ngoc, P. T. Vi, S. Mishra",
    venue: "RICE, 41-50",
    year: "2023",
    citations: "4",
    note: "SJR Q1 · First author"
  },
  {
    title: "Advancing Online Education: An Artificial Intelligence Applied System for Monitoring and Improving Employee Engagement in Enterprise Information Systems",
    authors: "N. T. Son, T. T. Hoang, S. Mishra, N. T. B. Thuy, T. H. Tam, C. D. Truong",
    venue: "International Conference on Nature of Computation and Communication, 3-18",
    year: "2023",
    citations: "3",
    note: ""
  },
  {
    title: "DICKT: Deep Learning-Based Image Captioning using Keras and TensorFlow",
    authors: "P. T. Vi, S. Mishra, Le Anh Ngoc, S. Mishra, V. M. Phuc",
    venue: "RICE, 105-110",
    year: "2023",
    citations: "2",
    note: "SJR Q1"
  },
  {
    title: "MACCHIEF: Machine Learning-Based Algorithm Classification for Complaint Handling and Improved Efficiency in Firms",
    authors: "V. D. Trung, Y. C. Toh, S. Mishra, Le Anh Ngoc, P. T. Vi",
    venue: "RICE, 99-103",
    year: "2023",
    citations: "2",
    note: "SJR Q1"
  },
  {
    title: "SafeRL-Lite: A Lightweight, Explainable, and Constrained Reinforcement Learning Library",
    authors: "S. Mishra, P. T. Vi, S. Mishra, V. Bijalwan, V. B. Semwal, A. M. Khan",
    venue: "arXiv preprint arXiv:2506.17297",
    year: "2025",
    citations: "1",
    note: "First author · Open-source library"
  },
  {
    title: "STEDSDR: Simulated Testing and Evaluation of Drone Surveillance for Disaster Response",
    authors: "Y. C. Toh, P. A. Nguyen, S. Mishra, V. D. Trung, P. T. Vi, L. A. Ngoc",
    venue: "Unmanned Aircraft Systems, 225-261",
    year: "2024",
    citations: "1",
    note: ""
  },
  {
    title: "Debugging Human Pose Estimation with Explainable AI",
    authors: "M. Satyam, N. Le Anh",
    venue: "Proceedings of the International Conference on Intelligent Systems and Data Science",
    year: "2024",
    citations: "1",
    note: "First author"
  },
  {
    title: "Efficient Face Mask Detection for Banking Information Systems",
    authors: "C. D. Truong, S. Mishra, N. Q. Long, L. A. Ngoc",
    venue: "Creative Approaches Towards Development of Computing and Multidisciplinary IT Solutions",
    year: "2024",
    citations: "1",
    note: ""
  },
  {
    title: "Understanding the Impact and Implications of Emagnet and Pastebin in Cybersecurity",
    authors: "S. Mishra, S. Mishra, S. Mishra, P. T. Vi, Y. C. Toh",
    venue: "Creative Approaches Towards Development of Computing and Multidisciplinary IT Solutions",
    year: "2024",
    citations: "1",
    note: ""
  },
  {
    title: "Detecting Stroke in Human Beings Using Machine Learning",
    authors: "O. D. Igbagbo, S. Mishra, V. M. Phuc, L. Trung, P. H. Y. Thanh",
    venue: "Health Informatics and Biomedical Engineering Applications 78, 95",
    year: "2023",
    citations: "1",
    note: ""
  },
  {
    title: "Attention Is a Functor: Enforcing Categorical Structure in Transformers",
    authors: "H. Kim, S. Mishra, T. D. Tan, V. Bijalwan",
    venue: "Lecture Notes in Networks and Systems, 24-33",
    year: "2026",
    citations: "",
    note: "SJR Q4"
  },
  {
    title: "Neuro-Symbolic Attention Modulation in Biomedical QA via Signal Algebra-Augmented LLMs",
    authors: "H. Y. Sohn, S. Mishra, V. Bijalwan",
    venue: "Lecture Notes in Networks and Systems, 116-125",
    year: "2026",
    citations: "",
    note: "SJR Q4"
  },
  {
    title: "NeuralDMD vs Transformers: A Spectral Benchmark for Economic Signal Forecasting",
    authors: "G. Bach, S. Mishra, T. D. Tan, V. Bijalwan",
    venue: "Lecture Notes in Networks and Systems, 457-466",
    year: "2026",
    citations: "",
    note: "SJR Q4"
  },
  {
    title: "AeroSenseNet: When Physics Meets Transformers for Predicting Aircraft Maneuvers from Jet Engine Sensors",
    authors: "S. J. Cho, S. Mishra, V. Bijalwan, A. Bijalwan",
    venue: "Lecture Notes in Networks and Systems 1831, 214-223",
    year: "2026",
    citations: "",
    note: "SJR Q4"
  },
  {
    title: "EDL-HJAE: An Ensemble Deep Learning Framework for Multimodal Gait Analysis and Hip Joint Asymmetry Evaluation",
    authors: "A. M. Bijalwan, V. Bijalwan, S. Mishra, A. M. Khan",
    venue: "Multimedia Tools and Applications",
    year: "2026",
    citations: "",
    note: "SJR Q1 · Second author"
  },
  {
    title: "Koopman Spectral Dynamics for Interpretable and Predictive Semantic Drift in Language Models",
    authors: "S. Mishra, V. Phung, P. Vu, S. Mishra, S. Mishra, V. Bijalwan, T. D. Tan",
    venue: "International Conference on Data Mining, ICDM 2025, 605-612",
    year: "2025",
    citations: "",
    note: "First author"
  },
  {
    title: "Exploring the Temporal Dynamics and Causal Interactions Between the Amygdala and vmPFC",
    authors: "W. Su, S. Mishra, A. Bijalwan",
    venue: "Biomedical Informatics and Smart Healthcare 1(1), 27-34",
    year: "2025",
    citations: "",
    note: ""
  },
  {
    title: "Context-Controlled Question Generation for Adaptive Learning",
    authors: "T. V. Phung, S. Mishra, V. Bijalwan, T. Duc-Tan, S. Mishra",
    venue: "2025 International Conference on Electronics, AI and Computing, EAIC, 1-6",
    year: "2025",
    citations: "",
    note: "Second author · Best Paper Award"
  },
  {
    title: "AVFD: Autonomous Vision-Based Fleet Management for Drone Delivery Optimization in E-Commerce",
    authors: "V. D. Trung, P. A. Nguyen, T. Y. Chi, P. T. Vi, S. Mishra, L. A. Ngoc",
    venue: "Unmanned Aircraft Systems, 181-223",
    year: "2024",
    citations: "",
    note: ""
  },
  {
    title: "Intelligence Applied System for Monitoring and Improving Employee Engagement in Enterprise Information Systems",
    authors: "N. T. Son, T. T. Hoang, S. Mishra",
    venue: "Nature of Computation and Communication, 3",
    year: "2024",
    citations: "",
    note: ""
  },
  {
    title: "PBC-ML: Predicting Breast Cancer in Humans using Machine Learning Approach",
    authors: "D. Oni, S. Mishra, V. M. Phuc, L. Nguyen",
    venue: "Health Informatics and Biomedical Engineering Applications 78",
    year: "2023",
    citations: "",
    note: ""
  },
  {
    title: "LSTM Network-Based Accurate Greenhouse Temperature Forecasting through Privacy-Preserving Federated Learning",
    authors: "P. A. Nguyen, T. Ha, S. Mishra, L. T. Kien, A. N. Le, D. H. Kim",
    venue: "Human-centric Computing and Information Sciences, 16, 1-35",
    year: "2026",
    citations: "",
    note: "SJR Q2"
  }
];

const preprints = [
  {
    title: "C3QG++: Context-Controlled, Explainable, and Efficient Question Generation with Transformers",
    authors: "S. Mishra and collaborators",
    venue: "Under review, Applied Intelligence",
    year: "Manuscript",
    note: "First author"
  },
  {
    title: "One-Shot Human Motion Synthesis via Koopman Neural Operators: A Physics-Guided, Contrastive Learning Framework",
    authors: "S. Mishra and collaborators",
    venue: "Under review",
    year: "Manuscript",
    note: ""
  },
  {
    title: "SpectralONN: Phase-Aware Functional Operator Networks for Interpretable Frequency-Domain Learning",
    authors: "S. Mishra and collaborators",
    venue: "Under review",
    year: "Manuscript",
    note: ""
  },
  {
    title: "KoopFall: Koopman + LSTM Hybrid for Fall Detection from Multimodal Sensor Data",
    authors: "S. Mishra and collaborators",
    venue: "Under review",
    year: "Manuscript",
    note: ""
  },
  {
    title: "Sparse Is Smart: Efficient 3D Point Cloud Transformers Without Positional Encoding",
    authors: "S. Mishra and collaborators",
    venue: "Under review, Information Fusion",
    year: "Manuscript",
    note: "First author"
  },
  {
    title: "Spectral Drift Reveals Hallucination: Unsupervised Quantum-Inspired Signals in LLMs",
    authors: "S. Mishra and collaborators",
    venue: "Ongoing manuscript",
    year: "Manuscript",
    note: "First author"
  },
  {
    title: "Obey the Automaton: Learning Grammar-Constrained Generation with Soft RL",
    authors: "S. Mishra and collaborators",
    venue: "Ongoing manuscript",
    year: "Manuscript",
    note: "First author"
  },
  {
    title: "Latents Don’t Lie: Measuring Semantic Entropy for Better Alignment in Language Models",
    authors: "S. Mishra and collaborators",
    venue: "Ongoing manuscript",
    year: "Manuscript",
    note: "First author"
  },
  {
    title: "Strika: Triple-Term Contrastive Learning with Selective State Spaces for Fast and Interpretable Text Dynamics",
    authors: "S. Mishra and collaborators",
    venue: "Ongoing manuscript",
    year: "Manuscript",
    note: "Second author"
  },
  {
    title: "Symbolic Alignment via Deterministic Automata: Safety Guarantees and Oversight for Reinforcement Learning Agents",
    authors: "S. Mishra and collaborators",
    venue: "Ongoing manuscript",
    year: "Manuscript",
    note: "First author"
  },
  {
    title: "Entropy-Guided Koopman Belief Forecasting and Symbolic Policy Classification in POMDPs",
    authors: "S. Mishra and collaborators",
    venue: "Ongoing manuscript",
    year: "Manuscript",
    note: "First author"
  },
  {
    title: "SCOF: A Causal Oversight Framework for Proactive AI Agent Safety Across Unified Benchmarks",
    authors: "S. Mishra and collaborators",
    venue: "Ongoing manuscript",
    year: "Manuscript",
    note: "Second author"
  },
  {
    title: "Keeping Language Models Aligned Under Domain Drift with Entropy-Guided Adaptive Fine-Tuning",
    authors: "S. Mishra and collaborators",
    venue: "Ongoing manuscript",
    year: "Manuscript",
    note: "Second author"
  },
  {
    title: "Teaching Data to Speak the Same Language: Mutual Information-Driven Augmentations for Robust Learning",
    authors: "S. Mishra and collaborators",
    venue: "Ongoing manuscript",
    year: "Manuscript",
    note: "Second author"
  },
  {
    title: "KoopMO for One-Shot Robotic Motion Planning",
    authors: "S. Mishra and collaborators",
    venue: "Ongoing research, target: TRO",
    year: "Research",
    note: "Koopman neural operator-based motion planning"
  },
  {
    title: "Chebyshev Attention Mechanism for Transformers",
    authors: "S. Mishra and collaborators",
    venue: "Ongoing research, target: NeurIPS",
    year: "Research",
    note: "Chebyshev distance-based attention"
  }
];

const books = [
  {
    title: "AI Meets Pure Math: Issue #1",
    status: "Live on Amazon",
    description: "A learning resource exploring connections between pure mathematics and artificial intelligence, including Koopman operators in NLP."
  },
  {
    title: "Mathematics for Robotics: Learn All the Math You Need to Excel in Robotics",
    status: "Live on Amazon",
    description: "A math-focused robotics guide covering the foundations required to reason about robot motion, control, and perception."
  },
  {
    title: "Learning to Learn: Reinforcement Learning Explained for Humans",
    status: "Live on Amazon",
    description: "An accessible reinforcement learning book designed to explain decision-making, rewards, policies, and learning behavior."
  }
];

const patents = [
  {
    title: "System and Method for Modeling Semantic Drift in Language Models using Koopman Operators",
    status: "Published in Indian IPR · Examination Stage",
    description: "A dynamical systems-based framework to track, model, and mitigate semantic drift in language models using Koopman spectral operators."
  },
  {
    title: "SpectralONN: System and Method for Spectral-Domain Learning in Neural Networks using Functional Operator Theory",
    status: "Published in Indian IPR · Examination Stage",
    description: "A neural network framework operating in the spectral domain with Fourier and Chebyshev bases for interpretable, phase-aware learning."
  },
  {
    title: "C3QG: System and Method for Confidence-Calibrated Question Generation using Conformal and Contrastive Learning",
    status: "Published in Indian IPR · Examination Stage",
    description: "A confidence-aware question generation system integrating conformal prediction, contrastive learning, semantic constraints, and calibration."
  },
  {
    title: "Sparse Is Smart: Efficient 3D Point Cloud Transformers Without Positional Encoding",
    status: "Stage 1 Approved · Filed in India",
    description: "A Sparse Block Attention architecture that reduces point-cloud transformer complexity by applying attention in local neighborhoods."
  }
];

const makeEl = (tag, className, text) => {
  const el = document.createElement(tag);
  if (className) el.className = className;
  if (text !== undefined && text !== null) el.textContent = text;
  return el;
};

function renderPublications(items, containerId) {
  const container = document.getElementById(containerId);
  container.innerHTML = "";
  items.forEach((item) => {
    const article = makeEl("article", "publication-card");
    article.dataset.search = [item.title, item.authors, item.venue, item.year, item.note].join(" ").toLowerCase();

    const body = makeEl("div", "publication-body");
    body.appendChild(makeEl("h3", "publication-title", item.title));
    body.appendChild(makeEl("p", "publication-authors", item.authors));
    body.appendChild(makeEl("p", "publication-meta", `${item.venue} · ${item.year}`));
    if (item.note) body.appendChild(makeEl("p", "publication-note", item.note));

    const badges = makeEl("div", "publication-badges");
    badges.appendChild(makeEl("span", "badge", item.year));
    if (item.citations) badges.appendChild(makeEl("span", "badge violet", `${item.citations} cites`));

    article.appendChild(body);
    article.appendChild(badges);
    container.appendChild(article);
  });
}

function renderStack(items, containerId) {
  const container = document.getElementById(containerId);
  container.innerHTML = "";
  items.forEach((item) => {
    const article = makeEl("article", "stack-card");
    article.appendChild(makeEl("span", "status", item.status));
    article.appendChild(makeEl("h3", "", item.title));
    article.appendChild(makeEl("p", "", item.description));
    container.appendChild(article);
  });
}

function setupTabs() {
  const tabs = document.querySelectorAll(".tab");
  const panels = document.querySelectorAll(".tab-panel");
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const target = tab.dataset.tab;
      tabs.forEach((item) => item.classList.toggle("active", item === tab));
      panels.forEach((panel) => panel.classList.toggle("active", panel.dataset.panel === target));
      filterPublications();
    });
  });
}

function filterPublications() {
  const query = document.getElementById("publication-search").value.trim().toLowerCase();
  const activePanel = document.querySelector(".tab-panel.active");
  if (!activePanel) return;
  let visible = 0;
  activePanel.querySelectorAll(".publication-card").forEach((card) => {
    const match = card.dataset.search.includes(query);
    card.style.display = match ? "grid" : "none";
    if (match) visible += 1;
  });

  let empty = activePanel.querySelector(".empty-message");
  if (!visible) {
    if (!empty) {
      empty = makeEl("div", "empty-message", "No matching publications found.");
      activePanel.appendChild(empty);
    }
  } else if (empty) {
    empty.remove();
  }
}

function setupNavigation() {
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".site-nav");
  toggle.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(open));
  });
  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
}

function setupCanvas() {
  const canvas = document.getElementById("neural-canvas");
  const ctx = canvas.getContext("2d");
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) return;

  let particles = [];
  const count = Math.min(95, Math.floor(window.innerWidth / 15));

  function resize() {
    canvas.width = window.innerWidth * window.devicePixelRatio;
    canvas.height = window.innerHeight * window.devicePixelRatio;
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
    ctx.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0);
  }

  function init() {
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.24,
      vy: (Math.random() - 0.5) * 0.24,
      r: Math.random() * 1.8 + 0.6
    }));
  }

  function tick() {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    particles.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < -20) p.x = window.innerWidth + 20;
      if (p.x > window.innerWidth + 20) p.x = -20;
      if (p.y < -20) p.y = window.innerHeight + 20;
      if (p.y > window.innerHeight + 20) p.y = -20;
    });

    for (let i = 0; i < particles.length; i += 1) {
      for (let j = i + 1; j < particles.length; j += 1) {
        const a = particles[i];
        const b = particles[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 145) {
          ctx.globalAlpha = (1 - dist / 145) * 0.38;
          ctx.strokeStyle = "#69e6ff";
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }

    ctx.globalAlpha = 0.88;
    particles.forEach((p) => {
      const grd = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 6);
      grd.addColorStop(0, "rgba(105, 230, 255, 0.8)");
      grd.addColorStop(1, "rgba(105, 230, 255, 0)");
      ctx.fillStyle = grd;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r * 6, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.globalAlpha = 1;

    requestAnimationFrame(tick);
  }

  resize();
  init();
  tick();
  window.addEventListener("resize", () => {
    resize();
    init();
  });
}

renderPublications(fullPublications, "full-publications");
renderPublications(preprints, "preprint-publications");
renderStack(patents, "patent-list");
renderStack(books, "book-list");
setupTabs();
setupNavigation();
setupCanvas();
document.getElementById("publication-search").addEventListener("input", filterPublications);
document.getElementById("year").textContent = new Date().getFullYear();
