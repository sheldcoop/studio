
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
import { FDistributionDashboard } from '@/components/quantlab/dashboards/FDistributionDashboard';
import { PageSection } from '@/components/app/page-section';
import { FormulaBlock } from '@/components/app/formula-block';
import { ExampleStep } from '@/components/app/example-step';

// --- Main Page Component ---
export default function FDistributionPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <PageHeader
        title="F-Distribution"
        description="Comparing variances between two or more samples."
        variant="aligned-left"
      />
      
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">The "Ratio of Variances" Distribution</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-base leading-relaxed text-foreground/90">
            <p>
              The F-distribution is a continuous probability distribution that arises frequently as the null distribution of a test statistic, most notably in the Analysis of Variance (ANOVA) and the F-test to compare two variances.
            </p>
            <p>
              It describes the ratio of two independent chi-squared variables, each divided by their respective degrees of freedom. In practical terms, if you take two samples from normal populations, the ratio of their sample variances follows an F-distribution. This is why it's the cornerstone for checking if the volatility (variance) of two different stocks or trading strategies is significantly different.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Interactive F-Distribution</CardTitle>
            <CardDescription>Adjust the degrees of freedom to see how they influence the shape of the distribution. Notice how it becomes more bell-shaped as the degrees of freedom increase.</CardDescription>
          </CardHeader>
          <CardContent>
            <FDistributionDashboard />
          </CardContent>
        </Card>

        <PageSection title="Core Concepts">
          <Card>
              <CardHeader>
                  <CardTitle className="font-headline">Probability Density Function (PDF)</CardTitle>
                  <CardDescription>The PDF is defined by its two parameters: the degrees of freedom of the numerator (<InlineMath math="d_1" />) and the denominator (<InlineMath math="d_2" />).</CardDescription>
              </CardHeader>
              <CardContent>
                   <FormulaBlock>
                    <BlockMath math="f(x; d_1, d_2) = \frac{\sqrt{\frac{(d_1 x)^{d_1} d_2^{d_2}}{(d_1 x + d_2)^{d_1 + d_2}}}}{x B(\frac{d_1}{2}, \frac{d_2}{2})}" />
                  </FormulaBlock>
                   <ul className="list-disc pl-6 space-y-2 text-sm mt-4">
                      <li><InlineMath math="d_1 > 0" /> is the degrees of freedom for the numerator variance.</li>
                      <li><InlineMath math="d_2 > 0" /> is the degrees of freedom for the denominator variance.</li>
                      <li><InlineMath math="B" /> is the Beta function.</li>
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
                      <FormulaBlock><BlockMath math="E[X] = \frac{d_2}{d_2 - 2} \quad \text{for } d_2 > 2" /></FormulaBlock>
                      <p className="text-sm text-muted-foreground mt-2">The mean is undefined for <InlineMath math="d_2 \le 2" />.</p>
                  </div>
                  <div>
                      <h4 className="font-semibold">Variance</h4>
                      <FormulaBlock><BlockMath math="Var(X) = \frac{2d_2^2(d_1+d_2-2)}{d_1(d_2-2)^2(d_2-4)} \quad \text{for } d_2 > 4" /></FormulaBlock>
                      <p className="text-sm text-muted-foreground mt-2">The variance is undefined for <InlineMath math="d_2 \le 4" />.</p>
                  </div>
              </CardContent>
          </Card>
        </PageSection>

        <PageSection title="Key Derivations">
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline">Deriving the Expected Value (Mean)</CardTitle>
                    <CardDescription>
                        The mean of an F-distribution is derived from its definition as a ratio of two independent Chi-Squared random variables.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                    <ExampleStep stepNumber={1} title="Define the F-distribution">
                        <p>An F-distributed random variable <InlineMath math="F" /> is the ratio of two independent Chi-Squared variables <InlineMath math="U_1 \sim \chi^2(d_1)" /> and <InlineMath math="U_2 \sim \chi^2(d_2)" />, each divided by its degrees of freedom:</p>
                        <BlockMath math="F = \frac{U_1 / d_1}{U_2 / d_2}" />
                    </ExampleStep>
                    <ExampleStep stepNumber={2} title="Use the Property of Expectation">
                        <p>Since <InlineMath math="U_1" /> and <InlineMath math="U_2" /> are independent, the expectation of their product (or ratio) is the product of their expectations.</p>
                        <BlockMath math="E[F] = E\left[\frac{U_1}{d_1}\right] E\left[\frac{d_2}{U_2}\right] = \frac{d_2}{d_1} E[U_1] E\left[\frac{1}{U_2}\right]" />
                    </ExampleStep>
                    <ExampleStep stepNumber={3} title="Substitute Known Expected Values">
                        <p>We know that the mean of a Chi-Squared variable <InlineMath math="\chi^2(k)" /> is <InlineMath math="k" />. Therefore, <InlineMath math="E[U_1] = d_1" />.</p>
                        <BlockMath math="E[F] = \frac{d_2}{d_1} \cdot d_1 \cdot E\left[\frac{1}{U_2}\right] = d_2 E\left[\frac{1}{U_2}\right]" />
                    </ExampleStep>
                     <ExampleStep stepNumber={4} title="Calculate the Expected Value of 1/U₂">
                        <p>This is the most complex step. It can be shown by integrating <InlineMath math="\int_0^\infty \frac{1}{x} f(x; d_2) dx" /> (where <InlineMath math="f" /> is the Chi-Squared PDF) that the expected value of the reciprocal of a Chi-Squared variable is:</p>
                         <BlockMath math="E\left[\frac{1}{U_2}\right] = \frac{1}{d_2 - 2}, \quad \text{for } d_2 > 2" />
                         <p className="text-sm text-muted-foreground mt-2">This integral only converges if the degrees of freedom are greater than 2, which is why the mean is undefined for <InlineMath math="d_2 \le 2" />.</p>
                    </ExampleStep>
                    <ExampleStep stepNumber={5} title="Combine Results">
                        <p>Substitute the result from Step 4 back into the equation from Step 3.</p>
                        <BlockMath math="E[F] = d_2 \cdot \frac{1}{d_2 - 2}" />
                         <FormulaBlock>
                              <CardTitle className="text-lg mb-2">Final Mean Formula</CardTitle>
                              <BlockMath math="E[F] = \frac{d_2}{d_2 - 2}" />
                         </FormulaBlock>
                    </ExampleStep>
                </CardContent>
            </Card>
        </PageSection>

      </div>
    
  );
}
