'use client';

import { useRef } from 'react';
import { 
    BoxGeometry, 
    MeshStandardMaterial, 
    Mesh, 
    DirectionalLight, 
    AmbientLight,
    CanvasTexture,
    Clock,
    Color,
} from 'three';
import { cn } from '@/lib/utils';
import { useTheme } from 'next-themes';
import { useThreeAnimation } from '@/hooks/useThreeAnimation';

interface DiceAnimationProps {
  className?: string;
  isHovered: boolean;
}

// This function is now outside the component, so it doesn't get redefined on every render.
const createDieFaceMaterial = (dots: { x: number; y: number }[], fgColor: string, bgColor: string) => {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const context = canvas.getContext('2d');
  if (!context) return new MeshStandardMaterial({ color: 0x111111 });

  context.fillStyle = bgColor;
  context.fillRect(0, 0, 128, 128);
  context.fillStyle = fgColor;
  dots.forEach((dot) => {
    context.beginPath();
    context.arc(dot.x, dot.y, 10, 0, Math.PI * 2);
    context.fill();
  });

  return new MeshStandardMaterial({ map: new CanvasTexture(canvas) });
};

// Create geometry once and reuse it across all instances of the component.
const dieGeometry = new BoxGeometry(2, 2, 2);

export function DiceAnimation({
  className,
  isHovered,
}: DiceAnimationProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const isMouseOver = useRef(isHovered);
  const { theme } = useTheme();

  useThreeAnimation(mountRef, {
    theme,
    onSetup: ({ scene, camera, renderer, primaryColor }) => {
      camera.position.z = 5;

      const light = new DirectionalLight(0xffffff, 2.5);
      light.position.set(2, 5, 3);
      scene.add(light);
      const ambientLight = new AmbientLight(0xffffff, 0.8);
      scene.add(ambientLight);

      const dotColor = primaryColor.getStyle();
      
      const backgroundColorValue = getComputedStyle(document.documentElement).getPropertyValue('--card').trim();
      const [h, s, l] = backgroundColorValue.split(' ').map(parseFloat);
      const faceColor = new Color(`hsl(${h}, ${s}%, ${l}%)`).getStyle();

      const faceMaterials = [
        createDieFaceMaterial([{ x: 64, y: 64 }], dotColor, faceColor), // 1
        createDieFaceMaterial([{ x: 32, y: 32 }, { x: 96, y: 96 }], dotColor, faceColor), // 2
        createDieFaceMaterial([{ x: 32, y: 32 }, { x: 64, y: 64 }, { x: 96, y: 96 }], dotColor, faceColor), // 3
        createDieFaceMaterial([{ x: 32, y: 32 }, { x: 96, y: 96 }, { x: 32, y: 96 }, { x: 96, y: 32 }], dotColor, faceColor), // 4
        createDieFaceMaterial([{ x: 32, y: 32 }, { x: 96, y: 96 }, { x: 32, y: 96 }, { x: 96, y: 32 }, { x: 64, y: 64 }], dotColor, faceColor), // 5
        createDieFaceMaterial([{ x: 32, y: 32 }, { x: 96, y: 96 }, { x: 32, y: 64 }, { x: 96, y: 64 }, { x: 32, y: 96 }, { x: 96, y: 32 }], dotColor, faceColor), // 6
      ];

      const die = new Mesh(dieGeometry, faceMaterials);
      scene.add(die);

      const clock = new Clock();

      const animate = () => {
        const delta = clock.getDelta();
        
        const rotationSpeed = isMouseOver.current ? 1.5 : 0.2;
        die.rotation.x += rotationSpeed * delta;
        die.rotation.y += rotationSpeed * delta;

        renderer.render(scene, camera);
      };

      return {
        animate,
        cleanup: () => {
            // Do not dispose shared geometry here
            faceMaterials.forEach(m => {
                m.map?.dispose();
                m.dispose();
            });
        },
        // Materials are recreated on theme change, so no need to return them
        materials: []
      };
    }
  });

  isMouseOver.current = isHovered;

  return <div ref={mountRef} className={cn('h-full w-full', className)} />;
}
