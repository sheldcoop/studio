
'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { cn } from '@/lib/utils';
import { useTheme } from 'next-themes';

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
  const { theme } = useTheme();

  useEffect(() => {
    if (!mountRef.current) return;
    const currentMount = mountRef.current;
    let frameId: number;
    
    const primaryColor = new THREE.Color(
      theme === 'dark' ? '#00ffaa' : '#111827'
    );
    const opacityValue = 0.85;

    const particleMaterial = new THREE.PointsMaterial({
        size: 0.2,
        blending: THREE.AdditiveBlending,
        transparent: true,
        sizeAttenuation: true,
      });
    particleMaterial.color.set(primaryColor);
    particleMaterial.opacity = opacityValue;


    const axisMaterial = new THREE.LineBasicMaterial({ transparent: true, opacity: 0 });
    axisMaterial.color.set(primaryColor);

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
    const particleCount = 1500;
    const particlesGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const particleData = [];

    const sphereRadius = 7;
    for (let i = 0; i < particleCount; i++) {
      const theta = Math.random() * 2 * Math.PI;
      const phi = Math.acos(2 * Math.random() - 1);
      
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
      new THREE.Vector3(0, -12, 0),
      new THREE.Vector3(0, 12, 0),
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

      const targetCorrelation = isMouseOver.current ? 1 : 0;
      correlationFactor += (targetCorrelation - correlationFactor) * 0.1;

      (axisLine.material as THREE.LineBasicMaterial).opacity = correlationFactor * 0.9;

      const currentPositions = particleSystem.geometry.getAttribute('position') as THREE.BufferAttribute;
      for (let i = 0; i < particleCount; i++) {
        const { theta, phi, randomSpeed } = particleData[i];

        const randomX = sphereRadius * Math.sin(phi) * Math.cos(theta + elapsedTime * randomSpeed * 0.3);
        const randomY = sphereRadius * Math.sin(phi) * Math.sin(theta + elapsedTime * randomSpeed * 0.3);
        const randomZ = sphereRadius * Math.cos(phi);

        const ellipseAngle = elapsedTime * 0.8 + i * 0.1;
        const ellipseRadiusX = sphereRadius * Math.sin(phi);
        const ellipseRadiusY = sphereRadius * Math.sin(phi) * 0.2;
        
        const axis = new THREE.Vector3(0.5, 1, 0).normalize();
        const ellipsePoint = new THREE.Vector3(
          ellipseRadiusX * Math.cos(ellipseAngle),
          ellipseRadiusY * Math.sin(ellipseAngle),
          sphereRadius * Math.cos(phi)
        );
        ellipsePoint.applyAxisAngle(axis, Math.PI / 4);

        const currentVec = new THREE.Vector3(currentPositions.getX(i), currentPositions.getY(i), currentPositions.getZ(i));
        const randomVec = new THREE.Vector3(randomX, randomY, randomZ);
        const correlatedVec = ellipsePoint;

        const targetVec = randomVec.lerp(correlatedVec, correlationFactor);
        currentVec.lerp(targetVec, 0.1);

        currentPositions.setXYZ(i, currentVec.x, currentVec.y, currentVec.z);
      }
      currentPositions.needsUpdate = true;

      targetRotation.y = -mouse.current.x * 0.5;
      targetRotation.x = mouse.current.y * 0.5;
      
      orbGroup.rotation.x += (targetRotation.x - orbGroup.rotation.x) * 0.05;
      orbGroup.rotation.y += (targetRotation.y - orbGroup.rotation.y) * 0.05;

      renderer.render(scene, camera);
    };

    animate();

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

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', handleResize);
      if (currentMount) {
        currentMount.removeEventListener('mousemove', handleMouseMove);
        currentMount.removeEventListener('mouseenter', handleMouseEnter);
        currentMount.removeEventListener('mouseleave', handleMouseLeave);
        if (renderer.domElement) currentMount.removeChild(renderer.domElement);
      }
      renderer.dispose();
      particleMaterial.dispose();
      axisMaterial.dispose();
      particlesGeometry.dispose();
      axisGeometry.dispose();
    };
  }, [theme, onPointerEnter, onPointerLeave]);

  return <div ref={mountRef} className={cn('h-full w-full', className)} />;
}
