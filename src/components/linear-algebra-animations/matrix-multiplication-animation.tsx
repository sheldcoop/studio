
'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import * as THREE from 'three';
import { InteractiveScene, AnimationLoop } from '../three/InteractiveScene';
import { drawAxes } from '../three/coordinate-system';
import { drawVector } from '../three/primitives';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { easeInOutCubic } from '../three/animation';
import type { Vector as VectorClass } from '../three/primitives';

type Matrix2D = { a: number, b: number, c: number, d: number };

const initialMatrix: Matrix2D = { a: 0, b: -1, c: 1, d: 0 }; // 90-degree rotation
const initialVector = new THREE.Vector3(1, 2, 0);

const MatrixInput = ({ matrix, setMatrix, label }: { matrix: Matrix2D, setMatrix: (m: Matrix2D) => void, label: string }) => {
    const handleChange = (key: keyof Matrix2D, value: string) => {
        const numValue = parseFloat(value) || 0;
        setMatrix({ ...matrix, [key]: numValue });
    };

    return (
        <div className="space-y-2">
            <Label className="font-semibold">{label}</Label>
            <div className="grid grid-cols-2 gap-2">
                <Input type="number" value={matrix.a} onChange={e => handleChange('a', e.target.value)} />
                <Input type="number" value={matrix.b} onChange={e => handleChange('b', e.target.value)} />
                <Input type="number" value={matrix.c} onChange={e => handleChange('c', e.target.value)} />
                <Input type="number" value={matrix.d} onChange={e => handleChange('d', e.target.value)} />
            </div>
        </div>
    );
};

export function VectorRotationAnimation() {
    const vectorRef = useRef<VectorClass | null>(null);
    
    const animationState = useRef({
        startVector: initialVector.clone(),
        targetVector: initialVector.clone(),
        isAnimating: false,
        progress: 0,
        duration: 1000, // 1 second animation
    });
    
    const [matrix, setMatrix] = useState<Matrix2D>(initialMatrix);
    const [scene, setScene] = useState<THREE.Scene | null>(null);

    const startAnimation = () => {
        const transformedX = matrix.a * initialVector.x + matrix.b * initialVector.y;
        const transformedY = matrix.c * initialVector.x + matrix.d * initialVector.y;
        
        animationState.current.startVector = vectorRef.current ? vectorRef.current.getDirection(new THREE.Vector3()).multiplyScalar(vectorRef.current.scale.y) : initialVector.clone();
        animationState.current.targetVector = new THREE.Vector3(transformedX, transformedY, 0);
        animationState.current.isAnimating = true;
        animationState.current.progress = 0;
    };
    
    const handleAnimate = (time: number, delta: number) => {
        if (!animationState.current.isAnimating || !vectorRef.current) return;
        
        animationState.current.progress += delta;
        const t = Math.min(animationState.current.progress / animationState.current.duration, 1);
        const easedT = easeInOutCubic(t);
        
        const currentVec = new THREE.Vector3().lerpVectors(
            animationState.current.startVector,
            animationState.current.targetVector,
            easedT
        );
        
        vectorRef.current.setLength(currentVec.length());
        vectorRef.current.setDirection(currentVec.normalize());

        if (t >= 1) {
            animationState.current.isAnimating = false;
        }
    };

    const setupScene = useCallback((s: THREE.Scene) => {
        drawAxes(s, { size: 5, tickInterval: 1 });
        drawVector(s, { origin: new THREE.Vector3(0,0,0), destination: initialVector, color: 0x888888, label: 'Original' });
        const animatedVector = drawVector(s, { origin: new THREE.Vector3(0,0,0), destination: initialVector, color: 0xff00ff, label: 'Transformed'});
        vectorRef.current = animatedVector as VectorClass;
        setScene(s);
    }, []);
    
    return (
        <div className="w-full">
            <div className="relative aspect-video w-full overflow-hidden rounded-lg border bg-background">
                <InteractiveScene cameraPosition={new THREE.Vector3(0, 0, 8)}>
                    <AnimationLoop callback={handleAnimate} />
                    <primitive object={new THREE.Group()} ref={(group: THREE.Group) => {
                        if (group && !scene) { // Setup scene only once
                            setupScene(group);
                        }
                    }} />
                </InteractiveScene>
            </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 items-end">
                <MatrixInput matrix={matrix} setMatrix={setMatrix} label="Transformation Matrix" />
                <Button onClick={startAnimation} disabled={animationState.current.isAnimating}>
                    Apply Transformation
                </Button>
            </div>
        </div>
    );
}
