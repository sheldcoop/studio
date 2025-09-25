
import * as React from "react"
import { type ChartConfig } from "@/components/ui/chart"

export function getChartConfig(isMultiColor: boolean): ChartConfig {
  const colors = [
    "hsl(var(--chart-1))",
    "hsl(var(--chart-2))",
    "hsl(var(--chart-3))",
    "hsl(var(--chart-4))",
    "hsl(var(--chart-5))",
  ];

  if (isMultiColor) {
    return {
      value: { label: "Value", color: colors[0] },
      stable: { label: "StableStock", color: colors[1] },
      growth: { label: "GrowthStock", color: colors[2] },
      before: { label: "Before", color: colors[3] },
      after: { label: "After", color: colors[0] },
      stocks: { label: "Stocks", color: colors[0] },
      crypto: { label: "Crypto", color: colors[1] },
      "Algo A": { label: "Algo A", color: colors[0] },
      "Algo B": { label: "Algo B", color: colors[1] },
      "Algo C": { label: "Algo C", color: colors[2] },
      "Algo D": { label: "Algo D", color: colors[3] },
      "Algo E": { label: "Algo E", color: colors[4] },
    } as ChartConfig
  }

  return {
    value: { label: "Value", color: colors[0] },
    "Observed Trades": { label: "Observed", color: colors[0] },
    "Expected Trades (if uniform)": { label: "Expected", color: colors[1] },
    "Observed Profitable Trades (Bullish Market)": { label: "Observed", color: colors[0] },
    "Expected Profitable Trades (if independent)": { label: "Expected", color: colors[1] },
    "New York Office": { label: "New York", color: colors[0] },
    "London Office": { label: "London", color: colors[1] },
    "Empirical CDF (Sample)": { label: "Sample", color: colors[0] },
    "Theoretical CDF (Normal)": { label: "Normal", color: colors[1] },
  } as ChartConfig
}

export const ChartTooltipContent = ({ active, payload, label, indicator }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border bg-background p-2 shadow-sm">
        <div className="grid grid-cols-2 gap-2">
          <div className="flex flex-col">
            <span className="text-[0.70rem] uppercase text-muted-foreground">
              {indicator || "Value"}
            </span>
            <span className="font-bold text-muted-foreground">{label}</span>
          </div>
          {payload.map((item: any, index: number) => (
            <div className="flex flex-col" key={index}>
              <span className="text-[0.70rem] uppercase text-muted-foreground">
                {item.name}
              </span>
              <span className="font-bold" style={{ color: item.color || item.fill }}>
                {parseFloat(item.value).toFixed(2)}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return null;
};
