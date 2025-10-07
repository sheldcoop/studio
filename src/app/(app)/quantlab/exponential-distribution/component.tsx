
'use client';

import { useMemo } from 'react';
import { ChartContainer, ChartTooltipContent, Chart } from '@/components/ui/chart';
import { InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import ProbabilityDistributionPageClient from '@/components/app/probability-distribution-page-client';
import { exponentialPdf } from '@/lib/math/stats';

// --- Chart Component ---
const ExponentialDistributionChart = ({ lambda = 1.5 }: { lambda?: number }) => {
  const { chartData, mean, variance } = useMemo(() => {
    const data = [];
    const points = 200;
    const rangeEnd = -Math.log(0.01) / lambda;
    
    for (let i = 0; i <= points; i++) {
        const x = (i / points) * rangeEnd;
        data.push({ value: x, density: exponentialPdf(x, lambda) });
    }

    return { 
        chartData: data, 
        mean: 1 / lambda, 
        variance: 1 / (lambda * lambda) 
    };
  }, [lambda]);

  return (
    <div>
        <ChartContainer config={{}} className="h-[300px] w-full">
            <Chart.AreaChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <Chart.CartesianGrid strokeDasharray="3 3" vertical={false} />
                <Chart.XAxis dataKey="value" type="number" domain={[0, 'dataMax']} tickFormatter={(val) => val.toFixed(1)} name="Value (x)" />
                <Chart.YAxis name="Density" domain={[0, 'dataMax']} />
                <Chart.Tooltip
                    content={<ChartTooltipContent
                        labelFormatter={(label) => `Value: ${Number(label).toFixed(2)}`}
                        formatter={(value) => [Number(value).toFixed(4), 'Density']}
                    />}
                />
                 <defs>
                    <linearGradient id="fillExponential" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0.1} />
                    </linearGradient>
                </defs>
                <Chart.Area type="monotone" dataKey="density" stroke="hsl(var(--chart-1))" fill="url(#fillExponential)" strokeWidth={2} dot={false} />
            </Chart.AreaChart>
        </ChartContainer>
         <div className="grid grid-cols-2 text-center text-xs text-muted-foreground mt-4">
            <div>
                Mean (1/λ): <span className="font-semibold text-foreground block">{mean.toFixed(2)}</span>
            </div>
            <div>
                Variance (1/λ²): <span className="font-semibold text-foreground block">{variance.toFixed(2)}</span>
            </div>
        </div>
    </div>
  );
};


// --- Main Page Component ---
export default function ExponentialDistributionComponent() {
    
    const distribution = {
        title: "Exponential Distribution",
        description: "Modeling the time until an event occurs in a Poisson process.",
        card1: {
          title: "The 'Time Between Events' Distribution",
          description: "The Exponential distribution is a continuous probability distribution that models the time between events in a Poisson point process, i.e., a process in which events occur continuously and independently at a constant average rate. It is the continuous analogue of the Geometric distribution. While the Geometric distribution models the number of trials until the first success, the Exponential distribution models the amount of time until the next event. In finance, it's used to model the time between trades, the time until a bond defaults, or the duration until a stock price hits a certain level."
        },
        card2: {
            title: "The Formula",
            description: "The probability density function (PDF) is given by:",
            formula: "f(x; \\lambda) = \\lambda e^{-\\lambda x}",
            formulaItems: [
                "x \\ge 0 \\text{ is the time variable.}",
                "\\lambda > 0 \\text{ (lambda) is the rate parameter, the average number of events per unit of time.}"
            ]
        },
        card3: {
          title: "Interactive Exponential Distribution",
          description: "Adjust the rate parameter (λ) to see how the shape of the distribution changes. A higher rate means events happen more frequently, so the probability of a short waiting time is high.",
        },
    };

    const parameters = [
        { name: "lambda", label: "Rate (λ)", min: 0.1, max: 5, step: 0.1, initialValue: 1.5 },
    ];
    
    return (
        <ProbabilityDistributionPageClient
            distribution={distribution}
            parameters={parameters}
            ChartComponent={ExponentialDistributionChart}
        />
    );
}
