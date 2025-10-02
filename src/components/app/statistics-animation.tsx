
'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { cn } from '@/lib/utils';
import { useTheme } from 'next-themes';

interface StatisticsAnimationProps {
  className?: string;
  isHovered: boolean;
}

// Function to create the geometry for a 2D Gaussian surface plot
const createGaussianSurface = (width: number, height: number, segments: number) => {
  const geometry = new THREE.PlaneGeometry(width, height, segments, segments);
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
    const z = 5 * gaussian(x, y, 3, 3); // Scale Z for visibility
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

  useEffect(() => {
    isMouseOver.current = isHovered;
  }, [isHovered]);


  useEffect(() => {
    if (!mountRef.current) return;
    const currentMount = mountRef.current;
    let animationFrameId: number;

    // FIX: Defer the main logic to the next animation frame.
    // This ensures that the component has mounted and CSS variables are available.
    const animationTimeoutId = setTimeout(() => {
      let frameId: number; // Declare frameId inside this scope

      const computedStyle = getComputedStyle(document.documentElement); // Read from documentElement
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
      camera.position.set(0, 6, 9);
      camera.lookAt(0, 0, 0);

      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      currentMount.appendChild(renderer.domElement);
      
      // --- Objects ---
      const group = new THREE.Group();
      scene.add(group);

      // Grid
      const grid = new THREE.GridHelper(20, 20, primaryColor, primaryColor);
      const gridMaterial = grid.material as THREE.Material;
      gridMaterial.transparent = true;
      gridMaterial.opacity = 0.4;
      group.add(grid);

      // Surface
      const surfaceGeometry = createGaussianSurface(10, 10, 50);
      const surfaceMaterial = new THREE.MeshStandardMaterial({
        wireframe: true,
        emissiveIntensity: 0.4,
        transparent: true,
      });
      surfaceMaterial.color.set(primaryColor);
      surfaceMaterial.emissive.set(primaryColor);
      surfaceMaterial.opacity = opacityValue;

      const surface = new THREE.Mesh(surfaceGeometry, surfaceMaterial);
      surface.rotation.x = -Math.PI / 2; // Lay it flat on the grid
      group.add(surface);

      // Lighting
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
      scene.add(ambientLight);
      
      // --- Animation & Interaction ---
      const clock = new THREE.Clock();
      const targetPosition = new THREE.Vector3(0, 0, 0);

      const animate = () => {
        frameId = requestAnimationFrame(animate);
        const elapsedTime = clock.getElapsedTime();

        if (isMouseOver.current) {
          targetPosition.x = mouse.current.x * 5;
          targetPosition.z = mouse.current.y * 5; // Map mouse Y to Z-axis movement
        } else {
          // Add a subtle ambient motion
          targetPosition.x = Math.sin(elapsedTime * 0.3) * 2;
          targetPosition.z = Math.cos(elapsedTime * 0.3) * 2;
        }
        
        // Easing / Smoothing for the surface position (mean)
        surface.position.x += (targetPosition.x - surface.position.x) * 0.05;
        surface.position.z += (targetPosition.z - surface.position.z) * 0.05;

        // Slow rotation of the entire group
        group.rotation.y = elapsedTime * 0.05;

        renderer.render(scene, camera);
      };

      animate();

      // --- Event Listeners ---
      const handleMouseMove = (event: MouseEvent) => {
          if (currentMount) {
              const rect = currentMount.getBoundingClientRect();
              mouse.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
              mouse.current.y = ((event.clientY - rect.top) / rect.height) * 2 - 1;
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
      animationFrameId = frameId; // Store frameId for cleanup
      
      return () => {
        cancelAnimationFrame(frameId);
        window.removeEventListener('resize', handleResize);
        if (currentMount) {
          currentMount.removeEventListener('mousemove', handleMouseMove);
          if (renderer.domElement) currentMount.removeChild(renderer.domElement);
        }
        renderer.dispose();
        surfaceGeometry.dispose();
        surfaceMaterial.dispose();
        grid.geometry.dispose();
        (grid.material as THREE.Material).dispose();
      };
    }, 10); // A small delay is sufficient

    return () => {
      clearTimeout(animationTimeoutId);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      // Ensure the mount point is cleared on re-render or unmount
      while (currentMount?.firstChild) {
        currentMount.removeChild(currentMount.firstChild);
      }
    }
  }, [theme]);

  return <div ref={mountRef} className={cn('h-full w-full', className)} />;
}
