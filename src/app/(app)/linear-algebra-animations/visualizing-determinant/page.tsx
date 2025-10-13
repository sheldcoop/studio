
'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

import { PageHeader } from '@/components/app/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';

import { drawArrow } from '@/components/three/primitives';
import { drawGrid } from '@/components/three/coordinate-system';
import { drawTransformedGrid, drawColumnSpace } from '@/components/three/transformation';
import { animateTransformation, type EasingFunction, easeInOutCubic } from '@/components/three/animation';
import { drawMatrixNotation } from '@/components/three/ui-helpers';

type Matrix2D = { a: number; b: number; c: number; d: number };

export default function VisualizingDeterminantPage() {
    const mountRef = useRef<HTMLDivElement>(null);
    const sceneRef = useRef<THREE.Scene | null>(null);

    // State for matrix values
    const m00Ref = useRef<HTMLInputElement>(null);
    const m01Ref = useRef<HTMLInputElement>(null);
    const m10Ref = useRef<HTMLInputElement>(null);
    const m11Ref = useRef<HTMLInputElement>(null);
    const detValueRef = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        if (!mountRef.current) return;
        const currentMount = mountRef.current;
        
        // --- Basic Scene Setup ---
        const scene = new THREE.Scene();
        sceneRef.current = scene;
        const camera = new THREE.PerspectiveCamera(75, currentMount.clientWidth / currentMount.clientHeight, 0.1, 1000);
        camera.position.set(0, 0, 8);

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        currentMount.appendChild(renderer.domElement);
        
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.enablePan = false;
        controls.minDistance = 2;
        controls.maxDistance = 20;

        // --- Core Objects ---
        const fromMatrix: Matrix2D = { a: 1, b: 0, c: 0, d: 1 };
        let toMatrix: Matrix2D = { a: 1, b: 1, c: 0.5, d: 2 };
        
        let gridGroup: THREE.Group;
        let columnSpaceGroup: THREE.Group;
        let matrixText: THREE.Sprite;

        const updateDeterminantValue = (m: Matrix2D) => {
            const det = m.a * m.d - m.b * m.c;
            if (detValueRef.current) {
                detValueRef.current.textContent = det.toFixed(2);
            }
        };

        const recreateVisuals = (matrix: Matrix2D) => {
            if (gridGroup) scene.remove(gridGroup);
            if (columnSpaceGroup) scene.remove(columnSpaceGroup);
            if (matrixText) scene.remove(matrixText);

            gridGroup = drawTransformedGrid(scene, { matrix, size: 4 });
            columnSpaceGroup = drawColumnSpace(scene, { matrix });
            matrixText = drawMatrixNotation(scene, { matrix, position: new THREE.Vector3(3, 3, 0) });
            updateDeterminantValue(matrix);
        };
        
        // --- Animation Loop ---
        let animationProgress = 0;
        let isAnimating = false;
        
        const animate = () => {
            requestAnimationFrame(animate);
            controls.update();
            renderer.render(scene, camera);
        };

        const startAnimation = (newToMatrix: Matrix2D) => {
            toMatrix = newToMatrix;
            isAnimating = true;
            animationProgress = 0;

            const animationStartTime = Date.now();
            const duration = 1000; // 1 second animation

            function step() {
                const now = Date.now();
                const elapsed = now - animationStartTime;
                animationProgress = Math.min(elapsed / duration, 1);
                
                const currentMatrix = animateTransformation(fromMatrix, toMatrix, animationProgress, easeInOutCubic);
                recreateVisuals(currentMatrix);
                
                if (animationProgress < 1) {
                    requestAnimationFrame(step);
                } else {
                    isAnimating = false;
                    fromMatrix.a = toMatrix.a;
                    fromMatrix.b = toMatrix.b;
                    fromMatrix.c = toMatrix.c;
                    fromMatrix.d = toMatrix.d;
                }
            }
            requestAnimationFrame(step);
        };

        // --- Event Handlers ---
        const handleSliderChange = () => {
            if (isAnimating) return;
            const newMatrix: Matrix2D = {
                a: parseFloat(m00Ref.current?.value || '1'),
                b: parseFloat(m01Ref.current?.value || '0'),
                c: parseFloat(m10Ref.current?.value || '0'),
                d: parseFloat(m11Ref.current?.value || '1'),
            };
            startAnimation(newMatrix);
        };

        const setupInputListeners = () => {
            m00Ref.current?.addEventListener('input', handleSliderChange);
            m01Ref.current?.addEventListener('input', handleSliderChange);
            m10Ref.current?.addEventListener('input', handleSliderChange);
            m11Ref.current?.addEventListener('input', handleSliderChange);
        }

        const cleanupInputListeners = () => {
            m00Ref.current?.removeEventListener('input', handleSliderChange);
            m01Ref.current?.removeEventListener('input', handleSliderChange);
            m10Ref.current?.removeEventListener('input', handleSliderChange);
            m11Ref.current?.removeEventListener('input', handleSliderChange);
        }

        const handleResize = () => {
            if (currentMount) {
                camera.aspect = currentMount.clientWidth / currentMount.clientHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
            }
        };

        // --- Initial Call & Cleanup ---
        drawGrid(scene, { size: 4, gridColor: 0x444444 }); // Base grid
        recreateVisuals(fromMatrix);
        animate();
        window.addEventListener('resize', handleResize);
        setupInputListeners();
        
        return () => {
            window.removeEventListener('resize', handleResize);
            cleanupInputListeners();
            if (currentMount && renderer.domElement) {
                currentMount.removeChild(renderer.domElement);
            }
        };

    }, []);

    return (
        <div className="mx-auto max-w-7xl space-y-8">
            <PageHeader
                title="Visualizing the Determinant"
                description="An interactive exploration of how a matrix transforms space and how the determinant measures this change."
                variant="aligned-left"
            />
            <Card className="grid grid-cols-1 lg:grid-cols-3 gap-0 overflow-hidden">
                <div className="lg:col-span-2 h-[600px]" ref={mountRef}></div>
                <div className="p-6 bg-muted/50 space-y-6">
                    <CardHeader className="p-0">
                        <CardTitle className="font-headline">Matrix Controls</CardTitle>
                        <CardDescription>Adjust the matrix to see the transformation.</CardDescription>
                    </CardHeader>
                    <div className="grid grid-cols-2 gap-4 text-center">
                        <div className="space-y-2">
                             <Label htmlFor="m00">a (i-hat x)</Label>
                             <Slider ref={m00Ref} id="m00" min={-2} max={2} step={0.1} defaultValue={[1]} />
                        </div>
                         <div className="space-y-2">
                             <Label htmlFor="m01">b (j-hat x)</Label>
                             <Slider ref={m01Ref} id="m01" min={-2} max={2} step={0.1} defaultValue={[0]} />
                        </div>
                         <div className="space-y-2">
                             <Label htmlFor="m10">c (i-hat y)</Label>
                             <Slider ref={m10Ref} id="m10" min={-2} max={2} step={0.1} defaultValue={[0]} />
                        </div>
                         <div className="space-y-2">
                             <Label htmlFor="m11">d (j-hat y)</Label>
                             <Slider ref={m11Ref} id="m11" min={-2} max={2} step={0.1} defaultValue={[1]} />
                        </div>
                    </div>
                     <Card className="p-4 text-center">
                        <p className="text-sm font-medium text-muted-foreground">Determinant (Area Scaling Factor)</p>
                        <p ref={detValueRef} className="font-headline text-4xl font-bold tracking-tight text-primary">1.00</p>
                    </Card>
                </div>
            </Card>
        </div>
    );
}

