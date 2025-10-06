
'use client';

import React, { useState, useEffect, useRef } from 'react';
import p5 from 'p5';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { RotateCcw } from 'lucide-react';
import { drawGrid, drawVector, screenToWorld } from '@/lib/p5-helpers';

const ColumnSpaceVisualizer = () => {
    const canvasRef = useRef<HTMLDivElement>(null);
    const sketchRef = useRef<p5 | null>(null);

    const [col1Coords, setCol1Coords] = useState({ x: 1.5, y: 0.5 });
    const [col2Coords, setCol2Coords] = useState({ x: -1.0, y: 1.0 });
    const [outputCoords, setOutputCoords] = useState('');
    const [isRankDeficient, setIsRankDeficient] = useState(false);

    useEffect(() => {
        if (sketchRef.current) sketchRef.current.remove();
        if (!canvasRef.current) return;

        const sketch = (p: p5) => {
            let col1: p5.Vector, col2: p5.Vector, inputVec: p5.Vector;
            let isDraggingC1 = false, isDraggingC2 = false, isDraggingInput = false;
            let scaleFactor: number;
            let inputArea: { x: number, y: number, w: number, h: number };

            p.setup = () => {
                const container = canvasRef.current!;
                p.createCanvas(container.offsetWidth, container.offsetHeight).parent(container);
                
                col1 = p.createVector(1.5, 0.5);
                col2 = p.createVector(-1, 1);
                inputVec = p.createVector(1, 1);

                inputArea = { x: 20, y: p.height - 170, w: 150, h: 150 };
                
                document.body.style.cursor = 'grab';
            };

            p.draw = () => {
                scaleFactor = p.min(p.width, p.height) / 10;
                p.background(17, 24, 39);

                p.push();
                p.translate(p.width / 2, p.height / 2);
                p.scale(1, -1);
                handleDragging();

                const det = col1.x * col2.y - col1.y * col2.x;
                const rankDeficient = Math.abs(det) < 0.1;
                
                // Update React state
                setCol1Coords({x: col1.x, y: col1.y});
                setCol2Coords({x: col2.x, y: col2.y});
                setIsRankDeficient(rankDeficient);
                
                if (rankDeficient) {
                     const dominantVec = col1.magSq() > col2.magSq() ? col1 : col2;
                     p.stroke(p.color(96, 165, 250, 150));
                     p.strokeWeight(3);
                     if (dominantVec.magSq() > 0.01) {
                         const p1 = dominantVec.copy().mult(-100);
                         const p2 = dominantVec.copy().mult(100);
                         p.line(p1.x * scaleFactor, p1.y * scaleFactor, p2.x * scaleFactor, p2.y * scaleFactor);
                     }
                } else {
                    drawGrid(p, col1, col2, p.color(96, 165, 250, 80), 2, scaleFactor, p.color(96, 165, 250, 20));
                }

                drawVector(p, col1, scaleFactor, p.color(96, 165, 250), 'col₁');
                drawVector(p, col2, scaleFactor, p.color(96, 165, 250), 'col₂');

                const outputVec = p5.Vector.add(p5.Vector.mult(col1, inputVec.x), p5.Vector.mult(col2, inputVec.y));
                drawVector(p, outputVec, scaleFactor, p.color(244, 114, 182), 'Ax', 5);
                setOutputCoords(`(${outputVec.x.toFixed(2)}, ${outputVec.y.toFixed(2)})`);

                p.pop();

                drawInputArea();
            };
            
            const handleDragging = () => {
                const mouseWorld = screenToWorld(p, p.mouseX, p.mouseY, scaleFactor);
                if (isDraggingC1) col1.set(mouseWorld);
                if (isDraggingC2) col2.set(mouseWorld);
            };

            p.mousePressed = () => {
                const mouseWorld = screenToWorld(p, p.mouseX, p.mouseY, scaleFactor);
                if (p.dist(p.mouseX, p.mouseY, inputArea.x + inputArea.w / 2, inputArea.y + inputArea.h / 2) < inputArea.w / 2) {
                    isDraggingInput = true;
                } else if (p5.Vector.dist(mouseWorld, col1) < 0.5) {
                    isDraggingC1 = true;
                } else if (p5.Vector.dist(mouseWorld, col2) < 0.5) {
                    isDraggingC2 = true;
                }
                document.body.style.cursor = 'grabbing';
            };
            
            p.mouseDragged = () => {
                if (isDraggingInput) {
                    const s = inputArea.w / 6;
                    const x = p.constrain((p.mouseX - inputArea.x - inputArea.w/2) / s, -2.5, 2.5);
                    const y = p.constrain((p.mouseY - inputArea.y - inputArea.h/2) / -s, -2.5, 2.5);
                    inputVec.set(x, y);
                }
            };
            
            p.mouseReleased = () => { isDraggingC1 = false; isDraggingC2 = false; isDraggingInput = false; document.body.style.cursor = 'grab'; };
            
            const drawInputArea = () => {
                p.push();
                p.fill(17, 24, 39, 200); p.stroke(96, 165, 250);
                p.rect(inputArea.x, inputArea.y, inputArea.w, inputArea.h, 10);
                p.fill(255); p.noStroke(); p.textAlign(p.CENTER); p.textSize(14);
                p.text('Input Space', inputArea.x + inputArea.w / 2, inputArea.y - 10);
                p.translate(inputArea.x + inputArea.w / 2, inputArea.y + inputArea.h / 2);
                const s = inputArea.w / 6;
                p.stroke(55, 65, 81);
                p.line(-inputArea.w/2, 0, inputArea.w/2, 0); p.line(0, -inputArea.h/2, 0, inputArea.h/2);
                p.fill(244, 114, 182); p.stroke(244, 114, 182); p.strokeWeight(3);
                p.line(0, 0, inputVec.x * s, -inputVec.y * s); p.ellipse(inputVec.x * s, -inputVec.y * s, 8, 8);
                p.pop();
            };

            p.windowResized = () => { if(canvasRef.current) { p.resizeCanvas(canvasRef.current.offsetWidth, canvasRef.current.offsetHeight); inputArea.y = p.height - 170; }};
        };

        sketchRef.current = new p5(sketch, canvasRef.current!);
        return () => { document.body.style.cursor = 'default'; sketchRef.current?.remove(); };
    }, []);

    return (
        <Card className="bg-transparent border-0 shadow-none">
            <CardContent className="p-0">
                <div className="bg-black/30 backdrop-blur-xl rounded-xl p-4 md:p-6 shadow-2xl border border-purple-500/20 flex flex-col lg:flex-row gap-6">
                    <div className="w-full lg:w-[30rem] flex-shrink-0 space-y-6">
                        <div>
                            <h1 className="text-3xl font-bold text-cyan-400">The Landing Zone</h1>
                            <h2 className="text-xl text-gray-300">Visualizing the Column Space</h2>
                            <p className="text-gray-400 mt-2 text-sm">
                                The <strong>Column Space</strong> is the set of all possible outputs of a matrix. It's the "span" of its column vectors. Drag the <b className="text-blue-400">blue vectors</b> to change the space, and drag the <b className="text-pink-400">input vector x</b> to see that its output is always trapped inside.
                            </p>
                        </div>
                        <div className={cn("border-2 rounded-lg p-4 text-center transition-colors", isRankDeficient ? 'status-line' : 'status-plane')}>
                            <h3 className="text-2xl font-bold">{isRankDeficient ? 'LINE (Rank Deficient)' : 'PLANE (Full Rank)'}</h3>
                        </div>
                        <div className="space-y-3 p-4 rounded-lg bg-gray-900/50 border border-cyan-500/30">
                            <div className="flex items-center justify-center space-x-4 text-2xl">
                                <div className="text-muted-foreground text-5xl">[</div>
                                <div className="grid grid-cols-2 gap-x-4 gap-y-2 font-mono text-center">
                                    <span className="text-blue-300">{col1Coords.x.toFixed(2)}</span>
                                    <span className="text-blue-300">{col2Coords.x.toFixed(2)}</span>
                                    <span className="text-blue-300">{col1Coords.y.toFixed(2)}</span>
                                    <span className="text-blue-300">{col2Coords.y.toFixed(2)}</span>
                                </div>
                                <div className="text-muted-foreground text-5xl">]</div>
                            </div>
                        </div>
                        <div className="p-4 rounded-lg bg-gray-900/50 border border-cyan-500/30">
                            <h3 className="text-lg font-semibold text-white mb-2 text-center">Output Vector</h3>
                            <div className="flex justify-between items-center bg-gray-900/50 p-3 rounded-md">
                                <span className="font-bold text-pink-400">Ax =</span>
                                <p className="text-lg font-mono text-white">{outputCoords}</p>
                            </div>
                        </div>
                    </div>
                    <div ref={canvasRef} className="flex-grow min-h-[400px] lg:min-h-[550px] h-full rounded-lg border bg-gray-900 overflow-hidden" />
                </div>
            </CardContent>
        </Card>
    );
};

export default ColumnSpaceVisualizer;
    

    