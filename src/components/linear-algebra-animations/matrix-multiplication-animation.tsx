
'use client';

import { useState, useRef, useEffect } from 'react';
import * as THREE from 'three';
import { InteractiveScene, AnimationLoop } from '../three/InteractiveScene';
import { drawGrid, drawAxes } from '../three/coordinate-system';
import { animateTransformation, type Matrix2D } from '../three/animation';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

const initialMatrixA: Matrix2D = { a: 0, b: -1, c: 1, d: 0 }; // 90-degree rotation
const initialMatrixB: Matrix2D = { a: 1, b: 1, c: 0, d: 1 }; // Shear

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


export function MatrixMultiplicationAnimation() {
    const gridRef = useRef<THREE.Group>(null);
    const animationState = useRef({
        targetMatrix: { a: 1, b: 0, c: 0, d: 1 } as Matrix2D,
        currentMatrix: { a: 1, b: 0, c: 0, d: 1 } as Matrix2D,
        isAnimating: false,
        progress: 0,
        duration: 1500, // Slightly faster animation
    });
    
    const [matrixA, setMatrixA] = useState<Matrix2D>(initialMatrixA);
    const [matrixB, setMatrixB] = useState<Matrix2D>(initialMatrixB);
    const [matrixC, setMatrixC] = useState<Matrix2D>({ a: 1, b: 0, c: 0, d: 1 });

    useEffect(() => {
        // C = B * A (Note: transformations apply right-to-left, so B then A)
        const c_a = matrixA.a * matrixB.a + matrixA.c * matrixB.b;
        const c_b = matrixA.b * matrixB.a + matrixA.d * matrixB.b;
        const c_c = matrixA.a * matrixB.c + matrixA.c * matrixB.d;
        const c_d = matrixA.b * matrixB.c + matrixA.d * matrixB.d;
        setMatrixC({ a: c_a, b: c_b, c: c_c, d: c_d });
    }, [matrixA, matrixB]);

    const startAnimation = (targetMatrix: Matrix2D) => {
        animationState.current.targetMatrix = targetMatrix;
        animationState.current.isAnimating = true;
        animationState.current.progress = 0;
    };
    
    const handleAnimate = (time: number, delta: number) => {
        if (!gridRef.current) return;
        
        if (animationState.current.isAnimating) {
            animationState.current.progress += delta;
            let t = Math.min(animationState.current.progress / animationState.current.duration, 1);
            
            const newMatrix = animateTransformation(
                animationState.current.currentMatrix,
                animationState.current.targetMatrix,
                t
            );

            // Apply the transformation to the grid group
            gridRef.current.matrix.set(
                newMatrix.a, newMatrix.c, 0, 0,
                newMatrix.b, newMatrix.d, 0, 0,
                0, 0, 1, 0,
                0, 0, 0, 1
            );
            gridRef.current.matrixAutoUpdate = false;


            if (t >= 1) {
                animationState.current.isAnimating = false;
                animationState.current.currentMatrix = animationState.current.targetMatrix;
            }
        }
    };
    
    return (
        <div className="w-full">
            <InteractiveScene cameraPosition={new THREE.Vector3(0, 0, 10)}>
                <AnimationLoop callback={handleAnimate} />
                <primitive object={drawAxes(new THREE.Scene(), { size: 5, tickInterval: 1 })} />
                <group ref={gridRef}>
                    <primitive object={drawGrid(new THREE.Scene(), { size: 5 })} />
                </group>
            </InteractiveScene>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <MatrixInput matrix={matrixA} setMatrix={setMatrixA} label="Matrix A (Rotation)" />
                <MatrixInput matrix={matrixB} setMatrix={setMatrixB} label="Matrix B (Shear)" />
                 <Card>
                    <CardHeader className="p-2 pt-4"><CardTitle className="text-sm font-semibold text-center">Combined (C = BA)</CardTitle></CardHeader>
                    <CardContent className="p-2">
                         <div className="grid grid-cols-2 gap-2 text-center text-sm font-mono p-2 bg-muted rounded-md">
                            <span>{matrixC.a.toFixed(2)}</span><span>{matrixC.b.toFixed(2)}</span>
                            <span>{matrixC.c.toFixed(2)}</span><span>{matrixC.d.toFixed(2)}</span>
                        </div>
                    </CardContent>
                </Card>
            </div>
            <div className="flex justify-center gap-2 mt-4">
                <Button onClick={() => startAnimation(matrixB)}>1. Apply B</Button>
                <Button onClick={() => startAnimation(matrixC)}>2. Then Apply A</Button>
                <Button variant="destructive" onClick={() => startAnimation({ a: 1, b: 0, c: 0, d: 1 })}>Reset</Button>
                <Button variant="secondary" onClick={() => startAnimation(matrixC)}>Apply C Directly</Button>
            </div>
        </div>
    );
}
