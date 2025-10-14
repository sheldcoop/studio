
'use client';

import { useState, useRef, useEffect } from 'react';
import * as THREE from 'three';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { BlockMath } from 'react-katex';
import { makeObjectsDraggable } from '@/components/three/interactivity';
import { createLabel } from '../three/ui-helpers';
import { drawTransformedGrid } from '../three/transformation';

export function InteractiveMatrixTransformation() {
    const mountRef = useRef<HTMLDivElement>(null);
    
    // State for the vectors
    const [vectorV, setVectorV] = useState(new THREE.Vector3(2, 1, 0));
    const [iHatPrime, setIHatPrime] = useState(new THREE.Vector3(1.5, 0.5, 0));
    const [jHatPrime, setJHatPrime] = useState(new THREE.Vector3(-0.5, 1, 0));
    const [newCoords, setNewCoords] = useState({ x: 0, y: 0 });

    // Refs for three.js objects
    const sceneRef = useRef<THREE.Scene | null>(null);
    const cameraRef = useRef<THREE.OrthographicCamera | null>(null);
    const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
    const animationFrameIdRef = useRef<number>();
    
    // Refs for the visual objects
    const vectorVRef = useRef<THREE.ArrowHelper | null>(null);
    const iHatPrimeRef = useRef<THREE.ArrowHelper | null>(null);
    const jHatPrimeRef = useRef<THREE.ArrowHelper | null>(null);
    const vectorLabelRef = useRef<THREE.Sprite | null>(null);
    const transformedGridRef = useRef<THREE.Group | null>(null);
    const standardGridRef = useRef<THREE.GridHelper | null>(null);

    // One-time scene setup
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
        
        // Standard Grid
        const gridHelper = new THREE.GridHelper(50, 25, 0x444444, 0x444444);
        standardGridRef.current = gridHelper;
        gridHelper.rotation.x = Math.PI / 2;
        scene.add(gridHelper);

        // Transformed Grid
        transformedGridRef.current = new THREE.Group();
        scene.add(transformedGridRef.current);

        // Standard Basis Vectors (non-interactive)
        const iHat = new THREE.ArrowHelper(new THREE.Vector3(1, 0, 0), new THREE.Vector3(0, 0, 0), 1, 0xf44336, 0.2, 0.1); 
        const jHat = new THREE.ArrowHelper(new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, 0, 0), 1, 0x4caf50, 0.2, 0.1);
        
        // Draggable New Basis Vectors
        iHatPrimeRef.current = new THREE.ArrowHelper(new THREE.Vector3(1,0,0), new THREE.Vector3(0,0,0), iHatPrime.length(), 0xff8a65, 0.3, 0.2);
        jHatPrimeRef.current = new THREE.ArrowHelper(new THREE.Vector3(0,1,0), new THREE.Vector3(0,0,0), jHatPrime.length(), 0x69f0ae, 0.3, 0.2);

        // Main Draggable Vector (v)
        vectorVRef.current = new THREE.ArrowHelper(new THREE.Vector3(1,0,0), new THREE.Vector3(0,0,0), vectorV.length(), 0xffffff, 0.3, 0.2);

        // Vector Label for v
        vectorLabelRef.current = createLabel(`(${vectorV.x.toFixed(2)}, ${vectorV.y.toFixed(2)})`, '#ffffff');
        
        scene.add(iHat, jHat, iHatPrimeRef.current, jHatPrimeRef.current, vectorVRef.current, vectorLabelRef.current);
        
        // Interactivity
        const cleanupV = makeObjectsDraggable(vectorVRef.current, camera, renderer.domElement, { onDrag: (obj, pos) => setVectorV(pos.clone().setZ(0)) });
        const cleanupI = makeObjectsDraggable(iHatPrimeRef.current, camera, renderer.domElement, { onDrag: (obj, pos) => setIHatPrime(pos.clone().setZ(0)) });
        const cleanupJ = makeObjectsDraggable(jHatPrimeRef.current, camera, renderer.domElement, { onDrag: (obj, pos) => setJHatPrime(pos.clone().setZ(0)) });
        cleanupFunctions.push(cleanupV, cleanupI, cleanupJ);
        
        const animate = () => {
            animationFrameIdRef.current = requestAnimationFrame(animate);
            if (renderer && scene && camera) renderer.render(scene, camera);
        };
        animate();

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
            if (animationFrameIdRef.current) cancelAnimationFrame(animationFrameIdRef.current);
            cleanupFunctions.forEach(fn => fn());
            if (mountRef.current) {
                while (mountRef.current.firstChild) {
                    mountRef.current.removeChild(mountRef.current.firstChild);
                }
            }
        };
    }, []);

    // Updates visualization based on state changes
    useEffect(() => {
        // Update draggable vector `v`
        if (vectorVRef.current && vectorLabelRef.current) {
            const length = vectorV.length();
            if (length > 0.01) {
              vectorVRef.current.setLength(length, 0.3, 0.2);
              vectorVRef.current.setDirection(vectorV.clone().normalize());
            }
            // Update label
            sceneRef.current?.remove(vectorLabelRef.current);
            vectorLabelRef.current = createLabel(`(${vectorV.x.toFixed(2)}, ${vectorV.y.toFixed(2)})`, '#ffffff');
            vectorLabelRef.current.position.copy(vectorV).add(new THREE.Vector3(0.5, 0.5, 0));
            sceneRef.current?.add(vectorLabelRef.current);
        }

        // Update draggable basis vectors `i'` and `j'`
        if (iHatPrimeRef.current) {
            const len = iHatPrime.length();
            if(len > 0.01) {
              iHatPrimeRef.current.setLength(len, 0.3, 0.2);
              iHatPrimeRef.current.setDirection(iHatPrime.clone().normalize());
            }
        }
        if (jHatPrimeRef.current) {
             const len = jHatPrime.length();
            if(len > 0.01) {
              jHatPrimeRef.current.setLength(len, 0.3, 0.2);
              jHatPrimeRef.current.setDirection(jHatPrime.clone().normalize());
            }
        }

        // Update transformed grid
        if (transformedGridRef.current && sceneRef.current) {
            // Clear the old grid
            while (transformedGridRef.current.children.length > 0) {
                transformedGridRef.current.remove(transformedGridRef.current.children[0]);
            }
            // Draw the new one based on the new basis vectors
            drawTransformedGrid(transformedGridRef.current, { 
                matrix: { a: iHatPrime.x, b: jHatPrime.x, c: iHatPrime.y, d: jHatPrime.y },
                transformedColor: 0x64b5f6, // A nice light blue color
                divisions: 25,
                size: 50
            });
        }
        
        // The Core Logic: Change of Basis Calculation
        const det = iHatPrime.x * jHatPrime.y - iHatPrime.y * jHatPrime.x;
        if (Math.abs(det) > 0.01) { 
            const invDet = 1 / det;
            const newX = invDet * (vectorV.x * jHatPrime.y - vectorV.y * jHatPrime.x);
            const newY = invDet * (vectorV.y * iHatPrime.x - vectorV.x * iHatPrime.y);
            setNewCoords({ x: newX, y: newY });
        } else {
            setNewCoords({ x: NaN, y: NaN });
        }

    }, [vectorV, iHatPrime, jHatPrime]);

    return (
        <div className="w-full">
            <div ref={mountRef} className={cn("relative aspect-[4/3] md:aspect-video w-full overflow-hidden rounded-lg border bg-muted/20 cursor-grab active:cursor-grabbing")}></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 p-4 rounded-lg border bg-muted/50">
                <div className="text-center">
                    <Label className="font-semibold">Vector Coords (Standard Basis)</Label>
                    <div className="font-mono text-lg p-2 mt-2">
                        <BlockMath math={`v = \\begin{bmatrix} ${vectorV.x.toFixed(2)} \\\\ ${vectorV.y.toFixed(2)} \\end{bmatrix}`} />
                    </div>
                </div>
                 <div className="text-center">
                    <Label className="font-semibold text-primary">Vector Coords (New Basis)</Label>
                     <div className="font-mono text-lg p-2 mt-2 text-primary">
                        <BlockMath math={`v_{new} = \\begin{bmatrix} ${isNaN(newCoords.x) ? '?' : newCoords.x.toFixed(2)} \\\\ ${isNaN(newCoords.y) ? '?' : newCoords.y.toFixed(2)} \\end{bmatrix}`} />
                    </div>
                </div>
            </div>
        </div>
    );
}

    