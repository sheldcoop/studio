'use client';

import { useState, useEffect } from 'react';
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
import { BlockMath } from 'react-katex';


const BayesTheoremCalculator = () => {
  const [prevalence, setPrevalence] = useState(0.01); // P(D) - Prior
  const [sensitivity, setSensitivity] = useState(0.99); // P(Pos|D) - True Positive Rate
  const [specificity, setSpecificity] = useState(0.95); // P(Neg|~D) - True Negative Rate

  const [posterior, setPosterior] = useState(0);

  useEffect(() => {
    // Bayes' Theorem calculation
    const pD = prevalence;
    const pNotD = 1 - prevalence;
    const pPosGivenD = sensitivity;
    const pPosGivenNotD = 1 - specificity; // False Positive Rate

    // P(Pos) = P(Pos|D)*P(D) + P(Pos|~D)*P(~D)
    const pPos = pPosGivenD * pD + pPosGivenNotD * pNotD;

    // P(D|Pos) = (P(Pos|D) * P(D)) / P(Pos)
    const pDGivenPos = (pPosGivenD * pD) / pPos;

    setPosterior(pDGivenPos);
  }, [prevalence, sensitivity, specificity]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Interactive Calculator: The Disease Test</CardTitle>
        <CardDescription>
            A person tests positive for a rare disease. What's the real probability they have it? Adjust the sliders to see how the base rate and test accuracy dramatically change the outcome. This demonstrates the "base rate fallacy".
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-8">
            <div className="space-y-3">
              <Label>Disease Prevalence (Base Rate): {(prevalence * 100).toFixed(2)}%</Label>
              <Slider min={0.001} max={0.2} step={0.001} value={[prevalence]} onValueChange={v => setPrevalence(v[0])} />
              <p className="text-xs text-muted-foreground">How common is the disease in the general population? (P(Disease))</p>
            </div>
             <div className="space-y-3">
              <Label>Test Sensitivity (True Positive Rate): {(sensitivity * 100).toFixed(1)}%</Label>
              <Slider min={0.80} max={0.999} step={0.001} value={[sensitivity]} onValueChange={v => setSensitivity(v[0])} />
               <p className="text-xs text-muted-foreground">If you have the disease, how likely is the test to be positive? (P(Positive|Disease))</p>
            </div>
             <div className="space-y-3">
              <Label>Test Specificity (True Negative Rate): {(specificity * 100).toFixed(1)}%</Label>
              <Slider min={0.80} max={0.999} step={0.001} value={[specificity]} onValueChange={v => setSpecificity(v[0])} />
               <p className="text-xs text-muted-foreground">If you DON'T have the disease, how likely is the test to be negative? (P(Negative|No Disease))</p>
            </div>
          </div>
          <div className="flex items-center justify-center">
             <div className="rounded-lg bg-muted p-6 text-center w-full">
                <p className="text-sm text-muted-foreground">Given a POSITIVE test result, the actual probability of having the disease is:</p>
                <p className="font-headline text-5xl font-bold tracking-tight text-primary mt-2">
                    {(posterior * 100).toFixed(2)}%
                </p>
                <p className="text-xs text-muted-foreground mt-2">(Posterior Probability P(Disease|Positive))</p>
             </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )

}


export default function BayesTheoremPage() {
  return (
    <>
      <PageHeader
        title="Bayes' Theorem"
        description="The mathematical framework for updating your beliefs in light of new evidence."
        variant="aligned-left"
      />
      <div className="mx-auto max-w-5xl space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">From Prior to Posterior</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-base leading-relaxed text-foreground/90">
            <p>
              Bayes' Theorem is one of the most important concepts in probability and statistics. It provides a formal way to combine new evidence with existing beliefs (our "priors") to arrive at an updated, more accurate belief (a "posterior").
            </p>
             <div className="rounded-lg border bg-muted/50 p-4 text-center">
                  <BlockMath math="P(A|B) = \frac{P(B|A) \cdot P(A)}{P(B)}" />
            </div>
            <ul className="list-disc pl-6 space-y-2 text-sm">
                <li><code className="font-mono bg-background px-1 rounded">P(A|B)</code> — The <strong>Posterior Probability</strong>: The probability of event A being true, <span className="font-semibold text-primary">given</span> that event B is true. This is what you are trying to calculate.</li>
                <li><code className="font-mono bg-background px-1 rounded">P(B|A)</code> — The <strong>Likelihood</strong>: The probability of observing event B, <span className="font-semibold text-primary">given</span> that event A is true. (This is often the accuracy of your test or signal).</li>
                <li><code className="font-mono bg-background px-1 rounded">P(A)</code> — The <strong>Prior Probability</strong>: Your initial belief in the probability of event A before seeing any new evidence.</li>
                <li><code className="font-mono bg-background px-1 rounded">P(B)</code> — The <strong>Marginal Probability</strong>: The total probability of observing event B under all circumstances.</li>
            </ul>
          </CardContent>
        </Card>

        <BayesTheoremCalculator />

      </div>
    </>
  );
}
