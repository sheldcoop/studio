
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/app/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { ChartTooltipContent } from '@/lib/chart-config';
import { ChartContainer, type ChartConfig, Chart } from '@/components/ui/chart';
import 'katex/dist/katex.min.css';


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

const oneSampleZTestChartConfig = {
  value: {
    label: "Stock A's Recent Avg.",
    color: 'hsl(var(--chart-1))',
  },
} satisfies ChartConfig;

const twoSampleZTestChartConfig = {
  Stock_A: {
    label: 'Stock A',
    color: 'hsl(var(--chart-1))',
  },
  Stock_B: {
    label: 'Stock B',
    color: 'hsl(var(--chart-2))',
  },
} satisfies ChartConfig;

// --- Chart Components ---

const OneSampleZTestChart = () => {
  const [meanValue, setMeanValue] = useState(0.08);
  const target = 0.05;

  const chartData = [{ name: "Stock_A_Recent_Avg", value: meanValue }];

  return (
    <div className="flex h-full min-h-[420px] w-full flex-col">
      <div className="flex-grow">
        <ChartContainer config={oneSampleZTestChartConfig} className="h-full w-full">
          <Chart.BarChart accessibilityLayer data={chartData} layout="vertical" margin={{ top: 20, right: 40, bottom: 20, left: 20 }}>
            <Chart.CartesianGrid horizontal={false} />
            <Chart.YAxis type="category" dataKey="name" tickLine={false} axisLine={false} width={120} tickFormatter={() => "Stock A's Recent Avg."}/>
            <Chart.XAxis type="number" unit="%" domain={[-0.2, 0.3]} />
            <Chart.Tooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Chart.Bar dataKey="value" radius={8} fill="var(--color-value)" />
            <Chart.ReferenceLine
              x={target}
              stroke="hsl(var(--destructive))"
              strokeWidth={2}
              strokeDasharray="3 3"
              label={{
                value: `Historical Avg: ${target}%`,
                position: "insideTopRight",
                fill: "hsl(var(--destructive))",
                fontSize: 12,
              }}
            />
          </Chart.BarChart>
        </ChartContainer>
      </div>
      <div className="mx-auto max-w-sm flex-shrink-0 text-center">
        <div className="py-4">
          <Label htmlFor="mean-slider">
            Adjust Stock A&apos;s Recent Avg. Daily Return (%)
          </Label>
          <Slider
            id="mean-slider"
            min={-0.1}
            max={0.2}
            value={[meanValue]}
            step={0.005}
            onValueChange={(value: number[]) => setMeanValue(value[0])}
            className="my-4"
          />
        </div>
        <div className="text-sm text-muted-foreground">
          Current Mean:{' '}
          <span className="font-bold text-foreground">
            {meanValue.toFixed(3)}
          </span>{' '}
          %
        </div>
      </div>
    </div>
  );
};

const TwoSampleZTestChart = () => {
  const [chartData, setChartData] = useState<{month: string; Stock_A: number; Stock_B: number}[]>([]);

  const generateData = () => {
    const dataA = generateNormalData(1.8, 0.7, 1260);
    const dataB = generateNormalData(1.6, 0.8, 1260);
    setChartData([
      {
        month: 'Volatility',
        Stock_A: getMean(dataA),
        Stock_B: getMean(dataB),
      },
    ]);
  };

  useEffect(() => {
    generateData();
  }, []);

  return (
    <div className="flex h-full min-h-[420px] w-full flex-col">
      <div className="flex-grow">
        <ChartContainer config={twoSampleZTestChartConfig} className="h-full w-full">
            <Chart.BarChart accessibilityLayer data={chartData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <Chart.CartesianGrid vertical={false} />
                <Chart.XAxis dataKey="month" tickLine={false} tickMargin={10} axisLine={false} />
                <Chart.YAxis unit="%" />
                <Chart.Tooltip content={<ChartTooltipContent indicator='dot' />} />
                <Chart.Legend />
                <Chart.Bar dataKey="Stock_A" radius={4} fill="hsl(var(--chart-1))" />
                <Chart.Bar dataKey="Stock_B" radius={4} fill="hsl(var(--chart-2))" />
            </Chart.BarChart>
        </ChartContainer>
      </div>
      <div className="mt-4 flex-shrink-0 text-center">
        <Button onClick={generateData}>Simulate New 5-Year Period</Button>
      </div>
    </div>
  );
};


export default function ZTestPage() {
  return (
    <>
      <PageHeader
        title="An Interactive Guide to the Z-Test for Trading"
        description="The Z-test is used for comparing means with large samples when population variance is known. This guide explains its types with interactive trading examples."
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
                  A Z-test, like a t-test, checks if differences in means are significant. However, it&apos;s used for large crowds (samples &gt; 30) where you already have a map of the entire population&apos;s variability (known population standard deviation).
                </p>
              </div>
              <div>
                <h3 className="mb-1 font-semibold text-primary">
                  Key Assumptions
                </h3>
                <p className="text-muted-foreground">
                  The main requirements are a{' '}
                  <strong className="text-foreground">
                    large sample size
                  </strong>{' '}
                  (n &gt; 30), approximately{' '}
                   <strong className="text-foreground">
                    normally distributed
                  </strong> data, and critically, a{' '}
                  <strong className="text-foreground">
                    known population standard deviation
                  </strong>. This last point makes it rarer in practice than the t-test.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <Tabs defaultValue="two-sample">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="one-sample">One-Sample</TabsTrigger>
                <TabsTrigger value="two-sample">Two-Sample</TabsTrigger>
              </TabsList>
              <TabsContent value="one-sample" className="mt-6">
                <h3 className="text-xl font-bold">One-Sample Z-Test</h3>
                <p className="mt-2 text-muted-foreground">
                  This test compares the mean of a single, large sample from one timeframe against its known, long-term population average. It&apos;s useful for seeing if a recent change has had a statistically significant effect.
                </p>
                <p className="mt-4 text-sm">
                  <span className="font-semibold text-foreground">
                    Example:
                  </span>{' '}
                  After a major platform update, you analyze the daily returns of &apos;Stock A&apos; for the last 100 trading days. You want to know if its average daily return is now different from its known historical average of 0.05% over the past 10 years (with a population standard deviation of 1.2%).
                </p>
                <div className="mt-4 rounded-lg bg-background/50 p-4">
                  <OneSampleZTestChart />
                </div>
              </TabsContent>
              <TabsContent value="two-sample" className="mt-6">
                <h3 className="text-xl font-bold">Two-Sample Z-Test</h3>
                <p className="mt-2 text-muted-foreground">
                  This test compares the means of two large, independent stocks or assets. It&apos;s used when you have extensive historical data that provides the population standard deviations for both.
                </p>
                <p className="mt-4 text-sm">
                  <span className="font-semibold text-foreground">
                    Example:
                  </span>{' '}
                  A firm compares the average daily volatility of &apos;Stock A&apos; vs. &apos;Stock B&apos; over the past five years (~1260 data points each). With known population standard deviations for both stocks&apos; volatility, they test if there is a significant difference between them.
                </p>
                <div className="mt-4 rounded-lg bg-background/50 p-4">
                  <TwoSampleZTestChart />
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
