
'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import * as THREE from 'three';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { easeInOutCubic } from '@/components/three/animation';
import { BlockMath } from 'react-katex';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import { Play, Pause, RotateCcw } from 'lucide-react';

type Matrix2D = { a: number; b: number; c: number; d: number };

const INITIAL_VECTOR = new THREE.Vector3(2, 1, 0);
const ROTATION_MATRIX: Matrix2D = { a: 0, b: -1, c: 1, d: 0 };
const SHEAR_MATRIX: Matrix2D = { a: 1, b: 1, c: 0, d: 1 };
const IDENTITY_MATRIX: Matrix2D = { a: 1, b: 0, c: 0, d: 1 };

export function InteractiveMatrixTransformation() {
    const mountRef = useRef<HTMLDivElement>(null);
    const { theme } = useTheme();
    const [matrix, setMatrix] = useState<Matrix2D>(ROTATION_MATRIX);
    const [isPlaying, setIsPlaying] = useState(false);
    
    // Store three.js objects in refs to persist across renders
    const sceneRef = useRef<THREE.Scene | null>(null);
    const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
    const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
    const animationFrameIdRef = useRef<number>();
    const iHatRef = useRef<THREE.ArrowHelper | null>(null);
    const jHatRef = useRef<THREE.ArrowHelper | null>(null);
    const vectorVRef = useRef<THREE.ArrowHelper | null>(null);
    const gridRef = useRef<THREE.GridHelper | null>(null);

    const animationState = useRef({
        progress: 0,
        duration: 2000, // 2 seconds
        isAnimating: false,
        fromMatrix: { ...IDENTITY_MATRIX },
        toMatrix: { ...matrix }
    });

    const setupScene = useCallback(() => {
        if (!mountRef.current) return [];

        const currentMount = mountRef.current;
        
        const computedStyle = getComputedStyle(document.documentElement);
        const primaryColorValue = computedStyle.getPropertyValue('--primary').trim();
        const primaryColor = new THREE.Color(`hsl(${primaryColorValue})`);

        sceneRef.current = new THREE.Scene();
        cameraRef.current = new THREE.PerspectiveCamera(75, currentMount.clientWidth / currentMount.clientHeight, 0.1, 100);
        cameraRef.current.position.set(0, 0, 8);
        
        rendererRef.current = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        rendererRef.current.setSize(currentMount.clientWidth, currentMount.clientHeight);
        rendererRef.current.setPixelRatio(window.devicePixelRatio);
        currentMount.appendChild(rendererRef.current.domElement);

        gridRef.current = new THREE.GridHelper(10, 10);
        gridRef.current.rotation.x = Math.PI / 2;
        (gridRef.current.material as THREE.LineBasicMaterial).transparent = true;
        (gridRef.current.material as THREE.LineBasicMaterial).opacity = 0.2;
        sceneRef.current.add(gridRef.current);

        const createVector = (dir: THREE.Vector3, color: THREE.Color) => {
            return new THREE.ArrowHelper(dir.clone().normalize(), new THREE.Vector3(0,0,0), dir.length(), color, 0.3, 0.15);
        }

        iHatRef.current = createVector(new THREE.Vector3(1, 0, 0), new THREE.Color(0xf44336)); // Red
        jHatRef.current = createVector(new THREE.Vector3(0, 1, 0), new THREE.Color(0x4caf50)); // Green
        vectorVRef.current = createVector(INITIAL_VECTOR, primaryColor);
        
        sceneRef.current.add(iHatRef.current, jHatRef.current, vectorVRef.current);
        
        return [
            () => {
                cancelAnimationFrame(animationFrameIdRef.current!);
                if (mountRef.current && rendererRef.current?.domElement) {
                    mountRef.current.removeChild(rendererRef.current.domElement);
                }
                rendererRef.current?.dispose();
            }
        ];
    }, [theme]);
    
    useEffect(() => {
        const [cleanup] = setupScene();
        
        const animate = () => {
            animationFrameIdRef.current = requestAnimationFrame(animate);
            if (!rendererRef.current || !sceneRef.current || !cameraRef.current || !iHatRef.current || !jHatRef.current || !vectorVRef.current || !gridRef.current) return;
            
            if (animationState.current.isAnimating) {
                animationState.current.progress += 16; // Roughly 60fps
                const t = Math.min(animationState.current.progress / animationState.current.duration, 1);
                const easedT = easeInOutCubic(t);

                const currentMatrix = {
                    a: animationState.current.fromMatrix.a + (animationState.current.toMatrix.a - animationState.current.fromMatrix.a) * easedT,
                    b: animationState.current.fromMatrix.b + (animationState.current.toMatrix.b - animationState.current.fromMatrix.b) * easedT,
                    c: animationState.current.fromMatrix.c + (animationState.current.toMatrix.c - animationState.current.fromMatrix.c) * easedT,
                    d: animationState.current.fromMatrix.d + (animationState.current.toMatrix.d - animationState.current.fromMatrix.d) * easedT,
                };
                
                // Update Basis Vectors
                iHatRef.current.setDirection(new THREE.Vector3(currentMatrix.a, currentMatrix.c, 0).normalize());
                iHatRef.current.setLength(new THREE.Vector3(currentMatrix.a, currentMatrix.c, 0).length());
                jHatRef.current.setDirection(new THREE.Vector3(currentMatrix.b, currentMatrix.d, 0).normalize());
                jHatRef.current.setLength(new THREE.Vector3(currentMatrix.b, currentMatrix.d, 0).length());
                
                // Update Vector V
                const newV = new THREE.Vector3(
                    INITIAL_VECTOR.x * currentMatrix.a + INITIAL_VECTOR.y * currentMatrix.b,
                    INITIAL_VECTOR.x * currentMatrix.c + INITIAL_VECTOR.y * currentMatrix.d,
                    0
                );
                vectorVRef.current.setDirection(newV.clone().normalize());
                vectorVRef.current.setLength(newV.length());

                // Update Grid
                const matrix4 = new THREE.Matrix4().set(
                    currentMatrix.a, currentMatrix.c, 0, 0,
                    currentMatrix.b, currentMatrix.d, 0, 0,
                    0, 0, 1, 0,
                    0, 0, 0, 1
                );
                gridRef.current.matrix.copy(matrix4);
                gridRef.current.matrixAutoUpdate = false;


                if (t >= 1) {
                    animationState.current.isAnimating = false;
                    setIsPlaying(false);
                }
            }

            rendererRef.current.render(sceneRef.current, cameraRef.current);
        };
        
        animate();

        return () => {
            cleanup();
        };

    }, [setupScene]);
    
    const handlePlayPause = () => {
        if (!animationState.current.isAnimating) {
            animationState.current.fromMatrix = { a: 1, b: 0, c: 0, d: 1 };
            animationState.current.toMatrix = { ...matrix };
            animationState.current.progress = 0;
            animationState.current.isAnimating = true;
        } else {
             animationState.current.isAnimating = !animationState.current.isAnimating;
        }
        setIsPlaying(animationState.current.isAnimating);
    }
    
    const handleReset = () => {
        animationState.current.isAnimating = false;
        setIsPlaying(false);
        animationState.current.progress = 0;
        const identity = { ...IDENTITY_MATRIX };
        if (iHatRef.current && jHatRef.current && vectorVRef.current && gridRef.current) {
            iHatRef.current.setDirection(new THREE.Vector3(identity.a, identity.c, 0).normalize());
            iHatRef.current.setLength(1);
            jHatRef.current.setDirection(new THREE.Vector3(identity.b, identity.d, 0).normalize());
            jHatRef.current.setLength(1);
            vectorVRef.current.setDirection(INITIAL_VECTOR.clone().normalize());
            vectorVRef.current.setLength(INITIAL_VECTOR.length());
            gridRef.current.matrix.identity();
        }
    }

    const handleMatrixInputChange = (key: keyof Matrix2D, value: string) => {
        const numValue = parseFloat(value);
        if (!isNaN(numValue)) {
            setMatrix({ ...matrix, [key]: numValue });
        }
    };

    return (
        <div className="w-full">
            <div ref={mountRef} className={cn("relative aspect-[4/3] md:aspect-video w-full overflow-hidden rounded-lg border bg-muted/20")}></div>
            <div className="flex flex-col md:flex-row justify-center items-center gap-4 mt-4 text-center p-4 rounded-lg border bg-muted/50">
                 <div className="space-y-2">
                    <Label className="font-semibold">Transformation Matrix</Label>
                    <div className="flex justify-center items-center gap-2">
                        <div className="text-4xl font-thin">[</div>
                        <div className="grid grid-cols-2 gap-x-2 gap-y-1 w-24">
                            <Input className="h-8 text-center" type="text" value={matrix.a} onChange={e => handleMatrixInputChange('a', e.target.value)} />
                            <Input className="h-8 text-center" type="text" value={matrix.b} onChange={e => handleMatrixInputChange('b', e.target.value)} />
                            <Input className="h-8 text-center" type="text" value={matrix.c} onChange={e => handleMatrixInputChange('c', e.target.value)} />
                            <Input className="h-8 text-center" type="text" value={matrix.d} onChange={e => handleMatrixInputChange('d', e.target.value)} />
                        </div>
                        <div className="text-4xl font-thin">]</div>
                    </div>
                </div>
                 <div className="space-y-2">
                    <Label className="font-semibold">Vector</Label>
                     <div className="font-mono text-lg p-2 mt-2">
                        <BlockMath math={`v = \\begin{bmatrix} ${INITIAL_VECTOR.x} \\\\ ${INITIAL_VECTOR.y} \\end{bmatrix}`} />
                    </div>
                </div>
                 <div className="flex flex-col items-center gap-2">
                     <Button onClick={handlePlayPause}>
                         {isPlaying ? <Pause className="h-4 w-4 mr-2"/> : <Play className="h-4 w-4 mr-2"/> }
                         {isPlaying ? 'Pause' : 'Play'}
                     </Button>
                     <Button onClick={handleReset} variant="secondary" size="sm">
                         <RotateCcw className="h-4 w-4 mr-2" />
                         Reset
                     </Button>
                </div>
            </div>
        </div>
    );
}

    