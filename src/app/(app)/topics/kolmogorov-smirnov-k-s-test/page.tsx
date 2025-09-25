'use client';

import { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/app/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartTooltipContent } from '@/lib/chart-config.tsx';

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
  const [chartData, setChartData] = useState<any[]>([]);
  const [dataType, setDataType] = useState<'normal' | 'uniform'>('normal');

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
    
    const sortedSample = [...sampleData].sort((a,b) => a - b);
    const ecdfPoints = sortedSample.map((val, i) => ({ x: val, empirical: (i+1)/n }));
    const cdfPoints = sortedSample.map(val => ({ x: val, theoretical: standardNormalCdf((val - mean) / stdDev) }));

    // Merge the points for plotting
    const mergedData = ecdfPoints.map((point, i) => ({
        ...point,
        theoretical: cdfPoints[i].theoretical
    }));

    setChartData(mergedData);
  };

  useEffect(() => {
    generateAndSetData(dataType);
  }, [dataType]);

  return (
    <div className="space-y-4">
      <div className="h-[350px]">
        <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <CartesianGrid vertical={false} />
                <XAxis type="number" dataKey="x" name="Value" domain={['dataMin', 'dataMax']} tickLine={false} tickMargin={10} axisLine={false} />
                <YAxis domain={[0,1]} />
                <Tooltip content={<ChartTooltipContent />} />
                <Legend />
                <Line type="step" dataKey="empirical" name="Empirical CDF (Sample)" stroke="var(--color-chart-1)" dot={false} strokeWidth={2}/>
                <Line type="monotone" dataKey="theoretical" name="Theoretical CDF (Normal)" stroke="var(--color-chart-2)" dot={false} strokeWidth={2} />
            </LineChart>
        </ResponsiveContainer>
      </div>
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
