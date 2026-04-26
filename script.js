/* ============================================
   3D GALLERY — Mobile Support
   ============================================ */

// Touch control state
let touch = {
  left: { active: false, startY: 0 },
  right: { active: false, startX: 0 },
  joystick: { active: false, startX: 0, startY: 0, currentX: 0, currentY: 0 }
};

let moveVector = { x: 0, z: 0 };
let touchLook = { deltaX: 0, deltaY: 0 };

// Initialize mobile after DOM ready
function initMobile() {
  if (!isMobile()) return;

  createTouchControls();
  setupTouchEvents();
  setupGyro();
}

function isMobile() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
         window.innerWidth < 768;
}

// ============================================
// TOUCH UI CONTROLS
// ============================================

function createTouchControls() {
  const ui = document.getElementById('ui');

  // Left joystick for movement
  const joystick = document.createElement('div');
  joystick.id = 'joystick';
  joystick.innerHTML = '<div class="joystick-base"><div class="joystick-handle"></div></div>';
  document.body.appendChild(joystick);

  // Right touch area for looking
  const lookArea = document.createElement('div');
  lookArea.id = 'look-area';
  lookArea.innerHTML = '<div class="look-hint">Drag to look</div>';
  document.body.appendChild(lookArea);

  // Action button (interact)
  const actionBtn = document.createElement('button');
  actionBtn.id = 'action-btn';
  actionBtn.innerHTML = 'E';
  document.body.appendChild(actionBtn);

  // Mobile jump button (for verticality in future)
  // const jumpBtn = document.createElement('button');
  // jumpBtn.id = 'jump-btn';
  // jumpBtn.innerHTML = '↟';
  // document.body.appendChild(jumpBtn);

  // Inject touch CSS
  injectTouchStyles();
}

function injectTouchStyles() {
  const style = document.createElement('style');
  style.textContent = `
    /* Touch controls — only show on mobile */
    @media (min-width: 769px) {
      #joystick, #look-area, #action-btn { display: none !important; }
    }

    #joystick {
      position: fixed;
      bottom: 120px;
      left: 30px;
      width: 120px;
      height: 120px;
      z-index: 100;
    }

    .joystick-base {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background: rgba(255,255,255,0.05);
      border: 2px solid rgba(232,168,100,0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      backdrop-filter: blur(10px);
    }

    .joystick-handle {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      background: linear-gradient(135deg, #e8a864, #c45c26);
      box-shadow: 0 4px 20px rgba(0,0,0,0.4);
      transition: transform 0.1s;
    }

    #look-area {
      position: fixed;
      top: 0;
      right: 0;
      width: 50%;
      height: 100%;
      z-index: 99;
      display: flex;
      align-items: flex-end;
      justify-content: center;
      padding-bottom: 120px;
    }

    .look-hint {
      font-family: 'Space Grotesk', monospace;
      font-size: 0.7rem;
      color: rgba(255,255,255,0.3);
      letter-spacing: 0.1em;
      text-transform: uppercase;
      padding: 0.5rem 1rem;
      background: rgba(0,0,0,0.3);
      border-radius: 100px;
      pointer-events: none;
    }

    #action-btn {
      position: fixed;
      bottom: 120px;
      right: 30px;
      width: 70px;
      height: 70px;
      border-radius: 50%;
      background: rgba(232,168,100,0.15);
      border: 2px solid rgba(232,168,100,0.4);
      color: #e8a864;
      font-family: 'Space Grotesk', monospace;
      font-size: 1.2rem;
      font-weight: bold;
      z-index: 100;
      backdrop-filter: blur(10px);
      transition: all 0.2s;
    }

    #action-btn:active {
      background: rgba(232,168,100,0.3);
      transform: scale(0.95);
    }

    /* Hide desktop instructions on mobile */
    .instructions-content p:nth-child(2),
    .instructions-content p:nth-child(3) {
      display: none;
    }

    .instructions-content p:last-child {
      display: block;
    }

    /* Adjust HUD for mobile */
    @media (max-width: 768px) {
      .hud {
        padding: 0.75rem 1rem;
      }
      .location {
        font-size: 1.2rem;
      }
      .minimap {
        width: 100px;
        height: 100px;
        bottom: 1rem;
        left: 1rem;
      }
    }
  `;
  document.head.appendChild(style);
}

// ============================================
// TOUCH EVENT HANDLERS
// ============================================

function setupTouchEvents() {
  const joystickBase = document.querySelector('.joystick-base');
  const joystickHandle = document.querySelector('.joystick-handle');
  const lookArea = document.getElementById('look-area');
  const actionBtn = document.getElementById('action-btn');

  // Joystick movement
  joystickBase.addEventListener('touchstart', (e) => {
    e.preventDefault();
    touch.joystick.active = true;
    const touch = e.touches[0];
    const rect = joystickBase.getBoundingClientRect();
    touch.joystick.startX = rect.left + rect.width / 2;
    touch.joystick.startY = rect.top + rect.height / 2;
  });

  document.addEventListener('touchmove', (e) => {
    if (!touch.joystick.active) return;
    const touchEvent = e.touches[0];
    const deltaX = touchEvent.clientX - touch.joystick.startX;
    const deltaY = touchEvent.clientY - touch.joystick.startY;
    const maxDist = 35;

    const dist = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const angle = Math.atan2(deltaY, deltaX);
    const clampedDist = Math.min(dist, maxDist);
    const clampedX = Math.cos(angle) * clampedDist;
    const clampedY = Math.sin(angle) * clampedDist;

    joystickHandle.style.transform = `translate(${clampedX}px, ${clampedY}px)`;

    // Normalize movement vector (-1 to 1)
    moveVector.x = clampedX / maxDist;
    moveVector.z = clampedY / maxDist;
  });

  document.addEventListener('touchend', () => {
    touch.joystick.active = false;
    joystickHandle.style.transform = 'translate(0, 0)';
    moveVector.x = 0;
    moveVector.z = 0;
  });

  // Look area (right side of screen)
  lookArea.addEventListener('touchstart', (e) => {
    touch.right.startX = e.touches[0].clientX;
    touch.right.startY = e.touches[0].clientY;
  });

  lookArea.addEventListener('touchmove', (e) => {
    if (touch.right.startX === 0) return;
    const deltaX = e.touches[0].clientX - touch.right.startX;
    const deltaY = e.touches[0].clientY - touch.right.startY;
    touchLook.deltaX = deltaX;
    touchLook.deltaY = deltaY;
    touch.right.startX = e.touches[0].clientX;
    touch.right.startY = e.touches[0].clientY;
  });

  lookArea.addEventListener('touchend', () => {
    touch.right.startX = 0;
    touchLook.deltaX = 0;
    touchLook.deltaY = 0;
  });

  // Action button (interact)
  actionBtn.addEventListener('touchstart', (e) => {
    e.preventDefault();
    interact();
  });
}

// ============================================
// GYROSCOPE SUPPORT (Optional)
// ============================================

function setupGyro() {
  if (!window.DeviceOrientationEvent) return;

  // Request permission on iOS 13+
  if (typeof DeviceOrientationEvent.requestPermission === 'function') {
    // Add a button to enable gyro (hidden by default)
    const gyroBtn = document.createElement('button');
    gyroBtn.id = 'gyro-btn';
    gyroBtn.innerHTML = '🧭';
    gyroBtn.title = 'Enable gyro';
    gyroBtn.onclick = () => {
      DeviceOrientationEvent.requestPermission()
        .then(response => {
          if (response === 'granted') {
            enableGyro();
            gyroBtn.style.display = 'none';
          }
        })
        .catch(console.error);
    };
    document.body.appendChild(gyroBtn);

    // Add style
    const style = document.createElement('style');
    style.textContent = `
      #gyro-btn {
        position: fixed;
        bottom: 200px;
        right: 30px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: rgba(255,255,255,0.05);
        border: 1px solid rgba(255,255,255,0.1);
        color: #f5f3f0;
        font-size: 1.2rem;
        z-index: 100;
        opacity: 0.6;
      }
      @media (min-width: 769px) { #gyro-btn { display: none !important; } }
    `;
    document.head.appendChild(style);
  } else {
    // Non-iOS: try to enable directly
    enableGyro();
  }
}

let gyroEnabled = false;
function enableGyro() {
  window.addEventListener('deviceorientation', (e) => {
    if (!gyroEnabled) return;
    if (e.alpha === null) return;

    // Use device orientation for look
    const alpha = THREE.MathUtils.degToRad(e.alpha);
    const beta = THREE.MathUtils.degToRad(e.beta);
    const gamma = THREE.MathUtils.degToRad(e.gamma);

    // Simple mapping: gamma for left/right (~ -90 to 90)
    camera.rotation.y -= gamma * 0.02;
    // Beta for up/down, clamped
    camera.rotation.x = Math.max(-Math.PI/2, Math.min(Math.PI/2, beta * 0.02));
  });
  gyroEnabled = true;
}

// ============================================
// UPDATED ANIMATION LOOP — Mobile Input
// ============================================

function updatePlayer(delta) {
  const speed = 5 * delta;

  // Desktop keyboard or mobile joystick
  let forward = 0;
  let right = 0;

  if (isMobile()) {
    forward = -moveVector.z; // Joystick Y inverted (up = negative)
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

  // Apply movement
  if (forward !== 0) {
    camera.position.addScaledVector(forwardVec, forward * speed * 0.05);
  }
  if (right !== 0) {
    camera.position.addScaledVector(rightVec, right * speed * 0.05);
  }

  // Mouse or touch look
  if (!isMobile()) {
    // Desktop: pointer lock handled elsewhere
    // Already applied in mousemove handler
  } else {
    // Mobile: touch drag look
    if (touchLook.deltaX !== 0 || touchLook.deltaY !== 0) {
      camera.rotation.y -= touchLook.deltaX * 0.005;
      camera.rotation.x -= touchLook.deltaY * 0.005;
      camera.rotation.x = Math.max(-Math.PI/2, Math.min(Math.PI/2, camera.rotation.x));
      touchLook.deltaX = 0;
      touchLook.deltaY = 0;
    }
  }

  // Keep at eye level
  camera.position.y = 1.6;
}

// ============================================
// TOUCH-FRIENDLY INTERACTION
// ============================================

function checkInteraction() {
  if (!isLocked) return;

  raycaster.setFromCamera(new THREE.Vector2(0, 0), camera);
  // Consider a wider interaction radius on mobile
  const fovFactor = isMobile() ? 1.5 : 1;
  raycaster.far = isMobile() ? 8 : 6;

  const intersects = raycaster.intersectObjects(world.children, true);

  for (let hit of intersects) {
    let obj = hit.object;
    while (obj.parent && !obj.userData.interactive) {
      obj = obj.parent;
    }
    if (obj.userData.interactive) {
      handleInteraction(obj);
      break;
    }
  }
}

// ============================================
// MOBILE INSTRUCTION TEXT
// ============================================

function updateInstructionsForMobile() {
  if (!isMobile()) return;

  const instructions = document.getElementById('instructions');
  const content = instructions.querySelector('.instructions-content');

  content.innerHTML = `
    <h2>Gallery Instructions</h2>
    <p><strong>Left joystick</strong> — Walk</p>
    <p><strong>Right side</strong> — Drag to look</p>
    <p><strong>E button</strong> — Interact</p>
    <p><strong>Tap</strong> to begin</p>
  `;
}

// Call before showInstructions
document.addEventListener('DOMContentLoaded', () => {
  updateInstructionsForMobile();
  initMobile();
});

console.log('%c📱 Mobile support enabled', 'font-size:12px;color:#4a7c7e;');
