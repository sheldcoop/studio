
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
import { drawGrid as p5DrawGrid, easeInOutCubic } from '@/lib/p5-helpers';


const GaussianEliminationVisualizer = () => {
    const canvasRef = useRef<HTMLDivElement>(null);
    const sketchRef = useRef<p5 | null>(null);

    const [matrix, setMatrix] = useState({ a11: 2, a12: -1, b1: 1, a21: 1, a22: 1, b2: 5 });
    const [animation, setAnimation] = useState({ active: false, progress: 0, duration: 45, startState: null, endState: null, isScaling: false });
    const [sliders, setSliders] = useState({ k1: 0, k2: 0, s1: 1, s2: 1 });
    const [solution, setSolution] = useState<{ x: number, y: number } | null>(null);

    const updateStateFromUI = () => {
        const newMatrix: { [key: string]: number } = {};
        for (const key in matrix) {
            const el = document.getElementById(key) as HTMLInputElement;
            if (el) {
                newMatrix[key] = parseFloat(el.value) || 0;
            }
        }
        setMatrix(newMatrix as any);
    };
    
    useEffect(() => {
        const sol = calculateSolution(matrix);
        setSolution(sol);
    }, [matrix]);

    useEffect(() => {
        if (sketchRef.current) {
            sketchRef.current.remove();
        }
        const sketch = new p5((p: p5) => {
            let currentAnimation = animation;

            p.setup = () => {
                const container = canvasRef.current!;
                p.createCanvas(container.offsetWidth, container.offsetHeight).parent(container);
            };

            p.draw = () => {
                const scaleFactor = p.min(p.width, p.height) / 10;
                p.background(17, 24, 39);
                p.translate(p.width / 2, p.height / 2);
                p.scale(1, -1);

                p5DrawGrid(p, p.createVector(1,0), p.createVector(0,1), p.color(55, 65, 81), 1, scaleFactor);

                let currentMatrix = matrix;
                if (currentAnimation.active) {
                    currentAnimation.progress++;
                    const t = easeInOutCubic(currentAnimation.progress / currentAnimation.duration);
                    currentMatrix = lerpMatrix(p, currentAnimation.startState!, currentAnimation.endState!, t);
                    
                    if (currentAnimation.progress >= currentAnimation.duration) {
                        currentAnimation.active = false;
                        setMatrix(currentAnimation.endState as any);
                    }
                    setAnimation({...currentAnimation});
                }
                
                drawLine(p, currentMatrix.a11, currentMatrix.a12, currentMatrix.b1, scaleFactor, p.color(134, 239, 172)); // green
                drawLine(p, currentMatrix.a21, currentMatrix.a22, currentMatrix.b2, scaleFactor, p.color(147, 197, 253)); // blue
                
                const sol = calculateSolution(currentMatrix);
                if (sol) {
                    p.noStroke();
                    if (currentAnimation.active && !currentAnimation.isScaling) {
                        const pulse = 1 + p.sin(currentAnimation.progress * 0.2) * 0.4;
                        p.fill(250, 204, 21, 255); // yellow
                        p.ellipse(sol.x * scaleFactor, sol.y * scaleFactor, 12 * pulse, 12 * pulse);
                    }
                    p.fill(250, 204, 21); // yellow
                    p.ellipse(sol.x * scaleFactor, sol.y * scaleFactor, 12, 12);
                }
            };
            
            p.windowResized = () => {
                if (canvasRef.current) {
                    p.resizeCanvas(canvasRef.current.offsetWidth, canvasRef.current.offsetHeight);
                }
            };
        });

        sketchRef.current = sketch;
        return () => { sketchRef.current?.remove(); };

    }, [matrix, animation]);


    const startAnimation = (endState: any, isScaling = false) => {
        if (animation.active) return;
        setAnimation({
            startState: { ...matrix } as any,
            endState: endState,
            progress: 0,
            active: true,
            duration: 45,
            isScaling,
        });
    };

    const handleOperation = (type: string) => {
        let endState = { ...matrix };
        switch(type) {
            case 'op1': {
                const k = sliders.k1;
                endState.a21 += k * matrix.a11; endState.a22 += k * matrix.a12; endState.b2 += k * matrix.b1;
                startAnimation(endState);
                break;
            }
            case 'op2': {
                const k = sliders.k2;
                endState.a11 += k * matrix.a21; endState.a12 += k * matrix.a22; endState.b1 += k * matrix.b2;
                startAnimation(endState);
                break;
            }
            case 'scale1': {
                 const k = sliders.s1;
                 endState.a11 *= k; endState.a12 *= k; endState.b1 *= k;
                 startAnimation(endState, true);
                break;
            }
            case 'scale2': {
                 const k = sliders.s2;
                 endState.a21 *= k; endState.a22 *= k; endState.b2 *= k;
                 startAnimation(endState, true);
                break;
            }
            case 'swap': {
                endState = { 
                    a11: matrix.a21, a12: matrix.a22, b1: matrix.b2,
                    a21: matrix.a11, a22: matrix.a12, b2: matrix.b1
                };
                startAnimation(endState);
                break;
            }
            default: break;
        }
    }
    
    const isZero = (val: number) => Math.abs(val) < 0.01;

    return (
        <Card className="bg-transparent border-0 shadow-none">
            <CardContent className="p-0">
                <div className="bg-black/30 backdrop-blur-xl rounded-xl p-4 md:p-6 shadow-2xl border border-purple-500/20 flex flex-col lg:flex-row gap-6">
                    <div className="w-full lg:w-[32rem] flex-shrink-0 space-y-3">
                        <Card className="bg-gray-800/50">
                            <CardHeader className="p-4">
                                <CardTitle className="text-cyan-400">A Dance of Lines</CardTitle>
                                <CardDescription className="text-gray-400">
                                    Row operations are geometric moves. Use them to make the lines horizontal and vertical, revealing the solution at their intersection. A green box means you've successfully created a zero!
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="p-4 pt-0">
                                <div className="flex items-center justify-center space-x-2 p-4 rounded-lg bg-gray-900/50">
                                    <div className="p-2 border-r-2 border-l-2 border-gray-500 rounded">
                                        <div className="flex items-center space-x-2 mb-1">
                                            <Input id="a11" type="number" value={matrix.a11} onChange={updateStateFromUI} step="0.5" className={cn("matrix-val", isZero(matrix.a12) && "is-zero")} />
                                            <Input id="a12" type="number" value={matrix.a12} onChange={updateStateFromUI} step="0.5" className={cn("matrix-val", isZero(matrix.a12) && "is-zero")} />
                                            <span className="text-gray-500">|</span>
                                            <Input id="b1" type="number" value={matrix.b1} onChange={updateStateFromUI} step="0.5" className="matrix-val" />
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Input id="a21" type="number" value={matrix.a21} onChange={updateStateFromUI} step="0.5" className={cn("matrix-val", isZero(matrix.a21) && "is-zero")} />
                                            <Input id="a22" type="number" value={matrix.a22} onChange={updateStateFromUI} step="0.5" className="matrix-val" />
                                            <span className="text-gray-500">|</span>
                                            <Input id="b2" type="number" value={matrix.b2} onChange={updateStateFromUI} step="0.5" className="matrix-val" />
                                        </div>
                                    </div>
                                </div>
                                <Button id="reset-matrix" onClick={() => setMatrix({ a11: 2, a12: -1, b1: 1, a21: 1, a22: 1, b2: 5 })} variant="outline" className="w-full mt-3"><RotateCcw className="w-4 h-4 mr-2"/>Reset Matrix</Button>
                            </CardContent>
                        </Card>
                        <Card className="bg-gray-800/50">
                            <CardHeader className="p-4">
                                <CardTitle className="text-cyan-400">Row Operations</CardTitle>
                            </CardHeader>
                            <CardContent className="p-4 pt-0 space-y-3">
                                <div className="space-y-3 border-b border-gray-700 pb-3">
                                    <div className="flex items-center space-x-2"><span>R₂ → R₂ +</span><Slider min={-2} max={2} value={[sliders.k1]} step={0.1} onValueChange={v => setSliders(s => ({...s, k1: v[0]}))} className="w-full" /><span className="font-mono w-20 text-center">({sliders.k1.toFixed(1)}) * R₁</span><Button onClick={() => handleOperation('op1')} className="op-button" size="sm">Go</Button></div>
                                    <div className="flex items-center space-x-2"><span>R₁ → R₁ +</span><Slider min={-2} max={2} value={[sliders.k2]} step={0.1} onValueChange={v => setSliders(s => ({...s, k2: v[0]}))} className="w-full" /><span className="font-mono w-20 text-center">({sliders.k2.toFixed(1)}) * R₂</span><Button onClick={() => handleOperation('op2')} className="op-button" size="sm">Go</Button></div>
                                </div>
                                <div className="space-y-3 pt-2">
                                    <div className="flex items-center space-x-2"><span>R₁ →</span><Slider min={0.1} max={3} value={[sliders.s1]} step={0.1} onValueChange={v => setSliders(s => ({...s, s1: v[0]}))} className="w-full" /><span className="font-mono w-20 text-center">({sliders.s1.toFixed(1)}) * R₁</span><Button onClick={() => handleOperation('scale1')} className="op-button bg-purple-600" size="sm">Go</Button></div>
                                    <div className="flex items-center space-x-2"><span>R₂ →</span><Slider min={0.1} max={3} value={[sliders.s2]} step={0.1} onValueChange={v => setSliders(s => ({...s, s2: v[0]}))} className="w-full" /><span className="font-mono w-20 text-center">({sliders.s2.toFixed(1)}) * R₂</span><Button onClick={() => handleOperation('scale2')} className="op-button bg-purple-600" size="sm">Go</Button></div>
                                </div>
                                <Button onClick={() => handleOperation('swap')} variant="secondary" className="w-full !mt-4">Swap R₁ and R₂</Button>
                            </CardContent>
                        </Card>
                        <div className="text-center text-lg font-mono p-2 rounded bg-gray-900/50">
                            Solution (x, y) = {solution ? `(${solution.x.toFixed(2)}, ${solution.y.toFixed(2)})` : 'No unique solution'}
                        </div>
                    </div>
                    <div ref={canvasRef} className="flex-grow min-h-[400px] h-auto rounded-lg border bg-gray-900 overflow-hidden" />
                </div>
            </CardContent>
        </Card>
    );
};
export default GaussianEliminationVisualizer;

// --- p5.js Helper Functions (to be used within the sketch) ---
const drawLine = (p: p5, a: number, b: number, c: number, s: number, col: p5.Color) => {
    p.push();
    p.stroke(col); p.strokeWeight(3);
    let x1, y1, x2, y2;
    const limit = p.max(p.width, p.height) * 2;
    if (Math.abs(b) > 1e-9) {
        x1 = -limit; y1 = (c - a * x1) / b;
        x2 = limit; y2 = (c - a * x2) / b;
    } else {
        if (Math.abs(a) < 1e-9) return;
        x1 = c / a; y1 = -limit;
        x2 = c / a; y2 = limit;
    }
    p.line(x1 * s, y1 * s, x2 * s, y2 * s);
    p.pop();
};

const calculateSolution = (m: { a11: number; a12: number; b1: number; a21: number; a22: number; b2: number; }) => {
    const det = m.a11 * m.a22 - m.a12 * m.a21;
    if (Math.abs(det) < 1e-9) return null;
    const x = (m.b1 * m.a22 - m.b2 * m.a12) / det;
    const y = (m.a11 * m.b2 - m.a21 * m.b1) / det;
    return { x, y };
};

const lerpMatrix = (p: p5, m1: any, m2: any, t: number) => {
    const res: { [key: string]: number } = {};
    for (const key in m1) {
        res[key] = p.lerp(m1[key], m2[key], t);
    }
    return res as any;
};

    