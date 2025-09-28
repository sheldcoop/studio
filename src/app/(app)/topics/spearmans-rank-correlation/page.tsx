
'use client';

import type { ComponentType } from 'react';
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
const generateMonotonicData = (n: number, strength: number) => {
  const data = [];
  for (let i = 0; i < n; i++) {
    const x = Math.random() * 100;
    const noise = (Math.random() - 0.5) * (50 / strength);
    const y = Math.pow(x / 10, 2) + noise;
    data.push({ x, y });
  }
  return data;
};

// --- Chart Config ---
const spearmanCorrelationChartConfig = {
  data: { label: 'Data', color: 'hsl(var(--chart-1))' },
} satisfies ChartConfig;

// --- Chart Component ---
const SpearmanCorrelationChart = () => {
  const [strength, setStrength] = React.useState(3);
  const [chartData, setChartData] = React.useState<any[]>([]);
  React.useEffect(() => { setChartData(generateMonotonicData(100, strength)); }, [strength]);

  return (
    <div className="flex h-[420px] w-full flex-col">
      <div className="relative mx-auto flex-grow w-full max-w-2xl">
        <ChartContainer config={spearmanCorrelationChartConfig} className="h-full w-full">
          <ScatterChart accessibilityLayer margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            <CartesianGrid />
            <XAxis type="number" dataKey="x" name="Sentiment" />
            <YAxis type="number" dataKey="y" name="Return" unit="%" />
            <Tooltip cursor={{ strokeDasharray: '3 3' }} content={<ChartTooltipContent indicator="dot" />} />
            <Scatter data={chartData} fill="var(--color-data)" />
          </ScatterChart>
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
        <p>Current Strength: {strength.toFixed(1)}</p>
      </div>
    </div>
  );
};

// --- Page Data ---
const pageData = {
  title: "Interactive Guide to Spearman's Rank Correlation",
  description: "Measure the strength of a monotonic relationship between two variables, even when it's not linear.",
  coreConcepts: [
    {
      title: 'Purpose & Analogy',
      description: "Spearman's correlation is Pearson's flexible cousin. Instead of checking for a straight-line relationship, it checks for a monotonic one—does one variable consistently increase or decrease as the other does, even if not at a constant rate? It works by converting values to ranks first.",
    },
    {
      title: 'When to Use It',
      description: "Use Spearman's when the relationship between your variables is not linear, or when your data has significant outliers that would skew a Pearson correlation. It's perfect for capturing relationships that 'level off' or accelerate.",
    },
  ],
  examples: [
    {
      id: 'spearmans-rank-correlation',
      title: 'Visualizing Monotonic Relationships',
      description: "A scatter plot can reveal relationships that aren't linear. Spearman's can detect a strong relationship even if the points form a curve.",
      exampleText: "Let's say we're analyzing the relationship between a custom 'Market Sentiment Score' and a stock's daily return. The return might increase faster as sentiment gets very high. A linear model (Pearson) would miss this, but Spearman's would capture the strong monotonic trend.",
      ChartComponent: SpearmanCorrelationChart as ComponentType,
    },
  ],
};

// --- Page Component ---
export default function SpearmansRankCorrelationPage() {
  return <InteractiveTestPage {...pageData} />;
}
