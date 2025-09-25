'use client';

import { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/app/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getChartJsConfig, chartColors } from '@/lib/chart-config';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

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

const WilcoxonSignedRankChart = () => {
  const [chartData, setChartData] = useState<any>(null);
  const chartConfig = getChartJsConfig();

  const generateData = () => {
    const numPortfolios = 10;
    const beforeData = generateLogNormalData(0.5, 0.4, numPortfolios);
    // The "after" data shows a general improvement, but it's not uniform
    const afterData = beforeData.map(
      (d) => d + (Math.random() * 0.8 - 0.1) 
    );
    setChartData({
      labels: Array.from(
        { length: numPortfolios },
        (_, i) => `Portfolio ${i + 1}`
      ),
      datasets: [
        {
          label: 'Before Risk Model',
          data: beforeData,
          borderColor: chartColors.mutedForeground,
          backgroundColor: chartColors.mutedForeground,
          tension: 0.2,
        },
        {
          label: 'After Risk Model',
          data: afterData,
          borderColor: chartColors.primary,
          backgroundColor: chartColors.primary,
          tension: 0.2,
        },
      ],
    });
  };

  useEffect(() => {
    generateData();
  }, []);

  const options = {
    ...chartConfig,
    scales: {
      ...chartConfig.scales,
      y: { ...chartConfig.scales.y, title: { ...chartConfig.scales.y.title, text: 'Drawdown (%) - Skewed Data' } },
      x: { ...chartConfig.scales.x, grid: { display: false } }
    },
    plugins: {
      ...chartConfig.plugins,
      legend: { ...chartConfig.plugins.legend, position: 'top' as const },
      title: {
        ...chartConfig.plugins.title,
        text: 'Portfolio Drawdown Before and After New Risk Model',
      },
    },
  };

  return (
    <div className="space-y-4">
      {chartData && (
        <div className="h-[350px]">
          <Line data={chartData} options={options} />
        </div>
      )}
      <div className="text-center">
        <Button onClick={generateData}>Simulate New Data</Button>
      </div>
    </div>
  );
};

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
                  This test is the non-parametric version of the Paired T-Test. It's designed for comparing two related measurements from the same subject. Instead of using raw data, it ranks the differences between pairs to see if there's a significant change.
                </p>
              </div>
              <div>
                <h3 className="mb-1 font-semibold text-primary">
                  When to Use It
                </h3>
                <p className="text-muted-foreground">
                  Use this for "before and after" scenarios when your data is **not normally distributed**. It's perfect for measuring the impact of an intervention on the same group of subjects, like testing if a new risk model reduced portfolio drawdown.
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
              <WilcoxonSignedRankChart />
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
