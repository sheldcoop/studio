
'use client';

import React, { useState, useEffect, useRef } from 'react';
import p5 from 'p5';
import { drawGrid, drawVector, screenToWorld, drawDashedLine } from '@/lib/p5';

const VectorProjectionVisualizer = () => {
    const canvasRef = useRef<HTMLDivElement>(null);
    const sketchRef = useRef<p5 | null>(null);

    const [dotAB, setDotAB] = useState(0);
    const [dotBB, setDotBB] = useState(0);
    const [scalar, setScalar] = useState(0);
    const [projVector, setProjVector] = useState("(0.00, 0.00)");
    const [aVec, setAVec] = useState({ x: 2, y: 2.5 });
    const [bVec, setBVec] = useState({ x: 3, y: 1 });

    useEffect(() => {
        if (sketchRef.current) {
            sketchRef.current.remove();
        }
        if (!canvasRef.current) return;

        const sketch = (p: p5) => {
            let p5a: p5.Vector, p5b: p5.Vector;
            let dragging: p5.Vector | null = null;
            let scaleFactor: number;

            // This object will hold the state that p5 needs to draw.
            const sketchState = {
                a: p.createVector(aVec.x, aVec.y),
                b: p.createVector(bVec.x, bVec.y),
            };

            // This function allows React to update the state within the p5 sketch.
            (p as any).updateWithProps = (props: { a: {x:number, y:number}, b: {x:number, y:number} }) => {
                sketchState.a.set(props.a.x, props.a.y);
                sketchState.b.set(props.b.x, props.b.y);
                p.redraw(); // Trigger a redraw whenever props change
            };

            p.setup = () => {
                p.createCanvas(canvasRef.current!.offsetWidth, canvasRef.current!.offsetHeight).parent(canvasRef.current!);
                p5a = sketchState.a;
                p5b = sketchState.b;
                p.noLoop();
            };

            p.draw = () => {
                scaleFactor = p.min(p.width, p.height) / 8;
                p.background(17, 24, 39); // bg-gray-900
                p.translate(p.width / 2, p.height / 2);
                p.scale(1, -1);

                drawGrid(p, p.createVector(1, 0), p.createVector(0, 1), p.color(55, 65, 81), 1, scaleFactor);

                const b_norm = sketchState.b.copy().normalize();
                const dot_ab_val = sketchState.a.dot(sketchState.b);
                const dot_bb_val = sketchState.b.dot(sketchState.b);
                const scalar_val = dot_bb_val === 0 ? 0 : dot_ab_val / dot_bb_val;
                const proj = sketchState.b.copy().mult(scalar_val);

                // Update React state
                setDotAB(dot_ab_val);
                setDotBB(dot_bb_val);
                setScalar(scalar_val);
                setProjVector(`(${proj.x.toFixed(2)}, ${proj.y.toFixed(2)})`);

                p.stroke(96, 165, 250, 50); // blue-400 with alpha
                p.strokeWeight(2);
                if (b_norm.magSq() > 0) {
                  p.line(-b_norm.x * p.width, -b_norm.y * p.width, b_norm.x * p.width, b_norm.y * p.width);
                }

                drawVector(p, sketchState.a, scaleFactor, p.color(134, 239, 172), 'a', 4);
                drawVector(p, sketchState.b, scaleFactor, p.color(147, 197, 253), 'b', 4);
                
                if (proj.mag() > 0.01) {
                    drawVector(p, proj, scaleFactor, p.color(252, 165, 165), 'proj', 4);
                }
                
                const screenA = sketchState.a.copy().mult(scaleFactor);
                const screenProj = proj.copy().mult(scaleFactor);
                drawDashedLine(p, screenA, screenProj, p.color(255, 255, 255, 100), 2, [5, 10]);
            };

            const p5ScreenToWorld = (mx: number, my: number) => screenToWorld(p, mx, my, p.min(p.width, p.height) / 8);
            
            p.mousePressed = () => {
                const mouseVec = p5ScreenToWorld(p.mouseX, p.mouseY);
                if (p5.Vector.dist(mouseVec, sketchState.a) < 0.4) dragging = sketchState.a;
                else if (p5.Vector.dist(mouseVec, sketchState.b) < 0.4) dragging = sketchState.b;
                else dragging = null;
            };

            const handleDrag = () => {
                if (dragging) {
                    const mouseVec = p5ScreenToWorld(p.mouseX, p.mouseY);
                    if (dragging === sketchState.a) setAVec({x: mouseVec.x, y: mouseVec.y});
                    if (dragging === sketchState.b) setBVec({x: mouseVec.x, y: mouseVec.y});
                }
            }
            
            p.mouseDragged = () => handleDrag();
            
            p.touchMoved = () => {
                if (dragging) {
                    handleDrag();
                    return false; // Prevent page scrolling
                }
                return true;
            };

            p.mouseReleased = () => { dragging = null; };
            p.windowResized = () => p.resizeCanvas(canvasRef.current!.offsetWidth, canvasRef.current!.offsetHeight);
        };

        sketchRef.current = new p5(sketch);
        return () => sketchRef.current?.remove();
    }, []);

     useEffect(() => {
        if (sketchRef.current && (sketchRef.current as any).updateWithProps) {
            (sketchRef.current as any).updateWithProps({ a: aVec, b: bVec });
        }
    }, [aVec, bVec]);

    return (
        <div className="flex flex-col md:flex-row h-[700px] md:h-auto gap-6 antialiased text-white bg-gray-900 rounded-lg p-4">
            <div className="w-full md:w-[26rem] p-6 bg-gray-800 shadow-2xl rounded-lg flex flex-col justify-center space-y-6">
                <div>
                    <h1 className="text-3xl font-bold text-cyan-400">The Story of a Shadow</h1>
                    <h2 className="text-xl text-gray-300">Visualizing Vector Projection</h2>
                    <p className="text-gray-400 mt-2">
                        The projection of vector <b className="text-green-300">a</b> onto vector <b className="text-blue-300">b</b> is the "shadow" <b className="text-green-300">a</b> casts on the line of <b className="text-blue-300">b</b>. Drag the vectors to see it change.
                    </p>
                </div>
                <div className="border border-cyan-500/30 rounded-lg p-4 bg-gray-900/50">
                    <h3 className="text-lg font-semibold text-white mb-2 text-center">The Formula Unpacked</h3>
                    <div className="text-center text-2xl my-4 flex items-center justify-center">
                        <b className="text-red-300">proj</b><sub><b className="text-blue-300">b</b></sub>(<b className="text-green-300">a</b>) = 
                        <div className="inline-flex flex-col items-center align-middle mx-2">
                            <span className="numerator px-2 border-b border-gray-400"><b className="text-green-300">a</b> ⋅ <b className="text-blue-300">b</b></span>
                            <span className="denominator px-2"><b className="text-blue-300">b</b> ⋅ <b className="text-blue-300">b</b></span>
                        </div>
                        <b className="text-blue-300">b</b>
                    </div>
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between items-center bg-gray-900/50 p-2 rounded">
                            <span className="text-gray-300"><b className="text-green-300">a</b> ⋅ <b className="text-blue-300">b</b> (Dot Product):</span>
                            <span className="font-mono text-white">{dotAB.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center bg-gray-900/50 p-2 rounded">
                            <span className="text-gray-300"><b className="text-blue-300">b</b> ⋅ <b className="text-blue-300">b</b> (Length of b squared):</span>
                            <span className="font-mono text-white">{dotBB.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center bg-gray-900/50 p-2 rounded">
                            <span className="text-gray-300">Scalar (Shadow Length Factor):</span>
                            <span className="font-mono text-white">{scalar.toFixed(2)}</span>
                        </div>
                         <div className="flex justify-between items-center bg-cyan-900/50 p-2 rounded mt-4">
                            <span className="font-bold text-cyan-300">Final Projection Vector:</span>
                            <span className="font-mono text-cyan-300 font-bold">{projVector}</span>
                        </div>
                    </div>
                </div>
                 <p className="text-xs text-center text-gray-500 pt-4">Notice the dashed line is always at a 90° angle to vector <b className="text-blue-300">b</b>. This is the shortest distance from the tip of <b className="text-green-300">a</b> to the line of <b className="text-blue-300">b</b>.</p>
            </div>
            <div ref={canvasRef} className="flex-grow min-h-[400px] h-full" />
        </div>
    );
};

export default VectorProjectionVisualizer;
