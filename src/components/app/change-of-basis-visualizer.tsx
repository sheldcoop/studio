
'use client';

import React, { useState, useEffect, useRef } from 'react';
import p5 from 'p5';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { drawGrid, drawVector, easeInOutCubic, screenToWorld, drawPoint } from '@/lib/p5';
import { calculateEigen } from '@/lib/math/linear-algebra';

const ChangeOfBasisVisualizer = () => {
    const canvasRef = useRef<HTMLDivElement>(null);
    const sketchRef = useRef<p5 | null>(null);

    const [mode, setMode] = useState<'explore' | 'transform'>('explore');
    const [storyText, setStoryText] = useState("");
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [matrixA, setMatrixA] = useState(1.5);
    const [matrixB, setMatrixB] = useState(1.0);
    const [matrixC, setMatrixC] = useState(0.5);
    const [matrixD, setMatrixD] = useState(2.0);
    const [standardCoords, setStandardCoords] = useState("(2.00, 1.00)");
    const [customCoords, setCustomCoords] = useState("(?, ?)");

    const animationFrameId = useRef<number | null>(null);

    const story = {
        explore: "Standard coordinates use the familiar <b class='text-gray-400'>î</b> and <b class='text-gray-400'>ĵ</b>. By dragging <b class='text-red-400'>b₁</b> and <b class='text-blue-400'>b₂</b>, you define a new language—a new basis—to describe the same vector.",
        transform: [
            "<b>Start:</b> A vector and a transformation matrix A. Applying A gives a sheared result.",
            "<b>Act 1: Change Basis (P⁻¹)</b> We shift our view to a special basis: the eigenvectors of A. The vector itself doesn't move, but its coordinates change.",
            "<b>Act 2: Simple Scaling (D)</b> In this new basis, the 'hard' transformation is just a simple stretch along the new axes. This is the magic!",
            "<b>Act 3: Change Back (P)</b> We shift our view back to the standard grid, revealing the final transformed vector in its new position."
        ]
    };
    
    useEffect(() => {
        const updateStory = () => {
            if (mode === 'explore') {
                setStoryText(story.explore);
            } else {
                const idx = Math.floor(progress * 3.99);
                if (idx < story.transform.length) {
                    setStoryText(story.transform[idx]);
                }
            }
        };
        updateStory();
    }, [mode, progress, story.explore, story.transform]);


    useEffect(() => {
        if (sketchRef.current) {
            sketchRef.current.remove();
        }
        if (!canvasRef.current) return;

        const sketch = new p5((p: p5) => {
            let b1: p5.Vector, b2: p5.Vector, p_standard: p5.Vector;
            let dragging: p5.Vector | null = null;
            
            // Component state passed into p5
            let componentState = {
                mode: 'explore' as 'explore' | 'transform',
                progress: 0,
                matrix: {a: 1.5, b: 1, c: 0.5, d: 2}
            };
            
            p.setup = () => {
                p.createCanvas(canvasRef.current!.offsetWidth, 500).parent(canvasRef.current!);
                b1 = p.createVector(1.5, 0.5);
                b2 = p.createVector(-0.5, 1);
                p_standard = p.createVector(2, 1);
            };

            p.draw = () => {
                const {mode, progress, matrix} = componentState;
                const scaleFactor = p.min(p.width, p.height) / 8;
                p.background(17, 24, 39);
                p.translate(p.width / 2, p.height / 2);
                p.scale(1, -1);

                if (mode === 'explore') {
                    drawGrid(p, p.createVector(1,0), p.createVector(0,1), p.color(55, 65, 81), 1, scaleFactor);
                    drawGrid(p, b1, b2, p.color(56, 189, 248, 80), 1, scaleFactor);
                    const p_custom_coords = getCustomCoords(p_standard, b1, b2);
                    
                    setStandardCoords(`(${p_standard.x.toFixed(2)}, ${p_standard.y.toFixed(2)})`);
                    setCustomCoords(p_custom_coords ? `(${p_custom_coords.x.toFixed(2)}, ${p_custom_coords.y.toFixed(2)})` : '(Invalid)');

                    drawLinearCombination(p_custom_coords, b1, b2, scaleFactor);
                    drawVector(p, p_standard, scaleFactor, p.color(255, 217, 61), 'v', 5);
                    drawVector(p, p.createVector(1, 0), scaleFactor, p.color(156, 163, 175), 'î', 4);
                    drawVector(p, p.createVector(0, 1), scaleFactor, p.color(156, 163, 175), 'ĵ', 4);
                    drawVector(p, b1, scaleFactor, p.color(248, 113, 113), 'b₁', 4);
                    drawVector(p, b2, scaleFactor, p.color(96, 165, 250), 'b₂', 4);
                } else {
                    const t = easeInOutCubic(progress);
                    const eigen = calculateEigen(matrix.a, matrix.b, matrix.c, matrix.d);
                    
                    if (!eigen) {
                         p.fill(255, 100, 100); p.textAlign(p.CENTER, p.CENTER); p.textSize(16);
                         p.text("Matrix has no real eigenvectors.\nPlease choose different values.", 0, 0);
                         return;
                    }

                    let grid_b1 = p.createVector(1,0);
                    let grid_b2 = p.createVector(0,1);
                    let p_display = p_standard.copy();

                    if (t <= 0.333) {
                        const local_t = p.map(t, 0, 0.333, 0, 1);
                        grid_b1.lerp(p.createVector(eigen.v1.x, eigen.v1.y), local_t);
                        grid_b2.lerp(p.createVector(eigen.v2.x, eigen.v2.y), local_t);
                    } else if (t <= 0.666) {
                        grid_b1 = p.createVector(eigen.v1.x, eigen.v1.y);
                        grid_b2 = p.createVector(eigen.v2.x, eigen.v2.y);
                        const local_t = p.map(t, 0.333, 0.666, 0, 1);
                        const p_eigen_coords = getCustomCoords(p_standard, grid_b1, grid_b2)!;
                        const scaled_coords_x = p.lerp(p_eigen_coords.x, p_eigen_coords.x * eigen.lambda1, local_t);
                        const scaled_coords_y = p.lerp(p_eigen_coords.y, p_eigen_coords.y * eigen.lambda2, local_t);
                        const v1_part = grid_b1.copy().mult(scaled_coords_x);
                        const v2_part = grid_b2.copy().mult(scaled_coords_y);
                        p_display = p5.Vector.add(v1_part, v2_part);
                    } else {
                        const local_t = p.map(t, 0.666, 1, 0, 1);
                        const p_eigen_coords = getCustomCoords(p_standard, p.createVector(eigen.v1.x, eigen.v1.y), p.createVector(eigen.v2.x, eigen.v2.y))!;
                        const v1_part_scaled = p.createVector(eigen.v1.x, eigen.v1.y).mult(p_eigen_coords.x * eigen.lambda1);
                        const v2_part_scaled = p.createVector(eigen.v2.x, eigen.v2.y).mult(p_eigen_coords.y * eigen.lambda2);
                        const p_scaled = p5.Vector.add(v1_part_scaled, v2_part_scaled);
                        const p_final = p.createVector(matrix.a * p_standard.x + matrix.b * p_standard.y, matrix.c * p_standard.x + matrix.d * p_standard.y);
                        grid_b1 = p5.Vector.lerp(p.createVector(eigen.v1.x, eigen.v1.y), p.createVector(1,0), local_t);
                        grid_b2 = p5.Vector.lerp(p.createVector(eigen.v2.x, eigen.v2.y), p.createVector(0,1), local_t);
                        p_display = p5.Vector.lerp(p_scaled, p_final, local_t);
                    }
                    
                    const live_custom_coords = getCustomCoords(p_display, grid_b1, grid_b2);
                    setStandardCoords(`(${p_display.x.toFixed(2)}, ${p_display.y.toFixed(2)})`);
                    setCustomCoords(live_custom_coords ? `(${live_custom_coords.x.toFixed(2)}, ${live_custom_coords.y.toFixed(2)})` : '(Invalid)');
                    
                    drawGrid(p, grid_b1, grid_b2, p.color(56, 189, 248, 80), 1, scaleFactor);
                    
                    if (progress > 0.99) {
                        const p_final = p.createVector(matrix.a * p_standard.x + matrix.b * p_standard.y, matrix.c * p_standard.x + matrix.d * p_standard.y);
                        drawVector(p, p_standard, scaleFactor, p.color(255, 255, 255, 50), 'v_start', 5);
                        drawVector(p, p_final, scaleFactor, p.color(255, 217, 61), 'Av', 5);
                    } else {
                        drawVector(p, p_display, scaleFactor, p.color(255, 217, 61), 'v', 5);
                    }
                }
            };
            
             // Pass component props to p5 sketch
            (p as any).updateWithProps = (props: any) => {
                componentState.mode = props.mode;
                componentState.progress = props.progress;
                componentState.matrix.a = props.matrixA;
                componentState.matrix.b = props.matrixB;
                componentState.matrix.c = props.matrixC;
                componentState.matrix.d = props.matrixD;
            };

            const getCustomCoords = (point: p5.Vector, basis1: p5.Vector, basis2: p5.Vector) => {
                const det = basis1.x * basis2.y - basis1.y * basis2.x;
                if (p.abs(det) < 0.01) return null;
                const inv_det = 1 / det;
                const x = (point.x * basis2.y - point.y * basis2.x) * inv_det;
                const y = (point.y * basis1.x - point.x * basis1.y) * inv_det;
                return p.createVector(x, y);
            };
            
            const drawLinearCombination = (coords: p5.Vector | null, basis1: p5.Vector, basis2: p5.Vector, s: number) => {
                if(!coords) return;
                const p1 = basis1.copy().mult(coords.x);
                p.strokeWeight(2); p.stroke(248, 113, 113, 150); p.line(0,0,p1.x*s, p1.y*s);
                const p2 = basis2.copy().mult(coords.y);
                p.stroke(96, 165, 250, 150); p.line(p1.x*s, p1.y*s, (p1.x+p2.x)*s, (p1.y+p2.y)*s);
            };

            p.mousePressed = () => { if (componentState.mode === 'explore' && p.mouseX > 0 && p.mouseX < p.width && p.mouseY > 0 && p.mouseY < p.height) { const m = screenToWorld(p, p.mouseX, p.mouseY, p.min(p.width, p.height)/8); if(p5.Vector.dist(m, b1) < 0.3) dragging = b1; else if(p5.Vector.dist(m, b2) < 0.3) dragging = b2; }};
            p.mouseDragged = () => { if (dragging) { const worldPos = screenToWorld(p, p.mouseX, p.mouseY, p.min(p.width, p.height)/8); if(worldPos) dragging.set(worldPos); } };
            p.mouseReleased = () => { dragging = null; };
            p.windowResized = () => p.resizeCanvas(canvasRef.current!.offsetWidth, 500);
        }, canvasRef.current!);
        
        sketchRef.current = sketch;

        return () => sketchRef.current?.remove();
    }, []);

    useEffect(() => {
        if(sketchRef.current && (sketchRef.current as any).updateWithProps) {
            (sketchRef.current as any).updateWithProps({ mode, progress, matrixA, matrixB, matrixC, matrixD });
        }
    }, [mode, progress, matrixA, matrixB, matrixC, matrixD]);
    
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

    const togglePlay = () => {
        if (progress >= 1) setProgress(0);
        setIsPlaying(!isPlaying);
    };

    const reset = () => {
        setIsPlaying(false);
        setProgress(0);
    }

    return (
        <Card className="bg-transparent border-0 shadow-none">
            <CardContent className="p-0">
                <div className="bg-black/30 backdrop-blur-xl rounded-xl p-4 md:p-6 shadow-2xl border border-purple-500/20 flex flex-col lg:flex-row gap-6">
                    <div className="w-full lg:w-[26rem] flex-shrink-0 space-y-4">
                        <div>
                            <h1 className="text-2xl font-bold text-cyan-400">A New Perspective</h1>
                            <h2 className="text-lg text-gray-300">The Story of Basis Change</h2>
                            <p className="text-gray-400 mt-1 text-sm h-28" dangerouslySetInnerHTML={{ __html: storyText }}></p>
                        </div>

                        <div id="exploration-panel" className={mode !== 'transform' ? '' : 'space-y-4'}>
                            <div className="bg-gray-900 p-4 rounded-lg text-center space-y-2">
                                <h3 className="text-lg font-semibold text-gray-300">{mode === 'explore' ? 'The Same Vector, Two Languages' : 'Live Vector Coordinates'}</h3>
                                <p className="text-sm text-gray-400">
                                    {mode === 'explore' 
                                        ? <>Drag the colored vectors (<b className="text-red-400">b₁</b>, <b className="text-blue-400">b₂</b>) to define your basis. The gray vectors are the standard basis (<b className="text-gray-400">î</b>, <b className="text-gray-400">ĵ</b>).</>
                                        : 'Watch how coordinates change as the basis (grid) and vector transform.'
                                    }
                                </p>
                                <div className="flex justify-around pt-2">
                                    <div>
                                        <p className="text-gray-400">Standard Basis (<span className="text-gray-400">î, ĵ</span>)</p>
                                        <p className="text-2xl text-white font-mono">{standardCoords}</p>
                                    </div>
                                    <div>
                                        <p className="text-cyan-400">Your Basis (<span className="text-red-400">b₁</span>, <span className="text-blue-400">b₂</span>)</p>
                                        <p className="text-2xl text-cyan-400 font-mono">{customCoords}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div id="transformation-panel" className={cn(mode !== 'transform' && 'hidden')}>
                            <div className="bg-gray-900 p-4 rounded-lg">
                                <h3 className="text-lg font-semibold text-gray-300 mb-2">Transformation Matrix A</h3>
                                <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-center">
                                    <div><Label className="text-green-400">a: {matrixA.toFixed(1)}</Label><Slider value={[matrixA]} onValueChange={(v) => setMatrixA(v[0])} min={-2} max={3} step={0.1} /></div>
                                    <div><Label className="text-red-400">b: {matrixB.toFixed(1)}</Label><Slider value={[matrixB]} onValueChange={(v) => setMatrixB(v[0])} min={-2} max={3} step={0.1} /></div>
                                    <div><Label className="text-green-400">c: {matrixC.toFixed(1)}</Label><Slider value={[matrixC]} onValueChange={(v) => setMatrixC(v[0])} min={-2} max={3} step={0.1} /></div>
                                    <div><Label className="text-red-400">d: {matrixD.toFixed(1)}</Label><Slider value={[matrixD]} onValueChange={(v) => setMatrixD(v[0])} min={-2} max={3} step={0.1} /></div>
                                </div>
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2">
                            <Button onClick={() => setMode('explore')} variant={mode === 'explore' ? 'default' : 'secondary'}>Basis Explorer</Button>
                            <Button onClick={() => setMode('transform')} variant={mode === 'transform' ? 'default' : 'secondary'}>Transformation Story</Button>
                        </div>
                        
                        <div className={cn("items-center gap-4", mode === 'transform' ? 'flex' : 'hidden')}>
                            <Button onClick={togglePlay}>
                                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                            </Button>
                            <Slider value={[progress]} onValueChange={(v) => setProgress(v[0])} min={0} max={1} step={0.01} />
                            <Button onClick={reset} variant="ghost"><RotateCcw className="w-4 h-4"/></Button>
                        </div>
                    </div>
                    <div ref={canvasRef} className="flex-grow min-h-[300px] lg:min-h-[500px] rounded-lg border bg-gray-900 overflow-hidden" />
                </div>
            </CardContent>
        </Card>
    );
};

export default ChangeOfBasisVisualizer;

