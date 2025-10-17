
'use client';

import { useState, useMemo } from 'react';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { DistributionChart } from '@/components/quantlab/DistributionChart';
import { standardNormalPdf } from '@/lib/math';
import 'katex/dist/katex.min.css';

const normalPdf = (x: number, mean: number, stdDev: number): number => {
    if (stdDev <= 0) return 0;
    return (1 / (stdDev * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * Math.pow((x - mean) / stdDev, 2));
};

export function NormalDashboard() {
  const [mean, setMean] = useState(0); // μ
  const [stdDev, setStdDev] = useState(1); // σ

  const { chartData, variance } = useMemo(() => {
    const data = [];
    const points = 400;
    const range = stdDev * 8;
    const step = range / points;
    const start = mean - range / 2;

    for (let i = 0; i <= points; i++) {
      const x = start + i * step;
      data.push({
        value: x,
        density: normalPdf(x, mean, stdDev),
      });
    }
    return { chartData: data, variance: stdDev * stdDev };
  }, [mean, stdDev]);

  return (
    <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
                <Label htmlFor="mean-slider">Mean (μ): {mean.toFixed(1)}</Label>
                <Slider id="mean-slider" min={-5} max={5} step={0.1} value={[mean]} onValueChange={(val) => setMean(val[0])} />
            </div>
            <div className="space-y-3">
                <Label htmlFor="stddev-slider">Standard Deviation (σ): {stdDev.toFixed(1)}</Label>
                <Slider id="stddev-slider" min={0.1} max={5} step={0.1} value={[stdDev]} onValueChange={(val) => setStdDev(val[0])} />
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
