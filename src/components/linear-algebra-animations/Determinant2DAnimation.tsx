
'use client';

import { useState, useRef, useEffect } from 'react';
import * as THREE from 'three';
import { makeObjectsDraggable } from '@/components/three/interactivity';
import { createLabel, drawShading } from '@/components/three/primitives';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle, Maximize, Minimize, RotateCcw, VolumeX } from 'lucide-react';

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

const initialB1 = new THREE.Vector3(2, 1, 0);
const initialB2 = new THREE.Vector3(1, 2, 0);

export function Determinant2DAnimation() {
    const mountRef = useRef<HTMLDivElement>(null);
    
    // State for vectors & determinant
    const [b1Pos, setB1Pos] = useState(initialB1.clone());
    const [b2Pos, setB2Pos] = useState(initialB2.clone());
    const [determinant, setDeterminant] = useState(0);

    // Refs for three.js objects
    const sceneRef = useRef<THREE.Scene | null>(null);
    const cameraRef = useRef<THREE.OrthographicCamera | null>(null);
    const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
    const animationFrameIdRef = useRef<number>();
    
    // Refs for visual objects
    const b1Ref = useRef<VectorArrow | null>(null);
    const b2Ref = useRef<VectorArrow | null>(null);
    const parallelogramRef = useRef<THREE.Mesh | null>(null);
    const unitSquareRef = useRef<THREE.Mesh | null>(null);

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
            color: 0xffd700 // Gold
        });
        unitSquareRef.current.position.z = -0.1; // Behind transformed area

        b1Ref.current = new VectorArrow(b1Pos.clone().normalize(), new THREE.Vector3(0,0,0), b1Pos.length(), 0xff8a65, 0.3, 0.2);
        b2Ref.current = new VectorArrow(b2Pos.clone().normalize(), new THREE.Vector3(0,0,0), b2Pos.length(), 0x69f0ae, 0.3, 0.2);
        b1Ref.current.setLabel('b₁', 0xff8a65);
        b2Ref.current.setLabel('b₂', 0x69f0ae);
        scene.add(b1Ref.current, b2Ref.current);
        
        parallelogramRef.current = new THREE.Mesh();
        scene.add(parallelogramRef.current);
        
        const cleanupB1 = makeObjectsDraggable(b1Ref.current, camera, renderer.domElement, { 
            onDrag: (obj, pos) => setB1Pos(pos.clone().setZ(0))
        });
        const cleanupB2 = makeObjectsDraggable(b2Ref.current, camera, renderer.domElement, { 
            onDrag: (obj, pos) => setB2Pos(pos.clone().setZ(0))
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

    // Effect to update visualization when state changes
    useEffect(() => {
        const det = b1Pos.x * b2Pos.y - b1Pos.y * b2Pos.x;
        setDeterminant(det);

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
            if (det < 0) newColor = 0xba68c8; // Purple for flipped
            else if (Math.abs(det) < 0.1) newColor = 0xe57373; // Red for collapsed
            else if (Math.abs(det) < 0.95) newColor = 0xffd54f; // Yellow for shrunk
            else if (Math.abs(det) < 1.05) newColor = 0x4dd0e1; // Blue for preserved
            else newColor = 0x81c784; // Green for stretched

            parallelogramRef.current = drawShading(sceneRef.current, { points, color: newColor });
        }
        
    }, [b1Pos, b2Pos]);

    const getStatusMessage = () => {
        const absDet = Math.abs(determinant);
        if (determinant < 0) return { icon: <AlertCircle />, text: "Orientation Flipped!", color: "text-purple-400" };
        if (absDet < 0.1) return { icon: <VolumeX />, text: "Collapsed to a Line!", color: "text-red-400" };
        if (absDet < 0.95) return { icon: <Minimize />, text: "Area Shrunk", color: "text-yellow-400" };
        if (absDet < 1.05) return { icon: <RotateCcw />, text: "Area Preserved (Rotation)", color: "text-cyan-400" };
        return { icon: <Maximize />, text: "Area Stretched", color: "text-green-400" };
    }

    const status = getStatusMessage();

    return (
        <Card className="w-full">
            <CardContent className="p-4">
                 <div ref={mountRef} className="relative aspect-[4/3] md:aspect-video w-full overflow-hidden rounded-lg border bg-muted/20 cursor-grab active:cursor-grabbing"></div>
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
                 <div className={cn("flex items-center justify-center gap-2 text-sm font-semibold mt-4", status.color)}>
                    {status.icon}
                    <p>{status.text}</p>
                 </div>
                 <p className="text-xs text-muted-foreground text-center mt-2">Drag the vector tips to change the transformation.</p>
            </CardContent>
        </Card>
    );
}

```)