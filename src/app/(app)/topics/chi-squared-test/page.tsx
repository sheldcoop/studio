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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getChartJsConfig, chartColors } from '@/lib/chart-config';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// --- Chart Components ---

const GoodnessOfFitChart = () => {
  const [chartData, setChartData] = useState<any>(null);
  const chartConfig = getChartJsConfig();
  const totalTrades = 250;
  const expectedPerDay = totalTrades / 5;

  const generateData = () => {
    // Simulate slight variations from the expected 50 trades per day
    const observed = [
      45 + Math.floor(Math.random() * 10) - 5, // Monday
      50 + Math.floor(Math.random() * 10) - 5, // Tuesday
      55 + Math.floor(Math.random() * 10) - 5, // Wednesday
      48 + Math.floor(Math.random() * 10) - 5, // Thursday
      52 + Math.floor(Math.random() * 10) - 5, // Friday
    ];
    // Normalize to ensure sum is totalTrades
    const currentSum = observed.reduce((a, b) => a + b, 0);
    const normalized = observed.map(o => Math.round(o * (totalTrades / currentSum)));
    
    setChartData({
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
      datasets: [
        {
          label: 'Observed Trades',
          data: normalized,
          backgroundColor: chartColors.chart1,
        },
        {
          label: 'Expected Trades (if uniform)',
          data: [expectedPerDay, expectedPerDay, expectedPerDay, expectedPerDay, expectedPerDay],
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
      title: { ...chartConfig.plugins.title, text: 'Are Profitable Trades Evenly Distributed Across the Week?' },
    },
  };

  return (
    <div className="space-y-4">
      {chartData && <div className="h-[350px]"><Bar data={chartData} options={options} /></div>}
      <div className="text-center"><Button onClick={generateData}>Simulate New Data</Button></div>
    </div>
  );
};


const TestForIndependenceChart = () => {
  const [chartData, setChartData] = useState<any>(null);
  const chartConfig = getChartJsConfig();

  const generateData = () => {
    const observed = {
        momentum: { bullish: 40 + Math.floor(Math.random() * 20), bearish: 15, sideways: 25 },
        meanReversion: { bullish: 20, bearish: 30, sideways: 50 + Math.floor(Math.random() * 20) },
        arbitrage: { bullish: 30, bearish: 30, sideways: 25 },
    };
    const rowTotals = {
        momentum: observed.momentum.bullish + observed.momentum.bearish + observed.momentum.sideways,
        meanReversion: observed.meanReversion.bullish + observed.meanReversion.bearish + observed.meanReversion.sideways,
        arbitrage: observed.arbitrage.bullish + observed.arbitrage.bearish + observed.arbitrage.sideways,
    };
    const colTotals = {
        bullish: observed.momentum.bullish + observed.meanReversion.bullish + observed.arbitrage.bullish,
        bearish: observed.momentum.bearish + observed.meanReversion.bearish + observed.arbitrage.bearish,
        sideways: observed.momentum.sideways + observed.meanReversion.sideways + observed.arbitrage.sideways,
    };
    const grandTotal = rowTotals.momentum + rowTotals.meanReversion + rowTotals.arbitrage;
    const expected = {
        momentum: (rowTotals.momentum * colTotals.bullish) / grandTotal,
        meanReversion: (rowTotals.meanReversion * colTotals.bullish) / grandTotal,
        arbitrage: (rowTotals.arbitrage * colTotals.bullish) / grandTotal,
    };

    setChartData({
      labels: ['Momentum Strategy', 'Mean-Reversion Strategy', 'Arbitrage Strategy'],
      datasets: [
        {
          label: 'Observed Profitable Trades (Bullish Market)',
          data: [observed.momentum.bullish, observed.meanReversion.bullish, observed.arbitrage.bullish],
          backgroundColor: chartColors.chart1,
        },
        {
          label: 'Expected Profitable Trades (if independent)',
          data: [expected.momentum, expected.meanReversion, expected.arbitrage],
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
      {chartData && <div className="h-[350px]"><Bar data={chartData} options={options} /></div>}
      <div className="text-center"><Button onClick={generateData}>Simulate New Data</Button></div>
      <p className="text-center text-sm text-muted-foreground">The test checks if the differences between observed and expected counts are significant.</p>
    </div>
  );
};

const TestForHomogeneityChart = () => {
    const [chartData, setChartData] = useState<any>(null);
    const chartConfig = getChartJsConfig();

    const generateData = () => {
        const ny_traders = {
            stocks: 60 + Math.floor(Math.random() * 20) - 10,
            forex: 30 + Math.floor(Math.random() * 10) - 5,
            crypto: 10 + Math.floor(Math.random() * 10) - 5,
        };
        const london_traders = {
            stocks: 40 + Math.floor(Math.random() * 20) - 10,
            forex: 45 + Math.floor(Math.random() * 10) - 5,
            crypto: 15 + Math.floor(Math.random() * 10) - 5,
        };
        
        setChartData({
            labels: ['Stocks', 'Forex', 'Crypto'],
            datasets: [
                {
                    label: 'New York Office',
                    data: Object.values(ny_traders),
                    backgroundColor: chartColors.chart1,
                },
                {
                    label: 'London Office',
                    data: Object.values(london_traders),
                    backgroundColor: chartColors.chart2,
                },
            ]
        });
    };

    useEffect(() => {
        generateData();
    }, []);

    const options = {
        ...chartConfig,
        scales: {
          y: { ...chartConfig.scales.y, title: { ...chartConfig.scales.y.title, text: 'Number of Traders' } },
          x: { ...chartConfig.scales.x, grid: { display: false } },
        },
        plugins: {
          ...chartConfig.plugins,
          legend: { ...chartConfig.plugins.legend, position: 'top' as const },
          title: { ...chartConfig.plugins.title, text: 'Asset Class Preference by Office Location' },
        },
    };

    return (
        <div className="space-y-4">
          {chartData && <div className="h-[350px]"><Bar data={chartData} options={options} /></div>}
          <div className="text-center"><Button onClick={generateData}>Simulate New Survey Data</Button></div>
        </div>
    );
};


export default function ChiSquaredTestPage() {
  return (
    <>
      <PageHeader
        title="Interactive Guide to the Chi-Squared (χ²) Test"
        description="Analyze categorical data to find significant relationships between variables."
      />
      <div className="mx-auto max-w-5xl space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Core Concepts</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
                The Chi-Squared (χ²) test is a versatile statistical tool for categorical data. It helps determine if the observed data significantly differs from what was expected. It has three primary uses, each answering a different kind of question.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <Tabs defaultValue="goodness-of-fit">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="goodness-of-fit">Goodness of Fit</TabsTrigger>
                <TabsTrigger value="independence">Test for Independence</TabsTrigger>
                <TabsTrigger value="homogeneity">Test for Homogeneity</TabsTrigger>
              </TabsList>
              
              <TabsContent value="goodness-of-fit" className="mt-6">
                <h3 className="text-xl font-bold">Goodness of Fit Test</h3>
                <p className="mt-2 text-muted-foreground">
                  Use this to compare the frequency distribution of a **single categorical variable** from one sample against a theoretical or expected distribution.
                </p>
                <p className="mt-4 text-sm">
                  <span className="font-semibold text-foreground">
                    Example:
                  </span>{' '}
                   A firm wants to know if profitable trades are uniformly distributed throughout the week. The null hypothesis is that each day has an equal number of profitable trades. The Chi-Squared Goodness of Fit test checks if the observed daily counts are significantly different from the expected counts.
                </p>
                <div className="mt-4 rounded-lg bg-background/50 p-4">
                  <GoodnessOfFitChart />
                </div>
              </TabsContent>

              <TabsContent value="independence" className="mt-6">
                <h3 className="text-xl font-bold">Test for Independence</h3>
                <p className="mt-2 text-muted-foreground">
                 Use this to determine if there is a significant association between **two categorical variables** within a single population.
                </p>
                <p className="mt-4 text-sm">
                  <span className="font-semibold text-foreground">
                    Example:
                  </span>{' '}
                  A quant analyst tracks profitable trades for three strategies across different market conditions. They want to know if "Strategy Type" and "Market Condition" are independent. The test compares the observed counts to what we'd expect if no relationship existed.
                </p>
                <div className="mt-4 rounded-lg bg-background/50 p-4">
                  <TestForIndependenceChart />
                </div>
              </TabsContent>

              <TabsContent value="homogeneity" className="mt-6">
                <h3 className="text-xl font-bold">Test for Homogeneity</h3>
                <p className="mt-2 text-muted-foreground">
                  Use this to check if the distribution of **one categorical variable** is the same across **multiple different populations**.
                </p>
                <p className="mt-4 text-sm">
                  <span className="font-semibold text-foreground">
                    Example:
                  </span>{' '}
                  A global firm surveys traders in their New York and London offices (two populations) about their preferred asset class (one variable: Stocks, Forex, or Crypto). The Test for Homogeneity determines if the proportion of traders who prefer each asset class is the same in both offices.
                </p>
                <div className="mt-4 rounded-lg bg-background/50 p-4">
                    <TestForHomogeneityChart />
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
