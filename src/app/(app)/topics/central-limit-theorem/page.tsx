
'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { PageHeader } from '@/components/app/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { ChartContainer, type ChartConfig } from '@/components/ui/chart';
import { Bar, BarChart as RechartsBarChart, XAxis, YAxis, Tooltip, CartesianGrid, ReferenceLine, Cell } from 'recharts';
import { ChartTooltipContent } from '@/lib/chart-config';

// --- Data Generation ---

// Generates skewed data (e.g., log-normal) to represent our "apple" population
const generateSkewedPopulation = (n: number, mu: number, sigma: number) => {
  const data = [];
  for (let i = 0; i < n; i++) {
    const u1 = Math.random();
    const u2 = Math.random();
    const z = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
    // We add a shift to ensure weights are positive
    data.push(Math.exp(mu + sigma * z) + 100);
  }
  return data;
};

// Creates a histogram from a dataset
const createHistogram = (data: number[], binSize: number) => {
  if (data.length === 0) return { bins: [], maxCount: 0 };

  const min = Math.min(...data);
  const max = Math.max(...data);
  const binCount = Math.ceil((max - min) / binSize) + 1;
  const bins = Array.from({ length: binCount }, (_, i) => ({
    name: (min + i * binSize).toFixed(0),
    count: 0,
  }));

  for (const val of data) {
    const binIndex = Math.floor((val - min) / binSize);
    if (bins[binIndex]) {
      bins[binIndex].count++;
    }
  }

  const maxCount = Math.max(...bins.map(b => b.count));
  return { bins, maxCount };
};

const populationChartConfig = {
  count: { label: 'Frequency', color: 'hsl(var(--chart-1))' },
} satisfies ChartConfig;

const samplingDistChartConfig = {
  count: { label: 'Frequency', color: 'hsl(var(--chart-2))' },
} satisfies ChartConfig;


// --- Main Chart Component ---

const CLTChart = () => {
  const [population, setPopulation] = useState<number[]>([]);
  const [populationHist, setPopulationHist] = useState<any[]>([]);
  const [sampleMeans, setSampleMeans] = useState<number[]>([]);
  const [samplingDistHist, setSamplingDistHist] = useState<any[]>([]);
  const [sampleSize, setSampleSize] = useState(30);
  const [lastSampleMean, setLastSampleMean] = useState<number | null>(null);

  useEffect(() => {
    // Generate the initial, skewed population of "apple weights"
    const pop = generateSkewedPopulation(10000, 1.5, 0.8);
    setPopulation(pop);
    setPopulationHist(createHistogram(pop, 10).bins);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const takeSample = (numSamples = 1) => {
    const newMeans = [...sampleMeans];
    let lastMean = 0;
    for (let s = 0; s < numSamples; s++) {
      let currentSample = [];
      for (let i = 0; i < sampleSize; i++) {
        const randIndex = Math.floor(Math.random() * population.length);
        currentSample.push(population[randIndex]);
      }
      const sampleMean = currentSample.reduce((a, b) => a + b, 0) / sampleSize;
      newMeans.push(sampleMean);
      lastMean = sampleMean;
    }
    setSampleMeans(newMeans);
    setSamplingDistHist(createHistogram(newMeans, 2).bins);
    if (numSamples === 1) {
        setLastSampleMean(lastMean);
    } else {
        setLastSampleMean(null);
    }
  };

  const resetSimulation = () => {
    setSampleMeans([]);
    setSamplingDistHist([]);
    setLastSampleMean(null);
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      {/* Population Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Step 1: The Orchard Population</CardTitle>
          <CardDescription>
            This is our entire orchard—10,000 apples. Notice the weights are skewed and not normally distributed.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={populationChartConfig} className="h-64 w-full">
            <RechartsBarChart accessibilityLayer data={populationHist}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="name" unit="g" />
              <YAxis allowDecimals={false} />
              <Tooltip content={<ChartTooltipContent />} />
              <Bar dataKey="count" fill="var(--color-count)" />
            </RechartsBarChart>
          </ChartContainer>
        </CardContent>
      </Card>
      
      {/* Sampling Distribution Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Step 2: The Distribution of Sample Means</CardTitle>
          <CardDescription>
            This chart shows the average weight from each sample we take. Watch what shape emerges.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={samplingDistChartConfig} className="h-64 w-full">
            <RechartsBarChart accessibilityLayer data={samplingDistHist}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="name" unit="g" domain={['dataMin - 10', 'dataMax + 10']} />
              <YAxis allowDecimals={false} />
              <Tooltip content={<ChartTooltipContent />} />
              {lastSampleMean && (
                <ReferenceLine x={lastSampleMean} stroke="hsl(var(--destructive))" strokeDasharray="3 3">
                  <Label value={`Last Sample Mean: ${lastSampleMean.toFixed(1)}g`} fill="hsl(var(--destructive))" position="insideTop" dy={-10} />
                </ReferenceLine>
              )}
              <Bar dataKey="count" fill="var(--color-count)" />
            </RechartsBarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Controls */}
      <Card className="lg:col-span-2">
          <CardHeader>
              <CardTitle className="font-headline">Step 3: Experiment!</CardTitle>
              <CardDescription>Adjust the sample size and take samples to see the Central Limit Theorem in action.</CardDescription>
          </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div>
                <Label htmlFor="sample-size-slider">Sample Size (n): {sampleSize}</Label>
                <Slider id="sample-size-slider" min={2} max={100} step={1} value={[sampleSize]} onValueChange={(val) => setSampleSize(val[0])} />
                <p className="text-xs text-muted-foreground mt-2">Notice how a larger sample size results in a narrower, more precise bell curve.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
                <Button onClick={() => takeSample(1)} className="flex-1">Take 1 Sample</Button>
                <Button onClick={() => takeSample(100)} className="flex-1">Take 100 Samples</Button>
                <Button onClick={resetSimulation} variant="outline" className="flex-1">Reset</Button>
            </div>
        </CardContent>
      </Card>
    </div>
  );
};

const DynamicCLTChart = dynamic(() => Promise.resolve(CLTChart), { ssr: false });

export default function CentralLimitTheoremPage() {
  return (
    <>
      <PageHeader
        title="The Central Limit Theorem: A Story"
        description="Discover how order emerges from chaos, one sample at a time."
        variant="aligned-left"
      />
      <div className="mx-auto max-w-5xl space-y-8">
        <Card>
            <CardHeader>
                <CardTitle className="font-headline text-primary">The Quant and the Orchard</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-base leading-relaxed text-foreground/90">
                <p>
                    Imagine you're a quant who has inherited a massive, ancient apple orchard. It's impossible to weigh every single apple. You look at the distribution of all apple weights and see it's skewed—there are many small apples and a few very large ones. It's not a nice, predictable bell curve.
                </p>
                <p>
                    Your goal is simple: find the true average weight of an apple in the orchard. How can you do this without weighing them all? You decide to take a random sample (e.g., 30 apples), calculate their average weight, and write it down. Then you do it again. And again.
                </p>
                 <p>
                    The **Central Limit Theorem (CLT)** states something magical: even though your original population of apples is not normally distributed, the **distribution of the sample averages** will be. And the more samples you take, the more perfectly it will form a beautiful, symmetrical bell curve.
                </p>
            </CardContent>
        </Card>
        
        <DynamicCLTChart />

      </div>
    </>
  );
}
