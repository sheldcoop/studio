
'use client';

import type { ComponentType } from 'react';
import React from 'react';
import { ChartTooltipContent } from '@/lib/chart-config';
import { ChartContainer, type ChartConfig } from '@/components/ui/chart';
import { Bar, BarChart, CartesianGrid, Legend, Tooltip, XAxis, YAxis } from 'recharts';
import { generateLogNormalData } from '@/lib/math';
import { InteractiveTestPage } from '@/components/app/interactive-test-page';

// --- Helper Function ---
const createHistogram = (data: number[], binSize: number, min: number, max: number) => {
  const bins = Math.ceil((max - min) / binSize);
  const labels = Array.from({ length: bins }, (_, i) => (min + i * binSize));
  const counts = new Array(bins).fill(0);
  for (const value of data) {
    const binIndex = Math.floor((value - min) / binSize);
    if (binIndex >= 0 && binIndex < bins) {
      counts[binIndex]++;
    }
  }
  return { labels, counts };
};

// --- Chart Config ---
const mannWhitneyChartConfig = {
  'Algo_A': { label: 'Algo A', color: 'hsl(var(--chart-1))' },
  'Algo_B': { label: 'Algo B', color: 'hsl(var(--chart-2))' },
} satisfies ChartConfig;

// --- Chart Component ---
const MannWhitneyChart = ({ generateData }: { generateData: () => void }) => {
  const [chartData, setChartData] = React.useState<any[]>([]);
  
  React.useEffect(() => {
    const algoAData = generateLogNormalData(0, 0.5, 500); 
    const algoBData = generateLogNormalData(0.2, 0.7, 500);
    const combinedData = [...algoAData, ...algoBData];
    const min = Math.min(...combinedData);
    const max = Math.max(...combinedData);
    const binSize = (max - min) / 20;
    const histA = createHistogram(algoAData, binSize, min, max);
    const histB = createHistogram(algoBData, binSize, min, max);
    const finalData = histA.labels.map((label, index) => ({
      name: label.toFixed(2),
      'Algo_A': histA.counts[index],
      'Algo_B': histB.counts[index],
    }));
    setChartData(finalData);
  }, [generateData]);

  return (
    <div className="relative mx-auto w-full">
      <ChartContainer config={mannWhitneyChartConfig} className="h-full w-full">
        <BarChart accessibilityLayer data={chartData} barCategoryGap="0%" margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
          <CartesianGrid vertical={false} />
          <XAxis dataKey="name" tickLine={false} tickMargin={10} axisLine={false} />
          <YAxis />
          <Tooltip content={<ChartTooltipContent indicator="dot" />} wrapperStyle={{ zIndex: 1000 }} />
          <Legend formatter={(value) => mannWhitneyChartConfig[value as keyof typeof mannWhitneyChartConfig]?.label || value} />
          <Bar dataKey="Algo_A" fill="var(--color-Algo_A)" />
          <Bar dataKey="Algo_B" fill="var(--color-Algo_B)" />
        </BarChart>
      </ChartContainer>
    </div>
  );
};

// --- Page Data ---
const pageData = {
  title: 'Interactive Guide to the Mann-Whitney U Test for Quants',
  description: "The go-to non-parametric test for comparing two independent groups when your financial data isn't normally distributed.",
  coreConcepts: [
    {
      title: 'Purpose & Analogy for Quants',
      description: "The Mann-Whitney U Test is the non-parametric version of the independent T-Test. Instead of comparing means, it compares the ranks of the data from two groups. Think of it as lining up all data points from both groups and checking if one group's values are consistently ranked higher than the other's.",
    },
    {
      title: 'When to Use It',
      description: "Use this test when you want to compare two independent groups but your data does not follow a normal distribution. This is common with financial data like trade returns, which are often skewed and have 'fat tails' (more extreme outcomes than a normal distribution would suggest).",
    },
  ],
  examples: [
    {
      id: 'mann-whitney-u-test',
      title: 'Comparing Skewed Distributions',
      description: 'This test is perfect for comparing groups where the data is skewed. A classic example is trade profitability, where you might have many small gains and a few very large gains, creating a long tail.',
      exampleText: "A quant firm develops a new trading algorithm ('Algo B') and wants to see if it generates significantly different profits than their old one ('Algo A'). The profit distributions are known to be skewed (not normal). They use the Mann-Whitney U Test to determine if there's a statistical difference in the distribution of profits between the two algorithms.",
      ChartComponent: MannWhitneyChart as ComponentType<{ generateData: () => void }>,
      buttonText: 'Simulate New Trading Data',
    },
  ],
};

// --- Page Component ---
export default function MannWhitneyUPage() {
  return <InteractiveTestPage {...pageData} />;
}
