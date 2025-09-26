
'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { cn } from '@/lib/utils';

interface TimeSeriesAnimationProps {
  className?: string;
}

export function TimeSeriesAnimation({
  className,
}: TimeSeriesAnimationProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const mouse = useRef({ x: 0, y: 0 });
  const isMouseOver = useRef(false);

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
    camera.position.z = 8;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(
      currentMount.clientWidth,
      currentMount.clientHeight
    );
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    currentMount.appendChild(renderer.domElement);
    
    // --- Grid ---
    const grid = new THREE.GridHelper(20, 20, 0x22c55e, 0x22c55e);
    grid.material.transparent = true;
    grid.material.opacity = 0.3;
    grid.rotation.x = Math.PI / 2;
    scene.add(grid);

    // --- Line ---
    const lineSegments = 200;
    const lineGeometry = new THREE.BufferGeometry();
    const linePositions = new Float32Array((lineSegments + 1) * 3);
    lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
    
    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0x22c55e,
      linewidth: 3,
      transparent: true,
      opacity: 0.9
    });
    
    const line = new THREE.Line(lineGeometry, lineMaterial);
    scene.add(line);

    // --- Animation & Interaction ---
    const clock = new THREE.Clock();
    let targetVolatility = 0.5;

    const animate = () => {
      const elapsedTime = clock.getElapsedTime();
      requestAnimationFrame(animate);

      if (isMouseOver.current) {
        targetVolatility = (mouse.current.y + 1) * 1.5; // Map mouse Y to volatility (0 to 3)
      } else {
        targetVolatility = 0.5; // Default low volatility
      }

      const positions = line.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i <= lineSegments; i++) {
        const x = (i / lineSegments - 0.5) * 20;
        const y = Math.sin(i * 0.2 + elapsedTime * 2) * targetVolatility;
        positions[i * 3] = x;
        positions[i * 3 + 1] = y;
        positions[i * 3 + 2] = 0;
      }
      line.geometry.attributes.position.needsUpdate = true;
      
      line.rotation.y = elapsedTime * 0.05; // Slow rotation

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

    const handleMouseEnter = () => { isMouseOver.current = true; }
    const handleMouseLeave = () => { isMouseOver.current = false; }

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
      lineGeometry.dispose();
      lineMaterial.dispose();
      grid.geometry.dispose();
      grid.material.dispose();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div ref={mountRef} className={cn('h-full w-full', className)} />;
}
