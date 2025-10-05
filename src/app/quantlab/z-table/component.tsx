
'use client';

import { useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { PageHeader } from '@/components/app/page-header';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MoveHorizontal } from 'lucide-react';
import { standardNormalCdf, inverseStandardNormalCdf, standardNormalPdf } from '@/lib/math';
import { Area, AreaChart, CartesianGrid, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { ChartTooltipContent } from '@/components/ui/chart';
import { Skeleton } from '@/components/ui/skeleton';

// --- Chart Component ---
const ZTableChart = ({ zScore }: { zScore: number | null }) => {
    const { chartData, areaData } = useMemo(() => {
        const data = [];
        const area = [];
        const range = 4;
        const points = 200;
        const step = (2 * range) / points;

        for (let i = 0; i <= points; i++) {
            const x = -range + i * step;
            const y = standardNormalPdf(x);
            data.push({ x, y });

            if (zScore !== null && x <= zScore) {
                area.push({ x, y });
            }
        }
        return { chartData: data, areaData: area };
    }, [zScore]);

    return (
        <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="x" type="number" domain={[-4, 4]} tickFormatter={(val) => val.toFixed(1)} />
                <YAxis domain={[0, 0.45]} tickFormatter={(val) => val.toFixed(2)} />
                <Tooltip
                    content={<ChartTooltipContent
                        labelFormatter={(label) => `Z = ${Number(label).toFixed(2)}`}
                        formatter={(value, name) => [Number(value).toFixed(4), name === 'y' ? 'Density' : '']}
                    />}
                />
                
                {/* Main Distribution Curve */}
                <Area type="monotone" dataKey="y" stroke="hsl(var(--muted-foreground))" fill="transparent" strokeWidth={2} dot={false} />
                
                {/* Shaded Area for Probability */}
                {areaData.length > 0 && (
                     <Area 
                        type="monotone" 
                        dataKey="y" 
                        data={areaData} 
                        stroke="hsl(var(--primary))" 
                        fill="hsl(var(--primary))" 
                        fillOpacity={0.3} 
                        strokeWidth={0}
                        dot={false}
                     />
                )}

                {/* Z-Score Line */}
                {zScore !== null && isFinite(zScore) && (
                    <ReferenceLine 
                        x={zScore} 
                        stroke="hsl(var(--primary))" 
                        strokeWidth={2} 
                        label={{ value: `z=${zScore.toFixed(2)}`, position: 'insideTop', fill: 'hsl(var(--primary))' }}
                    />
                )}
            </AreaChart>
        </ResponsiveContainer>
    );
};

const DynamicZTableChart = dynamic(() => Promise.resolve(ZTableChart), {
  ssr: false,
  loading: () => <Skeleton className="h-[300px] w-full" />,
});


export default function ZTableComponent() {
  const [zScore, setZScore] = useState<number | string>(1.96);
  const [probability, setProbability] = useState<number | string>(0.975);

  const numericZScore = useMemo(() => {
    if (typeof zScore === 'string' && zScore !== '' && !isNaN(Number(zScore))) {
        return Number(zScore);
    }
    if (typeof zScore === 'number') {
        return zScore;
    }
    return null;
  }, [zScore]);

  const handleZScoreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setZScore(val);
    if (val !== '' && !isNaN(Number(val))) {
      const p = standardNormalCdf(Number(val));
      setProbability(p.toFixed(5));
    } else {
        setProbability('');
    }
  };

  const handleProbabilityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setProbability(val);
    if (val !== '' && !isNaN(Number(val))) {
      const pNum = Number(val);
      if (pNum > 0 && pNum < 1) {
        const z = inverseStandardNormalCdf(pNum);
        setZScore(z.toFixed(5));
      } else {
          setZScore('');
      }
    } else {
        setZScore('');
    }
  };
  

  return (
    <>
      <PageHeader
        title="Interactive Z-Table Calculator"
        description="Calculate cumulative probabilities from Z-scores and vice-versa, without the lookup tables."
        variant="aligned-left"
      />
      <div className="mx-auto max-w-5xl space-y-8">
        <Card>
            <CardHeader>
                <CardTitle className="font-headline">What is a Z-Table?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-base leading-relaxed">
                <p>A Z-table, also known as the standard normal distribution table, is a mathematical table that allows us to find the probability that a statistic is observed below, above, or between values on the standard normal distribution. A Z-score itself represents how many standard deviations a value is from the mean.</p>
                <p>This interactive tool replaces the need for static lookup tables. The shaded area in the chart below represents the cumulative probability P(Z ≤ z) for the given Z-score.</p>
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>Z-Table Calculator</CardTitle>
                <CardDescription>Enter a value in either field to calculate the other and see it visualized on the chart.</CardDescription>
            </CardHeader>
            <CardContent>
                 <div className="mb-6">
                    <DynamicZTableChart zScore={numericZScore} />
                 </div>
                <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] items-center gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="z-score">Z-Score</Label>
                        <Input 
                            id="z-score" 
                            type="number" 
                            placeholder="e.g., 1.96" 
                            value={zScore}
                            onChange={handleZScoreChange}
                        />
                    </div>
                    <div className="flex justify-center items-center h-full pt-6">
                        <MoveHorizontal className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="probability">Cumulative Probability P(Z &le; z)</Label>
                        <Input 
                            id="probability" 
                            type="number" 
                            placeholder="e.g., 0.975" 
                            step="0.00001"
                            value={probability}
                            onChange={handleProbabilityChange}
                        />
                    </div>
                </div>
            </CardContent>
        </Card>
      </div>
    </>
  );
}
