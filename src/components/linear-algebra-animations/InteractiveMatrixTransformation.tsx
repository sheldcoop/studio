
'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import * as THREE from 'three';
import { Label } from '@/components/ui/label';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import { BlockMath } from 'react-katex';
import { makeObjectsDraggable } from '@/components/three/interactivity';
import { drawAxes } from '../three/coordinate-system';

export function InteractiveMatrixTransformation() {
    const mountRef = useRef<HTMLDivElement>(null);
    const { theme } = useTheme();

    const [vector, setVector] = useState(new THREE.Vector3(2, 1, 0));

    // Store three.js objects in refs to persist across re-renders
    const sceneRef = useRef<THREE.Scene | null>(null);
    const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
    const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
    const animationFrameIdRef = useRef<number>();

    // Refs for the arrow helpers
    const iHatRef = useRef<THREE.ArrowHelper | null>(null);
    const jHatRef = useRef<THREE.ArrowHelper | null>(null);
    const vectorVRef = useRef<THREE.ArrowHelper | null>(null);

    // This useEffect hook is for one-time scene setup.
    useEffect(() => {
        if (!mountRef.current) return;

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

        // Axes and Grid
        const axesGroup = drawAxes(scene, { size: 5, showLabels: true, tickInterval: 1 });
        const gridHelper = new THREE.GridHelper(10, 10, 0x888888, 0x444444);
        gridHelper.rotation.x = Math.PI / 2;
        scene.add(gridHelper);
        cleanupFunctions.push(() => {
            scene.remove(axesGroup);
            scene.remove(gridHelper);
            axesGroup.children.forEach(child => {
                if (child instanceof THREE.Line || child instanceof THREE.ArrowHelper || child instanceof THREE.Sprite) {
                    (child as any).geometry?.dispose();
                    (child as any).material?.dispose();
                }
            });
            gridHelper.geometry.dispose();
            (gridHelper.material as THREE.Material).dispose();
        });


        // Basis Vectors
        iHatRef.current = new THREE.ArrowHelper(new THREE.Vector3(1, 0, 0), new THREE.Vector3(0, 0, 0), 1, 0xf44336, 0.2, 0.1); // Red
        jHatRef.current = new THREE.ArrowHelper(new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, 0, 0), 1, 0x4caf50, 0.2, 0.1); // Green
        
        // Main Draggable Vector
        const dirV = new THREE.Vector3(2, 1, 0).normalize();
        const lenV = new THREE.Vector3(2, 1, 0).length();
        vectorVRef.current = new THREE.ArrowHelper(dirV, new THREE.Vector3(0,0,0), lenV, 0xffffff, lenV * 0.15, lenV * 0.1);
        
        scene.add(iHatRef.current, jHatRef.current, vectorVRef.current);
        
        // Interactivity
        const onDrag = (obj: THREE.Object3D, pos: THREE.Vector3) => {
            const newVector = pos.clone();
            newVector.z = 0; // Keep it in the 2D plane
            setVector(newVector);
        };
        
        if (vectorVRef.current) {
            const cleanupDrag = makeObjectsDraggable(vectorVRef.current, camera, renderer.domElement, { onDrag });
            cleanupFunctions.push(cleanupDrag);
        }
        
        const animate = () => {
            animationFrameIdRef.current = requestAnimationFrame(animate);
            if (renderer && scene && camera) {
                renderer.render(scene, camera);
            }
        };
        animate();

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

    }, [theme]); // Rerun only if the theme changes

    // This useEffect hook is for updating the vector when state changes
    useEffect(() => {
        if (vectorVRef.current) {
            const length = vector.length();
            if (length > 0.01) {
                vectorVRef.current.setDirection(vector.clone().normalize());
                vectorVRef.current.setLength(length, length * 0.15, length * 0.1);
            } else {
                vectorVRef.current.setLength(0, 0, 0); // Hide vector if it's at the origin
            }
        }
    }, [vector]);


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
