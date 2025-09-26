
'use client';

import { useEffect, useRef, useMemo } from 'react';
import * as THREE from 'three';
import { cn } from '@/lib/utils';

interface ConfidenceIntervalAnimationProps {
  className?: string;
  onPointerEnter: () => void;
  onPointerLeave: () => void;
}

export function ConfidenceIntervalAnimation({
  className,
  onPointerEnter,
  onPointerLeave,
}: ConfidenceIntervalAnimationProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const mouse = useRef({ x: 0, y: 0 });
  const isMouseOver = useRef(false);

  const pointsMaterial = useMemo(() => new THREE.PointsMaterial({
    color: 0x22c55e,
    size: 0.25,
    blending: THREE.AdditiveBlending,
    transparent: true,
    opacity: 0.8,
  }), []);
  const lineMaterial = useMemo(() => new THREE.LineBasicMaterial({
    color: 0x22c55e,
    blending: THREE.AdditiveBlending,
    transparent: true,
    opacity: 0.9,
    linewidth: 2,
  }), []);

  useEffect(() => {
    if (!mountRef.current) return;
    const currentMount = mountRef.current;

    // --- Scene Setup ---
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      currentMount.clientWidth / currentMount.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 20;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    currentMount.appendChild(renderer.domElement);

    // --- Data Points ---
    const pointCount = 500;
    const pointsGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(pointCount * 3);
    const originalPositions = new Float32Array(pointCount * 3);

    for (let i = 0; i < pointCount; i++) {
      const i3 = i * 3;
      // Store original random positions
      originalPositions[i3] = (Math.random() - 0.5) * 25;
      originalPositions[i3 + 1] = (Math.random() - 0.5) * 25;
      originalPositions[i3 + 2] = (Math.random() - 0.5) * 25;
      
      positions[i3] = originalPositions[i3];
      positions[i3+1] = originalPositions[i3+1];
      positions[i3+2] = originalPositions[i3+2];
    }
    pointsGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const dataCloud = new THREE.Points(pointsGeometry, pointsMaterial);
    scene.add(dataCloud);

    // --- Regression Line ---
    const lineGeometry = new THREE.BufferGeometry();
    lineGeometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(2 * 3), 3));
    const regressionLine = new THREE.Line(lineGeometry, lineMaterial);
    scene.add(regressionLine);

    // --- Animation Logic ---
    const clock = new THREE.Clock();
    let targetCorrelation = 0;

    const animate = () => {
      requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // --- Interaction ---
      if (isMouseOver.current) {
        // Map mouse Y to correlation strength (-1 to 1)
        targetCorrelation += (mouse.current.y - targetCorrelation) * 0.1;
      } else {
        // Return to a non-correlated state
        targetCorrelation += (0 - targetCorrelation) * 0.05;
      }
      
      const currentPositions = dataCloud.geometry.getAttribute('position').array as Float32Array;
      let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0, n = 0;

      for (let i = 0; i < pointCount; i++) {
        const i3 = i * 3;
        const originalX = originalPositions[i3];
        // Use a different original component for y to avoid perfect correlation
        const originalY = originalPositions[i3 + 1]; 
        
        // Morph to correlated state
        const targetY = originalX * targetCorrelation * 1.5 + originalY * (1 - Math.abs(targetCorrelation));
        currentPositions[i3+1] += (targetY - currentPositions[i3+1]) * 0.1;
        
        sumX += currentPositions[i3];
        sumY += currentPositions[i3+1];
        sumXY += currentPositions[i3] * currentPositions[i3+1];
        sumX2 += currentPositions[i3] * currentPositions[i3];
        n++;
      }
      dataCloud.geometry.getAttribute('position').needsUpdate = true;
      dataCloud.rotation.y = elapsedTime * 0.05;


      // --- Regression Calculation ---
      if(Math.abs(targetCorrelation) > 0.1) {
        regressionLine.visible = true;
        const m = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
        const b = (sumY - m * sumX) / n;
        
        const linePos = regressionLine.geometry.getAttribute('position').array as Float32Array;
        const minX = -12.5, maxX = 12.5;
        linePos[0] = minX;
        linePos[1] = m * minX + b;
        linePos[2] = 0;
        linePos[3] = maxX;
        linePos[4] = m * maxX + b;
        linePos[5] = 0;
        regressionLine.geometry.getAttribute('position').needsUpdate = true;
      } else {
        regressionLine.visible = false;
      }

      renderer.render(scene, camera);
    };
    animate();

    // --- Event Listeners ---
    const handleMouseMove = (event: MouseEvent) => {
      if (currentMount) {
        const rect = currentMount.getBoundingClientRect();
        mouse.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.current.y = -(((event.clientY - rect.top) / rect.height) * 2 - 1);
      }
    };
    const handleMouseEnter = () => { isMouseOver.current = true; onPointerEnter(); };
    const handleMouseLeave = () => { isMouseOver.current = false; onPointerLeave(); };

    currentMount.addEventListener('mousemove', handleMouseMove);
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
      window.removeEventListener('resize', handleResize);
      if (currentMount) {
        currentMount.removeEventListener('mousemove', handleMouseMove);
        currentMount.removeEventListener('mouseenter', handleMouseEnter);
        currentMount.removeEventListener('mouseleave', handleMouseLeave);
        // eslint-disable-next-line react-hooks/exhaustive-deps
        currentMount.removeChild(renderer.domElement);
      }
      renderer.dispose();
      pointsGeometry.dispose();
      pointsMaterial.dispose();
      lineGeometry.dispose();
      lineMaterial.dispose();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div ref={mountRef} className={cn('h-full w-full', className)} />;
}
