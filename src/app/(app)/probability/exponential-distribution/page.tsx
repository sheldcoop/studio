
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
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
import { Skeleton } from '@/components/ui/skeleton';
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';

// --- Math & Simulation Logic ---
const exponentialPdf = (x: number, lambda: number): number => {
    if (x < 0 || lambda <= 0) {
        return 0;
    }
    return lambda * Math.exp(-lambda * x);
};

// --- Chart Component ---
const ExponentialDistributionChart = ({ rate }: { rate: number }) => {
  const { chartData, mean, variance } = useMemo(() => {
    const data = [];
    const points = 200;
    // The range should cover several multiples of the mean (1/rate)
    const rangeEnd = 5 / rate;
    
    for (let i = 0; i <= points; i++) {
        const x = (i / points) * rangeEnd;
        data.push({
            value: x,
            density: exponentialPdf(x, rate),
        });
    }

    const calculatedMean = 1 / rate;
    const calculatedVariance = 1 / (rate * rate);

    return { chartData: data, mean: calculatedMean, variance: calculatedVariance };
  }, [rate]);

  return (
    <div>
        <ChartContainer config={{}} className="h-[300px] w-full">
            <AreaChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="value" type="number" domain={[0, 'dataMax']} tickFormatter={(val) => val.toFixed(1)} name="Time (x)" />
                <YAxis name="Density" domain={[0, 'dataMax']} />
                <Tooltip
                    content={<ChartTooltipContent
                        labelFormatter={(label) => `Time: ${Number(label).toFixed(2)}`}
                        formatter={(value) => [Number(value).toFixed(4), 'Density']}
                    />}
                />
                 <defs>
                    <linearGradient id="fillExponential" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0.1} />
                    </linearGradient>
                </defs>
                <Area type="monotone" dataKey="density" stroke="hsl(var(--chart-1))" fill="url(#fillExponential)" strokeWidth={2} dot={false} />
            </AreaChart>
        </ChartContainer>
         <div className="grid grid-cols-2 text-center text-xs text-muted-foreground mt-4">
            <div>
                Mean (1/λ): <span className="font-semibold text-foreground block">{mean.toFixed(2)}</span>
            </div>
            <div>
                Variance (1/λ²): <span className="font-semibold text-foreground block">{variance.toFixed(2)}</span>
            </div>
        </div>
    </div>
  );
};

const DynamicExponentialDistributionChart = dynamic(() => Promise.resolve(ExponentialDistributionChart), {
  ssr: false,
  loading: () => <Skeleton className="h-[340px] w-full" />,
});


// --- Main Page Component ---
export default function ExponentialDistributionPage() {
    const [rate, setRate] = useState(1);   // Lambda (rate)

  return (
    <>
      <PageHeader
        title="Exponential Distribution"
        description="Modeling the time between events in a Poisson process."
        variant="aligned-left"
      />
      <div className="mx-auto max-w-5xl space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">The "Time-Until-Next-Event" Distribution</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-base leading-relaxed text-foreground/90">
            <p>
                The Exponential distribution is a continuous probability distribution that models the time between events in a process where events occur continuously and independently at a constant average rate. It's the continuous counterpart to the discrete Geometric distribution.
            </p>
            <p>
              If the number of defaults in a credit portfolio follows a Poisson distribution with a certain average rate, then the time until the *next* default follows an Exponential distribution. It's widely used in quantitative finance for modeling the time until a market crash, the time until a bond defaults, or the duration between large price swings.
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
            <CardDescription>Adjust the rate parameter (λ) to see how the shape of the distribution changes. A higher rate means events happen more frequently, so the time between them is shorter and the curve is more concentrated near zero.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-1 gap-8 mb-6">
                <div className="space-y-3">
                    <Label htmlFor="rate-slider">Rate (λ): {rate.toFixed(1)}</Label>
                    <Slider id="rate-slider" min={0.1} max={5} step={0.1} value={[rate]} onValueChange={(val) => setRate(val[0])} />
                </div>
            </div>
            <DynamicExponentialDistributionChart rate={rate} />
          </CardContent>
        </Card>
      </div>
    </>
  );
}
