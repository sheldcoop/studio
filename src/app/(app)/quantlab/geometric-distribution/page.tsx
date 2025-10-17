
'use client';

import { useState } from 'react';
import { PageHeader } from '@/components/app/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import { GeometricDashboard } from '@/components/quantlab/dashboards/GeometricDashboard';
import { PageSection } from '@/components/app/page-section';
import { KeyConceptAlert } from '@/components/app/key-concept-alert';
import { InteractiveFormula } from '@/components/app/interactive-formula';
import { ExampleStep } from '@/components/app/example-step';
import { FormulaBlock } from '@/components/app/formula-block';

export default function GeometricDistributionPage() {
  const [highlightValue, setHighlightValue] = useState<string | number | null>(null);

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
            <CardTitle className="font-headline">Interactive Geometric Distribution</CardTitle>
            <CardDescription>Adjust the probability of success (<InlineMath math="p"/>) to see how it affects the likelihood of achieving the first success on a given trial.</CardDescription>
          </CardHeader>
          <CardContent>
            <GeometricDashboard highlightValue={highlightValue} onBarHover={setHighlightValue} />
          </CardContent>
        </Card>

        <PageSection title="Core Concepts">
           <InteractiveFormula
              title="Probability Mass Function (PMF)"
              description="The PMF gives the probability that the first success occurs on exactly the k-th trial."
              formula="P(X=k) = (1-p)^{k-1}p"
              explanation={
                <>
                  <p>This formula is very intuitive. For the first success to occur on trial <InlineMath math="k"/>, two things must happen:</p>
                  <ul className="list-disc pl-6 space-y-2 mt-2">
                    <li>You must have exactly <InlineMath math="k-1"/> failures in a row first. The probability of one failure is <InlineMath math="1-p"/>, so the probability of <InlineMath math="k-1"/> independent failures is <InlineMath math="(1-p)^{k-1}"/>.</li>
                    <li>The <InlineMath math="k"/>-th trial itself must be a success, which has a probability of <InlineMath math="p"/>.</li>
                  </ul>
                  <p className="mt-2">Multiplying these probabilities together gives the formula.</p>
                </>
              }
           >
              {(highlight, onHover) => (
                <GeometricDashboard isSubcomponent={true} highlightValue={highlight} onBarHover={onHover} />
              )}
           </InteractiveFormula>
          
           <InteractiveFormula
              title="Cumulative Distribution Function (CDF)"
              description="The CDF gives the probability that the first success occurs on or before the k-th trial."
              formula="F(k) = P(X \le k) = 1 - (1-p)^k"
              explanation={
                <p className="text-sm mt-4">The CDF can be derived from its complementary event: the probability of needing *more* than `k` trials for the first success. This only happens if the first `k` trials are all failures, an event with probability <InlineMath math="(1-p)^k"/>. Therefore, the probability of needing `k` or fewer trials is <InlineMath math="1 - (1-p)^k"/>.</p>
              }
           >
              {(highlight, onHover) => (
                <GeometricDashboard isSubcomponent={true} showCdf={true} highlightValue={highlight} onBarHover={onHover} />
              )}
           </InteractiveFormula>
        </PageSection>

        <PageSection title="Key Derivations">
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline">Deriving the Mean and Variance</CardTitle>
                </CardHeader>
                <CardContent className="space-y-8">
                    <div className="border-b pb-8">
                        <h4 className="font-semibold text-lg">Deriving the Expected Value (Mean)</h4>
                        <ExampleStep stepNumber={1} title="Set up the Infinite Series for E[X]">
                            <p>The expected value is the sum of each outcome <InlineMath math="k"/> multiplied by its probability <InlineMath math="P(X=k)"/>. Let <InlineMath math="q = 1-p"/>.</p>
                            <BlockMath math="E[X] = \sum_{k=1}^{\infty} k \cdot P(X=k) = \sum_{k=1}^{\infty} k \cdot q^{k-1}p" />
                            <p>We can pull the constant <InlineMath math="p"/> out:</p>
                            <BlockMath math="E[X] = p \sum_{k=1}^{\infty} k q^{k-1} = p(1 + 2q + 3q^2 + 4q^3 + \dots)" />
                        </ExampleStep>
                        <ExampleStep stepNumber={2} title="Use the Geometric Series Derivative Trick">
                            <p>Recall the formula for an infinite geometric series: <InlineMath math="\sum_{k=0}^{\infty} q^k = \frac{1}{1-q}"/>.</p>
                            <p>If we take the derivative of both sides with respect to <InlineMath math="q"/>, we get:</p>
                            <BlockMath math="\frac{d}{dq} \left( \sum_{k=0}^{\infty} q^k \right) = \sum_{k=1}^{\infty} k q^{k-1} = \frac{d}{dq} \left( \frac{1}{1-q} \right) = \frac{1}{(1-q)^2}" />
                            <p>This gives us the value of the summation from Step 1.</p>
                        </ExampleStep>
                        <ExampleStep stepNumber={3} title="Substitute and Solve">
                            <p>Substitute this result back into the equation for <InlineMath math="E[X]"/>:</p>
                            <BlockMath math="E[X] = p \cdot \frac{1}{(1-q)^2}" />
                            <p>Since <InlineMath math="q = 1-p"/>, we have <InlineMath math="1-q = p"/>.</p>
                             <BlockMath math="E[X] = p \cdot \frac{1}{p^2}" />
                            <FormulaBlock>
                                <CardTitle className="text-lg mb-2">Final Mean Formula</CardTitle>
                                <BlockMath math="E[X] = \frac{1}{p}" />
                            </FormulaBlock>
                        </ExampleStep>
                    </div>

                    <div>
                        <h4 className="font-semibold text-lg">Deriving the Variance</h4>
                        <p className="text-sm text-muted-foreground mb-4">We use <InlineMath math="Var(X) = E[X^2] - (E[X])^2"/>. A common trick is to first find <InlineMath math="E[X(X-1)]"/> and then use it to find <InlineMath math="E[X^2]"/>.</p>
                        <ExampleStep stepNumber={1} title="Calculate E[X(X-1)]">
                            <p>We set up another series:</p>
                             <BlockMath math="E[X(X-1)] = \sum_{k=1}^{\infty} k(k-1)q^{k-1}p = p \sum_{k=2}^{\infty} k(k-1)q^{k-1}" />
                             <p>This sum is the second derivative of the geometric series formula with respect to <InlineMath math="q"/>, multiplied by <InlineMath math="q"/>.</p>
                             <BlockMath math="\frac{d^2}{dq^2} \left( \sum_{k=0}^{\infty} q^k \right) = \sum_{k=2}^{\infty} k(k-1)q^{k-2} = \frac{2}{(1-q)^3}" />
                              <p>Therefore, the summation part is <InlineMath math="\sum_{k=2}^{\infty} k(k-1)q^{k-1} = \frac{2q}{(1-q)^3}"/>.</p>
                             <BlockMath math="E[X(X-1)] = p \cdot \frac{2q}{(1-q)^3} = p \cdot \frac{2q}{p^3} = \frac{2q}{p^2}" />
                        </ExampleStep>
                        <ExampleStep stepNumber={2} title="Find E[X²]">
                             <p>Using the property <InlineMath math="E[X(X-1)] = E[X^2 - X] = E[X^2] - E[X]"/>, we can rearrange to solve for <InlineMath math="E[X^2]"/>.</p>
                             <BlockMath math="E[X^2] = E[X(X-1)] + E[X] = \frac{2q}{p^2} + \frac{1}{p}" />
                        </ExampleStep>
                        <ExampleStep stepNumber={3} title="Calculate the Variance">
                            <BlockMath math="Var(X) = E[X^2] - (E[X])^2 = \left(\frac{2q}{p^2} + \frac{1}{p}\right) - \left(\frac{1}{p}\right)^2" />
                            <BlockMath math="= \frac{2q}{p^2} + \frac{p}{p^2} - \frac{1}{p^2} = \frac{2q + p - 1}{p^2}" />
                            <p>Substitute <InlineMath math="p-1 = -q"/>:</p>
                            <BlockMath math="= \frac{2q - q}{p^2} = \frac{q}{p^2}" />
                             <FormulaBlock>
                                <CardTitle className="text-lg mb-2">Final Variance Formula</CardTitle>
                                <BlockMath math="Var(X) = \frac{1-p}{p^2}" />
                            </FormulaBlock>
                        </ExampleStep>
                    </div>
                </CardContent>
            </Card>
        </PageSection>

        <PageSection title="Applications">
          <KeyConceptAlert title="Quantitative Finance: Modeling Time to First Default" icon="brain">
            <p>An analyst models the probability of a company defaulting in any given year as `p=0.05`. They can use the Geometric distribution to answer questions like:</p>
            <ul className="list-disc pl-5 mt-2 text-sm space-y-1">
              <li>"What is the probability the company defaults for the first time in year 5?" (<InlineMath math="P(X=5) = (1-0.05)^{5-1} \times 0.05"/>)</li>
              <li>"What is the average number of years we expect this company to survive without defaulting?" (<InlineMath math="E[X] = 1/0.05 = 20"/> years)</li>
            </ul>
          </KeyConceptAlert>
        </PageSection>
      </div>
    </>
  );
}
