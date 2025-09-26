
'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { cn } from '@/lib/utils';

interface LinearAlgebraAnimationProps {
  className?: string;
  onPointerEnter: () => void;
  onPointerLeave: () => void;
}

export function LinearAlgebraAnimation({
  className,
  onPointerEnter,
  onPointerLeave,
}: LinearAlgebraAnimationProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const mouse = useRef({ x: 0, y: 0 });
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
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(
      mountRef.current.clientWidth,
      mountRef.current.clientHeight
    );
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current.appendChild(renderer.domElement);

    // --- Object creation ---
    const group = new THREE.Group();
    scene.add(group);

    // Wireframe Cube
    const cubeGeometry = new THREE.BoxGeometry(2.5, 2.5, 2.5);
    const cubeMaterial = new THREE.MeshBasicMaterial({
      color: 0x58a6ff,
      wireframe: true,
      transparent: true,
      opacity: 0.3,
    });
    const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    group.add(cube);

    // Particle Field
    const particleCount = 500;
    const particlesGeometry = new THREE.BufferGeometry();
    const posArray = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 10;
    }
    particlesGeometry.setAttribute(
      'position',
      new THREE.BufferAttribute(posArray, 3)
    );

    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.02,
      color: 0x58a6ff,
      transparent: true,
      opacity: 0.5,
      blending: THREE.AdditiveBlending,
    });
    const particleMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    group.add(particleMesh);

    // --- Animation & Interaction ---
    const clock = new THREE.Clock();
    let targetRotation = new THREE.Euler(0, 0, 0);

    const animate = () => {
      const elapsedTime = clock.getElapsedTime();

      if (isMouseOver.current) {
        targetRotation.y = mouse.current.x * 0.5;
        targetRotation.x = mouse.current.y * 0.5;
      } else {
        // Default slow rotation
        targetRotation.y = elapsedTime * 0.1;
        targetRotation.x = elapsedTime * 0.08;
      }

      // Easing / Smoothing
      group.rotation.y += (targetRotation.y - group.rotation.y) * 0.05;
      group.rotation.x += (targetRotation.x - group.rotation.x) * 0.05;

      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };

    animate();

    // --- Event Listeners ---
    const handleMouseMove = (event: MouseEvent) => {
      if (mountRef.current) {
        const rect = mountRef.current.getBoundingClientRect();
        mouse.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.current.y = -(((event.clientY - rect.top) / rect.height) * 2 - 1);
      }
    };

    const handleMouseEnter = () => {
        isMouseOver.current = true;
        onPointerEnter();
    }
    const handleMouseLeave = () => {
        isMouseOver.current = false;
        onPointerLeave();
    }

    const currentRef = mountRef.current;
    currentRef.addEventListener('mousemove', handleMouseMove);
    currentRef.addEventListener('mouseenter', handleMouseEnter);
    currentRef.addEventListener('mouseleave', handleMouseLeave);


    // --- Resize handler ---
    const handleResize = () => {
      if (mountRef.current) {
        renderer.setSize(
          mountRef.current.clientWidth,
          mountRef.current.clientHeight
        );
        camera.aspect =
          mountRef.current.clientWidth / mountRef.current.clientHeight;
        camera.updateProjectionMatrix();
      }
    };

    window.addEventListener('resize', handleResize);

    // --- Cleanup ---
    return () => {
      window.removeEventListener('resize', handleResize);
      if (currentRef) {
        currentRef.removeEventListener('mousemove', handleMouseMove);
        currentRef.removeEventListener('mouseenter', handleMouseEnter);
        currentRef.removeEventListener('mouseleave', handleMouseLeave);
        // eslint-disable-next-line react-hooks/exhaustive-deps
        currentRef.removeChild(renderer.domElement);
      }
      renderer.dispose();
      cubeGeometry.dispose();
      cubeMaterial.dispose();
      particlesGeometry.dispose();
      particlesMaterial.dispose();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div ref={mountRef} className={cn('h-full w-full', className)} />;
}
