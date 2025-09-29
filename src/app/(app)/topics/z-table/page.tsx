
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
const generateCurveData = (shadeUntil: number | null) => {
  const data = [];
  const points = 400;
  const range = 8;
  const step = range / points;
  const start = -range / 2;

  for (let i = 0; i <= points; i++) {
    const x = start + i * step;
    const y = standardNormalPdf(x);
    const point: { x: number; y: number; shaded?: number } = { x, y };

    if (shadeUntil !== null && x <= shadeUntil) {
      point.shaded = y;
    }
    data.push(point);
  }
  return data;
};

// Chart Component for Visualization
const ZScoreChart = ({ shadeUntil }: { shadeUntil: number | null }) => {
  const chartData = useMemo(() => generateCurveData(shadeUntil), [shadeUntil]);

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
        {shadeUntil !== null && (
          <ReferenceLine x={shadeUntil} stroke="hsl(var(--primary))" strokeWidth={2} label={{ value: `Z = ${shadeUntil.toFixed(2)}`, position: 'top', fill: 'hsl(var(--primary))' }} />
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
    for(let z = 0.0; z <= 3.9; z += 0.1) {
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
  const [zScore, setZScore] = useState<number | null>(1.96);
  const [pValue, setPValue] = useState<number | null>(null);

  const [inputPValue, setInputPValue] = useState<number | null>(0.975);
  const [calculatedZ, setCalculatedZ] = useState<number | null>(null);
  
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

  return (
    <>
      <PageHeader
        title="Interactive Z-Table Calculator"
        description="Calculate probabilities from Z-scores and vice-versa, with interactive visualizations."
        variant="aligned-left"
      />
      <div className="mx-auto max-w-6xl space-y-8">
        <Tabs defaultValue="z-to-p">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="z-to-p">Z-Score to P-Value</TabsTrigger>
            <TabsTrigger value="p-to-z">P-Value to Z-Score</TabsTrigger>
          </TabsList>
          
          <TabsContent value="z-to-p" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Z-Score to P-Value Calculator</CardTitle>
                <CardDescription>Find the cumulative probability for a given Z-score.</CardDescription>
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
                  <DynamicZScoreChart shadeUntil={zScore} />
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
                   <DynamicZScoreChart shadeUntil={calculatedZ} />
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

    