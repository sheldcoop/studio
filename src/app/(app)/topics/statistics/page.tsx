
'use client';

import { PageHeader } from '@/components/app/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { ChartContainer, type ChartConfig } from '@/components/ui/chart';
import {
  Bar,
  BarChart,
  Line,
  LineChart,
  Area,
  AreaChart,
  Scatter,
  ScatterChart,
  Cell,
  CartesianGrid,
  Legend,
  ReferenceLine,
  Tooltip,
  XAxis,
  YAxis,
  Label as RechartsLabel
} from 'recharts';
import { ChartTooltipContent } from '@/lib/chart-config';

// --- Generic Helper Functions ---
const generateNormalData = (mean: number, stdDev: number, n: number) =>
  Array.from({ length: n }, () => mean + stdDev * (Math.random() * 2 - 1 + (Math.random() * 2 - 1) + (Math.random() * 2 - 1)));

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

const getMean = (data: number[]) => data.reduce((a, b) => a + b, 0) / data.length;
const getVariance = (data: number[]) => {
  if (data.length < 2) return 0;
  const mean = getMean(data);
  return data.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / (data.length - 1);
};
const getMedian = (data: number[]) => {
  if (data.length === 0) return 0;
  const sorted = [...data].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
};
const standardNormalCdf = (x: number) => {
  const t = 1 / (1 + 0.2316419 * Math.abs(x));
  const d = 0.3989423 * Math.exp(-x * x / 2);
  let prob = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
  if (x > 0) prob = 1 - prob;
  return prob;
};
const generateUniformData = (min: number, max: number, n: number) => Array.from({ length: n }, () => min + Math.random() * (max - min));
const createHistogram = (data: number[], binSize: number, min: number, max: number) => {
    const bins = Math.ceil((max - min) / binSize);
    const labels = Array.from({ length: bins }, (_, i) => (min + i * binSize));
    const counts = new Array(bins).fill(0);
    for (const value of data) {
        const binIndex = Math.floor((value - min) / binSize);
        if (binIndex >= 0 && binIndex < bins) {
            counts[binIndex]++;
        }
    }
    return { labels, counts };
};
const generateMonotonicData = (n: number, strength: number) => {
  const data = [];
  for (let i = 0; i < n; i++) {
    const x = Math.random() * 100;
    const noise = (Math.random() - 0.5) * (50 / strength);
    const y = Math.pow(x / 10, 2) + noise;
    data.push({ x, y });
  }
  return data;
};
const generateCorrelatedData = (n: number, correlation: number, meanX = 50, meanY = 50, stdDevX = 10, stdDevY = 10) => {
  const data = [];
  for (let i = 0; i < n; i++) {
    const u1 = Math.random();
    const u2 = Math.random();
    const z1 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
    const z2 = Math.sqrt(-2 * Math.log(u1)) * Math.sin(2 * Math.PI * u2);
    const x = meanX + stdDevX * z1;
    const y = meanY + stdDevY * (correlation * z1 + Math.sqrt(1 - correlation ** 2) * z2);
    data.push({ x, y });
  }
  return data;
};
const generateRankData = (numSubjects: number) => {
  const data = [];
  for (let i = 0; i < numSubjects; i++) {
    const baseRank = Math.random() * numSubjects + 1;
    const lowVol = baseRank + (Math.random() - 0.5) * 2;
    const medVol = baseRank + (Math.random() - 0.5) * 4;
    const highVol = baseRank + (Math.random() - 0.5) * 6;
    data.push([lowVol, medVol, highVol]);
  }
  return data.map(d => d.map(r => Math.max(1, Math.round(r))));
};

const componentLoader = () => <Skeleton className="w-full h-96" />;


// --- T-Test Component ---
const TTestContent = () => {
    // Chart configs
    const independentTestChartConfig = { Momentum: { label: 'Momentum', color: 'hsl(var(--chart-1))' }, 'Mean-Reversion': { label: 'Mean-Reversion', color: 'hsl(var(--chart-2))' }} satisfies ChartConfig;
    const pairedTestChartConfig = { before: { label: 'Before', color: 'hsl(var(--chart-2))' }, after: { label: 'After', color: 'hsl(var(--chart-1))' }} satisfies ChartConfig;
    const oneSampleTestChartConfig = { value: { label: 'Value', color: 'hsl(var(--chart-1))' }} satisfies ChartConfig;

    // Chart Components
    const IndependentTestChart = () => {
      const [chartData, setChartData] = useState<any[]>([]);
      useEffect(() => { generateData(); }, []);
      const generateData = () => {
        const dataA = generateNormalData(0.08, 0.5, 60);
        const dataB = generateNormalData(0.03, 0.5, 60);
        setChartData([{ name: 'Momentum', value: getMean(dataA) }, { name: 'Mean-Reversion', value: getMean(dataB) }]);
      };
      return (
        <div className="flex h-[420px] w-full flex-col">
          <div className="flex-grow">
            <ChartContainer config={independentTestChartConfig} className="h-full w-full">
              <BarChart accessibilityLayer data={chartData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="name" tickLine={false} tickMargin={10} axisLine={false} tickFormatter={(value) => independentTestChartConfig[value as keyof typeof independentTestChartConfig]?.label || value} />
                <YAxis unit="%" />
                <Tooltip cursor={{ fill: 'hsl(var(--muted))' }} content={<ChartTooltipContent indicator="dot" />} />
                <Bar dataKey="value" radius={8}>
                    {chartData.map((entry) => (<Cell key={`cell-${entry.name}`} fill={`var(--color-${entry.name})`} />))}
                </Bar>
              </BarChart>
            </ChartContainer>
          </div>
          <div className="mt-4 flex-shrink-0 text-center"><Button onClick={generateData}>Simulate New 60-Day Period</Button></div>
        </div>
      );
    };

    const PairedTestChart = () => {
      const [chartData, setChartData] = useState<any[]>([]);
      useEffect(() => { generateData(); }, []);
      const generateData = () => {
        const numSubjects = 12;
        const beforeData = Array.from({ length: numSubjects }, () => 0.5 + (Math.random() - 0.5) * 2);
        const afterData = beforeData.map((d) => d + (0.1 + Math.random() * 0.5));
        setChartData(Array.from({ length: numSubjects }, (_, i) => ({ name: `Week ${i + 1}`, before: beforeData[i], after: afterData[i] })));
      };
      return (
        <div className="flex h-[420px] w-full flex-col">
          <div className="flex-grow">
            <ChartContainer config={pairedTestChartConfig} className="h-full w-full">
              <LineChart accessibilityLayer data={chartData} margin={{ top: 20, right: 30, bottom: 20, left: 20 }}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="name" tickLine={false} tickMargin={10} axisLine={false} />
                <YAxis unit="%" />
                <Tooltip content={<ChartTooltipContent indicator="dot" />} />
                <Legend formatter={(value) => pairedTestChartConfig[value as keyof typeof pairedTestChartConfig]?.label || value} />
                <Line type="monotone" dataKey="before" strokeWidth={2} stroke="var(--color-before)" />
                <Line type="monotone" dataKey="after" strokeWidth={2} stroke="var(--color-after)" />
              </LineChart>
            </ChartContainer>
          </div>
          <div className="mt-4 flex-shrink-0 text-center"><Button onClick={generateData}>Simulate New Data</Button></div>
        </div>
      );
    };

    const OneSampleTestChart = () => {
      const [meanValue, setMeanValue] = useState(1.7);
      const target = 1.5;
      const chartData = [{ name: 'Avg. Return', value: meanValue }];
      return (
        <div className="flex h-[420px] w-full flex-col">
          <div className="flex-grow">
            <ChartContainer config={oneSampleTestChartConfig} className="h-full w-full">
              <BarChart accessibilityLayer data={chartData} layout="vertical" margin={{ top: 20, right: 40, bottom: 20, left: 40 }}>
                <CartesianGrid horizontal={false} />
                <YAxis type="category" dataKey="name" tickLine={false} axisLine={false} width={80} />
                <XAxis type="number" unit="%" domain={[0, 3]} />
                <Tooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                <Bar dataKey="value" radius={8} fill="var(--color-value)" />
                <ReferenceLine x={target} stroke="hsl(var(--destructive))" strokeWidth={2} strokeDasharray="3 3">
                  <RechartsLabel value={`Claimed: ${target}%`} position="insideTopRight" fill="hsl(var(--destructive))" fontSize={12} />
                </ReferenceLine>
              </BarChart>
            </ChartContainer>
          </div>
          <div className="mt-4 flex-shrink-0 text-center">
            <div className="mx-auto max-w-sm py-4">
              <Label htmlFor="mean-slider">Adjust Sample's Average Monthly Return (%)</Label>
              <Slider id="mean-slider" min={0.5} max={2.5} value={[meanValue]} step={0.05} onValueChange={(value) => setMeanValue(value[0])} className="my-4" />
            </div>
            <div className="text-sm text-muted-foreground">Current Mean: <span className="font-bold text-foreground">{meanValue.toFixed(2)}</span> % vs Claimed <span className="font-bold text-destructive">{target}%</span></div>
          </div>
        </div>
      );
    };

    return (
        <>
            <h3 className="text-xl font-bold">T-Test</h3>
            <p className="mt-2 text-muted-foreground">The t-test is a key tool for comparing average returns and performance. This guide uses interactive trading examples to explain the main types of t-tests and help you understand when to use each one.</p>
            <Tabs defaultValue="independent" className="mt-4">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="independent">Independent</TabsTrigger>
                <TabsTrigger value="paired">Paired</TabsTrigger>
                <TabsTrigger value="one-sample">One-Sample</TabsTrigger>
              </TabsList>
              <TabsContent value="independent" className="mt-6">
                <h4 className="text-lg font-semibold">Independent Samples T-Test</h4>
                <p className="mt-2 text-sm text-muted-foreground">Compares the means of two separate, unrelated groups. Perfect for comparing two different strategies.</p>
                <p className="mt-2 text-xs text-muted-foreground"><span className="font-semibold text-foreground">Example:</span> Comparing the average daily returns of a Momentum Strategy vs. a Mean-Reversion Strategy over the last 60 days.</p>
                <div className="mt-4 rounded-lg bg-background/50 p-4"><IndependentTestChart /></div>
              </TabsContent>
              <TabsContent value="paired" className="mt-6">
                <h4 className="text-lg font-semibold">Paired Samples T-Test</h4>
                <p className="mt-2 text-sm text-muted-foreground">Compares the means of one group, measured twice. Ideal for "before and after" scenarios.</p>
                <p className="mt-2 text-xs text-muted-foreground"><span className="font-semibold text-foreground">Example:</span> Measuring a portfolio's weekly returns for 12 weeks before and after adding a new algorithm.</p>
                <div className="mt-4 rounded-lg bg-background/50 p-4"><PairedTestChart /></div>
              </TabsContent>
              <TabsContent value="one-sample" className="mt-6">
                 <h4 className="text-lg font-semibold">One-Sample T-Test</h4>
                <p className="mt-2 text-sm text-muted-foreground">Compares the mean of a single group to a known, fixed number, like a benchmark or advertised return.</p>
                <p className="mt-2 text-xs text-muted-foreground"><span className="font-semibold text-foreground">Example:</span> A hedge fund claims its average monthly return is 1.5%. You test a sample of its returns to see if the average is statistically different.</p>
                <div className="mt-4 rounded-lg bg-background/50 p-4"><OneSampleTestChart /></div>
              </TabsContent>
            </Tabs>
        </>
    );
};

// --- Z-Test Component ---
const ZTestContent = () => {
    const OneSampleZTestChart = () => {
      const [meanValue, setMeanValue] = useState(0.08);
      const target = 0.05;
      const chartData = [{ name: 'Stock_A_Recent_Avg', value: meanValue }];
      const oneSampleZTestChartConfig = { value: { label: "Stock A's Recent Avg.", color: 'hsl(var(--chart-1))' }} satisfies ChartConfig;
      return (
        <div className="flex h-[420px] w-full flex-col">
          <div className="flex-grow">
            <ChartContainer config={oneSampleZTestChartConfig} className="h-full w-full">
              <BarChart accessibilityLayer data={chartData} layout="vertical" margin={{ top: 20, right: 40, bottom: 20, left: 20 }}>
                <CartesianGrid horizontal={false} />
                <YAxis type="category" dataKey="name" tickLine={false} axisLine={false} width={120} tickFormatter={() => "Stock A's Recent Avg."} />
                <XAxis type="number" unit="%" domain={[-0.2, 0.3]} />
                <Tooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                <Bar dataKey="value" radius={8} fill="var(--color-value)" />
                <ReferenceLine x={target} stroke="hsl(var(--destructive))" strokeWidth={2} strokeDasharray="3 3">
                  <RechartsLabel value={`Historical Avg: ${target}%`} position="insideTopRight" fill="hsl(var(--destructive))" fontSize={12} />
                </ReferenceLine>
              </BarChart>
            </ChartContainer>
          </div>
          <div className="mx-auto max-w-sm flex-shrink-0 text-center">
            <div className="py-4">
              <Label htmlFor="mean-slider-z">Adjust Stock A's Recent Avg. Daily Return (%)</Label>
              <Slider id="mean-slider-z" min={-0.1} max={0.2} value={[meanValue]} step={0.005} onValueChange={(value) => setMeanValue(value[0])} className="my-4" />
            </div>
            <div className="text-sm text-muted-foreground">Current Mean: <span className="font-bold text-foreground">{meanValue.toFixed(3)}</span>%</div>
          </div>
        </div>
      );
    };

    const TwoSampleZTestChart = () => {
      const [chartData, setChartData] = useState<any[]>([]);
      const twoSampleZTestChartConfig = { Stock_A: { label: 'Stock A', color: 'hsl(var(--chart-1))' }, Stock_B: { label: 'Stock B', color: 'hsl(var(--chart-2))' }} satisfies ChartConfig;
      const generateData = () => {
        const dataA = generateNormalData(1.8, 0.7, 1260);
        const dataB = generateNormalData(1.6, 0.8, 1260);
        setChartData([{ month: 'Volatility', Stock_A: getMean(dataA), Stock_B: getMean(dataB) }]);
      };
      useEffect(() => { generateData() }, []);
      return (
        <div className="flex h-[420px] w-full flex-col">
          <div className="flex-grow">
            <ChartContainer config={twoSampleZTestChartConfig} className="h-full w-full">
              <BarChart accessibilityLayer data={chartData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="month" tickLine={false} tickMargin={10} axisLine={false} />
                <YAxis unit="%" />
                <Tooltip content={<ChartTooltipContent indicator="dot" />} />
                <Legend />
                <Bar dataKey="Stock_A" radius={4} fill="var(--color-Stock_A)" />
                <Bar dataKey="Stock_B" radius={4} fill="var(--color-Stock_B)" />
              </BarChart>
            </ChartContainer>
          </div>
          <div className="mt-4 flex-shrink-0 text-center"><Button onClick={generateData}>Simulate New 5-Year Period</Button></div>
        </div>
      );
    };

    return (
      <>
        <h3 className="text-xl font-bold">Z-Test</h3>
        <p className="mt-2 text-muted-foreground">Used for comparing means with large samples (n > 30) when population variance is known. It's rarer in practice than the T-test due to the requirement of knowing the population variance.</p>
        <Tabs defaultValue="two-sample" className="mt-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="one-sample">One-Sample</TabsTrigger>
            <TabsTrigger value="two-sample">Two-Sample</TabsTrigger>
          </TabsList>
          <TabsContent value="one-sample" className="mt-6">
            <h4 className="text-lg font-semibold">One-Sample Z-Test</h4>
            <p className="mt-2 text-sm text-muted-foreground">Compares the mean of a single, large sample against its known, long-term population average.</p>
             <p className="mt-2 text-xs text-muted-foreground"><span className="font-semibold text-foreground">Example:</span> After a platform update, analyze 100 days of 'Stock A' returns to see if its average daily return differs from its 10-year historical average of 0.05%.</p>
            <div className="mt-4 rounded-lg bg-background/50 p-4"><OneSampleZTestChart /></div>
          </TabsContent>
          <TabsContent value="two-sample" className="mt-6">
             <h4 className="text-lg font-semibold">Two-Sample Z-Test</h4>
            <p className="mt-2 text-sm text-muted-foreground">Compares the means of two large, independent stocks when you have extensive historical data providing known population standard deviations for both.</p>
             <p className="mt-2 text-xs text-muted-foreground"><span className="font-semibold text-foreground">Example:</span> Compare the average daily volatility of 'Stock A' vs. 'Stock B' over the past five years (~1260 data points each).</p>
            <div className="mt-4 rounded-lg bg-background/50 p-4"><TwoSampleZTestChart /></div>
          </TabsContent>
        </Tabs>
      </>
    );
};

// --- ANOVA Component ---
const AnovaContent = () => {
    const oneWayAnovaChartConfig = { value: { label: 'Value', }, 'Algorithm_Alpha': { label: 'Alpha', color: 'hsl(var(--chart-1))' }, 'Algorithm_Beta': { label: 'Beta', color: 'hsl(var(--chart-2))' }, 'Algorithm_Gamma': { label: 'Gamma', color: 'hsl(var(--chart-3))' }} satisfies ChartConfig;
    const twoWayAnovaChartConfig = { stocks: { label: 'Stocks', color: 'hsl(var(--chart-1))' }, crypto: { label: 'Crypto', color: 'hsl(var(--chart-2))' }} satisfies ChartConfig;
    const repeatedMeasuresAnovaChartConfig = { value: { label: 'Value', color: 'hsl(var(--chart-1))' }} satisfies ChartConfig;

    const OneWayAnovaChart = () => {
      const [chartData, setChartData] = useState<any[]>([]);
      const generateData = () => {
        const dataAlpha = generateNormalData(1.2, 0.8, 50);
        const dataBeta = generateNormalData(1.5, 0.8, 50);
        const dataGamma = generateNormalData(0.9, 0.8, 50);
        setChartData([{ name: 'Algorithm_Alpha', value: getMean(dataAlpha)}, { name: 'Algorithm_Beta', value: getMean(dataBeta) }, { name: 'Algorithm_Gamma', value: getMean(dataGamma) }]);
      };
      useEffect(() => { generateData(); }, []);
      return (
        <div className="flex h-[420px] w-full flex-col">
          <div className="flex-grow">
            <ChartContainer config={oneWayAnovaChartConfig} className="h-full w-full">
              <BarChart accessibilityLayer data={chartData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                  <CartesianGrid vertical={false} />
                  <XAxis dataKey="name" tickLine={false} tickMargin={10} axisLine={false} tickFormatter={(value) => oneWayAnovaChartConfig[value as keyof typeof oneWayAnovaChartConfig]?.label || value} />
                  <YAxis unit="%" />
                  <Tooltip cursor={false} content={<ChartTooltipContent indicator='dot' />} />
                  <Bar dataKey="value" radius={8}>
                    {chartData.map((entry) => (<Cell key={`cell-${entry.name}`} fill={`var(--color-${entry.name})`} />))}
                  </Bar>
              </BarChart>
            </ChartContainer>
          </div>
          <div className="mt-4 flex-shrink-0 text-center"><Button onClick={generateData}>Simulate New 50-Month Period</Button></div>
        </div>
      );
    };

    const TwoWayAnovaChart = () => {
        const [chartData, setChartData] = useState<any[]>([]);
        const generateData = () => {
            const interactionEffect = Math.random() * 2;
            const means = { stocksMorning: 0.5 + (Math.random() - 0.5) * 0.2, stocksAfternoon: 0.4 + (Math.random() - 0.5) * 0.2, cryptoMorning: 0.8 + (Math.random() - 0.5) * 0.3, cryptoAfternoon: 0.2 + interactionEffect + (Math.random() - 0.5) * 0.3 };
            setChartData([{ name: 'Morning', stocks: means.stocksMorning, crypto: means.cryptoMorning }, { name: 'Afternoon', stocks: means.stocksAfternoon, crypto: means.cryptoAfternoon }]);
        };
        useEffect(() => { generateData(); }, []);
        return (
            <div className="flex h-[420px] w-full flex-col">
                <div className="flex-grow">
                    <ChartContainer config={twoWayAnovaChartConfig} className="h-full w-full">
                        <LineChart accessibilityLayer data={chartData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                            <CartesianGrid vertical={false} />
                            <XAxis dataKey="name" tickLine={false} tickMargin={10} axisLine={false} />
                            <YAxis unit="$" />
                            <Tooltip content={<ChartTooltipContent indicator='dot' />} />
                            <Line type="monotone" dataKey="stocks" strokeWidth={2} stroke="var(--color-stocks)" />
                            <Line type="monotone" dataKey="crypto" strokeWidth={2} stroke="var(--color-crypto)" />
                        </LineChart>
                    </ChartContainer>
                </div>
                <p className="pt-4 text-center text-sm text-muted-foreground">Non-parallel lines suggest an interaction effect.</p>
                <div className="mt-4 flex-shrink-0 text-center"><Button onClick={generateData}>Simulate New Trading Data</Button></div>
            </div>
        );
    };

    const RepeatedMeasuresAnovaChart = () => {
        const [chartData, setChartData] = useState<any[]>([]);
        const generateData = () => {
            const startRatio = 0.8 + (Math.random() - 0.5) * 0.4;
            const midRatio = startRatio + (0.2 + Math.random() * 0.3);
            const endRatio = midRatio + (0.1 + Math.random() * 0.4);
            setChartData([{ name: 'Year 1 (Baseline)', value: startRatio }, { name: 'Year 2 (+Intl Stocks)', value: midRatio }, { name: 'Year 3 (+Hedging)', value: endRatio }]);
        };
        useEffect(() => { generateData(); }, []);
        return (
             <div className="flex h-[420px] w-full flex-col">
                <div className="flex-grow">
                    <ChartContainer config={repeatedMeasuresAnovaChartConfig} className="h-full w-full">
                         <AreaChart accessibilityLayer data={chartData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                            <CartesianGrid vertical={false} />
                            <XAxis dataKey="name" tickLine={false} tickMargin={10} axisLine={false} />
                            <YAxis />
                            <Tooltip content={<ChartTooltipContent indicator='dot' />} />
                            <defs><linearGradient id="fillValue" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="var(--color-value)" stopOpacity={0.8} /><stop offset="95%" stopColor="var(--color-value)" stopOpacity={0.1} /></linearGradient></defs>
                            <Area type="monotone" dataKey="value" strokeWidth={2} stroke="var(--color-value)" fill="url(#fillValue)" />
                        </AreaChart>
                    </ChartContainer>
                </div>
                <div className="mt-4 flex-shrink-0 text-center"><Button onClick={generateData}>Simulate New Portfolio Journey</Button></div>
            </div>
        );
    };
    return (
        <>
            <h3 className="text-xl font-bold">ANOVA (Analysis of Variance)</h3>
            <p className="mt-2 text-muted-foreground">ANOVA lets you compare the average performance of three or more groups.</p>
            <Tabs defaultValue="one-way" className="mt-4">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="one-way">One-Way</TabsTrigger>
                <TabsTrigger value="two-way">Two-Way</TabsTrigger>
                <TabsTrigger value="repeated-measures">Repeated</TabsTrigger>
              </TabsList>
              <TabsContent value="one-way" className="mt-6">
                <h4 className="text-lg font-semibold">One-Way ANOVA</h4>
                <p className="mt-2 text-sm text-muted-foreground">Compares the means of three or more independent groups based on a single factor.</p>
                 <p className="mt-2 text-xs text-muted-foreground"><span className="font-semibold text-foreground">Example:</span> Compare the average monthly returns of three different trading algorithms.</p>
                <div className="mt-4 rounded-lg bg-background/50 p-4"><OneWayAnovaChart /></div>
              </TabsContent>
              <TabsContent value="two-way" className="mt-6">
                <h4 className="text-lg font-semibold">Two-Way ANOVA</h4>
                <p className="mt-2 text-sm text-muted-foreground">Tests the effect of two independent variables on an outcome and checks for an interaction effect.</p>
                <p className="mt-2 text-xs text-muted-foreground"><span className="font-semibold text-foreground">Example:</span> Does `Asset Class` (Stocks vs. Crypto) and `Time of Day` (Morning vs. Afternoon) affect trade profitability?</p>
                <div className="mt-4 rounded-lg bg-background/50 p-4"><TwoWayAnovaChart /></div>
              </TabsContent>
              <TabsContent value="repeated-measures" className="mt-6">
                <h4 className="text-lg font-semibold">Repeated Measures ANOVA</h4>
                <p className="mt-2 text-sm text-muted-foreground">Used when you measure the same group or subject three or more times (e.g., before, during, after an intervention).</p>
                <p className="mt-2 text-xs text-muted-foreground"><span className="font-semibold text-foreground">Example:</span> Tracking a portfolio's Sharpe Ratio at Year 1, Year 2, and Year 3 to see if changes led to significant improvements.</p>
                <div className="mt-4 rounded-lg bg-background/50 p-4"><RepeatedMeasuresAnovaChart /></div>
              </TabsContent>
            </Tabs>
        </>
    );
};

// --- F-Test Component ---
const FTestContent = () => {
    const fTestChartConfig = { value: { label: 'Variance' }, 'StableStock_Utility': { label: 'StableStock (Utility)', color: 'hsl(var(--chart-1))' }, 'GrowthStock_Tech': { label: 'GrowthStock (Tech)', color: 'hsl(var(--chart-2))' }} satisfies ChartConfig;
    const FTestChart = () => {
      const [chartData, setChartData] = useState<any[]>([]);
      const [fStat, setFStat] = useState(0);
      const generateData = () => {
        const dataStable = generateNormalData(0.05, 0.5, 100);
        const dataGrowth = generateNormalData(0.1, 1.2, 100);
        const varianceStable = getVariance(dataStable);
        const varianceGrowth = getVariance(dataGrowth);
        setChartData([{ name: 'StableStock_Utility', value: varianceStable }, { name: 'GrowthStock_Tech', value: varianceGrowth }]);
        setFStat(varianceGrowth / varianceStable);
      };
      useEffect(() => { generateData(); }, []);
      const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
          const configKey = label as keyof typeof fTestChartConfig;
          const displayName = fTestChartConfig[configKey]?.label || label;
          return (
            <div className="rounded-lg border bg-background p-2 shadow-sm">
              <div className="grid grid-cols-2 gap-2">
                <div className="flex flex-col"><span className="text-[0.70rem] uppercase text-muted-foreground">Stock</span><span className="font-bold text-muted-foreground">{displayName}</span></div>
                <div className="flex flex-col"><span className="text-[0.70rem] uppercase text-muted-foreground">Variance</span><span className="font-bold">{payload[0].value.toFixed(4)}</span></div>
              </div>
              <div className="mt-2 border-t pt-2 text-center"><span className="text-[0.70rem] uppercase text-muted-foreground">F-Statistic (Growth/Stable)</span><span className="font-bold text-lg text-primary block">{fStat.toFixed(2)}</span></div>
            </div>
          );
        }
        return null;
      };
      return (
        <div className="flex h-[420px] w-full flex-col">
          <div className="relative mx-auto flex-grow w-full max-w-2xl">
            <ChartContainer config={fTestChartConfig} className="h-full w-full">
              <BarChart accessibilityLayer data={chartData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="name" tickLine={false} tickMargin={10} axisLine={false} tickFormatter={(value) => fTestChartConfig[value as keyof typeof fTestChartConfig]?.label || value} />
                <YAxis />
                <Tooltip cursor={{ fill: 'hsl(var(--muted))' }} content={<CustomTooltip />} />
                <Bar dataKey="value" radius={8}>
                  {chartData.map((entry) => (<Cell key={`cell-${entry.name}`} fill={`var(--color-${entry.name})`} />))}
                </Bar>
              </BarChart>
            </ChartContainer>
          </div>
          <div className="mt-4 flex-shrink-0 text-center"><Button onClick={generateData}>Simulate New 100-Day Period</Button></div>
        </div>
      );
    };
    return (
        <>
            <h3 className="text-xl font-bold">F-Test</h3>
            <p className="mt-2 text-muted-foreground">Essential for comparing the variance (or volatility) of two or more groups. It tells you if one group's returns are significantly more erratic than another's.</p>
             <p className="mt-2 text-xs text-muted-foreground"><span className="font-semibold text-foreground">Example:</span> An investor compares the return volatility of a stable utility stock versus a tech growth stock to see if the tech stock is statistically riskier.</p>
            <div className="mt-4 rounded-lg bg-background/50 p-4"><FTestChart /></div>
        </>
    );
};

// --- Chi-Squared Test Component ---
const ChiSquaredTestContent = () => {
    const goodnessOfFitChartConfig = { observed: { label: 'Observed', color: 'hsl(var(--chart-1))' }, expected: { label: 'Expected', color: 'hsl(var(--chart-2))' }} satisfies ChartConfig;
    const testForIndependenceChartConfig = { observed: { label: 'Observed (Bullish)', color: 'hsl(var(--chart-1))' }, expected: { label: 'Expected (Independent)', color: 'hsl(var(--chart-2))' }} satisfies ChartConfig;
    const testForHomogeneityChartConfig = { ny: { label: 'New York', color: 'hsl(var(--chart-1))' }, london: { label: 'London', color: 'hsl(var(--chart-2))' }} satisfies ChartConfig;

    const GoodnessOfFitChart = () => {
      const [chartData, setChartData] = useState<any>([]);
      const totalTrades = 250;
      const generateData = () => {
        const observed = [45 + Math.floor(Math.random() * 10) - 5, 50 + Math.floor(Math.random() * 10) - 5, 55 + Math.floor(Math.random() * 10) - 5, 48 + Math.floor(Math.random() * 10) - 5, 52 + Math.floor(Math.random() * 10) - 5];
        const currentSum = observed.reduce((a, b) => a + b, 0);
        const normalized = observed.map(o => Math.round(o * (totalTrades / currentSum)));
        const expectedPerDay = totalTrades / 5;
        setChartData([{ name: 'Mon', observed: normalized[0], expected: expectedPerDay }, { name: 'Tue', observed: normalized[1], expected: expectedPerDay }, { name: 'Wed', observed: normalized[2], expected: expectedPerDay }, { name: 'Thu', observed: normalized[3], expected: expectedPerDay }, { name: 'Fri', observed: normalized[4], expected: expectedPerDay }]);
      };
      useEffect(() => { generateData(); }, []);
      return (
        <div className="flex h-[420px] w-full flex-col">
          <div className="flex-grow">
            <ChartContainer config={goodnessOfFitChartConfig} className="h-full w-full">
                <BarChart accessibilityLayer data={chartData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                    <CartesianGrid vertical={false} />
                    <XAxis dataKey="name" tickLine={false} tickMargin={10} axisLine={false} />
                    <YAxis />
                    <Tooltip content={<ChartTooltipContent indicator='dot' />} />
                    <Legend />
                    <Bar dataKey="observed" fill="var(--color-observed)" radius={4} />
                    <Bar dataKey="expected" fill="var(--color-expected)" radius={4} />
                </BarChart>
            </ChartContainer>
          </div>
          <div className="mt-4 flex-shrink-0 text-center"><Button onClick={generateData}>Simulate New Data</Button></div>
        </div>
      );
    };

    const TestForIndependenceChart = () => {
      const [chartData, setChartData] = useState<any[]>([]);
      const generateData = () => {
        const observed = { momentum: { bullish: 40 + Math.floor(Math.random() * 20), bearish: 15, sideways: 25 }, meanReversion: { bullish: 20, bearish: 30, sideways: 50 + Math.floor(Math.random() * 20) }, arbitrage: { bullish: 30, bearish: 30, sideways: 25 }};
        const rowTotals = { momentum: observed.momentum.bullish + observed.momentum.bearish + observed.momentum.sideways, meanReversion: observed.meanReversion.bullish + observed.meanReversion.bearish + observed.meanReversion.sideways, arbitrage: observed.arbitrage.bullish + observed.arbitrage.bearish + observed.arbitrage.sideways };
        const colTotals = { bullish: observed.momentum.bullish + observed.meanReversion.bullish + observed.arbitrage.bullish, bearish: observed.momentum.bearish + observed.meanReversion.bearish + observed.arbitrage.bearish, sideways: observed.momentum.sideways + observed.meanReversion.sideways + observed.arbitrage.sideways };
        const grandTotal = rowTotals.momentum + rowTotals.meanReversion + rowTotals.arbitrage;
        const expected = { momentum: (rowTotals.momentum * colTotals.bullish) / grandTotal, meanReversion: (rowTotals.meanReversion * colTotals.bullish) / grandTotal, arbitrage: (rowTotals.arbitrage * colTotals.bullish) / grandTotal };
        setChartData([{ name: 'Momentum', observed: observed.momentum.bullish, expected: expected.momentum }, { name: 'Mean-Reversion', observed: observed.meanReversion.bullish, expected: expected.meanReversion }, { name: 'Arbitrage', observed: observed.arbitrage.bullish, expected: expected.arbitrage }]);
      };
      useEffect(() => { generateData(); }, []);
      return (
        <div className="flex h-[420px] w-full flex-col">
          <div className="flex-grow">
            <ChartContainer config={testForIndependenceChartConfig} className="h-full w-full">
                <BarChart accessibilityLayer data={chartData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                    <CartesianGrid vertical={false} />
                    <XAxis dataKey="name" tickLine={false} tickMargin={10} axisLine={false} tickFormatter={(value) => value.split(' ')[0]}/>
                    <YAxis />
                    <Tooltip content={<ChartTooltipContent indicator='dot' />} />
                    <Legend />
                    <Bar dataKey="observed" fill="var(--color-observed)" radius={4} />
                    <Bar dataKey="expected" fill="var(--color-expected)" radius={4} />
                </BarChart>
            </ChartContainer>
          </div>
          <div className="mt-4 flex-shrink-0 text-center"><Button onClick={generateData}>Simulate New Data</Button></div>
          <p className="pt-4 text-center text-sm text-muted-foreground">The test checks if the differences between observed and expected counts are significant.</p>
        </div>
      );
    };

    const TestForHomogeneityChart = () => {
        const [chartData, setChartData] = useState<any>([]);
        const generateData = () => {
            const ny_traders = { stocks: 60 + Math.floor(Math.random() * 20) - 10, forex: 30 + Math.floor(Math.random() * 10) - 5, crypto: 10 + Math.floor(Math.random() * 10) - 5 };
            const london_traders = { stocks: 40 + Math.floor(Math.random() * 20) - 10, forex: 45 + Math.floor(Math.random() * 10) - 5, crypto: 15 + Math.floor(Math.random() * 10) - 5 };
            setChartData([{ name: 'Stocks', ny: ny_traders.stocks, london: london_traders.stocks }, { name: 'Forex', ny: ny_traders.forex, london: london_traders.forex }, { name: 'Crypto', ny: ny_traders.crypto, london: london_traders.crypto }]);
        };
        useEffect(() => { generateData(); }, []);
        return (
            <div className="flex h-[420px] w-full flex-col">
              <div className="flex-grow">
                <ChartContainer config={testForHomogeneityChartConfig} className="h-full w-full">
                    <BarChart accessibilityLayer data={chartData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                        <CartesianGrid vertical={false} />
                        <XAxis dataKey="name" tickLine={false} tickMargin={10} axisLine={false} />
                        <YAxis />
                        <Tooltip content={<ChartTooltipContent indicator='dot' />} />
                        <Legend />
                        <Bar dataKey="ny" fill="var(--color-ny)" radius={4} />
                        <Bar dataKey="london" fill="var(--color-london)" radius={4} />
                    </BarChart>
                </ChartContainer>
              </div>
              <div className="mt-4 flex-shrink-0 text-center"><Button onClick={generateData}>Simulate New Survey Data</Button></div>
            </div>
        );
    };

    return (
        <>
            <h3 className="text-xl font-bold">Chi-Squared (χ²) Test</h3>
            <p className="mt-2 text-muted-foreground">A versatile test for categorical data to see if observed counts significantly differ from what was expected.</p>
            <Tabs defaultValue="goodness-of-fit" className="mt-4">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="goodness-of-fit">Goodness of Fit</TabsTrigger>
                <TabsTrigger value="independence">Independence</TabsTrigger>
                <TabsTrigger value="homogeneity">Homogeneity</TabsTrigger>
              </TabsList>
              <TabsContent value="goodness-of-fit" className="mt-6">
                <h4 className="text-lg font-semibold">Goodness of Fit</h4>
                <p className="mt-2 text-sm text-muted-foreground">Compares one categorical variable against a theoretical distribution.</p>
                <p className="mt-2 text-xs text-muted-foreground"><span className="font-semibold text-foreground">Example:</span> Are profitable trades uniformly distributed throughout the week?</p>
                <div className="mt-4 rounded-lg bg-background/50 p-4"><GoodnessOfFitChart /></div>
              </TabsContent>
              <TabsContent value="independence" className="mt-6">
                <h4 className="text-lg font-semibold">Test for Independence</h4>
                <p className="mt-2 text-sm text-muted-foreground">Checks for a significant association between two categorical variables in one population.</p>
                <p className="mt-2 text-xs text-muted-foreground"><span className="font-semibold text-foreground">Example:</span> Is there a relationship between `Strategy Type` and `Market Condition`?</p>
                <div className="mt-4 rounded-lg bg-background/50 p-4"><TestForIndependenceChart /></div>
              </TabsContent>
              <TabsContent value="homogeneity" className="mt-6">
                <h4 className="text-lg font-semibold">Test for Homogeneity</h4>
                <p className="mt-2 text-sm text-muted-foreground">Checks if the distribution of one categorical variable is the same across multiple different populations.</p>
                <p className="mt-2 text-xs text-muted-foreground"><span className="font-semibold text-foreground">Example:</span> Do traders in New York and London prefer the same asset classes?</p>
                <div className="mt-4 rounded-lg bg-background/50 p-4"><TestForHomogeneityChart /></div>
              </TabsContent>
            </Tabs>
        </>
    );
};

// --- Pearson Correlation ---
const PearsonCorrelationContent = () => {
    const pearsonCorrelationChartConfig = { data: { label: 'Data', color: 'hsl(var(--chart-1))' }} satisfies ChartConfig;
    const PearsonCorrelationChart = () => {
      const [correlation, setCorrelation] = useState(0.8);
      const [chartData, setChartData] = useState<any[]>([]);
      useEffect(() => { setChartData(generateCorrelatedData(100, correlation)); }, [correlation]);
      return (
        <div className="flex h-[420px] w-full flex-col">
          <div className="relative mx-auto flex-grow w-full max-w-2xl">
            <ChartContainer config={pearsonCorrelationChartConfig} className="h-full w-full">
              <ScatterChart accessibilityLayer margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <CartesianGrid />
                <XAxis type="number" dataKey="x" name="Asset A" unit="%" />
                <YAxis type="number" dataKey="y" name="Asset B" unit="%" />
                <Tooltip cursor={{ strokeDasharray: '3 3' }} content={<ChartTooltipContent indicator="dot" />} />
                <Scatter data={chartData} fill="var(--color-data)" />
              </ScatterChart>
            </ChartContainer>
          </div>
          <div className="mx-auto max-w-sm flex-shrink-0 text-center">
            <div className="py-4">
              <Label htmlFor="correlation-slider">Adjust Correlation Coefficient</Label>
              <Slider id="correlation-slider" min={-1} max={1} value={[correlation]} step={0.1} onValueChange={(value) => setCorrelation(value[0])} className="my-4" />
            </div>
            <p>Current Correlation: {correlation.toFixed(1)}</p>
          </div>
        </div>
      );
    };
    return (
        <>
            <h3 className="text-xl font-bold">Pearson Correlation</h3>
            <p className="mt-2 text-muted-foreground">Measures the linear relationship between two continuous variables. A cornerstone of portfolio diversification and pairs trading.</p>
            <p className="mt-2 text-xs text-muted-foreground"><span className="font-semibold text-foreground">Example:</span> We plot the daily returns of two assets. Adjusting the slider shows how the scatter plot changes with the underlying correlation.</p>
            <div className="mt-4 rounded-lg bg-background/50 p-4"><PearsonCorrelationChart /></div>
        </>
    );
};

// --- Mann-Whitney U ---
const MannWhitneyUContent = () => {
    const mannWhitneyChartConfig = { 'Algo_A': { label: 'Algo A', color: 'hsl(var(--chart-1))' }, 'Algo_B': { label: 'Algo B', color: 'hsl(var(--chart-2))' }} satisfies ChartConfig;
    const MannWhitneyChart = () => {
      const [chartData, setChartData] = useState<any[]>([]);
      const generateData = () => {
        const algoAData = generateLogNormalData(0, 0.5, 500); 
        const algoBData = generateLogNormalData(0.2, 0.7, 500);
        const combinedData = [...algoAData, ...algoBData];
        const min = Math.min(...combinedData);
        const max = Math.max(...combinedData);
        const binSize = (max - min) / 20;
        const histA = createHistogram(algoAData, binSize, min, max);
        const histB = createHistogram(algoBData, binSize, min, max);
        const finalData = histA.labels.map((label, index) => ({ name: label.toFixed(2), 'Algo_A': histA.counts[index], 'Algo_B': histB.counts[index] }));
        setChartData(finalData);
      };
      useEffect(() => { generateData(); }, []);
      return (
        <div className="flex h-[420px] w-full flex-col">
          <div className="relative mx-auto flex-grow w-full">
            <ChartContainer config={mannWhitneyChartConfig} className="h-full w-full">
              <BarChart accessibilityLayer data={chartData} barCategoryGap="0%" margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="name" tickLine={false} tickMargin={10} axisLine={false} />
                <YAxis />
                <Tooltip content={<ChartTooltipContent />} wrapperStyle={{ zIndex: 1000 }} />
                <Legend formatter={(value) => mannWhitneyChartConfig[value as keyof typeof mannWhitneyChartConfig]?.label || value} />
                <Bar dataKey="Algo_A" fill="var(--color-Algo_A)" />
                <Bar dataKey="Algo_B" fill="var(--color-Algo_B)" />
              </BarChart>
            </ChartContainer>
          </div>
          <div className="mt-4 flex-shrink-0 text-center"><Button onClick={generateData}>Simulate New Trading Data</Button></div>
        </div>
      );
    };
    return (
        <>
            <h3 className="text-xl font-bold">Mann-Whitney U Test</h3>
            <p className="mt-2 text-muted-foreground">The non-parametric version of the T-Test. Use it to compare two independent groups when your data is not normally distributed (e.g., skewed).</p>
            <p className="mt-2 text-xs text-muted-foreground"><span className="font-semibold text-foreground">Example:</span> A firm wants to see if a new trading algorithm ('Algo B') generates different profits than their old one ('Algo A'). The profit data is skewed, so they use this test.</p>
            <div className="mt-4 rounded-lg bg-background/50 p-4"><MannWhitneyChart /></div>
        </>
    );
};

// --- Kruskal-Wallis ---
const KruskalWallisContent = () => {
    const kruskalWallisChartConfig = { value: { label: 'Median Profit' }, 'ML_Bot': { label: 'ML Bot', color: 'hsl(var(--chart-1))' }, 'Rule_Based_Bot': { label: 'Rule-Based Bot', color: 'hsl(var(--chart-2))' }, 'Hybrid_Bot': { label: 'Hybrid Bot', color: 'hsl(var(--chart-3))' }} satisfies ChartConfig;
    const KruskalWallisChart = () => {
      const [chartData, setChartData] = useState<any[]>([]);
      const generateData = () => {
        const dataBotA = generateLogNormalData(0.1, 0.5, 100);
        const dataBotB = generateLogNormalData(0.2, 0.6, 100);
        const dataBotC = generateLogNormalData(0.05, 0.7, 100);
        setChartData([{ name: 'ML_Bot', value: getMedian(dataBotA) }, { name: 'Rule_Based_Bot', value: getMedian(dataBotB) }, { name: 'Hybrid_Bot', value: getMedian(dataBotC) }]);
      };
      useEffect(() => { generateData(); }, []);
      return (
        <div className="flex h-[420px] w-full flex-col">
          <div className="flex-grow">
            <ChartContainer config={kruskalWallisChartConfig} className="h-full w-full">
              <BarChart accessibilityLayer data={chartData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="name" tickLine={false} tickMargin={10} axisLine={false} tickFormatter={(value) => kruskalWallisChartConfig[value as keyof typeof kruskalWallisChartConfig]?.label || value} />
                <YAxis unit="$" />
                <Tooltip content={<ChartTooltipContent indicator="dot" />} />
                <Bar dataKey="value" name="Median Profit" radius={4}>
                  {chartData.map((entry) => (<Cell key={`cell-${entry.name}`} fill={`var(--color-${entry.name})`} />))}
                </Bar>
              </BarChart>
            </ChartContainer>
          </div>
          <div className="mt-4 flex-shrink-0 text-center"><Button onClick={generateData}>Simulate New Data</Button></div>
        </div>
      );
    };
    return (
        <>
            <h3 className="text-xl font-bold">Kruskal-Wallis Test</h3>
            <p className="mt-2 text-muted-foreground">The non-parametric alternative to ANOVA for comparing three or more independent groups when data is not normally distributed.</p>
            <p className="mt-2 text-xs text-muted-foreground"><span className="font-semibold text-foreground">Example:</span> Comparing the profitability of three different trading bots (ML, Rule-Based, Hybrid) where the profit-per-trade data is heavily skewed.</p>
            <div className="mt-4 rounded-lg bg-background/50 p-4"><KruskalWallisChart /></div>
        </>
    );
};

// --- Wilcoxon Signed-Rank ---
const WilcoxonSignedRankContent = () => {
    const wilcoxonChartConfig = { 'Before_Risk_Model': { label: 'Before', color: 'hsl(var(--chart-2))' }, 'After_Risk_Model': { label: 'After', color: 'hsl(var(--chart-1))' }} satisfies ChartConfig;
    const WilcoxonSignedRankChart = () => {
      const [chartData, setChartData] = useState<any[]>([]);
      const generateData = () => {
        const numPortfolios = 10;
        const beforeData = generateLogNormalData(0.5, 0.4, numPortfolios);
        const afterData = beforeData.map((d) => d + (Math.random() * 0.8 - 0.1));
        setChartData(Array.from({length: numPortfolios}, (_, i) => ({ name: `Portfolio ${i+1}`, 'Before_Risk_Model': beforeData[i], 'After_Risk_Model': afterData[i] })));
      };
      useEffect(() => { generateData(); }, []);
      return (
        <div className="flex h-[420px] w-full flex-col">
          <div className="flex-grow">
            <ChartContainer config={wilcoxonChartConfig} className="h-full w-full">
                <LineChart accessibilityLayer data={chartData} margin={{ top: 20, right: 30, bottom: 20, left: 30 }}>
                    <CartesianGrid vertical={false} />
                    <XAxis dataKey="name" tickLine={false} tickMargin={10} axisLine={false} />
                    <YAxis unit="%" />
                    <Tooltip content={<ChartTooltipContent />} />
                    <Legend formatter={(value) => wilcoxonChartConfig[value as keyof typeof wilcoxonChartConfig]?.label || value} />
                    <Line type="monotone" dataKey="Before_Risk_Model" stroke="var(--color-Before_Risk_Model)" />
                    <Line type="monotone" dataKey="After_Risk_Model" stroke="var(--color-After_Risk_Model)" />
                </LineChart>
            </ChartContainer>
          </div>
          <div className="mt-4 flex-shrink-0 text-center"><Button onClick={generateData}>Simulate New Data</Button></div>
        </div>
      );
    };
    return (
        <>
            <h3 className="text-xl font-bold">Wilcoxon Signed-Rank Test</h3>
            <p className="mt-2 text-muted-foreground">The non-parametric alternative to the Paired T-Test, used for 'before and after' analysis on non-normal data.</p>
            <p className="mt-2 text-xs text-muted-foreground"><span className="font-semibold text-foreground">Example:</span> A risk team implements a new model. They record the max drawdown for 10 portfolios before and after the change to see if it led to a significant reduction.</p>
            <div className="mt-4 rounded-lg bg-background/50 p-4"><WilcoxonSignedRankChart /></div>
        </>
    );
};

// --- Spearman's Rank ---
const SpearmanCorrelationContent = () => {
    const spearmanCorrelationChartConfig = { data: { label: 'Data', color: 'hsl(var(--chart-1))' }} satisfies ChartConfig;
    const SpearmanCorrelationChart = () => {
      const [strength, setStrength] = useState(3);
      const [chartData, setChartData] = useState<any[]>([]);
      useEffect(() => { setChartData(generateMonotonicData(100, strength)); }, [strength]);
      return (
        <div className="flex h-[420px] w-full flex-col">
          <div className="relative mx-auto flex-grow w-full max-w-2xl">
            <ChartContainer config={spearmanCorrelationChartConfig} className="h-full w-full">
              <ScatterChart accessibilityLayer margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <CartesianGrid />
                <XAxis type="number" dataKey="x" name="Sentiment" />
                <YAxis type="number" dataKey="y" name="Return" unit="%" />
                <Tooltip cursor={{ strokeDasharray: '3 3' }} content={<ChartTooltipContent indicator="dot" />} />
                <Scatter data={chartData} fill="var(--color-data)" />
              </ScatterChart>
            </ChartContainer>
          </div>
          <div className="mx-auto max-w-sm flex-shrink-0 text-center">
            <div className="py-4">
              <Label htmlFor="strength-slider">Adjust Relationship Strength</Label>
              <Slider id="strength-slider" min={1} max={10} value={[strength]} step={0.5} onValueChange={(value) => setStrength(value[0])} className="my-4" />
            </div>
            <p>Current Strength: {strength.toFixed(1)}</p>
          </div>
        </div>
      );
    };
    return (
        <>
            <h3 className="text-xl font-bold">Spearman's Rank Correlation</h3>
            <p className="mt-2 text-muted-foreground">Measures the strength of a monotonic relationship (does one variable consistently go up as the other goes up, even if not linearly?).</p>
            <p className="mt-2 text-xs text-muted-foreground"><span className="font-semibold text-foreground">Example:</span> Analyzing the relationship between a custom 'Market Sentiment Score' and a stock's daily return, where the return might increase faster as sentiment gets very high.</p>
            <div className="mt-4 rounded-lg bg-background/50 p-4"><SpearmanCorrelationChart /></div>
        </>
    );
};

// --- Friedman Test ---
const FriedmanTestContent = () => {
    const friedmanTestChartConfig = { 'Algo_A': { label: 'Algo A', color: 'hsl(var(--chart-1))' }, 'Algo_B': { label: 'Algo B', color: 'hsl(var(--chart-2))' }, 'Algo_C': { label: 'Algo C', color: 'hsl(var(--chart-3))' }, 'Algo_D': { label: 'Algo D', color: 'hsl(var(--chart-4))' }, 'Algo_E': { label: 'Algo E', color: 'hsl(var(--chart-5))' }} satisfies ChartConfig
    const FriedmanTestChart = () => {
      const [chartData, setChartData] = useState<any[]>([]);
      const generateData = () => {
        const numAlgos = 5;
        const algoRanks = generateRankData(numAlgos);
        const regimes = ['Low Volatility', 'Medium Volatility', 'High Volatility'];
        const processedData = regimes.map((regime, i) => ({ name: regime, 'Algo_A': algoRanks[0][i], 'Algo_B': algoRanks[1][i], 'Algo_C': algoRanks[2][i], 'Algo_D': algoRanks[3][i], 'Algo_E': algoRanks[4][i] }));
        setChartData(processedData);
      };
      useEffect(() => { generateData(); }, []);
      return (
        <div className="flex h-[420px] w-full flex-col">
          <div className="flex-grow">
            <ChartContainer config={friedmanTestChartConfig} className="h-full w-full">
                <LineChart accessibilityLayer data={chartData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                    <CartesianGrid vertical={false} />
                    <XAxis dataKey="name" tickLine={false} tickMargin={10} axisLine={false} />
                    <YAxis reversed domain={[1, 5]} tickCount={5} />
                    <Tooltip content={<ChartTooltipContent />} />
                    <Legend formatter={(value) => friedmanTestChartConfig[value as keyof typeof friedmanTestChartConfig]?.label || value} />
                    <Line type="monotone" dataKey="Algo_A" stroke="var(--color-Algo_A)" />
                    <Line type="monotone" dataKey="Algo_B" stroke="var(--color-Algo_B)" />
                    <Line type="monotone" dataKey="Algo_C" stroke="var(--color-Algo_C)" />
                    <Line type="monotone" dataKey="Algo_D" stroke="var(--color-Algo_D)" />
                    <Line type="monotone" dataKey="Algo_E" stroke="var(--color-Algo_E)" />
                </LineChart>
            </ChartContainer>
          </div>
          <div className="mt-4 flex-shrink-0 text-center"><Button onClick={generateData}>Simulate New Data</Button></div>
        </div>
      );
    };
    return (
        <>
            <h3 className="text-xl font-bold">Friedman Test</h3>
            <p className="mt-2 text-muted-foreground">The non-parametric alternative to Repeated Measures ANOVA for comparing three or more related groups.</p>
            <p className="mt-2 text-xs text-muted-foreground"><span className="font-semibold text-foreground">Example:</span> A quant team compares the performance ranks of five algorithms across three different market volatility regimes (Low, Medium, High).</p>
            <div className="mt-4 rounded-lg bg-background/50 p-4"><FriedmanTestChart /></div>
        </>
    );
};

// --- K-S Test ---
const KSTestContent = () => {
    const ksTestChartConfig = { empirical: { label: 'Empirical CDF', color: 'hsl(var(--chart-1))' }, theoretical: { label: 'Theoretical CDF', color: 'hsl(var(--chart-2))' }} satisfies ChartConfig;
    const KSTestChart = () => {
      const [chartData, setChartData] = useState<any[]>([]);
      const [dataType, setDataType] = useState<'normal' | 'uniform'>('normal');
      const generateAndSetData = (type: 'normal' | 'uniform') => {
        const n = 100;
        const mean = 0;
        const stdDev = 1;
        let sampleData: number[];
        if (type === 'normal') { sampleData = generateNormalData(mean, stdDev, n); } else { sampleData = generateUniformData(-3, 3, n); }
        const sortedSample = [...sampleData].sort((a,b) => a - b);
        const ecdfPoints = sortedSample.map((val, i) => ({ x: val, empirical: (i+1)/n }));
        const cdfPoints = sortedSample.map(val => ({ x: val, theoretical: standardNormalCdf((val - mean) / stdDev) }));
        const mergedData = ecdfPoints.map((point, i) => ({ ...point, theoretical: cdfPoints[i].theoretical }));
        setChartData(mergedData);
      };
      useEffect(() => { generateAndSetData(dataType); }, [dataType]);
      return (
        <div className="flex h-[420px] w-full flex-col">
          <div className="flex-grow">
            <ChartContainer config={ksTestChartConfig} className="h-full w-full">
                <LineChart accessibilityLayer data={chartData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                    <CartesianGrid vertical={false} />
                    <XAxis type="number" dataKey="x" name="Value" domain={['dataMin', 'dataMax']} tickLine={false} tickMargin={10} axisLine={false} />
                    <YAxis domain={[0,1]} />
                    <Tooltip content={<ChartTooltipContent />} />
                    <Legend />
                    <Line type="step" dataKey="empirical" stroke="var(--color-empirical)" dot={false} strokeWidth={2}/>
                    <Line type="monotone" dataKey="theoretical" stroke="var(--color-theoretical)" dot={false} strokeWidth={2} />
                </LineChart>
            </ChartContainer>
          </div>
          <div className="mt-4 flex flex-shrink-0 justify-center gap-4">
            <Button onClick={() => setDataType('normal')} variant={dataType === 'normal' ? 'default' : 'outline'}>Generate Normal Sample</Button>
            <Button onClick={() => setDataType('uniform')} variant={dataType === 'uniform' ? 'default' : 'outline'}>Generate Uniform Sample</Button>
          </div>
          <p className="pt-4 text-center text-sm text-muted-foreground">The K-S statistic is the maximum vertical distance between the two curves.</p>
        </div>
      );
    };
    return (
        <>
            <h3 className="text-xl font-bold">Kolmogorov-Smirnov (K-S) Test</h3>
            <p className="mt-2 text-muted-foreground">A test to determine if your data follows a specific distribution (e.g., normal distribution).</p>
            <p className="mt-2 text-xs text-muted-foreground"><span className="font-semibold text-foreground">Example:</span> Before using a parametric test, you check if your sample data is normally distributed by comparing its empirical CDF to a theoretical normal CDF.</p>
            <div className="mt-4 rounded-lg bg-background/50 p-4"><KSTestChart /></div>
        </>
    );
};


const tests = [
    { id: 't-test', title: 'T-Test', Component: TTestContent },
    { id: 'z-test', title: 'Z-Test', Component: ZTestContent },
    { id: 'anova', title: 'ANOVA', Component: AnovaContent },
    { id: 'f-test', title: 'F-Test', Component: FTestContent },
    { id: 'chi-squared', title: 'Chi-Squared', Component: ChiSquaredTestContent },
    { id: 'pearson', title: 'Pearson Correlation', Component: PearsonCorrelationContent },
    { id: 'mann-whitney', title: 'Mann-Whitney U', Component: MannWhitneyUContent },
    { id: 'kruskal-wallis', title: 'Kruskal-Wallis', Component: KruskalWallisContent },
    { id: 'wilcoxon', title: 'Wilcoxon Signed-Rank', Component: WilcoxonSignedRankContent },
    { id: 'spearman', title: "Spearman's Rank", Component: SpearmanCorrelationContent },
    { id: 'friedman', title: 'Friedman Test', Component: FriedmanTestContent },
    { id: 'ks-test', title: 'K-S Test', Component: KSTestContent },
];

export default function ConsolidatedStatisticsPage() {
  return (
    <>
      <PageHeader
        title="Interactive Statistical Tests"
        description="The detective work of data science. Explore the core statistical tests used in quantitative analysis. Each tab provides an interactive example to help you build intuition."
        variant="aligned-left"
      />
       <Card>
          <CardHeader>
            <CardTitle className="font-headline">The Core Idea: What is Hypothesis Testing?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-base leading-relaxed text-foreground/90">
            <p>
              Think of hypothesis testing as being a data detective. You start with a default assumption, the <strong>Null Hypothesis (H₀)</strong>, which states there is no effect or no difference (e.g., "a new drug has no effect"). Then, you gather evidence (your sample data) to see if you have enough proof to reject that default assumption in favor of an alternative, the <strong>Alternative Hypothesis (H₁)</strong> (e.g., "the new drug has an effect").
            </p>
            <p>
                The <strong>p-value</strong> is the crucial piece of evidence. It's the probability of observing your data (or something even more extreme) if the null hypothesis were actually true. A small p-value (typically &lt; 0.05) suggests that your observed data is very unlikely under the null hypothesis, giving you a reason to reject it.
            </p>
          </CardContent>
        </Card>
      <Card className="mt-8">
        <CardContent className="p-4 md:p-6">
          <Tabs defaultValue="t-test" className="w-full">
            <TabsList className="grid h-auto w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
              {tests.map(test => (
                <TabsTrigger key={test.id} value={test.id} className="text-xs md:text-sm">
                  {test.title}
                </TabsTrigger>
              ))}
            </TabsList>
            {tests.map(test => (
              <TabsContent key={test.id} value={test.id} className="mt-6">
                <test.Component />
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </>
  );
}
