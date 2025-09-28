
'use client';

import type { ComponentType } from 'react';
import React from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { ChartTooltipContent } from '@/lib/chart-config';
import { ChartContainer, type ChartConfig } from '@/components/ui/chart';
import { Bar, BarChart, CartesianGrid, Legend, ReferenceLine, Tooltip, XAxis, YAxis } from 'recharts';
import { generateNormalData, getMean } from '@/lib/math';
import { InteractiveTestPage } from '@/components/app/interactive-test-page';

// This file is being refactored to export data and use the InteractiveTestPage component.
// All imports from 'recharts' and other heavy libraries should eventually be moved
// into the dynamically loaded chart components within InteractiveTestPage.

// --- Chart Configs ---
const oneSampleZTestChartConfig = {
  value: { label: "Stock A's Recent Avg.", color: 'hsl(var(--chart-1))' },
} satisfies ChartConfig;

const twoSampleZTestChartConfig = {
  Stock_A: { label: 'Stock A', color: 'hsl(var(--chart-1))' },
  Stock_B: { label: 'Stock B', color: 'hsl(var(--chart-2))' },
} satisfies ChartConfig;

// --- Chart Components ---
const OneSampleZTestChart = () => {
  const [meanValue, setMeanValue] = React.useState(0.08);
  const target = 0.05;
  const chartData = [{ name: "Stock_A_Recent_Avg", value: meanValue }];

  return (
    <div className="flex h-[420px] w-full flex-col">
      <div className="flex-grow">
        <ChartContainer config={oneSampleZTestChartConfig} className="h-full w-full">
          <BarChart accessibilityLayer data={chartData} layout="vertical" margin={{ top: 20, right: 40, bottom: 20, left: 20 }}>
            <CartesianGrid horizontal={false} />
            <YAxis type="category" dataKey="name" tickLine={false} axisLine={false} width={120} tickFormatter={() => "Stock A's Recent Avg."} />
            <XAxis type="number" unit="%" domain={[-0.2, 0.3]} />
            <Tooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Bar dataKey="value" radius={8} fill="var(--color-value)" />
            <ReferenceLine x={target} stroke="hsl(var(--destructive))" strokeWidth={2} strokeDasharray="3 3">
              <Label value={`Historical Avg: ${target}%`} position="insideTopRight" fill="hsl(var(--destructive))" fontSize={12} />
            </ReferenceLine>
          </BarChart>
        </ChartContainer>
      </div>
      <div className="mx-auto max-w-sm flex-shrink-0 text-center">
        <div className="py-4">
          <Label htmlFor="mean-slider">Adjust Stock A&apos;s Recent Avg. Daily Return (%)</Label>
          <Slider id="mean-slider" min={-0.1} max={0.2} value={[meanValue]} step={0.005} onValueChange={(value) => setMeanValue(value[0])} className="my-4" />
        </div>
        <div className="text-sm text-muted-foreground">Current Mean: <span className="font-bold text-foreground">{meanValue.toFixed(3)}</span> %</div>
      </div>
    </div>
  );
};

const TwoSampleZTestChart = () => {
  const [chartData, setChartData] = React.useState<any[]>([]);
  const generateData = () => {
    const dataA = generateNormalData(1.8, 0.7, 1260);
    const dataB = generateNormalData(1.6, 0.8, 1260);
    setChartData([{ month: 'Volatility', Stock_A: getMean(dataA), Stock_B: getMean(dataB) }]);
  };
  React.useEffect(() => { generateData(); }, []);

  return (
    <div className="flex h-[420px] w-full flex-col">
      <div className="flex-grow">
        <ChartContainer config={twoSampleZTestChartConfig} className="h-full w-full">
          <BarChart accessibilityLayer data={chartData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="month" tickLine={false} tickMargin={10} axisLine={false} />
            <YAxis unit="%" />
            <Tooltip content={<ChartTooltipContent indicator='dot' />} />
            <Legend />
            <Bar dataKey="Stock_A" radius={4} fill="var(--color-Stock_A)" />
            <Bar dataKey="Stock_B" radius={4} fill="var(--color-Stock_B)" />
          </BarChart>
        </ChartContainer>
      </div>
      <div className="mt-4 flex-shrink-0 text-center">
        <Button onClick={generateData}>Simulate New 5-Year Period</Button>
      </div>
    </div>
  );
};

// --- Page Data ---
const pageData = {
  title: 'An Interactive Guide to the Z-Test for Trading',
  description: 'The Z-test is used for comparing means with large samples when population variance is known. This guide explains its types with interactive trading examples.',
  coreConcepts: [
    {
      title: 'Purpose & Analogy',
      description: "A Z-test, like a t-test, checks if differences in means are significant. However, it's used for large crowds (samples > 30) where you already have a map of the entire population's variability (known population standard deviation).",
    },
    {
      title: 'Key Assumptions',
      description: 'The main requirements are a large sample size (n > 30), approximately normally distributed data, and critically, a known population standard deviation. This last point makes it rarer in practice than the t-test.',
    },
  ],
  examples: [
    {
      id: 'one-sample',
      title: 'One-Sample Z-Test',
      description: "This test compares the mean of a single, large sample from one timeframe against its known, long-term population average. It's useful for seeing if a recent change has had a statistically significant effect.",
      exampleText: "After a major platform update, you analyze the daily returns of 'Stock A' for the last 100 trading days. You want to know if its average daily return is now different from its known historical average of 0.05% over the past 10 years (with a population standard deviation of 1.2%).",
      ChartComponent: OneSampleZTestChart as ComponentType,
    },
    {
      id: 'two-sample',
      title: 'Two-Sample Z-Test',
      description: "This test compares the means of two large, independent stocks or assets. It's used when you have extensive historical data that provides the population standard deviations for both.",
      exampleText: "A firm compares the average daily volatility of 'Stock A' vs. 'Stock B' over the past five years (~1260 data points each). With known population standard deviations for both stocks' volatility, they test if there is a significant difference between them.",
      ChartComponent: TwoSampleZTestChart as ComponentType,
    },
  ],
};

// --- Page Component ---
export default function ZTestPage() {
  return <InteractiveTestPage {...pageData} />;
}
