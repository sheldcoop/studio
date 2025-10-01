'use client';

import { useRef } from 'react';
import {
  PointsMaterial,
  Points,
  BufferGeometry,
  Vector3,
  Euler,
  Clock,
  Group,
} from 'three';
import { cn } from '@/lib/utils';
import { useTheme } from 'next-themes';
import { useThreeAnimation } from '@/hooks/useThreeAnimation';

interface LinearAlgebraAnimationProps {
  className?: string;
  isHovered: boolean;
}

// Create geometry once and reuse it. This is a major memory optimization.
const pointCloudGeometry = new BufferGeometry();
const points = [];
const gridSize = 10;
const gridDivisions = 10;
const step = gridSize / gridDivisions;

for (let i = -gridSize / 2; i <= gridSize / 2; i += step) {
  for (let j = -gridSize / 2; j <= gridSize / 2; j += step) {
    for (let k = -gridSize / 2; k <= gridSize / 2; k += step) {
      points.push(new Vector3(i, j, k));
    }
  }
}
pointCloudGeometry.setFromPoints(points);


export function LinearAlgebraAnimation({
  className,
  isHovered,
}: LinearAlgebraAnimationProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const mouse = useRef({ x: 0, y: 0 });
  const isMouseOver = useRef(isHovered);
  const { theme } = useTheme();

  useThreeAnimation(mountRef, {
      theme,
      onSetup: ({ scene, camera, renderer, primaryColor, opacityValue }) => {
        camera.position.z = 15;
        
        const gridGroup = new Group();
        scene.add(gridGroup);
        
        const pointCloudMaterial = new PointsMaterial({
            size: 0.25,
            transparent: true,
            blending: 2, // AdditiveBlending
            color: primaryColor,
            opacity: opacityValue,
        });
  
        const pointCloud = new Points(pointCloudGeometry, pointCloudMaterial);
        gridGroup.add(pointCloud);
  
        const clock = new Clock();
        const targetRotation = new Euler(0, 0, 0);
        const targetScale = new Vector3(1, 1, 1);
  
        const animate = () => {
          const elapsedTime = clock.getElapsedTime();
  
          if (isMouseOver.current) {
            targetRotation.y = mouse.current.x * Math.PI * 0.5;
            targetRotation.x = mouse.current.y * Math.PI * 0.5;
            const scale = Math.max(0.5, 1 + mouse.current.y);
            targetScale.set(scale, scale, scale);
          } else {
            targetRotation.y = elapsedTime * 0.1;
            targetRotation.x = elapsedTime * 0.08;
            targetScale.set(1, 1, 1);
          }
  
          gridGroup.rotation.y += (targetRotation.y - gridGroup.rotation.y) * 0.05;
          gridGroup.rotation.x += (targetRotation.x - gridGroup.rotation.x) * 0.05;
          gridGroup.scale.lerp(targetScale, 0.05);
  
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
            // Geometry is shared, so it should not be disposed here.
          },
          materials: [pointCloudMaterial]
        };
      }
  });

  isMouseOver.current = isHovered;

  return <div ref={mountRef} className={cn('h-full w-full', className)} />;
}
