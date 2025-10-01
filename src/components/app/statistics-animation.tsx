
'use client';

import { useRef } from 'react';
import { 
  PlaneGeometry, 
  MeshStandardMaterial, 
  Mesh, 
  GridHelper, 
  AmbientLight,
  Group,
  Vector3,
  Clock
} from 'three';
import { cn } from '@/lib/utils';
import { useTheme } from 'next-themes';
import { useThreeAnimation } from '@/hooks/useThreeAnimation';

interface StatisticsAnimationProps {
  className?: string;
  isHovered: boolean;
}

const createGaussianSurface = (width: number, height: number, segments: number) => {
  const geometry = new PlaneGeometry(width, height, segments, segments);
  const positionAttribute = geometry.getAttribute('position');
  
  const gaussian = (x: number, y: number, sigmaX: number, sigmaY: number) => {
    return Math.exp(
      -(
        (x ** 2) / (2 * sigmaX ** 2) +
        (y ** 2) / (2 * sigmaY ** 2)
      )
    );
  };
  
  for (let i = 0; i < positionAttribute.count; i++) {
    const x = positionAttribute.getX(i);
    const y = positionAttribute.getY(i);
    const z = 5 * gaussian(x, y, 3, 3);
    positionAttribute.setZ(i, z);
  }

  geometry.computeVertexNormals();
  return geometry;
};

export function StatisticsAnimation({
  className,
  isHovered,
}: StatisticsAnimationProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const mouse = useRef({ x: 0, y: 0 });
  const isMouseOver = useRef(isHovered);
  const { theme } = useTheme();

  useThreeAnimation(mountRef, {
    theme,
    onSetup: ({ scene, camera, renderer, primaryColor, opacityValue }) => {
      camera.position.set(0, 6, 9);
      camera.lookAt(0, 0, 0);
      
      const group = new Group();
      scene.add(group);

      // Grid
      const grid = new GridHelper(20, 20, primaryColor, primaryColor);
      const gridMaterial = grid.material as any;
      gridMaterial.transparent = true;
      gridMaterial.opacity = 0.4;
      group.add(grid);

      // Reduce segments on mobile
      const isMobile = window.innerWidth < 768;
      const segments = isMobile ? 30 : 50;
      
      // Surface
      const surfaceGeometry = createGaussianSurface(10, 10, segments);
      const surfaceMaterial = new MeshStandardMaterial({
        wireframe: true,
        emissiveIntensity: 0.4,
        transparent: true,
        color: primaryColor,
        emissive: primaryColor,
        opacity: opacityValue
      });

      const surface = new Mesh(surfaceGeometry, surfaceMaterial);
      surface.rotation.x = -Math.PI / 2;
      group.add(surface);

      // Lighting
      const ambientLight = new AmbientLight(0xffffff, 0.5);
      scene.add(ambientLight);
      
      const clock = new Clock();
      const targetPosition = new Vector3(0, 0, 0);

      const animate = () => {
        const elapsedTime = clock.getElapsedTime();

        if (isMouseOver.current) {
          targetPosition.x = mouse.current.x * 5;
          targetPosition.z = mouse.current.y * 5;
        } else {
          targetPosition.x = 0;
          targetPosition.z = 0;
        }
        
        // Smooth easing
        surface.position.x += (targetPosition.x - surface.position.x) * 0.05;
        surface.position.z += (targetPosition.z - surface.position.z) * 0.05;

        group.rotation.y = elapsedTime * 0.05;

        renderer.render(scene, camera);
      };

      const handleMouseMove = (event: MouseEvent) => {
        if (mountRef.current) {
          const rect = mountRef.current.getBoundingClientRect();
          mouse.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
          mouse.current.y = ((event.clientY - rect.top) / rect.height) * 2 - 1;
        }
      };
      
      if (mountRef.current) {
        mountRef.current.addEventListener('mousemove', handleMouseMove);
      }

      return {
        animate,
        cleanup: () => {
          if (mountRef.current) {
            mountRef.current.removeEventListener('mousemove', handleMouseMove);
          }
          surfaceGeometry.dispose();
          surfaceMaterial.dispose();
          grid.geometry.dispose();
          gridMaterial.dispose();
        },
        materials: [surfaceMaterial, gridMaterial]
      };
    }
  });

  isMouseOver.current = isHovered;

  return <div ref={mountRef} className={cn('h-full w-full', className)} />;
}
