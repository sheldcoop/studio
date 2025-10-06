
'use client';

import { useMemo } from 'react';
import dynamic from 'next/dynamic';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
import { BlockMath, InlineMath } from 'react-katex';
import { standardNormalPdf, tDistributionPdf } from '@/lib/math/stats';
import 'katex/dist/katex.min.css';
import ProbabilityDistributionPageClient from '@/components/app/probability-distribution-page-client';

// --- Chart Component ---
const TDistributionChart = ({ df = 5 }: { df?: number }) => {
  const { chartData, variance } = useMemo(() => {
    const data = [];
    const points = 400;
    const range = 8;
    const step = range / points;
    const start = -range / 2;

    for (let i = 0; i <= points; i++) {
      const x = start + i * step;
      data.push({
        value: x,
        t_density: tDistributionPdf(x, df),
        normal_density: standardNormalPdf(x),
      });
    }
    return { chartData: data, variance: df > 2 ? df / (df - 2) : Infinity };
  }, [df]);

  return (
    <div>
      <ChartContainer config={{}} className="h-[300px] w-full">
        <AreaChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="value" type="number" domain={[-4, 4]} tickFormatter={(val) => val.toFixed(1)} name="Value" />
          <YAxis name="Density" domain={[0, 0.45]} />
          <Tooltip
            content={<ChartTooltipContent labelFormatter={(label) => `Value: ${Number(label).toFixed(2)}`} />}
          />
          <defs>
            <linearGradient id="fillT" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.8} />
              <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0.1} />
            </linearGradient>
          </defs>
          <Area type="monotone" dataKey="t_density" name="t-Distribution" stroke="hsl(var(--chart-1))" fill="url(#fillT)" strokeWidth={2} dot={false} />
          <Area type="monotone" dataKey="normal_density" name="Normal Distribution" stroke="hsl(var(--muted-foreground))" strokeDasharray="3 3" fill="transparent" strokeWidth={1.5} dot={false} />
        </AreaChart>
      </ChartContainer>
      <div className="grid grid-cols-2 text-center text-xs text-muted-foreground mt-4">
        <div>
          Mean: <span className="font-semibold text-foreground block">0</span>
        </div>
        <div>
          Variance (for df &gt; 2): <span className="font-semibold text-foreground block">{isFinite(variance) ? variance.toFixed(3) : 'Undefined'}</span>
        </div>
      </div>
    </div>
  );
};

const DynamicTDistributionChart = dynamic(() => Promise.resolve(TDistributionChart), {
  ssr: false,
  loading: () => <div className="h-[340px] w-full bg-muted rounded-lg animate-pulse" />,
});

// --- Main Page Component ---
export default function TDistributionComponent() {
    const distribution = {
        title: "Student's t-Distribution",
        description: "The backbone of hypothesis testing with small sample sizes.",
        card1: {
            title: "The 'Small Sample' Distribution",
            description: "The t-distribution is a type of probability distribution that is similar to the normal distribution but has heavier tails. This means it assigns more probability to extreme values. It is used in place of the normal distribution when you have small sample sizes (typically n < 30) and the population standard deviation is unknown. In finance, this is incredibly common. You rarely know the true volatility of an asset and often work with limited historical data. The t-distribution provides a more cautious and robust framework for constructing confidence intervals and performing hypothesis tests (like the t-test) in these real-world scenarios."
        },
        card2: {
            title: "The Formula",
            description: "The probability density function (PDF) is defined by its single parameter: the degrees of freedom (ν or `df`).",
            formula: "f(t) = \\frac{\\Gamma(\\frac{\\nu+1}{2})}{\\sqrt{\\nu\\pi}\\Gamma(\\frac{\\nu}{2})} \\left(1 + \\frac{t^2}{\\nu}\\right)^{-\\frac{\\nu+1}{2}}",
            formulaItems: [
                "\\nu \\text{ (nu) represents the degrees of freedom, typically (n - 1).}",
                "\\Gamma \\text{ is the Gamma function.}"
            ]
        },
        card3: {
            title: "Interactive t-Distribution",
            description: "Adjust the degrees of freedom to see how the t-distribution compares to the standard normal distribution. Notice how it converges to the normal distribution as `df` increases.",
        },
    };

    const parameters = [
        { name: "df", label: "Degrees of Freedom (df)", min: 1, max: 50, step: 1, initialValue: 5 },
    ];
    
    return (
        <ProbabilityDistributionPageClient
            distribution={distribution}
            parameters={parameters}
            ChartComponent={DynamicTDistributionChart}
        />
    );
}
