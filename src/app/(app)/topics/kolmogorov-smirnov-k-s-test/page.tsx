'use client';

import { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/app/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getChartJsConfig, chartColors } from '@/lib/chart-config';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// --- Math Helpers ---

// Standard normal cumulative distribution function (CDF)
const standardNormalCdf = (x: number) => {
  const t = 1 / (1 + 0.2316419 * Math.abs(x));
  const d = 0.3989423 * Math.exp(-x * x / 2);
  let prob = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
  if (x > 0) prob = 1 - prob;
  return prob;
};

// Generate normally distributed data
const generateNormalData = (mean: number, stdDev: number, n: number) =>
  Array.from({ length: n }, () => mean + stdDev * (Math.random() * 2 - 1 + (Math.random() * 2 - 1) + (Math.random() * 2 - 1)));

// Generate uniformly distributed data
const generateUniformData = (min: number, max: number, n: number) =>
  Array.from({ length: n }, () => min + Math.random() * (max - min));


// Calculate Empirical CDF
const getEcdf = (data: number[]) => {
  const sortedData = [...data].sort((a, b) => a - b);
  const n = sortedData.length;
  return sortedData.map((value, index) => ({ x: value, y: (index + 1) / n }));
};

const KSTestChart = () => {
  const [chartData, setChartData] = useState<any>(null);
  const [dataType, setDataType] = useState<'normal' | 'uniform'>('normal');
  const chartConfig = getChartJsConfig();

  const generateAndSetData = (type: 'normal' | 'uniform') => {
    const n = 100;
    const mean = 0;
    const stdDev = 1;

    let sampleData: number[];
    if (type === 'normal') {
      sampleData = generateNormalData(mean, stdDev, n);
    } else {
      sampleData = generateUniformData(-3, 3, n);
    }

    const ecdf = getEcdf(sampleData);
    const sortedUniqueData = [...new Set(sampleData)].sort((a,b) => a-b);
    
    const theoreticalCdf = sortedUniqueData.map(x => ({
      x: x,
      y: standardNormalCdf((x - mean) / stdDev)
    }));

    setChartData({
      datasets: [
        {
          label: 'Empirical CDF (Sample)',
          data: ecdf,
          borderColor: chartColors.chart1,
          backgroundColor: `${chartColors.chart1}33`, // with opacity
          tension: 0.1,
          showLine: true,
          pointRadius: 2,
        },
        {
          label: 'Theoretical CDF (Normal)',
          data: theoreticalCdf,
          borderColor: chartColors.chart2,
          backgroundColor: `${chartColors.chart2}33`,
          tension: 0.4,
          showLine: true,
          pointRadius: 0,
        },
      ],
    });
  };

  useEffect(() => {
    generateAndSetData(dataType);
  }, [dataType]);

  const options = {
    ...chartConfig,
    scales: {
      y: { ...chartConfig.scales.y, min: 0, max: 1, title: { ...chartConfig.scales.y.title, text: 'Cumulative Probability' } },
      x: { ...chartConfig.scales.x, type: 'linear' as const, title: { ...chartConfig.scales.x.title, text: 'Value' } }
    },
    plugins: {
      ...chartConfig.plugins,
      legend: { ...chartConfig.plugins.legend, position: 'top' as const },
      title: { ...chartConfig.plugins.title, text: `ECDF of ${dataType} data vs Normal CDF` },
    },
  };

  return (
    <div className="space-y-4">
      {chartData && (
        <div className="h-[350px]">
          <Line data={chartData} options={options} />
        </div>
      )}
      <div className="flex justify-center gap-4">
        <Button onClick={() => setDataType('normal')} variant={dataType === 'normal' ? 'default' : 'outline'}>Generate Normal Sample</Button>
        <Button onClick={() => setDataType('uniform')} variant={dataType === 'uniform' ? 'default' : 'outline'}>Generate Uniform Sample</Button>
      </div>
      <p className="text-center text-sm text-muted-foreground">The K-S statistic is the maximum vertical distance between the two curves.</p>
    </div>
  );
};


export default function KolmogorovSmirnovTestPage() {
  return (
    <>
      <PageHeader
        title="Interactive Guide to the Kolmogorov-Smirnov (K-S) Test"
        description="A powerful test to determine if your data follows a specific distribution, like the normal distribution."
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
                  The K-S test acts like a "goodness-of-fit" ruler. It measures the maximum distance between the shape of your sample data (the Empirical CDF) and the shape of a theoretical distribution (the Theoretical CDF). If the distance is too large, you conclude your data doesn't fit that theoretical shape.
                </p>
              </div>
              <div>
                <h3 className="mb-1 font-semibold text-primary">
                  When to Use It
                </h3>
                <p className="text-muted-foreground">
                  The most common use is to test for **normality**. Before you use a parametric test like a T-Test or ANOVA, you should check if your data is normally distributed. The K-S test is a formal way to do this. It can also be used to check if two different samples come from the same distribution.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Visualizing Goodness-of-Fit</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-muted-foreground">
              This chart plots the cumulative distribution of your sample data against the ideal cumulative distribution of a perfect normal curve. The closer the two lines are, the better the fit.
            </p>
            <p className="text-sm text-muted-foreground mb-4">
              <span className="font-semibold text-foreground">Example:</span> We generate a sample of data and plot its Empirical Cumulative Distribution Function (ECDF). We then overlay the theoretical Cumulative Distribution Function (CDF) of a normal distribution. Toggle between a normal sample and a uniform sample to see how the ECDF's fit changes.
            </p>
            <div className="mt-4 rounded-lg bg-background/50 p-4">
              <KSTestChart />
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
