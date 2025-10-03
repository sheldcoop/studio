'use client';

import { useState, useEffect, useMemo } from 'react';
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
import { ChartContainer } from '@/components/ui/chart';
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, ReferenceLine, Tooltip } from 'recharts';
import { Skeleton } from '@/components/ui/skeleton';
import { standardNormalPdf } from '@/lib/math';

// --- Chart Component ---

const NormalDistributionChart = ({ mean, stdDev }: { mean: number; stdDev: number }) => {
  const chartData = useMemo(() => {
    const data = [];
    const points = 200;
    const range = stdDev * 8;
    const start = mean - range / 2;
    const end = mean + range / 2;
    const step = (end - start) / points;

    for (let i = 0; i <= points; i++) {
      const x = start + i * step;
      const y = standardNormalPdf((x - mean) / stdDev) / stdDev;
      data.push({ x, y });
    }
    return data;
  }, [mean, stdDev]);
  
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
        <div className="rounded-lg border bg-background p-2 text-sm shadow-sm">
            <p>Value (X): {Number(label).toFixed(2)}</p>
            <p>Density: {payload[0].value.toFixed(4)}</p>
        </div>
        );
    }
    return null;
  };

  return (
    <ChartContainer config={{}} className="h-[350px] w-full">
      <AreaChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis type="number" dataKey="x" name="Value" domain={['dataMin', 'dataMax']} tickFormatter={(val) => val.toFixed(1)} />
        <YAxis dataKey="y" name="Density" domain={[0, 'dataMax']} />
        <Tooltip content={<CustomTooltip />} />
        <defs>
          <linearGradient id="fillNormal" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.8} />
            <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0.1} />
          </linearGradient>
        </defs>
        <Area type="monotone" dataKey="y" stroke="hsl(var(--chart-1))" fill="url(#fillNormal)" strokeWidth={2} dot={false} />
        
        {/* Mean and Standard Deviation lines */}
        <ReferenceLine x={mean} stroke="hsl(var(--destructive))" strokeWidth={2} />
        <ReferenceLine x={mean + stdDev} stroke="hsl(var(--foreground))" strokeDasharray="3 3" />
        <ReferenceLine x={mean - stdDev} stroke="hsl(var(--foreground))" strokeDasharray="3 3" />
        <ReferenceLine x={mean + 2 * stdDev} stroke="hsl(var(--foreground))" strokeDasharray="3 3" />
        <ReferenceLine x={mean - 2 * stdDev} stroke="hsl(var(--foreground))" strokeDasharray="3 3" />
      </AreaChart>
    </ChartContainer>
  );
};

const DynamicNormalDistributionChart = dynamic(() => Promise.resolve(NormalDistributionChart), {
  ssr: false,
  loading: () => <Skeleton className="h-[350px] w-full" />,
});

// --- Main Page Component ---
export default function NormalDistributionPage() {
  const [mean, setMean] = useState(0);
  const [stdDev, setStdDev] = useState(1);

  return (
    <>
      <PageHeader
        title="The Normal Distribution"
        description="Explore the 'bell curve,' the most important probability distribution in statistics."
        variant="aligned-left"
      />
      <div className="mx-auto max-w-5xl space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">What is the Normal Distribution?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-base leading-relaxed text-foreground/90">
            <p>
              The Normal Distribution, often called the "bell curve," is a probability distribution that is symmetric about the mean. It shows that data near the mean are more frequent in occurrence than data far from the mean.
            </p>
            <p>
              In finance, it's the foundational assumption for many models, including the Black-Scholes option pricing model. While real financial returns often have "fatter tails" (more extreme events) than a perfect normal distribution, it remains the starting point for risk management and portfolio theory.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Interactive Bell Curve</CardTitle>
            <CardDescription>Adjust the mean and standard deviation to see how they affect the shape and position of the curve.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
                <div className="space-y-3">
                    <Label htmlFor="mean-slider">Mean (μ): {mean.toFixed(2)}</Label>
                    <Slider id="mean-slider" min={-5} max={5} step={0.1} value={[mean]} onValueChange={(val) => setMean(val[0])} />
                    <p className="text-xs text-muted-foreground">The mean determines the center of the distribution.</p>
                </div>
                <div className="space-y-3">
                    <Label htmlFor="stddev-slider">Standard Deviation (σ): {stdDev.toFixed(2)}</Label>
                    <Slider id="stddev-slider" min={0.5} max={3} step={0.1} value={[stdDev]} onValueChange={(val) => setStdDev(val[0])} />
                    <p className="text-xs text-muted-foreground">The standard deviation determines the spread. A smaller value makes the curve taller and narrower.</p>
                </div>
            </div>
            <DynamicNormalDistributionChart mean={mean} stdDev={stdDev} />
          </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle className="font-headline">The Empirical Rule (68-95-99.7)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-base leading-relaxed text-foreground/90">
                <p>For a normal distribution, almost all data falls within three standard deviations of the mean.</p>
                <ul className="list-disc pl-6 space-y-1">
                    <li>Approximately <strong className="text-primary">68%</strong> of the data falls within one standard deviation of the mean.</li>
                    <li>Approximately <strong className="text-primary">95%</strong> of the data falls within two standard deviations of the mean.</li>
                    <li>Approximately <strong className="text-primary">99.7%</strong> of the data falls within three standard deviations of the mean.</li>
                </ul>
                <p className="pt-2">This rule is a quick way for quants to estimate the probability of an event and identify potential outliers.</p>
            </CardContent>
        </Card>
      </div>
    </>
  );
}
