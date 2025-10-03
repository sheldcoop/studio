
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
const logNormalPdf = (x: number, mu: number, sigma: number): number => {
    if (x <= 0 || sigma <= 0) {
        return 0;
    }
    const term1 = 1 / (x * sigma * Math.sqrt(2 * Math.PI));
    const term2 = Math.exp(-Math.pow(Math.log(x) - mu, 2) / (2 * sigma * sigma));
    return term1 * term2;
};

// --- Chart Component ---
const LognormalDistributionChart = ({ mu, sigma }: { mu: number; sigma: number }) => {
  const { chartData, mean, variance } = useMemo(() => {
    const data = [];
    const points = 200;
    // Determine a reasonable range for the x-axis
    const rangeEnd = Math.exp(mu + 3 * sigma);
    
    for (let i = 1; i <= points; i++) {
        const x = (i / points) * rangeEnd;
        data.push({
            value: x,
            density: logNormalPdf(x, mu, sigma),
        });
    }

    const calculatedMean = Math.exp(mu + (sigma * sigma) / 2);
    const calculatedVariance = (Math.exp(sigma * sigma) - 1) * Math.exp(2 * mu + sigma * sigma);

    return { chartData: data, mean: calculatedMean, variance: calculatedVariance };
  }, [mu, sigma]);

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
                        formatter={(value, name) => [Number(value).toFixed(4), 'Density']}
                    />}
                />
                 <defs>
                    <linearGradient id="fillLognormal" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0.1} />
                    </linearGradient>
                </defs>
                <Area type="monotone" dataKey="density" stroke="hsl(var(--chart-1))" fill="url(#fillLognormal)" strokeWidth={2} dot={false} />
            </AreaChart>
        </ChartContainer>
         <div className="grid grid-cols-2 text-center text-xs text-muted-foreground mt-4">
            <div>
                Mean: <span className="font-semibold text-foreground block">{mean.toFixed(2)}</span>
            </div>
            <div>
                Variance: <span className="font-semibold text-foreground block">{variance.toFixed(2)}</span>
            </div>
        </div>
    </div>
  );
};

const DynamicLognormalDistributionChart = dynamic(() => Promise.resolve(LognormalDistributionChart), {
  ssr: false,
  loading: () => <Skeleton className="h-[300px] w-full" />,
});


// --- Main Page Component ---
export default function LognormalDistributionPage() {
    const [mu, setMu] = useState(0);
    const [sigma, setSigma] = useState(0.5);

  return (
    <>
      <PageHeader
        title="Lognormal Distribution"
        description="Modeling variables that cannot be negative, like stock prices and asset values."
        variant="aligned-left"
      />
      <div className="mx-auto max-w-5xl space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">The Stock Price Distribution</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-base leading-relaxed text-foreground/90">
            <p>
                The Lognormal Distribution is essential in finance because it models variables that are always positive, like stock prices or asset values. If a variable's logarithm is normally distributed, then the variable itself has a lognormal distribution.
            </p>
            <p>
              This is a perfect fit for modeling stock returns. If we assume that the continuously compounded returns of a stock are normally distributed, then the future price of that stock will be lognormally distributed. This elegantly solves the problem of prices going below zero, which a normal distribution would allow.
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
                  <BlockMath math="f(x) = \frac{1}{x\sigma\sqrt{2\pi}} \exp\left(-\frac{(\ln(x) - \mu)^2}{2\sigma^2}\right)" />
                </div>
                 <ul className="list-disc pl-6 space-y-2 text-sm mt-4">
                    <li><InlineMath math="x" /> is the variable (e.g., stock price), must be <InlineMath math="> 0" />.</li>
                    <li><InlineMath math="\mu" /> (mu) is the mean of the underlying normal distribution (location parameter).</li>
                    <li><InlineMath math="\sigma" /> (sigma) is the standard deviation of the underlying normal distribution (scale parameter).</li>
                </ul>
            </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Interactive Lognormal Distribution</CardTitle>
            <CardDescription>Adjust the location (μ) and scale (σ) parameters of the underlying normal distribution to see how the shape of the lognormal curve changes.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
                <div className="space-y-3">
                    <Label htmlFor="mu-slider">Location (μ): {mu.toFixed(2)}</Label>
                    <Slider id="mu-slider" min={-2} max={2} step={0.1} value={[mu]} onValueChange={(val) => setMu(val[0])} />
                </div>
                <div className="space-y-3">
                    <Label htmlFor="sigma-slider">Scale (σ): {sigma.toFixed(2)}</Label>
                    <Slider id="sigma-slider" min={0.1} max={2} step={0.05} value={[sigma]} onValueChange={(val) => setSigma(val[0])} />
                </div>
            </div>
            <DynamicLognormalDistributionChart mu={mu} sigma={sigma} />
          </CardContent>
        </Card>
      </div>
    </>
  );
}
