'use client';

import { useState, useEffect } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Rectangle,
} from 'recharts';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/app/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChartTooltipContent } from '@/lib/chart-config.tsx';
import { ChartContainer, type ChartConfig } from '@/components/ui/chart';

const goodnessOfFitChartConfig = {
  observed: {
    label: 'Observed',
    color: 'hsl(var(--chart-1))',
  },
  expected: {
    label: 'Expected',
    color: 'hsl(var(--chart-2))',
  },
} satisfies ChartConfig;

const testForIndependenceChartConfig = {
  observed: {
    label: 'Observed (Bullish)',
    color: 'hsl(var(--chart-1))',
  },
  expected: {
    label: 'Expected (Independent)',
    color: 'hsl(var(--chart-2))',
  },
} satisfies ChartConfig;

const testForHomogeneityChartConfig = {
  ny: {
    label: 'New York',
    color: 'hsl(var(--chart-1))',
  },
  london: {
    label: 'London',
    color: 'hsl(var(--chart-2))',
  },
} satisfies ChartConfig;


// --- Chart Components ---

const GoodnessOfFitChart = () => {
  const [chartData, setChartData] = useState<any>([]);
  const totalTrades = 250;

  const generateData = () => {
    const observed = [
      45 + Math.floor(Math.random() * 10) - 5, // Monday
      50 + Math.floor(Math.random() * 10) - 5, // Tuesday
      55 + Math.floor(Math.random() * 10) - 5, // Wednesday
      48 + Math.floor(Math.random() * 10) - 5, // Thursday
      52 + Math.floor(Math.random() * 10) - 5, // Friday
    ];
    const currentSum = observed.reduce((a, b) => a + b, 0);
    const normalized = observed.map(o => Math.round(o * (totalTrades / currentSum)));
    
    const expectedPerDay = totalTrades / 5;

    setChartData([
        { name: 'Mon', observed: normalized[0], expected: expectedPerDay },
        { name: 'Tue', observed: normalized[1], expected: expectedPerDay },
        { name: 'Wed', observed: normalized[2], expected: expectedPerDay },
        { name: 'Thu', observed: normalized[3], expected: expectedPerDay },
        { name: 'Fri', observed: normalized[4], expected: expectedPerDay },
    ]);
  };

  useEffect(() => {
    generateData();
  }, []);

  return (
    <div className="space-y-4">
      <div className="h-[350px]">
        <ChartContainer config={goodnessOfFitChartConfig} className="min-h-[200px] w-full">
            <BarChart accessibilityLayer data={chartData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="name" tickLine={false} tickMargin={10} axisLine={false} />
                <YAxis />
                <Tooltip content={<ChartTooltipContent indicator='dot' />} />
                <Legend />
                <Bar dataKey="observed" name="Observed Trades" fill={goodnessOfFitChartConfig.observed.color} radius={4} />
                <Bar dataKey="expected" name="Expected Trades" fill={goodnessOfFitChartConfig.expected.color} radius={4} />
            </BarChart>
        </ChartContainer>
      </div>
      <div className="text-center mt-4"><Button onClick={generateData}>Simulate New Data</Button></div>
    </div>
  );
};


const TestForIndependenceChart = () => {
  const [chartData, setChartData] = useState<any[]>([]);

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

    setChartData([
      { name: 'Momentum', observed: observed.momentum.bullish, expected: expected.momentum },
      { name: 'Mean-Reversion', observed: observed.meanReversion.bullish, expected: expected.meanReversion },
      { name: 'Arbitrage', observed: observed.arbitrage.bullish, expected: expected.arbitrage },
    ]);
  };

  useEffect(() => {
    generateData();
  }, []);

  return (
    <div className="space-y-4">
      <div className="h-[350px]">
        <ChartContainer config={testForIndependenceChartConfig} className="min-h-[200px] w-full">
            <BarChart accessibilityLayer data={chartData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="name" tickLine={false} tickMargin={10} axisLine={false} tickFormatter={(value) => value.split(' ')[0]}/>
                <YAxis />
                <Tooltip content={<ChartTooltipContent indicator='dot' />} />
                <Legend />
                <Bar dataKey="observed" name="Observed (Bullish Market)" fill={testForIndependenceChartConfig.observed.color} radius={4} />
                <Bar dataKey="expected" name="Expected (If Independent)" fill={testForIndependenceChartConfig.expected.color} radius={4} />
            </BarChart>
        </ChartContainer>
      </div>
      <div className="text-center mt-4"><Button onClick={generateData}>Simulate New Data</Button></div>
      <p className="text-center text-sm text-muted-foreground">The test checks if the differences between observed and expected counts are significant.</p>
    </div>
  );
};

const TestForHomogeneityChart = () => {
    const [chartData, setChartData] = useState<any>([]);

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
        
        setChartData([
            { name: 'Stocks', ny: ny_traders.stocks, london: london_traders.stocks },
            { name: 'Forex', ny: ny_traders.forex, london: london_traders.forex },
            { name: 'Crypto', ny: ny_traders.crypto, london: london_traders.crypto },
        ]);
    };

    useEffect(() => {
        generateData();
    }, []);

    return (
        <div className="space-y-4">
          <div className="h-[350px]">
            <ChartContainer config={testForHomogeneityChartConfig} className="min-h-[200px] w-full">
                <BarChart accessibilityLayer data={chartData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                    <CartesianGrid vertical={false} />
                    <XAxis dataKey="name" tickLine={false} tickMargin={10} axisLine={false} />
                    <YAxis />
                    <Tooltip content={<ChartTooltipContent indicator='dot' />} />
                    <Legend />
                    <Bar dataKey="ny" name="New York Office" fill={testForHomogeneityChartConfig.ny.color} radius={4} />
                    <Bar dataKey="london" name="London Office" fill={testForHomogeneityChartConfig.london.color} radius={4} />
                </BarChart>
            </ChartContainer>
          </div>
          <div className="text-center mt-4"><Button onClick={generateData}>Simulate New Survey Data</Button></div>
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
