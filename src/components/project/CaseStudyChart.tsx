"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Funnel,
  FunnelChart,
  Line,
  LineChart,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { CaseStudyChart as CaseStudyChartType } from "@/types/case-study";

const SERIES_COLORS = [
  "var(--color-chart-1)",
  "var(--color-chart-2)",
  "var(--color-chart-3)",
  "var(--color-chart-4)",
  "var(--color-chart-5)",
];

function formatValue(value: number, prefix = "", suffix = "") {
  const formatted =
    Math.abs(value) >= 1000
      ? new Intl.NumberFormat("en-US", {
          notation: "compact",
          maximumFractionDigits: 1,
        }).format(value)
      : new Intl.NumberFormat("en-US").format(value);
  return `${prefix}${formatted}${suffix}`;
}

interface CaseStudyChartProps {
  chart: CaseStudyChartType;
}

interface TooltipPayloadEntry {
  name: string;
  value: number;
  color: string;
}

function ChartTooltip({
  active,
  payload,
  label,
  prefix,
  suffix,
}: {
  active?: boolean;
  payload?: TooltipPayloadEntry[];
  label?: string;
  prefix?: string;
  suffix?: string;
}) {
  if (!active || !payload || payload.length === 0) return null;
  return (
    <div className="rounded-lg border border-border bg-background px-3 py-2 shadow-sm text-xs space-y-1">
      {label && <p className="font-medium text-foreground">{label}</p>}
      {payload.map((entry, i) => (
        <div key={i} className="flex items-center gap-1.5">
          <span
            className="w-2 h-2 rounded-full shrink-0"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-muted-foreground">{entry.name}</span>
          <span className="font-medium text-foreground">
            {formatValue(entry.value, prefix, suffix)}
          </span>
        </div>
      ))}
    </div>
  );
}

function ChartLegend({
  series,
}: {
  series: { name: string; color: string }[];
}) {
  if (series.length < 2) return null;
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 justify-center">
      {series.map((s, i) => (
        <div key={i} className="flex items-center gap-1.5">
          <span
            className="w-2 h-2 rounded-full shrink-0"
            style={{ backgroundColor: s.color }}
          />
          <span className="text-xs text-muted-foreground">{s.name}</span>
        </div>
      ))}
    </div>
  );
}

export function CaseStudyChart({ chart }: CaseStudyChartProps) {
  const { type, title, valuePrefix = "", valueSuffix = "", series } = chart;
  if (series.length === 0 || series.every((s) => s.data.length === 0)) {
    return null;
  }

  const axisTick = { fill: "var(--color-muted-foreground)", fontSize: 12 };

  if (type === "funnel") {
    const stages = series[0].data;
    const funnelData = stages.map((point, i) => ({
      name: point.label,
      value: point.value,
      fill: SERIES_COLORS[0],
      fillOpacity: 1 - i * (0.55 / Math.max(stages.length - 1, 1)),
    }));

    return (
      <div className="space-y-2">
        {title && <p className="text-sm font-medium text-foreground">{title}</p>}
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <FunnelChart>
              <Tooltip
                content={(props) => (
                  <ChartTooltip
                    active={props.active}
                    label={props.payload?.[0]?.payload?.name}
                    payload={
                      props.payload?.[0]
                        ? [
                            {
                              name: series[0].name || "Value",
                              value: Number(props.payload[0].payload.value),
                              color: SERIES_COLORS[0],
                            },
                          ]
                        : []
                    }
                    prefix={valuePrefix}
                    suffix={valueSuffix}
                  />
                )}
              />
              <Funnel dataKey="value" data={funnelData} isAnimationActive>
                <LabelList
                  position="right"
                  dataKey="name"
                  fill="var(--color-foreground)"
                  fontSize={12}
                />
                <LabelList
                  position="center"
                  dataKey="value"
                  fill="#ffffff"
                  stroke="var(--color-chart-1)"
                  strokeWidth={3}
                  paintOrder="stroke"
                  fontSize={12}
                  fontWeight={600}
                  formatter={(v) => formatValue(Number(v), valuePrefix, valueSuffix)}
                />
                {funnelData.map((entry, i) => (
                  <Cell key={i} fill={entry.fill} fillOpacity={entry.fillOpacity} />
                ))}
              </Funnel>
            </FunnelChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  }

  // Merge series into one dataset keyed by label, for bar/line
  const labels = series[0]?.data.map((p) => p.label) ?? [];
  const merged = labels.map((label) => {
    const row: Record<string, string | number> = { label };
    series.forEach((s) => {
      const point = s.data.find((p) => p.label === label);
      row[s.name || "value"] = point?.value ?? 0;
    });
    return row;
  });

  const legendSeries = series.map((s, i) => ({
    name: s.name || `Series ${i + 1}`,
    color: SERIES_COLORS[i % SERIES_COLORS.length],
  }));

  return (
    <div className="space-y-1">
      {title && <p className="text-sm font-medium text-foreground">{title}</p>}
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          {type === "line" ? (
            <LineChart data={merged} margin={{ top: 16, right: 28, left: 0, bottom: 0 }}>
              <CartesianGrid
                vertical={false}
                stroke="var(--color-border)"
                strokeDasharray="0"
              />
              <XAxis
                dataKey="label"
                tick={axisTick}
                tickLine={false}
                axisLine={{ stroke: "var(--color-border)" }}
              />
              <YAxis
                tick={axisTick}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) => formatValue(Number(v), valuePrefix, valueSuffix)}
                width={60}
              />
              <Tooltip
                content={(props) => (
                  <ChartTooltip
                    active={props.active}
                    label={props.label as string}
                    payload={props.payload as unknown as TooltipPayloadEntry[]}
                    prefix={valuePrefix}
                    suffix={valueSuffix}
                  />
                )}
              />
              {series.map((s, i) => (
                <Line
                  key={i}
                  type="monotone"
                  dataKey={s.name || `Series ${i + 1}`}
                  stroke={SERIES_COLORS[i % SERIES_COLORS.length]}
                  strokeWidth={2}
                  dot={{
                    r: 4,
                    fill: SERIES_COLORS[i % SERIES_COLORS.length],
                    stroke: "var(--color-background)",
                    strokeWidth: 2,
                  }}
                  activeDot={{ r: 5 }}
                >
                  <LabelList
                    position="top"
                    dataKey={s.name || `Series ${i + 1}`}
                    fill="var(--color-muted-foreground)"
                    fontSize={11}
                    formatter={(v) => formatValue(Number(v), valuePrefix, valueSuffix)}
                  />
                </Line>
              ))}
            </LineChart>
          ) : (
            <BarChart data={merged} margin={{ top: 16, right: 28, left: 0, bottom: 0 }}>
              <CartesianGrid
                vertical={false}
                stroke="var(--color-border)"
                strokeDasharray="0"
              />
              <XAxis
                dataKey="label"
                tick={axisTick}
                tickLine={false}
                axisLine={{ stroke: "var(--color-border)" }}
              />
              <YAxis
                tick={axisTick}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) => formatValue(Number(v), valuePrefix, valueSuffix)}
                width={60}
              />
              <Tooltip
                cursor={{ fill: "var(--color-muted)" }}
                content={(props) => (
                  <ChartTooltip
                    active={props.active}
                    label={props.label as string}
                    payload={props.payload as unknown as TooltipPayloadEntry[]}
                    prefix={valuePrefix}
                    suffix={valueSuffix}
                  />
                )}
              />
              {series.map((s, i) => (
                <Bar
                  key={i}
                  dataKey={s.name || `Series ${i + 1}`}
                  fill={SERIES_COLORS[i % SERIES_COLORS.length]}
                  radius={[4, 4, 0, 0]}
                  maxBarSize={28}
                >
                  <LabelList
                    position="top"
                    dataKey={s.name || `Series ${i + 1}`}
                    fill="var(--color-muted-foreground)"
                    fontSize={11}
                    formatter={(v) => formatValue(Number(v), valuePrefix, valueSuffix)}
                  />
                </Bar>
              ))}
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
      <ChartLegend series={legendSeries} />
    </div>
  );
}
