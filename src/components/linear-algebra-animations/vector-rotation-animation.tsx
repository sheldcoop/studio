
'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import * as THREE from 'three';
import { drawAxes, drawGrid } from '../three/coordinate-system';
import { Vector } from '../three/primitives';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { easeInOutCubic } from '../three/animation';
import { BlockMath } from 'react-katex';

type Matrix2D = { a: number, b: number, c: number, d: number };

const initialMatrix: Matrix2D = { a: 0, b: -1, c: 1, d: 0 };
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

export function VectorRotationAnimation() {
    const mountRef = useRef<HTMLDivElement>(null);
    const [matrix, setMatrix] = useState<Matrix2D>(initialMatrix);
    const [transformedVector, setTransformedVector] = useState({x: -1, y: 2});

    const animationState = useRef({
        startVector: new THREE.Vector3(),
        targetVector: new THREE.Vector3(-1, 2, 0),
        isAnimating: false,
        progress: 0,
        duration: 800,
    });

    useEffect(() => {
        if (!mountRef.current) return;
        const currentMount = mountRef.current;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, currentMount.clientWidth / currentMount.clientHeight, 0.1, 100);
        camera.position.set(0, 0, 8);

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        currentMount.appendChild(renderer.domElement);

        drawAxes(scene, { size: 4, tickInterval: 1 });
        drawGrid(scene, { size: 4 });

        const staticVector = new Vector(initialVector.clone().normalize(), initialVector.length(), 0x888888, 0.2, 0.1, `v = [${initialVector.x}, ${initialVector.y}]`);
        scene.add(staticVector);
        
        const animatedVector = new Vector(animationState.current.targetVector.clone().normalize(), animationState.current.targetVector.length(), 0xff8a65, 0.2, 0.1, "v'");
        scene.add(animatedVector);

        const clock = new THREE.Clock();
        let animationFrameId: number;

        const animate = () => {
            animationFrameId = requestAnimationFrame(animate);
            const delta = clock.getDelta();

            if (animationState.current.isAnimating) {
                animationState.current.progress += delta * 1000;
                const t = Math.min(animationState.current.progress / animationState.current.duration, 1);
                const easedT = easeInOutCubic(t);

                const currentVec = new THREE.Vector3().lerpVectors(
                    animationState.current.startVector,
                    animationState.current.targetVector,
                    easedT
                );
                
                if (currentVec.length() > 0.001) {
                    animatedVector.setDirection(currentVec.clone().normalize());
                }
                animatedVector.setLength(currentVec.length());

                if (t >= 1) {
                    animationState.current.isAnimating = false;
                }
            }

            renderer.render(scene, camera);
        };

        animate();

        const handleResize = () => {
            if (currentMount) {
                camera.aspect = currentMount.clientWidth / currentMount.clientHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
            }
        };
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(animationFrameId);
            currentMount.removeChild(renderer.domElement);
            renderer.dispose();
        };
    }, []);
    
    // Apply the very first transformation on component mount
    useEffect(() => {
        handleApply();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleApply = () => {
        if (animationState.current.isAnimating) return;

        const transformedX = matrix.a * initialVector.x + matrix.b * initialVector.y;
        const transformedY = matrix.c * initialVector.x + matrix.d * initialVector.y;
        const target = new THREE.Vector3(transformedX, transformedY, 0);
        
        setTransformedVector({ x: transformedX, y: transformedY });
        
        const currentAnimatedVector = new THREE.Vector3().copy(animationState.current.targetVector);

        animationState.current.startVector.copy(currentAnimatedVector);
        animationState.current.targetVector.copy(target);
        animationState.current.isAnimating = true;
        animationState.current.progress = 0;
    };

    const resetState = () => {
      setMatrix(initialMatrix);
      
      const target = new THREE.Vector3(
        initialMatrix.a * initialVector.x + initialMatrix.b * initialVector.y,
        initialMatrix.c * initialVector.x + initialMatrix.d * initialVector.y,
        0
      );
      setTransformedVector({ x: target.x, y: target.y });
      
      const startVec = animationState.current.targetVector.clone();
      animationState.current.startVector.copy(startVec);
      animationState.current.targetVector.copy(target);
      animationState.current.isAnimating = true;
      animationState.current.progress = 0;
    }
    
    return (
        <div className="w-full">
            <div ref={mountRef} className="relative aspect-[4/3] md:aspect-video w-full overflow-hidden rounded-lg border bg-background"></div>

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
