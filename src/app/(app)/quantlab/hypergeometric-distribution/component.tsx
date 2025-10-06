
'use client';

import { useMemo } from 'react';
import dynamic from 'next/dynamic';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import ProbabilityDistributionPageClient from '@/components/app/probability-distribution-page-client';

// --- Math & Simulation Logic ---
const combinations = (n: number, k: number): number => {
    if (k < 0 || k > n) return 0;
    if (k === 0 || k === n) return 1;
    if (k > n / 2) k = n - k;
    let res = 1;
    for (let i = 1; i <= k; i++) {
        res = res * (n - i + 1) / i;
    }
    return res;
};

const hypergeometricProbability = (N: number, K: number, n: number, k: number): number => {
    const num = combinations(K, k) * combinations(N - K, n - k);
    const den = combinations(N, n);
    return den > 0 ? num / den : 0;
};

// --- Chart Component ---
const HypergeometricDistributionChart = ({ N = 52, K = 13, n = 5 }: { N?: number; K?: number; n?: number }) => {
  const chartData = useMemo(() => {
    const data = [];
    const min_k = Math.max(0, n - (N - K));
    const max_k = Math.min(n, K);
    for (let k = min_k; k <= max_k; k++) {
      data.push({
        successes: k.toString(),
        probability: hypergeometricProbability(N, K, n, k),
      });
    }
    return data;
  }, [N, K, n]);

  const mean = n * (K / N);

  return (
    <div>
        <ChartContainer config={{}} className="h-[300px] w-full">
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="successes" name="Number of Successes in Sample (k)" />
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
         <div className="grid grid-cols-1 text-center text-xs text-muted-foreground mt-4">
            <div>
                Mean (<InlineMath math="\mu = n \cdot (K/N)" />): <span className="font-semibold text-foreground block">{mean.toFixed(2)}</span>
            </div>
        </div>
    </div>
  );
};

const DynamicHypergeometricDistributionChart = dynamic(() => Promise.resolve(HypergeometricDistributionChart), {
  ssr: false,
  loading: () => <div className="h-[340px] w-full bg-muted rounded-lg animate-pulse" />,
});

// --- Main Page Component ---
export default function HypergeometricDistributionComponent() {
    
    const distribution = {
        title: "Hypergeometric Distribution",
        description: "Modeling the probability of successes in a sample drawn without replacement.",
        card1: {
          title: "The 'Drawing from a Deck' Distribution",
          description: "The Hypergeometric distribution is used when you are sampling from a finite population without replacement. This is a key difference from the Binomial distribution, where each trial is independent. The classic example is drawing cards from a deck. If you draw a 5-card hand, what's the probability of getting exactly 2 spades? In finance, this can model credit risk in a portfolio of bonds: if you have a portfolio of 100 bonds and know that 5 will default, what is the probability that if you randomly select 10 bonds, exactly 1 of them will be a defaulter?"
        },
        card2: {
            title: "The Formula",
            description: "The probability of getting k successes in a sample of size n is:",
            formula: "P(X=k) = \\frac{\\binom{K}{k} \\binom{N-K}{n-k}}{\\binom{N}{n}}",
            formulaItems: [
                "N \\text{ is the total population size.}",
                "K \\text{ is the total number of 'success' items in the population.}",
                "n \\text{ is the size of the sample drawn.}",
                "k \\text{ is the number of 'successes' in the sample.}"
            ]
        },
        card3: {
          title: "Interactive Hypergeometric Distribution",
          description: "Adjust the parameters of the population and sample to see how the probabilities change.",
        },
    };

    const parameters = [
        { name: "N", label: "Population Size (N)", min: 10, max: 200, step: 1, initialValue: 52 },
        { name: "K", label: "Population Successes (K)", min: 1, max: 200, step: 1, initialValue: 13 },
        { name: "n", label: "Sample Size (n)", min: 1, max: 52, step: 1, initialValue: 5 },
    ];
    
    return (
        <ProbabilityDistributionPageClient
            distribution={distribution}
            parameters={parameters}
            ChartComponent={DynamicHypergeometricDistributionChart}
        />
    );
}
