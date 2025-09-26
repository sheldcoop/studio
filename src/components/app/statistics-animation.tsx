
'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { cn } from '@/lib/utils';

interface StatisticsAnimationProps {
  className?: string;
  onPointerEnter: () => void;
  onPointerLeave: () => void;
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
  onPointerEnter,
  onPointerLeave,
}: StatisticsAnimationProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const mouse = useRef({ x: 0, y: 0 });
  const isMouseOver = useRef(false);

  useEffect(() => {
    if (!mountRef.current) return;
    const currentMount = mountRef.current;

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
    const grid = new THREE.GridHelper(20, 20, 0x22c55e, 0x22c55e);
    grid.material.transparent = true;
    grid.material.opacity = 0.3;
    group.add(grid);

    // Surface
    const surfaceGeometry = createGaussianSurface(10, 10, 50);
    const surfaceMaterial = new THREE.MeshStandardMaterial({
      color: 0x22c55e,
      wireframe: true,
      emissive: 0x22c55e,
      emissiveIntensity: 0.3,
      transparent: true,
      opacity: 0.9,
    });
    const surface = new THREE.Mesh(surfaceGeometry, surfaceMaterial);
    surface.rotation.x = -Math.PI / 2; // Lay it flat on the grid
    group.add(surface);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    // --- Animation & Interaction ---
    const clock = new THREE.Clock();
    let targetPosition = new THREE.Vector3(0, 0, 0);

    const animate = () => {
      const elapsedTime = clock.getElapsedTime();
      requestAnimationFrame(animate);

      if (isMouseOver.current) {
        targetPosition.x = mouse.current.x * 5;
        targetPosition.z = mouse.current.y * 5; // Map mouse Y to Z-axis movement
      } else {
        targetPosition.x = 0;
        targetPosition.z = 0;
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
    
    const handleMouseEnter = () => { isMouseOver.current = true; onPointerEnter(); }
    const handleMouseLeave = () => { isMouseOver.current = false; onPointerLeave(); }

    currentMount.addEventListener('mousemove', handleMouseMove);
    currentMount.addEventListener('mouseenter', handleMouseEnter);
    currentMount.addEventListener('mouseleave', handleMouseLeave);

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
      window.removeEventListener('resize', handleResize);
      if (currentMount) {
        currentMount.removeEventListener('mousemove', handleMouseMove);
        currentMount.removeEventListener('mouseenter', handleMouseEnter);
        currentMount.removeEventListener('mouseleave', handleMouseLeave);
        // eslint-disable-next-line react-hooks/exhaustive-deps
        currentMount.removeChild(renderer.domElement);
      }
      renderer.dispose();
      surfaceGeometry.dispose();
      surfaceMaterial.dispose();
      grid.geometry.dispose();
      grid.material.dispose();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div ref={mountRef} className={cn('h-full w-full', className)} />;
}

    