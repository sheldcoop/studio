
'use client';

import { useState, useMemo } from 'react';
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
import { DistributionChart } from '@/components/quantlab/DistributionChart';
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import { hypergeometricProbability } from '@/lib/math';

// --- Main Page Component ---
export default function HypergeometricDistributionComponent() {
    const [N, setN] = useState(52); // Population size
    const [K, setK] = useState(13);   // Number of successes in population
    const [n, setn] = useState(5);   // Sample size

    const { chartData, mean } = useMemo(() => {
        const data = [];
        const min_k = Math.max(0, n - (N - K));
        const max_k = Math.min(n, K);
        for (let k = min_k; k <= max_k; k++) {
            data.push({
                successes: k.toString(),
                probability: hypergeometricProbability(N, K, n, k),
            });
        }
        const calculatedMean = n * (K / N);
        return { chartData: data, mean: calculatedMean };
    }, [N, K, n]);

  return (
    <>
      <PageHeader
        title="Hypergeometric Distribution"
        description="Modeling the probability of successes in a sample drawn without replacement."
        variant="aligned-left"
      />
      <div className="mx-auto max-w-5xl space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">The "Drawing from a Deck" Distribution</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-base leading-relaxed text-foreground/90">
            <p>
              The Hypergeometric distribution is used when you are sampling from a finite population without replacement. This is a key difference from the Binomial distribution, where each trial is independent.
            </p>
            <p>
              The classic example is drawing cards from a deck. If you draw a 5-card hand, what's the probability of getting exactly 2 spades? In finance, this can model credit risk in a portfolio of bonds: if you have a portfolio of 100 bonds and know that 5 will default, what is the probability that if you randomly select 10 bonds, exactly 1 of them will be a defaulter?
            </p>
          </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle className="font-headline">The Formula</CardTitle>
                 <CardDescription>The probability of getting <InlineMath math="k" /> successes in a sample of size <InlineMath math="n" /> is:</CardDescription>
            </CardHeader>
            <CardContent>
                 <div className="rounded-lg border bg-muted/50 p-4 text-center">
                  <BlockMath math="P(X=k) = \frac{\binom{K}{k} \binom{N-K}{n-k}}{\binom{N}{n}}" />
                </div>
                 <ul className="list-disc pl-6 space-y-2 text-sm mt-4">
                    <li><InlineMath math="N" /> is the total population size.</li>
                    <li><InlineMath math="K" /> is the total number of "success" items in the population.</li>
                    <li><InlineMath math="n" /> is the size of the sample drawn.</li>
                    <li><InlineMath math="k" /> is the number of "successes" in the sample.</li>
                </ul>
            </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Interactive Hypergeometric Distribution</CardTitle>
            <CardDescription>Adjust the parameters of the population and sample to see how the probabilities change.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">
                <div className="space-y-3">
                    <Label htmlFor="N-slider">Population Size (N): {N}</Label>
                    <Slider id="N-slider" min={10} max={200} step={1} value={[N]} onValueChange={(val) => setN(val[0])} />
                </div>
                 <div className="space-y-3">
                    <Label htmlFor="K-slider">Population Successes (K): {K}</Label>
                    <Slider id="K-slider" min={1} max={N} step={1} value={[K]} onValueChange={(val) => setK(val[0])} />
                </div>
                <div className="space-y-3">
                    <Label htmlFor="n-slider">Sample Size (n): {n}</Label>
                    <Slider id="n-slider" min={1} max={N} step={1} value={[n]} onValueChange={(val) => setn(val[0])} />
                </div>
            </div>
            <DistributionChart
                chartData={chartData}
                chartType="bar"
                xAxisDataKey="successes"
                yAxisDataKey="probability"
                mean={mean}
            />
          </CardContent>
        </Card>
      </div>
    </>
  );
}
