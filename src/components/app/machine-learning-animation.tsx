
'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { cn } from '@/lib/utils';

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

  useEffect(() => {
    if (!mountRef.current) return;
    const currentMount = mountRef.current;

    const computedStyle = getComputedStyle(currentMount);
    const primaryColor = new THREE.Color(computedStyle.getPropertyValue('--animation-primary').trim());
    const secondaryColor = new THREE.Color(0x818cf8); // Keep purple for eigenvectors for contrast

    // --- Scene setup ---
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
    
    // --- Vector Field ---
    const vectorGroup = new THREE.Group();
    scene.add(vectorGroup);

    const vectorLength = 1.5;
    const density = 8;
    const spacing = 2;
    const vectors: THREE.ArrowHelper[] = [];

    for (let x = -density; x <= density; x++) {
      for (let y = -density; y <= density; y++) {
        if (x === 0 && y === 0) continue;
        const origin = new THREE.Vector3(x * spacing, y * spacing, 0);
        const dir = new THREE.Vector3(1, 0, 0).normalize(); // Initial direction
        const arrow = new THREE.ArrowHelper(dir, origin, vectorLength, primaryColor, 0.6, 0.4);
        // @ts-ignore
        arrow.originalPosition = origin.clone();
        vectorGroup.add(arrow);
        vectors.push(arrow);
      }
    }

    // --- Eigenvectors ---
    const eigenMaterial = new THREE.LineBasicMaterial({ color: secondaryColor, transparent: true, opacity: 0, linewidth: 3 });
    const eigenVector1 = new THREE.Vector3(1, 1, 0).normalize();
    const eigenVector2 = new THREE.Vector3(-1, 1, 0).normalize();
    
    const eigenLine1 = new THREE.Line(
        new THREE.BufferGeometry().setFromPoints([eigenVector1.clone().multiplyScalar(-25), eigenVector1.clone().multiplyScalar(25)]),
        eigenMaterial.clone()
    );
    const eigenLine2 = new THREE.Line(
        new THREE.BufferGeometry().setFromPoints([eigenVector2.clone().multiplyScalar(-25), eigenVector2.clone().multiplyScalar(25)]),
        eigenMaterial.clone()
    );
    scene.add(eigenLine1);
    scene.add(eigenLine2);
    
    // --- Animation & Interaction ---
    const clock = new THREE.Clock();

    const animate = () => {
      requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Transformation Matrix (Shear + Rotation)
      const angle = elapsedTime * 0.3;
      const shearValue = isMouseOver.current ? Math.sin(elapsedTime * 2) * 0.7 : 0;
      
      const transformMatrix = new THREE.Matrix4().set(
        Math.cos(angle), -Math.sin(angle), 0, 0,
        Math.sin(angle) + shearValue, Math.cos(angle), 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1
      );

      vectors.forEach(arrow => {
        // @ts-ignore
        const newDir = arrow.originalPosition.clone().normalize().applyMatrix4(transformMatrix);
        arrow.setDirection(newDir);
      });

      // Fade in/out eigenvectors
      if (isMouseOver.current) {
        eigenLine1.material.opacity += (0.9 - eigenLine1.material.opacity) * 0.1;
        eigenLine2.material.opacity += (0.9 - eigenLine2.material.opacity) * 0.1;
      } else {
        eigenLine1.material.opacity += (0 - eigenLine1.material.opacity) * 0.1;
        eigenLine2.material.opacity += (0 - eigenLine2.material.opacity) * 0.1;
      }

      vectorGroup.rotation.z += 0.001; // slow constant rotation of the group

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
      // Dispose all geometries and materials
      vectorGroup.children.forEach(child => {
        const arrow = child as THREE.ArrowHelper;
        arrow.line.geometry.dispose();
        (arrow.line.material as THREE.Material).dispose();
        arrow.cone.geometry.dispose();
        (arrow.cone.material as THREE.Material).dispose();
      });
      eigenLine1.geometry.dispose();
      (eigenLine1.material as THREE.Material).dispose();
      eigenLine2.geometry.dispose();
      (eigenLine2.material as THREE.Material).dispose();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div ref={mountRef} className={cn('h-full w-full', className)} />;
}
