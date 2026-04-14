"use client";

import React from "react";

type HistoryPoint = {
  date: string;
  rate: number;
};

interface CurrencyChartProps {
  data: HistoryPoint[];
  isLoading?: boolean;
}

export function CurrencyChart({ data, isLoading }: CurrencyChartProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center w-full h-40 bg-muted/20 animate-pulse rounded-md">
        <span className="text-muted-foreground">Loading chart data...</span>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="flex justify-center items-center w-full h-40 bg-muted/10 rounded-md">
        <span className="text-muted-foreground text-sm">No data available</span>
      </div>
    );
  }

  const padding = 10;
  const width = 400;
  const height = 160;

  const rates = data.map((d) => d.rate);
  const minRate = Math.min(...rates);
  const maxRate = Math.max(...rates);
  const range = maxRate - minRate || 1;

  // Scale points to SVG space
  const points = data.map((d, i) => {
    const x = (i / (data.length - 1 || 1)) * (width - 2 * padding) + padding;
    const y = height - ((d.rate - minRate) / range) * (height - 2 * padding) - padding;
    return `${x},${y}`;
  });

  const pathData = `M ${points.join(" L ")}`;

  return (
    <div className="w-full">
      <div className="relative w-full h-auto aspect-[10/4]">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-full"
          preserveAspectRatio="none"
        >
          {/* Gradient for the line */}
          <defs>
            <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.5" />
              <stop offset="100%" stopColor="hsl(var(--primary))" />
            </linearGradient>
            <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.2" />
              <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Guidelines */}
          <line 
            x1={padding} y1={padding} x2={width-padding} y2={padding} 
            stroke="currentColor" strokeOpacity="0.1" strokeDasharray="4"
          />
          <line 
            x1={padding} y1={height-padding} x2={width-padding} y2={height-padding} 
            stroke="currentColor" strokeOpacity="0.1" strokeDasharray="4"
          />

          {/* Area fill */}
          <path
            d={`${pathData} L ${width - padding},${height - padding} L ${padding},${height - padding} Z`}
            fill="url(#areaGradient)"
          />

          {/* The line */}
          <path
            d={pathData}
            fill="none"
            stroke="hsl(var(--primary))"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Dots at start and end */}
          {points.length > 0 && (
            <>
              <circle cx={points[0].split(',')[0]} cy={points[0].split(',')[1]} r="3" fill="hsl(var(--primary))" />
              <circle cx={points[points.length-1].split(',')[0]} cy={points[points.length-1].split(',')[1]} r="3" fill="hsl(var(--primary))" />
            </>
          )}
        </svg>
      </div>
      <div className="flex justify-between mt-1 text-[10px] text-muted-foreground px-1">
        <span>{data[0]?.date}</span>
        <div className="flex items-center gap-2">
            <span className="font-medium text-foreground">Min: {minRate.toFixed(4)}</span>
            <span className="font-medium text-foreground">Max: {maxRate.toFixed(4)}</span>
        </div>
        <span>{data[data.length - 1]?.date}</span>
      </div>
    </div>
  );
}
