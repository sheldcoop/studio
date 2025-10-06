
'use client';

import { useMemo } from 'react';
import dynamic from 'next/dynamic';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import ProbabilityDistributionPageClient from '@/components/app/probability-distribution-page-client';
import { chiSquaredPdf } from '@/lib/math/stats';

// --- Chart Component ---
const ChiSquaredDistributionChart = ({ df = 5 }: { df?: number }) => {
  const { chartData, mean, variance } = useMemo(() => {
    const data = [];
    const points = 200;
    const rangeEnd = Math.max(10, df + 4 * Math.sqrt(2 * df));

    for (let i = 1; i <= points; i++) {
        const x = (i / points) * rangeEnd;
        let density = chiSquaredPdf(x, df);
        if (!isFinite(density) || density > 5) {
            density = 5;
        }
        data.push({ value: x, density });
    }
    
    return { 
        chartData: data, 
        mean: df, 
        variance: 2 * df 
    };
  }, [df]);

  return (
    <div>
        <ChartContainer config={{}} className="h-[300px] w-full">
            <AreaChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="value" type="number" domain={[0, 'dataMax']} tickFormatter={(val) => val.toFixed(1)} name="Value" />
                <YAxis name="Density" domain={[0, 'dataMax']} />
                <Tooltip
                    content={<ChartTooltipContent
                        labelFormatter={(label) => `Value: ${Number(label).toFixed(2)}`}
                        formatter={(value) => [Number(value).toFixed(4), 'Density']}
                    />}
                />
                 <defs>
                    <linearGradient id="fillChi" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0.1} />
                    </linearGradient>
                </defs>
                <Area type="monotone" dataKey="density" stroke="hsl(var(--chart-1))" fill="url(#fillChi)" strokeWidth={2} dot={false} />
            </AreaChart>
        </ChartContainer>
         <div className="grid grid-cols-2 text-center text-xs text-muted-foreground mt-4">
            <div>
                Mean (k): <span className="font-semibold text-foreground block">{mean.toFixed(2)}</span>
            </div>
            <div>
                Variance (2k): <span className="font-semibold text-foreground block">{variance.toFixed(2)}</span>
            </div>
        </div>
    </div>
  );
};

const DynamicChiSquaredDistributionChart = dynamic(() => Promise.resolve(ChiSquaredDistributionChart), {
  ssr: false,
  loading: () => <div className="h-[340px] w-full bg-muted rounded-lg animate-pulse" />,
});


// --- Main Page Component ---
export default function ChiSquaredDistributionComponent() {

    const distribution = {
        title: "Chi-Squared (χ²) Distribution",
        description: "The distribution of the sum of squared standard normal deviates.",
        card1: {
            title: 'The "Goodness of Fit" Distribution',
            description: "The Chi-Squared (χ²) distribution is a continuous probability distribution that is widely used in hypothesis testing. It arises as the distribution of a sum of squared independent standard normal random variables. In finance and econometrics, it is the backbone of the Chi-Squared test, which is used to test the goodness of fit of a model, check for independence between categorical variables, and compare variances. For instance, a risk manager might use it to test if the observed frequency of portfolio losses matches the frequency predicted by their risk model."
        },
        card2: {
            title: "The Formula",
            description: "The probability density function (PDF) is defined by one parameter: the degrees of freedom (k).",
            formula: "f(x; k) = \\frac{1}{2^{k/2}\\Gamma(k/2)} x^{k/2-1} e^{-x/2}",
            formulaItems: [
                "x \\ge 0 \\text{ is the variable.}",
                "k \\text{ represents the degrees of freedom.}",
                "\\Gamma(k/2) \\text{ is the Gamma function.}"
            ]
        },
        card3: {
            title: "Interactive χ² Distribution",
            description: "Adjust the degrees of freedom to see how the shape of the distribution changes. Notice how it becomes more symmetric and bell-shaped as the degrees of freedom increase.",
        },
    };

    const parameters = [
        { name: "df", label: "Degrees of Freedom (k)", min: 1, max: 30, step: 1, initialValue: 5 },
    ];
    
    return (
        <ProbabilityDistributionPageClient
            distribution={distribution}
            parameters={parameters}
            ChartComponent={DynamicChiSquaredDistributionChart}
        />
    );
}
