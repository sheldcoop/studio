
'use client';

import { useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { PageHeader } from '@/components/app/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import { Bar, BarChart, Line, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, ReferenceLine } from 'recharts';
import { Skeleton } from '@/components/ui/skeleton';
import { InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';

// --- Math & Simulation Logic ---
const generateARProcess = (phi: number, n: number) => {
  const data = [0];
  for (let i = 1; i < n; i++) {
    const error = (Math.random() - 0.5) * 2; // White noise
    data.push(phi * data[i - 1] + error);
  }
  return data;
};

const calculateACF = (series: number[], maxLag: number) => {
  const n = series.length;
  const mean = series.reduce((a, b) => a + b) / n;
  const variance = series.reduce((acc, val) => acc + (val - mean) ** 2, 0);
  
  const acf = [];
  for (let lag = 0; lag <= maxLag; lag++) {
    let covariance = 0;
    for (let i = lag; i < n; i++) {
      covariance += (series[i] - mean) * (series[i - lag] - mean);
    }
    acf.push({ lag, value: covariance / variance });
  }
  return acf;
};

// --- Chart Components ---

const TimeSeriesChart = ({ data }: { data: number[] }) => {
  const chartData = data.map((value, index) => ({ index, value }));
  return (
    <ChartContainer config={{}} className="h-[200px] w-full">
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="index" />
        <YAxis />
        <Tooltip content={<ChartTooltipContent formatter={(value) => [Number(value).toFixed(2), "Value"]} />} />
        <Line type="monotone" dataKey="value" stroke="hsl(var(--primary))" dot={false} />
      </LineChart>
    </ChartContainer>
  );
};

const ACFChart = ({ data, maxLag }: { data: number[], maxLag: number }) => {
  const acfData = calculateACF(data, maxLag);
  const confidenceInterval = 1.96 / Math.sqrt(data.length);
  return (
    <ChartContainer config={{}} className="h-[200px] w-full">
        <BarChart data={acfData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="lag" />
            <YAxis domain={[-1, 1]}/>
            <Tooltip content={<ChartTooltipContent formatter={(value) => [Number(value).toFixed(2), "ACF"]} />} />
            <ReferenceLine y={confidenceInterval} stroke="hsl(var(--muted-foreground))" strokeDasharray="3 3" />
            <ReferenceLine y={-confidenceInterval} stroke="hsl(var(--muted-foreground))" strokeDasharray="3 3" />
            <ReferenceLine y={0} stroke="hsl(var(--border))" />
            <Bar dataKey="value" fill="hsl(var(--primary))" />
        </BarChart>
    </ChartContainer>
  )
};

const DynamicTimeSeriesChart = dynamic(() => Promise.resolve(TimeSeriesChart), {
  ssr: false,
  loading: () => <Skeleton className="h-[200px] w-full" />,
});

const DynamicACFChart = dynamic(() => Promise.resolve(ACFChart), {
  ssr: false,
  loading: () => <Skeleton className="h-[200px] w-full" />,
});


// --- Main Page Component ---
export default function ACF_PACF_Page() {
    const [phi, setPhi] = useState(0.8);
    const timeSeriesData = useMemo(() => generateARProcess(phi, 200), [phi]);

  return (
    <>
      <PageHeader
        title="Autocorrelation (ACF & PACF)"
        description="The essential tools for understanding the memory and structure of time series data."
        variant="aligned-left"
      />
      <div className="mx-auto max-w-5xl space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">What is Autocorrelation?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-base leading-relaxed text-foreground/90">
            <p>
              Autocorrelation is the correlation of a time series with a delayed copy of itself. It&apos;s a measure of how much the value of the series at one point in time is related to its value at a previous point in time. 
            </p>
            <p>
              In finance, this is a critical concept. If a stock&apos;s return today is positively autocorrelated with its return yesterday, it suggests momentum. If it&apos;s negatively correlated, it suggests mean reversion. The ACF and PACF plots are the primary tools quants use to diagnose this &quot;memory&quot; in a time series.
            </p>
          </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle className="font-headline">ACF vs. PACF</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-foreground/90">
                 <div>
                    <h4 className="font-semibold text-primary">Autocorrelation Function (ACF)</h4>
                    <p>The ACF plot shows the correlation of the series with its lags. For example, the bar at lag `k` shows the correlation between the series at time `t` and time `t-k`. It measures the **total** effect (direct and indirect) of a past value on the current value.</p>
                </div>
                 <div>
                    <h4 className="font-semibold text-primary">Partial Autocorrelation Function (PACF)</h4>
                    <p>The PACF is more subtle. It shows the correlation between the series at time `t` and time `t-k` **after removing the effects of all the shorter lags** (t-1, t-2, ..., t-k+1). It measures the **direct** effect of a specific lag on the current value.</p>
                </div>
            </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Interactive AR(1) Process</CardTitle>
            <CardDescription>
                Below is a simulated Autoregressive process of order 1 (AR(1)), defined as <InlineMath math="X_t = \phi X_{t-1} + \epsilon_t" />. Adjust the autoregressive parameter (<InlineMath math="\phi" />) to see how it impacts the time series and its ACF plot. 
                A high <InlineMath math="\phi" /> means the series has strong &quot;memory&quot;.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mx-auto max-w-md mb-6">
                <div className="space-y-3">
                    <Label htmlFor="phi-slider">Autoregressive Parameter (ϕ): {phi.toFixed(2)}</Label>
                    <Slider id="phi-slider" min={-0.99} max={0.99} step={0.01} value={[phi]} onValueChange={(val) => setPhi(val[0])} />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <h4 className="text-center font-semibold mb-2">Simulated Time Series</h4>
                    <DynamicTimeSeriesChart data={timeSeriesData} />
                </div>
                 <div>
                    <h4 className="text-center font-semibold mb-2">Autocorrelation Function (ACF)</h4>
                    <DynamicACFChart data={timeSeriesData} maxLag={20} />
                </div>
            </div>
            <p className="text-xs text-muted-foreground mt-4 text-center">Notice how for a high positive ϕ, the ACF decays slowly, indicating strong memory. The PACF (not shown here) for an AR(1) process would have a single significant spike at lag 1 and then cut off to zero.</p>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
