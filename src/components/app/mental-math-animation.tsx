
'use client';

import { useEffect, useRef, useMemo, useState } from 'react';
import * as THREE from 'three';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import { cn } from '@/lib/utils';

interface MentalMathAnimationProps {
  className?: string;
  onPointerEnter: () => void;
  onPointerLeave: () => void;
}

type CharacterParticle = {
  mesh: THREE.Mesh;
  targetPosition: THREE.Vector3;
  originalPosition: THREE.Vector3;
  originalRotation: THREE.Euler;
  isActive: boolean;
};

export function MentalMathAnimation({
  className,
  onPointerEnter,
  onPointerLeave,
}: MentalMathAnimationProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const mouse = useRef({ x: 0, y: 0 });
  const isMouseOver = useRef(false);
  const fontRef = useRef<THREE.Font>();
  const [fontLoaded, setFontLoaded] = useState(false);

  const textMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: 0x22c55e,
        transparent: true,
        opacity: 0.9,
        blending: THREE.AdditiveBlending,
      }),
    []
  );

  useEffect(() => {
    // Load the font once and set the state when ready
    new FontLoader().load('/fonts/helvetiker_bold.typeface.json', (font) => {
      fontRef.current = font;
      setFontLoaded(true);
    });
  }, []);

  useEffect(() => {
    if (!mountRef.current || !fontLoaded || !fontRef.current) return;
    const currentMount = mountRef.current;
    let frameId: number;

    // --- Scene Setup ---
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      currentMount.clientWidth / currentMount.clientHeight,
      0.1,
      100
    );
    camera.position.z = 15;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    currentMount.appendChild(renderer.domElement);

    const equationGroup = new THREE.Group();
    scene.add(equationGroup);

    const characterPool: CharacterParticle[] = [];
    const chars = '0123456789+-×÷= ';
    const POOL_SIZE = 150;

    // --- Pre-create a large pool of character meshes ---
    for (let i = 0; i < POOL_SIZE; i++) {
      const char = chars[i % chars.length];
      const geometry = new TextGeometry(char, {
        font: fontRef.current!,
        size: 1.2,
        height: 0.2,
        curveSegments: 5,
      });
      geometry.center();
      const mesh = new THREE.Mesh(geometry, textMaterial);
      mesh.visible = false;
      equationGroup.add(mesh);
      
      characterPool.push({
        mesh,
        targetPosition: new THREE.Vector3(),
        originalPosition: new THREE.Vector3(),
        originalRotation: new THREE.Euler(),
        isActive: false,
      });
    }

    const generateAndPositionEquation = () => {
      // Deactivate all current particles
      characterPool.forEach(p => p.isActive = false);

      const num1 = Math.floor(Math.random() * 15) + 1;
      const num2 = Math.floor(Math.random() * 9) + 2;
      const result = num1 * num2;
      const equationString = `${num1} × ${num2} = ${result}`;

      let currentX = 0;
      const chars = equationString.split('');
      const totalWidth = chars.length * 1.4; // Approximate width

      chars.forEach((char, index) => {
        const particle = characterPool.find(p => !p.isActive && (p.mesh.geometry as TextGeometry).parameters.text === char);
        const genericParticle = characterPool.find(p => !p.isActive);
        let currentParticle = particle || genericParticle;
        
        if (currentParticle) {
          currentParticle.isActive = true;
          const { mesh } = currentParticle;
          
          // If we had to fall back to a generic particle, update its geometry
          if (!particle) {
            mesh.geometry.dispose();
            mesh.geometry = new TextGeometry(char, {
              font: fontRef.current!,
              size: (char === '×' || char === '=') ? 1 : 1.2,
              height: 0.2, curveSegments: 5,
            });
            mesh.geometry.center();
          }

          mesh.visible = true;
          
          currentParticle.originalPosition.set(
            (Math.random() - 0.5) * 25, (Math.random() - 0.5) * 25, (Math.random() - 0.5) * 25
          );
          currentParticle.originalRotation.set(
            Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI
          );
          
          // Set initial state based on mouse hover
          if (!isMouseOver.current) {
            mesh.position.copy(currentParticle.originalPosition);
            mesh.rotation.copy(currentParticle.originalRotation);
          }
          
          currentParticle.targetPosition.set(currentX - totalWidth / 2, 0, 0);
          currentX += (char === ' ') ? 0.7 : 1.5;
        }
      });

      // Hide all non-active particles
      characterPool.forEach(p => {
        if (!p.isActive) p.mesh.visible = false;
      });
    }

    generateAndPositionEquation();
    
    const animate = () => {
      frameId = requestAnimationFrame(animate);

      const lerpFactor = 0.05;
      const rotationLerpFactor = 0.04;

      characterPool.forEach(part => {
        if (!part.isActive || !part.mesh.visible) return;

        let targetPos = isMouseOver.current ? part.targetPosition : part.originalPosition;
        let targetRot = isMouseOver.current ? new THREE.Euler(0,0,0) : part.originalRotation;

        part.mesh.position.lerp(targetPos, lerpFactor);
        part.mesh.rotation.x += (targetRot.x - part.mesh.rotation.x) * rotationLerpFactor;
        part.mesh.rotation.y += (targetRot.y - part.mesh.rotation.y) * rotationLerpFactor;
        part.mesh.rotation.z += (targetRot.z - part.mesh.rotation.z) * rotationLerpFactor;
      });
      
      equationGroup.position.x += (mouse.current.x * 2 - equationGroup.position.x) * 0.1;
      equationGroup.position.y += (mouse.current.y * 2 - equationGroup.position.y) * 0.1;
      equationGroup.lookAt(new THREE.Vector3(camera.position.x, camera.position.y, camera.position.z-5));


      renderer.render(scene, camera);
    };
    
    animate();

    let regenerationTimeout: NodeJS.Timeout;

    const handleMouseEnter = () => {
      isMouseOver.current = true;
      onPointerEnter();
      clearTimeout(regenerationTimeout);
    };
    const handleMouseLeave = () => {
      isMouseOver.current = false;
      onPointerLeave();
      regenerationTimeout = setTimeout(generateAndPositionEquation, 1200);
    };
    const handleMouseMove = (event: MouseEvent) => {
      if (currentMount) {
        const rect = currentMount.getBoundingClientRect();
        mouse.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.current.y = -(((event.clientY - rect.top) / rect.height) * 2 - 1);
      }
    };

    currentMount.addEventListener('mouseenter', handleMouseEnter);
    currentMount.addEventListener('mouseleave', handleMouseLeave);
    currentMount.addEventListener('mousemove', handleMouseMove);

    const handleResize = () => {
      if (currentMount) {
        camera.aspect = currentMount.clientWidth / currentMount.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
      }
    };
    window.addEventListener('resize', handleResize);

    // --- Cleanup ---
    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', handleResize);
      if (currentMount) {
        currentMount.removeEventListener('mouseenter', handleMouseEnter);
        currentMount.removeEventListener('mouseleave', handleMouseLeave);
        currentMount.removeEventListener('mousemove', handleMouseMove);
        if (renderer.domElement) {
          currentMount.removeChild(renderer.domElement);
        }
      }
      renderer.dispose();
      characterPool.forEach(p => {
        p.mesh.geometry.dispose();
      });
      textMaterial.dispose();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fontLoaded]); // Rerun effect only when font is loaded

  return <div ref={mountRef} className={cn('h-full w-full', className)} />;
}
