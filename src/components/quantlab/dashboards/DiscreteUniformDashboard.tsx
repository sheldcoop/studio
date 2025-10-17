
'use client';

import { useState, useMemo } from 'react';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { DistributionChart } from '@/components/quantlab/DistributionChart';

interface DashboardProps {
    isSubcomponent?: boolean;
    highlightValue?: string | number | null;
    onBarHover?: (value: string | number | null) => void;
    showCdf?: boolean;
}

export function DiscreteUniformDashboard({ isSubcomponent, highlightValue, onBarHover, showCdf }: DashboardProps) {
    const [outcomes, setOutcomes] = useState(6); // n

    const { chartData, mean, variance } = useMemo(() => {
        const data = [];
        const probability = 1 / outcomes;
        for (let k = 1; k <= outcomes; k++) {
            data.push({
                outcome: k.toString(),
                probability: probability,
            });
        }
        const calculatedMean = (outcomes + 1) / 2;
        const calculatedVariance = (outcomes*outcomes - 1) / 12;

        return { chartData: data, mean: calculatedMean, variance: calculatedVariance };
    }, [outcomes]);

    return (
        <div className="space-y-4">
            {!isSubcomponent && (
                <div className="mx-auto max-w-sm">
                    <div className="space-y-3">
                        <Label htmlFor="outcomes-slider">Number of Outcomes (n): {outcomes}</Label>
                        <Slider id="outcomes-slider" min={2} max={20} step={1} value={[outcomes]} onValueChange={(val) => setOutcomes(val[0])} />
                    </div>
                </div>
            )}
            <DistributionChart
                chartData={chartData}
                chartType="bar"
                xAxisDataKey="outcome"
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
