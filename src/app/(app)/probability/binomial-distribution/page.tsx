
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
import Script from 'next/script';

// --- Math & Simulation Logic ---
const factorial = (n: number): number => (n <= 1 ? 1 : n * factorial(n - 1));
const combinations = (n: number, k: number): number => {
    if (k < 0 || k > n) {
        return 0;
    }
    return factorial(n) / (factorial(k) * factorial(n - k));
}

const binomialProbability = (n: number, k: number, p: number): number => {
    return combinations(n, k) * Math.pow(p, k) * Math.pow(1 - p, n - k);
}

// --- Chart Component ---
const BinomialDistributionChart = ({ numTrials, probSuccess }: { numTrials: number; probSuccess: number }) => {
  const { chartData, mean, stdDev } = useMemo(() => {
    const data = [];
    for (let k = 0; k <= numTrials; k++) {
      data.push({
        successes: k.toString(),
        probability: binomialProbability(numTrials, k, probSuccess),
      });
    }
    const calculatedMean = numTrials * probSuccess;
    const calculatedStdDev = Math.sqrt(numTrials * probSuccess * (1 - probSuccess));
    return { chartData: data, mean: calculatedMean, stdDev: calculatedStdDev };
  }, [numTrials, probSuccess]);

  return (
    <div>
        <ChartContainer config={{}} className="h-[300px] w-full">
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="successes" name="Number of Successes" />
                <YAxis name="Probability" domain={[0, 'dataMax']} />
                <Tooltip
                    content={<ChartTooltipContent
                        labelFormatter={(label) => `Successes: ${label}`}
                        formatter={(value, name) => [Number(value).toFixed(4), 'Probability']}
                    />}
                />
                <Bar dataKey="probability" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            </BarChart>
        </ChartContainer>
         <div className="grid grid-cols-2 text-center text-xs text-muted-foreground mt-4">
            <div>
                Expected Value (μ = np): <span className="font-semibold text-foreground block">{mean.toFixed(2)}</span>
            </div>
            <div>
                Standard Deviation (σ): <span className="font-semibold text-foreground block">{stdDev.toFixed(2)}</span>
            </div>
        </div>
    </div>
  );
};

const DynamicBinomialDistributionChart = dynamic(() => Promise.resolve(BinomialDistributionChart), {
  ssr: false,
  loading: () => <Skeleton className="h-[300px] w-full" />,
});


// --- Main Page Component ---
export default function BinomialDistributionPage() {
    const [numTrials, setNumTrials] = useState(10);
    const [probSuccess, setProbSuccess] = useState(0.5);

  return (
    <>
       <Script
        id="mathjax-config"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.MathJax = {
              tex: {
                inlineMath: [['$', '$'], ['\\(', '\\)']],
                displayMath: [['$$', '$$'], ['\\[', '\\]']],
              },
              svg: {
                fontCache: 'global'
              }
            };
          `,
        }}
      />
      <Script
        src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-svg.js"
        strategy="afterInteractive"
        id="mathjax-script"
      />
      <PageHeader
        title="Binomial Distribution"
        description="Modeling the number of successes in a fixed number of independent trials."
        variant="aligned-left"
      />
      <div className="mx-auto max-w-5xl space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">The Coin Flip Distribution</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-base leading-relaxed text-foreground/90">
            <p>
                The Binomial Distribution is a fundamental concept in probability that helps us model scenarios where there are a fixed number of independent trials, each with only two possible outcomes: "success" or "failure".
            </p>
            <p>
              Think of it as a generalized coin flip. If you flip a coin 10 times, what's the probability of getting exactly 7 heads? What about 0 heads? The binomial distribution answers these questions. In finance, this can be used to model things like the number of "up" days in a month or the number of default events in a portfolio of bonds.
            </p>
          </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle className="font-headline">The Formula</CardTitle>
                 <CardDescription>The probability of getting exactly 'k' successes in 'n' trials is given by:</CardDescription>
            </CardHeader>
            <CardContent>
                 <div className="rounded-lg border bg-muted/50 p-4 text-center">
                  $$P(X=k) = \\binom{n}{k} p^k (1-p)^{n-k}$$
                </div>
                 <ul className="list-disc pl-6 space-y-2 text-sm mt-4">
                    <li><code className="font-mono bg-background px-1 rounded">$\\binom{n}{k}$</code> is the number of combinations, "n choose k".</li>
                    <li><code className="font-mono bg-background px-1 rounded">$n$</code> is the number of trials.</li>
                    <li><code className="font-mono bg-background px-1 rounded">$k$</code> is the number of successes.</li>
                    <li><code className="font-mono bg-background px-1 rounded">$p$</code> is the probability of a single success.</li>
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
                    <Label htmlFor="trials-slider">Number of Trials (n): {numTrials}</Label>
                    <Slider id="trials-slider" min={1} max={50} step={1} value={[numTrials]} onValueChange={(val) => setNumTrials(val[0])} />
                </div>
                <div className="space-y-3">
                    <Label htmlFor="prob-slider">Probability of Success (p): {probSuccess.toFixed(2)}</Label>
                    <Slider id="prob-slider" min={0.01} max={0.99} step={0.01} value={[probSuccess]} onValueChange={(val) => setProbSuccess(val[0])} />
                </div>
            </div>
            <DynamicBinomialDistributionChart numTrials={numTrials} probSuccess={probSuccess} />
          </CardContent>
        </Card>
      </div>
    </>
  );
}
