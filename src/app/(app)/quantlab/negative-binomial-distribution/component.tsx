
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

const negativeBinomialProbability = (r: number, p: number, k: number): number => {
    if (k < r) return 0;
    return combinations(k - 1, r - 1) * Math.pow(p, r) * Math.pow(1 - p, k - r);
};

// --- Chart Component ---
const NegativeBinomialDistributionChart = ({ r = 5, p = 0.5 }: { r?: number; p?: number }) => {
  const chartData = useMemo(() => {
    const data = [];
    const mean = r / p;
    const variance = r * (1 - p) / (p * p);
    const limit = Math.ceil(mean + 3 * Math.sqrt(variance));
    for (let k = r; k <= limit; k++) {
      data.push({
        trials: k.toString(),
        probability: negativeBinomialProbability(r, p, k),
      });
    }
    return data;
  }, [r, p]);

  return (
    <div>
        <ChartContainer config={{}} className="h-[300px] w-full">
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="trials" name="Number of Trials (k)" />
                <YAxis name="Probability" domain={[0, 'dataMax']} />
                <Tooltip
                    content={<ChartTooltipContent
                        labelFormatter={(label) => `Trials: ${label}`}
                        formatter={(value) => [Number(value).toFixed(4), 'Probability']}
                    />}
                />
                <Bar dataKey="probability" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            </BarChart>
        </ChartContainer>
    </div>
  );
};

const DynamicNegativeBinomialDistributionChart = dynamic(() => Promise.resolve(NegativeBinomialDistributionChart), {
  ssr: false,
  loading: () => <div className="h-[300px] w-full bg-muted rounded-lg animate-pulse" />,
});


// --- Main Page Component ---
export default function NegativeBinomialDistributionComponent() {
    
    const distribution = {
        title: "Negative Binomial Distribution",
        description: "Modeling the number of trials needed to achieve a specified number of successes.",
        card1: {
          title: "A Generalization of the Geometric Distribution",
          description: "The Negative Binomial distribution answers the question: \"How many trials will it take to get my r-th success?\" It is a generalization of the Geometric distribution, which is just the special case where r=1. In finance, a trader might use this to model how many trades it will take to achieve 10 winning trades. A venture capitalist could model how many startups they need to fund to get 3 successful exits."
        },
        card2: {
            title: "The Formula",
            description: "The probability that the r-th success occurs on the k-th trial is:",
            formula: "P(X=k) = \\binom{k-1}{r-1} p^r (1-p)^{k-r}",
            formulaItems: [
                "k \\text{ is the total number of trials.}",
                "r \\text{ is the desired number of successes.}",
                "p \\text{ is the probability of success on a single trial.}"
            ]
        },
        card3: {
          title: "Interactive Negative Binomial Distribution",
          description: "Adjust the required number of successes (r) and the probability (p) to see how the distribution changes.",
        },
    };

    const parameters = [
        { name: "r", label: "Number of Successes (r)", min: 1, max: 50, step: 1, initialValue: 5 },
        { name: "p", label: "Probability of Success (p)", min: 0.01, max: 0.99, step: 0.01, initialValue: 0.5 },
    ];
    
    return (
        <ProbabilityDistributionPageClient
            distribution={distribution}
            parameters={parameters}
            ChartComponent={DynamicNegativeBinomialDistributionChart}
        />
    );
}
