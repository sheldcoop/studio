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
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { FormulaBlock } from '@/components/app/formula-block';
import { DistributionChart } from '@/components/quantlab/DistributionChart';

// --- Math & Simulation Logic ---
const bernoulliProbability = (p: number, k: number): number => {
    if (k === 1) return p;
    if (k === 0) return 1 - p;
    return 0;
};

// --- Main Page Component ---
export default function BernoulliDistributionPage() {
    const [probability, setProbability] = useState(0.7);

    const { chartData, mean, variance } = useMemo(() => {
        const data = [
          { outcome: 'Failure (k=0)', probability: bernoulliProbability(probability, 0) },
          { outcome: 'Success (k=1)', probability: bernoulliProbability(probability, 1) },
        ];
        return {
            chartData: data,
            mean: probability,
            variance: probability * (1-probability)
        };
    }, [probability]);

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
            <DistributionChart 
                chartData={chartData}
                chartType="bar"
                xAxisDataKey="outcome"
                yAxisDataKey="probability"
                mean={mean}
                variance={variance}
            />
          </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle className="font-headline">Probability Mass Function (PMF)</CardTitle>
                 <CardDescription>The PMF gives the probability that the random variable <InlineMath math="X" /> is exactly equal to some value <InlineMath math="k" />. For a Bernoulli trial, <InlineMath math="k" /> can only be 0 (failure) or 1 (success).</CardDescription>
            </CardHeader>
            <CardContent>
                 <FormulaBlock>
                  <BlockMath math="P(X=k) = p^k (1-p)^{1-k} \quad \text{for } k \in \{0, 1\}" />
                </FormulaBlock>
                 <ul className="list-disc pl-6 space-y-2 text-sm mt-4">
                    <li>If <InlineMath math="k=1" /> (success), the formula becomes <InlineMath math="P(X=1) = p^1(1-p)^{1-1} = p \cdot 1 = p" />.</li>
                    <li>If <InlineMath math="k=0" /> (failure), the formula becomes <InlineMath math="P(X=0) = p^0(1-p)^{1-0} = 1 \cdot (1-p) = 1-p" />.</li>
                </ul>
                <p className="text-sm text-muted-foreground mt-2">The interactive chart above is a direct visualization of this PMF.</p>
            </CardContent>
        </Card>
        
        <Card>
            <CardHeader>
                <CardTitle className="font-headline">Cumulative Distribution Function (CDF)</CardTitle>
                 <CardDescription>The CDF gives the probability that the random variable <InlineMath math="X" /> is less than or equal to some value <InlineMath math="x" />. It's a running total of the PMF.</CardDescription>
            </CardHeader>
            <CardContent>
                 <FormulaBlock>
                  <BlockMath math="F(x) = P(X \le x)" />
                </FormulaBlock>
                <Table className="mt-4">
                    <TableHeader>
                        <TableRow>
                            <TableHead>Value of <InlineMath math="x" /></TableHead>
                            <TableHead>CDF: <InlineMath math="F(x) = P(X \le x)" /></TableHead>
                            <TableHead>Explanation</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <TableRow>
                            <TableCell><InlineMath math="x < 0" /></TableCell>
                            <TableCell><InlineMath math="0" /></TableCell>
                            <TableCell>The outcome cannot be less than 0.</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell><InlineMath math="0 \le x < 1" /></TableCell>
                            <TableCell><InlineMath math="1-p" /></TableCell>
                            <TableCell>The only possible value in this range is 0.</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell><InlineMath math="x \ge 1" /></TableCell>
                            <TableCell><InlineMath math="1" /></TableCell>
                            <TableCell>Includes both outcomes 0 and 1, so probability is <InlineMath math="(1-p) + p = 1" />.</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
        
        <Card>
            <CardHeader>
                <CardTitle className="font-headline">Expected Value (Mean)</CardTitle>
                <CardDescription>The expected value is the long-run average outcome of the trial.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <p>The formula for the expected value of a discrete random variable is the sum of each outcome multiplied by its probability:</p>
                <FormulaBlock>
                    <BlockMath math="E[X] = \sum_{k} k \cdot P(X=k)" />
                </FormulaBlock>
                <p>For the Bernoulli distribution, our outcomes (<InlineMath math="k" />) are 0 and 1:</p>
                <BlockMath math="E[X] = (0 \cdot P(X=0)) + (1 \cdot P(X=1))" />
                <BlockMath math="E[X] = (0 \cdot (1-p)) + (1 \cdot p)" />
                <BlockMath math="E[X] = 0 + p" />
                <FormulaBlock>
                    <BlockMath math="E[X] = p" />
                </FormulaBlock>
                <p className="text-sm text-muted-foreground">This makes intuitive sense: if a trade has a 70% (<InlineMath math="p=0.7" />) chance of success, the expected outcome of a single trial is 0.7.</p>
            </CardContent>
        </Card>
        
         <Card>
            <CardHeader>
                <CardTitle className="font-headline">Variance</CardTitle>
                <CardDescription>The variance measures the "spread" or "risk" of the outcome.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <p>The formula for variance is <InlineMath math="Var(X) = E[X^2] - (E[X])^2" />. We already know <InlineMath math="E[X] = p" />, so we first need to find <InlineMath math="E[X^2]" />.</p>
                <FormulaBlock>
                    <BlockMath math="E[X^2] = \sum_{k} k^2 \cdot P(X=k)" />
                </FormulaBlock>
                <BlockMath math="E[X^2] = (0^2 \cdot P(X=0)) + (1^2 \cdot P(X=1))" />
                <BlockMath math="E[X^2] = (0 \cdot (1-p)) + (1 \cdot p) = p" />
                <p>Now, we substitute everything back into the variance formula:</p>
                <BlockMath math="Var(X) = p - p^2" />
                <FormulaBlock>
                    <BlockMath math="Var(X) = p(1-p)" />
                </FormulaBlock>
                 <p className="text-sm text-muted-foreground">Notice that the variance is maximized when <InlineMath math="p=0.5" /> (a 50/50 coin flip has the highest uncertainty) and is 0 when <InlineMath math="p=0" /> or <InlineMath math="p=1" /> (the outcome is certain).</p>
            </CardContent>
        </Card>

      </div>
    </>
  );
}