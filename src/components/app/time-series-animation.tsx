
'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { cn } from '@/lib/utils';
import { useTheme } from 'next-themes';

interface TimeSeriesAnimationProps {
  className?: string;
  onPointerEnter: () => void;
  onPointerLeave: () => void;
}

export function TimeSeriesAnimation({
  className,
  onPointerEnter,
  onPointerLeave,
}: TimeSeriesAnimationProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const mouse = useRef({ x: 0, y: 0 });
  const isMouseOver = useRef(false);
  const { theme } = useTheme();

  useEffect(() => {
    if (!mountRef.current) return;
    const currentMount = mountRef.current;
    let animationFrameId: number;

    // Use requestAnimationFrame to ensure CSS variables are applied before we read them
    animationFrameId = requestAnimationFrame(() => {
      if (!currentMount) return;
      let frameId: number;

      const computedStyle = getComputedStyle(currentMount);
      const primaryColorValue = computedStyle.getPropertyValue('--animation-primary-color').trim();
      const opacityValue = parseFloat(computedStyle.getPropertyValue('--animation-opacity').trim());
      const primaryColor = new THREE.Color(primaryColorValue);


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
      const grid = new THREE.GridHelper(20, 20);
      const gridMaterial = grid.material as THREE.LineBasicMaterial;
      gridMaterial.color.set(primaryColor);
      gridMaterial.transparent = true;
      gridMaterial.opacity = 0.4;
      grid.rotation.x = Math.PI / 2;
      scene.add(grid);

      // --- Line ---
      const lineSegments = 200;
      const lineGeometry = new THREE.BufferGeometry();
      const linePositions = new Float32Array((lineSegments + 1) * 3);
      lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
      
      const lineMaterial = new THREE.LineBasicMaterial({
        linewidth: 3,
        transparent: true,
      });
      lineMaterial.color.set(primaryColor);
      lineMaterial.opacity = opacityValue;
      
      const line = new THREE.Line(lineGeometry, lineMaterial);
      scene.add(line);

      // --- Animation & Interaction ---
      const clock = new THREE.Clock();
      let targetVolatility = 0.5;

      const animate = () => {
        frameId = requestAnimationFrame(animate);
        const elapsedTime = clock.getElapsedTime();

        if (isMouseOver.current) {
          targetVolatility = (mouse.current.y + 1) * 1.5; // Map mouse Y to volatility (0 to 3)
        } else {
          targetVolatility += (0.5 - targetVolatility) * 0.1; // Ease back to default
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

      const handleResize = () => {
        if (currentMount) {
          camera.aspect = currentMount.clientWidth / currentMount.clientHeight;
          camera.updateProjectionMatrix();
          renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
        }
      };
      window.addEventListener('resize', handleResize);

      // Cleanup for this specific animation frame setup
      return () => {
        cancelAnimationFrame(frameId);
        window.removeEventListener('resize', handleResize);
        if (renderer.domElement && currentMount.contains(renderer.domElement)) {
          currentMount.removeChild(renderer.domElement);
        }
        renderer.dispose();
        lineGeometry.dispose();
        lineMaterial.dispose();
        grid.geometry.dispose();
        (grid.material as THREE.Material).dispose();
      };
    });


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
    
    const handleTouchStart = (event: TouchEvent) => {
      isMouseOver.current = true;
      onPointerEnter();
      if (event.touches.length > 0 && currentMount) {
        const touch = event.touches[0];
        const rect = currentMount.getBoundingClientRect();
        mouse.current.x = ((touch.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.current.y = -(((touch.clientY - rect.top) / rect.height) * 2 - 1);
      }
    };
    
    const handleTouchEnd = () => { isMouseOver.current = false; onPointerLeave(); };

    const handleTouchMove = (event: TouchEvent) => {
      if (event.touches.length > 0 && currentMount) {
        const touch = event.touches[0];
        const rect = currentMount.getBoundingClientRect();
        mouse.current.x = ((touch.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.current.y = -(((touch.clientY - rect.top) / rect.height) * 2 - 1);
      }
    };

    currentMount.addEventListener('mousemove', handleMouseMove);
    currentMount.addEventListener('mouseenter', handleMouseEnter);
    currentMount.addEventListener('mouseleave', handleMouseLeave);
    currentMount.addEventListener('touchstart', handleTouchStart, { passive: true });
    currentMount.addEventListener('touchend', handleTouchEnd);
    currentMount.addEventListener('touchmove', handleTouchMove, { passive: true });


    // --- Main Cleanup ---
    return () => {
      cancelAnimationFrame(animationFrameId);
      if (currentMount) {
        currentMount.removeEventListener('mousemove', handleMouseMove);
        currentMount.removeEventListener('mouseenter', handleMouseEnter);
        currentMount.removeEventListener('mouseleave', handleMouseLeave);
        currentMount.removeEventListener('touchstart', handleTouchStart);
        currentMount.removeEventListener('touchend', handleTouchEnd);
        currentMount.removeEventListener('touchmove', handleTouchMove);
        // Clean up any remaining children from previous renders
        while (currentMount.firstChild) {
            currentMount.removeChild(currentMount.firstChild);
        }
      }
    };
  }, [theme, onPointerEnter, onPointerLeave]);

  return <div ref={mountRef} className={cn('h-full w-full', className)} />;
}
