
'use client';

import { useRef } from 'react';
import * as THREE from 'three';
import { cn } from '@/lib/utils';
import { useTheme } from 'next-themes';
import { useThreeAnimation } from '@/hooks/useThreeAnimation';

interface MentalMathAnimationProps {
  className?: string;
  isHovered: boolean;
}

export function MentalMathAnimation({
  className,
  isHovered,
}: MentalMathAnimationProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const mouse = useRef({ x: 0, y: 0 });
  const isMouseOver = useRef(isHovered);
  const { theme } = useTheme();

  useThreeAnimation(mountRef, {
    theme,
    onSetup: ({ scene, camera, renderer, primaryColor, opacityValue }) => {
      camera.position.z = 12;

      const sprites: THREE.Sprite[] = [];
      const symbols = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '+', '−', '×', '÷', '='];
      const particleCount = 100;
      const spriteMaterials: THREE.SpriteMaterial[] = [];

      for (let i = 0; i < particleCount; i++) {
        const canvas = document.createElement('canvas');
        canvas.width = 128;
        canvas.height = 128;
        const ctx = canvas.getContext('2d');
        
        if (ctx) {
          ctx.fillStyle = primaryColor.getStyle();
          ctx.font = 'bold 80px Arial';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(symbols[Math.floor(Math.random() * symbols.length)], 64, 64);
        }

        const texture = new THREE.CanvasTexture(canvas);
        const material = new THREE.SpriteMaterial({
          map: texture,
          transparent: true,
          opacity: opacityValue * 0.7,
        });
        spriteMaterials.push(material);

        const sprite = new THREE.Sprite(material);
        sprite.position.set(
          (Math.random() - 0.5) * 25,
          (Math.random() - 0.5) * 15,
          (Math.random() - 0.5) * 15
        );

        const size = 0.2 + Math.random() * 0.8;
        sprite.scale.set(size, size, 1);

        sprite.userData = {
          velocity: new THREE.Vector3(
            (Math.random() - 0.5) * 0.04,
            (Math.random() - 0.5) * 0.04,
            (Math.random() - 0.5) * 0.04
          ),
          rotationSpeed: (Math.random() - 0.5) * 0.02,
        };

        scene.add(sprite);
        sprites.push(sprite);
      }

      const clock = new THREE.Clock();
      let interactionStrength = 0;

      const animate = () => {
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

            if (distance < 5) {
              direction.normalize();
              const force = (1 - distance / 5) * 0.1 * interactionStrength;
              sprite.position.add(direction.multiplyScalar(force));
            }
          }

          // Boundary checks
          if (Math.abs(sprite.position.x) > 12) sprite.position.x *= -0.95;
          if (Math.abs(sprite.position.y) > 7) sprite.position.y *= -0.95;
          if (Math.abs(sprite.position.z) > 7) sprite.position.z *= -0.95;
          
          sprite.material.rotation += sprite.userData.rotationSpeed;
          const pulse = 0.9 + Math.sin(elapsedTime * 2 + sprite.position.x) * 0.1;
          sprite.scale.set(pulse, pulse, 1);
        });

        renderer.render(scene, camera);
      };
      
      const handleMouseMove = (event: MouseEvent) => {
          if(mountRef.current) {
              const rect = mountRef.current.getBoundingClientRect();
              mouse.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
              mouse.current.y = -(((event.clientY - rect.top) / rect.height) * 2 - 1);
          }
      };
      if(mountRef.current) mountRef.current.addEventListener('mousemove', handleMouseMove);

      return {
          animate,
          cleanup: () => {
              if(mountRef.current) mountRef.current.removeEventListener('mousemove', handleMouseMove);
              spriteMaterials.forEach(m => {
                  m.map?.dispose();
                  m.dispose();
              });
          },
          materials: [] // Canvas textures are not easily updatable this way
      }
    }
  });

  isMouseOver.current = isHovered;

  return <div ref={mountRef} className={cn('h-full w-full', className)} />;
}
