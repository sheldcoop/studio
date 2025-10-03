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
// Gamma function approximation (Lanczos) for the Beta function
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

const betaPdf = (x: number, alpha: number, beta: number): number => {
    if (x < 0 || x > 1 || alpha <= 0 || beta <= 0) {
        return 0;
    }
    if ((alpha < 1 && x === 0) || (beta < 1 && x === 1)) {
        return Infinity; // Handle vertical asymptotes
    }
    const B = betaFunction(alpha, beta);
    if (B === 0) return Infinity; // Avoid division by zero
    return (Math.pow(x, alpha - 1) * Math.pow(1 - x, beta - 1)) / B;
};

// --- Chart Component ---
const BetaDistributionChart = ({ alpha, beta }: { alpha: number; beta: number }) => {
  const { chartData, mean, variance } = useMemo(() => {
    const data = [];
    const points = 200;
    
    for (let i = 0; i <= points; i++) {
        const x = i / points;
        let density = betaPdf(x, alpha, beta);
        // Cap density for visualization purposes to prevent extreme spikes
        if (!isFinite(density) || density > 5) {
            density = 5;
        }
        data.push({ value: x, density });
    }

    const calculatedMean = alpha / (alpha + beta);
    const calculatedVariance = (alpha * beta) / (Math.pow(alpha + beta, 2) * (alpha + beta + 1));

    return { chartData: data, mean: calculatedMean, variance: calculatedVariance };
  }, [alpha, beta]);

  return (
    <div>
        <ChartContainer config={{}} className="h-[300px] w-full">
            <AreaChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="value" type="number" domain={[0, 1]} tickFormatter={(val) => val.toFixed(1)} name="Value" />
                <YAxis name="Density" domain={[0, 'dataMax + 0.5']} />
                <Tooltip
                    content={<ChartTooltipContent
                        labelFormatter={(label) => `Value: ${Number(label).toFixed(2)}`}
                        formatter={(value) => [Number(value).toFixed(4), 'Density']}
                    />}
                />
                 <defs>
                    <linearGradient id="fillBeta" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0.1} />
                    </linearGradient>
                </defs>
                <Area type="monotone" dataKey="density" stroke="hsl(var(--chart-1))" fill="url(#fillBeta)" strokeWidth={2} dot={false} />
            </AreaChart>
        </ChartContainer>
         <div className="grid grid-cols-2 text-center text-xs text-muted-foreground mt-4">
            <div>
                Mean (α/(α+β)): <span className="font-semibold text-foreground block">{mean.toFixed(3)}</span>
            </div>
            <div>
                Variance: <span className="font-semibold text-foreground block">{variance.toFixed(3)}</span>
            </div>
        </div>
    </div>
  );
};

const DynamicBetaDistributionChart = dynamic(() => Promise.resolve(BetaDistributionChart), {
  ssr: false,
  loading: () => <Skeleton className="h-[340px] w-full" />,
});


// --- Main Page Component ---
export default function BetaDistributionPage() {
    const [alpha, setAlpha] = useState(2); // Shape parameter 1
    const [beta, setBeta] = useState(5);   // Shape parameter 2

  return (
    <>
      <PageHeader
        title="Beta Distribution"
        description="Modeling probabilities, percentages, and proportions."
        variant="aligned-left"
      />
      <div className="mx-auto max-w-5xl space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">The "Probability of Probabilities" Distribution</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-base leading-relaxed text-foreground/90">
            <p>
                The Beta distribution is a continuous probability distribution defined on the interval [0, 1]. This makes it perfectly suited for modeling random variables that represent probabilities or proportions.
            </p>
            <p>
              In quantitative finance, it's a powerful tool in Bayesian inference and risk modeling. For example, a credit analyst might use it to model the recovery rate on a defaulted loan (which must be between 0% and 100%). A trading strategist could use it to represent the probability of a particular signal being profitable.
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
                  <BlockMath math="f(x; \alpha, \beta) = \frac{x^{\alpha-1} (1-x)^{\beta-1}}{B(\alpha, \beta)}" />
                </div>
                 <ul className="list-disc pl-6 space-y-2 text-sm mt-4">
                    <li><InlineMath math="x" /> is the variable (between 0 and 1).</li>
                    <li><InlineMath math="\alpha" /> and <InlineMath math="\beta" /> are positive shape parameters.</li>
                    <li><InlineMath math="B(\alpha, \beta)" /> is the Beta function, which normalizes the total probability to 1.</li>
                </ul>
            </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Interactive Beta Distribution</CardTitle>
            <CardDescription>Adjust the shape parameters (α and β) to see how they influence the distribution. Note the wide variety of shapes the Beta distribution can take.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
                <div className="space-y-3">
                    <Label htmlFor="alpha-slider">Shape (α): {alpha.toFixed(1)}</Label>
                    <Slider id="alpha-slider" min={0.1} max={10} step={0.1} value={[alpha]} onValueChange={(val) => setAlpha(val[0])} />
                </div>
                <div className="space-y-3">
                    <Label htmlFor="beta-slider">Shape (β): {beta.toFixed(1)}</Label>
                    <Slider id="beta-slider" min={0.1} max={10} step={0.1} value={[beta]} onValueChange={(val) => setBeta(val[0])} />
                </div>
            </div>
            <DynamicBetaDistributionChart alpha={alpha} beta={beta} />
          </CardContent>
        </Card>
      </div>
    </>
  );
}
