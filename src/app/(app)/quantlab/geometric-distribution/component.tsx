'use client';

import { useMemo } from 'react';
import dynamic from 'next/dynamic';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import ProbabilityDistributionPageClient from '@/components/app/probability-distribution-page-client';
import { geometricProbability } from '@/lib/math/stats';

// --- Chart Component ---
const GeometricDistributionChart = ({ p = 0.25 }: { p?: number }) => {
  const chartData = useMemo(() => {
    const data = [];
    const limit = Math.ceil(Math.max(15, 3 / p));
    for (let k = 1; k <= limit; k++) {
      data.push({ trials: k.toString(), probability: geometricProbability(p, k) });
    }
    return data;
  }, [p]);

  const mean = 1 / p;
  const variance = (1 - p) / (p * p);

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
         <div className="grid grid-cols-2 text-center text-xs text-muted-foreground mt-4">
            <div>
                Mean (<InlineMath math="\mu = 1/p" />): <span className="font-semibold text-foreground block">{mean.toFixed(2)}</span>
            </div>
            <div>
                Variance (<InlineMath math="\sigma^2 = (1-p)/p^2" />): <span className="font-semibold text-foreground block">{variance.toFixed(2)}</span>
            </div>
        </div>
    </div>
  );
};

const DynamicGeometricDistributionChart = dynamic(() => Promise.resolve(GeometricDistributionChart), {
  ssr: false,
  loading: () => <div className="h-[340px] w-full bg-muted rounded-lg animate-pulse" />,
});


// --- Main Page Component ---
export default function GeometricDistributionComponent() {
    
    const distribution = {
        title: "Geometric Distribution",
        description: "Modeling the number of trials needed to get the first success.",
        card1: {
          title: "'How Long Until It Hits?'",
          description: "The Geometric distribution answers the question: \"How many times do I have to try until I get my first success?\" It models the number of independent Bernoulli trials required to achieve the first success. In finance, this could model the number of trades you need to make until you have your first profitable one, or how many quarters it will take for a startup in your portfolio to finally turn a profit. It's always right-skewed, because a small number of trials is always more likely than a large number."
        },
        card2: {
            title: "The Formula",
            description: "The probability that the first success occurs on the k-th trial is:",
            formula: "P(X=k) = (1-p)^{k-1}p",
            formulaItems: [
                "k \\text{ is the number of trials (must be 1, 2, 3, ...).}",
                "p \\text{ is the probability of success on a single trial.}"
            ]
        },
        card3: {
          title: "Interactive Geometric Distribution",
          description: "Adjust the probability of success (p) to see how it affects the likelihood of achieving the first success on a given trial.",
        },
    };

    const parameters = [
        { name: "p", label: "Probability of Success (p)", min: 0.01, max: 0.99, step: 0.01, initialValue: 0.25 },
    ];
    
    return (
        <ProbabilityDistributionPageClient
            distribution={distribution}
            parameters={parameters}
            ChartComponent={DynamicGeometricDistributionChart}
        />
    );
}
