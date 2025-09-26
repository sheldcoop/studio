'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import {
  Legend,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/app/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartTooltipContent } from '@/lib/chart-config';
import { ChartContainer, type ChartConfig } from '@/components/ui/chart';

const LineChart = dynamic(() => import('recharts').then(recharts => recharts.LineChart), { ssr: false });
const Line = dynamic(() => import('recharts').then(recharts => recharts.Line), { ssr: false });
const CartesianGrid = dynamic(() => import('recharts').then(recharts => recharts.CartesianGrid), { ssr: false });

// Helper to generate rank-like data for demonstration
const generateRankData = (numSubjects: number) => {
  const data = [];
  for (let i = 0; i < numSubjects; i++) {
    const baseRank = Math.random() * numSubjects + 1;
    const lowVol = baseRank + (Math.random() - 0.5) * 2;
    const medVol = baseRank + (Math.random() - 0.5) * 4;
    const highVol = baseRank + (Math.random() - 0.5) * 6;
    data.push([lowVol, medVol, highVol]);
  }
  return data.map(d => d.map(r => Math.max(1, Math.round(r))));
};

const friedmanTestChartConfig = {
    'Algo_A': { label: 'Algo A', color: 'hsl(var(--chart-1))' },
    'Algo_B': { label: 'Algo B', color: 'hsl(var(--chart-2))' },
    'Algo_C': { label: 'Algo C', color: 'hsl(var(--chart-3))' },
    'Algo_D': { label: 'Algo D', color: 'hsl(var(--chart-4))' },
    'Algo_E': { label: 'Algo E', color: 'hsl(var(--chart-5))' },
} satisfies ChartConfig

const FriedmanTestChart = () => {
  const [chartData, setChartData] = useState<any[]>([]);

  const generateData = () => {
    const numAlgos = 5;
    const algoRanks = generateRankData(numAlgos);
    
    const regimes = ['Low Volatility', 'Medium Volatility', 'High Volatility'];
    const processedData = regimes.map((regime, i) => ({
        name: regime,
        'Algo_A': algoRanks[0][i],
        'Algo_B': algoRanks[1][i],
        'Algo_C': algoRanks[2][i],
        'Algo_D': algoRanks[3][i],
        'Algo_E': algoRanks[4][i],
    }));
    
    setChartData(processedData);
  };

  useEffect(() => {
    generateData();
  }, []);

  return (
    <div className="flex h-[420px] w-full flex-col">
      <div className="flex-grow">
        <ChartContainer config={friedmanTestChartConfig} className="h-full w-full">
            <LineChart accessibilityLayer data={chartData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="name" tickLine={false} tickMargin={10} axisLine={false} />
                <YAxis reversed domain={[1, 5]} tickCount={5} />
                <Tooltip content={<ChartTooltipContent />} />
                <Legend formatter={(value) => friedmanTestChartConfig[value as keyof typeof friedmanTestChartConfig]?.label || value} />
                <Line type="monotone" dataKey="Algo_A" stroke="var(--color-Algo_A)" />
                <Line type="monotone" dataKey="Algo_B" stroke="var(--color-Algo_B)" />
                <Line type="monotone" dataKey="Algo_C" stroke="var(--color-Algo_C)" />
                <Line type="monotone" dataKey="Algo_D" stroke="var(--color-Algo_D)" />
                <Line type="monotone" dataKey="Algo_E" stroke="var(--color-Algo_E)" />
            </LineChart>
        </ChartContainer>
      </div>
      <div className="mt-4 flex-shrink-0 text-center">
        <Button onClick={generateData}>Simulate New Data</Button>
      </div>
    </div>
  );
};


export default function FriedmanTestPage() {
  return (
    <>
      <PageHeader
        title="Interactive Guide to the Friedman Test"
        description="The non-parametric alternative to Repeated Measures ANOVA for comparing three or more related groups."
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
                  The Friedman Test is used to determine if there are any statistically significant differences between the distributions of three or more related samples. It's essentially a ranked-based version of a repeated-measures ANOVA, making it suitable for non-normal data.
                </p>
              </div>
              <div>
                <h3 className="mb-1 font-semibold text-primary">
                  When to Use It
                </h3>
                <p className="text-muted-foreground">
                  Use this test when you have one group that has been measured on three or more different occasions or under three or more different conditions. It's ideal when the assumptions for a repeated measures ANOVA (like normality) are not met.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Comparing Multiple Related Groups</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-muted-foreground">
              This test is ideal for analyzing how the same subjects (e.g., algorithms, portfolios) perform across multiple different, related conditions.
            </p>
            <p className="text-sm text-muted-foreground mb-4">
              <span className="font-semibold text-foreground">Example:</span> A quant team wants to compare the performance of five trading algorithms across three different market volatility regimes (Low, Medium, and High). For each regime, they rank the algorithms from 1 (best) to 5 (worst). The Friedman test is used to determine if there is a significant difference in the algorithms' median ranks across the different volatility conditions.
            </p>
            <div className="mt-4 rounded-lg bg-background/50 p-4">
              <FriedmanTestChart />
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
