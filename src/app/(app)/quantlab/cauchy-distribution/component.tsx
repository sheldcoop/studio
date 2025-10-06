
'use client';

import { useMemo } from 'react';
import dynamic from 'next/dynamic';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import ProbabilityDistributionPageClient from '@/components/app/probability-distribution-page-client';
import { cauchyPdf } from '@/lib/math/stats';

// --- Chart Component ---
const CauchyDistributionChart = ({ location = 0, scale = 1 }: { location?: number; scale?: number }) => {
  const chartData = useMemo(() => {
    const data = [];
    const points = 400;
    const range = Math.max(20, scale * 15);
    const start = location - range / 2;
    const end = location + range / 2;
    const step = (end - start) / points;

    for (let i = 0; i <= points; i++) {
        const x = start + i * step;
        data.push({ value: x, density: cauchyPdf(x, location, scale) });
    }
    return data;
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
                    <linearGradient id="fillCauchy" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0.1} />
                    </linearGradient>
                </defs>
                <Area type="monotone" dataKey="density" stroke="hsl(var(--chart-1))" fill="url(#fillCauchy)" strokeWidth={2} dot={false} />
            </AreaChart>
        </ChartContainer>
         <div className="grid grid-cols-2 text-center text-xs text-muted-foreground mt-4">
            <div>
                Median / Mode: <span className="font-semibold text-foreground block">{location.toFixed(2)}</span>
            </div>
            <div>
                Mean / Variance: <span className="font-semibold text-destructive block">Undefined</span>
            </div>
        </div>
    </div>
  );
};

const DynamicCauchyDistributionChart = dynamic(() => Promise.resolve(CauchyDistributionChart), {
  ssr: false,
  loading: () => <div className="h-[340px] w-full bg-muted rounded-lg animate-pulse" />,
});

// --- Main Page Component ---
export default function CauchyDistributionComponent() {
    
    const distribution = {
        title: "Cauchy Distribution",
        description: "Modeling extreme events and 'fat-tailed' phenomena.",
        card1: {
          title: "The 'Black Swan' Distribution",
          description: "The Cauchy distribution (also known as the Lorentz distribution) is a continuous probability distribution famous for its heavy, or 'fat,' tails. This means it assigns a much higher probability to extreme events compared to the normal distribution. In finance, it's a powerful conceptual tool for modeling phenomena where 'black swan' events are more common than traditional models suggest. Its most striking feature is that its expected value (mean) and variance are undefined. No matter how many samples you take, the average will not converge, making it a radical departure from well-behaved distributions like the Normal distribution."
        },
        card2: {
            title: "The Formula",
            description: "The probability density function (PDF) is given by:",
            formula: "f(x; x_0, \\gamma) = \\frac{1}{\\pi\\gamma \\left[1 + \\left(\\frac{x-x_0}{\\gamma}\\right)^2\\right]}",
            formulaItems: [
                "x_0 \\text{ is the location parameter, specifying the peak (median and mode).}",
                "\\gamma \\text{ (gamma) is the scale parameter, specifying the half-width at half-maximum.}"
            ]
        },
        card3: {
          title: "Interactive Cauchy Distribution",
          description: "Adjust the location (x₀) and scale (γ) parameters to see how the shape of the distribution changes. Note how the tails remain 'heavy' even with a small scale parameter.",
        },
    };

    const parameters = [
        { name: "location", label: "Location (x₀)", min: -5, max: 5, step: 0.1, initialValue: 0 },
        { name: "scale", label: "Scale (γ)", min: 0.1, max: 5, step: 0.1, initialValue: 1 },
    ];
    
    return (
        <ProbabilityDistributionPageClient
            distribution={distribution}
            parameters={parameters}
            ChartComponent={DynamicCauchyDistributionChart}
        />
    );
}
