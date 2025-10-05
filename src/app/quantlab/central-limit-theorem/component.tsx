
'use client';

import type { Metadata } from 'next';
import { PageHeader } from '@/components/app/page-header';
import { CLT_Interactive_Dashboard } from '@/components/app/clt-interactive-dashboard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { InlineMath, BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';

export default function CentralLimitTheoremComponent() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="The Central Limit Theorem (CLT)"
        description="The surprising and powerful idea that the average of many random things is not random at all, but is in fact predictable."
        variant="aligned-left"
      />
      <div className="mx-auto max-w-7xl space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Order from Chaos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-base leading-relaxed text-foreground/90">
            <p>
              The Central Limit Theorem is one of the most magical ideas in all of statistics. In essence, it states that if you take a sufficiently large number of random samples from *any* population (no matter how weirdly shaped its distribution is) and calculate the average (or mean) of each sample, the distribution of those averages will be approximately a Normal (bell-shaped) distribution.
            </p>
             <p>
                Imagine you have a barrel full of tickets with numbers written on them. The numbers could be completely random (Uniform distribution), mostly small numbers with a few huge ones (a skewed distribution), or anything else. The CLT says that if you repeatedly:
            </p>
            <ol className="list-decimal pl-6 space-y-2">
                <li>Pull out a handful of tickets (a sample, e.g., n=30).</li>
                <li>Calculate the average of that handful.</li>
                <li>Write down the average and put the tickets back.</li>
            </ol>
            <p>
                ...and you do this thousands of times, the histogram of the averages you wrote down will form a beautiful, clean bell curve. This is true even if the original numbers in the barrel had a completely different-looking histogram!
            </p>
          </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle className="font-headline">The Math Behind the Magic</CardTitle>
            </CardHeader>
             <CardContent className="space-y-4 text-base leading-relaxed text-foreground/90">
                 <p>
                    Let <InlineMath math="X_1, X_2, ..., X_n" /> be a sequence of independent and identically distributed (i.i.d.) random variables with population mean <InlineMath math="\mu" /> and finite variance <InlineMath math="\sigma^2" />. Let <InlineMath math="\bar{X}_n = \frac{1}{n}\sum_{i=1}^n X_i" /> be the sample mean. The CLT states that as <InlineMath math="n \to \infty" />, the distribution of the standardized sample mean approaches a standard normal distribution:
                </p>
                <div className="rounded-lg border bg-muted/50 p-4 text-center">
                    <BlockMath math="\frac{\bar{X}_n - \mu}{\sigma/\sqrt{n}} \xrightarrow{d} N(0, 1)" />
                </div>
                 <p>
                    This tells us two amazing things about the distribution of the sample means:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-sm">
                    <li>The mean of the sample means will be the same as the original population mean (<InlineMath math="\mu" />).</li>
                    <li>The standard deviation of the sample means (called the "standard error") will be the original population's standard deviation divided by the square root of the sample size (<InlineMath math="\sigma/\sqrt{n}" />).</li>
                </ul>
            </CardContent>
        </Card>
      </div>

      <CLT_Interactive_Dashboard />

    </div>
  );
}

