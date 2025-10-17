
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
import { GammaDashboard } from '@/components/quantlab/dashboards/GammaDashboard';
import { FormulaBlock } from '@/components/app/formula-block';
import { PageSection } from '@/components/app/page-section';
import { ExampleStep } from '@/components/app/example-step';


// --- Main Page Component ---
export default function GammaDistributionPage() {
  return (
    <>
      <PageHeader
        title="Gamma Distribution"
        description="Modeling waiting times and the sum of exponential variables."
        variant="aligned-left"
      />
      <div className="mx-auto max-w-5xl space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">The "Waiting Time" Distribution</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-base leading-relaxed text-foreground/90">
            <p>
                The Gamma distribution is a versatile, two-parameter continuous probability distribution that is strictly positive. It's often used to model the waiting time until a specified number of events occur.
            </p>
            <p>
              Think of it this way: if the time until the *next* bus arrives is modeled by an Exponential distribution, then the time until the *third* bus arrives is modeled by a Gamma distribution. In finance, it can be used to model the size of insurance claims, loan defaults, or operational losses, where the values are always positive and often skewed.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Interactive Gamma Distribution</CardTitle>
            <CardDescription>Adjust the shape (α) and rate (β) parameters to see how the form of the distribution changes. Notice how for large α, it starts to resemble a normal distribution.</CardDescription>
          </CardHeader>
          <CardContent>
            <GammaDashboard />
          </CardContent>
        </Card>
        
        <PageSection title="Core Concepts">
          <Card>
              <CardHeader>
                  <CardTitle className="font-headline">Probability Density Function (PDF)</CardTitle>
                   <CardDescription>The PDF of the Gamma distribution is defined by a shape parameter α and a rate parameter β.</CardDescription>
              </CardHeader>
              <CardContent>
                   <FormulaBlock>
                    <BlockMath math="f(x; \alpha, \beta) = \frac{\beta^\alpha}{\Gamma(\alpha)} x^{\alpha-1} e^{-\beta x}" />
                  </FormulaBlock>
                   <ul className="list-disc pl-6 space-y-2 text-sm mt-4">
                      <li><InlineMath math="x > 0" />.</li>
                      <li><InlineMath math="\alpha > 0" /> (alpha) is the <strong>shape</strong> parameter. If `α` is an integer, it represents the number of events to wait for.</li>
                      <li><InlineMath math="\beta > 0" /> (beta) is the <strong>rate</strong> parameter (the inverse of the scale).</li>
                       <li><InlineMath math="\Gamma(\alpha)" /> is the Gamma function, a generalization of the factorial function.</li>
                  </ul>
              </CardContent>
          </Card>
          <Card>
              <CardHeader>
                  <CardTitle className="font-headline">Cumulative Distribution Function (CDF)</CardTitle>
                  <CardDescription>The CDF gives the probability that the event occurs on or before time <InlineMath math="x" />.</CardDescription>
              </CardHeader>
              <CardContent>
                   <FormulaBlock>
                    <BlockMath math="F(x; \alpha, \beta) = \frac{\gamma(\alpha, \beta x)}{\Gamma(\alpha)}" />
                  </FormulaBlock>
                  <p className="text-sm mt-4">The CDF is expressed using the lower incomplete gamma function, <InlineMath math="\gamma(s, x)" />, and is usually computed numerically.</p>
              </CardContent>
          </Card>
        </PageSection>

        <PageSection title="Key Derivations">
           <Card>
              <CardHeader>
                  <CardTitle className="font-headline">Deriving the Moments (Mean and Variance)</CardTitle>
                  <CardDescription>We can derive the mean and variance using the definition of expected value and properties of the Gamma function.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                  <div className="border-b pb-8">
                      <h4 className="font-semibold text-lg">Deriving the Expected Value (Mean)</h4>
                       <ExampleStep stepNumber={1} title="Set up the Integral for E[X]">
                          <p>The expected value is the integral of <InlineMath math="x" /> times the PDF over its entire range.</p>
                          <BlockMath math="E[X] = \int_{0}^{\infty} x \cdot \frac{\beta^\alpha}{\Gamma(\alpha)} x^{\alpha-1} e^{-\beta x} dx" />
                       </ExampleStep>
                       <ExampleStep stepNumber={2} title="Simplify and Rearrange">
                          <p>Combine terms and move constants outside the integral.</p>
                          <BlockMath math="E[X] = \frac{\beta^\alpha}{\Gamma(\alpha)} \int_{0}^{\infty} x^{\alpha} e^{-\beta x} dx" />
                       </ExampleStep>
                       <ExampleStep stepNumber={3} title="Use u-Substitution">
                          <p>Let <InlineMath math="u = \beta x" />, which implies <InlineMath math="x = u/\beta" /> and <InlineMath math="dx = du/\beta" />.</p>
                          <BlockMath math="E[X] = \frac{\beta^\alpha}{\Gamma(\alpha)} \int_{0}^{\infty} (\frac{u}{\beta})^{\alpha} e^{-u} \frac{du}{\beta}" />
                          <BlockMath math="E[X] = \frac{\beta^\alpha}{\Gamma(\alpha)} \cdot \frac{1}{\beta^{\alpha+1}} \int_{0}^{\infty} u^{\alpha} e^{-u} du" />
                       </ExampleStep>
                       <ExampleStep stepNumber={4} title="Apply the Gamma Function Definition">
                           <p>The integral <InlineMath math="\int_{0}^{\infty} u^{\alpha} e^{-u} du" /> is the definition of <InlineMath math="\Gamma(\alpha+1)" />.</p>
                           <BlockMath math="E[X] = \frac{1}{\beta \cdot \Gamma(\alpha)} \cdot \Gamma(\alpha+1)" />
                           <p>Using the property <InlineMath math="\Gamma(z+1) = z\Gamma(z)" />, we get <InlineMath math="\Gamma(\alpha+1) = \alpha\Gamma(\alpha)" />.</p>
                           <BlockMath math="E[X] = \frac{1}{\beta \cdot \Gamma(\alpha)} \cdot \alpha\Gamma(\alpha) = \frac{\alpha}{\beta}" />
                            <FormulaBlock>
                              <CardTitle className="text-lg mb-2">Final Mean Formula</CardTitle>
                              <BlockMath math="E[X] = \frac{\alpha}{\beta}" />
                            </FormulaBlock>
                       </ExampleStep>
                  </div>
                  <div>
                        <h4 className="font-semibold text-lg">Deriving the Variance</h4>
                        <p>We use <InlineMath math="Var(X) = E[X^2] - (E[X])^2" />. We first need to find <InlineMath math="E[X^2]" />.</p>
                        <ExampleStep stepNumber={1} title="Set up the Integral for E[X²]">
                          <BlockMath math="E[X^2] = \int_{0}^{\infty} x^2 \cdot \frac{\beta^\alpha}{\Gamma(\alpha)} x^{\alpha-1} e^{-\beta x} dx" />
                          <BlockMath math="E[X^2] = \frac{\beta^\alpha}{\Gamma(\alpha)} \int_{0}^{\infty} x^{\alpha+1} e^{-\beta x} dx" />
                       </ExampleStep>
                       <ExampleStep stepNumber={2} title="Apply u-Substitution Again">
                          <p>Using the same substitution <InlineMath math="u = \beta x" />.</p>
                          <BlockMath math="E[X^2] = \frac{\beta^\alpha}{\Gamma(\alpha)} \cdot \frac{1}{\beta^{\alpha+2}} \int_{0}^{\infty} u^{\alpha+1} e^{-u} du" />
                       </ExampleStep>
                       <ExampleStep stepNumber={3} title="Apply Gamma Function Properties">
                           <p>The integral is <InlineMath math="\Gamma(\alpha+2)" />, which equals <InlineMath math="(\alpha+1)\alpha\Gamma(\alpha)" />.</p>
                           <BlockMath math="E[X^2] = \frac{1}{\beta^2 \Gamma(\alpha)} \cdot \Gamma(\alpha+2) = \frac{(\alpha+1)\alpha\Gamma(\alpha)}{\beta^2 \Gamma(\alpha)} = \frac{\alpha(\alpha+1)}{\beta^2}" />
                       </ExampleStep>
                       <ExampleStep stepNumber={4} title="Calculate the Variance">
                            <BlockMath math="Var(X) = E[X^2] - (E[X])^2 = \frac{\alpha(\alpha+1)}{\beta^2} - \left(\frac{\alpha}{\beta}\right)^2" />
                            <BlockMath math="= \frac{\alpha^2 + \alpha}{\beta^2} - \frac{\alpha^2}{\beta^2}" />
                            <FormulaBlock>
                                <CardTitle className="text-lg mb-2">Final Variance Formula</CardTitle>
                                <BlockMath math="Var(X) = \frac{\alpha}{\beta^2}" />
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
