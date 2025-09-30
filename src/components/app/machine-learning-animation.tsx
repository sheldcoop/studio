
'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { cn } from '@/lib/utils';
import { useTheme } from 'next-themes';

interface MachineLearningAnimationProps {
  className?: string;
  onPointerEnter: () => void;
  onPointerLeave: () => void;
}

export function MachineLearningAnimation({
  className,
  onPointerEnter,
  onPointerLeave,
}: MachineLearningAnimationProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const isMouseOver = useRef(false);
  const { theme } = useTheme();

  useEffect(() => {
    if (!mountRef.current) return;
    const currentMount = mountRef.current;
    let animationFrameId: number;

    const cleanupFunctions: (() => void)[] = [];

    // Wrap in requestAnimationFrame to ensure CSS variables are ready
    animationFrameId = requestAnimationFrame(() => {
      if (!currentMount) return;

      const computedStyle = getComputedStyle(document.documentElement);
      const primaryColorValue = computedStyle.getPropertyValue('--animation-primary-color').trim();
      const opacityValue = parseFloat(computedStyle.getPropertyValue('--animation-opacity').trim());
      const primaryColor = new THREE.Color(primaryColorValue);

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(
        75,
        currentMount.clientWidth / currentMount.clientHeight,
        0.1,
        1000
      );
      camera.position.set(0, 0, 10);

      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      currentMount.appendChild(renderer.domElement);
      cleanupFunctions.push(() => {
        if (renderer.domElement.parentElement === currentMount) {
          currentMount.removeChild(renderer.domElement);
        }
        renderer.dispose();
      });

      const networkGroup = new THREE.Group();
      scene.add(networkGroup);
      
      const nodeMaterial = new THREE.MeshBasicMaterial({ color: primaryColor, transparent: true, opacity: opacityValue * 0.8 });
      const nodeGeometry = new THREE.SphereGeometry(0.2, 16, 16);

      const lineMaterial = new THREE.LineBasicMaterial({ color: primaryColor, transparent: true, opacity: opacityValue * 0.3 });

      const layers = [4, 5, 5, 3]; // Input, 2 Hidden, Output
      const layerSpacing = 4;
      const nodeSpacing = 2;
      const nodes: THREE.Mesh[][] = [];
      
      // Create nodes
      layers.forEach((nodeCount, layerIndex) => {
        const layerNodes: THREE.Mesh[] = [];
        const x = (layerIndex - (layers.length - 1) / 2) * layerSpacing;
        for (let i = 0; i < nodeCount; i++) {
          const y = (i - (nodeCount - 1) / 2) * nodeSpacing;
          const node = new THREE.Mesh(nodeGeometry, nodeMaterial);
          node.position.set(x, y, 0);
          networkGroup.add(node);
          layerNodes.push(node);
        }
        nodes.push(layerNodes);
      });

      // Create lines
      for (let i = 0; i < nodes.length - 1; i++) {
        for (const node1 of nodes[i]) {
          for (const node2 of nodes[i + 1]) {
            const geometry = new THREE.BufferGeometry().setFromPoints([node1.position, node2.position]);
            const line = new THREE.Line(geometry, lineMaterial);
            networkGroup.add(line);
            cleanupFunctions.push(() => geometry.dispose());
          }
        }
      }
      
      cleanupFunctions.push(() => {
          nodeGeometry.dispose();
          nodeMaterial.dispose();
          lineMaterial.dispose();
      });

      // Create pulses
      const pulseGeometry = new THREE.SphereGeometry(0.1, 8, 8);
      const pulseMaterial = new THREE.MeshBasicMaterial({ color: primaryColor, transparent: true, opacity: opacityValue });
      const pulses: { mesh: THREE.Mesh, start: THREE.Vector3, end: THREE.Vector3, progress: number, speed: number }[] = [];
      const pulseCount = 50;

      for (let i = 0; i < pulseCount; i++) {
        const mesh = new THREE.Mesh(pulseGeometry, pulseMaterial);
        pulses.push({ mesh, start: new THREE.Vector3(), end: new THREE.Vector3(), progress: 1, speed: 0 });
        scene.add(mesh);
      }
      cleanupFunctions.push(() => {
          pulseGeometry.dispose();
          pulseMaterial.dispose();
      });

      const resetPulse = (pulse: typeof pulses[0]) => {
        const startLayerIndex = Math.floor(Math.random() * (layers.length - 1));
        const endLayerIndex = startLayerIndex + 1;
        const startNode = nodes[startLayerIndex][Math.floor(Math.random() * nodes[startLayerIndex].length)];
        const endNode = nodes[endLayerIndex][Math.floor(Math.random() * nodes[endLayerIndex].length)];
        
        pulse.start.copy(startNode.position);
        pulse.end.copy(endNode.position);
        pulse.progress = 0;
        pulse.speed = 0.5 + Math.random() * 0.8;
      };

      pulses.forEach(resetPulse);

      const clock = new THREE.Clock();

      const animate = () => {
        animationFrameId = requestAnimationFrame(animate);
        const delta = clock.getDelta();

        networkGroup.rotation.y += 0.0005;
        networkGroup.rotation.x += 0.0005;

        const pulseSpeedMultiplier = isMouseOver.current ? 4 : 1;

        pulses.forEach(pulse => {
          pulse.progress += pulse.speed * delta * pulseSpeedMultiplier;
          if (pulse.progress >= 1) {
            resetPulse(pulse);
          }
          pulse.mesh.position.lerpVectors(pulse.start, pulse.end, pulse.progress);
        });

        renderer.render(scene, camera);
      };

      animate();

      const handleMouseEnter = () => { isMouseOver.current = true; onPointerEnter(); };
      const handleMouseLeave = () => { isMouseOver.current = false; onPointerLeave(); };
      
      currentMount.addEventListener('mouseenter', handleMouseEnter);
      currentMount.addEventListener('mouseleave', handleMouseLeave);
      currentMount.addEventListener('touchstart', handleMouseEnter, { passive: true });
      currentMount.addEventListener('touchend', handleMouseLeave);

      const handleResize = () => {
        if (currentMount) {
          camera.aspect = currentMount.clientWidth / currentMount.clientHeight;
          camera.updateProjectionMatrix();
          renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
        }
      };
      window.addEventListener('resize', handleResize);
      
      cleanupFunctions.push(() => {
          currentMount.removeEventListener('mouseenter', handleMouseEnter);
          currentMount.removeEventListener('mouseleave', handleMouseLeave);
          currentMount.removeEventListener('touchstart', handleMouseEnter);
          currentMount.removeEventListener('touchend', handleMouseLeave);
          window.removeEventListener('resize', handleResize);
          cancelAnimationFrame(animationFrameId);
      });
    });

    return () => {
      cleanupFunctions.forEach(fn => fn());
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      while (currentMount.firstChild) {
        currentMount.removeChild(currentMount.firstChild);
      }
    };
  }, [theme, onPointerEnter, onPointerLeave]);

  return <div ref={mountRef} className={cn('h-full w-full', className)} />;
}
