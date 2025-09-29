
'use client';

import { useState, useEffect } from 'react';
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
import { ChartContainer } from '@/components/ui/chart';
import { Area, AreaChart, ReferenceLine, XAxis, YAxis, Tooltip } from 'recharts';
import { standardNormalPdf, inverseStandardNormalCdf } from '@/lib/math';

// Generate data for two overlapping normal curves
const generateDistributionData = (mean1: number, mean2: number, stdDev: number) => {
  const data = [];
  const points = 200;
  const range = stdDev * 8;
  const step = range / (points);
  const start = Math.min(mean1, mean2) - range / 2;

  for (let i = 0; i <= points; i++) {
    const x = start + i * step;
    data.push({
      x,
      nullHypothesis: standardNormalPdf((x - mean1) / stdDev),
      altHypothesis: standardNormalPdf((x - mean2) / stdDev),
    });
  }
  return data;
};

const ErrorChart = () => {
    const [alpha, setAlpha] = useState(0.05); // Significance level
    const [separation, setSeparation] = useState(2.5); // Separation between hypotheses

    const meanH0 = 0;
    const stdDev = 1;
    const meanH1 = separation;

    const criticalValue = inverseStandardNormalCdf(1 - alpha);
    
    // Calculate Beta
    const beta = standardNormalCdf((criticalValue - meanH1) / stdDev);

    const chartData = generateDistributionData(meanH0, meanH1, stdDev).map(d => {
        let alphaArea, betaArea;
        if (d.x >= criticalValue) {
            alphaArea = d.nullHypothesis;
        }
        if (d.x < criticalValue) {
            betaArea = d.altHypothesis;
        }
        return { ...d, alphaArea, betaArea };
    });

    return (
        <div className="w-full">
            <ChartContainer config={{}} className="h-[350px] w-full">
                 <AreaChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                    <defs>
                        <linearGradient id="fillAlpha" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="hsl(var(--destructive))" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="hsl(var(--destructive))" stopOpacity={0.1}/>
                        </linearGradient>
                         <linearGradient id="fillBeta" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="hsl(var(--chart-4))" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="hsl(var(--chart-4))" stopOpacity={0.1}/>
                        </linearGradient>
                    </defs>
                    <XAxis dataKey="x" type="number" domain={[-4, 8]} tickFormatter={(val) => val.toFixed(1)} />
                    <YAxis tick={false} axisLine={false} />
                    <Tooltip 
                        labelFormatter={(value) => `Value: ${Number(value).toFixed(2)}`}
                        formatter={(value, name) => [Number(value).toFixed(4), name === 'nullHypothesis' ? 'H₀ Density' : 'H₁ Density']}
                    />
                    <Area type="monotone" dataKey="nullHypothesis" stroke="hsl(var(--muted-foreground))" fill="transparent" strokeWidth={2} name="H₀ (No Effect)" dot={false} />
                    <Area type="monotone" dataKey="altHypothesis" stroke="hsl(var(--chart-2))" fill="transparent" strokeWidth={2} name="H₁ (Real Effect)" dot={false} />
                    <Area type="monotone" dataKey="alphaArea" stroke="hsl(var(--destructive))" fill="url(#fillAlpha)" name="α (Type I Error)" dot={false} />
                    <Area type="monotone" dataKey="betaArea" stroke="hsl(var(--chart-4))" fill="url(#fillBeta)" name="β (Type II Error)" dot={false} />

                    <ReferenceLine x={criticalValue} stroke="hsl(var(--foreground))" strokeDasharray="3 3" strokeWidth={2}>
                        <Label value="Decision Boundary" position="top" fill="hsl(var(--foreground))" dy={-10} />
                    </ReferenceLine>
                </AreaChart>
            </ChartContainer>

            <div className="mx-auto mt-6 grid max-w-4xl grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-3">
                    <Label htmlFor="alpha-slider">Significance Level (α): {alpha.toFixed(2)}</Label>
                    <Slider id="alpha-slider" min={0.01} max={0.20} step={0.01} value={[alpha]} onValueChange={(val) => setAlpha(val[0])} />
                    <p className="text-xs text-muted-foreground">Lowering α (moving the boundary right) makes it harder to reject H₀, which decreases Type I errors but increases Type II errors.</p>
                </div>
                 <div className="space-y-3">
                    <Label htmlFor="separation-slider">Effect Size (Separation): {separation.toFixed(1)}</Label>
                    <Slider id="separation-slider" min={0.5} max={5} step={0.1} value={[separation]} onValueChange={(val) => setSeparation(val[0])} />
                     <p className="text-xs text-muted-foreground">A larger effect size (more separation) makes the distributions easier to distinguish, reducing Type II errors.</p>
                </div>
            </div>
             <div className="mt-6 grid grid-cols-2 gap-4 text-center">
                 <div className="rounded-lg bg-destructive/10 p-3">
                    <p className="text-sm font-medium text-destructive">Type I Error (α)</p>
                    <p className="font-headline text-2xl font-bold text-destructive">{(alpha * 100).toFixed(1)}%</p>
                 </div>
                 <div className="rounded-lg bg-yellow-500/10 p-3">
                    <p className="text-sm font-medium text-yellow-600 dark:text-yellow-400">Type II Error (β)</p>
                    <p className="font-headline text-2xl font-bold text-yellow-600 dark:text-yellow-400">{(beta * 100).toFixed(1)}%</p>
                 </div>
             </div>
        </div>
    );
}

const DynamicErrorChart = dynamic(() => Promise.resolve(ErrorChart), { ssr: false });

export default function TypeIAndIIErrorsPage() {
  return (
    <>
      <PageHeader
        title="Type I and Type II Errors"
        description="Understanding the trade-off between false alarms and missed opportunities in statistical testing."
        variant="aligned-left"
      />
      <div className="mx-auto max-w-5xl space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">The Trader's Dilemma: Noise or Signal?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-base leading-relaxed text-foreground/90">
            <p>
              In trading and quantitative finance, every decision is a judgment call under uncertainty. When you test a new trading strategy, you're asking a fundamental question: "Does this strategy actually have an edge, or did it just get lucky?" Hypothesis testing gives us a framework to answer this, but it's never foolproof. There's always a risk of making the wrong call.
            </p>
            <p>
              These potential mistakes are categorized into two types, and understanding them is critical for risk management and strategy evaluation.
            </p>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <Card className="border-destructive/50 bg-destructive/5">
                <CardHeader>
                    <CardTitle className="text-destructive">Type I Error (α): The False Alarm</CardTitle>
                    <CardDescription>Also known as a "False Positive."</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="mb-4">This is when you <strong className="text-destructive-foreground/90">incorrectly reject the null hypothesis</strong>. You conclude there is an effect when, in reality, there isn't one.</p>
                    <p><strong className="font-semibold text-foreground">Trading Analogy:</strong> You test a new trading strategy and your results are statistically significant (e.g., p-value &lt; 0.05). You conclude the strategy has a real profitable edge (rejecting the null hypothesis that it has no edge). You deploy it with real capital, but it proceeds to lose money. You mistook random market noise for a genuine signal. You had a false alarm.</p>
                </CardContent>
            </Card>
             <Card className="border-yellow-500/50 bg-yellow-500/5">
                <CardHeader>
                    <CardTitle className="text-yellow-600 dark:text-yellow-400">Type II Error (β): The Missed Opportunity</CardTitle>
                    <CardDescription>Also known as a "False Negative."</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="mb-4">This is when you <strong className="text-yellow-700 dark:text-yellow-300">incorrectly fail to reject the null hypothesis</strong>. You conclude there is no effect when, in reality, there is one.</p>
                     <p><strong className="font-semibold text-foreground">Trading Analogy:</strong> You backtest a new strategy, and the results are not statistically significant. You conclude the strategy has no edge (failing to reject the null). You shelve the idea. In reality, the strategy did have a small but consistent edge, but your test wasn't powerful enough to detect it. You missed a real opportunity.</p>
                </CardContent>
            </Card>
        </div>

        <Card>
            <CardHeader>
                <CardTitle className="font-headline">The Inescapable Trade-Off</CardTitle>
                 <CardDescription>Adjust the sliders to see how α and β are inversely related.</CardDescription>
            </CardHeader>
            <CardContent>
                <p className="mb-6 text-muted-foreground">The chart below visualizes two distributions. The gray curve (H₀) represents a world where your strategy has no effect. The green curve (H₁) represents a world where it has a real, positive effect. The vertical line is your decision boundary. Any result to the right of it, you conclude there's an effect. But notice how the curves overlap—this is where errors happen.</p>
                <DynamicErrorChart />
            </CardContent>
        </Card>
      </div>
    </>
  );
}
