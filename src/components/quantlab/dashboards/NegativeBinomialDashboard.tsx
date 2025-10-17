
'use client';

import { useState, useMemo } from 'react';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { DistributionChart } from '@/components/quantlab/DistributionChart';
import { InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import { negativeBinomialProbability } from '@/lib/math';

export function NegativeBinomialDashboard() {
    const [successes, setSuccesses] = useState(5); // r
    const [probability, setProbability] = useState(0.5); // p

    const { chartData, mean, variance } = useMemo(() => {
        const data = [];
        const meanCalc = successes / probability;
        const varianceCalc = successes * (1 - probability) / (probability * probability);
        const limit = Math.ceil(Math.max(20, meanCalc + 3 * Math.sqrt(varianceCalc)));

        for (let k = successes; k <= limit; k++) {
            data.push({
                trials: k.toString(),
                probability: negativeBinomialProbability(successes, probability, k),
            });
        }
        return { chartData: data, mean: meanCalc, variance: varianceCalc };
    }, [successes, probability]);

    return (
        <div className="space-y-4">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                    <Label htmlFor="successes-slider">Number of Successes (r): {successes}</Label>
                    <Slider id="successes-slider" min={1} max={50} step={1} value={[successes]} onValueChange={(val) => setSuccesses(val[0])} />
                </div>
                <div className="space-y-3">
                    <Label htmlFor="prob-slider">Probability of Success (p): {probability.toFixed(2)}</Label>
                    <Slider id="prob-slider" min={0.01} max={0.99} step={0.01} value={[probability]} onValueChange={(val) => setProbability(val[0])} />
                </div>
            </div>
            <DistributionChart
                chartData={chartData}
                chartType="bar"
                xAxisDataKey="trials"
                yAxisDataKey="probability"
                mean={mean}
                variance={variance}
            />
        </div>
    );
}
