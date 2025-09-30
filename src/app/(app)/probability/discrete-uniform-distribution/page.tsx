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

// --- Chart Component ---
const DiscreteUniformDistributionChart = ({ n }: { n: number }) => {
  const chartData = useMemo(() => {
    const data = [];
    const probability = 1 / n;
    for (let k = 1; k <= n; k++) {
      data.push({
        outcome: k.toString(),
        probability: probability,
      });
    }
    return data;
  }, [n]);

  return (
    <div>
        <ChartContainer config={{}} className="h-[300px] w-full">
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="outcome" name="Outcome (k)" />
                <YAxis name="Probability" domain={[0, 1]} />
                <Tooltip
                    content={<ChartTooltipContent
                        labelFormatter={(label) => `Outcome: ${label}`}
                        formatter={(value) => [Number(value).toFixed(4), 'Probability']}
                    />}
                />
                <Bar dataKey="probability" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            </BarChart>
        </ChartContainer>
    </div>
  );
};

const DynamicDiscreteUniformDistributionChart = dynamic(() => Promise.resolve(DiscreteUniformDistributionChart), {
  ssr: false,
  loading: () => <Skeleton className="h-[300px] w-full" />,
});


// --- Main Page Component ---
export default function DiscreteUniformDistributionPage() {
    const [outcomes, setOutcomes] = useState(6); // n

  return (
    <>
      <PageHeader
        title="Discrete Uniform Distribution"
        description="The simplest scenario in probability: every outcome is equally likely."
        variant="aligned-left"
      />
      <div className="mx-auto max-w-5xl space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">The "Fair Die Roll" Distribution</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-base leading-relaxed text-foreground/90">
            <p>
              The Discrete Uniform distribution describes a situation where there are a finite number of outcomes, and each outcome is equally likely to occur.
            </p>
            <p>
              The most classic example is a single roll of a fair six-sided die. The possible outcomes are {1, 2, 3, 4, 5, 6}, and the probability of rolling any one of these numbers is exactly 1/6. There is no bias towards any particular outcome.
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
                  <BlockMath math="P(X=k) = \frac{1}{n}" />
                </div>
                 <ul className="list-disc pl-6 space-y-2 text-sm mt-4">
                    <li><InlineMath math="k" /> is a specific outcome.</li>
                    <li><InlineMath math="n" /> is the total number of possible outcomes.</li>
                </ul>
            </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Interactive Uniform Distribution</CardTitle>
            <CardDescription>Adjust the number of possible outcomes (<InlineMath math="n" />) to see how the probability changes.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mx-auto max-w-sm mb-6">
                <div className="space-y-3">
                    <Label htmlFor="outcomes-slider">Number of Outcomes (n): {outcomes}</Label>
                    <Slider id="outcomes-slider" min={2} max={20} step={1} value={[outcomes]} onValueChange={(val) => setOutcomes(val[0])} />
                </div>
            </div>
            <DynamicDiscreteUniformDistributionChart n={outcomes} />
          </CardContent>
        </Card>
      </div>
    </>
  );
}
