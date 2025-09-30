
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
import { generateNormalData, getMean, getVariance } from '@/lib/math';

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
const OneWayAnovaChart = ({ chartData }: { chartData: any[] }) => {
  return (
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
  );
};

const TwoWayAnovaChart = ({ chartData }: { chartData: any[] }) => {
    return (
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
    );
};

const RepeatedMeasuresAnovaChart = ({ chartData }: { chartData: any[] }) => {
    return (
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
    );
};

const DynamicOneWayAnovaChart = dynamic(() => Promise.resolve(OneWayAnovaChart), { ssr: false });
const DynamicTwoWayAnovaChart = dynamic(() => Promise.resolve(TwoWayAnovaChart), { ssr: false });
const DynamicRepeatedMeasuresAnovaChart = dynamic(() => Promise.resolve(RepeatedMeasuresAnovaChart), { ssr: false });


export default function AnovaPage() {
  const [activeTab, setActiveTab] = useState("one-way");
  const [oneWayData, setOneWayData] = useState<any[]>([]);
  const [twoWayData, setTwoWayData] = useState<any[]>([]);
  const [repeatedData, setRepeatedData] = useState<any[]>([]);
  const [fStatistic, setFStatistic] = useState<number | null>(null);

  const generateOneWayData = () => {
    const dataAlpha = generateNormalData(1.2, 0.8, 50);
    const dataBeta = generateNormalData(1.5, 0.8, 50);
    const dataGamma = generateNormalData(0.9, 0.8, 50);
    
    setOneWayData([
        { name: 'Algorithm_Alpha', value: getMean(dataAlpha)},
        { name: 'Algorithm_Beta', value: getMean(dataBeta) },
        { name: 'Algorithm_Gamma', value: getMean(dataGamma) },
    ]);

    // Calculate F-Statistic for One-Way ANOVA
    const allData = [...dataAlpha, ...dataBeta, ...dataGamma];
    const grandMean = getMean(allData);
    const n = dataAlpha.length;
    const k = 3; // Number of groups
    
    const ssb = n * (
        Math.pow(getMean(dataAlpha) - grandMean, 2) +
        Math.pow(getMean(dataBeta) - grandMean, 2) +
        Math.pow(getMean(dataGamma) - grandMean, 2)
    );

    const ssw = (n - 1) * (getVariance(dataAlpha) + getVariance(dataBeta) + getVariance(dataGamma));

    const msb = ssb / (k - 1);
    const msw = ssw / (allData.length - k);
    
    setFStatistic(msb / msw);
  };

  const generateTwoWayData = () => {
    const interactionEffect = Math.random() * 2;
    const means = {
        stocksMorning: 0.5 + (Math.random() - 0.5) * 0.2,
        stocksAfternoon: 0.4 + (Math.random() - 0.5) * 0.2,
        cryptoMorning: 0.8 + (Math.random() - 0.5) * 0.3,
        cryptoAfternoon: 0.2 + interactionEffect + (Math.random() - 0.5) * 0.3,
    };

    setTwoWayData([
        { name: 'Morning', stocks: means.stocksMorning, crypto: means.cryptoMorning },
        { name: 'Afternoon', stocks: means.stocksAfternoon, crypto: means.cryptoAfternoon },
    ]);
  };
  
  const generateRepeatedData = () => {
      const startRatio = 0.8 + (Math.random() - 0.5) * 0.4;
      const midRatio = startRatio + (0.2 + Math.random() * 0.3);
      const endRatio = midRatio + (0.1 + Math.random() * 0.4);

      setRepeatedData([
          { name: 'Year 1 (Baseline)', value: startRatio },
          { name: 'Year 2 (+Intl Stocks)', value: midRatio },
          { name: 'Year 3 (+Hedging)', value: endRatio },
      ]);
  };

  useEffect(() => {
    generateOneWayData();
    generateTwoWayData();
    generateRepeatedData();
  }, []);

  const renderChart = () => {
    switch(activeTab) {
      case 'one-way':
        return <DynamicOneWayAnovaChart chartData={oneWayData} />;
      case 'two-way':
        return <DynamicTwoWayAnovaChart chartData={twoWayData} />;
      case 'repeated-measures':
        return <DynamicRepeatedMeasuresAnovaChart chartData={repeatedData} />;
      default:
        return null;
    }
  }

  const handleGenerateData = () => {
     switch(activeTab) {
      case 'one-way':
        generateOneWayData();
        break;
      case 'two-way':
        generateTwoWayData();
        break;
      case 'repeated-measures':
        generateRepeatedData();
        break;
    }
  }
  
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
            <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
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
              </TabsContent>
            </Tabs>
             <div className="mt-4 rounded-lg bg-background/50 p-4 min-h-[420px]">
                {renderChart()}
             </div>
             {activeTab === 'one-way' && fStatistic !== null && (
                 <div className="mt-4 grid grid-cols-1 gap-4 text-center">
                     <Card>
                        <CardHeader className="pb-1"><CardTitle className="text-sm">F-Statistic</CardTitle></CardHeader>
                        <CardContent><p className="font-mono text-xl font-bold text-primary">{fStatistic.toFixed(3)}</p></CardContent>
                     </Card>
                     <p className="text-xs text-muted-foreground">A higher F-statistic suggests a greater difference between group means. Compare this value to a critical F-value from a distribution table to get a p-value.</p>
                </div>
             )}
             {activeTab === 'two-way' && (
                 <p className="pt-4 text-center text-sm text-muted-foreground">Non-parallel lines in the chart suggest a possible interaction effect between the two factors.</p>
             )}
             <div className="mt-4 flex-shrink-0 text-center">
                <Button onClick={handleGenerateData}>Simulate New Data</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
