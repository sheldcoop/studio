
'use client';

import { useState } from 'react';
import { PageHeader } from '@/components/app/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import { BinomialDashboard } from '@/components/quantlab/dashboards/BinomialDashboard';
import { PageSection } from '@/components/app/page-section';
import { KeyConceptAlert } from '@/components/app/key-concept-alert';
import { InteractiveFormula } from '@/components/app/interactive-formula';

export default function BinomialDistributionPage() {
  const [highlightValue, setHighlightValue] = useState<string | number | null>(null);

  return (
    <>
      <PageHeader
        title="Binomial Distribution"
        description="Modeling the number of successes in a sequence of independent trials."
        variant="aligned-left"
      />
      <div className="mx-auto max-w-5xl space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">The "Series of Coin Flips" Distribution</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-base leading-relaxed text-foreground/90">
            <p>
              The Binomial Distribution is a discrete probability distribution that models the number of successes in a fixed number of independent 'Bernoulli' trials, where each trial has only two possible outcomes: success or failure.
            </p>
            <p>
              Think of flipping a coin 10 times and counting the number of heads. In finance, this could model the number of winning trades in a month (where each trade is a trial), or the number of portfolio companies that meet their earnings target in a quarter.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Interactive Binomial Distribution</CardTitle>
            <CardDescription>Adjust the number of trials (n) and the probability of success (p) to see how the shape of the distribution changes.</CardDescription>
          </CardHeader>
          <CardContent>
            <BinomialDashboard highlightValue={highlightValue} onBarHover={setHighlightValue} />
          </CardContent>
        </Card>

        <PageSection title="Core Concepts">
          <InteractiveFormula
            title="Probability Mass Function (PMF)"
            description="The PMF answers: 'What is the probability of getting exactly k successes in n trials?'"
            formula="P(X=k) = \binom{n}{k} p^k (1-p)^{n-k}"
            explanation={
              <>
                <p>To find the probability of exactly <InlineMath math="k"/> successes, we consider three pieces:</p>
                <ul className="list-disc pl-6 space-y-2 mt-2">
                  <li><InlineMath math="p^k" />: This is the probability of achieving <InlineMath math="k"/> successes. If you want 3 wins and the probability of a win is <InlineMath math="p"/>, the combined probability is <InlineMath math="p \times p \times p = p^3"/>.</li>
                  <li><InlineMath math="(1-p)^{n-k}" />: This is the probability of getting the remaining <InlineMath math="n-k"/> outcomes as failures. The probability of one failure is <InlineMath math="1-p"/>.</li>
                  <li><InlineMath math="\binom{n}{k}" />: This is the binomial coefficient, read as &quot;n choose k&quot;. It counts the number of different ways to arrange <InlineMath math="k"/> successes among <InlineMath math="n"/> trials. For example, in 4 trials, getting 2 successes (SSFF) could happen as SSFF, SFSF, SFFS, FSSF, FSFS, or FFSS. There are <InlineMath math="\binom{4}{2}=6"/> ways.</li>
                </ul>
                <p className="mt-2">Hover over the formula components to see how they relate to the chart above.</p>
              </>
            }
          >
            {(highlight, onHover) => (
              <BinomialDashboard isSubcomponent={true} highlightValue={highlight} onBarHover={onHover} />
            )}
          </InteractiveFormula>
          
          <InteractiveFormula
            title="Cumulative Distribution Function (CDF)"
            description="The CDF answers: 'What is the probability of getting k successes or fewer?'"
            formula="F(k) = P(X \le k) = \sum_{i=0}^{k} \binom{n}{i} p^i (1-p)^{n-i}"
            explanation={
              <p>The CDF is simply the sum of all the probabilities from the PMF for all outcomes up to and including `k`. For example, the probability of getting 2 or fewer successes, <InlineMath math="P(X \le 2)"/>, is calculated as <InlineMath math="P(X=0) + P(X=1) + P(X=2)"/>.</p>
            }
          >
             {(highlight, onHover) => (
              <BinomialDashboard isSubcomponent={true} showCdf={true} highlightValue={highlight} onBarHover={onHover} />
            )}
          </InteractiveFormula>

           <Card>
                <CardHeader>
                    <CardTitle className="font-headline">Expected Value & Variance</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <h4 className="font-semibold">Expected Value (Mean)</h4>
                        <BlockMath math="E[X] = np" />
                        <p className="text-sm text-muted-foreground mt-2">This is intuitive: if you flip a fair coin (p=0.5) 20 times (n=20), you would expect to get 20 * 0.5 = 10 heads on average.</p>
                    </div>
                    <div>
                        <h4 className="font-semibold">Variance</h4>
                        <BlockMath math="Var(X) = np(1-p)" />
                        <p className="text-sm text-muted-foreground mt-2">The variance measures the spread of the outcomes. Notice it's maximized when p=0.5 (a 50/50 coin flip has the highest uncertainty) and is 0 when the outcome is certain (p=0 or p=1).</p>
                    </div>
                </CardContent>
            </Card>
        </PageSection>

        <PageSection title="Applications">
            <KeyConceptAlert title="Quantitative Finance: Option Pricing" icon="brain">
              <p>The Binomial Option Pricing Model uses a discrete-time binomial tree to model the price of an underlying asset. At each step, the price can move up or down with a certain probability `p`. By working backward from the option's expiration date, traders can calculate the option's fair value today. Each step in the tree is a Bernoulli trial, and the final distribution of possible prices follows a Binomial distribution.</p>
            </KeyConceptAlert>
        </PageSection>
      </div>
    </>
  );
}
