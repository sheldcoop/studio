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

// Helper to create a histogram from data
const createHistogram = (data: number[], binSize: number) => {
    if (data.length === 0) return { labels: [], counts: [] };
    const min = Math.min(...data);
    const max = Math.max(...data);
    const bins = Math.ceil((max - min) / binSize);
    const labels = Array.from({ length: bins }, (_, i) => (min + i * binSize).toFixed(2));
    const counts = new Array(bins).fill(0);

    for (const value of data) {
        const binIndex = Math.floor((value - min) / binSize);
        if (binIndex >= 0 && binIndex < bins) {
            counts[binIndex]++;
        }
    }
    return { labels, counts };
};


const MannWhitneyChart = () => {
  const [chartData, setChartData] = useState<any>(null);
  const chartConfig = getChartJsConfig();

  const generateData = () => {
    // Generate two skewed distributions
    const algoAData = generateLogNormalData(0, 0.5, 500); // More concentrated
    const algoBData = generateLogNormalData(0.2, 0.7, 500); // More spread out and shifted right

    // Create histograms. Use a shared binning strategy for comparison.
    const combinedData = [...algoAData, ...algoBData];
    const binSize = (Math.max(...combinedData) - Math.min(...combinedData)) / 20;
    
    const histA = createHistogram(algoAData, binSize);
    const histB = createHistogram(algoBData, binSize);

    // Ensure both histograms have the same labels for proper alignment
    const allLabels = [...new Set([...histA.labels, ...histB.labels])].sort((a, b) => parseFloat(a) - parseFloat(b));
    const countsA = allLabels.map(label => {
        const index = histA.labels.indexOf(label);
        return index !== -1 ? histA.counts[index] : 0;
    });
    const countsB = allLabels.map(label => {
        const index = histB.labels.indexOf(label);
        return index !== -1 ? histB.counts[index] : 0;
    });


    setChartData({
      labels: allLabels,
      datasets: [
        {
          label: 'Algo A (Old)',
          data: countsA,
          backgroundColor: `${chartColors.chart1}B3`, // Use chart color with 70% opacity (B3 hex)
          borderColor: chartColors.chart1,
          barPercentage: 1.0,
          categoryPercentage: 1.0,
        },
        {
          label: 'Algo B (New)',
          data: countsB,
          backgroundColor: `${chartColors.chart2}B3`, // Use chart color with 70% opacity (B3 hex)
          borderColor: chartColors.chart2,
          barPercentage: 1.0,
          categoryPercentage: 1.0,
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
      y: { ...chartConfig.scales.y, title: { ...chartConfig.scales.y.title, text: 'Frequency (Number of Trades)' } },
      x: { ...chartConfig.scales.x, stacked: false, title: { ...chartConfig.scales.x.title, text: 'Trade Profit ($)' } },
    },
    plugins: {
      ...chartConfig.plugins,
      legend: { ...chartConfig.plugins.legend, position: 'top' as const },
      title: { ...chartConfig.plugins.title, text: 'Distribution of Profits for Two Algorithms' },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
      },
    },
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
  };

  return (
    <div className="space-y-4">
      {chartData && (
        <div className="relative mx-auto h-[350px] w-full">
          <Bar data={chartData} options={options} />
        </div>
      )}
      <div className="text-center">
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
