
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
import { Area, AreaChart, CartesianGrid, ReferenceLine, XAxis, YAxis, Tooltip } from 'recharts';
import { standardNormalCdf, standardNormalPdf, inverseStandardNormalCdf } from '@/lib/math';

// Generate data for the normal curve visualization
const generateCurveData = (shadeFrom: number | null, shadeTo: number | null) => {
  const data = [];
  const points = 400;
  const range = 8;
  const step = range / points;
  const start = -range / 2;

  for (let i = 0; i <= points; i++) {
    const x = start + i * step;
    const y = standardNormalPdf(x);
    const point: { x: number; y: number; shaded?: number } = { x, y };

    if (shadeFrom !== null && shadeTo !== null && x >= shadeFrom && x <= shadeTo) {
      point.shaded = y;
    }
    data.push(point);
  }
  return data;
};

// Chart Component for Visualization
const ZScoreChart = ({ shadeFrom, shadeTo }: { shadeFrom: number | null, shadeTo: number | null }) => {
  const chartData = useMemo(() => generateCurveData(shadeFrom, shadeTo), [shadeFrom, shadeTo]);

  return (
    <ChartContainer config={{}} className="h-[250px] w-full">
      <AreaChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis type="number" dataKey="x" domain={[-4, 4]} ticks={[-4, -3, -2, -1, 0, 1, 2, 3, 4]} name="Z-Score" />
        <YAxis tick={false} axisLine={false} domain={[0, 0.45]} />
        <Tooltip
          content={<ChartTooltipContent indicator="line" labelFormatter={(value) => `Z: ${Number(value).toFixed(2)}`} formatter={(value, name) => [Number(value).toFixed(4), 'Density']} />}
        />
        <defs>
          <linearGradient id="fillShaded" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8} />
            <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.1} />
          </linearGradient>
        </defs>
        <Area type="monotone" dataKey="y" stroke="hsl(var(--muted-foreground))" fill="hsl(var(--muted-foreground))" fillOpacity={0.2} strokeWidth={1.5} dot={false} name="Normal Curve" />
        <Area type="monotone" dataKey="shaded" stroke="hsl(var(--primary))" fill="url(#fillShaded)" strokeWidth={2} dot={false} name="P-Value Area" />
        {shadeFrom !== null && shadeTo !== null && shadeFrom !== -4 && (
            <ReferenceLine x={shadeFrom} stroke="hsl(var(--primary))" strokeWidth={1.5} label={{ value: `Z = ${shadeFrom.toFixed(2)}`, position: 'top', fill: 'hsl(var(--primary))' }} />
        )}
        {shadeTo !== null && (
          <ReferenceLine x={shadeTo} stroke="hsl(var(--primary))" strokeWidth={1.5} label={{ value: `Z = ${shadeTo.toFixed(2)}`, position: 'top', fill: 'hsl(var(--primary))' }} />
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
const ZTable = () => {
    const header = Array.from({length: 10}, (_, i) => (i/100).toFixed(2));
    const rows = [];
    for(let z = -3.9; z <= 3.9; z += 0.1) {
        const rowData = header.map(h => standardNormalCdf(z + parseFloat(h)).toFixed(4));
        rows.push({ z: z.toFixed(1), values: rowData });
    }

    return (
      <Card>
        <CardHeader>
          <CardTitle>Standard Normal (Z) Table</CardTitle>
          <CardDescription>Area under the curve to the left of Z.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-auto max-h-[400px]">
            <table className="w-full text-center text-xs">
              <thead>
                <tr className="bg-muted">
                  <th className="sticky top-0 p-2 bg-muted">Z</th>
                  {header.map(h => <th key={h} className="sticky top-0 p-2 bg-muted">{h}</th>)}
                </tr>
              </thead>
              <tbody>
                {rows.map(row => (
                  <tr key={row.z} className="border-b">
                    <td className="font-bold p-2 bg-muted sticky left-0">{row.z}</td>
                    {row.values.map((val, i) => <td key={i} className="p-2 tabular-nums">{val}</td>)}
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

  // State for P -> Z
  const [inputPValue, setInputPValue] = useState<number | null>(0.975);
  const [calculatedZ, setCalculatedZ] = useState<number | null>(null);

  // State for Between Z1 and Z2
  const [zScore1, setZScore1] = useState<number | null>(-1.96);
  const [zScore2, setZScore2] = useState<number | null>(1.96);
  const [betweenPValue, setBetweenPValue] = useState<number | null>(null);
  
  useEffect(() => {
    if (zScore !== null && !isNaN(zScore)) {
      setPValue(standardNormalCdf(zScore));
    } else {
        setPValue(null);
    }
  }, [zScore]);

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

  return (
    <>
      <PageHeader
        title="Interactive Z-Table Calculator"
        description="Calculate probabilities from Z-scores and vice-versa, with interactive visualizations."
        variant="aligned-left"
      />
      <div className="mx-auto max-w-6xl space-y-8">
        <Card>
            <CardHeader>
                <CardTitle className="font-headline">The Story of the Z-Score: The Great Equalizer</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-base leading-relaxed text-foreground/90">
                <p>
                    Imagine you have two friends, Alice and Bob. Alice scored an 85 on her finance exam, and Bob scored a 75 on his. Who did better? It seems obvious, but what if Alice's class average was 80 with a standard deviation of 5, while Bob's class average was only 65 with a standard deviation of 10?
                </p>
                <p>
                    This is where the Z-score comes in. It's a tool that lets us compare apples and oranges by translating any data point from any normal distribution onto a single, universal scale called the **Standard Normal Distribution** (which has a mean of 0 and a standard deviation of 1).
                </p>
                <p>The formula is simple: <code className="bg-muted p-1 rounded-md font-mono">Z = (X - μ) / σ</code></p>
                <ul className="list-disc pl-6">
                    <li><code className="font-mono">X</code> is the data point you're interested in (e.g., Alice's score of 85).</li>
                    <li><code className="font-mono">μ</code> (mu) is the mean (average) of the distribution (Alice's class average of 80).</li>
                    <li><code className="font-mono">σ</code> (sigma) is the standard deviation of the distribution (her class's deviation of 5).</li>
                </ul>
                <p>
                    So, Alice's Z-score is (85 - 80) / 5 = +1.0. She is exactly one standard deviation above her class average. Bob's Z-score is (75 - 65) / 10 = +1.0. He is also exactly one standard deviation above his class average.
                </p>
                <p>
                    Suddenly, we see they performed identically relative to their peers! The Z-score tells us **how many standard deviations** a point is from the mean. Once we have this standardized value, we can use the Z-table to find the probability of observing a value that low or high, which is the foundation of hypothesis testing and confidence intervals.
                </p>
            </CardContent>
        </Card>

        <Tabs defaultValue="z-to-p">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="z-to-p">Z → P (Left Tail)</TabsTrigger>
            <TabsTrigger value="p-to-z">P → Z</TabsTrigger>
            <TabsTrigger value="between">Between Z-Scores</TabsTrigger>
          </TabsList>
          
          <TabsContent value="z-to-p" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Z-Score to P-Value Calculator</CardTitle>
                <CardDescription>Find the cumulative probability (area to the left) for a given Z-score.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="z-score">Enter Z-Score</Label>
                    <Input id="z-score" type="number" value={zScore ?? ''} onChange={(e) => setZScore(parseFloat(e.target.value))} placeholder="e.g., 1.96" />
                  </div>
                  <div className="rounded-lg bg-muted p-4 text-center">
                    <p className="text-sm text-muted-foreground">Cumulative Probability (P-Value)</p>
                    <p className="text-3xl font-bold font-mono tracking-tight text-primary">{pValue !== null ? pValue.toFixed(4) : '---'}</p>
                  </div>
                  <p className="text-sm text-muted-foreground">This is the area under the standard normal curve to the left of the specified Z-score. It represents P(Z ≤ z).</p>
                </div>
                <div>
                  <DynamicZScoreChart shadeFrom={-4} shadeTo={zScore} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="p-to-z" className="mt-6">
             <Card>
              <CardHeader>
                <CardTitle>P-Value to Z-Score Calculator</CardTitle>
                <CardDescription>Find the Z-score for a given cumulative probability.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="p-value">Enter Cumulative Probability (0 to 1)</Label>
                    <Input id="p-value" type="number" value={inputPValue ?? ''} onChange={(e) => setInputPValue(parseFloat(e.target.value))} placeholder="e.g., 0.975" step="0.0001" min="0.0001" max="0.9999"/>
                  </div>
                  <div className="rounded-lg bg-muted p-4 text-center">
                    <p className="text-sm text-muted-foreground">Calculated Z-Score</p>
                    <p className="text-3xl font-bold font-mono tracking-tight text-primary">{calculatedZ !== null ? calculatedZ.toFixed(2) : '---'}</p>
                  </div>
                   <p className="text-sm text-muted-foreground">This is the Z-score such that the area to its left under the standard normal curve is equal to the specified probability.</p>
                </div>
                <div>
                   <DynamicZScoreChart shadeFrom={-4} shadeTo={calculatedZ} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="between" className="mt-6">
             <Card>
              <CardHeader>
                <CardTitle>Between Two Z-Scores Calculator</CardTitle>
                <CardDescription>Find the area under the curve between two Z-scores.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="space-y-2 w-full">
                        <Label htmlFor="z-score-1">Z-Score 1</Label>
                        <Input id="z-score-1" type="number" value={zScore1 ?? ''} onChange={(e) => setZScore1(parseFloat(e.target.value))} placeholder="e.g., -1.96" />
                    </div>
                     <div className="space-y-2 w-full">
                        <Label htmlFor="z-score-2">Z-Score 2</Label>
                        <Input id="z-score-2" type="number" value={zScore2 ?? ''} onChange={(e) => setZScore2(parseFloat(e.target.value))} placeholder="e.g., 1.96" />
                    </div>
                  </div>
                  <div className="rounded-lg bg-muted p-4 text-center">
                    <p className="text-sm text-muted-foreground">Area Between Z-Scores</p>
                    <p className="text-3xl font-bold font-mono tracking-tight text-primary">{betweenPValue !== null ? betweenPValue.toFixed(4) : '---'}</p>
                  </div>
                   <p className="text-sm text-muted-foreground">This is the area under the curve between Z-Score 1 and Z-Score 2. This is what you calculate for a confidence interval.</p>
                </div>
                <div>
                   <DynamicZScoreChart shadeFrom={zScore1} shadeTo={zScore2} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        <ZTable />
      </div>
    </>
  );
}
