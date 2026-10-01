"use client";

import { useEffect, useState } from "react";

/* ---------- 1. Monthly Spend Bar Chart (Exactly like screenshot) ---------- */

type SpendBarItem = { month: string; value: number; forecast?: boolean };

export function MonthlySpendBarChart({ data }: { data: SpendBarItem[] }) {
  const [animated, setAnimated] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 80);
    return () => clearTimeout(t);
  }, []);

  const yMax = 100000;
  const gridSteps = [100000, 75000, 50000, 25000, 0];

  const svgWidth = 540;
  const svgHeight = 240;

  const chartLeft = 50;
  const chartRight = 510;
  const chartTop = 30;
  const chartBottom = 190;

  const plotWidth = chartRight - chartLeft;
  const plotHeight = chartBottom - chartTop;

  const groupWidth = plotWidth / data.length;
  const barWidth = 36;

  return (
    <div className="w-full space-y-3">
      <h3 className="font-display text-base font-bold text-ink">Monthly spend (SAR)</h3>

      <div className="w-full">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-auto select-none"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            {/* Forecast Diagonal Hashed Pattern */}
            <pattern
              id="forecastStripes"
              width="8"
              height="8"
              patternUnits="userSpaceOnUse"
              patternTransform="rotate(45)"
            >
              <line x1="0" y1="0" x2="0" y2="8" stroke="#8e2f3c" strokeWidth="4" />
              <line x1="4" y1="0" x2="4" y2="8" stroke="currentColor" className="text-card" strokeWidth="4" />
            </pattern>
          </defs>

          {/* Grid lines and Y-axis labels */}
          {gridSteps.map((val) => {
            const y = chartBottom - (val / yMax) * plotHeight;
            const label = val === 0 ? "0" : `${val / 1000}k`;
            return (
              <g key={val}>
                <line
                  x1={chartLeft}
                  y1={y}
                  x2={chartRight}
                  y2={y}
                  stroke="currentColor"
                  className="text-line/60"
                  strokeWidth="0.75"
                />
                <text
                  x={chartLeft - 10}
                  y={y + 4}
                  textAnchor="end"
                  fontSize="11"
                  fontFamily="sans-serif"
                  className="fill-muted"
                >
                  {label}
                </text>
              </g>
            );
          })}

          {/* Bars */}
          {data.map((d, i) => {
            const centerX = chartLeft + groupWidth * i + groupWidth / 2;
            const x = centerX - barWidth / 2;
            const targetH = (d.value / yMax) * plotHeight;
            const currentH = animated ? targetH : 0;
            const y = chartBottom - currentH;
            const isForecast = d.forecast;

            return (
              <g key={d.month}>
                {/* Column Bar */}
                <rect
                  x={x}
                  y={y}
                  width={barWidth}
                  height={currentH}
                  rx="1"
                  fill={isForecast ? "url(#forecastStripes)" : "#8e2f3c"}
                  stroke="#8e2f3c"
                  strokeWidth="1"
                  style={{
                    transitionProperty: "height, y",
                    transitionDuration: "0.8s",
                    transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
                    transitionDelay: `${i * 60}ms`,
                  }}
                />

                {/* X-Axis Month Label */}
                <text
                  x={centerX}
                  y={chartBottom + 20}
                  textAnchor="middle"
                  fontSize="12"
                  fontWeight="500"
                  fontFamily="sans-serif"
                  className="fill-ink"
                >
                  {d.month}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Subtitle legend note matching screenshot */}
      <div className="flex items-center gap-2 text-xs text-muted pt-1">
        <span className="inline-block h-3.5 w-3.5 border border-brand bg-[repeating-linear-gradient(45deg,#8e2f3c,#8e2f3c_2px,transparent_2px,transparent_5px)]" />
        <span>October is the AI agent&apos;s forecast</span>
      </div>
    </div>
  );
}

/* ---------- 2. Spend by Service Widget (Exactly like screenshot) ---------- */

type ServiceItem = { name: string; value: number };

export function SpendByServiceWidget({ items }: { items: ServiceItem[] }) {
  const [animated, setAnimated] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 150);
    return () => clearTimeout(t);
  }, []);

  const grandTotal = items.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="w-full space-y-4">
      <h3 className="font-display text-base font-bold text-ink">
        Spend by service <span className="text-muted font-normal">· September</span>
      </h3>

      <div className="space-y-4 pt-1">
        {items.map((item, i) => {
          const pct = Math.round((item.value / grandTotal) * 100);
          const barPct = animated ? pct : 0;

          return (
            <div key={item.name} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-ink">{item.name}</span>
                <span className="font-mono font-semibold text-ink">
                  SAR {item.value.toLocaleString()}
                </span>
              </div>
              <div className="h-2.5 w-full bg-line/40 rounded-sm overflow-hidden">
                <div
                  className="h-full bg-[#8e2f3c] rounded-sm"
                  style={{
                    width: `${barPct}%`,
                    transitionProperty: "width",
                    transitionDuration: "0.8s",
                    transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
                    transitionDelay: `${i * 70}ms`,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
