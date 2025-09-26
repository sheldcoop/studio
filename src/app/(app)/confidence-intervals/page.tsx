'use client';

import { useState, useMemo } from 'react';
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

type ZScoreKey = keyof typeof zScores;

export default function ConfidenceIntervalsPage() {
  const [mean, setMean] = useState('100');
  const [stdDev, setStdDev] = useState('15');
  const [sampleSize, setSampleSize] = useState('30');
  const [confidenceLevel, setConfidenceLevel] = useState<ZScoreKey>('95');
  const [submittedValues, setSubmittedValues] = useState({
    mean: 100,
    stdDev: 15,
    sampleSize: 30,
    confidenceLevel: '95' as ZScoreKey,
  });

  const { result, error } = useMemo(() => {
    const n = Number(submittedValues.sampleSize);
    const M = Number(submittedValues.mean);
    const s = Number(submittedValues.stdDev);

    if (isNaN(n) || isNaN(M) || isNaN(s)) {
      return { result: null, error: 'All inputs must be valid numbers.' };
    }

    if (n <= 0 || s < 0) {
      return {
        result: null,
        error:
          'Sample size must be positive and standard deviation cannot be negative.',
      };
    }

    const z = zScores[submittedValues.confidenceLevel];
    const marginOfError = z * (s / Math.sqrt(n));
    const lowerBound = M - marginOfError;
    const upperBound = M + marginOfError;

    return {
      result: {
        lower: parseFloat(lowerBound.toFixed(3)),
        upper: parseFloat(upperBound.toFixed(3)),
      },
      error: null,
    };
  }, [submittedValues]);

  const handleCalculate = (e?: React.FormEvent) => {
    e?.preventDefault();
    setSubmittedValues({
      mean: Number(mean),
      stdDev: Number(stdDev),
      sampleSize: Number(sampleSize),
      confidenceLevel: confidenceLevel,
    });
  };

  return (
    <>
      <PageHeader
        title="Confidence Intervals"
        description="Understanding the range where a true value likely lies."
        variant="aligned-left"
      />
      <div className="mx-auto max-w-4xl space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">What Are They?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-base leading-relaxed text-foreground/90">
            <p>
              A confidence interval is a range of values, derived from sample
              data, that is likely to contain the value of an unknown population
              parameter. It's a fundamental concept in inferential statistics.
            </p>
            <p>
              Instead of giving a single number as an estimate (a "point
              estimate"), which is almost certainly not exactly correct, we provide a plausible range. For example, instead of saying
              "the average IQ is 100," we might say "we are 95% confident that
              the true average IQ of the population is between 97 and 103." This range is the
              confidence interval. The "95% confidence" means that if we were to take many samples and build a confidence interval from each one, 95% of those intervals would contain the true population mean.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Interactive Calculator</CardTitle>
            <CardDescription>
              Calculate a confidence interval for a population mean. Adjust the values to see how they affect the interval width.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={handleCalculate}
              className="grid grid-cols-1 gap-6 md:grid-cols-2"
            >
              <div className="space-y-4 rounded-lg border p-6">
                <div>
                  <Label htmlFor="mean">Sample Mean (μ)</Label>
                  <Input
                    id="mean"
                    type="number"
                    value={mean}
                    onChange={(e) => setMean(e.target.value)}
                    step="any"
                  />
                </div>
                <div>
                  <Label htmlFor="stddev">Standard Deviation (σ)</Label>
                  <Input
                    id="stddev"
                    type="number"
                    value={stdDev}
                    onChange={(e) => setStdDev(e.target.value)}
                    step="any"
                  />
                </div>
                <div>
                  <Label htmlFor="sample-size">Sample Size (n)</Label>
                  <Input
                    id="sample-size"
                    type="number"
                    value={sampleSize}
                    min="1"
                    onChange={(e) => setSampleSize(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="confidence">Confidence Level</Label>
                  <Select
                    value={confidenceLevel}
                    onValueChange={(val: ZScoreKey) =>
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
                <Button type="submit" className="w-full">
                  <Calculator className="mr-2" /> Calculate
                </Button>
              </div>
              <div className="flex items-center justify-center rounded-lg bg-muted/50 p-6">
                {error ? (
                  <div className="text-center text-destructive">
                    <AlertTriangle className="mx-auto h-8 w-8" />
                    <p className="mt-2 font-semibold">{error}</p>
                  </div>
                ) : result ? (
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">
                      {submittedValues.confidenceLevel}% Confidence Interval
                    </p>
                    <p className="font-headline text-4xl font-bold tracking-tight text-primary">
                      [{result.lower}, {result.upper}]
                    </p>
                    <p className="mt-2 max-w-xs text-sm text-muted-foreground">
                      This means we are {submittedValues.confidenceLevel}% confident that the true
                      population mean lies between {result.lower} and{' '}
                      {result.upper}.
                    </p>
                  </div>
                ) : (
                  <div className="text-center">
                    <p className="text-muted-foreground">
                      Enter your data and click calculate to see the result.
                    </p>
                  </div>
                )}
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

    