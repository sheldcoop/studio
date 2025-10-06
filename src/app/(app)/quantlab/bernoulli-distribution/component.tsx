'use client';

import { useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import ProbabilityDistributionPageClient from '@/components/app/probability-distribution-page-client';

// --- Math & Simulation Logic ---
const bernoulliProbability = (p: number, k: number): number => {
    if (k === 1) return p;
    if (k === 0) return 1 - p;
    return 0;
};

// --- Chart Component ---
const BernoulliDistributionChart = ({ p = 0.7 }: { p?: number }) => {
  const chartData = useMemo(() => {
    return [
      { outcome: 'Failure (k=0)', probability: bernoulliProbability(p, 0) },
      { outcome: 'Success (k=1)', probability: bernoulliProbability(p, 1) },
    ];
  }, [p]);

  return (
    <ChartContainer config={{}} className="h-[300px] w-full">
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="outcome" />
            <YAxis name="Probability" domain={[0, 1]} />
            <Tooltip
                content={<ChartTooltipContent
                    formatter={(value) => [Number(value).toFixed(4), 'Probability']}
                />}
            />
            <Bar dataKey="probability" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
        </BarChart>
    </ChartContainer>
  );
};

const DynamicBernoulliDistributionChart = dynamic(() => Promise.resolve(BernoulliDistributionChart), {
  ssr: false,
  loading: () => <div className="h-[300px] w-full bg-muted rounded-lg animate-pulse" />,
});

// --- Main Page Component ---
export default function BernoulliDistributionComponent() {
  
  const distribution = {
    title: "Bernoulli Distribution",
    description: "The fundamental building block of discrete probability, modeling a single trial with two outcomes.",
    card1: {
      title: "The 'Single Coin Flip'",
      description: "The Bernoulli distribution is the simplest of all discrete distributions. It models a single event or trial that has only two possible outcomes: a 'success' or a 'failure'. Think of it as a single coin flip (Heads or Tails), a single trade (Win or Loss), or a single bond (Default or No Default). The entire distribution is described by a single parameter, p, which is the probability of success."
    },
    card2: {
        title: "The Formula",
        description: "The probability mass function (PMF) is:",
        formula: "P(X=k) = p^k (1-p)^{1-k} \\quad \\text{for } k \\in \\{0, 1\\}",
        formulaItems: [
            "If k=1 (success), the formula becomes p.",
            "If k=0 (failure), the formula becomes 1-p."
        ]
    },
    card3: {
      title: "Interactive Bernoulli Trial",
      description: "Adjust the probability of success (p) to see how it affects the outcome probabilities.",
    },
  };

  const parameters = [
    {
      name: "p",
      label: "Probability of Success (p)",
      min: 0,
      max: 1,
      step: 0.01,
      initialValue: 0.7,
    },
  ];

  return (
    <ProbabilityDistributionPageClient
      distribution={distribution}
      parameters={parameters}
      ChartComponent={DynamicBernoulliDistributionChart}
    />
  );
}