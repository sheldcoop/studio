
'use client';

import { useEffect, useRef, useMemo } from 'react';
import * as THREE from 'three';
import { cn } from '@/lib/utils';

interface ProbabilityAnimationProps {
  className?: string;
  onPointerEnter: () => void;
  onPointerLeave: () => void;
}

export function ProbabilityAnimation({
  className,
  onPointerEnter,
  onPointerLeave,
}: ProbabilityAnimationProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const isMouseOver = useRef(false);

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
    camera.position.set(0, 0, 18);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    currentMount.appendChild(renderer.domElement);

    const group = new THREE.Group();
    scene.add(group);
    
    // --- Materials ---
    const particleMaterial = new THREE.PointsMaterial({
        color: 0x22c55e,
        size: 0.35,
        blending: THREE.AdditiveBlending,
        transparent: true,
        opacity: 1,
        sizeAttenuation: true,
    });
    
    const pegMaterial = new THREE.MeshBasicMaterial({
        color: 0x22c55e,
        wireframe: true,
        transparent: true,
        opacity: 0.3
    });

    // --- Galton Board Pegs ---
    const pegGeometry = new THREE.CylinderGeometry(0.15, 0.15, 0.5, 8);
    const pegGroup = new THREE.Group();
    const rows = 12;
    const rowSpacing = 1.2;
    const colSpacing = 1.4;

    for (let row = 0; row < rows; row++) {
        const numPegs = row + 1;
        for (let col = 0; col < numPegs; col++) {
            const peg = new THREE.Mesh(pegGeometry, pegMaterial);
            peg.position.x = (col - (numPegs - 1) / 2) * colSpacing;
            peg.position.y = 6 - row * rowSpacing;
            peg.rotation.x = Math.PI / 2;
            pegGroup.add(peg);
        }
    }
    group.add(pegGroup);

    // --- Particles (Beans) ---
    const particleCount = 400;
    const particlesGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const particleData = [];

    for (let i = 0; i < particleCount; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 0.5;
        positions[i * 3 + 1] = 8 + Math.random() * 4;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 2;
        particleData.push({
            velocity: new THREE.Vector3(0, -Math.random() * 0.1 - 0.1, 0),
            currentRow: -1,
            life: Math.random() * 200,
        });
    }
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particleSystem = new THREE.Points(particlesGeometry, particleMaterial);
    group.add(particleSystem);
    
    // --- Bins at the bottom ---
    const numBins = rows + 2;
    const binWidth = colSpacing * 0.9;
    const binHeight = 5;
    const binCounts = new Array(numBins).fill(0);
    const binYOffset = 6 - (rows) * rowSpacing - binHeight / 2;


    const clock = new THREE.Clock();

    const animate = () => {
      frameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();

      const positionAttribute = particleSystem.geometry.getAttribute('position');

      if (isMouseOver.current) {
        for (let i = 0; i < particleCount; i++) {
          const pos = new THREE.Vector3(
            positionAttribute.getX(i),
            positionAttribute.getY(i),
            positionAttribute.getZ(i)
          );
          
          particleData[i].velocity.y -= 0.5 * delta; // Gravity
          pos.add(particleData[i].velocity.clone().multiplyScalar(delta * 20));

          // Check for peg collision
          const currentRow = Math.floor((6.5 - pos.y) / rowSpacing);
          if (currentRow >= 0 && currentRow < rows && currentRow !== particleData[i].currentRow) {
             particleData[i].currentRow = currentRow;
             particleData[i].velocity.x += (Math.random() - 0.5) * 0.15;
          }

          // Check if particle reached bottom
          if (pos.y < binYOffset + binHeight/2) {
              const binIndex = Math.round((pos.x / colSpacing) + (numBins-1)/2);
              if (binIndex >= 0 && binIndex < numBins) {
                 const pileHeight = binCounts[binIndex] * 0.2;
                 if (pos.y < binYOffset + pileHeight) {
                    pos.y = binYOffset + pileHeight;
                    pos.x = ((binIndex - (numBins-1)/2) + (Math.random()-0.5)*0.5) * colSpacing;
                    particleData[i].velocity.set(0,0,0);
                    binCounts[binIndex] += 1;
                 }
              }
          }
          
          // Reset particle if it falls off bottom
          if (pos.y < binYOffset - 5) {
            pos.x = (Math.random() - 0.5) * 0.5;
            pos.y = 8 + Math.random() * 4;
            pos.z = (Math.random() - 0.5) * 2;
            particleData[i].velocity.set(0, -Math.random() * 0.1 - 0.1, 0);
            particleData[i].currentRow = -1;

            const oldBinIndex = Math.round((positionAttribute.getX(i) / colSpacing) + (numBins-1)/2);
            if (oldBinIndex >= 0 && oldBinIndex < numBins) {
                binCounts[oldBinIndex] = Math.max(0, binCounts[oldBinIndex]-1);
            }
          }
          positionAttribute.setXYZ(i, pos.x, pos.y, pos.z);
        }
      }

      positionAttribute.needsUpdate = true;
      group.rotation.y += delta * 0.03;

      renderer.render(scene, camera);
    };

    animate();

    const handleMouseEnter = () => {
      isMouseOver.current = true;
      onPointerEnter();
    };
    const handleMouseLeave = () => {
      isMouseOver.current = false;
      onPointerLeave();
    };
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
        currentMount.removeChild(renderer.domElement);
      }
      renderer.dispose();
      particlesGeometry.dispose();
      particleMaterial.dispose();
      pegGeometry.dispose();
      pegMaterial.dispose();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div ref={mountRef} className={cn('h-full w-full', className)} />;
}
