
'use client';

import { useState, useRef, useEffect } from 'react';
import * as THREE from 'three';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { makeObjectsDraggable } from '@/components/three/interactivity';
import { createLabel } from '../three/ui-helpers';
import { drawTransformedGrid } from '../three/transformation';

// A simple extension to make updating arrows easier
class VectorArrow extends THREE.ArrowHelper {
    constructor(dir: THREE.Vector3, origin: THREE.Vector3, length: number, color: THREE.ColorRepresentation, headLength?: number, headWidth?: number) {
        super(dir, origin, length, color, headLength, headWidth);
    }
}

export function InteractiveMatrixTransformation() {
    const mountRef = useRef<HTMLDivElement>(null);
    
    // State for the vectors
    const [coords, setCoords] = useState({ x: 2.0, y: 1.0 });
    const [b1Pos, setB1Pos] = useState(new THREE.Vector3(1.5, 0.5, 0));
    const [b2Pos, setB2Pos] = useState(new THREE.Vector3(-0.5, 1, 0));
    const [vectorV, setVectorV] = useState(new THREE.Vector3(0, 0, 0));

    // Refs for three.js objects
    const sceneRef = useRef<THREE.Scene | null>(null);
    const cameraRef = useRef<THREE.OrthographicCamera | null>(null);
    const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
    const animationFrameIdRef = useRef<number>();
    
    // Refs for the visual objects
    const vRef = useRef<VectorArrow | null>(null);
    const b1Ref = useRef<VectorArrow | null>(null);
    const b2Ref = useRef<VectorArrow | null>(null);
    const vLabelRef = useRef<THREE.Sprite | null>(null);
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
        
        // Step 1: Grids
        const standardGrid = new THREE.GridHelper(50, 50, 0x444444, 0x444444);
        standardGrid.rotation.x = Math.PI / 2;
        scene.add(standardGrid);

        transformedGridRef.current = new THREE.Group();
        scene.add(transformedGridRef.current);

        // Step 2: Arrows
        const iHat = new THREE.ArrowHelper(new THREE.Vector3(1, 0, 0), new THREE.Vector3(0, 0, 0), 1, 0xff3333, 0.2, 0.1); 
        const jHat = new THREE.ArrowHelper(new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, 0, 0), 1, 0x33ff33, 0.2, 0.1);
        scene.add(iHat, jHat);
        
        b1Ref.current = new VectorArrow(b1Pos.clone().normalize(), new THREE.Vector3(0,0,0), b1Pos.length(), 0xff8a65, 0.3, 0.2);
        b2Ref.current = new VectorArrow(b2Pos.clone().normalize(), new THREE.Vector3(0,0,0), b2Pos.length(), 0x69f0ae, 0.3, 0.2);
        scene.add(b1Ref.current, b2Ref.current);

        // Step 3: Calculate and display v
        const initialV = b1Pos.clone().multiplyScalar(coords.x).add(b2Pos.clone().multiplyScalar(coords.y));
        vRef.current = new VectorArrow(initialV.clone().normalize(), new THREE.Vector3(0,0,0), initialV.length(), 0xffffff, 0.3, 0.2);
        scene.add(vRef.current);

        vLabelRef.current = createLabel("v", '#ffffff');
        scene.add(vLabelRef.current);
        
        // Step 5: Interactivity
        const cleanupB1 = makeObjectsDraggable(b1Ref.current, camera, renderer.domElement, { 
            onDrag: (obj, pos) => setB1Pos(pos.clone().setZ(0)) 
        });
        const cleanupB2 = makeObjectsDraggable(b2Ref.current, camera, renderer.domElement, { 
            onDrag: (obj, pos) => setB2Pos(pos.clone().setZ(0)) 
        });
        cleanupFunctions.push(cleanupB1, cleanupB2);
        
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

    // Effect to update visualization when state changes
    useEffect(() => {
        const v = b1Pos.clone().multiplyScalar(coords.x).add(b2Pos.clone().multiplyScalar(coords.y));
        setVectorV(v);

        const updateArrow = (arrow: VectorArrow | null, vector: THREE.Vector3) => {
            if (arrow) {
                const length = vector.length();
                if (length > 0.001) {
                    arrow.setLength(length, 0.3, 0.2);
                    arrow.setDirection(vector.clone().normalize());
                } else {
                    arrow.setLength(0, 0, 0); // Hide if zero length
                }
            }
        }

        updateArrow(b1Ref.current, b1Pos);
        updateArrow(b2Ref.current, b2Pos);
        updateArrow(vRef.current, v);

        if (vLabelRef.current) {
            vLabelRef.current.position.copy(v).add(new THREE.Vector3(0.5, 0.5, 0));
        }

        if (transformedGridRef.current && sceneRef.current) {
            // Step 6: Update Transformed Grid
            while (transformedGridRef.current.children.length > 0) {
                const child = transformedGridRef.current.children[0];
                transformedGridRef.current.remove(child);
                (child as any).geometry?.dispose();
                (child as any).material?.dispose();
            }
            drawTransformedGrid(transformedGridRef.current, { 
                matrix: { a: b1Pos.x, b: b2Pos.x, c: b1Pos.y, d: b2Pos.y },
                color: 0x4fc3f7,
                divisions: 25,
                size: 50
            });
        }
        
    }, [coords, b1Pos, b2Pos]);
    
    const handleCoordChange = (coord: 'x' | 'y', value: string) => {
        const numValue = parseFloat(value);
        if (!isNaN(numValue)) {
            setCoords(prev => ({...prev, [coord]: numValue}));
        }
    };

    return (
        <div className="w-full">
            <div ref={mountRef} className={cn("relative aspect-[4/3] md:aspect-video w-full overflow-hidden rounded-lg border bg-muted/20 cursor-grab active:cursor-grabbing")}></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 p-4 rounded-lg border bg-muted/50 items-center">
                <div className="text-center">
                    <Label className="font-semibold text-primary">Coordinates in New Basis</Label>
                    <div className="flex justify-center items-center gap-2 mt-2">
                        <Input className="w-20 h-8 text-center" value={coords.x} onChange={e => handleCoordChange('x', e.target.value)} />
                        <Input className="w-20 h-8 text-center" value={coords.y} onChange={e => handleCoordChange('y', e.target.value)} />
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
