
'use client';

import { useState, useEffect, useRef } from 'react';
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
import { ChartContainer, type ChartConfig } from '@/components/ui/chart';
import { Line, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, ReferenceLine, Legend } from 'recharts';
import { Skeleton } from '@/components/ui/skeleton';
import { Play, Pause, Plus, RefreshCw, Milestone } from 'lucide-react';
import { ChartTooltipContent } from '@/components/ui/chart';

type RollData = {
  rollCount: number;
  average: number;
};

const THEORETICAL_MEAN = 3.5;

const llnChartConfig = {
    average: {
      label: 'Sample Average',
      color: 'hsl(var(--chart-1))',
    },
    theoretical: {
      label: 'Theoretical Mean',
      color: 'hsl(var(--destructive))',
    }
} satisfies ChartConfig;

const LawOfLargeNumbersChart = ({ data }: { data: RollData[] }) => {
  if (data.length === 0) {
      return <Skeleton className="h-[400px] w-full" />
  }
  
  return (
    <ChartContainer config={llnChartConfig} className="h-[400px] w-full">
        <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis 
                type="number" 
                dataKey="rollCount" 
                name="Number of Rolls" 
                domain={['dataMin', 'dataMax']}
                tickFormatter={(val) => val.toLocaleString()}
            />
            <YAxis domain={[1, 6]} name="Average Roll" />
            <Tooltip content={<ChartTooltipContent indicator="dot" />} />
            <Legend />
            <Line
                type="monotone"
                dataKey="average"
                stroke="var(--color-average)"
                strokeWidth={2}
                dot={false}
            />
            <ReferenceLine
                y={THEORETICAL_MEAN}
                stroke="var(--color-theoretical)"
                strokeDasharray="3 3"
                strokeWidth={2}
            />
        </LineChart>
    </ChartContainer>
  );
};

const DynamicLLNChart = dynamic(() => Promise.resolve(LawOfLargeNumbersChart), { ssr: false, loading: () => <Skeleton className="h-[400px] w-full" /> });


export default function LawOfLargeNumbersPage() {
    const [rolls, setRolls] = useState<number[]>([]);
    const [chartData, setChartData] = useState<RollData[]>([]);
    const [isSimulating, setIsSimulating] = useState(false);
    const simulationRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const SIMULATION_CAP = 10000;

    const addRolls = (count: number) => {
        const newRolls = Array.from({ length: count }, () => Math.floor(Math.random() * 6) + 1);
        setRolls(prev => [...prev, ...newRolls]);
    }

    const resetSimulation = () => {
        if (simulationRef.current) {
            clearInterval(simulationRef.current);
        }
        setIsSimulating(false);
        setRolls([]);
        setChartData([]);
    }

    useEffect(() => {
        if (rolls.length > 0) {
            const newChartData: RollData[] = [];
            let sum = 0;
            const step = Math.max(1, Math.floor(rolls.length / 200)); // Keep chart data points manageable
            
            for (let i = 0; i < rolls.length; i++) {
                sum += rolls[i];
                if ((i + 1) % step === 0 || i === rolls.length - 1) {
                    newChartData.push({
                        rollCount: i + 1,
                        average: sum / (i + 1),
                    });
                }
            }
            setChartData(newChartData);
        }

        if (rolls.length >= SIMULATION_CAP && isSimulating) {
            setIsSimulating(false);
        }

    }, [rolls, isSimulating]);

    useEffect(() => {
        if (isSimulating && rolls.length < SIMULATION_CAP) {
            simulationRef.current = setInterval(() => {
                addRolls(100);
            }, 100);
        } else {
            if (simulationRef.current) {
                clearInterval(simulationRef.current);
            }
        }
        return () => {
            if (simulationRef.current) clearInterval(simulationRef.current);
        }
    }, [isSimulating, rolls.length]);


    return (
    <>
      <PageHeader
        title="The Law of Large Numbers"
        description="Watch how randomness converges to predictability as sample sizes grow."
        variant="aligned-left"
      />
      <div className="mx-auto max-w-5xl space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">What is the Law of Large Numbers?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-base leading-relaxed text-foreground/90">
            <p>
              The Law of Large Numbers (LLN) is a fundamental theorem of probability. It states that if you perform the same experiment a large number of times, the average of the results will get closer and closer to the true expected value.
            </p>
            <p>
              In simpler terms, it's why casinos are always profitable and insurance companies can accurately predict their payouts. While any single event is unpredictable, the average outcome over thousands or millions of events becomes incredibly stable and predictable. It's the principle that allows us to find order in chaos.
            </p>
          </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle className="font-headline flex items-center gap-2"><Milestone /> The Dice Roll Simulation</CardTitle>
                <CardDescription>
                    The theoretical average of a fair six-sided die is (1+2+3+4+5+6) / 6 = 3.5. Let's see how many rolls it takes for our sample average to get close to this true value.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <DynamicLLNChart data={chartData} />
                <div className="mt-6 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                    <div className="flex gap-2">
                         <Button onClick={() => addRolls(10)} disabled={isSimulating}><Plus className="h-4 w-4 mr-2" /> 10 Rolls</Button>
                         <Button onClick={() => addRolls(100)} disabled={isSimulating}><Plus className="h-4 w-4 mr-2" /> 100</Button>
                         <Button onClick={() => addRolls(1000)} disabled={isSimulating}><Plus className="h-4 w-4 mr-2" /> 1000</Button>
                    </div>
                     <Button onClick={() => setIsSimulating(prev => !prev)} variant={isSimulating ? "destructive" : "default"} disabled={rolls.length >= SIMULATION_CAP}>
                        {isSimulating ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
                        {isSimulating ? 'Pause Simulation' : 'Run Simulation'}
                     </Button>
                     <Button onClick={resetSimulation} variant="outline"><RefreshCw className="mr-2 h-4 w-4" /> Reset</Button>
                </div>
                 <div className="mt-6 text-center text-sm text-muted-foreground">
                    <p>Total Rolls: <span className="font-bold text-lg text-foreground">{rolls.length.toLocaleString()}</span> / {SIMULATION_CAP.toLocaleString()}</p>
                    <p>Current Sample Average: <span className="font-bold text-lg text-primary">{chartData.length > 0 ? chartData[chartData.length-1].average.toFixed(4) : 'N/A'}</span></p>
                </div>
            </CardContent>
        </Card>
      </div>
    </>
  );
}
