
'use client';

import { useState, useMemo } from 'react';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { DistributionChart } from '@/components/quantlab/DistributionChart';
import { weibullPdf, lanczosGamma } from '@/lib/math';

export function WeibullDashboard() {
  const [shape, setShape] = useState(2); // k
  const [scale, setScale] = useState(1); // lambda

  const { chartData, mean, variance } = useMemo(() => {
    const data = [];
    const points = 200;
    // A reasonable upper bound for the chart x-axis
    const rangeEnd = scale * (shape < 1 ? 4 : 2.5);

    for (let i = 0; i <= points; i++) {
        const x = (i / points) * rangeEnd;
        let density = weibullPdf(x, shape, scale);
        if (!isFinite(density) || density > 5) {
            density = 5; // Cap for visualization
        }
        data.push({ value: x, density });
    }
    
    const calculatedMean = scale * lanczosGamma(1 + 1 / shape);
    const calculatedVariance = (scale**2) * (lanczosGamma(1 + 2 / shape) - (lanczosGamma(1 + 1 / shape))**2);

    return { chartData: data, mean: calculatedMean, variance: calculatedVariance };
  }, [shape, scale]);

  return (
    <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
                <Label htmlFor="shape-slider">Shape (k): {shape.toFixed(1)}</Label>
                <Slider id="shape-slider" min={0.5} max={5} step={0.1} value={[shape]} onValueChange={(val) => setShape(val[0])} />
            </div>
            <div className="space-y-3">
                <Label htmlFor="scale-slider">Scale (λ): {scale.toFixed(1)}</Label>
                <Slider id="scale-slider" min={0.5} max={5} step={0.1} value={[scale]} onValueChange={(val) => setScale(val[0])} />
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
