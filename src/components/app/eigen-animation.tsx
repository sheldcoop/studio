
'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { cn } from '@/lib/utils';
import { useTheme } from 'next-themes';

interface EigenAnimationProps {
  className?: string;
}

export function EigenAnimation({ className }: EigenAnimationProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    if (!mountRef.current) return;
    const currentMount = mountRef.current;
    let animationFrameId: number;
    let frameId: number;

    const cleanupFunctions: (() => void)[] = [];
    
    // Defer execution to ensure mountRef is fully available
    animationFrameId = requestAnimationFrame(() => {
        if (!currentMount) return;

        const computedStyle = getComputedStyle(document.documentElement);
        const primaryColorValue = computedStyle.getPropertyValue('--chart-1').trim();
        const secondaryColorValue = computedStyle.getPropertyValue('--chart-2').trim();
        const gridColorValue = computedStyle.getPropertyValue('--muted-foreground').trim();

        const primaryColor = new THREE.Color(primaryColorValue);
        const secondaryColor = new THREE.Color(secondaryColorValue);
        const gridColor = new THREE.Color(gridColorValue);

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, currentMount.clientWidth / currentMount.clientHeight, 0.1, 1000);
        camera.position.set(0, 0, 10);

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        currentMount.appendChild(renderer.domElement);
        cleanupFunctions.push(() => {
            if (renderer.domElement.parentElement) currentMount.removeChild(renderer.domElement);
            renderer.dispose();
        });

        // Grid of points
        const gridSize = 10;
        const gridDivisions = 20;
        const pointsGeometry = new THREE.BufferGeometry();
        const points: THREE.Vector3[] = [];
        for (let i = -gridSize / 2; i <= gridSize / 2; i += gridSize / gridDivisions) {
            for (let j = -gridSize / 2; j <= gridSize / 2; j += gridSize / gridDivisions) {
                points.push(new THREE.Vector3(i, j, 0));
            }
        }
        pointsGeometry.setFromPoints(points);
        const pointsMaterial = new THREE.PointsMaterial({ color: gridColor, size: 0.08 });
        const pointCloud = new THREE.Points(pointsGeometry, pointsMaterial);
        scene.add(pointCloud);
        cleanupFunctions.push(() => { pointsGeometry.dispose(); pointsMaterial.dispose(); });

        const originalPositions = pointsGeometry.attributes.position.clone();

        // Eigenvectors
        const eigenVec1 = new THREE.Vector3(1, 0.5, 0).normalize();
        const eigenVec2 = new THREE.Vector3(-0.5, 1, 0).normalize();
        const eigenVal1 = 1.8;
        const eigenVal2 = 0.5;

        const arrow1 = new THREE.ArrowHelper(eigenVec1, new THREE.Vector3(0,0,0), 6, primaryColor.getHex(), 0.5, 0.3);
        const arrow2 = new THREE.ArrowHelper(eigenVec2, new THREE.Vector3(0,0,0), 6, secondaryColor.getHex(), 0.5, 0.3);
        scene.add(arrow1, arrow2);

        const transformationMatrix = new THREE.Matrix4();
        const basis = [eigenVec1.clone(), eigenVec2.clone(), new THREE.Vector3(0,0,1)];
        const basisInv = new THREE.Matrix4().makeBasis(basis[0], basis[1], basis[2]).invert();
        const scaleMatrix = new THREE.Matrix4().makeScale(eigenVal1, eigenVal2, 1);
        const basisMatrix = new THREE.Matrix4().makeBasis(basis[0], basis[1], basis[2]);
        transformationMatrix.multiply(basisMatrix).multiply(scaleMatrix).multiply(basisInv);

        const clock = new THREE.Clock();
        
        const animate = () => {
            frameId = requestAnimationFrame(animate);
            const t = (Math.sin(clock.getElapsedTime() * 0.5) + 1) / 2; // Oscillates between 0 and 1

            const identityMatrix = new THREE.Matrix4();
            const currentMatrix = new THREE.Matrix4();
            const newElements = new Float32Array(16);
            for (let i = 0; i < 16; i++) {
                newElements[i] = identityMatrix.elements[i] + (transformationMatrix.elements[i] - identityMatrix.elements[i]) * t;
            }
            currentMatrix.set(...newElements);
            
            const positions = pointsGeometry.attributes.position;
            for (let i = 0; i < positions.count; i++) {
                const vec = new THREE.Vector3().fromBufferAttribute(originalPositions, i);
                vec.applyMatrix4(currentMatrix);
                positions.setXYZ(i, vec.x, vec.y, vec.z);
            }
            positions.needsUpdate = true;

            const arrow1TargetScale = new THREE.Vector3(1,1,1).lerp(new THREE.Vector3(eigenVal1, 1, 1), t);
            arrow1.scale.copy(arrow1TargetScale);
            const arrow2TargetScale = new THREE.Vector3(1,1,1).lerp(new THREE.Vector3(eigenVal2, 1, 1), t);
            arrow2.scale.copy(arrow2TargetScale);

            renderer.render(scene, camera);
        };
        animate();

        const handleResize = () => {
            if (currentMount) {
                camera.aspect = currentMount.clientWidth / currentMount.clientHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
            }
        };
        window.addEventListener('resize', handleResize);
        cleanupFunctions.push(() => window.removeEventListener('resize', handleResize));

        cleanupFunctions.push(() => {
            if (frameId) cancelAnimationFrame(frameId);
        });
    });

    return () => {
        cleanupFunctions.forEach(fn => fn());
        if (animationFrameId) cancelAnimationFrame(animationFrameId);
        if (mountRef.current) {
            while (mountRef.current.firstChild) {
                mountRef.current.removeChild(mountRef.current.firstChild);
            }
        }
    };
  }, [theme]);

  return <div ref={mountRef} className={cn('h-full w-full', className)} />;
}
