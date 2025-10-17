
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
import { NormalDashboard } from '@/components/quantlab/dashboards/NormalDashboard';
import { PageSection } from '@/components/app/page-section';
import { FormulaBlock } from '@/components/app/formula-block';
import { KeyConceptAlert } from '@/components/app/key-concept-alert';
import { ExampleStep } from '@/components/app/example-step';


// --- Main Page Component ---
export default function NormalDistributionPage() {
  return (
    <>
      <PageHeader
        title="The Normal Distribution"
        description="The ubiquitous 'bell curve' that forms the bedrock of modern statistics."
        variant="aligned-left"
      />
      <div className="mx-auto max-w-5xl space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">The Bell Curve</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-base leading-relaxed text-foreground/90">
            <p>
              The Normal (or Gaussian) distribution is arguably the most important probability distribution in statistics. It's defined by its mean (<InlineMath math="\mu" />) and standard deviation (<InlineMath math="\sigma" />), and its symmetric, bell-shaped curve is instantly recognizable.
            </p>
            <p>
              Many natural phenomena, from heights and weights to measurement errors, tend to follow a normal distribution. In finance, it's the standard (though often flawed) assumption for modeling asset returns.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Interactive Normal Distribution</CardTitle>
            <CardDescription>Adjust the mean and standard deviation to see how they affect the shape of the curve.</CardDescription>
          </CardHeader>
          <CardContent>
            <NormalDashboard />
          </CardContent>
        </Card>

        <PageSection title="Core Concepts">
          <Card>
              <CardHeader>
                  <CardTitle className="font-headline">Probability Density Function (PDF)</CardTitle>
                   <CardDescription>The PDF of a continuous distribution gives the relative likelihood of a random variable being near a given value. The area under the curve between two points gives the probability of the variable falling within that range.</CardDescription>
              </CardHeader>
              <CardContent>
                   <FormulaBlock>
                    <BlockMath math="f(x | \mu, \sigma^2) = \frac{1}{\sigma\sqrt{2\pi}} e^{ -\frac{1}{2}\left(\frac{x-\mu}{\sigma}\right)^2 }" />
                  </FormulaBlock>
                   <ul className="list-disc pl-6 space-y-2 text-sm mt-4">
                      <li><InlineMath math="\mu" /> is the mean, which defines the center of the distribution.</li>
                      <li><InlineMath math="\sigma" /> is the standard deviation, which defines the spread or width of the distribution.</li>
                  </ul>
              </CardContent>
          </Card>
          <Card>
              <CardHeader>
                  <CardTitle className="font-headline">Cumulative Distribution Function (CDF)</CardTitle>
                  <CardDescription>The CDF gives the probability that the random variable <InlineMath math="X" /> will take a value less than or equal to <InlineMath math="x" />.</CardDescription>
              </CardHeader>
              <CardContent>
                   <FormulaBlock>
                    <BlockMath math="F(x) = P(X \le x) = \int_{-\infty}^{x} f(t) dt" />
                  </FormulaBlock>
                  <p className="text-sm mt-4">There is no simple closed-form solution for the integral of the normal PDF, so its CDF is typically calculated using numerical methods or found by looking up Z-scores in a standard normal table.</p>
              </CardContent>
          </Card>
        </PageSection>

        <PageSection title="Key Derivations">
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline">Deriving the Moments</CardTitle>
                    <CardDescription>The mean and variance are derived by integrating over the PDF. This involves a standard substitution to simplify the integrals.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                     <div className="border-b pb-8">
                      <h4 className="font-semibold text-lg">Deriving the Expected Value (Mean)</h4>
                       <ExampleStep stepNumber={1} title="Set up the Integral for E[X]">
                            <p>The expected value is the integral of <InlineMath math="x \cdot f(x)"/> over its domain <InlineMath math="(-\infty, \infty)"/>.</p>
                            <BlockMath math="E[X] = \int_{-\infty}^{\infty} x \frac{1}{\sigma\sqrt{2\pi}} e^{ -\frac{1}{2}\left(\frac{x-\mu}{\sigma}\right)^2 } dx" />
                       </ExampleStep>
                       <ExampleStep stepNumber={2} title="Apply u-Substitution">
                           <p>Let <InlineMath math="z = (x-\mu)/\sigma"/>. Then <InlineMath math="x = \mu + z\sigma"/> and <InlineMath math="dx = \sigma dz"/>. Substitute these into the integral.</p>
                           <BlockMath math="E[X] = \int_{-\infty}^{\infty} (\mu + z\sigma) \frac{1}{\sigma\sqrt{2\pi}} e^{-z^2/2} (\sigma dz)" />
                           <p>The <InlineMath math="\sigma"/> terms cancel out, simplifying the expression:</p>
                           <BlockMath math="E[X] = \int_{-\infty}^{\infty} (\mu + z\sigma) \frac{1}{\sqrt{2\pi}} e^{-z^2/2} dz" />
                       </ExampleStep>
                       <ExampleStep stepNumber={3} title="Split the Integral">
                           <p>We can split the integral into two parts:</p>
                           <BlockMath math="E[X] = \mu \int_{-\infty}^{\infty} \frac{1}{\sqrt{2\pi}} e^{-z^2/2} dz + \sigma \int_{-\infty}^{\infty} z \frac{1}{\sqrt{2\pi}} e^{-z^2/2} dz" />
                           <ul className="list-disc pl-5 mt-2 text-sm space-y-1">
                            <li>The first integral is the total area under the standard normal PDF, which is equal to 1.</li>
                            <li>The second integral is the integral of an odd function (<InlineMath math="z \cdot \text{pdf}(z)"/>) over a symmetric interval, which is equal to 0.</li>
                           </ul>
                       </ExampleStep>
                        <ExampleStep stepNumber={4} title="Final Result">
                           <p>Combining the results gives us the final formula for the mean.</p>
                             <BlockMath math="E[X] = \mu \cdot 1 + \sigma \cdot 0" />
                           <FormulaBlock>
                                <CardTitle className="text-lg mb-2">Final Mean Formula</CardTitle>
                               <BlockMath math="E[X] = \mu" />
                           </FormulaBlock>
                       </ExampleStep>
                    </div>
                    <div>
                        <h4 className="font-semibold text-lg">Deriving the Variance</h4>
                        <p>We use the definition <InlineMath math="Var(X) = E[(X-\mu)^2]"/>.</p>
                        <ExampleStep stepNumber={1} title="Set up the Integral for Variance">
                            <BlockMath math="Var(X) = \int_{-\infty}^{\infty} (x-\mu)^2 \frac{1}{\sigma\sqrt{2\pi}} e^{ -\frac{1}{2}\left(\frac{x-\mu}{\sigma}\right)^2 } dx" />
                        </ExampleStep>
                         <ExampleStep stepNumber={2} title="Apply u-Substitution">
                           <p>Again, let <InlineMath math="z = (x-\mu)/\sigma"/>. Then <InlineMath math="x-\mu = z\sigma"/> and <InlineMath math="dx = \sigma dz"/>.</p>
                           <BlockMath math="Var(X) = \int_{-\infty}^{\infty} (z\sigma)^2 \frac{1}{\sigma\sqrt{2\pi}} e^{-z^2/2} (\sigma dz)" />
                           <p>Simplify by combining terms:</p>
                            <BlockMath math="Var(X) = \sigma^2 \int_{-\infty}^{\infty} z^2 \frac{1}{\sqrt{2\pi}} e^{-z^2/2} dz" />
                        </ExampleStep>
                         <ExampleStep stepNumber={3} title="Solve with Integration by Parts">
                           <p>The integral <InlineMath math="\int z \cdot (z e^{-z^2/2}) dz"/> can be solved using integration by parts, where <InlineMath math="u=z"/> and <InlineMath math="dv = z e^{-z^2/2} dz"/>. It can be shown that this integral equals 1.</p>
                            <BlockMath math="\int_{-\infty}^{\infty} z^2 \frac{1}{\sqrt{2\pi}} e^{-z^2/2} dz = 1" />
                        </ExampleStep>
                         <ExampleStep stepNumber={4} title="Final Result">
                           <p>Substituting this result back gives us the variance.</p>
                            <BlockMath math="Var(X) = \sigma^2 \cdot 1" />
                           <FormulaBlock>
                               <CardTitle className="text-lg mb-2">Final Variance Formula</CardTitle>
                               <BlockMath math="Var(X) = \sigma^2" />
                           </FormulaBlock>
                       </ExampleStep>
                    </div>
                </CardContent>
            </Card>
        </PageSection>
        
        <PageSection title="Applications">
            <KeyConceptAlert title="Quantitative Finance: The Black-Scholes Model" icon="brain">
              <p>The Black-Scholes model, one of the most famous equations in finance for pricing options, fundamentally assumes that stock returns are normally distributed. Specifically, it assumes that the logarithm of the stock price follows a random walk with a constant drift and volatility, which implies a log-normal distribution for prices and a normal distribution for log-returns.</p>
            </KeyConceptAlert>
        </PageSection>

      </div>
    </>
  );
}
