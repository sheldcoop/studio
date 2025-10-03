
'use client';

import { useState, useEffect, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { PageHeader } from '@/components/app/page-header';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, ReferenceLine, Label } from 'recharts';
import { Skeleton } from '@/components/ui/skeleton';
import { generateNormalData, generateLogNormalData, getMean, getMedian, getMode, getStdDev, getSkewness, getKurtosis } from '@/lib/math';
import 'katex/dist/katex.min.css';

type DistributionType = 'normal' | 'skewed-right' | 'skewed-left';

// --- Chart Component ---
const DescriptiveStatsChart = ({ data }: { data: number[] }) => {
  const { histogramData, mean, median, mode } = useMemo(() => {
    if (data.length === 0) return { histogramData: [], mean: 0, median: 0, mode: 0 };
    
    const min = Math.min(...data);
    const max = Math.max(...data);
    const bins = 30;
    const binWidth = (max - min) / bins;

    const hist = Array(bins).fill(0).map((_, i) => ({
        name: (min + i * binWidth).toFixed(2),
        count: 0
    }));

    data.forEach(d => {
        const binIndex = Math.floor((d - min) / binWidth);
        if(binIndex >= 0 && binIndex < bins) {
            hist[binIndex].count++;
        }
    });

    return { 
        histogramData: hist,
        mean: getMean(data),
        median: getMedian(data),
        mode: getMode(data),
    };
  }, [data]);
  
  if (histogramData.length === 0) {
    return <Skeleton className="h-[300px] w-full" />;
  }

  return (
    <ChartContainer config={{}} className="h-[300px] w-full">
        <BarChart data={histogramData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
            <Tooltip
                content={<ChartTooltipContent
                    labelFormatter={(label) => `Value: ${label}`}
                    formatter={(value) => [value, 'Frequency']}
                />}
            />
            <Bar dataKey="count" fill="hsl(var(--primary))" />
            <ReferenceLine x={mean} stroke="hsl(var(--destructive))" strokeWidth={2}>
                 <Label value={`Mean: ${mean.toFixed(2)}`} position="top" fill="hsl(var(--destructive))" fontSize={12} dy={-5} />
            </ReferenceLine>
             <ReferenceLine x={median} stroke="hsl(var(--chart-2))" strokeDasharray="3 3" strokeWidth={2}>
                <Label value={`Median: ${median.toFixed(2)}`} position="top" fill="hsl(var(--chart-2))" fontSize={12} dy={10} />
             </ReferenceLine>
        </BarChart>
    </ChartContainer>
  )
};

const DynamicDescriptiveStatsChart = dynamic(() => Promise.resolve(DescriptiveStatsChart), {
  ssr: false,
  loading: () => <Skeleton className="h-[300px] w-full" />,
});


// --- Main Page Component ---
export default function DescriptiveStatisticsExplorerPage() {
    const [distributionType, setDistributionType] = useState<DistributionType>('normal');
    const [data, setData] = useState<number[]>([]);
    const [stats, setStats] = useState({
        mean: 0,
        median: 0,
        mode: 0,
        stdDev: 0,
        skewness: 0,
        kurtosis: 0
    });

    const generateData = (type: DistributionType) => {
        let newData: number[];
        const n = 500;
        switch(type) {
            case 'skewed-right':
                newData = generateLogNormalData(0, 0.6, n);
                break;
            case 'skewed-left':
                newData = generateLogNormalData(0, 0.6, n).map(d => 10 - d);
                break;
            case 'normal':
            default:
                newData = generateNormalData(5, 1.5, n);
                break;
        }
        setData(newData);
        setDistributionType(type);
    }
    
    useEffect(() => {
        generateData('normal');
    }, []);

    useEffect(() => {
        if (data.length > 0) {
            setStats({
                mean: getMean(data),
                median: getMedian(data),
                mode: getMode(data),
                stdDev: getStdDev(data),
                skewness: getSkewness(data),
                kurtosis: getKurtosis(data),
            });
        }
    }, [data]);
    

  return (
    <>
      <PageHeader
        title="Descriptive Statistics Explorer"
        description="An interactive guide to the fundamental metrics used to describe a dataset."
        variant="aligned-left"
      />
      <div className="mx-auto max-w-5xl space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">What Are Descriptive Statistics?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-base leading-relaxed text-foreground/90">
            <p>
              Descriptive statistics are the foundational tools we use to summarize and understand the main features of a dataset. They provide simple, quantitative summaries about the sample and the measures. They are the first step in any quantitative analysis, giving you a high-level "feel" for the data's characteristics before you dive into more complex modeling.
            </p>
            <p>
              They are broadly divided into measures of **central tendency** (like mean, median, and mode) and measures of **variability or spread** (like standard deviation, variance, and kurtosis).
            </p>
          </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle className="font-headline">The Laboratory</CardTitle>
                <CardDescription>Generate different data distributions and observe how the key statistics change in real-time. This is crucial for building an intuitive understanding of these concepts.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex justify-center gap-4 mb-6">
                    <Button onClick={() => generateData('normal')} variant={distributionType === 'normal' ? 'default' : 'outline'}>Normal</Button>
                    <Button onClick={() => generateData('skewed-right')} variant={distributionType === 'skewed-right' ? 'default' : 'outline'}>Skewed Right</Button>
                    <Button onClick={() => generateData('skewed-left')} variant={distributionType === 'skewed-left' ? 'default' : 'outline'}>Skewed Left</Button>
                </div>
                
                <DynamicDescriptiveStatsChart data={data} />
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6 text-center">
                    <Card>
                        <CardHeader className="pb-2"><CardTitle className="text-base">Mean</CardTitle></CardHeader>
                        <CardContent><p className="font-headline text-2xl text-primary">{stats.mean.toFixed(2)}</p></CardContent>
                    </Card>
                     <Card>
                        <CardHeader className="pb-2"><CardTitle className="text-base">Median</CardTitle></CardHeader>
                        <CardContent><p className="font-headline text-2xl text-primary">{stats.median.toFixed(2)}</p></CardContent>
                    </Card>
                     <Card>
                        <CardHeader className="pb-2"><CardTitle className="text-base">Mode</CardTitle></CardHeader>
                        <CardContent><p className="font-headline text-2xl text-primary">{stats.mode.toFixed(2)}</p></CardContent>
                    </Card>
                     <Card>
                        <CardHeader className="pb-2"><CardTitle className="text-base">Std. Deviation</CardTitle></CardHeader>
                        <CardContent><p className="font-headline text-2xl text-primary">{stats.stdDev.toFixed(2)}</p></CardContent>
                    </Card>
                     <Card>
                        <CardHeader className="pb-2"><CardTitle className="text-base">Skewness</CardTitle></CardHeader>
                        <CardContent><p className="font-headline text-2xl text-primary">{stats.skewness.toFixed(2)}</p></CardContent>
                    </Card>
                     <Card>
                        <CardHeader className="pb-2"><CardTitle className="text-base">Kurtosis (Excess)</CardTitle></CardHeader>
                        <CardContent><p className="font-headline text-2xl text-primary">{stats.kurtosis.toFixed(2)}</p></CardContent>
                    </Card>
                </div>
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle className="font-headline">Interpreting the Metrics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
                <div>
                    <h4 className="font-semibold">Mean vs. Median</h4>
                    <p className="text-muted-foreground">In a perfectly symmetrical (normal) distribution, the mean and median are the same. Notice how when you select a skewed distribution, the mean is "pulled" in the direction of the long tail, while the median is more robust and stays closer to the "center" of the main bulk of data. This is why the median is often a better measure of central tendency for skewed data like income or housing prices.</p>
                </div>
                 <div>
                    <h4 className="font-semibold">Standard Deviation</h4>
                    <p className="text-muted-foreground">This measures the average distance of data points from the mean. A higher value indicates more spread or volatility.</p>
                </div>
                 <div>
                    <h4 className="font-semibold">Skewness</h4>
                    <p className="text-muted-foreground">Measures the asymmetry of the distribution. A value near zero is symmetrical. A positive value indicates a "right-skewed" distribution (long tail to the right), and a negative value indicates a "left-skewed" distribution (long tail to the left).</p>
                </div>
                 <div>
                    <h4 className="font-semibold">Kurtosis</h4>
                    <p className="text-muted-foreground">Measures the "tailedness" of the distribution. Excess kurtosis (what's shown here) is relative to a normal distribution. A positive value (Leptokurtic) means the distribution has fatter tails and a sharper peak, indicating more frequent extreme outliers than a normal distribution. A negative value (Platykurtic) means thinner tails and a flatter peak. Financial returns are famously leptokurtic.</p>
                </div>
            </CardContent>
        </Card>
      </div>
    </>
  );
}
