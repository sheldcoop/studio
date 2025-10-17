
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
import { BetaDashboard } from '@/components/quantlab/dashboards/BetaDashboard';

// --- Main Page Component ---
export default function BetaDistributionPage() {

  return (
    <>
      <PageHeader
        title="Beta Distribution"
        description="Modeling probabilities, percentages, and proportions."
        variant="aligned-left"
      />
      <div className="mx-auto max-w-5xl space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">The "Probability of Probabilities" Distribution</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-base leading-relaxed text-foreground/90">
            <p>
                The Beta distribution is a continuous probability distribution defined on the interval [0, 1]. This makes it perfectly suited for modeling random variables that represent probabilities or proportions.
            </p>
            <p>
              In quantitative finance, it's a powerful tool in Bayesian inference and risk modeling. For example, a credit analyst might use it to model the recovery rate on a defaulted loan (which must be between 0% and 100%). A trading strategist could use it to represent the probability of a particular signal being profitable.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Interactive Beta Distribution</CardTitle>
            <CardDescription>Adjust the shape parameters (α and β) to see how they influence the distribution. Note the wide variety of shapes the Beta distribution can take.</CardDescription>
          </CardHeader>
          <CardContent>
            <BetaDashboard />
          </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle className="font-headline">The Formula</CardTitle>
                 <CardDescription>The probability density function (PDF) is given by:</CardDescription>
            </CardHeader>
            <CardContent>
                 <div className="rounded-lg border bg-muted/50 p-4 text-center">
                  <BlockMath math="f(x; \alpha, \beta) = \frac{x^{\alpha-1} (1-x)^{\beta-1}}{B(\alpha, \beta)}" />
                </div>
                 <ul className="list-disc pl-6 space-y-2 text-sm mt-4">
                    <li><InlineMath math="x" /> is the variable (between 0 and 1).</li>
                    <li><InlineMath math="\alpha" /> and <InlineMath math="\beta" /> are positive shape parameters.</li>
                    <li><InlineMath math="B(\alpha, \beta)" /> is the Beta function, which normalizes the total probability to 1.</li>
                </ul>
            </CardContent>
        </Card>
      </div>
    </>
  );
}
