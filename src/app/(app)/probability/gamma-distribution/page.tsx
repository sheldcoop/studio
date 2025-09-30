'use client';

import { useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
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
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
import { Skeleton } from '@/components/ui/skeleton';
import Script from 'next/script';

// --- Math & Simulation Logic ---
// Lanczos approximation for the gamma function
function lanczosGamma(z: number): number {
    const p = [
        676.5203681218851, -1259.1392167224028, 771.32342877765313,
        -176.61502916214059, 12.507343278686905, -0.13857109526572012,
        9.9843695780195716e-6, 1.5056327351493116e-7
    ];
    if (z < 0.5) {
        return Math.PI / (Math.sin(Math.PI * z) * lanczosGamma(1 - z));
    }
    z -= 1;
    let x = 0.99999999999980993;
    for (let i = 0; i < p.length; i++) {
        x += p[i] / (z + i + 1);
    }
    const t = z + p.length - 0.5;
    return Math.sqrt(2 * Math.PI) * Math.pow(t, z + 0.5) * Math.exp(-t) * x;
}


const gammaPdf = (x: number, alpha: number, beta: number): number => {
    if (x < 0 || alpha <= 0 || beta <= 0) {
        return 0;
    }
    const term1 = (Math.pow(beta, alpha) / lanczosGamma(alpha));
    const term2 = Math.pow(x, alpha - 1);
    const term3 = Math.exp(-beta * x);
    return term1 * term2 * term3;
};

// --- Chart Component ---
const GammaDistributionChart = ({ alpha, beta }: { alpha: number; beta: number }) => {
  const { chartData, mean, variance } = useMemo(() => {
    const data = [];
    const points = 200;
    // Determine a reasonable range for the x-axis, e.g., up to a value that covers ~99.9% of the distribution
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
    <div>
        <ChartContainer config={{}} className="h-[300px] w-full">
            <AreaChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="value" type="number" domain={[0, 'dataMax']} tickFormatter={(val) => val.toFixed(1)} name="Value" />
                <YAxis name="Density" domain={[0, 'dataMax']} />
                <Tooltip
                    content={<ChartTooltipContent
                        labelFormatter={(label) => `Value: ${Number(label).toFixed(2)}`}
                        formatter={(value) => [Number(value).toFixed(4), 'Density']}
                    />}
                />
                 <defs>
                    <linearGradient id="fillGamma" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0.1} />
                    </linearGradient>
                </defs>
                <Area type="monotone" dataKey="density" stroke="hsl(var(--chart-1))" fill="url(#fillGamma)" strokeWidth={2} dot={false} />
            </AreaChart>
        </ChartContainer>
         <div className="grid grid-cols-2 text-center text-xs text-muted-foreground mt-4">
            <div>
                Mean (α/β): <span className="font-semibold text-foreground block">{mean.toFixed(2)}</span>
            </div>
            <div>
                Variance (α/β²): <span className="font-semibold text-foreground block">{variance.toFixed(2)}</span>
            </div>
        </div>
    </div>
  );
};

const DynamicGammaDistributionChart = dynamic(() => Promise.resolve(GammaDistributionChart), {
  ssr: false,
  loading: () => <Skeleton className="h-[300px] w-full" />,
});


// --- Main Page Component ---
export default function GammaDistributionPage() {
    const [alpha, setAlpha] = useState(2); // Shape
    const [beta, setBeta] = useState(1);   // Rate

  return (
    <>
      <Script
        id="mathjax-config"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.MathJax = {
              tex: {
                inlineMath: [['$', '$'], ['\\(', '\\)']],
                displayMath: [['$$', '$$'], ['\\[', '\\]']],
              },
              svg: {
                fontCache: 'global'
              }
            };
          `,
        }}
      />
      <Script
        src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-svg.js"
        strategy="afterInteractive"
        id="mathjax-script"
      />
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
                  $$f(x; \\alpha, \\beta) = \\frac{\\beta^\\alpha}{\\Gamma(\\alpha)} x^{\\alpha-1} e^{-\\beta x}$$
                </div>
                 <ul className="list-disc pl-6 space-y-2 text-sm mt-4">
                    <li><code className="font-mono bg-background px-1 rounded">$x$</code> must be > 0.</li>
                    <li><code className="font-mono bg-background px-1 rounded">$\\alpha$</code> (alpha) is the <strong>shape</strong> parameter.</li>
                    <li><code className="font-mono bg-background px-1 rounded">$\\beta$</code> (beta) is the <strong>rate</strong> parameter.</li>
                     <li><code className="font-mono bg-background px-1 rounded">$\\Gamma(\\alpha)$</code> is the Gamma function.</li>
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
            <DynamicGammaDistributionChart alpha={alpha} beta={beta} />
          </CardContent>
        </Card>
      </div>
    </>
  );
}
