
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
import { negativeBinomialProbability } from '@/lib/math';

// --- Main Page Component ---
export default function NegativeBinomialDistributionComponent() {
    const [successes, setSuccesses] = useState(5); // r
    const [probability, setProbability] = useState(0.5); // p

    const { chartData, mean, variance } = useMemo(() => {
        const data = [];
        const meanCalc = successes / probability;
        const varianceCalc = successes * (1 - probability) / (probability * probability);
        const limit = Math.ceil(Math.max(20, meanCalc + 3 * Math.sqrt(varianceCalc)));

        for (let k = successes; k <= limit; k++) {
            data.push({
                trials: k.toString(),
                probability: negativeBinomialProbability(successes, probability, k),
            });
        }
        return { chartData: data, mean: meanCalc, variance: varianceCalc };
    }, [successes, probability]);

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
            <DistributionChart
                chartData={chartData}
                chartType="bar"
                xAxisDataKey="trials"
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
