
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
import Script from 'next/script';

// --- Math & Simulation Logic ---
const exponentialPdf = (x: number, lambda: number): number => {
    if (x < 0 || lambda <= 0) {
        return 0;
    }
    return lambda * Math.exp(-lambda * x);
};

// --- Chart Component ---
const ExponentialDistributionChart = ({ lambda }: { lambda: number }) => {
  const { chartData, mean, variance } = useMemo(() => {
    const data = [];
    const points = 200;
    // Determine a reasonable range, e.g., up to a value where CDF is ~0.99
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
    <div>
        <ChartContainer config={{}} className="h-[300px] w-full">
            <AreaChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="value" type="number" domain={[0, 'dataMax']} tickFormatter={(val) => val.toFixed(1)} name="Value" />
                <YAxis name="Density" domain={[0, 'dataMax']} />
                <Tooltip
                    content={<ChartTooltipContent
                        labelFormatter={(label) => `Value: ${Number(label).toFixed(2)}`}
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
  loading: () => <Skeleton className="h-[300px] w-full" />,
});


// --- Main Page Component ---
export default function ExponentialDistributionPage() {
    const [lambda, setLambda] = useState(1); // Rate parameter

  return (
    <>
      <Script
        id="mathjax-config"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.MathJax = {
              tex: {
                inlineMath: [['$', '$'], ['\\(', '\\)']],
                displayMath: [['$$', '$$'], ['\\[', '\\]']],
              },
              svg: {
                fontCache: 'global'
              }
            };
          `,
        }}
      />
      <Script
        src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-svg.js"
        strategy="afterInteractive"
        id="mathjax-script"
      />
      <PageHeader
        title="Exponential Distribution"
        description="Modeling the time until the next event in a Poisson process."
        variant="aligned-left"
      />
      <div className="mx-auto max-w-5xl space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">The "Time-Between-Events" Distribution</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-base leading-relaxed text-foreground/90">
            <p>
                The Exponential distribution is a continuous probability distribution used to model the time we need to wait before a given event occurs. It is closely linked to the Poisson distribution: if the number of events in a time interval follows a Poisson distribution, then the time between those events follows an Exponential distribution.
            </p>
            <p>
              In finance, it can model the time between trades on an exchange, the time until a company defaults on its debt, or the time until a stock price hits a certain level. A key property is that it is "memoryless"—the probability of an event occurring in the next minute is the same, regardless of how long we've already been waiting.
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
                  $$f(x; \lambda) = \lambda e^{-\lambda x}$$
                </div>
                 <ul className="list-disc pl-6 space-y-2 text-sm mt-4">
                    <li><code className="font-mono bg-background px-1 rounded">$x$</code> is the time variable (must be >= 0).</li>
                    <li><code className="font-mono bg-background px-1 rounded">$\lambda$</code> (lambda) is the <strong>rate</strong> parameter, representing the average number of events per unit of time.</li>
                </ul>
            </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Interactive Exponential Distribution</CardTitle>
            <CardDescription>Adjust the rate parameter (λ) to see how the shape of the distribution changes. A higher rate means events happen more frequently, so the probability of a short waiting time is high.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="max-w-md mx-auto mb-6">
                <div className="space-y-3">
                    <Label htmlFor="lambda-slider">Rate (λ): {lambda.toFixed(1)}</Label>
                    <Slider id="lambda-slider" min={0.1} max={5} step={0.1} value={[lambda]} onValueChange={(val) => setLambda(val[0])} />
                </div>
            </div>
            <DynamicExponentialDistributionChart lambda={lambda} />
          </CardContent>
        </Card>
      </div>
    </>
  );
}
