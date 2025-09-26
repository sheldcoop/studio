
'use client';

import { useEffect, useRef, useMemo } from 'react';
import * as THREE from 'three';
import { cn } from '@/lib/utils';

interface ConfidenceIntervalAnimationProps {
  className?: string;
  onPointerEnter: () => void;
  onPointerLeave: () => void;
}

type Particle = {
  mesh: THREE.Mesh;
  velocity: THREE.Vector3;
};

type IntervalBar = {
  mesh: THREE.Mesh;
  life: number;
};

export function ConfidenceIntervalAnimation({
  className,
  onPointerEnter,
  onPointerLeave,
}: ConfidenceIntervalAnimationProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const mouse = useRef({ x: 0, y: 0 });
  const isMouseOver = useRef(false);

  const particleMaterial = useMemo(
    () => new THREE.MeshBasicMaterial({ color: 0x58a6ff, transparent: true, opacity: 0.8 }),
    []
  );
  const correctIntervalMaterial = useMemo(
    () => new THREE.MeshBasicMaterial({ color: 0x22c55e, transparent: true, opacity: 0.8 }),
    []
  );
  const incorrectIntervalMaterial = useMemo(
    () => new THREE.MeshBasicMaterial({ color: 0xef4444, transparent: true, opacity: 0.8 }),
    []
  );

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
    camera.position.set(0, 0, 20);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    currentMount.appendChild(renderer.domElement);

    // --- Core Elements ---
    const trueMeanLineGeometry = new THREE.PlaneGeometry(0.2, 30);
    const trueMeanLineMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.3,
    });
    const trueMeanLine = new THREE.Mesh(trueMeanLineGeometry, trueMeanLineMaterial);
    trueMeanLine.position.y = -5;
    scene.add(trueMeanLine);

    const populationMean = 0;
    const populationStdDev = 3;
    const sampleSize = 30;

    let particles: Particle[] = [];
    let intervalBars: IntervalBar[] = [];
    const particleGeometry = new THREE.SphereGeometry(0.15, 8, 8);

    let samplePoints: number[] = [];
    const sampleThresholdY = -6;

    // --- Animation Logic ---
    const clock = new THREE.Clock();
    let confidenceLevel = 0.95;
    let spawnRate = 0.5;

    const animate = () => {
      requestAnimationFrame(animate);
      const delta = clock.getDelta();

      // --- INTERACTION ---
      if (isMouseOver.current) {
        confidenceLevel = 0.8 + (mouse.current.y + 1) * 0.095; // 80% to 99%
        spawnRate = 5;
      } else {
        confidenceLevel = 0.95;
        spawnRate = 0.5;
      }

      // --- PARTICLE SIMULATION ---
      if (Math.random() < spawnRate * delta) {
        const x = (Math.random() - 0.5) * 20;
        const y = 12;
        const particleMesh = new THREE.Mesh(particleGeometry, particleMaterial);
        particleMesh.position.set(x, y, 0);
        scene.add(particleMesh);
        particles.push({ mesh: particleMesh, velocity: new THREE.Vector3(0, -5, 0) });
      }

      particles.forEach((p, index) => {
        p.mesh.position.add(p.velocity.clone().multiplyScalar(delta));

        // Check if particle crosses the sampling line
        if (p.mesh.position.y < sampleThresholdY && p.mesh.position.y > sampleThresholdY - 0.5) {
          samplePoints.push(p.mesh.position.x);
        }

        if (p.mesh.position.y < -12) {
          scene.remove(p.mesh);
          p.mesh.geometry.dispose();
          particles.splice(index, 1);
        }
      });
      
      // --- CONFIDENCE INTERVAL GENERATION ---
      if (samplePoints.length >= sampleSize) {
        const currentSample = samplePoints.slice(0, sampleSize);
        samplePoints = [];

        const sampleMean = currentSample.reduce((a, b) => a + b, 0) / sampleSize;
        const zScore = getZScore(confidenceLevel);
        const marginOfError = zScore * (populationStdDev / Math.sqrt(sampleSize));

        const lowerBound = sampleMean - marginOfError;
        const upperBound = sampleMean + marginOfError;

        const isCorrect = populationMean >= lowerBound && populationMean <= upperBound;
        
        const barWidth = upperBound - lowerBound;
        const barHeight = 0.3;
        const barGeometry = new THREE.PlaneGeometry(barWidth, barHeight);
        const barMaterial = isCorrect ? correctIntervalMaterial : incorrectIntervalMaterial;
        const barMesh = new THREE.Mesh(barGeometry, barMaterial);
        
        const yPos = 10 - (intervalBars.length % 20) * 0.8;
        barMesh.position.set(sampleMean, yPos, 0);
        
        scene.add(barMesh);
        intervalBars.push({ mesh: barMesh, life: 5 });
      }

      // --- INTERVAL BAR LIFECYCLE ---
      intervalBars.forEach((bar, index) => {
          bar.life -= delta;
          bar.mesh.material.opacity = Math.max(0, bar.life / 2);

          if (bar.life <= 0) {
              scene.remove(bar.mesh);
              bar.mesh.geometry.dispose();
              intervalBars.splice(index, 1);
          }
      });


      renderer.render(scene, camera);
    };

    animate();
    
    // --- UTILITY ---
    const getZScore = (confidence: number) => {
        if (confidence >= 0.99) return 2.576;
        if (confidence >= 0.98) return 2.326;
        if (confidence >= 0.95) return 1.96;
        if (confidence >= 0.90) return 1.645;
        return 1.282; // 80%
    }

    // --- EVENT LISTENERS ---
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

    const handleResize = () => {
      if (currentMount) {
        renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
        camera.aspect = currentMount.clientWidth / currentMount.clientHeight;
        camera.updateProjectionMatrix();
      }
    };
    window.addEventListener('resize', handleResize);

    // --- CLEANUP ---
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
      particles.forEach(p => p.mesh.geometry.dispose());
      intervalBars.forEach(b => b.mesh.geometry.dispose());
      trueMeanLineGeometry.dispose();
      particleMaterial.dispose();
      correctIntervalMaterial.dispose();
      incorrectIntervalMaterial.dispose();
      trueMeanLineMaterial.dispose();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div ref={mountRef} className={cn('h-full w-full', className)} />;
}
