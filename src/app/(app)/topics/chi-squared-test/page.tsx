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

// Helper to generate categorical data
const generateCategoricalData = () => {
  // Simulate observed data for three strategies in three market conditions
  const observed = {
    momentum: {
      bullish: 40 + Math.floor(Math.random() * 20) - 10, // Tends to do well
      bearish: 15 + Math.floor(Math.random() * 10) - 5,
      sideways: 25 + Math.floor(Math.random() * 10) - 5,
    },
    meanReversion: {
      bullish: 20 + Math.floor(Math.random() * 10) - 5,
      bearish: 30 + Math.floor(Math.random() * 15) - 8,
      sideways: 50 + Math.floor(Math.random() * 20) - 10, // Tends to do well
    },
    arbitrage: {
      bullish: 30 + Math.floor(Math.random() * 10) - 5,
      bearish: 30 + Math.floor(Math.random() * 10) - 5,
      sideways: 25 + Math.floor(Math.random() * 10) - 5, // Tends to be neutral
    },
  };
  return observed;
};

// Helper to calculate expected frequencies
const getExpectedFrequencies = (observed: ReturnType<typeof generateCategoricalData>) => {
    const rowTotals = {
        momentum: Object.values(observed.momentum).reduce((a, b) => a + b, 0),
        meanReversion: Object.values(observed.meanReversion).reduce((a, b) => a + b, 0),
        arbitrage: Object.values(observed.arbitrage).reduce((a, b) => a + b, 0),
    };
    const colTotals = {
        bullish: observed.momentum.bullish + observed.meanReversion.bullish + observed.arbitrage.bullish,
        bearish: observed.momentum.bearish + observed.meanReversion.bearish + observed.arbitrage.bearish,
        sideways: observed.momentum.sideways + observed.meanReversion.sideways + observed.arbitrage.sideways,
    };
    const grandTotal = Object.values(rowTotals).reduce((a, b) => a + b, 0);

    const expected = {
        momentum: {
            bullish: (rowTotals.momentum * colTotals.bullish) / grandTotal,
            bearish: (rowTotals.momentum * colTotals.bearish) / grandTotal,
            sideways: (rowTotals.momentum * colTotals.sideways) / grandTotal,
        },
        meanReversion: {
            bullish: (rowTotals.meanReversion * colTotals.bullish) / grandTotal,
            bearish: (rowTotals.meanReversion * colTotals.bearish) / grandTotal,
            sideways: (rowTotals.meanReversion * colTotals.sideways) / grandTotal,
        },
        arbitrage: {
            bullish: (rowTotals.arbitrage * colTotals.bullish) / grandTotal,
            bearish: (rowTotals.arbitrage * colTotals.bearish) / grandTotal,
            sideways: (rowTotals.arbitrage * colTotals.sideways) / grandTotal,
        },
    };
    return expected;
}

const ChiSquaredTestChart = () => {
  const [chartData, setChartData] = useState<any>(null);
  const chartConfig = getChartJsConfig();

  const generateData = () => {
    const observed = generateCategoricalData();
    const expected = getExpectedFrequencies(observed);

    setChartData({
      labels: ['Momentum Strategy', 'Mean-Reversion Strategy', 'Arbitrage Strategy'],
      datasets: [
        {
          label: 'Observed Profitable Trades (Bullish Market)',
          data: [observed.momentum.bullish, observed.meanReversion.bullish, observed.arbitrage.bullish],
          backgroundColor: chartColors.chart1,
        },
        {
          label: 'Expected Profitable Trades (Bullish Market)',
          data: [expected.momentum.bullish, expected.meanReversion.bullish, expected.arbitrage.bullish],
          backgroundColor: chartColors.chart2,
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
      y: { ...chartConfig.scales.y, title: { ...chartConfig.scales.y.title, text: 'Number of Profitable Trades' } },
      x: { ...chartConfig.scales.x, grid: { display: false } },
    },
    plugins: {
      ...chartConfig.plugins,
      legend: { ...chartConfig.plugins.legend, position: 'top' as const },
      title: { ...chartConfig.plugins.title, text: 'Observed vs. Expected Trades in a Bullish Market' },
    },
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
      <p className="text-center text-sm text-muted-foreground">The test checks if the differences between observed and expected counts are significant.</p>
    </div>
  );
};


export default function ChiSquaredTestPage() {
  return (
    <>
      <PageHeader
        title="Interactive Guide to the Chi-Squared Test"
        description="Analyze categorical data to find significant relationships between variables."
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
                    The Chi-Squared (χ²) test is for **categorical data**. It checks if there's a significant association between two variables. Think of it as asking: "Are these two categories independent, or does knowing one tell me something about the other?"
                </p>
              </div>
              <div>
                <h3 className="mb-1 font-semibold text-primary">
                  When to Use It
                </h3>
                <p className="text-muted-foreground">
                    Use this test when you have counts of data in different categories. For example, testing if a certain trading strategy's success is independent of the market condition (e.g., Bullish, Bearish, Sideways), or if there is a relationship between them.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Test for Independence</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-muted-foreground">
              This chart visualizes the core of the Chi-Squared test: comparing the **observed** frequencies in your sample to the **expected** frequencies you would see if there were no relationship between the variables.
            </p>
            <p className="text-sm text-muted-foreground mb-4">
              <span className="font-semibold text-foreground">Example:</span> A quant analyst tracks profitable trades for three strategies across different market conditions. They want to know if "Strategy Type" and "Market Condition" are independent. The chart shows the observed number of profitable trades for each strategy in a bullish market versus the number we would expect if there were no association.
            </p>
            <div className="mt-4 rounded-lg bg-background/50 p-4">
              <ChiSquaredTestChart />
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
