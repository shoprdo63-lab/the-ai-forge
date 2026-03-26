"use client";

import { Product } from "@/lib/products";
import { useMemo } from "react";

interface AIRadarChartProps {
  products: Product[];
}

interface RadarMetric {
  name: string;
  key: string;
  max: number;
  getValue: (p: Product) => number;
}

export function AIRadarChart({ products }: AIRadarChartProps) {
  const metrics: RadarMetric[] = useMemo(
    () => [
      {
        name: "AI Score",
        key: "aiScore",
        max: 100,
        getValue: (p) => p.aiScore || 0,
      },
      {
        name: "VRAM",
        key: "vram",
        max: 80,
        getValue: (p) => {
          const match = p.specs.vram?.match(/(\d+)/);
          return match ? parseInt(match[1]) : 0;
        },
      },
      {
        name: "Compute",
        key: "cuda",
        max: 22000,
        getValue: (p) => {
          const match = p.specs.cuda?.match(/([\d,]+)/);
          return match ? parseInt(match[1].replace(/,/g, "")) : 0;
        },
      },
      {
        name: "Efficiency",
        key: "efficiency",
        max: 100,
        getValue: (p) => {
          const tdpMatch = p.specs.tdp?.match(/(\d+)/);
          const tdp = tdpMatch ? parseInt(tdpMatch[1]) : 350;
          return Math.min(((p.aiScore || 0) / tdp) * 500, 100);
        },
      },
      {
        name: "Value",
        key: "value",
        max: 100,
        getValue: (p) => {
          if (p.price === 0) return 0;
          return Math.min(((p.aiScore || 0) / p.price) * 1000, 100);
        },
      },
    ],
    []
  );

  const data = useMemo(() => {
    return products.map((product, idx) => {
      const values = metrics.map((m) => ({
        metric: m.name,
        value: Math.min(m.getValue(product), m.max),
        max: m.max,
        raw: m.getValue(product),
      }));
      return {
        product,
        values,
        color: idx === 0 ? "#10b981" : idx === 1 ? "#3b82f6" : "#f59e0b",
        bgColor:
          idx === 0
            ? "rgba(16, 185, 129, 0.2)"
            : idx === 1
            ? "rgba(59, 130, 246, 0.2)"
            : "rgba(245, 158, 11, 0.2)",
      };
    });
  }, [products, metrics]);

  // SVG Radar Chart Configuration
  const size = 400;
  const center = size / 2;
  const radius = 140;
  const angleSlice = (Math.PI * 2) / metrics.length;

  // Generate polygon points for each product
  const getPolygonPoints = (values: { value: number; max: number }[]) => {
    return values
      .map((v, i) => {
        const angle = i * angleSlice - Math.PI / 2;
        const r = (v.value / v.max) * radius;
        const x = center + r * Math.cos(angle);
        const y = center + r * Math.sin(angle);
        return `${x},${y}`;
      })
      .join(" ");
  };

  // Generate grid circles
  const gridLevels = [0.2, 0.4, 0.6, 0.8, 1.0];

  return (
    <div className="w-full flex flex-col items-center">
      <svg
        viewBox={`0 0 ${size} ${size}`}
        className="w-full max-w-[500px] h-auto"
        style={{ filter: "drop-shadow(0 0 20px rgba(16, 185, 129, 0.1))" }}
      >
        {/* Background */}
        <rect width={size} height={size} fill="transparent" />

        {/* Grid circles */}
        {gridLevels.map((level, i) => (
          <circle
            key={i}
            cx={center}
            cy={center}
            r={radius * level}
            fill="none"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="1"
            strokeDasharray="4 4"
          />
        ))}

        {/* Grid lines from center to vertices */}
        {metrics.map((_, i) => {
          const angle = i * angleSlice - Math.PI / 2;
          const x2 = center + radius * Math.cos(angle);
          const y2 = center + radius * Math.sin(angle);
          return (
            <line
              key={i}
              x1={center}
              y1={center}
              x2={x2}
              y2={y2}
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="1"
            />
          );
        })}

        {/* Product polygons */}
        {data.map((item, idx) => (
          <g key={item.product.id}>
            {/* Polygon fill */}
            <polygon
              points={getPolygonPoints(item.values)}
              fill={item.bgColor}
              stroke={item.color}
              strokeWidth="2"
              opacity={0.6 + idx * 0.1}
            />

            {/* Data points */}
            {item.values.map((v, i) => {
              const angle = i * angleSlice - Math.PI / 2;
              const r = (v.value / v.max) * radius;
              const x = center + r * Math.cos(angle);
              const y = center + r * Math.sin(angle);
              return (
                <circle
                  key={i}
                  cx={x}
                  cy={y}
                  r="4"
                  fill={item.color}
                  stroke="#050505"
                  strokeWidth="2"
                />
              );
            })}
          </g>
        ))}

        {/* Labels */}
        {metrics.map((m, i) => {
          const angle = i * angleSlice - Math.PI / 2;
          const labelRadius = radius + 25;
          const x = center + labelRadius * Math.cos(angle);
          const y = center + labelRadius * Math.sin(angle);
          return (
            <text
              key={m.key}
              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="middle"
              fill="#94a3b8"
              fontSize="11"
              fontWeight="500"
            >
              {m.name}
            </text>
          );
        })}
      </svg>

      {/* Legend */}
      <div className="flex flex-wrap items-center justify-center gap-6 mt-6">
        {data.map((item) => (
          <div key={item.product.id} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-sm text-zinc-400 truncate max-w-[150px]">
              {item.product.name}
            </span>
            <span className="text-xs text-emerald-400 font-mono">
              AI: {item.product.aiScore}
            </span>
          </div>
        ))}
      </div>

      {/* Metrics Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 mt-8 w-full">
        {metrics.map((m) => (
          <div
            key={m.key}
            className="p-3 rounded-xl bg-white/[0.02] border border-white/5"
          >
            <p className="text-[10px] text-zinc-500 uppercase mb-1">{m.name}</p>
            <div className="space-y-1">
              {products.map((p, idx) => {
                const value = m.getValue(p);
                const maxValue = Math.max(...products.map(m.getValue));
                const isWinner = value === maxValue && value > 0;
                return (
                  <div key={p.id} className="flex items-center justify-between">
                    <span className="text-xs text-zinc-600">
                      {idx === 0 ? "A" : idx === 1 ? "B" : "C"}
                    </span>
                    <span
                      className={`text-xs font-mono ${
                        isWinner ? "text-emerald-400 font-semibold" : "text-zinc-400"
                      }`}
                    >
                      {m.key === "aiScore" || m.key === "efficiency" || m.key === "value"
                        ? Math.round(value)
                        : m.key === "vram"
                        ? `${value}GB`
                        : m.key === "cuda"
                        ? value.toLocaleString()
                        : Math.round(value)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
