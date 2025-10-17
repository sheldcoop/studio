
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
import { binomialProbability } from '@/lib/math';

// --- Main Page Component ---
export default function BinomialDistributionComponent() {
    const [trials, setTrials] = useState(20);
    const [probability, setProbability] = useState(0.5);

    const { chartData, mean, variance } = useMemo(() => {
        const data = [];
        for (let k = 0; k <= trials; k++) {
            data.push({
                successes: k.toString(),
                probability: binomialProbability(trials, k, probability),
            });
        }
        const calculatedMean = trials * probability;
        const calculatedVariance = trials * probability * (1 - probability);

        return { chartData: data, mean: calculatedMean, variance: calculatedVariance };
    }, [trials, probability]);

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
            <DistributionChart 
                chartData={chartData}
                chartType="bar"
                xAxisDataKey="successes"
                yAxisDataKey="probability"
                mean={mean}
                variance={variance}
            />
          </CardContent>
        </Card>
      </div>
    </>
  );
}
