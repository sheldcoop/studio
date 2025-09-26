
'use client';

import { useState, useEffect } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Rectangle,
} from 'recharts';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/app/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, type ChartConfig } from '@/components/ui/chart';

// Helper to generate normally distributed data using Box-Muller transform
const generateNormalData = (mean: number, stdDev: number, n: number) => {
  let data = [];
  for (let i = 0; i < n; i++) {
    let u = 0,
      v = 0;
    while (u === 0) u = Math.random();
    while (v === 0) v = Math.random();
    let num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
    data.push(mean + stdDev * num);
  }
  return data;
};

const getVariance = (data: number[]) => {
  if (data.length < 2) return 0;
  const mean = data.reduce((a, b) => a + b, 0) / data.length;
  return (
    data.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) /
    (data.length - 1)
  );
};

const fTestChartConfig = {
  value: {
    label: 'Variance',
  },
  'StableStock_Utility': {
    label: 'StableStock (Utility)',
    color: 'hsl(var(--chart-1))',
  },
  'GrowthStock_Tech': {
    label: 'GrowthStock (Tech)',
    color: 'hsl(var(--chart-2))',
  },
} satisfies ChartConfig;

const FTestChart = () => {
  const [chartData, setChartData] = useState<any[]>([]);
  const [fStat, setFStat] = useState(0);

  const generateData = () => {
    // StableStock: Lower standard deviation -> lower variance
    const dataStable = generateNormalData(0.05, 0.5, 100);
    // GrowthStock: Higher standard deviation -> higher variance
    const dataGrowth = generateNormalData(0.1, 1.2, 100);

    const varianceStable = getVariance(dataStable);
    const varianceGrowth = getVariance(dataGrowth);

    setChartData([
        { name: 'StableStock_Utility', value: varianceStable },
        { name: 'GrowthStock_Tech', value: varianceGrowth },
    ]);
    setFStat(varianceGrowth / varianceStable);
  };

  useEffect(() => {
    generateData();
  }, []);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const configKey = label as keyof typeof fTestChartConfig;
      const displayName = fTestChartConfig[configKey]?.label || label;
      return (
        <div className="rounded-lg border bg-background p-2 shadow-sm">
          <div className="grid grid-cols-2 gap-2">
            <div className="flex flex-col">
              <span className="text-[0.70rem] uppercase text-muted-foreground">
                Stock
              </span>
              <span className="font-bold text-muted-foreground">{displayName}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[0.70rem] uppercase text-muted-foreground">
                Variance
              </span>
              <span className="font-bold">
                {payload[0].value.toFixed(4)}
              </span>
            </div>
          </div>
           <div className="mt-2 border-t pt-2 text-center">
             <span className="text-[0.70rem] uppercase text-muted-foreground">
                F-Statistic (Growth/Stable)
              </span>
              <span className="font-bold text-lg text-primary block">
                {fStat.toFixed(2)}
              </span>
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
            <Tooltip
              cursor={{ fill: 'hsl(var(--muted))' }}
              content={<CustomTooltip />}
            />
            <Bar dataKey="value" radius={8}>
              {chartData.map((entry) => (
                <Cell key={`cell-${entry.name}`} fill={`var(--color-${entry.name})`} />
              ))}
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

export default function FTestPage() {
  return (
    <>
      <PageHeader
        title="An Interactive Guide to the F-Test for Trading"
        description="The F-Test is essential for comparing the variance (or volatility) of two or more groups. This guide explains how to use it to assess and compare risk in trading."
      />
      <div className="mx-auto max-w-5xl space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Core Concepts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <h3 className="mb-1 font-semibold text-primary">
                  Purpose & Analogy
                </h3>
                <p className="text-muted-foreground">
                  While a T-Test compares averages, an F-Test compares the{' '}
                  <strong>spread</strong> or <strong>volatility</strong>. Think of it as a risk-assessment tool: it tells you if the returns of Stock A are significantly more erratic and unpredictable than the returns of Stock B, even if their average returns are the same.
                </p>
              </div>
              <div>
                <h3 className="mb-1 font-semibold text-primary">
                  Key Assumptions
                </h3>
                <p className="text-muted-foreground">
                  The F-Test is quite sensitive to its assumptions. The data in both groups must be <strong>independent</strong> and{' '}
                  <strong>normally distributed</strong>. Violating the normality assumption can lead to inaccurate conclusions about the variances.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>F-Test for Comparing Two Variances</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-muted-foreground">
              This is the most common use of the F-Test. It directly compares the variance from two independent groups to see if one is significantly larger than the other.
            </p>
            <p className="text-sm text-muted-foreground mb-4">
              <span className="font-semibold text-foreground">Example:</span> An
              investor wants to compare the risk profiles of two stocks: a
              well-established utility company ('StableStock') and a new tech
              startup ('GrowthStock'). They collect 100 days of return data for
              each and use an F-Test to determine if the variance of
              'GrowthStock's' returns is statistically greater than that of
              'StableStock', indicating higher volatility and risk.
            </p>
            <div className="mt-4 rounded-lg bg-background/50 p-4">
              <FTestChart />
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

    

    