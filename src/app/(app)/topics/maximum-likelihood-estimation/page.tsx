
'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { PageHeader } from '@/components/app/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { ChartTooltipContent } from '@/lib/chart-config';
import { ChartContainer, type ChartConfig } from '@/components/ui/chart';
import { Line, Scatter, LineChart as RechartsLineChart, ScatterChart as RechartsScatterChart, CartesianGrid, Tooltip, XAxis, YAxis, ReferenceLine, ComposedChart } from 'recharts';

// --- Math Helpers ---
const generateNormalData = (mean: number, stdDev: number, n: number) => {
  const data = [];
  for (let i = 0; i < n; i++) {
    let u = 0, v = 0;
    while(u === 0) u = Math.random();
    while(v === 0) v = Math.random();
    const num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
    data.push(mean + stdDev * num);
  }
  return data;
};

const normalPdf = (x: number, mean: number, stdDev: number) => {
    const exponent = -((x - mean) ** 2) / (2 * stdDev ** 2);
    return (1 / (stdDev * Math.sqrt(2 * Math.PI))) * Math.exp(exponent);
};

const calculateLogLikelihood = (data: number[], mean: number, stdDev: number) => {
  if (stdDev <= 0) return -Infinity;
  let logLikelihood = 0;
  for (const x of data) {
    const pdfVal = normalPdf(x, mean, stdDev);
    logLikelihood += Math.log(pdfVal);
  }
  return logLikelihood;
};

// --- Chart Component ---
const mleChartConfig = {
  data: { label: 'Data Points', color: 'hsl(var(--chart-2))' },
  curve: { label: 'Normal PDF', color: 'hsl(var(--chart-1))' },
} satisfies ChartConfig;

const MLEChart = () => {
    const [sampleData, setSampleData] = useState<{x: number}[]>([]);
    const [curveData, setCurveData] = useState<{x: number, y: number}[]>([]);
    
    const [mean, setMean] = useState(2);
    const [stdDev, setStdDev] = useState(1.5);
    const [logLikelihood, setLogLikelihood] = useState(0);

    const trueMean = 5;
    const trueStdDev = 2;

    useEffect(() => {
        const data = generateNormalData(trueMean, trueStdDev, 50);
        setSampleData(data.map(val => ({ x: val })));
    }, []);

    useEffect(() => {
        if(sampleData.length === 0) return;

        const xMin = -5;
        const xMax = 15;
        const curve = [];
        for (let x = xMin; x <= xMax; x += 0.2) {
            curve.push({ x: x, y: normalPdf(x, mean, stdDev) });
        }
        setCurveData(curve);

        const ll = calculateLogLikelihood(sampleData.map(d => d.x), mean, stdDev);
        setLogLikelihood(ll);

    }, [mean, stdDev, sampleData]);

    return (
        <div className="flex h-[550px] w-full flex-col">
            <div className="flex-grow">
                 <ChartContainer config={mleChartConfig} className="h-full w-full">
                    <ComposedChart margin={{ top: 20, right: 40, bottom: 20, left: 20 }}>
                        <CartesianGrid vertical={false} />
                        <XAxis type="number" dataKey="x" domain={[-5, 15]} tickCount={11} />
                        <YAxis domain={[0, 0.4]} tickCount={5} />
                        <Tooltip content={<ChartTooltipContent indicator='dot' />} />
                        <Scatter dataKey="x" data={sampleData} fill="var(--color-data)" shape="cross" />
                        <Line type="monotone" dataKey="y" data={curveData} stroke="var(--color-curve)" strokeWidth={2} dot={false} />
                    </ComposedChart>
                </ChartContainer>
            </div>
            <div className="mx-auto grid w-full max-w-md gap-4 pt-4">
                <div>
                    <Label htmlFor="mean-slider" className="text-sm">Mean (μ): {mean.toFixed(2)}</Label>
                    <Slider id="mean-slider" min={0} max={10} step={0.1} value={[mean]} onValueChange={(v) => setMean(v[0])} />
                </div>
                <div>
                    <Label htmlFor="stddev-slider" className="text-sm">Std Dev (σ): {stdDev.toFixed(2)}</Label>
                    <Slider id="stddev-slider" min={0.5} max={5} step={0.1} value={[stdDev]} onValueChange={(v) => setStdDev(v[0])} />
                </div>
                 <div className="mt-2 text-center text-lg font-medium">
                     Log-Likelihood: <span className="font-bold text-primary">{logLikelihood.toFixed(2)}</span>
                </div>
            </div>
        </div>
    );
};

const DynamicMLEChart = dynamic(() => Promise.resolve(MLEChart), { ssr: false });

export default function MLEPage() {
  return (
    <>
      <PageHeader
        title="Interactive Guide to Maximum Likelihood Estimation (MLE)"
        description="Discover how MLE finds the 'best-fit' parameters for a model by maximizing the likelihood of observing your data."
      />
      <div className="mx-auto max-w-5xl space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">What is MLE?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-base leading-relaxed text-foreground/90">
            <p>
                <strong>For Beginners:</strong> Imagine you have a set of data points (like the returns of a stock). You believe this data came from a specific type of machine—in this case, a 'normal distribution machine'. This machine has two knobs: one for the **Mean (μ)**, which sets the center of the data, and one for the **Standard Deviation (σ)**, which sets the spread. Maximum Likelihood Estimation is a method for finding the best knob settings (parameters) that make your observed data seem the most probable or 'likely'. You're asking, "What values of μ and σ would most likely produce the data I see?"
            </p>
             <p>
                <strong>For Intermediates:</strong> MLE is a statistical method for estimating the parameters of a model. The core idea is to find the parameter values that maximize the **Likelihood Function**. The likelihood function, L(θ|x), tells us how probable our observed data (x) is for a given set of parameters (θ). Because products of small probabilities can be numerically unstable, it is almost always easier to work with the **Log-Likelihood Function** (the natural logarithm of the likelihood). Maximizing the log-likelihood is equivalent to maximizing the likelihood, and it allows us to turn a product into a much simpler sum.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>MLE in Action: Fitting a Normal Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-muted-foreground">
              Here we have 50 data points sampled from a true (but hidden) normal distribution. Your goal is to use the sliders to find the values for the Mean (μ) and Standard Deviation (σ) that best fit this data. As you adjust the parameters, watch the **Log-Likelihood** score. Your best estimate for the parameters will be the ones that make this score as high as possible.
            </p>
            <div className="mt-4 rounded-lg bg-background/50 p-4">
              <DynamicMLEChart />
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
