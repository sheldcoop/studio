
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
import { DiscreteUniformDashboard } from '@/components/quantlab/dashboards/DiscreteUniformDashboard';

// --- Main Page Component ---
export default function DiscreteUniformDistributionPage() {
  return (
    <>
      <PageHeader
        title="Discrete Uniform Distribution"
        description="The simplest scenario in probability: every outcome is equally likely."
        variant="aligned-left"
      />
      <div className="mx-auto max-w-5xl space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">The "Fair Die Roll" Distribution</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-base leading-relaxed text-foreground/90">
            <p>
              The Discrete Uniform distribution describes a situation where there are a finite number of outcomes, and each outcome is equally likely to occur.
            </p>
            <p>
              The most classic example is a single roll of a fair six-sided die. The possible outcomes are [1, 2, 3, 4, 5, 6], and the probability of rolling any one of these numbers is exactly 1/6. There is no bias towards any particular outcome.
            </p>
          </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle className="font-headline">The Formula</CardTitle>
                 <CardDescription>The probability mass function (PMF) is:</CardDescription>
            </CardHeader>
            <CardContent>
                 <div className="rounded-lg border bg-muted/50 p-4 text-center">
                  <BlockMath math="P(X=k) = \frac{1}{n}" />
                </div>
                 <ul className="list-disc pl-6 space-y-2 text-sm mt-4">
                    <li><InlineMath math="k" /> is a specific outcome.</li>
                    <li><InlineMath math="n" /> is the total number of possible outcomes.</li>
                </ul>
            </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Interactive Uniform Distribution</CardTitle>
            <CardDescription>Adjust the number of possible outcomes (<InlineMath math="n" />) to see how the probability changes.</CardDescription>
          </CardHeader>
          <CardContent>
            <DiscreteUniformDashboard />
          </CardContent>
        </Card>
      </div>
    </>
  );
}
