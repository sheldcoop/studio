
'use client';

import { useState, useMemo } from 'react';
import { PageHeader } from '@/components/app/page-header';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { DistributionChart } from '@/components/quantlab/DistributionChart';
import { BlockMath, InlineMath } from 'react-katex';
import { standardNormalPdf } from '@/lib/math';
import 'katex/dist/katex.min.css';

const normalPdf = (x: number, mean: number, stdDev: number): number => {
    if (stdDev <= 0) return 0;
    return (1 / (stdDev * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * Math.pow((x - mean) / stdDev, 2));
};

// --- Main Page Component ---
export default function NormalDistributionComponent() {
  const [mean, setMean] = useState(0); // μ
  const [stdDev, setStdDev] = useState(1); // σ

  const { chartData, variance } = useMemo(() => {
    const data = [];
    const points = 400;
    const range = stdDev * 8;
    const step = range / points;
    const start = mean - range / 2;

    for (let i = 0; i <= points; i++) {
      const x = start + i * step;
      data.push({
        value: x,
        density: normalPdf(x, mean, stdDev),
      });
    }
    return { chartData: data, variance: stdDev * stdDev };
  }, [mean, stdDev]);

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

        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Interactive Normal Distribution</CardTitle>
            <CardDescription>Adjust the mean and standard deviation to see how they affect the shape of the curve.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
              <div className="space-y-3">
                <Label htmlFor="mean-slider">Mean (μ): {mean.toFixed(1)}</Label>
                <Slider id="mean-slider" min={-5} max={5} step={0.1} value={[mean]} onValueChange={(val) => setMean(val[0])} />
              </div>
              <div className="space-y-3">
                <Label htmlFor="stddev-slider">Standard Deviation (σ): {stdDev.toFixed(1)}</Label>
                <Slider id="stddev-slider" min={0.1} max={5} step={0.1} value={[stdDev]} onValueChange={(val) => setStdDev(val[0])} />
              </div>
            </div>
            <DistributionChart
                chartData={chartData}
                chartType="area"
                xAxisDataKey="value"
                yAxisDataKey="density"
                mean={mean}
                variance={variance}
            />
          </CardContent>
        </Card>
      </div>
    </>
  );
}
