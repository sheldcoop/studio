
'use client';

import { useState, useMemo } from 'react';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { DistributionChart } from '@/components/quantlab/DistributionChart';
import { betaPdf } from '@/lib/math';

interface DashboardProps {
    isSubcomponent?: boolean;
}

export function BetaDashboard({ isSubcomponent }: DashboardProps) {
    const [alpha, setAlpha] = useState(2); // Shape parameter 1
    const [beta, setBeta] = useState(5);   // Shape parameter 2

    const { chartData, mean, variance } = useMemo(() => {
        const data = [];
        const points = 200;
        
        for (let i = 0; i <= points; i++) {
            const x = i / points;
            let density = betaPdf(x, alpha, beta);
            // Cap density for visualization purposes to prevent extreme spikes
            if (!isFinite(density) || density > 5) {
                density = 5;
            }
            data.push({ value: x, density: density });
        }

        const calculatedMean = alpha / (alpha + beta);
        const calculatedVariance = (alpha * beta) / (Math.pow(alpha + beta, 2) * (alpha + beta + 1));

        return { chartData: data, mean: calculatedMean, variance: calculatedVariance };
    }, [alpha, beta]);

    return (
        <div className="space-y-4">
             {!isSubcomponent && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                        <Label htmlFor="alpha-slider">Shape (α): {alpha.toFixed(1)}</Label>
                        <Slider id="alpha-slider" min={0.1} max={10} step={0.1} value={[alpha]} onValueChange={(val) => setAlpha(val[0])} />
                    </div>
                    <div className="space-y-3">
                        <Label htmlFor="beta-slider">Shape (β): {beta.toFixed(1)}</Label>
                        <Slider id="beta-slider" min={0.1} max={10} step={0.1} value={[beta]} onValueChange={(val) => setBeta(val[0])} />
                    </div>
                </div>
            )}
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
