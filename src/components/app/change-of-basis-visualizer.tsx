
'use client';

import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';

import { drawGrid, drawAxes } from '@/components/three/coordinate-system';
import { drawArrow } from '@/components/three/primitives';
import { makeObjectsDraggable, mouseToWorld } from '@/components/three/interactivity';
import { easeInOutCubic } from '@/components/three/animation';
import { Skeleton } from '../ui/skeleton';

// --- Helper Functions ---

const getCustomCoords = (point: THREE.Vector2, basis1: THREE.Vector2, basis2: THREE.Vector2) => {
    const det = basis1.x * basis2.y - basis1.y * basis2.x;
    if (Math.abs(det) < 1e-4) return null;
    const invDet = 1 / det;
    const x = (point.x * basis2.y - point.y * basis2.x) * invDet;
    const y = (point.y * basis1.x - point.x * basis1.y) * invDet;
    return new THREE.Vector2(x, y);
};

const VectorDisplay = ({ label, coords, labelClassName }: { label: React.ReactNode, coords: string, labelClassName?: string }) => (
    <div>
        <p className={cn("text-xs font-medium", labelClassName)}>{label}</p>
        <p className="font-mono text-lg font-bold">{coords}</p>
    </div>
);


const ChangeOfBasisVisualizer = () => {
    const canvasRef = useRef<HTMLDivElement>(null);
    const [isMounted, setIsMounted] = useState(false);
    const [customCoords, setCustomCoords] = useState("(?, ?)");

    useEffect(() => {
        setIsMounted(true);
        if (!canvasRef.current) return;
        
        let animationFrameId: number;

        const scene = new THREE.Scene();
        const camera = new THREE.OrthographicCamera(-8, 8, 8, -8, 1, 1000);
        camera.position.z = 10;
        
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(canvasRef.current.clientWidth, canvasRef.current.clientHeight);
        canvasRef.current.appendChild(renderer.domElement);
        
        const standardGrid = drawGrid(scene, { gridColor: 0x556581, size: 8 });

        const b1Vec = new THREE.Vector3(1.5, 0.5, 0);
        const b2Vec = new THREE.Vector3(-0.5, 1, 0);
        const pStandardVec = new THREE.Vector3(2, 1, 0);

        const b1Arrow = drawArrow(scene, { origin: new THREE.Vector3(), destination: b1Vec, color: 0xf87171, label: 'b₁' });
        const b2Arrow = drawArrow(scene, { origin: new THREE.Vector3(), destination: b2Vec, color: 0x60a5fa, label: 'b₂' });
        const iHat = drawArrow(scene, { origin: new THREE.Vector3(), destination: new THREE.Vector3(1, 0, 0), color: 0x9ca3af, label: 'î' });
        const jHat = drawArrow(scene, { origin: new THREE.Vector3(), destination: new THREE.Vector3(0, 1, 0), color: 0x9ca3af, label: 'ĵ' });
        const v_standard = drawArrow(scene, { origin: new THREE.Vector3(), destination: pStandardVec, color: 0xffd93d, label: 'v' });
        
        const updateCoordinates = () => {
            const coords = getCustomCoords(new THREE.Vector2(pStandardVec.x, pStandardVec.y), new THREE.Vector2(b1Vec.x, b1Vec.y), new THREE.Vector2(b2Vec.x, b2Vec.y));
            if (coords) {
                setCustomCoords(`(${coords.x.toFixed(2)}, ${coords.y.toFixed(2)})`);
            } else {
                setCustomCoords('(Invalid Basis)');
            }
        };

        const onDrag = (object: THREE.Object3D, position: THREE.Vector3) => {
            let targetVec: THREE.Vector3;
            if (object === b1Arrow) {
                targetVec = b1Vec;
            } else if (object === b2Arrow) {
                targetVec = b2Vec;
            } else {
                return;
            }

            targetVec.set(position.x, position.y, 0);
            (object.children[0] as THREE.ArrowHelper).setDirection(targetVec.clone().normalize());
            (object.children[0] as THREE.ArrowHelper).setLength(targetVec.length(), 0.2, 0.1);
            if (object.children[1]) { // Update label position
                object.children[1].position.copy(targetVec).add(new THREE.Vector3(0, 0.2, 0));
            }
            updateCoordinates();
        };

        const cleanupDraggable = makeObjectsDraggable([b1Arrow, b2Arrow], camera, renderer.domElement, { onDrag });
        updateCoordinates(); // Initial calculation

        const animate = () => {
            animationFrameId = requestAnimationFrame(animate);
            renderer.render(scene, camera);
        };
        animate();

        const handleResize = () => {
            if (canvasRef.current) {
                const width = canvasRef.current.clientWidth;
                const height = canvasRef.current.clientHeight;
                const aspect = width / height;
                camera.left = -8 * (width > height ? 1 : aspect);
                camera.right = 8 * (width > height ? 1 : aspect);
                camera.top = 8 * (width > height ? aspect : 1);
                camera.bottom = -8 * (width > height ? aspect : 1);
                camera.updateProjectionMatrix();
                renderer.setSize(width, height);
            }
        };
        window.addEventListener('resize', handleResize);
        handleResize();

        return () => {
            window.removeEventListener('resize', handleResize);
            cleanupDraggable();
            cancelAnimationFrame(animationFrameId);
            if (canvasRef.current) {
                canvasRef.current.removeChild(renderer.domElement);
            }
            // Dispose Three.js objects
        };
    }, []);

    return (
        <div className="space-y-8">
            <Card>
                 <CardHeader>
                    <CardTitle className="font-headline">Interactive Demo: Change of Basis</CardTitle>
                    <CardDescription>Drag the basis vectors <b className="text-red-400 font-mono">b₁</b> and <b className="text-blue-400 font-mono">b₂</b> to see how the coordinates of vector <b className="text-yellow-400 font-mono">v</b> change in the new basis.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col lg:flex-row gap-6">
                        <div className="flex-1 min-w-0" style={{minHeight: '500px'}}>
                            {isMounted ? (
                                <div ref={canvasRef} className="w-full h-full rounded-lg border bg-gray-900/50" />
                            ) : (
                                <Skeleton className="w-full h-[500px]" />
                            )}
                        </div>
                        <div className="lg:w-80 space-y-4">
                             <div className="bg-muted p-4 rounded-lg text-center space-y-2">
                                <h3 className="text-lg font-semibold text-foreground">The Same Vector, Two Languages</h3>
                                <div className="flex justify-around items-start pt-2">
                                    <VectorDisplay
                                        label={<>Standard Basis (<span className="text-gray-400 font-mono">î, ĵ</span>)</>}
                                        coords={"(2.00, 1.00)"}
                                        labelClassName="text-muted-foreground"
                                    />
                                    <VectorDisplay
                                        label={<>Your Basis (<span className="text-red-400 font-mono">b₁</span>, <span className="text-blue-400 font-mono">b₂</span>)</>}
                                        coords={customCoords}
                                        labelClassName="text-primary"
                                    />
                                </div>
                            </div>
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-base">What's Happening?</CardTitle>
                                </CardHeader>
                                <CardContent className="text-sm text-muted-foreground">
                                    <p>The yellow vector <b className="text-yellow-400 font-mono">v</b> isn't moving. Its representation in standard coordinates is fixed. However, when you change the basis vectors <b className="text-red-400 font-mono">b₁</b> and <b className="text-blue-400 font-mono">b₂</b>, you're changing the "language" used to describe <b className="text-yellow-400 font-mono">v</b>. The new coordinates tell you how many steps to take along <b className="text-red-400 font-mono">b₁</b> and <b className="text-blue-400 font-mono">b₂</b> to get to the tip of <b className="text-yellow-400 font-mono">v</b>.</p>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default ChangeOfBasisVisualizer;
