
'use client';

import { useState, useMemo } from 'react';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { DistributionChart } from '@/components/quantlab/DistributionChart';
import { binomialProbability } from '@/lib/math';

interface DashboardProps {
    isSubcomponent?: boolean;
    highlightValue?: string | number | null;
    onBarHover?: (value: string | number | null) => void;
    showCdf?: boolean;
}

export function BinomialDashboard({ isSubcomponent, highlightValue, onBarHover, showCdf }: DashboardProps) {
    const [trials, setTrials] = useState(20);
    const [probability, setProbability] = useState(0.5);

    const { chartData, mean, variance } = useMemo(() => {
        const data = [];
        for (let k = 0; k <= trials; k++) {
            data.push({
                successes: k.toString(),
                probability: binomialProbability(trials, k, probability),
            });
        }
        const calculatedMean = trials * probability;
        const calculatedVariance = trials * probability * (1 - probability);

        return { chartData: data, mean: calculatedMean, variance: calculatedVariance };
    }, [trials, probability]);

    return (
        <div className="space-y-4">
            {!isSubcomponent && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                        <Label htmlFor="trials-slider">Number of Trials (n): {trials}</Label>
                        <Slider id="trials-slider" min={1} max={100} step={1} value={[trials]} onValueChange={(val) => setTrials(val[0])} />
                    </div>
                    <div className="space-y-3">
                        <Label htmlFor="prob-slider">Probability of Success (p): {probability.toFixed(2)}</Label>
                        <Slider id="prob-slider" min={0.01} max={0.99} step={0.01} value={[probability]} onValueChange={(val) => setProbability(val[0])} />
                    </div>
                </div>
            )}
            <DistributionChart 
                chartData={chartData}
                chartType="bar"
                xAxisDataKey="successes"
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
