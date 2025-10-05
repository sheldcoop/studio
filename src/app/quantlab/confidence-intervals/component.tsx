
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
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { generateNormalData, getMean, getStdDev, inverseStandardNormalCdf } from '@/lib/math';
import { BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, ReferenceLine, ResponsiveContainer } from 'recharts';
import { ChartTooltipContent } from '@/components/ui/chart';
import { InlineMath, BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';

// --- Chart Component ---
const ConfidenceIntervalChart = ({ data, sampleMean, ci, popMean }: { data: number[], sampleMean: number, ci: { lower: number, upper: number }, popMean: number }) => {
    const chartData = useMemo(() => {
        if (data.length === 0) return [];
        const min = Math.min(...data);
        const max = Math.max(...data);
        const bins = 20;
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
        return hist;
    }, [data]);

    return (
        <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                <Tooltip content={<ChartTooltipContent />} />
                <Bar dataKey="count" fill="hsl(var(--primary))" opacity={0.5} />
                <ReferenceLine x={popMean} stroke="hsl(var(--destructive))" strokeWidth={2} label={{ value: `μ = ${popMean.toFixed(2)}`, position: 'top', fill: 'hsl(var(--destructive))' }} />
                <ReferenceLine x={sampleMean} stroke="hsl(var(--chart-2))" strokeWidth={2} label={{ value: `x̄ = ${sampleMean.toFixed(2)}`, position: 'insideTopRight', fill: 'hsl(var(--chart-2))' }} />
                <ReferenceLine x={ci.lower} stroke="hsl(var(--chart-2))" strokeDasharray="3 3" />
                <ReferenceLine x={ci.upper} stroke="hsl(var(--chart-2))" strokeDasharray="3 3" />
            </BarChart>
        </ResponsiveContainer>
    );
};

const DynamicCIChart = dynamic(() => Promise.resolve(ConfidenceIntervalChart), {
  ssr: false,
  loading: () => <Skeleton className="h-[300px] w-full" />,
});

// --- Main Page Component ---
export default function ConfidenceIntervalsPage() {
    const POPULATION_MEAN = 100;
    const POPULATION_STD_DEV = 15;
    
    const [confidence, setConfidence] = useState(95);
    const [sampleSize, setSampleSize] = useState(30);
    const [sample, setSample] = useState<number[]>([]);
    const [error, setError] = useState<string | null>(null);

    const { sampleMean, sampleStdDev, confidenceInterval } = useMemo(() => {
        if (sample.length === 0) return { sampleMean: 0, sampleStdDev: 0, confidenceInterval: { lower: 0, upper: 0 }};
        if(sampleSize <= 0) return { sampleMean: 0, sampleStdDev: 0, confidenceInterval: { lower: 0, upper: 0 }};


        const mean = getMean(sample);
        const stdDev = getStdDev(sample);
        const alpha = 1 - confidence / 100;
        const z_score = inverseStandardNormalCdf(1 - alpha / 2);
        const marginOfError = z_score * (stdDev / Math.sqrt(sampleSize));

        return {
            sampleMean: mean,
            sampleStdDev: stdDev,
            confidenceInterval: {
                lower: mean - marginOfError,
                upper: mean + marginOfError
            }
        };
    }, [sample, confidence, sampleSize]);
    
    const takeSample = () => {
         if (sampleSize <= 0) {
            setError("Sample size must be greater than 0.");
            return;
        }
        setError(null);
        setSample(generateNormalData(POPULATION_MEAN, POPULATION_STD_DEV, sampleSize));
    }
    
    useEffect(() => {
        takeSample();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const doesCiContainMean = useMemo(() => {
        if (!confidenceInterval) return false;
        return POPULATION_MEAN >= confidenceInterval.lower && POPULATION_MEAN <= confidenceInterval.upper;
    }, [confidenceInterval]);

    return (
        <>
            <PageHeader
                title="Confidence Intervals"
                description="Quantifying uncertainty by estimating a range where a true population parameter likely lies."
                variant="aligned-left"
            />
            <div className="mx-auto max-w-5xl space-y-8">
                <Card>
                    <CardHeader>
                        <CardTitle className="font-headline">What is a Confidence Interval?</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 text-base leading-relaxed">
                        <p>In statistics, we often can't know the true mean (<InlineMath math="\mu" />) of a whole population. Instead, we take a sample and calculate its mean (<InlineMath math="\bar{x}" />). A confidence interval gives us a range of values around our sample mean where we can be reasonably sure the true population mean lies.</p>
                        <p>A 95% confidence interval doesn't mean there's a 95% chance the true mean is in *this specific* interval. It means that if we were to repeat this sampling process many times, 95% of the confidence intervals we construct would contain the true population mean.</p>
                        <div className="rounded-lg border bg-muted/50 p-4 text-center">
                            <BlockMath math="\text{CI} = \bar{x} \pm Z_{\alpha/2} \cdot \frac{\sigma}{\sqrt{n}}" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Interactive Simulation</CardTitle>
                        <CardDescription>Adjust the confidence level and sample size, then take new samples to see how the interval changes.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div className="space-y-2">
                                <Label htmlFor="confidence-slider">Confidence Level: {confidence}%</Label>
                                <Slider id="confidence-slider" min={50} max={99} step={1} value={[confidence]} onValueChange={val => setConfidence(val[0])} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="sample-size-input">Sample Size (n)</Label>
                                <Input id="sample-size-input" type="number" value={sampleSize} onChange={e => setSampleSize(Number(e.target.value))} min="1" />
                            </div>
                        </div>
                        <Button onClick={takeSample} className="w-full mb-4">Take New Sample</Button>
                        
                        {error && <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>}

                        <DynamicCIChart data={sample} sampleMean={sampleMean} ci={confidenceInterval} popMean={POPULATION_MEAN} />
                        
                        <div className="mt-4 grid grid-cols-2 text-center text-sm gap-4">
                            <Card className="p-3">
                                <CardDescription>Sample Mean (<InlineMath math="\bar{x}" />)</CardDescription>
                                <p className="font-bold text-lg">{sampleMean.toFixed(2)}</p>
                            </Card>
                            <Card className={cn("p-3 transition-colors", doesCiContainMean ? 'bg-green-500/10 border-green-500/50' : 'bg-red-500/10 border-red-500/50')}>
                                <CardDescription>Confidence Interval</CardDescription>
                                <p className="font-bold text-lg">[{confidenceInterval.lower.toFixed(2)}, {confidenceInterval.upper.toFixed(2)}]</p>
                            </Card>
                        </div>
                         <Alert className={cn("mt-4 text-center", doesCiContainMean ? 'border-green-500/50 text-green-700' : 'border-red-500/50 text-red-600')}>
                            <AlertDescription>
                                The true population mean (<InlineMath math="\mu" /> = {POPULATION_MEAN}) is {doesCiContainMean ? '' : <span className="font-bold">NOT</span>} contained in this interval.
                            </AlertDescription>
                        </Alert>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}
