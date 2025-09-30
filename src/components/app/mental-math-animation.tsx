
'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { cn } from '@/lib/utils';
import { useTheme } from 'next-themes';

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
  const { theme } = useTheme();

  useEffect(() => {
    if (!mountRef.current) return;
    const currentMount = mountRef.current;
    let animationFrameId: number;

    const main = () => {
      let frameId: number;

      const computedStyle = getComputedStyle(currentMount);
      const primaryColorValue = computedStyle.getPropertyValue('--animation-primary-color').trim();
      const opacityValue = parseFloat(computedStyle.getPropertyValue('--animation-opacity').trim());
      const primaryColor = new THREE.Color(primaryColorValue);


      const particlesMaterial = new THREE.PointsMaterial({
          size: 0.1,
          blending: THREE.AdditiveBlending,
          transparent: true,
          sizeAttenuation: true,
        });
      particlesMaterial.color.set(primaryColor);
      particlesMaterial.opacity = opacityValue;

      // --- Scene Setup ---
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(
        75,
        currentMount.clientWidth / currentMount.clientHeight,
        0.1,
        100
      );
      camera.position.z = 20;

      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      currentMount.appendChild(renderer.domElement);

      // --- Particle System ---
      const particleCount = 2000;
      const particlesGeometry = new THREE.BufferGeometry();
      const positions = new Float32Array(particleCount * 3);
      const velocities = new Float32Array(particleCount * 3);

      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        // Start in a large spherical volume
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(Math.random() * 2 - 1);
        const radius = 10 + Math.random() * 15;
        positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
        positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
        positions[i3 + 2] = radius * Math.cos(phi);

        velocities[i3] = 0;
        velocities[i3 + 1] = 0;
        velocities[i3 + 2] = 0;
      }
      particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      particlesGeometry.setAttribute('velocity', new THREE.BufferAttribute(velocities, 3));

      const particleSystem = new THREE.Points(particlesGeometry, particlesMaterial);
      scene.add(particleSystem);

      const clock = new THREE.Clock();

      const animate = () => {
        frameId = requestAnimationFrame(animate);
        const delta = clock.getDelta();

        const positionAttribute = particleSystem.geometry.getAttribute('position');
        const velocityAttribute = particleSystem.geometry.getAttribute('velocity');

        let targetSpeed = isMouseOver.current ? 0.8 : 0.2;

        for (let i = 0; i < particleCount; i++) {
          const i3 = i * 3;

          const pos = new THREE.Vector3(
            positionAttribute.getX(i),
            positionAttribute.getY(i),
            positionAttribute.getZ(i)
          );
          const vel = new THREE.Vector3(
            velocityAttribute.getX(i),
            velocityAttribute.getY(i),
            velocityAttribute.getZ(i)
          );
          
          // Attract to center
          const directionToCenter = new THREE.Vector3().sub(pos).normalize();
          const acceleration = directionToCenter.multiplyScalar(targetSpeed * 15 * delta);
          
          vel.add(acceleration);

          // Add rotational velocity
          const rotationalVel = new THREE.Vector3().crossVectors(pos, new THREE.Vector3(0.1, 0.2, 0.3)).normalize();
          vel.add(rotationalVel.multiplyScalar(targetSpeed * 0.5 * delta));
          
          // Update position and apply damping
          pos.add(vel.multiplyScalar(0.98));
          
          // Reset if particle gets too close to center or too far
          if (pos.length() < 1 || pos.length() > 30) {
              const theta = Math.random() * Math.PI * 2;
              const phi = Math.acos(Math.random() * 2 - 1);
              const radius = 20 + Math.random() * 5;
              pos.set(
                radius * Math.sin(phi) * Math.cos(theta),
                radius * Math.sin(phi) * Math.sin(theta),
                radius * Math.cos(phi)
              );
              vel.set(0, 0, 0);
          }

          positionAttribute.setXYZ(i, pos.x, pos.y, pos.z);
          velocityAttribute.setXYZ(i, vel.x, vel.y, vel.z);
        }

        positionAttribute.needsUpdate = true;
        
        particleSystem.rotation.y += 0.0005;

        renderer.render(scene, camera);
      };

      animate();

      const handleMouseEnter = () => {
        isMouseOver.current = true;
        onPointerEnter();
      };
      const handleMouseLeave = () => {
        isMouseOver.current = false;
        onPointerLeave();
      };

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

      return () => {
        cancelAnimationFrame(frameId);
        window.removeEventListener('resize', handleResize);
        if (currentMount) {
          currentMount.removeEventListener('mouseenter', handleMouseEnter);
          currentMount.removeEventListener('mouseleave', handleMouseLeave);
          if (renderer.domElement) {
            currentMount.removeChild(renderer.domElement);
          }
        }
        renderer.dispose();
        particlesGeometry.dispose();
        particlesMaterial.dispose();
      };
    }
    
    animationFrameId = requestAnimationFrame(main);

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      while (currentMount.firstChild) {
        currentMount.removeChild(currentMount.firstChild);
      }
    }
  }, [theme, onPointerEnter, onPointerLeave]);

  return <div ref={mountRef} className={cn('h-full w-full', className)} />;
}
