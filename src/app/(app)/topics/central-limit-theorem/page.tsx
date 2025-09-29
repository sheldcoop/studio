
'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { PageHeader } from '@/components/app/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Slider } from '@/components/ui/slider';
import { BarChart, Bar, ResponsiveContainer, ReferenceLine } from 'recharts';
import { generateUniformData, generateExponentialData, getMean } from '@/lib/math';
import { Loader2 } from 'lucide-react';
import { ChartContainer } from '@/components/ui/chart';
import { XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

type DistributionType = 'uniform' | 'exponential';

// --- Chart Components ---

const PopulationChart = ({ distribution }: { distribution: DistributionType }) => {
  const { data, mean, stdDev } = useMemo(() => {
    let rawData;
    let calculatedMean: number;
    let calculatedStdDev: number;

    if (distribution === 'uniform') {
      rawData = Array.from({ length: 500 }, () => Math.random() * 10);
      calculatedMean = 5;
      calculatedStdDev = Math.sqrt(((10-0)**2)/12);
    } else { 
      rawData = generateExponentialData(1, 500);
      calculatedMean = 1;
      calculatedStdDev = 1;
    }

    const min = 0;
    const max = Math.max(...rawData, 5);
    const bins = 20;
    const binWidth = max / bins;
    const histogram = Array(bins).fill(0);

    rawData.forEach(d => {
      const binIndex = Math.floor(d / binWidth);
      if (binIndex >= 0 && binIndex < bins) {
        histogram[binIndex]++;
      }
    });

    return {
      data: histogram.map((count, i) => ({
        name: (i * binWidth).toFixed(1),
        count,
      })),
      mean: calculatedMean,
      stdDev: calculatedStdDev,
    };
  }, [distribution]);

  return (
    <>
        <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
            <Tooltip wrapperClassName="text-xs" />
            <Bar dataKey="count" fill="hsl(var(--primary))" barSize={20} />
            <ReferenceLine x={mean} stroke="hsl(var(--destructive))" strokeWidth={2} label={{ value: `μ=${mean.toFixed(2)}`, position: 'top', fill: 'hsl(var(--destructive))', fontSize: 12 }} />
        </BarChart>
        </ResponsiveContainer>
        <div className="text-center text-xs text-muted-foreground mt-2">
            Population Mean (μ): {mean.toFixed(2)}, Population Std Dev (σ): {stdDev.toFixed(2)}
        </div>
    </>
  );
};

const SampleChart = ({ sample, sampleMean }: { sample: number[], sampleMean: number | null }) => {
    const data = useMemo(() => {
        if (!sample || sample.length === 0) return [];
        const min = 0;
        const max = Math.max(...sample, 1);
        const bins = 15;
        const binWidth = max / bins;
        const histogram = Array(bins).fill(0);
        sample.forEach(d => {
            const binIndex = Math.floor(d / binWidth);
            if (binIndex >= 0 && binIndex < bins) {
                histogram[binIndex]++;
            }
        });
        return histogram.map((count, i) => ({
            name: (i * binWidth).toFixed(1),
            count,
        }));
    }, [sample]);

    const sampleMeanValue = sampleMean !== null ? parseFloat(data.find(d => parseFloat(d.name) >= sampleMean)?.name || "0") : null;

    return (
        <ResponsiveContainer width="100%" height={200}>
            <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
                <Tooltip wrapperClassName="text-xs" />
                <Bar dataKey="count" fill="hsl(var(--chart-2))" />
                {sampleMean !== null && sampleMeanValue !== null && (
                     <ReferenceLine x={sampleMeanValue} stroke="hsl(var(--destructive))" strokeWidth={2} label={{ value: `Mean: ${sampleMean.toFixed(2)}`, position: 'insideTop', fill: 'hsl(var(--destructive))', fontSize: 12 }} />
                )}
            </BarChart>
        </ResponsiveContainer>
    );
}

const SamplingDistributionChart = ({ sampleMeans }: { sampleMeans: number[] }) => {
  const { data, overallMean } = useMemo(() => {
    if (sampleMeans.length === 0) return { data: [], overallMean: 0 };
    const min = Math.min(...sampleMeans);
    const max = Math.max(...sampleMeans);
    const bins = Math.max(20, Math.floor(Math.sqrt(sampleMeans.length) * 1.5));
    const binWidth = (max - min) / bins;

    const histData = (binWidth === 0 && sampleMeans.length > 0) 
      ? [{ name: min.toFixed(2), count: sampleMeans.length }]
      : (() => {
          const histogram = Array(bins).fill(0);
          sampleMeans.forEach(mean => {
            const binIndex = Math.floor((mean - min) / binWidth);
            const index = binIndex === bins ? bins - 1 : binIndex;
            if (index >= 0 && index < bins) {
                histogram[index]++;
            }
          });
          return histogram.map((count, i) => ({
            name: (min + i * binWidth).toFixed(2),
            count,
          }));
      })();
    
    const meanOfMeans = getMean(sampleMeans);

    return { data: histData, overallMean: meanOfMeans };
  }, [sampleMeans]);
  
  const meanOfMeansValue = parseFloat(data.find(d => parseFloat(d.name) >= overallMean)?.name || "0");
  
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" vertical={false}/>
        <XAxis dataKey="name" tick={{ fontSize: 12 }} />
        <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
        <Tooltip wrapperClassName="text-xs" />
        <Bar dataKey="count" fill="hsl(var(--primary))" />
        {sampleMeans.length > 1 && (
            <ReferenceLine x={meanOfMeansValue} stroke="hsl(var(--destructive))" strokeWidth={2} label={{ value: `Mean of Means: ${overallMean.toFixed(2)}`, position: 'insideTopRight', fill: 'hsl(var(--destructive))', fontSize: 12 }} />
        )}
      </BarChart>
    </ResponsiveContainer>
  );
};


// --- Main Page ---

export default function CentralLimitTheoremPage() {
  const [distribution, setDistribution] = useState<DistributionType>('uniform');
  const [sampleSize, setSampleSize] = useState(30);
  const [numSamples, setNumSamples] = useState(1000);
  const [simulationSpeed, setSimulationSpeed] = useState(50);

  const [sampleMeans, setSampleMeans] = useState<number[]>([]);
  const [currentSample, setCurrentSample] = useState<number[]>([]);
  const [currentSampleMean, setCurrentSampleMean] = useState<number | null>(null);

  const [isSampling, setIsSampling] = useState(false);
  const simulationIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const runSimulation = () => {
    if (isSampling) {
        if(simulationIntervalRef.current) clearInterval(simulationIntervalRef.current);
        setIsSampling(false);
        return;
    }

    setIsSampling(true);
    setSampleMeans([]);
    setCurrentSample([]);
    setCurrentSampleMean(null);

    const allMeans: number[] = [];
    let samplesDrawn = 0;

    const tick = () => {
        if (samplesDrawn >= numSamples) {
            if(simulationIntervalRef.current) clearInterval(simulationIntervalRef.current);
            setIsSampling(false);
            setCurrentSample([]);
            setCurrentSampleMean(null);
            return;
        }

        let sample;
        if (distribution === 'uniform') {
            sample = Array.from({ length: sampleSize }, () => Math.random() * 10);
        } else {
            sample = generateExponentialData(1, sampleSize);
        }
        const mean = getMean(sample);
        
        setCurrentSample(sample);
        setCurrentSampleMean(mean);

        allMeans.push(mean);
        setSampleMeans([...allMeans]);
        
        samplesDrawn++;
        
        // Schedule next tick
        const delay = 200 - simulationSpeed * 1.9;
        simulationIntervalRef.current = setTimeout(tick, delay);
    };

    tick(); // Start the first tick
  };
  
  // Clean up interval on unmount
  useEffect(() => {
    return () => {
        if(simulationIntervalRef.current) clearInterval(simulationIntervalRef.current);
    }
  }, []);

  // Run simulation on initial load
  useEffect(() => {
    runSimulation();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <PageHeader
        title="The Central Limit Theorem (CLT)"
        description="Discover how order emerges from chaos, a cornerstone of statistics."
        variant="aligned-left"
      />

      <div className="mx-auto max-w-7xl space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">The Story of the CLT</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-base leading-relaxed text-foreground/90">
            <p>
              Imagine you have a giant barrel filled with numbered tickets. The numbers could follow any pattern—maybe there's an equal number of 1s, 2s, and 3s (a <span className="font-semibold text-primary">Uniform</span> distribution), or maybe there are tons of small numbers and very few large ones (a skewed <span className="font-semibold text-primary">Exponential</span> distribution).
            </p>
            <p>
              The Central Limit Theorem makes a magical promise: if you repeatedly reach in, pull out a <span className="font-semibold text-foreground">handful of tickets</span> (a sample), calculate its <span className="font-semibold text-foreground">average</span>, and plot that average on a histogram, the histogram will almost always form a perfect <span className="font-semibold text-foreground">bell curve (a Normal Distribution)</span>.
            </p>
            <p>
                This is true no matter how weirdly the numbers in the barrel were distributed to begin with. This powerful idea allows us to use normal distribution statistics for many problems, even when we don't know the original population's shape.
            </p>
          </CardContent>
        </Card>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* --- Left Column: Controls & Population --- */}
            <div className="lg:col-span-1 space-y-8">
              <Card>
                  <CardHeader>
                      <CardTitle>The Laboratory</CardTitle>
                      <CardDescription>Adjust the parameters and run the simulation to see the CLT in action.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                      <div className="space-y-3">
                          <Label>1. Choose the Population Distribution</Label>
                          <RadioGroup value={distribution} onValueChange={(val: any) => setDistribution(val)} disabled={isSampling}>
                              <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="uniform" id="uniform" />
                                  <Label htmlFor="uniform">Uniform</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="exponential" id="exponential" />
                                  <Label htmlFor="exponential">Exponential (Skewed)</Label>
                              </div>
                          </RadioGroup>
                      </div>
                      <div className="space-y-3">
                          <Label htmlFor="sample-size-slider">2. Set the Sample Size (n)</Label>
                          <div className="flex items-center gap-4">
                              <Slider id="sample-size-slider" min={2} max={100} step={1} value={[sampleSize]} onValueChange={(val) => setSampleSize(val[0])} disabled={isSampling} />
                              <span className="font-mono text-lg w-12 text-center">{sampleSize}</span>
                          </div>
                      </div>
                      <div className="space-y-3">
                          <Label htmlFor="num-samples-slider">3. Set Number of Samples to Draw</Label>
                          <div className="flex items-center gap-4">
                              <Slider id="num-samples-slider" min={100} max={5000} step={100} value={[numSamples]} onValueChange={(val) => setNumSamples(val[0])} disabled={isSampling} />
                              <span className="font-mono text-lg w-12 text-center">{numSamples}</span>
                          </div>
                      </div>
                      <div className="space-y-3">
                          <Label htmlFor="speed-slider">4. Simulation Speed</Label>
                          <div className="flex items-center gap-4">
                              <Slider id="speed-slider" min={1} max={100} step={1} value={[simulationSpeed]} onValueChange={(val) => setSimulationSpeed(val[0])} disabled={isSampling} />
                              <span className="font-mono text-lg w-12 text-center">{simulationSpeed}</span>
                          </div>
                      </div>
                      <Button onClick={runSimulation} className="w-full !mt-8">
                          {isSampling ? (
                              <>
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                  Stop Simulation
                              </>
                          ) : `Run Simulation`}
                      </Button>
                  </CardContent>
              </Card>
               <Card>
                  <CardHeader>
                      <CardTitle>1. Population Distribution</CardTitle>
                      <CardDescription>This is the shape of the original barrel of tickets. We'll draw samples from here.</CardDescription>
                  </CardHeader>
                  <CardContent>
                      <PopulationChart distribution={distribution} />
                  </CardContent>
              </Card>
            </div>


            {/* --- Right Column: Visualizations --- */}
            <div className="lg:col-span-2 space-y-8">
                <Card>
                    <CardHeader>
                        <CardTitle>2. Current Sample</CardTitle>
                        <CardDescription>This is the histogram of a single handful of tickets drawn from the population, and its calculated mean.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <SampleChart sample={currentSample} sampleMean={currentSampleMean} />
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle>3. Distribution of Sample Means</CardTitle>
                        <CardDescription>This is the histogram of the *averages* from each handful drawn. Watch as it forms a bell curve!</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <SamplingDistributionChart sampleMeans={sampleMeans} />
                         <p className="text-center text-sm text-muted-foreground mt-2">Total Averages Collected: {sampleMeans.length} / {numSamples}</p>
                    </CardContent>
                </Card>
            </div>
        </div>
      </div>
    </>
  );
}
