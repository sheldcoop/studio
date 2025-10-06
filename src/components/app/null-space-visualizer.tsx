
'use client';

import React, { useState, useEffect, useRef } from 'react';
import p5 from 'p5';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { RotateCcw, Play, Pause } from 'lucide-react';
import { drawGrid as p5DrawGrid, easeInOutCubic } from '@/lib/p5-helpers';

const NullSpaceVisualizer = () => {
    const canvasRef = useRef<HTMLDivElement>(null);
    const sketchRef = useRef<p5 | null>(null);

    const [matrix, setMatrix] = useState({ a: 1, b: -2, c: -2, d: 4 });
    const [determinant, setDeterminant] = useState(0);
    const [progress, setProgress] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const animationFrameId = useRef<number | null>(null);

    useEffect(() => {
        const det = matrix.a * matrix.d - matrix.b * matrix.c;
        setDeterminant(det);
    }, [matrix]);

    useEffect(() => {
        if (sketchRef.current) sketchRef.current.remove();

        const sketch = (p: p5) => {
            const state = {
                matrix,
                progress,
            };

            p.updateWithProps = (props: any) => {
                state.matrix = props.matrix;
                state.progress = props.progress;
            };

            p.setup = () => {
                p.createCanvas(canvasRef.current!.offsetWidth, 400).parent(canvasRef.current!);
            };

            p.draw = () => {
                const t = easeInOutCubic(state.progress);
                const scaleFactor = p.min(p.width, p.height) / 8;
                p.background(17, 24, 39);
                p.translate(p.width / 2, p.height / 2);
                p.scale(1, -1);

                const currentMatrix = {
                    a: p.lerp(1, state.matrix.a, t),
                    b: p.lerp(0, state.matrix.b, t),
                    c: p.lerp(0, state.matrix.c, t),
                    d: p.lerp(1, state.matrix.d, t),
                };

                const det = currentMatrix.a * currentMatrix.d - currentMatrix.b * currentMatrix.c;

                p5DrawGrid(p, p.createVector(currentMatrix.a, currentMatrix.c), p.createVector(currentMatrix.b, currentMatrix.d), p.color(72, 144, 226, 50), 1, scaleFactor);

                if (Math.abs(det) < 0.01) {
                    const nullSpaceVector = p.createVector(-state.matrix.b, state.matrix.a).normalize();
                    drawNullSpace(nullSpaceVector, scaleFactor, p);
                }

                drawPointGrid(currentMatrix, scaleFactor, p);
            };
        };

        sketchRef.current = new p5(sketch, canvasRef.current!);
        return () => sketchRef.current?.remove();
    }, []);

    useEffect(() => {
        if (sketchRef.current && (sketchRef.current as any).updateWithProps) {
            (sketchRef.current as any).updateWithProps({ matrix, progress });
        }
    }, [matrix, progress]);
    
    useEffect(() => {
        if (isPlaying) {
            const animate = () => {
                setProgress(prev => {
                    const next = prev + 0.005;
                    if (next >= 1) { setIsPlaying(false); return 1; }
                    return next;
                });
                animationFrameId.current = requestAnimationFrame(animate);
            };
            animationFrameId.current = requestAnimationFrame(animate);
        }
        return () => { if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current); };
    }, [isPlaying]);

    const handleSliderChange = (key: 'a' | 'b' | 'c' | 'd', value: number) => {
        setMatrix(prev => ({ ...prev, [key]: value }));
        if (isPlaying) setIsPlaying(false);
        setProgress(1);
    };
    
    const resetAnimation = () => {
        setIsPlaying(false);
        setProgress(0);
    }
    
    const togglePlay = () => {
        if (progress >= 1) setProgress(0);
        setIsPlaying(!isPlaying);
    }

    return (
        <Card className="bg-transparent border-0 shadow-none">
            <CardContent className="p-0">
                <div className="bg-black/30 backdrop-blur-xl rounded-xl p-4 md:p-6 shadow-2xl border border-purple-500/20 flex flex-col lg:flex-row gap-6">
                    <div className="w-full lg:w-[28rem] flex-shrink-0 space-y-4">
                        <Card className="bg-gray-800/50">
                            <CardHeader className="p-4">
                                <CardTitle className="text-cyan-400">The Kernel of a Transformation</CardTitle>
                                <CardDescription className="text-gray-400">
                                    The Null Space (or Kernel) is the set of all vectors that are "squashed" to the origin by a transformation. When the determinant is zero, a non-trivial null space appears as a line of glowing red vectors, all collapsing to zero.
                                </CardDescription>
                            </CardHeader>
                        </Card>
                        <Card className="bg-gray-800/50">
                            <CardContent className="p-4 space-y-3">
                                <div className="grid grid-cols-2 gap-4">
                                    {(['a', 'b', 'c', 'd'] as const).map(key => (
                                        <div key={key}>
                                            <Label htmlFor={key} className="text-purple-200 text-sm block mb-1">{key}: {matrix[key].toFixed(2)}</Label>
                                            <Slider id={key} min={-4} max={4} step={0.1} value={[matrix[key]]} onValueChange={(v) => handleSliderChange(key, v[0])}/>
                                        </div>
                                    ))}
                                </div>
                                <div className="text-center pt-2">
                                    <p className="text-sm text-gray-400">Determinant: <span className={`font-mono font-bold ${Math.abs(determinant) < 0.01 ? 'text-red-400' : 'text-green-400'}`}>{determinant.toFixed(2)}</span></p>
                                </div>
                                <Button onClick={() => setMatrix({ a: 1, b: -2, c: -2, d: 4 })} variant="outline" className="w-full"><RotateCcw className="w-4 h-4 mr-2"/>Set to Singular Matrix</Button>
                            </CardContent>
                        </Card>
                         <Card className="bg-gray-800/50">
                            <CardContent className="p-4 flex items-center gap-4">
                                 <Button onClick={togglePlay} className="px-4 py-3">
                                    {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                                </Button>
                                <Slider value={[progress]} min={0} max={1} step={0.01} onValueChange={(v) => {setProgress(v[0]); setIsPlaying(false);}} />
                                <Button onClick={resetAnimation} variant="ghost"><RotateCcw className="w-4 h-4"/></Button>
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
const drawPointGrid = (m: {a:number,b:number,c:number,d:number}, s: number, p: p5) => {
    p.noStroke();
    const range = 8;
    const det = m.a * m.d - m.b * m.c;
    const isSingular = Math.abs(det) < 0.01;

    for (let i = -range; i <= range; i+=0.5) {
        for (let j = -range; j <= range; j+=0.5) {
            const tx = (m.a*i + m.b*j)*s;
            const ty = (m.c*i + m.d*j)*s;
            
            let color = p.color(147, 197, 253, 50);
            
            if (isSingular) {
                const nullSpaceVector = p.createVector(-m.b, m.a);
                const inputVector = p.createVector(i, j);
                const dot = nullSpaceVector.dot(inputVector);
                if (Math.abs(dot) < 0.1) {
                    const alpha = p.map(p.dist(tx,ty,0,0), 0, 30, 255, 50);
                    color = p.color(239, 68, 68, alpha); // Red for null space vectors
                }
            }
            
            p.fill(color);
            p.ellipse(tx, ty, 4, 4);
        }
    }
};

const drawNullSpace = (v: p5.Vector, s: number, p: p5) => {
    p.stroke(239, 68, 68, 150);
    p.strokeWeight(3);
    const p1 = v.copy().mult(-p.width);
    const p2 = v.copy().mult(p.width);
    p.line(p1.x * s, p1.y * s, p2.x * s, p2.y * s);
};


export default NullSpaceVisualizer;

    