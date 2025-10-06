
'use client';

import React, { useState, useEffect, useRef } from 'react';
import p5 from 'p5';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';

const ColumnSpaceVisualizer = () => {
    const canvasRef = useRef<HTMLDivElement>(null);
    const sketchRef = useRef<p5 | null>(null);

    const [matrix, setMatrix] = useState({ a: 1, b: 1, c: 0, d: 1 });
    const [determinant, setDeterminant] = useState(1);
    const [isSingular, setIsSingular] = useState(false);

    useEffect(() => {
        const det = matrix.a * matrix.d - matrix.b * matrix.c;
        setDeterminant(det);
        setIsSingular(Math.abs(det) < 0.01);
    }, [matrix]);

    useEffect(() => {
        if (sketchRef.current) sketchRef.current.remove();
        if (!canvasRef.current) return;

        const sketch = (p: p5) => {
            const state = { matrix };

            p.updateWithProps = (props: any) => {
                state.matrix = props.matrix;
            };

            p.setup = () => {
                p.createCanvas(canvasRef.current!.offsetWidth, 400).parent(canvasRef.current!);
            };

            p.draw = () => {
                const { a, b, c, d } = state.matrix;
                const scaleFactor = p.min(p.width, p.height) / 8;

                p.background(17, 24, 39);
                p.translate(p.width / 2, p.height / 2);
                p.scale(1, -1);
                
                const col1 = p.createVector(a, c);
                const col2 = p.createVector(b, d);

                const det = col1.x * col2.y - col1.y * col2.x;
                const isSingular = Math.abs(det) < 0.01;

                if (isSingular) {
                    drawSpanLine(col1, col2, scaleFactor, p);
                } else {
                    drawSpanGrid(col1, col2, scaleFactor, p);
                }

                drawVector(col1, scaleFactor, p.color('#ff6b6b'), 'col₁');
                drawVector(col2, scaleFactor, p.color('#4ecdc4'), 'col₂');
            };

            p.windowResized = () => {
                 if (canvasRef.current) p.resizeCanvas(canvasRef.current.offsetWidth, 400);
            };
        };

        sketchRef.current = new p5(sketch, canvasRef.current!);
        return () => sketchRef.current?.remove();
    }, []);

    useEffect(() => {
        if (sketchRef.current && (sketchRef.current as any).updateWithProps) {
            (sketchRef.current as any).updateWithProps({ matrix });
        }
    }, [matrix]);
    
    const handleSliderChange = (key: 'a' | 'b' | 'c' | 'd', value: number) => {
        setMatrix(prev => ({ ...prev, [key]: value }));
    };

    return (
        <Card className="bg-transparent border-0 shadow-none">
            <CardContent className="p-0">
                <div className="bg-black/30 backdrop-blur-xl rounded-xl p-4 md:p-6 shadow-2xl border border-purple-500/20 flex flex-col lg:flex-row gap-6">
                    <div className="w-full lg:w-[28rem] flex-shrink-0 space-y-4">
                       <Card className="bg-gray-800/50">
                            <CardHeader className="p-4">
                                <CardTitle className="text-cyan-400">The Reach of a Matrix</CardTitle>
                                <CardDescription className="text-gray-400">
                                    The Column Space is the set of all possible outputs of a transformation. It's the "span" of where the basis vectors land. Drag the sliders to change the matrix and see how the column space (the grid) changes.
                                </CardDescription>
                            </CardHeader>
                        </Card>
                        <Card className="bg-gray-800/50">
                            <CardContent className="p-4 space-y-3">
                                <div className="grid grid-cols-2 gap-4">
                                    {(['a', 'b', 'c', 'd'] as const).map(key => (
                                        <div key={key}>
                                            <Label htmlFor={key} className="text-purple-200 text-sm block mb-1">{key}: {matrix[key].toFixed(2)}</Label>
                                            <Slider id={key} min={-2} max={2} step={0.1} value={[matrix[key]]} onValueChange={(v) => handleSliderChange(key, v[0])}/>
                                        </div>
                                    ))}
                                </div>
                                <div className="text-center pt-2">
                                    <p className="text-sm text-gray-400">Determinant: <span className={`font-mono font-bold ${isSingular ? 'text-red-400' : 'text-green-400'}`}>{determinant.toFixed(2)}</span></p>
                                    <p className={`text-sm font-bold mt-2 transition-opacity ${isSingular ? 'text-red-400 opacity-100' : 'opacity-0'}`}>Column Space has collapsed to a line!</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                    <div ref={canvasRef} className="flex-grow min-h-[400px] h-auto rounded-lg border bg-gray-900 overflow-hidden" />
                </div>
            </CardContent>
        </Card>
    );
};

// --- p5.js Drawing Helpers ---

const drawSpanGrid = (v1: p5.Vector, v2: p5.Vector, s: number, p: p5) => {
    p.stroke(72, 144, 226, 50); p.strokeWeight(1);
    const range = 10;
    for (let i = -range; i <= range; i++) {
        const p1 = p5.Vector.add(p5.Vector.mult(v1, i), p5.Vector.mult(v2, -range));
        const p2 = p5.Vector.add(p5.Vector.mult(v1, i), p5.Vector.mult(v2, range));
        p.line(p1.x * s, p1.y * s, p2.x * s, p2.y * s);

        const p3 = p5.Vector.add(p5.Vector.mult(v1, -range), p5.Vector.mult(v2, i));
        const p4 = p5.Vector.add(p5.Vector.mult(v1, range), p5.Vector.mult(v2, i));
        p.line(p3.x * s, p3.y * s, p4.x * s, p4.y * s);
    }
};

const drawSpanLine = (v1: p5.Vector, v2: p5.Vector, s: number, p: p5) => {
    const dominantVec = v1.magSq() > v2.magSq() ? v1 : v2;
    if (dominantVec.magSq() < 0.01) return;

    p.stroke(239, 68, 68, 150);
    p.strokeWeight(3);
    
    const p1 = dominantVec.copy().normalize().mult(-p.width);
    const p2 = dominantVec.copy().normalize().mult(p.width);
    p.line(p1.x * s, p1.y * s, p2.x * s, p2.y * s);
};

const drawVector = (v: p5.Vector, s: number, c: p5.Color, label: string) => {
    const screenV = p5.Vector.mult(v, s);
    p.push();
    p.stroke(c); p.fill(c); p.strokeWeight(4);
    p.line(0, 0, screenV.x, screenV.y);
    
    const headSize = 10;
    const angle = screenV.heading();
    p.translate(screenV.x, screenV.y);
    p.rotate(angle);
    p.triangle(0, 0, -headSize, headSize / 2, -headSize, -headSize / 2);
    p.pop();
    
    if (label) {
        p.push();
        const labelOffset = v.copy().normalize().mult(20);
        const labelPos = screenV.copy().add(labelOffset);
        p.noStroke(); p.fill(c); p.textSize(18); p.textStyle(p.BOLD);
        p.translate(labelPos.x, labelPos.y);
        p.scale(1,-1);
        p.text(label, 0, 0);
        p.pop();
    }
};

export default ColumnSpaceVisualizer;
