
'use client';

import type { ComponentType } from 'react';
import React from 'react';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { ChartTooltipContent } from '@/lib/chart-config';
import { ChartContainer, type ChartConfig } from '@/components/ui/chart';
import { generateNormalData, getMean } from '@/lib/math';
import { InteractiveTestPage } from '@/components/app/interactive-test-page';
import {
  ReferenceLine,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
  Cell,
  Bar,
  Line,
  CartesianGrid,
  BarChart,
  LineChart,
} from 'recharts';

// --- Chart Configs ---
const independentTestChartConfig = {
  value: { label: 'Value' },
  Momentum: { label: 'Momentum', color: 'hsl(var(--chart-1))' },
  'Mean-Reversion': { label: 'Mean-Reversion', color: 'hsl(var(--chart-2))' },
} satisfies ChartConfig;

const pairedTestChartConfig = {
  before: { label: 'Before', color: 'hsl(var(--chart-2))' },
  after: { label: 'After', color: 'hsl(var(--chart-1))' },
} satisfies ChartConfig;

const oneSampleTestChartConfig = {
  value: { label: 'Value', color: 'hsl(var(--chart-1))' },
} satisfies ChartConfig;

// --- Chart Components ---
const IndependentTestChart = ({ generateData }: { generateData: () => void }) => {
  const [chartData, setChartData] = React.useState<any[]>([]);
  React.useEffect(() => {
    const dataA = generateNormalData(0.08, 0.5, 60);
    const dataB = generateNormalData(0.03, 0.5, 60);
    setChartData([
      { name: 'Momentum', value: getMean(dataA) },
      { name: 'Mean-Reversion', value: getMean(dataB) },
    ]);
  }, [generateData]);

  return (
    <ChartContainer
      config={independentTestChartConfig}
      className="h-full w-full"
    >
      <BarChart
        accessibilityLayer
        data={chartData}
        margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
      >
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="name"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value) => independentTestChartConfig[value as keyof typeof independentTestChartConfig]?.label || value}
        />
        <YAxis unit="%" />
        <Tooltip
          cursor={{ fill: 'hsl(var(--muted))' }}
          content={<ChartTooltipContent indicator="dot" />}
        />
        <Bar dataKey="value" radius={8}>
            {chartData.map((entry) => (
                <Cell key={`cell-${entry.name}`} fill={`var(--color-${entry.name})`} />
            ))}
        </Bar>
      </BarChart>
    </ChartContainer>
  );
};

const PairedTestChart = ({ generateData }: { generateData: () => void }) => {
  const [chartData, setChartData] = React.useState<any[]>([]);
  React.useEffect(() => {
    const numSubjects = 12;
    const beforeData = Array.from({ length: numSubjects }, () => 0.5 + (Math.random() - 0.5) * 2);
    const afterData = beforeData.map((d) => d + (0.1 + Math.random() * 0.5));
    setChartData(
      Array.from({ length: numSubjects }, (_, i) => ({
        name: `Week ${i + 1}`,
        before: beforeData[i],
        after: afterData[i],
      }))
    );
  }, [generateData]);

  return (
    <ChartContainer
      config={pairedTestChartConfig}
      className="h-full w-full"
    >
      <LineChart
        accessibilityLayer
        data={chartData}
        margin={{ top: 20, right: 30, bottom: 20, left: 20 }}
      >
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="name"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
        />
        <YAxis unit="%" />
        <Tooltip content={<ChartTooltipContent indicator="dot" />} />
        <Legend formatter={(value) => pairedTestChartConfig[value as keyof typeof pairedTestChartConfig]?.label || value} />
        <Line
          type="monotone"
          dataKey="before"
          strokeWidth={2}
          stroke="var(--color-before)"
        />
        <Line
          type="monotone"
          dataKey="after"
          strokeWidth={2}
          stroke="var(--color-after)"
        />
      </LineChart>
    </ChartContainer>
  );
};

const OneSampleTestChart = ({ generateData }: { generateData: () => void }) => {
  const [meanValue, setMeanValue] = React.useState(1.7);
  const target = 1.5;
  const chartData = [{ name: 'Avg. Return', value: meanValue }];

  // This chart uses a slider, so generateData is not used for re-rendering,
  // but we keep the effect to show how it could be used.
  React.useEffect(() => {
    // You could fetch new data here if needed, but the slider controls the view
  }, [generateData]);

  return (
    <>
      <ChartContainer
        config={oneSampleTestChartConfig}
        className="h-full w-full"
      >
        <BarChart
          accessibilityLayer
          data={chartData}
          layout="vertical"
          margin={{ top: 20, right: 40, bottom: 20, left: 40 }}
        >
          <CartesianGrid horizontal={false} />
          <YAxis
            type="category"
            dataKey="name"
            tickLine={false}
            axisLine={false}
            width={80}
          />
          <XAxis type="number" unit="%" domain={[0, 3]} />
          <Tooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
          <Bar
            dataKey="value"
            radius={8}
            fill="var(--color-value)"
          />
          <ReferenceLine
            x={target}
            stroke="hsl(var(--destructive))"
            strokeWidth={2}
            strokeDasharray="3 3"
          >
            <Label
              value={`Claimed: ${target}%`}
              position="insideTopRight"
              fill="hsl(var(--destructive))"
              fontSize={12}
            />
          </ReferenceLine>
        </BarChart>
      </ChartContainer>
      <div className="mt-4 flex-shrink-0 text-center">
        <div className="mx-auto max-w-sm py-4">
          <Label htmlFor="mean-slider">
            Adjust Sample's Average Monthly Return (%)
          </Label>
          <Slider
            id="mean-slider"
            min={0.5}
            max={2.5}
            value={[meanValue]}
            step={0.05}
            onValueChange={(value) => setMeanValue(value[0])}
            className="my-4"
          />
        </div>
        <div className="text-sm text-muted-foreground">
          Current Mean:{' '}
          <span className="font-bold text-foreground">
            {meanValue.toFixed(2)}
          </span>{' '}
          % vs Claimed{' '}
          <span className="font-bold text-destructive">{target}%</span>
        </div>
      </div>
    </>
  );
};

// --- Page Data ---
const pageData = {
  title: 'An Interactive Guide to the T-Test for Trading',
  description: "The t-test is a key tool for comparing average returns and performance. This guide uses interactive trading examples to explain the main types of t-tests and help you understand when to use each one.",
  coreConcepts: [
    {
      title: 'Purpose & Analogy',
      description: "A t-test checks if the difference between two average returns is statistically significant or just due to random market noise. Think of it as a performance verifier: is Strategy A truly more profitable than Strategy B, or did it just get lucky in this sample?",
    },
    {
      title: 'Key Assumption',
      description: 'The main requirement for a t-test is that the data (e.g., daily or monthly returns) should be approximately normally distributed (forming a "bell curve"). This is a critical check before relying on the test\'s results.',
    },
  ],
  examples: [
    {
      id: 'independent',
      title: 'Independent Samples',
      description: 'This test compares the means of two separate, unrelated groups. In trading, this is perfect for comparing the performance of two different strategies that are traded independently.',
      exampleText: 'Comparing the average daily returns of a Momentum Strategy vs. a Mean-Reversion Strategy over the last 60 days to see if one is significantly more profitable.',
      ChartComponent: IndependentTestChart as ComponentType<{ generateData: () => void }>,
      buttonText: "Simulate New 60-Day Period",
    },
    {
      id: 'paired',
      title: 'Paired Samples',
      description: 'This test is used to compare the means of one group, measured twice. It\'s ideal for "before and after" scenarios, like testing if a change to an algorithm improved an existing portfolio\'s performance.',
      exampleText: "Measuring a portfolio's weekly returns for 12 weeks before adding a new algorithm, and then for 12 weeks after, to see if the change led to a significant improvement.",
      ChartComponent: PairedTestChart as ComponentType<{ generateData: () => void }>,
      buttonText: 'Simulate New Data',
    },
    {
      id: 'one-sample',
      title: 'One-Sample',
      description: 'This test compares the mean of a single group to a known, fixed number. In finance, you can use this to check if a fund\'s actual performance matches its advertised claims or a specific benchmark.',
      exampleText: "A hedge fund claims its average monthly return is 1.5%. You test a sample of its returns from the last 24 months to see if the average is statistically different from their 1.5% claim.",
      ChartComponent: OneSampleTestChart as ComponentType<{ generateData: () => void }>,
      buttonText: "This button is not used",
    },
  ],
};

// --- Page Component ---
export default function TTestPage() {
  const pageDataForRender = {
    ...pageData,
    examples: pageData.examples.map(ex => {
      if (ex.id === 'one-sample') {
        return { ...ex, buttonText: '' };
      }
      return ex;
    })
  };

  return <InteractiveTestPage {...pageDataForRender} />;
}
