
'use client';

import type { ComponentType } from 'react';
import React from 'react';
import { ChartTooltipContent } from '@/lib/chart-config';
import { ChartContainer, type ChartConfig } from '@/components/ui/chart';
import { Line, LineChart, CartesianGrid, Legend, Tooltip, XAxis, YAxis } from 'recharts';
import { InteractiveTestPage } from '@/components/app/interactive-test-page';

// --- Helper Functions ---
const generateRankData = (numSubjects: number) => {
  const data = [];
  for (let i = 0; i < numSubjects; i++) {
    const baseRank = Math.random() * numSubjects + 1;
    const lowVol = baseRank + (Math.random() - 0.5) * 2;
    const medVol = baseRank + (Math.random() - 0.5) * 4;
    const highVol = baseRank + (Math.random() - 0.5) * 6;
    data.push([lowVol, medVol, highVol]);
  }
  return data.map(d => d.map(r => Math.max(1, Math.round(r))));
};

// --- Chart Config ---
const friedmanTestChartConfig = {
  'Algo_A': { label: 'Algo A', color: 'hsl(var(--chart-1))' },
  'Algo_B': { label: 'Algo B', color: 'hsl(var(--chart-2))' },
  'Algo_C': { label: 'Algo C', color: 'hsl(var(--chart-3))' },
  'Algo_D': { label: 'Algo D', color: 'hsl(var(--chart-4))' },
  'Algo_E': { label: 'Algo E', color: 'hsl(var(--chart-5))' },
} satisfies ChartConfig;

// --- Chart Component ---
const FriedmanTestChart = ({ generateData }: { generateData: () => void }) => {
  const [chartData, setChartData] = React.useState<any[]>([]);
  
  React.useEffect(() => {
    const numAlgos = 5;
    const algoRanks = generateRankData(numAlgos);
    const regimes = ['Low Volatility', 'Medium Volatility', 'High Volatility'];
    const processedData = regimes.map((regime, i) => ({
      name: regime,
      'Algo_A': algoRanks[0][i],
      'Algo_B': algoRanks[1][i],
      'Algo_C': algoRanks[2][i],
      'Algo_D': algoRanks[3][i],
      'Algo_E': algoRanks[4][i],
    }));
    setChartData(processedData);
  }, [generateData]);

  return (
    <ChartContainer config={friedmanTestChartConfig} className="h-full w-full">
      <LineChart accessibilityLayer data={chartData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="name" tickLine={false} tickMargin={10} axisLine={false} />
        <YAxis reversed domain={[1, 5]} tickCount={5} label={{ value: 'Performance Rank', angle: -90, position: 'insideLeft' }}/>
        <Tooltip content={<ChartTooltipContent indicator="dot" />} />
        <Legend formatter={(value) => friedmanTestChartConfig[value as keyof typeof friedmanTestChartConfig]?.label || value} />
        <Line type="monotone" dataKey="Algo_A" stroke="var(--color-Algo_A)" />
        <Line type="monotone" dataKey="Algo_B" stroke="var(--color-Algo_B)" />
        <Line type="monotone" dataKey="Algo_C" stroke="var(--color-Algo_C)" />
        <Line type="monotone" dataKey="Algo_D" stroke="var(--color-Algo_D)" />
        <Line type="monotone" dataKey="Algo_E" stroke="var(--color-Algo_E)" />
      </LineChart>
    </ChartContainer>
  );
};

// --- Page Data ---
const pageData = {
  title: 'Interactive Guide to the Friedman Test for Quants',
  description: 'The non-parametric alternative to Repeated Measures ANOVA for comparing three or more related groups, often used in backtesting.',
  coreConcepts: [
    {
      title: 'Purpose & Analogy for Quants',
      description: "The Friedman Test is used to determine if there are statistically significant differences between the distributions of three or more related samples. It's a ranked-based version of a repeated-measures ANOVA, making it suitable for non-normal data, such as strategy performance ranks across different market regimes.",
    },
    {
      title: 'When to Use It',
      description: "Use this test when you have one group measured on three or more occasions (e.g. comparing multiple strategy backtests over the same set of assets). It's ideal when the assumptions for a repeated measures ANOVA (like normality) are not met.",
    },
  ],
  examples: [
    {
      id: 'friedman-test',
      title: 'Comparing Algorithm Performance Across Regimes',
      description: 'This test is ideal for analyzing how the same subjects (e.g., algorithms, portfolios) perform across multiple different, related conditions.',
      exampleText: "A quant team wants to compare the performance of five trading algorithms across three different market volatility regimes (Low, Medium, and High). For each regime, they rank the algorithms from 1 (best) to 5 (worst). The Friedman test is used to determine if there is a significant difference in the algorithms' median ranks across the different volatility conditions.",
      ChartComponent: FriedmanTestChart as ComponentType<{ generateData: () => void }>,
      buttonText: 'Simulate New Data',
    },
  ],
};

// --- Page Component ---
export default function FriedmanTestPage() {
  return <InteractiveTestPage {...pageData} />;
}
