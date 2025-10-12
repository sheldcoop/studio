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
const weibullPdf = (x: number, k: number, lambda: number): number => {
    if (x < 0 || k <= 0 || lambda <= 0) {
        return 0;
    }
    return (k / lambda) * Math.pow(x / lambda, k - 1) * Math.exp(-Math.pow(x / lambda, k));
};

// --- Chart Component ---
const WeibullDistributionChart = ({ shape, scale }: { shape: number; scale: number }) => {
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

    return { chartData: data };
  }, [shape, scale]);

  return (
    <div>
      <ChartContainer config={{}} className="h-[300px] w-full">
        <AreaChart data={chartData.chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="value" type="number" domain={[0, 'dataMax']} tickFormatter={(val) => val.toFixed(1)} name="Value (x)" />
          <YAxis name="Density" domain={[0, 'dataMax']} />
          <Tooltip
            content={<ChartTooltipContent
              labelFormatter={(label) => `Value: ${Number(label).toFixed(2)}`}
              formatter={(value) => [Number(value).toFixed(4), 'Density']}
            />}
          />
          <defs>
            <linearGradient id="fillWeibull" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.8} />
              <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0.1} />
            </linearGradient>
          </defs>
          <Area type="monotone" dataKey="density" stroke="hsl(var(--chart-1))" fill="url(#fillWeibull)" strokeWidth={2} dot={false} />
        </AreaChart>
      </ChartContainer>
    </div>
  );
};

const DynamicWeibullDistributionChart = dynamic(() => Promise.resolve(WeibullDistributionChart), {
  ssr: false,
  loading: () => <Skeleton className="h-[300px] w-full" />,
});

// --- Main Page Component ---
export default function WeibullDistributionComponent() {
  const [shape, setShape] = useState(2); // k
  const [scale, setScale] = useState(1); // lambda

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
            <DynamicWeibullDistributionChart shape={shape} scale={scale} />
          </CardContent>
        </Card>
      </div>
    </>
  );
}
