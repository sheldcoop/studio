
'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { PageHeader } from '@/components/app/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { ChartTooltipContent } from '@/lib/chart-config';
import { ChartContainer, type ChartConfig } from '@/components/ui/chart';
import { Scatter, ScatterChart as RechartsScatterChart, CartesianGrid, Tooltip, XAxis, YAxis } from 'recharts';

// Helper function to generate data with a monotonic (but not necessarily linear) relationship
const generateMonotonicData = (n: number, strength: number) => {
  const data = [];
  for (let i = 0; i < n; i++) {
    const x = Math.random() * 100;
    // The strength parameter controls the amount of noise. A higher strength means less noise.
    const noise = (Math.random() - 0.5) * (50 / strength);
    // A non-linear relationship (y = x^2) is used to demonstrate Spearman's strength.
    const y = Math.pow(x / 10, 2) + noise;
    data.push({ x, y });
  }
  return data;
};

const spearmanCorrelationChartConfig = {
  data: {
    label: 'Data',
    color: 'hsl(var(--chart-1))',
  },
} satisfies ChartConfig;


const SpearmanCorrelationChart = () => {
  const [strength, setStrength] = useState(3);
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    const data = generateMonotonicData(100, strength);
    setChartData(data);
  }, [strength]);


  return (
    <div className="flex h-fit w-full flex-col">
      <div className="relative mx-auto flex-grow w-full max-w-2xl">
        <ChartContainer config={spearmanCorrelationChartConfig} className="h-[350px] w-full">
          <RechartsScatterChart
            accessibilityLayer
            margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
          >
            <CartesianGrid />
            <XAxis type="number" dataKey="x" name="Sentiment" />
            <YAxis type="number" dataKey="y" name="Return" unit="%" />
            <Tooltip
              cursor={{ strokeDasharray: '3 3' }}
              content={<ChartTooltipContent indicator="dot" />}
            />
            <Scatter data={chartData} fill="var(--color-data)" />
          </RechartsScatterChart>
        </ChartContainer>
      </div>
      <div className="mx-auto max-w-sm flex-shrink-0 text-center">
        <div className="py-4">
          <Label htmlFor="strength-slider">Adjust Relationship Strength</Label>
          <Slider
            id="strength-slider"
            min={1}
            max={10}
            value={[strength]}
            step={0.5}
            onValueChange={(value) => setStrength(value[0])}
            className="my-4"
          />
        </div>
        <p className="text-sm text-muted-foreground">Current Strength: {strength.toFixed(1)}</p>
      </div>
    </div>
  );
};

const DynamicSpearmanCorrelationChart = dynamic(() => Promise.resolve(SpearmanCorrelationChart), { ssr: false });

export default function SpearmansRankCorrelationPage() {
  return (
    <>
      <PageHeader
        title="Interactive Guide to Spearman's Rank Correlation"
        description="Measure the strength of a monotonic relationship between two variables, even when it's not linear."
      />
      <div className="mx-auto max-w-5xl space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Core Concepts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <h3 className="mb-1 font-semibold text-primary">
                  Purpose & Analogy
                </h3>
                <p className="text-muted-foreground">
                  Spearman's correlation is Pearson's flexible cousin. Instead of checking for a straight-line relationship, it checks for a **monotonic** one—does one variable consistently increase or decrease as the other does, even if not at a constant rate? It works by converting values to ranks first.
                </p>
              </div>
              <div>
                <h3 className="mb-1 font-semibold text-primary">
                  When to Use It
                </h3>
                <p className="text-muted-foreground">
                  Use Spearman's when the relationship between your variables is not linear, or when your data has significant outliers that would skew a Pearson correlation. It's perfect for capturing relationships that "level off" or accelerate.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Visualizing Monotonic Relationships</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-muted-foreground">
              A scatter plot can reveal relationships that aren't linear. Spearman's can detect a strong relationship even if the points form a curve.
            </p>
            <p className="text-sm text-muted-foreground mb-4">
              <span className="font-semibold text-foreground">Example:</span> Let's say we're analyzing the relationship between a custom 'Market Sentiment Score' and a stock's daily return. The return might increase faster as sentiment gets very high. A linear model (Pearson) would miss this, but Spearman's would capture the strong monotonic trend.
            </p>
            <div className="mt-4 rounded-lg bg-background/50 p-4">
              <DynamicSpearmanCorrelationChart />
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
