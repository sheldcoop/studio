
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
import { FDistributionDashboard } from '@/components/quantlab/dashboards/FDistributionDashboard';

// --- Main Page Component ---
export default function FDistributionPage() {
  return (
    <>
      <PageHeader
        title="F-Distribution"
        description="Comparing variances between two or more samples."
        variant="aligned-left"
      />
      <div className="mx-auto max-w-5xl space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">The "Ratio of Variances" Distribution</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-base leading-relaxed text-foreground/90">
            <p>
              The F-distribution is a continuous probability distribution that arises frequently as the null distribution of a test statistic, most notably in the Analysis of Variance (ANOVA) and the F-test to compare two variances.
            </p>
            <p>
              It describes the ratio of two independent chi-squared variables, each divided by their respective degrees of freedom. In practical terms, if you take two samples from normal populations, the ratio of their sample variances follows an F-distribution. This is why it's the cornerstone for checking if the volatility (variance) of two different stocks or trading strategies is significantly different.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Interactive F-Distribution</CardTitle>
            <CardDescription>Adjust the degrees of freedom to see how they influence the shape of the distribution. Notice how it becomes more bell-shaped as the degrees of freedom increase.</CardDescription>
          </CardHeader>
          <CardContent>
            <FDistributionDashboard />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-headline">The Formula</CardTitle>
            <CardDescription>The probability density function (PDF) is defined by its two parameters: the degrees of freedom of the numerator (<InlineMath math="d_1" />) and the denominator (<InlineMath math="d_2" />).</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border bg-muted/50 p-4 text-center">
              <BlockMath math="f(x; d_1, d_2) = \frac{\sqrt{\frac{(d_1 x)^{d_1} d_2^{d_2}}{(d_1 x + d_2)^{d_1 + d_2}}}}{x B(\frac{d_1}{2}, \frac{d_2}{2})}" />
            </div>
            <ul className="list-disc pl-6 space-y-2 text-sm mt-4">
              <li><InlineMath math="d_1" /> is the degrees of freedom for the numerator variance.</li>
              <li><InlineMath math="d_2" /> is the degrees of freedom for the denominator variance.</li>
              <li><InlineMath math="B" /> is the Beta function.</li>
            </ul>
          </CardContent>
        </Card>

      </div>
    </>
  );
}
