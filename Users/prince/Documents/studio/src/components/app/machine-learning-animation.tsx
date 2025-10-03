
'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { cn } from '@/lib/utils';
import { useTheme } from 'next-themes';

interface MachineLearningAnimationProps {
  className?: string;
  isHovered: boolean;
}

export function MachineLearningAnimation({
  className,
  isHovered,
}: MachineLearningAnimationProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const isMouseOver = useRef(isHovered);
  const { theme } = useTheme();

  useEffect(() => {
    isMouseOver.current = isHovered;
  }, [isHovered]);

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
      const primaryColor = new THREE.Color(primaryColorValue);
      const secondaryColor = new THREE.Color(0x00ff88); // For data particles

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(
        75,
        currentMount.clientWidth / currentMount.clientHeight,
        0.1,
        1000
      );
      camera.position.z = 8; // Make the animation bigger

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

      const layers: { neuron: THREE.Mesh; glow: THREE.Mesh; material: THREE.MeshBasicMaterial; glowMaterial: THREE.MeshBasicMaterial; position: THREE.Vector3; activation: number }[][] = [];
      const connections: { line: THREE.Line; material: THREE.LineBasicMaterial; from: any; to: any }[] = [];
      const layerSizes = [4, 6, 6, 4, 2];
      const layerSpacing = 4;
      const nodeSpacing = 1.5;

      // Create neural network
      layerSizes.forEach((neuronCount, layerIndex) => {
        const layer: typeof layers[0] = [];
        const xPos = (layerIndex - (layerSizes.length - 1) / 2) * layerSpacing;
        
        for (let i = 0; i < neuronCount; i++) {
          const yPos = (i - (neuronCount - 1) / 2) * nodeSpacing;
          
          const neuronGeometry = new THREE.SphereGeometry(0.25, 16, 16);
          const neuronMaterial = new THREE.MeshBasicMaterial({ 
            color: primaryColor,
            transparent: true,
            opacity: 0.9
          });
          const neuron = new THREE.Mesh(neuronGeometry, neuronMaterial);
          neuron.position.set(xPos, yPos, 0);
          scene.add(neuron);
          cleanupFunctions.push(() => neuronGeometry.dispose());
          cleanupFunctions.push(() => neuronMaterial.dispose());
          
          const glowGeometry = new THREE.SphereGeometry(0.35, 16, 16);
          const glowMaterial = new THREE.MeshBasicMaterial({
            color: primaryColor,
            transparent: true,
            opacity: 0.2,
            blending: THREE.AdditiveBlending
          });
          const glow = new THREE.Mesh(glowGeometry, glowMaterial);
          glow.position.set(xPos, yPos, 0);
          scene.add(glow);
          cleanupFunctions.push(() => glowGeometry.dispose());
          cleanupFunctions.push(() => glowMaterial.dispose());
          
          layer.push({ 
            neuron, 
            glow,
            material: neuronMaterial, 
            glowMaterial,
            position: new THREE.Vector3(xPos, yPos, 0),
            activation: Math.random()
          });
          
          if (layerIndex > 0) {
            layers[layerIndex - 1].forEach((prevNeuron) => {
              const points = [prevNeuron.position, new THREE.Vector3(xPos, yPos, 0)];
              const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
              const lineMaterial = new THREE.LineBasicMaterial({ 
                color: primaryColor,
                transparent: true,
                opacity: 0.15
              });
              const line = new THREE.Line(lineGeometry, lineMaterial);
              scene.add(line);
              
              connections.push({
                line,
                material: lineMaterial,
                from: prevNeuron,
                to: layer[layer.length - 1]
              });
              cleanupFunctions.push(() => lineGeometry.dispose());
              cleanupFunctions.push(() => lineMaterial.dispose());
            });
          }
        }
        layers.push(layer);
      });

      const particleGeometry = new THREE.SphereGeometry(0.08, 8, 8);
      const particleMaterial = new THREE.MeshBasicMaterial({ 
        color: secondaryColor,
        transparent: true,
        opacity: 0.8
      });
      cleanupFunctions.push(() => particleGeometry.dispose());
      cleanupFunctions.push(() => particleMaterial.dispose());

      const dataParticles: { mesh: THREE.Mesh; material: THREE.MeshBasicMaterial; progress: number; speed: number; path: number }[] = [];
      for (let i = 0; i < 15; i++) {
        const particle = new THREE.Mesh(particleGeometry, particleMaterial.clone());
        particle.position.set(-10, 0, 0);
        scene.add(particle);
        dataParticles.push({
          mesh: particle,
          material: particle.material as THREE.MeshBasicMaterial,
          progress: Math.random(),
          speed: 1.5 + Math.random() * 0.4, // Increased speed
          path: Math.floor(Math.random() * layers[0].length)
        });
        cleanupFunctions.push(() => (particle.material as THREE.Material).dispose());
      }
      
      const clock = new THREE.Clock();

      const animate = () => {
        animationFrameId = requestAnimationFrame(animate);
        const time = clock.getElapsedTime();
        const delta = clock.getDelta();

        layers.forEach((layer, layerIndex) => {
          layer.forEach((neuron, neuronIndex) => {
            const delay = layerIndex * 0.3 + neuronIndex * 0.1;
            const pulse = Math.sin(time * 1.5 + delay) * 0.5 + 0.5;
            
            neuron.activation = pulse;
            neuron.material.opacity = 0.6 + pulse * 0.4;
            neuron.glowMaterial.opacity = 0.1 + pulse * 0.3;
            
            const scale = 1 + pulse * 0.2;
            neuron.neuron.scale.setScalar(scale);
            neuron.glow.scale.setScalar(scale * 1.2);
          });
        });

        connections.forEach((conn) => {
          const avgActivation = (conn.from.activation + conn.to.activation) / 2;
          conn.material.opacity = 0.1 + avgActivation * 0.4;
        });

        const speedMultiplier = isMouseOver.current ? 4 : 1;
        dataParticles.forEach((particle) => {
          particle.progress += particle.speed * delta * speedMultiplier;
          
          if (particle.progress > 1) {
            particle.progress = 0;
            particle.path = Math.floor(Math.random() * layers[0].length);
          }
          
          const layerProgress = particle.progress * (layers.length - 1);
          const currentLayerIdx = Math.floor(layerProgress);
          const nextLayerIdx = Math.min(currentLayerIdx + 1, layers.length - 1);
          const t = layerProgress - currentLayerIdx;
          
          if (currentLayerIdx < layers.length && nextLayerIdx < layers.length) {
            const fromIndex = Math.min(particle.path, layers[currentLayerIdx].length - 1);
            const toIndex = Math.min(particle.path, layers[nextLayerIdx].length - 1);
            
            const from = layers[currentLayerIdx][fromIndex].position;
            const to = layers[nextLayerIdx][toIndex].position;
            
            particle.mesh.position.lerpVectors(from, to, t);
            particle.material.opacity = 0.8 * (1 - Math.abs(t - 0.5) * 2);
          }
        });

        scene.rotation.y = Math.sin(time * 0.2) * 0.1;
        scene.rotation.x = Math.cos(time * 0.2) * 0.05;

        renderer.render(scene, camera);
      };

      animate();

      const handleResize = () => {
        if (currentMount) {
          camera.aspect = currentMount.clientWidth / currentMount.clientHeight;
          camera.updateProjectionMatrix();
          renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
        }
      };
      window.addEventListener('resize', handleResize);
      
      cleanupFunctions.push(() => {
          window.removeEventListener('resize', handleResize);
          if (animationFrameId) cancelAnimationFrame(animationFrameId);
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
  }, [theme]);

  return <div ref={mountRef} className={cn('h-full w-full', className)} />;
}
