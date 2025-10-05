
'use client';

import { useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { PageHeader } from '@/components/app/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import { Line, LineChart, Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
import { Skeleton } from '@/components/ui/skeleton';
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';

// --- Math & Simulation Logic ---
const generateGBMPath = (s0: number, mu: number, sigma: number, T: number, steps: number) => {
  const dt = T / steps;
  const path = [{ step: 0, price: s0 }];
  let currentPrice = s0;
  for (let i = 1; i <= steps; i++) {
    const z = Math.sqrt(-2 * Math.log(Math.random())) * Math.cos(2 * Math.PI * Math.random()); // Standard normal
    currentPrice *= Math.exp((mu - 0.5 * sigma**2) * dt + sigma * Math.sqrt(dt) * z);
    path.push({ step: i, price: currentPrice });
  }
  return path;
};

// --- Chart Components ---
const MonteCarloPathsChart = ({ paths }: { paths: { step: number; price: number }[][] }) => {
  return (
    <ChartContainer config={{}} className="h-[350px] w-full">
      <LineChart>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="step" type="number" allowDuplicatedCategory={false} />
        <YAxis domain={['dataMin', 'dataMax']} />
        <Tooltip content={<ChartTooltipContent formatter={(value) => [Number(value).toFixed(2), "Price"]} />} />
        {paths.map((path, index) => (
          <Line key={index} data={path} type="monotone" dataKey="price" stroke="hsl(var(--primary))" opacity={0.2} dot={false} activeDot={false} />
        ))}
      </LineChart>
    </ChartContainer>
  );
};

const MonteCarloDistributionChart = ({ finalPrices }: { finalPrices: number[] }) => {
  const { histogramData, mean, stdDev } = useMemo(() => {
    if (finalPrices.length === 0) return { histogramData: [], mean: 0, stdDev: 0 };
    const min = Math.min(...finalPrices);
    const max = Math.max(...finalPrices);
    const bins = 30;
    const binWidth = (max - min) / bins;
    const hist = Array(bins).fill(0).map((_, i) => ({ name: (min + i * binWidth).toFixed(0), count: 0 }));
    finalPrices.forEach(p => {
      const binIndex = Math.floor((p - min) / binWidth);
      if (binIndex >= 0 && binIndex < bins) hist[binIndex].count++;
    });
    return { histogramData: hist, mean: finalPrices.reduce((a, b) => a + b) / finalPrices.length, stdDev: Math.sqrt(finalPrices.map(x => Math.pow(x - (finalPrices.reduce((a, b) => a + b) / finalPrices.length), 2)).reduce((a, b) => a + b) / finalPrices.length) };
  }, [finalPrices]);

  return (
    <div>
        <ChartContainer config={{}} className="h-[300px] w-full">
        <BarChart data={histogramData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip content={<ChartTooltipContent formatter={(value) => [value, "Frequency"]} />} />
            <Bar dataKey="count" fill="hsl(var(--primary))" />
        </BarChart>
        </ChartContainer>
        <div className="text-center text-xs text-muted-foreground mt-2">
            Mean: {mean.toFixed(2)}, StdDev: {stdDev.toFixed(2)}
        </div>
    </div>
  );
};

const DynamicPathsChart = dynamic(() => Promise.resolve(MonteCarloPathsChart), {
  ssr: false,
  loading: () => <Skeleton className="h-[350px] w-full" />,
});

const DynamicDistributionChart = dynamic(() => Promise.resolve(MonteCarloDistributionChart), {
  ssr: false,
  loading: () => <Skeleton className="h-[340px] w-full" />,
});

// --- Main Page Component ---
export default function MonteCarloSimulationPage() {
    const [mu, setMu] = useState(0.08); // Drift
    const [sigma, setSigma] = useState(0.20); // Volatility
    const [numPaths, setNumPaths] = useState(50);
    const [paths, setPaths] = useState<{ step: number; price: number }[][]>([]);
    const [finalPrices, setFinalPrices] = useState<number[]>([]);

    const runSimulation = () => {
        const newPaths = [];
        const newFinalPrices = [];
        for (let i = 0; i < numPaths; i++) {
            const path = generateGBMPath(100, mu, sigma, 1, 252);
            newPaths.push(path);
            newFinalPrices.push(path[path.length - 1].price);
        }
        setPaths(newPaths);
        setFinalPrices(newFinalPrices);
    };
    
    // Run once on load
    useState(() => {
        runSimulation();
    });

  return (
    <>
      <PageHeader
        title="Monte Carlo Simulation"
        description="Using randomness to solve complex problems, from pricing derivatives to modeling risk."
        variant="aligned-left"
      />
      <div className="mx-auto max-w-5xl space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">What is Monte Carlo Simulation?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-base leading-relaxed text-foreground/90">
            <p>
              Monte Carlo simulation is a computational technique that uses repeated random sampling to obtain numerical results. In essence, it's about understanding the behavior of a system by simulating it a large number of times.
            </p>
            <p>
              In quantitative finance, it's an indispensable tool. It's used to price complex "exotic" options that have no analytical solution, to estimate Value-at-Risk (VaR) for a portfolio, and to model the future performance of investment strategies. By simulating thousands of possible future scenarios, we can build a distribution of potential outcomes.
            </p>
          </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle className="font-headline">Modeling Stock Prices with GBM</CardTitle>
                 <CardDescription>A common use case is to model stock prices using Geometric Brownian Motion (GBM).</CardDescription>
            </CardHeader>
            <CardContent>
                 <div className="rounded-lg border bg-muted/50 p-4 text-center">
                  <BlockMath math="dS_t = \mu S_t dt + \sigma S_t dW_t" />
                </div>
                 <ul className="list-disc pl-6 space-y-2 text-sm mt-4">
                    <li><InlineMath math="S_t" /> is the stock price at time t.</li>
                    <li><InlineMath math="\mu" /> (mu) is the "drift" or expected return.</li>
                    <li><InlineMath math="\sigma" /> (sigma) is the volatility.</li>
                    <li><InlineMath math="dW_t" /> is a Wiener process or Brownian motion, representing randomness.</li>
                </ul>
            </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Interactive GBM Simulator</CardTitle>
            <CardDescription>Adjust the drift and volatility to see how they affect the simulated stock price paths over one year (252 trading days).</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
                <div className="space-y-3">
                    <Label htmlFor="mu-slider">Drift (μ): {(mu * 100).toFixed(1)}%</Label>
                    <Slider id="mu-slider" min={-0.1} max={0.2} step={0.01} value={[mu]} onValueChange={(val) => setMu(val[0])} />
                </div>
                <div className="space-y-3">
                    <Label htmlFor="sigma-slider">Volatility (σ): {(sigma * 100).toFixed(0)}%</Label>
                    <Slider id="sigma-slider" min={0.05} max={0.8} step={0.01} value={[sigma]} onValueChange={(val) => setSigma(val[0])} />
                </div>
            </div>
             <div className="flex justify-center mb-6">
                 <Button onClick={runSimulation}>Run Simulation</Button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                    <h4 className="font-semibold text-center mb-2">{paths.length} Simulated Price Paths</h4>
                    <DynamicPathsChart paths={paths} />
                </div>
                <div>
                    <h4 className="font-semibold text-center mb-2">Distribution of Final Prices</h4>
                    <DynamicDistributionChart finalPrices={finalPrices} />
                </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
