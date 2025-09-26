
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
    camera.position.z = 8;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current.appendChild(renderer.domElement);

    const group = new THREE.Group();
    scene.add(group);

    // --- Bell Curve ---
    const curvePoints = [];
    const curveSegments = 100;
    const curveWidth = 12;
    // Probability Density Function for a normal distribution
    const pdf = (x: number, mu: number, sigma: number) => 
        1 / (sigma * Math.sqrt(2 * Math.PI)) * Math.exp(-0.5 * Math.pow((x - mu) / sigma, 2));
    
    for (let i = 0; i <= curveSegments; i++) {
        const x = -curveWidth / 2 + (i / curveSegments) * curveWidth;
        // Start with a standard normal distribution (mu=0, sigma=1)
        const y = pdf(x, 0, 1) * 10; 
        curvePoints.push(new THREE.Vector3(x, y, 0));
    }
    const curveGeometry = new THREE.BufferGeometry().setFromPoints(curvePoints);
    const curveMaterial = new THREE.LineBasicMaterial({
      color: 0x58a6ff,
      linewidth: 2,
      transparent: true,
      opacity: 0.6,
    });
    const bellCurve = new THREE.Line(curveGeometry, curveMaterial);
    group.add(bellCurve);
    
    // Add a vertical line for the mean
    const meanLineMaterial = new THREE.LineBasicMaterial({ color: 0x58a6ff, transparent: true, opacity: 0.8 });
    const meanLineGeometry = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, -2.5, 0), new THREE.Vector3(0, 2.5, 0)]);
    const meanLine = new THREE.Line(meanLineGeometry, meanLineMaterial);
    bellCurve.add(meanLine); // Add to the curve so it moves with it

    // --- Animation & Interaction ---
    const clock = new THREE.Clock();
    let targetMean = 0;
    let targetStdDev = 1.5;
    let currentMean = 0;
    let currentStdDev = 1.5;

    const animate = () => {
      const elapsedTime = clock.getElapsedTime();
      
      if (isMouseOver.current) {
        targetMean = mouse.current.x * 4; // Map mouse X to mean (-4 to 4)
        targetStdDev = Math.max(0.5, (mouse.current.y + 1) * 1.25 + 0.5); // Map mouse Y to std dev (0.5 to 3)
      } else {
        // Default slow drift
        targetMean = Math.sin(elapsedTime * 0.2) * 1.5;
        targetStdDev = Math.cos(elapsedTime * 0.3) * 0.5 + 1.5;
      }
      
      // Easing / Smoothing
      currentMean += (targetMean - currentMean) * 0.05;
      currentStdDev += (targetStdDev - currentStdDev) * 0.05;

      // Update Bell Curve vertices
      const positions = bellCurve.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i <= curveSegments; i++) {
          const x = -curveWidth / 2 + (i / curveSegments) * curveWidth;
          positions[i * 3 + 1] = pdf(x, 0, currentStdDev) * 10;
      }
      bellCurve.geometry.attributes.position.needsUpdate = true;
      
      // Move the entire curve group based on the mean
      bellCurve.position.x = currentMean;

      // Update Mean Line Height based on curve peak
      const peakY = pdf(0, 0, currentStdDev) * 10;
      const meanLinePositions = meanLine.geometry.attributes.position.array as Float32Array;
      meanLinePositions[1] = peakY; // Top of the line
      meanLine.geometry.attributes.position.needsUpdate = true;


      group.rotation.y = elapsedTime * 0.03;

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
    
    const handleMouseEnter = () => { isMouseOver.current = true; onPointerEnter(); }
    const handleMouseLeave = () => { isMouseOver.current = false; onPointerLeave(); }

    const currentRef = mountRef.current;
    currentRef.addEventListener('mousemove', handleMouseMove);
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
        currentRef.removeEventListener('mousemove', handleMouseMove);
        currentRef.removeEventListener('mouseenter', handleMouseEnter);
        currentRef.removeEventListener('mouseleave', handleMouseLeave);
        // eslint-disable-next-line react-hooks/exhaustive-deps
        currentRef.removeChild(renderer.domElement);
      }
      renderer.dispose();
      curveGeometry.dispose();
      curveMaterial.dispose();
      meanLineGeometry.dispose();
      meanLineMaterial.dispose();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div ref={mountRef} className={cn('h-full w-full', className)} />;
}
