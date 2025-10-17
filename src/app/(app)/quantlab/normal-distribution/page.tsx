
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
           <Card>
              <CardHeader>
                  <CardTitle className="font-headline">Expected Value & Variance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                  <div>
                      <h4 className="font-semibold">Expected Value (Mean)</h4>
                      <FormulaBlock><BlockMath math="E[X] = \mu" /></FormulaBlock>
                      <p className="text-sm text-muted-foreground mt-2">The mean is one of the two parameters that define the distribution.</p>
                  </div>
                  <div>
                      <h4 className="font-semibold">Variance</h4>
                      <FormulaBlock><BlockMath math="Var(X) = \sigma^2" /></FormulaBlock>
                      <p className="text-sm text-muted-foreground mt-2">The variance is the square of the standard deviation parameter.</p>
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
