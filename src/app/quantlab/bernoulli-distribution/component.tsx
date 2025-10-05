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
const bernoulliProbability = (p: number, k: number): number => {
    if (k === 1) return p;
    if (k === 0) return 1 - p;
    return 0;
};

// --- Chart Component ---
const BernoulliDistributionChart = ({ p }: { p: number }) => {
  const chartData = useMemo(() => {
    return [
      { outcome: 'Failure (k=0)', probability: bernoulliProbability(p, 0) },
      { outcome: 'Success (k=1)', probability: bernoulliProbability(p, 1) },
    ];
  }, [p]);

  return (
    <div>
        <ChartContainer config={{}} className="h-[300px] w-full">
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="outcome" />
                <YAxis name="Probability" domain={[0, 1]} />
                <Tooltip
                    content={<ChartTooltipContent
                        formatter={(value) => [Number(value).toFixed(4), 'Probability']}
                    />}
                />
                <Bar dataKey="probability" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            </BarChart>
        </ChartContainer>
    </div>
  );
};

const DynamicBernoulliDistributionChart = dynamic(() => Promise.resolve(BernoulliDistributionChart), {
  ssr: false,
  loading: () => <Skeleton className="h-[300px] w-full" />,
});


// --- Main Page Component ---
export default function BernoulliDistributionComponent() {
    const [probability, setProbability] = useState(0.7);

  return (
    <>
      <PageHeader
        title="Bernoulli Distribution"
        description="The fundamental building block of discrete probability, modeling a single trial with two outcomes."
        variant="aligned-left"
      />
      <div className="mx-auto max-w-5xl space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">The "Single Coin Flip"</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-base leading-relaxed text-foreground/90">
            <p>
              The Bernoulli distribution is the simplest of all discrete distributions. It models a single event or trial that has only two possible outcomes: a "success" or a "failure".
            </p>
            <p>
              Think of it as a single coin flip (Heads or Tails), a single trade (Win or Loss), or a single bond (Default or No Default). The entire distribution is described by a single parameter, <InlineMath math="p" />, which is the probability of success.
            </p>
          </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle className="font-headline">The Formula</CardTitle>
                 <CardDescription>The probability mass function (PMF) is:</CardDescription>
            </CardHeader>
            <CardContent>
                 <div className="rounded-lg border bg-muted/50 p-4 text-center">
                  <BlockMath math="P(X=k) = p^k (1-p)^{1-k} \quad \text{for } k \in \{0, 1\}" />
                </div>
                 <ul className="list-disc pl-6 space-y-2 text-sm mt-4">
                    <li>If <InlineMath math="k=1" /> (success), the formula becomes <InlineMath math="p" />.</li>
                    <li>If <InlineMath math="k=0" /> (failure), the formula becomes <InlineMath math="1-p" />.</li>
                </ul>
            </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Interactive Bernoulli Trial</CardTitle>
            <CardDescription>Adjust the probability of success (<InlineMath math="p" />) to see how it affects the outcome probabilities.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mx-auto max-w-sm mb-6">
                <div className="space-y-3">
                    <Label htmlFor="prob-slider">Probability of Success (p): {probability.toFixed(2)}</Label>
                    <Slider id="prob-slider" min={0} max={1} step={0.01} value={[probability]} onValueChange={(val) => setProbability(val[0])} />
                </div>
            </div>
            <DynamicBernoulliDistributionChart p={probability} />
          </CardContent>
        </Card>
      </div>
    </>
  );
}
