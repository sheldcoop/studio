
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
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { getChartJsConfig } from '@/lib/chart-config';

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

const IndependentTestChart = () => {
  const [chartData, setChartData] = useState<any>(null);
  const chartConfig = getChartJsConfig();

  const generateData = () => {
    const dataA = generateNormalData(0.08, 0.5, 60);
    const dataB = generateNormalData(0.03, 0.5, 60);
    setChartData({
      labels: ['Momentum Strategy', 'Mean-Reversion Strategy'],
      datasets: [
        {
          label: 'Average Daily Return',
          data: [getMean(dataA), getMean(dataB)],
          backgroundColor: ['hsl(var(--chart-1))', 'hsl(var(--chart-2))'],
          borderWidth: 1,
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
      y: { ...chartConfig.scales.y, beginAtZero: true, suggestedMin: -0.5, suggestedMax: 0.5, title: {...chartConfig.scales.y.title, text: 'Average Daily Return (%)'} },
      x: { ...chartConfig.scales.x, grid: { display: false } },
    },
    plugins: {
      ...chartConfig.plugins,
      legend: { display: false },
      title: { ...chartConfig.plugins.title, text: 'Comparing Average Daily Returns of Two Strategies' },
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
        <Button onClick={generateData}>Simulate New 60-Day Period</Button>
      </div>
    </div>
  );
};

const PairedTestChart = () => {
  const [chartData, setChartData] = useState<any>(null);
  const chartConfig = getChartJsConfig();

  const generateData = () => {
    const numSubjects = 12;
    const beforeData = Array.from(
      { length: numSubjects },
      () => 0.5 + (Math.random() - 0.5) * 2
    );
    const afterData = beforeData.map((d) => d + (0.1 + Math.random() * 0.5));
    setChartData({
      labels: Array.from({ length: numSubjects }, (_, i) => `Week ${i + 1}`),
      datasets: [
        {
          label: 'Before Algorithm',
          data: beforeData,
          borderColor: 'hsl(var(--muted-foreground))',
          backgroundColor: 'hsl(var(--muted-foreground))',
          tension: 0.1,
        },
        {
          label: 'After Algorithm',
          data: afterData,
          borderColor: 'hsl(var(--primary))',
          backgroundColor: 'hsl(var(--primary))',
          tension: 0.1,
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
      ...chartConfig.scales,
      y: { ...chartConfig.scales.y, title: { ...chartConfig.scales.y.title, text: 'Weekly Return (%)' } },
    },
    plugins: {
      ...chartConfig.plugins,
      legend: { ...chartConfig.plugins.legend, position: 'top' as const },
      title: { ...chartConfig.plugins.title, text: 'Portfolio Returns Before and After Algorithm Change' },
    },
  };

  return (
    <div className="space-y-4">
      {chartData && (
        <div className="h-[350px]">
          <Line data={chartData} options={options}/>
        </div>
      )}
      <div className="text-center">
        <Button onClick={generateData}>Simulate New Data</Button>
      </div>
    </div>
  );
};

const OneSampleTestChart = () => {
  const [meanValue, setMeanValue] = useState(1.7);
  const chartConfig = getChartJsConfig();
  const target = 1.5;

  const chartData = {
    labels: ['Avg. Monthly Return'],
    datasets: [
      {
        label: 'Sample Mean',
        data: [meanValue],
        backgroundColor: 'hsl(var(--primary) / 0.8)',
        borderColor: 'hsl(var(--primary))',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    ...chartConfig,
    indexAxis: 'y' as const,
    scales: {
      x: { ...chartConfig.scales.x, beginAtZero: false, suggestedMin: 0, suggestedMax: 3, title: {...chartConfig.scales.x.title, text: 'Monthly Return (%)'}},
      y: { ...chartConfig.scales.y, grid: { display: false } },
    },
    plugins: {
      ...chartConfig.plugins,
      legend: { display: false },
      title: { ...chartConfig.plugins.title, text: "Comparing Fund Returns to its Claim" },
    },
  };

  const annotationPlugin = {
    id: 'customAnnotationLine',
    afterDraw(chart: ChartJS) {
      const ctx = chart.ctx;
      const xScale = chart.scales.x;
      const topY = chart.chartArea.top;
      const bottomY = chart.chartArea.bottom;
      const x = xScale.getPixelForValue(target);

      // Line
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(x, topY);
      ctx.lineTo(x, bottomY);
      ctx.lineWidth = 2;
      ctx.strokeStyle = 'hsl(var(--destructive))';
      ctx.stroke();

      // Label
      const labelText = `Claimed: ${target}%`;
      ctx.font = 'bold 12px sans-serif';
      const textWidth = ctx.measureText(labelText).width;

      ctx.fillStyle = 'hsl(var(--destructive))';
      ctx.fillRect(x - textWidth / 2 - 5, topY, textWidth + 10, 20);

      ctx.fillStyle = 'hsl(var(--destructive-foreground))';
      ctx.textAlign = 'center';
      ctx.fillText(labelText, x, topY + 14);
      ctx.restore();
    },
  };

  return (
    <div className="space-y-4">
      <div className="h-[350px]">
        <Bar data={chartData} options={options} plugins={[annotationPlugin]} />
      </div>
      <div className="mx-auto max-w-sm text-center">
        <Label htmlFor="mean-slider">
          Adjust Sample&apos;s Average Monthly Return (%)
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
        <div className="text-sm text-muted-foreground">
          Current Mean:{' '}
          <span className="font-bold text-foreground">
            {meanValue.toFixed(2)}
          </span>{' '}
          %
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
                  Purpose & Analogy
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
