
'use client';

import React, { useState, useEffect, useRef } from 'react';
import p5 from 'p5';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { drawGrid as p5DrawGrid } from '@/lib/p5-helpers';

const CovarianceVisualizer = () => {
    const canvasRef = useRef<HTMLDivElement>(null);
    const sketchRef = useRef<p5 | null>(null);

    const [correlation, setCorrelation] = useState(0.7);
    const [w1, setW1] = useState(0.5);
    const [portfolioVariance, setPortfolioVariance] = useState(0);

    useEffect(() => {
        if (sketchRef.current) sketchRef.current.remove();
        if (!canvasRef.current) return;

        const sketch = (p: p5) => {
            const state = { correlation: 0.7 };
            let dataPoints: p5.Vector[] = [];
            const asset1 = { mean: 0, stdDev: 1.0 };
            const asset2 = { mean: 0, stdDev: 1.5 };

            p.updateWithProps = (props: any) => {
                if (state.correlation !== props.correlation) {
                    state.correlation = props.correlation;
                    generateData();
                }
            };
            
            const generateData = () => {
                dataPoints = [];
                for (let i = 0; i < 250; i++) {
                    const z1 = p.randomGaussian();
                    const z2 = p.randomGaussian();
                    const x = asset1.mean + asset1.stdDev * z1;
                    const y = asset2.mean + asset2.stdDev * (state.correlation * z1 + Math.sqrt(1 - state.correlation ** 2) * z2);
                    dataPoints.push(p.createVector(x, y));
                }
            };

            p.setup = () => {
                p.createCanvas(canvasRef.current!.offsetWidth, canvasRef.current!.offsetHeight).parent(canvasRef.current!);
                generateData();
            };

            p.draw = () => {
                const scaleFactor = p.min(p.width, p.height) / 8;
                p.background(17, 24, 39);
                p.translate(p.width / 2, p.height / 2);
                p.scale(1, -1);

                p5DrawGrid(p, p.createVector(1,0), p.createVector(0,1), p.color(55, 65, 81), 1, scaleFactor);

                p.noStroke();
                for (const pt of dataPoints) {
                    const alpha = p.map(pt.mag(), 0, 5, 200, 50);
                    p.fill(134, 239, 172, alpha); // green-300
                    p.ellipse(pt.x * scaleFactor, pt.y * scaleFactor, 6, 6);
                }
            };

            p.windowResized = () => p.resizeCanvas(canvasRef.current!.offsetWidth, canvasRef.current!.offsetHeight);
        };
        sketchRef.current = new p5(sketch, canvasRef.current!);
        return () => sketchRef.current?.remove();
    }, []);

    useEffect(() => {
        if (sketchRef.current && (sketchRef.current as any).updateWithProps) {
            (sketchRef.current as any).updateWithProps({ correlation });
        }
        const cov = correlation * 1.0 * 1.5;
        const var1 = 1.0**2;
        const var2 = 1.5**2;
        const w2 = 1 - w1;
        const pVar = w1**2 * var1 + w2**2 * var2 + 2 * w1 * w2 * cov;
        setPortfolioVariance(pVar);
    }, [correlation, w1]);

    return (
        <Card className="bg-transparent border-0 shadow-none">
            <CardContent className="p-0">
                <div className="bg-black/30 backdrop-blur-xl rounded-xl p-4 md:p-6 shadow-2xl border border-purple-500/20 flex flex-col lg:flex-row gap-6">
                    <div className="w-full lg:w-[28rem] flex-shrink-0 space-y-4">
                        <Card className="bg-gray-800/50">
                             <CardHeader className="p-4">
                                <CardTitle className="text-cyan-400">The Shape of Risk</CardTitle>
                                <CardDescription className="text-gray-400">
                                    Adjust the correlation to see the data cloud change shape. Adjust portfolio weights to see how diversification affects total risk.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="p-4 pt-0 space-y-4">
                                <div>
                                    <Label>Correlation (ρ)</Label>
                                    <Slider min={-1} max={1} step={0.01} value={[correlation]} onValueChange={v => setCorrelation(v[0])} />
                                    <p className="text-center font-mono">{correlation.toFixed(2)}</p>
                                </div>
                                 <div>
                                    <Label>Weight Asset 1 (w₁)</Label>
                                    <Slider min={0} max={1} step={0.01} value={[w1]} onValueChange={v => setW1(v[0])} />
                                    <p className="text-center font-mono">{w1.toFixed(2)}</p>
                                </div>
                            </CardContent>
                        </Card>
                         <Card className="bg-gray-800/50">
                             <CardHeader className="p-4">
                                <CardTitle className="text-cyan-400">Portfolio Risk</CardTitle>
                            </CardHeader>
                            <CardContent className="p-4 pt-0 text-center">
                                 <p className="text-sm text-gray-400">Total Portfolio Variance (σ²p)</p>
                                 <p className="text-4xl font-bold font-mono text-yellow-300 mt-1">{portfolioVariance.toFixed(3)}</p>
                            </CardContent>
                        </Card>
                    </div>
                    <div ref={canvasRef} className="flex-grow min-h-[400px] h-full rounded-lg border bg-gray-900 overflow-hidden" />
                </div>
            </CardContent>
        </Card>
    );
};
export default CovarianceVisualizer;

    