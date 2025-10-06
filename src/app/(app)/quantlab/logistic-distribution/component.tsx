
'use client';

import { useMemo } from 'react';
import dynamic from 'next/dynamic';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import ProbabilityDistributionPageClient from '@/components/app/probability-distribution-page-client';
import { logisticPdf } from '@/lib/math/stats';

// --- Chart Component ---
const LogisticDistributionChart = ({ location = 0, scale = 1 }: { location?: number; scale?: number }) => {
  const { chartData, mean, variance } = useMemo(() => {
    const data = [];
    const points = 400;
    const range = Math.max(20, scale * 18);
    const start = location - range / 2;
    const end = location + range / 2;
    const step = (end - start) / points;

    for (let i = 0; i <= points; i++) {
        const x = start + i * step;
        data.push({ value: x, density: logisticPdf(x, location, scale) });
    }
    
    return { 
        chartData: data, 
        mean: location, 
        variance: (Math.pow(Math.PI, 2) * Math.pow(scale, 2)) / 3 
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
                    <linearGradient id="fillLogistic" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0.1} />
                    </linearGradient>
                </defs>
                <Area type="monotone" dataKey="density" stroke="hsl(var(--chart-1))" fill="url(#fillLogistic)" strokeWidth={2} dot={false} />
            </AreaChart>
        </ChartContainer>
         <div className="grid grid-cols-2 text-center text-xs text-muted-foreground mt-4">
            <div>
                Mean / Median / Mode: <span className="font-semibold text-foreground block">{mean.toFixed(2)}</span>
            </div>
            <div>
                Variance (π²s²/3): <span className="font-semibold text-foreground block">{variance.toFixed(2)}</span>
            </div>
        </div>
    </div>
  );
};

const DynamicLogisticDistributionChart = dynamic(() => Promise.resolve(LogisticDistributionChart), {
  ssr: false,
  loading: () => <div className="h-[340px] w-full bg-muted rounded-lg animate-pulse" />,
});


// --- Main Page Component ---
export default function LogisticDistributionComponent() {
    
    const distribution = {
        title: "Logistic Distribution",
        description: "A key distribution in machine learning and growth modeling.",
        card1: {
          title: "The 'Growth Curve' Distribution",
          description: "The Logistic distribution is a continuous probability distribution whose cumulative distribution function is the logistic function, which appears in logistic regression and feedforward neural networks. It resembles the normal distribution but has heavier tails, meaning it gives more probability to extreme events. In finance, it's used in credit risk modeling to estimate the probability of default. Its S-shaped cumulative distribution function is perfect for modeling phenomena that have a 'saturation' point, like the adoption rate of a new technology or the market share of a product."
        },
        card2: {
            title: "The Formula",
            description: "The probability density function (PDF) is given by:",
            formula: "f(x; \\mu, s) = \\frac{e^{-(x-\\mu)/s}}{s(1+e^{-(x-\\mu)/s})^2}",
            formulaItems: [
                "\\mu \\text{ (mu) is the location parameter (mean, median, and mode).}",
                "s > 0 \\text{ is the scale parameter, proportional to the standard deviation.}"
            ]
        },
        card3: {
          title: "Interactive Logistic Distribution",
          description: "Adjust the location (μ) and scale (s) parameters to see how the shape of the distribution changes.",
        },
    };

    const parameters = [
        { name: "location", label: "Location (μ)", min: -5, max: 5, step: 0.1, initialValue: 0 },
        { name: "scale", label: "Scale (s)", min: 0.2, max: 4, step: 0.1, initialValue: 1 },
    ];
    
    return (
        <ProbabilityDistributionPageClient
            distribution={distribution}
            parameters={parameters}
            ChartComponent={DynamicLogisticDistributionChart}
        />
    );
}
