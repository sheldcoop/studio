'use client';

import { useState, useMemo } from 'react';
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
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
import { Skeleton } from '@/components/ui/skeleton';
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';


// --- Math & Simulation Logic ---
const combinations = (n: number, k: number): number => {
    if (k < 0 || k > n) {
        return 0;
    }
    if (k === 0 || k === n) {
        return 1;
    }
    if (k > n / 2) {
        k = n - k;
    }
    let res = 1;
    for (let i = 1; i <= k; i++) {
        res = res * (n - i + 1) / i;
    }
    return res;
};

const binomialProbability = (n: number, k: number, p: number): number => {
    return combinations(n, k) * Math.pow(p, k) * Math.pow(1 - p, n - k);
};


// --- Chart Component ---
const BinomialDistributionChart = ({ n, p }: { n: number; p: number }) => {
  const chartData = useMemo(() => {
    const data = [];
    for (let k = 0; k <= n; k++) {
      data.push({
        successes: k.toString(),
        probability: binomialProbability(n, k, p),
      });
    }
    return data;
  }, [n, p]);

  const mean = n * p;
  const variance = n * p * (1 - p);

  return (
    <div>
        <ChartContainer config={{}} className="h-[300px] w-full">
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="successes" name="Number of Successes (k)" />
                <YAxis name="Probability" domain={[0, 'dataMax']} />
                <Tooltip
                    content={<ChartTooltipContent
                        labelFormatter={(label) => `Successes: ${label}`}
                        formatter={(value) => [Number(value).toFixed(4), 'Probability']}
                    />}
                />
                <Bar dataKey="probability" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            </BarChart>
        </ChartContainer>
         <div className="grid grid-cols-2 text-center text-xs text-muted-foreground mt-4">
            <div>
                Mean (μ = np): <span className="font-semibold text-foreground block">{mean.toFixed(2)}</span>
            </div>
            <div>
                Variance (σ² = np(1-p)): <span className="font-semibold text-foreground block">{variance.toFixed(2)}</span>
            </div>
        </div>
    </div>
  );
};

const DynamicBinomialDistributionChart = dynamic(() => Promise.resolve(BinomialDistributionChart), {
  ssr: false,
  loading: () => <Skeleton className="h-[340px] w-full" />,
});


// --- Main Page Component ---
export default function BinomialDistributionComponent() {
    const [trials, setTrials] = useState(20);
    const [probability, setProbability] = useState(0.5);

  return (
    <>
      <PageHeader
        title="Binomial Distribution"
        description="Modeling the number of successes in a sequence of independent trials."
        variant="aligned-left"
      />
      <div className="mx-auto max-w-5xl space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">The "Coin Flip" Distribution</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-base leading-relaxed text-foreground/90">
            <p>
              The Binomial Distribution is a discrete probability distribution that models the number of successes in a fixed number of independent 'Bernoulli' trials, where each trial has only two possible outcomes: success or failure.
            </p>
            <p>
              Think of flipping a coin 10 times and counting the number of heads. In finance, this could model the number of winning trades in a month (where each trade is a trial), or the number of portfolio companies that meet their earnings target in a quarter.
            </p>
          </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle className="font-headline">The Formula</CardTitle>
                 <CardDescription>The probability of observing exactly 'k' successes in 'n' trials is:</CardDescription>
            </CardHeader>
            <CardContent>
                 <div className="rounded-lg border bg-muted/50 p-4 text-center">
                  <BlockMath math="P(X=k) = \binom{n}{k} p^k (1-p)^{n-k}" />
                </div>
                 <ul className="list-disc pl-6 space-y-2 text-sm mt-4">
                    <li><InlineMath math="\binom{n}{k}" /> is the number of combinations, "n choose k".</li>
                    <li><InlineMath math="n" /> is the number of trials.</li>
                    <li><InlineMath math="k" /> is the number of successes.</li>
                    <li><InlineMath math="p" /> is the probability of success on a single trial.</li>
                </ul>
            </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Interactive Binomial Distribution</CardTitle>
            <CardDescription>Adjust the number of trials (n) and the probability of success (p) to see how the shape of the distribution changes.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
                <div className="space-y-3">
                    <Label htmlFor="trials-slider">Number of Trials (n): {trials}</Label>
                    <Slider id="trials-slider" min={1} max={100} step={1} value={[trials]} onValueChange={(val) => setTrials(val[0])} />
                </div>
                <div className="space-y-3">
                    <Label htmlFor="prob-slider">Probability of Success (p): {probability.toFixed(2)}</Label>
                    <Slider id="prob-slider" min={0.01} max={0.99} step={0.01} value={[probability]} onValueChange={(val) => setProbability(val[0])} />
                </div>
            </div>
            <DynamicBinomialDistributionChart n={trials} p={probability} />
          </CardContent>
        </Card>
      </div>
    </>
  );
}
