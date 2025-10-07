
'use client';

import { useMemo } from 'react';
import { ChartContainer, ChartTooltipContent, Chart } from '@/components/ui/chart';
import 'katex/dist/katex.min.css';
import ProbabilityDistributionPageClient from '@/components/app/probability-distribution-page-client';

// --- Chart Component ---
const DiscreteUniformDistributionChart = ({ n = 6 }: { n?: number }) => {
  const chartData = useMemo(() => {
    const data = [];
    const probability = 1 / n;
    for (let k = 1; k <= n; k++) {
      data.push({ outcome: k.toString(), probability: probability });
    }
    return data;
  }, [n]);

  return (
    <div>
        <ChartContainer config={{}} className="h-[300px] w-full">
            <Chart.BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <Chart.CartesianGrid strokeDasharray="3 3" vertical={false} />
                <Chart.XAxis dataKey="outcome" name="Outcome (k)" />
                <Chart.YAxis name="Probability" domain={[0, 1]} />
                <Chart.Tooltip
                    content={<ChartTooltipContent
                        labelFormatter={(label) => `Outcome: ${label}`}
                        formatter={(value) => [Number(value).toFixed(4), 'Probability']}
                    />}
                />
                <Chart.Bar dataKey="probability" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            </Chart.BarChart>
        </ChartContainer>
    </div>
  );
};


// --- Main Page Component ---
export default function DiscreteUniformDistributionComponent() {
    
    const distribution = {
        title: "Discrete Uniform Distribution",
        description: "The simplest scenario in probability: every outcome is equally likely.",
        card1: {
          title: "The 'Fair Die Roll' Distribution",
          description: "The Discrete Uniform distribution describes a situation where there are a finite number of outcomes, and each outcome is equally likely to occur. The most classic example is a single roll of a fair six-sided die. The possible outcomes are [1, 2, 3, 4, 5, 6], and the probability of rolling any one of these numbers is exactly 1/6. There is no bias towards any particular outcome."
        },
        card2: {
            title: "The Formula",
            description: "The probability mass function (PMF) is:",
            formula: "P(X=k) = \\frac{1}{n}",
            formulaItems: [
                "k \\text{ is a specific outcome.}",
                "n \\text{ is the total number of possible outcomes.}"
            ]
        },
        card3: {
          title: "Interactive Uniform Distribution",
          description: "Adjust the number of possible outcomes (n) to see how the probability changes.",
        },
    };

    const parameters = [
        { name: "n", label: "Number of Outcomes (n)", min: 2, max: 20, step: 1, initialValue: 6 },
    ];
    
    return (
        <ProbabilityDistributionPageClient
            distribution={distribution}
            parameters={parameters}
            ChartComponent={DiscreteUniformDistributionChart}
        />
    );
}
