
'use client';

import { useEffect, useRef, useMemo } from 'react';
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
  targetRotation: THREE.Euler;
};

export function MentalMathAnimation({
  className,
  onPointerEnter,
  onPointerLeave,
}: MentalMathAnimationProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const mouse = useRef({ x: 0, y: 0 });
  const isMouseOver = useRef(false);

  const fontLoader = useMemo(() => new FontLoader(), []);
  const fontRef = useRef<THREE.Font>();

  const textMaterial = useMemo(() => new THREE.MeshBasicMaterial({
    color: 0x22c55e,
    transparent: true,
    opacity: 0.9,
    blending: THREE.AdditiveBlending,
  }), []);

  useEffect(() => {
    fontLoader.load(
      '/fonts/helvetiker_bold.typeface.json',
      (font) => {
        fontRef.current = font;
      }
    );
  }, [fontLoader]);

  useEffect(() => {
    if (!mountRef.current || !fontRef.current) return;
    const currentMount = mountRef.current;
    
    // --- Scene Setup ---
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      currentMount.clientWidth / currentMount.clientHeight,
      0.1,
      100
    );
    camera.position.z = 10;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    currentMount.appendChild(renderer.domElement);

    const equationParts: EquationPart[] = [];
    const equationGroup = new THREE.Group();
    scene.add(equationGroup);

    const createText = (char: string, size: number = 1): THREE.Mesh => {
        const geometry = new TextGeometry(char, {
            font: fontRef.current!,
            size: size,
            height: 0.1,
            curveSegments: 4,
        });
        geometry.center();
        return new THREE.Mesh(geometry, textMaterial);
    }
    
    const generateAndPositionEquation = () => {
        // Clear previous equation
        equationGroup.children.forEach(child => scene.remove(child));
        equationGroup.clear();
        equationParts.length = 0;

        const num1 = Math.floor(Math.random() * 15) + 1;
        const num2 = Math.floor(Math.random() * 9) + 1;
        const result = num1 * num2;
        const equationString = `${num1} × ${num2} = ${result}`;

        let currentX = 0;
        const chars = equationString.split('');
        const totalWidth = chars.length * 1.2; // Approximate width

        chars.forEach((char, index) => {
            const mesh = createText(char, char === '×' || char === '=' ? 0.8 : 1.2);
            
            const originalPos = new THREE.Vector3(
                (Math.random() - 0.5) * 20,
                (Math.random() - 0.5) * 20,
                (Math.random() - 0.5) * 20
            );
            mesh.position.copy(originalPos);
            const originalRot = new THREE.Euler(
                Math.random() * Math.PI * 2,
                Math.random() * Math.PI * 2,
                Math.random() * Math.PI * 2
            );
            mesh.rotation.copy(originalRot);

            const targetPos = new THREE.Vector3(currentX - totalWidth / 2, 0, 0);
            const targetRot = new THREE.Euler(0, 0, 0);
            
            equationParts.push({
                mesh,
                targetPosition: targetPos,
                originalPosition: originalPos,
                originalRotation: originalRot,
                targetRotation: targetRot,
            });

            equationGroup.add(mesh);
            currentX += 1.4;
        });
    }

    generateAndPositionEquation();
    
    // --- Animation Logic ---
    let frameId: number;

    const animate = () => {
      frameId = requestAnimationFrame(animate);

      const lerpFactor = 0.08;

      equationParts.forEach(part => {
        if (isMouseOver.current) {
            part.mesh.position.lerp(part.targetPosition, lerpFactor);
            part.mesh.rotation.x += (part.targetRotation.x - part.mesh.rotation.x) * lerpFactor;
            part.mesh.rotation.y += (part.targetRotation.y - part.mesh.rotation.y) * lerpFactor;
            part.mesh.rotation.z += (part.targetRotation.z - part.mesh.rotation.z) * lerpFactor;
        } else {
            part.mesh.position.lerp(part.originalPosition, lerpFactor);
            part.mesh.rotation.x += (part.originalRotation.x - part.mesh.rotation.x) * lerpFactor;
            part.mesh.rotation.y += (part.originalRotation.y - part.mesh.rotation.y) * lerpFactor;
            part.mesh.rotation.z += (part.originalRotation.z - part.mesh.rotation.z) * lerpFactor;
        }
      });

      // Group rotation for subtle movement
      equationGroup.rotation.y += 0.0005;
      if(isMouseOver.current) {
        // Center on mouse
        equationGroup.position.x += (mouse.current.x * 3 - equationGroup.position.x) * 0.1;
        equationGroup.position.y += (mouse.current.y * 3 - equationGroup.position.y) * 0.1;
      } else {
        equationGroup.position.x += (0 - equationGroup.position.x) * 0.1;
        equationGroup.position.y += (0 - equationGroup.position.y) * 0.1;
      }
      
      renderer.render(scene, camera);
    };
    
    animate();

    // --- Event Listeners ---
    let regenerationTimeout: NodeJS.Timeout;
    const handleMouseEnter = () => { 
        isMouseOver.current = true;
        onPointerEnter();
        clearTimeout(regenerationTimeout);
    };
    const handleMouseLeave = () => { 
        isMouseOver.current = false;
        onPointerLeave();
        regenerationTimeout = setTimeout(generateAndPositionEquation, 1000); // Regenerate after a delay
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
        currentMount.removeChild(renderer.domElement);
      }
      renderer.dispose();
      equationParts.forEach(p => {
        p.mesh.geometry.dispose();
      });
      textMaterial.dispose();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fontRef.current]);

  return <div ref={mountRef} className={cn('h-full w-full', className)} />;
}
