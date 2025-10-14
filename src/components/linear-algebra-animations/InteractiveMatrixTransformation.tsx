
'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import * as THREE from 'three';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { BlockMath } from 'react-katex';
import { makeObjectsDraggable } from '@/components/three/interactivity';
import { createLabel } from '../three/ui-helpers';
import { Input } from '../ui/input';

type Matrix2D = { a: number, b: number, c: number, d: number };

const MatrixInput = ({ matrix, setMatrix, label }: { matrix: Matrix2D, setMatrix: (m: Matrix2D) => void, label: string }) => {
    const handleChange = (key: keyof Matrix2D, value: string) => {
        const numValue = parseFloat(value);
        if (!isNaN(numValue)) {
            setMatrix({ ...matrix, [key]: numValue });
        }
    };

    return (
        <div className="space-y-2 text-center">
            <Label className="font-semibold">{label}</Label>
            <div className="flex justify-center items-center gap-2">
                <div className="text-4xl font-thin">[</div>
                <div className="grid grid-cols-2 gap-x-2 gap-y-1 w-24">
                    <Input className="h-8 text-center" type="text" value={matrix.a} onChange={e => handleChange('a', e.target.value)} />
                    <Input className="h-8 text-center" type="text" value={matrix.b} onChange={e => handleChange('b', e.target.value)} />
                    <Input className="h-8 text-center" type="text" value={matrix.c} onChange={e => handleChange('c', e.target.value)} />
                    <Input className="h-8 text-center" type="text" value={matrix.d} onChange={e => handleChange('d', e.target.value)} />
                </div>
                 <div className="text-4xl font-thin">]</div>
            </div>
        </div>
    );
};


export function InteractiveMatrixTransformation() {
    const mountRef = useRef<HTMLDivElement>(null);
    
    const [vector, setVector] = useState(new THREE.Vector3(2, 1, 0));
    const [matrix, setMatrix] = useState<Matrix2D>({ a: 1, b: 1, c: 0, d: 1 }); // Default to a shear

    // Store three.js objects in refs to persist across re-renders
    const sceneRef = useRef<THREE.Scene | null>(null);
    const cameraRef = useRef<THREE.OrthographicCamera | null>(null);
    const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
    const animationFrameIdRef = useRef<number>();

    // Refs for the arrow helpers
    const iHatRef = useRef<THREE.ArrowHelper | null>(null);
    const jHatRef = useRef<THREE.ArrowHelper | null>(null);
    const iHatTransformedRef = useRef<THREE.ArrowHelper | null>(null);
    const jHatTransformedRef = useRef<THREE.ArrowHelper | null>(null);
    const vectorVRef = useRef<THREE.ArrowHelper | null>(null);
    const vectorTransformedRef = useRef<THREE.ArrowHelper | null>(null);
    const vectorLabelRef = useRef<THREE.Sprite | null>(null);
    const vectorTransformedLabelRef = useRef<THREE.Sprite | null>(null);

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
        const gridHelper = new THREE.GridHelper(50, 25);
        gridHelper.rotation.x = Math.PI / 2;
        scene.add(gridHelper);
        cleanupFunctions.push(() => {
            scene.remove(gridHelper);
            gridHelper.geometry.dispose();
            (gridHelper.material as THREE.Material).dispose();
        });


        // Basis Vectors
        iHatRef.current = new THREE.ArrowHelper(new THREE.Vector3(1, 0, 0), new THREE.Vector3(0, 0, 0), 1, 0xf44336, 0.2, 0.1); 
        jHatRef.current = new THREE.ArrowHelper(new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, 0, 0), 1, 0x4caf50, 0.2, 0.1);
        
        // Transformed Basis Vectors
        iHatTransformedRef.current = new THREE.ArrowHelper(new THREE.Vector3(1, 0, 0), new THREE.Vector3(0, 0, 0), 1, 0xffcdd2, 0.2, 0.1); // Lighter red
        jHatTransformedRef.current = new THREE.ArrowHelper(new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, 0, 0), 1, 0xc8e6c9, 0.2, 0.1); // Lighter green

        // Main Draggable Vector
        vectorVRef.current = new THREE.ArrowHelper(new THREE.Vector3(1,0,0), new THREE.Vector3(0,0,0), 1, 0xffffff, 0.25, 0.15);
        vectorTransformedRef.current = new THREE.ArrowHelper(new THREE.Vector3(1,0,0), new THREE.Vector3(0,0,0), 1, 0xffb74d, 0.25, 0.15); // Orange

        // Vector Labels
        vectorLabelRef.current = createLabel(`v`, '#ffffff');
        vectorTransformedLabelRef.current = createLabel(`v'`, '#ffb74d');
        
        scene.add(iHatRef.current, jHatRef.current, iHatTransformedRef.current, jHatTransformedRef.current, vectorVRef.current, vectorTransformedRef.current, vectorLabelRef.current, vectorTransformedLabelRef.current);
        
        // Interactivity
        const onDrag = (obj: THREE.Object3D, pos: THREE.Vector3) => {
            const newVector = pos.clone();
            newVector.z = 0; 
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
    }, []);

    // This useEffect hook updates the visualization when state changes
    useEffect(() => {
        // Original vector `v`
        if (vectorVRef.current && vectorLabelRef.current) {
            const length = vector.length();
            if (length > 0.01) {
                vectorVRef.current.setDirection(vector.clone().normalize());
                vectorVRef.current.setLength(length, 0.25, 0.15);
            } else {
                vectorVRef.current.setLength(0, 0, 0); 
            }
            vectorLabelRef.current.position.copy(vector).add(new THREE.Vector3(0.5, 0.5, 0));
        }

        // Transformed basis vectors i' and j'
        const iHatPrime = new THREE.Vector3(matrix.a, matrix.c, 0);
        const jHatPrime = new THREE.Vector3(matrix.b, matrix.d, 0);

        if (iHatTransformedRef.current) {
            const len = iHatPrime.length();
            iHatTransformedRef.current.setDirection(iHatPrime.clone().normalize());
            iHatTransformedRef.current.setLength(len, 0.2, 0.1);
        }
        if (jHatTransformedRef.current) {
             const len = jHatPrime.length();
            jHatTransformedRef.current.setDirection(jHatPrime.clone().normalize());
            jHatTransformedRef.current.setLength(len, 0.2, 0.1);
        }

        // Transformed vector v'
        const transformedVector = new THREE.Vector3(
            vector.x * matrix.a + vector.y * matrix.b,
            vector.x * matrix.c + vector.y * matrix.d,
            0
        );
        if (vectorTransformedRef.current && vectorTransformedLabelRef.current) {
            const length = transformedVector.length();
            if (length > 0.01) {
                vectorTransformedRef.current.setDirection(transformedVector.clone().normalize());
                vectorTransformedRef.current.setLength(length, 0.25, 0.15);
            } else {
                vectorTransformedRef.current.setLength(0, 0, 0);
            }
            vectorTransformedLabelRef.current.position.copy(transformedVector).add(new THREE.Vector3(0.5, 0.5, 0));
        }

    }, [vector, matrix]);


    return (
        <div className="w-full">
            <div ref={mountRef} className={cn("relative aspect-[4/3] md:aspect-video w-full overflow-hidden rounded-lg border bg-muted/20 cursor-grab active:cursor-grabbing")}></div>
             <div className="flex flex-col md:flex-row justify-center items-center gap-4 md:gap-8 mt-4 p-4 rounded-lg border bg-muted/50">
                 <MatrixInput matrix={matrix} setMatrix={setMatrix} label="Matrix (M)" />

                <div className="text-2xl font-bold text-muted-foreground hidden md:block">×</div>

                <div className="text-center">
                    <Label className="font-semibold">Vector (v)</Label>
                    <div className="font-mono text-lg p-2 mt-2">
                        <BlockMath math={`v = \\begin{bmatrix} ${vector.x.toFixed(2)} \\\\ ${vector.y.toFixed(2)} \\end{bmatrix}`} />
                    </div>
                </div>

                 <div className="text-2xl font-bold text-muted-foreground">=</div>
                
                <div className="text-center">
                    <Label className="font-semibold text-[#ffb74d]">Result (v')</Label>
                     <div className="font-mono text-lg p-2 mt-2">
                        <BlockMath math={`v' = \\begin{bmatrix} ${(matrix.a * vector.x + matrix.b * vector.y).toFixed(2)} \\\\ ${(matrix.c * vector.x + matrix.d * vector.y).toFixed(2)} \\end{bmatrix}`} />
                    </div>
                </div>
             </div>
        </div>
    );
}

