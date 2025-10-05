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
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip, ReferenceLine } from 'recharts';
import { Skeleton } from '@/components/ui/skeleton';
import { BlockMath, InlineMath } from 'react-katex';
import { standardNormalPdf } from '@/lib/math';
import 'katex/dist/katex.min.css';

// --- Math & Simulation Logic ---
// Lanczos approximation for the Gamma function
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

const tDistributionPdf = (t: number, df: number): number => {
    if (df <= 0) return 0;
    const term1 = lanczosGamma((df + 1) / 2);
    const term2 = Math.sqrt(df * Math.PI) * lanczosGamma(df / 2);
    const term3 = Math.pow(1 + (t * t) / df, -(df + 1) / 2);
    return (term1 / term2) * term3;
};

// --- Chart Component ---
const TDistributionChart = ({ df }: { df: number }) => {
  const chartData = useMemo(() => {
    const data = [];
    const points = 400;
    const range = 8;
    const step = range / points;
    const start = -range / 2;

    for (let i = 0; i <= points; i++) {
      const x = start + i * step;
      data.push({
        value: x,
        t_density: tDistributionPdf(x, df),
        normal_density: standardNormalPdf(x),
      });
    }
    return data;
  }, [df]);

  const variance = df > 2 ? df / (df - 2) : Infinity;

  return (
    <div>
      <ChartContainer config={{}} className="h-[300px] w-full">
        <AreaChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="value" type="number" domain={[-4, 4]} tickFormatter={(val) => val.toFixed(1)} name="Value" />
          <YAxis name="Density" domain={[0, 0.45]} />
          <Tooltip
            content={<ChartTooltipContent
              labelFormatter={(label) => `Value: ${Number(label).toFixed(2)}`}
            />}
          />
          <defs>
            <linearGradient id="fillT" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.8} />
              <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0.1} />
            </linearGradient>
          </defs>
          <Area type="monotone" dataKey="t_density" name="t-Distribution" stroke="hsl(var(--chart-1))" fill="url(#fillT)" strokeWidth={2} dot={false} />
          <Area type="monotone" dataKey="normal_density" name="Normal Distribution" stroke="hsl(var(--muted-foreground))" strokeDasharray="3 3" fill="transparent" strokeWidth={1.5} dot={false} />
        </AreaChart>
      </ChartContainer>
      <div className="grid grid-cols-2 text-center text-xs text-muted-foreground mt-4">
        <div>
          Mean: <span className="font-semibold text-foreground block">0</span>
        </div>
        <div>
          Variance (for <InlineMath math="df > 2" />): <span className="font-semibold text-foreground block">{isFinite(variance) ? variance.toFixed(3) : 'Undefined'}</span>
        </div>
      </div>
    </div>
  );
};

const DynamicTDistributionChart = dynamic(() => Promise.resolve(TDistributionChart), {
  ssr: false,
  loading: () => <Skeleton className="h-[340px] w-full" />,
});

// --- Main Page Component ---
export default function TDistributionPage() {
  const [df, setDf] = useState(5); // Degrees of Freedom

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
            <CardTitle className="font-headline">The Formula</CardTitle>
            <CardDescription>The probability density function (PDF) is defined by its single parameter: the degrees of freedom (<InlineMath math="\nu" /> or `df`).</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border bg-muted/50 p-4 text-center">
              <BlockMath math="f(t) = \frac{\Gamma(\frac{\nu+1}{2})}{\sqrt{\nu\pi}\Gamma(\frac{\nu}{2})} \left(1 + \frac{t^2}{\nu}\right)^{-\frac{\nu+1}{2}}" />
            </div>
            <ul className="list-disc pl-6 space-y-2 text-sm mt-4">
              <li><InlineMath math="\nu" /> (nu) represents the degrees of freedom, which is typically the sample size minus one (n - 1).</li>
              <li><InlineMath math="\Gamma" /> is the Gamma function.</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Interactive t-Distribution</CardTitle>
            <CardDescription>Adjust the degrees of freedom to see how the t-distribution compares to the standard normal distribution. Notice how it converges to the normal distribution as `df` increases.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mx-auto max-w-md mb-6">
              <div className="space-y-3">
                <Label htmlFor="df-slider">Degrees of Freedom (df): {df}</Label>
                <Slider id="df-slider" min={1} max={50} step={1} value={[df]} onValueChange={(val) => setDf(val[0])} />
              </div>
            </div>
            <DynamicTDistributionChart df={df} />
          </CardContent>
        </Card>
      </div>
    </>
  );
}
