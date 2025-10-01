
'use client';

import { useRef } from 'react';
import * as THREE from 'three';
import { cn } from '@/lib/utils';
import { useTheme } from 'next-themes';
import { useThreeAnimation } from '@/hooks/useThreeAnimation';

interface TimeSeriesAnimationProps {
  className?: string;
  isHovered: boolean;
}

export function TimeSeriesAnimation({
  className,
  isHovered,
}: TimeSeriesAnimationProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const mouse = useRef({ x: 0, y: 0 });
  const isMouseOver = useRef(isHovered);
  const { theme } = useTheme();

  useThreeAnimation(mountRef, {
    theme,
    onSetup: ({ scene, camera, renderer, primaryColor, opacityValue }) => {
      camera.position.z = 8;
      
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
        color: primaryColor,
        linewidth: 3,
        transparent: true,
        opacity: opacityValue,
      });
      
      const line = new THREE.Line(lineGeometry, lineMaterial);
      scene.add(line);

      const clock = new THREE.Clock();
      let targetVolatility = 0.5;

      const animate = () => {
        const elapsedTime = clock.getElapsedTime();

        if (isMouseOver.current) {
          targetVolatility = (mouse.current.y + 1) * 1.5;
        } else {
          targetVolatility += (0.5 - targetVolatility) * 0.1;
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
        
        line.rotation.y = elapsedTime * 0.05;

        renderer.render(scene, camera);
      };
      
      const handleMouseMove = (event: MouseEvent) => {
        if (mountRef.current) {
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
          lineGeometry.dispose();
          grid.geometry.dispose();
        },
        materials: [lineMaterial, gridMaterial]
      };
    }
  });

  isMouseOver.current = isHovered;

  return <div ref={mountRef} className={cn('h-full w-full', className)} />;
}
