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
import { Calculator, AlertTriangle } from 'lucide-react';

const zScores = {
  '90': 1.645,
  '95': 1.96,
  '99': 2.576,
};

type ResultState = {
  lower: number;
  upper: number;
} | null;

export default function ConfidenceIntervalsPage() {
  const [mean, setMean] = useState(100);
  const [stdDev, setStdDev] = useState(15);
  const [sampleSize, setSampleSize] = useState(30);
  const [confidenceLevel, setConfidenceLevel] =
    useState<keyof typeof zScores>('95');
  const [result, setResult] = useState<ResultState>(null);
  const [error, setError] = useState<string | null>(null);

  const calculateInterval = () => {
    const n = Number(sampleSize);
    const M = Number(mean);
    const s = Number(stdDev);
    const z = zScores[confidenceLevel];

    if (n > 0 && s >= 0 && n % 1 === 0) {
      setError(null);
      const marginOfError = z * (s / Math.sqrt(n));
      const lowerBound = M - marginOfError;
      const upperBound = M + marginOfError;
      setResult({
        lower: parseFloat(lowerBound.toFixed(3)),
        upper: parseFloat(upperBound.toFixed(3)),
      });
    } else {
      setResult(null);
      if (n <= 0 || n % 1 !== 0) {
        setError('Sample size must be a positive integer.');
      } else if (s < 0) {
        setError('Standard deviation cannot be negative.');
      }
    }
  };
  
  useEffect(() => {
    calculateInterval();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <PageHeader
        title="Confidence Intervals"
        description="Understanding the range where a true value likely lies."
      />
      <div className="mx-auto max-w-4xl space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Why Do We Need Them?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-base leading-relaxed text-foreground/90">
            <p>
              In statistics, we rarely know the true parameters (like the mean or standard deviation) of an entire population. It's often impossible to survey every single person or analyze every single stock trade. So, we take a sample.
            </p>
            <p>
              A single number calculated from that sample, like the sample mean, is called a <strong>point estimate</strong>. While it's our best guess, it's almost certainly not the exact true population mean. A confidence interval tackles this uncertainty head-on. Instead of a single number, it gives us a plausible range of values for the true population parameter.
            </p>
             <p>
              For example, instead of just saying "the average stock return was 0.05% today," we might say "we are 95% confident that the true average return for all stocks today was between 0.03% and 0.07%." This is far more informative and honest about our uncertainty.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Interactive Calculator</CardTitle>
            <CardDescription>
              Calculate a confidence interval for a population mean. Adjust the values to see how they affect the interval width. Notice how a larger sample size or lower confidence level leads to a narrower, more precise interval.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-4 rounded-lg border p-6">
              <div>
                <Label htmlFor="mean">Sample Mean (μ)</Label>
                <Input
                  id="mean"
                  type="number"
                  value={mean}
                  onChange={(e) => setMean(Number(e.target.value))}
                />
              </div>
              <div>
                <Label htmlFor="stddev">Standard Deviation (σ)</Label>
                <Input
                  id="stddev"
                  type="number"
                  value={stdDev}
                   min="0"
                  onChange={(e) => setStdDev(Number(e.target.value))}
                />
              </div>
              <div>
                <Label htmlFor="sample-size">Sample Size (n)</Label>
                <Input
                  id="sample-size"
                  type="number"
                  value={sampleSize}
                  min="1"
                  step="1"
                  onChange={(e) => setSampleSize(Number(e.target.value))}
                />
              </div>
              <div>
                <Label htmlFor="confidence">Confidence Level</Label>
                <Select
                  value={confidenceLevel}
                  onValueChange={(val: keyof typeof zScores) =>
                    setConfidenceLevel(val)
                  }
                >
                  <SelectTrigger id="confidence">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="90">90%</SelectItem>
                    <SelectItem value="95">95%</SelectItem>
                    <SelectItem value="99">99%</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={calculateInterval} className="w-full">
                <Calculator className="mr-2" /> Calculate
              </Button>
            </div>
            <div className="flex items-center justify-center rounded-lg bg-muted/50 p-6">
              {result && !error ? (
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">
                    {confidenceLevel}% Confidence Interval
                  </p>
                  <p className="font-headline text-4xl font-bold tracking-tight text-primary">
                    [{result.lower}, {result.upper}]
                  </p>
                  <p className="mt-2 max-w-xs text-sm text-muted-foreground">
                    This means if we were to repeat this sampling process many times, {confidenceLevel}% of the intervals we construct would contain the true, unknown population mean.
                  </p>
                </div>
              ) : (
                <div className="text-center text-destructive">
                   {error ? (
                     <>
                      <AlertTriangle className="mx-auto h-8 w-8" />
                      <p className="mt-2 font-semibold">{error}</p>
                     </>
                   ) : (
                    <p className="text-muted-foreground">
                      Enter your data and click calculate to see the result.
                    </p>
                   )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
