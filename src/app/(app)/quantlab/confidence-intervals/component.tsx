
'use client';

import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/app/page-header';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { inverseStandardNormalCdf } from '@/lib/math';
import { AlertTriangle, Calculator } from 'lucide-react';
import { BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import { cn } from '@/lib/utils';

function ConfidenceIntervalCalculator() {
  const [sampleMean, setSampleMean] = useState(100);
  const [stdDev, setStdDev] = useState(15);
  const [sampleSize, setSampleSize] = useState(30);
  const [confidence, setConfidence] = useState(95);
  const [interval, setInterval] = useState<[string, string] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const calculateInterval = () => {
    setError(null);

    if (sampleSize <= 0 || stdDev < 0) {
      setError('Sample size must be positive and standard deviation cannot be negative.');
      setInterval(null);
      return;
    }

    const alpha = 1 - confidence / 100;
    const zScore = inverseStandardNormalCdf(1 - alpha / 2);
    const standardError = stdDev / Math.sqrt(sampleSize);
    const marginOfError = zScore * standardError;

    const lowerBound = sampleMean - marginOfError;
    const upperBound = sampleMean + marginOfError;

    setInterval([lowerBound.toFixed(3), upperBound.toFixed(3)]);
  };

  useEffect(() => {
    calculateInterval();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sampleMean, stdDev, sampleSize, confidence]);

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="font-headline flex items-center gap-2"><Calculator className="text-primary"/> Interactive Calculator</CardTitle>
          <CardDescription>
            Adjust the parameters to see how they affect the confidence interval in real-time.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="sample-mean">Sample Mean (x̄)</Label>
                <Input
                  id="sample-mean"
                  type="number"
                  value={sampleMean}
                  onChange={(e) => setSampleMean(Number(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="std-dev">Population Standard Deviation (σ)</Label>
                <Input
                  id="std-dev"
                  type="number"
                  value={stdDev}
                  onChange={(e) => setStdDev(Number(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sample-size">Sample Size (n)</Label>
                <Input
                  id="sample-size"
                  type="number"
                  value={sampleSize}
                  onChange={(e) => setSampleSize(Number(e.target.value))}
                />
              </div>
            </div>
            <div className="flex flex-col justify-between">
              <div className="space-y-3">
                <Label>Confidence Level: {confidence}%</Label>
                <Slider
                  min={80}
                  max={99.9}
                  step={0.1}
                  value={[confidence]}
                  onValueChange={(val) => setConfidence(val[0])}
                />
              </div>
               <Button onClick={calculateInterval} className="w-full">Calculate</Button>
               <div className="rounded-lg bg-muted p-4 text-center">
                 <p className="text-sm text-muted-foreground">
                   Calculated {confidence}% Confidence Interval
                 </p>
                 {error ? (
                    <p className="font-mono text-lg font-bold text-destructive">{error}</p>
                 ) : (
                    <p className="font-mono text-2xl font-bold tracking-tight text-primary">
                        {interval ? `[${interval[0]}, ${interval[1]}]` : '---'}
                    </p>
                 )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}

export default function ConfidenceIntervalsComponent() {
  return (
    <>
      <PageHeader
        title="Confidence Intervals"
        description="A practical guide to understanding and calculating the range where a true population mean likely lies."
        variant="aligned-left"
      />
      <div className="mx-auto max-w-5xl space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">What is a Confidence Interval?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-base leading-relaxed text-foreground/90">
            <p>
              It's often impossible to survey an entire population (like every stock in the market). Instead, we take a smaller sample (like the S&P 500) and calculate its mean (average) return.
            </p>
            <p>
              A confidence interval uses this sample mean to construct a range of values and says, "We are X% confident that the true average of the entire population falls within this range." It's a way of putting boundaries on uncertainty.
            </p>
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>A Common Misconception</AlertTitle>
              <AlertDescription>
                A 95% confidence interval does **not** mean there is a 95% probability that the true population mean falls within that specific interval. The true mean is fixed. It either is or isn't in our calculated interval. Instead, it means that if we were to repeat our sampling process many times, 95% of the confidence intervals we construct would contain the true population mean.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
        
        <div className="text-center my-8">
          <h2 className="font-headline text-2xl font-bold">The Formula</h2>
          <div className="rounded-lg border bg-muted/50 p-4 mt-4 space-y-2">
              <BlockMath math="CI = \bar{x} \pm Z \cdot \frac{\sigma}{\sqrt{n}}" />
              <BlockMath math="\text{Standard Error} = \frac{\sigma}{\sqrt{n}}" />
          </div>
        </div>

        <ConfidenceIntervalCalculator />

      </div>
    </>
  );
}
