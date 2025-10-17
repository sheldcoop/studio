
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
import { LogisticDashboard } from '@/components/quantlab/dashboards/LogisticDashboard';
import { FormulaBlock } from '@/components/app/formula-block';
import { PageSection } from '@/components/app/page-section';
import { ExampleStep } from '@/components/app/example-step';

// --- Main Page Component ---
export default function LogisticDistributionPage() {
  return (
    <>
      <PageHeader
        title="Logistic Distribution"
        description="A key distribution in machine learning and growth modeling."
        variant="aligned-left"
      />
      <div className="mx-auto max-w-5xl space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">The "Growth Curve" Distribution</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-base leading-relaxed text-foreground/90">
            <p>
                The Logistic distribution is a continuous probability distribution whose cumulative distribution function is the logistic function, which appears in logistic regression and feedforward neural networks. It resembles the normal distribution but has heavier tails, meaning it gives more probability to extreme events.
            </p>
            <p>
              In finance, it's used in credit risk modeling to estimate the probability of default. Its S-shaped cumulative distribution function is perfect for modeling phenomena that have a "saturation" point, like the adoption rate of a new technology or the market share of a product.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Interactive Logistic Distribution</CardTitle>
            <CardDescription>Adjust the location (μ) and scale (s) parameters to see how the shape of the distribution changes.</CardDescription>
          </CardHeader>
          <CardContent>
            <LogisticDashboard />
          </CardContent>
        </Card>

        <PageSection title="Core Concepts">
          <Card>
              <CardHeader>
                  <CardTitle className="font-headline">Probability Density Function (PDF)</CardTitle>
              </CardHeader>
              <CardContent>
                   <FormulaBlock>
                    <BlockMath math="f(x; \mu, s) = \frac{e^{-(x-\mu)/s}}{s(1+e^{-(x-\mu)/s})^2}" />
                  </FormulaBlock>
                   <ul className="list-disc pl-6 space-y-2 text-sm mt-4">
                      <li><InlineMath math="\mu" /> (mu) is the <strong>location</strong> parameter, which is also the mean, median, and mode.</li>
                      <li><InlineMath math="s > 0" /> is the <strong>scale</strong> parameter, which is proportional to the standard deviation.</li>
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
                      <FormulaBlock><BlockMath math="Var(X) = \frac{s^2 \pi^2}{3}" /></FormulaBlock>
                  </div>
              </CardContent>
          </Card>
        </PageSection>

        <PageSection title="Key Derivations">
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline">Deriving the Mean & Variance</CardTitle>
                    <CardDescription>
                        The derivations for the moments of the Logistic distribution are most clearly shown using the moment-generating function (MGF).
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                    <div className="border-b pb-8">
                      <h4 className="font-semibold text-lg">Deriving the Expected Value (Mean)</h4>
                       <ExampleStep stepNumber={1} title="The Moment-Generating Function (MGF)">
                            <p>For a standard logistic distribution (<InlineMath math="\mu=0, s=1"/>), the MGF is known to be:</p>
                            <BlockMath math="M_X(t) = E[e^{tX}] = \pi t \csc(\pi t) = \frac{\pi t}{\sin(\pi t)}" />
                            <p className="text-sm text-muted-foreground mt-2">The mean is the first derivative of the MGF, evaluated at t=0.</p>
                       </ExampleStep>
                       <ExampleStep stepNumber={2} title="Calculate the First Derivative">
                            <p>We need to find <InlineMath math="M_X'(0)"/>. Using L'Hôpital's rule is easiest. The derivative of the MGF is complex, but its limit as <InlineMath math="t \to 0"/> is 0.</p>
                             <BlockMath math="E[X] = M_X'(0) = 0" />
                             <p className="mt-2">For a general logistic distribution <InlineMath math="Y = \mu + sX"/>, the mean is:</p>
                             <BlockMath math="E[Y] = E[\mu + sX] = \mu + sE[X] = \mu + s(0) = \mu" />
                       </ExampleStep>
                       <FormulaBlock>
                            <CardTitle className="text-lg mb-2">Final Mean Formula</CardTitle>
                            <BlockMath math="E[X] = \mu" />
                       </FormulaBlock>
                    </div>

                    <div>
                      <h4 className="font-semibold text-lg">Deriving the Variance</h4>
                      <p className="text-sm text-muted-foreground mb-4">We use <InlineMath math="Var(X) = E[X^2] - (E[X])^2" />. We need the second moment, <InlineMath math="E[X^2]" />.</p>
                      <ExampleStep stepNumber={1} title="Calculate the Second Derivative of the MGF">
                            <p>The second moment <InlineMath math="E[X^2]"/> for the standard distribution is the second derivative of the MGF, evaluated at t=0.</p>
                            <BlockMath math="E[X^2] = M_X''(0)" />
                            <p>This is a more complex derivative, which can be shown to evaluate to:</p>
                             <BlockMath math="M_X''(0) = \frac{\pi^2}{3}" />
                             <p className="mt-2">So, for the standard distribution, <InlineMath math="Var(X) = E[X^2] - (E[X])^2 = \frac{\pi^2}{3} - 0^2 = \frac{\pi^2}{3}"/>.</p>
                       </ExampleStep>
                        <ExampleStep stepNumber={2} title="Scale for the General Distribution">
                            <p>For the general distribution <InlineMath math="Y = \mu + sX"/>, the variance is:</p>
                            <BlockMath math="Var(Y) = Var(\mu + sX) = Var(sX) = s^2 Var(X)" />
                            <BlockMath math="= s^2 \frac{\pi^2}{3}" />
                       </ExampleStep>
                       <FormulaBlock>
                            <CardTitle className="text-lg mb-2">Final Variance Formula</CardTitle>
                            <BlockMath math="Var(X) = \frac{s^2 \pi^2}{3}" />
                       </FormulaBlock>
                    </div>
                </CardContent>
            </Card>
        </PageSection>

      </div>
    </>
  );
}
