
'use client';

import { useState, useRef, useEffect } from 'react';
import * as THREE from 'three';
import { BlockMath } from 'react-katex';
import { animateTransformation } from '@/components/three/animation';
import { mouseToWorld } from '@/components/three/interactivity';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';

type Matrix2D = { a: number; b: number; c: number; d: number };

const IDENTITY_MATRIX: Matrix2D = { a: 1, b: 0, c: 0, d: 1 };

function createGrid(color: THREE.Color, size = 10, divisions = 10) {
    const material = new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.3 });
    const points: THREE.Vector3[] = [];
    const step = size / divisions;

    for (let i = 0; i <= divisions; i++) {
        const pos = -size / 2 + i * step;
        points.push(new THREE.Vector3(-size / 2, pos, 0));
        points.push(new THREE.Vector3(size / 2, pos, 0));
        points.push(new THREE.Vector3(pos, -size / 2, 0));
        points.push(new THREE.Vector3(pos, size / 2, 0));
    }

    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    return new THREE.LineSegments(geometry, material);
}

function createVector(color: THREE.Color, x: number, y: number): THREE.ArrowHelper {
    const dir = new THREE.Vector3(x, y, 0).normalize();
    const length = new THREE.Vector3(x,y,0).length();
    return new THREE.ArrowHelper(dir, new THREE.Vector3(0,0,0), length, color, 0.4, 0.2);
}

export function InteractiveMatrixTransformation() {
    const mountRef = useRef<HTMLDivElement>(null);
    const { theme } = useTheme();
    const [displayMatrix, setDisplayMatrix] = useState<Matrix2D>(IDENTITY_MATRIX);

    useEffect(() => {
        if (!mountRef.current) return;
        const currentMount = mountRef.current;

        const computedStyle = getComputedStyle(document.documentElement);
        const primaryColorValue = computedStyle.getPropertyValue('--primary').trim();
        const primaryColor = new THREE.Color(`hsl(${primaryColorValue})`);

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, currentMount.clientWidth / currentMount.clientHeight, 0.1, 100);
        camera.position.set(0, 0, 8);

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        currentMount.appendChild(renderer.domElement);

        const grid = createGrid(new THREE.Color(0x888888));
        scene.add(grid);

        const iHat = createVector(new THREE.Color(0xf44336), 1, 0); // Red
        const jHat = createVector(new THREE.Color(0x4caf50), 0, 1); // Green
        scene.add(iHat, jHat);

        const transformedGrid = createGrid(primaryColor);
        scene.add(transformedGrid);

        let currentMatrix = { ...IDENTITY_MATRIX };
        const animationState = {
            from: { ...IDENTITY_MATRIX },
            to: { ...IDENTITY_MATRIX },
            progress: 1,
            duration: 500, // ms
        };
        
        let lastFrameTime = 0;

        const animate = (time: number) => {
            animationFrameId = requestAnimationFrame(animate);

            const delta = time - (lastFrameTime || time);
            lastFrameTime = time;

            if (animationState.progress < 1) {
                animationState.progress += delta / animationState.duration;
                animationState.progress = Math.min(animationState.progress, 1);
                currentMatrix = animateTransformation(animationState.from, animationState.to, animationState.progress);
                
                const matrix4 = new THREE.Matrix4().set(
                    currentMatrix.a, currentMatrix.b, 0, 0,
                    currentMatrix.c, currentMatrix.d, 0, 0,
                    0, 0, 1, 0,
                    0, 0, 0, 1
                );
                
                transformedGrid.matrix.copy(matrix4);
                transformedGrid.matrixAutoUpdate = false;
                
                iHat.setDirection(new THREE.Vector3(currentMatrix.a, currentMatrix.c, 0).normalize());
                iHat.setLength(new THREE.Vector3(currentMatrix.a, currentMatrix.c, 0).length(), 0.4, 0.2);

                jHat.setDirection(new THREE.Vector3(currentMatrix.b, currentMatrix.d, 0).normalize());
                jHat.setLength(new THREE.Vector3(currentMatrix.b, currentMatrix.d, 0).length(), 0.4, 0.2);

                setDisplayMatrix(currentMatrix);
            }
            
            renderer.render(scene, camera);
        };
        let animationFrameId = requestAnimationFrame(animate);

        const handleMouseMove = (event: MouseEvent) => {
            const worldPos = mouseToWorld(event, camera, renderer.domElement);
            if (worldPos) {
                 animationState.from = { ...currentMatrix };
                 animationState.to = {
                    a: worldPos.x / 2, // Scale down for less extreme transformations
                    d: worldPos.y / 2,
                    b: -worldPos.y / 4,
                    c: worldPos.x / 4,
                 };
                 animationState.progress = 0;
            }
        };

        const resetAnimation = () => {
             animationState.from = { ...currentMatrix };
             animationState.to = { ...IDENTITY_MATRIX };
             animationState.progress = 0;
        }

        currentMount.addEventListener('mousemove', handleMouseMove);
        currentMount.addEventListener('mouseleave', resetAnimation);

        const handleResize = () => {
            if (currentMount) {
                camera.aspect = currentMount.clientWidth / currentMount.clientHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
            }
        };
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            currentMount.removeEventListener('mousemove', handleMouseMove);
            currentMount.removeEventListener('mouseleave', resetAnimation);
            cancelAnimationFrame(animationFrameId);
            currentMount.removeChild(renderer.domElement);
            renderer.dispose();
        };
    }, [theme]);
    
    return (
        <div className="w-full">
            <div ref={mountRef} className={cn("relative aspect-[4/3] md:aspect-video w-full overflow-hidden rounded-lg border bg-muted/20 cursor-crosshair")}></div>
            <div className="flex flex-col md:flex-row justify-center items-center gap-4 mt-4 text-center">
                 <p className="text-sm text-muted-foreground">Move your mouse over the grid to transform the space.</p>
                 <div className="font-mono text-lg p-2 mt-2 rounded-md bg-muted/50 border">
                    <BlockMath math={`M = \\begin{bmatrix} ${displayMatrix.a.toFixed(2)} & ${displayMatrix.b.toFixed(2)} \\\\ ${displayMatrix.c.toFixed(2)} & ${displayMatrix.d.toFixed(2)} \\end{bmatrix}`} />
                 </div>
            </div>
        </div>
    );
}
