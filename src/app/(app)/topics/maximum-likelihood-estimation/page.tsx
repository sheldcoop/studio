'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { PageHeader } from '@/components/app/page-header';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { ChartTooltipContent } from '@/lib/chart-config';
import { ChartContainer, type ChartConfig } from '@/components/ui/chart';
import {
  Line,
  ComposedChart,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
  Scatter,
} from 'recharts';

// --- Math Helpers ---
const generateNormalData = (mean: number, stdDev: number, n: number) => {
  const data = [];
  for (let i = 0; i < n; i++) {
    let u = 0,
      v = 0;
    while (u === 0) u = Math.random();
    while (v === 0) v = Math.random();
    const num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
    data.push(mean + stdDev * num);
  }
  return data;
};

const normalPdf = (x: number, mean: number, stdDev: number) => {
  const exponent = -((x - mean) ** 2) / (2 * stdDev ** 2);
  return (1 / (stdDev * Math.sqrt(2 * Math.PI))) * Math.exp(exponent);
};

const calculateLogLikelihood = (
  data: number[],
  mean: number,
  stdDev: number
) => {
  if (stdDev <= 0) return -Infinity;
  let logLikelihood = 0;
  for (const x of data) {
    const pdfVal = normalPdf(x, mean, stdDev);
    if (pdfVal > 0) {
      logLikelihood += Math.log(pdfVal);
    } else {
      return -Infinity;
    }
  }
  return logLikelihood;
};

// --- Chart Component ---
const mleChartConfig = {
  data: { label: 'Data Points', color: 'hsl(var(--chart-2))' },
  curve: { label: 'Normal PDF', color: 'hsl(var(--chart-1))' },
} satisfies ChartConfig;

const MLEChart = () => {
  const [sampleData, setSampleData] = useState<{ x: number }[]>([]);
  const [curveData, setCurveData] = useState<{ x: number; y: number }[]>([]);

  const [mean, setMean] = useState(2);
  const [stdDev, setStdDev] = useState(1.5);
  const [logLikelihood, setLogLikelihood] = useState(0);

  const trueMean = 5;
  const trueStdDev = 2;

  useEffect(() => {
    const data = generateNormalData(trueMean, trueStdDev, 50);
    setSampleData(data.map((val) => ({ x: val })));
  }, []);

  useEffect(() => {
    if (sampleData.length === 0) return;

    const xMin = -5;
    const xMax = 15;
    const curve = [];
    for (let x = xMin; x <= xMax; x += 0.2) {
      curve.push({ x: x, y: normalPdf(x, mean, stdDev) });
    }
    setCurveData(curve);

    const ll = calculateLogLikelihood(
      sampleData.map((d) => d.x),
      mean,
      stdDev
    );
    setLogLikelihood(ll);
  }, [mean, stdDev, sampleData]);

  return (
    <div className="flex h-[550px] w-full flex-col">
      <div className="flex-grow">
        <ChartContainer config={mleChartConfig} className="h-full w-full">
          <ComposedChart
            margin={{ top: 20, right: 40, bottom: 20, left: 20 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis type="number" dataKey="x" domain={[-5, 15]} tickCount={11} />
            <YAxis domain={[0, 0.4]} tickCount={5} />
            <Tooltip content={<ChartTooltipContent indicator="dot" />} />
            <Scatter
              dataKey="x"
              data={sampleData}
              fill="var(--color-data)"
              shape="cross"
            />
            <Line
              type="monotone"
              dataKey="y"
              data={curveData}
              stroke="var(--color-curve)"
              strokeWidth={2}
              dot={false}
            />
          </ComposedChart>
        </ChartContainer>
      </div>
      <div className="mx-auto grid w-full max-w-md gap-4 pt-4">
        <div>
          <Label htmlFor="mean-slider" className="text-sm">
            Mean (μ): {mean.toFixed(2)}
          </Label>
          <Slider
            id="mean-slider"
            min={0}
            max={10}
            step={0.1}
            value={[mean]}
            onValueChange={(v) => setMean(v[0])}
          />
        </div>
        <div>
          <Label htmlFor="stddev-slider" className="text-sm">
            Std Dev (σ): {stdDev.toFixed(2)}
          </Label>
          <Slider
            id="stddev-slider"
            min={0.5}
            max={5}
            step={0.1}
            value={[stdDev]}
            onValueChange={(v) => setStdDev(v[0])}
          />
        </div>
        <div className="mt-2 text-center text-lg font-medium">
          Log-Likelihood:{' '}
          <span className="font-bold text-primary">
            {logLikelihood.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
};

const DynamicMLEChart = dynamic(() => Promise.resolve(MLEChart), {
  ssr: false,
});

export default function MLEPage() {
  return (
    <>
      <PageHeader
        title="An Interactive Guide to Maximum Likelihood Estimation (MLE)"
        description="Discover how MLE finds the 'best-fit' parameters for a model by maximizing the likelihood of observing your data."
        variant="aligned-left"
      />
      <div className="mx-auto max-w-5xl space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">
              So, What IS Maximum Likelihood Estimation?
            </CardTitle>
          </CardHeader>
          <CardContent className="prose prose-invert max-w-none text-base text-foreground/90">
            <p>
              Imagine you're a detective 🕵️‍♀️. You arrive at a crime scene and
              find some clues. Your job is to figure out which suspect's story
              best explains the clues you've found. That's *exactly* what MLE
              does, but with data. It answers the question:
            </p>
            <blockquote className="border-l-4 border-primary pl-4 italic">
              "Given the data I've collected, what is the most likely story (or
              model) that produced it?"
            </blockquote>
            <p>
              Let's use the **Archer Analogy** 🎯. Imagine we find a target
              covered in arrow holes. We didn't see the archer shoot, but we
              want to figure out where they were aiming. The data we have is
              where the arrows landed. The parameter we want to find is the spot
              the archer was aiming for. Where would you guess they were aiming?
              Right in the middle of the cluster, right? Of course! Because if
              they *were* aiming there, it's the most believable explanation for
              the pattern we see. With MLE, we are just finding the parameter
              that **maximizes the likelihood** of seeing our data.
            </p>
            <h3 className="text-xl font-semibold text-primary">
              What Do We Use It For?
            </h3>
            <p>
              MLE is the engine behind a huge number of things in statistics
              and data science. It's how we **fit a model to our data**. It's the core principle that allows algorithms like Logistic Regression to "learn" from data and make predictions, and it's how we find the parameters (like mean and standard deviation) that best describe a dataset.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-headline">
              The Math: How Is It Calculated?
            </CardTitle>
            <CardDescription>
              Let's walk through the calculation with a classic example: the
              mystery coin 🪙.
            </CardDescription>
          </CardHeader>
          <CardContent className="prose prose-invert max-w-none space-y-4 text-base text-foreground/90">
            <p>
              We flip a coin 10 times and get this sequence (our data): **H, T,
              H, H, H, T, H, H, T, H** (7 Heads and 3 Tails). Our goal is to find
              the most likely probability of heads ($p$) for this coin.
            </p>
            <div className="space-y-2">
              <h4 className="font-semibold">Step 1: Define the Likelihood Function, L(p|data)</h4>
              <p>
                We write a formula for the probability of getting our *exact*
                sequence. Since flips are independent, we multiply their
                probabilities:
              </p>
              <pre className="rounded-md bg-muted p-4 text-sm">
                <code>{`L(p|data) = p * (1-p) * p * ... = p^7 * (1-p)^3`}</code>
              </pre>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold">Step 2: Take the Log-Likelihood, ln(L)</h4>
              <p>
                Multiplying many small numbers is messy. Taking the natural log
                turns multiplication into simpler addition. The value of $p$ that
                maximizes the likelihood is the *same* value that maximizes the
                log-likelihood.
              </p>
              <pre className="rounded-md bg-muted p-4 text-sm">
                <code>
                  {`ln(L) = ln(p^7 * (1-p)^3) = 7*ln(p) + 3*ln(1-p)`}
                </code>
              </pre>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold">Step 3: Maximize with Calculus</h4>
              <p>
                To find the maximum point of the function, we take the
                derivative with respect to $p$ and set it to zero.
              </p>
              <pre className="rounded-md bg-muted p-4 text-sm">
                <code>
                  {`d/dp [ln(L)] = 7/p - 3/(1-p)`}
                </code>
              </pre>
              <p>Setting it to zero and solving for $p$:</p>
              <pre className="rounded-md bg-muted p-4 text-sm">
                <code>
                  {`7/p = 3/(1-p)  =>  7(1-p) = 3p  =>  7 = 10p  =>  p = 0.7`}
                </code>
              </pre>
            </div>
            <p className="font-semibold">
              And there it is! Our Maximum Likelihood Estimate is 0.7, which
              matches our intuition perfectly.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-headline">
              MLE in Action: Fitting a Normal Distribution
            </CardTitle>
            <CardDescription>
              Here we have 50 data points sampled from a hidden normal
              distribution. Use the sliders to find the Mean (μ) and Standard
              Deviation (σ) that best fit this data. Your best estimate will
              be the one that makes the **Log-Likelihood** score as high as
              possible (i.e., closest to zero).
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <DynamicMLEChart />
          </CardContent>
        </Card>
      </div>
    </>
  );
}

    