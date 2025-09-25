'use client';

import { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/app/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// Helper function to generate normally distributed data
const generateNormalData = (mean: number, stdDev: number, n: number) =>
  Array.from(
    { length: n },
    () =>
      mean +
      stdDev *
        (Math.random() * 2 -
          1 +
          (Math.random() * 2 - 1) +
          (Math.random() * 2 - 1))
  );

const getMean = (data: number[]) =>
  data.reduce((a, b) => a + b, 0) / data.length;

// --- Chart Components ---
const OneWayAnovaChart = () => {
  const [chartData, setChartData] = useState<any>(null);

  const generateData = () => {
    const dataAlpha = generateNormalData(1.2, 0.8, 50);
    const dataBeta = generateNormalData(1.5, 0.8, 50);
    const dataGamma = generateNormalData(0.9, 0.8, 50);
    setChartData({
      labels: ['Algorithm Alpha', 'Algorithm Beta', 'Algorithm Gamma'],
      datasets: [
        {
          label: 'Average Monthly Return',
          data: [getMean(dataAlpha), getMean(dataBeta), getMean(dataGamma)],
          backgroundColor: [
            'hsl(var(--chart-1))',
            'hsl(var(--chart-2))',
            'hsl(var(--chart-3))',
          ],
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
        <div className="h-[350px]">
          <Bar
            data={chartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                y: {
                  beginAtZero: true,
                  title: { display: true, text: 'Average Monthly Return (%)', color: 'hsl(var(--muted-foreground))' },
                   ticks: { color: 'hsl(var(--muted-foreground))' },
                   grid: { color: 'hsl(var(--border) / 0.5)' },
                },
                 x: { ticks: { color: 'hsl(var(--muted-foreground))' }, grid: { display: false } },
              },
              plugins: {
                legend: { display: false },
                title: { display: true, text: 'Comparing Algorithm Performance', color: 'hsl(var(--foreground))' },
              },
            }}
          />
        </div>
      )}
      <div className="text-center">
        <Button onClick={generateData}>Simulate New 50-Month Period</Button>
      </div>
    </div>
  );
};

const TwoWayAnovaChart = () => {
    const [chartData, setChartData] = useState<any>(null);

    const generateData = () => {
        const interactionEffect = Math.random() * 2;
        const means = {
            stocksMorning: 0.5 + (Math.random() - 0.5) * 0.2,
            stocksAfternoon: 0.4 + (Math.random() - 0.5) * 0.2,
            cryptoMorning: 0.8 + (Math.random() - 0.5) * 0.3,
            cryptoAfternoon: 0.2 + interactionEffect + (Math.random() - 0.5) * 0.3,
        };

        setChartData({
            labels: ['Morning', 'Afternoon'],
            datasets: [
                {
                    label: 'Stocks',
                    data: [means.stocksMorning, means.stocksAfternoon],
                    borderColor: 'hsl(var(--chart-1))',
                    backgroundColor: 'hsl(var(--chart-1))',
                    tension: 0.1,
                },
                {
                    label: 'Crypto',
                    data: [means.cryptoMorning, means.cryptoAfternoon],
                    borderColor: 'hsl(var(--chart-2))',
                    backgroundColor: 'hsl(var(--chart-2))',
                    tension: 0.1,
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
                 <div className="h-[350px]">
                    <Line
                        data={chartData}
                        options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            scales: {
                                y: { 
                                    title: { display: true, text: 'Average Trade Profitability ($)', color: 'hsl(var(--muted-foreground))' },
                                    ticks: { color: 'hsl(var(--muted-foreground))' },
                                    grid: { color: 'hsl(var(--border) / 0.5)' },
                                },
                                x: { 
                                    ticks: { color: 'hsl(var(--muted-foreground))' },
                                    grid: { color: 'hsl(var(--border) / 0.5)' },
                                },
                            },
                            plugins: {
                                legend: { position: 'top', labels: { color: 'hsl(var(--foreground))' } },
                                title: { display: true, text: 'Interaction of Asset Class and Time of Day', color: 'hsl(var(--foreground))' },
                            },
                        }}
                    />
                </div>
            )}
            <p className="text-center text-sm text-muted-foreground">Non-parallel lines suggest an interaction effect.</p>
            <div className="text-center">
                <Button onClick={generateData}>Simulate New Trading Data</Button>
            </div>
        </div>
    );
};

const RepeatedMeasuresAnovaChart = () => {
    const [chartData, setChartData] = useState<any>(null);

    const generateData = () => {
        const startRatio = 0.8 + (Math.random() - 0.5) * 0.4;
        const midRatio = startRatio + (0.2 + Math.random() * 0.3);
        const endRatio = midRatio + (0.1 + Math.random() * 0.4);

        setChartData({
            labels: ['Year 1 (Baseline)', 'Year 2 (+Intl Stocks)', 'Year 3 (+Hedging)'],
            datasets: [{
                label: 'Portfolio Sharpe Ratio',
                data: [startRatio, midRatio, endRatio],
                borderColor: 'hsl(var(--primary))',
                backgroundColor: 'hsl(var(--primary))',
                pointBackgroundColor: 'hsl(var(--primary-foreground))',
                pointRadius: 5,
                tension: 0.1,
            }]
        });
    };
    
    useEffect(() => {
        generateData();
    }, []);

    return (
         <div className="space-y-4">
            {chartData && (
                <div className="h-[350px]">
                    <Line
                        data={chartData}
                        options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            scales: {
                                y: {
                                    beginAtZero: false,
                                    title: { display: true, text: 'Sharpe Ratio', color: 'hsl(var(--muted-foreground))' },
                                    ticks: { color: 'hsl(var(--muted-foreground))' },
                                    grid: { color: 'hsl(var(--border) / 0.5)' },
                                },
                                x: {
                                    ticks: { color: 'hsl(var(--muted-foreground))' },
                                    grid: { color: 'hsl(var(--border) / 0.5)' },
                                },
                            },
                            plugins: {
                                legend: { display: false },
                                title: { display: true, text: 'Portfolio Performance Over Time', color: 'hsl(var(--foreground))' },
                            },
                        }}
                    />
                </div>
            )}
            <div className="text-center">
                <Button onClick={generateData}>Simulate New Portfolio Journey</Button>
            </div>
        </div>
    );
};


export default function AnovaPage() {
  return (
    <>
      <PageHeader
        title="An Interactive Guide to ANOVA for Trading"
        description="ANOVA (Analysis of Variance) lets you compare the average performance of three or more groups. This guide explains its main types using interactive trading examples."
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
                  ANOVA checks if there's a significant difference somewhere among the means of several groups. Think of it as a "group chaperone": instead of doing many t-tests, it first tells you if any group is behaving differently from the others overall.
                </p>
              </div>
              <div>
                <h3 className="mb-1 font-semibold text-primary">
                  Key Assumptions
                </h3>
                <p className="text-muted-foreground">
                   The data in each group should be approximately{' '}
                  <strong className="text-foreground">
                    normally distributed
                  </strong>, and the groups should have roughly{' '}
                  <strong className="text-foreground">
                    equal variances
                  </strong>. Also, the data points should be independent of each other (unless using a Repeated Measures ANOVA).
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <Tabs defaultValue="one-way">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="one-way">One-Way ANOVA</TabsTrigger>
                <TabsTrigger value="two-way">Two-Way ANOVA</TabsTrigger>
                <TabsTrigger value="repeated-measures">Repeated Measures</TabsTrigger>
              </TabsList>
              <TabsContent value="one-way" className="mt-6">
                <h3 className="text-xl font-bold">One-Way ANOVA</h3>
                <p className="mt-2 text-muted-foreground">
                  Use this to compare the means of{' '}
                  <strong>three or more independent groups</strong> based on a single factor.
                </p>
                <p className="mt-4 text-sm">
                  <span className="font-semibold text-foreground">
                    Example:
                  </span>{' '}
                  A quant firm wants to compare the average monthly returns of three different algorithms ('Alpha', 'Beta', 'Gamma') when traded on the S&P 500. They run each algorithm independently for 50 months and use a One-Way ANOVA to see if any algorithm significantly outperforms the others.
                </p>
                <div className="mt-4 rounded-lg bg-background/50 p-4">
                  <OneWayAnovaChart />
                </div>
              </TabsContent>
              <TabsContent value="two-way" className="mt-6">
                <h3 className="text-xl font-bold">Two-Way ANOVA (Factorial)</h3>
                <p className="mt-2 text-muted-foreground">
                 Use this to test the effect of{' '}
                  <strong>two independent variables (factors)</strong> on an outcome. Its key strength is revealing if there is an{' '}
                  <strong>interaction effect</strong> between the factors.
                </p>
                <p className="mt-4 text-sm">
                  <span className="font-semibold text-foreground">
                    Example:
                  </span>{' '}
                  A trading desk wants to know how `Asset Class` (Factor 1: Stocks vs. Crypto) and `Time of Day` (Factor 2: Morning vs. Afternoon) affect trade profitability. A Two-Way ANOVA can tell them if stocks are more profitable overall, if morning trades are better overall, AND if there's an interaction (e.g., crypto is highly profitable in the morning but not the afternoon).
                </p>
                <div className="mt-4 rounded-lg bg-background/50 p-4">
                  <TwoWayAnovaChart />
                </div>
              </TabsContent>
              <TabsContent value="repeated-measures" className="mt-6">
                <h3 className="text-xl font-bold">Repeated Measures ANOVA</h3>
                <p className="mt-2 text-muted-foreground">
                  This test is used when you measure the{' '}
                  <strong>same group or subject three or more times</strong>. It's the extension of the Paired T-Test.
                </p>
                <p className="mt-4 text-sm">
                  <span className="font-semibold text-foreground">
                    Example:
                  </span>{' '}
                  An analyst tracks the risk-adjusted return (Sharpe Ratio) of a single portfolio over time. They measure it at the end of Year 1 (baseline), Year 2 (after adding international stocks), and Year 3 (after adding a hedging strategy) to see if these changes led to a statistically significant improvement in performance.
                </p>
                <div className="mt-4 rounded-lg bg-background/50 p-4">
                  <RepeatedMeasuresAnovaChart />
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
