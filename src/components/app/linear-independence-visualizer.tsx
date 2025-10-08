
'use client';

import React, { useState, useEffect, useRef } from 'react';
import p5 from 'p5';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { drawVector as p5DrawVector, screenToWorld as p5ScreenToWorld, drawGrid as p5DrawGrid } from '@/lib/p5';

const LinearIndependenceVisualizer = () => {
    const canvasRef = useRef<HTMLDivElement>(null);
    const sketchRef = useRef<p5 | null>(null);

    const [v1State, setV1State] = useState({ x: 2.5, y: 1.0 });
    const [v2State, setV2State] = useState({ x: -1.0, y: 2.0 });
    const [determinant, setDeterminant] = useState(6.00);
    const [isDependent, setIsDependent] = useState(false);

    useEffect(() => {
        if (sketchRef.current) {
            sketchRef.current.remove();
        }

        const sketch = (p: p5) => {
            let v1: p5.Vector, v2: p5.Vector;
            let draggingV1 = false, draggingV2 = false;
            let scaleFactor: number;

            const sketchState = {
                v1: v1State,
                v2: v2State,
            };

            (p as any).updateWithProps = (props: { v1: typeof v1State, v2: typeof v2State }) => {
                sketchState.v1 = props.v1;
                sketchState.v2 = props.v2;
                if(v1) v1.set(props.v1.x, props.v1.y);
                if(v2) v2.set(props.v2.x, props.v2.y);
                p.redraw();
            };

            p.setup = () => {
                const container = canvasRef.current!;
                p.createCanvas(container.offsetWidth, container.offsetHeight).parent(container);
                p.remove(); // Disable p5.js default unload event listener
                v1 = p.createVector(sketchState.v1.x, sketchState.v1.y);
                v2 = p.createVector(sketchState.v2.x, sketchState.v2.y);
                p.noLoop();
                p.redraw();
            };

            p.draw = () => {
                scaleFactor = p.min(p.width, p.height) / 10;
                p.background(17, 24, 39);
                p.translate(p.width / 2, p.height / 2);
                p.scale(1, -1);

                const det = v1.x * v2.y - v1.y * v2.x;
                const dependencyThreshold = 0.05;
                const dependent = Math.abs(det) < dependencyThreshold;
                
                // Update React state via setters passed in props
                setDeterminant(det);
                setIsDependent(dependent);

                if (dependent) {
                    const dominantVec = v1.magSq() > v2.magSq() ? v1 : v2;
                    p.stroke(239, 68, 68, 150); // red
                    p.strokeWeight(3);
                    if (dominantVec.magSq() > 0.01) {
                        const p1 = dominantVec.copy().mult(-100);
                        const p2 = dominantVec.copy().mult(100);
                        p.line(p1.x * scaleFactor, p1.y * scaleFactor, p2.x * scaleFactor, p2.y * scaleFactor);
                    }
                } else {
                    p5DrawGrid(p, v1, v2, p.color(55, 65, 81, 150), 1.5, scaleFactor);
                }

                p5DrawVector(p, v1, scaleFactor, p.color(248, 113, 113), 'v₁', 4);
                p5DrawVector(p, v2, scaleFactor, p.color(96, 165, 250), 'v₂', 4);
            };

            p.mousePressed = () => {
                const mouseVec = p5ScreenToWorld(p, p.mouseX, p.mouseY, scaleFactor);
                if (p5.Vector.dist(mouseVec, v1) < 0.5) draggingV1 = true;
                else if (p5.Vector.dist(mouseVec, v2) < 0.5) draggingV2 = true;
            };
            
            p.mouseDragged = () => {
                const mouseVec = p5ScreenToWorld(p, p.mouseX, p.mouseY, scaleFactor);
                 if (draggingV1) {
                    setV1State({ x: mouseVec.x, y: mouseVec.y });
                } else if (draggingV2) {
                    setV2State({ x: mouseVec.x, y: mouseVec.y });
                }
            };

            p.mouseReleased = () => {
                draggingV1 = false;
                draggingV2 = false;
            };

            p.windowResized = () => {
                if(canvasRef.current) {
                    p.resizeCanvas(canvasRef.current.offsetWidth, canvasRef.current.offsetHeight);
                    p.redraw();
                }
            };
        };

        sketchRef.current = new p5(sketch, canvasRef.current!);

        return () => {
            sketchRef.current?.remove();
        };
    }, []);

    useEffect(() => {
        if (sketchRef.current && (sketchRef.current as any).updateWithProps) {
            (sketchRef.current as any).updateWithProps({ v1: v1State, v2: v2State });
        }
    }, [v1State, v2State]);

    return (
        <div className="flex flex-col md:flex-row h-auto md:h-auto gap-6 bg-gray-900 rounded-lg p-4">
            <Card className="w-full md:w-[28rem] p-6 bg-gray-800 shadow-2xl rounded-lg flex flex-col space-y-6 border-0">
                <div>
                    <h1 className="text-3xl font-bold text-cyan-400">Freedom vs. Constraint</h1>
                    <h2 className="text-xl text-gray-300">Visualizing Linear Independence</h2>
                    <p className="text-gray-400 mt-3">
                        Drag the vectors. When they are <b>independent</b>, they can span a whole plane. The moment they become <b>dependent</b> by lining up, their entire world collapses into a single line.
                    </p>
                </div>

                <div id="status-box" className={cn("border-2 rounded-lg p-4 text-center transition-colors", 
                    isDependent ? "status-dependent" : "status-independent"
                )}>
                    <h3 id="status-text" className="text-2xl font-bold">{isDependent ? 'Linearly DEPENDENT' : 'Linearly INDEPENDENT'}</h3>
                </div>

                <div className="bg-background/30 border border-cyan-500/30 rounded-lg p-4 space-y-3">
                    <div className="flex justify-between items-center">
                        <span className="text-lg text-red-300 font-bold">v₁ =</span>
                        <span id="v1-coords" className="font-mono text-lg">{`(${v1State.x.toFixed(2)}, ${v1State.y.toFixed(2)})`}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-lg text-blue-300 font-bold">v₂ =</span>
                        <span id="v2-coords" className="font-mono text-lg">{`(${v2State.x.toFixed(2)}, ${v2State.y.toFixed(2)})`}</span>
                    </div>
                </div>
                
                <div className="bg-background/30 border border-cyan-500/30 rounded-lg p-4 space-y-2">
                    <h3 className="text-lg font-semibold text-white mb-2">Key Indicator: Determinant</h3>
                    <p className="text-sm text-gray-400">The determinant of the matrix [v₁ v₂] measures the area of the parallelogram they form. If the area is zero, they're on the same line!</p>
                    <div id="det-box" className={cn("text-center text-3xl font-mono p-2 rounded bg-gray-900/50 mt-2 transition-colors", 
                        isDependent ? "text-red-500" : "text-green-500"
                    )}>
                       {determinant.toFixed(2)}
                    </div>
                </div>
            </Card>
            <div ref={canvasRef} className="flex-grow min-h-[400px] h-full" />
        </div>
    );
};

export default LinearIndependenceVisualizer;
