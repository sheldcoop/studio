
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
import { Input } from '@/components/ui/input';
import { ChartContainer } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, Label as RechartsLabel } from 'recharts';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Lightbulb, TrendingDown, ShieldCheck } from 'lucide-react';
import { ChartTooltipContent } from '@/lib/chart-config';


// --- Math & Simulation Logic ---
const runMonteCarloSimulation = (
  initialValue: number,
  mu: number, // Annual return
  sigma: number, // Annual volatility
  simulations: number
) => {
  const finalValues = [];
  const dt = 1 / 252; // Time step for one trading day

  for (let i = 0; i < simulations; i++) {
    let value = initialValue;
    // We only need the final value after 1 year, so we can simplify the path simulation
    // This uses a simplified approximation of a standard normal variable for browser performance
    const z = (Math.random() + Math.random() + Math.random() + Math.random() + Math.random() + Math.random() - 3) / Math.sqrt(0.5);
    const drift = (mu - (sigma * sigma) / 2) * 1;
    const diffusion = sigma * z * Math.sqrt(1);
    const finalValue = value * Math.exp(drift + diffusion);
    finalValues.push(finalValue);
  }
  return finalValues;
};

// --- Chart Component ---
const VaRChart = ({ data, initialValue, varValue }: { data: number[], initialValue: number, varValue: number | null }) => {
    const histogramData = useMemo(() => {
        if (!data || data.length === 0) return [];
        const min = Math.min(...data);
        const max = Math.max(...data);
        const bins = 50;
        const binWidth = (max - min) / bins;
        const histogram = Array(bins).fill(0).map((_, i) => ({
            x: min + i * binWidth,
            count: 0,
        }));

        data.forEach(d => {
            const binIndex = Math.min(bins - 1, Math.floor((d - min) / binWidth));
            if (histogram[binIndex]) {
                histogram[binIndex].count++;
            }
        });
        return histogram;
    }, [data]);

    return (
        <ChartContainer config={{}} className="h-[350px] w-full">
            <BarChart data={histogramData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="x" type="number" domain={['dataMin', 'dataMax']} tickFormatter={(val) => `$${(val / 1000).toFixed(0)}k`} name="Portfolio Value" />
                <YAxis name="Frequency" />
                <Tooltip
                    cursor={{ fill: 'hsla(var(--primary), 0.1)' }}
                    content={<ChartTooltipContent
                        labelFormatter={(value) => `Value: $${Number(value).toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
                        formatter={(value, name) => [value, 'Frequency']}
                    />}
                />
                <Bar dataKey="count" fill="hsl(var(--primary))" opacity={0.7} />
                {varValue !== null && (
                    <ReferenceLine x={varValue} stroke="hsl(var(--destructive))" strokeWidth={2}>
                        <RechartsLabel
                            value={`95% VaR: $${varValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
                            position="top"
                            fill="hsl(var(--destructive))"
                            offset={10}
                        />
                    </ReferenceLine>
                )}
                <ReferenceLine x={initialValue} stroke="hsl(var(--foreground))" strokeDasharray="3 3" strokeWidth={2}>
                     <RechartsLabel value="Initial Value" position="top" fill="hsl(var(--foreground))" offset={-50} />
                </ReferenceLine>
            </BarChart>
        </ChartContainer>
    );
}

const DynamicVaRChart = dynamic(() => Promise.resolve(VaRChart), {
  ssr: false,
  loading: () => <Skeleton className="h-[350px] w-full" />,
});

// --- Main Page Component ---
export default function MonteCarloSimulationPage() {
  const [initialValue, setInitialValue] = useState(1_000_000);
  const [mu, setMu] = useState(0.08); // 8% annual return
  const [sigma, setSigma] = useState(0.20); // 20% annual volatility
  const [numSimulations, setNumSimulations] = useState(10000);
  const [simulationResults, setSimulationResults] = useState<number[]>([]);
  const [varResult, setVarResult] = useState<{ value: number; loss: number } | null>(null);

  const handleRunSimulation = () => {
    const results = runMonteCarloSimulation(initialValue, mu, sigma, numSimulations);
    setSimulationResults(results);

    const sortedResults = [...results].sort((a, b) => a - b);
    const varIndex = Math.floor(sortedResults.length * 0.05); // 5th percentile
    const varValue = sortedResults[varIndex];
    setVarResult({
        value: varValue,
        loss: initialValue - varValue
    });
  };

  useEffect(() => {
    handleRunSimulation();
     // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <PageHeader
        title="Monte Carlo Simulation for Risk Management"
        description="Using randomness to quantify the potential losses of a trading portfolio."
        variant="aligned-left"
      />
      <div className="mx-auto max-w-5xl space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline flex items-center gap-2"><Lightbulb className="text-primary"/> The Risk Manager's Story</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-base leading-relaxed text-foreground/90">
            <p>
                Imagine you are a risk manager at a hedge fund. Your team manages a $1,000,000 "Blue Chip Tech" portfolio, holding stocks like Apple, Microsoft, Google, Amazon, NVIDIA, Meta, Tesla, etc. The CEO asks you a simple but crucial question: "How much money could this portfolio lose over the next year in a bad-case scenario?"
            </p>
            <p>
                The future is uncertain. You can't give a single, definitive answer. This is where Monte Carlo simulation comes in. Instead of predicting one future, you simulate thousands of possible futures.
            </p>
            <p>
                First, you analyze historical data to determine the portfolio's overall characteristics: its average annual return (the 'drift') and its annual volatility (the 'randomness'). Then, you use these two numbers to run a simulation that "walks" the portfolio's value forward thousands of times, generating a distribution of all the possible outcomes. This is exactly what the tool below does.
            </p>
          </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle className="font-headline flex items-center gap-2"><ShieldCheck className="text-primary" /> Interactive Value at Risk (VaR) Simulator</CardTitle>
                <CardDescription>You are the risk manager. Adjust the portfolio's expected return and volatility to see how it impacts potential losses.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                    <div className="space-y-2">
                        <Label htmlFor="initial-value">Initial Portfolio Value ($)</Label>
                        <Input id="initial-value" type="number" value={initialValue} onChange={e => setInitialValue(Number(e.target.value))} />
                    </div>
                     <div className="space-y-2">
                        <Label>Expected Annual Return (μ): {(mu * 100).toFixed(1)}%</Label>
                        <Slider value={[mu]} onValueChange={v => setMu(v[0])} min={-0.10} max={0.25} step={0.005} />
                    </div>
                     <div className="space-y-2">
                        <Label>Expected Annual Volatility (σ): {(sigma * 100).toFixed(1)}%</Label>
                        <Slider value={[sigma]} onValueChange={v => setSigma(v[0])} min={0.05} max={0.60} step={0.005} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="num-simulations">Number of Simulations</Label>
                        <Input id="num-simulations" type="number" value={numSimulations} max={50000} step={1000} onChange={e => setNumSimulations(Number(e.target.value))} />
                    </div>
                </div>
                <Button onClick={handleRunSimulation} className="w-full mb-6">Run {numSimulations.toLocaleString()} Simulations</Button>
                
                <DynamicVaRChart data={simulationResults} initialValue={initialValue} varValue={varResult?.value || null} />

                {varResult && (
                     <Alert variant="destructive" className="mt-6 bg-destructive/5">
                        <TrendingDown className="h-4 w-4" />
                        <AlertTitle className="font-headline text-lg">95% Value at Risk (1-Year)</AlertTitle>
                        <AlertDescription className="mt-2 text-base">
                            <p>
                                **Value at Risk (VaR)** is a statistical measure of the risk of loss for an investment or portfolio. It estimates how much a set of investments might lose, given normal market conditions, in a set time period.
                            </p>
                            <p className="mt-2">
                                Based on your {numSimulations.toLocaleString()} simulations, you can report to the CEO: "We are 95% confident that our Blue Chip Tech portfolio will not lose more than <strong>${varResult.loss.toLocaleString(undefined, { maximumFractionDigits: 0 })}</strong> over the next year."
                            </p>
                            <p className="mt-2 text-sm">This corresponds to a worst-case portfolio value of ${varResult.value.toLocaleString(undefined, { maximumFractionDigits: 0 })} at the 5th percentile.</p>
                        </AlertDescription>
                    </Alert>
                )}
            </CardContent>
        </Card>
      </div>
    </>
  );
}
