/* ============================================
   ANALOGUE TV STACK PORTFOLIO
   ============================================ */

// Projects data
const projects = [
  {
    id: 'project1',
    title: 'Neural Dreams',
    year: '2024',
    desc: 'An AI-powered dream visualization tool that transforms subconscious imagery into stunning digital art.',
    category: 'AI • Generative Art',
    tech: 'TensorFlow • WebGL • Three.js',
    link: 'https://neural-dreams.example.com',
    github: 'https://github.com/example/neural-dreams',
    tags: ['AI', 'Creative']
  },
  {
    id: 'project2',
    title: 'Quantum Commerce',
    year: '2024',
    desc: 'Next-generation e-commerce platform with real-time inventory and AR product previews.',
    category: 'E-commerce • Web App',
    tech: 'React • Node.js • Stripe API',
    link: 'https://quantum-commerce.example.com',
    github: 'https://github.com/example/quantum-commerce',
    tags: ['Web', 'Business']
  },
  {
    id: 'project3',
    title: 'AudioScape',
    year: '2023',
    desc: 'Immersive 3D audio visualization platform for musicians and sound designers.',
    category: 'Audio • Creative Coding',
    tech: 'Web Audio API • Three.js • GLSL',
    link: 'https://audioscape.example.com',
    github: 'https://github.com/example/audioscape',
    tags: ['Audio', '3D']
  },
  {
    id: 'project4',
    title: 'CodeFlow Studio',
    year: '2023',
    desc: 'Interactive code playground with real-time collaboration and AI assistance.',
    category: 'Developer Tools',
    tech: 'Monaco Editor • WebSockets • Express',
    link: 'https://codeflow.example.com',
    github: 'https://github.com/example/codeflow',
    tags: ['Dev', 'Collaboration']
  },
  {
    id: 'project5',
    title: 'MetaVerse Gallery',
    year: '2023',
    desc: 'Virtual reality art gallery showcasing digital sculptures and interactive installations.',
    category: 'VR • Art',
    tech: 'WebXR • Three.js • A-Frame',
    link: 'https://metagallery.example.com',
    github: 'https://github.com/example/metagallery',
    tags: ['VR', 'Art']
  },
  {
    id: 'project6',
    title: 'PixelStream',
    year: '2022',
    desc: 'Real-time pixel art streaming platform with community voting and NFT integration.',
    category: 'Gaming • Community',
    tech: 'WebGL • Socket.io • Blockchain',
    link: 'https://pixelstream.example.com',
    github: 'https://github.com/example/pixelstream',
    tags: ['Game', 'Web3']
  },
  {
    id: 'project7',
    title: 'SynthOS',
    year: '2022',
    desc: 'Retro-futuristic operating system interface with modular widgets and vintage aesthetics.',
    category: 'UI/UX • Experimental',
    tech: 'Electron • Canvas • Custom CSS',
    link: 'https://synthos.example.com',
    github: 'https://github.com/example/synthos',
    tags: ['UI', 'Desktop']
  },
  {
    id: 'project8',
    title: 'Echo Archive',
    year: '2021',
    desc: 'Decentralized knowledge management system with semantic search and linked data.',
    category: 'Data • Productivity',
    tech: 'IPFS • GraphQL • React',
    link: 'https://echoarchive.example.com',
    github: 'https://github.com/example/echo-archive',
    tags: ['Productivity', 'Web3']
  }
];

// Three.js variables
let scene, camera, renderer, controls;
let raycaster, mouse;
let world = new THREE.Group();
let tvGroup = new THREE.Group();
let activeTV = null;
let isLocked = false;

// Parallax variables
let mouseX = 0, mouseY = 0;
let targetX = 0, targetY = 0;
let parallaxLayers = [];

// Keyboard state
let moveForward = false, moveBackward = false;
let moveLeft = false, moveRight = false;

// Touch control state
let touch = {
  left: { active: false, startY: 0 },
  right: { active: false, startX: 0 },
  joystick: { active: false, startX: 0, startY: 0, currentX: 0, currentY: 0 }
};

let moveVector = { x: 0, z: 0 };
let touchLook = { deltaX: 0, deltaY: 0 };

// Initialize
document.addEventListener('DOMContentLoaded', init);

function init() {
  initMobile();
  
  // Scene setup
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x050403);
  scene.fog = new THREE.Fog(0x050403, 15, 50);
  
  // Camera
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 1.6, 5);
  
  // Renderer
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCSoftShadowMap;
  document.getElementById('world').appendChild(renderer.domElement);
  
  // Controls
  controls = new THREE.PointerLockControls(camera, document.body);
  scene.add(controls.getObject());
  
  // Raycaster
  raycaster = new THREE.Raycaster();
  mouse = new THREE.Vector2();
  
  // Lighting
  createLighting();
  
  // Create TV stack
  createTVStack();
  
  // Create parallax layers (floating particles)
  createParallaxLayers();
  
  // Create TV static overlay
  createTVStatic();
  
  // Event listeners
  setupEventListeners();
  
  // Start animation loop
  animate();
  
  // GSAP intro animation
  gsap.to('#instructions', { opacity: 1, duration: 1 });
}