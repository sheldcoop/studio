
'use client';

import { useState, useRef, useEffect } from 'react';
import * as THREE from 'three';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { makeObjectsDraggable } from '@/components/three/interactivity';
import { createLabel, drawAngleBetweenVectors } from '../three/ui-helpers';
import { drawTransformedGrid } from '../three/transformation';
import { Button } from '../ui/button';
import { easeInOutCubic } from '../three/animation';
import { Slider } from '../ui/slider';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { CheckCircle } from 'lucide-react';

// A simple extension to make updating arrows easier
class VectorArrow extends THREE.ArrowHelper {
    public labelSprite: THREE.Sprite | null = null;
    public coordLabelSprite: THREE.Sprite | null = null;
    public lengthLabelSprite: THREE.Sprite | null = null;

    constructor(dir: THREE.Vector3, origin: THREE.Vector3, length: number, color: THREE.ColorRepresentation, headLength?: number, headWidth?: number) {
        super(dir, origin, length, color, headLength, headWidth);
    }

    setLabel(text: string, color: THREE.ColorRepresentation, scale: number = 0.4) {
        if (this.labelSprite) this.remove(this.labelSprite);
        this.labelSprite = createLabel(text, color, scale);
        this.add(this.labelSprite);
        this.updateLabelPosition();
    }
    
    setCoordsLabel(coords: THREE.Vector3, color: THREE.ColorRepresentation) {
        if (this.coordLabelSprite) this.remove(this.coordLabelSprite);
        const text = `(${coords.x.toFixed(2)}, ${coords.y.toFixed(2)})`;
        this.coordLabelSprite = createLabel(text, color, 0.35);
        this.add(this.coordLabelSprite);
        this.updateLabelPosition();
    }

    setLengthLabel(length: number | null, color: THREE.ColorRepresentation) {
        if (this.lengthLabelSprite) this.remove(this.lengthLabelSprite);
        if (length === null) return;
        
        const text = `|v| = ${length.toFixed(2)}`;
        this.lengthLabelSprite = createLabel(text, color, 0.35);
        this.add(this.lengthLabelSprite);
        this.updateLabelPosition();
    }

    updateLabelPosition() {
        const dir = new THREE.Vector3();
        this.getDirection(dir);
        const offsetScale = 0.7;

        if (this.labelSprite) {
            const offset = dir.clone().multiplyScalar(this.line.scale.y + offsetScale);
            this.labelSprite.position.copy(this.line.position).add(offset);
        }
        if (this.coordLabelSprite) {
            const offset = dir.clone().multiplyScalar(this.line.scale.y + offsetScale * 0.5).add(new THREE.Vector3(0, -0.3, 0));
            this.coordLabelSprite.position.copy(this.line.position).add(offset);
        }
        if (this.lengthLabelSprite) {
            const offset = dir.clone().multiplyScalar(this.line.scale.y + offsetScale * 0.5).add(new THREE.Vector3(0, 0.3, 0));
            this.lengthLabelSprite.position.copy(this.line.position).add(offset);
        }
    }

    setDirection(dir: THREE.Vector3) {
        super.setDirection(dir);
        this.updateLabelPosition();
    }

    setLength(length: number, headLength?: number, headWidth?: number) {
        super.setLength(length, headLength, headWidth);
        this.updateLabelPosition();
    }
}

const drawLinearCombinationHelpers = (scene: THREE.Scene, b1: THREE.Vector3, b2: THREE.Vector3, x: number, y: number): THREE.Group => {
    const group = new THREE.Group();
    if (Math.abs(x) < 0.01 && Math.abs(y) < 0.01) return group;

    const p1 = b1.clone().multiplyScalar(x);
    const p2 = b2.clone().multiplyScalar(y);

    const material1 = new THREE.LineDashedMaterial({ color: 0xff8a65, dashSize: 0.2, gapSize: 0.1, transparent: true, opacity: 0.7 });
    const geom1 = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0,0,0), p1]);
    const line1 = new THREE.Line(geom1, material1);
    line1.computeLineDistances();
    group.add(line1);

    const material2 = new THREE.LineDashedMaterial({ color: 0x69f0ae, dashSize: 0.2, gapSize: 0.1, transparent: true, opacity: 0.7 });
    const geom2 = new THREE.BufferGeometry().setFromPoints([p1, p1.clone().add(p2)]);
    const line2 = new THREE.Line(geom2, material2);
    line2.computeLineDistances();
    group.add(line2);

    group.position.z = -0.1;
    scene.add(group);
    return group;
}

const initialB1 = new THREE.Vector3(1.5, 0.5, 0);
const initialB2 = new THREE.Vector3(-0.5, 1, 0);

export function InteractiveMatrixTransformation() {
    const mountRef = useRef<HTMLDivElement>(null);
    
    // State for vectors & coordinates
    const [coords, setCoords] = useState({ x: 2.0, y: 1.0 });
    const [b1Pos, setB1Pos] = useState(initialB1.clone());
    const [b2Pos, setB2Pos] = useState(initialB2.clone());
    const [vectorV, setVectorV] = useState(new THREE.Vector3(0, 0, 0));
    const [determinant, setDeterminant] = useState(0);

    // State for new rotation mode
    const [mode, setMode] = useState<'explore' | 'rotation'>('explore');
    const [rotationAngle, setRotationAngle] = useState(0);

    // Refs for three.js objects
    const sceneRef = useRef<THREE.Scene | null>(null);
    const cameraRef = useRef<THREE.OrthographicCamera | null>(null);
    const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
    const animationFrameIdRef = useRef<number>();
    
    // Refs for visual objects
    const vRef = useRef<VectorArrow | null>(null);
    const b1Ref = useRef<VectorArrow | null>(null);
    const b2Ref = useRef<VectorArrow | null>(null);
    const iHatRef = useRef<VectorArrow | null>(null);
    const jHatRef = useRef<VectorArrow | null>(null);
    const transformedGridRef = useRef<THREE.Group | null>(null);
    const combinationHelpersRef = useRef<THREE.Group | null>(null);
    const angleArcRef = useRef<THREE.Group | null>(null);

    // One-time scene setup
    useEffect(() => {
        if (!mountRef.current) return;

        const currentMount = mountRef.current;
        const cleanupFunctions: (() => void)[] = [];

        const scene = new THREE.Scene();
        sceneRef.current = scene;

        const aspect = currentMount.clientWidth / currentMount.clientHeight;
        const frustumSize = 12;
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
            if (renderer.domElement && renderer.domElement.parentElement === currentMount) {
                currentMount.removeChild(renderer.domElement);
            }
            renderer.dispose();
        });
        
        // Grids
        const standardGrid = new THREE.GridHelper(50, 50, 0x444444, 0x444444);
        standardGrid.rotation.x = Math.PI / 2;
        scene.add(standardGrid);

        transformedGridRef.current = new THREE.Group();
        scene.add(transformedGridRef.current);

        // Arrows
        iHatRef.current = new VectorArrow(new THREE.Vector3(1, 0, 0), new THREE.Vector3(0, 0, 0), 1, 0xff3333, 0.2, 0.1); 
        jHatRef.current = new VectorArrow(new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, 0, 0), 1, 0x33ff33, 0.2, 0.1);
        iHatRef.current.setLabel('î', 0xff3333, 0.5);
        jHatRef.current.setLabel('ĵ', 0x33ff33, 0.5);
        scene.add(iHatRef.current, jHatRef.current);
        
        b1Ref.current = new VectorArrow(b1Pos.clone().normalize(), new THREE.Vector3(0,0,0), b1Pos.length(), 0xff8a65, 0.3, 0.2);
        b2Ref.current = new VectorArrow(b2Pos.clone().normalize(), new THREE.Vector3(0,0,0), b2Pos.length(), 0x69f0ae, 0.3, 0.2);
        scene.add(b1Ref.current, b2Ref.current);

        const initialV = b1Pos.clone().multiplyScalar(coords.x).add(b2Pos.clone().multiplyScalar(coords.y));
        vRef.current = new VectorArrow(initialV.clone().normalize(), new THREE.Vector3(0,0,0), initialV.length(), 0xffffff, 0.3, 0.2);
        scene.add(vRef.current);
        
        combinationHelpersRef.current = new THREE.Group();
        scene.add(combinationHelpersRef.current);

        angleArcRef.current = new THREE.Group();
        scene.add(angleArcRef.current);

        const cleanupB1 = makeObjectsDraggable(b1Ref.current, camera, renderer.domElement, { 
            onDrag: (obj, pos) => { if(mode === 'explore') setB1Pos(pos.clone().setZ(0)) }
        });
        const cleanupB2 = makeObjectsDraggable(b2Ref.current, camera, renderer.domElement, { 
            onDrag: (obj, pos) => { if(mode === 'explore') setB2Pos(pos.clone().setZ(0)) }
        });
        cleanupFunctions.push(cleanupB1, cleanupB2);
        
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

    // Effect to handle rotation mode
    useEffect(() => {
        if (mode === 'rotation') {
            const angleRad = THREE.MathUtils.degToRad(rotationAngle);
            const cos = Math.cos(angleRad);
            const sin = Math.sin(angleRad);
            
            // Start with a perpendicular basis for clarity
            const baseB1 = new THREE.Vector3(2, 0, 0);
            const baseB2 = new THREE.Vector3(0, 2, 0);

            const newB1 = new THREE.Vector3(
                baseB1.x * cos - baseB1.y * sin,
                baseB1.x * sin + baseB1.y * cos,
                0
            );
            const newB2 = new THREE.Vector3(
                baseB2.x * cos - baseB2.y * sin,
                baseB2.x * sin + baseB2.y * cos,
                0
            );
            setB1Pos(newB1);
            setB2Pos(newB2);
        }
    }, [mode, rotationAngle]);


    // Effect to update visualization when any state changes
    useEffect(() => {
        const b1 = b1Pos;
        const b2 = b2Pos;

        const v = b1.clone().multiplyScalar(coords.x).add(b2.clone().multiplyScalar(coords.y));
        setVectorV(v);
        
        const det = b1.x * b2.y - b1.y * b2.x;
        setDeterminant(det);

        const updateArrow = (arrow: VectorArrow | null, vector: THREE.Vector3, color: THREE.ColorRepresentation, label?: string, showCoords = true, showLength: boolean = false) => {
            if (arrow) {
                const length = vector.length();
                if (length > 0.001) {
                    arrow.setLength(length, 0.3, 0.2);
                    arrow.setDirection(vector.clone().normalize());
                } else {
                    arrow.setLength(0, 0, 0);
                }
                 if (label) arrow.setLabel(label, color);
                 if (showCoords) arrow.setCoordsLabel(vector, color);
                 arrow.setLengthLabel(showLength ? length : null, color);
                 arrow.updateLabelPosition();
            }
        }

        updateArrow(b1Ref.current, b1, 0xff8a65, 'b₁', true, mode === 'rotation');
        updateArrow(b2Ref.current, b2, 0x69f0ae, 'b₂', true, mode === 'rotation');
        updateArrow(vRef.current, v, 0xffffff, 'v', true, mode === 'rotation');

        if (transformedGridRef.current && sceneRef.current) {
            while (transformedGridRef.current.children.length > 0) {
                const child = transformedGridRef.current.children[0];
                transformedGridRef.current.remove(child);
                if ((child as any).geometry) (child as any).geometry.dispose();
                if ((child as any).material) (child as any).material.dispose();
            }
            drawTransformedGrid(transformedGridRef.current, { 
                matrix: { a: b1.x, b: b2.x, c: b1.y, d: b2.y },
                gridColor: 0x4fc3f7,
                divisions: 25,
                size: 50
            });
            transformedGridRef.current.position.z = 0.1;
        }

        if (combinationHelpersRef.current && sceneRef.current) {
             while (combinationHelpersRef.current.children.length > 0) {
                const child = combinationHelpersRef.current.children[0];
                combinationHelpersRef.current.remove(child);
                 if ((child as any).geometry) (child as any).geometry.dispose();
                if ((child as any).material) (child as any).material.dispose();
            }
            const newHelpers = drawLinearCombinationHelpers(sceneRef.current, b1, b2, coords.x, coords.y);
            combinationHelpersRef.current.add(...newHelpers.children);
        }
        
        if (angleArcRef.current && sceneRef.current) {
            while (angleArcRef.current.children.length > 0) {
                const child = angleArcRef.current.children[0];
                angleArcRef.current.remove(child);
                if ((child as any).geometry) (child as any).geometry.dispose();
                if ((child as any).material) (child as any).material.dispose();
            }
            if(mode === 'rotation') {
                const newArc = drawAngleBetweenVectors(sceneRef.current, { v1: b1, v2: b2, color: 0xffeb3b, showAngleText: true, radius: 1 });
                angleArcRef.current.add(newArc);
            }
        }
        
    }, [coords, b1Pos, b2Pos, mode]);

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
    
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        requestAnimationFrame(animate);
    };


    const handlePreset = (preset: 'reset' | 'shear' | 'rotate' | 'scale') => {
        setMode('explore'); // Exit rotation mode if active
        switch(preset) {
            case 'shear':
                animateTo(new THREE.Vector3(1, 0, 0), new THREE.Vector3(1, 1, 0));
                break;
            case 'rotate':
                animateTo(new THREE.Vector3(0, 1, 0), new THREE.Vector3(-1, 0, 0));
                break;
            case 'scale':
                 animateTo(new THREE.Vector3(2, 0, 0), new THREE.Vector3(0, 2, 0));
                break;
            case 'reset':
            default:
                animateTo(initialB1.clone(), initialB2.clone());
                setCoords({x: 2.0, y: 1.0});
                break;
        }
    }
    
    return (
        <div className="w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 items-center p-4 rounded-lg border bg-muted/50">
                <div className="text-center">
                    <Label className="font-semibold">Transformation Matrix (M)</Label>
                    <div className="font-mono text-xl mt-1 p-2 bg-background rounded-md">
                        <div className="flex justify-center items-center">
                            <div className="text-3xl font-thin">[</div>
                            <div className="grid grid-cols-2 gap-x-4 w-32 text-center">
                                <div className="text-orange-400">{b1Pos.x.toFixed(2)}</div>
                                <div className="text-green-300">{b2Pos.x.toFixed(2)}</div>
                                <div className="text-orange-400">{b1Pos.y.toFixed(2)}</div>
                                <div className="text-green-300">{b2Pos.y.toFixed(2)}</div>
                            </div>
                            <div className="text-3xl font-thin">]</div>
                        </div>
                         <div className={cn("text-xs mt-1", determinant < 0 ? 'text-red-400' : 'text-muted-foreground')}>
                            det(M) = {determinant.toFixed(2)}
                        </div>
                    </div>
                </div>
                <div className="space-y-2">
                    <Label className="font-semibold text-center block">Preset Transformations</Label>
                    <div className="grid grid-cols-2 gap-2">
                        <Button variant="outline" size="sm" onClick={() => handlePreset('reset')}>Reset</Button>
                        <Button variant="outline" size="sm" onClick={() => handlePreset('shear')}>Shear</Button>
                        <Button variant="outline" size="sm" onClick={() => handlePreset('rotate')}>Rotate 90°</Button>
                        <Button variant="outline" size="sm" onClick={() => handlePreset('scale')}>Scale 2x</Button>
                        <Button variant={mode === 'rotation' ? 'default' : 'outline'} size="sm" className="col-span-2" onClick={() => setMode(mode === 'rotation' ? 'explore' : 'rotation')}>Rotation Detective</Button>
                    </div>
                </div>
            </div>
            {mode === 'rotation' && (
                 <Alert className="mb-4 border-blue-500/50">
                    <CheckCircle className="h-4 w-4 text-blue-400" />
                    <AlertTitle className="font-semibold text-blue-400">Rotation Detective Mode</AlertTitle>
                    <AlertDescription>
                        <div className="space-y-3 mt-2">
                             <Label>Rotate Basis by: {rotationAngle.toFixed(0)}°</Label>
                             <Slider min={0} max={360} step={1} value={[rotationAngle]} onValueChange={(v) => setRotationAngle(v[0])} />
                             <p className="text-xs text-muted-foreground">✓ Lengths preserved: |b₁| = {b1Pos.length().toFixed(2)}, |b₂| = {b2Pos.length().toFixed(2)}</p>
                             <p className="text-xs text-muted-foreground">✓ Angle preserved: {(b1Pos.angleTo(b2Pos) * 180 / Math.PI).toFixed(0)}°</p>
                             <p className="text-xs text-muted-foreground">✓ Determinant preserved: {determinant.toFixed(2)}</p>
                        </div>
                    </AlertDescription>
                </Alert>
            )}
            <div ref={mountRef} className={cn("relative aspect-[4/3] md:aspect-video w-full overflow-hidden rounded-lg border bg-muted/20 cursor-grab active:cursor-grabbing")}></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 p-4 rounded-lg border bg-muted/50 items-center">
                <div className="text-center">
                    <Label className="font-semibold text-primary">Coordinates in New Basis</Label>
                    <div className="flex justify-center items-center gap-2 mt-2">
                        <Input className="w-20 h-8 text-center" type="number" step="0.1" value={coords.x} onChange={e => setCoords({...coords, x: parseFloat(e.target.value) || 0})} />
                        <Input className="w-20 h-8 text-center" type="number" step="0.1" value={coords.y} onChange={e => setCoords({...coords, y: parseFloat(e.target.value) || 0})} />
                    </div>
                </div>
                 <div className="text-2xl font-bold text-muted-foreground text-center">=</div>
                 <div className="text-center">
                    <Label className="font-semibold">Resulting Vector (v)</Label>
                     <div className="font-mono text-lg p-2 mt-2">
                        {`[${vectorV.x.toFixed(2)}, ${vectorV.y.toFixed(2)}]`}
                    </div>
                </div>
            </div>
        </div>
    );
}
