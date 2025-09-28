
'use client';

import type { ComponentType } from 'react';
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChartTooltipContent } from '@/lib/chart-config';
import { ChartContainer, type ChartConfig } from '@/components/ui/chart';
import { Line, LineChart, CartesianGrid, Legend, Tooltip, XAxis, YAxis } from 'recharts';
import { generateNormalData } from '@/lib/math';
import { InteractiveTestPage } from '@/components/app/interactive-test-page';

// This file is being refactored to export data and use the InteractiveTestPage component.
// All imports from 'recharts' and other heavy libraries should eventually be moved
// into the dynamically loaded chart components within InteractiveTestPage.

// --- Math Helpers ---
const standardNormalCdf = (x: number) => {
  const t = 1 / (1 + 0.2316419 * Math.abs(x));
  const d = 0.3989423 * Math.exp(-x * x / 2);
  let prob = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
  if (x > 0) prob = 1 - prob;
  return prob;
};

const generateUniformData = (min: number, max: number, n: number) =>
  Array.from({ length: n }, () => min + Math.random() * (max - min));

// --- Chart Config ---
const ksTestChartConfig = {
  empirical: { label: 'Empirical CDF', color: 'hsl(var(--chart-1))' },
  theoretical: { label: 'Theoretical CDF', color: 'hsl(var(--chart-2))' },
} satisfies ChartConfig;

// --- Chart Component ---
const KSTestChart = () => {
  const [chartData, setChartData] = React.useState<any[]>([]);
  const [dataType, setDataType] = React.useState<'normal' | 'uniform'>('normal');

  const generateAndSetData = (type: 'normal' | 'uniform') => {
    const n = 100;
    const mean = 0;
    const stdDev = 1;
    let sampleData: number[] = type === 'normal' ? generateNormalData(mean, stdDev, n) : generateUniformData(-3, 3, n);
    
    const sortedSample = [...sampleData].sort((a,b) => a - b);
    const ecdfPoints = sortedSample.map((val, i) => ({ x: val, empirical: (i+1)/n }));
    const cdfPoints = sortedSample.map(val => ({ x: val, theoretical: standardNormalCdf((val - mean) / stdDev) }));
    const mergedData = ecdfPoints.map((point, i) => ({ ...point, theoretical: cdfPoints[i].theoretical }));
    setChartData(mergedData);
  };

  React.useEffect(() => { generateAndSetData(dataType); }, [dataType]);

  return (
    <div className="flex h-[420px] w-full flex-col">
      <div className="flex-grow">
        <ChartContainer config={ksTestChartConfig} className="h-full w-full">
          <LineChart accessibilityLayer data={chartData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            <CartesianGrid vertical={false} />
            <XAxis type="number" dataKey="x" name="Value" domain={['dataMin', 'dataMax']} tickLine={false} tickMargin={10} axisLine={false} />
            <YAxis domain={[0, 1]} />
            <Tooltip content={<ChartTooltipContent indicator="dot" />} />
            <Legend />
            <Line type="step" dataKey="empirical" stroke="var(--color-empirical)" dot={false} strokeWidth={2} />
            <Line type="monotone" dataKey="theoretical" stroke="var(--color-theoretical)" dot={false} strokeWidth={2} />
          </LineChart>
        </ChartContainer>
      </div>
      <div className="mt-4 flex flex-shrink-0 justify-center gap-4">
        <Button onClick={() => setDataType('normal')} variant={dataType === 'normal' ? 'default' : 'outline'}>Generate Normal Sample</Button>
        <Button onClick={() => setDataType('uniform')} variant={dataType === 'uniform' ? 'default' : 'outline'}>Generate Uniform Sample</Button>
      </div>
      <p className="pt-4 text-center text-sm text-muted-foreground">The K-S statistic is the maximum vertical distance between the two curves.</p>
    </div>
  );
};

// --- Page Data ---
const pageData = {
  title: 'Interactive Guide to the Kolmogorov-Smirnov (K-S) Test',
  description: 'A powerful test to determine if your data follows a specific distribution, like the normal distribution.',
  coreConcepts: [
    {
      title: 'Purpose & Analogy',
      description: "The K-S test acts like a 'goodness-of-fit' ruler. It measures the maximum distance between the shape of your sample data (the Empirical CDF) and the shape of a theoretical distribution (the Theoretical CDF). If the distance is too large, you conclude your data doesn't fit that theoretical shape.",
    },
    {
      title: 'When to Use It',
      description: "The most common use is to test for normality. Before you use a parametric test like a T-Test or ANOVA, you should check if your data is normally distributed. The K-S test is a formal way to do this. It can also be used to check if two different samples come from the same distribution.",
    },
  ],
  examples: [
    {
      id: 'ks-test',
      title: 'Visualizing Goodness-of-Fit',
      description: 'This chart plots the cumulative distribution of your sample data against the ideal cumulative distribution of a perfect normal curve. The closer the two lines are, the better the fit.',
      exampleText: "We generate a sample of data and plot its Empirical Cumulative Distribution Function (ECDF). We then overlay the theoretical Cumulative Distribution Function (CDF) of a normal distribution. Toggle between a normal sample and a uniform sample to see how the ECDF's fit changes.",
      ChartComponent: KSTestChart as ComponentType,
    },
  ],
};

// --- Page Component ---
export default function KolmogorovSmirnovTestPage() {
  return <InteractiveTestPage {...pageData} />;
}
