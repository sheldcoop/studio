
'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import * as THREE from 'three';
import { TransformationControls } from '@/components/app/TransformationControls';
import { makeObjectsDraggable } from '@/components/three/interactivity';
import { drawAngleBetweenVectors } from '../three/ui-helpers';
import { drawTransformedGrid, drawLinearCombination } from '../three/transformation';
import { easeInOutCubic } from '../three/animation';
import { Vector } from '../three/primitives';


const initialB1 = new THREE.Vector3(1.5, 0.5, 0);
const initialB2 = new THREE.Vector3(-0.5, 1, 0);

export function InteractiveMatrixTransformation() {
    const mountRef = useRef<HTMLDivElement>(null);
    
    // State for vectors & coordinates
    const [coords, setCoords] = useState({ x: 2.0, y: 1.0 });
    const [b1Pos, setB1Pos] = useState(initialB1.clone());
    const [b2Pos, setB2Pos] = useState(initialB2.clone());
    const [vectorV, setVectorV] = useState(new THREE.Vector3(0, 0, 0));
    const [determinant, setDeterminant] = useState(0);

    // State for new rotation mode
    const [mode, setMode] = useState<'explore' | 'rotation'>('explore');
    const [rotationAngle, setRotationAngle] = useState(0);

    // Refs for three.js objects
    const sceneRef = useRef<THREE.Scene | null>(null);
    const cameraRef = useRef<THREE.OrthographicCamera | null>(null);
    const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
    const animationFrameIdRef = useRef<number>();
    
    // Refs for visual objects
    const vRef = useRef<Vector | null>(null);
    const b1Ref = useRef<Vector | null>(null);
    const b2Ref = useRef<Vector | null>(null);
    const iHatRef = useRef<Vector | null>(null);
    const jHatRef = useRef<Vector | null>(null);
    const transformedGridRef = useRef<THREE.Group | null>(null);
    const combinationHelpersRef = useRef<THREE.Group | null>(null);
    const angleArcRef = useRef<THREE.Group | null>(null);

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
            if (renderer.domElement && renderer.domElement.parentElement === currentMount) {
                currentMount.removeChild(renderer.domElement);
            }
            renderer.dispose();
        });
        
        // Grids
        const standardGrid = new THREE.GridHelper(50, 50, 0x444444, 0x444444);
        standardGrid.rotation.x = Math.PI / 2;
        scene.add(standardGrid);

        transformedGridRef.current = new THREE.Group();
        scene.add(transformedGridRef.current);

        // Arrows
        iHatRef.current = new Vector(new THREE.Vector3(1, 0, 0), 1, 0xff3333, 0.2, 0.1, 'î'); 
        jHatRef.current = new Vector(new THREE.Vector3(0, 1, 0), 1, 0x33ff33, 0.2, 0.1, 'ĵ');
        scene.add(iHatRef.current, jHatRef.current);
        
        b1Ref.current = new Vector(b1Pos.clone().normalize(), b1Pos.length(), 0xff8a65, 0.3, 0.2, 'b₁');
        b2Ref.current = new Vector(b2Pos.clone().normalize(), b2Pos.length(), 0x69f0ae, 0.3, 0.2, 'b₂');
        scene.add(b1Ref.current, b2Ref.current);

        const initialV = b1Pos.clone().multiplyScalar(coords.x).add(b2Pos.clone().multiplyScalar(coords.y));
        vRef.current = new Vector(initialV.clone().normalize(), initialV.length(), 0xffffff, 0.3, 0.2, 'v');
        scene.add(vRef.current);
        
        combinationHelpersRef.current = new THREE.Group();
        scene.add(combinationHelpersRef.current);

        angleArcRef.current = new THREE.Group();
        scene.add(angleArcRef.current);

        const cleanupB1 = makeObjectsDraggable(b1Ref.current, camera, renderer.domElement, { 
            onDrag: (obj, pos) => { if(mode === 'explore') setB1Pos(pos.clone().setZ(0)) }
        });
        const cleanupB2 = makeObjectsDraggable(b2Ref.current, camera, renderer.domElement, { 
            onDrag: (obj, pos) => { if(mode === 'explore') setB2Pos(pos.clone().setZ(0)) }
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

    // Effect to handle rotation mode
    useEffect(() => {
        if (mode === 'rotation') {
            const angleRad = THREE.MathUtils.degToRad(rotationAngle);
            const cos = Math.cos(angleRad);
            const sin = Math.sin(angleRad);
            
            // Start with a perpendicular basis for clarity
            const baseB1 = new THREE.Vector3(2, 0, 0);
            const baseB2 = new THREE.Vector3(0, 2, 0);

            const newB1 = new THREE.Vector3(
                baseB1.x * cos - baseB1.y * sin,
                baseB1.x * sin + baseB1.y * cos,
                0
            );
            const newB2 = new THREE.Vector3(
                baseB2.x * cos - baseB2.y * sin,
                baseB2.x * sin + baseB2.y * cos,
                0
            );
            setB1Pos(newB1);
            setB2Pos(newB2);
        }
    }, [mode, rotationAngle]);


    // Effect to update visualization when any state changes
    useEffect(() => {
        const b1 = b1Pos;
        const b2 = b2Pos;

        const v = b1.clone().multiplyScalar(coords.x).add(b2.clone().multiplyScalar(coords.y));
        setVectorV(v);
        
        const det = b1.x * b2.y - b1.y * b2.x;
        setDeterminant(det);

        const updateArrow = (arrow: Vector | null, vector: THREE.Vector3, color: THREE.ColorRepresentation, label?: string, showCoords = true, showLength: boolean = false) => {
            if (arrow) {
                const length = vector.length();
                if (length > 0.001) {
                    arrow.setDirectionAndLength(vector.clone().normalize(), length);
                } else {
                    arrow.setLength(0, 0, 0);
                }
                 if (label) arrow.setLabel(label, color);
                 if (showCoords) arrow.setCoordsLabel(vector, color);
                 arrow.setLengthLabel(showLength ? length : null, color);
                 arrow.updateLabelPosition();
            }
        }

        updateArrow(b1Ref.current, b1, 0xff8a65, 'b₁', true, mode === 'rotation');
        updateArrow(b2Ref.current, b2, 0x69f0ae, 'b₂', true, mode === 'rotation');
        updateArrow(vRef.current, v, 0xffffff, 'v', true, mode === 'rotation');
        updateArrow(iHatRef.current, new THREE.Vector3(1,0,0), 0xff3333, 'î');
        updateArrow(jHatRef.current, new THREE.Vector3(0,1,0), 0x33ff33, 'ĵ');


        if (transformedGridRef.current && sceneRef.current) {
            while (transformedGridRef.current.children.length > 0) {
                const child = transformedGridRef.current.children[0];
                transformedGridRef.current.remove(child);
                if ((child as any).geometry) (child as any).geometry.dispose();
                if ((child as any).material) (child as any).material.dispose();
            }
            drawTransformedGrid(transformedGridRef.current, { 
                matrix: { a: b1.x, b: b2.x, c: b1.y, d: b2.y },
                gridColor: 0x4fc3f7,
                divisions: 25,
                size: 50
            });
            transformedGridRef.current.position.z = 0.1;
        }

        if (combinationHelpersRef.current && sceneRef.current) {
             while (combinationHelpersRef.current.children.length > 0) {
                const child = combinationHelpersRef.current.children[0];
                combinationHelpersRef.current.remove(child);
                 if ((child as any).geometry) (child as any).geometry.dispose();
                if ((child as any).material) (child as any).material.dispose();
            }
            const newHelpers = drawLinearCombination(sceneRef.current, b1, b2, coords.x, coords.y);
            combinationHelpersRef.current.add(...newHelpers.children);
        }
        
        if (angleArcRef.current && sceneRef.current) {
            while (angleArcRef.current.children.length > 0) {
                const child = angleArcRef.current.children[0];
                angleArcRef.current.remove(child);
                if ((child as any).geometry) (child as any).geometry.dispose();
                if ((child as any).material) (child as any).material.dispose();
            }
            if(mode === 'rotation') {
                const newArc = drawAngleBetweenVectors(sceneRef.current, { v1: b1, v2: b2, color: 0xffeb3b, showAngleText: true, radius: 1 });
                angleArcRef.current.add(newArc);
            }
        }
        
    }, [coords, b1Pos, b2Pos, mode]);

    const animateTo = (targetB1: THREE.Vector3, targetB2: THREE.Vector3) => {
        const startB1 = b1Pos.clone();
        const startB2 = b2Pos.clone();
        const duration = 500;
        let startTime: number | null = null;
    
        const animate = (time: number) => {
            if (startTime === null) startTime = time;
            const progress = Math.min((time - startTime) / duration, 1);
            const easedProgress = easeInOutCubic(progress);
    
            const newB1 = new THREE.Vector3().lerpVectors(startB1, targetB1, easedProgress);
            const newB2 = new THREE.Vector3().lerpVectors(startB2, targetB2, easedProgress);
            
            setB1Pos(newB1);
            setB2Pos(newB2);
    
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        requestAnimationFrame(animate);
    };

    const handlePreset = (preset: 'reset' | 'shear' | 'rotate' | 'scale') => {
        setMode('explore'); // Exit rotation mode if active
        switch(preset) {
            case 'shear':
                animateTo(new THREE.Vector3(1, 0, 0), new THREE.Vector3(1, 1, 0));
                break;
            case 'rotate':
                animateTo(new THREE.Vector3(0, 1, 0), new THREE.Vector3(-1, 0, 0));
                break;
            case 'scale':
                 animateTo(new THREE.Vector3(2, 0, 0), new THREE.Vector3(0, 2, 0));
                break;
            case 'reset':
            default:
                animateTo(initialB1.clone(), initialB2.clone());
                setCoords({x: 2.0, y: 1.0});
                break;
        }
    }
    
    return (
        <div className="w-full">
            <TransformationControls
                b1Pos={b1Pos}
                b2Pos={b2Pos}
                determinant={determinant}
                coords={coords}
                onCoordsChange={setCoords}
                onPresetChange={handlePreset}
                mode={mode}
                onModeChange={setMode}
                rotationAngle={rotationAngle}
                onRotationChange={setRotationAngle}
                vectorV={vectorV}
            />
            <div ref={mountRef} className="relative aspect-[4/3] md:aspect-video w-full overflow-hidden rounded-lg border bg-muted/20 cursor-grab active:cursor-grabbing"></div>
        </div>
    );
}
