
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
          
          <Card>
              <CardHeader>
                  <CardTitle className="font-headline">Expected Value & Variance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                  <div>
                      <h4 className="font-semibold">Expected Value (Mean)</h4>
                      <BlockMath math="E[X] = \frac{1}{p}"/>
                      <p className="text-sm text-muted-foreground mt-2">This is one of the most elegant results in probability. If a trade has a 25% chance of success (p=0.25), you would expect to wait, on average, 1/0.25 = 4 trades for your first winner.</p>
                  </div>
                  <div>
                      <h4 className="font-semibold">Variance</h4>
                      <BlockMath math="Var(X) = \frac{1-p}{p^2}"/>
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
