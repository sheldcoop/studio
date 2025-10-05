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
    if (k < 0 || k > n) return 0;
    if (k === 0 || k === n) return 1;
    if (k > n / 2) k = n - k;
    let res = 1;
    for (let i = 1; i <= k; i++) {
        res = res * (n - i + 1) / i;
    }
    return res;
};

const negativeBinomialProbability = (r: number, p: number, k: number): number => {
    if (k < r) return 0;
    return combinations(k - 1, r - 1) * Math.pow(p, r) * Math.pow(1 - p, k - r);
};

// --- Chart Component ---
const NegativeBinomialDistributionChart = ({ r, p }: { r: number; p: number }) => {
  const chartData = useMemo(() => {
    const data = [];
    // Calculate a reasonable upper limit for k
    const mean = r / p;
    const variance = r * (1-p) / (p*p);
    const limit = Math.ceil(mean + 3 * Math.sqrt(variance));
    for (let k = r; k <= limit; k++) {
      data.push({
        trials: k.toString(),
        probability: negativeBinomialProbability(r, p, k),
      });
    }
    return data;
  }, [r, p]);

  return (
    <div>
        <ChartContainer config={{}} className="h-[300px] w-full">
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="trials" name="Number of Trials (k)" />
                <YAxis name="Probability" domain={[0, 'dataMax']} />
                <Tooltip
                    content={<ChartTooltipContent
                        labelFormatter={(label) => `Trials: ${label}`}
                        formatter={(value) => [Number(value).toFixed(4), 'Probability']}
                    />}
                />
                <Bar dataKey="probability" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            </BarChart>
        </ChartContainer>
    </div>
  );
};

const DynamicNegativeBinomialDistributionChart = dynamic(() => Promise.resolve(NegativeBinomialDistributionChart), {
  ssr: false,
  loading: () => <Skeleton className="h-[300px] w-full" />,
});


// --- Main Page Component ---
export default function NegativeBinomialDistributionComponent() {
    const [successes, setSuccesses] = useState(5); // r
    const [probability, setProbability] = useState(0.5); // p

  return (
    <>
      <PageHeader
        title="Negative Binomial Distribution"
        description="Modeling the number of trials needed to achieve a specified number of successes."
        variant="aligned-left"
      />
      <div className="mx-auto max-w-5xl space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">A Generalization of the Geometric Distribution</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-base leading-relaxed text-foreground/90">
            <p>
              The Negative Binomial distribution answers the question: "How many trials will it take to get my <InlineMath math="r" />-th success?" It is a generalization of the Geometric distribution, which is just the special case where <InlineMath math="r=1" />.
            </p>
            <p>
              In finance, a trader might use this to model how many trades it will take to achieve 10 winning trades. A venture capitalist could model how many startups they need to fund to get 3 successful exits.
            </p>
          </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle className="font-headline">The Formula</CardTitle>
                 <CardDescription>The probability that the <InlineMath math="r" />-th success occurs on the <InlineMath math="k" />-th trial is:</CardDescription>
            </CardHeader>
            <CardContent>
                 <div className="rounded-lg border bg-muted/50 p-4 text-center">
                  <BlockMath math="P(X=k) = \binom{k-1}{r-1} p^r (1-p)^{k-r}" />
                </div>
                 <ul className="list-disc pl-6 space-y-2 text-sm mt-4">
                    <li><InlineMath math="k" /> is the total number of trials.</li>
                    <li><InlineMath math="r" /> is the desired number of successes.</li>
                    <li><InlineMath math="p" /> is the probability of success on a single trial.</li>
                </ul>
            </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Interactive Negative Binomial Distribution</CardTitle>
            <CardDescription>Adjust the required number of successes (<InlineMath math="r" />) and the probability (<InlineMath math="p" />) to see how the distribution changes.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
                <div className="space-y-3">
                    <Label htmlFor="successes-slider">Number of Successes (r): {successes}</Label>
                    <Slider id="successes-slider" min={1} max={50} step={1} value={[successes]} onValueChange={(val) => setSuccesses(val[0])} />
                </div>
                <div className="space-y-3">
                    <Label htmlFor="prob-slider">Probability of Success (p): {probability.toFixed(2)}</Label>
                    <Slider id="prob-slider" min={0.01} max={0.99} step={0.01} value={[probability]} onValueChange={(val) => setProbability(val[0])} />
                </div>
            </div>
            <DynamicNegativeBinomialDistributionChart r={successes} p={probability} />
          </CardContent>
        </Card>
      </div>
    </>
  );
}
