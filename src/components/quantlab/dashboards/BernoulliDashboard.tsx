
'use client';

import { useState, useMemo } from 'react';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { DistributionChart } from '@/components/quantlab/DistributionChart';
import { InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import { bernoulliProbability } from '@/lib/math';

export function BernoulliDashboard() {
    const [probability, setProbability] = useState(0.7);

    const { chartData, mean, variance } = useMemo(() => {
        const data = [
          { outcome: 'Failure (k=0)', probability: bernoulliProbability(probability, 0) },
          { outcome: 'Success (k=1)', probability: bernoulliProbability(probability, 1) },
        ];
        return {
            chartData: data,
            mean: probability,
            variance: probability * (1-probability)
        };
    }, [probability]);

    return (
        <div className="space-y-4">
            <div className="mx-auto max-w-sm">
                <div className="space-y-3">
                    <Label htmlFor="prob-slider">Probability of Success (p): {probability.toFixed(2)}</Label>
                    <Slider id="prob-slider" min={0} max={1} step={0.01} value={[probability]} onValueChange={(val) => setProbability(val[0])} />
                </div>
            </div>
            <DistributionChart 
                chartData={chartData}
                chartType="bar"
                xAxisDataKey="outcome"
                yAxisDataKey="probability"
                mean={mean}
                variance={variance}
            />
        </div>
    );
}
