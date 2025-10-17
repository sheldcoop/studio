
'use client';

import { useState, useMemo } from 'react';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { DistributionChart } from '@/components/quantlab/DistributionChart';
import { gammaPdf } from '@/lib/math';

export function GammaDashboard() {
    const [alpha, setAlpha] = useState(2); // Shape
    const [beta, setBeta] = useState(1);   // Rate

    const { chartData, mean, variance } = useMemo(() => {
        const data = [];
        const points = 200;
        const rangeEnd = (alpha / beta) + 4 * Math.sqrt(alpha / (beta * beta));
        
        for (let i = 0; i <= points; i++) {
            const x = (i / points) * rangeEnd;
            data.push({
                value: x,
                density: gammaPdf(x, alpha, beta),
            });
        }

        const calculatedMean = alpha / beta;
        const calculatedVariance = alpha / (beta * beta);

        return { chartData: data, mean: calculatedMean, variance: calculatedVariance };
    }, [alpha, beta]);

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                    <Label htmlFor="alpha-slider">Shape (α): {alpha.toFixed(1)}</Label>
                    <Slider id="alpha-slider" min={1} max={20} step={0.1} value={[alpha]} onValueChange={(val) => setAlpha(val[0])} />
                </div>
                <div className="space-y-3">
                    <Label htmlFor="beta-slider">Rate (β): {beta.toFixed(1)}</Label>
                    <Slider id="beta-slider" min={0.1} max={5} step={0.1} value={[beta]} onValueChange={(val) => setBeta(val[0])} />
                </div>
            </div>
            <DistributionChart
                chartData={chartData}
                chartType="area"
                xAxisDataKey="value"
                yAxisDataKey="density"
                mean={mean}
                variance={variance}
            />
        </div>
    );
}
