'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { cn } from '@/lib/utils';

interface LinearAlgebraAnimationProps {
  className?: string;
}

export function LinearAlgebraAnimation({ className }: LinearAlgebraAnimationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    let animationFrameId: number;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      canvas.clientWidth / canvas.clientHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      alpha: true,
    });
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    renderer.setClearColor(0x000000, 0);

    const geometry = new THREE.BoxGeometry(2.5, 2.5, 2.5);
    const wireframe = new THREE.WireframeGeometry(geometry);
    const line = new THREE.LineSegments(wireframe);
    line.material.depthTest = false;
    line.material.opacity = 0.5;
    line.material.transparent = true;
    line.material.color = new THREE.Color('hsl(var(--primary))');
    scene.add(line);

    camera.position.z = 5;

    const animate = () => {
      if (!canvas.isConnected) return;
      animationFrameId = requestAnimationFrame(animate);
      line.rotation.x += 0.002;
      line.rotation.y += 0.003;
      renderer.render(scene, camera);
    };

    const onResize = () => {
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    };

    window.addEventListener('resize', onResize);
    onResize();
    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={cn(
        'absolute top-0 left-0 w-full h-full z-0 opacity-20',
        className
      )}
    />
  );
}