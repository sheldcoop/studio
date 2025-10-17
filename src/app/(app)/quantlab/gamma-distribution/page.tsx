
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
           <Card>
              <CardHeader>
                  <CardTitle className="font-headline">Expected Value & Variance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                  <div>
                      <h4 className="font-semibold">Expected Value (Mean)</h4>
                      <FormulaBlock><BlockMath math="E[X] = \frac{\alpha}{\beta}" /></FormulaBlock>
                      <p className="text-sm text-muted-foreground mt-2">The expected waiting time is the number of events to wait for divided by the rate of events.</p>
                  </div>
                  <div>
                      <h4 className="font-semibold">Variance</h4>
                      <FormulaBlock><BlockMath math="Var(X) = \frac{\alpha}{\beta^2}" /></FormulaBlock>
                  </div>
              </CardContent>
          </Card>
        </PageSection>
      </div>
    </>
  );
}
