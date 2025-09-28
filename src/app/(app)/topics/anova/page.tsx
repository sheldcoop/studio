
'use client';

import type { ComponentType } from 'react';
import { Button } from '@/components/ui/button';
import { ChartContainer, type ChartConfig } from '@/components/ui/chart';
import { ChartTooltipContent } from '@/lib/chart-config';
import {
  Area,
  Bar,
  Line,
  AreaChart,
  BarChart,
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from 'recharts';
import { generateNormalData, getMean } from '@/lib/math';
import { InteractiveTestPage } from '@/components/app/interactive-test-page';

// This file is being refactored to export data and use the InteractiveTestPage component.
// All imports from 'recharts' and other heavy libraries should eventually be moved
// into the dynamically loaded chart components within InteractiveTestPage.

// --- Chart Configs ---
const oneWayAnovaChartConfig = {
  value: { label: 'Value' },
  Algorithm_Alpha: { label: 'Alpha', color: 'hsl(var(--chart-1))' },
  Algorithm_Beta: { label: 'Beta', color: 'hsl(var(--chart-2))' },
  Algorithm_Gamma: { label: 'Gamma', color: 'hsl(var(--chart-3))' },
} satisfies ChartConfig;

const twoWayAnovaChartConfig = {
  stocks: { label: 'Stocks', color: 'hsl(var(--chart-1))' },
  crypto: { label: 'Crypto', color: 'hsl(var(--chart-2))' },
} satisfies ChartConfig;

const repeatedMeasuresAnovaChartConfig = {
  value: { label: 'Value', color: 'hsl(var(--chart-1))' },
} satisfies ChartConfig;

// --- Chart Components ---
const OneWayAnovaChart = () => {
  const [chartData, setChartData] = React.useState<any[]>([]);
  const generateData = () => {
    const dataAlpha = generateNormalData(1.2, 0.8, 50);
    const dataBeta = generateNormalData(1.5, 0.8, 50);
    const dataGamma = generateNormalData(0.9, 0.8, 50);
    setChartData([
      { name: 'Algorithm_Alpha', value: getMean(dataAlpha) },
      { name: 'Algorithm_Beta', value: getMean(dataBeta) },
      { name: 'Algorithm_Gamma', value: getMean(dataGamma) },
    ]);
  };
  React.useEffect(() => { generateData(); }, []);

  return (
    <div className="flex h-[420px] w-full flex-col">
      <div className="flex-grow">
        <ChartContainer config={oneWayAnovaChartConfig} className="h-full w-full">
          <BarChart accessibilityLayer data={chartData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="name" tickLine={false} tickMargin={10} axisLine={false} tickFormatter={(value) => oneWayAnovaChartConfig[value as keyof typeof oneWayAnovaChartConfig]?.label || value} />
            <YAxis unit="%" />
            <Tooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
            <Bar dataKey="value" radius={8}>
              {chartData.map((entry) => ( <Cell key={`cell-${entry.name}`} fill={`var(--color-${entry.name})`} /> ))}
            </Bar>
          </BarChart>
        </ChartContainer>
      </div>
      <div className="mt-4 flex-shrink-0 text-center">
        <Button onClick={generateData}>Simulate New 50-Month Period</Button>
      </div>
    </div>
  );
};

const TwoWayAnovaChart = () => {
  const [chartData, setChartData] = React.useState<any[]>([]);
  const generateData = () => {
    const interactionEffect = Math.random() * 2;
    const means = {
      stocksMorning: 0.5 + (Math.random() - 0.5) * 0.2,
      stocksAfternoon: 0.4 + (Math.random() - 0.5) * 0.2,
      cryptoMorning: 0.8 + (Math.random() - 0.5) * 0.3,
      cryptoAfternoon: 0.2 + interactionEffect + (Math.random() - 0.5) * 0.3,
    };
    setChartData([
      { name: 'Morning', stocks: means.stocksMorning, crypto: means.cryptoMorning },
      { name: 'Afternoon', stocks: means.stocksAfternoon, crypto: means.cryptoAfternoon },
    ]);
  };
  React.useEffect(() => { generateData(); }, []);

  return (
    <div className="flex h-[420px] w-full flex-col">
      <div className="flex-grow">
        <ChartContainer config={twoWayAnovaChartConfig} className="h-full w-full">
          <LineChart accessibilityLayer data={chartData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="name" tickLine={false} tickMargin={10} axisLine={false} />
            <YAxis unit="$" />
            <Tooltip content={<ChartTooltipContent indicator="dot" />} />
            <Line type="monotone" dataKey="stocks" strokeWidth={2} stroke="var(--color-stocks)" />
            <Line type="monotone" dataKey="crypto" strokeWidth={2} stroke="var(--color-crypto)" />
          </LineChart>
        </ChartContainer>
      </div>
      <p className="pt-4 text-center text-sm text-muted-foreground">Non-parallel lines suggest an interaction effect.</p>
      <div className="mt-4 flex-shrink-0 text-center">
        <Button onClick={generateData}>Simulate New Trading Data</Button>
      </div>
    </div>
  );
};

const RepeatedMeasuresAnovaChart = () => {
  const [chartData, setChartData] = React.useState<any[]>([]);
  const generateData = () => {
    const startRatio = 0.8 + (Math.random() - 0.5) * 0.4;
    const midRatio = startRatio + (0.2 + Math.random() * 0.3);
    const endRatio = midRatio + (0.1 + Math.random() * 0.4);
    setChartData([
      { name: 'Year 1 (Baseline)', value: startRatio },
      { name: 'Year 2 (+Intl Stocks)', value: midRatio },
      { name: 'Year 3 (+Hedging)', value: endRatio },
    ]);
  };
  React.useEffect(() => { generateData(); }, []);

  return (
    <div className="flex h-[420px] w-full flex-col">
      <div className="flex-grow">
        <ChartContainer config={repeatedMeasuresAnovaChartConfig} className="h-full w-full">
          <AreaChart accessibilityLayer data={chartData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="name" tickLine={false} tickMargin={10} axisLine={false} />
            <YAxis />
            <Tooltip content={<ChartTooltipContent indicator="dot" />} />
            <defs>
              <linearGradient id="fillValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-value)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--color-value)" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <Area type="monotone" dataKey="value" strokeWidth={2} stroke="var(--color-value)" fill="url(#fillValue)" />
          </AreaChart>
        </ChartContainer>
      </div>
      <div className="mt-4 flex-shrink-0 text-center">
        <Button onClick={generateData}>Simulate New Portfolio Journey</Button>
      </div>
    </div>
  );
};


// --- Page Data ---
const pageData = {
  title: 'An Interactive Guide to ANOVA for Trading',
  description: "ANOVA (Analysis of Variance) lets you compare the average performance of three or more groups. This guide explains its main types using interactive trading examples.",
  coreConcepts: [
    {
      title: 'Purpose & Analogy',
      description: "ANOVA checks if there's a significant difference somewhere among the means of several groups. Think of it as a 'group chaperone': instead of doing many t-tests, it first tells you if any group is behaving differently from the others overall.",
    },
    {
      title: 'Key Assumptions',
      description: "The data in each group should be approximately normally distributed, and the groups should have roughly equal variances. Also, the data points should be independent of each other (unless using a Repeated Measures ANOVA).",
    },
  ],
  examples: [
    {
      id: 'one-way',
      title: 'One-Way ANOVA',
      description: 'Use this to compare the means of three or more independent groups based on a single factor.',
      exampleText: "A quant firm wants to compare the average monthly returns of three different algorithms ('Alpha', 'Beta', 'Gamma') when traded on the S&P 500. They run each algorithm independently for 50 months and use a One-Way ANOVA to see if any algorithm significantly outperforms the others.",
      ChartComponent: OneWayAnovaChart as ComponentType,
    },
    {
      id: 'two-way',
      title: 'Two-Way ANOVA',
      description: "Use this to test the effect of two independent variables (factors) on an outcome. Its key strength is revealing if there is an interaction effect between the factors.",
      exampleText: "A trading desk wants to know how `Asset Class` (Factor 1: Stocks vs. Crypto) and `Time of Day` (Factor 2: Morning vs. Afternoon) affect trade profitability. A Two-Way ANOVA can tell them if stocks are more profitable overall, if morning trades are better overall, AND if there's an interaction (e.g., crypto is highly profitable in the morning but not the afternoon).",
      ChartComponent: TwoWayAnovaChart as ComponentType,
    },
    {
      id: 'repeated-measures',
      title: 'Repeated Measures',
      description: "This test is used when you measure the same group or subject three or more times. It's the extension of the Paired T-Test.",
      exampleText: "An analyst tracks the risk-adjusted return (Sharpe Ratio) of a single portfolio over time. They measure it at the end of Year 1 (baseline), Year 2 (after adding international stocks), and Year 3 (after adding a hedging strategy) to see if these changes led to a statistically significant improvement in performance.",
      ChartComponent: RepeatedMeasuresAnovaChart as ComponentType,
    },
  ],
};

// --- Page Component ---
export default function AnovaPage() {
  return <InteractiveTestPage {...pageData} />;
}
