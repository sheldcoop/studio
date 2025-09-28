
'use client';

import type { ComponentType } from 'react';
import React from 'react';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { ChartTooltipContent } from '@/lib/chart-config';
import { ChartContainer, type ChartConfig } from '@/components/ui/chart';
import { Scatter, ScatterChart, CartesianGrid, Tooltip, XAxis, YAxis } from 'recharts';
import { InteractiveTestPage } from '@/components/app/interactive-test-page';

// This file is being refactored to export data and use the InteractiveTestPage component.
// All imports from 'recharts' and other heavy libraries should eventually be moved
// into the dynamically loaded chart components within InteractiveTestPage.

// --- Helper Function ---
const generateCorrelatedData = (
  n: number,
  correlation: number,
  meanX = 50, meanY = 50,
  stdDevX = 10, stdDevY = 10
) => {
  const data = [];
  for (let i = 0; i < n; i++) {
    const u1 = Math.random();
    const u2 = Math.random();
    const z1 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
    const z2 = Math.sqrt(-2 * Math.log(u1)) * Math.sin(2 * Math.PI * u2);
    const x = meanX + stdDevX * z1;
    const y = meanY + stdDevY * (correlation * z1 + Math.sqrt(1 - correlation ** 2) * z2);
    data.push({ x, y });
  }
  return data;
};

// --- Chart Config ---
const pearsonCorrelationChartConfig = {
  data: { label: 'Data', color: 'hsl(var(--chart-1))' },
} satisfies ChartConfig;

// --- Chart Component ---
const PearsonCorrelationChart = () => {
  const [correlation, setCorrelation] = React.useState(0.8);
  const [chartData, setChartData] = React.useState<any[]>([]);
  React.useEffect(() => { setChartData(generateCorrelatedData(100, correlation)); }, [correlation]);

  return (
    <div className="flex h-[420px] w-full flex-col">
      <div className="relative mx-auto flex-grow w-full max-w-2xl">
        <ChartContainer config={pearsonCorrelationChartConfig} className="h-full w-full">
          <ScatterChart accessibilityLayer margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            <CartesianGrid />
            <XAxis type="number" dataKey="x" name="Asset A" unit="%" />
            <YAxis type="number" dataKey="y" name="Asset B" unit="%" />
            <Tooltip cursor={{ strokeDasharray: '3 3' }} content={<ChartTooltipContent indicator="dot" />} />
            <Scatter data={chartData} fill="var(--color-data)" />
          </ScatterChart>
        </ChartContainer>
      </div>
      <div className="mx-auto max-w-sm flex-shrink-0 text-center">
        <div className="py-4">
          <Label htmlFor="correlation-slider">Adjust Correlation Coefficient</Label>
          <Slider
            id="correlation-slider"
            min={-1}
            max={1}
            value={[correlation]}
            step={0.1}
            onValueChange={(value) => setCorrelation(value[0])}
            className="my-4"
          />
        </div>
        <p>Current Correlation: {correlation.toFixed(1)}</p>
      </div>
    </div>
  );
};

// --- Page Data ---
const pageData = {
  title: 'Interactive Guide to Pearson Correlation',
  description: 'Measure the linear relationship between two continuous variables, a cornerstone of portfolio diversification and pairs trading.',
  coreConcepts: [
    {
      title: 'Purpose & Analogy',
      description: 'Pearson Correlation measures how well two assets move in relation to each other. It gives a value between -1 (perfectly opposite movement) and +1 (perfectly identical movement). A value of 0 means no linear relationship. Think of it as a "dance partner" score for stocks.',
    },
    {
      title: 'Interpretation',
      description: 'Crucial for diversification—combining negatively correlated assets can reduce overall portfolio risk.',
    },
  ],
  examples: [
    {
      id: 'pearson-correlation',
      title: 'Visualizing Pearson Correlation',
      description: 'A scatter plot is the best way to visualize the relationship between two variables. The tighter the points are to forming a straight line, the stronger the linear correlation.',
      exampleText: "We plot the daily returns of two assets. By adjusting the slider, you can change the underlying correlation between their returns and see how it affects the scatter plot. This is fundamental to pairs trading, where you look for highly correlated assets whose prices have temporarily diverged.",
      ChartComponent: PearsonCorrelationChart as ComponentType,
    },
  ],
};

// --- Page Component ---
export default function PearsonCorrelationPage() {
  return <InteractiveTestPage {...pageData} />;
}
