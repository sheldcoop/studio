
'use client';

import { useState, useRef, useEffect } from 'react';
import * as THREE from 'three';
import { Label } from '@/components/ui/label';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import { BlockMath } from 'react-katex';
import { makeObjectsDraggable } from '@/components/three/interactivity';

export function InteractiveMatrixTransformation() {
    const mountRef = useRef<HTMLDivElement>(null);
    const { theme } = useTheme();

    const [vector, setVector] = useState(new THREE.Vector3(2, 1, 0));

    // Store three.js objects in refs to persist across re-renders
    const sceneRef = useRef<THREE.Scene | null>(null);
    const cameraRef = useRef<THREE.OrthographicCamera | null>(null);
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

        const aspect = currentMount.clientWidth / currentMount.clientHeight;
        const frustumSize = 12;
        const camera = new THREE.OrthographicCamera(
            frustumSize * aspect / -2,
            frustumSize * aspect / 2,
            frustumSize / 2,
            frustumSize / -2,
            0.1,
            100
        );
        camera.position.set(0, 0, 10);
        cameraRef.current = camera;
        
        // Renderer
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        rendererRef.current = renderer;
        currentMount.appendChild(renderer.domElement);
        cleanupFunctions.push(() => {
            if (renderer.domElement.parentElement === currentMount) {
                currentMount.removeChild(renderer.domElement);
            }
            renderer.dispose();
        });
        
        // Grid
        const gridHelper = new THREE.GridHelper(frustumSize * 2, frustumSize * 2, 0x888888, 0x444444);
        scene.add(gridHelper);
        cleanupFunctions.push(() => {
            scene.remove(gridHelper);
            gridHelper.geometry.dispose();
            (gridHelper.material as THREE.Material).dispose();
        });


        // Basis Vectors
        iHatRef.current = new THREE.ArrowHelper(new THREE.Vector3(1, 0, 0), new THREE.Vector3(0, 0, 0), 1, 0xf44336, 0.2, 0.1); // Red
        jHatRef.current = new THREE.ArrowHelper(new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, 0, 0), 1, 0x4caf50, 0.2, 0.1); // Green
        
        // Main Draggable Vector
        vectorVRef.current = new THREE.ArrowHelper(new THREE.Vector3(1,0,0), new THREE.Vector3(0,0,0), 1, 0xffffff, 0.25, 0.15);
        
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
            if (currentMount && cameraRef.current && rendererRef.current) {
                const aspect = currentMount.clientWidth / currentMount.clientHeight;
                cameraRef.current.left = frustumSize * aspect / -2;
                cameraRef.current.right = frustumSize * aspect / 2;
                cameraRef.current.top = frustumSize / 2;
                cameraRef.current.bottom = frustumSize / -2;
                cameraRef.current.updateProjectionMatrix();
                rendererRef.current.setSize(currentMount.clientWidth, currentMount.clientHeight);
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

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [theme]);

    // This useEffect hook is for updating the vector when state changes
    useEffect(() => {
        if (vectorVRef.current) {
            const length = vector.length();
            if (length > 0.01) {
                vectorVRef.current.setDirection(vector.clone().normalize());
                vectorVRef.current.setLength(length, 0.25, 0.15);
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
