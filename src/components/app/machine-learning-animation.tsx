
'use client';

import { useRef } from 'react';
import { 
  SphereGeometry, 
  MeshBasicMaterial, 
  Mesh, 
  Vector3, 
  BufferGeometry,
  LineBasicMaterial,
  Line,
  Clock,
  Color
} from 'three';
import { cn } from '@/lib/utils';
import { useTheme } from 'next-themes';
import { useThreeAnimation } from '@/hooks/useThreeAnimation';

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

  useThreeAnimation(mountRef, {
    theme,
    onSetup: ({ scene, camera, renderer, primaryColor }) => {
      camera.position.z = 8;
      
      // Shared geometries
      const neuronGeometry = new SphereGeometry(0.25, 12, 12); // Reduced segments
      const glowGeometry = new SphereGeometry(0.35, 12, 12);
      const particleGeometry = new SphereGeometry(0.08, 6, 6);
      
      const secondaryColor = new Color(0x00ff88);
      
      // Network configuration
      const layerSizes = [4, 6, 6, 4, 2];
      const layerSpacing = 4;
      const nodeSpacing = 1.5;
      
      const layers: { 
        neuron: Mesh; 
        glow: Mesh; 
        material: MeshBasicMaterial; 
        glowMaterial: MeshBasicMaterial; 
        position: Vector3; 
        activation: number;
      }[][] = [];
      
      const connections: { 
        line: Line; 
        material: LineBasicMaterial; 
        from: any; 
        to: any;
      }[] = [];
      
      const materials: (MeshBasicMaterial | LineBasicMaterial)[] = [];

      // Create neural network layers
      layerSizes.forEach((neuronCount, layerIndex) => {
        const layer: typeof layers[0] = [];
        const xPos = (layerIndex - (layerSizes.length - 1) / 2) * layerSpacing;
        
        for (let i = 0; i < neuronCount; i++) {
          const yPos = (i - (neuronCount - 1) / 2) * nodeSpacing;
          
          // Reuse geometry, clone material
          const neuronMaterial = new MeshBasicMaterial({ 
            color: primaryColor,
            transparent: true,
            opacity: 0.9
          });
          const neuron = new Mesh(neuronGeometry, neuronMaterial);
          neuron.position.set(xPos, yPos, 0);
          scene.add(neuron);
          materials.push(neuronMaterial);
          
          const glowMaterial = new MeshBasicMaterial({
            color: primaryColor,
            transparent: true,
            opacity: 0.2,
            blending: 2 // THREE.AdditiveBlending
          });
          const glow = new Mesh(glowGeometry, glowMaterial);
          glow.position.set(xPos, yPos, 0);
          scene.add(glow);
          materials.push(glowMaterial);
          
          layer.push({ 
            neuron, 
            glow,
            material: neuronMaterial, 
            glowMaterial,
            position: new Vector3(xPos, yPos, 0),
            activation: Math.random()
          });
          
          // Create connections to previous layer
          if (layerIndex > 0) {
            layers[layerIndex - 1].forEach((prevNeuron) => {
              const points = [prevNeuron.position, new Vector3(xPos, yPos, 0)];
              const lineGeometry = new BufferGeometry().setFromPoints(points);
              const lineMaterial = new LineBasicMaterial({ 
                color: primaryColor,
                transparent: true,
                opacity: 0.15
              });
              const line = new Line(lineGeometry, lineMaterial);
              scene.add(line);
              materials.push(lineMaterial);
              
              connections.push({
                line,
                material: lineMaterial,
                from: prevNeuron,
                to: layer[layer.length - 1]
              });
            });
          }
        }
        layers.push(layer);
      });

      // Particle system with object pooling
      const particleMaterial = new MeshBasicMaterial({ 
        color: secondaryColor,
        transparent: true,
        opacity: 0.8
      });
      
      const maxParticles = 15;
      const dataParticles: { 
        mesh: Mesh; 
        progress: number; 
        speed: number; 
        path: number;
      }[] = [];
      
      for (let i = 0; i < maxParticles; i++) {
        const particle = new Mesh(particleGeometry, particleMaterial);
        particle.position.set(-10, 0, 0);
        scene.add(particle);
        dataParticles.push({
          mesh: particle,
          progress: Math.random(),
          speed: 1.5 + Math.random() * 0.4,
          path: Math.floor(Math.random() * layers[0].length)
        });
      }
      
      const clock = new Clock();
      const tempVec = new Vector3();

      const animate = () => {
        const time = clock.getElapsedTime();
        const delta = clock.getDelta();

        // Update neuron activations
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

        // Update connection opacities
        connections.forEach((conn) => {
          const avgActivation = (conn.from.activation + conn.to.activation) / 2;
          conn.material.opacity = 0.1 + avgActivation * 0.4;
        });

        // Update particles
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
            
            // Lerp position
            tempVec.lerpVectors(from, to, t);
            particle.mesh.position.copy(tempVec);
            
            // Fade in/out during transit
            particleMaterial.opacity = 0.8 * (1 - Math.abs(t - 0.5) * 2);
          }
        });

        // Subtle scene rotation
        scene.rotation.y = Math.sin(time * 0.2) * 0.1;
        scene.rotation.x = Math.cos(time * 0.2) * 0.05;

        renderer.render(scene, camera);
      };

      return {
        animate,
        cleanup: () => {
          neuronGeometry.dispose();
          glowGeometry.dispose();
          particleGeometry.dispose();
          particleMaterial.dispose();
          materials.forEach(m => m.dispose());
          connections.forEach(c => c.line.geometry.dispose());
        },
        materials
      };
    }
  });

  // Sync isHovered prop with ref
  isMouseOver.current = isHovered;

  return <div ref={mountRef} className={cn('h-full w-full', className)} />;
}
