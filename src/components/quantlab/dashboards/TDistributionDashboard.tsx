
'use client';

import { useState, useMemo } from 'react';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { DistributionChart } from '@/components/quantlab/DistributionChart';
import { standardNormalPdf, tDistributionPdf } from '@/lib/math';

export function TDistributionDashboard() {
  const [df, setDf] = useState(5); // Degrees of Freedom

  const { chartData, mean, variance } = useMemo(() => {
    const data = [];
    const points = 400;
    const range = 8;
    const step = range / points;
    const start = -range / 2;

    for (let i = 0; i <= points; i++) {
      const x = start + i * step;
      data.push({
        value: x,
        density: tDistributionPdf(x, df),
        normal_density: standardNormalPdf(x),
      });
    }

    const calculatedVariance = df > 2 ? df / (df - 2) : Infinity;

    return { chartData: data, mean: 0, variance: calculatedVariance };
  }, [df]);

  return (
    <div className="space-y-4">
        <div className="mx-auto max-w-md">
            <div className="space-y-3">
                <Label htmlFor="df-slider">Degrees of Freedom (df): {df}</Label>
                <Slider id="df-slider" min={1} max={50} step={1} value={[df]} onValueChange={(val) => setDf(val[0])} />
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
