'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
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
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { ChartContainer, type ChartConfig } from '@/components/ui/chart';
import {
  Bar,
  BarChart as RechartsBarChart,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
} from 'recharts';
import { ChartTooltipContent } from '@/lib/chart-config';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Pause, Play } from 'lucide-react';

// --- Data Generation ---

type DistributionType = 'log-normal' | 'uniform' | 'exponential' | 'bimodal';

const generatePopulation = (
  type: DistributionType,
  n: number
): number[] => {
  const data = [];
  switch (type) {
    case 'log-normal': // Skewed returns
      for (let i = 0; i < n; i++) {
        const u1 = Math.random();
        const u2 = Math.random();
        const z = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
        data.push(Math.exp(0 + 0.8 * z) * 50); // mu=0, sigma=0.8
      }
      break;
    case 'uniform': // Evenly spread returns
      for (let i = 0; i < n; i++) {
        data.push(Math.random() * 200); // returns between 0 and 200
      }
      break;
    case 'exponential': // Many small returns, few large
      for (let i = 0; i < n; i++) {
        data.push(-Math.log(1.0 - Math.random()) * 50); // lambda=1/50
      }
      break;
    case 'bimodal': // Two common outcomes
      for (let i = 0; i < n; i++) {
        if (Math.random() > 0.5) {
          // First peak (e.g., small loss)
          data.push(80 + (Math.random() - 0.5) * 40);
        } else {
          // Second peak (e.g., small gain)
          data.push(160 + (Math.random() - 0.5) * 40);
        }
      }
      break;
  }
  return data;
};


// Creates a histogram from a dataset
const createHistogram = (data: number[], binSize: number) => {
  if (data.length === 0) return { bins: [], maxCount: 0 };

  const min = Math.min(...data);
  const max = Math.max(...data);
  let binCount = Math.ceil((max - min) / binSize);
  if (binCount === 0) binCount = 1;

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

  const maxCount = Math.max(...bins.map((b) => b.count));
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
  const [distributionType, setDistributionType] =
    useState<DistributionType>('log-normal');
  const [population, setPopulation] = useState<number[]>([]);
  const [populationHist, setPopulationHist] = useState<any[]>([]);
  const [sampleMeans, setSampleMeans] = useState<number[]>([]);
  const [samplingDistHist, setSamplingDistHist] = useState<any[]>([]);
  const [sampleSize, setSampleSize] = useState(30);
  const [lastSampleMean, setLastSampleMean] = useState<number | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const simulationRef = useRef<NodeJS.Timeout | null>(null);

  const regeneratePopulation = useCallback(() => {
    const pop = generatePopulation(distributionType, 10000);
    setPopulation(pop);
    setPopulationHist(createHistogram(pop, 10).bins);
    resetSimulation();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [distributionType]);

  useEffect(() => {
    regeneratePopulation();
  }, [regeneratePopulation]);
  
  const takeSample = useCallback(
    (numSamples = 1) => {
      if (population.length === 0) return;
      const newMeans = [...sampleMeans];
      let lastMean = 0;
      for (let s = 0; s < numSamples; s++) {
        let currentSample = [];
        for (let i = 0; i < sampleSize; i++) {
          const randIndex = Math.floor(Math.random() * population.length);
          currentSample.push(population[randIndex]);
        }
        const sampleMean =
          currentSample.reduce((a, b) => a + b, 0) / sampleSize;
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
    },
    [population, sampleMeans, sampleSize]
  );

  const startSimulation = () => {
    setIsSimulating(true);
    simulationRef.current = setInterval(() => {
      takeSample(20);
    }, 50);
  };

  const stopSimulation = () => {
    setIsSimulating(false);
    if (simulationRef.current) {
      clearInterval(simulationRef.current);
    }
  };

  const resetSimulation = () => {
    stopSimulation();
    setSampleMeans([]);
    setSamplingDistHist([]);
    setLastSampleMean(null);
  };
  
  useEffect(() => {
    // Cleanup on unmount
    return () => {
      if (simulationRef.current) {
        clearInterval(simulationRef.current);
      }
    };
  }, []);

  return (
    <>
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="font-headline">
            Step 1: Choose Your "Strategy's" Return Profile
          </CardTitle>
          <CardDescription>
            Select a population distribution. This represents the underlying,
            often unknown, reality of your trading strategy's returns.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs
            defaultValue={distributionType}
            onValueChange={(val) => setDistributionType(val as DistributionType)}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
              <TabsTrigger value="log-normal">Skewed</TabsTrigger>
              <TabsTrigger value="uniform">Uniform</TabsTrigger>
              <TabsTrigger value="exponential">Exponential</TabsTrigger>
              <TabsTrigger value="bimodal">Bimodal</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Population Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">The Population</CardTitle>
            <CardDescription>
              A universe of 10,000 possible trade returns from your strategy.
              Notice its unique shape.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={populationChartConfig}
              className="h-64 w-full"
            >
              <RechartsBarChart accessibilityLayer data={populationHist}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="name" unit="$" />
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
            <CardTitle className="font-headline">
              The Distribution of Sample Means
            </CardTitle>
            <CardDescription>
              This chart plots the average return from each sample we take. Watch
              what shape emerges.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={samplingDistChartConfig}
              className="h-64 w-full"
            >
              <RechartsBarChart accessibilityLayer data={samplingDistHist}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="name"
                  unit="$"
                  domain={['dataMin - 10', 'dataMax + 10']}
                />
                <YAxis allowDecimals={false} />
                <Tooltip content={<ChartTooltipContent />} />
                {lastSampleMean && (
                  <ReferenceLine
                    x={lastSampleMean}
                    stroke="hsl(var(--destructive))"
                    strokeDasharray="3 3"
                  >
                    <Label
                      value={`Last Sample Mean: ${lastSampleMean.toFixed(1)}`}
                      fill="hsl(var(--destructive))"
                      position="insideTop"
                      dy={-10}
                    />
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
            <CardTitle className="font-headline">Step 2: Experiment!</CardTitle>
            <CardDescription>
              Adjust the sample size and take samples to see the Central Limit
              Theorem in action.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 items-center gap-6 md:grid-cols-2">
            <div>
              <Label htmlFor="sample-size-slider">
                Sample Size (n): {sampleSize}
              </Label>
              <Slider
                id="sample-size-slider"
                min={2}
                max={100}
                step={1}
                value={[sampleSize]}
                onValueChange={(val) => setSampleSize(val[0])}
              />
              <p className="mt-2 text-xs text-muted-foreground">
                A larger sample size results in a narrower, more precise bell
                curve of averages.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2 lg:grid-cols-4">
              <Button onClick={() => takeSample(1)} className="flex-1">
                Take 1 Sample
              </Button>
              <Button onClick={() => takeSample(100)} className="flex-1">
                Take 100 Samples
              </Button>
               {isSimulating ? (
                 <Button onClick={stopSimulation} variant="destructive" className="flex-1">
                   <Pause className="mr-2" /> Stop
                 </Button>
              ) : (
                <Button onClick={startSimulation} className="flex-1 bg-green-600 hover:bg-green-700">
                  <Play className="mr-2" /> Run Sim
                </Button>
              )}
              <Button onClick={resetSimulation} variant="outline" className="flex-1">
                Reset
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

const DynamicCLTChart = dynamic(() => Promise.resolve(CLTChart), {
  ssr: false,
  loading: () => <div className="h-[400px] w-full animate-pulse rounded-lg bg-muted" />,
});

export default function CentralLimitTheoremPage() {
  return (
    <>
      <PageHeader
        title="The Central Limit Theorem: The Quant's Superpower"
        description="Discover how order emerges from chaos, one sample at a time."
        variant="aligned-left"
      />
      <div className="mx-auto max-w-7xl space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-primary">
              The Quant and the Trading Strategy
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-base leading-relaxed text-foreground/90">
            <p>
              Imagine you've designed a new automated trading strategy. There
              are millions of potential trades it could make, each with a
              different profit or loss. This entire universe of possible
              returns is the **population**. Its true average return is unknown,
              and its distribution might be weirdly shaped (skewed, bimodal, etc.).
            </p>
            <p>
              Your goal is simple: find the true average return of the strategy
              without running it for an eternity. You decide to take a random
              sample of trades (e.g., 30 trades), calculate their average return,
              and write it down. Then you do it again. And again.
            </p>
            <p>
              The **Central Limit Theorem (CLT)** states something magical: even
              if your original population of returns is not normally
              distributed, the **distribution of your sample averages** will
              be. And the more sample averages you collect, the more perfectly
              it will form a beautiful, symmetrical bell curve. This allows you
              to make powerful inferences about the strategy's true average
              return.
            </p>
          </CardContent>
        </Card>

        <DynamicCLTChart />
      </div>
    </>
  );
}
