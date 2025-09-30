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
const laplacePdf = (x: number, mu: number, b: number): number => {
    if (b <= 0) return 0;
    return (1 / (2 * b)) * Math.exp(-Math.abs(x - mu) / b);
};

// --- Chart Component ---
const LaplaceDistributionChart = ({ location, scale }: { location: number; scale: number }) => {
  const { chartData, mean, variance } = useMemo(() => {
    const data = [];
    const points = 400;
    const range = Math.max(20, scale * 15);
    const start = location - range / 2;
    const end = location + range / 2;
    const step = (end - start) / points;

    for (let i = 0; i <= points; i++) {
        const x = start + i * step;
        data.push({
            value: x,
            density: laplacePdf(x, location, scale),
        });
    }
    
    const calculatedMean = location;
    const calculatedVariance = 2 * scale * scale;

    return { chartData: data, mean: calculatedMean, variance: calculatedVariance };
  }, [location, scale]);

  return (
    <div>
        <ChartContainer config={{}} className="h-[300px] w-full">
            <AreaChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="value" type="number" domain={['dataMin', 'dataMax']} tickFormatter={(val) => val.toFixed(1)} name="Value" />
                <YAxis name="Density" domain={[0, 'dataMax']} />
                <Tooltip
                    content={<ChartTooltipContent
                        labelFormatter={(label) => `Value: ${Number(label).toFixed(2)}`}
                        formatter={(value) => [Number(value).toFixed(4), 'Density']}
                    />}
                />
                 <defs>
                    <linearGradient id="fillLaplace" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0.1} />
                    </linearGradient>
                </defs>
                <Area type="monotone" dataKey="density" stroke="hsl(var(--chart-1))" fill="url(#fillLaplace)" strokeWidth={2} dot={false} />
            </AreaChart>
        </ChartContainer>
         <div className="grid grid-cols-2 text-center text-xs text-muted-foreground mt-4">
            <div>
                Mean / Median / Mode: <span className="font-semibold text-foreground block">{mean.toFixed(2)}</span>
            </div>
            <div>
                Variance (2b²): <span className="font-semibold text-foreground block">{variance.toFixed(2)}</span>
            </div>
        </div>
    </div>
  );
};

const DynamicLaplaceDistributionChart = dynamic(() => Promise.resolve(LaplaceDistributionChart), {
  ssr: false,
  loading: () => <Skeleton className="h-[340px] w-full" />,
});


// --- Main Page Component ---
export default function LaplaceDistributionPage() {
    const [location, setLocation] = useState(0); // mu
    const [scale, setScale] = useState(1);   // b

  return (
    <>
      <PageHeader
        title="Laplace Distribution"
        description="A sharp-peaked, fat-tailed alternative to the Normal Distribution."
        variant="aligned-left"
      />
      <div className="mx-auto max-w-5xl space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">The "Double Exponential" Distribution</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-base leading-relaxed text-foreground/90">
            <p>
                The Laplace distribution is a continuous probability distribution that is notable for its sharper peak at the mean and its "fatter" tails compared to the Normal distribution. This means it assigns higher probability to values near the mean and also to extreme outlier events.
            </p>
            <p>
              In finance and machine learning, this makes it a valuable tool. It can model financial returns that are more prone to extreme events than a normal model would suggest. It is also intrinsically linked to LASSO (L1) regularization, a popular technique in regression for feature selection, because its shape naturally encourages some parameters to go to zero.
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
                  <BlockMath math="f(x | \mu, b) = \frac{1}{2b} \exp\left( -\frac{|x - \mu|}{b} \right)" />
                </div>
                 <ul className="list-disc pl-6 space-y-2 text-sm mt-4">
                    <li><InlineMath math="\mu" /> (mu) is the <strong>location</strong> parameter, which is also the mean, median, and mode.</li>
                    <li><InlineMath math="b > 0" /> is the <strong>scale</strong> parameter (must be > 0), which controls the spread or "width" of the distribution. A larger b results in a wider, flatter curve.</li>
                </ul>
            </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Interactive Laplace Distribution</CardTitle>
            <CardDescription>Adjust the location (μ) and scale (b) parameters to see how the distinctive shape of the distribution changes.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
                <div className="space-y-3">
                    <Label htmlFor="location-slider">Location (μ): {location.toFixed(1)}</Label>
                    <Slider id="location-slider" min={-5} max={5} step={0.1} value={[location]} onValueChange={(val) => setLocation(val[0])} />
                </div>
                <div className="space-y-3">
                    <Label htmlFor="scale-slider">Scale (b): {scale.toFixed(1)}</Label>
                    <Slider id="scale-slider" min={0.1} max={5} step={0.1} value={[scale]} onValueChange={(val) => setScale(val[0])} />
                </div>
            </div>
            <DynamicLaplaceDistributionChart location={location} scale={scale} />
          </CardContent>
        </Card>
      </div>
    </>
  );
}
