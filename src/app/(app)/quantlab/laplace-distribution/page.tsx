
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
import { LaplaceDashboard } from '@/components/quantlab/dashboards/LaplaceDashboard';
import { FormulaBlock } from '@/components/app/formula-block';
import { PageSection } from '@/components/app/page-section';
import { KeyConceptAlert } from '@/components/app/key-concept-alert';

// --- Main Page Component ---
export default function LaplaceDistributionPage() {
  return (
    <>
      <PageHeader
        title="Laplace Distribution"
        description="A sharp-peaked, fat-tailed alternative to the Normal Distribution."
        variant="aligned-left"
      />
      <div className="mx-auto max-w-5xl space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">The "Double Exponential" Distribution</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-base leading-relaxed text-foreground/90">
            <p>
                The Laplace distribution is a continuous probability distribution that is notable for its sharper peak at the mean and its "fatter" tails compared to the Normal distribution. This means it assigns higher probability to values near the mean and also to extreme outlier events.
            </p>
            <p>
              In finance and machine learning, this makes it a valuable tool. It can model financial returns that are more prone to extreme events than a normal model would suggest. It is also intrinsically linked to LASSO (L1) regularization, a popular technique in regression for feature selection, because its shape naturally encourages some parameters to go to zero.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Interactive Laplace Distribution</CardTitle>
            <CardDescription>Adjust the location (μ) and scale (b) parameters to see how the distinctive shape of the distribution changes.</CardDescription>
          </CardHeader>
          <CardContent>
            <LaplaceDashboard />
          </CardContent>
        </Card>

        <PageSection title="Core Concepts">
          <Card>
              <CardHeader>
                  <CardTitle className="font-headline">Probability Density Function (PDF)</CardTitle>
              </CardHeader>
              <CardContent>
                   <FormulaBlock>
                    <BlockMath math="f(x | \mu, b) = \frac{1}{2b} \exp\left( -\frac{|x - \mu|}{b} \right)" />
                  </FormulaBlock>
                   <ul className="list-disc pl-6 space-y-2 text-sm mt-4">
                      <li><InlineMath math="\mu" /> (mu) is the <strong>location</strong> parameter, which is also the mean, median, and mode.</li>
                      <li><InlineMath math="b > 0" /> is the <strong>scale</strong> parameter, which controls the spread or "width" of the distribution.</li>
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
                      <FormulaBlock><BlockMath math="E[X] = \mu" /></FormulaBlock>
                  </div>
                  <div>
                      <h4 className="font-semibold">Variance</h4>
                      <FormulaBlock><BlockMath math="Var(X) = 2b^2" /></FormulaBlock>
                  </div>
              </CardContent>
          </Card>
        </PageSection>

        <PageSection title="Applications">
            <KeyConceptAlert title="Machine Learning: LASSO Regression" icon="brain">
              <p>In Bayesian statistics, using a Laplace distribution as the prior for regression coefficients is equivalent to performing LASSO (L1) regularization. The sharp peak at zero in the Laplace prior "encourages" coefficients of irrelevant features to be exactly zero, effectively performing feature selection and creating a simpler, more interpretable model.</p>
            </KeyConceptAlert>
        </PageSection>
      </div>
    </>
  );
}
