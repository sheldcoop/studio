
'use client';

import React, { useState, useEffect, useRef } from 'react';
import p5 from 'p5';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { drawGrid, drawVector, easeInOutCubic, lerpMatrix } from '@/lib/p5';
import { applyMatrix } from '@/lib/math';

const LUDecompositionVisualizer = () => {
    const canvasRef = useRef<HTMLDivElement>(null);
    const sketchRef = useRef<p5 | null>(null);

    const [matrix, setMatrix] = useState({ a: 2, b: 1, c: 1, d: 3 });
    const [luData, setLuData] = useState<any>(null);
    const [story, setStory] = useState({ title: '', desc: '' });
    const [progress, setProgress] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const animationFrameId = useRef<number | null>(null);

    useEffect(() => {
        const {a, b, c, d} = matrix;
        if (Math.abs(a) < 1e-4) { setLuData(null); return; }
        const u11 = a; const u12 = b;
        const l21 = c / a;
        const u22 = d - l21 * b;
        if (Math.abs(u22) < 1e-4) { setLuData(null); return; }
        const L = { a: 1, b: 0, c: l21, d: 1 };
        const U = { a: u11, b: u12, c: 0, d: u22 };
        setLuData({ L, U });
    }, [matrix]);

    useEffect(() => {
        if (sketchRef.current) sketchRef.current.remove();
        if (!canvasRef.current) return;

        const sketch = (p: p5) => {
            let p5State = {
                progress: 0,
                matrixA: { a: 2, b: 1, c: 1, d: 3 },
                LU: null as any,
                xVec: p.createVector(2, -1),
                yVec: p.createVector(0,0),
                bVec: p.createVector(0,0),
            };

            (p as any).updateWithProps = (props: any) => {
                p5State.progress = props.progress;
                p5State.matrixA = props.matrix;
                p5State.LU = props.luData;
                if(props.luData) {
                    const bVec = applyMatrix(p5State.xVec, props.matrix);
                    p5State.bVec = p.createVector(bVec.x, bVec.y);
                    const y1 = p5State.bVec.x;
                    const y2 = p5State.bVec.y - props.luData.L.c * y1;
                    p5State.yVec = p.createVector(y1, y2);
                }
            };

            p.setup = () => p.createCanvas(canvasRef.current!.offsetWidth, canvasRef.current!.offsetHeight).parent(canvasRef.current!);

            p.draw = () => {
                const { progress, matrixA, LU, xVec, yVec, bVec } = p5State;
                const t = easeInOutCubic(progress);
                const scaleFactor = p.min(p.width, p.height) / 10;
                p.background(17, 24, 39);
                p.translate(p.width / 2, p.height / 2); p.scale(1, -1);
                if (!LU) { p.fill(255, 100, 100); p.textAlign(p.CENTER); p.text("LU Decomposition not possible (pivot is zero).", 0, 0); return; }

                const t1_end = 0.25, t2_end = 0.5, t3_end = 1.0;

                if (t < t1_end) {
                    const t1 = p.map(t, 0, t1_end, 0, 1);
                    const b1_A = applyMatrix({x: 1, y: 0}, matrixA); 
                    const b2_A = applyMatrix({x: 0, y: 1}, matrixA);
                    const b1 = p5.Vector.lerp(p.createVector(1,0), p.createVector(b1_A.x, b1_A.y), t1); 
                    const b2 = p5.Vector.lerp(p.createVector(0,1), p.createVector(b2_A.x, b2_A.y), t1);
                    const currentVec = p5.Vector.lerp(xVec, bVec, t1);
                    drawGrid(p, b1, b2, p.color(55, 65, 81), 1, scaleFactor);
                    drawVector(p, xVec, scaleFactor, p.color(167, 139, 250, 100), 'x');
                    drawVector(p, currentVec, scaleFactor, p.color(248, 113, 113), 'Ax=b');
                } else if (t < t2_end) {
                    const t2 = p.map(t, t1_end, t2_end, 0, 1);
                    const b1_L_inv = applyMatrix({x:1, y:0}, {a:1, b:0, c:-LU.L.c, d:1}); 
                    const b2_L_inv = applyMatrix({x:0, y:1}, {a:1, b:0, c:-LU.L.c, d:1});
                    const b1 = p5.Vector.lerp(p.createVector(1,0), p.createVector(b1_L_inv.x, b1_L_inv.y), t2); 
                    const b2 = p5.Vector.lerp(p.createVector(0,1), p.createVector(b2_L_inv.x, b2_L_inv.y), t2);
                    const currentVec = p5.Vector.lerp(bVec, yVec, t2);
                    drawGrid(p, b1, b2, p.color(55, 65, 81), 1, scaleFactor);
                    drawVector(p, bVec, scaleFactor, p.color(244, 114, 182, 100), 'b');
                    drawVector(p, currentVec, scaleFactor, p.color(96, 165, 250), 'y');
                } else {
                    const t3 = p.map(t, t2_end, t3_end, 0, 1);
                    const inv_u11=1/LU.U.a, inv_u12=-LU.U.b/(LU.U.a*LU.U.d), inv_u22=1/LU.U.d;
                    const b1_U_inv = applyMatrix({x:1, y:0}, {a:inv_u11, b:inv_u12, c:0, d:inv_u22}); 
                    const b2_U_inv = applyMatrix({x:0, y:1}, {a:inv_u11, b:inv_u12, c:0, d:inv_u22});
                    const b1 = p5.Vector.lerp(p.createVector(1,0), p.createVector(b1_U_inv.x, b1_U_inv.y), t3); 
                    const b2 = p5.Vector.lerp(p.createVector(0,1), p.createVector(b2_U_inv.x, b2_U_inv.y), t3);
                    const currentVec = p5.Vector.lerp(yVec, xVec, t3);
                    drawGrid(p, b1, b2, p.color(55, 65, 81), 1, scaleFactor);
                    drawVector(p, yVec, scaleFactor, p.color(250, 204, 21, 100), 'y');
                    drawVector(p, currentVec, scaleFactor, p.color(74, 222, 128), 'x');
                }
            };
            p.windowResized = () => { if(canvasRef.current) p.resizeCanvas(canvasRef.current.offsetWidth, canvasRef.current.offsetHeight); };
        };
        sketchRef.current = new p5(sketch, canvasRef.current!);
        return () => sketchRef.current?.remove();
    }, []);

    useEffect(() => {
        if(sketchRef.current && (sketchRef.current as any).updateWithProps) {
            (sketchRef.current as any).updateWithProps({ progress, matrix, luData });
        }
    }, [progress, matrix, luData]);

    useEffect(() => {
        const stories = [
            { title: "Act I: The Problem", desc: "A transformation 'A' turns 'x' into 'b'. How do we find 'x'?" },
            { title: "Act II: Solve Ly = b", desc: "Working backwards, we reverse the shear 'L' on 'b' to find 'y'." },
            { title: "Act III: Solve Ux = y", desc: "Finally, we reverse the stretch 'U' on 'y' to find the original 'x'." },
        ];
        const idx = progress < 0.25 ? 0 : progress < 0.5 ? 1 : 2;
        setStory(stories[idx]);
    }, [progress]);
    
    useEffect(() => {
        if (isPlaying) {
            animationFrameId.current = requestAnimationFrame(animate);
        }
        return () => { if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current); };
    }, [isPlaying]);

    const animate = () => {
        setProgress(prev => {
            const next = prev + 0.008;
            if (next >= 1) { setIsPlaying(false); return 1; }
            animationFrameId.current = requestAnimationFrame(animate);
            return next;
        });
    };

    const togglePlay = () => { if (isPlaying || !luData) return; if (progress >= 1) setProgress(0); setIsPlaying(true); };
    const handleSliderChange = (key: 'a'|'b'|'c'|'d', val: number) => { setProgress(0); setIsPlaying(false); setMatrix(prev => ({...prev, [key]: val})); };

    return (
        <Card className="bg-transparent border-0 shadow-none">
            <CardContent className="p-0">
                <div className="bg-black/30 backdrop-blur-xl rounded-xl p-4 md:p-6 shadow-2xl border border-purple-500/20 flex flex-col lg:flex-row gap-6">
                    <div className="w-full lg:w-[32rem] flex-shrink-0 space-y-4">
                        <div ref={canvasRef} className="w-full h-[400px] rounded-xl shadow-2xl bg-gray-900/50" />
                        <div className="bg-gray-900 p-4 rounded-lg h-40 flex flex-col justify-center">
                            <p className="text-xl font-semibold text-cyan-200">{story.title}</p>
                            <p className="text-gray-400 text-sm mt-1">{story.desc}</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <Button onClick={togglePlay} className="w-full" disabled={isPlaying || !luData}>
                                {isPlaying ? <Pause/> : <Play/>} <span className="ml-2">Decompose and Solve</span>
                            </Button>
                            <Button onClick={() => { setProgress(0); setIsPlaying(false); }} variant="outline"><RotateCcw/></Button>
                        </div>
                    </div>
                    <div className="w-full lg:flex-1 space-y-4">
                        <Card className="bg-gray-800/50">
                            <CardHeader className="p-4"><CardTitle>Initial Matrix (A)</CardTitle></CardHeader>
                            <CardContent className="p-4 pt-0">
                                <div className="grid grid-cols-2 gap-4">
                                    {(['a', 'b', 'c', 'd'] as const).map(key => (
                                        <div key={key}>
                                            <Label htmlFor={key} className="text-sm block mb-1">{key}: {matrix[key].toFixed(2)}</Label>
                                            <Slider id={key} min={-2} max={4} step={0.1} value={[matrix[key]]} onValueChange={v => handleSliderChange(key, v[0])}/>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                        <div className="grid grid-cols-2 gap-4 text-center">
                             <div className="bg-gray-900 rounded p-2 border border-blue-500/30">
                                 <h4 className="font-bold text-blue-400">L (Lower Triangular)</h4>
                                 <div className="font-mono text-sm">{luData ? `[${luData.L.a.toFixed(2)}, 0.00]\n[${luData.L.c.toFixed(2)}, ${luData.L.d.toFixed(2)}]` : 'N/A'}</div>
                             </div>
                             <div className="bg-gray-900 rounded p-2 border border-green-500/30">
                                 <h4 className="font-bold text-green-400">U (Upper Triangular)</h4>
                                 <div className="font-mono text-sm">{luData ? `[${luData.U.a.toFixed(2)}, ${luData.U.b.toFixed(2)}]\n[0.00, ${luData.U.d.toFixed(2)}]` : 'N/A'}</div>
                             </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};
export default LUDecompositionVisualizer;
