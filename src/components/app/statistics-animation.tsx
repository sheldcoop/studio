
'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { cn } from '@/lib/utils';

interface StatisticsAnimationProps {
  className?: string;
  onPointerEnter: () => void;
  onPointerLeave: () => void;
}

// Generates a point on a normal distribution
const normal = (mu: number, sigma: number) => {
    let x, y, r;
    do {
        x = Math.random() * 2 - 1;
        y = Math.random() * 2 - 1;
        r = x * x + y * y;
    } while (r >= 1 || r === 0);
    const z = x * Math.sqrt(-2 * Math.log(r) / r);
    return mu + z * sigma;
};

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
    camera.position.z = 10;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current.appendChild(renderer.domElement);

    const group = new THREE.Group();
    scene.add(group);

    // --- Bell Curve ---
    const curvePoints = [];
    const curveSegments = 100;
    const curveWidth = 10;
    const pdf = (x: number, mu: number, sigma: number) => 
        1 / (sigma * Math.sqrt(2 * Math.PI)) * Math.exp(-0.5 * Math.pow((x - mu) / sigma, 2));
    
    for (let i = 0; i <= curveSegments; i++) {
        const x = -curveWidth / 2 + (i / curveSegments) * curveWidth;
        curvePoints.push(new THREE.Vector3(x, 0, 0));
    }
    const curveGeometry = new THREE.BufferGeometry().setFromPoints(curvePoints);
    const curveMaterial = new THREE.LineBasicMaterial({ color: 0x58a6ff, transparent: true, opacity: 0.4 });
    const bellCurve = new THREE.Line(curveGeometry, curveMaterial);
    group.add(bellCurve);

    // --- Sample Particles (Cubes) ---
    const particleCount = 500;
    const particleGeometry = new THREE.BoxGeometry(0.1, 0.1, 0.1);
    const particleMaterial = new THREE.MeshBasicMaterial({ color: 0x58a6ff, transparent: true, opacity: 0.6 });
    const instancedMesh = new THREE.InstancedMesh(particleGeometry, particleMaterial, particleCount);
    group.add(instancedMesh);

    const dummy = new THREE.Object3D();

    // --- Animation & Interaction ---
    const clock = new THREE.Clock();
    let targetMean = 0;
    let targetStdDev = 1.5;
    let currentMean = 0;
    let currentStdDev = 1.5;

    const animate = () => {
      if (isMouseOver.current) {
        targetMean = mouse.current.x * 5; // Map mouse X to mean (-5 to 5)
        targetStdDev = (mouse.current.y + 1) * 1.5 + 0.5; // Map mouse Y to std dev (0.5 to 3.5)
      } else {
        targetMean = 0;
        targetStdDev = 1.5;
      }
      
      // Easing
      currentMean += (targetMean - currentMean) * 0.05;
      currentStdDev += (targetStdDev - currentStdDev) * 0.05;

      // Update Bell Curve
      const positions = bellCurve.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i <= curveSegments; i++) {
          const x = -curveWidth / 2 + (i / curveSegments) * curveWidth;
          positions[i * 3 + 1] = pdf(x, 0, currentStdDev) * 10;
      }
      bellCurve.geometry.attributes.position.needsUpdate = true;
      bellCurve.position.x = currentMean;

      // Update Particles
      for(let i = 0; i < particleCount; i++) {
          dummy.position.set(
              normal(currentMean, currentStdDev),
              (Math.random() - 0.5) * 5,
              (Math.random() - 0.5) * 5
          );
          dummy.updateMatrix();
          instancedMesh.setMatrixAt(i, dummy.matrix);
      }
      instancedMesh.instanceMatrix.needsUpdate = true;
      
      group.rotation.y = clock.getElapsedTime() * 0.05;

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
      particleGeometry.dispose();
      particleMaterial.dispose();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div ref={mountRef} className={cn('h-full w-full', className)} />;
}
