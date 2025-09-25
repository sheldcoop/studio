'use client';

import { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/app/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getChartJsConfig, chartColors } from '@/lib/chart-config';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
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

// Helper to calculate the median
const getMedian = (data: number[]) => {
  if (data.length === 0) return 0;
  const sorted = [...data].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
};


const KruskalWallisChart = () => {
  const [chartData, setChartData] = useState<any>(null);
  const chartConfig = getChartJsConfig();

  const generateData = () => {
    const dataBotA = generateLogNormalData(0.1, 0.5, 100);
    const dataBotB = generateLogNormalData(0.2, 0.6, 100);
    const dataBotC = generateLogNormalData(0.05, 0.7, 100);

    setChartData({
      labels: ['ML Bot', 'Rule-Based Bot', 'Hybrid Bot'],
      datasets: [
        {
          label: 'Median Profit per Trade',
          data: [getMedian(dataBotA), getMedian(dataBotB), getMedian(dataBotC)],
          backgroundColor: [
            chartColors.chart1,
            chartColors.chart2,
            chartColors.chart3,
          ],
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
      y: { ...chartConfig.scales.y, beginAtZero: true, title: { ...chartConfig.scales.y.title, text: 'Median Profit ($)' } },
      x: { ...chartConfig.scales.x, grid: { display: false } }
    },
    plugins: { ...chartConfig.plugins, legend: { display: false }, title: { ...chartConfig.plugins.title, text: 'Comparing Bot Performance (Median Profit)' } },
  };

  return (
    <div className="space-y-4">
      {chartData && (
        <div className="h-[350px]">
          <Bar data={chartData} options={options} />
        </div>
      )}
      <div className="text-center">
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
              <span className="font-semibold text-foreground">Example:</span> A trading firm wants to compare the profitability of three different trading bots: a machine learning bot, a traditional rule-based bot, and a hybrid model. The profit-per-trade data for each bot is heavily skewed. They use the Kruskal-Wallis test to determine if there is a statistically significant difference in the median profit among the three bots.
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
