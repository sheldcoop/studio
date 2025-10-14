
'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import * as THREE from 'three';
import { Label } from '@/components/ui/label';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import { BlockMath } from 'react-katex';
import { makeObjectsDraggable, mouseToWorld } from '@/components/three/interactivity';
import { drawAxes } from '../three/coordinate-system';
import { Vector as VectorClass } from '../three/primitives';

export function InteractiveMatrixTransformation() {
    const mountRef = useRef<HTMLDivElement>(null);
    const { theme } = useTheme();

    const [vector, setVector] = useState(new THREE.Vector3(2, 1, 0));

    // Store three.js objects in refs to persist across re-renders
    const sceneRef = useRef<THREE.Scene | null>(null);
    const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
    const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
    const animationFrameIdRef = useRef<number>();

    const iHatRef = useRef<THREE.ArrowHelper | null>(null);
    const jHatRef = useRef<THREE.ArrowHelper | null>(null);
    const vectorVRef = useRef<VectorClass | null>(null);

    // This useCallback will handle the entire scene setup
    const setupScene = useCallback(() => {
        if (!mountRef.current) return [];

        const currentMount = mountRef.current;
        const cleanupFunctions: (() => void)[] = [];

        // Scene and Camera
        const scene = new THREE.Scene();
        sceneRef.current = scene;
        const camera = new THREE.PerspectiveCamera(75, currentMount.clientWidth / currentMount.clientHeight, 0.1, 100);
        camera.position.set(0, 0, 8);
        cameraRef.current = camera;
        
        // Renderer
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        currentMount.appendChild(renderer.domElement);
        rendererRef.current = renderer;
        cleanupFunctions.push(() => {
            if (renderer.domElement.parentElement === currentMount) {
                currentMount.removeChild(renderer.domElement);
            }
            renderer.dispose();
        });

        // Axes with labels
        const axesGroup = drawAxes(scene, { size: 5, showLabels: true, tickInterval: 1 });
        cleanupFunctions.push(() => {
            scene.remove(axesGroup);
            axesGroup.children.forEach(child => {
                if (child instanceof THREE.Line || child instanceof THREE.ArrowHelper) {
                    child.geometry.dispose();
                    (child.material as THREE.Material).dispose();
                }
            });
        });


        // Basis Vectors
        iHatRef.current = new THREE.ArrowHelper(new THREE.Vector3(1, 0, 0), new THREE.Vector3(0, 0, 0), 1, 0xf44336, 0.3, 0.15); // Red
        jHatRef.current = new THREE.ArrowHelper(new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, 0, 0), 1, 0x4caf50, 0.3, 0.15); // Green
        scene.add(iHatRef.current, jHatRef.current);
        
        // Main Draggable Vector
        const dir = vector.clone().normalize();
        const len = vector.length();
        vectorVRef.current = new VectorClass(dir, len, 'hsl(var(--primary))', len * 0.2, len * 0.1, 'v');
        scene.add(vectorVRef.current);
        
        // Interactivity
        const onDrag = (obj: THREE.Object3D, pos: THREE.Vector3) => {
            const newVector = pos.clone();
            newVector.z = 0; // Keep it in the 2D plane
            setVector(newVector);
        };

        const cleanupDrag = makeObjectsDraggable(vectorVRef.current, camera, renderer.domElement, { onDrag });
        cleanupFunctions.push(cleanupDrag);
        
        // Resize Listener
        const handleResize = () => {
            if (currentMount) {
              camera.aspect = currentMount.clientWidth / currentMount.clientHeight;
              camera.updateProjectionMatrix();
              renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
            }
        };
        window.addEventListener('resize', handleResize);
        cleanupFunctions.push(() => window.removeEventListener('resize', handleResize));
        
        return cleanupFunctions;

    }, [theme]); // Only re-run setup if theme changes

    useEffect(() => {
        const cleanupFunctions = setupScene();
        
        const animate = () => {
            animationFrameIdRef.current = requestAnimationFrame(animate);
            if (rendererRef.current && sceneRef.current && cameraRef.current) {
                 if (vectorVRef.current) {
                    const length = vector.length();
                    if (length > 0.01) {
                        vectorVRef.current.setDirection(vector.clone().normalize());
                        vectorVRef.current.setLength(length, length * 0.2, length * 0.1);
                    } else {
                        vectorVRef.current.setLength(0);
                    }
                }
                rendererRef.current.render(sceneRef.current, cameraRef.current);
            }
        };
        
        animate();

        return () => {
            if (animationFrameIdRef.current) {
                cancelAnimationFrame(animationFrameIdRef.current);
            }
            cleanupFunctions.forEach(fn => fn());
            if (mountRef.current) {
                while (mountRef.current.firstChild) {
                    mountRef.current.removeChild(mountRef.current.firstChild);
                }
            }
        };
    }, [setupScene, vector]);


    return (
        <div className="w-full">
            <div ref={mountRef} className={cn("relative aspect-[4/3] md:aspect-video w-full overflow-hidden rounded-lg border bg-muted/20 cursor-grab active:cursor-grabbing")}></div>
             <div className="flex justify-center items-center gap-8 mt-4 p-4 rounded-lg border bg-muted/50">
                <div className="text-center">
                    <Label className="font-semibold">Vector (v)</Label>
                    <div className="font-mono text-lg p-2 mt-2">
                        <BlockMath math={`v = \\begin{bmatrix} ${vector.x.toFixed(2)} \\\\ ${vector.y.toFixed(2)} \\end{bmatrix}`} />
                    </div>
                </div>
             </div>
        </div>
    );
}
