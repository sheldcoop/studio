
'use client';

import { useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { PageHeader } from '@/components/app/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import { Scatter, ScatterChart, CartesianGrid, XAxis, YAxis, Tooltip, ReferenceLine, Legend, ZAxis } from 'recharts';
import { Skeleton } from '@/components/ui/skeleton';
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';

// --- Math & Simulation Logic ---
const generatePortfolios = (mu1: number, mu2: number, sigma1: number, sigma2: number, rho: number, numPortfolios: number) => {
  const portfolios = [];
  for (let i = 0; i <= numPortfolios; i++) {
    const w1 = i / numPortfolios;
    const w2 = 1 - w1;
    const portfolioReturn = w1 * mu1 + w2 * mu2;
    const portfolioVariance = w1**2 * sigma1**2 + w2**2 * sigma2**2 + 2 * w1 * w2 * rho * sigma1 * sigma2;
    const portfolioStdDev = Math.sqrt(portfolioVariance);
    portfolios.push({ risk: portfolioStdDev, return: portfolioReturn, w1, w2 });
  }
  return portfolios;
};

const findOptimalPortfolio = (portfolios: { risk: number, return: number, w1: number, w2: number }[], riskFreeRate: number) => {
    let maxSharpe = -Infinity;
    let optimalPortfolio = null;

    portfolios.forEach(p => {
        const sharpe = (p.return - riskFreeRate) / p.risk;
        if(sharpe > maxSharpe) {
            maxSharpe = sharpe;
            optimalPortfolio = p;
        }
    });

    return { optimalPortfolio, maxSharpe };
}

// --- Chart Component ---
const EfficientFrontierChart = ({ mu1, mu2, sigma1, sigma2, rho, riskFreeRate }: { mu1: number, mu2: number, sigma1: number, sigma2: number, rho: number, riskFreeRate: number }) => {
  const portfolios = useMemo(() => generatePortfolios(mu1, mu2, sigma1, sigma2, rho, 100), [mu1, mu2, sigma1, sigma2, rho]);
  const { optimalPortfolio, maxSharpe } = useMemo(() => findOptimalPortfolio(portfolios, riskFreeRate), [portfolios, riskFreeRate]);

  return (
    <div>
        <ChartContainer config={{}} className="h-[350px] w-full">
        <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            <CartesianGrid />
            <XAxis type="number" dataKey="risk" name="Risk (Std. Dev.)" unit="%" tickFormatter={(val) => (val * 100).toFixed(0)} domain={[0, 'dataMax']} />
            <YAxis type="number" dataKey="return" name="Expected Return" unit="%" tickFormatter={(val) => (val * 100).toFixed(0)} domain={['dataMin - 0.02', 'dataMax + 0.02']} />
            <ZAxis dataKey="w1" range={[50, 51]} name="Weight Asset 1" unit="" />
            <Tooltip cursor={{ strokeDasharray: '3 3' }} content={
                <ChartTooltipContent
                    labelFormatter={(value, payload) => `Risk: ${(payload[0]?.payload.risk * 100).toFixed(1)}%`}
                    formatter={(value, name, props) => {
                        const { payload } = props;
                        if (name === 'return') return [`${(payload.return * 100).toFixed(1)}%`, 'Return'];
                        if (name === 'w1') return [`${(payload.w1 * 100).toFixed(0)}%`, 'Weight Asset 1'];
                        return [value, name];
                    }}
                />
            } />
            <Legend />
            <Scatter name="Possible Portfolios" data={portfolios} fill="hsl(var(--primary))" shape="circle" />
            {optimalPortfolio && (
                <Scatter name="Optimal (Max Sharpe)" data={[optimalPortfolio]} fill="hsl(var(--destructive))" shape="star" legendType="star" />
            )}
        </ScatterChart>
        </ChartContainer>
        {optimalPortfolio && (
            <div className="mt-4 p-4 bg-muted rounded-lg text-center">
                <h4 className="font-semibold">Optimal Portfolio (Max Sharpe Ratio)</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm mt-2">
                    <div>Return: <span className="font-bold text-primary">{(optimalPortfolio.return * 100).toFixed(1)}%</span></div>
                    <div>Risk: <span className="font-bold text-primary">{(optimalPortfolio.risk * 100).toFixed(1)}%</span></div>
                    <div>Asset 1: <span className="font-bold text-primary">{(optimalPortfolio.w1 * 100).toFixed(0)}%</span></div>
                    <div>Asset 2: <span className="font-bold text-primary">{(optimalPortfolio.w2 * 100).toFixed(0)}%</span></div>
                </div>
                 <div className="mt-2 text-sm">Sharpe Ratio: <span className="font-bold text-primary">{maxSharpe.toFixed(2)}</span></div>
            </div>
        )}
    </div>
  );
};

const DynamicEfficientFrontierChart = dynamic(() => Promise.resolve(EfficientFrontierChart), {
  ssr: false,
  loading: () => <Skeleton className="h-[450px] w-full" />,
});


// --- Main Page Component ---
export default function EfficientFrontierPage() {
    const [rho, setRho] = useState(0.2); // Correlation

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
            <CardTitle className="font-headline">The Art of Diversification</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-base leading-relaxed text-foreground/90">
            <p>
              The Efficient Frontier, pioneered by Harry Markowitz, is a curve that represents the set of "optimal" portfolios. For any given level of risk (standard deviation), a portfolio on the efficient frontier offers the highest possible expected return. Conversely, for any given level of expected return, a portfolio on the frontier offers the lowest possible risk.
            </p>
            <p>
                Any portfolio that lies below the frontier is considered "sub-optimal" because you could achieve a higher return for the same risk, or the same return for lower risk. The power of diversification is visualized here: by combining assets that are not perfectly correlated, we can build a portfolio that has a better risk-return profile than either asset individually.
            </p>
          </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle className="font-headline">Finding the Best: The Sharpe Ratio</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-base leading-relaxed text-foreground/90">
                <p>
                    The Sharpe Ratio measures the risk-adjusted return of an investment. It tells you how much excess return you are getting for each unit of volatility or risk you take on. A higher Sharpe Ratio is better. The portfolio with the highest Sharpe Ratio is called the "tangency portfolio" and is considered the optimal portfolio of risky assets.
                </p>
                <div className="rounded-lg border bg-muted/50 p-4 text-center">
                    <BlockMath math="\text{Sharpe Ratio} = \frac{R_p - R_f}{\sigma_p}" />
                </div>
            </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Interactive Portfolio Builder</CardTitle>
            <CardDescription>
                We have two assets: Asset 1 (Return: 8%, Risk: 12%) and Asset 2 (Return: 15%, Risk: 25%). Adjust the correlation (<InlineMath math="\rho" />) between them to see how it changes the shape of the efficient frontier and the optimal portfolio. Notice how a lower correlation provides greater diversification benefits.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mx-auto max-w-md mb-8">
                <div className="space-y-3">
                    <Label htmlFor="rho-slider">Correlation (ρ): {rho.toFixed(2)}</Label>
                    <Slider id="rho-slider" min={-1} max={1} step={0.01} value={[rho]} onValueChange={(val) => setRho(val[0])} />
                </div>
            </div>
            <DynamicEfficientFrontierChart
                mu1={0.08} sigma1={0.12}
                mu2={0.15} sigma2={0.25}
                rho={rho}
                riskFreeRate={0.02}
            />
          </CardContent>
        </Card>
      </div>
    </>
  );
}

