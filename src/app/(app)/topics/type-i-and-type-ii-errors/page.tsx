
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
import { ChartContainer, type ChartConfig } from '@/components/ui/chart';

const ComposedChart = dynamic(() => import('recharts').then(mod => mod.ComposedChart), { ssr: false });
const Area = dynamic(() => import('recharts').then(mod => mod.Area), { ssr: false });
const Line = dynamic(() => import('recharts').then(mod => mod.Line), { ssr: false });
const XAxis = dynamic(() => import('recharts').then(mod => mod.XAxis), { ssr: false });
const YAxis = dynamic(() => import('recharts').then(mod => mod.YAxis), { ssr: false });
const Tooltip = dynamic(() => import('recharts').then(mod => mod.Tooltip), { ssr: false });
const ReferenceLine = dynamic(() => import('recharts').then(mod => mod.ReferenceLine), { ssr: false });


// --- Math & Chart Helpers ---

const normalPDF = (x: number, mean: number, stdDev: number) => {
  return (
    (1 / (stdDev * Math.sqrt(2 * Math.PI))) *
    Math.exp(-0.5 * ((x - mean) / stdDev) ** 2)
  );
};

const chartConfig = {
  null: { label: 'Null Hypothesis (H₀)', color: 'hsl(var(--chart-2))' },
  alt: { label: 'Alternative Hypothesis (H₁)', color: 'hsl(var(--chart-1))' },
  typeI: { label: 'Type I Error (α)', color: 'hsl(var(--destructive))' },
  typeII: { label: 'Type II Error (β)', color: 'hsl(var(--chart-4))' },
} satisfies ChartConfig;

const ErrorChart = () => {
  const [alpha, setAlpha] = useState(0.05);
  const [chartData, setChartData] = useState<any[]>([]);

  const meanH0 = 100; // Old strategy avg return
  const meanH1 = 105; // New strategy avg return
  const stdDev = 5;

  useEffect(() => {
    const data = [];
    // Find the critical value for the decision threshold
    // This is the point on the H0 distribution where the area to the right is `alpha`
    // We approximate this using a standard Z-score lookup
    const zScore = 1.645; // for alpha ~0.05 on one-tailed test
    const criticalValue = meanH0 + zScore * stdDev;

    // Based on the slider, we set a new critical value
    // This isn't a perfect z-score mapping, but it's effective for visualization
    const sliderCriticalValue = meanH0 + (3 - (alpha / 0.1) * 3) * stdDev;


    let typeIProb = 0;
    let typeIIProb = 0;
    const step = 0.2;

    for (let x = 80; x <= 125; x += step) {
      const h0 = normalPDF(x, meanH0, stdDev);
      const h1 = normalPDF(x, meanH1, stdDev);
      let areaTypeI = 0;
      let areaTypeII = 0;

      if (x >= sliderCriticalValue) {
        areaTypeI = h0; // Shade area under H0, right of the line
        typeIProb += h0 * step;
      }
      if (x < sliderCriticalValue) {
        areaTypeII = h1; // Shade area under H1, left of the line
        typeIIProb += h1 * step;
      }

      data.push({ x, h0, h1, areaTypeI, areaTypeII });
    }

    setChartData(data);
  }, [alpha, meanH0, stdDev, meanH1]);
  
  const criticalValue = meanH0 + (3 - (alpha / 0.1) * 3) * stdDev;
  const typeIError = chartData.reduce((acc, d) => acc + d.areaTypeI * 0.2, 0) * 100;
  const typeIIError = chartData.reduce((acc, d) => acc + d.areaTypeII * 0.2, 0) * 100;


  return (
    <>
      <ChartContainer config={chartConfig} className="h-80 w-full">
        <ComposedChart data={chartData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
          <defs>
            <linearGradient id="fillTypeI" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--color-typeI)" stopOpacity={0.8} />
              <stop offset="95%" stopColor="var(--color-typeI)" stopOpacity={0.1} />
            </linearGradient>
            <linearGradient id="fillTypeII" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--color-typeII)" stopOpacity={0.8} />
              <stop offset="95%" stopColor="var(--color-typeII)" stopOpacity={0.1} />
            </linearGradient>
          </defs>
          <XAxis dataKey="x" type="number" unit="$" domain={[80, 125]} />
          <YAxis domain={[0, 'dataMax']} tick={false} axisLine={false} />
          <Tooltip contentStyle={{ display: 'none' }} />
          <Area type="monotone" dataKey="areaTypeI" stroke={0} fill="url(#fillTypeI)" />
          <Area type="monotone" dataKey="areaTypeII" stroke={0} fill="url(#fillTypeII)" />
          <Line dataKey="h0" stroke="var(--color-null)" strokeWidth={2} dot={false} name="H₀" />
          <Line dataKey="h1" stroke="var(--color-alt)" strokeWidth={2} dot={false} name="H₁" />
          <ReferenceLine x={criticalValue} stroke="hsl(var(--foreground))" strokeDasharray="3 3">
             <Label value="Decision Threshold" position="insideTop" dy={-10} />
          </ReferenceLine>
        </ComposedChart>
      </ChartContainer>
      <div className="mx-auto max-w-sm py-4">
        <Label htmlFor="alpha-slider" className="text-center block">
          Adjust Decision Threshold (Lower is Stricter)
        </Label>
        <Slider
          id="alpha-slider"
          min={0.01}
          max={0.2}
          step={0.01}
          value={[alpha]}
          onValueChange={(val) => setAlpha(val[0])}
          className="my-4"
        />
      </div>
      <div className="grid grid-cols-2 gap-4 text-center">
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Type I Error (α) Rate</p>
          <p className="font-bold text-2xl text-destructive">{typeIError.toFixed(1)}%</p>
          <p className="text-xs text-muted-foreground">Wrongly finding an effect.</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Type II Error (β) Rate</p>
          <p className="font-bold text-2xl text-yellow-500">{typeIIError.toFixed(1)}%</p>
          <p className="text-xs text-muted-foreground">Failing to find a real effect.</p>
        </Card>
      </div>
    </>
  );
};


export default function TypeErrorsPage() {
  return (
    <>
      <PageHeader
        title="The Balancing Act: Type I vs. Type II Errors"
        description="Understanding the fundamental trade-off in hypothesis testing."
        variant="aligned-left"
      />
      <div className="mx-auto max-w-5xl space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">The Core Idea</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-base leading-relaxed text-foreground/90">
            <p>
              In quantitative finance, we're always making decisions under uncertainty. Did our new trading strategy actually beat the old one, or was it just luck? Hypothesis testing gives us a framework for this, but it's not perfect. There are two ways we can be wrong.
            </p>
            <ul className="list-disc space-y-2 pl-5">
              <li>
                <strong className="text-destructive">Type I Error (False Positive):</strong> This is when we <strong className="text-destructive">reject the null hypothesis when it's actually true</strong>. In our example, this means concluding our new strategy is better, shipping it to production, and then realizing it was just random noise. We found an effect that wasn't there.
              </li>
              <li>
                <strong className="text-yellow-500">Type II Error (False Negative):</strong> This is when we <strong className="text-yellow-500">fail to reject the null hypothesis when it's false</strong>. This means our new strategy genuinely IS better, but our test wasn't sensitive enough to detect it. We missed a real opportunity to improve.
              </li>
            </ul>
             <p>
              The crucial point is the **trade-off**. Lowering the risk of a Type I error (by setting a stricter decision threshold) inherently increases the risk of a Type II error, and vice versa. Your job as a quant is to decide which error is more costly for your specific situation.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Interactive Visualization</CardTitle>
            <CardDescription>
                Here, the blue curve represents the distribution of returns for an old strategy (H₀), and the green curve is a new, potentially better strategy (H₁). Use the slider to move the decision threshold and see how the probabilities of each error type change.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ErrorChart />
          </CardContent>
        </Card>
      </div>
    </>
  );
}

    