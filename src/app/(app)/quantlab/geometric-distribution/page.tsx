
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
import { GeometricDashboard } from '@/components/quantlab/dashboards/GeometricDashboard';
import { PageSection } from '@/components/app/page-section';
import { FormulaBlock } from '@/components/app/formula-block';
import { KeyConceptAlert } from '@/components/app/key-concept-alert';

// --- Main Page Component ---
export default function GeometricDistributionPage() {
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
            <CardDescription>Adjust the probability of success (<InlineMath math="p" />) to see how it affects the likelihood of achieving the first success on a given trial.</CardDescription>
          </CardHeader>
          <CardContent>
            <GeometricDashboard />
          </CardContent>
        </Card>

        <PageSection title="Core Concepts">
           <Card>
              <CardHeader>
                  <CardTitle className="font-headline">Probability Mass Function (PMF)</CardTitle>
                  <CardDescription>The PMF gives the probability that the first success occurs on *exactly* the <InlineMath math="k" />-th trial.</CardDescription>
              </CardHeader>
              <CardContent>
                  <FormulaBlock>
                    <BlockMath math="P(X=k) = (1-p)^{k-1}p" />
                  </FormulaBlock>
                  <p className="text-sm mt-4">This means you must have `k-1` failures (with probability `1-p` each) followed by one success (with probability `p`).</p>
                  <ul className="list-disc pl-6 space-y-2 text-sm mt-4">
                      <li><InlineMath math="k" /> is the number of trials (must be 1, 2, 3, ...).</li>
                      <li><InlineMath math="p" /> is the probability of success on any single trial.</li>
                  </ul>
              </CardContent>
          </Card>
          <Card>
              <CardHeader>
                  <CardTitle className="font-headline">Cumulative Distribution Function (CDF)</CardTitle>
                  <CardDescription>The CDF gives the probability that the first success occurs on or before the <InlineMath math="k" />-th trial.</CardDescription>
              </CardHeader>
              <CardContent>
                  <FormulaBlock>
                    <BlockMath math="F(k) = P(X \le k) = 1 - (1-p)^k" />
                  </FormulaBlock>
                  <p className="text-sm text-muted-foreground mt-4">This is derived from the complementary event: the probability of it taking *more* than `k` trials is the probability of having `k` failures in a row, which is <InlineMath math="(1-p)^k" />.</p>
              </CardContent>
          </Card>
          <Card>
              <CardHeader>
                  <CardTitle className="font-headline">Expected Value & Variance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                  <div>
                      <h4 className="font-semibold">Expected Value (Mean)</h4>
                      <FormulaBlock><BlockMath math="E[X] = \frac{1}{p}" /></FormulaBlock>
                      <p className="text-sm text-muted-foreground mt-2">If a trade has a 25% chance of success (p=0.25), you would expect to wait, on average, 1/0.25 = 4 trades for your first winner.</p>
                  </div>
                  <div>
                      <h4 className="font-semibold">Variance</h4>
                      <FormulaBlock><BlockMath math="Var(X) = \frac{1-p}{p^2}" /></FormulaBlock>
                  </div>
              </CardContent>
          </Card>
        </PageSection>

        <PageSection title="Applications">
          <KeyConceptAlert title="Quantitative Finance: Modeling Time to First Default" icon="brain">
            <p>An analyst models the probability of a company defaulting in any given year as `p=0.05`. They can use the Geometric distribution to answer questions like:</p>
            <ul className="list-disc pl-5 mt-2 text-sm space-y-1">
              <li>"What is the probability the company defaults for the first time in year 5?" (<InlineMath math="P(X=5)" />)</li>
              <li>"What is the average number of years we expect this company to survive without defaulting?" (<InlineMath math="E[X] = 1/0.05 = 20" /> years)</li>
            </ul>
          </KeyConceptAlert>
        </PageSection>

      </div>
    </>
  );
}
