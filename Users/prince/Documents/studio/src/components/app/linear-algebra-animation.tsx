
'use client';

import { useEffect, useRef } from 'react';
import { Scene, PerspectiveCamera, WebGLRenderer, Group, PointsMaterial, BufferGeometry, Vector3, Points, Euler, Clock } from 'three';
import { cn } from '@/lib/utils';
import { useTheme } from 'next-themes';

interface LinearAlgebraAnimationProps {
  className?: string;
  isHovered: boolean;
}

export function LinearAlgebraAnimation({
  className,
  isHovered,
}: LinearAlgebraAnimationProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const mouse = useRef({ x: 0, y: 0 });
  const isMouseOver = useRef(isHovered);
  const { theme } = useTheme();

  useEffect(() => {
    isMouseOver.current = isHovered;
  }, [isHovered]);

  useEffect(() => {
    if (!mountRef.current) return;
    const currentMount = mountRef.current;
    let animationFrameId: number;

    const main = async () => {
      let frameId: number;

      const computedStyle = getComputedStyle(currentMount);
      const primaryColorValue = computedStyle.getPropertyValue('--animation-primary-color').trim();
      const opacityValue = parseFloat(computedStyle.getPropertyValue('--animation-opacity').trim());
      const primaryColor = new (await import('three')).Color(primaryColorValue);


      // --- Scene setup ---
      const scene = new Scene();
      const camera = new PerspectiveCamera(
        75,
        currentMount.clientWidth / currentMount.clientHeight,
        0.1,
        1000
      );
      camera.position.z = 15;

      const renderer = new WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      currentMount.appendChild(renderer.domElement);

      // --- Grid creation ---
      const gridGroup = new Group();
      scene.add(gridGroup);
      
      const pointCloudMaterial = new PointsMaterial({
          size: 0.25,
          transparent: true,
          blending: (await import('three')).AdditiveBlending,
      });
      pointCloudMaterial.color.set(primaryColor);
      pointCloudMaterial.opacity = opacityValue;

      const points = [];
      const gridSize = 10;
      const gridDivisions = 10;
      const step = gridSize / gridDivisions;

      for (let i = -gridSize / 2; i <= gridSize / 2; i += step) {
          for (let j = -gridSize / 2; j <= gridSize / 2; j += step) {
              for (let k = -gridSize / 2; k <= gridSize/2; k += step) {
                   points.push(new Vector3(i, j, k));
              }
          }
      }
      
      const pointCloudGeometry = new BufferGeometry().setFromPoints(points);
      const pointCloud = new Points(pointCloudGeometry, pointCloudMaterial);
      gridGroup.add(pointCloud);

      // --- Animation & Interaction ---
      const clock = new Clock();
      const targetRotation = new Euler(0, 0, 0);
      const targetScale = new Vector3(1, 1, 1);

      const animate = () => {
        frameId = requestAnimationFrame(animate);
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

      currentMount.addEventListener('mousemove', handleMouseMove);

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
        cancelAnimationFrame(frameId);
        window.removeEventListener('resize', handleResize);
        if (currentMount) {
          currentMount.removeEventListener('mousemove', handleMouseMove);
          // eslint-disable-next-line react-hooks/exhaustive-deps
          if (renderer.domElement) currentMount.removeChild(renderer.domElement);
        }
        renderer.dispose();
        pointCloudGeometry.dispose();
        pointCloudMaterial.dispose();
      };
    };
    
    main();

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      while (currentMount.firstChild) {
        currentMount.removeChild(currentMount.firstChild);
      }
    }
  }, [theme]);

  return <div ref={mountRef} className={cn('h-full w-full', className)} />;
}
