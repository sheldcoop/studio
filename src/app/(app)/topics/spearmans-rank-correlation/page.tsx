
'use client';

import { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Scatter } from 'react-chartjs-2';
import { PageHeader } from '@/components/app/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { getChartJsConfig, chartColors } from '@/lib/chart-config';

ChartJS.register(LinearScale, PointElement, Tooltip, Legend);

// Helper function to generate data with a monotonic (but not necessarily linear) relationship
const generateMonotonicData = (n: number, strength: number) => {
  const data = [];
  for (let i = 0; i < n; i++) {
    const x = Math.random() * 100;
    // Create a non-linear relationship (e.g., quadratic) and add noise
    const noise = (Math.random() - 0.5) * (50 / strength);
    const y = Math.pow(x / 10, 2) + noise;
    data.push({ x, y });
  }
  return data;
};

const chartConfig = getChartJsConfig();

const SpearmanCorrelationChart = () => {
  const [strength, setStrength] = useState(3);
  const [chartData, setChartData] = useState<any>(null);

  useEffect(() => {
    const data = generateMonotonicData(100, strength);
    setChartData({
      datasets: [
        {
          label: 'Asset Pair',
          data: data,
          backgroundColor: `${chartColors.chart1}B3`, // Use chart color with 70% opacity
        },
      ],
    });
  }, [strength]);

  const options = {
    ...chartConfig,
    scales: {
      x: {
        ...chartConfig.scales.x,
        title: { ...chartConfig.scales.x.title, text: 'Market Sentiment Score' },
      },
      y: {
        ...chartConfig.scales.y,
        title: { ...chartConfig.scales.y.title, text: 'Asset Return (%)' },
      },
    },
    plugins: {
      ...chartConfig.plugins,
      legend: { display: false },
      title: {
        ...chartConfig.plugins.title,
        text: `Monotonic Relationship (Strength: ${strength.toFixed(1)})`,
      },
    },
  };

  return (
    <div className="space-y-4">
      {chartData && (
        <div className="relative mx-auto h-[350px] w-full max-w-2xl">
          <Scatter data={chartData} options={options} />
        </div>
      )}
      <div className="mx-auto max-w-sm text-center">
        <Label htmlFor="strength-slider">Adjust Relationship Strength</Label>
        <Slider
          id="strength-slider"
          min={1}
          max={10}
          value={[strength]}
          step={0.5}
          onValueChange={(value) => setStrength(value[0])}
          className="my-4"
        />
      </div>
    </div>
  );
};

export default function SpearmansRankCorrelationPage() {
  return (
    <>
      <PageHeader
        title="Interactive Guide to Spearman's Rank Correlation"
        description="Measure the strength of a monotonic relationship between two variables, even when it's not linear."
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
                  Spearman's correlation is Pearson's flexible cousin. Instead of checking for a straight-line relationship, it checks for a **monotonic** one—does one variable consistently increase or decrease as the other does, even if not at a constant rate? It works by converting values to ranks first.
                </p>
              </div>
              <div>
                <h3 className="mb-1 font-semibold text-primary">
                  When to Use It
                </h3>
                <p className="text-muted-foreground">
                  Use Spearman's when the relationship between your variables is not linear, or when your data has significant outliers that would skew a Pearson correlation. It's perfect for capturing relationships that "level off" or accelerate.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Visualizing Monotonic Relationships</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-muted-foreground">
              A scatter plot can reveal relationships that aren't linear. Spearman's can detect a strong relationship even if the points form a curve.
            </p>
            <p className="text-sm text-muted-foreground mb-4">
              <span className="font-semibold text-foreground">Example:</span> Let's say we're analyzing the relationship between a custom 'Market Sentiment Score' and a stock's daily return. The return might increase faster as sentiment gets very high. A linear model (Pearson) would miss this, but Spearman's would capture the strong monotonic trend.
            </p>
            <div className="mt-4 rounded-lg bg-background/50 p-4">
              <SpearmanCorrelationChart />
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
