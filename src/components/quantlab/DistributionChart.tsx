
'use client';

import { useMemo } from 'react';
import dynamic from 'next/dynamic';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import { Bar, BarChart, Area, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip, Cell, Line, ComposedChart } from 'recharts';
import { Skeleton } from '@/components/ui/skeleton';
import { InlineMath } from 'react-katex';

interface DistributionChartProps {
  chartData: { [key: string]: any }[];
  chartType: 'bar' | 'area';
  xAxisDataKey: string;
  yAxisDataKey: string;
  mean?: number;
  variance?: number;
  highlightValue?: string | number | null;
  showCdf?: boolean;
  onBarHover?: (value: string | number | null) => void;
}

const BaseChart = ({
  chartType,
  chartData,
  xAxisDataKey,
  yAxisDataKey,
  highlightValue,
  showCdf,
  onBarHover,
}: DistributionChartProps) => {
  const ChartComponent = chartType === 'bar' ? BarChart : AreaChart;
  const ChartPrimitive = chartType === 'bar' ? Bar : Area;
  const fillId = `fill${chartType}`;
  
  const cdfData = useMemo(() => {
    if (!showCdf) return [];
    let cumulative = 0;
    return chartData.map(d => {
        cumulative += d[yAxisDataKey];
        return { ...d, cdf: cumulative };
    });
  }, [showCdf, chartData, yAxisDataKey]);

  return (
    <ChartContainer config={{}} className="h-[300px] w-full">
      <ComposedChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey={xAxisDataKey} name="Outcome" />
        <YAxis yAxisId="left" name="Probability" domain={[0, 'dataMax']} />
        {showCdf && <YAxis yAxisId="right" orientation="right" domain={[0, 1]} />}
        <Tooltip
          content={
            <ChartTooltipContent
              labelFormatter={(label) => `Outcome: ${label}`}
              formatter={(value, name) => [Number(value).toFixed(4), name === 'cdf' ? 'CDF' : 'Probability']}
            />
          }
        />
        {chartType === 'area' ? (
          <Area
            type="monotone"
            yAxisId="left"
            dataKey={yAxisDataKey}
            fill='hsl(var(--primary))'
            fillOpacity={0.2}
            stroke='hsl(var(--primary))'
            strokeWidth={2}
          />
        ) : (
          <Bar
            yAxisId="left"
            dataKey={yAxisDataKey}
            onMouseOver={(data) => onBarHover?.(data[xAxisDataKey])}
            onMouseLeave={() => onBarHover?.(null)}
          >
            {chartData.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry[xAxisDataKey] == highlightValue ? 'hsl(var(--primary))' : 'hsla(var(--primary), 0.5)'}
              />
            ))}
          </Bar>
        )}
        {showCdf && (
           <Line
                yAxisId="right"
                data={cdfData}
                type="step"
                dataKey="cdf"
                stroke="hsl(var(--chart-2))"
                strokeWidth={2}
                dot={false}
                name="CDF"
            />
        )}
      </ComposedChart>
    </ChartContainer>
  );
};

const DynamicBaseChart = dynamic(() => Promise.resolve(BaseChart), {
  ssr: false,
  loading: () => <Skeleton className="h-[300px] w-full" />,
});

export function DistributionChart(props: DistributionChartProps) {
    
  const processedData = useMemo(() => props.chartData.map(d => ({
      ...d,
      [props.xAxisDataKey]: d[props.xAxisDataKey],
      [props.yAxisDataKey]: d[props.yAxisDataKey]
  })), [props.chartData, props.xAxisDataKey, props.yAxisDataKey]);

  return (
    <div>
      <DynamicBaseChart {...props} chartData={processedData} />
      {(props.mean !== undefined || props.variance !== undefined) && (
        <div className="grid grid-cols-2 text-center text-xs text-muted-foreground mt-4">
          {props.mean !== undefined && (
            <div>
              Mean (<InlineMath math="\mu" />): <span className="font-semibold text-foreground block">{isFinite(props.mean) ? props.mean.toFixed(2) : 'Undefined'}</span>
            </div>
          )}
          {props.variance !== undefined && (
            <div>
              Variance (<InlineMath math="\sigma^2" />): <span className="font-semibold text-foreground block">{isFinite(props.variance) ? props.variance.toFixed(2) : 'Undefined'}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
