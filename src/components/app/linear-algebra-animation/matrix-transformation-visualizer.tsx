
'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { drawAxes, drawGrid } from '@/components/three/coordinate-system';
import { drawArrow, drawShading } from '@/components/three/primitives';
import { drawTransformedGrid } from '@/components/three/transformation';
import { makeObjectsDraggable } from '@/components/three/interactivity';
import { sequenceAnimations, lerpMatrix, easeInOutCubic } from '@/components/three/animation';
import { Card, CardContent } from '@/components/ui/card';
import { BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import { Button } from '../ui/button';
import { Play, Replay } from 'lucide-react';

type Matrix2D = { a: number; b: number; c: number; d: number };

const identityMatrix: Matrix2D = { a: 1, b: 0, c: 0, d: 1 };
const exampleMatrix: Matrix2D = { a: 2, b: 1, c: 0.5, d: 1.5 };

export function MatrixTransformationVisualizer() {
  const mountRef = useRef<HTMLDivElement>(null);
  const [matrix, setMatrix] = useState<Matrix2D>(identityMatrix);
  const [determinant, setDeterminant] = useState(1);
  const [sceneState, setSceneState] = useState<any>({});
  const [animationState, setAnimationState] = useState<'idle' | 'playing' | 'interactive'>('idle');
  const [step, setStep] = useState(0);

  const steps = [
    "This is where we start. A normal grid with our basis vectors i-hat (red) and j-hat (green).",
    "A matrix just tells us where those basis vectors land. Let's see what a new matrix does...",
    "The entire grid of space warps along with the basis vectors.",
    "Every other point is just a combination of i-hat and j-hat. So a point like (1, 2) moves with them.",
    "Now it's your turn! Drag the tips of the transformed vectors to create your own transformations.",
  ];

  // Effect to set up and run the Three.js scene
  useEffect(() => {
    if (!mountRef.current) return;
    const currentMount = mountRef.current;
    
    // --- Basic Scene Setup ---
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, currentMount.clientWidth / currentMount.clientHeight, 0.1, 1000);
    camera.position.set(0, 0, 10);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    currentMount.appendChild(renderer.domElement);

    // --- Scene Objects ---
    drawAxes(scene, { size: 6 });
    drawGrid(scene, { b1: new THREE.Vector3(1,0,0), b2: new THREE.Vector3(0,1,0), gridColor: 0x444444 });
    const iHatArrow = drawArrow(scene, { origin: new THREE.Vector3(), destination: new THREE.Vector3(1,0,0), color: 0xdd2222 });
    const jHatArrow = drawArrow(scene, { origin: new THREE.Vector3(), destination: new THREE.Vector3(0,1,0), color: 0x22dd22 });

    let transformedGrid = new THREE.Group();
    let transformedIHatArrow: THREE.Group, transformedJHatArrow: THREE.Group;
    let determinantShading: THREE.Mesh;
    const samplePoint = new THREE.Mesh(new THREE.SphereGeometry(0.15), new THREE.MeshBasicMaterial({ color: 0xffff00 }));
    samplePoint.position.set(1, 2, 0); // Our sample point at (1,2)
    scene.add(samplePoint);

    const iHatTip = new THREE.Mesh(new THREE.SphereGeometry(0.2), new THREE.MeshBasicMaterial({ color: 0xff4444 }));
    const jHatTip = new THREE.Mesh(new THREE.SphereGeometry(0.2), new THREE.MeshBasicMaterial({ color: 0x44ff44 }));
    iHatTip.visible = false;
    jHatTip.visible = false;
    scene.add(iHatTip, jHatTip);

    // --- State shared with React ---
    const localState = {
      matrix: identityMatrix,
    };
    setSceneState({
        ...sceneState,
        scene, renderer, camera,
        transformedGrid, transformedIHatArrow, transformedJHatArrow,
        determinantShading, samplePoint, iHatTip, jHatTip, localState
    });
    
    // --- Animation Loop ---
    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();

    // --- Cleanup ---
    return () => {
      currentMount.removeChild(renderer.domElement);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateScene = (newMatrix: Matrix2D) => {
    const { scene, transformedGrid, transformedIHatArrow, transformedJHatArrow, determinantShading, samplePoint, localState } = sceneState;
    
    if (!scene) return;
    
    localState.matrix = newMatrix;
    setMatrix(newMatrix);
    setDeterminant(newMatrix.a * newMatrix.d - newMatrix.b * newMatrix.c);

    // Remove old objects
    if (transformedGrid) scene.remove(transformedGrid);
    if (transformedIHatArrow) scene.remove(transformedIHatArrow);
    if (transformedJHatArrow) scene.remove(transformedJHatArrow);
    if (determinantShading) scene.remove(determinantShading);
    
    // Create new objects
    sceneState.transformedGrid = drawTransformedGrid(scene, { matrix: newMatrix, transformedColor: 0x4444ff, size: 6 });
    const iHat_t = new THREE.Vector3(newMatrix.a, newMatrix.c, 0);
    const jHat_t = new THREE.Vector3(newMatrix.b, newMatrix.d, 0);
    sceneState.transformedIHatArrow = drawArrow(scene, { origin: new THREE.Vector3(), destination: iHat_t, color: 0xff4444 });
    sceneState.transformedJHatArrow = drawArrow(scene, { origin: new THREE.Vector3(), destination: jHat_t, color: 0x44ff44 });
    
    const points = [ new THREE.Vector2(0,0), new THREE.Vector2(iHat_t.x, iHat_t.y), new THREE.Vector2(iHat_t.x + jHat_t.x, iHat_t.y + jHat_t.y), new THREE.Vector2(jHat_t.x, jHat_t.y) ];
    sceneState.determinantShading = drawShading(scene, { points, color: 0x4444ff });

    // Update sample point position
    const originalPoint = new THREE.Vector2(1, 2);
    const transformedPointX = newMatrix.a * originalPoint.x + newMatrix.b * originalPoint.y;
    const transformedPointY = newMatrix.c * originalPoint.x + newMatrix.d * originalPoint.y;
    samplePoint.position.set(transformedPointX, transformedPointY, 0);
  };
  
  const playAnimation = () => {
    setAnimationState('playing');
    updateScene(identityMatrix);

    sequenceAnimations([
      { duration: 2000, update: () => setStep(0) }, // Step 1: Show identity
      { duration: 3000, update: (p, ep) => { // Step 2 & 3: Animate transform
        setStep(1);
        const m = lerpMatrix(identityMatrix, exampleMatrix, ep);
        updateScene(m);
      }},
      { duration: 2000, update: () => setStep(2) }, // Step 4: Show point
      { duration: 3000, update: () => setStep(3) }, // Step 5: Explain interactivity
    ], () => { // On complete
        setStep(4);
        setAnimationState('interactive');
        const { camera, renderer, iHatTip, jHatTip, localState } = sceneState;
        iHatTip.visible = true;
        jHatTip.visible = true;
        iHatTip.position.set(localState.matrix.a, localState.matrix.c, 0);
        jHatTip.position.set(localState.matrix.b, localState.matrix.d, 0);
        
        makeObjectsDraggable([iHatTip, jHatTip], camera, renderer.domElement, {
            onDrag: (obj, pos) => {
                const newMatrix = { ...localState.matrix };
                if (obj === iHatTip) {
                    newMatrix.a = pos.x;
                    newMatrix.c = pos.y;
                    iHatTip.position.copy(pos);
                } else {
                    newMatrix.b = pos.x;
                    newMatrix.d = pos.y;
                    jHatTip.position.copy(pos);
                }
                updateScene(newMatrix);
            }
        })
    });
  }
  
  const resetAnimation = () => {
    setAnimationState('idle');
    setStep(0);
    sceneState.iHatTip.visible = false;
    sceneState.jHatTip.visible = false;
    updateScene(identityMatrix);
  }

  return (
    <div className="relative w-full h-full">
        <div ref={mountRef} className="w-full h-full" />
        <div className="absolute top-0 left-0 right-0 p-4 pointer-events-none">
            <Card className="max-w-xl mx-auto bg-background/80 backdrop-blur-sm pointer-events-auto">
                <CardContent className="p-3 text-center">
                    <p className="text-sm text-muted-foreground">{steps[step]}</p>
                </CardContent>
            </Card>
        </div>
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-4">
            {animationState === 'idle' && (
                <Button onClick={playAnimation}><Play className="mr-2 h-4 w-4" />Play Tutorial</Button>
            )}
            {animationState !== 'idle' && (
                <Button onClick={resetAnimation} variant="secondary"><Replay className="mr-2 h-4 w-4" />Reset</Button>
            )}
            <Card className="bg-background/80 backdrop-blur-sm">
                <CardContent className="p-3 text-center">
                    <BlockMath math={`M = \\begin{bmatrix} ${matrix.a.toFixed(2)} & ${matrix.b.toFixed(2)} \\\\ ${matrix.c.toFixed(2)} & ${matrix.d.toFixed(2)} \\end{bmatrix}`} />
                    <p className="text-xs mt-1 font-mono text-muted-foreground">det(M) = {determinant.toFixed(3)}</p>
                </CardContent>
            </Card>
        </div>
    </div>
  );
}
