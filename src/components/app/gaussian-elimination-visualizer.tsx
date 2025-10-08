
'use client';

import React, { useState, useEffect, useRef } from 'react';
import p5 from 'p5';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { RotateCcw } from 'lucide-react';
import { drawGrid, easeInOutCubic, drawLine, drawPoint } from '@/lib/p5';
import { calculate2x2Solution } from '@/lib/math';

// Type definition for our system of equations matrix
type SystemMatrix = { a11: number; a12: number; b1: number; a21: number; a22: number; b2: number; };

/**
 * Linearly interpolates between two system matrices. This is a specific
 * helper for this component to ensure type safety during animation.
 */
const lerpSystemMatrix = (p: p5, m1: SystemMatrix, m2: SystemMatrix, t: number): SystemMatrix => {
    return {
        a11: p.lerp(m1.a11, m2.a11, t),
        a12: p.lerp(m1.a12, m2.a12, t),
        b1: p.lerp(m1.b1, m2.b1, t),
        a21: p.lerp(m1.a21, m2.a21, t),
        a22: p.lerp(m1.a22, m2.a22, t),
        b2: p.lerp(m1.b2, m2.b2, t),
    };
};


const GaussianEliminationVisualizer = () => {
    const canvasRef = useRef<HTMLDivElement>(null);
    const sketchRef = useRef<p5 | null>(null);

    const [matrix, setMatrix] = useState<SystemMatrix>({ a11: 2, a12: -1, b1: 1, a21: 1, a22: 1, b2: 5 });
    const [animationState, setAnimationState] = useState({ 
        active: false, 
        progress: 0, 
        duration: 45, 
        startState: matrix, 
        endState: matrix, 
        isScaling: false 
    });
    const [sliders, setSliders] = useState({ k1: 0, k2: 0, s1: 1, s2: 1 });
    const solution = calculate2x2Solution(matrix);
    
    // This effect runs the p5.js animation loop.
    useEffect(() => {
        let frameId: number;

        const animate = () => {
            if (animationState.active) {
                setAnimationState(prev => {
                    const nextProgress = prev.progress + 1;
                    if (nextProgress >= prev.duration) {
                        setMatrix(prev.endState);
                        return { ...prev, active: false, progress: 0 };
                    }
                    return { ...prev, progress: nextProgress };
                });
            }
            frameId = requestAnimationFrame(animate);
        };

        frameId = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(frameId);

    }, [animationState.active, animationState.endState]);


    useEffect(() => {
        if (sketchRef.current) sketchRef.current.remove();
        if (!canvasRef.current) return;

        const sketch = (p: p5) => {
             const componentState = {
                matrix: matrix,
                animation: animationState
            };

            // This function allows the p5 sketch to receive updated props from React
            (p as any).updateWithProps = (props: any) => {
                componentState.matrix = props.matrix;
                componentState.animation = props.animation;
            };

            p.setup = () => {
                p.createCanvas(canvasRef.current!.offsetWidth, canvasRef.current!.offsetHeight).parent(canvasRef.current!);
                p.remove(); // Disable p5.js default unload event listener
                p.noLoop(); // We will manually redraw when state changes
            };

            p.draw = () => {
                const { matrix: staticMatrix, animation } = componentState;
                const scaleFactor = p.min(p.width, p.height) / 10;
                p.background(17, 24, 39);
                p.translate(p.width / 2, p.height / 2);
                p.scale(1, -1);

                drawGrid(p, p.createVector(1,0), p.createVector(0,1), p.color(55, 65, 81), 1, scaleFactor);

                let currentMatrix = staticMatrix;
                if (animation.active) {
                    const t = easeInOutCubic(animation.progress / animation.duration);
                    currentMatrix = lerpSystemMatrix(p, animation.startState, animation.endState, t);
                }
                
                drawLine(p, currentMatrix.a11, currentMatrix.a12, currentMatrix.b1, scaleFactor, p.color(134, 239, 172)); // green
                drawLine(p, currentMatrix.a21, currentMatrix.a22, currentMatrix.b2, scaleFactor, p.color(147, 197, 253)); // blue
                
                const sol = calculate2x2Solution(currentMatrix);
                if (sol) {
                    let pointColor = p.color(250, 204, 21); // yellow
                    let pulseSize = 12;
                     if (animation.active && !animation.isScaling) {
                        const pulse = 1 + p.sin(animation.progress * 0.2) * 0.4;
                        pulseSize = 12 * pulse;
                    }
                    drawPoint(p, p.createVector(sol.x, sol.y), scaleFactor, pointColor, pulseSize)
                }
            };
            
            p.windowResized = () => {
                if (canvasRef.current) {
                    p.resizeCanvas(canvasRef.current!.offsetWidth, canvasRef.current!.offsetHeight);
                }
            };
        };

        sketchRef.current = new p5(sketch, canvasRef.current!);
        return () => { sketchRef.current?.remove(); };
    }, []);
    
    // Pass updated state to p5 sketch and request redraw
    useEffect(() => {
        if (sketchRef.current && (sketchRef.current as any).updateWithProps) {
            (sketchRef.current as any).updateWithProps({ matrix, animation: animationState });
            sketchRef.current.redraw();
        }
    }, [matrix, animationState]);

    const handleInputChange = (key: keyof SystemMatrix, value: string) => {
        setMatrix(prev => ({ ...prev, [key]: parseFloat(value) || 0 }));
        setAnimationState(a => ({ ...a, active: false })); // Stop any running animation
    };

    const startAnimation = (endState: SystemMatrix, isScaling = false) => {
        if (animationState.active) return;
        setAnimationState({
            startState: { ...matrix },
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
            case 'op1': { const k = sliders.k1; endState.a21 += k * matrix.a11; endState.a22 += k * matrix.a12; endState.b2 += k * matrix.b1; startAnimation(endState); break; }
            case 'op2': { const k = sliders.k2; endState.a11 += k * matrix.a21; endState.a12 += k * matrix.a22; endState.b1 += k * matrix.b2; startAnimation(endState); break; }
            case 'scale1': { const k = sliders.s1; endState.a11 *= k; endState.a12 *= k; endState.b1 *= k; startAnimation(endState, true); break; }
            case 'scale2': { const k = sliders.s2; endState.a21 *= k; endState.a22 *= k; endState.b2 *= k; startAnimation(endState, true); break; }
            case 'swap': { endState = { a11: matrix.a21, a12: matrix.a22, b1: matrix.b2, a21: matrix.a11, a22: matrix.a12, b2: matrix.b1 }; startAnimation(endState); break; }
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
                                <h1 className="text-2xl font-bold text-cyan-400">The Dance of Lines</h1>
                                <p className="text-gray-400 mt-1 text-sm">
                                    Each row in the matrix represents a line. The solution is their intersection. Row operations are geometric moves: adding a multiple of one row to another **pivots** a line around the intersection point. The goal is to make the lines horizontal and vertical to easily read the solution.
                                </p>
                            </CardHeader>
                            <CardContent className="p-4 pt-0">
                                <div className="flex items-center justify-center space-x-2 p-4 rounded-lg bg-gray-900/50">
                                    <div className="p-2 border-r-2 border-l-2 border-gray-500 rounded">
                                        <div className="flex items-center space-x-2 mb-1">
                                            <Input type="number" value={matrix.a11} onChange={(e) => handleInputChange('a11', e.target.value)} step="0.5" className={cn("matrix-val", isZero(matrix.a11) && "is-zero")} />
                                            <Input type="number" value={matrix.a12} onChange={(e) => handleInputChange('a12', e.target.value)} step="0.5" className={cn("matrix-val", isZero(matrix.a12) && "is-zero")} />
                                            <span className="text-gray-500">|</span>
                                            <Input type="number" value={matrix.b1} onChange={(e) => handleInputChange('b1', e.target.value)} step="0.5" className="matrix-val" />
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Input type="number" value={matrix.a21} onChange={(e) => handleInputChange('a21', e.target.value)} step="0.5" className={cn("matrix-val", isZero(matrix.a21) && "is-zero")} />
                                            <Input type="number" value={matrix.a22} onChange={(e) => handleInputChange('a22', e.target.value)} step="0.5" className={cn("matrix-val", isZero(matrix.a22) && "is-zero")} />
                                            <span className="text-gray-500">|</span>
                                            <Input type="number" value={matrix.b2} onChange={(e) => handleInputChange('b2', e.target.value)} step="0.5" className="matrix-val" />
                                        </div>
                                    </div>
                                </div>
                                <Button onClick={() => { setMatrix({ a11: 2, a12: -1, b1: 1, a21: 1, a22: 1, b2: 5 }); setAnimationState(a => ({...a, active: false})); }} variant="outline" className="w-full mt-3"><RotateCcw className="w-4 h-4 mr-2"/>Reset Matrix</Button>
                            </CardContent>
                        </Card>
                        <Card className="bg-gray-800/50">
                            <CardHeader className="p-4"><h2 className="text-lg font-semibold text-cyan-400">Row Operations</h2></CardHeader>
                            <CardContent className="p-4 pt-0 space-y-3">
                                <div className="space-y-3 border-b border-gray-700 pb-3">
                                    <div className="flex items-center space-x-2"><span>R₂ → R₂ +</span><Slider min={-2} max={2} value={[sliders.k1]} step={0.1} onValueChange={v => setSliders(s => ({...s, k1: v[0]}))} className="w-full" /><span className="font-mono w-20 text-center">({sliders.k1.toFixed(1)}) * R₁</span><Button onClick={() => handleOperation('op1')} className="op-button" size="sm" disabled={animationState.active}>Go</Button></div>
                                    <div className="flex items-center space-x-2"><span>R₁ → R₁ +</span><Slider min={-2} max={2} value={[sliders.k2]} step={0.1} onValueChange={v => setSliders(s => ({...s, k2: v[0]}))} className="w-full" /><span className="font-mono w-20 text-center">({sliders.k2.toFixed(1)}) * R₂</span><Button onClick={() => handleOperation('op2')} className="op-button" size="sm" disabled={animationState.active}>Go</Button></div>
                                </div>
                                <div className="space-y-3 pt-2">
                                    <div className="flex items-center space-x-2"><span>R₁ →</span><Slider min={0.1} max={3} value={[sliders.s1]} step={0.1} onValueChange={v => setSliders(s => ({...s, s1: v[0]}))} className="w-full" /><span className="font-mono w-20 text-center">({sliders.s1.toFixed(1)}) * R₁</span><Button onClick={() => handleOperation('scale1')} className="op-button bg-purple-600" size="sm" disabled={animationState.active}>Go</Button></div>
                                    <div className="flex items-center space-x-2"><span>R₂ →</span><Slider min={0.1} max={3} value={[sliders.s2]} step={0.1} onValueChange={v => setSliders(s => ({...s, s2: v[0]}))} className="w-full" /><span className="font-mono w-20 text-center">({sliders.s2.toFixed(1)}) * R₂</span><Button onClick={() => handleOperation('scale2')} className="op-button bg-purple-600" size="sm" disabled={animationState.active}>Go</Button></div>
                                </div>
                                <Button onClick={() => handleOperation('swap')} variant="secondary" className="w-full !mt-4" disabled={animationState.active}>Swap R₁ and R₂</Button>
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
