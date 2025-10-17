
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
import { geometricProbability } from '@/lib/math';

// --- Main Page Component ---
export default function GeometricDistributionComponent() {
    const [probability, setProbability] = useState(0.25);

    const { chartData, mean, variance } = useMemo(() => {
        const data = [];
        const limit = Math.ceil(Math.max(15, 3 / probability));
        for (let k = 1; k <= limit; k++) {
            data.push({
                trials: k.toString(),
                probability: geometricProbability(probability, k),
            });
        }
        const calculatedMean = 1 / probability;
        const calculatedVariance = (1 - probability) / (probability * probability);
        return { chartData: data, mean: calculatedMean, variance: calculatedVariance };
    }, [probability]);

  return (
    <>
      <PageHeader
        title="Geometric Distribution"
        description="Modeling the number of trials needed to get the first success."
        variant="aligned-left"
      />
      <div className="mx-auto max-w-5xl space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">"How Long Until It Hits?"</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-base leading-relaxed text-foreground/90">
            <p>
              The Geometric distribution answers the question: "How many times do I have to try until I get my first success?" It models the number of independent Bernoulli trials required to achieve the first success.
            </p>
            <p>
              In finance, this could model the number of trades you need to make until you have your first profitable one, or how many quarters it will take for a startup in your portfolio to finally turn a profit. It's always right-skewed, because a small number of trials is always more likely than a large number.
            </p>
          </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle className="font-headline">The Formula</CardTitle>
                 <CardDescription>The probability that the first success occurs on the <InlineMath math="k" />-th trial is:</CardDescription>
            </CardHeader>
            <CardContent>
                 <div className="rounded-lg border bg-muted/50 p-4 text-center">
                  <BlockMath math="P(X=k) = (1-p)^{k-1}p" />
                </div>
                 <ul className="list-disc pl-6 space-y-2 text-sm mt-4">
                    <li><InlineMath math="k" /> is the number of trials (must be 1, 2, 3, ...).</li>
                    <li><InlineMath math="p" /> is the probability of success on a single trial.</li>
                </ul>
            </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Interactive Geometric Distribution</CardTitle>
            <CardDescription>Adjust the probability of success (<InlineMath math="p" />) to see how it affects the likelihood of achieving the first success on a given trial.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mx-auto max-w-sm mb-6">
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
