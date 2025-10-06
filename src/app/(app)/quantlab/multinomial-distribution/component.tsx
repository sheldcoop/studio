
'use client';

import { useState } from 'react';
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { BlockMath, InlineMath } from 'react-katex';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import 'katex/dist/katex.min.css';

// --- Math & Simulation Logic ---
const factorial = (n: number): number => {
    if (n < 0) return Infinity;
    if (n === 0) return 1;
    let result = 1;
    for (let i = 2; i <= n; i++) result *= i;
    return result;
};

const multinomialProbability = (n: number, x: number[], p: number[]): number => {
    if (x.reduce((a, b) => a + b, 0) !== n || Math.abs(p.reduce((a, b) => a + b, 0) - 1) > 1e-9) {
        return 0;
    }

    let combinations = factorial(n);
    let prob_product = 1;

    for (let i = 0; i < x.length; i++) {
        combinations /= factorial(x[i]);
        prob_product *= Math.pow(p[i], x[i]);
    }
    
    return combinations * prob_product;
};


// --- Main Page Component ---
export default function MultinomialDistributionComponent() {
    const [trials, setTrials] = useState(10);
    const [outcomes, setOutcomes] = useState([
        { name: 'Win', prob: 0.5, count: 5 },
        { name: 'Loss', prob: 0.3, count: 3 },
        { name: 'Draw', prob: 0.2, count: 2 },
    ]);
    const [calculatedProb, setCalculatedProb] = useState<number | null>(null);
    
    const handleProbChange = (index: number, newProbStr: string) => {
        const newProb = parseFloat(newProbStr);
        if (isNaN(newProb) || newProb < 0 || newProb > 1) return;

        const newOutcomes = [...outcomes];
        const oldProb = newOutcomes[index].prob;
        const diff = newProb - oldProb;
        newOutcomes[index].prob = newProb;
        
        const otherSum = 1 - oldProb;
        if (otherSum > 1e-9) { // Avoid division by zero
            newOutcomes.forEach((o, i) => {
                if (i !== index) {
                    o.prob -= diff * (o.prob / otherSum);
                }
            });
        }
        setOutcomes(newOutcomes);
    }
    
    const handleCountChange = (index: number, newCountStr: string) => {
        const newCount = parseInt(newCountStr, 10);
        if (isNaN(newCount) || newCount < 0) return;
        const newOutcomes = [...outcomes];
        newOutcomes[index].count = newCount;
        setOutcomes(newOutcomes);
    }

    const calculate = () => {
        const counts = outcomes.map(o => o.count);
        const probs = outcomes.map(o => o.prob);
        const totalCount = counts.reduce((a, b) => a + b, 0);

        if (Math.abs(probs.reduce((a, b) => a + b, 0) - 1) > 0.01) {
            alert('Probabilities must sum to 1.');
            return;
        }

        if (totalCount !== trials) {
            alert('The sum of outcome counts must equal the total number of trials.');
            return;
        }
        setCalculatedProb(multinomialProbability(trials, counts, probs));
    }


  return (
    <>
      <PageHeader
        title="Multinomial Distribution"
        description="A generalization of the Binomial distribution for more than two outcomes."
        variant="aligned-left"
      />
      <div className="mx-auto max-w-5xl space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Beyond Success or Failure</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-base leading-relaxed text-foreground/90">
            <p>
              The Multinomial distribution extends the Binomial distribution to situations with more than two possible outcomes for each trial. While Binomial models the number of successes in a series of 'success/failure' trials, Multinomial models the number of times each of a set of possible outcomes occurs.
            </p>
            <p>
              For example, instead of just a 'win' or 'loss', a trade could result in a 'big win', 'small win', 'breakeven', 'small loss', or 'big loss'. The Multinomial distribution can calculate the probability of observing a specific count for each of these categories over a series of trades.
            </p>
          </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle className="font-headline">The Formula</CardTitle>
                 <CardDescription>The probability of observing a specific set of counts is:</CardDescription>
            </CardHeader>
            <CardContent>
                 <div className="rounded-lg border bg-muted/50 p-4 text-center">
                  <BlockMath math="P(X_1=x_1, ..., X_c=x_c) = \\frac{n!}{x_1!...x_c!} p_1^{x_1} \\cdots p_c^{x_c}" />
                </div>
                 <ul className="list-disc pl-6 space-y-2 text-sm mt-4">
                    <li><InlineMath math="n" /> is the total number of trials.</li>
                    <li><InlineMath math="c" /> is the number of possible outcomes.</li>
                    <li><InlineMath math="x_i" /> is the number of times outcome <InlineMath math="i" /> occurred.</li>
                    <li><InlineMath math="p_i" /> is the probability of outcome <InlineMath math="i" /> on a single trial.</li>
                </ul>
            </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Interactive Multinomial Calculator</CardTitle>
            <CardDescription>Specify the parameters to calculate the probability of a specific result.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
                 <div className="space-y-3">
                    <Label htmlFor="trials-slider">Total Number of Trials (n): {trials}</Label>
                    <Slider id="trials-slider" min={1} max={50} step={1} value={[trials]} onValueChange={(val) => setTrials(val[0])} />
                </div>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Outcome</TableHead>
                            <TableHead>Probability (<InlineMath math="p_i" />)</TableHead>
                            <TableHead>Desired Count (<InlineMath math="x_i" />)</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {outcomes.map((outcome, index) => (
                            <TableRow key={index}>
                                <TableCell>{outcome.name}</TableCell>
                                <TableCell>
                                    <Input type="number" value={outcome.prob.toFixed(2)} onChange={e => handleProbChange(index, e.target.value)} step="0.01" min="0" max="1" />
                                </TableCell>
                                <TableCell>
                                    <Input type="number" value={outcome.count} onChange={e => handleCountChange(index, e.target.value)} step="1" min="0" />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <Button onClick={calculate} className="w-full">Calculate Probability</Button>
                {calculatedProb !== null && (
                     <div className="rounded-lg bg-muted p-4 text-center">
                        <p className="text-sm text-muted-foreground">Calculated Probability</p>
                        <p className="text-3xl font-bold font-mono tracking-tight text-primary">{calculatedProb.toExponential(4)}</p>
                    </div>
                )}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
