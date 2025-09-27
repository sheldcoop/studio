
'use client';

import { useEffect, useRef, useMemo, useState } from 'react';
import * as THREE from 'three';
import { cn } from '@/lib/utils';

interface ProbabilityAnimationProps {
  className?: string;
  onPointerEnter: () => void;
  onPointerLeave: () => void;
}

const createFaceMaterial = (dots: { x: number; y: number }[]) => {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const context = canvas.getContext('2d');
  if (!context) return new THREE.MeshStandardMaterial({ color: 0x111111 });

  context.fillStyle = '#333'; // Dark grey die face
  context.fillRect(0, 0, 128, 128);

  context.fillStyle = '#22c55e'; // Primary green for the dots
  dots.forEach((dot) => {
    context.beginPath();
    context.arc(dot.x, dot.y, 12, 0, Math.PI * 2);
    context.fill();
  });

  return new THREE.MeshStandardMaterial({ map: new THREE.CanvasTexture(canvas) });
};


export function ProbabilityAnimation({
  className,
  onPointerEnter,
  onPointerLeave,
}: ProbabilityAnimationProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const isMouseOver = useRef(false);
  const dieRef = useRef<THREE.Mesh>();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (!mountRef.current || isInitialized) return;
    const currentMount = mountRef.current;
    let frameId: number;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      currentMount.clientWidth / currentMount.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 10;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    currentMount.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 10, 7.5);
    scene.add(directionalLight);
    
    // --- Client-side Geometry and Material creation ---
    const dotsConfig = [
      [{ x: 64, y: 64 }], // 1
      [{ x: 32, y: 32 }, { x: 96, y: 96 }], // 2
      [{ x: 32, y: 32 }, { x: 64, y: 64 }, { x: 96, y: 96 }], // 3
      [{ x: 32, y: 32 }, { x: 96, y: 32 }, { x: 32, y: 96 }, { x: 96, y: 96 }], // 4
      [{ x: 32, y: 32 }, { x: 96, y: 32 }, { x: 64, y: 64 }, { x: 32, y: 96 }, { x: 96, y: 96 }], // 5
      [{ x: 32, y: 32 }, { x: 96, y: 32 }, { x: 32, y: 64 }, { x: 96, y: 64 }, { x: 32, y: 96 }, { x: 96, y: 96 }], // 6
    ];

    const dieMaterials = [
      createFaceMaterial(dotsConfig[3]), // right: 4
      createFaceMaterial(dotsConfig[2]), // left: 3
      createFaceMaterial(dotsConfig[4]), // top: 5
      createFaceMaterial(dotsConfig[1]), // bottom: 2
      createFaceMaterial(dotsConfig[0]), // front: 1
      createFaceMaterial(dotsConfig[5]), // back: 6
    ];
    
    const dieGeometry = new THREE.BoxGeometry(5, 5, 5);

    const die = new THREE.Mesh(dieGeometry, dieMaterials);
    scene.add(die);
    dieRef.current = die;
    setIsInitialized(true);


    let angularVelocity = new THREE.Vector3(
        (Math.random() - 0.5) * 2,
        (Math.random() - 0.5) * 2,
        (Math.random() - 0.5) * 2
    );

    const clock = new THREE.Clock();

    const animate = () => {
      frameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();

      if (isMouseOver.current) {
        // Slow down to a stop
        angularVelocity.multiplyScalar(0.95);
      } else {
        // Maintain a minimum speed
        if (angularVelocity.length() < 0.5) {
             angularVelocity.set(
                (Math.random() - 0.5) * 2,
                (Math.random() - 0.5) * 2,
                (Math.random() - 0.5) * 2
             );
        }
         angularVelocity.multiplyScalar(0.99); // Slow damping
      }
      
      if(dieRef.current) {
        dieRef.current.rotation.x += angularVelocity.x * delta;
        dieRef.current.rotation.y += angularVelocity.y * delta;
        dieRef.current.rotation.z += angularVelocity.z * delta;
      }

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
        if (renderer.domElement) {
           currentMount.removeChild(renderer.domElement);
        }
      }
      // Dispose of renderer and materials
      renderer.dispose();
      dieGeometry.dispose();
      dieMaterials.forEach(m => {
        m.map?.dispose();
        m.dispose();
      });
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div ref={mountRef} className={cn('h-full w-full', className)} />;
}
