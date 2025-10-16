
'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import * as THREE from 'three';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '../ui/button';
import { easeInOutCubic } from '../three/animation';
import { BlockMath } from 'react-katex';
import { drawAxes } from '../three/coordinate-system';

type Matrix2D = { a: number; b: number; c: number; d: number };

const initialMatrix: Matrix2D = { a: 1, b: 1, c: 1, d: 0 };

function MatrixInput({ matrix, setMatrix, label, onApply, isAnimating }: { matrix: Matrix2D, setMatrix: (m: Matrix2D) => void, label: string, onApply: () => void, isAnimating: boolean }) {
    const handleChange = (key: keyof Matrix2D, value: string) => {
        const numValue = parseFloat(value);
        if (!isNaN(numValue)) {
            setMatrix({ ...matrix, [key]: numValue });
        }
    };

    return (
        <div className="space-y-4">
            <div className="space-y-2 text-center">
                <Label className="font-semibold">{label}</Label>
                <div className="flex justify-center items-center gap-2">
                    <div className="text-5xl font-thin">[</div>
                    <div className="grid grid-cols-2 gap-x-2 gap-y-1 w-32 text-center">
                        <Input className="h-9 text-center" type="text" value={matrix.a.toFixed(2)} onChange={e => handleChange('a', e.target.value)} />
                        <Input className="h-9 text-center" type="text" value={matrix.b.toFixed(2)} onChange={e => handleChange('b', e.target.value)} />
                        <Input className="h-9 text-center" type="text" value={matrix.c.toFixed(2)} onChange={e => handleChange('c', e.target.value)} />
                        <Input className="h-9 text-center" type="text" value={matrix.d.toFixed(2)} onChange={e => handleChange('d', e.target.value)} />
                    </div>
                    <div className="text-5xl font-thin">]</div>
                </div>
            </div>
            <Button onClick={onApply} disabled={isAnimating} className="w-full">
                {isAnimating ? 'Animating...' : 'Apply Transformation'}
            </Button>
        </div>
    );
}

export function EigenvectorAnimation() {
    const mountRef = useRef<HTMLDivElement>(null);
    const [matrix, setMatrix] = useState<Matrix2D>(initialMatrix);
    const [eigenvalues, setEigenvalues] = useState<string[]>([]);
    const [eigenvectors, setEigenvectors] = useState<{ vector: THREE.Vector2; value: number }[]>([]);
    const [isAnimating, setIsAnimating] = useState(false);
    
    const animationStateRef = useRef({
        sampleVectors: [] as THREE.Mesh[],
        eigenvectorMeshes: [] as THREE.ArrowHelper[],
        isAnimating: false,
        startTime: 0,
        duration: 2000,
    });

    const calculateAndSetEigenData = useCallback(() => {
        const { a, b, c, d } = matrix;
        const trace = a + d;
        const det = a * d - b * c;
        const discriminant = trace * trace - 4 * det;
        
        const newEigenvectors = [];
        if (discriminant >= 0) {
            const lambda1 = (trace + Math.sqrt(discriminant)) / 2;
            const lambda2 = (trace - Math.sqrt(discriminant)) / 2;
            setEigenvalues([lambda1.toFixed(3), lambda2.toFixed(3)]);

            if (c !== 0) {
                newEigenvectors.push({ vector: new THREE.Vector2(lambda1 - d, c).normalize(), value: lambda1 });
                newEigenvectors.push({ vector: new THREE.Vector2(lambda2 - d, c).normalize(), value: lambda2 });
            } else if (b !== 0) {
                newEigenvectors.push({ vector: new THREE.Vector2(b, lambda1 - a).normalize(), value: lambda1 });
                newEigenvectors.push({ vector: new THREE.Vector2(b, lambda2 - a).normalize(), value: lambda2 });
            } else {
                 newEigenvectors.push({ vector: new THREE.Vector2(1, 0).normalize(), value: a });
                 newEigenvectors.push({ vector: new THREE.Vector2(0, 1).normalize(), value: d });
            }
        } else {
            setEigenvalues([]);
        }
        setEigenvectors(newEigenvectors);
    }, [matrix]);

    useEffect(() => {
        calculateAndSetEigenData();
    }, [calculateAndSetEigenData]);

    const handleApply = () => {
        if (animationStateRef.current.isAnimating) return;
        animationStateRef.current.isAnimating = true;
        animationStateRef.current.startTime = performance.now();
        setIsAnimating(true);
        setTimeout(() => {
            animationStateRef.current.isAnimating = false;
            setIsAnimating(false);
        }, animationStateRef.current.duration);
    };

    useEffect(() => {
        if (!mountRef.current) return;

        const currentMount = mountRef.current;
        const scene = new THREE.Scene();
        const aspect = currentMount.clientWidth / currentMount.clientHeight;
        const frustumSize = 10;
        const camera = new THREE.OrthographicCamera(frustumSize * aspect / -2, frustumSize * aspect / 2, frustumSize / 2, frustumSize / -2, 0.1, 100);
        camera.position.z = 10;

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        currentMount.appendChild(renderer.domElement);

        drawAxes(scene, { size: 5, showZ: false });

        const sampleVectorGeometry = new THREE.SphereGeometry(0.08, 16, 16);
        const sampleVectorMaterial = new THREE.MeshBasicMaterial({ color: 0xaaaaaa });
        const numSampleVectors = 36;
        for (let i = 0; i < numSampleVectors; i++) {
            const angle = (i / numSampleVectors) * Math.PI * 2;
            const vector = new THREE.Vector3(Math.cos(angle), Math.sin(angle), 0);
            const mesh = new THREE.Mesh(sampleVectorGeometry, sampleVectorMaterial.clone());
            mesh.position.copy(vector);
            (mesh as any).originalPosition = vector.clone();
            animationStateRef.current.sampleVectors.push(mesh);
            scene.add(mesh);
        }

        const eigenVectorMaterial1 = new THREE.LineBasicMaterial({ color: 0xff3333, linewidth: 2 });
        const eigenVectorMaterial2 = new THREE.LineBasicMaterial({ color: 0x33ff33, linewidth: 2 });

        const animate = (time: number) => {
            animationFrameId = requestAnimationFrame(animate);

            if (animationStateRef.current.isAnimating) {
                const elapsed = time - animationStateRef.current.startTime;
                let t = Math.min(elapsed / animationStateRef.current.duration, 1);
                t = easeInOutCubic(t);

                animationStateRef.current.sampleVectors.forEach(mesh => {
                    const original = (mesh as any).originalPosition;
                    const transformed = new THREE.Vector3(
                        matrix.a * original.x + matrix.b * original.y,
                        matrix.c * original.x + matrix.d * original.y,
                        0
                    );
                    mesh.position.lerpVectors(original, transformed, t);
                });

                animationStateRef.current.eigenvectorMeshes.forEach((arrow, i) => {
                    if (eigenvectors[i]) {
                        const originalVec = new THREE.Vector3(eigenvectors[i].vector.x, eigenvectors[i].vector.y, 0).multiplyScalar(1.5);
                        const scaledVec = originalVec.clone().multiplyScalar(eigenvectors[i].value);
                        const currentVec = new THREE.Vector3().lerpVectors(originalVec, scaledVec, t);
                        arrow.setDirection(currentVec.clone().normalize());
                        arrow.setLength(currentVec.length(), 0.2, 0.1);
                    }
                });

            } else {
                 animationStateRef.current.sampleVectors.forEach(mesh => {
                    mesh.position.copy((mesh as any).originalPosition);
                 });
                 animationStateRef.current.eigenvectorMeshes.forEach((arrow, i) => {
                    if (eigenvectors[i]) {
                        const vec = new THREE.Vector3(eigenvectors[i].vector.x, eigenvectors[i].vector.y, 0).multiplyScalar(1.5);
                        arrow.setDirection(vec.clone().normalize());
                        arrow.setLength(vec.length(), 0.2, 0.1);
                    }
                 });
            }

            // Clean up old eigenvectors
            animationStateRef.current.eigenvectorMeshes.forEach(arrow => scene.remove(arrow));
            animationStateRef.current.eigenvectorMeshes = [];

            // Draw new ones
            eigenvectors.forEach(({ vector }, i) => {
                const material = i === 0 ? eigenVectorMaterial1 : eigenVectorMaterial2;
                const dir = new THREE.Vector3(vector.x, vector.y, 0);
                const arrow = new THREE.ArrowHelper(dir, new THREE.Vector3(0,0,0), 1.5, material.color, 0.2, 0.1);
                (arrow.line.material as THREE.LineBasicMaterial).linewidth = 3;
                scene.add(arrow);
                animationStateRef.current.eigenvectorMeshes.push(arrow);
            });

            renderer.render(scene, camera);
        };
        let animationFrameId = requestAnimationFrame(animate);

        const handleResize = () => {
             const aspect = currentMount.clientWidth / currentMount.clientHeight;
             camera.left = frustumSize * aspect / -2;
             camera.right = frustumSize * aspect / 2;
             camera.top = frustumSize / 2;
             camera.bottom = frustumSize / -2;
             camera.updateProjectionMatrix();
             renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
        }
        window.addEventListener('resize', handleResize);

        return () => {
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener('resize', handleResize);
            if (currentMount.contains(renderer.domElement)) {
                currentMount.removeChild(renderer.domElement);
            }
            renderer.dispose();
        };
    }, [matrix, eigenvectors]);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2 relative aspect-square w-full min-h-[300px] overflow-hidden rounded-lg border bg-muted/20">
                <div ref={mountRef} className="absolute inset-0" />
            </div>
            <Card className="lg:col-span-1 w-full">
                <CardHeader>
                    <CardTitle className="font-headline">Eigen-Machine</CardTitle>
                    <CardDescription>
                        Input a 2x2 matrix to see its transformation and find its real
                        eigenvectors—the special vectors that only stretch or shrink.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <MatrixInput matrix={matrix} setMatrix={setMatrix} label="Transformation Matrix (A)" onApply={handleApply} isAnimating={isAnimating} />
                    <div className="text-center p-3 bg-muted/30 rounded-lg w-full mt-4">
                        <p className="text-xs text-muted-foreground mb-1">
                            Calculated Eigenvalues (λ)
                        </p>
                        {eigenvalues.length > 0 ? (
                            <div className="font-mono text-lg font-bold text-primary">
                                <BlockMath math={`\\lambda_1 = ${eigenvalues[0]}, \\quad \\lambda_2 = ${eigenvalues[1]}`} />
                            </div>
                        ) : (
                            <div className="font-mono text-sm text-muted-foreground">
                                No real eigenvalues found.
                            </div>
                        )}
                    </div>
                    <div className="text-xs text-muted-foreground">The red and green vectors are the eigenvectors. When you apply the transformation, notice how all the grey vectors are rotated, but the eigenvectors stay on their original line, only changing in length according to their eigenvalue.</div>
                </CardContent>
            </Card>
        </div>
    );
}
