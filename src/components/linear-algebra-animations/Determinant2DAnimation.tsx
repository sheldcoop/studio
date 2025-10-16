
'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import * as THREE from 'three';
import { makeObjectsDraggable } from '@/components/three/interactivity';
import { drawShading, Vector } from '@/components/three/primitives';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, TrendingUp, TrendingDown } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { easeInOutCubic } from '../three/animation';
import { BlockMath } from 'react-katex';
import { createLabel } from '../three/ui-helpers';

type Matrix2D = { a: number, b: number, c: number, d: number };

const initialMatrix: Matrix2D = { a: 2, b: 1, c: 1, d: 2 };

const getExplanation = (det: number) => {
  const absDet = Math.abs(det);
  let colorClass = 'text-primary';
  let icon, title, text;

  if (Math.abs(det) < 0.01) {
    colorClass = 'text-red-400';
    icon = <AlertCircle className="h-5 w-5"/>;
    title = "Collapsed Transformation";
    text = "The matrix collapses 2D space into a line or a point. The two column vectors are parallel (linearly dependent). This transformation is NOT invertible.";
  } else if (Math.abs(absDet - 1) < 0.05) {
    colorClass = 'text-cyan-400';
    icon = <AlertCircle className="h-5 w-5"/>;
    title = "Rigid Transformation";
    text = `This is a rigid transformation (like a rotation or shear). Areas are preserved! The unit square's area remains the same.`;
  } else if (det < 0) {
    colorClass = 'text-purple-400';
    icon = <AlertCircle className="h-5 w-5"/>;
    title = "Reflective Transformation";
    text = `Space is FLIPPED! The orientation is reversed (like looking in a mirror). Areas are scaled by ${absDet.toFixed(2)}x.`;
  } else if (absDet > 1) {
    colorClass = 'text-green-400';
    icon = <TrendingUp className="h-5 w-5"/>;
    title = "Expansive Transformation";
    text = `Space is STRETCHED. Every area gets multiplied by ${absDet.toFixed(2)}. The unit square becomes ${absDet.toFixed(2)}x larger.`;
  } else {
    colorClass = 'text-yellow-400';
    icon = <TrendingDown className="h-5 w-5"/>;
    title = "Compressive Transformation";
    text = `Space is COMPRESSED. Every area gets multiplied by ${absDet.toFixed(2)}. The unit square shrinks to ${absDet.toFixed(2)}x its original size.`;
  }
  
  return { icon, title, text, color: colorClass };
};

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
                <div className="text-5xl font-thin text-muted-foreground">[</div>
                <div className="grid grid-cols-2 gap-x-2 gap-y-1 w-32 text-center">
                    <Input className="h-9 text-center border-orange-400/50" type="text" value={matrix.a.toFixed(2)} onChange={e => handleChange('a', e.target.value)} />
                    <Input className="h-9 text-center border-green-300/50" type="text" value={matrix.b.toFixed(2)} onChange={e => handleChange('b', e.target.value)} />
                    <Input className="h-9 text-center border-orange-400/50" type="text" value={matrix.c.toFixed(2)} onChange={e => handleChange('c', e.target.value)} />
                    <Input className="h-9 text-center border-green-300/50" type="text" value={matrix.d.toFixed(2)} onChange={e => handleChange('d', e.target.value)} />
                </div>
                 <div className="text-5xl font-thin text-muted-foreground">]</div>
            </div>
        </div>
    );
};

export function Determinant2DAnimation() {
    const mountRef = useRef<HTMLDivElement>(null);
    
    const [b1Pos, setB1Pos] = useState(new THREE.Vector3(initialMatrix.a, initialMatrix.c, 0));
    const [b2Pos, setB2Pos] = useState(new THREE.Vector3(initialMatrix.b, initialMatrix.d, 0));
    const [determinant, setDeterminant] = useState(0);
    const [matrix, setMatrix] = useState(initialMatrix);

    const sceneRef = useRef<THREE.Scene | null>(null);
    const cameraRef = useRef<THREE.OrthographicCamera | null>(null);
    const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
    const animationFrameIdRef = useRef<number>();
    
    const b1Ref = useRef<Vector | null>(null);
    const b2Ref = useRef<Vector | null>(null);
    const iHatRef = useRef<Vector | null>(null);
    const jHatRef = useRef<Vector | null>(null);
    const parallelogramRef = useRef<THREE.Mesh | null>(null);
    const unitSquareRef = useRef<THREE.Mesh | null>(null);
    
    const animateTo = useCallback((targetB1: THREE.Vector3, targetB2: THREE.Vector3) => {
        const startB1 = b1Pos.clone();
        const startB2 = b2Pos.clone();
        const duration = 500;
        let startTime: number | null = null;
    
        const animate = (time: number) => {
            if (startTime === null) startTime = time;
            const progress = Math.min((time - startTime) / duration, 1);
            const easedProgress = easeInOutCubic(progress);
    
            const newB1 = new THREE.Vector3().lerpVectors(startB1, targetB1, easedProgress);
            const newB2 = new THREE.Vector3().lerpVectors(startB2, targetB2, easedProgress);
            
            setB1Pos(newB1);
            setB2Pos(newB2);
    
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        requestAnimationFrame(animate);
    }, [b1Pos, b2Pos]);

    const applyMatrix = () => {
        animateTo(
            new THREE.Vector3(matrix.a, matrix.c, 0),
            new THREE.Vector3(matrix.b, matrix.d, 0)
        );
    };

    const handlePreset = useCallback((preset: 'identity' | 'shear' | 'rotate' | 'scale' | 'collapse' | 'reflect') => {
        let newMatrix: Matrix2D;
        switch(preset) {
            case 'shear':
                newMatrix = { a: 1, b: 1, c: 0, d: 1 };
                break;
            case 'rotate':
                newMatrix = { a: 0, b: -1, c: 1, d: 0 };
                break;
            case 'scale':
                newMatrix = { a: 2, b: 0, c: 0, d: 2 };
                break;
             case 'collapse':
                newMatrix = { a: 1, b: 1, c: 1, d: 1 };
                break;
            case 'reflect':
                newMatrix = { a: -1, b: 0, c: 0, d: 1 };
                break;
            case 'identity':
            default:
                newMatrix = { a: 1, b: 0, c: 0, d: 1 };
                break;
        }
        setMatrix(newMatrix);
        animateTo(
            new THREE.Vector3(newMatrix.a, newMatrix.c, 0),
            new THREE.Vector3(newMatrix.b, newMatrix.d, 0)
        );
    }, [animateTo]);

    // Scene setup
    useEffect(() => {
        if (!mountRef.current) return;

        const currentMount = mountRef.current;
        const cleanupFunctions: (() => void)[] = [];

        const scene = new THREE.Scene();
        sceneRef.current = scene;

        const aspect = currentMount.clientWidth / currentMount.clientHeight;
        const frustumSize = 5;
        const camera = new THREE.OrthographicCamera(frustumSize * aspect / -2, frustumSize * aspect / 2, frustumSize / 2, frustumSize / -2, 0.1, 100);
        camera.position.set(2, 2, 10);
        camera.lookAt(2, 2, 0);
        cameraRef.current = camera;
        
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        rendererRef.current = renderer;
        currentMount.appendChild(renderer.domElement);
        cleanupFunctions.push(() => {
            if (renderer.domElement.parentElement === currentMount) { currentMount.removeChild(renderer.domElement); }
            renderer.dispose();
        });
        
        const gridSize = 20;
        const gridDivisions = 10;
        const grid = new THREE.GridHelper(gridSize, gridDivisions, 0x666666, 0x333333);
        grid.rotation.x = Math.PI / 2;
        grid.position.set(0, 0, -0.2); 
        scene.add(grid);

        const axesMaterial = new THREE.LineBasicMaterial({ color: 0x888888 });
        const xAxisGeom = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(-10, 0, 0), new THREE.Vector3(10, 0, 0)]);
        const yAxisGeom = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, -10, 0), new THREE.Vector3(0, 10, 0)]);
        scene.add(new THREE.Line(xAxisGeom, axesMaterial));
        scene.add(new THREE.Line(yAxisGeom, axesMaterial));
        
        const addGridLabel = (text: string, position: THREE.Vector3, color: number) => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d')!;
            canvas.width = 100;
            canvas.height = 60;
            ctx.font = 'bold 48px Arial';
            ctx.fillStyle = new THREE.Color(color).getStyle();
            ctx.fillText(text, 10, 45);
            
            const texture = new THREE.CanvasTexture(canvas);
            const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: texture }));
            sprite.scale.set(0.5, 0.3, 1);
            sprite.position.copy(position);
            scene.add(sprite);
        };
        
        for (let i = -10; i <= 10; i += 2) {
            if (i !== 0) {
                addGridLabel(i.toString(), new THREE.Vector3(i, -0.5, 0), 0x888888);
                addGridLabel(i.toString(), new THREE.Vector3(-0.5, i, 0), 0x888888);
            }
        }
        
        unitSquareRef.current = drawShading(scene, {
            points: [new THREE.Vector2(0,0), new THREE.Vector2(1,0), new THREE.Vector2(1,1), new THREE.Vector2(0,1)],
            color: 0xffd700
        });
        if(unitSquareRef.current) {
            unitSquareRef.current.position.z = -0.1;
            (unitSquareRef.current.material as THREE.MeshBasicMaterial).opacity = 0.6;
        }

        const outlineMaterial = new THREE.LineBasicMaterial({ color: 0xffaa00, linewidth: 2 });
        const outlinePoints = [ new THREE.Vector3(0, 0, 0), new THREE.Vector3(1, 0, 0), new THREE.Vector3(1, 1, 0), new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, 0, 0), ];
        const outlineGeom = new THREE.BufferGeometry().setFromPoints(outlinePoints);
        const outline = new THREE.Line(outlineGeom, outlineMaterial);
        scene.add(outline);
        
        iHatRef.current = new Vector(new THREE.Vector3(1, 0, 0), 1, 0xff3333, 0.2, 0.1, 'î'); 
        jHatRef.current = new Vector(new THREE.Vector3(0, 1, 0), 1, 0x33ff33, 0.2, 0.1, 'ĵ');
        scene.add(iHatRef.current, jHatRef.current);
        
        b1Ref.current = new Vector(b1Pos.clone().normalize(), b1Pos.length(), 0xff8a65, 0.3, 0.2, 'b₁');
        b2Ref.current = new Vector(b2Pos.clone().normalize(), b2Pos.length(), 0x69f0ae, 0.3, 0.2, 'b₂');
        scene.add(b1Ref.current, b2Ref.current);
        
        parallelogramRef.current = new THREE.Mesh();
        scene.add(parallelogramRef.current);
        
        const cleanupB1 = makeObjectsDraggable(b1Ref.current, camera, renderer.domElement, { onDrag: (obj, pos) => { setB1Pos(pos.clone().setZ(0)) } });
        const cleanupB2 = makeObjectsDraggable(b2Ref.current, camera, renderer.domElement, { onDrag: (obj, pos) => { setB2Pos(pos.clone().setZ(0)) } });
        cleanupFunctions.push(cleanupB1, cleanupB2);

        // Add informational text overlays
        const infoGroup = new THREE.Group();
        infoGroup.add(createLabel('Transformed Area', 0xffffff, 0.5));
        infoGroup.children[0].position.set(2, 3.5, 0);
        infoGroup.add(createLabel('Transformed Basis Vector b₁', 0xff8a65, 0.3));
        infoGroup.children[1].position.set(3, 1.5, 0);
        infoGroup.add(createLabel('Transformed Basis Vector b₂', 0x69f0ae, 0.3));
        infoGroup.children[2].position.set(-1, 2.5, 0);
        scene.add(infoGroup);
        
        const animate = () => {
            animationFrameIdRef.current = requestAnimationFrame(animate);
            if (renderer && scene && camera) renderer.render(scene, camera);
        };
        animate();

        const handleResize = () => {
            if (currentMount && cameraRef.current && rendererRef.current) {
                const aspect = currentMount.clientWidth / currentMount.clientHeight;
                cameraRef.current.left = frustumSize * aspect / -2;
                cameraRef.current.right = frustumSize * aspect / 2;
                cameraRef.current.top = frustumSize / 2;
                cameraRef.current.bottom = frustumSize / -2;
                cameraRef.current.updateProjectionMatrix();
                rendererRef.current.setSize(currentMount.clientWidth, currentMount.clientHeight);
            }
        };
        window.addEventListener('resize', handleResize);
        cleanupFunctions.push(() => window.removeEventListener('resize', handleResize));
        
        return () => {
            if (animationFrameIdRef.current) cancelAnimationFrame(animationFrameIdRef.current);
            cleanupFunctions.forEach(fn => fn());
            if (mountRef.current) {
                while (mountRef.current.firstChild) {
                    mountRef.current.removeChild(mountRef.current.firstChild);
                }
            }
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Update visualization
    useEffect(() => {
        const det = b1Pos.x * b2Pos.y - b1Pos.y * b2Pos.x;
        setDeterminant(det);
        setMatrix({ a: b1Pos.x, b: b2Pos.x, c: b1Pos.y, d: b2Pos.y });

        const updateArrow = (arrow: Vector | null, vector: THREE.Vector3, color: THREE.ColorRepresentation, label?: string) => {
            if (arrow) {
                const length = vector.length();
                arrow.setDirectionAndLength(length > 0.001 ? vector.clone().normalize() : new THREE.Vector3(1,0,0), length);
                if (label) arrow.setLabel(label, color);

                if (length > 0.1) {
                    // This logic is now removed from here.
                } else if (arrow.coordLabelSprite) {
                    arrow.remove(arrow.coordLabelSprite);
                    arrow.coordLabelSprite = null;
                }
                
                arrow.updateLabelPosition();
            }
        }
        
        updateArrow(iHatRef.current, new THREE.Vector3(1,0,0), 0xff3333, 'î');
        updateArrow(jHatRef.current, new THREE.Vector3(0,1,0), 0x33ff33, 'ĵ');
        updateArrow(b1Ref.current, b1Pos, 0xff8a65, 'b₁');
        updateArrow(b2Ref.current, b2Pos, 0x69f0ae, 'b₂');

        if (parallelogramRef.current && sceneRef.current) {
            sceneRef.current.remove(parallelogramRef.current);
            if(parallelogramRef.current.geometry) parallelogramRef.current.geometry.dispose();
            if((parallelogramRef.current.material as THREE.Material)) (parallelogramRef.current.material as THREE.Material).dispose();

            const points = [
                new THREE.Vector2(0, 0),
                new THREE.Vector2(b1Pos.x, b1Pos.y),
                new THREE.Vector2(b1Pos.x + b2Pos.x, b1Pos.y + b2Pos.y),
                new THREE.Vector2(b2Pos.x, b2Pos.y),
            ];
            
            let newColor;
            if (det < 0) newColor = 0xba68c8; 
            else if (Math.abs(det) < 0.1) newColor = 0xe57373;
            else if (Math.abs(det) < 0.95) newColor = 0xffd54f;
            else if (Math.abs(det) < 1.05) newColor = 0x4dd0e1; 
            else newColor = 0x81c784; 

            parallelogramRef.current = drawShading(sceneRef.current, { points, color: newColor });
        }
        
    }, [b1Pos, b2Pos]);

    const status = getExplanation(determinant);
    
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div ref={mountRef} className="lg:col-span-2 relative aspect-square w-full min-h-[300px] overflow-hidden rounded-lg border bg-muted/20 cursor-grab active:cursor-grabbing"></div>
            
            <Card className="lg:col-span-1 w-full">
                <CardHeader>
                    <CardTitle className="font-headline">The Interactive Determinant</CardTitle>
                    <CardDescription>Drag the colored vectors or enter a matrix to see how the determinant reflects the change in area.</CardDescription>
                </CardHeader>
                <CardContent className="p-4 space-y-4">
                    <MatrixInput matrix={matrix} setMatrix={setMatrix} label="Transformation Matrix (M)" />
                    <div className="space-y-2">
                        <Label className="font-semibold text-center block mb-2">"What If?" Presets</Label>
                        <div className="grid grid-cols-1 gap-2">
                            <Button variant="outline" size="sm" onClick={() => handlePreset('identity')}>Identity</Button>
                            <Button variant="outline" size="sm" onClick={() => handlePreset('rotate')}>Rotate</Button>
                            <Button variant="outline" size="sm" onClick={() => handlePreset('scale')}>Scale</Button>
                            <Button variant="outline" size="sm" onClick={() => handlePreset('shear')}>Shear</Button>
                            <Button variant="outline" size="sm" onClick={() => handlePreset('reflect')}>Reflect</Button>
                            <Button variant="outline" size="sm" onClick={() => handlePreset('collapse')}>Collapse</Button>
                        </div>
                    </div>
                     <div className="flex justify-center mt-4">
                        <Button onClick={applyMatrix}>Apply Matrix</Button>
                    </div>
                </CardContent>
                <CardFooter className="flex flex-col gap-4 p-4">
                    <div className="w-full space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                            <div className="p-2 bg-muted rounded-lg">
                                <p className="text-xs font-semibold text-muted-foreground">ORIGINAL AREA</p>
                                <p className="font-mono text-xl font-bold tracking-tight text-amber-400">1.00</p>
                            </div>
                            <div className="p-2 bg-muted rounded-lg">
                                <p className="text-xs font-semibold text-muted-foreground">TRANSFORMED AREA</p>
                                <p className={cn("font-mono text-xl font-bold tracking-tight", status.color)}>{Math.abs(determinant).toFixed(2)}</p>
                            </div>
                            <div className="p-2 bg-muted rounded-lg">
                                <p className="text-xs font-semibold text-muted-foreground">SCALING FACTOR</p>
                                <p className={cn("font-mono text-xl font-bold tracking-tight", status.color)}>{Math.abs(determinant).toFixed(2)}x</p>
                            </div>
                        </div>
                         <div className="text-center p-3 bg-muted/30 rounded-lg">
                            <p className="text-xs text-muted-foreground mb-1">Determinant Formula:</p>
                            <div className="font-mono text-sm">
                                <BlockMath math={`\\text{det}(M) = (a \\times d) - (b \\times c)`} />
                            </div>
                            <div className="font-mono text-sm mt-1">
                                <BlockMath math={`= (${matrix.a.toFixed(2)} \\times ${matrix.d.toFixed(2)}) - (${matrix.b.toFixed(2)} \\times ${matrix.c.toFixed(2)})`} />
                            </div>
                            <p className={cn("font-mono text-lg font-bold mt-1", status.color)}>
                                = {determinant.toFixed(2)}
                            </p>
                        </div>
                    </div>
                     <Card className={cn("border-2 w-full", status.color === "text-green-400" ? "border-green-500/50" : status.color === "text-red-400" ? "border-red-500/50" : "border-primary/20" )}>
                        <CardHeader className="p-4 flex flex-row items-center gap-3">
                            <div className={cn("flex-shrink-0", status.color)}>{status.icon}</div>
                            <CardTitle className="text-lg">{status.title}</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 pt-0 text-sm text-muted-foreground">
                            {status.text}
                        </CardContent>
                    </Card>
                </CardFooter>
            </Card>
        </div>
    );
}

