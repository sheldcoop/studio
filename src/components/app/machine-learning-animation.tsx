
'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { cn } from '@/lib/utils';

interface MachineLearningAnimationProps {
  className?: string;
  onPointerEnter: () => void;
  onPointerLeave: () => void;
}

export function MachineLearningAnimation({
  className,
  onPointerEnter,
  onPointerLeave,
}: MachineLearningAnimationProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const mouse = useRef({ x: 0, y: 0 });
  const isMouseOver = useRef(false);
  const pointsRef = useRef<THREE.Points | null>(null);
  const originalPositions = useRef<Float32Array | null>(null);

  useEffect(() => {
    if (!mountRef.current) return;
    const currentMount = mountRef.current;

    // --- Scene setup ---
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      currentMount.clientWidth / currentMount.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 15;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    currentMount.appendChild(renderer.domElement);

    // --- Data Cloud ---
    const particles = 2000;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particles * 3);

    for (let i = 0; i < particles; i++) {
      // Create points in an ellipsoid shape to represent correlated data
      const u = Math.random();
      const v = Math.random();
      const theta = 2 * Math.PI * u;
      const phi = Math.acos(2 * v - 1);
      const x = 8 * Math.sin(phi) * Math.cos(theta);
      const y = 4 * Math.sin(phi) * Math.sin(theta);
      const z = 2 * Math.cos(phi);

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    originalPositions.current = positions.slice(); // Save original state

    const material = new THREE.PointsMaterial({
      color: 0x58a6ff,
      size: 0.08,
      transparent: true,
      opacity: 0.7,
    });
    
    const points = new THREE.Points(geometry, material);
    pointsRef.current = points;
    scene.add(points);

    // --- Animation & Interaction ---
    const clock = new THREE.Clock();

    const animate = () => {
      requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();
      
      if (pointsRef.current && originalPositions.current) {
        const positions = pointsRef.current.geometry.getAttribute('position').array as Float32Array;
        
        for (let i = 0; i < particles; i++) {
          const z_original = originalPositions.current[i * 3 + 2];
          const z_current = positions[i * 3 + 2];
          
          if (isMouseOver.current) {
            // Lerp towards z=0 (flatten to 2D plane)
            positions[i * 3 + 2] += (0 - z_current) * 0.05;
          } else {
            // Lerp back to original z position
            positions[i * 3 + 2] += (z_original - z_current) * 0.05;
          }
        }
        pointsRef.current.geometry.getAttribute('position').needsUpdate = true;
      }
      
      points.rotation.y = elapsedTime * 0.1;
      points.rotation.x = elapsedTime * 0.05;

      renderer.render(scene, camera);
    };

    animate();

    // --- Event Listeners ---
    const handleMouseMove = (event: MouseEvent) => {
        if (currentMount) {
            const rect = currentMount.getBoundingClientRect();
            mouse.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
            mouse.current.y = -(((event.clientY - rect.top) / rect.height) * 2 - 1);
        }
    };
    
    const handleMouseEnter = () => { isMouseOver.current = true; onPointerEnter(); }
    const handleMouseLeave = () => { isMouseOver.current = false; onPointerLeave(); }

    currentMount.addEventListener('mousemove', handleMouseMove);
    currentMount.addEventListener('mouseenter', handleMouseEnter);
    currentMount.addEventListener('mouseleave', handleMouseLeave);

    // --- Resize handler ---
    const handleResize = () => {
        if (currentMount) {
            renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
            camera.aspect = currentMount.clientWidth / currentMount.clientHeight;
            camera.updateProjectionMatrix();
        }
    };
    window.addEventListener('resize', handleResize);

    // --- Cleanup ---
    return () => {
      window.removeEventListener('resize', handleResize);
      if (currentMount) {
        currentMount.removeEventListener('mousemove', handleMouseMove);
        currentMount.removeEventListener('mouseenter', handleMouseEnter);
        currentMount.removeEventListener('mouseleave', handleMouseLeave);
        // eslint-disable-next-line react-hooks/exhaustive-deps
        currentMount.removeChild(renderer.domElement);
      }
      renderer.dispose();
      geometry.dispose();
      material.dispose();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div ref={mountRef} className={cn('h-full w-full', className)} />;
}
