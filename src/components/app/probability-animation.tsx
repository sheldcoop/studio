
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

  // Memoize materials and geometries for performance
  const coinMaterials = useMemo(
    () => [
      new THREE.MeshStandardMaterial({
        color: 0xcccccc,
        metalness: 0.7,
        roughness: 0.3,
      }), // side
      new THREE.MeshStandardMaterial({
        color: 0xffd700,
        metalness: 0.8,
        roughness: 0.2,
      }), // heads
      new THREE.MeshStandardMaterial({
        color: 0x818cf8,
        metalness: 0.8,
        roughness: 0.2,
      }), // tails
    ],
    []
  );

  const coinGeometry = useMemo(
    () => new THREE.CylinderGeometry(1, 1, 0.2, 32),
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
      1000
    );
    let targetCameraZ = 20;
    camera.position.z = targetCameraZ;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    currentMount.appendChild(renderer.domElement);

    // --- Lighting ---
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 10, 7.5);
    scene.add(directionalLight);

    // --- Coin Instancing ---
    const numCoins = 200;
    const coinsGroup = new THREE.Group();
    scene.add(coinsGroup);
    const coinData = [];

    for (let i = 0; i < numCoins; i++) {
      const coin = new THREE.Mesh(coinGeometry, coinMaterials);
      coin.rotation.x = Math.random() * Math.PI;
      coin.rotation.y = Math.random() * Math.PI;

      const x = (Math.random() - 0.5) * 30;
      const y = (Math.random() - 0.5) * 30;
      const z = (Math.random() - 0.5) * 30;
      coin.position.set(x, y, z);

      coinsGroup.add(coin);

      coinData.push({
        mesh: coin,
        velocity: new THREE.Vector3(
          (Math.random() - 0.5) * 0.1,
          (Math.random() - 0.5) * 0.1,
          (Math.random() - 0.5) * 0.1,
        ),
        angularVelocity: new THREE.Vector3(
          (Math.random() - 0.5) * 0.1,
          (Math.random() - 0.5) * 0.1,
          (Math.random() - 0.5) * 0.1
        ),
      });
    }

    const clock = new THREE.Clock();

    const animate = () => {
      frameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();

      const timeScale = isMouseOver.current ? 0.1 : 1.0;
      targetCameraZ = isMouseOver.current ? 8 : 20;

      camera.position.z += (targetCameraZ - camera.position.z) * 0.05;

      coinData.forEach((data) => {
        data.mesh.position.add(
          data.velocity.clone().multiplyScalar(delta * 60 * timeScale)
        );
        data.mesh.rotation.x += data.angularVelocity.x * timeScale;
        data.mesh.rotation.y += data.angularVelocity.y * timeScale;
        data.mesh.rotation.z += data.angularVelocity.z * timeScale;

        // Wrap around logic
        if (data.mesh.position.y < -20) data.mesh.position.y = 20;
        if (data.mesh.position.x < -20) data.mesh.position.x = 20;
        if (data.mesh.position.x > 20) data.mesh.position.x = -20;
      });

      coinsGroup.rotation.y += 0.0005;

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
      coinGeometry.dispose();
      coinMaterials.forEach((m) => m.dispose());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div ref={mountRef} className={cn('h-full w-full', className)} />;
}
