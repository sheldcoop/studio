
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
import { ChiSquaredDashboard } from '@/components/quantlab/dashboards/ChiSquaredDashboard';

// --- Main Page Component ---
export default function ChiSquaredDistributionPage() {
  return (
    <>
      <PageHeader
        title="Chi-Squared (χ²) Distribution"
        description="The distribution of the sum of squared standard normal deviates."
        variant="aligned-left"
      />
      <div className="mx-auto max-w-5xl space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">The "Goodness of Fit" Distribution</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-base leading-relaxed text-foreground/90">
            <p>
                The Chi-Squared (χ²) distribution is a continuous probability distribution that is widely used in hypothesis testing. It arises as the distribution of a sum of squared independent standard normal random variables. 
            </p>
            <p>
              In finance and econometrics, it is the backbone of the Chi-Squared test, which is used to test the goodness of fit of a model, check for independence between categorical variables, and compare variances. For instance, a risk manager might use it to test if the observed frequency of portfolio losses matches the frequency predicted by their risk model.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Interactive χ² Distribution</CardTitle>
            <CardDescription>Adjust the degrees of freedom to see how the shape of the distribution changes. Notice how it becomes more symmetric and bell-shaped as the degrees of freedom increase.</CardDescription>
          </CardHeader>
          <CardContent>
            <ChiSquaredDashboard />
          </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle className="font-headline">The Formula</CardTitle>
                 <CardDescription>The probability density function (PDF) is defined by one parameter: the degrees of freedom (<InlineMath math="k" />).</CardDescription>
            </CardHeader>
            <CardContent>
                 <div className="rounded-lg border bg-muted/50 p-4 text-center">
                  <BlockMath math="f(x; k) = \frac{1}{2^{k/2}\Gamma(k/2)} x^{k/2-1} e^{-x/2}" />
                </div>
                 <ul className="list-disc pl-6 space-y-2 text-sm mt-4">
                    <li><InlineMath math="x \ge 0" /> is the variable.</li>
                    <li><InlineMath math="k" /> represents the degrees of freedom.</li>
                    <li><InlineMath math="\Gamma(k/2)" /> is the Gamma function.</li>
                </ul>
            </CardContent>
        </Card>

      </div>
    </>
  );
}
