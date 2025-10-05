
'use client';

import { useState, useMemo, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { PageHeader } from '@/components/app/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import { Line, LineChart, Scatter, ScatterChart, ComposedChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { Skeleton } from '@/components/ui/skeleton';
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';

// --- Kalman Filter Logic ---
class KalmanFilter1D {
  private Q: number; // Process noise
  private R: number; // Measurement noise
  private x: number = 0; // State
  private P: number = 1; // State covariance

  constructor(Q: number, R: number, P0: number = 1, x0: number = 0) {
    this.Q = Q;
    this.R = R;
    this.P = P0;
    this.x = x0;
  }

  predict() {
    this.P += this.Q;
  }

  update(measurement: number) {
    const K = this.P / (this.P + this.R); // Kalman Gain
    this.x += K * (measurement - this.x);
    this.P = (1 - K) * this.P;
  }

  getState() {
    return this.x;
  }
}

// --- Chart Components ---
const KalmanFilterChart = ({ processNoise, measurementNoise, data }: { processNoise: number, measurementNoise: number, data: { time: number, trueValue: number, measurement: number }[] }) => {
  const filteredData = useMemo(() => {
    const kf = new KalmanFilter1D(processNoise, measurementNoise, 1, data[0]?.measurement || 0);
    return data.map(d => {
      kf.predict();
      kf.update(d.measurement);
      return { ...d, estimate: kf.getState() };
    });
  }, [processNoise, measurementNoise, data]);

  return (
    <ChartContainer config={{}} className="h-[350px] w-full">
      <ComposedChart data={filteredData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="time" type="number" />
        <YAxis domain={['dataMin - 1', 'dataMax + 1']} />
        <Tooltip content={<ChartTooltipContent />} />
        <Legend />
        <Line type="monotone" dataKey="trueValue" name="True Signal" stroke="hsl(var(--muted-foreground))" strokeWidth={2} dot={false} />
        <Scatter name="Noisy Measurements" dataKey="measurement" fill="hsl(var(--chart-2))" shape="cross" />
        <Line type="monotone" dataKey="estimate" name="Kalman Filter Estimate" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
      </ComposedChart>
    </ChartContainer>
  );
};

const DynamicKalmanFilterChart = dynamic(() => Promise.resolve(KalmanFilterChart), {
  ssr: false,
  loading: () => <Skeleton className="h-[350px] w-full" />,
});


// --- Main Page Component ---
export default function KalmanFilterPage() {
    const [processNoise, setProcessNoise] = useState(0.01);
    const [measurementNoise, setMeasurementNoise] = useState(0.5);
    const [data, setData] = useState<{ time: number, trueValue: number, measurement: number }[]>([]);

    const generateData = () => {
        const newData = [];
        const n = 100;
        let trueValue = 0;
        for (let i = 0; i < n; i++) {
            const processError = (Math.random() - 0.5) * 0.5;
            trueValue += processError;
            const measurementError = (Math.random() - 0.5) * 2;
            const measurement = trueValue + measurementError;
            newData.push({ time: i, trueValue, measurement });
        }
        setData(newData);
    };

    useEffect(() => {
        generateData();
    }, []);

  return (
    <>
      <PageHeader
        title="Kalman Filters"
        description="Dynamically estimating the state of a system from a series of incomplete and noisy measurements."
        variant="aligned-left"
      />
      <div className="mx-auto max-w-5xl space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Finding the Signal in the Noise</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-base leading-relaxed text-foreground/90">
            <p>
                The Kalman filter is one of the most important and widely used algorithms for signal processing and control systems. It was famously used for navigation on the Apollo missions to the moon. Its purpose is to estimate the state of a system (like the position and velocity of a rocket, or the 'true' price of a stock) from a series of measurements that are corrupted by noise.
            </p>
            <p>
                In quantitative finance, it's used for pairs trading (estimating the spread), smoothing volatile price data to find the underlying trend, and creating dynamic hedging strategies. It excels at combining a predictive model of how a system should behave with actual, noisy measurements to produce an optimal estimate that is better than what could be achieved with either one alone.
            </p>
          </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle className="font-headline">The Predict-Update Cycle</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-base leading-relaxed text-foreground/90">
               <p>The Kalman filter operates in a two-step cycle:</p>
               <ol className="list-decimal list-inside space-y-2">
                    <li><strong>Predict:</strong> The filter uses its current state estimate to predict the state at the next time step. In this prediction, the uncertainty of the estimate grows.</li>
                    <li><strong>Update:</strong> The filter incorporates a new measurement. It compares the prediction with the actual measurement and corrects its state estimate. The amount of correction depends on the "Kalman Gain," which balances the trust between the model's prediction and the new measurement.</li>
               </ol>
            </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Interactive Kalman Filter</CardTitle>
            <CardDescription>
                Adjust the noise parameters to see how the filter behaves. A high "Process Noise" tells the filter not to trust its own model very much. A high "Measurement Noise" tells the filter not to trust the incoming data very much.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
                <div className="space-y-3">
                    <Label htmlFor="process-noise-slider">Process Noise (Q): {processNoise.toFixed(3)}</Label>
                    <Slider id="process-noise-slider" min={0.001} max={0.2} step={0.001} value={[processNoise]} onValueChange={(val) => setProcessNoise(val[0])} />
                </div>
                <div className="space-y-3">
                    <Label htmlFor="measurement-noise-slider">Measurement Noise (R): {measurementNoise.toFixed(2)}</Label>
                    <Slider id="measurement-noise-slider" min={0.1} max={5} step={0.1} value={[measurementNoise]} onValueChange={(val) => setMeasurementNoise(val[0])} />
                </div>
            </div>
            <DynamicKalmanFilterChart
                processNoise={processNoise}
                measurementNoise={measurementNoise}
                data={data}
            />
            <div className="text-center mt-4">
                 <Button onClick={generateData}>Generate New Data</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

