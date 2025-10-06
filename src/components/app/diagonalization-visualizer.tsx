
'use client';

import React, { useState, useEffect, useRef } from 'react';
import p5 from 'p5';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

const DiagonalizationVisualizer = () => {
    const canvasRef = useRef<HTMLDivElement>(null);
    const sketchRef = useRef<p5 | null>(null);

    const [matrix, setMatrix] = useState({ a: 1.5, b: 0.5, c: 0.5, d: 1.0 });
    const [svdData, setSvdData] = useState<any>(null);
    const [progress, setProgress] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [storyText, setStoryText] = useState("");
    const [storyDesc, setStoryDesc] = useState("");
    const animationFrameId = useRef<number | null>(null);

    // SVD Calculation Effect
    useEffect(() => {
        const {a, b, c, d} = matrix;
        const trace = a + d;
        const det = a * d - b * c;
        const discriminant = trace * trace - 4 * det;
        if (discriminant >= 0) {
            const sqrt_discriminant = Math.sqrt(discriminant);
            const l1 = (trace + sqrt_discriminant) / 2;
            const l2 = (trace - sqrt_discriminant) / 2;
            let v1 = {x: b, y: l1 - a}; if (v1.x*v1.x + v1.y*v1.y < 1e-4) v1 = {x: l1 - d, y: c};
            let v2 = {x: b, y: l2 - a}; if (v2.x*v2.x + v2.y*v2.y < 1e-4) v2 = {x: l2 - d, y: c};
            const len1 = Math.sqrt(v1.x*v1.x + v1.y*v1.y); if (len1 > 1e-4) { v1.x /= len1; v1.y /= len1; }
            const len2 = Math.sqrt(v2.x*v2.x + v2.y*v2.y); if (len2 > 1e-4) { v2.x /= len2; v2.y /= len2; }
            if (Math.abs(v1.x*v2.y - v1.y*v2.x) < 0.1) { setSvdData(null); return; }
            setSvdData({ l1, l2, v1, v2 });
        } else {
            setSvdData(null);
        }
    }, [matrix]);

    // p5.js sketch Effect
    useEffect(() => {
        if (sketchRef.current) sketchRef.current.remove();
        if (!canvasRef.current) return;

        const sketch = (p: p5) => {
            const state = {
                progress: 0,
                matrix: { a: 1.5, b: 0.5, c: 0.5, d: 1.0 },
                svdData: null as any
            };

            p.updateWithProps = (props: any) => { Object.assign(state, props); };
            
            p.setup = () => p.createCanvas(canvasRef.current!.offsetWidth, canvasRef.current!.offsetHeight).parent(canvasRef.current!);

            p.draw = () => {
                const { progress, matrix, svdData } = state;
                if (!svdData) {
                    p.background(17, 24, 39);
                    p.fill(255, 100, 100); p.textAlign(p.CENTER, p.CENTER); p.textSize(16);
                    p.text("Matrix has no real eigenvectors.\nPlease choose different values.", p.width/2, p.height/2);
                    return;
                }
                const t = easeInOutCubic(progress);
                const scaleFactor = p.min(p.width, p.height) / 8;
                p.background(17, 24, 39);
                p.translate(p.width / 2, p.height / 2); p.scale(1, -1);

                const t1_end = 0.33, t2_end = 0.66;
                const iHat = p.createVector(1, 0), jHat = p.createVector(0, 1);
                const v1 = p.createVector(svdData.v1.x, svdData.v1.y), v2 = p.createVector(svdData.v2.x, svdData.v2.y);
                const { l1, l2 } = svdData;

                let b1, b2;
                if (t < t1_end) { const t1 = p.map(t, 0, t1_end, 0, 1); b1 = p5.Vector.lerp(iHat, v1, t1); b2 = p5.Vector.lerp(jHat, v2, t1);
                } else if (t < t2_end) { const t2 = p.map(t, t1_end, t2_end, 0, 1); b1 = v1.copy(); b2 = v2.copy(); b1.mult(p.lerp(1,l1,t2)); b2.mult(p.lerp(1,l2,t2));
                } else { const t3 = p.map(t, t2_end, 1, 0, 1); const scaled_v1 = p5.Vector.mult(v1,l1); const scaled_v2 = p5.Vector.mult(v2,l2); b1 = p5.Vector.lerp(scaled_v1, iHat.copy().mult(matrix.a).add(jHat.copy().mult(matrix.c)), t3); b2 = p5.Vector.lerp(scaled_v2, iHat.copy().mult(matrix.b).add(jHat.copy().mult(matrix.d)), t3); }

                drawTransformedGrid(b1, b2, scaleFactor, p.color(72, 144, 226, 50), p);
                drawTransformedCircle(b1, b2, scaleFactor, p.color('#ffd93d'), p);
                drawVector(b1, scaleFactor, p.color('#ff6b6b'), p);
                drawVector(b2, scaleFactor, p.color('#4ecdc4'), p);
            };

            p.windowResized = () => p.resizeCanvas(canvasRef.current!.offsetWidth, canvasRef.current!.offsetHeight);
        };
        
        sketchRef.current = new p5(sketch, canvasRef.current!);
        return () => { sketchRef.current?.remove(); };
    }, []);

    // Animation loop Effect
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

    // Story text update Effect
    useEffect(() => {
        const stories = [
            { title: "Act I: Change of Basis (P⁻¹)", desc: "The world shifts from the standard grid to the eigenbasis." },
            { title: "Act II: Stretch (D)", desc: "In this new basis, the transformation is a simple stretch." },
            { title: "Act III: Change Back (P)", desc: "The world shifts back, revealing the final transformed vector." }
        ];
        const idx = progress < 0.33 ? 0 : progress < 0.66 ? 1 : 2;
        setStoryText(stories[idx].title);
        setStoryDesc(stories[idx].desc);
    }, [progress]);

    useEffect(() => {
        if(sketchRef.current && (sketchRef.current as any).updateWithProps) {
            (sketchRef.current as any).updateWithProps({ progress, matrix, svdData });
        }
    }, [progress, matrix, svdData]);

    const handleSliderChange = (key: 'a' | 'b' | 'c' | 'd', value: number) => {
        setMatrix(prev => ({ ...prev, [key]: value }));
        setProgress(1);
        setIsPlaying(false);
    };

    const resetAnimation = () => { setProgress(0); setIsPlaying(false); };
    const togglePlay = () => { if (isPlaying) return; if (progress >= 1) setProgress(0); setIsPlaying(true); };

    return (
        <Card className="bg-transparent border-0 shadow-none">
            <CardContent className="p-0">
                <div className="bg-black/30 backdrop-blur-xl rounded-xl p-4 md:p-6 shadow-2xl border border-purple-500/20 flex flex-col lg:flex-row gap-6">
                    <div className="w-full lg:w-[32rem] flex-shrink-0 space-y-4">
                        <div ref={canvasRef} className="w-full h-[400px] rounded-xl shadow-2xl bg-gray-900/50" />
                        <div className="flex items-center gap-4">
                            <Button onClick={togglePlay} className="w-1/2" disabled={isPlaying}><Play className="w-4 h-4 mr-2"/>Diagonalize</Button>
                            <Button onClick={resetAnimation} className="w-1/2" variant="outline"><RotateCcw className="w-4 h-4 mr-2"/>Reset</Button>
                        </div>
                        <Slider value={[progress]} min={0} max={1} step={0.01} onValueChange={v => {setProgress(v[0]); setIsPlaying(false);}} />
                    </div>
                    <div className="w-full lg:flex-1 space-y-4">
                         <div className="bg-gray-900 p-4 rounded-lg h-40 flex flex-col justify-center">
                            <p className="text-xl font-semibold text-cyan-200">{storyText}</p>
                            <p className="text-gray-400 text-sm mt-1">{storyDesc}</p>
                        </div>
                        <Card className="bg-gray-800/50">
                            <CardHeader className="p-4"><CardTitle>Transformation Matrix (A)</CardTitle></CardHeader>
                            <CardContent className="p-4 pt-0">
                                <div className="grid grid-cols-2 gap-4">
                                    {(['a', 'b', 'c', 'd'] as const).map(key => (
                                        <div key={key}>
                                            <Label htmlFor={key} className="text-sm block mb-1">{key}: {matrix[key].toFixed(2)}</Label>
                                            <Slider id={key} min={-2} max={2} step={0.1} value={[matrix[key]]} onValueChange={v => handleSliderChange(key, v[0])}/>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                        <div className="grid grid-cols-2 gap-4 text-center">
                             <div className="bg-gray-900 rounded p-2">
                                 <h4 className="font-bold text-pink-400">P (Eigenvectors)</h4>
                                 <div className="font-mono text-xs">{svdData ? `[${svdData.v1.x.toFixed(2)}, ${svdData.v2.x.toFixed(2)}] [${svdData.v1.y.toFixed(2)}, ${svdData.v2.y.toFixed(2)}]` : 'N/A'}</div>
                             </div>
                             <div className="bg-gray-900 rounded p-2">
                                 <h4 className="font-bold text-yellow-400">D (Eigenvalues)</h4>
                                 <div className="font-mono text-xs">{svdData ? `[${svdData.l1.toFixed(2)}, 0] [0, ${svdData.l2.toFixed(2)}]` : 'N/A'}</div>
                             </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};
export default DiagonalizationVisualizer;

// --- p5.js Drawing Helpers ---
const easeInOutCubic = (t: number) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
const drawVector = (v: p5.Vector, s: number, c: p5.Color, p: p5) => { if (!v) return; const sv = p5.Vector.mult(v, s); if (sv.magSq() < 1e-4) return; p.stroke(c); p.strokeWeight(4); p.line(0, 0, sv.x, sv.y); p.push(); p.translate(sv.x, sv.y); p.rotate(sv.heading()); p.fill(c); p.noStroke(); p.triangle(0, 0, -10, 5, -10, -5); p.pop(); };
const drawTransformedGrid = (b1: p5.Vector, b2: p5.Vector, s: number, c: p5.Color, p: p5) => { p.stroke(c); p.strokeWeight(1); const r = 8; for (let i = -r; i <= r; i++) { p.beginShape(p.LINE_STRIP); for (let j = -r; j <= r; j++) { const v = p5.Vector.add(p5.Vector.mult(b1, i), p5.Vector.mult(b2, j)); p.vertex(v.x * s, v.y * s); } p.endShape(); p.beginShape(p.LINE_STRIP); for (let j = -r; j <= r; j++) { const v = p5.Vector.add(p5.Vector.mult(b1, j), p5.Vector.mult(b2, i)); p.vertex(v.x * s, v.y * s); } p.endShape(); } };
const drawTransformedCircle = (b1: p5.Vector, b2: p5.Vector, s: number, c: p5.Color, p: p5) => { p.noFill(); p.stroke(c); p.strokeWeight(3); p.beginShape(); for (let i = 0; i <= 64; i++) { const angle = p.map(i, 0, 64, 0, p.TWO_PI); const circVec = p.createVector(p.cos(angle), p.sin(angle)); const transformed = p5.Vector.add(p5.Vector.mult(b1, circVec.x), p5.Vector.mult(b2, circVec.y)); p.vertex(transformed.x * s, transformed.y * s); } p.endShape(p.CLOSE); };

    