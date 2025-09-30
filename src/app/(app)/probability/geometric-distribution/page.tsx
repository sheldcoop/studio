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

// --- Math & Simulation Logic ---
const geometricProbability = (p: number, k: number): number => {
    if (k < 1) return 0;
    return Math.pow(1 - p, k - 1) * p;
};

// --- Chart Component ---
const GeometricDistributionChart = ({ p }: { p: number }) => {
  const chartData = useMemo(() => {
    const data = [];
    const limit = Math.ceil(Math.max(15, 3 / p)); // Calculate a reasonable limit for the x-axis
    for (let k = 1; k <= limit; k++) {
      data.push({
        trials: k.toString(),
        probability: geometricProbability(p, k),
      });
    }
    return data;
  }, [p]);

  const mean = 1 / p;
  const variance = (1 - p) / (p * p);

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
         <div className="grid grid-cols-2 text-center text-xs text-muted-foreground mt-4">
            <div>
                Mean (<InlineMath math="\mu = 1/p" />): <span className="font-semibold text-foreground block">{mean.toFixed(2)}</span>
            </div>
            <div>
                Variance (<InlineMath math="\sigma^2 = (1-p)/p^2" />): <span className="font-semibold text-foreground block">{variance.toFixed(2)}</span>
            </div>
        </div>
    </div>
  );
};

const DynamicGeometricDistributionChart = dynamic(() => Promise.resolve(GeometricDistributionChart), {
  ssr: false,
  loading: () => <Skeleton className="h-[300px] w-full" />,
});


// --- Main Page Component ---
export default function GeometricDistributionPage() {
    const [probability, setProbability] = useState(0.25);

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
            <DynamicGeometricDistributionChart p={probability} />
          </CardContent>
        </Card>
      </div>
    </>
  );
}
