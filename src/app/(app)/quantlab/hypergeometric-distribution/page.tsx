
'use client';

import { useState } from 'react';
import { PageHeader } from '@/components/app/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import { HypergeometricDashboard } from '@/components/quantlab/dashboards/HypergeometricDashboard';
import { PageSection } from '@/components/app/page-section';
import { KeyConceptAlert } from '@/components/app/key-concept-alert';
import { InteractiveFormula } from '@/components/app/interactive-formula';

export default function HypergeometricDistributionPage() {
  const [highlightValue, setHighlightValue] = useState<string | number | null>(null);
  
  return (
    <>
      <PageHeader
        title="Hypergeometric Distribution"
        description="Modeling the probability of successes in a sample drawn without replacement."
        variant="aligned-left"
      />
      <div className="mx-auto max-w-5xl space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">The "Drawing from a Deck" Distribution</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-base leading-relaxed text-foreground/90">
            <p>
              The Hypergeometric distribution is used when you are sampling from a finite population without replacement. This is a key difference from the Binomial distribution, where each trial is independent because you are "replacing" after each draw.
            </p>
            <p>
              The classic example is drawing cards from a deck. If you draw a 5-card hand, what's the probability of getting exactly 2 spades? In finance, this can model credit risk in a portfolio of bonds: if you have a portfolio of 100 bonds and know that 5 will default, what is the probability that if you randomly select 10 bonds for an audit, exactly 1 of them will be a defaulter?
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Interactive Hypergeometric Distribution</CardTitle>
            <CardDescription>Adjust the parameters of the population and sample to see how the probabilities change.</CardDescription>
          </CardHeader>
          <CardContent>
            <HypergeometricDashboard highlightValue={highlightValue} onBarHover={setHighlightValue} />
          </CardContent>
        </Card>
        
        <PageSection title="Core Concepts">
          <InteractiveFormula
            title="Probability Mass Function (PMF)"
            description="The PMF gives the probability of getting exactly `k` successes in a sample of size `n`."
            formula="P(X=k) = \frac{\binom{K}{k} \binom{N-K}{n-k}}{\binom{N}{n}}"
            explanation={
              <ul className="list-disc pl-6 space-y-2 text-sm mt-4">
                  <li>The numerator calculates the number of ways to achieve the desired outcome: it's the number of ways to choose `k` success items from the `K` available successes (<InlineMath math="\binom{K}{k}"/>), multiplied by the number of ways to choose the remaining `n-k` failure items from the total `N-K` failures (<InlineMath math="\binom{N-K}{n-k}"/>).</li>
                  <li>The denominator is the total number of possible outcomes: the number of ways to choose any `n` items from the total population of `N` (<InlineMath math="\binom{N}{n}"/>).</li>
              </ul>
            }
          >
            {(highlight, onHover) => (
              <HypergeometricDashboard isSubcomponent={true} highlightValue={highlight} onBarHover={onHover} />
            )}
          </InteractiveFormula>

          <Card>
              <CardHeader>
                  <CardTitle className="font-headline">Expected Value & Variance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                  <div>
                      <h4 className="font-semibold">Expected Value (Mean)</h4>
                      <BlockMath math="E[X] = n \cdot \frac{K}{N}" />
                      <p className="text-sm text-muted-foreground mt-2">The mean is intuitive: it's the sample size `n` multiplied by the initial proportion of successes in the population, `K/N`.</p>
                  </div>
                  <div>
                      <h4 className="font-semibold">Variance</h4>
                      <BlockMath math="Var(X) = n \frac{K}{N} (1 - \frac{K}{N}) \frac{N-n}{N-1}" />
                      <p className="text-sm text-muted-foreground mt-2">The variance is similar to the Binomial variance, but includes a "finite population correction factor" <InlineMath math="\frac{N-n}{N-1}"/> to account for the fact that each draw is not independent and reduces the remaining population.</p>
                  </div>
              </CardContent>
          </Card>
        </PageSection>

        <PageSection title="Applications">
          <KeyConceptAlert title="Quantitative Finance: Quality Control in Algo Trading" icon="brain">
            <p>A high-frequency trading firm executed 1000 trades in a day. Due to a data feed error, they know that 50 of these trades were based on faulty data. An auditor randomly selects 80 trades for review. The firm's risk officer can use the Hypergeometric distribution to calculate the probability that the auditor finds *exactly* `k=0` faulty trades, or `k > 5` faulty trades, to understand their exposure to penalties.</p>
          </KeyConceptAlert>
        </PageSection>
      </div>
    </>
  );
}
