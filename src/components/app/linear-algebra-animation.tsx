
'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { cn } from '@/lib/utils';

interface LinearAlgebraAnimationProps {
  className?: string;
  onPointerEnter: () => void;
  onPointerLeave: () => void;
}

export function LinearAlgebraAnimation({
  className,
  onPointerEnter,
  onPointerLeave,
}: LinearAlgebraAnimationProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const mouse = useRef({ x: 0, y: 0 });
  const isMouseOver = useRef(false);

  useEffect(() => {
    if (!mountRef.current) return;
    const currentMount = mountRef.current;

    const primaryColor = new THREE.Color(0x00ffaa);

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

    // --- Grid creation ---
    const gridGroup = new THREE.Group();
    scene.add(gridGroup);
    
    const pointCloudMaterial = new THREE.PointsMaterial({
        color: primaryColor,
        size: 0.25,
        transparent: true,
        opacity: 0.85,
        blending: THREE.AdditiveBlending,
    });

    const points = [];
    const gridSize = 10;
    const gridDivisions = 10;
    const step = gridSize / gridDivisions;

    for (let i = -gridSize / 2; i <= gridSize / 2; i += step) {
        for (let j = -gridSize / 2; j <= gridSize / 2; j += step) {
            for (let k = -gridSize / 2; k <= gridSize/2; k += step) {
                 points.push(new THREE.Vector3(i, j, k));
            }
        }
    }
    
    const pointCloudGeometry = new THREE.BufferGeometry().setFromPoints(points);
    const pointCloud = new THREE.Points(pointCloudGeometry, pointCloudMaterial);
    gridGroup.add(pointCloud);

    // --- Animation & Interaction ---
    const clock = new THREE.Clock();
    const targetRotation = new THREE.Euler(0, 0, 0);
    const targetScale = new THREE.Vector3(1, 1, 1);

    const animate = () => {
      requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      if (isMouseOver.current) {
        targetRotation.y = mouse.current.x * Math.PI * 0.5; // Rotate up to 90 degrees
        targetRotation.x = mouse.current.y * Math.PI * 0.5;
        const scale = Math.max(0.5, 1 + mouse.current.y); // Scale from 0.5x to 2x
        targetScale.set(scale, scale, scale);
      } else {
        // Default slow rotation
        targetRotation.y = elapsedTime * 0.1;
        targetRotation.x = elapsedTime * 0.08;
        targetScale.set(1, 1, 1);
      }

      // Easing / Smoothing
      gridGroup.rotation.y += (targetRotation.y - gridGroup.rotation.y) * 0.05;
      gridGroup.rotation.x += (targetRotation.x - gridGroup.rotation.x) * 0.05;
      gridGroup.scale.lerp(targetScale, 0.05);

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
      pointCloudGeometry.dispose();
      pointCloudMaterial.dispose();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div ref={mountRef} className={cn('h-full w-full', className)} />;
}
