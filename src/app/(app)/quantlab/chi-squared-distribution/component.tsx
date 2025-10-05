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
// Lanczos approximation for the gamma function, required for the PDF
function lanczosGamma(z: number): number {
    const p = [
        676.5203681218851, -1259.1392167224028, 771.32342877765313,
        -176.61502916214059, 12.507343278686905, -0.13857109526572012,
        9.9843695780195716e-6, 1.5056327351493116e-7
    ];
    if (z < 0.5) return Math.PI / (Math.sin(Math.PI * z) * lanczosGamma(1 - z));
    z -= 1;
    let x = 0.99999999999980993;
    for (let i = 0; i < p.length; i++) x += p[i] / (z + i + 1);
    const t = z + p.length - 0.5;
    return Math.sqrt(2 * Math.PI) * Math.pow(t, z + 0.5) * Math.exp(-t) * x;
}

const chiSquaredPdf = (x: number, k: number): number => {
    if (x < 0 || k <= 0) return 0;
    const term1 = Math.pow(x, k / 2 - 1) * Math.exp(-x / 2);
    const term2 = Math.pow(2, k / 2) * lanczosGamma(k / 2);
    if (term2 === 0) return Infinity;
    return term1 / term2;
};

// --- Chart Component ---
const ChiSquaredDistributionChart = ({ df }: { df: number }) => {
  const { chartData, mean, variance } = useMemo(() => {
    const data = [];
    const points = 200;
    // The range depends on the degrees of freedom
    const rangeEnd = Math.max(10, df + 4 * Math.sqrt(2 * df));

    for (let i = 1; i <= points; i++) {
        const x = (i / points) * rangeEnd;
        let density = chiSquaredPdf(x, df);
        if (!isFinite(density) || density > 5) {
            density = 5; // Cap for visualization
        }
        data.push({ value: x, density });
    }
    
    const calculatedMean = df;
    const calculatedVariance = 2 * df;

    return { chartData: data, mean: calculatedMean, variance: calculatedVariance };
  }, [df]);

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
                    <linearGradient id="fillChi" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0.1} />
                    </linearGradient>
                </defs>
                <Area type="monotone" dataKey="density" stroke="hsl(var(--chart-1))" fill="url(#fillChi)" strokeWidth={2} dot={false} />
            </AreaChart>
        </ChartContainer>
         <div className="grid grid-cols-2 text-center text-xs text-muted-foreground mt-4">
            <div>
                Mean (k): <span className="font-semibold text-foreground block">{mean.toFixed(2)}</span>
            </div>
            <div>
                Variance (2k): <span className="font-semibold text-foreground block">{variance.toFixed(2)}</span>
            </div>
        </div>
    </div>
  );
};

const DynamicChiSquaredDistributionChart = dynamic(() => Promise.resolve(ChiSquaredDistributionChart), {
  ssr: false,
  loading: () => <Skeleton className="h-[340px] w-full" />,
});


// --- Main Page Component ---
export default function ChiSquaredDistributionComponent() {
    const [df, setDf] = useState(5); // Degrees of Freedom

  return (
    <>
      <PageHeader
        title="Chi-Squared (χ²) Distribution"
        description="The distribution of the sum of squared standard normal deviates."
        variant="aligned-left"
      />
      <div className="mx-auto max-w-5xl space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">The "Goodness of Fit" Distribution</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-base leading-relaxed text-foreground/90">
            <p>
                The Chi-Squared (χ²) distribution is a continuous probability distribution that is widely used in hypothesis testing. It arises as the distribution of a sum of squared independent standard normal random variables. 
            </p>
            <p>
              In finance and econometrics, it is the backbone of the Chi-Squared test, which is used to test the goodness of fit of a model, check for independence between categorical variables, and compare variances. For instance, a risk manager might use it to test if the observed frequency of portfolio losses matches the frequency predicted by their risk model.
            </p>
          </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle className="font-headline">The Formula</CardTitle>
                 <CardDescription>The probability density function (PDF) is defined by one parameter: the degrees of freedom (<InlineMath math="k" />).</CardDescription>
            </CardHeader>
            <CardContent>
                 <div className="rounded-lg border bg-muted/50 p-4 text-center">
                  <BlockMath math="f(x; k) = \frac{1}{2^{k/2}\Gamma(k/2)} x^{k/2-1} e^{-x/2}" />
                </div>
                 <ul className="list-disc pl-6 space-y-2 text-sm mt-4">
                    <li><InlineMath math="x" /> is the variable (must be ≥ 0).</li>
                    <li><InlineMath math="k" /> represents the degrees of freedom.</li>
                    <li><InlineMath math="\Gamma(k/2)" /> is the Gamma function.</li>
                </ul>
            </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Interactive χ² Distribution</CardTitle>
            <CardDescription>Adjust the degrees of freedom to see how the shape of the distribution changes. Notice how it becomes more symmetric and bell-shaped as the degrees of freedom increase.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mx-auto max-w-md mb-6">
                <div className="space-y-3">
                    <Label htmlFor="df-slider">Degrees of Freedom (k): {df}</Label>
                    <Slider id="df-slider" min={1} max={30} step={1} value={[df]} onValueChange={(val) => setDf(val[0])} />
                </div>
            </div>
            <DynamicChiSquaredDistributionChart df={df} />
          </CardContent>
        </Card>
      </div>
    </>
  );
}
