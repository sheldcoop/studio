
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
import { ExampleStep } from '@/components/app/example-step';

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

        <PageSection title="Key Derivations">
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline">Deriving the Mean & Variance</CardTitle>
                    <CardDescription>
                        The mean is straightforward due to symmetry. The variance requires integration by parts.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                    <div className="border-b pb-8">
                      <h4 className="font-semibold text-lg">Deriving the Expected Value (Mean)</h4>
                       <ExampleStep stepNumber={1} title="Use Symmetry">
                            <p>The Laplace PDF is symmetric around <InlineMath math="\mu"/>. The function <InlineMath math="g(x) = (x-\mu)f(x | \mu, b)"/> is an odd function with respect to <InlineMath math="x=\mu"/>. The integral of an odd function over a symmetric interval is zero.</p>
                            <BlockMath math="E[X-\mu] = \int_{-\infty}^{\infty} (x-\mu) f(x | \mu, b) dx = 0" />
                       </ExampleStep>
                       <ExampleStep stepNumber={2} title="Solve for E[X]">
                            <p>Using the linearity of expectation, <InlineMath math="E[X-\mu] = E[X] - E[\mu] = E[X] - \mu"/>.</p>
                             <p>Therefore, <InlineMath math="E[X] - \mu = 0"/>, which leads to our result.</p>
                             <FormulaBlock>
                                <CardTitle className="text-lg mb-2">Final Mean Formula</CardTitle>
                                <BlockMath math="E[X] = \mu" />
                            </FormulaBlock>
                       </ExampleStep>
                    </div>

                    <div>
                      <h4 className="font-semibold text-lg">Deriving the Variance</h4>
                      <p className="text-sm text-muted-foreground mb-4">We need to solve <InlineMath math="Var(X) = E[(X-\mu)^2] = \int_{-\infty}^{\infty} (x-\mu)^2 f(x | \mu, b) dx"/>. Let <InlineMath math="y=x-\mu"/> and use the PDF for <InlineMath math="\mu=0"/> for simplicity.</p>
                      <ExampleStep stepNumber={1} title="Set up the Integral for E[Y²]">
                           <BlockMath math="E[Y^2] = \int_{-\infty}^{\infty} y^2 \frac{1}{2b} e^{-|y|/b} dy" />
                           <p>Since the integrand is an even function, we can simplify this to:</p>
                           <BlockMath math="E[Y^2] = 2 \int_{0}^{\infty} y^2 \frac{1}{2b} e^{-y/b} dy = \frac{1}{b} \int_{0}^{\infty} y^2 e^{-y/b} dy" />
                       </ExampleStep>
                        <ExampleStep stepNumber={2} title="Apply Integration by Parts (First Pass)">
                            <p>Let <InlineMath math="u = y^2"/> and <InlineMath math="dv = e^{-y/b} dy"/>. Then <InlineMath math="du = 2y dy"/> and <InlineMath math="v = -b e^{-y/b}"/>. Using <InlineMath math="\int u dv = uv - \int v du"/>:</p>
                            <BlockMath math="\frac{1}{b} \left( \left[ -by^2 e^{-y/b} \right]_0^\infty - \int_0^\infty (-b e^{-y/b})(2y) dy \right)" />
                            <p>The first term evaluates to 0. We are left with:</p>
                            <BlockMath math="= \frac{1}{b} \int_0^\infty 2by e^{-y/b} dy = 2 \int_0^\infty y e^{-y/b} dy" />
                       </ExampleStep>
                       <ExampleStep stepNumber={3} title="Apply Integration by Parts (Second Pass)">
                          <p>We integrate <InlineMath math="\int_0^\infty y e^{-y/b} dy"/>. Let <InlineMath math="u=y"/> and <InlineMath math="dv=e^{-y/b}dy"/>. Then <InlineMath math="du=dy"/> and <InlineMath math="v=-be^{-y/b}"/>.</p>
                          <BlockMath math="\left[ -by e^{-y/b} \right]_0^\infty - \int_0^\infty (-b e^{-y/b}) dy" />
                          <p>The first term is 0. The second term is:</p>
                          <BlockMath math="b \int_0^\infty e^{-y/b} dy = b \left[ -b e^{-y/b} \right]_0^\infty = b (-0 - (-b)) = b^2" />
                       </ExampleStep>
                       <ExampleStep stepNumber={4} title="Combine Results">
                           <p>Substituting the result from Step 3 back into the end of Step 2:</p>
                           <BlockMath math="E[Y^2] = 2 \times (b^2) = 2b^2" />
                           <p>Since <InlineMath math="Y = X-\mu"/> and <InlineMath math="E[Y]=0"/>, we have <InlineMath math="Var(X) = Var(Y) = E[Y^2] - (E[Y])^2 = 2b^2 - 0"/>.</p>
                           <FormulaBlock>
                               <CardTitle className="text-lg mb-2">Final Variance Formula</CardTitle>
                               <BlockMath math="Var(X) = 2b^2" />
                           </FormulaBlock>
                       </ExampleStep>
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
