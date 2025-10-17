
'use client';

import { useState } from 'react';
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
import { BetaDashboard } from '@/components/quantlab/dashboards/BetaDashboard';
import { FormulaBlock } from '@/components/app/formula-block';
import { PageSection } from '@/components/app/page-section';
import { InteractiveFormula } from '@/components/app/interactive-formula';

// --- Main Page Component ---
export default function BetaDistributionPage() {
  const [highlightValue, setHighlightValue] = useState<string | number | null>(null);

  return (
    <>
      <PageHeader
        title="Beta Distribution"
        description="Modeling probabilities, percentages, and proportions."
        variant="aligned-left"
      />
      <div className="mx-auto max-w-5xl space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">The "Probability of Probabilities" Distribution</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-base leading-relaxed text-foreground/90">
            <p>
                The Beta distribution is a continuous probability distribution defined on the interval [0, 1]. This makes it perfectly suited for modeling random variables that represent probabilities or proportions.
            </p>
            <p>
              In quantitative finance, it's a powerful tool in Bayesian inference and risk modeling. For example, a credit analyst might use it to model the recovery rate on a defaulted loan (which must be between 0% and 100%). A trading strategist could use it to represent the probability of a particular signal being profitable.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Interactive Beta Distribution</CardTitle>
            <CardDescription>Adjust the shape parameters (α and β) to see how they influence the distribution. Note the wide variety of shapes the Beta distribution can take.</CardDescription>
          </CardHeader>
          <CardContent>
            <BetaDashboard />
          </CardContent>
        </Card>

        <PageSection title="Core Concepts">
            <Card>
              <CardHeader>
                  <CardTitle className="font-headline">Probability Density Function (PDF)</CardTitle>
                  <CardDescription>The PDF is defined by two positive shape parameters, α and β.</CardDescription>
              </CardHeader>
              <CardContent>
                   <FormulaBlock>
                    <BlockMath math="f(x; \alpha, \beta) = \frac{x^{\alpha-1} (1-x)^{\beta-1}}{B(\alpha, \beta)}" />
                  </FormulaBlock>
                  <ul className="list-disc pl-6 space-y-2 text-sm mt-4">
                      <li><InlineMath math="x" /> is the variable (a probability, between 0 and 1).</li>
                      <li><InlineMath math="\alpha" /> and <InlineMath math="\beta" /> can be thought of as counts of "successes" and "failures".</li>
                      <li><InlineMath math="B(\alpha, \beta)" /> is the Beta function, which acts as a normalizing constant.</li>
                  </ul>
              </CardContent>
          </Card>
            <Card>
              <CardHeader>
                  <CardTitle className="font-headline">Cumulative Distribution Function (CDF)</CardTitle>
                  <CardDescription>The CDF is the regularized incomplete beta function.</CardDescription>
              </CardHeader>
              <CardContent>
                   <FormulaBlock>
                    <BlockMath math="F(x; \alpha, \beta) = I_x(\alpha, \beta)" />
                  </FormulaBlock>
                  <p className="text-sm mt-4">This function is computationally complex and is almost always calculated using statistical software.</p>
              </CardContent>
          </Card>
           <Card>
              <CardHeader>
                  <CardTitle className="font-headline">Expected Value & Variance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                  <div>
                      <h4 className="font-semibold">Expected Value (Mean)</h4>
                      <FormulaBlock><BlockMath math="E[X] = \frac{\alpha}{\alpha + \beta}" /></FormulaBlock>
                  </div>
                  <div>
                      <h4 className="font-semibold">Variance</h4>
                      <FormulaBlock><BlockMath math="Var(X) = \frac{\alpha \beta}{(\alpha + \beta)^2 (\alpha + \beta + 1)}" /></FormulaBlock>
                  </div>
              </CardContent>
          </Card>
        </PageSection>
      </div>
    </>
  );
}
