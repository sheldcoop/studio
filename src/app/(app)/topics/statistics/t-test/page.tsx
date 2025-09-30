
'use client';

import { useState, useEffect, useMemo } from 'react';
import dynamic from 'next/dynamic';
import {
  ReferenceLine,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
  Bar,
  Line,
  CartesianGrid,
  BarChart as RechartsBarChart,
  LineChart as RechartsLineChart,
} from 'recharts';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/app/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { ChartTooltipContent } from '@/lib/chart-config';
import { ChartContainer, type ChartConfig } from '@/components/ui/chart';
import { generateNormalData, getMean, getStdDev } from '@/lib/math';

// --- Statistical Calculation Helpers ---

// Lanczos approximation for gamma function, needed for t-distribution CDF
function lanczosGamma(z: number): number {
    const p = [ 676.5203681218851, -1259.1392167224028, 771.32342877765313, -176.61502916214059, 12.507343278686905, -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7 ];
    if (z < 0.5) return Math.PI / (Math.sin(Math.PI * z) * lanczosGamma(1 - z));
    z -= 1;
    let x = 0.99999999999980993;
    for (let i = 0; i < p.length; i++) x += p[i] / (z + i + 1);
    const t = z + p.length - 0.5;
    return Math.sqrt(2 * Math.PI) * Math.pow(t, z + 0.5) * Math.exp(-t) * x;
}

// Incomplete Beta function, needed for t-distribution CDF
function incompleteBeta(x: number, a: number, b: number): number {
    if (x <= 0) return 0;
    if (x >= 1) return 1;
    const bt = Math.exp(lanczosGamma(a + b) - lanczosGamma(a) - lanczosGamma(b) + a * Math.log(x) + b * Math.log(1 - x));
    if (x < (a + 1) / (a + b + 2)) {
        return bt * series(x, a, b) / a;
    } else {
        return 1 - bt * series(1 - x, b, a) / b;
    }
}
function series(x: number, a: number, b: number) {
    let result = 1;
    let term = 1;
    let apb = a + b;
    let ap1 = a + 1;
    for (let i = 1; i < 100; i++) {
        term *= (a + i - 1) * apb * x / ((ap1 + i - 1) * i);
        result += term;
        if (Math.abs(term) < 1e-12) break;
    }
    return result;
}


// CDF for Student's t-distribution
const tCdf = (t: number, df: number): number => {
    if (df <= 0) return NaN;
    const x = df / (df + t * t);
    const p = 0.5 * incompleteBeta(x, df / 2, 0.5);
    return t > 0 ? 1 - p : p;
}


const independentTestChartConfig = {
  'Momentum': { label: 'Momentum', color: 'hsl(var(--chart-1))' },
  'Mean-Reversion': { label: 'Mean-Reversion', color: 'hsl(var(--chart-2))' },
} satisfies ChartConfig;

const pairedTestChartConfig = {
  before: { label: 'Before', color: 'hsl(var(--chart-2))' },
  after: { label: 'After', color: 'hsl(var(--chart-1))' },
} satisfies ChartConfig;

const oneSampleTestChartConfig = {
  value: { label: "Sample's Avg. Return", color: 'hsl(var(--chart-1))' },
} satisfies ChartConfig;

// Helper to create a histogram from data
const createHistogram = (data: number[], binSize: number, min: number, max: number) => {
    const bins = Math.ceil((max - min) / binSize) || 1;
    const labels = Array.from({ length: bins }, (_, i) => (min + i * binSize));
    const counts = new Array(bins).fill(0);
    for (const value of data) {
        const binIndex = Math.floor((value - min) / binSize);
        if (binIndex >= 0 && binIndex < bins) {
            counts[binIndex]++;
        }
    }
    return { labels, counts };
};


// --- Chart Components ---

const IndependentTestChart = () => {
    const [dataA, setDataA] = useState<number[]>([]);
    const [dataB, setDataB] = useState<number[]>([]);
    const [stats, setStats] = useState({ tStat: 0, pValue: 0, meanA: 0, meanB: 0 });

    const generateData = () => {
        const sampleA = generateNormalData(0.08, 0.5, 60);
        const sampleB = generateNormalData(0.03, 0.5, 60);
        setDataA(sampleA);
        setDataB(sampleB);

        const n1 = sampleA.length, n2 = sampleB.length;
        const mean1 = getMean(sampleA), mean2 = getMean(sampleB);
        const std1 = getStdDev(sampleA), std2 = getStdDev(sampleB);

        const pooledStd = Math.sqrt(((n1 - 1) * std1 * std1 + (n2 - 1) * std2 * std2) / (n1 + n2 - 2));
        const tStat = (mean1 - mean2) / (pooledStd * Math.sqrt(1 / n1 + 1 / n2));
        const df = n1 + n2 - 2;
        const pValue = 2 * (1 - tCdf(Math.abs(tStat), df));
        
        setStats({ tStat, pValue, meanA: mean1, meanB: mean2 });
    };

    useEffect(generateData, []);
    
    const chartData = useMemo(() => {
        if(dataA.length === 0 || dataB.length === 0) return [];
        const combined = [...dataA, ...dataB];
        const min = Math.min(...combined), max = Math.max(...combined);
        const binSize = (max - min) / 20;

        const histA = createHistogram(dataA, binSize, min, max);
        const histB = createHistogram(dataB, binSize, min, max);

        return histA.labels.map((label, i) => ({
            name: label.toFixed(2),
            Momentum: histA.counts[i],
            'Mean-Reversion': histB.counts[i],
        }));
    }, [dataA, dataB]);

    return (
        <div className="flex h-fit w-full flex-col">
            <div className="relative mx-auto flex-grow w-full">
                <ChartContainer config={independentTestChartConfig} className="h-[350px] w-full">
                    <RechartsBarChart accessibilityLayer data={chartData} barCategoryGap="0%" margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                        <CartesianGrid vertical={false} />
                        <XAxis dataKey="name" tickLine={false} tickMargin={10} axisLine={false} />
                        <YAxis name="Frequency" />
                        <Tooltip content={<ChartTooltipContent />} wrapperStyle={{ zIndex: 1000 }} />
                        <Legend />
                        <Bar dataKey="Momentum" fill="var(--color-Momentum)" opacity={0.7} />
                        <Bar dataKey="Mean-Reversion" fill="var(--color-Mean-Reversion)" opacity={0.7} />
                        <ReferenceLine x={stats.meanA} stroke="hsl(var(--chart-1))" strokeWidth={2} label={{ value: `μ A`, fill: 'hsl(var(--chart-1))' }} />
                        <ReferenceLine x={stats.meanB} stroke="hsl(var(--chart-2))" strokeWidth={2} label={{ value: `μ B`, fill: 'hsl(var(--chart-2))' }} />
                    </RechartsBarChart>
                </ChartContainer>
            </div>
             <div className="mt-4 grid grid-cols-2 gap-4 text-center">
                 <Card>
                    <CardHeader className="pb-1"><CardTitle className="text-sm">t-Statistic</CardTitle></CardHeader>
                    <CardContent><p className="font-mono text-xl font-bold">{stats.tStat.toFixed(2)}</p></CardContent>
                 </Card>
                 <Card>
                    <CardHeader className="pb-1"><CardTitle className="text-sm">p-Value</CardTitle></CardHeader>
                    <CardContent><p className="font-mono text-xl font-bold text-primary">{stats.pValue.toFixed(4)}</p></CardContent>
                 </Card>
            </div>
            <div className="mt-4 flex-shrink-0 text-center">
                <Button onClick={generateData}>Simulate New 60-Day Period</Button>
            </div>
        </div>
    );
};

const PairedTestChart = () => {
  const [chartData, setChartData] = useState<any[]>([]);
  const [stats, setStats] = useState({ tStat: 0, pValue: 0 });

  const generateData = () => {
    const numSubjects = 12;
    const beforeData = Array.from( { length: numSubjects }, () => 0.5 + (Math.random() - 0.5) * 2 );
    const afterData = beforeData.map((d) => d + (0.1 + Math.random() * 0.5));
    
    setChartData(
      Array.from({ length: numSubjects }, (_, i) => ({ name: `Week ${i + 1}`, before: beforeData[i], after: afterData[i] }))
    );

    const differences = afterData.map((val, i) => val - beforeData[i]);
    const meanDiff = getMean(differences);
    const stdDiff = getStdDev(differences);
    const tStat = (meanDiff / (stdDiff / Math.sqrt(numSubjects)));
    const pValue = 1 - tCdf(tStat, numSubjects - 1);
    setStats({ tStat, pValue });
  };

  useEffect(generateData, []);

  return (
    <div className="flex h-fit w-full flex-col">
      <div className="flex-grow">
        <ChartContainer config={pairedTestChartConfig} className="h-[350px] w-full">
          <RechartsLineChart accessibilityLayer data={chartData} margin={{ top: 20, right: 30, bottom: 20, left: 20 }}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="name" tickLine={false} tickMargin={10} axisLine={false} />
            <YAxis unit="%" />
            <Tooltip content={<ChartTooltipContent indicator="dot" />} />
            <Legend formatter={(value) => pairedTestChartConfig[value as keyof typeof pairedTestChartConfig]?.label || value} />
            <Line type="monotone" dataKey="before" strokeWidth={2} stroke="var(--color-before)" />
            <Line type="monotone" dataKey="after" strokeWidth={2} stroke="var(--color-after)" />
          </RechartsLineChart>
        </ChartContainer>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-4 text-center">
        <Card>
          <CardHeader className="pb-1"><CardTitle className="text-sm">t-Statistic</CardTitle></CardHeader>
          <CardContent><p className="font-mono text-xl font-bold">{stats.tStat.toFixed(2)}</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-1"><CardTitle className="text-sm">p-Value</CardTitle></CardHeader>
          <CardContent><p className="font-mono text-xl font-bold text-primary">{stats.pValue.toFixed(4)}</p></CardContent>
        </Card>
      </div>
      <div className="mt-4 flex-shrink-0 text-center">
        <Button onClick={generateData}>Simulate New Data</Button>
      </div>
    </div>
  );
};

const OneSampleTestChart = () => {
  const [meanValue, setMeanValue] = useState(1.7);
  const target = 1.5;
  
  const sampleData = useMemo(() => generateNormalData(meanValue, 0.3, 24), [meanValue]);
  const stats = useMemo(() => {
    const mean = getMean(sampleData);
    const std = getStdDev(sampleData);
    const tStat = (mean - target) / (std / Math.sqrt(sampleData.length));
    const pValue = 2 * (1 - tCdf(Math.abs(tStat), sampleData.length - 1));
    return { tStat, pValue };
  }, [sampleData]);

  const chartData = [{ name: 'Avg. Return', value: getMean(sampleData) }];

  return (
    <div className="flex h-fit w-full flex-col">
      <div className="flex-grow">
        <ChartContainer config={oneSampleTestChartConfig} className="h-[200px] w-full">
          <RechartsBarChart accessibilityLayer data={chartData} layout="vertical" margin={{ top: 20, right: 40, bottom: 20, left: 40 }}>
            <CartesianGrid horizontal={false} />
            <YAxis type="category" dataKey="name" tickLine={false} axisLine={false} width={100} tickFormatter={(v) => oneSampleTestChartConfig.value.label}/>
            <XAxis type="number" unit="%" domain={[0.5, 2.5]} />
            <Tooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Bar dataKey="value" radius={8} fill="var(--color-value)" />
            <ReferenceLine x={target} stroke="hsl(var(--destructive))" strokeWidth={2} strokeDasharray="3 3">
              <Label value={`Claimed: ${target}%`} position="insideTopRight" fill="hsl(var(--destructive))" fontSize={12} />
            </ReferenceLine>
          </RechartsBarChart>
        </ChartContainer>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-4 text-center">
        <Card>
          <CardHeader className="pb-1"><CardTitle className="text-sm">t-Statistic</CardTitle></CardHeader>
          <CardContent><p className="font-mono text-xl font-bold">{stats.tStat.toFixed(2)}</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-1"><CardTitle className="text-sm">p-Value</CardTitle></CardHeader>
          <CardContent><p className="font-mono text-xl font-bold text-primary">{stats.pValue.toFixed(4)}</p></CardContent>
        </Card>
      </div>
      <div className="mt-4 flex-shrink-0 text-center">
        <div className="mx-auto max-w-sm py-4">
          <Label htmlFor="mean-slider">Adjust Sample's Average Monthly Return (%)</Label>
          <Slider id="mean-slider" min={1.0} max={2.0} value={[meanValue]} step={0.01} onValueChange={(value) => setMeanValue(value[0])} className="my-4" />
        </div>
        <div className="text-sm text-muted-foreground"> Current Sample Mean: <span className="font-bold text-foreground">{getMean(sampleData).toFixed(2)}</span> % vs Claimed <span className="font-bold text-destructive">{target}%</span></div>
      </div>
    </div>
  );
};

const DynamicIndependentTestChart = dynamic(() => Promise.resolve(IndependentTestChart), { ssr: false });
const DynamicPairedTestChart = dynamic(() => Promise.resolve(PairedTestChart), { ssr: false });
const DynamicOneSampleTestChart = dynamic(() => Promise.resolve(OneSampleTestChart), { ssr: false });


export default function TTestPage() {
  const [activeTab, setActiveTab] = useState("independent");

  return (
    <>
      <PageHeader
        title="An Interactive Guide to the T-Test for Trading"
        description="The t-test is a key tool for comparing average returns and performance. This guide uses interactive trading examples to explain the main types of t-tests and help you understand when to use each one."
      />
      <div className="mx-auto max-w-5xl space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Core Concepts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <h3 className="mb-1 font-semibold text-primary">
                  Purpose &amp; Analogy
                </h3>
                <p className="text-muted-foreground">
                  A t-test checks if the difference between two average returns
                  is statistically significant or just due to random market
                  noise. Think of it as a performance verifier: is Strategy A{' '}
                  <span className="italic">truly</span> more profitable than
                  Strategy B, or did it just get lucky in this sample?
                </p>
              </div>
              <div>
                <h3 className="mb-1 font-semibold text-primary">
                  Key Assumption
                </h3>
                <p className="text-muted-foreground">
                  The main requirement for a t-test is that the data (e.g.,
                  daily or monthly returns) should be approximately{' '}
                  <strong className="text-foreground">
                    normally distributed
                  </strong>{' '}
                  (forming a &quot;bell curve&quot;). This is a critical check
                  before relying on the test&apos;s results.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="independent">
                  Independent Samples
                </TabsTrigger>
                <TabsTrigger value="paired">Paired Samples</TabsTrigger>
                <TabsTrigger value="one-sample">One-Sample</TabsTrigger>
              </TabsList>
              <TabsContent value="independent" className="mt-6">
                <h3 className="text-xl font-bold">Independent Samples T-Test</h3>
                <p className="mt-2 text-muted-foreground">
                  This test compares the means of two{' '}
                  <strong>separate, unrelated groups</strong>. In trading, this
                  is perfect for comparing the performance of two different
                  strategies that are traded independently.
                </p>
                <p className="mt-4 text-sm">
                  <span className="font-semibold text-foreground">
                    Example:
                  </span>{' '}
                  Comparing the average daily returns of a Momentum Strategy vs.
                  a Mean-Reversion Strategy over the last 60 days to see if
                  one is significantly more profitable.
                </p>
                <div className="mt-4 rounded-lg bg-background/50 p-4">
                  {activeTab === 'independent' && <DynamicIndependentTestChart />}
                </div>
              </TabsContent>
              <TabsContent value="paired" className="mt-6">
                <h3 className="text-xl font-bold">Paired Samples T-Test</h3>
                <p className="mt-2 text-muted-foreground">
                  This test is used to compare the means of{' '}
                  <strong>one group, measured twice</strong>. It&apos;s ideal
                  for &quot;before and after&quot; scenarios, like testing if a change
                  to an algorithm improved an existing portfolio&apos;s
                  performance.
                </p>
                <p className="mt-4 text-sm">
                  <span className="font-semibold text-foreground">
                    Example:
                  </span>{' '}
                  Measuring a portfolio's weekly returns for 12 weeks{' '}
                  <i>before</i> adding a new algorithm, and then for 12 weeks{' '}
                  <i>after</i>, to see if the change led to a significant
                  improvement.
                </p>
                <div className="mt-4 rounded-lg bg-background/50 p-4">
                  {activeTab === 'paired' && <DynamicPairedTestChart />}
                </div>
              </TabsContent>
              <TabsContent value="one-sample" className="mt-6">
                <h3 className="text-xl font-bold">One-Sample T-Test</h3>
                <p className="mt-2 text-muted-foreground">
                  This test compares the mean of a{' '}
                  <strong>single group to a known, fixed number</strong>. In
                  finance, you can use this to check if a fund&apos;s actual
                  performance matches its advertised claims or a specific
                  benchmark.
                </p>
                <p className="mt-4 text-sm">
                  <span className="font-semibold text-foreground">
                    Example:
                  </span>{' '}
                  A hedge fund claims its average monthly return is 1.5%. You
                  test a sample of its returns from the last 24 months to see
                  if the average is statistically different from their 1.5%
                  claim.
                </p>
                <div className="mt-4 rounded-lg bg-background/50 p-4">
                  {activeTab === 'one-sample' && <DynamicOneSampleTestChart />}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
