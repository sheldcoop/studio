
'use client';

import React, { useState, useEffect, useRef } from 'react';
import p5 from 'p5';
import { Play, Pause } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

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
                matrix: { a: 1.5, b: 1, c: 0.5, d: 2 }
            };
            
            (p as any).updateWithProps = (props: any) => {
                componentState = {...componentState, ...props};
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
                    drawGrid(p.createVector(1,0), p.createVector(0,1), scaleFactor, p.color(55, 65, 81));
                    drawGrid(b1, b2, scaleFactor, p.color(56, 189, 248, 80));
                    const p_custom_coords = getCustomCoords(p_standard, b1, b2);
                    
                    const stdCoordsEl = document.getElementById('standard-coords');
                    if (stdCoordsEl) stdCoordsEl.innerHTML = `(${p_standard.x.toFixed(2)}, ${p_standard.y.toFixed(2)})`;
                    const customCoordsEl = document.getElementById('custom-coords');
                    if (customCoordsEl) customCoordsEl.innerHTML = p_custom_coords ? `(${p_custom_coords.x.toFixed(2)}, ${p_custom_coords.y.toFixed(2)})` : '(Invalid)';

                    drawLinearCombination(p_custom_coords, b1, b2, scaleFactor);
                    drawPoint(p_standard, scaleFactor, 'P', p.color(255, 217, 61));
                    drawVector(p.createVector(1, 0), scaleFactor, p.color(156, 163, 175), 'î');
                    drawVector(p.createVector(0, 1), scaleFactor, p.color(156, 163, 175), 'ĵ');
                    drawVector(b1, scaleFactor, p.color(248, 113, 113), 'b₁');
                    drawVector(b2, scaleFactor, p.color(96, 165, 250), 'b₂');
                } else {
                    const t = easeInOutCubic(progress);
                    const eigen = calculateEigen(matrix.a, matrix.b, matrix.c, matrix.d);
                    
                    let grid_b1 = p.createVector(1,0);
                    let grid_b2 = p.createVector(0,1);
                    let p_display = p_standard.copy();

                    if (t <= 0.333) {
                        const local_t = p.map(t, 0, 0.333, 0, 1);
                        grid_b1.lerp(eigen.v1, local_t);
                        grid_b2.lerp(eigen.v2, local_t);
                    } else if (t <= 0.666) {
                        grid_b1 = eigen.v1;
                        grid_b2 = eigen.v2;
                        const local_t = p.map(t, 0.333, 0.666, 0, 1);
                        const p_eigen_coords = getCustomCoords(p_standard, eigen.v1, eigen.v2)!;
                        const scaled_coords_x = p.lerp(p_eigen_coords.x, p_eigen_coords.x * eigen.l1, local_t);
                        const scaled_coords_y = p.lerp(p_eigen_coords.y, p_eigen_coords.y * eigen.l2, local_t);
                        p_display = p5.Vector.add(p5.Vector.mult(eigen.v1, scaled_coords_x), p5.Vector.mult(eigen.v2, scaled_coords_y));
                    } else {
                        const local_t = p.map(t, 0.666, 1, 0, 1);
                        const p_eigen_coords = getCustomCoords(p_standard, eigen.v1, eigen.v2)!;
                        const v1_part_scaled = p5.Vector.mult(eigen.v1, p_eigen_coords.x * eigen.l1);
                        const v2_part_scaled = p5.Vector.mult(eigen.v2, p_eigen_coords.y * eigen.l2);
                        const p_scaled = p5.Vector.add(v1_part_scaled, v2_part_scaled);
                        const p_final = p.createVector(matrix.a * p_standard.x + matrix.b * p_standard.y, matrix.c * p_standard.x + matrix.d * p_standard.y);
                        grid_b1 = p5.Vector.lerp(eigen.v1, p.createVector(1,0), local_t);
                        grid_b2 = p5.Vector.lerp(eigen.v2, p.createVector(0,1), local_t);
                        p_display = p5.Vector.lerp(p_scaled, p_final, local_t);
                    }
                    
                    const live_custom_coords = getCustomCoords(p_display, grid_b1, grid_b2);
                    const stdCoordsEl = document.getElementById('standard-coords');
                    if (stdCoordsEl) stdCoordsEl.innerHTML = `(${p_display.x.toFixed(2)}, ${p_display.y.toFixed(2)})`;
                    const customCoordsEl = document.getElementById('custom-coords');
                    if (customCoordsEl) customCoordsEl.innerHTML = live_custom_coords ? `(${live_custom_coords.x.toFixed(2)}, ${live_custom_coords.y.toFixed(2)})` : '(Invalid)';
                    
                    drawGrid(grid_b1, grid_b2, scaleFactor, p.color(56, 189, 248, 80));
                    drawPoint(p_display, scaleFactor, 'P', p.color(255, 217, 61));
                }
            };

            const getCustomCoords = (point: p5.Vector, basis1: p5.Vector, basis2: p5.Vector) => {
                const det = basis1.x * basis2.y - basis1.y * basis2.x;
                if (p.abs(det) < 0.01) return null;
                const inv_det = 1 / det;
                const x = (point.x * basis2.y - point.y * basis2.x) * inv_det;
                const y = (point.y * basis1.x - point.x * basis1.y) * inv_det;
                return p.createVector(x, y);
            };
            
            const calculateEigen = (a: number, b: number, c: number, d: number) => {
                const trace = a + d;
                const det = a * d - b * c;
                const discriminant = Math.sqrt(Math.max(0, trace * trace - 4 * det));
                const l1 = (trace + discriminant) / 2;
                const l2 = (trace - discriminant) / 2;
                let v1 = p.createVector(b, l1 - a);
                let v2 = p.createVector(b, l2 - a);
                if (v1.magSq() === 0) v1 = p.createVector(l1 - d, c);
                if (v2.magSq() === 0) v2 = p.createVector(l2 - d, c);
                if (v1.magSq() === 0) v1 = p.createVector(1,0);
                if (v2.magSq() === 0) v2 = p.createVector(0,1);
                v1.normalize(); v2.normalize();
                return { l1, l2, v1, v2 };
            };

            const drawGrid = (b1: p5.Vector, b2: p5.Vector, s: number, col: p5.Color) => {
                p.stroke(col); p.strokeWeight(1); p.noFill();
                const invDet = 1 / (b1.x * b2.y - b1.y * b2.x);
                if (p.abs(invDet) > 100) return;
                const inv_b1x = b2.y * invDet; const inv_b1y = -b1.y * invDet;
                const inv_b2x = -b2.x * invDet; const inv_b2y = b1.x * invDet;
                const corners = [ screenToWorld(0,0), screenToWorld(p.width,0), screenToWorld(p.width, p.height), screenToWorld(0, p.height) ];
                const customCorners = corners.map(pt => p.createVector(pt.x*inv_b1x + pt.y*inv_b1y, pt.x*inv_b2x + pt.y*inv_b2y));
                const minX = Math.floor(p.min(customCorners.map(pt => pt.x)));
                const maxX = Math.ceil(p.max(customCorners.map(pt => pt.x)));
                const minY = Math.floor(p.min(customCorners.map(pt => pt.y)));
                const maxY = Math.ceil(p.max(customCorners.map(pt => pt.y)));
                for (let i = minX; i <= maxX; i++) {
                    const p1 = p5.Vector.add(p5.Vector.mult(b1, i), p5.Vector.mult(b2, minY));
                    const p2 = p5.Vector.add(p5.Vector.mult(b1, i), p5.Vector.mult(b2, maxY));
                    p.line(p1.x*s, p1.y*s, p2.x*s, p2.y*s);
                }
                for (let i = minY; i <= maxY; i++) {
                    const p1 = p5.Vector.add(p5.Vector.mult(b1, minX), p5.Vector.mult(b2, i));
                    const p2 = p5.Vector.add(p5.Vector.mult(b1, maxX), p5.Vector.mult(b2, i));
                    p.line(p1.x*s, p1.y*s, p2.x*s, p2.y*s);
                }
            };
            
            const drawVector = (v: p5.Vector, s: number, c: p5.Color, label: string) => {
                p.stroke(c); p.strokeWeight(4); p.fill(c);
                p.line(0, 0, v.x * s, v.y * s);
                p.push(); p.translate(v.x * s, v.y * s); p.rotate(v.heading()); p.triangle(0, 0, -10, 5, -10, -5); p.pop();
                if (label) { p.noStroke(); p.push(); p.translate(v.x * s, v.y * s); p.scale(1,-1); p.text(label, 10, -10); p.pop(); }
            };

            const drawPoint = (pt: p5.Vector, s: number, label: string, col: p5.Color) => { p.fill(col); p.noStroke(); p.ellipse(pt.x * s, pt.y * s, 12, 12); };
            
            const drawLinearCombination = (coords: p5.Vector | null, basis1: p5.Vector, basis2: p5.Vector, s: number) => {
                if(!coords) return;
                const p1 = p5.Vector.mult(basis1, coords.x);
                p.strokeWeight(2); p.stroke(248, 113, 113, 150); p.line(0,0,p1.x*s, p1.y*s);
                const p2 = p5.Vector.mult(basis2, coords.y);
                p.stroke(96, 165, 250, 150); p.line(p1.x*s, p1.y*s, (p1.x+p2.x)*s, (p1.y+p2.y)*s);
            };

            const easeInOutCubic = (t: number) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
            const screenToWorld = (mx: number, my: number) => p.createVector((mx - p.width / 2) / (p.min(p.width, p.height) / 8), (p.height / 2 - my) / (p.min(p.width, p.height) / 8));
            p.mousePressed = () => { if (componentState.mode === 'explore' && p.mouseX > 0 && p.mouseX < p.width && p.mouseY > 0 && p.mouseY < p.height) { const m = screenToWorld(p.mouseX, p.mouseY); if(p5.Vector.dist(m, b1) < 0.3) dragging = b1; else if(p5.Vector.dist(m, b2) < 0.3) dragging = b2; }};
            p.mouseDragged = () => { if (dragging) dragging.set(screenToWorld(p.mouseX, p.mouseY)); };
            p.mouseReleased = () => { dragging = null; };
            p.windowResized = () => p.resizeCanvas(canvasRef.current!.offsetWidth, 500);
        }, canvasRef.current!);
        
        sketchRef.current = sketch;

        return () => sketchRef.current?.remove();
    }, []);

    useEffect(() => {
        if(sketchRef.current && (sketchRef.current as any).updateWithProps) {
            (sketchRef.current as any).updateWithProps({ mode, progress, matrix: {a: matrixA, b: matrixB, c: matrixC, d: matrixD} });
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

    return (
        <Card className="bg-transparent border-0 shadow-none">
            <CardContent className="p-0">
                <div className="bg-black/30 backdrop-blur-xl rounded-xl p-4 md:p-6 shadow-2xl border border-purple-500/20 flex flex-col lg:flex-row gap-6">
                    <div className="w-full lg:w-[26rem] flex-shrink-0 space-y-4">
                        <div>
                            <h1 className="text-2xl font-bold text-cyan-400">A New Perspective</h1>
                            <h2 className="text-lg text-gray-300">The Story of Basis Change</h2>
                            <p className="text-gray-400 mt-1 text-sm h-24" dangerouslySetInnerHTML={{ __html: storyText }}></p>
                        </div>

                        <div id="exploration-panel" className={cn(mode !== 'explore' && 'hidden')}>
                            <div className="bg-gray-900 p-4 rounded-lg text-center space-y-2">
                                <h3 className="text-base font-semibold text-gray-300">The Same Vector, Two Languages</h3>
                                <p className="text-xs text-gray-400">Drag the colored vectors (<b className="text-red-400">b₁</b>, <b className="text-blue-400">b₂</b>) to define your basis.</p>
                                <div className="flex justify-around pt-2">
                                    <div>
                                        <p className="text-xs text-gray-400">Standard Basis (î, ĵ)</p>
                                        <p className="text-xl text-white font-mono" id="standard-coords">(2.00, 1.00)</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-cyan-400">Your Basis (b₁, b₂)</p>
                                        <p className="text-xl text-cyan-400 font-mono" id="custom-coords">(?, ?)</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div id="transformation-panel" className={cn(mode !== 'transform' && 'hidden')}>
                            <div className="bg-gray-900 p-4 rounded-lg">
                                <h3 className="text-base font-semibold text-gray-300 mb-2">Transformation Matrix A</h3>
                                <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-center">
                                    <div><Label className="text-green-400 text-xs">a: {matrixA.toFixed(1)}</Label><Slider value={[matrixA]} onValueChange={(v) => setMatrixA(v[0])} min={-2} max={3} step={0.1} /></div>
                                    <div><Label className="text-red-400 text-xs">b: {matrixB.toFixed(1)}</Label><Slider value={[matrixB]} onValueChange={(v) => setMatrixB(v[0])} min={-2} max={3} step={0.1} /></div>
                                    <div><Label className="text-green-400 text-xs">c: {matrixC.toFixed(1)}</Label><Slider value={[matrixC]} onValueChange={(v) => setMatrixC(v[0])} min={-2} max={3} step={0.1} /></div>
                                    <div><Label className="text-red-400 text-xs">d: {matrixD.toFixed(1)}</Label><Slider value={[matrixD]} onValueChange={(v) => setMatrixD(v[0])} min={-2} max={3} step={0.1} /></div>
                                </div>
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2">
                            <Button onClick={() => setMode('explore')} variant={mode === 'explore' ? 'default' : 'secondary'}>Basis Explorer</Button>
                            <Button onClick={() => setMode('transform')} variant={mode === 'transform' ? 'default' : 'secondary'}>Transformation Story</Button>
                        </div>
                        
                        <div className={cn("flex items-center gap-4", mode !== 'transform' && 'hidden')}>
                            <Button onClick={togglePlay} className="w-1/3">
                                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                                <span className="ml-2">{isPlaying ? 'Pause' : 'Play'}</span>
                            </Button>
                            <Slider value={[progress]} onValueChange={(v) => setProgress(v[0])} min={0} max={1} step={0.01} />
                        </div>
                    </div>
                    <div ref={canvasRef} className="flex-grow min-h-[300px] lg:min-h-[500px] rounded-lg border bg-gray-900 overflow-hidden" />
                </div>
            </CardContent>
        </Card>
    );
};

export default ChangeOfBasisVisualizer;
