(() => {
  'use strict';

  function initMail3D() {
    const canvas = document.getElementById('mail3dCanvas');
    const container = document.getElementById('mail3dBox');
    const openCardBtn = document.getElementById('openCard');
    if (!canvas || !container || typeof THREE === 'undefined') return;

    const width = container.clientWidth || 140;
    const height = container.clientHeight || 100;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 50);
    camera.position.set(0, 0, 7.8);

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance'
      });
      renderer.setSize(width, height, false);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.0;
    } catch (_) {
      return; // Fallback gracefully if WebGL fails
    }

    // 2. Soft Studio Lighting (Claymorphic / Soft Silicone Aesthetic)
    const ambientLight = new THREE.AmbientLight(0xfff5f8, 0.8);
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xffffff, 0.95);
    mainLight.position.set(4, 7, 5);
    scene.add(mainLight);

    const pinkFillLight = new THREE.PointLight(0xffa3bb, 0.7, 20);
    pinkFillLight.position.set(-4, -2, 4);
    scene.add(pinkFillLight);

    const softFrontLight = new THREE.DirectionalLight(0xffffff, 0.45);
    softFrontLight.position.set(0, 0, 6);
    scene.add(softFrontLight);

    // Root Group
    const mailGroup = new THREE.Group();
    mailGroup.rotation.set(0.18, -0.22, 0.14);
    scene.add(mailGroup);

    // 3. Materials (Luscious Candy Pink Claymorphism)
    const outerPinkMat = new THREE.MeshPhysicalMaterial({
      color: 0xff668c,
      roughness: 0.34,
      metalness: 0.02,
      clearcoat: 0.38,
      clearcoatRoughness: 0.22
    });

    const creasePinkMat = new THREE.MeshPhysicalMaterial({
      color: 0xee557b,
      roughness: 0.42,
      metalness: 0.02,
      clearcoat: 0.18
    });

    const heartSealMat = new THREE.MeshPhysicalMaterial({
      color: 0xff1a53,
      roughness: 0.2,
      metalness: 0.08,
      clearcoat: 0.65,
      clearcoatRoughness: 0.12
    });

    function createRoundedRectShape(w, h, r) {
      const shape = new THREE.Shape();
      const x = -w / 2, y = -h / 2;
      shape.moveTo(x + r, y);
      shape.lineTo(x + w - r, y);
      shape.quadraticCurveTo(x + w, y, x + w, y + r);
      shape.lineTo(x + w, y + h - r);
      shape.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
      shape.lineTo(x + r, y + h);
      shape.quadraticCurveTo(x, y + h, x, y + h - r);
      shape.lineTo(x, y + r);
      shape.quadraticCurveTo(x, y, x + r, y);
      return shape;
    }

    // --- A. Thân Bao Thư (Puffy Back Body) ---
    const bodyShape = createRoundedRectShape(3.4, 2.3, 0.4);
    const bodyGeo = new THREE.ExtrudeGeometry(bodyShape, {
      depth: 0.32,
      bevelEnabled: true,
      bevelSegments: 7,
      steps: 1,
      bevelSize: 0.14,
      bevelThickness: 0.14
    });
    const bodyMesh = new THREE.Mesh(bodyGeo, outerPinkMat);
    bodyMesh.position.set(0, 0, -0.2);
    mailGroup.add(bodyMesh);

    // --- B. Nếp Gấp Mặt Trước (Diagonal Crease Seams matching Reference Image) ---
    const creaseGroup = new THREE.Group();
    creaseGroup.position.set(0, 0, 0.13);
    mailGroup.add(creaseGroup);

    function createFoldFlapShape(isLeft) {
      const shape = new THREE.Shape();
      if (isLeft) {
        shape.moveTo(-1.62, -1.05);
        shape.lineTo(0, -0.05);
        shape.lineTo(-1.62, 0.85);
        shape.quadraticCurveTo(-1.68, 0, -1.62, -1.05);
      } else {
        shape.moveTo(1.62, -1.05);
        shape.lineTo(0, -0.05);
        shape.lineTo(1.62, 0.85);
        shape.quadraticCurveTo(1.68, 0, 1.62, -1.05);
      }
      return shape;
    }

    const foldGeoSettings = { depth: 0.04, bevelEnabled: true, bevelSegments: 4, bevelSize: 0.04, bevelThickness: 0.04 };
    const leftFoldMesh = new THREE.Mesh(new THREE.ExtrudeGeometry(createFoldFlapShape(true), foldGeoSettings), creasePinkMat);
    const rightFoldMesh = new THREE.Mesh(new THREE.ExtrudeGeometry(createFoldFlapShape(false), foldGeoSettings), creasePinkMat);
    creaseGroup.add(leftFoldMesh, rightFoldMesh);

    const bottomShape = new THREE.Shape();
    bottomShape.moveTo(-1.58, -1.08);
    bottomShape.quadraticCurveTo(-0.8, -1.14, 0, -1.14);
    bottomShape.quadraticCurveTo(0.8, -1.14, 1.58, -1.08);
    bottomShape.lineTo(0, -0.12);
    bottomShape.closePath();
    const bottomFoldMesh = new THREE.Mesh(new THREE.ExtrudeGeometry(bottomShape, foldGeoSettings), outerPinkMat);
    creaseGroup.add(bottomFoldMesh);

    // --- C. Tấm Thiệp Nhỏ Bên Trong ---
    const cardGeo = new THREE.BoxGeometry(2.9, 1.9, 0.04);
    const cardMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3 });
    const cardMesh = new THREE.Mesh(cardGeo, cardMat);
    cardMesh.position.set(0, 0, 0.04);
    mailGroup.add(cardMesh);

    // --- D. Nắp Thư Tam Giác Bo Góc Puffy (Flap with Top Pivot Hinge) ---
    const flapShape = new THREE.Shape();
    const fw = 3.32, fh = 1.48, fr = 0.3, tipR = 0.38;
    flapShape.moveTo(-fw / 2 + fr, 0);
    flapShape.lineTo(fw / 2 - fr, 0);
    flapShape.quadraticCurveTo(fw / 2, 0, fw / 2, -fr);
    flapShape.lineTo(tipR * 0.9, -fh + tipR * 0.6);
    flapShape.quadraticCurveTo(0, -fh, -tipR * 0.9, -fh + tipR * 0.6);
    flapShape.lineTo(-fw / 2, -fr);
    flapShape.quadraticCurveTo(-fw / 2, 0, -fw / 2 + fr, 0);

    const flapGeo = new THREE.ExtrudeGeometry(flapShape, {
      depth: 0.12,
      bevelEnabled: true,
      bevelSegments: 8,
      steps: 1,
      bevelSize: 0.11,
      bevelThickness: 0.11
    });

    const flapPivot = new THREE.Group();
    flapPivot.position.set(0, 1.15, 0.22);
    mailGroup.add(flapPivot);

    const flapMesh = new THREE.Mesh(flapGeo, outerPinkMat);
    flapMesh.position.set(0, 0, 0);
    flapPivot.add(flapMesh);

    // --- E. Con Dấu Sáp Trái Tim ---
    const heartShape = new THREE.Shape();
    heartShape.moveTo(0, 0);
    heartShape.bezierCurveTo(0, 0.3, -0.42, 0.62, -0.72, 0.3);
    heartShape.bezierCurveTo(-1.02, 0, -0.72, -0.52, 0, -0.92);
    heartShape.bezierCurveTo(0.72, -0.52, 1.02, 0, 0.72, 0.3);
    heartShape.bezierCurveTo(0.42, 0.62, 0, 0.3, 0, 0);

    const heartGeo = new THREE.ExtrudeGeometry(heartShape, {
      depth: 0.1,
      bevelEnabled: true,
      bevelSegments: 5,
      bevelSize: 0.04,
      bevelThickness: 0.04
    });
    const heartMesh = new THREE.Mesh(heartGeo, heartSealMat);
    heartMesh.scale.set(0.42, 0.42, 0.42);
    heartMesh.position.set(0, -1.40, 0.26);
    flapPivot.add(heartMesh);

    // --- F. Trái Tim Nhỏ Bay Xung Quanh ---
    const particlesGroup = new THREE.Group();
    const particleColors = [0xff7597, 0xff9eb7, 0xffb8cb, 0xff4f78];
    const heartParticles = [];

    for (let i = 0; i < 9; i++) {
      const mat = new THREE.MeshStandardMaterial({
        color: particleColors[i % particleColors.length],
        roughness: 0.3,
        metalness: 0.05
      });
      const pMesh = new THREE.Mesh(heartGeo, mat);
      const s = 0.08 + Math.random() * 0.11;
      pMesh.scale.set(s, s, s);
      const angle = (i / 9) * Math.PI * 2;
      const radius = 2.4 + Math.random() * 1.5;
      pMesh.position.set(
        Math.cos(angle) * radius,
        Math.sin(angle) * radius * 0.85,
        (Math.random() - 0.5) * 2
      );
      heartParticles.push({
        mesh: pMesh,
        speedY: 0.003 + Math.random() * 0.004,
        rotSpeed: 0.008 + Math.random() * 0.015,
        baseY: pMesh.position.y,
        offset: Math.random() * Math.PI * 2
      });
      particlesGroup.add(pMesh);
    }
    scene.add(particlesGroup);

    // --- G. Nổ Trái Tim khi Click ---
    const burstGroup = new THREE.Group();
    scene.add(burstGroup);

    function triggerHeartBurst() {
      for (let i = 0; i < 22; i++) {
        const mat = new THREE.MeshPhysicalMaterial({
          color: particleColors[i % particleColors.length],
          roughness: 0.25,
          clearcoat: 0.5
        });
        const bMesh = new THREE.Mesh(heartGeo, mat);
        const s = 0.07 + Math.random() * 0.12;
        bMesh.scale.set(s, s, s);
        bMesh.position.set(0, 0.3, 0.4);
        burstGroup.add(bMesh);

        const theta = Math.random() * Math.PI * 2;
        const phi = (Math.random() - 0.5) * Math.PI;
        const speed = 2.8 + Math.random() * 3.2;
        const targetX = Math.cos(theta) * Math.cos(phi) * speed;
        const targetY = (Math.sin(phi) + 0.6) * speed;
        const targetZ = Math.sin(theta) * Math.cos(phi) * speed;

        if (typeof gsap !== 'undefined') {
          gsap.to(bMesh.position, {
            x: targetX,
            y: targetY,
            z: targetZ,
            duration: 1.2,
            ease: 'power2.out'
          });
          gsap.to(bMesh.rotation, {
            x: Math.random() * 10,
            y: Math.random() * 10,
            z: Math.random() * 10,
            duration: 1.5,
            ease: 'power1.out'
          });
          gsap.to(bMesh.scale, {
            x: 0.001,
            y: 0.001,
            z: 0.001,
            delay: 0.8,
            duration: 0.4,
            ease: 'power2.in',
            onComplete: () => {
              burstGroup.remove(bMesh);
              bMesh.geometry.dispose();
              bMesh.material.dispose();
            }
          });
        }
      }
    }

    // Audio Chime
    function playSparkleSound() {
      try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;
        const ctx = new AudioContext();
        const notes = [523.25, 659.25, 783.99, 1046.50];
        notes.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.055);
          gain.gain.setValueAtTime(0, ctx.currentTime + idx * 0.055);
          gain.gain.linearRampToValueAtTime(0.06, ctx.currentTime + idx * 0.055 + 0.02);
          gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + idx * 0.055 + 0.6);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(ctx.currentTime + idx * 0.055);
          osc.stop(ctx.currentTime + idx * 0.055 + 0.65);
        });
      } catch (_) {}
    }

    let isOpening = false;
    window.__triggerMail3DOpen = function() {
      if (isOpening) return;
      isOpening = true;
      playSparkleSound();
      triggerHeartBurst();

      if (typeof gsap !== 'undefined') {
        gsap.timeline()
          .to(mailGroup.scale, { x: 1.1, y: 0.92, z: 1.08, duration: 0.18, ease: 'power2.out' })
          .to(mailGroup.scale, { x: 1.0, y: 1.0, z: 1.0, duration: 0.28, ease: 'back.out(2)' });

        gsap.to(flapPivot.rotation, {
          x: -Math.PI * 0.88,
          duration: 0.65,
          ease: 'power3.inOut'
        });

        gsap.to(cardMesh.position, {
          y: 1.25,
          z: 0.25,
          duration: 0.7,
          delay: 0.15,
          ease: 'power3.out'
        });
      }
    };

    // Parallax on mouse
    let targetRotX = 0.18;
    let targetRotY = -0.22;
    window.addEventListener('mousemove', (e) => {
      if (isOpening) return;
      const normX = (e.clientX / window.innerWidth - 0.5) * 0.5;
      const normY = (e.clientY / window.innerHeight - 0.5) * 0.4;
      targetRotY = -0.22 + normX;
      targetRotX = 0.18 + normY;
    });

    // 4. Render Loop
    const clock = new THREE.Clock();
    let animId;

    function animate() {
      animId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      if (!isOpening) {
        mailGroup.position.y = Math.sin(t * 1.8) * 0.12;
        mailGroup.rotation.z = 0.14 + Math.sin(t * 1.2) * 0.02;
        mailGroup.rotation.y += (targetRotY - mailGroup.rotation.y) * 0.06;
        mailGroup.rotation.x += (targetRotX - mailGroup.rotation.x) * 0.06;
      }

      // Heart seal subtle pulse
      const s = 0.42 + Math.sin(t * 3.5) * 0.015;
      heartMesh.scale.set(s, s, s);

      // Mini floating hearts
      heartParticles.forEach(p => {
        p.mesh.position.y = p.baseY + Math.sin(t * 1.5 + p.offset) * 0.18;
        p.mesh.rotation.y += p.rotSpeed;
      });

      renderer.render(scene, camera);
    }
    animate();

    // Resize
    function handleResize() {
      const w = container.clientWidth || 140;
      const h = container.clientHeight || 100;
      if (w === 0 || h === 0) return;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);
    }
    window.addEventListener('resize', handleResize);
    if (typeof ResizeObserver !== 'undefined' && container) {
      new ResizeObserver(handleResize).observe(container);
    }
  }

  if (document.readyState === 'loading') {
    window.addEventListener('DOMContentLoaded', initMail3D);
  } else {
    initMail3D();
  }
})();
