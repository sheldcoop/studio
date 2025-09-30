'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/app/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {type ChartConfig, ChartContainer} from '@/components/ui/chart';
import { ChartTooltipContent } from '@/lib/chart-config';
import { Area, Bar, Line, AreaChart as RechartsAreaChart, BarChart as RechartsBarChart, LineChart as RechartsLineChart, CartesianGrid, XAxis, YAxis, Tooltip, Cell } from 'recharts';

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

const oneWayAnovaChartConfig = {
  value: {
    label: 'Value',
  },
  Algorithm_Alpha: {
    label: 'Alpha',
    color: 'hsl(var(--chart-1))',
  },
  Algorithm_Beta: {
    label: 'Beta',
    color: 'hsl(var(--chart-2))',
  },
  Algorithm_Gamma: {
    label: 'Gamma',
    color: 'hsl(var(--chart-3))',
  },
} satisfies ChartConfig;

const twoWayAnovaChartConfig = {
  stocks: {
    label: 'Stocks',
    color: 'hsl(var(--chart-1))',
  },
  crypto: {
    label: 'Crypto',
    color: 'hsl(var(--chart-2))',
  },
} satisfies ChartConfig;

const repeatedMeasuresAnovaChartConfig = {
    value: {
        label: 'Value',
        color: 'hsl(var(--chart-1))',
    }
} satisfies ChartConfig;


// --- Chart Components ---
const OneWayAnovaChart = ({generateData}: {generateData: Function}) => {
  const [chartData, setChartData] = useState<any[]>([]);

  const generate = () => {
    const dataAlpha = generateNormalData(1.2, 0.8, 50);
    const dataBeta = generateNormalData(1.5, 0.8, 50);
    const dataGamma = generateNormalData(0.9, 0.8, 50);
    setChartData([
        { name: 'Algorithm_Alpha', value: getMean(dataAlpha)},
        { name: 'Algorithm_Beta', value: getMean(dataBeta) },
        { name: 'Algorithm_Gamma', value: getMean(dataGamma) },
    ]);
  };

  useEffect(() => {
    generate();
  }, []);

  return (
    <div className="flex h-[420px] w-full flex-col">
      <div className="flex-grow">
        <ChartContainer config={oneWayAnovaChartConfig} className="h-full w-full">
          <RechartsBarChart accessibilityLayer data={chartData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="name" tickLine={false} tickMargin={10} axisLine={false} tickFormatter={(value) => oneWayAnovaChartConfig[value as keyof typeof oneWayAnovaChartConfig]?.label || value} />
              <YAxis unit="%" />
              <Tooltip cursor={false} content={<ChartTooltipContent indicator='dot' />} />
              <Bar dataKey="value" radius={8}>
                {chartData.map((entry) => (
                    <Cell key={`cell-${entry.name}`} fill={`var(--color-${entry.name})`} />
                ))}
              </Bar>
          </RechartsBarChart>
        </ChartContainer>
      </div>
      <div className="mt-4 flex-shrink-0 text-center">
        <Button onClick={() => generate()}>Simulate New 50-Month Period</Button>
      </div>
    </div>
  );
};

const TwoWayAnovaChart = ({generateData}: {generateData: Function}) => {
    const [chartData, setChartData] = useState<any[]>([]);

    const generate = () => {
        const interactionEffect = Math.random() * 2;
        const means = {
            stocksMorning: 0.5 + (Math.random() - 0.5) * 0.2,
            stocksAfternoon: 0.4 + (Math.random() - 0.5) * 0.2,
            cryptoMorning: 0.8 + (Math.random() - 0.5) * 0.3,
            cryptoAfternoon: 0.2 + interactionEffect + (Math.random() - 0.5) * 0.3,
        };

        setChartData([
            { name: 'Morning', stocks: means.stocksMorning, crypto: means.cryptoMorning },
            { name: 'Afternoon', stocks: means.stocksAfternoon, crypto: means.cryptoAfternoon },
        ]);
    };

    useEffect(() => {
        generate();
    }, []);
    

    return (
        <div className="flex h-[420px] w-full flex-col">
            <div className="flex-grow">
                <ChartContainer config={twoWayAnovaChartConfig} className="h-full w-full">
                    <RechartsLineChart accessibilityLayer data={chartData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                        <CartesianGrid vertical={false} />
                        <XAxis dataKey="name" tickLine={false} tickMargin={10} axisLine={false} />
                        <YAxis unit="$" />
                        <Tooltip content={<ChartTooltipContent indicator='dot' />} />
                        <Line type="monotone" dataKey="stocks" strokeWidth={2} stroke="var(--color-stocks)" />
                        <Line type="monotone" dataKey="crypto" strokeWidth={2} stroke="var(--color-crypto)" />
                    </RechartsLineChart>
                </ChartContainer>
            </div>
            <p className="pt-4 text-center text-sm text-muted-foreground">Non-parallel lines suggest an interaction effect.</p>
            <div className="mt-4 flex-shrink-0 text-center">
                <Button onClick={() => generate()}>Simulate New Trading Data</Button>
            </div>
        </div>
    );
};

const RepeatedMeasuresAnovaChart = ({generateData}: {generateData: Function}) => {
    const [chartData, setChartData] = useState<any[]>([]);

    const generate = () => {
        const startRatio = 0.8 + (Math.random() - 0.5) * 0.4;
        const midRatio = startRatio + (0.2 + Math.random() * 0.3);
        const endRatio = midRatio + (0.1 + Math.random() * 0.4);

        setChartData([
            { name: 'Year 1 (Baseline)', value: startRatio },
            { name: 'Year 2 (+Intl Stocks)', value: midRatio },
            { name: 'Year 3 (+Hedging)', value: endRatio },
        ]);
    };
    
    useEffect(() => {
        generate();
    }, []);
    

    return (
         <div className="flex h-[420px] w-full flex-col">
            <div className="flex-grow">
                <ChartContainer config={repeatedMeasuresAnovaChartConfig} className="h-full w-full">
                     <RechartsAreaChart accessibilityLayer data={chartData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                        <CartesianGrid vertical={false} />
                        <XAxis dataKey="name" tickLine={false} tickMargin={10} axisLine={false} />
                        <YAxis />
                        <Tooltip content={<ChartTooltipContent indicator='dot' />} />
                        <defs>
                            <linearGradient id="fillValue" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="var(--color-value)" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="var(--color-value)" stopOpacity={0.1} />
                            </linearGradient>
                        </defs>
                        <Area type="monotone" dataKey="value" strokeWidth={2} stroke="var(--color-value)" fill="url(#fillValue)" />
                    </RechartsAreaChart>
                </ChartContainer>
            </div>
            <div className="mt-4 flex-shrink-0 text-center">
                <Button onClick={() => generate()}>Simulate New Portfolio Journey</Button>
            </div>
        </div>
    );
};
