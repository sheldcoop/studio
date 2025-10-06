'use client';

import React, { useState, useEffect, useRef } from 'react';
import p5 from 'p5';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

const RowSpaceVisualizer = () => {
    const canvasRef = useRef<HTMLDivElement>(null);
    const sketchRef = useRef<p5 | null>(null);

    const [row1Coords, setRow1Coords] = useState("(1.50, 0.50)");
    const [row2Coords, setRow2Coords] = useState("(0.50, 1.00)");
    const [isDependent, setIsDependent] = useState(false);

    useEffect(() => {
        if (sketchRef.current) sketchRef.current.remove();
        if (!canvasRef.current) return;

        const sketch = (p: p5) => {
            let r1: p5.Vector, r2: p5.Vector;
            let draggingR1 = false, draggingR2 = false;
            let scaleFactor: number;

            p.setup = () => {
                const container = canvasRef.current!;
                p.createCanvas(container.offsetWidth, container.offsetHeight).parent(container);
                r1 = p.createVector(1.5, 0.5);
                r2 = p.createVector(0.5, 1.0);
            };

            p.draw = () => {
                scaleFactor = p.min(p.width, p.height) / 8;
                p.background(17, 24, 39);
                p.translate(p.width / 2, p.height / 2);
                p.scale(1, -1);

                const handleDragging = () => {
                    if (!p.mouseIsPressed) return;
                    const mouseVec = screenToWorld(p.mouseX, p.mouseY);

                    if (draggingR1) r1.set(mouseVec);
                    else if (draggingR2) r2.set(mouseVec);
                };

                handleDragging();

                const det = r1.x * r2.y - r1.y * r2.x;
                const dependent = Math.abs(det) < 0.05;

                setRow1Coords(`(${r1.x.toFixed(2)}, ${r1.y.toFixed(2)})`);
                setRow2Coords(`(${r2.x.toFixed(2)}, ${r2.y.toFixed(2)})`);
                setIsDependent(dependent);

                p.stroke(55, 65, 81); p.strokeWeight(1);
                p.line(-p.width, 0, p.width, 0); p.line(0, -p.height, 0, p.height);

                if (dependent) {
                    const dominantVec = r1.magSq() > r2.magSq() ? r1 : r2;
                    p.stroke(239, 68, 68, 150); p.strokeWeight(3);
                    if (dominantVec.magSq() > 0.01) {
                        const p1 = dominantVec.copy().mult(-100);
                        const p2 = dominantVec.copy().mult(100);
                        p.line(p1.x * scaleFactor, p1.y * scaleFactor, p2.x * scaleFactor, p2.y * scaleFactor);
                    }
                } else {
                    p.fill(34, 211, 238, 20); p.noStroke();
                    p.beginShape();
                    const range = 12;
                    p.vertex(-range*scaleFactor, -range*scaleFactor);
                    p.vertex(range*scaleFactor, -range*scaleFactor);
                    p.vertex(range*scaleFactor, range*scaleFactor);
                    p.vertex(-range*scaleFactor, range*scaleFactor);
                    p.endShape(p.CLOSE);
                }

                drawVector(r1, scaleFactor, p.color(134, 239, 172), 'row₁');
                drawVector(r2, scaleFactor, p.color(147, 197, 253), 'row₂');
            };

            const screenToWorld = (mx: number, my: number) => p.createVector((mx - p.width / 2) / scaleFactor, (p.height / 2 - my) / scaleFactor);
            p.mousePressed = () => { const m = screenToWorld(p.mouseX, p.mouseY); if (p5.Vector.dist(m, r1) < 0.5) draggingR1 = true; else if (p5.Vector.dist(m, r2) < 0.5) draggingR2 = true;};
            p.mouseDragged = () => { if (draggingR1) r1.set(screenToWorld(p.mouseX, p.mouseY)); if (draggingR2) r2.set(screenToWorld(p.mouseX, p.mouseY));};
            p.mouseReleased = () => { draggingR1 = false; draggingR2 = false;};
            
            const drawVector = (v: p5.Vector, s: number, c: p5.Color, l: string) => {
                const sv = p5.Vector.mult(v, s);
                p.push(); p.stroke(c); p.fill(c); p.strokeWeight(4);
                p.line(0, 0, sv.x, sv.y);
                const hs=10; const a=sv.heading(); p.translate(sv.x,sv.y); p.rotate(a); p.triangle(0,0,-hs,hs/2,-hs,-hs/2);
                p.pop();
                if(l){p.push();const lp=sv.copy().add(sv.copy().normalize().mult(20));p.noStroke();p.fill(c);p.textSize(18);p.textStyle(p.BOLD);p.translate(lp.x,lp.y);p.scale(1,-1);p.text(l,0,0);p.pop();}
            }
             p.windowResized = () => { if (canvasRef.current) p.resizeCanvas(canvasRef.current.offsetWidth, canvasRef.current.offsetHeight); };
        };

        sketchRef.current = new p5(sketch, canvasRef.current!);
        return () => sketchRef.current?.remove();
    }, []);

    return (
        <Card className="bg-transparent border-0 shadow-none">
            <CardContent className="p-0">
                <div className="bg-black/30 backdrop-blur-xl rounded-xl p-4 md:p-6 shadow-2xl border border-purple-500/20 flex flex-col lg:flex-row gap-6">
                     <div className="w-full lg:w-[30rem] flex-shrink-0 space-y-6">
                        <div>
                            <h1 className="text-3xl font-bold text-cyan-400">The Input World</h1>
                            <h2 className="text-xl text-gray-300">Visualizing the Row Space</h2>
                            <p className="text-gray-400 mt-2 text-sm">
                                The **Row Space** is the part of the input world that gets mapped to the column space. It's the span of the matrix's rows. Drag the vectors to see how they define the input plane. When they are dependent, the entire input space collapses to a line.
                            </p>
                        </div>
                        <div className={cn("border-2 rounded-lg p-4 text-center transition-colors", isDependent ? 'status-line' : 'status-plane')}>
                            <h3 className="text-2xl font-bold">{isDependent ? 'LINE (Rank Deficient)' : 'PLANE (Full Rank)'}</h3>
                        </div>
                         <div className="space-y-3 p-4 rounded-lg bg-gray-900/50 border border-cyan-500/30">
                             <div className="flex justify-between items-center">
                                <span className="text-lg text-green-300 font-bold">row₁ =</span>
                                <span className="font-mono text-lg">{row1Coords}</span>
                            </div>
                             <div className="flex justify-between items-center">
                                <span className="text-lg text-blue-300 font-bold">row₂ =</span>
                                <span className="font-mono text-lg">{row2Coords}</span>
                            </div>
                        </div>
                    </div>
                    <div ref={canvasRef} className="flex-grow min-h-[400px] lg:min-h-[550px] h-full rounded-lg border bg-gray-900 overflow-hidden" />
                </div>
            </CardContent>
        </Card>
    );
};

export default RowSpaceVisualizer;
