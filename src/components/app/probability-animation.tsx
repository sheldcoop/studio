
'use client';

import { useEffect, useRef, useMemo } from 'react';
import * as THREE from 'three';
import { cn } from '@/lib/utils';

interface ProbabilityAnimationProps {
  className?: string;
  onPointerEnter: () => void;
  onPointerLeave: () => void;
}

export function ProbabilityAnimation({
  className,
  onPointerEnter,
  onPointerLeave,
}: ProbabilityAnimationProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const isMouseOver = useRef(false);

  const particlesMaterial = useMemo(
    () =>
      new THREE.PointsMaterial({
        color: 0x22c55e,
        size: 0.25,
        blending: THREE.AdditiveBlending,
        transparent: true,
        opacity: 0.9,
        sizeAttenuation: true,
      }),
    []
  );

  useEffect(() => {
    if (!mountRef.current) return;
    const currentMount = mountRef.current;
    let frameId: number;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      currentMount.clientWidth / currentMount.clientHeight,
      0.1,
      100
    );
    camera.position.z = 25;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    currentMount.appendChild(renderer.domElement);

    const particleCount = 1000;
    const particlesGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const particleData = [];

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * 30;
      positions[i3 + 1] = (Math.random() - 0.5) * 30;
      positions[i3 + 2] = (Math.random() - 0.5) * 30;
      
      particleData.push({
        velocity: new THREE.Vector3(
          (Math.random() - 0.5) * 0.1,
          (Math.random() - 0.5) * 0.1,
          (Math.random() - 0.5) * 0.1
        ),
        originalPos: new THREE.Vector3(positions[i3], positions[i3+1], positions[i3+2]),
      });
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particleSystem = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particleSystem);
    
    const planeGeometry = new THREE.PlaneGeometry(15, 15, 1, 1);
    const planeMaterial = new THREE.MeshBasicMaterial({
        color: 0x22c55e,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0,
        wireframe: true,
    });
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    scene.add(plane);


    const clock = new THREE.Clock();

    const animate = () => {
      frameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();

      const positionAttribute = particleSystem.geometry.getAttribute('position');
      
      let attractFactor = isMouseOver.current ? 1.0 : 0.0;
      plane.material.opacity += ( (isMouseOver.current ? 0.3 : 0.0) - plane.material.opacity) * 0.1;

      for (let i = 0; i < particleCount; i++) {
        const pos = new THREE.Vector3(
          positionAttribute.getX(i),
          positionAttribute.getY(i),
          positionAttribute.getZ(i)
        );
        
        pos.add(particleData[i].velocity);
        
        // Bounce off walls
        if (Math.abs(pos.x) > 15) particleData[i].velocity.x *= -1;
        if (Math.abs(pos.y) > 15) particleData[i].velocity.y *= -1;
        if (Math.abs(pos.z) > 15) particleData[i].velocity.z *= -1;

        // Attract to plane
        const targetPos = new THREE.Vector3(pos.x, pos.y, 0);
        pos.lerp(targetPos, attractFactor * 0.05);

        positionAttribute.setXYZ(i, pos.x, pos.y, pos.z);
      }

      positionAttribute.needsUpdate = true;
      particleSystem.rotation.y += delta * 0.05;
      plane.rotation.y = particleSystem.rotation.y

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
        currentMount.removeChild(renderer.domElement);
      }
      renderer.dispose();
      particlesGeometry.dispose();
      planeGeometry.dispose();
      planeMaterial.dispose();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div ref={mountRef} className={cn('h-full w-full', className)} />;
}
