
'use client';

import { useEffect, useRef, useMemo } from 'react';
import * as THREE from 'three';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import { cn } from '@/lib/utils';

interface MentalMathAnimationProps {
  className?: string;
  onPointerEnter: () => void;
  onPointerLeave: () => void;
}

export function MentalMathAnimation({
  className,
  onPointerEnter,
  onPointerLeave,
}: MentalMathAnimationProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const isMouseOver = useRef(false);

  const fontLoader = useMemo(() => new FontLoader(), []);
  const fontRef = useRef<THREE.Font>();

  const textMaterial = useMemo(() => new THREE.MeshBasicMaterial({
    color: 0x22c55e,
    transparent: true,
    opacity: 0.9,
    blending: THREE.AdditiveBlending,
  }), []);

  useEffect(() => {
    fontLoader.load(
      '/fonts/helvetiker_regular.typeface.json',
      (font) => {
        fontRef.current = font;
      }
    );
  }, [fontLoader]);

  useEffect(() => {
    if (!mountRef.current || !fontRef.current) return;
    const currentMount = mountRef.current;
    
    // --- Scene Setup ---
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      currentMount.clientWidth / currentMount.clientHeight,
      0.1,
      100
    );
    camera.position.z = 0.1;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    currentMount.appendChild(renderer.domElement);

    // --- Text Particles ---
    const particles: { mesh: THREE.Mesh; velocity: number }[] = [];
    const symbols = ['+', '−', '×', '÷', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];

    for(let i = 0; i < 150; i++) {
        const char = symbols[Math.floor(Math.random() * symbols.length)];
        const geometry = new TextGeometry(char, {
            font: fontRef.current!,
            size: Math.random() * 0.6 + 0.4,
            height: 0.02,
            curveSegments: 4,
        });
        geometry.center();
        
        const particle = new THREE.Mesh(geometry, textMaterial);
        particle.position.set(
            (Math.random() - 0.5) * 18,
            (Math.random() - 0.5) * 18,
            -60
        );
        particle.rotation.x = Math.random() * Math.PI;
        particle.rotation.y = Math.random() * Math.PI;

        scene.add(particle);
        particles.push({ mesh: particle, velocity: Math.random() * 0.6 + 0.3 });
    }
    
    // --- Animation Logic ---
    let speed = 1;
    let frameId: number;

    const animate = () => {
      frameId = requestAnimationFrame(animate);

      if(isMouseOver.current) {
        speed += (12 - speed) * 0.05;
      } else {
        speed += (1 - speed) * 0.05;
      }

      particles.forEach(p => {
        p.mesh.position.z += p.velocity * speed * 0.1;
        p.mesh.rotation.x += 0.01;
        p.mesh.rotation.y += 0.01;

        if (p.mesh.position.z > camera.position.z) {
          p.mesh.position.z = -60;
          p.mesh.position.x = (Math.random() - 0.5) * 18;
          p.mesh.position.y = (Math.random() - 0.5) * 18;
        }
      });
      
      renderer.render(scene, camera);
    };
    
    animate();

    // --- Event Listeners ---
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

    // --- Cleanup ---
    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', handleResize);
      if (currentMount) {
        currentMount.removeEventListener('mouseenter', handleMouseEnter);
        currentMount.removeEventListener('mouseleave', handleMouseLeave);
        // eslint-disable-next-line react-hooks/exhaustive-deps
        currentMount.removeChild(renderer.domElement);
      }
      renderer.dispose();
      particles.forEach(p => {
        p.mesh.geometry.dispose();
      });
      textMaterial.dispose();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fontRef.current]);

  return <div ref={mountRef} className={cn('h-full w-full', className)} />;
}
