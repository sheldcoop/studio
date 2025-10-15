
'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import * as THREE from 'three';
import { InteractiveScene, AnimationLoop, useThree } from '../three/InteractiveScene';
import { drawAxes } from '../three/coordinate-system';
import { drawArrow } from '../three/primitives';
import { Vector as VectorClass } from '../three/primitives';
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
                    <Input className="h-8 text-center" type="text" value={matrix.a.toFixed(2)} onChange={e => handleChange('a', e.target.value)} />
                    <Input className="h-8 text-center" type="text" value={matrix.b.toFixed(2)} onChange={e => handleChange('b', e.target.value)} />
                    <Input className="h-8 text-center" type="text" value={matrix.c.toFixed(2)} onChange={e => handleChange('c', e.target.value)} />
                    <Input className="h-8 text-center" type="text" value={matrix.d.toFixed(2)} onChange={e => handleChange('d', e.target.value)} />
                </div>
                 <div className="text-4xl font-thin">]</div>
            </div>
        </div>
    );
};

function SceneSetup({ animationState }: { animationState: React.MutableRefObject<any>}) {
    const { scene } = useThree();
    
    // This effect sets up the scene and the animation callback
    useEffect(() => {
        if (!scene) return;
        
        drawAxes(scene, { size: 6 });
        
        const originalVector = drawArrow(scene, { origin: new THREE.Vector3(0,0,0), destination: initialVector, color: 0x888888, label: `v` });
        
        animationState.current.originalVector = originalVector;
        animationState.current.vPrime = new VectorClass(initialVector.clone().normalize(), initialVector.length(), 0xff8a65, 0.3, 0.2, 'v\'', new THREE.Vector3(0,0,0));
        animationState.current.vDoublePrime = new VectorClass(initialVector.clone().normalize(), initialVector.length(), 0x4fc3f7, 0.3, 0.2, 'v\'\'', new THREE.Vector3(0,0,0));

        scene.add(animationState.current.vPrime, animationState.current.vDoublePrime);
        

        // Define the animation logic that will be called by the loop
        const handleAnimate = (time: number, delta: number) => {
            const state = animationState.current;
            if (!state.isAnimating) return;
            
            state.progress += delta;
            let t = Math.min(state.progress / state.duration, 1);
            const easedT = easeInOutCubic(t);
            
            if (state.stage === 1) { // Animate v to v'
                const currentVec = new THREE.Vector3().lerpVectors(state.startVector, state.targetVPrime, easedT);
                if (currentVec.length() > 0.01) {
                    state.vPrime.setLength(currentVec.length());
                    state.vPrime.setDirection(currentVec.clone().normalize());
                }
            } else if (state.stage === 2) { // Animate v' to v''
                 const currentVec = new THREE.Vector3().lerpVectors(state.targetVPrime, state.targetVDoublePrime, easedT);
                 if (currentVec.length() > 0.01) {
                    state.vDoublePrime.setLength(currentVec.length());
                    state.vDoublePrime.setDirection(currentVec.clone().normalize());
                 }
            }


            if (t >= 1) {
                 if (state.stage === 1) {
                    state.stage = 2;
                    state.progress = 0; // Reset progress for next stage
                    // v' becomes transparent and v'' starts animating from v'
                    state.vPrime.cone.material.opacity = 0.3;
                    state.vPrime.line.material.opacity = 0.3;
                    state.vDoublePrime.setLength(state.targetVPrime.length());
                    state.vDoublePrime.setDirection(state.targetVPrime.clone().normalize());
                } else {
                    state.isAnimating = false;
                }
            }
        };

        (window as any).animationCallback = handleAnimate;
        
        return () => {
            while(scene.children.length > 0){ 
                scene.remove(scene.children[0]); 
            }
            delete (window as any).animationCallback;
        }
    }, [scene, animationState]);

    return null;
}


export function MatrixMultiplicationAnimation() {
    const [matrixA, setMatrixA] = useState<Matrix2D>({ a: 1, b: 1, c: 0, d: 1 }); // Shear
    const [matrixB, setMatrixB] = useState<Matrix2D>({ a: 0, b: -1, c: 1, d: 0 }); // 90 deg rotation
    const [resultantMatrix, setResultantMatrix] = useState<Matrix2D>({ a: 1, b: -1, c: 1, d: 1 });
    
    const [vPrime, setVPrime] = useState(initialVector.clone());
    const [vDoublePrime, setVDoublePrime] = useState(initialVector.clone());


    const animationState = useRef({
        startVector: initialVector.clone(),
        targetVPrime: initialVector.clone(),
        targetVDoublePrime: initialVector.clone(),
        isAnimating: false,
        progress: 0,
        duration: 1000,
        stage: 1,
        vPrime: null as VectorClass | null,
        vDoublePrime: null as VectorClass | null,
        originalVector: null as THREE.Group | null,
    });

    const handleApply = () => {
        if (animationState.current.isAnimating) return;

        // B * v
        const vPrimeTarget = new THREE.Vector3(
            matrixB.a * initialVector.x + matrixB.b * initialVector.y,
            matrixB.c * initialVector.x + matrixB.d * initialVector.y,
            0
        );
        setVPrime(vPrimeTarget);

        // A * (B * v)
        const vDoublePrimeTarget = new THREE.Vector3(
            matrixA.a * vPrimeTarget.x + matrixA.b * vPrimeTarget.y,
            matrixA.c * vPrimeTarget.x + matrixA.d * vPrimeTarget.y,
            0
        );
        setVDoublePrime(vDoublePrimeTarget);
        
        // A * B
        setResultantMatrix({
            a: matrixA.a * matrixB.a + matrixA.b * matrixB.c,
            b: matrixA.a * matrixB.b + matrixA.b * matrixB.d,
            c: matrixA.c * matrixB.a + matrixA.d * matrixB.c,
            d: matrixA.c * matrixB.b + matrixA.d * matrixB.d,
        });

        // Set up animation
        animationState.current.startVector.copy(initialVector);
        animationState.current.targetVPrime.copy(vPrimeTarget);
        animationState.current.targetVDoublePrime.copy(vDoublePrimeTarget);
        animationState.current.isAnimating = true;
        animationState.current.progress = 0;
        animationState.current.stage = 1;
        
        // Reset visual state before starting
        if(animationState.current.vPrime) {
            (animationState.current.vPrime.cone.material as THREE.Material).opacity = 1;
            (animationState.current.vPrime.line.material as THREE.Material).opacity = 1;
            animationState.current.vPrime.setLength(initialVector.length());
            animationState.current.vPrime.setDirection(initialVector.clone().normalize());
        }
        if(animationState.current.vDoublePrime) {
            animationState.current.vDoublePrime.setLength(0);
        }

    };
    
    return (
        <div className="w-full">
            <div className="relative aspect-[4/3] md:aspect-video w-full overflow-hidden rounded-lg border bg-background">
                <InteractiveScene cameraPosition={new THREE.Vector3(0, 0, 10)}>
                    <SceneSetup animationState={animationState} />
                    <AnimationLoop callback={(time, delta) => {
                        if ((window as any).animationCallback) {
                            (window as any).animationCallback(time, delta);
                        }
                    }} />
                </InteractiveScene>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 justify-center items-center gap-4 md:gap-8 mt-4 p-4 rounded-md border bg-muted/50">
                <MatrixInput matrix={matrixA} setMatrix={setMatrixA} label="Matrix A" />
                <div className="hidden lg:block text-2xl font-bold text-muted-foreground text-center">×</div>
                <MatrixInput matrix={matrixB} setMatrix={setMatrixB} label="Matrix B" />
            </div>
             <div className="flex justify-center gap-2 mt-4">
                <Button onClick={handleApply}>
                    Apply Transformations (A * B * v)
                </Button>
            </div>
            <div className="text-center mt-4 p-4 bg-muted/50 rounded-lg">
                <p className="font-semibold text-primary">Resulting Transformation (C = AB)</p>
                <div className="font-mono text-lg p-2 mt-2 inline-block">
                    <BlockMath math={`\\begin{bmatrix} ${resultantMatrix.a.toFixed(2)} & ${resultantMatrix.b.toFixed(2)} \\\\ ${resultantMatrix.c.toFixed(2)} & ${resultantMatrix.d.toFixed(2)} \\end{bmatrix}`} />
                </div>
            </div>
        </div>
    );
}
