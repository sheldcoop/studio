
'use client';

import { useState, useMemo } from 'react';
import { PageHeader } from '@/components/app/page-header';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { ChartContainer } from '@/components/ui/chart';
import { Area, AreaChart, CartesianGrid, Tooltip } from 'recharts';
import { BlockMath, InlineMath } from 'react-katex';
import { standardNormalPdf, tDistributionPdf } from '@/lib/math';
import 'katex/dist/katex.min.css';
import { DistributionChart } from '@/components/quantlab/DistributionChart';


// --- Main Page Component ---
export default function TDistributionComponent() {
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
    <>
      <PageHeader
        title="Student's t-Distribution"
        description="The backbone of hypothesis testing with small sample sizes."
        variant="aligned-left"
      />
      <div className="mx-auto max-w-5xl space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">The "Small Sample" Distribution</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-base leading-relaxed text-foreground/90">
            <p>
              The t-distribution is a type of probability distribution that is similar to the normal distribution but has heavier tails. This means it assigns more probability to extreme values. It is used in place of the normal distribution when you have small sample sizes (typically n &lt; 30) and the population standard deviation is unknown.
            </p>
            <p>
              In finance, this is incredibly common. You rarely know the true volatility of an asset and often work with limited historical data. The t-distribution provides a more cautious and robust framework for constructing confidence intervals and performing hypothesis tests (like the t-test) in these real-world scenarios.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-headline">The Formula</CardTitle>
            <CardDescription>The probability density function (PDF) is defined by its single parameter: the degrees of freedom (<InlineMath math="\nu" /> or `df`).</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border bg-muted/50 p-4 text-center">
              <BlockMath math="f(t) = \frac{\Gamma(\frac{\nu+1}{2})}{\sqrt{\nu\pi}\Gamma(\frac{\nu}{2})} \left(1 + \frac{t^2}{\nu}\right)^{-\frac{\nu+1}{2}}" />
            </div>
            <ul className="list-disc pl-6 space-y-2 text-sm mt-4">
              <li><InlineMath math="\nu" /> (nu) represents the degrees of freedom, which is typically the sample size minus one (n - 1).</li>
              <li><InlineMath math="\Gamma" /> is the Gamma function.</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Interactive t-Distribution</CardTitle>
            <CardDescription>Adjust the degrees of freedom to see how the t-distribution compares to the standard normal distribution. Notice how it converges to the normal distribution as `df` increases.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mx-auto max-w-md mb-6">
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
          </CardContent>
        </Card>
      </div>
    </>
  );
}
