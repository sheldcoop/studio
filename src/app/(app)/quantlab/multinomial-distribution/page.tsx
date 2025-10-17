
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
import { MultinomialDashboard } from '@/components/quantlab/dashboards/MultinomialDashboard';

// --- Main Page Component ---
export default function MultinomialDistributionPage() {
  return (
    <>
      <PageHeader
        title="Multinomial Distribution"
        description="A generalization of the Binomial distribution for more than two outcomes."
        variant="aligned-left"
      />
      <div className="mx-auto max-w-5xl space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Beyond Success or Failure</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-base leading-relaxed text-foreground/90">
            <p>
              The Multinomial distribution extends the Binomial distribution to situations with more than two possible outcomes for each trial. While Binomial models the number of successes in a series of 'success/failure' trials, Multinomial models the number of times each of a set of possible outcomes occurs.
            </p>
            <p>
              For example, instead of just a 'win' or 'loss', a trade could result in a 'big win', 'small win', 'breakeven', 'small loss', or 'big loss'. The Multinomial distribution can calculate the probability of observing a specific count for each of these categories over a series of trades.
            </p>
          </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle className="font-headline">The Formula</CardTitle>
                 <CardDescription>The probability of observing a specific set of counts is:</CardDescription>
            </CardHeader>
            <CardContent>
                 <div className="rounded-lg border bg-muted/50 p-4 text-center">
                  <BlockMath math="P(X_1=x_1, ..., X_c=x_c) = \frac{n!}{x_1!...x_c!} p_1^{x_1} \cdots p_c^{x_c}" />
                </div>
                 <ul className="list-disc pl-6 space-y-2 text-sm mt-4">
                    <li><InlineMath math="n" /> is the total number of trials.</li>
                    <li><InlineMath math="c" /> is the number of possible outcomes.</li>
                    <li><InlineMath math="x_i" /> is the number of times outcome <InlineMath math="i" /> occurred.</li>
                    <li><InlineMath math="p_i" /> is the probability of outcome <InlineMath math="i" /> on a single trial.</li>
                </ul>
            </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Interactive Multinomial Calculator</CardTitle>
            <CardDescription>Specify the parameters to calculate the probability of a specific result.</CardDescription>
          </CardHeader>
          <CardContent>
            <MultinomialDashboard />
          </CardContent>
        </Card>
      </div>
    </>
  );
}
