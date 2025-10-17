
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
import { CauchyDashboard } from '@/components/quantlab/dashboards/CauchyDashboard';


// --- Main Page Component ---
export default function CauchyDistributionPage() {
  return (
    <>
      <PageHeader
        title="Cauchy Distribution"
        description="Modeling extreme events and 'fat-tailed' phenomena."
        variant="aligned-left"
      />
      <div className="mx-auto max-w-5xl space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">The "Black Swan" Distribution</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-base leading-relaxed text-foreground/90">
            <p>
                The Cauchy distribution (also known as the Lorentz distribution) is a continuous probability distribution famous for its heavy, or "fat," tails. This means it assigns a much higher probability to extreme events compared to the normal distribution.
            </p>
            <p>
              In finance, it's a powerful conceptual tool for modeling phenomena where "black swan" events are more common than traditional models suggest. Its most striking feature is that its expected value (mean) and variance are undefined. No matter how many samples you take, the average will not converge, making it a radical departure from well-behaved distributions like the Normal distribution.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Interactive Cauchy Distribution</CardTitle>
            <CardDescription>Adjust the location (x₀) and scale (γ) parameters to see how the shape of the distribution changes. Note how the tails remain "heavy" even with a small scale parameter.</CardDescription>
          </CardHeader>
          <CardContent>
            <CauchyDashboard />
          </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle className="font-headline">The Formula</CardTitle>
                 <CardDescription>The probability density function (PDF) is given by:</CardDescription>
            </CardHeader>
            <CardContent>
                 <div className="rounded-lg border bg-muted/50 p-4 text-center">
                  <BlockMath math="f(x; x_0, \gamma) = \frac{1}{\pi\gamma \left[1 + \left(\frac{x-x_0}{\gamma}\right)^2\right]}" />
                </div>
                 <ul className="list-disc pl-6 space-y-2 text-sm mt-4">
                    <li><InlineMath math="x_0" /> is the <strong>location</strong> parameter, which specifies the location of the peak (the median and mode).</li>
                    <li><InlineMath math="\gamma" /> (gamma) is the <strong>scale</strong> parameter, which specifies the half-width at half-maximum. A larger gamma results in a wider, flatter curve with fatter tails.</li>
                </ul>
            </CardContent>
        </Card>

      </div>
    </>
  );
}
