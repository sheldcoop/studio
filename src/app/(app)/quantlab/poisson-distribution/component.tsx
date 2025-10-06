'use client';

import { useMemo } from 'react';
import dynamic from 'next/dynamic';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import ProbabilityDistributionPageClient from '@/components/app/probability-distribution-page-client';
import { poissonProbability } from '@/lib/math/stats';

// --- Chart Component ---
const PoissonDistributionChart = ({ lambda = 5 }: { lambda?: number }) => {
  const chartData = useMemo(() => {
    const data = [];
    const limit = Math.ceil(Math.max(20, lambda + 4 * Math.sqrt(lambda)));
    for (let k = 0; k <= limit; k++) {
      data.push({
        events: k.toString(),
        probability: poissonProbability(lambda, k),
      });
    }
    return data;
  }, [lambda]);
  
  const mean = lambda;
  const variance = lambda;

  return (
    <div>
        <ChartContainer config={{}} className="h-[300px] w-full">
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="events" name="Number of Events" />
                <YAxis name="Probability" domain={[0, 'dataMax']} />
                <Tooltip
                    content={<ChartTooltipContent
                        labelFormatter={(label) => `Events: ${label}`}
                        formatter={(value) => [Number(value).toFixed(4), 'Probability']}
                    />}
                />
                <Bar dataKey="probability" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            </BarChart>
        </ChartContainer>
         <div className="grid grid-cols-2 text-center text-xs text-muted-foreground mt-4">
            <div>
                Mean (μ = λ): <span className="font-semibold text-foreground block">{mean.toFixed(2)}</span>
            </div>
            <div>
                Variance (σ² = λ): <span className="font-semibold text-foreground block">{variance.toFixed(2)}</span>
            </div>
        </div>
    </div>
  );
};

const DynamicPoissonDistributionChart = dynamic(() => Promise.resolve(PoissonDistributionChart), {
  ssr: false,
  loading: () => <div className="h-[340px] w-full bg-muted rounded-lg animate-pulse" />,
});


// --- Main Page Component ---
export default function PoissonDistributionComponent() {
    
    const distribution = {
        title: "Poisson Distribution",
        description: "Modeling the number of events occurring in a fixed interval of time or space.",
        card1: {
          title: "The 'Rare Events' Distribution",
          description: "The Poisson Distribution is used to model the number of times an event occurs within a specified interval. The key assumptions are that events are independent, the average rate of events is constant, and two events cannot occur at the exact same instant. In finance, it's particularly useful for modeling rare events. For example, a credit analyst might use it to model the number of defaults in a large portfolio of loans over a month, or a trader might use it to model the number of times a stock's price jumps by more than 5% in a single day."
        },
        card2: {
            title: "The Formula",
            description: "The probability of observing exactly 'k' events in an interval is given by:",
            formula: "P(X=k) = \\frac{\\lambda^k e^{-\\lambda}}{k!}",
            formulaItems: [
                "k \\text{ is the number of occurrences of an event.}",
                "\\lambda \\text{ (lambda) is the average number of events per interval.}",
                "e \\text{ is Euler's number (approximately 2.71828).}"
            ]
        },
        card3: {
          title: "Interactive Poisson Distribution",
          description: "Adjust the rate parameter (λ) to see how the shape of the distribution changes. Notice how for large λ, the distribution starts to look like a normal distribution.",
        },
    };

    const parameters = [
        { name: "lambda", label: "Average Rate (λ)", min: 0.1, max: 20, step: 0.1, initialValue: 5 },
    ];
    
    return (
        <ProbabilityDistributionPageClient
            distribution={distribution}
            parameters={parameters}
            ChartComponent={DynamicPoissonDistributionChart}
        />
    );
}
