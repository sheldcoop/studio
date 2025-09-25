'use client';

import { useState } from 'react';
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
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Calculator } from 'lucide-react';

const zScores = {
  '90': 1.645,
  '95': 1.96,
  '99': 2.576,
};

export default function ConfidenceIntervalsPage() {
  const [mean, setMean] = useState(100);
  const [stdDev, setStdDev] = useState(15);
  const [sampleSize, setSampleSize] = useState(30);
  const [confidenceLevel, setConfidenceLevel] =
    useState<keyof typeof zScores>('95');
  const [result, setResult] = useState<{ lower: number; upper: number } | null>(
    null
  );

  const calculateInterval = () => {
    const n = Number(sampleSize);
    const M = Number(mean);
    const s = Number(stdDev);
    const z = zScores[confidenceLevel];

    if (n > 0 && s >= 0) {
      const marginOfError = z * (s / Math.sqrt(n));
      const lowerBound = M - marginOfError;
      const upperBound = M + marginOfError;
      setResult({
        lower: parseFloat(lowerBound.toFixed(3)),
        upper: parseFloat(upperBound.toFixed(3)),
      });
    } else {
      setResult(null);
    }
  };

  return (
    <div>
      <PageHeader
        title="Confidence Intervals"
        description="Understanding the range where a true value likely lies."
      />
      <div className="mx-auto max-w-4xl space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>What Are They?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              A confidence interval is a range of values, derived from sample
              data, that is likely to contain the value of an unknown population
              parameter.
            </p>
            <p>
              Instead of giving a single number as an estimate (a "point
              estimate"), we provide a range. For example, instead of saying
              "the average IQ is 100," we might say "we are 95% confident that
              the average IQ is between 97 and 103." This range is the
              confidence interval.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Interactive Calculator</CardTitle>
            <CardDescription>
              Calculate a confidence interval for a population mean.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-4">
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
                  onChange={(e) => setStdDev(Number(e.target.value))}
                />
              </div>
              <div>
                <Label htmlFor="sample-size">Sample Size (n)</Label>
                <Input
                  id="sample-size"
                  type="number"
                  value={sampleSize}
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
              {result ? (
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">
                    {confidenceLevel}% Confidence Interval
                  </p>
                  <p className="text-3xl font-bold tracking-tight">
                    [{result.lower}, {result.upper}]
                  </p>
                  <p className="mt-2 max-w-xs text-sm text-muted-foreground">
                    This means we are {confidenceLevel}% confident that the true
                    population mean lies between {result.lower} and{' '}
                    {result.upper}.
                  </p>
                </div>
              ) : (
                <p className="text-center text-muted-foreground">
                  Enter your data and click calculate to see the result.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
