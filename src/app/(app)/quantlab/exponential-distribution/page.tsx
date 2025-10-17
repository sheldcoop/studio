
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
import { ExponentialDashboard } from '@/components/quantlab/dashboards/ExponentialDashboard';
import { FormulaBlock } from '@/components/app/formula-block';
import { PageSection } from '@/components/app/page-section';
import { KeyConceptAlert } from '@/components/app/key-concept-alert';

// --- Main Page Component ---
export default function ExponentialDistributionPage() {
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
            <ExponentialDashboard />
          </CardContent>
        </Card>
        
        <PageSection title="Core Concepts">
          <Card>
              <CardHeader>
                  <CardTitle className="font-headline">Probability Density Function (PDF)</CardTitle>
                  <CardDescription>The PDF is defined by a single rate parameter, λ.</CardDescription>
              </CardHeader>
              <CardContent>
                   <FormulaBlock>
                    <BlockMath math="f(x; \lambda) = \lambda e^{-\lambda x}" />
                  </FormulaBlock>
                   <ul className="list-disc pl-6 space-y-2 text-sm mt-4">
                      <li><InlineMath math="x \ge 0" /> is the time variable.</li>
                      <li><InlineMath math="\lambda > 0" /> (lambda) is the <strong>rate</strong> parameter, the average number of events per unit of time.</li>
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
                    <BlockMath math="F(x; \lambda) = 1 - e^{-\lambda x}" />
                  </FormulaBlock>
                  <p className="text-sm mt-4">This simple, closed-form CDF makes the Exponential distribution particularly easy to work with.</p>
              </CardContent>
          </Card>
           <Card>
              <CardHeader>
                  <CardTitle className="font-headline">Expected Value & Variance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                  <div>
                      <h4 className="font-semibold">Expected Value (Mean)</h4>
                      <FormulaBlock><BlockMath math="E[X] = \frac{1}{\lambda}" /></FormulaBlock>
                      <p className="text-sm text-muted-foreground mt-2">The average waiting time is the inverse of the rate. If trades arrive at a rate of λ=2 per minute, the average time between trades is 1/2 = 0.5 minutes.</p>
                  </div>
                  <div>
                      <h4 className="font-semibold">Variance</h4>
                      <FormulaBlock><BlockMath math="Var(X) = \frac{1}{\lambda^2}" /></FormulaBlock>
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
