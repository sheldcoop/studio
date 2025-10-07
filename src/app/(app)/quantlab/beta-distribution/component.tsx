
'use client';

import { useMemo } from 'react';
import { ChartContainer, ChartTooltipContent, Chart } from '@/components/ui/chart';
import { InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import ProbabilityDistributionPageClient from '@/components/app/probability-distribution-page-client';
import { betaPdf } from '@/lib/math/stats';

// --- Chart Component ---
const BetaDistributionChart = ({ alpha = 2, beta = 5 }: { alpha?: number; beta?: number }) => {
  const { chartData, mean, variance } = useMemo(() => {
    const data = [];
    const points = 200;
    
    for (let i = 0; i <= points; i++) {
        const x = i / points;
        let density = betaPdf(x, alpha, beta);
        if (!isFinite(density) || density > 5) {
            density = 5;
        }
        data.push({ value: x, density });
    }

    return { 
        chartData: data, 
        mean: alpha / (alpha + beta), 
        variance: (alpha * beta) / (Math.pow(alpha + beta, 2) * (alpha + beta + 1))
    };
  }, [alpha, beta]);

  return (
    <div>
        <ChartContainer config={{}} className="h-[300px] w-full">
            <Chart.AreaChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <Chart.CartesianGrid strokeDasharray="3 3" vertical={false} />
                <Chart.XAxis dataKey="value" type="number" domain={[0, 1]} tickFormatter={(val) => val.toFixed(1)} name="Value" />
                <Chart.YAxis name="Density" domain={[0, 'dataMax + 0.5']} />
                <Chart.Tooltip
                    content={<ChartTooltipContent
                        labelFormatter={(label) => `Value: ${Number(label).toFixed(2)}`}
                        formatter={(value) => [Number(value).toFixed(4), 'Density']}
                    />}
                />
                 <defs>
                    <linearGradient id="fillBeta" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0.1} />
                    </linearGradient>
                </defs>
                <Chart.Area type="monotone" dataKey="density" stroke="hsl(var(--chart-1))" fill="url(#fillBeta)" strokeWidth={2} dot={false} />
            </Chart.AreaChart>
        </ChartContainer>
         <div className="grid grid-cols-2 text-center text-xs text-muted-foreground mt-4">
            <div>
                Mean (α/(α+β)): <span className="font-semibold text-foreground block">{mean.toFixed(3)}</span>
            </div>
            <div>
                Variance: <span className="font-semibold text-foreground block">{variance.toFixed(3)}</span>
            </div>
        </div>
    </div>
  );
};

// --- Main Page Component ---
export default function BetaDistributionComponent() {
    
    const distribution = {
        title: "Beta Distribution",
        description: "Modeling probabilities, percentages, and proportions.",
        card1: {
          title: "The 'Probability of Probabilities' Distribution",
          description: "The Beta distribution is a continuous probability distribution defined on the interval [0, 1]. This makes it perfectly suited for modeling random variables that represent probabilities or proportions. In quantitative finance, it's a powerful tool in Bayesian inference and risk modeling. For example, a credit analyst might use it to model the recovery rate on a defaulted loan (which must be between 0% and 100%). A trading strategist could use it to represent the probability of a particular signal being profitable."
        },
        card2: {
            title: "The Formula",
            description: "The probability density function (PDF) is given by:",
            formula: "f(x; \\alpha, \\beta) = \\frac{x^{\\alpha-1} (1-x)^{\\beta-1}}{B(\\alpha, \\beta)}",
            formulaItems: [
                "x \\text{ is the variable (between 0 and 1).}",
                "\\alpha \\text{ and } \\beta \\text{ are positive shape parameters.}",
                "B(\\alpha, \\beta) \\text{ is the Beta function, which normalizes the total probability to 1.}"
            ]
        },
        card3: {
          title: "Interactive Beta Distribution",
          description: "Adjust the shape parameters (α and β) to see how they influence the distribution. Note the wide variety of shapes the Beta distribution can take.",
        },
    };

    const parameters = [
        { name: "alpha", label: "Shape (α)", min: 0.1, max: 10, step: 0.1, initialValue: 2 },
        { name: "beta", label: "Shape (β)", min: 0.1, max: 10, step: 0.1, initialValue: 5 },
    ];
    
    return (
        <ProbabilityDistributionPageClient
            distribution={distribution}
            parameters={parameters}
            ChartComponent={BetaDistributionChart}
        />
    );
}
