
'use client';

import React, { useState, useEffect, useRef } from 'react';
import p5 from 'p5';
import { Card, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';
import { drawGrid, drawVector } from '@/lib/p5';

const DeterminantVisualizer = () => {
    const canvasRef = useRef<HTMLDivElement>(null);
    const sketchRef = useRef<p5 | null>(null);

    const [matrix, setMatrix] = useState({ a: 1.0, b: 0.0, c: 0.0, d: 1.0 });
    const determinant = matrix.a * matrix.d - matrix.b * matrix.c;
    const area = Math.abs(determinant);

    useEffect(() => {
        if (sketchRef.current) {
            sketchRef.current.remove();
        }

        const sketch = (p: p5) => {
            let scaleFactor: number;

            const sketchState = {
                matrix: { a: 1.0, b: 0.0, c: 0.0, d: 1.0 }
            };

            (p as any).updateWithProps = (props: { matrix: typeof matrix }) => {
                sketchState.matrix = props.matrix;
                p.redraw(); 
            };

            p.setup = () => {
                const container = canvasRef.current!;
                p.createCanvas(container.offsetWidth, 400).parent(container);
                p.noLoop(); 
            };

            p.draw = () => {
                const { a, b, c, d } = sketchState.matrix;
                
                p.background(17, 24, 39); 
                p.translate(p.width / 2, p.height / 2);
                p.scale(1, -1);

                scaleFactor = Math.min(p.width, p.height) / 5;

                drawGrid(p, p.createVector(1,0), p.createVector(0,1), p.color(55, 65, 81), 1, scaleFactor);

                const i_hat_x = a * scaleFactor;
                const i_hat_y = c * scaleFactor;
                const j_hat_x = b * scaleFactor;
                const j_hat_y = d * scaleFactor;

                p.noStroke();
                let fillColor = p.color(34, 211, 238, 100);
                if (calculateDeterminant(sketchState.matrix) < 0) {
                    fillColor = p.color(250, 204, 21, 100);
                }
                if (Math.abs(calculateDeterminant(sketchState.matrix)) < 0.01) {
                    fillColor = p.color(239, 68, 68, 150);
                }
                p.fill(fillColor);
                
                p.beginShape();
                p.vertex(0, 0);
                p.vertex(i_hat_x, i_hat_y);
                p.vertex(i_hat_x + j_hat_x, i_hat_y + j_hat_y);
                p.vertex(j_hat_x, j_hat_y);
                p.endShape(p.CLOSE);
                
                drawVector(p, p.createVector(a, c), scaleFactor, p.color(110, 231, 183), 'î', 4);
                drawVector(p, p.createVector(b, d), scaleFactor, p.color(248, 113, 113), 'ĵ', 4);
            };
            
             p.windowResized = () => {
                const container = canvasRef.current!;
                p.resizeCanvas(container.offsetWidth, 400);
            };
        };

        if (canvasRef.current) {
            sketchRef.current = new p5(sketch, canvasRef.current);
        }
        
        return () => {
            sketchRef.current?.remove();
        };
    }, []);

    useEffect(() => {
        if (sketchRef.current && (sketchRef.current as any).updateWithProps) {
            (sketchRef.current as any).updateWithProps({ matrix });
        }
    }, [matrix]);

    const handleSliderChange = (key: 'a' | 'b' | 'c' | 'd', value: number) => {
        setMatrix(prev => ({ ...prev, [key]: value }));
    };

    const resetToIdentity = () => {
        setMatrix({ a: 1.0, b: 0.0, c: 0.0, d: 1.0 });
    };
    
    const calculateDeterminant = (m: {a: number, b: number, c: number, d: number}) => m.a * m.d - m.b * m.c;

    return (
        <Card className="bg-background/50 overflow-hidden">
            <CardContent className="p-4 md:p-6 flex flex-col lg:flex-row gap-6">
                <div className="w-full lg:w-96 flex-shrink-0 space-y-4">
                    <Card>
                        <CardContent className="p-4 pt-4">
                             <div className="flex items-center justify-center space-x-4 text-2xl">
                                <div className="text-muted-foreground text-5xl">[</div>
                                <div className="grid grid-cols-2 gap-x-4 gap-y-2 font-mono text-center">
                                    <span className="text-green-400">{matrix.a.toFixed(1)}</span>
                                    <span className="text-red-400">{matrix.b.toFixed(1)}</span>
                                    <span className="text-green-400">{matrix.c.toFixed(1)}</span>
                                    <span className="text-red-400">{matrix.d.toFixed(1)}</span>
                                </div>
                                <div className="text-muted-foreground text-5xl">]</div>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="space-y-4">
                        <div className="flex items-center space-x-3">
                            <Label htmlFor="a" className="w-8 text-green-400 font-bold">a:</Label>
                            <Slider id="a" min={-2} max={2} value={[matrix.a]} step={0.1} onValueChange={(v) => handleSliderChange('a', v[0])}/>
                        </div>
                        <div className="flex items-center space-x-3">
                            <Label htmlFor="b" className="w-8 text-red-400 font-bold">b:</Label>
                            <Slider id="b" min={-2} max={2} value={[matrix.b]} step={0.1} onValueChange={(v) => handleSliderChange('b', v[0])} />
                        </div>
                        <div className="flex items-center space-x-3">
                            <Label htmlFor="c" className="w-8 text-green-400 font-bold">c:</Label>
                            <Slider id="c" min={-2} max={2} value={[matrix.c]} step={0.1} onValueChange={(v) => handleSliderChange('c', v[0])} />
                        </div>
                        <div className="flex items-center space-x-3">
                            <Label htmlFor="d" className="w-8 text-red-400 font-bold">d:</Label>
                            <Slider id="d" min={-2} max={2} value={[matrix.d]} step={0.1} onValueChange={(v) => handleSliderChange('d', v[0])} />
                        </div>
                    </div>
                    
                    <Card>
                        <CardContent className="p-4 space-y-3">
                            <div className="flex justify-between items-center text-lg">
                                <span className="font-semibold">Determinant:</span>
                                <span className="font-mono p-1 px-2 rounded bg-muted text-primary">{determinant.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-center text-lg">
                                <span className="font-semibold">Area Factor:</span>
                                <span className="font-mono p-1 px-2 rounded bg-muted text-primary">{area.toFixed(2)}</span>
                            </div>
                            <div className={`text-center h-6 text-yellow-400 font-semibold transition-opacity duration-300 ${determinant < 0 ? 'opacity-100' : 'opacity-0'}`}>
                                Orientation Flipped!
                            </div>
                            <div className={`text-center h-6 text-red-500 font-semibold transition-opacity duration-300 ${area < 0.01 ? 'opacity-100' : 'opacity-0'}`}>
                                Space is squashed to a line!
                            </div>
                        </CardContent>
                    </Card>
                    <Button onClick={resetToIdentity} variant="outline" className="w-full">
                        <RotateCcw className="w-4 h-4 mr-2" />
                        Reset to Identity
                    </Button>
                </div>
                <div ref={canvasRef} className="flex-grow w-full min-h-[400px] rounded-lg border bg-gray-900 overflow-hidden">
                </div>
            </CardContent>
        </Card>
    );
};

export default DeterminantVisualizer;
