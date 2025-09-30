
'use client';

import { useEffect, useRef, useMemo } from 'react';
import * as THREE from 'three';
import { cn } from '@/lib/utils';

interface ProbabilityAnimationProps {
  className?: string;
  onPointerEnter: () => void;
  onPointerLeave: () => void;
}

// --- Texture/Material Creation Functions ---

const createDieFaceMaterial = (dots: { x: number; y: number }[]) => {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const context = canvas.getContext('2d');
  if (!context) return new THREE.MeshStandardMaterial({ color: 0x111111 });

  context.fillStyle = '#333';
  context.fillRect(0, 0, 128, 128);
  context.fillStyle = '#22c55e';
  dots.forEach((dot) => {
    context.beginPath();
    context.arc(dot.x, dot.y, 10, 0, Math.PI * 2);
    context.fill();
  });

  return new THREE.MeshStandardMaterial({ map: new THREE.CanvasTexture(canvas) });
};

const createCardBackMaterial = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const context = canvas.getContext('2d');
    if (!context) return new THREE.MeshStandardMaterial({ color: 0x22c55e });

    context.fillStyle = '#22c55e'; // primary green
    context.fillRect(0, 0, 128, 128);
    context.strokeStyle = '#15803d'; // darker green
    context.lineWidth = 10;
    context.strokeRect(5, 5, 118, 118);
    
    // Simple pattern
    context.fillStyle = '#16a34a';
    for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
            if ((i + j) % 2 === 0) {
                 context.fillRect(i * 12.8, j * 12.8, 12.8, 12.8);
            }
        }
    }

    return new THREE.MeshStandardMaterial({ map: new THREE.CanvasTexture(canvas) });
};

export function ProbabilityAnimation({
  className,
  onPointerEnter,
  onPointerLeave,
}: ProbabilityAnimationProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const isMouseOver = useRef(false);

  // Use useMemo to prevent recreating materials on every render
  const dieMaterials = useMemo(() => {
    const dotsConfig = [
        [{ x: 64, y: 64 }], // 1
        [{ x: 32, y: 32 }, { x: 96, y: 96 }], // 2
        [{ x: 32, y: 32 }, { x: 64, y: 64 }, { x: 96, y: 96 }], // 3
        [{ x: 32, y: 32 }, { x: 96, y: 32 }, { x: 32, y: 96 }, { x: 96, y: 96 }], // 4
        [{ x: 32, y: 32 }, { x: 96, y: 32 }, { x: 64, y: 64 }, { x: 32, y: 96 }, { x: 96, y: 96 }], // 5
        [{ x: 32, y: 32 }, { x: 96, y: 32 }, { x: 32, y: 64 }, { x: 96, y: 64 }, { x: 32, y: 96 }, { x: 96, y: 96 }], // 6
    ];
    return [
      createDieFaceMaterial(dotsConfig[3]), createDieFaceMaterial(dotsConfig[2]),
      createDieFaceMaterial(dotsConfig[4]), createDieFaceMaterial(dotsConfig[1]),
      createDieFaceMaterial(dotsConfig[0]), createDieFaceMaterial(dotsConfig[5]),
    ];
  }, []);

  const cardBackMaterial = useMemo(() => createCardBackMaterial(), []);
  const cardEdgeMaterial = useMemo(() => new THREE.MeshBasicMaterial({ color: 0xffffff }), []);


  useEffect(() => {
    if (!mountRef.current) return;
    const currentMount = mountRef.current;
    let frameId: number;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, currentMount.clientWidth / currentMount.clientHeight, 0.1, 1000);
    camera.position.z = 18;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    currentMount.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 10, 7.5);
    scene.add(directionalLight);

    // --- Die ---
    const dieGeometry = new THREE.BoxGeometry(4, 4, 4);
    const die = new THREE.Mesh(dieGeometry, dieMaterials);
    scene.add(die);

    // --- Cards ---
    const cardsGroup = new THREE.Group();
    scene.add(cardsGroup);
    const cardCount = 30;
    const cardGeometry = new THREE.BoxGeometry(2.5, 3.5, 0.1);

    for (let i = 0; i < cardCount; i++) {
      const card = new THREE.Mesh(cardGeometry, [
          cardEdgeMaterial, cardEdgeMaterial,
          cardBackMaterial, cardBackMaterial, // Top/Bottom faces
          cardBackMaterial, cardBackMaterial,
      ]);
      const angle = (i / cardCount) * Math.PI * 2;
      const radius = 8;
      card.position.set(Math.cos(angle) * radius, 0, Math.sin(angle) * radius);
      card.lookAt(die.position);
      cardsGroup.add(card);
    }
    
    let angularVelocity = new THREE.Vector3(0.3, 0.4, 0.2);
    const clock = new THREE.Clock();

    const animate = () => {
      frameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();

      if (isMouseOver.current) {
        angularVelocity.multiplyScalar(1.02); // Accelerate
        cardsGroup.rotation.y += 0.05;
      } else {
        angularVelocity.multiplyScalar(0.99); // Dampen
        cardsGroup.rotation.y += 0.01;
      }
      
      // Clamp velocity to prevent it from getting too fast or stopping completely
      if (angularVelocity.length() > 2) angularVelocity.normalize().multiplyScalar(2);
      if (angularVelocity.length() < 0.1) angularVelocity.set(0.1, 0.1, 0.1);

      die.rotation.x += angularVelocity.x * delta;
      die.rotation.y += angularVelocity.y * delta;
      die.rotation.z += angularVelocity.z * delta;

      renderer.render(scene, camera);
    };

    animate();

    const handleMouseEnter = () => { isMouseOver.current = true; onPointerEnter(); };
    const handleMouseLeave = () => { isMouseOver.current = false; onPointerLeave(); };
    currentMount.addEventListener('mouseenter', handleMouseEnter);
    currentMount.addEventListener('mouseleave', handleMouseLeave);

    const handleResize = () => {
      if (currentMount) {
        camera.aspect = currentMount.clientWidth / currentMount.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
      }
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', handleResize);
      if (currentMount) {
        currentMount.removeEventListener('mouseenter', handleMouseEnter);
        currentMount.removeEventListener('mouseleave', handleMouseLeave);
        if(renderer.domElement) currentMount.removeChild(renderer.domElement);
      }
      renderer.dispose();
      dieGeometry.dispose();
      cardGeometry.dispose();
      dieMaterials.forEach(m => m.dispose());
      cardBackMaterial.dispose();
      cardEdgeMaterial.dispose();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div ref={mountRef} className={cn('h-full w-full', className)} />;
}
