
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
import { WeibullDashboard } from '@/components/quantlab/dashboards/WeibullDashboard';
import { FormulaBlock } from '@/components/app/formula-block';
import { PageSection } from '@/components/app/page-section';
import { ExampleStep } from '@/components/app/example-step';

// --- Main Page Component ---
export default function WeibullDistributionPage() {
  return (
    <>
      <PageHeader
        title="Weibull Distribution"
        description="Modeling time-to-failure, event durations, and reliability."
        variant="aligned-left"
      />
      <div className="mx-auto max-w-5xl space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">The "Time-to-Event" Distribution</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-base leading-relaxed text-foreground/90">
            <p>
                The Weibull distribution is a highly flexible continuous probability distribution. It's widely used in engineering to model reliability and time-to-failure of components. In finance, it can be applied to model the duration of events, such as the time until a corporate bond defaults or the time a stock price stays above a certain level.
            </p>
            <p>
              Its flexibility comes from its shape parameter, <InlineMath math="k" />. Depending on the value of <InlineMath math="k" />, it can mimic the behavior of other distributions like the exponential (when <InlineMath math="k=1" />) or approximate the normal distribution (when <InlineMath math="k" /> is around 3-4).
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Interactive Weibull Distribution</CardTitle>
            <CardDescription>Adjust the shape (k) and scale (λ) parameters to see how the distribution's form changes.</CardDescription>
          </CardHeader>
          <CardContent>
            <WeibullDashboard />
          </CardContent>
        </Card>

        <PageSection title="Core Concepts">
          <Card>
              <CardHeader>
                  <CardTitle className="font-headline">Probability Density Function (PDF)</CardTitle>
                  <CardDescription>The PDF is defined by its shape parameter `k` and scale parameter `λ`.</CardDescription>
              </CardHeader>
              <CardContent>
                   <FormulaBlock>
                    <BlockMath math="f(x; k, \lambda) = \frac{k}{\lambda} \left(\frac{x}{\lambda}\right)^{k-1} e^{-(x/\lambda)^k}" />
                  </FormulaBlock>
                   <ul className="list-disc pl-6 space-y-2 text-sm mt-4">
                      <li><InlineMath math="x \ge 0" /> is the variable (e.g., time).</li>
                      <li><InlineMath math="k > 0" /> is the <strong>shape</strong> parameter. If <InlineMath math="k < 1" />, the failure rate decreases over time. If <InlineMath math="k = 1" />, it's constant (Exponential). If <InlineMath math="k > 1" />, the failure rate increases over time (wear-out).</li>
                      <li><InlineMath math="\lambda > 0" /> is the <strong>scale</strong> parameter, which stretches or contracts the distribution.</li>
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
                      <FormulaBlock><BlockMath math="E[X] = \lambda \Gamma(1 + 1/k)" /></FormulaBlock>
                  </div>
                  <div>
                      <h4 className="font-semibold">Variance</h4>
                      <FormulaBlock><BlockMath math="Var(X) = \lambda^2 \left[ \Gamma(1 + 2/k) - (\Gamma(1 + 1/k))^2 \right]" /></FormulaBlock>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">These are expressed using the Gamma function, <InlineMath math="\Gamma(z)" />.</p>
              </CardContent>
          </Card>
        </PageSection>

        <PageSection title="Key Derivations">
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline">Deriving the Expected Value (Mean)</CardTitle>
                    <CardDescription>We derive the mean by calculating the integral of <InlineMath math="x \cdot f(x)"/> over its domain [0, ∞).</CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                    <ExampleStep stepNumber={1} title="Set up the Integral for E[X]">
                        <p>The expected value is the integral of <InlineMath math="x"/> times the PDF.</p>
                        <BlockMath math="E[X] = \int_{0}^{\infty} x \cdot \frac{k}{\lambda} \left(\frac{x}{\lambda}\right)^{k-1} e^{-(x/\lambda)^k} dx" />
                    </ExampleStep>
                    <ExampleStep stepNumber={2} title="Simplify the Expression">
                        <p>Combine the <InlineMath math="x"/> terms and rearrange.</p>
                        <BlockMath math="E[X] = \int_{0}^{\infty} \frac{k}{\lambda} \cdot \frac{x^k}{\lambda^{k-1}} \cdot e^{-(x/\lambda)^k} dx = \int_{0}^{\infty} k \frac{x^k}{\lambda^k} e^{-(x/\lambda)^k} dx" />
                    </ExampleStep>
                    <ExampleStep stepNumber={3} title="Apply u-Substitution">
                        <p>This integral becomes much simpler with a substitution. Let <InlineMath math="u = (x/\lambda)^k"/>. Then:</p>
                        <ul className="list-disc pl-5 text-sm space-y-1">
                            <li><InlineMath math="x = \lambda u^{1/k}"/></li>
                            <li>Differentiating with respect to u gives: <InlineMath math="dx = \lambda \frac{1}{k} u^{1/k - 1} du"/></li>
                        </ul>
                         <p className="mt-4">Substituting these back into the integral:</p>
                        <BlockMath math="E[X] = \int_{0}^{\infty} k \cdot u \cdot e^{-u} \cdot \left(\lambda \frac{1}{k} u^{1/k - 1}\right) du" />
                    </ExampleStep>
                     <ExampleStep stepNumber={4} title="Simplify and Recognize the Gamma Function">
                        <p>The `k` terms cancel out. We can combine the `u` terms and pull <InlineMath math="\lambda"/> out of the integral.</p>
                        <BlockMath math="E[X] = \lambda \int_{0}^{\infty} u \cdot u^{1/k - 1} e^{-u} du = \lambda \int_{0}^{\infty} u^{1/k} e^{-u} du" />
                        <p className="mt-4">The integral <InlineMath math="\int_{0}^{\infty} t^{z-1}e^{-t}dt"/> is the definition of the Gamma function <InlineMath math="\Gamma(z)"/>. In our case, <InlineMath math="z-1 = 1/k"/>, so <InlineMath math="z = 1 + 1/k"/>.</p>
                        <p>This gives us the final result:</p>
                         <FormulaBlock>
                              <CardTitle className="text-lg mb-2">Final Mean Formula</CardTitle>
                              <BlockMath math="E[X] = \lambda \Gamma(1 + 1/k)" />
                         </FormulaBlock>
                    </ExampleStep>
                </CardContent>
            </Card>
        </PageSection>

      </div>
    </>
  );
}
