
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
import 'katex/dist/katex.min.css';
import { logisticPdf } from '@/lib/math';

// --- Main Page Component ---
export default function LogisticDistributionComponent() {
    const [location, setLocation] = useState(0); // mu
    const [scale, setScale] = useState(1);   // s

    const { chartData, mean, variance } = useMemo(() => {
        const data = [];
        const points = 400;
        const range = Math.max(20, scale * 18);
        const start = location - range / 2;
        const end = location + range / 2;
        const step = (end - start) / points;

        for (let i = 0; i <= points; i++) {
            const x = start + i * step;
            data.push({
                value: x,
                density: logisticPdf(x, location, scale),
            });
        }
        
        const calculatedMean = location;
        const calculatedVariance = (Math.pow(Math.PI, 2) * Math.pow(scale, 2)) / 3;

        return { chartData: data, mean: calculatedMean, variance: calculatedVariance };
    }, [location, scale]);

  return (
    <>
      <PageHeader
        title="Logistic Distribution"
        description="A key distribution in machine learning and growth modeling."
        variant="aligned-left"
      />
      <div className="mx-auto max-w-5xl space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">The "Growth Curve" Distribution</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-base leading-relaxed text-foreground/90">
            <p>
                The Logistic distribution is a continuous probability distribution whose cumulative distribution function is the logistic function, which appears in logistic regression and feedforward neural networks. It resembles the normal distribution but has heavier tails, meaning it gives more probability to extreme events.
            </p>
            <p>
              In finance, it's used in credit risk modeling to estimate the probability of default. Its S-shaped cumulative distribution function is perfect for modeling phenomena that have a "saturation" point, like the adoption rate of a new technology or the market share of a product.
            </p>
          </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle className="font-headline">The Formula</CardTitle>
                 <CardDescription>The probability density function (PDF) is given by:</CardDescription>
            </CardHeader>
            <CardContent>
                 <div className="rounded-lg border bg-muted/50 p-4 text-center">
                  <BlockMath math="f(x; \mu, s) = \frac{e^{-(x-\mu)/s}}{s(1+e^{-(x-\mu)/s})^2}" />
                </div>
                 <ul className="list-disc pl-6 space-y-2 text-sm mt-4">
                    <li><InlineMath math="\mu" /> (mu) is the <strong>location</strong> parameter, which is also the mean, median, and mode.</li>
                    <li><InlineMath math="s > 0" /> is the <strong>scale</strong> parameter, which is proportional to the standard deviation. A larger scale value makes the curve wider and flatter.</li>
                </ul>
            </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Interactive Logistic Distribution</CardTitle>
            <CardDescription>Adjust the location (μ) and scale (s) parameters to see how the shape of the distribution changes.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
                <div className="space-y-3">
                    <Label htmlFor="location-slider">Location (μ): {location.toFixed(1)}</Label>
                    <Slider id="location-slider" min={-5} max={5} step={0.1} value={[location]} onValueChange={(val) => setLocation(val[0])} />
                </div>
                <div className="space-y-3">
                    <Label htmlFor="scale-slider">Scale (s): {scale.toFixed(1)}</Label>
                    <Slider id="scale-slider" min={0.2} max={4} step={0.1} value={[scale]} onValueChange={(val) => setScale(val[0])} />
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
