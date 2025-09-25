'use client';

import { useState, useEffect, useRef } from 'react';
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

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

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

const FTestChart = () => {
  const [chartData, setChartData] = useState<any>(null);

  const generateData = () => {
    // StableStock: Lower standard deviation -> lower variance
    const dataStable = generateNormalData(0.05, 0.5, 100);
    // GrowthStock: Higher standard deviation -> higher variance
    const dataGrowth = generateNormalData(0.1, 1.2, 100);

    const varianceStable = getVariance(dataStable);
    const varianceGrowth = getVariance(dataGrowth);

    setChartData({
      labels: ['StableStock (Utility)', 'GrowthStock (Tech)'],
      datasets: [
        {
          label: 'Variance of Daily Returns',
          data: [varianceStable, varianceGrowth],
          backgroundColor: ['hsl(var(--chart-2))', 'hsl(var(--chart-3))'],
          borderColor: ['hsl(var(--chart-2))', 'hsl(var(--chart-3))'],
          borderWidth: 1,
        },
      ],
    });
  };

  useEffect(() => {
    generateData();
  }, []);

  return (
    <div className="space-y-4">
      {chartData && (
        <div className="relative mx-auto h-[350px] w-full max-w-2xl">
          <Bar
            data={chartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                y: {
                  beginAtZero: true,
                  title: {
                    display: true,
                    text: 'Variance (Volatility)',
                    color: 'hsl(var(--muted-foreground))',
                  },
                  ticks: { color: 'hsl(var(--muted-foreground))' },
                  grid: { color: 'hsl(var(--border) / 0.5)' },
                },
                x: {
                  ticks: { color: 'hsl(var(--muted-foreground))' },
                  grid: { display: false },
                },
              },
              plugins: {
                legend: { display: false },
                title: {
                  display: true,
                  text: 'Comparing the Volatility of Two Stocks',
                  color: 'hsl(var(--foreground))',
                  font: { size: 16 },
                },
              },
            }}
          />
        </div>
      )}
      <div className="text-center">
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
