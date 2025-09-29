
'use client';

import { useState, useEffect, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { PageHeader } from '@/components/app/page-header';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import { Scatter, ScatterChart, CartesianGrid, XAxis, YAxis, Tooltip, Line as RechartsLine } from 'recharts';

// Helper function to generate data for regression
const generateRegressionData = (n: number, slope: number, intercept: number, noise: number) => {
  return Array.from({ length: n }, (_, i) => {
    const x = i;
    const y = slope * x + intercept + (Math.random() - 0.5) * noise;
    return { x, y };
  });
};

// Simple linear regression calculation
const calculateRegression = (data: { x: number; y: number }[]) => {
  const n = data.length;
  if (n === 0) return { slope: 0, intercept: 0, rSquared: 0 };

  const sumX = data.reduce((acc, d) => acc + d.x, 0);
  const sumY = data.reduce((acc, d) => acc + d.y, 0);
  const sumXY = data.reduce((acc, d) => acc + d.x * d.y, 0);
  const sumX2 = data.reduce((acc, d) => acc + d.x * d.x, 0);
  const meanY = sumY / n;

  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;

  const totalVariation = data.reduce((acc, d) => acc + Math.pow(d.y - meanY, 2), 0);
  const residualVariation = data.reduce((acc, d) => acc + Math.pow(d.y - (slope * d.x + intercept), 2), 0);
  
  const rSquared = totalVariation > 0 ? 1 - (residualVariation / totalVariation) : 1;

  return { slope, intercept, rSquared };
};

const RegressionChart = () => {
  const [data, setData] = useState<{ x: number; y: number }[]>([]);
  const [noise, setNoise] = useState(30);

  const generateData = () => {
    setData(generateRegressionData(50, 2.5, 10, noise));
  };

  useEffect(() => {
    generateData();
  }, [noise]);

  const { slope, intercept, rSquared } = useMemo(() => calculateRegression(data), [data]);

  const regressionLine = data.length > 0 ? [
    { x: 0, y: intercept },
    { x: data[data.length - 1].x, y: slope * data[data.length - 1].x + intercept },
  ] : [];

  return (
    <div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 text-center">
            <Card>
                <CardHeader className="pb-2"><CardTitle className="text-base">Slope (β₁)</CardTitle></CardHeader>
                <CardContent><p className="font-headline text-2xl text-primary">{slope.toFixed(3)}</p></CardContent>
            </Card>
            <Card>
                <CardHeader className="pb-2"><CardTitle className="text-base">Intercept (β₀)</CardTitle></CardHeader>
                <CardContent><p className="font-headline text-2xl text-primary">{intercept.toFixed(2)}</p></CardContent>
            </Card>
            <Card>
                <CardHeader className="pb-2"><CardTitle className="text-base">R-Squared</CardTitle></CardHeader>
                <CardContent><p className="font-headline text-2xl text-primary">{rSquared.toFixed(3)}</p></CardContent>
            </Card>
        </div>

        <ChartContainer config={{}} className="h-[400px] w-full">
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" dataKey="x" name="Market Return" unit="%" />
                <YAxis type="number" dataKey="y" name="Stock Return" unit="%" />
                <Tooltip cursor={{ strokeDasharray: '3 3' }} content={<ChartTooltipContent indicator="dot" />} />
                <Scatter name="Data Points" data={data} fill="hsl(var(--chart-1))" opacity={0.6} />
                <RechartsLine
                    type="monotone"
                    dataKey="y"
                    data={regressionLine}
                    stroke="hsl(var(--destructive))"
                    strokeWidth={2}
                    dot={false}
                    legendType="none"
                />
            </ScatterChart>
        </ChartContainer>

        <div className="mx-auto mt-4 max-w-sm space-y-4">
            <div>
                <Label htmlFor="noise-slider">Adjust Noise / Randomness</Label>
                <Slider id="noise-slider" min={5} max={100} step={5} value={[noise]} onValueChange={(val) => setNoise(val[0])} />
            </div>
            <Button onClick={generateData} className="w-full">Generate New Data</Button>
        </div>
    </div>
  );
};

const DynamicRegressionChart = dynamic(() => Promise.resolve(RegressionChart), { ssr: false });

export default function LinearRegressionPage() {
  return (
    <>
      <PageHeader
        title="Linear Regression"
        description="The workhorse of quantitative analysis: modeling the relationship between variables."
        variant="aligned-left"
      />
      <div className="mx-auto max-w-5xl space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Finding the "Best Fit" Line</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-base leading-relaxed text-foreground/90">
            <p>
              Linear regression is a technique used to model the relationship between a dependent variable (like a stock's return) and one or more independent variables (like the overall market's return). It finds the "line of best fit" that minimizes the distance between the line and the actual data points.
            </p>
            <div className="rounded-lg border bg-muted/50 p-4">
                <p className="font-mono text-center text-lg bg-background p-2 rounded-md mb-4">Y = β₀ + β₁X + ε</p>
                <ul className="list-disc pl-6 space-y-1 text-sm">
                    <li><code className="font-mono bg-background px-1 rounded">Y</code> is the dependent variable (what you're trying to predict).</li>
                    <li><code className="font-mono bg-background px-1 rounded">X</code> is the independent variable (the predictor).</li>
                    <li><code className="font-mono bg-background px-1 rounded">β₁</code> (Beta 1) is the <strong className="text-foreground">slope</strong>: how much Y changes for a one-unit change in X.</li>
                    <li><code className="font-mono bg-background px-1 rounded">β₀</code> (Beta 0) is the <strong className="text-foreground">intercept</strong>: the value of Y when X is 0.</li>
                    <li><code className="font-mono bg-background px-1 rounded">ε</code> (epsilon) is the <strong className="text-foreground">error term</strong>: the random noise or unexplained part.</li>
                </ul>
            </div>
          </CardContent>
        </Card>
        
        <Card>
            <CardHeader>
                 <CardTitle className="font-headline">Application: The Capital Asset Pricing Model (CAPM)</CardTitle>
                <CardDescription>A foundational model in finance that is a direct application of linear regression.</CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground mb-4">CAPM models a stock's return as a function of the overall market's return. The slope of this regression line, known as "Beta" (β), measures the stock's volatility or systematic risk relative to the market. A Beta > 1 means the stock is more volatile than the market; a Beta &lt; 1 means it's less volatile.</p>
                <DynamicRegressionChart />
            </CardContent>
        </Card>
      </div>
    </>
  );
}
