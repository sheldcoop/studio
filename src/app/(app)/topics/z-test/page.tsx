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
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
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

const OneSampleZTestChart = () => {
  const [meanValue, setMeanValue] = useState(0.08);
  const target = 0.05;

  const chartData = {
    labels: ["Stock A's Recent Avg."],
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
    indexAxis: 'y' as const,
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        beginAtZero: false,
        suggestedMin: -0.2,
        suggestedMax: 0.3,
        title: {
          display: true,
          text: 'Average Daily Return (%)',
          color: 'hsl(var(--muted-foreground))',
        },
        ticks: { color: 'hsl(var(--muted-foreground))' },
        grid: { color: 'hsl(var(--border) / 0.5)' },
      },
      y: {
        ticks: { color: 'hsl(var(--muted-foreground))' },
        grid: { display: false },
      },
    },
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: "Comparing Stock A's Recent Return to Historical Average",
        color: 'hsl(var(--foreground))',
        font: { size: 16 },
      },
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

      ctx.save();
      ctx.beginPath();
      ctx.moveTo(x, topY);
      ctx.lineTo(x, bottomY);
      ctx.lineWidth = 2;
      ctx.strokeStyle = 'hsl(var(--destructive))';
      ctx.stroke();

      const labelText = `Historical Avg: ${target}%`;
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
          Adjust Stock A&apos;s Recent Avg. Daily Return (%)
        </Label>
        <Slider
          id="mean-slider"
          min={-0.1}
          max={0.2}
          value={[meanValue]}
          step={0.005}
          onValueChange={(value) => setMeanValue(value[0])}
          className="my-4"
        />
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
  const [chartData, setChartData] = useState<any>(null);

  const generateData = () => {
    const dataA = generateNormalData(1.8, 0.7, 1260);
    const dataB = generateNormalData(1.6, 0.8, 1260);
    setChartData({
      labels: ['Stock A', 'Stock B'],
      datasets: [
        {
          label: 'Average Daily Volatility',
          data: [getMean(dataA), getMean(dataB)],
          backgroundColor: ['hsl(var(--chart-1))', 'hsl(var(--chart-2))'],
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
                  suggestedMin: 0,
                  suggestedMax: 3,
                  title: {
                    display: true,
                    text: 'Average Daily Volatility (%)',
                    color: 'hsl(var(--muted-foreground))',
                  },
                  ticks: { color: 'hsl(var(--muted-foreground))' },
                  grid: { color: 'hsl(var(--border) / 0.5)' },
                },
                x: {
                  ticks: { color: 'hsl(var(--muted-foreground))' },
                  grid: { display: false },
                },
              },
              plugins: {
                legend: { display: false },
                title: {
                  display: true,
                  text: 'Comparing Average Daily Volatility of Two Stocks',
                  color: 'hsl(var(--foreground))',
                  font: { size: 16 },
                },
              },
            }}
          />
        </div>
      )}
      <div className="text-center">
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
                  A Z-test, like a t-test, checks if differences in means are significant. However, it's used for large crowds (samples > 30) where you already have a map of the entire population's variability (known population standard deviation).
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
                  </strong> (n > 30), approximately{' '}
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
            <Tabs defaultValue="one-sample">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="one-sample">One-Sample</TabsTrigger>
                <TabsTrigger value="two-sample">Two-Sample</TabsTrigger>
              </TabsList>
              <TabsContent value="one-sample" className="mt-6">
                <h3 className="text-xl font-bold">One-Sample Z-Test</h3>
                <p className="mt-2 text-muted-foreground">
                  This test compares the mean of a single, large sample from one timeframe against its known, long-term population average. It's useful for seeing if a recent change has had a statistically significant effect.
                </p>
                <p className="mt-4 text-sm">
                  <span className="font-semibold text-foreground">
                    Example:
                  </span>{' '}
                  After a major platform update, you analyze the daily returns of 'Stock A' for the last 100 trading days. You want to know if its average daily return is now different from its known historical average of 0.05% over the past 10 years (with a population standard deviation of 1.2%).
                </p>
                <div className="mt-4 rounded-lg bg-background/50 p-4">
                  <OneSampleZTestChart />
                </div>
              </TabsContent>
              <TabsContent value="two-sample" className="mt-6">
                <h3 className="text-xl font-bold">Two-Sample Z-Test</h3>
                <p className="mt-2 text-muted-foreground">
                  This test compares the means of two large, independent stocks or assets. It's used when you have extensive historical data that provides the population standard deviations for both.
                </p>
                <p className="mt-4 text-sm">
                  <span className="font-semibold text-foreground">
                    Example:
                  </span>{' '}
                  A firm compares the average daily volatility of 'Stock A' vs. 'Stock B' over the past five years (~1260 data points each). With known population standard deviations for both stocks' volatility, they test if there is a significant difference between them.
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
