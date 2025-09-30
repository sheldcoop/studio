
'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { cn } from '@/lib/utils';
import { useTheme } from 'next-themes';

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
  const { theme } = useTheme();

  useEffect(() => {
    if (!mountRef.current) return;
    const currentMount = mountRef.current;
    let frameId: number;

    const computedStyle = getComputedStyle(currentMount);
    const primaryColorValue = computedStyle.getPropertyValue('--animation-primary-color').trim();
    const primaryColor = new THREE.Color(primaryColorValue);
    
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, currentMount.clientWidth / currentMount.clientHeight, 0.1, 1000);
    camera.position.z = 20;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    currentMount.appendChild(renderer.domElement);
    
    // --- Pegs for Galton Board ---
    const pegGroup = new THREE.Group();
    const pegMaterial = new THREE.MeshBasicMaterial({ opacity: 0.7, transparent: true });
    pegMaterial.color.set(primaryColor);
    const pegGeometry = new THREE.CylinderGeometry(0.15, 0.15, 0.5, 16);
    pegGeometry.rotateX(Math.PI / 2); // Orient cylinders correctly
    const rows = 10;
    const rowSpacing = 1.5;
    const colSpacing = 1.8;

    for (let row = 0; row < rows; row++) {
        const numPegs = row + 1;
        for (let col = 0; col < numPegs; col++) {
            const peg = new THREE.Mesh(pegGeometry, pegMaterial);
            peg.position.set(
                (col - (numPegs - 1) / 2) * colSpacing,
                (rows / 2 - row) * rowSpacing,
                0
            );
            pegGroup.add(peg);
        }
    }
    scene.add(pegGroup);

    // --- Bins ---
    const binGroup = new THREE.Group();
    const binMaterial = new THREE.MeshBasicMaterial({ opacity: 0.5, transparent: true });
    binMaterial.color.set(primaryColor);
    const binGeometry = new THREE.BoxGeometry(colSpacing * 0.9, 0.2, 0.5);
    const numBins = rows + 1;
    for (let i = 0; i < numBins; i++) {
        const bin = new THREE.Mesh(binGeometry, binMaterial);
        bin.position.set(
            (i - (numBins - 1) / 2) * colSpacing,
            (rows / 2 - rows - 1) * rowSpacing,
            0
        );
        binGroup.add(bin);
    }
    scene.add(binGroup);

    // --- Particles ---
    const particleCount = 200;
    const particles: { mesh: THREE.Mesh; velocity: THREE.Vector3, life: number }[] = [];
    const particleGeometry = new THREE.SphereGeometry(0.1, 8, 8);
    const particleMaterial = new THREE.MeshBasicMaterial({ color: new THREE.Color(0x818cf8) });

    function createParticle() {
        const mesh = new THREE.Mesh(particleGeometry, particleMaterial);
        mesh.position.set((Math.random() - 0.5) * 0.5, (rows / 2 + 1) * rowSpacing, 0);
        const velocity = new THREE.Vector3(0, -2, 0);
        particles.push({ mesh, velocity, life: 0 });
        scene.add(mesh);
    }

    const clock = new THREE.Clock();

    const animate = () => {
      frameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      
      const spawnRate = isMouseOver.current ? 5 : 1;
      if (Math.random() < spawnRate * delta && particles.length < particleCount) {
        createParticle();
      }

      particles.forEach((p, index) => {
        p.life += delta;
        p.velocity.y -= 9.8 * delta; // Gravity
        p.mesh.position.add(p.velocity.clone().multiplyScalar(delta));

        // Bounce off pegs
        pegGroup.children.forEach(peg => {
            const dist = p.mesh.position.distanceTo(peg.position);
            if (dist < 0.3) { // Collision radius
                const normal = p.mesh.position.clone().sub(peg.position).normalize();
                p.velocity.reflect(normal).multiplyScalar(0.6);
                p.velocity.x += (Math.random() - 0.5) * 2; // Add randomness
            }
        });
        
        // Land in bins
        if (p.mesh.position.y < (rows / 2 - rows - 0.9) * rowSpacing && p.velocity.y < 0) {
            p.mesh.position.y = (rows / 2 - rows - 0.9) * rowSpacing;
            p.velocity.set(0, 0, 0);
        }

        if (p.life > 15) { // Remove old particles
            scene.remove(p.mesh);
            particles.splice(index, 1);
        }
      });
      
      pegGroup.rotation.y = clock.getElapsedTime() * 0.05;

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
      pegGeometry.dispose();
      pegMaterial.dispose();
      binGeometry.dispose();
      binMaterial.dispose();
      particleGeometry.dispose();
      particleMaterial.dispose();
    };
  }, [theme, onPointerEnter, onPointerLeave]);

  return <div ref={mountRef} className={cn('h-full w-full', className)} />;
}
