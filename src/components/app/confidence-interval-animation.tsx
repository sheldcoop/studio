
'use client';

import { useEffect, useRef, useMemo } from 'react';
import * as THREE from 'three';
import { cn } from '@/lib/utils';

interface CorrelationOrbAnimationProps {
  className?: string;
  onPointerEnter: () => void;
  onPointerLeave: () => void;
}

export function ConfidenceIntervalAnimation({
  className,
  onPointerEnter,
  onPointerLeave,
}: CorrelationOrbAnimationProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const mouse = useRef({ x: 0, y: 0 });
  const isMouseOver = useRef(false);

  const particleMaterial = useMemo(
    () =>
      new THREE.PointsMaterial({
        color: 0x22c55e,
        size: 0.15,
        blending: THREE.AdditiveBlending,
        transparent: true,
        opacity: 0.9,
        sizeAttenuation: true,
      }),
    []
  );

  const axisMaterial = useMemo(
    () => new THREE.LineBasicMaterial({ color: 0x22c55e, transparent: true, opacity: 0 }),
    []
  );

  useEffect(() => {
    if (!mountRef.current) return;
    const currentMount = mountRef.current;
    let frameId: number;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      currentMount.clientWidth / currentMount.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 15);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    currentMount.appendChild(renderer.domElement);

    const orbGroup = new THREE.Group();
    scene.add(orbGroup);

    // --- Particles ---
    const particleCount = 1000;
    const particlesGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const particleData = [];

    const sphereRadius = 6;
    for (let i = 0; i < particleCount; i++) {
      const theta = Math.random() * 2 * Math.PI;
      const phi = Math.acos(2 * Math.random() - 1);
      
      // Store original spherical coordinates
      particleData.push({
        theta,
        phi,
        randomPhase: Math.random() * Math.PI * 2,
        randomSpeed: 0.1 + Math.random() * 0.2,
      });

      positions[i * 3] = sphereRadius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = sphereRadius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = sphereRadius * Math.cos(phi);
    }
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particleSystem = new THREE.Points(particlesGeometry, particleMaterial);
    orbGroup.add(particleSystem);

    // --- Axis Line ---
    const axisGeometry = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, -10, 0),
      new THREE.Vector3(0, 10, 0),
    ]);
    const axisLine = new THREE.Line(axisGeometry, axisMaterial);
    orbGroup.add(axisLine);

    const clock = new THREE.Clock();
    const targetRotation = { x: 0, y: 0 };
    let correlationFactor = 0;

    const animate = () => {
      frameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const elapsedTime = clock.getElapsedTime();

      // --- Update Interaction State ---
      const targetCorrelation = isMouseOver.current ? 1 : 0;
      correlationFactor += (targetCorrelation - correlationFactor) * 0.05;

      (axisLine.material as THREE.LineBasicMaterial).opacity = correlationFactor * 0.7;

      // --- Update Particle Positions ---
      const currentPositions = particleSystem.geometry.getAttribute('position') as THREE.BufferAttribute;
      for (let i = 0; i < particleCount; i++) {
        const { theta, phi, randomPhase, randomSpeed } = particleData[i];

        // State 1: Random drift
        const randomX = sphereRadius * Math.sin(phi) * Math.cos(theta + elapsedTime * randomSpeed * 0.5);
        const randomY = sphereRadius * Math.sin(phi) * Math.sin(theta + elapsedTime * randomSpeed * 0.5);
        const randomZ = sphereRadius * Math.cos(phi);

        // State 2: Correlated ellipse
        const ellipseAngle = elapsedTime * 0.5 + i * 0.1;
        const ellipseRadiusX = sphereRadius * Math.sin(phi);
        const ellipseRadiusY = sphereRadius * Math.sin(phi) * 0.3; // Make it an ellipse
        
        // Align ellipse to a rotated axis
        const axis = new THREE.Vector3(0.5, 1, 0).normalize();
        const ellipsePoint = new THREE.Vector3(
          ellipseRadiusX * Math.cos(ellipseAngle),
          ellipseRadiusY * Math.sin(ellipseAngle),
          sphereRadius * Math.cos(phi) // this seems off but gives a decent 3d feel
        );
        ellipsePoint.applyAxisAngle(axis, Math.PI / 4);

        // Interpolate between states
        const currentVec = new THREE.Vector3(currentPositions.getX(i), currentPositions.getY(i), currentPositions.getZ(i));
        const randomVec = new THREE.Vector3(randomX, randomY, randomZ);
        const correlatedVec = ellipsePoint;

        const targetVec = randomVec.lerp(correlatedVec, correlationFactor);
        currentVec.lerp(targetVec, 0.1);

        currentPositions.setXYZ(i, currentVec.x, currentVec.y, currentVec.z);
      }
      currentPositions.needsUpdate = true;

      // --- Update Group Rotation ---
      targetRotation.y = -mouse.current.x * 0.5;
      targetRotation.x = mouse.current.y * 0.5;
      
      orbGroup.rotation.x += (targetRotation.x - orbGroup.rotation.x) * 0.05;
      orbGroup.rotation.y += (targetRotation.y - orbGroup.rotation.y) * 0.05;

      renderer.render(scene, camera);
    };

    animate();

    // --- Event Listeners ---
    const handleMouseMove = (event: MouseEvent) => {
      if (currentMount) {
        const rect = currentMount.getBoundingClientRect();
        mouse.current.x = (event.clientX - rect.left) / rect.width - 0.5;
        mouse.current.y = (event.clientY - rect.top) / rect.height - 0.5;
      }
    };
    const handleMouseEnter = () => { isMouseOver.current = true; onPointerEnter(); };
    const handleMouseLeave = () => { isMouseOver.current = false; onPointerLeave(); };

    currentMount.addEventListener('mousemove', handleMouseMove);
    currentMount.addEventListener('mouseenter', handleMouseEnter);
    currentMount.addEventListener('mouseleave', handleMouseLeave);

    const handleResize = () => {
      if (currentMount) {
        camera.aspect = currentMount.clientWidth / currentMount.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
      }
    };
    window.addEventListener('resize', handleResize);

    // --- Cleanup ---
    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', handleResize);
      if (currentMount) {
        currentMount.removeEventListener('mousemove', handleMouseMove);
        currentMount.removeEventListener('mouseenter', handleMouseEnter);
        currentMount.removeEventListener('mouseleave', handleMouseLeave);
        currentMount.removeChild(renderer.domElement);
      }
      renderer.dispose();
      particleMaterial.dispose();
      axisMaterial.dispose();
      particlesGeometry.dispose();
      axisGeometry.dispose();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div ref={mountRef} className={cn('h-full w-full', className)} />;
}
