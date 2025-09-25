'use client';

import { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Legend
} from 'recharts';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/app/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartTooltipContent } from '@/lib/chart-config';
import { ChartContainer, type ChartConfig } from '@/components/ui/chart';

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

// Helper to create a histogram from data
const createHistogram = (data: number[], binSize: number, min: number, max: number) => {
    const bins = Math.ceil((max - min) / binSize);
    const labels = Array.from({ length: bins }, (_, i) => (min + i * binSize));
    const counts = new Array(bins).fill(0);

    for (const value of data) {
        const binIndex = Math.floor((value - min) / binSize);
        if (binIndex >= 0 && binIndex < bins) {
            counts[binIndex]++;
        }
    }
    return { labels, counts };
};

const mannWhitneyChartConfig = {
    'Algo A': { label: 'Algo A', color: 'hsl(var(--chart-1))' },
    'Algo B': { label: 'Algo B', color: 'hsl(var(--chart-2))' },
} satisfies ChartConfig;


const MannWhitneyChart = () => {
  const [chartData, setChartData] = useState<any[]>([]);

  const generateData = () => {
    const algoAData = generateLogNormalData(0, 0.5, 500); 
    const algoBData = generateLogNormalData(0.2, 0.7, 500);

    const combinedData = [...algoAData, ...algoBData];
    const min = Math.min(...combinedData);
    const max = Math.max(...combinedData);
    const binSize = (max - min) / 20;
    
    const histA = createHistogram(algoAData, binSize, min, max);
    const histB = createHistogram(algoBData, binSize, min, max);
    
    const finalData = histA.labels.map((label, index) => ({
      name: label.toFixed(2),
      'Algo A': histA.counts[index],
      'Algo B': histB.counts[index],
    }));

    setChartData(finalData);
  };

  useEffect(() => {
    generateData();
  }, []);

  return (
    <div className="flex h-[420px] w-full flex-col">
      <div className="relative mx-auto flex-grow w-full">
        <ChartContainer config={mannWhitneyChartConfig} className="h-full w-full">
          <BarChart accessibilityLayer data={chartData} barCategoryGap="0%" margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="name" tickLine={false} tickMargin={10} axisLine={false} />
            <YAxis />
            <Tooltip content={<ChartTooltipContent />} wrapperStyle={{ zIndex: 1000 }} />
            <Legend />
            <Bar dataKey="Algo A" fill={mannWhitneyChartConfig['Algo A'].color} />
            <Bar dataKey="Algo B" fill={mannWhitneyChartConfig['Algo B'].color} />
          </BarChart>
        </ChartContainer>
      </div>
      <div className="mt-4 flex-shrink-0 text-center">
        <Button onClick={generateData}>Simulate New Trading Data</Button>
      </div>
    </div>
  );
};

export default function MannWhitneyUPage() {
  return (
    <>
      <PageHeader
        title="An Interactive Guide to the Mann-Whitney U Test"
        description="The go-to non-parametric test for comparing two independent groups when your data isn't normally distributed."
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
                  The Mann-Whitney U Test is the non-parametric version of the independent T-Test. Instead of comparing means, it compares the **ranks** of the data from two groups. Think of it as lining up all data points from both groups and checking if one group's values are consistently ranked higher than the other's.
                </p>
              </div>
              <div>
                <h3 className="mb-1 font-semibold text-primary">
                  When to Use It
                </h3>
                <p className="text-muted-foreground">
                  Use this test when you want to compare two independent groups but your data **does not follow a normal distribution**. This is common with financial data like trade returns, which are often skewed and have "fat tails" (more extreme outcomes than a normal distribution would suggest).
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Comparing Skewed Distributions</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-muted-foreground">
              This test is perfect for comparing groups where the data is skewed. A classic example is trade profitability, where you might have many small gains and a few very large gains, creating a long tail.
            </p>
            <p className="text-sm text-muted-foreground mb-4">
              <span className="font-semibold text-foreground">Example:</span> A quant firm develops a new trading algorithm ('Algo B') and wants to see if it generates significantly different profits than their old one ('Algo A'). The profit distributions are known to be skewed (not normal). They use the Mann-Whitney U Test to determine if there's a statistical difference in the distribution of profits between the two algorithms.
            </p>
            <div className="mt-4 rounded-lg bg-background/50 p-4">
              <MannWhitneyChart />
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
