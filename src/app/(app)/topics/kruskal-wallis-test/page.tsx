
'use client';

import type { ComponentType } from 'react';
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChartTooltipContent } from '@/lib/chart-config';
import { ChartContainer, type ChartConfig } from '@/components/ui/chart';
import { Bar, BarChart, CartesianGrid, Tooltip, XAxis, YAxis, Cell } from 'recharts';
import { generateLogNormalData } from '@/lib/math';
import { InteractiveTestPage } from '@/components/app/interactive-test-page';

// This file is being refactored to export data and use the InteractiveTestPage component.
// All imports from 'recharts' and other heavy libraries should eventually be moved
// into the dynamically loaded chart components within InteractiveTestPage.

// --- Helper Functions ---
const getMedian = (data: number[]) => {
  if (data.length === 0) return 0;
  const sorted = [...data].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
};

// --- Chart Config ---
const kruskalWallisChartConfig = {
  value: { label: 'Median Profit' },
  ML_Bot: { label: 'ML Bot', color: 'hsl(var(--chart-1))' },
  Rule_Based_Bot: { label: 'Rule-Based Bot', color: 'hsl(var(--chart-2))' },
  Hybrid_Bot: { label: 'Hybrid Bot', color: 'hsl(var(--chart-3))' },
} satisfies ChartConfig;

// --- Chart Component ---
const KruskalWallisChart = () => {
  const [chartData, setChartData] = React.useState<any[]>([]);
  const generateData = () => {
    const dataBotA = generateLogNormalData(0.1, 0.5, 100);
    const dataBotB = generateLogNormalData(0.2, 0.6, 100);
    const dataBotC = generateLogNormalData(0.05, 0.7, 100);
    setChartData([
      { name: 'ML_Bot', value: getMedian(dataBotA) },
      { name: 'Rule_Based_Bot', value: getMedian(dataBotB) },
      { name: 'Hybrid_Bot', value: getMedian(dataBotC) },
    ]);
  };
  React.useEffect(() => { generateData(); }, []);

  return (
    <div className="flex h-[420px] w-full flex-col">
      <div className="flex-grow">
        <ChartContainer config={kruskalWallisChartConfig} className="h-full w-full">
          <BarChart accessibilityLayer data={chartData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="name" tickLine={false} tickMargin={10} axisLine={false} tickFormatter={(value) => kruskalWallisChartConfig[value as keyof typeof kruskalWallisChartConfig]?.label || value} />
            <YAxis unit="$" />
            <Tooltip content={<ChartTooltipContent indicator="dot" />} />
            <Bar dataKey="value" name="Median Profit" radius={4}>
              {chartData.map((entry) => ( <Cell key={`cell-${entry.name}`} fill={`var(--color-${entry.name})`} /> ))}
            </Bar>
          </BarChart>
        </ChartContainer>
      </div>
      <div className="mt-4 flex-shrink-0 text-center">
        <Button onClick={generateData}>Simulate New Data</Button>
      </div>
    </div>
  );
};

// --- Page Data ---
const pageData = {
  title: 'An Interactive Guide to the Kruskal-Wallis Test',
  description: 'The non-parametric alternative to ANOVA for comparing three or more independent groups.',
  coreConcepts: [
    {
      title: 'Purpose & Analogy',
      description: "The Kruskal-Wallis Test is essentially a One-Way ANOVA performed on ranked data. It checks if there's a significant difference in the median distributions of three or more independent groups. Think of it as ANOVA's rugged, all-terrain cousin—it works even when the ground (your data) isn't perfectly smooth (normal).",
    },
    {
      title: 'When to Use It',
      description: "Use this test when you want to compare three or more groups, but your data is not normally distributed or your sample sizes are very small. It's the perfect tool for situations where ANOVA's assumptions are violated.",
    },
  ],
  examples: [
    {
      id: 'kruskal-wallis-test',
      title: 'Comparing Multiple Skewed Distributions',
      description: 'This test is ideal for comparing the central tendency of multiple groups when dealing with skewed data, like trade returns or algorithmic performance metrics.',
      exampleText: "A trading firm wants to compare the profitability of three different trading bots: a machine learning bot, a traditional rule-based bot, and a hybrid model. The profit-per-trade data for each bot is heavily skewed. They use the Kruskal-Wallis test to determine if there is a statistically significant difference in the median profit among the three bots.",
      ChartComponent: KruskalWallisChart as ComponentType,
    },
  ],
};

// --- Page Component ---
export default function KruskalWallisTestPage() {
  return <InteractiveTestPage {...pageData} />;
}
