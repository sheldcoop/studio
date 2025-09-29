
'use client';

import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/app/page-header';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Calculator, AlertTriangle, HelpCircle } from 'lucide-react';
import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ReferenceLine,
  XAxis,
  YAxis,
} from 'recharts';

const zScores = {
  '90': 1.645,
  '95': 1.96,
  '99': 2.576,
};

type ResultState = {
  lower: number;
  upper: number;
  marginOfError: number;
} | null;

const generateDistributionData = (
  mean: number,
  stdErr: number,
  lowerBound: number,
  upperBound: number
) => {
  if (stdErr <= 0) return [];

  const data = [];
  const points = 200;
  const range = stdErr * 8;
  const step = range / points;
  const start = mean - range / 2;

  for (let i = 0; i <= points; i++) {
    const x = start + i * step;
    const y =
      (1 / (stdErr * Math.sqrt(2 * Math.PI))) *
      Math.exp(-0.5 * Math.pow((x - mean) / stdErr, 2));

    const point: { x: number; y: number; ci?: number, tail?: number } = { x, y };

    if (x >= lowerBound && x <= upperBound) {
      point.ci = y;
    } else {
      point.tail = y;
    }
    data.push(point);
  }
  return data;
};

const InteractiveChart = ({
  mean,
  stdErr,
  result,
  zScore,
}: {
  mean: number;
  stdErr: number;
  result: ResultState;
  zScore: number;
}) => {
  const chartData = generateDistributionData(
    mean,
    stdErr,
    result?.lower || 0,
    result?.upper || 0
  );
  if (!result || stdErr <= 0) {
    return <Skeleton className="h-[300px] w-full" />;
  }

  return (
    <ChartContainer config={{}} className="h-[350px] w-full">
      <AreaChart data={chartData} margin={{ top: 40, right: 30, left: 0, bottom: 20 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis
          type="number"
          dataKey="x"
          domain={['dataMin', 'dataMax']}
          tickFormatter={(val) => val.toFixed(1)}
          name="Value"
        />
        <YAxis tick={false} axisLine={false} />
        <ChartTooltip
          cursor={{ stroke: 'hsl(var(--primary))', strokeWidth: 1 }}
          content={<ChartTooltipContent indicator="line" />}
        />
        <defs>
            <linearGradient id="fillCI" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.1}/>
            </linearGradient>
            <linearGradient id="fillTail" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--destructive))" stopOpacity={0.6}/>
                <stop offset="95%" stopColor="hsl(var(--destructive))" stopOpacity={0.1}/>
            </linearGradient>
        </defs>
        <Area
          type="monotone"
          dataKey="y"
          stroke="hsl(var(--muted-foreground))"
          fill="hsl(var(--muted-foreground))"
          fillOpacity={0.2}
          strokeWidth={1}
          dot={false}
          name="Sampling Distribution"
        />
        <Area
          type="monotone"
          dataKey="ci"
          stroke="hsl(var(--primary))"
          fill="url(#fillCI)"
          strokeWidth={2}
          dot={false}
          name="Confidence Interval"
        />
         <Area
          type="monotone"
          dataKey="tail"
          stroke="hsl(var(--destructive))"
          fill="url(#fillTail)"
          strokeWidth={1.5}
          dot={false}
          name="Alpha (α) Region"
        />
        <ReferenceLine
          x={mean}
          stroke="hsl(var(--foreground))"
          strokeDasharray="3 3"
        />
         <ReferenceLine x={mean} label={{ value: 'Sample Mean', position: 'top', fill: 'hsl(var(--foreground))', dy: -20 }} />
        <ReferenceLine
          x={result.lower}
          stroke="hsl(var(--primary))"
          strokeDasharray="4 4"
           label={{ value: `Lower: ${result.lower}`, position: 'top', fill: 'hsl(var(--primary))', dy: -5 }}
        />
        <ReferenceLine
          x={result.upper}
          stroke="hsl(var(--primary))"
          strokeDasharray="4 4"
          label={{ value: `Upper: ${result.upper}`, position: 'top', fill: 'hsl(var(--primary))', dy: -5 }}
        />
      </AreaChart>
    </ChartContainer>
  );
};

const DynamicInteractiveChart = dynamic(
  () => Promise.resolve(InteractiveChart),
  { ssr: false, loading: () => <Skeleton className="h-[350px] w-full" /> }
);

export default function ConfidenceIntervalsPage() {
  const [mean, setMean] = useState(100);
  const [stdDev, setStdDev] = useState(15);
  const [sampleSize, setSampleSize] = useState(30);
  const [confidenceLevel, setConfidenceLevel] =
    useState<keyof typeof zScores>('95');
  const [result, setResult] = useState<ResultState>(null);
  const [error, setError] = useState<string | null>(null);

  const stdErr = stdDev > 0 && sampleSize > 0 ? stdDev / Math.sqrt(sampleSize) : 0;

  const calculateInterval = () => {
    const n = Number(sampleSize);
    const M = Number(mean);
    const s = Number(stdDev);
    
    // Prevent calculation if inputs are invalid to avoid unnecessary re-renders
    if (isNaN(n) || isNaN(M) || isNaN(s) || n <= 0 || s < 0 || n % 1 !== 0) {
       setError('Sample size must be a positive integer and standard deviation cannot be negative.');
      setResult(null);
      return;
    }
    
    const z = zScores[confidenceLevel];
    setError(null);
    const marginOfError = z * (s / Math.sqrt(n));
    const lowerBound = M - marginOfError;
    const upperBound = M + marginOfError;
    setResult({
      lower: parseFloat(lowerBound.toFixed(3)),
      upper: parseFloat(upperBound.toFixed(3)),
      marginOfError: parseFloat(marginOfError.toFixed(3)),
    });
  };

  useEffect(() => {
    calculateInterval();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCalculate = () => {
    calculateInterval();
  };

  return (
    <>
      <PageHeader
        title="Confidence Intervals"
        description="Quantify uncertainty and capture the plausible range of a true value."
        variant="aligned-left"
      />
      <div className="mx-auto max-w-6xl space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">The Core Idea: From Guess to Range</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-base leading-relaxed text-foreground/90">
            <p>
              In quantitative analysis, we work with samples, not entire populations. A single sample mean is our best **point estimate**, but it's almost certainly not the exact true population mean. It's just a guess.
            </p>
            <p>
              A **confidence interval** is a profound upgrade from a single guess. It provides an **interval estimate**—a plausible range of values where the true population parameter (like the mean) likely lies, along with a level of confidence in that statement. Instead of saying "the average return was 0.05%," we can say "we are 95% confident the true average return is between 0.03% and 0.07%." This is intellectually honest and far more useful for decision-making under uncertainty.
            </p>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="font-headline">Interactive Calculator & Visualization</CardTitle>
                <CardDescription>
                  Adjust the parameters to see how the sampling distribution and confidence interval change in real-time.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 md:grid-cols-4 mb-6">
                  <div className="space-y-2">
                    <Label htmlFor="mean">Sample Mean (x̄)</Label>
                    <Input id="mean" type="number" value={mean} onChange={(e) => setMean(parseFloat(e.target.value) || 0)}/>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="stddev">Std. Dev (σ)</Label>
                    <Input id="stddev" type="number" value={stdDev} min="0" onChange={(e) => setStdDev(parseFloat(e.target.value) || 0)}/>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sample-size">Sample Size (n)</Label>
                    <Input id="sample-size" type="number" value={sampleSize} min="1" step="1" onChange={(e) => setSampleSize(parseInt(e.target.value, 10) || 0)}/>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confidence">Confidence</Label>
                    <Select value={confidenceLevel} onValueChange={(val: keyof typeof zScores) => setConfidenceLevel(val)}>
                      <SelectTrigger id="confidence"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="90">90%</SelectItem>
                        <SelectItem value="95">95%</SelectItem>
                        <SelectItem value="99">99%</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                 <Button onClick={handleCalculate} className="w-full mb-6">Calculate</Button>
                {result && !error ? (
                  <div className="rounded-lg bg-muted/50 p-4">
                     <DynamicInteractiveChart mean={mean} stdErr={stdErr} result={result} zScore={zScores[confidenceLevel]} />
                     <div className="mt-4 text-center">
                        <p className="text-sm text-muted-foreground">{confidenceLevel}% Confidence Interval</p>
                        <p className="font-headline text-3xl font-bold tracking-tight text-primary">[{result.lower}, {result.upper}]</p>
                        <p className="text-sm text-muted-foreground mt-1">Margin of Error: ±{result.marginOfError}</p>
                     </div>
                  </div>
                ) : (
                   <div className="flex h-[350px] items-center justify-center rounded-lg border border-dashed text-center">
                       {error ? (
                         <div className="text-destructive">
                          <AlertTriangle className="mx-auto h-8 w-8" />
                          <p className="mt-2 font-semibold">{error}</p>
                         </div>
                       ) : (
                        <p className="text-muted-foreground">Enter valid data to see the visualization.</p>
                       )}
                    </div>
                )}
              </CardContent>
            </Card>
          </div>
          <div className="lg:col-span-1 space-y-6">
             <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 font-headline"><HelpCircle className="h-6 w-6 text-primary" /> Key Concepts</CardTitle>
                </CardHeader>
                 <CardContent>
                     <Accordion type="single" collapsible defaultValue="item-1">
                        <AccordionItem value="item-1">
                            <AccordionTrigger>Confidence Level (1-α)</AccordionTrigger>
                            <AccordionContent>The probability that the interval estimation procedure will produce a confidence interval that contains the true population parameter. A 95% confidence level means that if we took 100 different samples and built 100 intervals, about 95 of them would contain the true mean. Alpha (α) is the complement (e.g., α = 0.05 for 95% confidence), representing the probability of error. It's the red-shaded area in the chart's tails.</AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-2">
                            <AccordionTrigger>Z-score</AccordionTrigger>
                            <AccordionContent>A z-score measures how many standard deviations a data point is from the mean. For confidence intervals, the z-score (or t-score for small samples) is the critical value that defines the boundaries of our interval. A 95% confidence level corresponds to a z-score of 1.96 because 95% of the area of a normal distribution lies within ±1.96 standard deviations of the mean.</AccordionContent>
                        </AccordionItem>
                         <AccordionItem value="item-3">
                            <AccordionTrigger>Margin of Error</AccordionTrigger>
                            <AccordionContent>The "radius" of your confidence interval. It's the value you add to and subtract from your sample mean to get the upper and lower bounds. It is calculated as: (Critical Value) × (Standard Error). A smaller margin of error means a more precise estimate.</AccordionContent>
                        </AccordionItem>
                     </Accordion>
                 </CardContent>
             </Card>
             <Card>
                <CardHeader>
                    <CardTitle className="font-headline">Assumptions & Pitfalls</CardTitle>
                </CardHeader>
                 <CardContent className="space-y-4 text-sm">
                    <div>
                        <h4 className="font-semibold text-primary">Assumptions</h4>
                        <ul className="mt-2 list-disc space-y-1 pl-5 text-muted-foreground">
                            <li>The sample was selected randomly.</li>
                            <li>The sample data is normally distributed (or the sample size is large enough for the CLT to apply, n > 30).</li>
                            <li>The population standard deviation is known (for a Z-interval) or the sample standard deviation is used (for a T-interval).</li>
                        </ul>
                    </div>
                     <div>
                        <h4 className="font-semibold text-destructive">Common Pitfalls</h4>
                        <ul className="mt-2 list-disc space-y-1 pl-5 text-muted-foreground">
                            <li><strong className="text-foreground/90">Wrong Interpretation:</strong> A 95% CI does NOT mean there is a 95% probability that the true population mean falls within *this specific* interval. The true mean is fixed. The interval is what's random.</li>
                            <li><strong className="text-foreground/90">Overlapping Intervals:</strong> Two confidence intervals that overlap do not necessarily mean their means are not statistically different. A formal hypothesis test is required.</li>
                        </ul>
                    </div>
                 </CardContent>
             </Card>
          </div>
        </div>
      </div>
    </>
  );
}

    