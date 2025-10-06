
'use client';

import { useState, useMemo } from 'react';
import { PageHeader } from '@/components/app/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { ChartContainer, ChartTooltipContent, Chart } from '@/components/ui/chart';
import { Skeleton } from '@/components/ui/skeleton';
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';

// --- Kalman Filter Simulation ---
const simulateKalmanFilter = (processNoise: number, measurementNoise: number, n: number) => {
  let trueValue = 0;
  let estimate = 0;
  let errorCovariance = 1;

  const data = [];

  for (let i = 0; i < n; i++) {
    // Prediction step
    trueValue += Math.sqrt(processNoise) * (Math.sqrt(-2 * Math.log(Math.random())) * Math.cos(2 * Math.PI * Math.random()));
    const measurement = trueValue + Math.sqrt(measurementNoise) * (Math.sqrt(-2 * Math.log(Math.random())) * Math.cos(2 * Math.PI * Math.random()));

    // Update step
    const kalmanGain = errorCovariance / (errorCovariance + measurementNoise);
    estimate = estimate + kalmanGain * (measurement - estimate);
    errorCovariance = (1 - kalmanGain) * errorCovariance;

    data.push({ time: i, true: trueValue, measurement, estimate });
  }
  return data;
};

// --- Chart Component ---
const KalmanChart = ({ data }: { data: { time: number; true: number; measurement: number; estimate: number }[] }) => {
  return (
    <ChartContainer config={{}} className="h-[350px] w-full">
      <Chart.LineChart data={data}>
        <Chart.CartesianGrid />
        <Chart.XAxis dataKey="time" />
        <Chart.YAxis domain={['dataMin - 1', 'dataMax + 1']} />
        <Chart.Tooltip content={<ChartTooltipContent formatter={(value: any, name: any) => [Number(value).toFixed(2), String(name).charAt(0).toUpperCase() + String(name).slice(1)]} />} />
        <Chart.Line type="monotone" dataKey="true" stroke="hsl(var(--muted-foreground))" strokeDasharray="3 3" dot={false} name="True Value" />
        <Chart.Scatter dataKey="measurement" fill="hsla(var(--primary), 0.5)" shape="cross" name="Noisy Measurement" />
        <Chart.Line type="monotone" dataKey="estimate" stroke="hsl(var(--destructive))" dot={false} name="Kalman Estimate" strokeWidth={2} />
      </Chart.LineChart>
    </ChartContainer>
  );
};

// --- Main Page Component ---
export default function KalmanFilterComponent() {
    const [processNoise, setProcessNoise] = useState(0.1);
    const [measurementNoise, setMeasurementNoise] = useState(1);
    const simulatedData = useMemo(() => simulateKalmanFilter(processNoise, measurementNoise, 100), [processNoise, measurementNoise]);

  return (
    <>
      <PageHeader
        title="Kalman Filters"
        description="Optimally estimating the state of a system from a series of incomplete and noisy measurements."
        variant="aligned-left"
      />
      <div className="mx-auto max-w-5xl space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Finding the Signal in the Noise</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-base leading-relaxed text-foreground/90">
            <p>
                A Kalman filter is a powerful algorithm that can estimate the internal state of a system when you can't observe it directly. It works by making a prediction, taking a noisy measurement, and then smartly combining the two to produce an optimal estimate.
            </p>
            <p>
                In quantitative finance, it's used in pairs trading to estimate the "true" underlying spread between two assets, for dynamic hedging, and for creating smooth estimates of noisy indicators. It excels at finding the hidden "signal" within a stream of chaotic market data.
            </p>
          </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle className="font-headline">Interactive Kalman Filter</CardTitle>
                <CardDescription>
                    Adjust the noise parameters to see how the Kalman filter performs. A high measurement noise means your observations are unreliable, forcing the filter to trust its own predictions more.
                </CardDescription>
            </CardHeader>
            <CardContent>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
                    <div className="space-y-3">
                        <Label htmlFor="process-noise-slider">Process Noise (Q): {processNoise.toFixed(2)}</Label>
                        <Slider id="process-noise-slider" min={0.01} max={1} step={0.01} value={[processNoise]} onValueChange={(val) => setProcessNoise(val[0])} />
                    </div>
                    <div className="space-y-3">
                        <Label htmlFor="measurement-noise-slider">Measurement Noise (R): {measurementNoise.toFixed(2)}</Label>
                        <Slider id="measurement-noise-slider" min={0.1} max={5} step={0.1} value={[measurementNoise]} onValueChange={(val) => setMeasurementNoise(val[0])} />
                    </div>
                </div>
                <KalmanChart data={simulatedData} />
            </CardContent>
        </Card>
      </div>
    </>
  );
}
