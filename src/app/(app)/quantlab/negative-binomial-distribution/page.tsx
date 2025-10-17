
'use client';

import { useState } from 'react';
import { PageHeader } from '@/components/app/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import { NegativeBinomialDashboard } from '@/components/quantlab/dashboards/NegativeBinomialDashboard';
import { PageSection } from '@/components/app/page-section';
import { KeyConceptAlert } from '@/components/app/key-concept-alert';
import { InteractiveFormula } from '@/components/app/interactive-formula';
import { ExampleStep } from '@/components/app/example-step';
import { FormulaBlock } from '@/components/app/formula-block';

export default function NegativeBinomialDistributionPage() {
  const [highlightValue, setHighlightValue] = useState<string | number | null>(null);

  return (
    <>
      <PageHeader
        title="Negative Binomial Distribution"
        description="Modeling the number of trials needed to achieve a specified number of successes."
        variant="aligned-left"
      />
      <div className="mx-auto max-w-5xl space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">A Generalization of the Geometric Distribution</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-base leading-relaxed text-foreground/90">
            <p>
              The Negative Binomial distribution answers the question: "How many trials will it take to get my <InlineMath math="r"/>-th success?" It is a generalization of the Geometric distribution, which is just the special case where <InlineMath math="r=1"/>.
            </p>
            <p>
              In finance, a trader might use this to model how many trades it will take to achieve 10 winning trades. A venture capitalist could model how many startups they need to fund to get 3 successful exits.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Interactive Negative Binomial Distribution</CardTitle>
            <CardDescription>Adjust the required number of successes (<InlineMath math="r"/>) and the probability (<InlineMath math="p"/>) to see how the distribution changes.</CardDescription>
          </CardHeader>
          <CardContent>
            <NegativeBinomialDashboard highlightValue={highlightValue} onBarHover={setHighlightValue} />
          </CardContent>
        </Card>

        <PageSection title="Core Concepts">
          <InteractiveFormula
            title="Probability Mass Function (PMF)"
            description="The PMF gives the probability that the r-th success occurs on exactly the k-th trial."
            formula="P(X=k) = \binom{k-1}{r-1} p^r (1-p)^{k-r}"
            explanation={
              <>
                <p>For the <InlineMath math="r"/>-th success to happen on trial <InlineMath math="k"/>, two things must be true:</p>
                <ul className="list-disc pl-6 space-y-2 mt-2">
                    <li>In the first <InlineMath math="k-1"/> trials, there must have been exactly <InlineMath math="r-1"/> successes. The number of ways this can happen is <InlineMath math="\binom{k-1}{r-1}"/>.</li>
                    <li>The <InlineMath math="k"/>-th trial itself must be a success (with probability <InlineMath math="p"/>).</li>
                    <li>The overall probability combines the ways the previous successes could happen with the probabilities of those successes and failures: <InlineMath math="\binom{k-1}{r-1} \times p^{r-1} \times (1-p)^{(k-1)-(r-1)}"/>, and then all of that is multiplied by the probability of the final success on trial <InlineMath math="k"/>, which gives <InlineMath math="p^r (1-p)^{k-r}"/>.</li>
                </ul>
              </>
            }
          >
            {(highlight, onHover) => (
                <NegativeBinomialDashboard isSubcomponent={true} highlightValue={highlight} onBarHover={onHover} />
            )}
          </InteractiveFormula>
        </PageSection>

        <PageSection title="Key Derivations">
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline">Deriving the Mean and Variance</CardTitle>
                    <CardDescription>The moments are most intuitively derived by viewing the Negative Binomial as a sum of Geometric random variables.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                     <div className="border-b pb-8">
                      <h4 className="font-semibold text-lg">Deriving the Expected Value (Mean)</h4>
                       <ExampleStep stepNumber={1} title="Decompose into Geometric Variables">
                            <p>Let <InlineMath math="X"/> be the total number of trials to get <InlineMath math="r"/> successes. We can think of <InlineMath math="X"/> as the sum of <InlineMath math="r"/> independent random variables, where each <InlineMath math="Y_i"/> is the number of trials to get the next success after the previous one.</p>
                            <BlockMath math="X = Y_1 + Y_2 + \dots + Y_r"/>
                            <p>Each <InlineMath math="Y_i"/> follows a Geometric distribution with probability <InlineMath math="p"/>. We know from the Geometric distribution page that <InlineMath math="E[Y_i] = 1/p"/>.</p>
                       </ExampleStep>
                       <ExampleStep stepNumber={2} title="Use Linearity of Expectation">
                           <p>The expectation of a sum is the sum of the expectations.</p>
                           <BlockMath math="E[X] = E[Y_1 + Y_2 + \dots + Y_r] = E[Y_1] + E[Y_2] + \dots + E[Y_r]"/>
                       </ExampleStep>
                        <ExampleStep stepNumber={3} title="Sum the Geometric Means">
                           <p>Since each <InlineMath math="Y_i"/> has the same mean, we are just adding <InlineMath math="1/p"/> to itself <InlineMath math="r"/> times.</p>
                           <BlockMath math="E[X] = \sum_{i=1}^{r} \frac{1}{p} = r \cdot \frac{1}{p}"/>
                           <FormulaBlock>
                                <CardTitle className="text-lg mb-2">Final Mean Formula</CardTitle>
                               <BlockMath math="E[X] = \frac{r}{p}" />
                           </FormulaBlock>
                       </ExampleStep>
                    </div>

                    <div>
                      <h4 className="font-semibold text-lg">Deriving the Variance</h4>
                       <p className="text-sm text-muted-foreground mb-4">We use the same decomposition as above. The variance of a sum of *independent* random variables is the sum of their variances.</p>
                       <ExampleStep stepNumber={1} title="Sum the Variances of Geometric Variables">
                          <p>The variance of a Geometric distribution is <InlineMath math="Var(Y_i) = (1-p)/p^2"/>.</p>
                          <BlockMath math="Var(X) = Var(Y_1 + \dots + Y_r) = Var(Y_1) + \dots + Var(Y_r)"/>
                       </ExampleStep>
                        <ExampleStep stepNumber={2} title="Final Result">
                           <p>We are adding the same variance to itself <InlineMath math="r"/> times.</p>
                           <BlockMath math="Var(X) = \sum_{i=1}^{r} \frac{1-p}{p^2} = r \cdot \frac{1-p}{p^2}"/>
                           <FormulaBlock>
                                <CardTitle className="text-lg mb-2">Final Variance Formula</CardTitle>
                               <BlockMath math="Var(X) = \frac{r(1-p)}{p^2}" />
                           </FormulaBlock>
                       </ExampleStep>
                    </div>
                </CardContent>
            </Card>
        </PageSection>

        <PageSection title="Applications">
          <KeyConceptAlert title="Quantitative Finance: Structuring Products" icon="brain">
            <p>An investment bank is structuring a "first-to-default" credit-linked note on a basket of 10 bonds. They need to achieve their first (`r=1`) default to trigger a payout. If the annual probability of default for any bond is `p`, they can use the Geometric distribution (a special case of Negative Binomial with r=1) to model the waiting time for this event and price the note accordingly.</p>
          </KeyConceptAlert>
        </PageSection>
      </div>
    </>
  );
}
