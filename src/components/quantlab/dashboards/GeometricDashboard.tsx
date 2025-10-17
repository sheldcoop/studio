
'use client';

import { useState, useMemo } from 'react';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { DistributionChart } from '@/components/quantlab/DistributionChart';
import { geometricProbability } from '@/lib/math';

interface DashboardProps {
    isSubcomponent?: boolean;
    highlightValue?: string | number | null;
    onBarHover?: (value: string | number | null) => void;
    showCdf?: boolean;
}

export function GeometricDashboard({ isSubcomponent, highlightValue, onBarHover, showCdf }: DashboardProps) {
    const [probability, setProbability] = useState(0.25);

    const { chartData, mean, variance } = useMemo(() => {
        const data = [];
        const limit = Math.ceil(Math.max(15, 3 / probability));
        for (let k = 1; k <= limit; k++) {
            data.push({
                trials: k.toString(),
                probability: geometricProbability(probability, k),
            });
        }
        const calculatedMean = 1 / probability;
        const calculatedVariance = (1 - probability) / (probability * probability);
        return { chartData: data, mean: calculatedMean, variance: calculatedVariance };
    }, [probability]);

  return (
    <div className="space-y-4">
        {!isSubcomponent && (
            <div className="mx-auto max-w-sm">
                <div className="space-y-3">
                    <Label htmlFor="prob-slider">Probability of Success (p): {probability.toFixed(2)}</Label>
                    <Slider id="prob-slider" min={0.01} max={0.99} step={0.01} value={[probability]} onValueChange={(val) => setProbability(val[0])} />
                </div>
            </div>
        )}
        <DistributionChart
            chartData={chartData}
            chartType="bar"
            xAxisDataKey="trials"
            yAxisDataKey="probability"
            mean={mean}
            variance={variance}
            highlightValue={highlightValue}
            onBarHover={onBarHover}
            showCdf={showCdf}
        />
    </div>
  );
}
