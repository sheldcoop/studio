
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
import { generatePoissonData } from '@/lib/math';

// This is an approximation as we are not using the real PMF for the chart
const poissonProbability = (lambda: number, k: number): number => {
    return (Math.pow(lambda, k) * Math.exp(-lambda)) / factorial(k);
};

const factorial = (n: number): number => {
    if (n < 0) return 0;
    let result = 1;
    for (let i = 2; i <= n; i++) result *= i;
    return result;
};


// --- Main Page Component ---
export default function PoissonDistributionComponent() {
    const [lambda, setLambda] = useState(5);

    const { chartData, mean, variance } = useMemo(() => {
        const data = [];
        const limit = Math.ceil(Math.max(20, lambda + 4 * Math.sqrt(lambda)));
        for (let k = 0; k <= limit; k++) {
          data.push({
            events: k.toString(),
            probability: poissonProbability(lambda, k),
          });
        }
        return { chartData: data, mean: lambda, variance: lambda };
    }, [lambda]);

  return (
    <>
      <PageHeader
        title="Poisson Distribution"
        description="Modeling the number of events occurring in a fixed interval of time or space."
        variant="aligned-left"
      />
      <div className="mx-auto max-w-5xl space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">The "Rare Events" Distribution</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-base leading-relaxed text-foreground/90">
            <p>
                The Poisson Distribution is used to model the number of times an event occurs within a specified interval. The key assumptions are that events are independent, the average rate of events is constant, and two events cannot occur at the exact same instant.
            </p>
            <p>
              In finance, it's particularly useful for modeling rare events. For example, a credit analyst might use it to model the number of defaults in a large portfolio of loans over a month, or a trader might use it to model the number of times a stock's price jumps by more than 5% in a single day.
            </p>
          </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle className="font-headline">The Formula</CardTitle>
                 <CardDescription>The probability of observing exactly 'k' events in an interval is given by:</CardDescription>
            </CardHeader>
            <CardContent>
                 <div className="rounded-lg border bg-muted/50 p-4 text-center">
                  <BlockMath math="P(X=k) = \frac{\lambda^k e^{-\lambda}}{k!}" />
                </div>
                 <ul className="list-disc pl-6 space-y-2 text-sm mt-4">
                    <li><InlineMath math="k" /> is the number of occurrences of an event.</li>
                    <li><InlineMath math="\lambda" /> (lambda) is the average number of events per interval.</li>
                    <li><InlineMath math="e" /> is Euler's number (approximately 2.71828).</li>
                </ul>
            </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Interactive Poisson Distribution</CardTitle>
            <CardDescription>Adjust the rate parameter (λ) to see how the shape of the distribution changes. Notice how for large λ, the distribution starts to look like a normal distribution.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="max-w-md mx-auto mb-6">
                <div className="space-y-3">
                    <Label htmlFor="lambda-slider">Average Rate (λ): {lambda.toFixed(1)}</Label>
                    <Slider id="lambda-slider" min={0.1} max={20} step={0.1} value={[lambda]} onValueChange={(val) => setLambda(val[0])} />
                </div>
            </div>
            <DistributionChart
                chartData={chartData}
                chartType="bar"
                xAxisDataKey="events"
                yAxisDataKey="probability"
                mean={mean}
                variance={variance}
            />
          </CardContent>
        </Card>
      </div>
    </>
  );
}
