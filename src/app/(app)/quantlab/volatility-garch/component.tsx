
'use client';

import { useState, useMemo } from 'react';
import { PageHeader } from '@/components/app/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { ChartContainer, ChartTooltipContent, Chart } from '@/components/ui/chart';
import { Skeleton } from '@/components/ui/skeleton';
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';

// --- GARCH Simulation Logic ---
const generateGarchProcess = (alpha: number, beta: number, n: number) => {
  const returns = [];
  const volatilities = [];
  let sigma2 = 0.1; // Initial variance
  const omega = 0.02; // Constant term

  for (let i = 0; i < n; i++) {
    const error = Math.sqrt(sigma2) * (Math.sqrt(-2 * Math.log(Math.random())) * Math.cos(2 * Math.PI * Math.random())); // N(0, sigma2)
    returns.push({ time: i, value: error });
    volatilities.push({ time: i, value: Math.sqrt(sigma2) });
    sigma2 = omega + alpha * (error ** 2) + beta * sigma2; // GARCH(1,1) update
  }
  return { returns, volatilities };
};

// --- Chart Component ---
const GarchChart = ({ alpha, beta }: { alpha: number; beta: number }) => {
  const { returns, volatilities } = useMemo(() => generateGarchProcess(alpha, beta, 250), [alpha, beta]);

  return (
    <div className="space-y-8">
      <div>
        <h4 className="font-semibold text-center mb-2">Simulated Asset Returns</h4>
        <ChartContainer config={{}} className="h-[200px] w-full">
          <Chart.ComposedChart data={returns}>
            <Chart.CartesianGrid />
            <Chart.XAxis dataKey="time" />
            <Chart.YAxis domain={['dataMin', 'dataMax']} />
            <Chart.Tooltip content={<ChartTooltipContent formatter={(value) => [Number(value).toFixed(3), "Return"]} />} />
            <Chart.Area type="monotone" dataKey="value" fill="hsl(var(--primary))" fillOpacity={0.5} stroke="hsl(var(--primary))" />
          </Chart.ComposedChart>
        </ChartContainer>
      </div>
      <div>
        <h4 className="font-semibold text-center mb-2">Conditional Volatility (GARCH Model)</h4>
        <ChartContainer config={{}} className="h-[150px] w-full">
          <Chart.LineChart data={volatilities}>
            <Chart.CartesianGrid />
            <Chart.XAxis dataKey="time" />
            <Chart.YAxis domain={['dataMin', 'dataMax']} />
            <Chart.Tooltip content={<ChartTooltipContent formatter={(value) => [Number(value).toFixed(3), "Volatility"]} />} />
            <Chart.Line type="monotone" dataKey="value" stroke="hsl(var(--destructive))" dot={false} />
          </Chart.LineChart>
        </ChartContainer>
      </div>
    </div>
  );
};

// --- Main Page Component ---
export default function GarchComponent() {
    const [alpha, setAlpha] = useState(0.1); // ARCH term
    const [beta, setBeta] = useState(0.85); // GARCH term

  return (
    <>
      <PageHeader
        title="Volatility & GARCH Models"
        description="Modeling the changing volatility of financial returns."
        variant="aligned-left"
      />
      <div className="mx-auto max-w-5xl space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Volatility is Not Constant</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-base leading-relaxed text-foreground/90">
            <p>
              A key observation in financial markets is that volatility is not constant over time. Periods of high volatility (large price swings) tend to be followed by more high volatility, and periods of low volatility tend to be followed by more low volatility. This phenomenon is known as **volatility clustering**.
            </p>
            <p>
              Standard time series models assume constant variance (homoscedasticity), which is a poor fit for financial data. Generalized Autoregressive Conditional Heteroskedasticity (GARCH) models were developed to address this by explicitly modeling the variance as a time-varying process.
            </p>
          </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle className="font-headline">The GARCH(1,1) Model</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="mb-4">
                    The most common GARCH model, GARCH(1,1), models the next period's variance (<InlineMath math="\sigma^2_{t}" />) as a combination of a long-term average variance, the previous period's squared return (the ARCH term), and the previous period's variance (the GARCH term).
                </p>
                 <div className="rounded-lg border bg-muted/50 p-4 text-center">
                  <BlockMath math="\sigma^2_t = \omega + \alpha a^2_{t-1} + \beta\sigma^2_{t-1}" />
                </div>
                 <ul className="list-disc pl-6 space-y-2 text-sm mt-4">
                    <li><InlineMath math="\omega" /> is a constant term.</li>
                    <li><InlineMath math="\alpha" /> (alpha) governs the reaction to past shocks. A large alpha means volatility reacts intensely to market movements.</li>
                    <li><InlineMath math="\beta" /> (beta) governs the persistence of volatility. A large beta means shocks to volatility take a long time to die out.</li>
                </ul>
            </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Interactive GARCH Simulation</CardTitle>
            <CardDescription>
                Adjust the ARCH (<InlineMath math="\alpha" />) and GARCH (<InlineMath math="\beta" />) parameters to see their effect on the simulated returns and the modeled volatility.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
                <div className="space-y-3">
                    <Label htmlFor="alpha-slider">ARCH Term (α): {alpha.toFixed(2)}</Label>
                    <Slider id="alpha-slider" min={0.01} max={0.3} step={0.01} value={[alpha]} onValueChange={(val) => setAlpha(val[0])} />
                </div>
                <div className="space-y-3">
                    <Label htmlFor="beta-slider">GARCH Term (β): {beta.toFixed(2)}</Label>
                    <Slider id="beta-slider" min={0.6} max={0.99} step={0.01} value={[beta]} onValueChange={(val) => setBeta(val[0])} />
                </div>
            </div>
            <GarchComponent alpha={alpha} beta={beta} />
          </CardContent>
        </Card>
      </div>
    </>
  );
}
