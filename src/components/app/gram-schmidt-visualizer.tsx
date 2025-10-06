
'use client';

import React, { useState, useEffect, useRef } from 'react';
import p5 from 'p5';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RotateCcw, Play } from 'lucide-react';
import { drawGrid as p5DrawGrid, drawVector as p5DrawVector, screenToWorld as p5ScreenToWorld, easeInOutCubic } from '@/lib/p5';

const GramSchmidtVisualizer = () => {
    const canvasRef = useRef<HTMLDivElement>(null);
    const sketchRef = useRef<p5 | null>(null);

    const [v1, setV1] = useState({ x: 2.5, y: 0.5 });
    const [v2, setV2] = useState({ x: 1.0, y: 2.0 });
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);

    const animationFrameId = useRef<number | null>(null);

    useEffect(() => {
        if (sketchRef.current) sketchRef.current.remove();
        if (!canvasRef.current) return;

        const sketch = (p: p5) => {
            let p5v1: p5.Vector, p5v2: p5.Vector;
            let u1: p5.Vector, u2: p5.Vector, proj: p5.Vector;
            let isDraggingV1 = false, isDraggingV2 = false;
            
            let componentState = {
                v1, v2, progress, isPlaying
            };

            (p as any).updateWithProps = (props: any) => {
                componentState = { ...componentState, ...props };
                p5v1.set(props.v1.x, props.v1.y);
                p5v2.set(props.v2.x, props.v2.y);
            };

            const calculateOrthogonalBasis = () => {
                if (p5v1.magSq() < 0.01) {
                    u1 = p.createVector(0,0);
                    u2 = p.createVector(0,0);
                    proj = p.createVector(0,0);
                    return;
                }
                u1 = p5v1.copy();
                const dot = p5v2.dot(u1);
                const magSq = u1.magSq();
                proj = u1.copy().mult(dot / magSq);
                u2 = p5.Vector.sub(p5v2, proj);
            };

            p.setup = () => {
                p.createCanvas(canvasRef.current!.offsetWidth, canvasRef.current!.offsetHeight).parent(canvasRef.current!);
                p5v1 = p.createVector(v1.x, v1.y);
                p5v2 = p.createVector(v2.x, v2.y);
                calculateOrthogonalBasis();
            };

            p.draw = () => {
                const { progress, isPlaying } = componentState;
                calculateOrthogonalBasis();

                const scaleFactor = p.min(p.width, p.height) / 10;
                p.background(17, 24, 39);
                p.translate(p.width / 2, p.height / 2);
                p.scale(1, -1);
                
                if (!isPlaying && (isDraggingV1 || isDraggingV2)) handleDragging();
                
                const t = easeInOutCubic(progress);
                
                p5DrawGrid(p, p5v1, p5v2, p.color(55, 65, 81, 255 * (1 - t)), 1, scaleFactor);
                if (u1 && u2) {
                    p5DrawGrid(p, u1.copy().normalize(), u2.copy().normalize(), p.color(55, 65, 81, 255 * t), 2, scaleFactor);
                }

                const t1_end = 0.2, t2_end = 0.5, t3_end = 0.9;
                if (t < t2_end) p5DrawVector(p, p5v1, scaleFactor, p.color(248, 113, 113, 255 * (1 - p.map(t, t1_end, t2_end, 0, 1))), 'v₁', 4);
                if (t > 0) {
                    const u1_alpha = p.constrain(p.map(t, 0, t1_end, 0, 1), 0, 1);
                    p5DrawVector(p, u1, scaleFactor, p.color(250, 204, 21, 255 * u1_alpha), 'u₁', 5);
                }
                if (t > t1_end) {
                    const t2 = p.constrain(p.map(t, t1_end, t2_end, 0, 1), 0, 1);
                    p5DrawVector(p, p5v2, scaleFactor, p.color(96, 165, 250), 'v₂', 4);
                    const proj_tip = u1.copy().mult(proj.mag() / u1.mag());
                    p.stroke(167, 139, 250, 150 * t2); p.strokeWeight(2); p.drawingContext.setLineDash([5, 5]);
                    p.line(p5v2.x * scaleFactor, p5v2.y * scaleFactor, proj_tip.x * scaleFactor, proj_tip.y * scaleFactor);
                    p.drawingContext.setLineDash([]);
                    p5DrawVector(p, proj.copy().mult(t2), scaleFactor, p.color(167, 139, 250), 'proj', 3);
                }
                if (t > t2_end) {
                    const t3 = p.constrain(p.map(t, t2_end, t3_end, 0, 1), 0, 1);
                    const subtraction_offset = p5.Vector.lerp(p5v2, p.createVector(0,0), t3);
                    p5DrawVector(p, proj.copy().mult(-1), scaleFactor, p.color(167, 139, 250, 100), null, 3, subtraction_offset);
                    const u2_final_pos = p5.Vector.lerp(p5v2, u2, t3);
                    p5DrawVector(p, u2_final_pos, scaleFactor, p.color(74, 222, 128), 'u₂', 5);
                }
            };
            
            const handleDragging = () => {
                const mouseWorld = p5ScreenToWorld(p, p.mouseX, p.mouseY, p.min(p.width, p.height)/10);
                if (isDraggingV1) setV1({x: mouseWorld.x, y: mouseWorld.y});
                if (isDraggingV2) setV2({x: mouseWorld.x, y: mouseWorld.y});
            };

            p.mousePressed = () => {
                if (componentState.isPlaying) return;
                const mouseWorld = p5ScreenToWorld(p, p.mouseX, p.mouseY, p.min(p.width, p.height)/10);
                if (p5.Vector.dist(mouseWorld, p5v1) < 0.5) isDraggingV1 = true;
                else if (p5.Vector.dist(mouseWorld, p5v2) < 0.5) isDraggingV2 = true;
                if(isDraggingV1 || isDraggingV2) document.body.style.cursor = 'grabbing';
            };
            p.mouseReleased = () => { isDraggingV1 = false; isDraggingV2 = false; document.body.style.cursor = 'default'; };
            p.windowResized = () => p.resizeCanvas(canvasRef.current!.offsetWidth, canvasRef.current!.offsetHeight);
        };
        sketchRef.current = new p5(sketch, canvasRef.current!);
        return () => { sketchRef.current?.remove(); };
    }, []);

    useEffect(() => {
        if (sketchRef.current && (sketchRef.current as any).updateWithProps) {
            (sketchRef.current as any).updateWithProps({v1, v2, progress, isPlaying});
        }
    }, [v1, v2, progress, isPlaying]);

    useEffect(() => {
        if (isPlaying) {
            const animate = () => {
                setProgress(prev => {
                    const next = prev + 0.008;
                    if (next >= 1) { setIsPlaying(false); return 1; }
                    return next;
                });
                animationFrameId.current = requestAnimationFrame(animate);
            };
            animationFrameId.current = requestAnimationFrame(animate);
        }
        return () => { if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current); };
    }, [isPlaying]);

    const resetAnimation = () => { setIsPlaying(false); setProgress(0); };
    const togglePlay = () => { if (isPlaying) return; if (progress >= 1) setProgress(0); setIsPlaying(true); };
    const handleInputChange = (vec: 'v1' | 'v2', axis: 'x' | 'y', value: string) => {
        const val = parseFloat(value) || 0;
        const setter = vec === 'v1' ? setV1 : setV2;
        setter(prev => ({...prev, [axis]: val}));
        resetAnimation();
    };

    return (
        <Card className="bg-transparent border-0 shadow-none">
            <CardContent className="p-0">
                <div className="bg-black/30 backdrop-blur-xl rounded-xl p-4 md:p-6 shadow-2xl border border-purple-500/20 flex flex-col lg:flex-row gap-6">
                    <div className="w-full lg:w-[30rem] flex-shrink-0 space-y-6">
                        <CardHeader className="p-0">
                            <CardTitle className="text-3xl font-bold text-cyan-400">The Art of Tidying Up</CardTitle>
                            <CardDescription className="text-gray-400 mt-2 text-sm">This process turns any "messy" basis (<b className="text-red-400">v₁</b>, <b className="text-blue-400">v₂</b>) into a clean, right-angled (orthogonal) basis (<b className="text-yellow-400">u₁</b>, <b className="text-green-400">u₂</b>). Drag the vectors or input them in the matrix, then press the button.</CardDescription>
                        </CardHeader>

                        <Card className="bg-gray-800/50">
                            <CardHeader className="p-4"><CardTitle className="text-lg text-center">Initial Basis Vectors [v₁ v₂]</CardTitle></CardHeader>
                            <CardContent className="p-4 pt-0">
                                <div className="flex items-center justify-center space-x-2">
                                    <div className="p-2 border-r-2 border-l-2 border-gray-500 rounded flex space-x-2">
                                        <div className="flex flex-col space-y-1">
                                            <Input type="number" step="0.1" value={v1.x.toFixed(2)} onChange={e => handleInputChange('v1', 'x', e.target.value)} className="matrix-input p-1" />
                                            <Input type="number" step="0.1" value={v1.y.toFixed(2)} onChange={e => handleInputChange('v1', 'y', e.target.value)} className="matrix-input p-1" />
                                        </div>
                                        <div className="flex flex-col space-y-1">
                                            <Input type="number" step="0.1" value={v2.x.toFixed(2)} onChange={e => handleInputChange('v2', 'x', e.target.value)} className="matrix-input p-1" />
                                            <Input type="number" step="0.1" value={v2.y.toFixed(2)} onChange={e => handleInputChange('v2', 'y', e.target.value)} className="matrix-input p-1" />
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        
                        <Card className="bg-gray-800/50 h-48">
                            <CardHeader className="p-4"><CardTitle className="text-lg text-center">The Process</CardTitle></CardHeader>
                            <CardContent className="p-4 pt-0 text-center text-cyan-200 text-sm space-y-2">
                                <p>{progress > 0 ? <><b>Step 1:</b> Set <b className="text-yellow-400">u₁</b> = <b className="text-red-400">v₁</b></> : "Press the button to start."}</p>
                                <p>{progress > 0.2 && <><b>Step 2:</b> Project <b className="text-blue-400">v₂</b> onto <b className="text-yellow-400">u₁</b> to find the <b className="text-purple-400">shadow</b>.</>}</p>
                                <p>{progress > 0.5 && <><b>Step 3:</b> Subtract the shadow from <b className="text-blue-400">v₂</b> to get the orthogonal vector <b className="text-green-400">u₂</b>.</>}</p>
                            </CardContent>
                        </Card>
                        
                        <div className="flex items-center gap-4">
                            <Button onClick={togglePlay} className="w-1/2" disabled={isPlaying}><Play className="w-4 h-4 mr-2" />Orthogonalize</Button>
                            <Button onClick={resetAnimation} className="w-1/2" variant="outline"><RotateCcw className="w-4 h-4 mr-2" />Reset</Button>
                        </div>
                    </div>
                    <div ref={canvasRef} className="flex-grow min-h-[500px] h-full rounded-lg border bg-gray-900 overflow-hidden" />
                </div>
            </CardContent>
        </Card>
    );
};
export default GramSchmidtVisualizer;

    