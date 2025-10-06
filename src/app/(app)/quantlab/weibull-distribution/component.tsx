
'use client';

import { useMemo } from 'react';
import dynamic from 'next/dynamic';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import ProbabilityDistributionPageClient from '@/components/app/probability-distribution-page-client';

// --- Math & Simulation Logic ---
const weibullPdf = (x: number, k: number, lambda: number): number => {
    if (x < 0 || k <= 0 || lambda <= 0) {
        return 0;
    }
    return (k / lambda) * Math.pow(x / lambda, k - 1) * Math.exp(-Math.pow(x / lambda, k));
};

// --- Chart Component ---
const WeibullDistributionChart = ({ shape = 2, scale = 1 }: { shape?: number; scale?: number }) => {
  const chartData = useMemo(() => {
    const data = [];
    const points = 200;
    const rangeEnd = scale * (shape < 1 ? 4 : 2.5);

    for (let i = 0; i <= points; i++) {
        const x = (i / points) * rangeEnd;
        let density = weibullPdf(x, shape, scale);
        if (!isFinite(density) || density > 5) {
            density = 5;
        }
        data.push({ value: x, density });
    }

    return { chartData: data };
  }, [shape, scale]);

  return (
    <div>
      <ChartContainer config={{}} className="h-[300px] w-full">
        <AreaChart data={chartData.chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="value" type="number" domain={[0, 'dataMax']} tickFormatter={(val) => val.toFixed(1)} name="Value (x)" />
          <YAxis name="Density" domain={[0, 'dataMax']} />
          <Tooltip
            content={<ChartTooltipContent
              labelFormatter={(label) => `Value: ${Number(label).toFixed(2)}`}
              formatter={(value) => [Number(value).toFixed(4), 'Density']}
            />}
          />
          <defs>
            <linearGradient id="fillWeibull" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.8} />
              <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0.1} />
            </linearGradient>
          </defs>
          <Area type="monotone" dataKey="density" stroke="hsl(var(--chart-1))" fill="url(#fillWeibull)" strokeWidth={2} dot={false} />
        </AreaChart>
      </ChartContainer>
    </div>
  );
};

const DynamicWeibullDistributionChart = dynamic(() => Promise.resolve(WeibullDistributionChart), {
  ssr: false,
  loading: () => <div className="h-[300px] w-full bg-muted rounded-lg animate-pulse" />,
});

// --- Main Page Component ---
export default function WeibullDistributionComponent() {
    const distribution = {
        title: "Weibull Distribution",
        description: "Modeling time-to-failure, event durations, and reliability.",
        card1: {
            title: "The 'Time-to-Event' Distribution",
            description: "The Weibull distribution is a highly flexible continuous probability distribution. It's widely used in engineering to model reliability and time-to-failure of components. In finance, it can be applied to model the duration of events, such as the time until a corporate bond defaults or the time a stock price stays above a certain level. Its flexibility comes from its shape parameter, k. Depending on the value of k, it can mimic the behavior of other distributions like the exponential (when k=1) or approximate the normal distribution (when k is around 3-4)."
        },
        card2: {
            title: "The Formula",
            description: "The probability density function (PDF) is given by:",
            formula: "f(x; k, \\lambda) = \\frac{k}{\\lambda} \\left(\\frac{x}{\\lambda}\\right)^{k-1} e^{-(x/\\lambda)^k}",
            formulaItems: [
                "x \\ge 0 \\text{ is the variable (e.g., time).}",
                "k > 0 \\text{ is the shape parameter. If k<1, failure rate decreases. If k=1, it's constant. If k>1, it increases.}",
                "\\lambda > 0 \\text{ is the scale parameter, stretching or contracting the distribution.}"
            ]
        },
        card3: {
            title: "Interactive Weibull Distribution",
            description: "Adjust the shape (k) and scale (λ) parameters to see how the distribution's form changes.",
        },
    };

    const parameters = [
        { name: "shape", label: "Shape (k)", min: 0.5, max: 5, step: 0.1, initialValue: 2 },
        { name: "scale", label: "Scale (λ)", min: 0.5, max: 5, step: 0.1, initialValue: 1 },
    ];
    
    return (
        <ProbabilityDistributionPageClient
            distribution={distribution}
            parameters={parameters}
            ChartComponent={DynamicWeibullDistributionChart}
        />
    );
}
