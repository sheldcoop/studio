
'use client';

import React, { useState, useEffect, useRef } from 'react';
import p5 from 'p5';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { drawGrid, drawVector, easeInOutCubic } from '@/lib/p5';
import { applyMatrix } from '@/lib/math';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const MatrixOperationsVisualizer = () => {
    const canvasRef = useRef<HTMLDivElement>(null);
    const sketchRef = useRef<p5 | null>(null);

    const [op, setOp] = useState('add');
    const [scalar, setScalar] = useState(1.5);
    const [progress, setProgress] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const animationFrameId = useRef<number | null>(null);

    useEffect(() => {
        if (sketchRef.current) sketchRef.current.remove();
        if (!canvasRef.current) return;

        const sketch = (p: p5) => {
            let state = { op: 'add', progress: 0, scalar: 1.5 };
            
            (p as any).updateWithProps = (props: any) => { state = { ...state, ...props }; };
            
            p.setup = () => p.createCanvas(canvasRef.current!.offsetWidth, canvasRef.current!.offsetHeight).parent(canvasRef.current!);

            p.draw = () => {
                const t = easeInOutCubic(state.progress);
                const scaleFactor = p.min(p.width, p.height) / 8;
                p.background(17, 24, 39);
                p.translate(p.width / 2, p.height / 2); p.scale(1, -1);

                const v = p.createVector(1.5, 2);
                const M1 = { a: 1.5, b: -0.5, c: 0.5, d: 1 };
                const M2 = { a: 0.5, b: 0.5, c: -0.5, d: 1.5 };
                
                let M_res;
                let v_start = v;
                let v_intermediate: p5.Vector | null = null;
                let v_final: p5.Vector;
                
                drawGrid(p, p.createVector(1,0), p.createVector(0,1), p.color(55,65,81), 1, scaleFactor);

                switch (state.op) {
                    case 'add':
                        M_res = { a: M1.a + M2.a, b: M1.b + M2.b, c: M1.c + M2.c, d: M1.d + M2.d };
                        v_final = applyMatrix(p, M_res, v);
                        break;
                    case 'scalar':
                        M_res = { a: M1.a * state.scalar, b: M1.b * state.scalar, c: M1.c * state.scalar, d: M1.d * state.scalar };
                        v_final = applyMatrix(p, M_res, v);
                        break;
                    case 'multiply':
                        M_res = { a: M1.a*M2.a + M1.b*M2.c, b: M1.a*M2.b + M1.b*M2.d, c: M1.c*M2.a + M1.d*M2.c, d: M1.c*M2.b + M1.d*M2.d };
                        v_intermediate = applyMatrix(p, M2, v);
                        v_final = applyMatrix(p, M1, v_intermediate);
                        break;
                    default:
                        v_final = v_start;
                }
                
                let v_current;
                if (state.op === 'multiply' && v_intermediate) {
                    if (t <= 0.5) {
                        v_current = p5.Vector.lerp(v_start, v_intermediate, t * 2);
                    } else {
                        v_current = p5.Vector.lerp(v_intermediate, v_final, (t - 0.5) * 2);
                    }
                } else {
                    v_current = p5.Vector.lerp(v_start, v_final, t);
                }

                drawVector(p, v_start, scaleFactor, p.color(255, 255, 255, 50), 'x');
                if(v_intermediate && state.op === 'multiply') {
                    drawVector(p, v_intermediate, scaleFactor, p.color(250, 204, 21, 100), 'Bx');
                }
                drawVector(p, v_current, scaleFactor, p.color(134, 239, 172), state.op === 'multiply' ? 'ABx' : state.op === 'add' ? '(A+B)x' : 'sAx');
            };

            p.windowResized = () => p.resizeCanvas(canvasRef.current!.offsetWidth, canvasRef.current!.offsetHeight);
        };
        
        sketchRef.current = new p5(sketch, canvasRef.current!);
        return () => sketchRef.current?.remove();
    }, []);

    useEffect(() => {
        if(sketchRef.current && (sketchRef.current as any).updateWithProps) {
            (sketchRef.current as any).updateWithProps({ op, progress, scalar });
        }
    }, [op, progress, scalar]);
    
    useEffect(() => {
        if (isPlaying) {
            const animate = () => {
                setProgress(prev => {
                    const next = prev + 0.008;
                    if (next >= 1) { setIsPlaying(false); return 1; }
                    animationFrameId.current = requestAnimationFrame(animate);
                    return next;
                });
            };
            animationFrameId.current = requestAnimationFrame(animate);
        }
        return () => { if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current); };
    }, [isPlaying]);

    const togglePlay = () => { if (isPlaying) return; if (progress >= 1) setProgress(0); setIsPlaying(true); };

    return (
        <Card className="bg-transparent border-0 shadow-none">
            <CardContent className="p-0">
                <div className="bg-black/30 backdrop-blur-xl rounded-xl p-4 shadow-2xl border border-purple-500/20">
                    <div ref={canvasRef} className="w-full h-[300px] md:h-[400px] rounded-xl shadow-2xl bg-gray-900/50 mb-4" />
                    <Tabs value={op} onValueChange={(val) => { setOp(val); setProgress(0); setIsPlaying(false); }} className="w-full">
                        <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger value="add">Addition</TabsTrigger>
                            <TabsTrigger value="scalar">Scalar Multiplication</TabsTrigger>
                            <TabsTrigger value="multiply">Matrix Multiplication</TabsTrigger>
                        </TabsList>
                        <TabsContent value="add" className="text-center text-sm text-muted-foreground p-2">Applies the transformation (A+B) to vector x.</TabsContent>
                        <TabsContent value="scalar" className="text-center text-sm text-muted-foreground p-2">
                             <Label>Scalar: {scalar.toFixed(1)}</Label>
                             <Slider min={-2} max={3} step={0.1} value={[scalar]} onValueChange={v => setScalar(v[0])} />
                        </TabsContent>
                        <TabsContent value="multiply" className="text-center text-sm text-muted-foreground p-2">Applies B, then A. The result is (AB)x. The yellow vector shows the intermediate step Bx.</TabsContent>
                    </Tabs>
                    <div className="flex items-center gap-4 mt-4">
                        <Button onClick={togglePlay} className="w-full" disabled={isPlaying}>Animate</Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default MatrixOperationsVisualizer;
