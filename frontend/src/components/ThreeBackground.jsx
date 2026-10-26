import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import styles from '../styles/auth.module.css';

/**
 * ThreeBackground
 * Fresh, vibrant 3D geometric wireframe globe and colorful particle constellation
 * Cyan, Sapphire Blue, and Emerald Green lighting & particles.
 * Responsive, 60fps non-blocking Three.js canvas.
 */
const ThreeBackground = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    // --- 1. Scene Setup ---
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0b132b, 0.035);

    const width = currentMount.clientWidth || window.innerWidth;
    const height = currentMount.clientHeight || window.innerHeight;

    // --- 2. Camera Setup ---
    const camera = new THREE.PerspectiveCamera(55, width / height, 0.1, 1000);
    camera.position.z = 17;

    // --- 3. High Performance Renderer ---
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0); // Transparent to blend with vibrant CSS gradient
    currentMount.appendChild(renderer.domElement);

    // --- 4. Fresh & Vibrant Colorful Lighting ---
    // Ambient light with soft indigo-blue
    const ambientLight = new THREE.AmbientLight(0x1e293b, 1.4);
    scene.add(ambientLight);

    // Key light with bright Electric Cyan / Sky Blue
    const keyLight = new THREE.PointLight(0x38bdf8, 3.2, 85);
    keyLight.position.set(12, 16, 18);
    scene.add(keyLight);

    // Fill light with warm Emerald Green (symbol of jobs & prosperity)
    const fillLight = new THREE.PointLight(0x10b981, 2.5, 65);
    fillLight.position.set(-14, -10, 10);
    scene.add(fillLight);

    // Secondary rim light with soft Violet/Indigo
    const rimLight = new THREE.PointLight(0x6366f1, 2.0, 50);
    rimLight.position.set(0, -15, -10);
    scene.add(rimLight);

    // --- 5. 3D Geometric Wireframe Globe Group ---
    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // Outer Geodesic Sphere (Sky Blue & Sapphire Wireframe)
    const globeGeometry = new THREE.IcosahedronGeometry(6.2, 2);
    const wireframeGeometry = new THREE.WireframeGeometry(globeGeometry);
    const wireframeMaterial = new THREE.LineBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.38,
      blending: THREE.AdditiveBlending,
    });
    const wireframeMesh = new THREE.LineSegments(wireframeGeometry, wireframeMaterial);
    rootGroup.add(wireframeMesh);

    // Inner Counter-Rotating Core (Vibrant Emerald Green)
    const innerGeometry = new THREE.IcosahedronGeometry(3.6, 1);
    const innerWireframe = new THREE.WireframeGeometry(innerGeometry);
    const innerMaterial = new THREE.LineBasicMaterial({
      color: 0x10b981,
      transparent: true,
      opacity: 0.3,
      blending: THREE.AdditiveBlending,
    });
    const innerCoreMesh = new THREE.LineSegments(innerWireframe, innerMaterial);
    rootGroup.add(innerCoreMesh);

    // Bright Sparkle Nodes on Outer Vertices
    const vertices = [];
    const posAttribute = globeGeometry.attributes.position;
    for (let i = 0; i < posAttribute.count; i++) {
      vertices.push(posAttribute.getX(i), posAttribute.getY(i), posAttribute.getZ(i));
    }
    const pointsGeometry = new THREE.BufferGeometry();
    pointsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));

    const pointsMaterial = new THREE.PointsMaterial({
      color: 0xa5f3fc,
      size: 0.24,
      transparent: true,
      opacity: 0.95,
      blending: THREE.AdditiveBlending,
    });
    const vertexPoints = new THREE.Points(pointsGeometry, pointsMaterial);
    rootGroup.add(vertexPoints);

    // --- 6. Multicolored Floating Particle Dust Constellation ---
    const particleCount = 450;
    const particlePositions = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);

    const colorPalette = [
      new THREE.Color(0x38bdf8), // Sky Blue
      new THREE.Color(0x10b981), // Emerald Green
      new THREE.Color(0x60a5fa), // Royal Blue
      new THREE.Color(0xf59e0b), // Warm Amber
      new THREE.Color(0x34d399), // Mint Green
    ];

    for (let i = 0; i < particleCount; i++) {
      const radius = 9 + Math.random() * 16;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      particlePositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      particlePositions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      particlePositions[i * 3 + 2] = radius * Math.cos(phi);

      const color = colorPalette[Math.floor(Math.random() * colorPalette.length)];
      particleColors[i * 3] = color.r;
      particleColors[i * 3 + 1] = color.g;
      particleColors[i * 3 + 2] = color.b;
    }

    const dustGeometry = new THREE.BufferGeometry();
    dustGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    dustGeometry.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));

    const dustMaterial = new THREE.PointsMaterial({
      size: 0.14,
      vertexColors: true,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
    });

    const dustParticles = new THREE.Points(dustGeometry, dustMaterial);
    scene.add(dustParticles);

    // --- 7. Mouse Parallax Tracking ---
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const windowHalfX = window.innerWidth / 2;
    const windowHalfY = window.innerHeight / 2;

    const handleMouseMove = (event) => {
      mouseX = (event.clientX - windowHalfX) * 0.0006;
      mouseY = (event.clientY - windowHalfY) * 0.0006;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // --- 8. Window Resize Handler ---
    const handleResize = () => {
      if (!currentMount) return;
      const newWidth = currentMount.clientWidth || window.innerWidth;
      const newHeight = currentMount.clientHeight || window.innerHeight;

      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();

      renderer.setSize(newWidth, newHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };

    window.addEventListener('resize', handleResize);

    // --- 9. Animation Loop ---
    let animationFrameId;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();

      // Smooth mouse damping
      targetX += (mouseX - targetX) * 0.05;
      targetY += (mouseY - targetY) * 0.05;

      // Primary Globe Rotation
      wireframeMesh.rotation.y = elapsedTime * 0.09 + targetX;
      wireframeMesh.rotation.x = Math.sin(elapsedTime * 0.04) * 0.2 + targetY;

      vertexPoints.rotation.y = wireframeMesh.rotation.y;
      vertexPoints.rotation.x = wireframeMesh.rotation.x;

      // Inner Core Counter-Rotation
      innerCoreMesh.rotation.y = -elapsedTime * 0.14 - targetX * 0.5;
      innerCoreMesh.rotation.z = Math.cos(elapsedTime * 0.06) * 0.25;

      // Particle Cloud Slow Drift
      dustParticles.rotation.y = elapsedTime * 0.03 + targetX * 0.3;
      dustParticles.rotation.x = Math.sin(elapsedTime * 0.02) * 0.1;

      // Gentle Camera Pulse
      camera.position.x = Math.sin(elapsedTime * 0.15) * 0.35;
      camera.position.y = Math.cos(elapsedTime * 0.12) * 0.35;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };

    animate();

    // --- 10. Clean Up on Unmount ---
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);

      if (currentMount && renderer.domElement) {
        currentMount.removeChild(renderer.domElement);
      }

      globeGeometry.dispose();
      wireframeGeometry.dispose();
      wireframeMaterial.dispose();
      innerGeometry.dispose();
      innerWireframe.dispose();
      innerMaterial.dispose();
      pointsGeometry.dispose();
      pointsMaterial.dispose();
      dustGeometry.dispose();
      dustMaterial.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className={styles.canvasContainer}
      aria-hidden="true"
    />
  );
};

export default ThreeBackground;
