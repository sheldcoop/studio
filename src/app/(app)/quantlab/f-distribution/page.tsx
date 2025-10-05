
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
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';

// --- Math & Simulation Logic ---
// Lanczos approximation for the Gamma function, used by the Beta function.
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

const betaFunction = (alpha: number, beta: number): number => {
    return (lanczosGamma(alpha) * lanczosGamma(beta)) / lanczosGamma(alpha + beta);
};

const fDistributionPdf = (x: number, d1: number, d2: number): number => {
    if (x <= 0 || d1 <= 0 || d2 <= 0) {
        return 0;
    }
    const term1 = Math.sqrt(Math.pow(d1 * x, d1) * Math.pow(d2, d2) / Math.pow(d1 * x + d2, d1 + d2));
    const term2 = x * betaFunction(d1 / 2, d2 / 2);
    if (term2 === 0) return Infinity;
    return term1 / term2;
};

// --- Chart Component ---
const FDistributionChart = ({ d1, d2 }: { d1: number; d2: number }) => {
  const { chartData, mean, variance } = useMemo(() => {
    const data = [];
    const points = 200;
    // The F-distribution is skewed, so we need to find a reasonable upper bound.
    // The mean is a good starting point to define the range.
    const calculatedMean = d2 > 2 ? d2 / (d2 - 2) : 1;
    const rangeEnd = Math.max(5, calculatedMean * 3);

    for (let i = 1; i <= points; i++) { // Start from i=1 to avoid x=0
      const x = (i / points) * rangeEnd;
      let density = fDistributionPdf(x, d1, d2);
      if (!isFinite(density) || density > 5) {
        density = 5; // Cap for visualization
      }
      data.push({ value: x, density });
    }

    const calculatedVariance = d2 > 4 ? (2 * d2 * d2 * (d1 + d2 - 2)) / (d1 * (d2 - 2) * (d2 - 2) * (d2 - 4)) : Infinity;

    return { chartData: data, mean: calculatedMean, variance: calculatedVariance };
  }, [d1, d2]);

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
            <linearGradient id="fillF" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.8} />
              <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0.1} />
            </linearGradient>
          </defs>
          <Area type="monotone" dataKey="density" stroke="hsl(var(--chart-1))" fill="url(#fillF)" strokeWidth={2} dot={false} />
        </AreaChart>
      </ChartContainer>
      <div className="grid grid-cols-2 text-center text-xs text-muted-foreground mt-4">
        <div>
          Mean (for <InlineMath math="d_2 > 2" />): <span className="font-semibold text-foreground block">{isFinite(mean) ? mean.toFixed(3) : 'Undefined'}</span>
        </div>
        <div>
          Variance (for <InlineMath math="d_2 > 4" />): <span className="font-semibold text-foreground block">{isFinite(variance) ? variance.toFixed(3) : 'Undefined'}</span>
        </div>
      </div>
    </div>
  );
};

const DynamicFDistributionChart = dynamic(() => Promise.resolve(FDistributionChart), {
  ssr: false,
  loading: () => <Skeleton className="h-[340px] w-full" />,
});

// --- Main Page Component ---
export default function FDistributionPage() {
  const [d1, setD1] = useState(5); // Degrees of freedom 1
  const [d2, setD2] = useState(10); // Degrees of freedom 2

  return (
    <>
      <PageHeader
        title="F-Distribution"
        description="Comparing variances between two or more samples."
        variant="aligned-left"
      />
      <div className="mx-auto max-w-5xl space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">The "Ratio of Variances" Distribution</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-base leading-relaxed text-foreground/90">
            <p>
              The F-distribution is a continuous probability distribution that arises frequently as the null distribution of a test statistic, most notably in the Analysis of Variance (ANOVA) and the F-test to compare two variances.
            </p>
            <p>
              It describes the ratio of two independent chi-squared variables, each divided by their respective degrees of freedom. In practical terms, if you take two samples from normal populations, the ratio of their sample variances follows an F-distribution. This is why it's the cornerstone for checking if the volatility (variance) of two different stocks or trading strategies is significantly different.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-headline">The Formula</CardTitle>
            <CardDescription>The probability density function (PDF) is defined by its two parameters: the degrees of freedom of the numerator (<InlineMath math="d_1" />) and the denominator (<InlineMath math="d_2" />).</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border bg-muted/50 p-4 text-center">
              <BlockMath math="f(x; d_1, d_2) = \frac{\sqrt{\frac{(d_1 x)^{d_1} d_2^{d_2}}{(d_1 x + d_2)^{d_1 + d_2}}}}{x B(\frac{d_1}{2}, \frac{d_2}{2})}" />
            </div>
            <ul className="list-disc pl-6 space-y-2 text-sm mt-4">
              <li><InlineMath math="d_1" /> is the degrees of freedom for the numerator variance.</li>
              <li><InlineMath math="d_2" /> is the degrees of freedom for the denominator variance.</li>
              <li><InlineMath math="B" /> is the Beta function.</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Interactive F-Distribution</CardTitle>
            <CardDescription>Adjust the degrees of freedom to see how they influence the shape of the distribution. Notice how it becomes more bell-shaped as the degrees of freedom increase.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
              <div className="space-y-3">
                <Label htmlFor="d1-slider">Numerator Degrees of Freedom (d₁): {d1}</Label>
                <Slider id="d1-slider" min={1} max={50} step={1} value={[d1]} onValueChange={(val) => setD1(val[0])} />
              </div>
              <div className="space-y-3">
                <Label htmlFor="d2-slider">Denominator Degrees of Freedom (d₂): {d2}</Label>
                <Slider id="d2-slider" min={1} max={50} step={1} value={[d2]} onValueChange={(val) => setD2(val[0])} />
              </div>
            </div>
            <DynamicFDistributionChart d1={d1} d2={d2} />
          </CardContent>
        </Card>
      </div>
    </>
  );
}
