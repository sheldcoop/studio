
'use client';

import { useEffect, useRef, useMemo } from 'react';
import * as THREE from 'three';
import { cn } from '@/lib/utils';

interface PlinkoAnimationProps {
  className?: string;
  onPointerEnter: () => void;
  onPointerLeave: () => void;
}

export function PlinkoAnimation({
  className,
  onPointerEnter,
  onPointerLeave,
}: PlinkoAnimationProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const isMouseOver = useRef(false);

  const particleMaterial = useMemo(
    () =>
      new THREE.PointsMaterial({
        color: 0x22c55e,
        size: 0.2,
        blending: THREE.AdditiveBlending,
        transparent: true,
        opacity: 0.9,
      }),
    []
  );

  const pegMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: 0x888888,
        roughness: 0.6,
        metalness: 0.4,
      }),
    []
  );

  useEffect(() => {
    if (!mountRef.current) return;
    const currentMount = mountRef.current;
    let frameId: number;

    // --- Scene Setup ---
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      currentMount.clientWidth / currentMount.clientHeight,
      0.1,
      100
    );
    camera.position.set(0, 0, 15);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    currentMount.appendChild(renderer.domElement);

    // --- Lighting ---
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    const pointLight = new THREE.PointLight(0xffffff, 1);
    pointLight.position.set(0, 10, 10);
    scene.add(pointLight);
    
    // --- Pegs ---
    const pegs: THREE.Mesh[] = [];
    const pegGeometry = new THREE.CylinderGeometry(0.15, 0.15, 1, 8);
    const numRows = 10;
    const yOffset = 4;
    for (let row = 0; row < numRows; row++) {
      const numPegsInRow = row + 1;
      for (let i = 0; i < numPegsInRow; i++) {
        const x = (i - (numPegsInRow - 1) / 2) * 1.5;
        const y = yOffset - row * 1.2;
        const peg = new THREE.Mesh(pegGeometry, pegMaterial);
        peg.position.set(x, y, 0);
        peg.rotation.x = Math.PI / 2;
        scene.add(peg);
        pegs.push(peg);
      }
    }

    // --- Particles ---
    const particleCount = 1000;
    const particlesGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 0.1;
      positions[i * 3 + 1] = yOffset + 2 + Math.random() * 3;
      positions[i * 3 + 2] = 0;
      velocities[i * 3] = (Math.random() - 0.5) * 0.5;
      velocities[i * 3 + 1] = -Math.random() * 2 - 1;
      velocities[i * 3 + 2] = 0;
    }
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particlesGeometry.setAttribute('velocity', new THREE.BufferAttribute(velocities, 3));

    const particleSystem = new THREE.Points(particlesGeometry, particleMaterial);
    scene.add(particleSystem);
    
    let spawnCounter = 0;

    const animate = () => {
      frameId = requestAnimationFrame(animate);
      const positionAttribute = particleSystem.geometry.getAttribute('position') as THREE.BufferAttribute;
      const velocityAttribute = particleSystem.geometry.getAttribute('velocity') as THREE.BufferAttribute;
      
      const spawnRate = isMouseOver.current ? 4 : 1;
      spawnCounter += spawnRate;
      
      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        let x = positionAttribute.getX(i);
        let y = positionAttribute.getY(i);
        let vx = velocityAttribute.getX(i);
        let vy = velocityAttribute.getY(i);

        // Gravity
        vy -= 0.03;
        x += vx * 0.1;
        y += vy * 0.1;

        // Peg collisions
        for (const peg of pegs) {
            const dx = x - peg.position.x;
            const dy = y - peg.position.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 0.3) {
                vx = (dx / dist) * 0.8;
                vy = (dy / dist) * 0.8;
            }
        }
        
        // Reset particles that fall off screen
        if (y < -10) {
            if (spawnCounter > i) {
                x = (Math.random() - 0.5) * 0.1;
                y = yOffset + 2;
                vx = (Math.random() - 0.5) * 0.5;
                vy = -Math.random() * 2 - 1;
            }
        }

        positionAttribute.setXYZ(i, x, y, 0);
        velocityAttribute.setXYZ(i, vx, vy, 0);
      }

      positionAttribute.needsUpdate = true;
      velocityAttribute.needsUpdate = true;
      
      scene.rotation.y += 0.001;

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
      particlesGeometry.dispose();
      pegGeometry.dispose();
      particleMaterial.dispose();
      pegMaterial.dispose();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div ref={mountRef} className={cn('h-full w-full', className)} />;
}
