
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
import { TDistributionDashboard } from '@/components/quantlab/dashboards/TDistributionDashboard';
import { PageSection } from '@/components/app/page-section';
import { FormulaBlock } from '@/components/app/formula-block';

// --- Main Page Component ---
export default function TDistributionPage() {
  return (
    <>
      <PageHeader
        title="Student's t-Distribution"
        description="The backbone of hypothesis testing with small sample sizes."
        variant="aligned-left"
      />
      <div className="mx-auto max-w-5xl space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">The "Small Sample" Distribution</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-base leading-relaxed text-foreground/90">
            <p>
              The t-distribution is a type of probability distribution that is similar to the normal distribution but has heavier tails. This means it assigns more probability to extreme values. It is used in place of the normal distribution when you have small sample sizes (typically n < 30) and the population standard deviation is unknown.
            </p>
            <p>
              In finance, this is incredibly common. You rarely know the true volatility of an asset and often work with limited historical data. The t-distribution provides a more cautious and robust framework for constructing confidence intervals and performing hypothesis tests (like the t-test) in these real-world scenarios.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Interactive t-Distribution</CardTitle>
            <CardDescription>Adjust the degrees of freedom to see how the t-distribution compares to the standard normal distribution. Notice how it converges to the normal distribution as `df` increases.</CardDescription>
          </CardHeader>
          <CardContent>
            <TDistributionDashboard />
          </CardContent>
        </Card>

        <PageSection title="Core Concepts">
          <Card>
              <CardHeader>
                  <CardTitle className="font-headline">Probability Density Function (PDF)</CardTitle>
                  <CardDescription>The PDF is defined by its single parameter: the degrees of freedom (<InlineMath math="\nu" /> or `df`).</CardDescription>
              </CardHeader>
              <CardContent>
                   <FormulaBlock>
                    <BlockMath math="f(t) = \frac{\Gamma(\frac{\nu+1}{2})}{\sqrt{\nu\pi}\Gamma(\frac{\nu}{2})} \left(1 + \frac{t^2}{\nu}\right)^{-\frac{\nu+1}{2}}" />
                  </FormulaBlock>
                   <ul className="list-disc pl-6 space-y-2 text-sm mt-4">
                      <li><InlineMath math="\nu" /> (nu) represents the degrees of freedom, which is typically the sample size minus one (n - 1).</li>
                      <li><InlineMath math="\Gamma" /> is the Gamma function.</li>
                  </ul>
              </CardContent>
          </Card>
           <Card>
              <CardHeader>
                  <CardTitle className="font-headline">Expected Value & Variance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                  <div>
                      <h4 className="font-semibold">Expected Value (Mean)</h4>
                      <FormulaBlock><BlockMath math="E[X] = 0 \quad \text{for } \nu > 1" /></FormulaBlock>
                  </div>
                  <div>
                      <h4 className="font-semibold">Variance</h4>
                      <FormulaBlock><BlockMath math="Var(X) = \frac{\nu}{\nu - 2} \quad \text{for } \nu > 2" /></FormulaBlock>
                      <p className="text-sm text-muted-foreground mt-2">Notice that the variance is always greater than 1, reflecting the "fatter tails" compared to the standard normal distribution (which has a variance of 1).</p>
                  </div>
              </CardContent>
          </Card>
        </PageSection>
      </div>
    </>
  );
}
