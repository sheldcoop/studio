
import * as React from "react"
import { type ChartConfig } from "@/components/ui/chart"

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
                {typeof item.value === 'number' ? parseFloat(item.value).toFixed(2) : item.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return null;
};
