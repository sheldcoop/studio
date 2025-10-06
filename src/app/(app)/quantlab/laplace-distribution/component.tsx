
'use client';

import { useMemo } from 'react';
import dynamic from 'next/dynamic';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import ProbabilityDistributionPageClient from '@/components/app/probability-distribution-page-client';

// --- Math & Simulation Logic ---
const laplacePdf = (x: number, mu: number, b: number): number => {
    if (b <= 0) return 0;
    return (1 / (2 * b)) * Math.exp(-Math.abs(x - mu) / b);
};

// --- Chart Component ---
const LaplaceDistributionChart = ({ location = 0, scale = 1 }: { location?: number; scale?: number }) => {
  const { chartData, mean, variance } = useMemo(() => {
    const data = [];
    const points = 400;
    const range = Math.max(20, scale * 15);
    const start = location - range / 2;
    const end = location + range / 2;
    const step = (end - start) / points;

    for (let i = 0; i <= points; i++) {
        const x = start + i * step;
        data.push({ value: x, density: laplacePdf(x, location, scale) });
    }
    
    return { 
        chartData: data, 
        mean: location, 
        variance: 2 * scale * scale 
    };
  }, [location, scale]);

  return (
    <div>
        <ChartContainer config={{}} className="h-[300px] w-full">
            <AreaChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="value" type="number" domain={['dataMin', 'dataMax']} tickFormatter={(val) => val.toFixed(1)} name="Value" />
                <YAxis name="Density" domain={[0, 'dataMax']} />
                <Tooltip
                    content={<ChartTooltipContent
                        labelFormatter={(label) => `Value: ${Number(label).toFixed(2)}`}
                        formatter={(value) => [Number(value).toFixed(4), 'Density']}
                    />}
                />
                 <defs>
                    <linearGradient id="fillLaplace" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0.1} />
                    </linearGradient>
                </defs>
                <Area type="monotone" dataKey="density" stroke="hsl(var(--chart-1))" fill="url(#fillLaplace)" strokeWidth={2} dot={false} />
            </AreaChart>
        </ChartContainer>
         <div className="grid grid-cols-2 text-center text-xs text-muted-foreground mt-4">
            <div>
                Mean / Median / Mode: <span className="font-semibold text-foreground block">{mean.toFixed(2)}</span>
            </div>
            <div>
                Variance (2b²): <span className="font-semibold text-foreground block">{variance.toFixed(2)}</span>
            </div>
        </div>
    </div>
  );
};

const DynamicLaplaceDistributionChart = dynamic(() => Promise.resolve(LaplaceDistributionChart), {
  ssr: false,
  loading: () => <div className="h-[340px] w-full bg-muted rounded-lg animate-pulse" />,
});


// --- Main Page Component ---
export default function LaplaceDistributionComponent() {
    
    const distribution = {
        title: "Laplace Distribution",
        description: "A sharp-peaked, fat-tailed alternative to the Normal Distribution.",
        card1: {
          title: "The 'Double Exponential' Distribution",
          description: "The Laplace distribution is a continuous probability distribution that is notable for its sharper peak at the mean and its 'fatter' tails compared to the Normal distribution. This means it assigns higher probability to values near the mean and also to extreme outlier events. In finance and machine learning, this makes it a valuable tool. It can model financial returns that are more prone to extreme events than a normal model would suggest. It is also intrinsically linked to LASSO (L1) regularization, a popular technique in regression for feature selection, because its shape naturally encourages some parameters to go to zero."
        },
        card2: {
            title: "The Formula",
            description: "The probability density function (PDF) is given by:",
            formula: "f(x | \\mu, b) = \\frac{1}{2b} \\exp\\left( -\\frac{|x - \\mu|}{b} \\right)",
            formulaItems: [
                "\\mu \\text{ (mu) is the location parameter (mean, median, and mode).}",
                "b > 0 \\text{ is the scale parameter, controlling the spread.}"
            ]
        },
        card3: {
          title: "Interactive Laplace Distribution",
          description: "Adjust the location (μ) and scale (b) parameters to see how the distinctive shape of the distribution changes.",
        },
    };

    const parameters = [
        { name: "location", label: "Location (μ)", min: -5, max: 5, step: 0.1, initialValue: 0 },
        { name: "scale", label: "Scale (b)", min: 0.1, max: 5, step: 0.1, initialValue: 1 },
    ];
    
    return (
        <ProbabilityDistributionPageClient
            distribution={distribution}
            parameters={parameters}
            ChartComponent={DynamicLaplaceDistributionChart}
        />
    );
}
