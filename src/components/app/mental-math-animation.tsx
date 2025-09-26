
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

type EquationPart = {
  mesh: THREE.Mesh;
  targetPosition: THREE.Vector3;
  originalPosition: THREE.Vector3;
  originalRotation: THREE.Euler;
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

  const textMaterial = useMemo(() => new THREE.MeshBasicMaterial({
    color: 0x22c55e,
    transparent: true,
    opacity: 0.9,
    blending: THREE.AdditiveBlending,
  }), []);

  useEffect(() => {
    new FontLoader().load(
      '/fonts/helvetiker_bold.typeface.json',
      (font) => {
        fontRef.current = font;
        setFontLoaded(true);
      }
    );
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

    const equationParts: EquationPart[] = [];
    const equationGroup = new THREE.Group();
    scene.add(equationGroup);

    const createText = (char: string, size: number = 1.2): THREE.Mesh => {
      const geometry = new TextGeometry(char, {
        font: fontRef.current!,
        size: size,
        height: 0.2,
        curveSegments: 5,
      });
      geometry.center();
      return new THREE.Mesh(geometry, textMaterial);
    }
    
    const chars = '0123456789+-×÷=';
    const characterMeshes: THREE.Mesh[] = [];

    // Pre-create a pool of characters
    for (let i = 0; i < 100; i++) {
        const char = chars[i % chars.length];
        const mesh = createText(char);
        mesh.visible = false;
        equationGroup.add(mesh);
        characterMeshes.push(mesh);
    }

    const generateAndPositionEquation = () => {
        equationParts.forEach(part => {
            part.mesh.visible = false; // Hide old parts
        });
        equationParts.length = 0;
        
        const num1 = Math.floor(Math.random() * 15) + 1;
        const num2 = Math.floor(Math.random() * 9) + 2;
        const result = num1 * num2;
        const equationString = `${num1} × ${num2} = ${result}`;

        let currentX = 0;
        const chars = equationString.split('');
        const totalWidth = chars.length * 1.4;

        chars.forEach((char, index) => {
            const mesh = characterMeshes[index];
            if (!mesh) return;

            // Update text geometry if needed (can be inefficient, but simple)
            mesh.geometry.dispose();
            mesh.geometry = new TextGeometry(char, {
                font: fontRef.current!,
                size: (char === '×' || char === '=') ? 1 : 1.2,
                height: 0.2,
                curveSegments: 5,
            });
            mesh.geometry.center();
            mesh.visible = true;
            
            const originalPos = new THREE.Vector3(
                (Math.random() - 0.5) * 25,
                (Math.random() - 0.5) * 25,
                (Math.random() - 0.5) * 25
            );
            if (!isMouseOver.current) {
               mesh.position.copy(originalPos);
            }
            const originalRot = new THREE.Euler(
                Math.random() * Math.PI * 2,
                Math.random() * Math.PI * 2,
                Math.random() * Math.PI * 2
            );
            mesh.rotation.copy(originalRot);

            const targetPos = new THREE.Vector3(currentX - totalWidth / 2, 0, 0);
            
            equationParts.push({
                mesh,
                targetPosition: targetPos,
                originalPosition: originalPos,
                originalRotation: originalRot,
            });
            currentX += (char === ' ') ? 0.7 : 1.5;
        });

        // Hide unused meshes
        for (let i = chars.length; i < characterMeshes.length; i++) {
            characterMeshes[i].visible = false;
        }
    }

    generateAndPositionEquation();
    
    const animate = () => {
      frameId = requestAnimationFrame(animate);

      const lerpFactor = 0.05;
      const rotationLerpFactor = 0.04;

      equationParts.forEach(part => {
        if (!part.mesh.visible) return;

        const targetRot = new THREE.Euler(0,0,0);
        let targetPos = part.targetPosition;
        let originPos = part.originalPosition;

        if (isMouseOver.current) {
            part.mesh.position.lerp(targetPos, lerpFactor);
            part.mesh.rotation.x += (targetRot.x - part.mesh.rotation.x) * rotationLerpFactor;
            part.mesh.rotation.y += (targetRot.y - part.mesh.rotation.y) * rotationLerpFactor;
            part.mesh.rotation.z += (targetRot.z - part.mesh.rotation.z) * rotationLerpFactor;
        } else {
            part.mesh.position.lerp(originPos, lerpFactor);
            part.mesh.rotation.x += (part.originalRotation.x - part.mesh.rotation.x) * rotationLerpFactor;
            part.mesh.rotation.y += (part.originalRotation.y - part.mesh.rotation.y) * rotationLerpFactor;
            part.mesh.rotation.z += (part.originalRotation.z - part.mesh.rotation.z) * rotationLerpFactor;
        }
      });
      
      equationGroup.position.x += (mouse.current.x * 2 - equationGroup.position.x) * 0.1;
      equationGroup.position.y += (mouse.current.y * 2 - equationGroup.position.y) * 0.1;

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

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', handleResize);
      if (currentMount) {
        currentMount.removeEventListener('mouseenter', handleMouseEnter);
        currentMount.removeEventListener('mouseleave', handleMouseLeave);
        currentMount.removeEventListener('mousemove', handleMouseMove);
        // eslint-disable-next-line react-hooks/exhaustive-deps
        if(renderer.domElement) currentMount.removeChild(renderer.domElement);
      }
      renderer.dispose();
      characterMeshes.forEach(mesh => {
        mesh.geometry.dispose();
      });
      textMaterial.dispose();
    };
  }, [fontLoaded, textMaterial]);

  return <div ref={mountRef} className={cn('h-full w-full', className)} />;
}
