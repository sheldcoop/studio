
'use client';

import { useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { PageHeader } from '@/components/app/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import { Scatter, ScatterChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ReferenceLine } from 'recharts';
import { Skeleton } from '@/components/ui/skeleton';
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';

// --- Math & Simulation Logic ---
const generatePortfolio = (mu1: number, mu2: number, sigma1: number, sigma2: number, rho: number) => {
  const portfolios = [];
  for (let i = 0; i <= 100; i++) {
    const w1 = i / 100;
    const w2 = 1 - w1;
    const portfolioReturn = w1 * mu1 + w2 * mu2;
    const portfolioVolatility = Math.sqrt(
      w1**2 * sigma1**2 + w2**2 * sigma2**2 + 2 * w1 * w2 * rho * sigma1 * sigma2
    );
    portfolios.push({ vol: portfolioVolatility, ret: portfolioReturn });
  }
  return portfolios;
};

// --- Chart Component ---
const EfficientFrontierChart = ({ portfolios }: { portfolios: { vol: number; ret: number }[] }) => {
  return (
    <ChartContainer config={{}} className="h-[350px] w-full">
      <ScatterChart>
        <CartesianGrid />
        <XAxis type="number" dataKey="vol" name="Volatility (Std. Dev.)" label={{ value: "Volatility", position: 'insideBottom', offset: -5 }} domain={['dataMin', 'dataMax']} tickFormatter={(v) => `${(v * 100).toFixed(0)}%`} />
        <YAxis type="number" dataKey="ret" name="Expected Return" label={{ value: "Return", angle: -90, position: 'insideLeft' }} domain={['dataMin', 'dataMax']} tickFormatter={(v) => `${(v * 100).toFixed(0)}%`} />
        <Tooltip cursor={{ strokeDasharray: '3 3' }} content={<ChartTooltipContent formatter={(value, name) => [`${(Number(value) * 100).toFixed(1)}%`, name === 'vol' ? 'Volatility' : 'Return']} />} />
        <Scatter name="Portfolios" data={portfolios} fill="hsl(var(--primary))" />
      </ScatterChart>
    </ChartContainer>
  );
};

const DynamicEfficientFrontierChart = dynamic(() => Promise.resolve(EfficientFrontierChart), {
  ssr: false,
  loading: () => <Skeleton className="h-[350px] w-full" />,
});


// --- Main Page Component ---
export default function EfficientFrontierComponent() {
    const [rho, setRho] = useState(0.2); // Correlation
    const portfolios = useMemo(() => generatePortfolio(0.08, 0.15, 0.12, 0.25, rho), [rho]);

  return (
    <>
      <PageHeader
        title="Efficient Frontier & Sharpe Ratio"
        description="The cornerstone of modern portfolio theory: maximizing return for a given level of risk."
        variant="aligned-left"
      />
      <div className="mx-auto max-w-5xl space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">What is the Efficient Frontier?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-base leading-relaxed text-foreground/90">
            <p>
              The Efficient Frontier, introduced by Harry Markowitz, is a set of optimal portfolios that offer the highest expected return for a defined level of risk or the lowest risk for a given level of expected return. Portfolios that lie below the frontier are sub-optimal because they do not provide enough return for the level of risk. Portfolios above the frontier are impossible to achieve.
            </p>
            <p>
              For a quant, this is the fundamental concept behind portfolio construction. It demonstrates that the benefit of diversification (combining assets with low correlation) can lead to a portfolio with better risk-return characteristics than any single asset alone.
            </p>
          </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle className="font-headline">Sharpe Ratio</CardTitle>
                 <CardDescription>To find the single "best" portfolio on the frontier, we use the Sharpe Ratio.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="rounded-lg border bg-muted/50 p-4 text-center">
                  <BlockMath math="S_p = \frac{R_p - R_f}{\sigma_p}" />
                </div>
                 <ul className="list-disc pl-6 space-y-2 text-sm mt-4">
                    <li><InlineMath math="R_p" /> is the return of the portfolio.</li>
                    <li><InlineMath math="R_f" /> is the risk-free rate.</li>
                    <li><InlineMath math="\sigma_p" /> is the volatility of the portfolio.</li>
                </ul>
                <p className="mt-4">The portfolio with the highest Sharpe Ratio is the one that provides the best return per unit of risk. It's the point on the efficient frontier that is tangent to a line drawn from the risk-free rate (the Capital Allocation Line).</p>
            </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Interactive Two-Asset Frontier</CardTitle>
            <CardDescription>
                Observe how the correlation (<InlineMath math="\rho" />) between two assets changes the shape of the efficient frontier. A lower correlation allows for better diversification.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mx-auto max-w-md mb-6">
                <div className="space-y-3">
                    <Label htmlFor="rho-slider">Correlation (ρ): {rho.toFixed(2)}</Label>
                    <Slider id="rho-slider" min={-1} max={1} step={0.01} value={[rho]} onValueChange={(val) => setRho(val[0])} />
                </div>
            </div>
            
            <DynamicEfficientFrontierChart portfolios={portfolios} />
          </CardContent>
        </Card>
      </div>
    </>
  );
}
