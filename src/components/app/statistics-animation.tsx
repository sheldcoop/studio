
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
  const mouse = useRef(new THREE.Vector2(10000, 10000)); // Start off-screen
  const isMouseOver = useRef(false);

  useEffect(() => {
    if (!mountRef.current) return;
    const currentMount = mountRef.current;

    // --- Scene setup ---
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(
      -10, 10, 10, -10, 1, 1000
    );
    camera.position.z = 10;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    currentMount.appendChild(renderer.domElement);
    
    // --- Galton Board setup ---
    const pegs: THREE.Vector2[] = [];
    const pegRows = 12;
    const verticalSpacing = 1.2;
    for (let i = 0; i < pegRows; i++) {
        const numPegsInRow = i + 1;
        const y = 8 - i * verticalSpacing;
        for (let j = 0; j < numPegsInRow; j++) {
            const x = j * 1.5 - (numPegsInRow - 1) * 0.75;
            pegs.push(new THREE.Vector2(x, y));
        }
    }

    const numBins = 15;
    const binWidth = 1.33;
    const bins = Array(numBins).fill(0);
    const binBottom = -10;

    // --- Particle System ---
    const maxParticles = 500;
    const particleGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(maxParticles * 3);
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    
    const particleMaterial = new THREE.PointsMaterial({
        color: 0x58a6ff, // Use a consistent theme color
        size: 0.3,
        transparent: true,
        opacity: 0.7,
        blending: THREE.AdditiveBlending,
    });
    
    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    const particlePool: {
        position: THREE.Vector3;
        velocity: THREE.Vector3;
        life: number;
    }[] = [];
    for (let i = 0; i < maxParticles; i++) {
        particlePool.push({
            position: new THREE.Vector3(0, 10, 0),
            velocity: new THREE.Vector3(0, 0, 0),
            life: 0,
        });
    }
    let frame = 0;

    function spawnParticle() {
        const p = particlePool.find(p => p.life <= 0);
        if (p) {
            p.position.set((Math.random() - 0.5) * 0.2, 10, 0);
            p.velocity.set(0, -0.1 - Math.random() * 0.1, 0);
            p.life = 1;
        }
    }
    
    // --- Animation & Interaction ---
    const animate = () => {
        requestAnimationFrame(animate);
        frame++;
        if (frame % 3 === 0) spawnParticle();

        const currentPositions = particles.geometry.attributes.position.array as Float32Array;
        let activeParticles = 0;
        
        for (const p of particlePool) {
            if (p.life > 0) {
                // Apply gravity
                p.velocity.y -= 0.01;
                p.position.add(p.velocity);

                // Mouse interaction
                if (isMouseOver.current) {
                    const magnetForce = new THREE.Vector2(p.position.x, p.position.y).sub(mouse.current);
                    const distance = magnetForce.length();
                    if (distance < 3) {
                         p.velocity.add(new THREE.Vector3(-magnetForce.x * 0.01, -magnetForce.y * 0.01, 0));
                    }
                }
                
                // Peg collision
                for (const peg of pegs) {
                    if (p.position.distanceTo(new THREE.Vector3(peg.x, peg.y, 0)) < 0.8) {
                        p.velocity.x += (Math.random() - 0.5) * 0.15; // Bounce randomly left or right
                        p.velocity.y *= 0.6; // Dampen vertical velocity
                    }
                }

                // Check for bin collision
                if (p.position.y < binBottom + 0.5) {
                    const binIndex = Math.floor((p.position.x + (numBins / 2) * binWidth) / binWidth);
                    if (binIndex >= 0 && binIndex < numBins) {
                        const stackHeight = bins[binIndex] * 0.2;
                        p.position.y = binBottom + stackHeight;
                        p.position.x = (binIndex - numBins / 2) * binWidth + binWidth / 2;
                        bins[binIndex]++;
                        p.life = 0; // Particle is now settled
                    } else {
                        p.life = 0; // Deactivate if out of bounds
                    }
                }

                currentPositions[activeParticles * 3] = p.position.x;
                currentPositions[activeParticles * 3 + 1] = p.position.y;
                currentPositions[activeParticles * 3 + 2] = p.position.z;
                activeParticles++;
            }
        }
        
        particles.geometry.attributes.position.needsUpdate = true;
        
        // Decay bins over time
        if (frame % 2 === 0) {
            for (let i=0; i<numBins; i++) {
                if (bins[i] > 0) bins[i] -= 0.1;
            }
        }

        renderer.render(scene, camera);
    };

    animate();

    // --- Event Listeners ---
    const handleMouseMove = (event: MouseEvent) => {
        if (currentMount) {
            const rect = currentMount.getBoundingClientRect();
            const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
            const y = -(((event.clientY - rect.top) / rect.height) * 2 - 1);
            // Convert to orthographic camera coordinates
            mouse.current.x = x * 10;
            mouse.current.y = y * 10;
        }
    };
    
    const handleMouseEnter = () => { isMouseOver.current = true; onPointerEnter(); }
    const handleMouseLeave = () => { 
        isMouseOver.current = false; 
        mouse.current.set(10000, 10000); // Move mouse off-screen
        onPointerLeave(); 
    }

    currentMount.addEventListener('mousemove', handleMouseMove);
    currentMount.addEventListener('mouseenter', handleMouseEnter);
    currentMount.addEventListener('mouseleave', handleMouseLeave);

    // --- Resize handler ---
    const handleResize = () => {
        if (currentMount) {
            renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
            const aspect = currentMount.clientWidth / currentMount.clientHeight;
            camera.left = -10 * aspect;
            camera.right = 10 * aspect;
            camera.top = 10;
            camera.bottom = -10;
            camera.updateProjectionMatrix();
        }
    };
    window.addEventListener('resize', handleResize);
    handleResize(); // Initial call

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
      particleGeometry.dispose();
      particleMaterial.dispose();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div ref={mountRef} className={cn('h-full w-full', className)} />;
}
