'use client';

import { useState, useEffect } from 'react';
import {
  CartesianGrid,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
  ZAxis,
} from 'recharts';
import { PageHeader } from '@/components/app/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { ChartTooltipContent } from '@/lib/chart-config.tsx';
import { Crosshair } from 'lucide-react';

// Helper function to generate correlated data
const generateCorrelatedData = (
  n: number,
  correlation: number,
  meanX = 50,
  meanY = 50,
  stdDevX = 10,
  stdDevY = 10
) => {
  const data = [];
  for (let i = 0; i < n; i++) {
    const u1 = Math.random();
    const u2 = Math.random();
    const z1 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
    const z2 = Math.sqrt(-2 * Math.log(u1)) * Math.sin(2 * Math.PI * u2);

    const x = meanX + stdDevX * z1;
    const y =
      meanY + stdDevY * (correlation * z1 + Math.sqrt(1 - correlation ** 2) * z2);
    data.push({ x, y });
  }
  return data;
};


const PearsonCorrelationChart = () => {
  const [correlation, setCorrelation] = useState(0.8);
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    const data = generateCorrelatedData(100, correlation);
    setChartData(data);
  }, [correlation]);

  return (
    <div className="space-y-4">
      <div className="relative mx-auto h-[350px] w-full max-w-2xl">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart
            margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
          >
            <CartesianGrid />
            <XAxis type="number" dataKey="x" name="Asset A" unit="%" />
            <YAxis type="number" dataKey="y" name="Asset B" unit="%" />
            <Tooltip
              cursor={{ strokeDasharray: '3 3' }}
              content={<ChartTooltipContent indicator="dot" />}
            />
            <Scatter data={chartData} fill="var(--color-chart-1)" />
          </ScatterChart>
        </ResponsiveContainer>
      </div>
      <div className="mx-auto max-w-sm text-center">
        <Label htmlFor="correlation-slider">Adjust Correlation Coefficient</Label>
        <Slider
          id="correlation-slider"
          min={-1}
          max={1}
          value={[correlation]}
          step={0.1}
          onValueChange={(value) => setCorrelation(value[0])}
          className="my-4"
        />
        <p>Current Correlation: {correlation.toFixed(1)}</p>
      </div>
    </div>
  );
};


export default function PearsonCorrelationPage() {
  return (
    <>
      <PageHeader
        title="Interactive Guide to Pearson Correlation"
        description="Measure the linear relationship between two continuous variables, a cornerstone of portfolio diversification and pairs trading."
      />
      <div className="mx-auto max-w-5xl space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Core Concepts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <h3 className="mb-1 font-semibold text-primary">Purpose & Analogy</h3>
                <p className="text-muted-foreground">
                  Pearson Correlation measures how well two assets move in relation to each other. It gives a value between -1 (perfectly opposite movement) and +1 (perfectly identical movement). A value of 0 means no linear relationship. Think of it as a "dance partner" score for stocks.
                </p>
              </div>
              <div>
                <h3 className="mb-1 font-semibold text-primary">Interpretation</h3>
                 <ul className="list-disc pl-5 text-muted-foreground space-y-1">
                    <li><strong className="text-foreground">+1:</strong> Perfect positive correlation.</li>
                    <li><strong className="text-foreground">0:</strong> No linear correlation.</li>
                    <li><strong className="text-foreground">-1:</strong> Perfect negative correlation.</li>
                </ul>
                <p className="mt-2 text-sm text-muted-foreground">Crucial for diversification—combining negatively correlated assets can reduce overall portfolio risk.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Visualizing Pearson Correlation</CardTitle>
          </CardHeader>
          <CardContent>
             <p className="mb-4 text-muted-foreground">
              A scatter plot is the best way to visualize the relationship between two variables. The tighter the points are to forming a straight line, the stronger the linear correlation.
            </p>
             <p className="text-sm text-muted-foreground mb-4">
              <span className="font-semibold text-foreground">Example:</span> We plot the daily returns of two assets. By adjusting the slider, you can change the underlying correlation between their returns and see how it affects the scatter plot. This is fundamental to pairs trading, where you look for highly correlated assets whose prices have temporarily diverged.
            </p>
            <div className="mt-4 rounded-lg bg-background/50 p-4">
                <PearsonCorrelationChart />
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
