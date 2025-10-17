
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
import { TDistributionDashboard } from '@/components/quantlab/dashboards/TDistributionDashboard';
import { PageSection } from '@/components/app/page-section';
import { FormulaBlock } from '@/components/app/formula-block';
import { ExampleStep } from '@/components/app/example-step';


// --- Main Page Component ---
export default function TDistributionPage() {
  return (
    <>
      <PageHeader
        title="Student's t-Distribution"
        description="The backbone of hypothesis testing with small sample sizes."
        variant="aligned-left"
      />
      <div className="mx-auto max-w-5xl space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">The "Small Sample" Distribution</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-base leading-relaxed text-foreground/90">
            <p>
              The t-distribution is a type of probability distribution that is similar to the normal distribution but has heavier tails. This means it assigns more probability to extreme values. It is used in place of the normal distribution when you have small sample sizes (typically n &lt; 30) and the population standard deviation is unknown.
            </p>
            <p>
              In finance, this is incredibly common. You rarely know the true volatility of an asset and often work with limited historical data. The t-distribution provides a more cautious and robust framework for constructing confidence intervals and performing hypothesis tests (like the t-test) in these real-world scenarios.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Interactive t-Distribution</CardTitle>
            <CardDescription>Adjust the degrees of freedom to see how the t-distribution compares to the standard normal distribution. Notice how it converges to the normal distribution as `df` increases.</CardDescription>
          </CardHeader>
          <CardContent>
            <TDistributionDashboard />
          </CardContent>
        </Card>

        <PageSection title="Core Concepts">
          <Card>
              <CardHeader>
                  <CardTitle className="font-headline">Probability Density Function (PDF)</CardTitle>
                  <CardDescription>The PDF is defined by its single parameter: the degrees of freedom (<InlineMath math="\nu" /> or `df`).</CardDescription>
              </CardHeader>
              <CardContent>
                   <FormulaBlock>
                    <BlockMath math="f(t) = \frac{\Gamma(\frac{\nu+1}{2})}{\sqrt{\nu\pi}\Gamma(\frac{\nu}{2})} \left(1 + \frac{t^2}{\nu}\right)^{-\frac{\nu+1}{2}}" />
                  </FormulaBlock>
                   <ul className="list-disc pl-6 space-y-2 text-sm mt-4">
                      <li><InlineMath math="\nu" /> (nu) represents the degrees of freedom, which is typically the sample size minus one (n - 1).</li>
                      <li><InlineMath math="\Gamma" /> is the Gamma function.</li>
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
                      <FormulaBlock><BlockMath math="E[X] = 0 \quad \text{for } \nu > 1" /></FormulaBlock>
                  </div>
                  <div>
                      <h4 className="font-semibold">Variance</h4>
                      <FormulaBlock><BlockMath math="Var(X) = \frac{\nu}{\nu - 2} \quad \text{for } \nu > 2" /></FormulaBlock>
                      <p className="text-sm text-muted-foreground mt-2">Notice that the variance is always greater than 1, reflecting the "fatter tails" compared to the standard normal distribution (which has a variance of 1).</p>
                  </div>
              </CardContent>
          </Card>
        </PageSection>

        <PageSection title="Key Derivations">
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline">Deriving the Moments</CardTitle>
                    <CardDescription>
                        The mean and variance are derived by integrating over the PDF. These derivations show why the degrees of freedom are critical.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                    <div className="border-b pb-8">
                      <h4 className="font-semibold text-lg">Deriving the Expected Value (Mean)</h4>
                       <ExampleStep stepNumber={1} title="Set up the Integral for E[T]">
                            <p>The expected value is the integral of <InlineMath math="t \cdot f(t)"/> over its domain <InlineMath math="(-\infty, \infty)"/>.</p>
                            <BlockMath math="E[T] = \int_{-\infty}^{\infty} t \cdot \frac{\Gamma(\frac{\nu+1}{2})}{\sqrt{\nu\pi}\Gamma(\frac{\nu}{2})} \left(1 + \frac{t^2}{\nu}\right)^{-\frac{\nu+1}{2}} dt" />
                       </ExampleStep>
                       <ExampleStep stepNumber={2} title="Analyze the Integrand">
                           <p>Let's look at the function being integrated. The constant part can be pulled out. The core of the function is <InlineMath math="g(t) = t \cdot \left(1 + \frac{t^2}{\nu}\right)^{-\frac{\nu+1}{2}}"/>.</p>
                           <p>We can check if this is an odd or even function. Let's find <InlineMath math="g(-t)"/>:</p>
                           <BlockMath math="g(-t) = (-t) \cdot \left(1 + \frac{(-t)^2}{\nu}\right)^{-\frac{\nu+1}{2}} = -t \cdot \left(1 + \frac{t^2}{\nu}\right)^{-\frac{\nu+1}{2}} = -g(t)" />
                           <p>Since <InlineMath math="g(-t) = -g(t)"/>, the integrand is an **odd function**. The integral of any odd function over a symmetric interval like <InlineMath math="(-\infty, \infty)"/> is zero.</p>
                       </ExampleStep>
                       <ExampleStep stepNumber={3} title="Conclusion (with a condition)">
                           <p>This integral is guaranteed to be zero **if and only if it converges**. The integral converges only when the degrees of freedom <InlineMath math="\nu > 1"/>.</p>
                           <FormulaBlock>
                                <CardTitle className="text-lg mb-2">Final Mean Formula</CardTitle>
                               <BlockMath math="E[T] = 0 \quad (\text{for } \nu > 1)" />
                           </FormulaBlock>
                       </ExampleStep>
                    </div>

                    <div>
                      <h4 className="font-semibold text-lg">Deriving the Variance</h4>
                       <p className="text-sm text-muted-foreground mb-4">We use <InlineMath math="Var(T) = E[T^2] - (E[T])^2" />. Since <InlineMath math="E[T]=0"/> (for ν > 2, which is required for variance anyway), we just need to find <InlineMath math="E[T^2]" />.</p>
                       <ExampleStep stepNumber={1} title="Set up the Integral for E[T²]">
                           <BlockMath math="E[T^2] = \int_{-\infty}^{\infty} t^2 \cdot f(t) dt" />
                           <p>The integrand <InlineMath math="t^2 \cdot f(t)"/> is an **even function**, so we can simplify the integral:</p>
                           <BlockMath math="E[T^2] = 2 \int_{0}^{\infty} t^2 \cdot \frac{\Gamma(\frac{\nu+1}{2})}{\sqrt{\nu\pi}\Gamma(\frac{\nu}{2})} \left(1 + \frac{t^2}{\nu}\right)^{-\frac{\nu+1}{2}} dt" />
                       </ExampleStep>
                        <ExampleStep stepNumber={2} title="Use Substitution">
                           <p>This integral is complex. The standard solution involves a substitution related to the Beta function. Let <InlineMath math="y = \frac{1}{1+t^2/\nu}"/>.</p>
                           <p>After significant algebraic manipulation and applying the properties of the Beta and Gamma functions, the integral simplifies.</p>
                       </ExampleStep>
                       <ExampleStep stepNumber={3} title="The Result">
                          <p>The integral evaluates to <InlineMath math="E[T^2] = \frac{\nu}{\nu-2}"/>, but this only converges when <InlineMath math="\nu > 2"/>.</p>
                          <FormulaBlock>
                            <CardTitle className="text-lg mb-2">Final Variance Formula</CardTitle>
                            <BlockMath math="Var(T) = \frac{\nu}{\nu - 2} \quad (\text{for } \nu > 2)" />
                          </FormulaBlock>
                       </ExampleStep>
                    </div>
                </CardContent>
            </Card>
        </PageSection>

      </div>
    </>
  );
}
