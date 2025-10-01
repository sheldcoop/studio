'use client';

import { useRef, useEffect, useMemo } from 'react';
import * as THREE from 'three';
import { cn } from '@/lib/utils';

interface ProbabilityAnimationProps {
  className?: string;
  isHovered: boolean;
}

export function ProbabilityAnimation({
  className,
  isHovered,
}: ProbabilityAnimationProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const isMouseOver = useRef(isHovered);

  useEffect(() => {
    isMouseOver.current = isHovered;
  }, [isHovered]);

  useEffect(() => {
    if (!mountRef.current) return;
    const currentMount = mountRef.current;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      currentMount.clientWidth / currentMount.clientHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    currentMount.appendChild(renderer.domElement);

    camera.position.z = 25;

    const primaryColorValue = getComputedStyle(currentMount)
      .getPropertyValue('--animation-primary-color')
      .trim();
    const primaryColor = new THREE.Color(primaryColorValue);

    // --- Pegs ---
    const pegs: THREE.Mesh[] = [];
    const pegGeometry = new THREE.CylinderGeometry(0.3, 0.3, 1, 12);
    const pegMaterial = new THREE.MeshBasicMaterial({ color: primaryColor });

    const rows = 10;
    const colSpacing = 2;
    for (let row = 0; row < rows; row++) {
      const cols = row + 1;
      for (let col = 0; col < cols; col++) {
        const peg = new THREE.Mesh(pegGeometry, pegMaterial);
        peg.position.x = (col - (cols - 1) / 2) * colSpacing;
        peg.position.y = 8 - row * 1.5;
        peg.rotation.x = Math.PI / 2;
        scene.add(peg);
        pegs.push(peg);
      }
    }
    
    // --- Balls (Particles) ---
    const ballGeometry = new THREE.SphereGeometry(0.25, 12, 12);
    const ballMaterial = new THREE.MeshBasicMaterial({ color: primaryColor });
    const balls: { mesh: THREE.Mesh; velocity: THREE.Vector3; life: number }[] = [];
    const maxBalls = 200;
    const ballPool = Array(maxBalls).fill(null).map(() => new THREE.Mesh(ballGeometry, ballMaterial));


    let frameCount = 0;
    const animate = () => {
      requestAnimationFrame(animate);

      // Spawn new ball
      const spawnRate = isMouseOver.current ? 2 : 10;
      if (frameCount % spawnRate === 0) {
        const ballMesh = ballPool.find(b => !b.userData.active);
        if(ballMesh) {
          ballMesh.position.set(Math.random() * 2 - 1, 11, 0);
          ballMesh.userData = {
            velocity: new THREE.Vector3(0, -0.1, 0),
            life: 1,
            active: true,
          };
          scene.add(ballMesh);
          balls.push(ballMesh.userData);
          ballMesh.userData.mesh = ballMesh;
        }
      }

      // Update balls
      for (let i = balls.length - 1; i >= 0; i--) {
        const ball = balls[i];
        const ballMesh = ball.mesh as THREE.Mesh;
        
        ballMesh.position.add(ball.velocity);
        ball.velocity.y -= 0.005; // Gravity
        ball.life -= 0.005;

        if (ball.life <= 0) {
          scene.remove(ballMesh);
          ball.active = false;
          balls.splice(i, 1);
          continue;
        }

        // Collision with pegs
        for (const peg of pegs) {
          const dist = ballMesh.position.distanceTo(peg.position);
          if (dist < 0.3 + 0.25) {
            ball.velocity.x += (Math.random() - 0.5) * 0.15;
            ball.velocity.y *= -0.6; // Bounce
            break;
          }
        }
      }

      frameCount++;
      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      camera.aspect = currentMount.clientWidth / currentMount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (currentMount) {
        currentMount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={mountRef} className={cn('h-full w-full', className)} />;
}
