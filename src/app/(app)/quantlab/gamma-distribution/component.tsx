
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
import { gammaPdf } from '@/lib/math';


// --- Main Page Component ---
export default function GammaDistributionComponent() {
    const [alpha, setAlpha] = useState(2); // Shape
    const [beta, setBeta] = useState(1);   // Rate

    const { chartData, mean, variance } = useMemo(() => {
        const data = [];
        const points = 200;
        const rangeEnd = (alpha / beta) + 4 * Math.sqrt(alpha / (beta * beta));
        
        for (let i = 0; i <= points; i++) {
            const x = (i / points) * rangeEnd;
            data.push({
                value: x,
                density: gammaPdf(x, alpha, beta),
            });
        }

        const calculatedMean = alpha / beta;
        const calculatedVariance = alpha / (beta * beta);

        return { chartData: data, mean: calculatedMean, variance: calculatedVariance };
    }, [alpha, beta]);

  return (
    <>
      <PageHeader
        title="Gamma Distribution"
        description="Modeling waiting times and the sum of exponential variables."
        variant="aligned-left"
      />
      <div className="mx-auto max-w-5xl space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">The "Waiting Time" Distribution</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-base leading-relaxed text-foreground/90">
            <p>
                The Gamma distribution is a versatile, two-parameter continuous probability distribution that is strictly positive. It's often used to model the waiting time until a specified number of events occur.
            </p>
            <p>
              Think of it this way: if the time until the *next* bus arrives is modeled by an Exponential distribution, then the time until the *third* bus arrives is modeled by a Gamma distribution. In finance, it can be used to model the size of insurance claims, loan defaults, or operational losses, where the values are always positive and often skewed.
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
                  <BlockMath math="f(x; \alpha, \beta) = \frac{\beta^\alpha}{\Gamma(\alpha)} x^{\alpha-1} e^{-\beta x}" />
                </div>
                 <ul className="list-disc pl-6 space-y-2 text-sm mt-4">
                    <li><InlineMath math="x > 0" />.</li>
                    <li><InlineMath math="\alpha" /> (alpha) is the <strong>shape</strong> parameter.</li>
                    <li><InlineMath math="\beta" /> (beta) is the <strong>rate</strong> parameter.</li>
                     <li><InlineMath math="\Gamma(\alpha)" /> is the Gamma function.</li>
                </ul>
            </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Interactive Gamma Distribution</CardTitle>
            <CardDescription>Adjust the shape (α) and rate (β) parameters to see how the form of the distribution changes. Notice how for large α, it starts to resemble a normal distribution.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
                <div className="space-y-3">
                    <Label htmlFor="alpha-slider">Shape (α): {alpha.toFixed(1)}</Label>
                    <Slider id="alpha-slider" min={1} max={20} step={0.1} value={[alpha]} onValueChange={(val) => setAlpha(val[0])} />
                </div>
                <div className="space-y-3">
                    <Label htmlFor="beta-slider">Rate (β): {beta.toFixed(1)}</Label>
                    <Slider id="beta-slider" min={0.1} max={5} step={0.1} value={[beta]} onValueChange={(val) => setBeta(val[0])} />
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
