
'use client';

import { useState, useEffect, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { PageHeader } from '@/components/app/page-header';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import { Area, AreaChart, CartesianGrid, ReferenceLine, XAxis, YAxis, Tooltip, Label as RechartsLabel } from 'recharts';
import { standardNormalCdf, standardNormalPdf, inverseStandardNormalCdf } from '@/lib/math';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { cn } from '@/lib/utils';
import { ArrowDown, AlertCircle } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

type ZToPType = "left" | "right" | "two-tailed";

// Generate data for the normal curve visualization
const generateCurveData = (shadeFrom: number | null, shadeTo: number | null, zToPType: ZToPType = "left", zScore: number | null | undefined = null) => {
  const data = [];
  const points = 400;
  const range = 8;
  const step = range / points;
  const start = -range / 2;

  for (let i = 0; i <= points; i++) {
    const x = start + i * step;
    const y = standardNormalPdf(x);
    const point: { x: number; y: number; shaded?: number } = { x, y };
    
    if (zToPType === "two-tailed" && zScore != null) {
        const absZ = Math.abs(zScore);
        if (x <= -absZ || x >= absZ) {
            point.shaded = y;
        }
    } else if (shadeFrom !== null && shadeTo !== null && x >= shadeFrom && x <= shadeTo) {
      point.shaded = y;
    }
    data.push(point);
  }
  return data;
};

// Chart Component for Visualization
const ZScoreChart = ({ shadeFrom, shadeTo, zToPType, zScore, zScore1, zScore2 }: { shadeFrom: number | null, shadeTo: number | null, zToPType?: ZToPType, zScore?: number | null, zScore1?: number | null, zScore2?: number | null }) => {
  const chartData = useMemo(() => generateCurveData(shadeFrom, shadeTo, zToPType, zScore), [shadeFrom, shadeTo, zToPType, zScore]);
  const absZScore = typeof zScore === 'number' ? Math.abs(zScore) : null;

  return (
    <ChartContainer config={{}} className="h-[250px] w-full">
      <AreaChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis type="number" dataKey="x" domain={[-4, 4]} ticks={[-4, -3, -2, -1, 0, 1, 2, 3, 4]} name="Z-Score" />
        <YAxis tick={false} axisLine={false} domain={[0, 0.45]} />
        <Tooltip
          content={<ChartTooltipContent indicator="line" labelFormatter={(value: number) => `Z: ${Number(value).toFixed(2)}`} formatter={(value: any) => [Number(value || 0).toFixed(4), 'Density']} />}
        />
        <defs>
          <linearGradient id="fillShaded" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8} />
            <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.1} />
          </linearGradient>
        </defs>
        <Area type="monotone" dataKey="y" stroke="hsl(var(--muted-foreground))" fill="hsl(var(--muted-foreground))" fillOpacity={0.2} strokeWidth={1.5} dot={false} name="Normal Curve" />
        <Area type="monotone" dataKey="shaded" stroke="hsl(var(--primary))" fill="url(#fillShaded)" strokeWidth={2} dot={false} name="P-Value Area" />
        
        {zToPType === 'two-tailed' && absZScore !== null ? (
            <>
                <ReferenceLine x={-absZScore} stroke="hsl(var(--primary))" strokeWidth={1.5} label={{ value: `Z = ${(-absZScore).toFixed(2)}`, position: 'top', fill: 'hsl(var(--primary))' }} />
                <ReferenceLine x={absZScore} stroke="hsl(var(--primary))" strokeWidth={1.5} label={{ value: `Z = ${absZScore.toFixed(2)}`, position: 'top', fill: 'hsl(var(--primary))' }} />
            </>
        ) : typeof zScore === 'number' ? (
            <ReferenceLine x={zScore} stroke="hsl(var(--primary))" strokeWidth={1.5} label={{ value: `Z = ${zScore.toFixed(2)}`, position: 'top', fill: 'hsl(var(--primary))' }} />
        ) : null}

        {typeof zScore1 === 'number' && (
            <ReferenceLine x={zScore1} stroke="hsl(var(--primary))" strokeWidth={1.5} label={{ value: `Z₁ = ${zScore1.toFixed(2)}`, position: 'top', fill: 'hsl(var(--primary))' }} />
        )}
        {typeof zScore2 === 'number' && (
            <ReferenceLine x={zScore2} stroke="hsl(var(--primary))" strokeWidth={1.5} label={{ value: `Z₂ = ${zScore2.toFixed(2)}`, position: 'top', fill: 'hsl(var(--primary))' }} />
        )}

      </AreaChart>
    </ChartContainer>
  );
};
const DynamicZScoreChart = dynamic(() => Promise.resolve(ZScoreChart), {
  ssr: false,
  loading: () => <Skeleton className="h-[250px] w-full" />,
});

// Z-Table Component
const ZTable = ({ highlightedZ }: { highlightedZ: number | null }) => {
    const header = Array.from({length: 10}, (_, i) => (i/100).toFixed(2));
    const rows = [];
    for(let z = -3.9; z <= 3.9; z += 0.1) {
        const rowData = header.map(h => standardNormalCdf(z + parseFloat(h)).toFixed(4));
        rows.push({ z: z.toFixed(1), values: rowData });
    }

    const highlightedRow = highlightedZ !== null ? (Math.round(highlightedZ * 10) / 10).toFixed(1) : null;
    const highlightedCol = highlightedZ !== null && highlightedRow !== null ? Math.abs(Math.round((highlightedZ - parseFloat(highlightedRow)) * 100) / 100).toFixed(2) : null;

    return (
      <Card>
        <CardHeader>
          <CardTitle>Standard Normal (Z) Table</CardTitle>
          <CardDescription>Area under the curve to the left of Z. The table highlights the value closest to your calculated Z-score.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-auto max-h-[400px]">
            <table className="w-full text-center text-xs">
              <thead>
                <tr className="bg-muted">
                  <th className="sticky top-0 p-2 bg-muted z-10">Z</th>
                  {header.map(h => <th key={h} className={cn("sticky top-0 p-2 bg-muted transition-colors", highlightedCol === h && "bg-primary/30")}>{h}</th>)}
                </tr>
              </thead>
              <tbody>
                {rows.map(row => (
                  <tr key={row.z} className={cn("border-b transition-colors", highlightedRow === row.z && "bg-primary/20")}>
                    <td className={cn("font-bold p-2 bg-muted sticky left-0 transition-colors", highlightedRow === row.z && "bg-primary/30 text-primary-foreground")}>{row.z}</td>
                    {row.values.map((val, i) => <td key={i} className={cn("p-2 tabular-nums transition-colors", highlightedRow === row.z && highlightedCol === header[i] && "bg-primary/40 font-bold")}>{val}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    )
}

// Main Page Component
export default function ZTablePage() {
  // State for Z -> P
  const [zScore, setZScore] = useState<number | null>(1.96);
  const [pValue, setPValue] = useState<number | null>(null);
  const [zToPType, setZToPType] = useState<ZToPType>("two-tailed");
  

  // State for P -> Z
  const [inputPValue, setInputPValue] = useState<number | null>(0.975);
  const [calculatedZ, setCalculatedZ] = useState<number | null>(null);

  // State for Between Z1 and Z2
  const [zScore1, setZScore1] = useState<number | null>(-1.96);
  const [zScore2, setZScore2] = useState<number | null>(1.96);
  const [betweenPValue, setBetweenPValue] = useState<number | null>(null);
  
  // Track active tab for highlighting
  const [activeTab, setActiveTab] = useState('z-to-p');

  const handleNumericInput = (setter: React.Dispatch<React.SetStateAction<number | null>>) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setter(isNaN(value) ? null : value);
  };

  const chartParams = useMemo(() => {
    switch (activeTab) {
      case 'z-to-p':
        if (zScore === null) return { shadeFrom: null, shadeTo: null, zScore: null, zScore1: null, zScore2: null, zToPType };
        switch (zToPType) {
          case 'left': return { shadeFrom: -4, shadeTo: zScore, zScore, zScore1: null, zScore2: null, zToPType };
          case 'right': return { shadeFrom: zScore, shadeTo: 4, zScore, zScore1: null, zScore2: null, zToPType };
          case 'two-tailed': return { shadeFrom: null, shadeTo: null, zScore, zScore1: null, zScore2: null, zToPType }; // Special handling in chart
          default: return { shadeFrom: null, shadeTo: null, zScore: null, zScore1: null, zScore2: null, zToPType };
        }
      case 'p-to-z':
        return { shadeFrom: -4, shadeTo: calculatedZ, zScore: calculatedZ, zScore1: null, zScore2: null, zToPType };
      case 'between':
        return { shadeFrom: zScore1, shadeTo: zScore2, zScore: null, zScore1, zScore2, zToPType };
      default:
        return { shadeFrom: null, shadeTo: null, zScore: null, zScore1: null, zScore2: null, zToPType };
    }
  }, [activeTab, zScore, zToPType, calculatedZ, zScore1, zScore2]);
  
  useEffect(() => {
    if (zScore !== null && !isNaN(zScore)) {
      const leftP = standardNormalCdf(zScore);
      switch(zToPType) {
        case 'left':
            setPValue(leftP);
            break;
        case 'right':
            setPValue(1 - leftP);
            break;
        case 'two-tailed':
            const absZ = Math.abs(zScore);
            const p = standardNormalCdf(-absZ);
            setPValue(2 * p);
            break;
      }
    } else {
        setPValue(null);
    }
  }, [zScore, zToPType]);

   useEffect(() => {
    if (inputPValue !== null && !isNaN(inputPValue) && inputPValue > 0 && inputPValue < 1) {
      setCalculatedZ(inverseStandardNormalCdf(inputPValue));
    } else {
        setCalculatedZ(null);
    }
  }, [inputPValue]);

  useEffect(() => {
    if (zScore1 !== null && zScore2 !== null && !isNaN(zScore1) && !isNaN(zScore2)) {
        const p1 = standardNormalCdf(zScore1);
        const p2 = standardNormalCdf(zScore2);
        setBetweenPValue(Math.abs(p2 - p1));
    } else {
        setBetweenPValue(null);
    }
  }, [zScore1, zScore2]);

  const activeZForTable = useMemo(() => {
    switch (activeTab) {
        case 'z-to-p': return zScore;
        case 'p-to-z': return calculatedZ;
        case 'between': return zScore2;
        default: return zScore;
    }
  }, [zScore, calculatedZ, zScore2, activeTab]);

  return (
    <>
      <PageHeader
        title="Interactive Z-Table Calculator"
        description="Calculate probabilities from Z-scores and vice-versa, with interactive visualizations."
        variant="aligned-left"
      />
      <div className="mx-auto max-w-5xl space-y-8">
        <Card>
            <CardHeader>
                <CardTitle className="font-headline">The Story of the Z-Score: The Great Equalizer</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-base leading-relaxed text-foreground/90">
                <p>
                    Imagine you have two friends, Alice and Bob. Alice scored an 85 on her finance exam, and Bob scored a 75 on his. Who did better? It seems obvious, but what if Alice's class average was 80 with a standard deviation of 5, while Bob's class average was only 65 with a standard deviation of 10?
                </p>
                <p>
                    This is where the Z-score comes in. It's a tool that lets us compare apples and oranges by translating any data point from any normal distribution onto a single, universal scale called the <strong>Standard Normal Distribution</strong> (which has a mean of 0 and a standard deviation of 1).
                </p>
            </CardContent>
        </Card>
        
        <Card>
            <CardHeader>
                 <CardTitle className="font-headline">How It Works: The Formula</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="rounded-lg border bg-muted/50 p-4">
                    <p className="font-mono text-center text-lg bg-background p-2 rounded-md mb-4">Z = (X - μ) / σ</p>
                    <ul className="list-disc pl-6 space-y-1">
                        <li><code className="font-mono bg-background px-1 rounded">X</code> is the data point you're interested in (e.g., Alice's score of 85).</li>
                        <li><code className="font-mono bg-background px-1 rounded">μ</code> (mu) is the mean (average) of the distribution (Alice's class average of 80).</li>
                        <li><code className="font-mono bg-background px-1 rounded">σ</code> (sigma) is the standard deviation of the distribution (her class's deviation of 5).</li>
                    </ul>
                </div>
                 <p className="mt-4">
                    Alice's Z-score is (85 - 80) / 5 = <strong>+1.0</strong>. She is exactly one standard deviation above her class average. Bob's Z-score is (75 - 65) / 10 = <strong>+1.0</strong>. He is also exactly one standard deviation above his class average.
                </p>
                <p className="font-semibold text-primary mt-2">
                    Suddenly, we see they performed identically relative to their peers! The Z-score tells us <strong>how many standard deviations</strong> a point is from the mean.
                </p>
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                 <CardTitle className="font-headline">When Can You Use a Z-Score? (The Assumptions)</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 rounded-lg border border-amber-500/50 bg-amber-500/10 p-4 text-amber-700 dark:text-amber-300">
                        <div className="flex items-start gap-3">
                            <AlertCircle className="h-5 w-5 mt-1 flex-shrink-0" />
                            <div>
                                <h4 className="font-semibold">Known Population Standard Deviation (σ)</h4>
                                <p className="text-sm mt-1">A Z-test assumes you know the true standard deviation of the entire population. This is rare in practice, but is often a given in academic problems or with very large, stable historical datasets. If σ is unknown, you should use a T-Test instead, which estimates σ from your sample.</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex-1 rounded-lg border border-amber-500/50 bg-amber-500/10 p-4 text-amber-700 dark:text-amber-300">
                         <div className="flex items-start gap-3">
                            <AlertCircle className="h-5 w-5 mt-1 flex-shrink-0" />
                            <div>
                                <h4 className="font-semibold">Normality or Large Sample Size</h4>
                                <p className="text-sm mt-1">The data should either be drawn from a normally distributed population or the sample size must be large enough (typically n &gt; 30) for the Central Limit Theorem to apply. This theorem guarantees that the distribution of sample means will be approximately normal, even if the original population is not.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>

        <div className="text-center">
            <ArrowDown className="h-8 w-8 mx-auto text-muted-foreground animate-bounce" />
        </div>

        <Card>
            <CardHeader>
                <CardTitle className="font-headline">The Real Power of the Z-Score: Finding Probabilities</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-base leading-relaxed text-foreground/90">
                <p>
                    Knowing a Z-score is great, but its real power comes from using it to find probabilities. Once we have a Z-score, we can determine the probability of observing a value that low, that high, or even more extreme.
                </p>
                <p>
                    This probability is called a <strong>p-value</strong>, and it is the absolute foundation of hypothesis testing. It's the p-value that tells us if an observation (like a stock's return) is statistically significant or just random noise.
                </p>
            </CardContent>
        </Card>
        
        <Card>
            <CardHeader>
                <CardTitle className="font-headline">What Are You Calculating? A Quick Guide</CardTitle>
                <CardDescription>Let's use a number line analogy to make this crystal clear.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Test Type</TableHead>
                            <TableHead>The Question It Asks</TableHead>
                            <TableHead>Visually on the Curve</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <TableRow>
                            <TableCell className="font-semibold text-primary">Right Tail</TableCell>
                            <TableCell>"What is the chance of being greater than this?" (&gt; Z)</TableCell>
                            <TableCell>The area of the far right tail.</TableCell>
                        </TableRow>
                         <TableRow>
                            <TableCell className="font-semibold text-primary">Left Tail</TableCell>
                            <TableCell>"What is the chance of being less than this?" (&lt; Z)</TableCell>
                            <TableCell>The area of the far left tail.</TableCell>
                        </TableRow>
                         <TableRow>
                            <TableCell className="font-semibold text-primary">Two-Tailed</TableCell>
                            <TableCell>"What is the chance of being this extreme or more, in either direction?"</TableCell>
                            <TableCell>The area of BOTH tails combined.</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
                <p className="mt-4 text-sm text-muted-foreground">The area "in between" (what you use for confidence intervals) is the opposite of the two-tailed test. It represents the probability of a result being "normal" or "not extreme."</p>
            </CardContent>
        </Card>


        <Card>
            <CardHeader>
                <CardTitle className="font-headline">The Interactive Sandbox: Z-Score Calculator</CardTitle>
                <CardDescription>
                    Remember Alice's Z-score was +1.0? To find the percentage of students who scored worse than her, use a Z-score of 1.0 and select 'Left Tail'. Try it now!
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="z-to-p" onValueChange={setActiveTab}>
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="z-to-p">Z-Score to P-Value</TabsTrigger>
                        <TabsTrigger value="p-to-z">P-Value to Z-Score</TabsTrigger>
                        <TabsTrigger value="between">Between Z-Scores</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="z-to-p" className="mt-6">
                        <div className="grid gap-6 md:grid-cols-2">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label>Select Area</Label>
                                <RadioGroup value={zToPType} onValueChange={(val: ZToPType) => setZToPType(val)} className="grid grid-cols-3 gap-2">
                                    <div>
                                        <RadioGroupItem value="left" id="left" className="peer sr-only" />
                                        <Label htmlFor="left" className="flex justify-center rounded-md border-2 border-muted bg-popover p-2 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer transition-colors">Left Tail</Label>
                                    </div>
                                    <div>
                                        <RadioGroupItem value="right" id="right" className="peer sr-only" />
                                        <Label htmlFor="right" className="flex justify-center rounded-md border-2 border-muted bg-popover p-2 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer transition-colors">Right Tail</Label>
                                    </div>
                                    <div>
                                        <RadioGroupItem value="two-tailed" id="two-tailed" className="peer sr-only" />
                                        <Label htmlFor="two-tailed" className="flex justify-center rounded-md border-2 border-muted bg-popover p-2 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer transition-colors">Two-Tailed</Label>
                                    </div>
                                </RadioGroup>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="z-score">Enter Z-Score</Label>
                                <Input id="z-score" type="number" value={zScore ?? ''} onChange={handleNumericInput(setZScore)} placeholder="e.g., 1.96" />
                            </div>
                            <div className="rounded-lg bg-muted p-4 text-center">
                                <p className="text-sm text-muted-foreground">Calculated Probability (P-Value)</p>
                                <p className="text-3xl font-bold font-mono tracking-tight text-primary">{pValue !== null ? pValue.toFixed(4) : '---'}</p>
                            </div>
                        </div>
                        <div>
                            <DynamicZScoreChart {...chartParams} />
                        </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="p-to-z" className="mt-6">
                        <div className="grid gap-6 md:grid-cols-2">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="p-value">Enter Cumulative Probability (0 to 1)</Label>
                                <Input id="p-value" type="number" value={inputPValue ?? ''} onChange={handleNumericInput(setInputPValue)} placeholder="e.g., 0.975" step="0.0001" min="0.0001" max="0.9999"/>
                            </div>
                            <div className="rounded-lg bg-muted p-4 text-center">
                                <p className="text-sm text-muted-foreground">Calculated Z-Score</p>
                                <p className="text-3xl font-bold font-mono tracking-tight text-primary">{calculatedZ !== null ? calculatedZ.toFixed(2) : '---'}</p>
                            </div>
                            <p className="text-sm text-muted-foreground">This is the Z-score such that the area to its left under the standard normal curve is equal to the specified probability.</p>
                        </div>
                        <div>
                           <DynamicZScoreChart {...chartParams} />
                        </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="between" className="mt-6">
                        <div className="grid gap-6 md:grid-cols-2">
                        <div className="space-y-4">
                            <div className="flex gap-4">
                                <div className="space-y-2 w-full">
                                    <Label htmlFor="z-score-1">Z-Score 1</Label>
                                    <Input id="z-score-1" type="number" value={zScore1 ?? ''} onChange={handleNumericInput(setZScore1)} placeholder="e.g., -1.96" />
                                </div>
                                <div className="space-y-2 w-full">
                                    <Label htmlFor="z-score-2">Z-Score 2</Label>
                                    <Input id="z-score-2" type="number" value={zScore2 ?? ''} onChange={handleNumericInput(setZScore2)} placeholder="e.g., 1.96" />
                                </div>
                            </div>
                            <div className="rounded-lg bg-muted p-4 text-center">
                                <p className="text-sm text-muted-foreground">Area Between Z-Scores</p>
                                <p className="text-3xl font-bold font-mono tracking-tight text-primary">{betweenPValue !== null ? betweenPValue.toFixed(4) : '---'}</p>
                            </div>
                            <p className="text-sm text-muted-foreground">This is the area under the curve between Z-Score 1 and Z-Score 2. This is what you calculate for a confidence interval.</p>
                        </div>
                        <div>
                            <DynamicZScoreChart {...chartParams} />
                        </div>
                        </div>
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
        
        <Card>
            <CardHeader>
                <CardTitle className="font-headline">Z-Scores in Finance: From Noise to Signal</CardTitle>
                <CardDescription>For a trader, the biggest challenge is separating random market "noise" from a meaningful event. The Z-score is a perfect tool for this, acting like a filter that highlights only the most statistically important moments.</CardDescription>
            </CardHeader>
            <CardContent>
                <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="item-1">
                        <AccordionTrigger>Example 1: Spotting a Truly Unusual Trading Day</AccordionTrigger>
                        <AccordionContent className="space-y-4 pt-2">
                           <p><strong className="text-primary">The Scenario:</strong> You analyze a stock's history and find its average daily return (μ) is +0.1%, with a standard deviation (σ) of 1.5%. This is the stock's "normal" behavior. Today, the company announces a surprise product launch, and the stock shoots up, closing with a return (X) of +5.35%.</p>
                           <p><strong className="text-primary">The Z-Score Solution:</strong> You use the Z-score to measure the "unusualness" of today's return: <code className="font-mono bg-muted p-1 rounded-md">Z = (5.35% - 0.1%) / 1.5% = +3.5</code></p>
                           <p><strong className="text-primary">The Trading Insight:</strong> Today's return was a +3.5 standard deviation event. Enter 3.5 into the calculator above and check the "Right Tail." The probability of a day this strong (or stronger) is minuscule—less than 0.03%!</p>
                           <p>A Z-score of +3.5 is a powerful alert. It tells the trader: "Stop and investigate now." This isn't random noise. It's a signal to dig into the news, re-evaluate financial models, and decide if this event fundamentally changes the stock's value.</p>
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-2">
                        <AccordionTrigger>Example 2: Finding "Overstretched" Stocks for Mean Reversion</AccordionTrigger>
                        <AccordionContent className="space-y-4 pt-2">
                            <p><strong className="text-primary">The Scenario:</strong> You track the price of "Momentum Corp." relative to its 50-day moving average. The average spread (μ) is, by definition, $0, and the standard deviation (σ) of this spread is $3.00. This means the stock normally wiggles within a $3 range of its average.</p>
                            <p><strong className="text-primary">The Question:</strong> After a week of intense social media hype, the stock is trading $9.50 above its 50-day moving average. Is the stock now "overbought" and due for a fall back to its average?</p>
                            <p><strong className="text-primary">The Z-Score Solution:</strong> You calculate the Z-score of this spread: <code className="font-mono bg-muted p-1 rounded-md">Z = ($9.50 - $0) / $3.00 ≈ +3.17</code></p>
                            <p><strong className="text-primary">The Trading Insight:</strong> The stock is currently priced more than +3 standard deviations away from its recent average behavior. In trader's terms, the rubber band is stretched very tight.</p>
                            <p>This Z-score can be a direct, automated trading signal. An algorithm could be programmed with a rule: If Z &gt; +2.0, consider short-selling; if Z &lt; -2.0, consider buying. The Z-score of +3.17 provides a strong, quantitative signal that the stock is in "overbought" territory.</p>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </CardContent>
        </Card>

        <ZTable highlightedZ={activeZForTable} />
      </div>
    </>
  );
}

    