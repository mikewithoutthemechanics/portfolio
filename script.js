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
let clock = new THREE.Clock();

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

// Gyro state
let gyroEnabled = false;

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
  
  // Create parallax layers
  createParallaxLayers();
  
  // Create TV static overlay
  createTVStatic();
  
  // Event listeners
  setupEventListeners();
  
  // Start animation loop
  animate();
  
  // GSAP intro
  gsap.to('#instructions', { opacity: 1, duration: 1 });
}

function createLighting() {
  const ambient = new THREE.AmbientLight(0x404040, 0.8);
  scene.add(ambient);
  
  const sun = new THREE.DirectionalLight(0xe8a864, 0.6);
  sun.position.set(10, 20, 10);
  sun.castShadow = true;
  scene.add(sun);
  
  const screenLight = new THREE.PointLight(0x00ff88, 0.3, 10);
  screenLight.position.set(0, 1.5, -3);
  scene.add(screenLight);
}

function createTVStack() {
  const tvWidth = 4;
  const tvHeight = 3;
  const stackSpacing = 0.15;
  const totalStackHeight = projects.length * (tvHeight + stackSpacing);
  
  projects.forEach((project, index) => {
    const tv = createVintageTV(project, index);
    const yPos = -totalStackHeight / 2 + index * (tvHeight + stackSpacing) + tvHeight / 2;
    tv.position.y = yPos;
    tv.userData.projectId = project.id;
    tv.userData.projectIndex = index;
    tv.userData.interactive = true;
    tvGroup.add(tv);
  });
  
  world.add(tvGroup);
  
  const floorGeometry = new THREE.PlaneGeometry(100, 100);
  const floorMaterial = new THREE.MeshStandardMaterial({ color: 0x0a0908 });
  const floor = new THREE.Mesh(floorGeometry, floorMaterial);
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  world.add(floor);
  
  scene.add(world);
}

function createVintageTV(project, index) {
  const tv = new THREE.Group();
  
  const screenGeometry = new THREE.BoxGeometry(3.2, 2.4, 0.1);
  const screenMaterial = new THREE.MeshBasicMaterial({
    color: 0x001100,
    emissive: 0x003300,
    emissiveIntensity: 0.2
  });
  const screen = new THREE.Mesh(screenGeometry, screenMaterial);
  screen.position.z = 0.15;
  screen.userData.isScreen = true;
  screen.userData.project = project;
  tv.add(screen);
  
  const bezelGeometry = new THREE.BoxGeometry(3.4, 2.6, 0.3);
  const bezelMaterial = new THREE.MeshStandardMaterial({ color: 0x3a2a1f, roughness: 0.4, metalness: 0.6 });
  const bezel = new THREE.Mesh(bezelGeometry, bezelMaterial);
  bezel.castShadow = true;
  tv.add(bezel);
  
  const bodyGeometry = new THREE.BoxGeometry(3.6, 2.0, 1.2);
  const bodyMaterial = new THREE.MeshStandardMaterial({ color: 0x2a1f15, roughness: 0.5 });
  const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
  body.position.y = -1.2;
  body.position.z = -0.45;
  body.castShadow = true;
  tv.add(body);
  
  const antennaGeometry = new THREE.CylinderGeometry(0.03, 0.03, 1.5);
  const antennaMaterial = new THREE.MeshStandardMaterial({ color: 0x5a4a3f });
  const antenna1 = new THREE.Mesh(antennaGeometry, antennaMaterial);
  antenna1.position.set(-1.2, 2.3, 0);
  antenna1.rotation.z = 0.3;
  tv.add(antenna1);
  
  const antenna2 = new THREE.Mesh(antennaGeometry, antennaMaterial);
  antenna2.position.set(1.2, 2.3, 0);
  antenna2.rotation.z = -0.3;
  tv.add(antenna2);
  
  for (let i = 0; i < 4; i++) {
    const knobGeometry = new THREE.CylinderGeometry(0.1, 0.1, 0.05);
    const knobMaterial = new THREE.MeshStandardMaterial({ color: 0x8a7a6f });
    const knob = new THREE.Mesh(knobGeometry, knobMaterial);
    knob.position.set(-1.3 + i * 0.5, -0.5, -0.2);
    tv.add(knob);
  }
  
  const standGeometry = new THREE.BoxGeometry(2, 0.2, 0.5);
  const stand = new THREE.Mesh(standGeometry, bodyMaterial);
  stand.position.y = -2.2;
  stand.position.z = -0.35;
  tv.add(stand);
  
  const legGeometry = new THREE.BoxGeometry(0.1, 0.8, 0.1);
  const leg1 = new THREE.Mesh(legGeometry, new THREE.MeshStandardMaterial({ color: 0x0a0805 }));
  leg1.position.set(-0.85, -2.6, -0.05);
  tv.add(leg1);
  
  const leg2 = new THREE.Mesh(legGeometry, new THREE.MeshStandardMaterial({ color: 0x0a0805 }));
  leg2.position.set(0.85, -2.6, -0.05);
  tv.add(leg2);
  
  tv.rotation.y = (index % 3 - 1) * 0.02;
  
  return tv;
}

function createParallaxLayers() {
  for (let i = 0; i < 3; i++) {
    const layer = new THREE.Group();
    const count = (i + 1) * 20;
    const size = 0.02 + i * 0.01;
    
    for (let j = 0; j < count; j++) {
      const geometry = new THREE.SphereGeometry(size, 8, 8);
      const material = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        opacity: 0.1 + i * 0.1,
        transparent: true
      });
      const particle = new THREE.Mesh(geometry, material);
      particle.position.set(
        (Math.random() - 0.5) * 50,
        Math.random() * 10,
        (Math.random() - 0.5) * 30
      );
      layer.add(particle);
    }
    
    layer.userData.speed = 0.01 + i * 0.005;
    parallaxLayers.push(layer);
    scene.add(layer);
  }
}

function createTVStatic() {
  const staticOverlay = document.getElementById('tv-static');
  staticOverlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0.03;
    pointer-events: none;
    background: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDIiIGhlaWdodD0iMTAyIj48ZmlsdGVyIGlkPSJmIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSINCiAgICAgICAgYmVnaW49IjAlIiBkZWZpbmU9IjAlIiBmYWxpdXNpb249IjAuNDQiIC8+PC9maWx0ZXI+PC9saW5lYXJHcmFkaWVudD48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2YpIiAvPjwvc3ZnPg==);
    z-index: 5;
  `;
}

function setupEventListeners() {
  document.addEventListener('click', () => {
    if (!isLocked) controls.lock();
  });
  
  controls.addEventListener('lock', () => {
    isLocked = true;
    gsap.to('#instructions', { opacity: 0, duration: 0.5 });
    gsap.to('#hud', { opacity: 1, duration: 0.5 });
  });
  
  controls.addEventListener('unlock', () => {
    isLocked = false;
    gsap.to('#instructions', { opacity: 1, duration: 0.5 });
    gsap.to('#hud', { opacity: 0, duration: 0.5 });
    closePanel();
  });
  
  document.addEventListener('keydown', (e) => {
    switch (e.code) {
      case 'KeyW': case 'ArrowUp': moveForward = true; break;
      case 'KeyS': case 'ArrowDown': moveBackward = true; break;
      case 'KeyA': case 'ArrowLeft': moveLeft = true; break;
      case 'KeyD': case 'ArrowRight': moveRight = true; break;
      case 'KeyE': interact(); break;
      case 'KeyM': toggleMinimap(); break;
      case 'KeyL': toggleTVList(); break;
    }
  });
  
  document.addEventListener('keyup', (e) => {
    switch (e.code) {
      case 'KeyW': case 'ArrowUp': moveForward = false; break;
      case 'KeyS': case 'ArrowDown': moveBackward = false; break;
      case 'KeyA': case 'ArrowLeft': moveLeft = false; break;
      case 'KeyD': case 'ArrowRight': moveRight = false; break;
    }
  });
  
  document.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth) - 0.5;
    mouseY = (e.clientY / window.innerHeight) - 0.5;
  });
  
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
  
  document.getElementById('btn-minimap').addEventListener('click', toggleMinimap);
  document.getElementById('btn-screenshot').addEventListener('click', takeScreenshot);
  document.getElementById('close-panel').addEventListener('click', closePanel);
  document.getElementById('close-list').addEventListener('click', closeTVList);
  
  createTVListUI();
}

function createTVListUI() {
  const listContent = document.getElementById('tv-list-content');
  
  projects.forEach((project, index) => {
    const card = document.createElement('div');
    card.className = 'tv-card';
    card.innerHTML = `
      <div class="tv-card-header">
        <span class="tv-card-year">${project.year}</span>
        <span class="tv-card-tags">${project.tags.join(' • ')}</span>
      </div>
      <h4 class="tv-card-title">${project.title}</h4>
      <p class="tv-card-desc">${project.desc.substring(0, 100)}...</p>
      <div class="tv-card-links">
        <a href="#" onclick="showProject('${project.id}')">View →</a>
      </div>
    `;
    listContent.appendChild(card);
  });
}

function showProject(id) {
  const project = projects.find(p => p.id === id);
  if (project) {
    document.getElementById('info-title').textContent = project.title;
    document.getElementById('info-year').textContent = project.year;
    document.getElementById('info-desc').textContent = project.desc;
    document.getElementById('info-meta').textContent = project.category;
    document.getElementById('info-link').href = project.link;
    document.getElementById('info-github').href = project.github;
    
    openPanel();
  }
}

function openPanel() {
  gsap.to('#info-panel', { x: 0, duration: 0.8, ease: 'power3.out' });
}

function closePanel() {
  gsap.to('#info-panel', { x: '120%', duration: 0.6, ease: 'power2.in' });
}

function toggleTVList() {
  document.getElementById('tv-list').classList.toggle('visible');
  gsap.from('.tv-card', {
    y: 50,
    opacity: 0,
    stagger: 0.1,
    duration: 0.5
  });
}

function closeTVList() {
  document.getElementById('tv-list').classList.remove('visible');
}

function toggleMinimap() {
  document.getElementById('minimap').classList.toggle('visible');
}

function takeScreenshot() {
  renderer.domElement.toBlob(blob => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'tv-portfolio-' + Date.now() + '.png';
    a.click();
    URL.revokeObjectURL(url);
  });
}

function animate() {
  requestAnimationFrame(animate);
  
  const delta = clock.getDelta();
  
  if (isLocked) {
    updatePlayer(delta);
    checkInteraction();
  }
  
  targetX = mouseX * 0.02;
  targetY = mouseY * 0.01;
  
  parallaxLayers.forEach(layer => {
    layer.position.x += (targetX - layer.position.x) * layer.userData.speed;
    layer.position.y += (targetY - layer.position.y) * layer.userData.speed;
  });
  
  tvGroup.children.forEach((tv, i) => {
    tv.position.y += Math.sin(Date.now() * 0.0005 + i) * 0.0002;
  });
  
  renderer.render(scene, camera);
}

function updatePlayer(delta) {
  const speed = 5 * delta;
  
  let forward = 0, right = 0;
  
  if (isMobile()) {
    forward = -moveVector.z;
    right = moveVector.x;
  } else {
    forward = Number(moveForward) - Number(moveBackward);
    right = Number(moveRight) - Number(moveLeft);
  }
  
  const forwardVec = new THREE.Vector3(0, 0, -1).applyQuaternion(camera.quaternion);
  forwardVec.y = 0;
  forwardVec.normalize();
  
  const rightVec = new THREE.Vector3(1, 0, 0).applyQuaternion(camera.quaternion);
  rightVec.y = 0;
  rightVec.normalize();
  
  if (forward !== 0) {
    camera.position.addScaledVector(forwardVec, forward * speed * 0.05);
  }
  if (right !== 0) {
    camera.position.addScaledVector(rightVec, right * speed * 0.05);
  }
  
  if (isMobile()) {
    if (touchLook.deltaX !== 0 || touchLook.deltaY !== 0) {
      camera.rotation.y -= touchLook.deltaX * 0.005;
      camera.rotation.x -= touchLook.deltaY * 0.005;
      camera.rotation.x = Math.max(-Math.PI/2, Math.min(Math.PI/2, camera.rotation.x));
      touchLook.deltaX = 0;
      touchLook.deltaY = 0;
    }
  }
  
  camera.position.y = 1.6;
}

function checkInteraction() {
  raycaster.setFromCamera(new THREE.Vector2(0, 0), camera);
  raycaster.far = isMobile() ? 8 : 6;
  
  const intersects = raycaster.intersectObjects(world.children, true);
  
  for (let hit of intersects) {
    let obj = hit.object;
    while (obj.parent && !obj.userData.interactive) {
      obj = obj.parent;
    }
    if (obj.userData.interactive) {
      highlightTV(obj, true);
      handleInteraction(obj);
      return;
    }
  }
  
  tvGroup.children.forEach(tv => highlightTV(tv, false));
  activeTV = null;
}

function highlightTV(tv, active) {
  const screen = tv.children.find(c => c.userData.isScreen);
  if (screen) {
    if (active) {
      gsap.to(screen.material, { emissiveIntensity: 0.8, duration: 0.3 });
      document.getElementById('interact-prompt').classList.add('visible');
    } else {
      gsap.to(screen.material, { emissiveIntensity: 0.2, duration: 0.3 });
      document.getElementById('interact-prompt').classList.remove('visible');
    }
  }
}

function handleInteraction(tv) {
  activeTV = tv;
  document.getElementById('room-indicator').textContent = `TV ${tv.userData.projectIndex + 1}`;
}

function interact() {
  if (!activeTV) return;
  const screen = activeTV.children.find(c => c.userData.project);
  if (screen) {
    showProject(screen.userData.project.id);
    gsap.to(activeTV.rotation, { y: activeTV.rotation.y + 0.1, duration: 0.5, ease: 'elastic.out(1, 0.3)' });
  }
}

function isMobile() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768;
}

function initMobile() {
  if (!isMobile()) return;
  
  createTouchControls();
  setupTouchEvents();
  setupGyro();
}

function createTouchControls() {
  ['joystick', 'look-area', 'action-btn'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.remove();
  });
  
  const joystick = document.createElement('div');
  joystick.id = 'joystick';
  joystick.innerHTML = '<div class="joystick-base"><div class="joystick-handle"></div></div>';
  document.body.appendChild(joystick);
  
  const lookArea = document.createElement('div');
  lookArea.id = 'look-area';
  lookArea.innerHTML = '<div class="look-hint">Drag to look</div>';
  document.body.appendChild(lookArea);
  
  const actionBtn = document.createElement('button');
  actionBtn.id = 'action-btn';
  actionBtn.innerHTML = 'E';
  document.body.appendChild(actionBtn);
}

function setupTouchEvents() {
  const joystickBase = document.querySelector('.joystick-base');
  const joystickHandle = document.querySelector('.joystick-handle');
  const lookArea = document.getElementById('look-area');
  const actionBtn = document.getElementById('action-btn');
  
  joystickBase?.addEventListener('touchstart', (e) => {
    e.preventDefault();
    touch.joystick.active = true;
  });
  
  joystickBase?.addEventListener('touchmove', (e) => {
    if (!touch.joystick.active) return;
    const t = e.touches[0];
    const rect = joystickBase.getBoundingClientRect();
    const cx = rect.left + rect.width / 2, cy = rect.top + rect.height / 2;
    const dx = t.clientX - cx, dy = t.clientY - cy;
    const max = 35;
    const angle = Math.atan2(dy, dx);
    const dist = Math.min(Math.sqrt(dx*dx + dy*dy), max);
    joystickHandle.style.transform = `translate(${Math.cos(angle)*dist}px, ${Math.sin(angle)*dist}px)`;
    moveVector.x = Math.cos(angle) * dist / max;
    moveVector.z = Math.sin(angle) * dist / max;
  });
  
  document.addEventListener('touchend', () => {
    touch.joystick.active = false;
    joystickHandle.style.transform = 'translate(0,0)';
    moveVector.x = 0;
    moveVector.z = 0;
  });
  
  lookArea?.addEventListener('touchstart', (e) => {
    touch.right.startX = e.touches[0].clientX;
    touch.right.startY = e.touches[0].clientY;
  });
  
  lookArea?.addEventListener('touchmove', (e) => {
    if (!touch.right.startX) return;
    touchLook.deltaX = e.touches[0].clientX - touch.right.startX;
    touchLook.deltaY = e.touches[0].clientY - touch.right.startY;
    touch.right.startX = e.touches[0].clientX;
    touch.right.startY = e.touches[0].clientY;
  });
  
  actionBtn?.addEventListener('touchstart', (e) => {
    e.preventDefault();
    interact();
  });
}

function setupGyro() {
  if (!window.DeviceOrientationEvent) return;
  
  const gyroBtn = document.createElement('button');
  gyroBtn.id = 'gyro-btn';
  gyroBtn.innerHTML = '🧭';
  gyroBtn.onclick = () => {
    if (typeof DeviceOrientationEvent.requestPermission === 'function') {
      DeviceOrientationEvent.requestPermission().then(r => {
        if (r === 'granted') enableGyro();
        gyroBtn.style.display = 'none';
      });
    } else {
      enableGyro();
    }
  };
  document.body.appendChild(gyroBtn);
}

function enableGyro() {
  window.addEventListener('deviceorientation', (e) => {
    if (!gyroEnabled || !e.alpha) return;
    camera.rotation.y -= THREE.MathUtils.degToRad(e.gamma) * 0.02;
    camera.rotation.x = Math.max(-Math.PI/2, Math.min(Math.PI/2, THREE.MathUtils.degToRad(e.beta) * 0.02));
  });
  gyroEnabled = true;
}