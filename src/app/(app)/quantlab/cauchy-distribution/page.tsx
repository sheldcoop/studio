
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
import { CauchyDashboard } from '@/components/quantlab/dashboards/CauchyDashboard';
import { FormulaBlock } from '@/components/app/formula-block';
import { PageSection } from '@/components/app/page-section';
import { ExampleStep } from '@/components/app/example-step';

// --- Main Page Component ---
export default function CauchyDistributionPage() {
  return (
    <>
      <PageHeader
        title="Cauchy Distribution"
        description="Modeling extreme events and 'fat-tailed' phenomena."
        variant="aligned-left"
      />
      <div className="mx-auto max-w-5xl space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">The "Black Swan" Distribution</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-base leading-relaxed text-foreground/90">
            <p>
                The Cauchy distribution (also known as the Lorentz distribution) is a continuous probability distribution famous for its heavy, or "fat," tails. This means it assigns a much higher probability to extreme events compared to the normal distribution.
            </p>
            <p>
              In finance, it's a powerful conceptual tool for modeling phenomena where "black swan" events are more common than traditional models suggest. Its most striking feature is that its expected value (mean) and variance are undefined. No matter how many samples you take, the average will not converge, making it a radical departure from well-behaved distributions like the Normal distribution.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Interactive Cauchy Distribution</CardTitle>
            <CardDescription>Adjust the location (x₀) and scale (γ) parameters to see how the shape of the distribution changes. Note how the tails remain "heavy" even with a small scale parameter.</CardDescription>
          </CardHeader>
          <CardContent>
            <CauchyDashboard />
          </CardContent>
        </Card>

        <PageSection title="Core Concepts">
          <Card>
              <CardHeader>
                  <CardTitle className="font-headline">Probability Density Function (PDF)</CardTitle>
                  <CardDescription>The PDF gives the characteristic bell-shape, but with much heavier tails than the Normal distribution.</CardDescription>
              </CardHeader>
              <CardContent>
                   <FormulaBlock>
                    <BlockMath math="f(x; x_0, \gamma) = \frac{1}{\pi\gamma \left[1 + \left(\frac{x-x_0}{\gamma}\right)^2\right]}" />
                  </FormulaBlock>
                   <ul className="list-disc pl-6 space-y-2 text-sm mt-4">
                      <li><InlineMath math="x_0" /> is the <strong>location</strong> parameter, which specifies the location of the peak (the median and mode).</li>
                      <li><InlineMath math="\gamma > 0" /> (gamma) is the <strong>scale</strong> parameter, which specifies the half-width at half-maximum.</li>
                  </ul>
              </CardContent>
          </Card>
           <Card>
              <CardHeader>
                  <CardTitle className="font-headline">Cumulative Distribution Function (CDF)</CardTitle>
              </CardHeader>
              <CardContent>
                   <FormulaBlock>
                    <BlockMath math="F(x; x_0, \gamma) = \frac{1}{\pi} \arctan\left(\frac{x - x_0}{\gamma}\right) + \frac{1}{2}" />
                   </FormulaBlock>
              </CardContent>
          </Card>
        </PageSection>

        <PageSection title="Key Derivations: The Undefined Moments">
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline">Why is the Expected Value (Mean) Undefined?</CardTitle>
                    <CardDescription>
                        The mean is undefined because the integral required to calculate it does not converge to a finite value. This is a result of the "fat tails" not decaying quickly enough.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <ExampleStep stepNumber={1} title="Set up the Integral for Expected Value">
                        <p>For a standard Cauchy distribution (<InlineMath math="x_0=0, \gamma=1" />), the expected value is given by the integral:</p>
                        <BlockMath math="E[X] = \int_{-\infty}^{\infty} x \cdot f(x) dx = \int_{-\infty}^{\infty} \frac{x}{\pi(1+x^2)} dx" />
                    </ExampleStep>
                    <ExampleStep stepNumber={2} title="Evaluate the Integral">
                        <p>We can split this integral. The antiderivative of <InlineMath math="\frac{x}{1+x^2}" /> is <InlineMath math="\frac{1}{2}\ln(1+x^2)" />.</p>
                        <BlockMath math="E[X] = \frac{1}{\pi} \left[ \frac{1}{2} \ln(1+x^2) \right]_{-\infty}^{\infty}" />
                        <p>When we evaluate this at the limits:</p>
                        <BlockMath math="\lim_{a \to \infty} \frac{1}{2\pi} (\ln(1+a^2) - \ln(1+(-a)^2)) = \lim_{a \to \infty} \frac{1}{2\pi} (\ln(1+a^2) - \ln(1+a^2))" />
                        <p>This results in the indeterminate form <InlineMath math="\infty - \infty" />. Because the integral does not converge to a single finite value, the expected value is formally <strong>undefined</strong>.</p>
                    </ExampleStep>
                </CardContent>
            </Card>

             <Card>
                <CardHeader>
                    <CardTitle className="font-headline">Why is the Variance Undefined?</CardTitle>
                </CardHeader>
                <CardContent>
                     <p>Since the mean is undefined, the variance, which is defined as <InlineMath math="E[(X - E[X])^2]" />, must also be undefined.</p>
                </CardContent>
            </Card>
        </PageSection>

      </div>
    </>
  );
}
