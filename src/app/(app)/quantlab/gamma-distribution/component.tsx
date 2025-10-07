
'use client';

import { useMemo } from 'react';
import { ChartContainer, ChartTooltipContent, Chart } from '@/components/ui/chart';
import { InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import ProbabilityDistributionPageClient from '@/components/app/probability-distribution-page-client';
import { gammaPdf } from '@/lib/math/stats';

// --- Chart Component ---
const GammaDistributionChart = ({ alpha = 2, beta = 1 }: { alpha?: number; beta?: number }) => {
  const { chartData, mean, variance } = useMemo(() => {
    const data = [];
    const points = 200;
    const rangeEnd = (alpha / beta) + 4 * Math.sqrt(alpha / (beta * beta));
    
    for (let i = 0; i <= points; i++) {
        const x = (i / points) * rangeEnd;
        data.push({ value: x, density: gammaPdf(x, alpha, beta) });
    }

    return { 
        chartData: data, 
        mean: alpha / beta, 
        variance: alpha / (beta * beta) 
    };
  }, [alpha, beta]);

  return (
    <div>
        <ChartContainer config={{}} className="h-[300px] w-full">
            <Chart.AreaChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <Chart.CartesianGrid strokeDasharray="3 3" vertical={false} />
                <Chart.XAxis dataKey="value" type="number" domain={[0, 'dataMax']} tickFormatter={(val) => val.toFixed(1)} name="Value" />
                <Chart.YAxis name="Density" domain={[0, 'dataMax']} />
                <Chart.Tooltip
                    content={<ChartTooltipContent
                        labelFormatter={(label) => `Value: ${Number(label).toFixed(2)}`}
                        formatter={(value) => [Number(value).toFixed(4), 'Density']}
                    />}
                />
                 <defs>
                    <linearGradient id="fillGamma" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0.1} />
                    </linearGradient>
                </defs>
                <Chart.Area type="monotone" dataKey="density" stroke="hsl(var(--chart-1))" fill="url(#fillGamma)" strokeWidth={2} dot={false} />
            </Chart.AreaChart>
        </ChartContainer>
         <div className="grid grid-cols-2 text-center text-xs text-muted-foreground mt-4">
            <div>
                Mean (α/β): <span className="font-semibold text-foreground block">{mean.toFixed(2)}</span>
            </div>
            <div>
                Variance (α/β²): <span className="font-semibold text-foreground block">{variance.toFixed(2)}</span>
            </div>
        </div>
    </div>
  );
};


// --- Main Page Component ---
export default function GammaDistributionComponent() {
    
    const distribution = {
        title: "Gamma Distribution",
        description: "Modeling waiting times and the sum of exponential variables.",
        card1: {
          title: "The 'Waiting Time' Distribution",
          description: "The Gamma distribution is a versatile, two-parameter continuous probability distribution that is strictly positive. It's often used to model the waiting time until a specified number of events occur. Think of it this way: if the time until the *next* bus arrives is modeled by an Exponential distribution, then the time until the *third* bus arrives is modeled by a Gamma distribution. In finance, it can be used to model the size of insurance claims, loan defaults, or operational losses, where the values are always positive and often skewed."
        },
        card2: {
            title: "The Formula",
            description: "The probability density function (PDF) is given by:",
            formula: "f(x; \\alpha, \\beta) = \\frac{\\beta^\\alpha}{\\Gamma(\\alpha)} x^{\\alpha-1} e^{-\\beta x}",
            formulaItems: [
                "x > 0",
                "\\alpha \\text{ (alpha) is the shape parameter.}",
                "\\beta \\text{ (beta) is the rate parameter.}",
                "\\Gamma(\\alpha) \\text{ is the Gamma function.}"
            ]
        },
        card3: {
          title: "Interactive Gamma Distribution",
          description: "Adjust the shape (α) and rate (β) parameters to see how the form of the distribution changes. Notice how for large α, it starts to resemble a normal distribution.",
        },
    };

    const parameters = [
        { name: "alpha", label: "Shape (α)", min: 1, max: 20, step: 0.1, initialValue: 2 },
        { name: "beta", label: "Rate (β)", min: 0.1, max: 5, step: 0.1, initialValue: 1 },
    ];
    
    return (
        <ProbabilityDistributionPageClient
            distribution={distribution}
            parameters={parameters}
            ChartComponent={GammaDistributionChart}
        />
    );
}
