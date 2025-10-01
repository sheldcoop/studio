
'use client';

import { useRef } from 'react';
import * as THREE from 'three';
import { cn } from '@/lib/utils';
import { useTheme } from 'next-themes';
import { useThreeAnimation } from '@/hooks/useThreeAnimation';

interface PlinkoAnimationProps {
  className?: string;
  isHovered: boolean;
}

export function PlinkoAnimation({
  className,
  isHovered,
}: PlinkoAnimationProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const isMouseOver = useRef(isHovered);
  const { theme } = useTheme();

  useThreeAnimation(mountRef, {
    theme,
    onSetup: ({ scene, camera, renderer, primaryColor }) => {
      camera.position.set(0, 8, 10);
      camera.lookAt(0, 2, 0);

      const size = 20;
      const segments = 50;
      const geometry = new THREE.PlaneGeometry(size, size, segments, segments);
      const positions = geometry.attributes.position.array as Float32Array;

      for (let i = 0; i < positions.length; i += 3) {
        const x = positions[i];
        const y = positions[i + 1];
        const dist = Math.sqrt(x * x + y * y);
        positions[i + 2] = 3 * Math.exp(-(dist * dist) / 20);
      }
      geometry.computeVertexNormals();

      const material = new THREE.MeshBasicMaterial({
        wireframe: true,
        transparent: true,
        color: primaryColor,
      });
      const surface = new THREE.Mesh(geometry, material);
      surface.rotation.x = -Math.PI / 2;
      surface.position.y = 2;
      scene.add(surface);

      const clock = new THREE.Clock();
      let rippleAmplitude = 0.5;

      const animate = () => {
        const time = clock.getElapsedTime();

        const targetAmplitude = isMouseOver.current ? 1.5 : 0.5;
        rippleAmplitude += (targetAmplitude - rippleAmplitude) * 0.05;

        for (let i = 0; i < positions.length; i += 3) {
          const x = positions[i];
          const y = positions[i + 1];
          const dist = Math.sqrt(x * x + y * y);
          
          const baseHeight = 3 * Math.exp(-(dist * dist) / 20);
          const ripple = Math.sin(time * 2 - dist * 0.8) * rippleAmplitude;
          
          positions[i + 2] = baseHeight + ripple;
        }
        
        geometry.attributes.position.needsUpdate = true;
        geometry.computeVertexNormals();

        scene.rotation.y = time * 0.08;

        renderer.render(scene, camera);
      };

      return {
        animate,
        cleanup: () => {
          geometry.dispose();
        },
        materials: [material]
      };
    }
  });

  isMouseOver.current = isHovered;

  return <div ref={mountRef} className={cn('h-full w-full', className)} />;
}
