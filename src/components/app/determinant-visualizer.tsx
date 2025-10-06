
'use client';

import React, { useState, useEffect, useRef } from 'react';
import p5 from 'p5';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';

const DeterminantVisualizer = () => {
    const canvasRef = useRef<HTMLDivElement>(null);
    const sketchRef = useRef<p5 | null>(null);

    const [matrix, setMatrix] = useState({ a: 1.0, b: 0.0, c: 0.0, d: 1.0 });
    const determinant = matrix.a * matrix.d - matrix.b * matrix.c;
    const area = Math.abs(determinant);

    useEffect(() => {
        // If a sketch instance already exists, remove it before creating a new one.
        if (sketchRef.current) {
            sketchRef.current.remove();
        }

        // The sketch function is now defined inside the useEffect hook,
        // so it has access to the current `matrix` state.
        const sketch = (p: p5) => {
            let scaleFactor: number;

            p.setup = () => {
                const container = canvasRef.current!;
                p.createCanvas(container.offsetWidth, 400).parent(container);
                p.noLoop(); // We will manually redraw
            };

            p.draw = () => {
                const { a, b, c, d } = matrix; // Use the matrix state from the component
                
                p.background(17, 24, 39); // bg-gray-900
                p.translate(p.width / 2, p.height / 2);
                p.scale(1, -1);

                scaleFactor = Math.min(p.width, p.height) / 5;

                drawGrid(scaleFactor);

                const i_hat_x = a * scaleFactor;
                const i_hat_y = c * scaleFactor;
                const j_hat_x = b * scaleFactor;
                const j_hat_y = d * scaleFactor;

                p.noStroke();
                let fillColor = p.color(34, 211, 238, 100); // cyan-400
                if (determinant < 0) {
                    fillColor = p.color(250, 204, 21, 100); // yellow-400
                }
                if (area < 0.01) {
                    fillColor = p.color(239, 68, 68, 150); // red-500
                }
                p.fill(fillColor);
                
                p.beginShape();
                p.vertex(0, 0);
                p.vertex(i_hat_x, i_hat_y);
                p.vertex(i_hat_x + j_hat_x, i_hat_y + j_hat_y);
                p.vertex(j_hat_x, j_hat_y);
                p.endShape(p.CLOSE);
                
                drawVector(0, 0, i_hat_x, i_hat_y, p.color(110, 231, 183), 'î', scaleFactor); // green-400
                drawVector(0, 0, j_hat_x, j_hat_y, p.color(248, 113, 113), 'ĵ', scaleFactor); // red-400
            };

            const drawVector = (x1: number, y1: number, x2: number, y2: number, c: p5.Color, label: string, sf: number) => {
                p.stroke(c);
                p.strokeWeight(4);
                p.line(x1, y1, x2, y2);
                
                p.push();
                p.translate(x2, y2);
                const angle = p.atan2(y2 - y1, x2 - x1);
                p.rotate(angle);
                p.noStroke();
                p.fill(c);
                p.triangle(0, 0, -10, 5, -10, -5);
                p.pop();
                
                p.push();
                p.scale(1, -1);
                p.noStroke();
                p.fill(c);
                p.textStyle(p.BOLD);
                p.textSize(18);
                const labelX = (x2 / sf);
                const labelY = (y2 / sf);
                p.text(label, x2 + (labelX > 0 ? 10 : -20), -y2 - (labelY < 0 ? 10 : -20));
                p.pop();
            };

            const drawGrid = (scale: number) => {
                p.stroke(55, 65, 81, 150);
                p.strokeWeight(1);
                
                const gridSize = 10;
                for (let x = -gridSize; x <= gridSize; x++) {
                    p.line(x * scale, -p.height, x * scale, p.height);
                }
                for (let y = -gridSize; y <= gridSize; y++) {
                    p.line(-p.width, y * scale, p.width, y * scale);
                }

                p.stroke(209, 213, 219);
                p.strokeWeight(2);
                p.line(-p.width, 0, p.width, 0); // X-axis
                p.line(0, -p.height, 0, p.height); // Y-axis
            };
            
             p.windowResized = () => {
                const container = canvasRef.current!;
                p.resizeCanvas(container.offsetWidth, 400);
            };
        };

        // Create the p5 instance
        if (canvasRef.current) {
            sketchRef.current = new p5(sketch, canvasRef.current);
        }
        
        // Cleanup function to remove the p5 sketch when the component unmounts or re-renders
        return () => {
            sketchRef.current?.remove();
        };
    // The useEffect hook now depends on the `matrix` state.
    // This will re-create the sketch whenever the matrix changes.
    }, [matrix, determinant, area]);


    const handleSliderChange = (key: 'a' | 'b' | 'c' | 'd', value: number) => {
        setMatrix(prev => ({ ...prev, [key]: value }));
    };

    const resetToIdentity = () => {
        setMatrix({ a: 1.0, b: 0.0, c: 0.0, d: 1.0 });
    };

    return (
        <Card className="bg-background/50 overflow-hidden">
            <CardContent className="p-4 md:p-6 flex flex-col lg:flex-row gap-6">
                {/* Controls Panel */}
                <div className="w-full lg:w-96 flex-shrink-0 space-y-4">
                    <Card>
                        <CardHeader className="p-4">
                            <CardTitle>Transformation Matrix</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 pt-0">
                            <div className="flex items-center justify-center space-x-4 text-2xl">
                                <div className="text-muted-foreground text-5xl">[</div>
                                <div className="grid grid-cols-2 gap-x-4 gap-y-2 font-mono">
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

                {/* Canvas */}
                <div ref={canvasRef} className="flex-grow w-full min-h-[400px] rounded-lg border bg-gray-900 overflow-hidden">
                    {/* p5.js canvas will be created here */}
                </div>
            </CardContent>
        </Card>
    );
};

export default DeterminantVisualizer;
