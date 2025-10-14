
'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import * as THREE from 'three';
import { InteractiveScene, AnimationLoop, useThree } from '../three/InteractiveScene';
import { drawAxes } from '../three/coordinate-system';
import { drawVector, Vector as VectorClass } from '../three/primitives';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { easeInOutCubic } from '../three/animation';
import { BlockMath } from 'react-katex';

type Matrix2D = { a: number, b: number, c: number, d: number };

const initialMatrix: Matrix2D = { a: 0, b: -1, c: 1, d: 0 }; // 90-degree rotation counter-clockwise
const initialVector = new THREE.Vector3(2, 1, 0);

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

function SceneSetup() {
    const { scene } = useThree();
    const vectorRef = useRef<VectorClass | null>(null);
    const animationState = useRef({
        startVector: initialVector.clone(),
        targetVector: initialVector.clone(),
        isAnimating: false,
        progress: 0,
        duration: 800, // 0.8 second animation
        matrix: initialMatrix,
    });
    const [transformedVector, setTransformedVector] = useState(initialVector.clone());

    const startAnimation = (matrix: Matrix2D) => {
        if (animationState.current.isAnimating) return;
        
        const currentDirection = new THREE.Vector3();
        vectorRef.current?.getDirection(currentDirection);
        const startVec = currentDirection.multiplyScalar(vectorRef.current?.scale.y || 1);

        const transformedX = matrix.a * initialVector.x + matrix.b * initialVector.y;
        const transformedY = matrix.c * initialVector.x + matrix.d * initialVector.y;
        const target = new THREE.Vector3(transformedX, transformedY, 0);

        setTransformedVector(target);
        
        animationState.current.startVector.copy(startVec);
        animationState.current.targetVector.copy(target);
        animationState.current.matrix = matrix;
        animationState.current.isAnimating = true;
        animationState.current.progress = 0;
    };
    
    // Attach startAnimation to the window object so it can be called from outside
    useEffect(() => {
        (window as any).startVectorAnimation = startAnimation;
        return () => { delete (window as any).startVectorAnimation; };
    }, []);

    useEffect(() => {
        if (!scene) return;
        // Clear previous scene contents
        while(scene.children.length > 0){ 
            scene.remove(scene.children[0]); 
        }

        drawAxes(scene, { size: 4, tickInterval: 1 });
        drawVector(scene, { origin: new THREE.Vector3(0,0,0), destination: initialVector, color: 0x888888, label: `v = [${initialVector.x}, ${initialVector.y}]` });
        const animatedVector = new VectorClass(initialVector.clone().normalize(), initialVector.length(), 0xff8a65, undefined, undefined, 'v\'', new THREE.Vector3(0,0,0));
        vectorRef.current = animatedVector;
        scene.add(animatedVector);

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
            
            if (currentVec.length() > 0) {
                vectorRef.current.setLength(currentVec.length());
                vectorRef.current.setDirection(currentVec.clone().normalize());
            }

            if (t >= 1) {
                animationState.current.isAnimating = false;
            }
        };

        (window as any).animationCallback = handleAnimate;
        return () => { delete (window as any).animationCallback; };
    }, [scene]);

    return null;
}


export function VectorRotationAnimation() {
    const [matrix, setMatrix] = useState<Matrix2D>(initialMatrix);
    const [transformedVector, setTransformedVector] = useState(initialVector.clone());

    const handleApply = () => {
        const transformedX = matrix.a * initialVector.x + matrix.b * initialVector.y;
        const transformedY = matrix.c * initialVector.x + matrix.d * initialVector.y;
        setTransformedVector(new THREE.Vector3(transformedX, transformedY, 0));
        if ((window as any).startVectorAnimation) {
            (window as any).startVectorAnimation(matrix);
        }
    };
    
    const resetState = () => {
      setMatrix(initialMatrix);
      setTransformedVector(initialVector);
       if ((window as any).startVectorAnimation) {
            (window as any).startVectorAnimation(initialMatrix);
        }
    }
    
    return (
        <div className="w-full">
            <div className="relative aspect-[4/3] md:aspect-video w-full overflow-hidden rounded-lg border bg-background">
                <InteractiveScene cameraPosition={new THREE.Vector3(0, 0, 8)}>
                    <SceneSetup />
                    <AnimationLoop callback={(time, delta) => {
                        if ((window as any).animationCallback) {
                            (window as any).animationCallback(time, delta);
                        }
                    }} />
                </InteractiveScene>
            </div>

            <div className="flex flex-col md:flex-row justify-center items-center gap-4 md:gap-8 mt-4 p-4 rounded-md border bg-muted/50">
                <MatrixInput matrix={matrix} setMatrix={setMatrix} label="Matrix (M)" />
                <div className="text-2xl font-bold text-muted-foreground hidden md:block">×</div>
                <div className="text-center">
                    <Label className="font-semibold">Vector (v)</Label>
                    <div className="font-mono text-lg p-2 mt-2">
                        <BlockMath math={`\\begin{bmatrix} ${initialVector.x} \\\\ ${initialVector.y} \\end{bmatrix}`} />
                    </div>
                </div>
                 <div className="text-2xl font-bold text-muted-foreground">=</div>
                <div className="text-center">
                    <Label className="font-semibold">Result (Mv)</Label>
                     <div className="font-mono text-lg p-2 mt-2">
                        <BlockMath math={`\\begin{bmatrix} ${transformedVector.x.toFixed(2)} \\\\ ${transformedVector.y.toFixed(2)} \\end{bmatrix}`} />
                    </div>
                </div>
            </div>
             <div className="flex justify-center gap-2 mt-4">
                <Button onClick={handleApply}>
                    Apply Transformation
                </Button>
                <Button onClick={resetState} variant="secondary">
                    Reset
                </Button>
            </div>
        </div>
    );
}

