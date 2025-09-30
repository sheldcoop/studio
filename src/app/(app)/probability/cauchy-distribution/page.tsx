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
const cauchyPdf = (x: number, x0: number, gamma: number): number => {
    if (gamma <= 0) return 0;
    return 1 / (Math.PI * gamma * (1 + Math.pow((x - x0) / gamma, 2)));
};

// --- Chart Component ---
const CauchyDistributionChart = ({ location, scale }: { location: number; scale: number }) => {
  const chartData = useMemo(() => {
    const data = [];
    const points = 400;
    const range = Math.max(20, scale * 15);
    const start = location - range / 2;
    const end = location + range / 2;
    const step = (end - start) / points;

    for (let i = 0; i <= points; i++) {
        const x = start + i * step;
        data.push({
            value: x,
            density: cauchyPdf(x, location, scale),
        });
    }
    return data;
  }, [location, scale]);

  return (
    <div>
        <ChartContainer config={{}} className="h-[300px] w-full">
            <AreaChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="value" type="number" domain={['dataMin', 'dataMax']} tickFormatter={(val) => val.toFixed(1)} name="Value" />
                <YAxis name="Density" domain={[0, 'dataMax']} />
                <Tooltip
                    content={<ChartTooltipContent
                        labelFormatter={(label) => `Value: ${Number(label).toFixed(2)}`}
                        formatter={(value) => [Number(value).toFixed(4), 'Density']}
                    />}
                />
                 <defs>
                    <linearGradient id="fillCauchy" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0.1} />
                    </linearGradient>
                </defs>
                <Area type="monotone" dataKey="density" stroke="hsl(var(--chart-1))" fill="url(#fillCauchy)" strokeWidth={2} dot={false} />
            </AreaChart>
        </ChartContainer>
         <div className="grid grid-cols-2 text-center text-xs text-muted-foreground mt-4">
            <div>
                Median / Mode: <span className="font-semibold text-foreground block">{location.toFixed(2)}</span>
            </div>
            <div>
                Mean / Variance: <span className="font-semibold text-destructive block">Undefined</span>
            </div>
        </div>
    </div>
  );
};

const DynamicCauchyDistributionChart = dynamic(() => Promise.resolve(CauchyDistributionChart), {
  ssr: false,
  loading: () => <Skeleton className="h-[300px] w-full" />,
});


// --- Main Page Component ---
export default function CauchyDistributionPage() {
    const [location, setLocation] = useState(0); // x0
    const [scale, setScale] = useState(1);   // gamma

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
                <CardTitle className="font-headline">The Formula</CardTitle>
                 <CardDescription>The probability density function (PDF) is given by:</CardDescription>
            </CardHeader>
            <CardContent>
                 <div className="rounded-lg border bg-muted/50 p-4 text-center">
                  $$f(x; x_0, \\gamma) = \\frac{1}{\\pi\\gamma \\left[1 + \\left(\\frac{x-x_0}{\\gamma}\\right)^2\\right]}$$
                </div>
                 <ul className="list-disc pl-6 space-y-2 text-sm mt-4">
                    <li><code className="font-mono bg-background px-1 rounded">$x_0$</code> is the <strong>location</strong> parameter, which specifies the location of the peak (the median and mode).</li>
                    <li><code className="font-mono bg-background px-1 rounded">$\\gamma$</code> (gamma) is the <strong>scale</strong> parameter, which specifies the half-width at half-maximum. A larger gamma results in a wider, flatter curve with fatter tails.</li>
                </ul>
            </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Interactive Cauchy Distribution</CardTitle>
            <CardDescription>Adjust the location (x₀) and scale (γ) parameters to see how the shape of the distribution changes. Note how the tails remain "heavy" even with a small scale parameter.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
                <div className="space-y-3">
                    <Label htmlFor="location-slider">Location (x₀): {location.toFixed(1)}</Label>
                    <Slider id="location-slider" min={-5} max={5} step={0.1} value={[location]} onValueChange={(val) => setLocation(val[0])} />
                </div>
                <div className="space-y-3">
                    <Label htmlFor="scale-slider">Scale (γ): {scale.toFixed(1)}</Label>
                    <Slider id="scale-slider" min={0.1} max={5} step={0.1} value={[scale]} onValueChange={(val) => setScale(val[0])} />
                </div>
            </div>
            <DynamicCauchyDistributionChart location={location} scale={scale} />
          </CardContent>
        </Card>
      </div>
    </>
  );
}
