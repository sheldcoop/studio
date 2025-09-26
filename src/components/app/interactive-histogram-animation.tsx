
'use client';

import { useEffect, useRef, useMemo } from 'react';
import * as THREE from 'three';
import { cn } from '@/lib/utils';

interface InteractiveHistogramAnimationProps {
  className?: string;
  onPointerEnter: () => void;
  onPointerLeave: () => void;
}

// Probability Density Function for the normal distribution
const normalPDF = (x: number, mean: number, stdDev: number) => {
  const variance = stdDev ** 2;
  return (
    (1 / (stdDev * Math.sqrt(2 * Math.PI))) *
    Math.exp(-((x - mean) ** 2) / (2 * variance))
  );
};

export function InteractiveHistogramAnimation({
  className,
  onPointerEnter,
  onPointerLeave,
}: InteractiveHistogramAnimationProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const mouse = useRef({ x: 0, y: 0 });
  const isMouseOver = useRef(false);
  const barsRef = useRef<THREE.Mesh[]>([]);

  const barMaterial = useMemo(() => new THREE.MeshBasicMaterial({
    color: 0x58a6ff, // Bright primary color
    transparent: true,
    opacity: 0.8,
  }), []);

  useEffect(() => {
    if (!mountRef.current) return;
    const currentMount = mountRef.current;

    // --- Scene setup ---
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      currentMount.clientWidth / currentMount.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 4, 12);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    currentMount.appendChild(renderer.domElement);

    // --- Histogram Bars ---
    const group = new THREE.Group();
    scene.add(group);

    const barCount = 21; // Must be odd
    const barWidth = 0.5;
    const barSpacing = 0.1;
    const totalWidth = barCount * (barWidth + barSpacing);

    if (barsRef.current.length === 0) {
      for (let i = 0; i < barCount; i++) {
        const geometry = new THREE.BoxGeometry(barWidth, 1, barWidth);
        const bar = new THREE.Mesh(geometry, barMaterial);
        const xPos = (i - Math.floor(barCount / 2)) * (barWidth + barSpacing);
        bar.position.set(xPos, 0, 0);
        group.add(bar);
        barsRef.current.push(bar);
      }
    } else {
        barsRef.current.forEach(bar => group.add(bar));
    }


    group.position.x = -totalWidth / (barCount * 2); // Center the group

    // --- Animation & Interaction ---
    const clock = new THREE.Clock();
    let targetMean = 0;
    let targetStdDev = 1.5;

    const animate = () => {
      requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      if (isMouseOver.current) {
        // Map mouse X to mean (-5 to 5)
        targetMean = mouse.current.x * 5;
        // Map mouse Y to std dev (0.5 to 4)
        targetStdDev = (mouse.current.y + 1) / 2 * 3.5 + 0.5;
      } else {
        // Default values
        targetMean = 0;
        targetStdDev = 1.5 + Math.sin(elapsedTime * 0.5);
      }

      // Update bar heights based on PDF
      barsRef.current.forEach((bar) => {
        const currentMean = bar.position.x;
        const newHeight = Math.max(0.1, 7 * normalPDF(currentMean, targetMean, targetStdDev));
        
        // Smoothly interpolate height and position
        bar.scale.y += (newHeight - bar.scale.y) * 0.1;
        bar.position.y = bar.scale.y / 2;
      });
      
      group.rotation.y = elapsedTime * 0.1;

      renderer.render(scene, camera);
    };

    animate();

    // --- Event Listeners ---
    const handleMouseMove = (event: MouseEvent) => {
      if (currentMount) {
        const rect = currentMount.getBoundingClientRect();
        mouse.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.current.y = ((event.clientY - rect.top) / rect.height) * 2 - 1;
      }
    };

    const handleMouseEnter = () => { isMouseOver.current = true; onPointerEnter(); };
    const handleMouseLeave = () => { isMouseOver.current = false; onPointerLeave(); };

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
      barsRef.current.forEach(bar => {
          bar.geometry.dispose();
      })
      // No need to dispose shared material here if we want it to persist across re-renders
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div ref={mountRef} className={cn('h-full w-full', className)} />;
}
