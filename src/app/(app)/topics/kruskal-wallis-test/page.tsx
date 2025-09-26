
'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/app/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartTooltipContent } from '@/lib/chart-config';
import { ChartContainer, type ChartConfig } from '@/components/ui/chart';

const RechartsBarChart = dynamic(() => import('recharts').then(mod => mod.BarChart), { ssr: false });
const CartesianGrid = dynamic(() => import('recharts').then(mod => mod.CartesianGrid), { ssr: false });
const XAxis = dynamic(() => import('recharts').then(mod => mod.XAxis), { ssr: false });
const YAxis = dynamic(() => import('recharts').then(mod => mod.YAxis), { ssr: false });
const Tooltip = dynamic(() => import('recharts').then(mod => mod.Tooltip), { ssr: false });
const Bar = dynamic(() => import('recharts').then(mod => mod.Bar), { ssr: false });


// Helper to generate skewed data (log-normal distribution)
const generateLogNormalData = (mu: number, sigma: number, n: number) => {
  const data = [];
  for (let i = 0; i < n; i++) {
    const u1 = Math.random();
    const u2 = Math.random();
    const z = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
    data.push(Math.exp(mu + sigma * z));
  }
  return data;
};

// Helper to calculate the median
const getMedian = (data: number[]) => {
  if (data.length === 0) return 0;
  const sorted = [...data].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
};

const kruskalWallisChartConfig = {
  value: {
    label: 'Median Profit',
  },
  'ML Bot': {
    label: 'ML Bot',
    color: 'hsl(var(--chart-1))',
  },
  'Rule-Based Bot': {
    label: 'Rule-Based Bot',
    color: 'hsl(var(--chart-2))',
  },
  'Hybrid Bot': {
    label: 'Hybrid Bot',
    color: 'hsl(var(--chart-3))',
  },
} satisfies ChartConfig;


const KruskalWallisChart = () => {
  const [chartData, setChartData] = useState<any[]>([]);

  const generateData = () => {
    const dataBotA = generateLogNormalData(0.1, 0.5, 100);
    const dataBotB = generateLogNormalData(0.2, 0.6, 100);
    const dataBotC = generateLogNormalData(0.05, 0.7, 100);

    setChartData([
        { name: 'ML Bot', value: getMedian(dataBotA), fill: 'var(--color-ML Bot)' },
        { name: 'Rule-Based Bot', value: getMedian(dataBotB), fill: 'var(--color-Rule-Based Bot)' },
        { name: 'Hybrid Bot', value: getMedian(dataBotC), fill: 'var(--color-Hybrid Bot)' },
    ]);
  };

  useEffect(() => {
    generateData();
  }, []);

  return (
    <div className="flex h-[420px] w-full flex-col">
      <div className="flex-grow">
        <ChartContainer config={kruskalWallisChartConfig} className="h-full w-full">
          <RechartsBarChart accessibilityLayer data={chartData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="name" tickLine={false} tickMargin={10} axisLine={false} />
            <YAxis unit="$" />
            <Tooltip content={<ChartTooltipContent indicator="dot" />} />
            <Bar dataKey="value" name="Median Profit" radius={4} />
          </RechartsBarChart>
        </ChartContainer>
      </div>
      <div className="mt-4 flex-shrink-0 text-center">
        <Button onClick={generateData}>Simulate New Data</Button>
      </div>
    </div>
  );
};

export default function KruskalWallisTestPage() {
  return (
    <>
      <PageHeader
        title="An Interactive Guide to the Kruskal-Wallis Test"
        description="The non-parametric alternative to ANOVA for comparing three or more independent groups."
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
                  The Kruskal-Wallis Test is essentially a One-Way ANOVA performed on ranked data. It checks if there's a significant difference in the **median** distributions of three or more independent groups. Think of it as ANOVA's rugged, all-terrain cousin—it works even when the ground (your data) isn't perfectly smooth (normal).
                </p>
              </div>
              <div>
                <h3 className="mb-1 font-semibold text-primary">
                  When to Use It
                </h3>
                <p className="text-muted-foreground">
                  Use this test when you want to compare three or more groups, but your data is **not normally distributed** or your sample sizes are very small. It's the perfect tool for situations where ANOVA's assumptions are violated.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Comparing Multiple Skewed Distributions</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-muted-foreground">
              This test is ideal for comparing the central tendency of multiple groups when dealing with skewed data, like trade returns or algorithmic performance metrics.
            </p>
            <p className="text-sm text-muted-foreground mb-4">
              <span className="font-semibold text-foreground">
                Example:
              </span>{' '}
              A trading firm wants to compare the profitability of three different trading bots: a machine learning bot, a traditional rule-based bot, and a hybrid model. The profit-per-trade data for each bot is heavily skewed. They use the Kruskal-Wallis test to determine if there is a statistically significant difference in the median profit among the three bots.
            </p>
            <div className="mt-4 rounded-lg bg-background/50 p-4">
              <KruskalWallisChart />
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
