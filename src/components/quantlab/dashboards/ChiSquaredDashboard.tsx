
'use client';

import { useState, useMemo } from 'react';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { DistributionChart } from '@/components/quantlab/DistributionChart';
import { chiSquaredPdf } from '@/lib/math';

export function ChiSquaredDashboard() {
    const [df, setDf] = useState(5); // Degrees of Freedom

    const { chartData, mean, variance } = useMemo(() => {
        const data = [];
        const points = 200;
        const rangeEnd = Math.max(10, df + 4 * Math.sqrt(2 * df));

        for (let i = 1; i <= points; i++) {
            const x = (i / points) * rangeEnd;
            let density = chiSquaredPdf(x, df);
            if (!isFinite(density) || density > 5) {
                density = 5;
            }
            data.push({ value: x, density });
        }
        
        const calculatedMean = df;
        const calculatedVariance = 2 * df;

        return { chartData: data, mean: calculatedMean, variance: calculatedVariance };
    }, [df]);

    return (
        <div className="space-y-4">
            <div className="mx-auto max-w-md">
                <div className="space-y-3">
                    <Label htmlFor="df-slider">Degrees of Freedom (k): {df}</Label>
                    <Slider id="df-slider" min={1} max={30} step={1} value={[df]} onValueChange={(val) => setDf(val[0])} />
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
