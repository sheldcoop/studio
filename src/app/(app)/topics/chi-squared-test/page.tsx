
'use client';

import type { ComponentType } from 'react';
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChartContainer, type ChartConfig } from '@/components/ui/chart';
import { Bar, BarChart, CartesianGrid, Legend, Tooltip, XAxis, YAxis } from 'recharts';
import { ChartTooltipContent } from '@/lib/chart-config';
import { InteractiveTestPage } from '@/components/app/interactive-test-page';

// --- Chart Configs ---
const goodnessOfFitChartConfig = {
  observed: { label: 'Observed', color: 'hsl(var(--chart-1))' },
  expected: { label: 'Expected', color: 'hsl(var(--chart-2))' },
} satisfies ChartConfig;

const testForIndependenceChartConfig = {
  observed: { label: 'Observed (Bullish)', color: 'hsl(var(--chart-1))' },
  expected: { label: 'Expected (Independent)', color: 'hsl(var(--chart-2))' },
} satisfies ChartConfig;

const testForHomogeneityChartConfig = {
  ny: { label: 'New York', color: 'hsl(var(--chart-1))' },
  london: { label: 'London', color: 'hsl(var(--chart-2))' },
} satisfies ChartConfig;

// --- Chart Components ---
const GoodnessOfFitChart = () => {
  const [chartData, setChartData] = React.useState<any[]>([]);
  const totalTrades = 250;

  const generateData = () => {
    const observed = [ 45, 50, 55, 48, 52].map(v => v + Math.floor(Math.random() * 10) - 5);
    const currentSum = observed.reduce((a, b) => a + b, 0);
    const normalized = observed.map(o => Math.round(o * (totalTrades / currentSum)));
    const expectedPerDay = totalTrades / 5;
    setChartData([
      { name: 'Mon', observed: normalized[0], expected: expectedPerDay },
      { name: 'Tue', observed: normalized[1], expected: expectedPerDay },
      { name: 'Wed', observed: normalized[2], expected: expectedPerDay },
      { name: 'Thu', observed: normalized[3], expected: expectedPerDay },
      { name: 'Fri', observed: normalized[4], expected: expectedPerDay },
    ]);
  };
  React.useEffect(() => { generateData(); }, []);

  return (
    <div className="flex h-[420px] w-full flex-col">
      <div className="flex-grow">
        <ChartContainer config={goodnessOfFitChartConfig} className="h-full w-full">
          <BarChart accessibilityLayer data={chartData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="name" tickLine={false} tickMargin={10} axisLine={false} />
            <YAxis />
            <Tooltip content={<ChartTooltipContent indicator="dot" />} />
            <Legend />
            <Bar dataKey="observed" fill="var(--color-observed)" radius={4} />
            <Bar dataKey="expected" fill="var(--color-expected)" radius={4} />
          </BarChart>
        </ChartContainer>
      </div>
      <div className="mt-4 flex-shrink-0 text-center">
        <Button onClick={generateData}>Simulate New Data</Button>
      </div>
    </div>
  );
};

const TestForIndependenceChart = () => {
  const [chartData, setChartData] = React.useState<any[]>([]);
  const generateData = () => {
    const observed = {
      momentum: { bullish: 40 + Math.floor(Math.random() * 20), bearish: 15, sideways: 25 },
      meanReversion: { bullish: 20, bearish: 30, sideways: 50 + Math.floor(Math.random() * 20) },
      arbitrage: { bullish: 30, bearish: 30, sideways: 25 },
    };
    const rowTotals = {
      momentum: Object.values(observed.momentum).reduce((a, b) => a + b),
      meanReversion: Object.values(observed.meanReversion).reduce((a, b) => a + b),
      arbitrage: Object.values(observed.arbitrage).reduce((a, b) => a + b),
    };
    const colTotals = {
      bullish: observed.momentum.bullish + observed.meanReversion.bullish + observed.arbitrage.bullish,
    };
    const grandTotal = Object.values(rowTotals).reduce((a, b) => a + b);
    const expected = {
      momentum: (rowTotals.momentum * colTotals.bullish) / grandTotal,
      meanReversion: (rowTotals.meanReversion * colTotals.bullish) / grandTotal,
      arbitrage: (rowTotals.arbitrage * colTotals.bullish) / grandTotal,
    };
    setChartData([
      { name: 'Momentum', observed: observed.momentum.bullish, expected: expected.momentum },
      { name: 'Mean-Reversion', observed: observed.meanReversion.bullish, expected: expected.meanReversion },
      { name: 'Arbitrage', observed: observed.arbitrage.bullish, expected: expected.arbitrage },
    ]);
  };
  React.useEffect(() => { generateData(); }, []);

  return (
    <div className="flex h-[420px] w-full flex-col">
      <div className="flex-grow">
        <ChartContainer config={testForIndependenceChartConfig} className="h-full w-full">
          <BarChart accessibilityLayer data={chartData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="name" tickLine={false} tickMargin={10} axisLine={false} tickFormatter={(value) => value.split(' ')[0]} />
            <YAxis />
            <Tooltip content={<ChartTooltipContent indicator="dot" />} />
            <Legend />
            <Bar dataKey="observed" fill="var(--color-observed)" radius={4} />
            <Bar dataKey="expected" fill="var(--color-expected)" radius={4} />
          </BarChart>
        </ChartContainer>
      </div>
      <div className="mt-4 flex-shrink-0 text-center"><Button onClick={generateData}>Simulate New Data</Button></div>
      <p className="pt-4 text-center text-sm text-muted-foreground">The test checks if the differences between observed and expected counts are significant.</p>
    </div>
  );
};

const TestForHomogeneityChart = () => {
  const [chartData, setChartData] = React.useState<any[]>([]);
  const generateData = () => {
    const ny_traders = { stocks: 60 + Math.floor(Math.random() * 20) - 10, forex: 30 + Math.floor(Math.random() * 10) - 5, crypto: 10 + Math.floor(Math.random() * 10) - 5 };
    const london_traders = { stocks: 40 + Math.floor(Math.random() * 20) - 10, forex: 45 + Math.floor(Math.random() * 10) - 5, crypto: 15 + Math.floor(Math.random() * 10) - 5 };
    setChartData([
      { name: 'Stocks', ny: ny_traders.stocks, london: london_traders.stocks },
      { name: 'Forex', ny: ny_traders.forex, london: london_traders.forex },
      { name: 'Crypto', ny: ny_traders.crypto, london: london_traders.crypto },
    ]);
  };
  React.useEffect(() => { generateData(); }, []);

  return (
    <div className="flex h-[420px] w-full flex-col">
      <div className="flex-grow">
        <ChartContainer config={testForHomogeneityChartConfig} className="h-full w-full">
          <BarChart accessibilityLayer data={chartData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="name" tickLine={false} tickMargin={10} axisLine={false} />
            <YAxis />
            <Tooltip content={<ChartTooltipContent indicator="dot" />} />
            <Legend />
            <Bar dataKey="ny" fill="var(--color-ny)" radius={4} />
            <Bar dataKey="london" fill="var(--color-london)" radius={4} />
          </BarChart>
        </ChartContainer>
      </div>
      <div className="mt-4 flex-shrink-0 text-center"><Button onClick={generateData}>Simulate New Survey Data</Button></div>
    </div>
  );
};

// --- Page Data ---
const pageData = {
  title: 'Interactive Guide to the Chi-Squared (χ²) Test for Quants',
  description: 'Analyze categorical data to find significant relationships between variables in financial markets.',
  coreConcepts: [
    {
      title: 'Versatile Tool for Quants',
      description: 'The Chi-Squared (χ²) test is a versatile statistical tool for categorical data. It helps determine if the observed data significantly differs from what was expected. It has three primary uses, each answering a different kind of question relevant to finance.',
    },
  ],
  examples: [
    {
      id: 'goodness-of-fit',
      title: 'Goodness of Fit',
      description: 'Use this to compare the frequency distribution of a **single categorical variable** from one sample against a theoretical or expected distribution.',
      exampleText: "A firm wants to know if profitable trades are uniformly distributed throughout the week. The null hypothesis is that each day has an equal number of profitable trades. The Chi-Squared Goodness of Fit test checks if the observed daily counts are significantly different from the expected counts.",
      ChartComponent: GoodnessOfFitChart as ComponentType,
    },
    {
      id: 'independence',
      title: 'Test for Independence',
      description: 'Use this to determine if there is a significant association between **two categorical variables** within a single population.',
      exampleText: 'A quant analyst tracks profitable trades for three strategies across different market conditions (e.g., Bullish, Bearish, Sideways). They want to know if "Strategy Type" and "Market Condition" are independent. The test compares the observed counts to what we\'d expect if no relationship existed.',
      ChartComponent: TestForIndependenceChart as ComponentType,
    },
    {
      id: 'homogeneity',
      title: 'Test for Homogeneity',
      description: 'Use this to check if the distribution of **one categorical variable** is the same across **multiple different populations**.',
      exampleText: "A global firm surveys traders in their New York and London offices (two populations) about their preferred asset class (one variable: Stocks, Forex, or Crypto). The Test for Homogeneity determines if the proportion of traders who prefer each asset class is the same in both offices.",
      ChartComponent: TestForHomogeneityChart as ComponentType,
    },
  ],
};

// --- Page Component ---
export default function ChiSquaredTestPage() {
  return <InteractiveTestPage {...pageData} />;
}
