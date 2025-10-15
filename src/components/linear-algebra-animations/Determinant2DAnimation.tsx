
'use client';

import { useState, useRef, useEffect } from 'react';
import * as THREE from 'three';
import { makeObjectsDraggable } from '@/components/three/interactivity';
import { createLabel } from '@/components/three/ui-helpers';
import { drawShading } from '@/components/three/primitives';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, Maximize, Minimize, RotateCcw, VolumeX, TrendingUp, TrendingDown, ChevronsRight, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { easeInOutCubic } from '../three/animation';
import { BlockMath } from 'react-katex';

// A simple extension to make updating arrows easier
class VectorArrow extends THREE.ArrowHelper {
    public labelSprite: THREE.Sprite | null = null;
    
    setLabel(text: string, color: THREE.ColorRepresentation) {
        if (this.labelSprite) this.remove(this.labelSprite);
        this.labelSprite = createLabel(text, color, 0.5);
        this.add(this.labelSprite);
        this.updateLabelPosition();
    }

    updateLabelPosition() {
        if (!this.labelSprite) return;
        const dir = new THREE.Vector3();
        this.line.getWorldDirection(dir);
        const offset = dir.clone().multiplyScalar(this.line.scale.y + 0.5);
        this.labelSprite.position.copy(this.line.position).add(offset);
    }

    setDirectionAndLength(dir: THREE.Vector3, length: number) {
        if (length < 1e-6) {
            this.setLength(0, 0, 0);
            if(this.labelSprite) this.labelSprite.visible = false;
            return;
        }
        if(this.labelSprite) this.labelSprite.visible = true;
        super.setDirection(dir);
        super.setLength(length, 0.3, 0.2);
        this.updateLabelPosition();
    }
}

const initialMatrix = { a: 2, b: 1, c: 1, d: 2 };

const getExplanation = (det: number) => {
  const absDet = Math.abs(det);
  
  if (Math.abs(det) < 0.01) {
    return {
        icon: <VolumeX className="h-5 w-5"/>,
        title: "Collapsed Transformation",
        text: "The matrix collapses 2D space into a line or a point. The two column vectors are parallel (linearly dependent). This transformation is NOT invertible."
    };
  }
  
  if (Math.abs(absDet - 1) < 0.05) {
    return {
        icon: <RotateCcw className="h-5 w-5"/>,
        title: "Rigid Transformation",
        text: `This is a rigid transformation (like a rotation or shear). Areas are preserved! The unit square's area remains the same.`
    };
  }
  
  if (det < 0) {
    return {
        icon: <AlertCircle className="h-5 w-5"/>,
        title: "Reflective Transformation",
        text: `Space is FLIPPED! The orientation is reversed (like looking in a mirror). Areas are scaled by ${absDet.toFixed(2)}x.`
    };
  }
  
  if (absDet > 1) {
    return {
        icon: <TrendingUp className="h-5 w-5"/>,
        title: "Expansive Transformation",
        text: `Space is STRETCHED. Every area gets multiplied by ${absDet.toFixed(2)}. The unit square becomes ${absDet.toFixed(2)}x larger.`
    };
  }
  
  return {
    icon: <TrendingDown className="h-5 w-5"/>,
    title: "Compressive Transformation",
    text: `Space is COMPRESSED. Every area gets multiplied by ${absDet.toFixed(2)}. The unit square shrinks to ${absDet.toFixed(2)}x its original size.`
  };
};


export function Determinant2DAnimation() {
    const mountRef = useRef<HTMLDivElement>(null);
    
    // State for vectors & determinant
    const [b1Pos, setB1Pos] = useState(new THREE.Vector3(initialMatrix.a, initialMatrix.c, 0));
    const [b2Pos, setB2Pos] = useState(new THREE.Vector3(initialMatrix.b, initialMatrix.d, 0));
    const [determinant, setDeterminant] = useState(0);
    const [matrixInput, setMatrixInput] = useState(initialMatrix);
    const [storyStage, setStoryStage] = useState(0);

    // Refs for three.js objects
    const sceneRef = useRef<THREE.Scene | null>(null);
    const cameraRef = useRef<THREE.OrthographicCamera | null>(null);
    const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
    const animationFrameIdRef = useRef<number>();
    
    // Refs for visual objects
    const b1Ref = useRef<VectorArrow | null>(null);
    const b2Ref = useRef<VectorArrow | null>(null);
    const iHatRef = useRef<VectorArrow | null>(null);
    const jHatRef = useRef<VectorArrow | null>(null);
    const parallelogramRef = useRef<THREE.Mesh | null>(null);
    const unitSquareRef = useRef<THREE.Mesh | null>(null);

    const handleInputChange = (key: keyof typeof initialMatrix, value: string) => {
        const numValue = parseFloat(value);
        if (!isNaN(numValue)) {
            setMatrixInput(prev => ({ ...prev, [key]: numValue }));
        }
    };
    
    const applyMatrix = () => {
        animateTo(
            new THREE.Vector3(matrixInput.a, matrixInput.c, 0),
            new THREE.Vector3(matrixInput.b, matrixInput.d, 0)
        );
    };

    const animateTo = (targetB1: THREE.Vector3, targetB2: THREE.Vector3) => {
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
            setMatrixInput({ a: newB1.x, b: newB2.x, c: newB1.y, d: newB2.y });
    
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        requestAnimationFrame(animate);
    };

    const handlePreset = (preset: 'identity' | 'shear' | 'rotate' | 'scale' | 'collapse' | 'reflect') => {
        let targetB1: THREE.Vector3, targetB2: THREE.Vector3;
        switch(preset) {
            case 'shear':
                targetB1 = new THREE.Vector3(1, 0, 0);
                targetB2 = new THREE.Vector3(1, 1, 0);
                break;
            case 'rotate':
                targetB1 = new THREE.Vector3(0, 1, 0);
                targetB2 = new THREE.Vector3(-1, 0, 0);
                break;
            case 'scale':
                targetB1 = new THREE.Vector3(2, 0, 0);
                targetB2 = new THREE.Vector3(0, 2, 0);
                break;
             case 'collapse':
                targetB1 = new THREE.Vector3(1, 2, 0);
                targetB2 = new THREE.Vector3(2, 4, 0);
                break;
            case 'reflect':
                targetB1 = new THREE.Vector3(-1, 0, 0);
                targetB2 = new THREE.Vector3(0, 1, 0);
                break;
            case 'identity':
            default:
                targetB1 = new THREE.Vector3(1, 0, 0);
                targetB2 = new THREE.Vector3(0, 1, 0);
                break;
        }
        animateTo(targetB1, targetB2);
    }

    // One-time scene setup
    useEffect(() => {
        if (!mountRef.current) return;

        const currentMount = mountRef.current;
        const cleanupFunctions: (() => void)[] = [];

        const scene = new THREE.Scene();
        sceneRef.current = scene;

        const aspect = currentMount.clientWidth / currentMount.clientHeight;
        const frustumSize = 10;
        const camera = new THREE.OrthographicCamera(
            frustumSize * aspect / -2, frustumSize * aspect / 2,
            frustumSize / 2, frustumSize / -2,
            0.1, 100
        );
        camera.position.set(0, 0, 10);
        cameraRef.current = camera;
        
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        rendererRef.current = renderer;
        currentMount.appendChild(renderer.domElement);
        cleanupFunctions.push(() => {
            if (renderer.domElement.parentElement === currentMount) {
                currentMount.removeChild(renderer.domElement);
            }
            renderer.dispose();
        });
        
        const grid = new THREE.GridHelper(50, 50, 0x888888, 0x888888);
        grid.rotation.x = Math.PI / 2;
        scene.add(grid);

        // Unit Square
        unitSquareRef.current = drawShading(scene, {
            points: [new THREE.Vector2(0,0), new THREE.Vector2(1,0), new THREE.Vector2(1,1), new THREE.Vector2(0,1)],
            color: 0xffd700
        });
        if(unitSquareRef.current) unitSquareRef.current.position.z = -0.1;

        // Basis Vectors
        iHatRef.current = new VectorArrow(new THREE.Vector3(1, 0, 0), new THREE.Vector3(0,0,0), 1, 0xff3333, 0.2, 0.1); 
        jHatRef.current = new VectorArrow(new THREE.Vector3(0, 1, 0), new THREE.Vector3(0,0,0), 1, 0x33ff33, 0.2, 0.1);
        iHatRef.current.setLabel('î', 0xff3333);
        jHatRef.current.setLabel('ĵ', 0x33ff33);
        scene.add(iHatRef.current, jHatRef.current);
        
        // Transformed Basis Vectors
        b1Ref.current = new VectorArrow(b1Pos.clone().normalize(), new THREE.Vector3(0,0,0), b1Pos.length(), 0xff8a65, 0.3, 0.2);
        b2Ref.current = new VectorArrow(b2Pos.clone().normalize(), new THREE.Vector3(0,0,0), b2Pos.length(), 0x69f0ae, 0.3, 0.2);
        b1Ref.current.setLabel('b₁', 0xff8a65);
        b2Ref.current.setLabel('b₂', 0x69f0ae);
        scene.add(b1Ref.current, b2Ref.current);
        
        // Transformed Parallelogram
        parallelogramRef.current = new THREE.Mesh();
        scene.add(parallelogramRef.current);
        
        // Draggability
        if (b1Ref.current && b2Ref.current) {
            const cleanupB1 = makeObjectsDraggable(b1Ref.current, camera, renderer.domElement, { 
                onDrag: (obj, pos) => setB1Pos(pos.clone().setZ(0))
            });
            const cleanupB2 = makeObjectsDraggable(b2Ref.current, camera, renderer.domElement, { 
                onDrag: (obj, pos) => setB2Pos(pos.clone().setZ(0))
            });
            cleanupFunctions.push(cleanupB1, cleanupB2);
        }
        
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

    // Effect to update visualization when state changes
    useEffect(() => {
        const det = b1Pos.x * b2Pos.y - b1Pos.y * b2Pos.x;
        setDeterminant(det);
        setMatrixInput({ a: b1Pos.x, b: b2Pos.x, c: b1Pos.y, d: b2Pos.y });

        const updateArrow = (arrow: VectorArrow | null, vector: THREE.Vector3) => {
            if (arrow) arrow.setDirectionAndLength(vector.clone().normalize(), vector.length());
        }

        updateArrow(b1Ref.current, b1Pos);
        updateArrow(b2Ref.current, b2Pos);

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

    const storyContent = [
        {
            title: "Meet the Unit Square",
            description: "The standard grid is made of unit squares, each with an area of 1. Our basis vectors î and ĵ define the sides of this square.",
            buttonText: "Next: Transform the Space",
            visible: true
        },
        {
            title: "Transform the Space",
            description: "The columns of our matrix tell us where the basis vectors land. Vector î lands at b₁, and ĵ lands at b₂.",
            buttonText: "Next: The Determinant Secret",
            visible: true
        },
        {
            title: "The Determinant's Secret",
            description: "The determinant is the scaling factor of area. The area of the new parallelogram is exactly |det(M)| times the original area.",
            buttonText: "Explore Presets",
            visible: true
        },
        {
            title: "Explore Transformations",
            description: "Use the presets or drag the vectors to see how different matrices affect area and orientation.",
            buttonText: "Start Over",
            visible: true
        }
    ];

    const handleNextStage = () => {
        setStoryStage(prev => (prev + 1) % storyContent.length);
    }

    const stage = storyContent[storyStage];
    
    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle className="font-headline">The Determinant Journey</CardTitle>
                <div className="flex items-center gap-4 pt-2">
                    <Progress value={(storyStage + 1) / storyContent.length * 100} className="w-full" />
                    <span className="text-sm text-muted-foreground whitespace-nowrap">{storyStage + 1} / {storyContent.length}</span>
                </div>
            </CardHeader>
            <CardContent className="p-4">
                 <div ref={mountRef} className="relative aspect-[4/3] md:aspect-video w-full overflow-hidden rounded-lg border bg-muted/20 cursor-grab active:cursor-grabbing"></div>
                 
                 <Card className="mt-4">
                     <CardHeader className="p-4">
                         <CardTitle className="text-lg font-semibold flex items-center gap-2">
                             <div className="flex-shrink-0 bg-primary/10 p-2 rounded-full"><ChevronsRight className="h-5 w-5 text-primary"/></div>
                             <span>{stage.title}</span>
                         </CardTitle>
                         <CardDescription className="pt-2">{stage.description}</CardDescription>
                     </CardHeader>
                     <CardFooter className="p-4 pt-0">
                        <Button onClick={handleNextStage} className="w-full">{stage.buttonText}</Button>
                     </CardFooter>
                 </Card>


                 {storyStage >= 1 && (
                    <div className="mt-4 p-4 rounded-lg border bg-muted/50">
                        <MatrixInput matrix={matrixInput} setMatrix={setMatrixInput} label="Transformation Matrix (M)" />
                        <div className="flex justify-center mt-2">
                            <Button onClick={applyMatrix} size="sm">Apply Matrix</Button>
                        </div>
                    </div>
                 )}
                 
                 {storyStage >= 2 && (
                    <div className="mt-4 text-center p-4 bg-muted/50 rounded-lg">
                        <BlockMath math={`\\text{det}(M) = (${b1Pos.x.toFixed(2)} \\times ${b2Pos.y.toFixed(2)}) - (${b2Pos.x.toFixed(2)} \\times ${b1Pos.y.toFixed(2)}) = ${determinant.toFixed(2)}`} />
                    </div>
                 )}

                {storyStage >= 3 && (
                    <>
                        <div className="mt-4 p-4 rounded-lg border bg-muted/50">
                            <Label className="font-semibold text-center block mb-2">"What If?" Presets</Label>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                <Button variant="outline" size="sm" onClick={() => handlePreset('identity')}>Identity</Button>
                                <Button variant="outline" size="sm" onClick={() => handlePreset('rotate')}>Rotate</Button>
                                <Button variant="outline" size="sm" onClick={() => handlePreset('scale')}>Scale</Button>
                                <Button variant="outline" size="sm" onClick={() => handlePreset('shear')}>Shear</Button>
                                <Button variant="outline" size="sm" onClick={() => handlePreset('reflect')}>Reflect</Button>
                                <Button variant="outline" size="sm" onClick={() => handlePreset('collapse')}>Collapse</Button>
                            </div>
                        </div>

                        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
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
                        <Card className={cn("mt-4 border-2", status.color === "text-green-400" ? "border-green-500/50" : status.color === "text-red-400" ? "border-red-500/50" : "border-primary/20" )}>
                            <CardHeader className="p-4 flex flex-row items-center gap-3">
                                <div className={cn("flex-shrink-0", status.color)}>{status.icon}</div>
                                <CardTitle className="text-lg">{status.title}</CardTitle>
                            </CardHeader>
                            <CardContent className="p-4 pt-0 text-sm text-muted-foreground">
                                {status.text}
                            </CardContent>
                        </Card>
                    </>
                )}

            </CardContent>
        </Card>
    );
}

```