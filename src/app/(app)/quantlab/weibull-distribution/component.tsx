
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
import { DistributionChart } from '@/components/quantlab/DistributionChart';
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import { weibullPdf, lanczosGamma } from '@/lib/math';

// --- Main Page Component ---
export default function WeibullDistributionComponent() {
  const [shape, setShape] = useState(2); // k
  const [scale, setScale] = useState(1); // lambda

  const { chartData, mean, variance } = useMemo(() => {
    const data = [];
    const points = 200;
    // A reasonable upper bound for the chart x-axis
    const rangeEnd = scale * (shape < 1 ? 4 : 2.5);

    for (let i = 0; i <= points; i++) {
        const x = (i / points) * rangeEnd;
        let density = weibullPdf(x, shape, scale);
        if (!isFinite(density) || density > 5) {
            density = 5; // Cap for visualization
        }
        data.push({ value: x, density });
    }
    
    const calculatedMean = scale * lanczosGamma(1 + 1 / shape);
    const calculatedVariance = (scale**2) * (lanczosGamma(1 + 2 / shape) - (lanczosGamma(1 + 1 / shape))**2);

    return { chartData: data, mean: calculatedMean, variance: calculatedVariance };
  }, [shape, scale]);

  return (
    <>
      <PageHeader
        title="Weibull Distribution"
        description="Modeling time-to-failure, event durations, and reliability."
        variant="aligned-left"
      />
      <div className="mx-auto max-w-5xl space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">The "Time-to-Event" Distribution</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-base leading-relaxed text-foreground/90">
            <p>
                The Weibull distribution is a highly flexible continuous probability distribution. It's widely used in engineering to model reliability and time-to-failure of components. In finance, it can be applied to model the duration of events, such as the time until a corporate bond defaults or the time a stock price stays above a certain level.
            </p>
            <p>
              Its flexibility comes from its shape parameter, <InlineMath math="k" />. Depending on the value of <InlineMath math="k" />, it can mimic the behavior of other distributions like the exponential (when <InlineMath math="k=1" />) or approximate the normal distribution (when <InlineMath math="k" /> is around 3-4).
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-headline">The Formula</CardTitle>
            <CardDescription>The probability density function (PDF) is given by:</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border bg-muted/50 p-4 text-center">
              <BlockMath math="f(x; k, \lambda) = \frac{k}{\lambda} \left(\frac{x}{\lambda}\right)^{k-1} e^{-(x/\lambda)^k}" />
            </div>
            <ul className="list-disc pl-6 space-y-2 text-sm mt-4">
              <li><InlineMath math="x \ge 0" /> is the variable (e.g., time).</li>
              <li><InlineMath math="k > 0" /> is the <strong>shape</strong> parameter. It determines the shape of the failure rate. If <InlineMath math="k < 1" />, the failure rate decreases over time. If <InlineMath math="k = 1" />, it's constant (Exponential). If <InlineMath math="k > 1" />, the failure rate increases over time (wear-out).</li>
              <li><InlineMath math="\lambda > 0" /> is the <strong>scale</strong> parameter, which stretches or contracts the distribution.</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Interactive Weibull Distribution</CardTitle>
            <CardDescription>Adjust the shape (k) and scale (λ) parameters to see how the distribution's form changes.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
              <div className="space-y-3">
                <Label htmlFor="shape-slider">Shape (k): {shape.toFixed(1)}</Label>
                <Slider id="shape-slider" min={0.5} max={5} step={0.1} value={[shape]} onValueChange={(val) => setShape(val[0])} />
              </div>
              <div className="space-y-3">
                <Label htmlFor="scale-slider">Scale (λ): {scale.toFixed(1)}</Label>
                <Slider id="scale-slider" min={0.5} max={5} step={0.1} value={[scale]} onValueChange={(val) => setScale(val[0])} />
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
