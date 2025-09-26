'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { cn } from '@/lib/utils';

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
  const mouse = useRef({ x: 0, y: 0 });
  const isMouseOver = useRef(false);

  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 20;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(
      mountRef.current.clientWidth,
      mountRef.current.clientHeight
    );
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current.appendChild(renderer.domElement);

    const sprites = new THREE.Group();
    scene.add(sprites);

    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const context = canvas.getContext('2d')!;
    const texture = new THREE.CanvasTexture(canvas);

    const createTextSprite = (text: string) => {
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.font = 'Bold 24px Arial';
      context.fillStyle = 'rgba(128, 128, 128, 0.7)'; // Gray color, semi-transparent
      context.textAlign = 'center';
      context.textBaseline = 'middle';
      context.fillText(text, canvas.width / 2, canvas.height / 2);
      texture.needsUpdate = true;

      const material = new THREE.SpriteMaterial({
        map: texture,
        transparent: true,
        opacity: 0.2,
      });
      const sprite = new THREE.Sprite(material);
      sprite.scale.set(2, 2, 1);
      return sprite;
    };

    const numSprites = 100;
    const spriteObjects = [];

    for (let i = 0; i < numSprites; i++) {
      const text = String(Math.floor(Math.random() * 90) + 10);
      const sprite = createTextSprite(text);
      sprite.position.set(
        (Math.random() - 0.5) * 40,
        (Math.random() - 0.5) * 40,
        (Math.random() - 0.5) * 40
      );
      sprites.add(sprite);
      spriteObjects.push({
        sprite,
        baseY: sprite.position.y,
        speed: Math.random() * 0.02 + 0.01,
      });
    }

    const clock = new THREE.Clock();
    let targetRotation = new THREE.Euler(0, 0, 0);

    const animate = () => {
      const elapsedTime = clock.getElapsedTime();

      if (isMouseOver.current) {
        targetRotation.y = mouse.current.x * 0.2;
        targetRotation.x = mouse.current.y * 0.2;
      } else {
        targetRotation.y = 0;
        targetRotation.x = 0;
      }

      sprites.rotation.y += (targetRotation.y - sprites.rotation.y) * 0.05;
      sprites.rotation.x += (targetRotation.x - sprites.rotation.x) * 0.05;

      spriteObjects.forEach((obj, i) => {
        obj.sprite.position.y = obj.baseY + Math.sin(elapsedTime * obj.speed + i) * 2;
        obj.sprite.material.opacity = (Math.sin(elapsedTime * obj.speed * 0.5 + i) + 1) / 4; // Fade in/out
      });


      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };

    animate();

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
        const width = mountRef.current.clientWidth;
        const height = mountRef.current.clientHeight;
        renderer.setSize(width, height);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
      }
    };

    window.addEventListener('resize', handleResize);

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
      sprites.children.forEach(child => {
        if(child instanceof THREE.Sprite) {
          child.material.map?.dispose();
          child.material.dispose();
        }
      });
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div ref={mountRef} className={cn('h-full w-full', className)} />;
}
