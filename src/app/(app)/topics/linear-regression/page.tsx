
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
import { Scatter, ScatterChart, CartesianGrid, XAxis, YAxis, Tooltip, Line as RechartsLine, Legend } from 'recharts';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import 'katex/dist/katex.min.css';

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
  if (n === 0) return { slope: 0, intercept: 0, rSquared: 0, residuals: [] };

  const sumX = data.reduce((acc, d) => acc + d.x, 0);
  const sumY = data.reduce((acc, d) => acc + d.y, 0);
  const sumXY = data.reduce((acc, d) => acc + d.x * d.y, 0);
  const sumX2 = data.reduce((acc, d) => acc + d.x * d.x, 0);
  const meanY = sumY / n;

  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX) || 0;
  const intercept = (sumY - slope * sumX) / n || 0;

  const totalVariation = data.reduce((acc, d) => acc + Math.pow(d.y - meanY, 2), 0);
  const residualVariation = data.reduce((acc, d) => acc + Math.pow(d.y - (slope * d.x + intercept), 2), 0);
  
  const rSquared = totalVariation > 0 ? 1 - (residualVariation / totalVariation) : 1;
  const residuals = data.map(d => ({...d, predicted: slope * d.x + intercept, residual: d.y - (slope * d.x + intercept)}));

  return { slope, intercept, rSquared, residuals };
};

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="rounded-lg border bg-background p-2 text-sm shadow-sm">
        <p>Market Return: {data.x.toFixed(2)}%</p>
        <p>Stock Return: {data.y.toFixed(2)}%</p>
        <p>Predicted: {data.predicted.toFixed(2)}%</p>
        <p className="font-semibold text-primary">Residual: {data.residual.toFixed(2)}%</p>
      </div>
    );
  }
  return null;
};


const RegressionChart = () => {
  const [data, setData] = useState<{ x: number; y: number }[]>([]);
  const [noise, setNoise] = useState(30);

  const generateData = () => {
    setData(generateRegressionData(50, 1.5, 10, noise));
  };

  useEffect(() => {
    generateData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [noise]);

  const { slope, intercept, rSquared, residuals } = useMemo(() => calculateRegression(data), [data]);
  
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
                <Tooltip cursor={{ strokeDasharray: '3 3' }} content={<CustomTooltip />} />
                <Legend />
                <Scatter name="Data Points" data={residuals} fill="hsl(var(--chart-1))" opacity={0.6}/>
                <RechartsLine
                    type="monotone"
                    dataKey="y"
                    data={regressionLine}
                    stroke="hsl(var(--destructive))"
                    strokeWidth={2}
                    dot={false}
                    name="Fitted Line"
                />
            </ScatterChart>
        </ChartContainer>
        <p className="text-center text-xs text-muted-foreground mt-2">Hover over a data point to see its residual.</p>


        <div className="mx-auto mt-4 max-w-sm space-y-4">
            <div>
                <Label htmlFor="noise-slider">Adjust Noise / Randomness</Label>
                <Slider id="noise-slider" min={5} max={150} step={5} value={[noise]} onValueChange={(val) => setNoise(val[0])} />
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
              Linear regression is a technique used to model the relationship between a dependent variable (like a stock's return) and one or more independent variables (like the overall market's return).
            </p>
            <div className="rounded-lg border bg-muted/50 p-4">
                <p className="font-mono text-center text-lg bg-background p-2 rounded-md mb-4">Y = β₀ + β₁X + ε</p>
                <ul className="list-disc pl-6 space-y-1 text-sm">
                    <li><code className="font-mono bg-background px-1 rounded">Y</code> is the dependent variable (what you're trying to predict).</li>
                    <li><code className="font-mono bg-background px-1 rounded">X</code> is the independent variable (the predictor).</li>
                    <li><code className="font-mono bg-background px-1 rounded">β₁</code> (Beta 1) is the <strong className="text-foreground">slope</strong>: how much Y is expected to change for a one-unit change in X.</li>
                    <li><code className="font-mono bg-background px-1 rounded">β₀</code> (Beta 0) is the <strong className="text-foreground">intercept</strong>: the expected value of Y when X is 0.</li>
                    <li><code className="font-mono bg-background px-1 rounded">ε</code> (epsilon) is the <strong className="text-foreground">error term (residual)</strong>: the random noise or unexplained part.</li>
                </ul>
            </div>
          </CardContent>
        </Card>

         <Card>
          <CardHeader>
            <CardTitle className="font-headline">How Does It Work? Ordinary Least Squares (OLS)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-base leading-relaxed text-foreground/90">
            <p>
                The "best fit" line isn't just an eyeball estimate. It's found using a method called <strong className="text-primary">Ordinary Least Squares (OLS)</strong>. The goal of OLS is to find the specific values for the slope (β₁) and intercept (β₀) that <strong className="text-primary">minimize the sum of the squared residuals</strong>.
            </p>
            <p>
                A <strong className="text-primary">residual</strong> is the vertical distance between an actual data point and the regression line—it's the error for that specific point. We square these errors so that positive and negative errors don't cancel each other out, and to give more weight to larger errors. OLS finds the one unique line that makes this total squared error as small as possible.
            </p>
          </CardContent>
        </Card>
        
        <Card>
            <CardHeader>
                 <CardTitle className="font-headline">Application: The Capital Asset Pricing Model (CAPM)</CardTitle>
                <CardDescription>A foundational model in finance that is a direct application of linear regression.</CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground mb-4">CAPM models a stock's excess return as a function of the overall market's excess return. The slope of this regression line, known as "Beta" (β), measures the stock's systematic risk. A Beta > 1 means the stock is more volatile than the market; a Beta &lt; 1 means it's less volatile. The intercept, "Alpha" (α), theoretically represents the excess return the stock earns that isn't explained by the market. A positive alpha is the holy grail for portfolio managers.</p>
                <DynamicRegressionChart />
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle className="font-headline">Key Metrics & Assumptions</CardTitle>
            </CardHeader>
            <CardContent>
                 <Accordion type="single" collapsible className="w-full" defaultValue="item-1">
                    <AccordionItem value="item-1">
                        <AccordionTrigger>What is R-Squared?</AccordionTrigger>
                        <AccordionContent>
                           R-Squared (or the coefficient of determination) tells you what percentage of the variation in the dependent variable (the stock's return) can be explained by the independent variable (the market's return). An R-Squared of 0.85 means that 85% of the stock's price movement can be explained by movements in the overall market. It's a measure of how well your model fits the data. Adjust the "Noise" slider in the chart above: as noise increases, the data points spread out from the line and the R-Squared value drops, indicating a weaker fit.
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-2">
                        <AccordionTrigger>The Assumptions of Linear Regression</AccordionTrigger>
                        <AccordionContent className="space-y-4">
                           <p>For a regression model's results to be valid and unbiased, several assumptions about the error terms (residuals) must hold. These are often remembered by the acronym <strong className="text-primary">LINE</strong>:</p>
                           <ul className="list-disc pl-6 space-y-2">
                               <li><strong className="text-foreground">Linearity:</strong> The relationship between the independent and dependent variables is linear.</li>
                               <li><strong className="text-foreground">Independence:</strong> The residuals are independent of each other. There should be no pattern (e.g., autocorrelation) in the error terms.</li>
                               <li><strong className="text-foreground">Normality:</strong> The residuals are normally distributed with a mean of zero.</li>
                               <li><strong className="text-foreground">Equal Variance (Homoscedasticity):</strong> The residuals have a constant variance at every level of the independent variable.</li>
                           </ul>
                           <p>Violating these assumptions can lead to misleading or completely incorrect conclusions about the relationships in your data.</p>
                        </AccordionContent>
                    </AccordionItem>
                 </Accordion>
            </CardContent>
        </Card>
      </div>
    </>
  );
}
