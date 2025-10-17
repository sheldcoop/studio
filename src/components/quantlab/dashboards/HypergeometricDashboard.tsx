
'use client';

import { useState, useMemo } from 'react';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { DistributionChart } from '@/components/quantlab/DistributionChart';
import { hypergeometricProbability } from '@/lib/math';

interface DashboardProps {
    isSubcomponent?: boolean;
    highlightValue?: string | number | null;
    onBarHover?: (value: string | number | null) => void;
    showCdf?: boolean;
}

export function HypergeometricDashboard({ isSubcomponent, highlightValue, onBarHover, showCdf }: DashboardProps) {
    const [N, setN] = useState(52); // Population size
    const [K, setK] = useState(13);   // Number of successes in population
    const [n, setn] = useState(5);   // Sample size

    const { chartData, mean } = useMemo(() => {
        const data = [];
        const min_k = Math.max(0, n - (N - K));
        const max_k = Math.min(n, K);
        for (let k = min_k; k <= max_k; k++) {
            data.push({
                successes: k.toString(),
                probability: hypergeometricProbability(N, K, n, k),
            });
        }
        const calculatedMean = n * (K / N);
        return { chartData: data, mean: calculatedMean };
    }, [N, K, n]);

    return (
        <div className="space-y-4">
            {!isSubcomponent && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="space-y-3">
                        <Label htmlFor="N-slider">Population Size (N): {N}</Label>
                        <Slider id="N-slider" min={10} max={200} step={1} value={[N]} onValueChange={(val) => setN(val[0])} />
                    </div>
                     <div className="space-y-3">
                        <Label htmlFor="K-slider">Population Successes (K): {K}</Label>
                        <Slider id="K-slider" min={1} max={N} step={1} value={[K]} onValueChange={(val) => setK(val[0])} />
                    </div>
                    <div className="space-y-3">
                        <Label htmlFor="n-slider">Sample Size (n): {n}</Label>
                        <Slider id="n-slider" min={1} max={N} step={1} value={[n]} onValueChange={(val) => setn(val[0])} />
                    </div>
                </div>
            )}
            <DistributionChart
                chartData={chartData}
                chartType="bar"
                xAxisDataKey="successes"
                yAxisDataKey="probability"
                mean={mean}
                highlightValue={highlightValue}
                onBarHover={onBarHover}
                showCdf={showCdf}
            />
        </div>
    );
}
