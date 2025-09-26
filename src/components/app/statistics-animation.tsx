'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { cn } from '@/lib/utils';

interface StatisticsAnimationProps {
  className?: string;
  onPointerEnter: () => void;
  onPointerLeave: () => void;
}

export function StatisticsAnimation({
  className,
  onPointerEnter,
  onPointerLeave,
}: StatisticsAnimationProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const isMouseOver = useRef(false);

  useEffect(() => {
    if (!mountRef.current) return;

    // --- Scene setup ---
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 20;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(
      mountRef.current.clientWidth,
      mountRef.current.clientHeight
    );
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current.appendChild(renderer.domElement);

    const group = new THREE.Group();
    scene.add(group);

    // --- Dice/Cubes ---
    const dice = [];
    const diceCount = 50;
    const spacing = 4;
    const geometry = new THREE.BoxGeometry(1.5, 1.5, 1.5);
    const material = new THREE.MeshBasicMaterial({
      color: 0x58a6ff,
      wireframe: true,
      transparent: true,
      opacity: 0.3,
    });

    for (let i = 0; i < diceCount; i++) {
      const die = new THREE.Mesh(geometry, material);
      
      const randomRotation = new THREE.Euler(
        Math.random() * 2 * Math.PI,
        Math.random() * 2 * Math.PI,
        Math.random() * 2 * Math.PI
      );

      // Store initial random position and rotation for animation
      const initialPos = new THREE.Vector3(
        (Math.random() - 0.5) * 30,
        (Math.random() - 0.5) * 30,
        (Math.random() - 0.5) * 30
      );
      
      // Store target grid position
      const targetPos = new THREE.Vector3(
        ((i % 5) - 2) * spacing,
        (Math.floor((i % 25) / 5) - 2) * spacing,
        (Math.floor(i / 25) - 2) * spacing,
      );

      die.position.copy(initialPos);
      die.rotation.copy(randomRotation);
      
      group.add(die);
      dice.push({
          mesh: die,
          initialPos,
          targetPos,
          randomRotation,
          randomSpin: new THREE.Vector3(
              (Math.random() - 0.5) * 0.02,
              (Math.random() - 0.5) * 0.02,
              (Math.random() - 0.5) * 0.02,
          )
      });
    }

    // --- Animation & Interaction ---
    const clock = new THREE.Clock();

    const animate = () => {
      const elapsedTime = clock.getElapsedTime();
      
      dice.forEach(d => {
          if (isMouseOver.current) {
              // Settle into grid
              d.mesh.position.lerp(d.targetPos, 0.05);
              d.mesh.rotation.x = THREE.MathUtils.lerp(d.mesh.rotation.x, 0, 0.05);
              d.mesh.rotation.y = THREE.MathUtils.lerp(d.mesh.rotation.y, 0, 0.05);
              d.mesh.rotation.z = THREE.MathUtils.lerp(d.mesh.rotation.z, 0, 0.05);
          } else {
              // Tumble randomly
              d.mesh.position.lerp(d.initialPos, 0.05);
              d.mesh.rotation.x += d.randomSpin.x;
              d.mesh.rotation.y += d.randomSpin.y;
              d.mesh.rotation.z += d.randomSpin.z;
          }
      });

      group.rotation.y = elapsedTime * 0.05;

      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };

    animate();

    // --- Event Listeners ---
    const handleMouseEnter = () => { isMouseOver.current = true; onPointerEnter(); }
    const handleMouseLeave = () => { isMouseOver.current = false; onPointerLeave(); }

    const currentRef = mountRef.current;
    currentRef.addEventListener('mouseenter', handleMouseEnter);
    currentRef.addEventListener('mouseleave', handleMouseLeave);

    // --- Resize handler ---
    const handleResize = () => {
      if (mountRef.current) {
        renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
        camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
        camera.updateProjectionMatrix();
      }
    };
    window.addEventListener('resize', handleResize);

    // --- Cleanup ---
    return () => {
      window.removeEventListener('resize', handleResize);
      if (currentRef) {
        currentRef.removeEventListener('mouseenter', handleMouseEnter);
        currentRef.removeEventListener('mouseleave', handleMouseLeave);
        // eslint-disable-next-line react-hooks/exhaustive-deps
        currentRef.removeChild(renderer.domElement);
      }
      renderer.dispose();
      geometry.dispose();
      material.dispose();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div ref={mountRef} className={cn('h-full w-full', className)} />;
}
