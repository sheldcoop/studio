
'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/app/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartTooltipContent } from '@/lib/chart-config';
import { ChartContainer, type ChartConfig } from '@/components/ui/chart';
import { Line, LineChart as RechartsLineChart, CartesianGrid, Legend, Tooltip, XAxis, YAxis } from 'recharts';

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

const wilcoxonChartConfig = {
    'Before_Risk_Model': { label: 'Before', color: 'hsl(var(--chart-2))' },
    'After_Risk_Model': { label: 'After', color: 'hsl(var(--chart-1))' },
} satisfies ChartConfig;


const WilcoxonSignedRankChart = () => {
  const [chartData, setChartData] = useState<any[]>([]);

  const generateData = () => {
    const numPortfolios = 10;
    const beforeData = generateLogNormalData(0.5, 0.4, numPortfolios);
    const afterData = beforeData.map(
      (d) => d + (Math.random() * 0.8 - 0.1) 
    );
    setChartData(
        Array.from({length: numPortfolios}, (_, i) => ({
            name: `Portfolio ${i+1}`,
            'Before_Risk_Model': beforeData[i],
            'After_Risk_Model': afterData[i],
        }))
    );
  };

  useEffect(() => {
    generateData();
  }, []);

  return (
    <div className="flex h-full min-h-[420px] w-full flex-col">
      <div className="flex-grow">
        <ChartContainer config={wilcoxonChartConfig} className="h-full w-full">
            <RechartsLineChart accessibilityLayer data={chartData} margin={{ top: 20, right: 30, bottom: 20, left: 30 }}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="name" tickLine={false} tickMargin={10} axisLine={false} />
                <YAxis unit="%" />
                <Tooltip content={<ChartTooltipContent />} />
                <Legend formatter={(value) => wilcoxonChartConfig[value as keyof typeof wilcoxonChartConfig]?.label || value} />
                <Line type="monotone" dataKey="Before_Risk_Model" stroke="var(--color-Before_Risk_Model)" />
                <Line type="monotone" dataKey="After_Risk_Model" stroke="var(--color-After_Risk_Model)" />
            </RechartsLineChart>
        </ChartContainer>
      </div>
      <div className="mt-4 flex-shrink-0 text-center">
        <Button onClick={generateData}>Simulate New Data</Button>
      </div>
    </div>
  );
};

const DynamicWilcoxonSignedRankChart = dynamic(() => Promise.resolve(WilcoxonSignedRankChart), { ssr: false });

export default function WilcoxonSignedRankTestPage() {
  return (
    <>
      <PageHeader
        title="Interactive Guide to the Wilcoxon Signed-Rank Test"
        description="The non-parametric alternative to the Paired T-Test, used for 'before and after' analysis on non-normal data."
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
                  This test is the non-parametric version of the Paired T-Test. It&apos;s designed for comparing two related measurements from the same subject. Instead of using raw data, it ranks the differences between pairs to see if there&apos;s a significant change.
                </p>
              </div>
              <div>
                <h3 className="mb-1 font-semibold text-primary">
                  When to Use It
                </h3>
                <p className="text-muted-foreground">
                  Use this for &quot;before and after&quot; scenarios when your data is **not normally distributed**. It&apos;s perfect for measuring the impact of an intervention on the same group of subjects, like testing if a new risk model reduced portfolio drawdown.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Analyzing Paired, Non-Normal Data</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-muted-foreground">
              This test is ideal for seeing if a change had a consistent effect across a group, even when the outcomes are skewed.
            </p>
            <p className="text-sm text-muted-foreground mb-4">
              <span className="font-semibold text-foreground">Example:</span> A
              risk management team implements a new model for 10 of their portfolios. They record the maximum drawdown of each portfolio for a month before the change and a month after. Since drawdown data is often skewed (many small values, few large ones), they use the Wilcoxon Signed-Rank Test to see if the new model led to a statistically significant reduction in drawdown.
            </p>
            <div className="mt-4 rounded-lg bg-background/50 p-4">
              <DynamicWilcoxonSignedRankChart />
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
