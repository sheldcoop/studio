
'use client';

import { useState, useMemo } from 'react';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { DistributionChart } from '@/components/quantlab/DistributionChart';
import { exponentialPdf } from '@/lib/math';

export function ExponentialDashboard() {
    const [lambda, setLambda] = useState(1.5); // Rate parameter

    const { chartData, mean, variance } = useMemo(() => {
        const data = [];
        const points = 200;
        const rangeEnd = -Math.log(0.01) / lambda;
        
        for (let i = 0; i <= points; i++) {
            const x = (i / points) * rangeEnd;
            data.push({
                value: x,
                density: exponentialPdf(x, lambda),
            });
        }

        const calculatedMean = 1 / lambda;
        const calculatedVariance = 1 / (lambda * lambda);

        return { chartData: data, mean: calculatedMean, variance: calculatedVariance };
    }, [lambda]);

    return (
        <div className="space-y-4">
            <div className="mx-auto max-w-md">
                <div className="space-y-3">
                    <Label htmlFor="lambda-slider">Rate (λ): {lambda.toFixed(2)}</Label>
                    <Slider id="lambda-slider" min={0.1} max={5} step={0.1} value={[lambda]} onValueChange={(val) => setLambda(val[0])} />
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
