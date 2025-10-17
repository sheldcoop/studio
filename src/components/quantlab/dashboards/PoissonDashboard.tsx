
'use client';

import { useState, useMemo } from 'react';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { DistributionChart } from '@/components/quantlab/DistributionChart';
import { InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import { poissonProbability } from '@/lib/math';

export function PoissonDashboard() {
    const [lambda, setLambda] = useState(5);

    const { chartData, mean, variance } = useMemo(() => {
        const data = [];
        const limit = Math.ceil(Math.max(20, lambda + 4 * Math.sqrt(lambda)));
        for (let k = 0; k <= limit; k++) {
          data.push({
            events: k.toString(),
            probability: poissonProbability(lambda, k),
          });
        }
        return { chartData: data, mean: lambda, variance: lambda };
    }, [lambda]);

  return (
    <div className="space-y-4">
        <div className="max-w-md mx-auto">
            <div className="space-y-3">
                <Label htmlFor="lambda-slider">Average Rate (λ): {lambda.toFixed(1)}</Label>
                <Slider id="lambda-slider" min={0.1} max={20} step={0.1} value={[lambda]} onValueChange={(val) => setLambda(val[0])} />
            </div>
        </div>
        <DistributionChart
            chartData={chartData}
            chartType="bar"
            xAxisDataKey="events"
            yAxisDataKey="probability"
            mean={mean}
            variance={variance}
        />
    </div>
  );
}
