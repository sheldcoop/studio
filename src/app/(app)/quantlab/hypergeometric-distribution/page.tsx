
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
import { ExampleStep } from '@/components/app/example-step';
import { FormulaBlock } from '@/components/app/formula-block';

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

        <PageSection title="Key Derivations">
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline">Deriving the Expected Value (Mean)</CardTitle>
                    <CardDescription>
                        While deriving the mean directly from the PMF is algebraically complex, we can use a more elegant method involving indicator variables.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                    <ExampleStep stepNumber={1} title="Define Indicator Variables">
                        <p>Let <InlineMath math="X"/> be the total number of successes in our sample of size <InlineMath math="n"/>. We can express <InlineMath math="X"/> as the sum of <InlineMath math="n"/> indicator variables:</p>
                        <BlockMath math="X = X_1 + X_2 + \dots + X_n" />
                        <p>Where <InlineMath math="X_i"/> is 1 if the <InlineMath math="i"/>-th item drawn is a success, and 0 otherwise.</p>
                    </ExampleStep>
                    <ExampleStep stepNumber={2} title="Use Linearity of Expectation">
                        <p>A powerful property of expectation is that it is linear. This means the expectation of a sum is the sum of the expectations:</p>
                        <BlockMath math="E[X] = E[X_1 + \dots + X_n] = E[X_1] + E[X_2] + \dots + E[X_n]" />
                    </ExampleStep>
                     <ExampleStep stepNumber={3} title="Find the Expectation of a Single Draw">
                        <p>For any single draw <InlineMath math="i"/>, what is the probability that it is a success? Since every item in the population has an equal chance of being selected in the <InlineMath math="i"/>-th draw, the probability is simply the proportion of successes in the initial population.</p>
                        <BlockMath math="P(X_i = 1) = \frac{K}{N}" />
                        <p>The expected value of an indicator variable is just its probability of being 1. Therefore:</p>
                        <BlockMath math="E[X_i] = 1 \cdot P(X_i=1) + 0 \cdot P(X_i=0) = P(X_i=1) = \frac{K}{N}" />
                        <p className="text-sm text-muted-foreground mt-2">Crucially, this is true for every single draw, from the first to the last, even though the draws are not independent.</p>
                    </ExampleStep>
                    <ExampleStep stepNumber={4} title="Sum the Expectations">
                        <p>Now we substitute this back into our sum. We are adding the same value, <InlineMath math="K/N"/>, to itself <InlineMath math="n"/> times.</p>
                        <BlockMath math="E[X] = \sum_{i=1}^{n} E[X_i] = \sum_{i=1}^{n} \frac{K}{N} = n \cdot \frac{K}{N}" />
                        <FormulaBlock>
                            <CardTitle className="text-lg mb-2">Final Mean Formula</CardTitle>
                            <BlockMath math="E[X] = n \frac{K}{N}" />
                        </FormulaBlock>
                    </ExampleStep>
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
