
'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { cn } from '@/lib/utils';
import { useTheme } from 'next-themes';

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
  const { theme } = useTheme();

  useEffect(() => {
    if (!mountRef.current) return;
    const currentMount = mountRef.current;
    let animationFrameId: number;

    const cleanupFunctions: (() => void)[] = [];

    const timeoutId = setTimeout(() => {
      if (!currentMount) return;

      const computedStyle = getComputedStyle(document.documentElement);
      const primaryColorValue = computedStyle.getPropertyValue('--animation-primary-color').trim();
      const opacityValue = parseFloat(computedStyle.getPropertyValue('--animation-opacity').trim());

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(
        75,
        currentMount.clientWidth / currentMount.clientHeight,
        0.1,
        1000
      );
      camera.position.z = 12;

      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      currentMount.appendChild(renderer.domElement);
      cleanupFunctions.push(() => {
        if (renderer.domElement.parentElement === currentMount) {
          currentMount.removeChild(renderer.domElement);
        }
        renderer.dispose();
      });

      const sprites: THREE.Sprite[] = [];
      const symbols = ['0', '1']; // Using binary to represent machine learning data
      const particleCount = 150;

      for (let i = 0; i < particleCount; i++) {
        const canvas = document.createElement('canvas');
        canvas.width = 128;
        canvas.height = 128;
        const ctx = canvas.getContext('2d');
        
        if (ctx) {
          ctx.fillStyle = primaryColorValue;
          ctx.font = 'bold 90px "Courier New", Courier, monospace';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(symbols[Math.floor(Math.random() * symbols.length)], 64, 64);
        }

        const texture = new THREE.CanvasTexture(canvas);
        const material = new THREE.SpriteMaterial({
          map: texture,
          transparent: true,
          opacity: opacityValue * 0.8,
        });
        const sprite = new THREE.Sprite(material);

        sprite.position.set(
          (Math.random() - 0.5) * 25,
          (Math.random() - 0.5) * 15,
          (Math.random() - 0.5) * 15
        );

        const size = 0.2 + Math.random() * 0.9;
        sprite.scale.set(size, size, 1);

        sprite.userData = {
          velocity: new THREE.Vector3(
            (Math.random() - 0.5) * 0.04,
            (Math.random() - 0.5) * 0.04,
            (Math.random() - 0.5) * 0.04
          ),
        };

        scene.add(sprite);
        sprites.push(sprite);
      }
      
      cleanupFunctions.push(() => {
        sprites.forEach((sprite) => {
          sprite.material.map?.dispose();
          sprite.material.dispose();
        });
      });

      const clock = new THREE.Clock();
      let interactionStrength = 0;

      const animate = () => {
        animationFrameId = requestAnimationFrame(animate);
        const elapsedTime = clock.getElapsedTime();

        if (isMouseOver.current) {
          interactionStrength += (1 - interactionStrength) * 0.05;
        } else {
          interactionStrength += (0 - interactionStrength) * 0.05;
        }

        sprites.forEach((sprite) => {
          sprite.position.add(sprite.userData.velocity);

          if (isMouseOver.current && interactionStrength > 0.1) {
            const mousePos = new THREE.Vector3(mouse.current.x * 12, mouse.current.y * 7, 0);
            const direction = sprite.position.clone().sub(mousePos);
            const distance = direction.length();

            if (distance < 4) {
              direction.normalize();
              const force = (1 - distance / 4) * 0.15 * interactionStrength;
              sprite.position.add(direction.multiplyScalar(force));
            }
          }

          // Wrap around screen edges
          if (Math.abs(sprite.position.x) > 12) sprite.position.x *= -1;
          if (Math.abs(sprite.position.y) > 7) sprite.position.y *= -1;
          if (Math.abs(sprite.position.z) > 7) sprite.position.z *= -1;

          // Pulsing scale
          const pulse = 1 + Math.sin(elapsedTime * 3 + sprite.position.y) * 0.1;
          sprite.scale.x = sprite.scale.y * pulse;
        });

        renderer.render(scene, camera);
      };

      animate();

      const handleMouseMove = (event: MouseEvent) => {
        if (currentMount) {
          const rect = currentMount.getBoundingClientRect();
          mouse.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
          mouse.current.y = -(((event.clientY - rect.top) / rect.height) * 2 - 1);
        }
      };

      const handleMouseEnter = () => { isMouseOver.current = true; onPointerEnter(); };
      const handleMouseLeave = () => { isMouseOver.current = false; onPointerLeave(); };

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
      
      cleanupFunctions.push(() => {
        currentMount.removeEventListener('mousemove', handleMouseMove);
        currentMount.removeEventListener('mouseenter', handleMouseEnter);
        currentMount.removeEventListener('mouseleave', handleMouseLeave);
        currentMount.removeEventListener('touchstart', handleTouchStart);
        currentMount.removeEventListener('touchend', handleTouchEnd);
        currentMount.removeEventListener('touchmove', handleTouchMove);
      });

      const handleResize = () => {
        if (currentMount) {
          camera.aspect = currentMount.clientWidth / currentMount.clientHeight;
          camera.updateProjectionMatrix();
          renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
        }
      };
      window.addEventListener('resize', handleResize);
      cleanupFunctions.push(() => window.removeEventListener('resize', handleResize));
      
      cleanupFunctions.push(() => cancelAnimationFrame(animationFrameId));

    }, 10);

    return () => {
      clearTimeout(timeoutId);
      cleanupFunctions.forEach(fn => fn());
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      while (currentMount.firstChild) {
        currentMount.removeChild(currentMount.firstChild);
      }
    };
  }, [theme, onPointerEnter, onPointerLeave]);

  return <div ref={mountRef} className={cn('h-full w-full', className)} />;
}
