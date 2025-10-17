
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
        
        <Card>
            <CardHeader>
                <CardTitle className="font-headline">The Formula</CardTitle>
                 <CardDescription>The probability density function (PDF) is given by:</CardDescription>
            </CardHeader>
            <CardContent>
                 <div className="rounded-lg border bg-muted/50 p-4 text-center">
                  <BlockMath math="f(x; \alpha, \beta) = \frac{\beta^\alpha}{\Gamma(\alpha)} x^{\alpha-1} e^{-\beta x}" />
                </div>
                 <ul className="list-disc pl-6 space-y-2 text-sm mt-4">
                    <li><InlineMath math="x > 0" />.</li>
                    <li><InlineMath math="\alpha" /> (alpha) is the <strong>shape</strong> parameter.</li>
                    <li><InlineMath math="\beta" /> (beta) is the <strong>rate</strong> parameter.</li>
                     <li><InlineMath math="\Gamma(\alpha)" /> is the Gamma function.</li>
                </ul>
            </CardContent>
        </Card>
      </div>
    </>
  );
}
