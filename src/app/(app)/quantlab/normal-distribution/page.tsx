
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
import { NormalDashboard } from '@/components/quantlab/dashboards/NormalDashboard';

// --- Main Page Component ---
export default function NormalDistributionPage() {
  return (
    <>
      <PageHeader
        title="The Normal Distribution"
        description="The ubiquitous 'bell curve' that forms the bedrock of modern statistics."
        variant="aligned-left"
      />
      <div className="mx-auto max-w-5xl space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">The Bell Curve</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-base leading-relaxed text-foreground/90">
            <p>
              The Normal (or Gaussian) distribution is arguably the most important probability distribution in statistics. It's defined by its mean (<InlineMath math="\mu" />) and standard deviation (<InlineMath math="\sigma" />), and its symmetric, bell-shaped curve is instantly recognizable.
            </p>
            <p>
              Many natural phenomena, from heights and weights to measurement errors, tend to follow a normal distribution. In finance, it's the standard (though often flawed) assumption for modeling asset returns.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Interactive Normal Distribution</CardTitle>
            <CardDescription>Adjust the mean and standard deviation to see how they affect the shape of the curve.</CardDescription>
          </CardHeader>
          <CardContent>
            <NormalDashboard />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-headline">The Formula</CardTitle>
            <CardDescription>The probability density function (PDF) is:</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border bg-muted/50 p-4 text-center">
              <BlockMath math="f(x | \mu, \sigma^2) = \frac{1}{\sigma\sqrt{2\pi}} e^{ -\frac{1}{2}\left(\frac{x-\mu}{\sigma}\right)^2 }" />
            </div>
            <ul className="list-disc pl-6 space-y-2 text-sm mt-4">
              <li><InlineMath math="\mu" /> is the mean (center of the peak).</li>
              <li><InlineMath math="\sigma" /> is the standard deviation (controls the spread).</li>
            </ul>
          </CardContent>
        </Card>

      </div>
    </>
  );
}
