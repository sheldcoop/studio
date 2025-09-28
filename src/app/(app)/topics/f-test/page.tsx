
'use client';

import type { ComponentType } from 'react';
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChartContainer, type ChartConfig } from '@/components/ui/chart';
import { Bar, BarChart, CartesianGrid, Tooltip, XAxis, YAxis, Cell } from 'recharts';
import { generateNormalData, getVariance } from '@/lib/math';
import { InteractiveTestPage } from '@/components/app/interactive-test-page';

// --- Chart Config ---
const fTestChartConfig = {
  value: { label: 'Variance' },
  'StableStock_Utility': { label: 'StableStock (Utility)', color: 'hsl(var(--chart-1))' },
  'GrowthStock_Tech': { label: 'GrowthStock (Tech)', color: 'hsl(var(--chart-2))' },
} satisfies ChartConfig;

// --- Chart Component ---
const FTestChart = () => {
  const [chartData, setChartData] = React.useState<any[]>([]);
  const [fStat, setFStat] = React.useState(0);

  const generateData = () => {
    const dataStable = generateNormalData(0.05, 0.5, 100);
    const dataGrowth = generateNormalData(0.1, 1.2, 100);
    const varianceStable = getVariance(dataStable);
    const varianceGrowth = getVariance(dataGrowth);
    setChartData([
      { name: 'StableStock_Utility', value: varianceStable },
      { name: 'GrowthStock_Tech', value: varianceGrowth },
    ]);
    setFStat(varianceGrowth / varianceStable);
  };
  React.useEffect(() => { generateData(); }, []);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const configKey = label as keyof typeof fTestChartConfig;
      const displayName = fTestChartConfig[configKey]?.label || label;
      return (
        <div className="rounded-lg border bg-background p-2 shadow-sm">
          <div className="grid grid-cols-2 gap-2">
            <div className="flex flex-col">
              <span className="text-[0.70rem] uppercase text-muted-foreground">Stock</span>
              <span className="font-bold text-muted-foreground">{displayName}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[0.70rem] uppercase text-muted-foreground">Variance</span>
              <span className="font-bold">{payload[0].value.toFixed(4)}</span>
            </div>
          </div>
          <div className="mt-2 border-t pt-2 text-center">
            <span className="text-[0.70rem] uppercase text-muted-foreground">F-Statistic (Growth/Stable)</span>
            <span className="font-bold text-lg text-primary block">{fStat.toFixed(2)}</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex h-[420px] w-full flex-col">
      <div className="relative mx-auto flex-grow w-full max-w-2xl">
        <ChartContainer config={fTestChartConfig} className="h-full w-full">
          <BarChart accessibilityLayer data={chartData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="name" tickLine={false} tickMargin={10} axisLine={false} tickFormatter={(value) => fTestChartConfig[value as keyof typeof fTestChartConfig]?.label || value} />
            <YAxis />
            <Tooltip cursor={{ fill: 'hsl(var(--muted))' }} content={<CustomTooltip />} />
            <Bar dataKey="value" radius={8}>
              {chartData.map((entry) => ( <Cell key={`cell-${entry.name}`} fill={`var(--color-${entry.name})`} /> ))}
            </Bar>
          </BarChart>
        </ChartContainer>
      </div>
      <div className="mt-4 flex-shrink-0 text-center">
        <Button onClick={generateData}>Simulate New 100-Day Period</Button>
      </div>
    </div>
  );
};

// --- Page Data ---
const pageData = {
  title: 'An Interactive Guide to the F-Test for Trading',
  description: 'The F-Test is essential for comparing the variance (or volatility) of two or more groups. This guide explains how to use it to assess and compare risk in trading.',
  coreConcepts: [
    {
      title: 'Purpose & Analogy for Quants',
      description: "While a T-Test compares averages (first moment), an F-Test compares the spread or volatility (second moment). Think of it as a risk-assessment tool: it tells you if the returns of Stock A are significantly more erratic and unpredictable than the returns of Stock B, even if their average returns are the same.",
    },
    {
      title: 'Key Assumptions',
      description: 'The F-Test is quite sensitive to its assumptions. The data in both groups must be independent and normally distributed. Violating the normality assumption can lead to inaccurate conclusions about the variances, making tests like Levene\'s test a more robust alternative in some cases.',
    },
  ],
  examples: [
    {
      id: 'f-test',
      title: 'F-Test for Comparing Two Variances',
      description: 'This is the most common use of the F-Test. It directly compares the variance from two independent groups to see if one is significantly larger than the other.',
      exampleText: "An investor wants to compare the risk profiles of two stocks: a well-established utility company ('StableStock') and a new tech startup ('GrowthStock'). They collect 100 days of return data for each and use an F-Test to determine if the variance of 'GrowthStock's' returns is statistically greater than that of 'StableStock', indicating higher volatility and risk.",
      ChartComponent: FTestChart as ComponentType,
    },
  ],
};

// --- Page Component ---
export default function FTestPage() {
  return <InteractiveTestPage {...pageData} />;
}
