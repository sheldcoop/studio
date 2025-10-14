
'use client';

import { useState, useRef, useEffect } from 'react';
import * as THREE from 'three';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { makeObjectsDraggable } from '@/components/three/interactivity';
import { createLabel } from '../three/ui-helpers';
import { drawTransformedGrid } from '../three/transformation';

export function InteractiveMatrixTransformation() {
    const mountRef = useRef<HTMLDivElement>(null);
    
    // State for the vectors
    const [newBasisCoords, setNewBasisCoords] = useState({ x: 2.0, y: 1.0 });
    const [iHatPrime, setIHatPrime] = useState(new THREE.Vector3(1.5, 0.5, 0));
    const [jHatPrime, setJHatPrime] = useState(new THREE.Vector3(-0.5, 1, 0));
    const [vectorV, setVectorV] = useState(new THREE.Vector3(0, 0, 0)); // This will be calculated

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

    // One-time scene setup
    useEffect(() => {
        if (!mountRef.current) return;

        const currentMount = mountRef.current;
        const cleanupFunctions: (() => void)[] = [];

        const scene = new THREE.Scene();
        sceneRef.current = scene;

        const aspect = currentMount.clientWidth / currentMount.clientHeight;
        const frustumSize = 12;
        const camera = new THREE.OrthographicCamera(
            frustumSize * aspect / -2, frustumSize * aspect / 2,
            frustumSize / 2, frustumSize / -2,
            0.1, 100
        );
        camera.position.set(0, 0, 10);
        cameraRef.current = camera;
        
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
        const gridHelper = new THREE.GridHelper(50, 50, 0x444444, 0x444444);
        gridHelper.rotation.x = Math.PI / 2;
        scene.add(gridHelper);

        // Transformed Grid Group
        transformedGridRef.current = new THREE.Group();
        scene.add(transformedGridRef.current);

        // Standard Basis Vectors (non-interactive)
        const iHat = new THREE.ArrowHelper(new THREE.Vector3(1, 0, 0), new THREE.Vector3(0, 0, 0), 1, 0xff3333, 0.2, 0.1); 
        const jHat = new THREE.ArrowHelper(new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, 0, 0), 1, 0x33ff33, 0.2, 0.1);
        scene.add(iHat, jHat);
        
        // Draggable New Basis Vectors
        iHatPrimeRef.current = new THREE.ArrowHelper(new THREE.Vector3(1,0,0), 1, 0xff8a65, 0.3, 0.2);
        jHatPrimeRef.current = new THREE.ArrowHelper(new THREE.Vector3(0,1,0), 1, 0x69f0ae, 0.3, 0.2);
        scene.add(iHatPrimeRef.current, jHatPrimeRef.current);

        // Resultant Vector (v)
        const initialV = iHatPrime.clone().multiplyScalar(newBasisCoords.x).add(jHatPrime.clone().multiplyScalar(newBasisCoords.y));
        vectorVRef.current = new THREE.ArrowHelper(initialV.clone().normalize(), initialV.length(), 0xffffff, 0.3, 0.2);
        scene.add(vectorVRef.current);

        // Vector Label for v
        vectorLabelRef.current = createLabel("v", '#ffffff');
        scene.add(vectorLabelRef.current);
        
        // Interactivity
        const cleanupI = makeObjectsDraggable(iHatPrimeRef.current, camera, renderer.domElement, { onDrag: (obj, pos) => setIHatPrime(pos.clone().setZ(0)) });
        const cleanupJ = makeObjectsDraggable(jHatPrimeRef.current, camera, renderer.domElement, { onDrag: (obj, pos) => setJHatPrime(pos.clone().setZ(0)) });
        cleanupFunctions.push(cleanupI, cleanupJ);
        
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Updates visualization based on state changes
    useEffect(() => {
        const v = iHatPrime.clone().multiplyScalar(newBasisCoords.x).add(jHatPrime.clone().multiplyScalar(newBasisCoords.y));
        setVectorV(v);

        if (vectorVRef.current) {
            const length = v.length();
            if (length > 0.01) {
              vectorVRef.current.setLength(length, 0.3, 0.2);
              vectorVRef.current.setDirection(v.clone().normalize());
            } else {
              vectorVRef.current.setLength(0,0,0);
            }
        }
        
        if (vectorLabelRef.current) {
            sceneRef.current?.remove(vectorLabelRef.current);
            vectorLabelRef.current = createLabel(`(${newBasisCoords.x.toFixed(2)}, ${newBasisCoords.y.toFixed(2)})`, '#ffffff');
            vectorLabelRef.current.position.copy(v).add(new THREE.Vector3(0.5, 0.5, 0));
            sceneRef.current?.add(vectorLabelRef.current);
        }

        if (iHatPrimeRef.current) {
            const len = iHatPrime.length();
            if(len > 0.01) {
              iHatPrimeRef.current.setLength(len, 0.3, 0.2);
              iHatPrimeRef.current.setDirection(iHatPrime.clone().normalize());
            } else {
              iHatPrimeRef.current.setLength(0,0,0);
            }
        }
        if (jHatPrimeRef.current) {
             const len = jHatPrime.length();
            if(len > 0.01) {
              jHatPrimeRef.current.setLength(len, 0.3, 0.2);
              jHatPrimeRef.current.setDirection(jHatPrime.clone().normalize());
            } else {
                jHatPrimeRef.current.setLength(0,0,0);
            }
        }

        if (transformedGridRef.current && sceneRef.current) {
            while (transformedGridRef.current.children.length > 0) {
                transformedGridRef.current.remove(transformedGridRef.current.children[0]);
            }
            drawTransformedGrid(transformedGridRef.current, { 
                matrix: { a: iHatPrime.x, b: jHatPrime.x, c: iHatPrime.y, d: jHatPrime.y },
                transformedColor: 0x64b5f6,
                divisions: 25,
                size: 50
            });
        }
        
    }, [newBasisCoords, iHatPrime, jHatPrime]);
    
    const handleCoordChange = (coord: 'x' | 'y', value: string) => {
        const numValue = parseFloat(value);
        if (!isNaN(numValue)) {
            setNewBasisCoords(prev => ({...prev, [coord]: numValue}));
        }
    };


    return (
        <div className="w-full">
            <div ref={mountRef} className={cn("relative aspect-[4/3] md:aspect-video w-full overflow-hidden rounded-lg border bg-muted/20 cursor-grab active:cursor-grabbing")}></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 p-4 rounded-lg border bg-muted/50 items-center">
                <div className="text-center">
                    <Label className="font-semibold text-primary">Coordinates in New Basis</Label>
                    <div className="flex justify-center items-center gap-2 mt-2">
                        <Input className="w-20 h-8 text-center" value={newBasisCoords.x} onChange={e => handleCoordChange('x', e.target.value)} />
                        <Input className="w-20 h-8 text-center" value={newBasisCoords.y} onChange={e => handleCoordChange('y', e.target.value)} />
                    </div>
                </div>
                 <div className="text-2xl font-bold text-muted-foreground text-center">=</div>
                 <div className="text-center">
                    <Label className="font-semibold">Resulting Vector (Standard Coords)</Label>
                     <div className="font-mono text-lg p-2 mt-2">
                        {`[${vectorV.x.toFixed(2)}, ${vectorV.y.toFixed(2)}]`}
                    </div>
                </div>
            </div>
        </div>
    );
}
