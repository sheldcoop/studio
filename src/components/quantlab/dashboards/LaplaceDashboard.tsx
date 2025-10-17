
'use client';

import { useState, useMemo } from 'react';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { DistributionChart } from '@/components/quantlab/DistributionChart';
import { laplacePdf } from '@/lib/math';

export function LaplaceDashboard() {
    const [location, setLocation] = useState(0); // mu
    const [scale, setScale] = useState(1);   // b

    const { chartData, mean, variance } = useMemo(() => {
        const data = [];
        const points = 400;
        const range = Math.max(20, scale * 15);
        const start = location - range / 2;
        const end = location + range / 2;
        const step = (end - start) / points;

        for (let i = 0; i <= points; i++) {
            const x = start + i * step;
            data.push({
                value: x,
                density: laplacePdf(x, location, scale),
            });
        }
        
        const calculatedMean = location;
        const calculatedVariance = 2 * scale * scale;

        return { chartData: data, mean: calculatedMean, variance: calculatedVariance };
    }, [location, scale]);

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                    <Label htmlFor="location-slider">Location (μ): {location.toFixed(1)}</Label>
                    <Slider id="location-slider" min={-5} max={5} step={0.1} value={[location]} onValueChange={(val) => setLocation(val[0])} />
                </div>
                <div className="space-y-3">
                    <Label htmlFor="scale-slider">Scale (b): {scale.toFixed(1)}</Label>
                    <Slider id="scale-slider" min={0.1} max={5} step={0.1} value={[scale]} onValueChange={(val) => setScale(val[0])} />
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
