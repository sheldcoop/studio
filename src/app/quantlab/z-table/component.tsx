
'use client';

import { useState } from 'react';
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
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowRight, MoveHorizontal } from 'lucide-react';
import { standardNormalCdf, inverseStandardNormalCdf } from '@/lib/math';

export default function ZTablePage() {
  const [zScore, setZScore] = useState<number | string>(1.96);
  const [probability, setProbability] = useState<number | string>(0.975);

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
                <p>This interactive tool replaces the need for static lookup tables, allowing for precise and quick calculations.</p>
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>Z-Table Calculator</CardTitle>
                <CardDescription>Enter a value in either field to calculate the other.</CardDescription>
            </CardHeader>
            <CardContent>
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
