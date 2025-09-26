'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
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
  ComposedChart,
  Line,
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

// --- Data Generation & Math Helpers ---

type DistributionType = 'log-normal' | 'uniform' | 'exponential' | 'bimodal';

const getMean = (data: number[]): number => data.reduce((a, b) => a + b, 0) / data.length;

const getStdDev = (data: number[], mean: number): number => {
  if (data.length < 2) return 0;
  const variance = data.reduce((acc, val) => acc + (val - mean) ** 2, 0) / data.length;
  return Math.sqrt(variance);
};

const generatePopulation = (type: DistributionType, n: number) => {
  const data: number[] = [];
  switch (type) {
    case 'log-normal': // Skewed returns
      for (let i = 0; i < n; i++) {
        const u1 = Math.random();
        const u2 = Math.random();
        const z = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
        data.push(Math.exp(0 + 0.8 * z) * 50);
      }
      break;
    case 'uniform': // Evenly spread returns
      for (let i = 0; i < n; i++) {
        data.push(Math.random() * 200);
      }
      break;
    case 'exponential': // Many small returns, few large
      for (let i = 0; i < n; i++) {
        data.push(-Math.log(1.0 - Math.random()) * 50);
      }
      break;
    case 'bimodal': // Two common outcomes
      for (let i = 0; i < n; i++) {
        data.push(
          Math.random() > 0.5
            ? 80 + (Math.random() - 0.5) * 40
            : 160 + (Math.random() - 0.5) * 40
        );
      }
      break;
  }
  const mean = getMean(data);
  const stdDev = getStdDev(data, mean);
  return { data, mean, stdDev };
};

const createHistogram = (data: number[]) => {
  if (data.length < 2) return { bins: [], maxCount: 0, binSize: 1 };

  const sortedData = [...data].sort((a,b) => a - b);
  const min = sortedData[0];
  const max = sortedData[sortedData.length - 1];

  // Freedman-Diaconis rule for bin size, a robust method
  const q1 = sortedData[Math.floor(sortedData.length / 4)];
  const q3 = sortedData[Math.floor(sortedData.length * 3 / 4)];
  const iqr = q3 - q1;
  let binSize = (2 * iqr) / Math.pow(data.length, 1/3);

  if (binSize <= 0) {
    if (min === max) {
      return { bins: [{ name: min, count: data.length }], maxCount: data.length, binSize: 1 };
    }
    binSize = (max - min) / 20 || 1;
  }
  
  // Cap the number of bins to prevent excessive label overlap
  const maxBins = 25;
  let numBins = Math.min(maxBins, Math.ceil((max - min) / binSize));
  binSize = (max - min) / numBins;

  if (numBins <= 0) numBins = 1;


  const bins = Array.from({ length: numBins }, (_, i) => ({
    name: min + i * binSize,
    count: 0,
  }));

  for (const val of data) {
    let binIndex = Math.floor((val - min) / binSize);
    if (binIndex >= numBins) binIndex = numBins - 1;
    if (bins[binIndex]) {
      bins[binIndex].count++;
    }
  }

  const maxCount = Math.max(...bins.map(b => b.count), 0);
  return { bins, maxCount, binSize };
};

// --- KDE LOGIC ---
const gaussianKernel = (x: number) => (1 / Math.sqrt(2 * Math.PI)) * Math.exp(-0.5 * x * x);

const kernelDensityEstimator = (data: number[], bandwidth: number) => {
    return (x: number) => {
        if (data.length === 0 || bandwidth <= 0) return 0;
        let sum = 0;
        for (let i = 0; i < data.length; i++) {
            sum += gaussianKernel((x - data[i]) / bandwidth);
        }
        return sum / (data.length * bandwidth);
    };
};
// --- END KDE LOGIC ---


const populationChartConfig = {
  count: { label: 'Frequency', color: 'hsl(var(--chart-1))' },
} satisfies ChartConfig;

const samplingDistChartConfig = {
  count: { label: 'Frequency', color: 'hsl(var(--chart-2))' },
  kde: { label: 'KDE', color: 'hsl(var(--destructive))' },
} satisfies ChartConfig;

// --- Main Chart Component ---

const CLTChart = () => {
  const [distributionType, setDistributionType] =
    useState<DistributionType>('log-normal');
  const [population, setPopulation] = useState<number[]>([]);
  const [popStats, setPopStats] = useState({ mean: 0, stdDev: 0 });
  const [populationHist, setPopulationHist] = useState<any[]>([]);
  const [sampleMeans, setSampleMeans] = useState<number[]>([]);
  const [samplingDistHist, setSamplingDistHist] = useState<any[]>([]);
  const [sampleSize, setSampleSize] = useState(30);
  const [lastSampleMean, setLastSampleMean] = useState<number | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const simulationRef = useRef<NodeJS.Timeout | null>(null);

  const MAX_SIM_SAMPLES = 10000;

  const regeneratePopulation = useCallback(() => {
    const { data, mean, stdDev } = generatePopulation(distributionType, 10000);
    setPopulation(data);
    setPopStats({ mean, stdDev });
    setPopulationHist(createHistogram(data).bins);
    resetSimulation();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [distributionType]);

  useEffect(() => {
    regeneratePopulation();
  }, [regeneratePopulation]);
  
  const takeSample = useCallback(
    (numSamples = 1) => {
        if (population.length === 0) return;
        
        let lastMean = 0;
        const newMeans: number[] = [];

        for (let s = 0; s < numSamples; s++) {
            let currentSampleSum = 0;
            for (let i = 0; i < sampleSize; i++) {
            const randIndex = Math.floor(Math.random() * population.length);
            currentSampleSum += population[randIndex];
            }
            const sampleMean = currentSampleSum / sampleSize;
            newMeans.push(sampleMean);
            lastMean = sampleMean;
        }

        setSampleMeans(prev => [...prev, ...newMeans].slice(-MAX_SIM_SAMPLES));
        setLastSampleMean(numSamples === 1 ? lastMean : null);
    },
    [population, sampleSize]
  );
  
  useEffect(() => {
      const { bins, binSize } = createHistogram(sampleMeans);
      if (bins.length > 1 && sampleMeans.length > 1) {
        const mean = getMean(sampleMeans);
        const stdDev = getStdDev(sampleMeans, mean);
        const bandwidth = 1.06 * stdDev * Math.pow(sampleMeans.length, -1/5) || 0.1; // Silverman's rule
        const kde = kernelDensityEstimator(sampleMeans, bandwidth);

        const scaleFactor = sampleMeans.length * binSize;
        
        const kdeData = bins.map(bin => ({
            ...bin,
            kde: kde(bin.name) * scaleFactor
        }));
        setSamplingDistHist(kdeData);
      } else {
        setSamplingDistHist(bins);
      }
    }, [sampleMeans, popStats, sampleSize]);
    
  const stopSimulation = useCallback(() => {
    setIsSimulating(false);
    if (simulationRef.current) {
      clearInterval(simulationRef.current);
      simulationRef.current = null;
    }
  }, []);

  const startSimulation = useCallback(() => {
    setIsSimulating(true);
    simulationRef.current = setInterval(() => {
      setSampleMeans(prevMeans => {
        if (prevMeans.length >= MAX_SIM_SAMPLES) {
          stopSimulation();
          return prevMeans;
        }
        
        const newMeans: number[] = [];
        const samplesToTake = 100;
        for (let s = 0; s < samplesToTake; s++) {
            let currentSampleSum = 0;
            for (let i = 0; i < sampleSize; i++) {
                const randIndex = Math.floor(Math.random() * population.length);
                currentSampleSum += population[randIndex];
            }
            newMeans.push(currentSampleSum / sampleSize);
        }
        return [...prevMeans, ...newMeans];
      });
    }, 40);
  }, [population, sampleSize, stopSimulation]);

  const resetSimulation = () => {
    stopSimulation();
    setSampleMeans([]);
    setSamplingDistHist([]);
    setLastSampleMean(null);
  };
  
  useEffect(() => {
    return () => {
      if (simulationRef.current) {
        clearInterval(simulationRef.current);
      }
    };
  }, []);

  const { populationDomain, samplingDomain } = useMemo(() => {
    if (population.length > 0) {
      const sortedPop = [...population].sort((a,b) => a-b);
      const popMax = sortedPop[Math.floor(sortedPop.length * 0.99)]; // 99th percentile
      const popMin = sortedPop[0];
      
      let sampleMin = 'auto', sampleMax = 'auto';
      if (sampleMeans.length > 1) {
        const min = Math.min(...sampleMeans);
        const max = Math.max(...sampleMeans);
        const padding = (max - min) * 0.1;
        sampleMin = (min - padding).toString();
        sampleMax = (max + padding).toString();
      }

      return {
        populationDomain: [popMin, popMax],
        samplingDomain: [sampleMin, sampleMax],
      };
    }
    return { populationDomain: ['auto', 'auto'], samplingDomain: ['auto', 'auto'] };
  }, [population, sampleMeans]);

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
            onValueChange={(val) => {
              stopSimulation();
              setDistributionType(val as DistributionType);
            }}
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
              A universe of 10,000 possible trade returns. Notice its shape.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={populationChartConfig}
              className="h-64 w-full"
            >
              <RechartsBarChart accessibilityLayer data={populationHist} barGap={0} barCategoryGap="10%">
                <CartesianGrid vertical={false} />
                <XAxis dataKey="name" type="number" domain={populationDomain} unit="$" tickFormatter={(val) => Number(val).toFixed(0)} />
                <YAxis allowDecimals={false} />
                <Tooltip content={<ChartTooltipContent />} />
                <Bar dataKey="count" fill="var(--color-count)" />
              </RechartsBarChart>
            </ChartContainer>
             <div className="mt-2 text-center text-sm text-muted-foreground">
                Population Mean: <span className="font-semibold text-foreground">{popStats.mean.toFixed(2)}</span>
            </div>
          </CardContent>
        </Card>

        {/* Sampling Distribution Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">
              The Distribution of Sample Means
            </CardTitle>
            <CardDescription>
              This chart plots the average of each sample. Watch the bell curve emerge.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={samplingDistChartConfig}
              className="h-64 w-full"
            >
              <ComposedChart accessibilityLayer data={samplingDistHist} barGap={0} barCategoryGap="10%">
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="name"
                  type="number"
                  domain={samplingDomain}
                  tickFormatter={(val) => `$${Number(val).toFixed(0)}`}
                />
                <YAxis allowDecimals={false} domain={[0, 'dataMax + 5']} />
                <Tooltip content={<ChartTooltipContent />} />
                {lastSampleMean && (
                  <ReferenceLine
                    x={lastSampleMean}
                    stroke="hsl(var(--primary))"
                    strokeDasharray="3 3"
                  >
                    <Label
                      value={`Last Mean: ${lastSampleMean.toFixed(1)}`}
                      fill="hsl(var(--primary))"
                      position="insideTop"
                      dy={-10}
                    />
                  </ReferenceLine>
                )}
                <Bar dataKey="count" fill="var(--color-count)" />
                <Line dataKey="kde" type="monotone" stroke="var(--color-kde)" dot={false} strokeWidth={2} />
              </ComposedChart>
            </ChartContainer>
            <div className="mt-2 text-center text-sm text-muted-foreground">
                Samples Taken: <span className="font-semibold text-foreground">{sampleMeans.length.toLocaleString()}</span>
            </div>
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
                onValueChange={(val) => {
                    setSampleSize(val[0]);
                    resetSimulation();
                }}
              />
              <p className="mt-2 text-xs text-muted-foreground">
                A larger sample size results in a narrower, more precise bell
                curve of averages.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2 lg:grid-cols-4">
              <Button onClick={() => takeSample(1)} className="flex-1" disabled={isSimulating}>
                Take 1 Sample
              </Button>
              <Button onClick={() => takeSample(100)} className="flex-1" disabled={isSimulating}>
                Take 100 Samples
              </Button>
               {isSimulating ? (
                 <Button onClick={stopSimulation} variant="destructive" className="flex-1">
                   <Pause className="mr-2" /> Stop
                 </Button>
              ) : (
                <Button onClick={startSimulation} className="flex-1 bg-green-600 hover:bg-green-700" disabled={sampleMeans.length >= MAX_SIM_SAMPLES}>
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
              Your goal is simple: estimate the true average return of the strategy
              without running it for an eternity. You decide to take a random
              sample of trades (e.g., 30 trades), calculate their average return,
              and write it down. Then you do it again. And again.
            </p>
            <p>
              The **Central Limit Theorem (CLT)** states something magical: even
              if your original population of returns is not normally
              distributed, the **distribution of your sample averages** will
              be. And the more sample averages you collect, the more perfectly
              it will form a beautiful, symmetrical bell curve whose center is the true population mean. This allows you
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
