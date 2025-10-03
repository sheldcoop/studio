
'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
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
import { Lightbulb, TrendingDown, ShieldCheck, Play, Pause, Plus, RefreshCw } from 'lucide-react';
import { ChartTooltipContent } from '@/lib/chart-config';
import { BlockMath } from 'react-katex';
import Link from 'next/link';


// --- Math & Simulation Logic ---
const runMonteCarloStep = (
  initialValue: number,
  mu: number, // Annual return
  sigma: number, // Annual volatility
  simulationsToAdd: number
) => {
  const newFinalValues = [];
  for (let i = 0; i < simulationsToAdd; i++) {
    // This uses a simplified approximation of a standard normal variable for browser performance
    const z = (Math.random() + Math.random() + Math.random() + Math.random() + Math.random() + Math.random() - 3) / Math.sqrt(0.5);
    const drift = (mu - (sigma * sigma) / 2) * 1;
    const diffusion = sigma * z * Math.sqrt(1);
    const finalValue = initialValue * Math.exp(drift + diffusion);
    newFinalValues.push(finalValue);
  }
  return newFinalValues;
};

// --- Chart Component ---
const VaRChart = ({ data, initialValue, varValue }: { data: number[], initialValue: number, varValue: number | null }) => {
    const histogramData = useMemo(() => {
        if (!data || data.length < 20) return []; // Don't render chart until enough data exists
        const min = Math.min(...data);
        const max = Math.max(...data);
        const bins = 50;
        const binWidth = (max - min) / bins;

        if (binWidth === 0) return [];

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
    
    if (data.length < 20) {
        return (
            <div className="h-[350px] w-full flex items-center justify-center text-muted-foreground">
                Run more simulations to build the distribution.
            </div>
        );
    }

    return (
        <ChartContainer config={{}} className="h-[350px] w-full">
            <BarChart data={histogramData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="x" type="number" domain={['dataMin', 'dataMax']} tickFormatter={(val) => `$${(val / 1000).toFixed(0)}k`} name="Portfolio Value" />
                <YAxis name="Frequency" />
                <Tooltip
                    cursor={{ fill: 'hsla(var(--primary), 0.1)' }}
                    content={<ChartTooltipContent
                        labelFormatter={(value: number) => `Value: $${Number(value).toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
                        formatter={(value: number, name: string) => [value, 'Frequency']}
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
  
  const [simulationResults, setSimulationResults] = useState<number[]>([]);
  const [varResult, setVarResult] = useState<{ value: number; loss: number } | null>(null);

  const [isSimulating, setIsSimulating] = useState(false);
  const simulationRef = useRef<NodeJS.Timeout | null>(null);
  const SIMULATION_CAP = 50000;

  const addSimulations = (count: number) => {
    const newResults = runMonteCarloStep(initialValue, mu, sigma, count);
    setSimulationResults(prev => [...prev, ...newResults].slice(0, SIMULATION_CAP));
  };

  const resetSimulation = () => {
    if (simulationRef.current) {
        clearInterval(simulationRef.current);
    }
    setIsSimulating(false);
    setSimulationResults([]);
    setVarResult(null);
  };

  // Live simulation effect
  useEffect(() => {
    if (isSimulating && simulationResults.length < SIMULATION_CAP) {
        simulationRef.current = setInterval(() => {
            addSimulations(250);
        }, 50);
    } else if (simulationRef.current) {
        clearInterval(simulationRef.current);
        if (isSimulating) setIsSimulating(false);
    }
    return () => {
        if (simulationRef.current) clearInterval(simulationRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSimulating, simulationResults.length, initialValue, mu, sigma]);


  // Recalculate VaR when results change
  useEffect(() => {
    if (simulationResults.length > 20) {
        const sortedResults = [...simulationResults].sort((a, b) => a - b);
        const varIndex = Math.floor(sortedResults.length * 0.05); // 5th percentile
        const varValue = sortedResults[varIndex];
        setVarResult({
            value: varValue,
            loss: initialValue - varValue
        });
    } else {
        setVarResult(null);
    }
  }, [simulationResults, initialValue]);


  return (
    <>
      <div className="mx-auto max-w-5xl space-y-8">
        <PageHeader
          title="Monte Carlo Simulation for Risk Management"
          description="Using randomness to quantify the potential losses of a trading portfolio."
          variant="aligned-left"
        />
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
                First, you analyze historical data to determine the portfolio's overall characteristics: its average annual return (the 'drift' or $\\mu$) and its annual volatility (the 'randomness' or $\\sigma$). Then, you use these two numbers to run a simulation that "walks" the portfolio's value forward thousands of times, generating a distribution of all the possible outcomes. This is exactly what the tool below does.
            </p>
          </CardContent>
        </Card>
        
        <Card>
            <CardHeader>
                <CardTitle className="font-headline">The Math Behind the Magic</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                 <p className="text-muted-foreground">Each simulated path follows a model called Geometric Brownian Motion, a standard way to model stock prices. The formula for the portfolio's value at the end of the period is:</p>
                <div className="rounded-lg border bg-muted/50 p-4 text-center">
                    <BlockMath
                        math="\begin{aligned} S_T = S_0 \\exp\\left( \\left(\\mu - \\frac{\\sigma^2}{2}\\right)T + \\sigma Z \\sqrt{T} \\right) \\end{aligned}"
                    />
                </div>
                 <p className="text-muted-foreground">Once we have thousands of simulated final values ($S_T$), we can calculate the 95% VaR by finding the 5th percentile of our results. This is the value that separates the worst 5% of outcomes from the best 95%.</p>
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle className="font-headline flex items-center gap-2"><ShieldCheck className="text-primary" /> Interactive Value at Risk (VaR) Simulator</CardTitle>
                <CardDescription>You are the risk manager. Adjust the portfolio's expected return and volatility to see how it impacts potential losses.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                    <div className="space-y-2">
                        <Label>Initial Portfolio Value ($)</Label>
                        <Input type="number" value={initialValue} onChange={e => setInitialValue(Number(e.target.value))} disabled={isSimulating} />
                    </div>
                     <div className="space-y-2">
                        <Label>Expected Annual Return ($\mu$): {(mu * 100).toFixed(1)}%</Label>
                        <Slider value={[mu]} onValueChange={v => setMu(v[0])} min={-0.10} max={0.25} step={0.005} disabled={isSimulating} />
                    </div>
                     <div className="space-y-2">
                        <Label>Expected Annual Volatility ($\sigma$): {(sigma * 100).toFixed(1)}%</Label>
                        <Slider value={[sigma]} onValueChange={v => setSigma(v[0])} min={0.05} max={0.60} step={0.005} disabled={isSimulating}/>
                    </div>
                </div>
                
                <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center mb-6">
                    <div className="flex gap-2">
                        <Button onClick={() => addSimulations(1000)} disabled={isSimulating || simulationResults.length >= SIMULATION_CAP}><Plus className="h-4 w-4 mr-2" /> 1k</Button>
                        <Button onClick={() => addSimulations(5000)} disabled={isSimulating || simulationResults.length >= SIMULATION_CAP}><Plus className="h-4 w-4 mr-2" /> 5k</Button>
                    </div>
                    <Button onClick={() => setIsSimulating(prev => !prev)} variant={isSimulating ? "destructive" : "default"} disabled={simulationResults.length >= SIMULATION_CAP}>
                        {isSimulating ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
                        {isSimulating ? 'Pause Simulation' : 'Run Simulation'}
                    </Button>
                    <Button onClick={resetSimulation} variant="outline"><RefreshCw className="h-4 w-4 mr-2" /> Reset</Button>
                </div>
                
                <DynamicVaRChart data={simulationResults} initialValue={initialValue} varValue={varResult?.value || null} />
                
                 <div className="mt-4 text-center text-sm text-muted-foreground">
                    <p>Total Simulations: <span className="font-bold text-lg text-foreground">{simulationResults.length.toLocaleString()}</span> / {SIMULATION_CAP.toLocaleString()}</p>
                </div>

                {varResult && (
                     <Alert variant="destructive" className="mt-6">
                        <TrendingDown className="h-4 w-4" />
                        <AlertTitle className="font-headline text-lg">95% Value at Risk (1-Year)</AlertTitle>
                        <AlertDescription className="mt-2 text-base">
                            <p>
                                **Value at Risk (VaR)** is a statistical measure of the risk of loss for an investment or portfolio. It estimates how much a set of investments might lose, given normal market conditions, in a set time period.
                            </p>
                            <p className="mt-2">
                                Based on your {simulationResults.length.toLocaleString()} simulations, you can report to the CEO: "We are 95% confident that our Blue Chip Tech portfolio will not lose more than <strong>${varResult.loss.toLocaleString(undefined, { maximumFractionDigits: 0 })}</strong> over the next year."
                            </p>
                            <p className="mt-2 text-sm">This corresponds to a worst-case portfolio value of ${varResult.value.toLocaleString(undefined, { maximumFractionDigits: 0 })} at the 5th percentile.</p>
                        </AlertDescription>
                    </Alert>
                )}
            </CardContent>
        </Card>
        <Card>
            <CardHeader>
                <CardTitle className="font-headline">Convergence and the Law of Large Numbers</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <p className="text-muted-foreground">This simulation is a direct application of the <Link href="/topics/law-of-large-numbers" className="text-primary hover:underline">Law of Large Numbers</Link>. Notice how when you run the simulation, the calculated VaR value might jump around a lot at first. As the number of simulations increases, the distribution becomes smoother and the VaR estimate converges towards a stable value.</p>
                <p className="text-muted-foreground">This is why a high number of simulations is crucial. A simulation with only 100 paths is unreliable, but a simulation with 50,000 paths gives a much more robust and trustworthy estimate of the true risk.</p>
            </CardContent>
        </Card>
      </div>
    </>
  );
}
