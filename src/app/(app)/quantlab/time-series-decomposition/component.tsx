
'use client';

import { useState, useMemo } from 'react';
import { PageHeader } from '@/components/app/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { ChartContainer, ChartTooltipContent, Chart } from '@/components/ui/chart';
import { Skeleton } from '@/components/ui/skeleton';
import 'katex/dist/katex.min.css';

type ModelType = 'additive' | 'multiplicative';

// --- Math & Simulation Logic ---
const generateTimeSeries = (n: number) => {
  const data = [];
  for (let i = 0; i < n; i++) {
    const trend = 0.1 * i;
    const seasonality = 10 * Math.sin(2 * Math.PI * i / 12);
    const residual = (Math.random() - 0.5) * 5;
    const additiveValue = 50 + trend + seasonality + residual;
    const multiplicativeValue = Math.max(1, (50 + trend) * (1 + seasonality / 50) * (1 + residual / 50));
    data.push({ time: i, additive: additiveValue, multiplicative: multiplicativeValue, trend, seasonality, residual });
  }
  return data;
};

// --- Chart Component ---
const DecompositionChart = ({ model, data }: { model: ModelType, data: any[] }) => {
  const chartData = data.map(d => ({ ...d, original: d[model] }));

  return (
    <div className="space-y-8">
      <div>
        <h4 className="text-center font-semibold mb-2">Original Time Series</h4>
        <ChartContainer config={{}} className="h-[200px] w-full">
          <Chart.LineChart data={chartData}>
            <Chart.CartesianGrid />
            <Chart.XAxis dataKey="time" />
            <Chart.YAxis />
            <Chart.Tooltip content={<ChartTooltipContent formatter={(value) => [Number(value).toFixed(2), "Value"]} />} />
            <Chart.Line type="monotone" dataKey="original" stroke="hsl(var(--primary))" dot={false} />
          </Chart.LineChart>
        </ChartContainer>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <h4 className="text-center font-semibold text-sm mb-2">Trend Component</h4>
          <ChartContainer config={{}} className="h-[150px] w-full">
            <Chart.LineChart data={chartData}>
              <Chart.XAxis dataKey="time" hide />
              <Chart.YAxis />
              <Chart.Line type="monotone" dataKey="trend" stroke="hsl(var(--chart-2))" dot={false} />
            </Chart.LineChart>
          </ChartContainer>
        </div>
        <div>
          <h4 className="text-center font-semibold text-sm mb-2">Seasonal Component</h4>
          <ChartContainer config={{}} className="h-[150px] w-full">
            <Chart.LineChart data={chartData}>
              <Chart.XAxis dataKey="time" hide />
              <Chart.YAxis />
              <Chart.Line type="monotone" dataKey="seasonality" stroke="hsl(var(--chart-3))" dot={false} />
            </Chart.LineChart>
          </ChartContainer>
        </div>
        <div>
          <h4 className="text-center font-semibold text-sm mb-2">Residual (Noise)</h4>
          <ChartContainer config={{}} className="h-[150px] w-full">
            <Chart.LineChart data={chartData}>
              <Chart.XAxis dataKey="time" hide />
              <Chart.YAxis />
              <Chart.Line type="monotone" dataKey="residual" stroke="hsl(var(--muted-foreground))" dot={false} />
            </Chart.LineChart>
          </ChartContainer>
        </div>
      </div>
    </div>
  );
};


// --- Main Page Component ---
export default function TimeSeriesDecompositionComponent() {
    const [model, setModel] = useState<ModelType>('additive');
    const timeSeriesData = useMemo(() => generateTimeSeries(100), []);

  return (
    <>
      <PageHeader
        title="Time Series Decomposition"
        description="Breaking down a time series into its core components to understand its underlying structure."
        variant="aligned-left"
      />
      <div className="mx-auto max-w-5xl space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Unpacking the Data</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-base leading-relaxed text-foreground/90">
            <p>
                A raw time series, like the daily price of a stock, can be noisy and difficult to interpret. Time series decomposition is a statistical method that deconstructs a time series into several components, each representing one of the underlying categories of patterns.
            </p>
            <p>
                Typically, we decompose a series into three parts:
            </p>
            <ul className="list-disc list-inside">
                <li><strong>Trend:</strong> The long-term direction or movement of the data.</li>
                <li><strong>Seasonality:</strong> Repeating patterns or cycles that occur at regular intervals (e.g., daily, weekly, yearly).</li>
                <li><strong>Residuals (Noise):</strong> The random, irregular component left over after removing the trend and seasonality.</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Interactive Decomposition</CardTitle>
            <CardDescription>
                Choose between an additive or multiplicative model to see how the components are combined to form the original series.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center gap-4 mb-6">
                <RadioGroup value={model} onValueChange={(v: ModelType) => setModel(v)} className="flex gap-4">
                    <div>
                        <RadioGroupItem value="additive" id="additive" className="peer sr-only" />
                        <Label htmlFor="additive" className="block cursor-pointer rounded-md border p-2 px-4 transition-colors peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10">Additive Model</Label>
                    </div>
                     <div>
                        <RadioGroupItem value="multiplicative" id="multiplicative" className="peer sr-only" />
                        <Label htmlFor="multiplicative" className="block cursor-pointer rounded-md border p-2 px-4 transition-colors peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10">Multiplicative Model</Label>
                    </div>
                </RadioGroup>
            </div>
            
            <DecompositionChart model={model} data={timeSeriesData} />
            
             <p className="text-sm text-center text-muted-foreground mt-4">
                {model === 'additive'
                    ? 'Additive Model: Original = Trend + Seasonality + Residual'
                    : 'Multiplicative Model: Original = Trend × Seasonality × Residual'
                }
            </p>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
