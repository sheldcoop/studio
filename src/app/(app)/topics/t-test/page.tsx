
'use client';

import { useState, useEffect } from 'react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  Rectangle,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
} from 'recharts';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/app/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { ChartTooltipContent } from '@/lib/chart-config';
import { ChartContainer, type ChartConfig } from '@/components/ui/chart';

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

const independentTestChartConfig = {
  Momentum: {
    label: 'Momentum',
    color: 'hsl(var(--chart-1))',
  },
  'Mean-Reversion': {
    label: 'Mean-Reversion',
    color: 'hsl(var(--chart-2))',
  },
} satisfies ChartConfig;

const pairedTestChartConfig = {
  before: {
    label: 'Before',
    color: 'hsl(var(--chart-2))',
  },
  after: {
    label: 'After',
    color: 'hsl(var(--chart-1))',
  },
} satisfies ChartConfig;

const oneSampleTestChartConfig = {
  value: {
    label: 'Value',
    color: 'hsl(var(--chart-1))',
  },
} satisfies ChartConfig;

// --- Chart Components ---

const IndependentTestChart = () => {
  const [chartData, setChartData] = useState<any[]>([]);

  const generateData = () => {
    const dataA = generateNormalData(0.08, 0.5, 60);
    const dataB = generateNormalData(0.03, 0.5, 60);
    setChartData([
      { name: 'Momentum', value: getMean(dataA) },
      { name: 'Mean-Reversion', value: getMean(dataB) },
    ]);
  };

  useEffect(() => {
    generateData();
  }, []);

  return (
    <div className="flex h-[420px] w-full flex-col">
      <div className="flex-grow">
        <ChartContainer
          config={independentTestChartConfig}
          className="h-full w-full"
        >
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="name"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <YAxis unit="%" />
            <Tooltip
              cursor={{ fill: 'hsl(var(--muted))' }}
              content={<ChartTooltipContent indicator="dot" />}
            />
            <Bar dataKey="value" radius={8}>
              {chartData.map((entry, index) => (
                <Rectangle key={`cell-${index}`} fill={independentTestChartConfig[entry.name as keyof typeof independentTestChartConfig]?.color} />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
      </div>
      <div className="mt-4 flex-shrink-0 text-center">
        <Button onClick={generateData}>Simulate New 60-Day Period</Button>
      </div>
    </div>
  );
};

const PairedTestChart = () => {
  const [chartData, setChartData] = useState<any[]>([]);

  const generateData = () => {
    const numSubjects = 12;
    const beforeData = Array.from(
      { length: numSubjects },
      () => 0.5 + (Math.random() - 0.5) * 2
    );
    const afterData = beforeData.map((d) => d + (0.1 + Math.random() * 0.5));

    setChartData(
      Array.from({ length: numSubjects }, (_, i) => ({
        name: `Week ${i + 1}`,
        before: beforeData[i],
        after: afterData[i],
      }))
    );
  };

  useEffect(() => {
    generateData();
  }, []);

  return (
    <div className="flex h-[420px] w-full flex-col">
      <div className="flex-grow">
        <ChartContainer
          config={pairedTestChartConfig}
          className="h-full w-full"
        >
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{ top: 20, right: 30, bottom: 20, left: 20 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="name"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <YAxis unit="%" />
            <Tooltip content={<ChartTooltipContent indicator="dot" />} />
            <Line
              type="monotone"
              dataKey="before"
              strokeWidth={2}
              stroke={pairedTestChartConfig.before.color}
            />
            <Line
              type="monotone"
              dataKey="after"
              strokeWidth={2}
              stroke={pairedTestChartConfig.after.color}
            />
          </LineChart>
        </ChartContainer>
      </div>
      <div className="mt-4 flex-shrink-0 text-center">
        <Button onClick={generateData}>Simulate New Data</Button>
      </div>
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
        <ChartContainer
          config={oneSampleTestChartConfig}
          className="h-full w-full"
        >
          <BarChart
            accessibilityLayer
            data={chartData}
            layout="vertical"
            margin={{ top: 20, right: 40, bottom: 20, left: 40 }}
          >
            <CartesianGrid horizontal={false} />
            <YAxis
              type="category"
              dataKey="name"
              tickLine={false}
              axisLine={false}
              width={80}
            />
            <XAxis type="number" unit="%" domain={[0, 3]} />
            <Tooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Bar
              dataKey="value"
              radius={8}
              fill={oneSampleTestChartConfig.value.color}
            />
            <ReferenceLine
              x={target}
              stroke="hsl(var(--destructive))"
              strokeWidth={2}
              strokeDasharray="3 3"
            >
              <Label
                value={`Claimed: ${target}%`}
                position="insideTopRight"
                fill="hsl(var(--destructive))"
                fontSize={12}
              />
            </ReferenceLine>
          </BarChart>
        </ChartContainer>
      </div>
      <div className="mt-4 flex-shrink-0 text-center">
        <div className="mx-auto max-w-sm py-4">
          <Label htmlFor="mean-slider">
            Adjust Sample's Average Monthly Return (%)
          </Label>
          <Slider
            id="mean-slider"
            min={0.5}
            max={2.5}
            value={[meanValue]}
            step={0.05}
            onValueChange={(value) => setMeanValue(value[0])}
            className="my-4"
          />
        </div>
        <div className="text-sm text-muted-foreground">
          Current Mean:{' '}
          <span className="font-bold text-foreground">
            {meanValue.toFixed(2)}
          </span>{' '}
          % vs Claimed{' '}
          <span className="font-bold text-destructive">{target}%</span>
        </div>
      </div>
    </div>
  );
};

export default function TTestPage() {
  return (
    <>
      <PageHeader
        title="An Interactive Guide to the T-Test for Trading"
        description="The t-test is a key tool for comparing average returns and performance. This guide uses interactive trading examples to explain the main types of t-tests and help you understand when to use each one."
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
                  Purpose &amp; Analogy
                </h3>
                <p className="text-muted-foreground">
                  A t-test checks if the difference between two average returns
                  is statistically significant or just due to random market
                  noise. Think of it as a performance verifier: is Strategy A{' '}
                  <span className="italic">truly</span> more profitable than
                  Strategy B, or did it just get lucky in this sample?
                </p>
              </div>
              <div>
                <h3 className="mb-1 font-semibold text-primary">
                  Key Assumption
                </h3>
                <p className="text-muted-foreground">
                  The main requirement for a t-test is that the data (e.g.,
                  daily or monthly returns) should be approximately{' '}
                  <strong className="text-foreground">
                    normally distributed
                  </strong>{' '}
                  (forming a &quot;bell curve&quot;). This is a critical check
                  before relying on the test&apos;s results.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <Tabs defaultValue="independent">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="independent">
                  Independent Samples
                </TabsTrigger>
                <TabsTrigger value="paired">Paired Samples</TabsTrigger>
                <TabsTrigger value="one-sample">One-Sample</TabsTrigger>
              </TabsList>
              <TabsContent value="independent" className="mt-6">
                <h3 className="text-xl font-bold">Independent Samples T-Test</h3>
                <p className="mt-2 text-muted-foreground">
                  This test compares the means of two{' '}
                  <strong>separate, unrelated groups</strong>. In trading, this
                  is perfect for comparing the performance of two different
                  strategies that are traded independently.
                </p>
                <p className="mt-4 text-sm">
                  <span className="font-semibold text-foreground">
                    Example:
                  </span>{' '}
                  Comparing the average daily returns of a Momentum Strategy vs.
                  a Mean-Reversion Strategy over the last 60 days to see if
                  one is significantly more profitable.
                </p>
                <div className="mt-4 rounded-lg bg-background/50 p-4">
                  <IndependentTestChart />
                </div>
              </TabsContent>
              <TabsContent value="paired" className="mt-6">
                <h3 className="text-xl font-bold">Paired Samples T-Test</h3>
                <p className="mt-2 text-muted-foreground">
                  This test is used to compare the means of{' '}
                  <strong>one group, measured twice</strong>. It&apos;s ideal
                  for &quot;before and after&quot; scenarios, like testing if a change
                  to an algorithm improved an existing portfolio&apos;s
                  performance.
                </p>
                <p className="mt-4 text-sm">
                  <span className="font-semibold text-foreground">
                    Example:
                  </span>{' '}
                  Measuring a portfolio's weekly returns for 12 weeks{' '}
                  <i>before</i> adding a new algorithm, and then for 12 weeks{' '}
                  <i>after</i>, to see if the change led to a significant
                  improvement.
                </p>
                <div className="mt-4 rounded-lg bg-background/50 p-4">
                  <PairedTestChart />
                </div>
              </TabsContent>
              <TabsContent value="one-sample" className="mt-6">
                <h3 className="text-xl font-bold">One-Sample T-Test</h3>
                <p className="mt-2 text-muted-foreground">
                  This test compares the mean of a{' '}
                  <strong>single group to a known, fixed number</strong>. In
                  finance, you can use this to check if a fund&apos;s actual
                  performance matches its advertised claims or a specific
                  benchmark.
                </p>
                <p className="mt-4 text-sm">
                  <span className="font-semibold text-foreground">
                    Example:
                  </span>{' '}
                  A hedge fund claims its average monthly return is 1.5%. You
                  test a sample of its returns from the last 24 months to see
                  if the average is statistically different from their 1.5%
                  claim.
                </p>
                <div className="mt-4 rounded-lg bg-background/50 p-4">
                  <OneSampleTestChart />
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
