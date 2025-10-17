
'use client';

import { PageHeader } from '@/components/app/page-header';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import { HypergeometricDashboard } from '@/components/quantlab/dashboards/HypergeometricDashboard';
import { PageSection } from '@/components/app/page-section';
import { FormulaBlock } from '@/components/app/formula-block';
import { KeyConceptAlert } from '@/components/app/key-concept-alert';

// --- Main Page Component ---
export default function HypergeometricDistributionPage() {
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
            <HypergeometricDashboard />
          </CardContent>
        </Card>
        
        <PageSection title="Core Concepts">
          <Card>
              <CardHeader>
                  <CardTitle className="font-headline">Probability Mass Function (PMF)</CardTitle>
                  <CardDescription>The PMF gives the probability of getting *exactly* `k` successes in a sample of size `n`.</CardDescription>
              </CardHeader>
              <CardContent>
                  <FormulaBlock>
                    <BlockMath math="P(X=k) = \frac{\binom{K}{k} \binom{N-K}{n-k}}{\binom{N}{n}}" />
                  </FormulaBlock>
                  <ul className="list-disc pl-6 space-y-2 text-sm mt-4">
                      <li>The numerator is the number of ways to choose `k` success items from the `K` available AND `n-k` failure items from the `N-K` available.</li>
                      <li>The denominator is the total number of ways to choose any `n` items from the population of `N`.</li>
                  </ul>
              </CardContent>
          </Card>
          <Card>
              <CardHeader>
                  <CardTitle className="font-headline">Expected Value & Variance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                  <div>
                      <h4 className="font-semibold">Expected Value (Mean)</h4>
                      <FormulaBlock><BlockMath math="E[X] = n \cdot \frac{K}{N}" /></FormulaBlock>
                      <p className="text-sm text-muted-foreground mt-2">The mean is the sample size `n` times the initial proportion of successes in the population `K/N`.</p>
                  </div>
                  <div>
                      <h4 className="font-semibold">Variance</h4>
                      <FormulaBlock><BlockMath math="Var(X) = n \frac{K}{N} (1 - \frac{K}{N}) \frac{N-n}{N-1}" /></FormulaBlock>
                      <p className="text-sm text-muted-foreground mt-2">The variance is similar to the Binomial variance, but includes a "finite population correction factor" <InlineMath math="\frac{N-n}{N-1}" /> to account for the lack of replacement.</p>
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
