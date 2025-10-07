
'use client';

import { useState, useEffect, useMemo } from 'react';
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


const PopulationGrid = ({
  prevalence,
  sensitivity,
  specificity,
}: {
  prevalence: number;
  sensitivity: number;
  specificity: number;
}) => {
  const POPULATION_SIZE = 10000;
  const GRID_SIZE = 100;

  const results = useMemo(() => {
    const numDiseased = Math.round(POPULATION_SIZE * prevalence);
    const numHealthy = POPULATION_SIZE - numDiseased;

    const truePositives = Math.round(numDiseased * sensitivity);
    const falseNegatives = numDiseased - truePositives;

    const trueNegatives = Math.round(numHealthy * specificity);
    const falsePositives = numHealthy - trueNegatives;

    const totalPositive = truePositives + falsePositives;
    const posterior = totalPositive > 0 ? (truePositives / totalPositive) : 0;

    return {
        numDiseased, numHealthy, truePositives, falseNegatives, trueNegatives, falsePositives, totalPositive, posterior
    };
  }, [prevalence, sensitivity, specificity]);

  const dots = useMemo(() => {
    const dotArray = [];
    let tp = results.truePositives;
    let fp = results.falsePositives;
    let tn = results.trueNegatives;
    
    for (let i = 0; i < POPULATION_SIZE; i++) {
        let status = 'healthyNoTest';
        if (tp > 0) {
            status = 'truePositive';
            tp--;
        } else if (fp > 0) {
            status = 'falsePositive';
            fp--;
        } else if (tn > 0) {
            status = 'trueNegative';
            tn--;
        } else {
            status = 'falseNegative';
        }
        dotArray.push(status);
    }
    // Shuffle for better visual mixing
    return dotArray.sort(() => Math.random() - 0.5);
  }, [results]);

  const getDotColor = (status: string) => {
    switch (status) {
        case 'truePositive': return 'bg-destructive'; // Sick & Tested Positive
        case 'falsePositive': return 'bg-destructive/50'; // Healthy & Tested Positive
        case 'trueNegative': return 'bg-green-500/20'; // Healthy & Tested Negative
        case 'falseNegative': return 'bg-yellow-500/50'; // Sick & Tested Negative
        default: return 'bg-muted';
    }
  }

  return (
    <div className="flex flex-col md:flex-row gap-6 items-center">
        <div className="flex-1 space-y-4">
             <div className="grid grid-cols-2 gap-4">
                <Card className="bg-muted/50 p-4 text-center">
                    <div className="font-bold text-2xl">{results.numDiseased.toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground">Have Disease</div>
                </Card>
                 <Card className="bg-muted/50 p-4 text-center">
                    <div className="font-bold text-2xl">{results.numHealthy.toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground">Are Healthy</div>
                </Card>
             </div>
             <Card className="p-4">
                 <h4 className="font-semibold text-center mb-2">Test Results</h4>
                 <div className="grid grid-cols-2 gap-2 text-center text-xs">
                    <div className="bg-destructive text-destructive-foreground p-2 rounded">
                        <div>True Positives</div>
                        <div className="font-bold text-lg">{results.truePositives}</div>
                    </div>
                     <div className="bg-destructive/50 p-2 rounded">
                        <div>False Positives</div>
                        <div className="font-bold text-lg">{results.falsePositives}</div>
                    </div>
                     <div className="bg-green-500/20 p-2 rounded">
                        <div>True Negatives</div>
                        <div className="font-bold text-lg">{results.trueNegatives}</div>
                    </div>
                     <div className="bg-yellow-500/50 p-2 rounded">
                        <div>False Negatives</div>
                        <div className="font-bold text-lg">{results.falseNegatives}</div>
                    </div>
                 </div>
             </Card>

             <Card className="bg-muted p-4 text-center">
                <p className="text-sm text-muted-foreground">Given a POSITIVE test result, the probability of actually having the disease is:</p>
                <p className="font-headline text-5xl font-bold tracking-tight text-primary mt-2">
                    {(results.posterior * 100).toFixed(2)}%
                </p>
                <p className="text-xs text-muted-foreground mt-2">(True Positives / All Positives)</p>
             </Card>
        </div>

        <div className="flex-shrink-0 w-full max-w-sm md:w-auto">
            <div className="relative border p-2 rounded-lg aspect-square">
                 <div className={`grid grid-cols-100 gap-px`} style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))` }}>
                    {dots.map((status, i) => (
                        <div key={i} className={`aspect-square rounded-full ${getDotColor(status)}`}></div>
                    ))}
                </div>
            </div>
             <div className="flex justify-around text-xs mt-2">
                 <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-destructive"></div>Sick & Positive</div>
                 <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-destructive/50"></div>Healthy & Positive</div>
             </div>
        </div>
    </div>
  );
};


const BayesTheoremCalculator = () => {
  const [prevalence, setPrevalence] = useState(0.01); // P(D) - Prior
  const [sensitivity, setSensitivity] = useState(0.99); // P(Pos|D) - True Positive Rate
  const [specificity, setSpecificity] = useState(0.95); // P(Neg|~D) - True Negative Rate

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Interactive Calculator: The Disease Test</CardTitle>
        <CardDescription>
            A person tests positive for a rare disease. What's the real probability they have it? This visualization shows how a low base rate can produce many false positives. This is the "base rate fallacy".
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div className="space-y-3">
              <Label>Disease Prevalence (Base Rate): {(prevalence * 100).toFixed(2)}%</Label>
              <Slider min={0.001} max={0.2} step={0.001} value={[prevalence]} onValueChange={v => setPrevalence(v[0])} />
              <p className="text-xs text-muted-foreground">P(Disease)</p>
            </div>
             <div className="space-y-3">
              <Label>Test Sensitivity (True Positive Rate): {(sensitivity * 100).toFixed(1)}%</Label>
              <Slider min={0.80} max={0.999} step={0.001} value={[sensitivity]} onValueChange={v => setSensitivity(v[0])} />
               <p className="text-xs text-muted-foreground">P(Positive | Disease)</p>
            </div>
             <div className="space-y-3">
              <Label>Test Specificity (True Negative Rate): {(specificity * 100).toFixed(1)}%</Label>
              <Slider min={0.80} max={0.999} step={0.001} value={[specificity]} onValueChange={v => setSpecificity(v[0])} />
               <p className="text-xs text-muted-foreground">P(Negative | No Disease)</p>
            </div>
        </div>
        
        <PopulationGrid 
            prevalence={prevalence}
            sensitivity={sensitivity}
            specificity={specificity}
        />
        
      </CardContent>
    </Card>
  )

}


export default function BayesTheoremComponent() {
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
