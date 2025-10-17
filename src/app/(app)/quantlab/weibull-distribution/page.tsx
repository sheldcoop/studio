
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
import { WeibullDashboard } from '@/components/quantlab/dashboards/WeibullDashboard';


// --- Main Page Component ---
export default function WeibullDistributionPage() {
  return (
    <>
      <PageHeader
        title="Weibull Distribution"
        description="Modeling time-to-failure, event durations, and reliability."
        variant="aligned-left"
      />
      <div className="mx-auto max-w-5xl space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">The "Time-to-Event" Distribution</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-base leading-relaxed text-foreground/90">
            <p>
                The Weibull distribution is a highly flexible continuous probability distribution. It's widely used in engineering to model reliability and time-to-failure of components. In finance, it can be applied to model the duration of events, such as the time until a corporate bond defaults or the time a stock price stays above a certain level.
            </p>
            <p>
              Its flexibility comes from its shape parameter, <InlineMath math="k" />. Depending on the value of <InlineMath math="k" />, it can mimic the behavior of other distributions like the exponential (when <InlineMath math="k=1" />) or approximate the normal distribution (when <InlineMath math="k" /> is around 3-4).
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Interactive Weibull Distribution</CardTitle>
            <CardDescription>Adjust the shape (k) and scale (λ) parameters to see how the distribution's form changes.</CardDescription>
          </CardHeader>
          <CardContent>
            <WeibullDashboard />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-headline">The Formula</CardTitle>
            <CardDescription>The probability density function (PDF) is given by:</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border bg-muted/50 p-4 text-center">
              <BlockMath math="f(x; k, \lambda) = \frac{k}{\lambda} \left(\frac{x}{\lambda}\right)^{k-1} e^{-(x/\lambda)^k}" />
            </div>
            <ul className="list-disc pl-6 space-y-2 text-sm mt-4">
              <li><InlineMath math="x \ge 0" /> is the variable (e.g., time).</li>
              <li><InlineMath math="k > 0" /> is the <strong>shape</strong> parameter. It determines the shape of the failure rate. If <InlineMath math="k < 1" />, the failure rate decreases over time. If <InlineMath math="k = 1" />, it's constant (Exponential). If <InlineMath math="k > 1" />, the failure rate increases over time (wear-out).</li>
              <li><InlineMath math="\lambda > 0" /> is the <strong>scale</strong> parameter, which stretches or contracts the distribution.</li>
            </ul>
          </CardContent>
        </Card>

      </div>
    </>
  );
}
