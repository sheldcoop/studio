
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
import { PoissonDashboard } from '@/components/quantlab/dashboards/PoissonDashboard';

// --- Main Page Component ---
export default function PoissonDistributionPage() {
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
                <CardTitle className="font-headline">The Formula</CardTitle>
                 <CardDescription>The probability of observing exactly 'k' events in an interval is given by:</CardDescription>
            </CardHeader>
            <CardContent>
                 <div className="rounded-lg border bg-muted/50 p-4 text-center">
                  <BlockMath math="P(X=k) = \frac{\lambda^k e^{-\lambda}}{k!}" />
                </div>
                 <ul className="list-disc pl-6 space-y-2 text-sm mt-4">
                    <li><InlineMath math="k" /> is the number of occurrences of an event.</li>
                    <li><InlineMath math="\lambda" /> (lambda) is the average number of events per interval.</li>
                    <li><InlineMath math="e" /> is Euler's number (approximately 2.71828).</li>
                </ul>
            </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Interactive Poisson Distribution</CardTitle>
            <CardDescription>Adjust the rate parameter (λ) to see how the shape of the distribution changes. Notice how for large λ, the distribution starts to look like a normal distribution.</CardDescription>
          </CardHeader>
          <CardContent>
            <PoissonDashboard />
          </CardContent>
        </Card>
      </div>
    </>
  );
}
