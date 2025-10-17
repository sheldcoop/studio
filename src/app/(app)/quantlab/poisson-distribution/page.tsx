
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
import { PoissonDashboard } from '@/components/quantlab/dashboards/PoissonDashboard';
import { PageSection } from '@/components/app/page-section';
import { KeyConceptAlert } from '@/components/app/key-concept-alert';
import { InteractiveFormula } from '@/components/app/interactive-formula';

export default function PoissonDistributionPage() {
  const [highlightValue, setHighlightValue] = useState<string | number | null>(null);

  return (
    <>
      <PageHeader
        title="Poisson Distribution"
        description="Modeling the number of events occurring in a fixed interval of time or space."
        variant="aligned-left"
      />
      <div className="mx-auto max-w-5xl space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">The "Rare Events" Distribution</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-base leading-relaxed text-foreground/90">
            <p>
                The Poisson Distribution is used to model the number of times an event occurs within a specified interval. The key assumptions are that events are independent, the average rate of events is constant, and two events cannot occur at the exact same instant.
            </p>
            <p>
              In finance, it's particularly useful for modeling rare events. For example, a credit analyst might use it to model the number of defaults in a large portfolio of loans over a month, or a trader might use it to model the number of times a stock's price jumps by more than 5% in a single day.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Interactive Poisson Distribution</CardTitle>
            <CardDescription>Adjust the rate parameter (λ) to see how the shape of the distribution changes. Notice how for large λ, the distribution starts to look like a normal distribution.</CardDescription>
          </CardHeader>
          <CardContent>
            <PoissonDashboard highlightValue={highlightValue} onBarHover={setHighlightValue} />
          </CardContent>
        </Card>

        <PageSection title="Core Concepts">
          <InteractiveFormula
            title="Probability Mass Function (PMF)"
            description="The PMF answers: 'What is the probability of observing exactly k events in an interval?'"
            formula="P(X=k) = \frac{\lambda^k e^{-\lambda}}{k!}"
            explanation={
              <ul className="list-disc pl-6 space-y-2 text-sm mt-4">
                  <li><InlineMath math="k"/> is the number of occurrences of an event (0, 1, 2, ...).</li>
                  <li><InlineMath math="\lambda"/> (lambda) is the average number of events per interval.</li>
                  <li><InlineMath math="e"/> is Euler's number (approximately 2.71828).</li>
                  <li>The <InlineMath math="k!"/> (k factorial) term is crucial because it accounts for the fact that the events can happen in any order within the interval.</li>
              </ul>
            }
          >
            {(highlight, onHover) => (
              <PoissonDashboard isSubcomponent={true} highlightValue={highlight} onBarHover={onHover} />
            )}
          </InteractiveFormula>
          
          <InteractiveFormula
            title="Cumulative Distribution Function (CDF)"
            description="The CDF answers: 'What is the probability of observing k events or fewer?'"
            formula="F(k) = P(X \le k) = \sum_{i=0}^{k} \frac{\lambda^i e^{-\lambda}}{i!}"
            explanation={
               <p className="text-sm mt-4">The CDF accumulates the probabilities from the PMF. For example, the probability of observing 2 or fewer events, <InlineMath math="P(X \le 2)"/>, is the sum of the probabilities of observing 0, 1, and 2 events: <InlineMath math="P(X=0) + P(X=1) + P(X=2)"/>.</p>
            }
          >
            {(highlight, onHover) => (
              <PoissonDashboard isSubcomponent={true} showCdf={true} highlightValue={highlight} onBarHover={onHover} />
            )}
          </InteractiveFormula>

          <Card>
              <CardHeader>
                  <CardTitle className="font-headline">Expected Value & Variance</CardTitle>
              </CardHeader>
              <CardContent>
                  <p>A unique and simple property of the Poisson distribution is that its mean and variance are equal.</p>
                  <BlockMath math="E[X] = Var(X) = \lambda" />
                  <p className="text-sm text-muted-foreground mt-2">This means if you expect an average of 5 defaults per month (<InlineMath math="\lambda=5"/>), the variance of that number is also 5. This relationship is a key identifier of Poisson processes in real-world data.</p>
              </CardContent>
          </Card>
        </PageSection>

        <PageSection title="Applications">
            <KeyConceptAlert title="Quantitative Finance: Operational Risk" icon="brain">
              <p>Banks use the Poisson distribution to model operational risk, such as the number of fraudulent transactions or system failures per week. If a bank's system typically has <InlineMath math="\lambda=2"/> failures per week, and one week they experience 8 failures, they can use the PMF to calculate how unlikely that event was. This triggers an investigation to see if something has fundamentally changed in their system's stability.</p>
            </KeyConceptAlert>
             <KeyConceptAlert title="Machine Learning: Feature Engineering" icon="brain">
              <p>In analyzing customer behavior data (e.g., website visits), the number of times a user performs a certain action in a day (like 'add to cart') might follow a Poisson distribution. Understanding this can help in feature engineering. Instead of just using the raw count, a data scientist might create a feature like "Is this user's activity a rare event?" by calculating the Poisson probability <InlineMath math="P(X \ge k)"/>.</p>
            </KeyConceptAlert>
        </PageSection>
      </div>
    </>
  );
}
