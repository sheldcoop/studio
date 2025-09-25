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

// Helper to generate rank-like data for demonstration
const generateRankData = (numSubjects: number) => {
  const data = [];
  for (let i = 0; i < numSubjects; i++) {
    // Simulate some baseline performance rank
    const baseRank = Math.random() * numSubjects + 1;
    // Low vol: tends to perform around its baseline
    const lowVol = baseRank + (Math.random() - 0.5) * 2;
    // Med vol: performance might deviate more
    const medVol = baseRank + (Math.random() - 0.5) * 4;
    // High vol: performance is most unpredictable
    const highVol = baseRank + (Math.random() - 0.5) * 6;
    data.push([lowVol, medVol, highVol]);
  }
  // Ensure ranks are positive
  return data.map(d => d.map(r => Math.max(1, Math.round(r))));
};

const FriedmanTestChart = () => {
  const [chartData, setChartData] = useState<any>(null);
  const chartConfig = getChartJsConfig();

  const generateData = () => {
    const numAlgos = 5;
    const algoRanks = generateRankData(numAlgos);
    
    setChartData({
      labels: ['Low Volatility', 'Medium Volatility', 'High Volatility'],
      datasets: [
        {
          label: 'Algorithm A',
          data: algoRanks[0],
          borderColor: chartColors.chart1,
          backgroundColor: chartColors.chart1,
          tension: 0.1,
        },
        {
          label: 'Algorithm B',
          data: algoRanks[1],
          borderColor: chartColors.chart2,
          backgroundColor: chartColors.chart2,
          tension: 0.1,
        },
        {
          label: 'Algorithm C',
          data: algoRanks[2],
          borderColor: chartColors.chart3,
          backgroundColor: chartColors.chart3,
          tension: 0.1,
        },
        {
            label: 'Algorithm D',
            data: algoRanks[3],
            borderColor: chartColors.chart4,
            backgroundColor: chartColors.chart4,
            tension: 0.1,
        },
        {
            label: 'Algorithm E',
            data: algoRanks[4],
            borderColor: chartColors.chart5,
            backgroundColor: chartColors.chart5,
            tension: 0.1,
        }
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
        y: { ...chartConfig.scales.y, title: { ...chartConfig.scales.y.title, text: 'Performance Rank (Lower is Better)' } },
        x: { ...chartConfig.scales.x, title: { ...chartConfig.scales.x.title, text: 'Market Regime' } }
    },
    plugins: {
        ...chartConfig.plugins,
        legend: { ...chartConfig.plugins.legend, position: 'top' as const },
        title: { ...chartConfig.plugins.title, text: 'Algorithm Performance Rank Across Market Regimes' },
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
