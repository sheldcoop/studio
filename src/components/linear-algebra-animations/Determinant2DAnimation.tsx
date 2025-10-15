'use client';

import { useState, useRef, useEffect } from 'react';
import * as THREE from 'three';
import { makeObjectsDraggable } from '@/components/three/interactivity';
import { createLabel } from '@/components/three/ui-helpers';
import { drawShading } from '@/components/three/primitives';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';

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
            
            const newColor = det >= 0 ? 0x4dd0e1 : 0xf06292; // Cyan for positive, Pink for negative
            parallelogramRef.current = drawShading(sceneRef.current, { points, color: newColor });
        }
        
    }, [b1Pos, b2Pos]);

    return (
        <Card className="w-full">
            <CardContent className="p-4">
                 <div ref={mountRef} className="relative aspect-[4/3] md:aspect-video w-full overflow-hidden rounded-lg border bg-muted/20 cursor-grab active:cursor-grabbing"></div>
                 <div className="mt-4 text-center">
                    <p className="font-mono text-2xl font-bold tracking-tight">
                        det(M) = <span className={cn(determinant < 0 && "text-destructive")}>{determinant.toFixed(3)}</span>
                    </p>
                    <p className="text-sm text-muted-foreground">Drag the tips of the vectors to change the transformation.</p>
                 </div>
            </CardContent>
        </Card>
    );
}
