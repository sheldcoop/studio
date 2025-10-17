
'use client';

import { useState } from 'react';
import { PageHeader } from '@/components/app/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import { DiscreteUniformDashboard } from '@/components/quantlab/dashboards/DiscreteUniformDashboard';
import { PageSection } from '@/components/app/page-section';
import { KeyConceptAlert } from '@/components/app/key-concept-alert';
import { InteractiveFormula } from '@/components/app/interactive-formula';

export default function DiscreteUniformDistributionPage() {
  const [highlightValue, setHighlightValue] = useState<string | number | null>(null);

  return (
    <>
      <PageHeader
        title="Discrete Uniform Distribution"
        description="The simplest scenario in probability: every outcome is equally likely."
        variant="aligned-left"
      />
      <div className="mx-auto max-w-5xl space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">The "Fair Die Roll" Distribution</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-base leading-relaxed text-foreground/90">
            <p>
              The Discrete Uniform distribution describes a situation where there are a finite number of outcomes, and each outcome is equally likely to occur.
            </p>
            <p>
              The most classic example is a single roll of a fair six-sided die. The possible outcomes are [1, 2, 3, 4, 5, 6], and the probability of rolling any one of these numbers is exactly 1/6. There is no bias towards any particular outcome.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Interactive Uniform Distribution</CardTitle>
            <CardDescription>Adjust the number of possible outcomes (<InlineMath math="n"/>) to see how the probability changes.</CardDescription>
          </CardHeader>
          <CardContent>
            <DiscreteUniformDashboard highlightValue={highlightValue} onBarHover={setHighlightValue} />
          </CardContent>
        </Card>

        <PageSection title="Core Concepts">
            <InteractiveFormula
              title="Probability Mass Function (PMF)"
              description="The PMF gives the probability of observing exactly one specific outcome, `k`."
              formula="P(X=k) = \frac{1}{n}"
              explanation={
                <p>Since there are <InlineMath math="n"/> possible outcomes and each is equally likely, the probability of any single outcome <InlineMath math="k"/> occurring is simply <InlineMath math="1/n"/>. For a 6-sided die, this is 1/6 for each face. For a 20-sided die, it's 1/20.</p>
              }
            >
              {(highlight, onHover) => (
                <DiscreteUniformDashboard isSubcomponent={true} highlightValue={highlight} onBarHover={onHover} />
              )}
            </InteractiveFormula>
            
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline">Expected Value & Variance</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <h4 className="font-semibold">Expected Value (Mean)</h4>
                        <BlockMath math="E[X] = \frac{n+1}{2}" />
                        <p className="text-sm text-muted-foreground mt-2">For a fair die with outcomes 1 to `n`, the expected value is the average of the first and last outcome. For a 6-sided die, this is (1+6)/2 = 3.5. This is the balancing point of the distribution.</p>
                    </div>
                    <div>
                        <h4 className="font-semibold">Variance</h4>
                        <BlockMath math="Var(X) = \frac{n^2 - 1}{12}" />
                        <p className="text-sm text-muted-foreground mt-2">The variance measures the spread of the outcomes.</p>
                    </div>
                </CardContent>
            </Card>
        </PageSection>

        <PageSection title="Applications">
          <KeyConceptAlert title="Quantitative Finance: Monte Carlo Simulation Assumptions" icon="brain">
            <p>The Discrete Uniform distribution is often the starting point for Monte Carlo simulations. When modeling a decision with several equally likely strategic choices (e.g., "aggressively buy," "hold," "aggressively sell"), a quant might assign a uniform probability to each choice to simulate a trader's behavior under uncertainty before layering on more complex assumptions.</p>
          </KeyConceptAlert>
        </PageSection>
      </div>
    </>
  );
}
