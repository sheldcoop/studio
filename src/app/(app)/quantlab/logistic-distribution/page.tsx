
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
import { LogisticDashboard } from '@/components/quantlab/dashboards/LogisticDashboard';
import { FormulaBlock } from '@/components/app/formula-block';
import { PageSection } from '@/components/app/page-section';

// --- Main Page Component ---
export default function LogisticDistributionPage() {
  return (
    <>
      <PageHeader
        title="Logistic Distribution"
        description="A key distribution in machine learning and growth modeling."
        variant="aligned-left"
      />
      <div className="mx-auto max-w-5xl space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">The "Growth Curve" Distribution</CardTitle>
          </Header>
          <CardContent className="space-y-4 text-base leading-relaxed text-foreground/90">
            <p>
                The Logistic distribution is a continuous probability distribution whose cumulative distribution function is the logistic function, which appears in logistic regression and feedforward neural networks. It resembles the normal distribution but has heavier tails, meaning it gives more probability to extreme events.
            </p>
            <p>
              In finance, it's used in credit risk modeling to estimate the probability of default. Its S-shaped cumulative distribution function is perfect for modeling phenomena that have a "saturation" point, like the adoption rate of a new technology or the market share of a product.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Interactive Logistic Distribution</CardTitle>
            <CardDescription>Adjust the location (μ) and scale (s) parameters to see how the shape of the distribution changes.</CardDescription>
          </CardHeader>
          <CardContent>
            <LogisticDashboard />
          </CardContent>
        </Card>

        <PageSection title="Core Concepts">
          <Card>
              <CardHeader>
                  <CardTitle className="font-headline">Probability Density Function (PDF)</CardTitle>
              </CardHeader>
              <CardContent>
                   <FormulaBlock>
                    <BlockMath math="f(x; \mu, s) = \frac{e^{-(x-\mu)/s}}{s(1+e^{-(x-\mu)/s})^2}" />
                  </FormulaBlock>
                   <ul className="list-disc pl-6 space-y-2 text-sm mt-4">
                      <li><InlineMath math="\mu" /> (mu) is the <strong>location</strong> parameter, which is also the mean, median, and mode.</li>
                      <li><InlineMath math="s > 0" /> is the <strong>scale</strong> parameter, which is proportional to the standard deviation.</li>
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
                      <FormulaBlock><BlockMath math="E[X] = \mu" /></FormulaBlock>
                  </div>
                  <div>
                      <h4 className="font-semibold">Variance</h4>
                      <FormulaBlock><BlockMath math="Var(X) = \frac{s^2 \pi^2}{3}" /></FormulaBlock>
                  </div>
              </CardContent>
          </Card>
        </PageSection>

      </div>
    </>
  );
}
