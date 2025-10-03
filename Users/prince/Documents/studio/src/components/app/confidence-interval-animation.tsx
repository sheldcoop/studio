
'use client';

import { useEffect, useRef } from 'react';
import { Scene, PerspectiveCamera, WebGLRenderer, Group, PointsMaterial, BufferGeometry, Float32BufferAttribute, Points, LineBasicMaterial, Vector3, Line, Clock } from 'three';
import { cn } from '@/lib/utils';
import { useTheme } from 'next-themes';

interface CorrelationOrbAnimationProps {
  className?: string;
  isHovered: boolean;
}

export function ConfidenceIntervalAnimation({
  className,
  isHovered,
}: CorrelationOrbAnimationProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const mouse = useRef({ x: 0, y: 0 });
  const isMouseOver = useRef(isHovered);
  const { theme } = useTheme();

  useEffect(() => {
    isMouseOver.current = isHovered;
  }, [isHovered]);

  useEffect(() => {
    if (!mountRef.current) return;
    const currentMount = mountRef.current;
    let animationFrameId: number;

    const main = () => {
      let frameId: number;

      const computedStyle = getComputedStyle(currentMount);
      const primaryColorValue = computedStyle.getPropertyValue('--animation-primary-color').trim();
      const opacityValue = parseFloat(computedStyle.getPropertyValue('--animation-opacity').trim());
      const primaryColor = new (await import('three')).Color(primaryColorValue);


      const particleMaterial = new PointsMaterial({
          size: 0.2,
          blending: (await import('three')).AdditiveBlending,
          transparent: true,
          sizeAttenuation: true,
        });
      particleMaterial.color.set(primaryColor);
      particleMaterial.opacity = opacityValue;


      const axisMaterial = new LineBasicMaterial({ transparent: true, opacity: 0 });
      axisMaterial.color.set(primaryColor);

      const scene = new Scene();
      const camera = new PerspectiveCamera(
        75,
        currentMount.clientWidth / currentMount.clientHeight,
        0.1,
        1000
      );
      camera.position.set(0, 0, 15);

      const renderer = new WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
      renderer.setPixelRatio(window.devicePixelRatio);
      currentMount.appendChild(renderer.domElement);

      const orbGroup = new Group();
      scene.add(orbGroup);

      // --- Particles ---
      const particleCount = 1500;
      const particlesGeometry = new BufferGeometry();
      const positions = new Float32Array(particleCount * 3);
      const particleData: { theta: number; phi: number; randomPhase: number; randomSpeed: number }[] = [];

      const sphereRadius = 7;
      for (let i = 0; i < particleCount; i++) {
        const theta = Math.random() * 2 * Math.PI;
        const phi = Math.acos(2 * Math.random() - 1);
        
        particleData.push({
          theta,
          phi,
          randomPhase: Math.random() * Math.PI * 2,
          randomSpeed: 0.1 + Math.random() * 0.2,
        });

        positions[i * 3] = sphereRadius * Math.sin(phi) * Math.cos(theta);
        positions[i * 3 + 1] = sphereRadius * Math.sin(phi) * Math.sin(theta);
        positions[i * 3 + 2] = sphereRadius * Math.cos(phi);
      }
      particlesGeometry.setAttribute('position', new Float32BufferAttribute(positions, 3));
      const particleSystem = new Points(particlesGeometry, particleMaterial);
      orbGroup.add(particleSystem);

      // --- Axis Line ---
      const axisGeometry = new BufferGeometry().setFromPoints([
        new Vector3(0, -12, 0),
        new Vector3(0, 12, 0),
      ]);
      const axisLine = new Line(axisGeometry, axisMaterial);
      orbGroup.add(axisLine);

      const clock = new Clock();
      const targetRotation = { x: 0, y: 0 };
      let correlationFactor = 0;

      const animate = () => {
        frameId = requestAnimationFrame(animate);
        const delta = clock.getDelta();
        const elapsedTime = clock.getElapsedTime();

        const targetCorrelation = isMouseOver.current ? 1 : 0;
        correlationFactor += (targetCorrelation - correlationFactor) * 0.1;

        (axisLine.material as LineBasicMaterial).opacity = correlationFactor * 0.9;

        const currentPositions = particleSystem.geometry.getAttribute('position') as Float32BufferAttribute;
        for (let i = 0; i < particleCount; i++) {
          const { theta, phi, randomSpeed } = particleData[i];

          const randomX = sphereRadius * Math.sin(phi) * Math.cos(theta + elapsedTime * randomSpeed * 0.3);
          const randomY = sphereRadius * Math.sin(phi) * Math.sin(theta + elapsedTime * randomSpeed * 0.3);
          const randomZ = sphereRadius * Math.cos(phi);

          const ellipseAngle = elapsedTime * 0.8 + i * 0.1;
          const ellipseRadiusX = sphereRadius * Math.sin(phi);
          const ellipseRadiusY = sphereRadius * Math.sin(phi) * 0.2;
          
          const axis = new Vector3(0.5, 1, 0).normalize();
          const ellipsePoint = new Vector3(
            ellipseRadiusX * Math.cos(ellipseAngle),
            ellipseRadiusY * Math.sin(ellipseAngle),
            sphereRadius * Math.cos(phi)
          );
          ellipsePoint.applyAxisAngle(axis, Math.PI / 4);

          const currentVec = new Vector3(currentPositions.getX(i), currentPositions.getY(i), currentPositions.getZ(i));
          const randomVec = new Vector3(randomX, randomY, randomZ);
          const correlatedVec = ellipsePoint;

          const targetVec = randomVec.lerp(correlatedVec, correlationFactor);
          currentVec.lerp(targetVec, 0.1);

          currentPositions.setXYZ(i, currentVec.x, currentVec.y, currentVec.z);
        }
        currentPositions.needsUpdate = true;
        
        if (isMouseOver.current) {
            targetRotation.y = -mouse.current.x * 0.5;
            targetRotation.x = mouse.current.y * 0.5;
        } else {
            targetRotation.y = elapsedTime * 0.1;
            targetRotation.x = elapsedTime * 0.08;
        }
        
        orbGroup.rotation.x += (targetRotation.x - orbGroup.rotation.x) * 0.05;
        orbGroup.rotation.y += (targetRotation.y - orbGroup.rotation.y) * 0.05;

        renderer.render(scene, camera);
      };

      animate();

      const handleMouseMove = (event: MouseEvent) => {
        if (currentMount) {
          const rect = currentMount.getBoundingClientRect();
          mouse.current.x = (event.clientX - rect.left) / rect.width - 0.5;
          mouse.current.y = (event.clientY - rect.top) / rect.height - 0.5;
        }
      };
      
      currentMount.addEventListener('mousemove', handleMouseMove);

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
          currentMount.removeEventListener('mousemove', handleMouseMove);
          if (renderer.domElement) currentMount.removeChild(renderer.domElement);
        }
        renderer.dispose();
        particleMaterial.dispose();
        axisMaterial.dispose();
        particlesGeometry.dispose();
        axisGeometry.dispose();
      };
    }
    
    main();

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      while (currentMount.firstChild) {
        currentMount.removeChild(currentMount.firstChild);
      }
    }
  }, [theme]);

  return <div ref={mountRef} className={cn('h-full w-full', className)} />;
}
