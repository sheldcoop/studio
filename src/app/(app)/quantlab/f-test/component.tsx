
'use client';

import { useMemo } from 'react';
import { ChartContainer, ChartTooltipContent, Chart } from '@/components/ui/chart';
import { InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import ProbabilityDistributionPageClient from '@/components/app/probability-distribution-page-client';
import { fDistributionPdf } from '@/lib/math/stats';


// --- Chart Component ---
const FDistributionChart = ({ d1 = 5, d2 = 10 }: { d1?: number; d2?: number }) => {
  const { chartData, mean, variance } = useMemo(() => {
    const data = [];
    const points = 200;
    const calculatedMean = d2 > 2 ? d2 / (d2 - 2) : 1;
    const rangeEnd = Math.max(5, calculatedMean * 3);

    for (let i = 1; i <= points; i++) {
      const x = (i / points) * rangeEnd;
      let density = fDistributionPdf(x, d1, d2);
      if (!isFinite(density) || density > 5) {
        density = 5;
      }
      data.push({ value: x, density });
    }

    const calculatedVariance = d2 > 4 ? (2 * d2 * d2 * (d1 + d2 - 2)) / (d1 * (d2 - 2) * (d2 - 2) * (d2 - 4)) : Infinity;

    return { chartData: data, mean: calculatedMean, variance: calculatedVariance };
  }, [d1, d2]);

  return (
    <div>
      <ChartContainer config={{}} className="h-[300px] w-full">
        <Chart.AreaChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <Chart.CartesianGrid strokeDasharray="3 3" vertical={false} />
          <Chart.XAxis dataKey="value" type="number" domain={[0, 'dataMax']} tickFormatter={(val) => val.toFixed(1)} name="Value" />
          <Chart.YAxis name="Density" domain={[0, 'dataMax']} />
          <Chart.Tooltip
            content={<ChartTooltipContent
              labelFormatter={(label) => `Value: ${Number(label).toFixed(2)}`}
              formatter={(value) => [Number(value).toFixed(4), 'Density']}
            />}
          />
          <defs>
            <linearGradient id="fillF" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.8} />
              <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0.1} />
            </linearGradient>
          </defs>
          <Chart.Area type="monotone" dataKey="density" stroke="hsl(var(--chart-1))" fill="url(#fillF)" strokeWidth={2} dot={false} />
        </Chart.AreaChart>
      </ChartContainer>
      <div className="grid grid-cols-2 text-center text-xs text-muted-foreground mt-4">
        <div>
          Mean (for <InlineMath math="d_2 > 2" />): <span className="font-semibold text-foreground block">{isFinite(mean) ? mean.toFixed(3) : 'Undefined'}</span>
        </div>
        <div>
          Variance (for <InlineMath math="d_2 > 4" />): <span className="font-semibold text-foreground block">{isFinite(variance) ? variance.toFixed(3) : 'Undefined'}</span>
        </div>
      </div>
    </div>
  );
};


// --- Main Page Component ---
export default function FDistributionComponent() {

    const distribution = {
        title: "F-Distribution",
        description: "Comparing variances between two or more samples.",
        card1: {
            title: "The 'Ratio of Variances' Distribution",
            description: "The F-distribution is a continuous probability distribution that arises frequently as the null distribution of a test statistic, most notably in the Analysis of Variance (ANOVA) and the F-test to compare two variances. It describes the ratio of two independent chi-squared variables, each divided by their respective degrees of freedom. In practical terms, if you take two samples from normal populations, the ratio of their sample variances follows an F-distribution. This is why it's the cornerstone for checking if the volatility (variance) of two different stocks or trading strategies is significantly different."
        },
        card2: {
            title: "The Formula",
            description: "The probability density function (PDF) is defined by its two parameters: the degrees of freedom of the numerator (d₁) and the denominator (d₂).",
            formula: "f(x; d_1, d_2) = \\frac{\\sqrt{\\frac{(d_1 x)^{d_1} d_2^{d_2}}{(d_1 x + d_2)^{d_1 + d_2}}}}{x B(\\frac{d_1}{2}, \\frac{d_2}{2})}",
            formulaItems: [
                "d_1 \\text{ is the degrees of freedom for the numerator variance.}",
                "d_2 \\text{ is the degrees of freedom for the denominator variance.}",
                "B \\text{ is the Beta function.}"
            ]
        },
        card3: {
            title: "Interactive F-Distribution",
            description: "Adjust the degrees of freedom to see how they influence the shape of the distribution. Notice how it becomes more bell-shaped as the degrees of freedom increase.",
        },
    };

    const parameters = [
        { name: "d1", label: "Numerator Degrees of Freedom (d₁)", min: 1, max: 50, step: 1, initialValue: 5 },
        { name: "d2", label: "Denominator Degrees of Freedom (d₂)", min: 1, max: 50, step: 1, initialValue: 10 },
    ];
    
    return (
        <ProbabilityDistributionPageClient
            distribution={distribution}
            parameters={parameters}
            ChartComponent={FDistributionChart}
        />
    );
}
