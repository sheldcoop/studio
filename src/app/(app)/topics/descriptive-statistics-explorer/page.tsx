
'use client';

import React, { useState, useEffect, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { PageHeader } from '@/components/app/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, Label as RechartsLabel } from 'recharts';
import {
  generateNormalData,
  generateLogNormalData,
  getMean,
  getMedian,
  getMode,
  getStdDev,
  getVariance,
  getSkewness,
  getKurtosis,
} from '@/lib/math';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

type DistributionType = 'normal' | 'right-skewed' | 'left-skewed' | 'fat-tailed';

const StatCard = ({ title, value, description }: { title: string; value: string | number, description?: string }) => (
  <Card className="text-center">
    <CardHeader className="pb-2">
      <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <p className="font-headline text-2xl font-bold text-primary">{typeof value === 'number' ? value.toFixed(3) : value}</p>
      {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
    </CardContent>
  </Card>
);

const DistributionChart = ({ data, stats }: { data: number[], stats: Stats | null }) => {
  const histogramData = useMemo(() => {
    if (data.length === 0) return [];
    const min = Math.min(...data);
    const max = Math.max(...data);
    const bins = 40;
    const binWidth = (max - min) / bins;
    const histogram = Array(bins).fill(0).map((_, i) => ({
      x: min + i * binWidth,
      count: 0,
    }));

    data.forEach(d => {
      const binIndex = Math.min(bins - 1, Math.floor((d - min) / binWidth));
      if(histogram[binIndex]) {
        histogram[binIndex].count++;
      }
    });
    return histogram;
  }, [data]);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={histogramData}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="x" tickFormatter={(val) => val.toFixed(1)} />
        <YAxis />
        <Tooltip wrapperClassName="text-xs" />
        <Bar dataKey="count" fill="hsl(var(--primary))" barSize={20} />
        {stats && <ReferenceLine x={stats.mean} stroke="hsl(var(--chart-2))" strokeWidth={2}><RechartsLabel value="Mean" position="top" fill="hsl(var(--chart-2))" fontSize={12} /></ReferenceLine>}
        {stats && <ReferenceLine x={stats.median} stroke="hsl(var(--chart-3))" strokeWidth={2}><RechartsLabel value="Median" position="top" dy={-15} fill="hsl(var(--chart-3))" fontSize={12} /></ReferenceLine>}
        {stats && <ReferenceLine x={stats.mode} stroke="hsl(var(--chart-5))" strokeWidth={2}><RechartsLabel value="Mode" position="top" dy={-30} fill="hsl(var(--chart-5))" fontSize={12} /></ReferenceLine>}
      </BarChart>
    </ResponsiveContainer>
  );
};
const DynamicDistributionChart = dynamic(() => Promise.resolve(DistributionChart), {
  ssr: false,
  loading: () => <Skeleton className="h-[300px] w-full" />,
});


type Stats = {
    mean: number;
    median: number;
    mode: number;
    stdDev: number;
    variance: number;
    range: string;
    skewness: number;
    kurtosis: number;
};

export default function DescriptiveStatisticsPage() {
  const [distribution, setDistribution] = useState<DistributionType>('normal');
  const [data, setData] = useState<number[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);

  const generateData = (type: DistributionType) => {
    let newData: number[] = [];
    const n = 1000;
    switch (type) {
      case 'right-skewed':
        newData = generateLogNormalData(0, 0.6, n);
        break;
      case 'left-skewed':
        newData = generateLogNormalData(0, 0.6, n).map(d => 10 - d);
        break;
      case 'fat-tailed':
        const primaryData = generateNormalData(5, 0.5, Math.floor(n * 0.9));
        const outlierData = generateNormalData(5, 4, Math.ceil(n * 0.1));
        newData = [...primaryData, ...outlierData];
        break;
      case 'normal':
      default:
        newData = generateNormalData(5, 1.5, n);
        break;
    }
    setData(newData);
  };
  
  useEffect(() => {
    generateData(distribution);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [distribution]);

  useEffect(() => {
    if (data.length > 0) {
      const min = Math.min(...data);
      const max = Math.max(...data);
      setStats({
        mean: getMean(data),
        median: getMedian(data),
        mode: getMode(data),
        stdDev: getStdDev(data),
        variance: getVariance(data),
        range: `[${min.toFixed(2)}, ${max.toFixed(2)}]`,
        skewness: getSkewness(data),
        kurtosis: getKurtosis(data),
      });
    }
  }, [data]);

  const getCentralTendencyNote = () => {
    switch (distribution) {
      case 'normal':
        return 'For a symmetric distribution, the Mean, Median, and Mode are all equal.';
      case 'right-skewed':
        return 'For a right-skewed distribution, the Mean is pulled to the right (greater than) the Median.';
      case 'left-skewed':
        return 'For a left-skewed distribution, the Mean is pulled to the left (less than) the Median.';
      default:
        return 'Observe how outliers affect these central measures.';
    }
  }

  return (
    <>
      <PageHeader
        title="Descriptive Statistics Explorer"
        description="Summarize and describe the main features of a dataset with interactive visualizations."
        variant="aligned-left"
      />
      <div className="mx-auto max-w-7xl space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">The Explorer's Lab</CardTitle>
            <CardDescription>
                Choose a data distribution and see how its shape affects the key statistics in real-time.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                <div className="space-y-6">
                    <RadioGroup value={distribution} onValueChange={(val: DistributionType) => setDistribution(val)}>
                        <h4 className="font-medium">1. Choose Distribution</h4>
                        <div className="space-y-2">
                           <div className="flex items-center space-x-2"><RadioGroupItem value="normal" id="normal" /><Label htmlFor="normal">Normal (Bell Curve)</Label></div>
                           <div className="flex items-center space-x-2"><RadioGroupItem value="right-skewed" id="right-skewed" /><Label htmlFor="right-skewed">Right Skewed (e.g. Income)</Label></div>
                           <div className="flex items-center space-x-2"><RadioGroupItem value="left-skewed" id="left-skewed" /><Label htmlFor="left-skewed">Left Skewed (e.g. Grades)</Label></div>
                           <div className="flex items-center space-x-2"><RadioGroupItem value="fat-tailed" id="fat-tailed" /><Label htmlFor="fat-tailed">Fat-Tailed (High Kurtosis)</Label></div>
                        </div>
                    </RadioGroup>
                    <Button onClick={() => generateData(distribution)} className="w-full">
                        2. Generate New Sample
                    </Button>
                </div>
                <div className="lg:col-span-2">
                    <DynamicDistributionChart data={data} stats={stats} />
                </div>
            </div>
             <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
                {stats && (
                    <>
                        <StatCard title="Mean" value={stats.mean} />
                        <StatCard title="Median" value={stats.median} />
                        <StatCard title="Mode" value={stats.mode} />
                        <StatCard title="Std. Deviation (σ)" value={stats.stdDev} />
                        <StatCard title="Variance (σ²)" value={stats.variance} />
                        <StatCard title="Skewness" value={stats.skewness} description={stats.skewness > 0.5 ? 'Right Skew' : stats.skewness < -0.5 ? 'Left Skew' : 'Symmetric'} />
                        <StatCard title="Ex. Kurtosis" value={stats.kurtosis} description={stats.kurtosis > 1 ? 'Fat Tails' : stats.kurtosis < -1 ? 'Thin Tails' : 'Normal Tails'} />
                        <StatCard title="Range" value={stats.range} />
                    </>
                )}
            </div>
          </CardContent>
        </Card>
        
        <Card>
            <CardHeader>
                <CardTitle className="font-headline">Understanding the Stats</CardTitle>
            </CardHeader>
            <CardContent>
                <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="item-1">
                        <AccordionTrigger>Measures of Central Tendency</AccordionTrigger>
                        <AccordionContent className="space-y-4">
                            <div><strong className="text-foreground">Mean:</strong> The average value. Prone to being skewed by outliers.</div>
                            <div><strong className="text-foreground">Median:</strong> The middle value of a dataset. More robust to outliers than the mean.</div>
                            <div><strong className="text-foreground">Mode:</strong> The most frequently occurring value.</div>
                             <div className="border-l-4 border-primary pl-4 text-sm text-muted-foreground">
                                <p className="font-semibold text-foreground/90">Key Insight:</p>
                                <p>{getCentralTendencyNote()}</p>
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-2">
                        <AccordionTrigger>Measures of Variability (Dispersion)</AccordionTrigger>
                        <AccordionContent className="space-y-4">
                             <div><strong className="text-foreground">Range:</strong> The difference between the maximum and minimum values. Simple but sensitive to outliers.</div>
                             <div><strong className="text-foreground">Variance (σ²):</strong> The average of the squared differences from the Mean. Measures how spread out the data is.</div>
                             <div><strong className="text-foreground">Standard Deviation (σ):</strong> The square root of the variance. Provides a measure of dispersion in the original units of the data, making it more interpretable. A low value indicates data points are close to the mean.</div>
                        </AccordionContent>
                    </AccordionItem>
                     <AccordionItem value="item-3">
                        <AccordionTrigger>Measures of Shape</AccordionTrigger>
                        <AccordionContent className="space-y-4">
                             <div><strong className="text-foreground">Skewness:</strong> Measures the asymmetry of the distribution. A positive value indicates a long tail to the right (right-skewed), a negative value a long tail to the left (left-skewed), and a value near zero indicates a symmetric distribution.</div>
                             <div><strong className="text-foreground">Kurtosis:</strong> Measures the "tailedness" of the distribution. High kurtosis (leptokurtic, or a value greater than 0 for excess kurtosis) means "fat tails," indicating a higher probability of extreme outlier events. This is critical in risk management, as normal distributions often underestimate the frequency of market crashes. Low kurtosis (platykurtic, or a value less than 0) means "thin tails."</div>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </CardContent>
        </Card>
      </div>
    </>
  );
}
