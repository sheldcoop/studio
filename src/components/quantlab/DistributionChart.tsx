

'use client';

import { useMemo } from 'react';
import dynamic from 'next/dynamic';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import { Bar, BarChart, Area, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
import { Skeleton } from '@/components/ui/skeleton';
import { InlineMath } from 'react-katex';

interface DistributionChartProps {
  chartData: { [key: string]: string | number }[];
  chartType: 'bar' | 'area';
  xAxisDataKey: string;
  yAxisDataKey: string;
  xAxisLabel?: string;
  yAxisLabel?: string;
  mean?: number;
  variance?: number;
}

const BaseChart = ({
  chartType,
  chartData,
  xAxisDataKey,
  yAxisDataKey,
}: Omit<DistributionChartProps, 'mean' | 'variance' | 'xAxisLabel' | 'yAxisLabel'>) => {
  const ChartComponent = chartType === 'bar' ? BarChart : AreaChart;
  const ChartPrimitive = chartType === 'bar' ? Bar : Area;
  const fillId = `fill${chartType}`;

  return (
    <ChartContainer config={{}} className="h-[300px] w-full">
      <ChartComponent data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey={xAxisDataKey} name="Outcome" />
        <YAxis name="Probability" domain={[0, 'dataMax']} />
        <Tooltip
          content={
            <ChartTooltipContent
              labelFormatter={(label) => `Outcome: ${label}`}
              formatter={(value) => [Number(value).toFixed(4), 'Probability']}
            />
          }
        />
        {chartType === 'area' && (
          <defs>
            <linearGradient id={fillId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.8} />
              <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0.1} />
            </linearGradient>
          </defs>
        )}
        <ChartPrimitive
          type="monotone"
          dataKey={yAxisDataKey}
          fill={chartType === 'area' ? `url(#${fillId})` : 'hsl(var(--primary))'}
          stroke={chartType === 'area' ? 'hsl(var(--chart-1))' : undefined}
          strokeWidth={chartType === 'area' ? 2 : undefined}
          dot={chartType === 'area' ? false : undefined}
          radius={chartType === 'bar' ? [4, 4, 0, 0] : undefined}
        />
      </ChartComponent>
    </ChartContainer>
  );
};

const DynamicBaseChart = dynamic(() => Promise.resolve(BaseChart), {
  ssr: false,
  loading: () => <Skeleton className="h-[300px] w-full" />,
});

export function DistributionChart({ chartData, chartType, xAxisDataKey, yAxisDataKey, mean, variance }: DistributionChartProps) {
    
  const processedData = useMemo(() => chartData.map(d => ({
      ...d,
      [xAxisDataKey]: d[xAxisDataKey],
      [yAxisDataKey]: d[yAxisDataKey]
  })), [chartData, xAxisDataKey, yAxisDataKey]);

  return (
    <div>
      <DynamicBaseChart
        chartData={processedData}
        chartType={chartType}
        xAxisDataKey={xAxisDataKey}
        yAxisDataKey={yAxisDataKey}
      />
      {(mean !== undefined || variance !== undefined) && (
        <div className="grid grid-cols-2 text-center text-xs text-muted-foreground mt-4">
          {mean !== undefined && (
            <div>
              Mean (<InlineMath math="\mu" />): <span className="font-semibold text-foreground block">{mean.toFixed(2)}</span>
            </div>
          )}
          {variance !== undefined && (
            <div>
              Variance (<InlineMath math="\sigma^2" />): <span className="font-semibold text-foreground block">{variance.toFixed(2)}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
