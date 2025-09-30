'use client';

import { useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
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
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
import { Skeleton } from '@/components/ui/skeleton';
import { BlockMath, InlineMath } from 'react-katex';

// --- Math & Simulation Logic ---
const factorial = (n: number): number => {
    let result = 1;
    for (let i = 2; i <= n; i++) {
        result *= i;
    }
    return result;
};

const poissonProbability = (lambda: number, k: number): number => {
    return (Math.pow(lambda, k) * Math.exp(-lambda)) / factorial(k);
};

// --- Chart Component ---
const PoissonDistributionChart = ({ lambda }: { lambda: number }) => {
  const chartData = useMemo(() => {
    const data = [];
    // Calculate up to a reasonable limit, e.g., lambda + 4 * sqrt(lambda) or at least 20
    const limit = Math.ceil(Math.max(20, lambda + 4 * Math.sqrt(lambda)));
    for (let k = 0; k <= limit; k++) {
      data.push({
        events: k.toString(),
        probability: poissonProbability(lambda, k),
      });
    }
    return data;
  }, [lambda]);

  return (
    <div>
        <ChartContainer config={{}} className="h-[300px] w-full">
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="events" name="Number of Events" />
                <YAxis name="Probability" domain={[0, 'dataMax']} />
                <Tooltip
                    content={<ChartTooltipContent
                        labelFormatter={(label) => `Events: ${label}`}
                        formatter={(value, name) => [Number(value).toFixed(4), 'Probability']}
                    />}
                />
                <Bar dataKey="probability" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            </BarChart>
        </ChartContainer>
         <div className="grid grid-cols-2 text-center text-xs text-muted-foreground mt-4">
            <div>
                Mean (μ = λ): <span className="font-semibold text-foreground block">{lambda.toFixed(2)}</span>
            </div>
            <div>
                Variance (σ² = λ): <span className="font-semibold text-foreground block">{lambda.toFixed(2)}</span>
            </div>
        </div>
    </div>
  );
};

const DynamicPoissonDistributionChart = dynamic(() => Promise.resolve(PoissonDistributionChart), {
  ssr: false,
  loading: () => <Skeleton className="h-[300px] w-full" />,
});


// --- Main Page Component ---
export default function PoissonDistributionPage() {
    const [lambda, setLambda] = useState(5);

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
            <DynamicPoissonDistributionChart lambda={lambda} />
          </CardContent>
        </Card>
      </div>
    </>
  );
}
