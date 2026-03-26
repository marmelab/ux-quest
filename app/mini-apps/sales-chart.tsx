import { useState } from "react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import type { MiniAppDefinition } from "~/lib/types"

// --- Mock data -----------------------------------------------------------

interface SalesDataPoint {
  month: string
  [salesperson: string]: number | string
}

const salespersons = [
  { key: "sarah", name: "Sarah Chen", color: "#6366f1" },
  { key: "marcus", name: "Marcus Johnson", color: "#f59e0b" },
  { key: "elena", name: "Elena Rodriguez", color: "#10b981" },
  { key: "james", name: "James Park", color: "#f43f5e" },
]

const salesData: SalesDataPoint[] = [
  { month: "Jan", sarah: 42000, marcus: 38000, elena: 29000, james: 51000 },
  { month: "Feb", sarah: 45000, marcus: 41000, elena: 35000, james: 47000 },
  { month: "Mar", sarah: 52000, marcus: 36000, elena: 41000, james: 53000 },
  { month: "Apr", sarah: 48000, marcus: 44000, elena: 46000, james: 49000 },
  { month: "May", sarah: 61000, marcus: 47000, elena: 52000, james: 44000 },
  { month: "Jun", sarah: 58000, marcus: 52000, elena: 55000, james: 56000 },
  { month: "Jul", sarah: 64000, marcus: 49000, elena: 61000, james: 62000 },
  { month: "Aug", sarah: 59000, marcus: 55000, elena: 58000, james: 65000 },
  { month: "Sep", sarah: 68000, marcus: 61000, elena: 63000, james: 59000 },
  { month: "Oct", sarah: 72000, marcus: 58000, elena: 67000, james: 71000 },
  { month: "Nov", sarah: 78000, marcus: 64000, elena: 72000, james: 68000 },
  { month: "Dec", sarah: 85000, marcus: 71000, elena: 79000, james: 75000 },
]

const formatCurrency = (value: number) => `$${(value / 1000).toFixed(0)}k`

// --- Summary cards -------------------------------------------------------

function SummaryCards() {
  const totals = salespersons.map((sp) => ({
    ...sp,
    total: salesData.reduce((sum, d) => sum + (d[sp.key] as number), 0),
  }))
  const best = totals.reduce((a, b) => (a.total > b.total ? a : b))

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {totals.map((sp) => (
        <div key={sp.key} className="rounded-lg border bg-card p-3">
          <div className="flex items-center gap-2">
            <span
              className="size-2.5 rounded-full"
              style={{ backgroundColor: sp.color }}
            />
            <span className="text-xs text-muted-foreground">{sp.name}</span>
          </div>
          <div className="mt-1 text-lg font-semibold tabular-nums">
            ${(sp.total / 1000).toFixed(0)}k
          </div>
          {sp.key === best.key && (
            <span className="text-[10px] font-medium text-emerald-600">
              Top performer
            </span>
          )}
        </div>
      ))}
    </div>
  )
}

// BUG: The chart container uses overflow:hidden and the tooltip is rendered
// inside it. When hovering points near the right or top edge, the tooltip
// extends past the container boundary and gets clipped/cut off.

function CustomTooltip(props: {
  active?: boolean
  payload?: Array<{
    dataKey?: string
    value?: number
    color?: string
  }>
  label?: string
}) {
  const { active, payload, label } = props
  if (!active || !payload?.length) return null

  return (
    <div className="rounded-lg border bg-popover px-3 py-2 text-sm whitespace-nowrap shadow-lg">
      <p className="mb-1.5 font-medium">{label} 2025</p>
      {payload.map((entry) => {
        const sp = salespersons.find((s) => s.key === entry.dataKey)
        return (
          <div
            key={entry.dataKey}
            className="flex items-center justify-between gap-6 py-0.5"
          >
            <div className="flex items-center gap-2">
              <span
                className="size-2 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-muted-foreground">
                {sp?.name ?? entry.dataKey}
              </span>
            </div>
            <span className="font-medium tabular-nums">
              {formatCurrency(entry.value ?? 0)}
            </span>
          </div>
        )
      })}
    </div>
  )
}

// --- Main component ------------------------------------------------------

function SalesChart() {
  const [hoveredLine, setHoveredLine] = useState<string | null>(null)

  return (
    <div className="flex flex-col gap-4 p-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Sales Performance</h2>
          <p className="text-sm text-muted-foreground">
            Monthly revenue by team member — FY 2025
          </p>
        </div>
        <span className="rounded-md border bg-muted/40 px-2.5 py-1 text-xs font-medium text-muted-foreground">
          12 months
        </span>
      </div>

      {/* Summary */}
      <SummaryCards />

      {/* Chart — overflow:hidden on the wrapper causes tooltip clipping */}
      <div className="overflow-hidden rounded-lg border bg-card p-4">
        <ResponsiveContainer width="100%" height={320}>
          <LineChart
            data={salesData}
            margin={{ top: 8, right: 8, left: -8, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
              axisLine={{ stroke: "hsl(var(--border))" }}
              tickLine={false}
            />
            <YAxis
              tickFormatter={formatCurrency}
              tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ stroke: "hsl(var(--border))", strokeDasharray: "4 4" }}
              wrapperStyle={{ zIndex: 10 }}
              // BUG: allowEscapeViewBox lets the tooltip extend beyond the
              // SVG, but the parent div has overflow:hidden which clips it.
              // The tooltip always renders to the right of the point, so
              // near the right edge (Nov/Dec) it gets cut off.
              allowEscapeViewBox={{ x: true, y: true }}
              offset={20}
            />
            <Legend
              iconType="circle"
              iconSize={8}
              wrapperStyle={{ fontSize: 12, paddingTop: 12, zIndex: 0 }}
              formatter={(value: string) => {
                const sp = salespersons.find((s) => s.key === value)
                return (
                  <span className="text-muted-foreground">
                    {sp?.name ?? value}
                  </span>
                )
              }}
            />
            {salespersons.map((sp) => (
              <Line
                key={sp.key}
                type="monotone"
                dataKey={sp.key}
                name={sp.key}
                stroke={sp.color}
                strokeWidth={hoveredLine === sp.key ? 3 : 2}
                dot={{ r: 3, strokeWidth: 2, fill: "hsl(var(--card))" }}
                activeDot={{
                  r: 6,
                  strokeWidth: 2,
                  fill: sp.color,
                  stroke: "hsl(var(--card))",
                }}
                animationDuration={1200}
                animationEasing="ease-out"
                onMouseEnter={() => setHoveredLine(sp.key)}
                onMouseLeave={() => setHoveredLine(null)}
                opacity={hoveredLine && hoveredLine !== sp.key ? 0.3 : 1}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

// --- Definition ----------------------------------------------------------

export const salesChart: MiniAppDefinition = {
  id: "sales-chart",
  name: "Sales Dashboard",
  introduction:
    "A sales team dashboard showing monthly revenue performance for each team member with an interactive line chart.",
  category: "dataviz",
  difficulty: "easy",
  component: SalesChart,
  expectedAnswers: [
    "The tooltip that appears when hovering over data points gets clipped at the edges of the chart container.",
    "Hover labels are cut off when you hover near the borders of the chart area.",
    "The tooltip is truncated when it appears near the left, right, or top edges of the chart.",
    "Data point tooltips overflow and get hidden by the chart container boundary.",
    "The hover information popup is partially hidden when hovering on points near the chart edges.",
    "Tooltips near the edges of the graph get cut off because the container clips overflowing content.",
    "When hovering on December data points, the tooltip is cropped by the chart boundary.",
    "The chart container hides part of the tooltip when it would extend beyond the chart area.",
    "The info modal can go out of the screen bounds.",
    "For data points near the right edge, the metrics legend is no longer visible",
    "The hover tooltip gets cut off near the edges of the chart.",
    "Hovering on data points near the border shows a truncated popup.",
    "The chart clips the tooltips — they get hidden when they overflow the container.",
    "I can't read the full tooltip for points at the right edge of the chart.",
    "Tooltip content is partially hidden by overflow clipping on the chart container.",
    "The popover with data values gets cropped when too close to the chart boundary.",
  ],
  hint: "Hover over data points.",
  wrongAnswers: [
    "The chart lines are hard to distinguish from each other.",
    "The Y-axis labels are confusing or incorrectly formatted.",
    "The legend doesn't match the line colors.",
    "The summary cards show incorrect totals.",
    "The chart animation is too slow or distracting.",
    "The month labels on the X-axis are missing or wrong.",
  ],
}
