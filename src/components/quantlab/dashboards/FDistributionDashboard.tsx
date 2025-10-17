
'use client';

import { useState, useMemo } from 'react';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { DistributionChart } from '@/components/quantlab/DistributionChart';
import { fDistributionPdf } from '@/lib/math';

export function FDistributionDashboard() {
  const [d1, setD1] = useState(5); // Degrees of freedom 1
  const [d2, setD2] = useState(10); // Degrees of freedom 2

  const { chartData, mean, variance } = useMemo(() => {
    const data = [];
    const points = 200;
    const calculatedMean = d2 > 2 ? d2 / (d2 - 2) : 1;
    const rangeEnd = Math.max(5, calculatedMean * 3);

    for (let i = 1; i <= points; i++) { // Start from i=1 to avoid x=0
      const x = (i / points) * rangeEnd;
      let density = fDistributionPdf(x, d1, d2);
      if (!isFinite(density) || density > 5) {
        density = 5; // Cap for visualization
      }
      data.push({ value: x, density });
    }

    const calculatedVariance = d2 > 4 ? (2 * d2 * d2 * (d1 + d2 - 2)) / (d1 * (d2 - 2) * (d2 - 2) * (d2 - 4)) : Infinity;

    return { chartData: data, mean: calculatedMean, variance: calculatedVariance };
  }, [d1, d2]);

  return (
    <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
                <Label htmlFor="d1-slider">Numerator Degrees of Freedom (d₁): {d1}</Label>
                <Slider id="d1-slider" min={1} max={50} step={1} value={[d1]} onValueChange={(val) => setD1(val[0])} />
            </div>
            <div className="space-y-3">
                <Label htmlFor="d2-slider">Denominator Degrees of Freedom (d₂): {d2}</Label>
                <Slider id="d2-slider" min={1} max={50} step={1} value={[d2]} onValueChange={(val) => setD2(val[0])} />
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
