
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

const initialMatrixA: Matrix2D = { a: 0, b: 1, c: -1, d: 0 }; // 90-degree rotation clockwise
const initialMatrixB: Matrix2D = { a: 1, b: 0, c: 1, d: 1 }; // Shear

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
    // Storing original vertices to re-apply transformations from a clean state
    const originalGridVertices = useRef<Float32Array | null>(null);

    const animationState = useRef({
        targetMatrix: { a: 1, b: 0, c: 0, d: 1 } as Matrix2D,
        currentMatrix: { a: 1, b: 0, c: 0, d: 1 } as Matrix2D,
        isAnimating: false,
        progress: 0,
        duration: 1500, // in ms
    });
    
    const [matrixA, setMatrixA] = useState<Matrix2D>(initialMatrixA);
    const [matrixB, setMatrixB] = useState<Matrix2D>(initialMatrixB);
    const [matrixC, setMatrixC] = useState<Matrix2D>({ a: 1, b: 0, c: 0, d: 1 });
    
    // This effect runs once to capture the initial state of the grid
    useEffect(() => {
        if (gridRef.current) {
            // Find the grid lines within the group and clone their vertex data
            const lineGeometries = gridRef.current.children.filter(c => c instanceof THREE.Line).map(c => (c as THREE.Line).geometry);
            if (lineGeometries.length > 0) {
                 const combinedVertices = new Float32Array(lineGeometries.reduce((acc, g) => acc + g.attributes.position.count * 3, 0));
                 let offset = 0;
                 lineGeometries.forEach(g => {
                    const positions = g.attributes.position.array as Float32Array;
                    combinedVertices.set(positions, offset);
                    offset += positions.length;
                 });
                 originalGridVertices.current = combinedVertices;
            }
        }
    }, []);


    useEffect(() => {
        // C = B * A (Note: transformations apply right-to-left)
        // This is the standard mathematical definition of matrix multiplication for transformations.
        const c_a = matrixB.a * matrixA.a + matrixB.b * matrixA.c;
        const c_b = matrixB.a * matrixA.b + matrixB.b * matrixA.d;
        const c_c = matrixB.c * matrixA.a + matrixB.d * matrixA.c;
        const c_d = matrixB.c * matrixA.b + matrixB.d * matrixA.d;
        setMatrixC({ a: c_a, b: c_b, c: c_c, d: c_d });
    }, [matrixA, matrixB]);

    const startAnimation = (targetMatrix: Matrix2D) => {
        animationState.current.targetMatrix = targetMatrix;
        animationState.current.isAnimating = true;
        animationState.current.progress = 0;
    };
    
    const handleAnimate = (time: number, delta: number) => {
        if (!gridRef.current || !originalGridVertices.current) return;
        
        if (animationState.current.isAnimating) {
            animationState.current.progress += delta;
            let t = Math.min(animationState.current.progress / animationState.current.duration, 1);
            
            const newMatrix = animateTransformation(
                animationState.current.currentMatrix,
                animationState.current.targetMatrix,
                t
            );
            
            // This is the correct way to apply the transformation to the geometry
            const transformedVertices = originalGridVertices.current.slice(); // Work on a copy
            for (let i = 0; i < transformedVertices.length; i += 3) {
                const x = transformedVertices[i];
                const y = transformedVertices[i+1];
                
                // Apply the 2D matrix transformation
                transformedVertices[i] = newMatrix.a * x + newMatrix.c * y;
                transformedVertices[i+1] = newMatrix.b * x + newMatrix.d * y;
            }

            // Update the grid geometries with the new vertex positions
            let offset = 0;
            gridRef.current.children.forEach(child => {
                if (child instanceof THREE.Line) {
                    const positionAttribute = child.geometry.getAttribute('position');
                    const segmentVertices = transformedVertices.subarray(offset, offset + positionAttribute.count * 3);
                    positionAttribute.copyArray(segmentVertices);
                    positionAttribute.needsUpdate = true;
                    offset += positionAttribute.count * 3;
                }
            });

            if (t >= 1) {
                animationState.current.isAnimating = false;
                animationState.current.currentMatrix = animationState.current.targetMatrix;
            }
        }
    };
    
    return (
        <div className="w-full">
            <div className="relative aspect-video w-full overflow-hidden rounded-lg border bg-background">
                <InteractiveScene cameraPosition={new THREE.Vector3(0, 0, 10)}>
                    <AnimationLoop callback={handleAnimate} />
                    <primitive object={drawAxes(new THREE.Scene(), { size: 5, tickInterval: 1 })} />
                    <primitive object={drawGrid(new THREE.Scene(), { size: 5 })} ref={gridRef} />
                </InteractiveScene>
            </div>

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
                <Button onClick={() => startAnimation(matrixA)}>1. Apply A</Button>
                <Button onClick={() => startAnimation(matrixC)}>2. Then Apply B</Button>
                <Button variant="destructive" onClick={() => startAnimation({ a: 1, b: 0, c: 0, d: 1 })}>Reset</Button>
                <Button variant="secondary" onClick={() => startAnimation(matrixC)}>Apply C Directly</Button>
            </div>
        </div>
    );
}
