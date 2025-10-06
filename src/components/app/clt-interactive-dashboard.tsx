
'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Slider } from '@/components/ui/slider';
import { BarChart, Bar, ResponsiveContainer, ReferenceLine, Line } from 'recharts';
import { generateExponentialData, getMean, getStdDev, generateLogNormalData } from '@/lib/math';
import { Loader2 } from 'lucide-react';
import { XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { InlineMath } from 'react-katex';


type DistributionType = 'uniform' | 'exponential' | 'lognormal';

// --- Chart Components ---

const PopulationChart = ({ distribution }: { distribution: DistributionType }) => {
  const { data, mean, stdDev } = useMemo(() => {
    let rawData;
    let calculatedMean: number;
    let calculatedStdDev: number;
    const numPoints = 2000;

    switch (distribution) {
      case 'lognormal':
        rawData = generateLogNormalData(0, 0.5, numPoints);
        calculatedMean = Math.exp(0 + (0.5**2)/2);
        calculatedStdDev = Math.sqrt((Math.exp(0.5**2) - 1) * Math.exp(2*0 + 0.5**2));
        break;
      case 'uniform':
        rawData = Array.from({ length: numPoints }, () => Math.random() * 10);
        calculatedMean = 5;
        calculatedStdDev = Math.sqrt(((10-0)**2)/12);
        break;
      case 'exponential': 
      default:
        rawData = generateExponentialData(2, numPoints);
        calculatedMean = 1/2;
        calculatedStdDev = 1/2;
        break;
    }

    const maxVal = Math.max(...rawData, 5);
    const bins = 20;
    const binWidth = maxVal / bins;
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
        <div className="text-center text-xs text-muted-foreground mt-2 space-x-2">
            <span>Population Mean (<InlineMath math="\mu" />): {mean.toFixed(2)},</span>
            <span>Population Std Dev (<InlineMath math="\sigma" />): {stdDev.toFixed(2)}</span>
        </div>
    </>
  );
};

const SampleChart = ({ sample, sampleMean }: { sample: number[], sampleMean: number | null }) => {
    const data = useMemo(() => {
        if (!sample || sample.length === 0) return [];
        const minVal = 0;
        const maxVal = Math.max(...sample, 1);
        const bins = 15;
        const binWidth = maxVal / bins;
        const histogram = Array(bins).fill(0);
        sample.forEach(d => {
            const binIndex = Math.floor((d - minVal) / binWidth);
            if (binIndex >= 0 && binIndex < bins) {
                histogram[binIndex]++;
            }
        });
        return histogram.map((count, i) => ({
            name: (i * binWidth).toFixed(1),
            count,
        }));
    }, [sample]);

    return (
        <ResponsiveContainer width="100%" height={200}>
            <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
                <Tooltip wrapperClassName="text-xs" />
                <Bar dataKey="count" fill="hsl(var(--chart-2))" />
                {sampleMean !== null && (
                     <ReferenceLine x={sampleMean} stroke="hsl(var(--destructive))" strokeWidth={2} label={{ value: `Mean: ${sampleMean.toFixed(2)}`, position: 'insideTop', fill: 'hsl(var(--destructive))', fontSize: 12 }} />
                )}
            </BarChart>
        </ResponsiveContainer>
    );
}

const SamplingDistributionChart = ({ sampleMeans }: { sampleMeans: number[] }) => {
  const { data, overallMean, stdErr } = useMemo(() => {
    if (sampleMeans.length === 0) return { data: [], overallMean: 0, stdErr: 0 };
    const min = Math.min(...sampleMeans);
    const max = Math.max(...sampleMeans);
    const bins = 30; // Increased bin size for a smoother look
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
    const stdDevOfMeans = getStdDev(sampleMeans);
    
    return { data: histData, overallMean: meanOfMeans, stdErr: stdDevOfMeans };
  }, [sampleMeans]);
  
  return (
    <>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" vertical={false}/>
          <XAxis dataKey="name" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
          <Tooltip wrapperClassName="text-xs" />
          <Bar dataKey="count" fill="hsl(var(--primary))" fillOpacity={0.7} />
          {sampleMeans.length > 1 && (
              <ReferenceLine x={overallMean} stroke="hsl(var(--destructive))" strokeWidth={2} label={{ value: `Mean of Means`, position: 'insideTopRight', fill: 'hsl(var(--destructive))', fontSize: 12 }} />
          )}
          {data.length > 1 &&
            <Line
                data={data}
                dataKey="count"
                type="monotone"
                stroke="hsl(var(--chart-2))"
                strokeWidth={2}
                dot={false}
                yAxisId={0}
            />
           }
        </BarChart>
      </ResponsiveContainer>
      <div className="grid grid-cols-2 text-center text-xs text-muted-foreground mt-2">
        <div>
            Mean of Sample Means (<InlineMath math="\bar{x}" />): <span className="font-semibold text-foreground block">{overallMean.toFixed(3)}</span>
        </div>
        <div>
            Std. Dev. of Sample Means (Std. Error): <span className="font-semibold text-foreground block">{stdErr.toFixed(3)}</span>
        </div>
      </div>
    </>
  );
};


// --- Main Page ---

export function CLT_Interactive_Dashboard() {
  const [distribution, setDistribution] = useState<DistributionType>('uniform');
  const [sampleSize, setSampleSize] = useState(30);
  const [numSamples, setNumSamples] = useState(1000);
  const [simulationSpeed, setSimulationSpeed] = useState(50);

  const [sampleMeans, setSampleMeans] = useState<number[]>([]);
  const [currentSample, setCurrentSample] = useState<number[]>([]);
  const [currentSampleMean, setCurrentSampleMean] = useState<number | null>(null);

  const [isSampling, setIsSampling] = useState(false);
  const simulationIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const stopSimulation = () => {
      if (simulationIntervalRef.current) {
          clearTimeout(simulationIntervalRef.current);
      }
      setIsSampling(false);
      simulationIntervalRef.current = null;
  }

  const runSimulation = () => {
    stopSimulation();

    setIsSampling(true);
    setSampleMeans([]);
    setCurrentSample([]);
    setCurrentSampleMean(null);

    const allMeans: number[] = [];
    let samplesDrawn = 0;

    const tick = () => {
        if (samplesDrawn >= numSamples) {
            stopSimulation();
            setCurrentSample([]);
            setCurrentSampleMean(null);
            return;
        }

        let sample;
        switch (distribution) {
          case 'lognormal':
            sample = generateLogNormalData(0, 0.5, sampleSize);
            break;
          case 'uniform':
            sample = Array.from({ length: sampleSize }, () => Math.random() * 10);
            break;
          case 'exponential':
          default:
            sample = generateExponentialData(2, sampleSize);
            break;
        }
        
        const mean = getMean(sample);
        
        setCurrentSample(sample);
        setCurrentSampleMean(mean);

        allMeans.push(mean);
        setSampleMeans([...allMeans]);
        
        samplesDrawn++;
        
        const delay = 200 - simulationSpeed * 1.9;
        simulationIntervalRef.current = setTimeout(tick, delay);
    };

    tick();
  };

  const handleStartStop = () => {
      if (isSampling) {
          stopSimulation();
      } else {
          runSimulation();
      }
  }
  
  // Clean up on unmount
  useEffect(() => {
    return () => stopSimulation();
  }, []);

  const handleDistributionChange = (val: DistributionType) => {
    stopSimulation();
    setDistribution(val);
    setSampleMeans([]);
    setCurrentSample([]);
    setCurrentSampleMean(null);
  }


  return (
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
                          <RadioGroup value={distribution} onValueChange={(val: string) => handleDistributionChange(val as DistributionType)}>
                              <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="uniform" id="uniform" />
                                  <Label htmlFor="uniform">Uniform</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="exponential" id="exponential" />
                                  <Label htmlFor="exponential">Exponential (Skewed)</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="lognormal" id="lognormal" />
                                  <Label htmlFor="lognormal">Log-Normal (Skewed)</Label>
                              </div>
                          </RadioGroup>
                      </div>
                      <div className="space-y-3">
                          <Label htmlFor="sample-size-slider">2. Set the Sample Size (<InlineMath math="n" />)</Label>
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
                              <Slider id="speed-slider" min={1} max={100} step={1} value={[simulationSpeed]} onValueChange={(val) => setSimulationSpeed(val[0])} />
                              <span className="font-mono text-lg w-12 text-center">{simulationSpeed}</span>
                          </div>
                      </div>
                      <Button onClick={handleStartStop} className="w-full !mt-8">
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
  );
}
