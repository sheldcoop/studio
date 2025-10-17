
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
import { exponentialPdf } from '@/lib/math';

// --- Main Page Component ---
export default function ExponentialDistributionComponent() {
    const [lambda, setLambda] = useState(1.5); // Rate parameter

    const { chartData, mean, variance } = useMemo(() => {
        const data = [];
        const points = 200;
        const rangeEnd = -Math.log(0.01) / lambda;
        
        for (let i = 0; i <= points; i++) {
            const x = (i / points) * rangeEnd;
            data.push({
                value: x,
                density: exponentialPdf(x, lambda),
            });
        }

        const calculatedMean = 1 / lambda;
        const calculatedVariance = 1 / (lambda * lambda);

        return { chartData: data, mean: calculatedMean, variance: calculatedVariance };
    }, [lambda]);

  return (
    <>
      <PageHeader
        title="Exponential Distribution"
        description="Modeling the time until an event occurs in a Poisson process."
        variant="aligned-left"
      />
      <div className="mx-auto max-w-5xl space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">The "Time Between Events" Distribution</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-base leading-relaxed text-foreground/90">
            <p>
                The Exponential distribution is a continuous probability distribution that models the time between events in a Poisson point process, i.e., a process in which events occur continuously and independently at a constant average rate.
            </p>
            <p>
              It is the continuous analogue of the Geometric distribution. While the Geometric distribution models the number of trials until the first success, the Exponential distribution models the amount of time until the next event. In finance, it's used to model the time between trades, the time until a bond defaults, or the duration until a stock price hits a certain level.
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
                  <BlockMath math="f(x; \lambda) = \lambda e^{-\lambda x}" />
                </div>
                 <ul className="list-disc pl-6 space-y-2 text-sm mt-4">
                    <li><InlineMath math="x \ge 0" /> is the time variable.</li>
                    <li><InlineMath math="\lambda > 0" /> (lambda) is the <strong>rate</strong> parameter, the average number of events per unit of time.</li>
                </ul>
            </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Interactive Exponential Distribution</CardTitle>
            <CardDescription>Adjust the rate parameter (λ) to see how the shape of the distribution changes. A higher rate means events happen more frequently, so the probability of a short waiting time is high.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mx-auto max-w-md mb-6">
                <div className="space-y-3">
                    <Label htmlFor="lambda-slider">Rate (λ): {lambda.toFixed(2)}</Label>
                    <Slider id="lambda-slider" min={0.1} max={5} step={0.1} value={[lambda]} onValueChange={(val) => setLambda(val[0])} />
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
