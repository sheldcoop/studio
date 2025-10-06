'use client';

import { useMemo } from 'react';
import dynamic from 'next/dynamic';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import ProbabilityDistributionPageClient from '@/components/app/probability-distribution-page-client';
import { binomialProbability } from '@/lib/math/stats';

// --- Chart Component ---
const BinomialDistributionChart = ({ n = 20, p = 0.5 }: { n?: number, p?: number }) => {
  const chartData = useMemo(() => {
    const data = [];
    for (let k = 0; k <= n; k++) {
      data.push({
        successes: k.toString(),
        probability: binomialProbability(n, k, p),
      });
    }
    return data;
  }, [n, p]);

  const mean = n * p;
  const variance = n * p * (1 - p);

  return (
    <div>
        <ChartContainer config={{}} className="h-[300px] w-full">
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="successes" name="Number of Successes (k)" />
                <YAxis name="Probability" domain={[0, 'dataMax']} />
                <Tooltip
                    content={<ChartTooltipContent
                        labelFormatter={(label) => `Successes: ${label}`}
                        formatter={(value) => [Number(value).toFixed(4), 'Probability']}
                    />}
                />
                <Bar dataKey="probability" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            </BarChart>
        </ChartContainer>
         <div className="grid grid-cols-2 text-center text-xs text-muted-foreground mt-4">
            <div>
                Mean (μ = np): <span className="font-semibold text-foreground block">{mean.toFixed(2)}</span>
            </div>
            <div>
                Variance (σ² = np(1-p)): <span className="font-semibold text-foreground block">{variance.toFixed(2)}</span>
            </div>
        </div>
    </div>
  );
};

const DynamicBinomialDistributionChart = dynamic(() => Promise.resolve(BinomialDistributionChart), {
  ssr: false,
  loading: () => <div className="h-[340px] w-full bg-muted rounded-lg animate-pulse" />,
});


// --- Main Page Component ---
export default function BinomialDistributionComponent() {
    
    const distribution = {
        title: "Binomial Distribution",
        description: "Modeling the number of successes in a sequence of independent trials.",
        card1: {
          title: "The 'Coin Flip' Distribution",
          description: "The Binomial Distribution is a discrete probability distribution that models the number of successes in a fixed number of independent 'Bernoulli' trials, where each trial has only two possible outcomes: success or failure. Think of flipping a coin 10 times and counting the number of heads. In finance, this could model the number of winning trades in a month (where each trade is a trial), or the number of portfolio companies that meet their earnings target in a quarter."
        },
        card2: {
            title: "The Formula",
            description: "The probability of observing exactly 'k' successes in 'n' trials is:",
            formula: "P(X=k) = \\binom{n}{k} p^k (1-p)^{n-k}",
            formulaItems: [
                "\\binom{n}{k} is the number of combinations, 'n choose k'.",
                "n is the number of trials.",
                "k is the number of successes.",
                "p is the probability of success on a single trial."
            ]
        },
        card3: {
          title: "Interactive Binomial Distribution",
          description: "Adjust the number of trials (n) and the probability of success (p) to see how the shape of the distribution changes.",
        },
    };

    const parameters = [
        { name: "n", label: "Number of Trials (n)", min: 1, max: 100, step: 1, initialValue: 20 },
        { name: "p", label: "Probability of Success (p)", min: 0.01, max: 0.99, step: 0.01, initialValue: 0.5 },
    ];
    
    return (
        <ProbabilityDistributionPageClient
            distribution={distribution}
            parameters={parameters}
            ChartComponent={DynamicBinomialDistributionChart}
        />
    );
}
