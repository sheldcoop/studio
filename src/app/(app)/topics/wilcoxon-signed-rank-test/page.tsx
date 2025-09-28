
'use client';

import type { ComponentType } from 'react';
import React from 'react';
import { ChartTooltipContent } from '@/lib/chart-config';
import { ChartContainer, type ChartConfig } from '@/components/ui/chart';
import { Line, LineChart, CartesianGrid, Legend, Tooltip, XAxis, YAxis } from 'recharts';
import { generateLogNormalData } from '@/lib/math';
import { InteractiveTestPage } from '@/components/app/interactive-test-page';

// --- Chart Config ---
const wilcoxonChartConfig = {
  'Before_Risk_Model': { label: 'Before', color: 'hsl(var(--chart-2))' },
  'After_Risk_Model': { label: 'After', color: 'hsl(var(--chart-1))' },
} satisfies ChartConfig;

// --- Chart Component ---
const WilcoxonSignedRankChart = ({ generateData }: { generateData: () => void }) => {
  const [chartData, setChartData] = React.useState<any[]>([]);
  
  React.useEffect(() => {
    const numPortfolios = 10;
    const beforeData = generateLogNormalData(0.5, 0.4, numPortfolios);
    const afterData = beforeData.map((d) => d + (Math.random() * 0.8 - 0.1));
    setChartData(
      Array.from({ length: numPortfolios }, (_, i) => ({
        name: `Portfolio ${i + 1}`,
        'Before_Risk_Model': beforeData[i],
        'After_Risk_Model': afterData[i],
      }))
    );
  }, [generateData]);

  return (
    <ChartContainer config={wilcoxonChartConfig} className="h-full w-full">
      <LineChart accessibilityLayer data={chartData} margin={{ top: 20, right: 30, bottom: 20, left: 30 }}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="name" tickLine={false} tickMargin={10} axisLine={false} />
        <YAxis unit="%" />
        <Tooltip content={<ChartTooltipContent indicator="dot" />} />
        <Legend formatter={(value) => wilcoxonChartConfig[value as keyof typeof wilcoxonChartConfig]?.label || value} />
        <Line type="monotone" dataKey="Before_Risk_Model" stroke="var(--color-Before_Risk_Model)" />
        <Line type="monotone" dataKey="After_Risk_Model" stroke="var(--color-After_Risk_Model)" />
      </LineChart>
    </ChartContainer>
  );
};

// --- Page Data ---
const pageData = {
  title: 'Interactive Guide to the Wilcoxon Signed-Rank Test for Quants',
  description: "The non-parametric alternative to the Paired T-Test, used for 'before and after' analysis on non-normal financial data.",
  coreConcepts: [
    {
      title: 'Purpose & Analogy for Quants',
      description: "This test is the non-parametric version of the Paired T-Test. It's designed for comparing two related measurements from the same subject (e.g., a portfolio before and after a change). Instead of using raw data, it ranks the differences between pairs to see if there's a significant change.",
    },
    {
      title: 'When to Use It',
      description: "Use this for 'before and after' scenarios when your data is not normally distributed. It's perfect for measuring the impact of an intervention on the same group of subjects, like testing if a new risk model reduced portfolio drawdown or if a change to an algorithm improved returns across a set of stocks.",
    },
  ],
  examples: [
    {
      id: 'wilcoxon-signed-rank-test',
      title: 'Analyzing Paired, Non-Normal Data',
      description: 'This test is ideal for seeing if a change had a consistent effect across a group, even when the outcomes are skewed.',
      exampleText: "A risk management team implements a new model for 10 of their portfolios. They record the maximum drawdown of each portfolio for a month before the change and a month after. Since drawdown data is often skewed (many small values, few large ones), they use the Wilcoxon Signed-Rank Test to see if the new model led to a statistically significant reduction in drawdown.",
      ChartComponent: WilcoxonSignedRankChart as ComponentType<{ generateData: () => void }>,
      buttonText: 'Simulate New Data',
    },
  ],
};

// --- Page Component ---
export default function WilcoxonSignedRankTestPage() {
  return <InteractiveTestPage {...pageData} />;
}
