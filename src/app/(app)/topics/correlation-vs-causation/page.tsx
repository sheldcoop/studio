
'use client';

import { useState, useEffect, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { PageHeader } from '@/components/app/page-header';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Siren, ArrowRight, Lightbulb, Thermometer } from 'lucide-react';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import { Scatter, ScatterChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend as RechartsLegend } from 'recharts';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';

// --- Interactive Chart Component ---

const CorrelationChart = () => {
    const [temperature, setTemperature] = useState(20); // Average temperature in Celsius
    const [chartData, setChartData] = useState<{ x: number; y: number }[]>([]);

    useEffect(() => {
        const generateData = (temp: number) => {
            const n = 50;
            const baseIceCreamSales = 50;
            const baseSharkAttacks = 5;
            const tempEffectOnSales = (temp - 15) * 10;
            const tempEffectOnAttacks = (temp - 15) * 0.5;

            return Array.from({ length: n }, () => {
                const salesNoise = (Math.random() - 0.5) * 40;
                const attackNoise = (Math.random() - 0.5) * 4;

                const iceCreamSales = Math.max(0, baseIceCreamSales + tempEffectOnSales + salesNoise);
                const sharkAttacks = Math.max(0, baseSharkAttacks + tempEffectOnAttacks + attackNoise);
                
                return { x: iceCreamSales, y: sharkAttacks };
            });
        };
        setChartData(generateData(temperature));
    }, [temperature]);

    return (
        <div className="w-full">
            <ChartContainer config={{}} className="h-[350px] w-full">
                <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" dataKey="x" name="Ice Cream Sales" unit=" units" />
                    <YAxis type="number" dataKey="y" name="Shark Attacks" unit=" incidents" />
                    <Tooltip cursor={{ strokeDasharray: '3 3' }} content={<ChartTooltipContent indicator="dot" />} />
                    <RechartsLegend />
                    <Scatter name="Observations" data={chartData} fill="hsl(var(--primary))" opacity={0.7} />
                </ScatterChart>
            </ChartContainer>
            <div className="mx-auto mt-6 max-w-sm space-y-4">
                 <Label htmlFor="temp-slider" className="flex items-center justify-center">
                    <Thermometer className="mr-2 h-5 w-5 text-primary" />
                    Adjust the Lurking Variable (Temperature)
                 </Label>
                 <div className="flex items-center gap-4">
                    <Slider id="temp-slider" min={10} max={35} step={1} value={[temperature]} onValueChange={(val) => setTemperature(val[0])} />
                    <span className="font-mono text-lg w-16 text-center">{temperature}°C</span>
                 </div>
            </div>
        </div>
    )
}

const DynamicCorrelationChart = dynamic(() => Promise.resolve(CorrelationChart), { ssr: false });


export default function CorrelationVsCausationPage() {
  return (
    <>
      <PageHeader
        title="Correlation vs. Causation"
        description="The most important rule in data analysis: just because two things move together, doesn't mean one causes the other."
        variant="aligned-left"
      />
      <div className="mx-auto max-w-5xl space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">The Quant's Golden Rule</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-base leading-relaxed text-foreground/90">
            <p>
              Correlation tells you that two variables tend to move in the same, opposite, or random directions. Causation means that a change in one variable <span className="font-bold text-primary">directly causes</span> a change in another. It's a simple distinction, but confusing them is one of the most common and dangerous mistakes in quantitative analysis and data science.
            </p>
            <p>
              A model built on a spurious (false) correlation may work for a while, but it will fail unpredictably because it hasn't captured a true underlying relationship.
            </p>
          </CardContent>
        </Card>
        
        <Alert variant="destructive" className="bg-destructive/5">
            <Siren className="h-4 w-4" />
            <AlertTitle className="font-headline text-lg">An Interactive Example</AlertTitle>
            <AlertDescription className="mt-2">
                <p className="mb-4">For years, a strong positive correlation was observed between ice cream sales and the number of shark attacks. As one goes up, so does the other. But does eating ice cream cause shark attacks? Of course not.</p>
                <p className="mb-4">Use the slider below to adjust the temperature. Notice how both variables increase as it gets hotter. The temperature is the <strong className="text-foreground">lurking variable</strong> that causes both to rise independently.</p>
                <DynamicCorrelationChart />
            </AlertDescription>
        </Alert>

        <Card>
            <CardHeader>
                <CardTitle className="font-headline">Why This Matters in Finance</CardTitle>
                <CardDescription>Mistaking correlation for causation in finance can be an expensive lesson.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div>
                    <h4 className="font-semibold flex items-center"><ArrowRight className="w-4 h-4 mr-2 text-primary" /> The Hidden Variable (Lurking Variable)</h4>
                    <p className="text-muted-foreground mt-1 pl-6">Just like "warm weather" in our example, a hidden economic factor often drives two seemingly related assets. For example, the prices of luxury cars and high-end watches might be correlated. The lurking variable is <strong className="text-foreground/90">global wealth concentration</strong>. One doesn't cause the other; they are both driven by the same underlying factor.</p>
                </div>
                 <div>
                    <h4 className="font-semibold flex items-center"><ArrowRight className="w-4 h-4 mr-2 text-primary" /> Coincidence (Spurious Correlation)</h4>
                    <p className="text-muted-foreground mt-1 pl-6">With millions of financial time series in the world, some will correlate purely by random chance. A famous example found a strong correlation between the butter production in Bangladesh and the performance of the S&P 500. This is meaningless. Building a trading strategy on this would be financial suicide.</p>
                </div>
                <div>
                    <h4 className="font-semibold flex items-center"><ArrowRight className="w-4 h-4 mr-2 text-primary" /> Reverse Causality</h4>
                    <p className="text-muted-foreground mt-1 pl-6">Sometimes you have the relationship backward. For instance, you might observe that companies that spend more on advertising have higher sales. Does advertising cause higher sales, or do companies with high sales have more money to spend on advertising? The causal link might be the reverse of what you assume.</p>
                </div>
            </CardContent>
        </Card>
        
        <Card className="bg-primary/5 border-primary/20">
             <CardHeader>
                <CardTitle className="font-headline flex items-center"><Lightbulb className="w-5 h-5 mr-2 text-primary" />How to Move from Correlation to Causation</CardTitle>
                <CardDescription>This is one of the hardest problems in statistics, but here are the key approaches.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                 <div className="text-base">
                    <h4 className="font-semibold">1. Controlled Experiments (A/B Testing)</h4>
                    <p className="text-muted-foreground text-sm">The gold standard. By randomly assigning subjects to a control group and a treatment group, you can isolate the effect of a single variable. In finance, this is rare but possible (e.g., testing two different portfolio rebalancing strategies on two identical, isolated pools of capital).</p>
                </div>
                 <div className="text-base">
                    <h4 className="font-semibold">2. Economic Rationale &amp; Domain Knowledge</h4>
                    <p className="text-muted-foreground text-sm">Before you even run a regression, ask: "Is there a plausible economic reason why X would cause Y?" A correlation between oil prices and airline stock prices makes economic sense (fuel is a major cost). A correlation between butter production and the stock market does not. Your domain expertise is your first and best filter.</p>
                </div>
                 <div className="text-base">
                    <h4 className="font-semibold">3. Advanced Econometric Techniques</h4>
                    <p className="text-muted-foreground text-sm">Techniques like Granger Causality, Instrumental Variables, and Difference-in-Differences are designed specifically to probe for causal relationships in observational data where controlled experiments aren't possible. These are advanced tools for the professional quant's toolkit.</p>
                </div>
            </CardContent>
        </Card>
      </div>
    </>
  );
}
