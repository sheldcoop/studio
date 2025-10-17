
'use client';

import { useState } from 'react';
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
import { ExponentialDashboard } from '@/components/quantlab/dashboards/ExponentialDashboard';
import { FormulaBlock } from '@/components/app/formula-block';
import { PageSection } from '@/components/app/page-section';
import { KeyConceptAlert } from '@/components/app/key-concept-alert';
import { InteractiveFormula } from '@/components/app/interactive-formula';
import { ExampleStep } from '@/components/app/example-step';

// --- Main Page Component ---
export default function ExponentialDistributionPage() {
  const [highlightValue, setHighlightValue] = useState<string | number | null>(null);

  return (
    <>
      <PageHeader
        title="Exponential Distribution"
        description="Modeling the time until an event occurs in a Poisson process."
        variant="aligned-left"
      />
      <div className="mx-auto max-w-5xl space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">The "Time Between Events" Distribution</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-base leading-relaxed text-foreground/90">
            <p>
                The Exponential distribution is a continuous probability distribution that models the time between events in a Poisson point process, i.e., a process in which events occur continuously and independently at a constant average rate.
            </p>
            <p>
              It is the continuous analogue of the Geometric distribution. While the Geometric distribution models the number of trials until the first success, the Exponential distribution models the amount of time until the next event. In finance, it's used to model the time between trades, the time until a bond defaults, or the duration until a stock price hits a certain level.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Interactive Exponential Distribution</CardTitle>
            <CardDescription>Adjust the rate parameter (λ) to see how the shape of the distribution changes. A higher rate means events happen more frequently, so the probability of a short waiting time is high.</CardDescription>
          </CardHeader>
          <CardContent>
            <ExponentialDashboard highlightValue={highlightValue} onBarHover={setHighlightValue} />
          </CardContent>
        </Card>
        
        <PageSection title="Core Concepts">
            <InteractiveFormula
              title="Probability Density Function (PDF)"
              description="The PDF is defined by a single rate parameter, λ."
              formula="f(x; \lambda) = \lambda e^{-\lambda x}"
              explanation={
                <ul className="list-disc pl-6 space-y-2 text-sm mt-4">
                    <li><InlineMath math="x \ge 0" /> is the time variable.</li>
                    <li><InlineMath math="\lambda > 0" /> (lambda) is the <strong>rate</strong> parameter, the average number of events per unit of time.</li>
                </ul>
              }
            >
              {(highlight, onHover) => (
                <ExponentialDashboard isSubcomponent={true} highlightValue={highlight} onBarHover={onHover} />
              )}
            </InteractiveFormula>
            
            <InteractiveFormula
              title="Cumulative Distribution Function (CDF)"
              description="The CDF gives the probability that the event occurs on or before time x. It is derived by integrating the PDF."
              formula="F(x) = 1 - e^{-\lambda x}"
              explanation={
                <>
                  <p className="text-sm mt-4">The CDF, <InlineMath math="F(x)" />, is the integral of the PDF, <InlineMath math="f(t)" />, from 0 up to <InlineMath math="x" />. This gives us the total probability accumulated up to time <InlineMath math="x" />.</p>
                </>
              }
            >
              {(highlight, onHover) => (
                <ExponentialDashboard isSubcomponent={true} showCdf={true} highlightValue={highlight} onBarHover={onHover} />
              )}
            </InteractiveFormula>

           <Card>
              <CardHeader>
                  <CardTitle className="font-headline">Key Derivations</CardTitle>
                  <CardDescription>Understanding how the CDF, Mean, and Variance are derived from the PDF.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                  <div>
                      <h4 className="font-semibold text-lg">Deriving the CDF</h4>
                      <p className="text-sm text-muted-foreground mb-4">We find the CDF by integrating the PDF from 0 to x.</p>
                      <ExampleStep stepNumber={1} title="Set up the Integral">
                          <p>The CDF, <InlineMath math="F(x)" />, is the integral of the PDF, <InlineMath math="f(t)" />, from 0 up to <InlineMath math="x" />.</p>
                          <BlockMath math="F(x) = \int_{0}^{x} \lambda e^{-\lambda t} dt" />
                      </ExampleStep>
                      <ExampleStep stepNumber={2} title="Calculate the Integral">
                          <p>We find the antiderivative of <InlineMath math="\lambda e^{-\lambda t}" />.</p>
                          <BlockMath math="\int \lambda e^{-\lambda t} dt = -e^{-\lambda t}" />
                      </ExampleStep>
                      <ExampleStep stepNumber={3} title="Apply the Limits of Integration">
                          <p>Now we evaluate the antiderivative at the limits <InlineMath math="x" /> and <InlineMath math="0" />.</p>
                          <BlockMath math="F(x) = \left[-e^{-\lambda t}\right]_{0}^{x} = (-e^{-\lambda x}) - (-e^{-\lambda \cdot 0})" />
                          <BlockMath math="= -e^{-\lambda x} - (-1)" />
                      </ExampleStep>
                  </div>
                  <div className="border-t pt-8">
                      <h4 className="font-semibold text-lg">Deriving the Expected Value (Mean)</h4>
                      <p className="text-sm text-muted-foreground mb-4">We use integration by parts: <InlineMath math="\int u \, dv = uv - \int v \, du" />.</p>
                       <ExampleStep stepNumber={1} title="Set up the Integral">
                          <p>The expected value <InlineMath math="E[X]" /> is the integral of <InlineMath math="x \cdot f(x)" /> over its domain.</p>
                          <BlockMath math="E[X] = \int_{0}^{\infty} x \cdot \lambda e^{-\lambda x} dx" />
                      </ExampleStep>
                      <ExampleStep stepNumber={2} title="Apply Integration by Parts">
                            <p>Let <InlineMath math="u=x" /> and <InlineMath math="dv = \lambda e^{-\lambda x} dx" />. Then <InlineMath math="du=dx" /> and <InlineMath math="v = -e^{-\lambda x}" />.</p>
                            <BlockMath math="E[X] = \left[ -x e^{-\lambda x} \right]_{0}^{\infty} - \int_{0}^{\infty} (-e^{-\lambda x}) dx" />
                      </ExampleStep>
                      <ExampleStep stepNumber={3} title="Evaluate the Terms">
                            <p>The first term <InlineMath math="\left[ -x e^{-\lambda x} \right]_{0}^{\infty}" /> evaluates to 0. (The limit as <InlineMath math="x \to \infty" /> is 0 by L'Hôpital's rule, and the value at 0 is 0).</p>
                            <p>The second term becomes a simple integral:</p>
                             <BlockMath math="E[X] = \int_{0}^{\infty} e^{-\lambda x} dx = \left[ -\frac{1}{\lambda} e^{-\lambda x} \right]_{0}^{\infty}" />
                             <BlockMath math="= (0) - (-\frac{1}{\lambda} e^0) = \frac{1}{\lambda}" />
                      </ExampleStep>
                      <p className="text-sm text-muted-foreground mt-4">This makes intuitive sense: if events happen at a rate of <InlineMath math="\lambda=2"/> per hour, you would expect to wait, on average, <InlineMath math="1/2"/> an hour between them.</p>
                  </div>
                  <div className="border-t pt-8">
                      <h4 className="font-semibold text-lg">Deriving the Variance</h4>
                       <p className="text-sm text-muted-foreground mb-4">We use the formula <InlineMath math="Var(X) = E[X^2] - (E[X])^2" />. We already have <InlineMath math="E[X]" />, so we need to find <InlineMath math="E[X^2]" />.</p>
                      <ExampleStep stepNumber={1} title="Find E[X²]">
                          <p>This requires applying integration by parts twice.</p>
                          <BlockMath math="E[X^2] = \int_{0}^{\infty} x^2 \lambda e^{-\lambda x} dx" />
                          <p>Let <InlineMath math="u = x^2" /> and <InlineMath math="dv = \lambda e^{-\lambda x} dx" />. Then <InlineMath math="du = 2x dx" /> and <InlineMath math="v = -e^{-\lambda x}" />.</p>
                          <BlockMath math="E[X^2] = \left[ -x^2 e^{-\lambda x} \right]_{0}^{\infty} + \int_{0}^{\infty} 2x e^{-\lambda x} dx" />
                          <p>The first term is 0. The remaining integral is <InlineMath math="\frac{2}{\lambda} \int_{0}^{\infty} x \lambda e^{-\lambda x} dx" />. We recognize the integral part as <InlineMath math="E[X]" />, which we know is <InlineMath math="1/\lambda" />.</p>
                           <BlockMath math="E[X^2] = \frac{2}{\lambda} \cdot E[X] = \frac{2}{\lambda} \cdot \frac{1}{\lambda} = \frac{2}{\lambda^2}" />
                      </ExampleStep>
                      <ExampleStep stepNumber={2} title="Calculate Variance">
                          <BlockMath math="Var(X) = E[X^2] - (E[X])^2 = \frac{2}{\lambda^2} - \left(\frac{1}{\lambda}\right)^2 = \frac{2}{\lambda^2} - \frac{1}{\lambda^2}" />
                           <FormulaBlock>
                              <CardTitle className="text-lg mb-2">Final Variance Formula</CardTitle>
                               <BlockMath math="Var(X) = \frac{1}{\lambda^2}" />
                          </FormulaBlock>
                      </ExampleStep>
                  </div>
              </CardContent>
          </Card>
        </PageSection>

        <PageSection title="Applications">
          <KeyConceptAlert title="Credit Risk: Time-to-Default Modeling" icon="brain">
            <p>Credit analysts can use the Exponential distribution to model the time until a bond or loan defaults. If historical data suggests a portfolio of similar bonds has an annual default rate of λ=0.03 (3% per year), an analyst can use the CDF to calculate the probability of a default occurring within the next 5 years as <InlineMath math="P(X \le 5) = 1 - e^{-0.03 \times 5} \approx 13.9\%" />.</p>
          </KeyConceptAlert>
        </PageSection>
      </div>
    </>
  );
}
