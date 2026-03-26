import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs"
import type { MiniAppDefinition } from "~/lib/types"

// --- Mock data ---------------------------------------------------------

interface Metric {
  label: string
  value: number
  unit: string
  status: "normal" | "warning" | "critical"
  viz: "bar" | "pie" | "gauge" | "spark"
  gaugeMax?: number
  gaugeTicks?: number[]
  rangeLabel?: string
}

const tabs: { id: string; label: string; metrics: Metric[] }[] = [
  {
    id: "overview",
    label: "Overview",
    metrics: [
      {
        label: "Station OEE",
        value: 92.7,
        unit: "%",
        status: "normal",
        viz: "gauge",
      },
      {
        label: "Efficiency",
        value: 5.8,
        unit: "%",
        status: "normal",
        viz: "bar",
      },
      {
        label: "Vibration Spectrum",
        value: 0.23,
        unit: "in/s",
        status: "normal",
        viz: "spark",
      },
      {
        label: "Energy Consumption",
        value: 68.3,
        unit: "%",
        status: "warning",
        viz: "pie",
      },
      {
        label: "OEE Target",
        value: 48.4,
        unit: "%",
        status: "critical",
        viz: "gauge",
      },
      {
        label: "Pump Trips",
        value: 0,
        unit: "trips",
        status: "normal",
        viz: "bar",
      },
    ],
  },
  {
    id: "units",
    label: "Units",
    metrics: [
      {
        label: "PMP-01 Load",
        value: 78,
        unit: "%",
        status: "normal",
        viz: "bar",
        rangeLabel: "Normal",
      },
      {
        label: "PMP-02 Load",
        value: 84,
        unit: "%",
        status: "warning",
        viz: "bar",
        rangeLabel: "High",
      },
      {
        label: "PMP-03 Load",
        value: 62,
        unit: "%",
        status: "normal",
        viz: "bar",
        rangeLabel: "Normal",
      },
      {
        label: "Compressor A",
        value: 91,
        unit: "%",
        status: "normal",
        viz: "gauge",
        rangeLabel: "High",
      },
      {
        label: "Compressor B",
        value: 45,
        unit: "%",
        status: "critical",
        viz: "gauge",
        rangeLabel: "Low",
      },
    ],
  },
  {
    id: "diagnostics",
    label: "Diagnostics",
    metrics: [
      {
        label: "Bearing Temp",
        value: 78.4,
        unit: "°C",
        status: "warning",
        viz: "spark",
      },
      {
        label: "Pressure",
        value: 12.5,
        unit: "Bar",
        status: "normal",
        viz: "gauge",
        gaugeMax: 20,
        gaugeTicks: [0, 5, 10, 15, 20],
      },
      {
        label: "Flow Rate",
        value: 1240,
        unit: "m³/h",
        status: "normal",
        viz: "bar",
      },
      {
        label: "Coolant Level",
        value: 54,
        unit: "%",
        status: "critical",
        viz: "pie",
      },
      {
        label: "Acoustic P-01",
        value: 78.3,
        unit: "dB",
        status: "normal",
        viz: "spark",
      },
      {
        label: "Acoustic P-02",
        value: 84.2,
        unit: "dB",
        status: "normal",
        viz: "spark",
      },
      {
        label: "Acoustic P-03",
        value: 75.6,
        unit: "dB",
        status: "normal",
        viz: "spark",
      },
    ],
  },
  {
    id: "maintenance",
    label: "Maintenance",
    metrics: [
      {
        label: "Days to Service",
        value: 12,
        unit: "days",
        status: "normal",
        viz: "bar",
      },
      {
        label: "Open Tickets",
        value: 3,
        unit: "",
        status: "warning",
        viz: "pie",
      },
      {
        label: "MTBF",
        value: 4023,
        unit: "hrs",
        status: "normal",
        viz: "gauge",
      },
      {
        label: "Parts Inventory",
        value: 87,
        unit: "%",
        status: "normal",
        viz: "bar",
      },
    ],
  },
]

// --- Visualization components ------------------------------------------
// BUG: Some elements have insufficient contrast — metric labels, units,
// status dots, and chart fills use colours too close to the dark background,
// while values and headings are readable enough to mask the problem.

function BarViz({
  value,
  max = 100,
  status,
}: {
  value: number
  max?: number
  status: string
}) {
  const pct = Math.min((value / max) * 100, 100)
  const barColor =
    status === "critical"
      ? "#dc4545"
      : status === "warning"
        ? "#d4a030"
        : "#2ea860"
  return (
    <div
      className="mt-2 h-2 w-full rounded-full"
      style={{ backgroundColor: "#252528" }}
    >
      <div
        className="h-full rounded-full transition-all"
        style={{ width: `${pct}%`, backgroundColor: barColor }}
      />
    </div>
  )
}

function GaugeViz({
  value,
  max = 100,
  status,
  ticks,
}: {
  value: number
  max?: number
  status: string
  ticks?: number[]
}) {
  const pct = Math.min((value / max) * 100, 100)
  const angle = (pct / 100) * 180
  const arcColor =
    status === "critical"
      ? "#dc4545"
      : status === "warning"
        ? "#d4a030"
        : "#2ea860"
  const cx = 40
  const cy = 44
  const r = 32

  if (ticks) {
    return (
      <svg
        viewBox="0 0 80 52"
        className="mt-2 w-full"
        style={{ maxWidth: 120 }}
      >
        {/* Background arc */}
        <path
          d={`M${cx - r} ${cy} A${r} ${r} 0 0 1 ${cx + r} ${cy}`}
          fill="none"
          stroke="#252528"
          strokeWidth="6"
          strokeLinecap="round"
        />
        {/* Value arc */}
        <path
          d={`M${cx - r} ${cy} A${r} ${r} 0 0 1 ${cx + r} ${cy}`}
          fill="none"
          stroke={arcColor}
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={`${(angle / 180) * 100} 200`}
        />
        {/* Ticks and labels */}
        {ticks.map((tick) => {
          const tickAngle = ((tick / max) * 180 * Math.PI) / 180
          const outerR = r + 3
          const innerR = r - 3
          const x1 = cx - outerR * Math.cos(tickAngle)
          const y1 = cy - outerR * Math.sin(tickAngle)
          const x2 = cx - innerR * Math.cos(tickAngle)
          const y2 = cy - innerR * Math.sin(tickAngle)
          const labelR = r + 9
          const lx = cx - labelR * Math.cos(tickAngle)
          const ly = cy - labelR * Math.sin(tickAngle)
          return (
            <g key={tick}>
              <line
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="#555"
                strokeWidth="0.8"
              />
              <text
                x={lx}
                y={ly}
                textAnchor="middle"
                dominantBaseline="middle"
                fill="#3a3a3f"
                fontSize="5"
              >
                {tick}
              </text>
            </g>
          )
        })}
        {/* Needle */}
        <line
          x1={cx}
          y1={cy}
          x2={cx + 26 * Math.cos(((180 - angle) * Math.PI) / 180)}
          y2={cy - 26 * Math.sin(((180 - angle) * Math.PI) / 180)}
          stroke="#555"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 80 44" className="mt-2 w-full" style={{ maxWidth: 120 }}>
      {/* Background arc */}
      <path
        d="M8 40 A32 32 0 0 1 72 40"
        fill="none"
        stroke="#252528"
        strokeWidth="6"
        strokeLinecap="round"
      />
      {/* Value arc */}
      <path
        d="M8 40 A32 32 0 0 1 72 40"
        fill="none"
        stroke={arcColor}
        strokeWidth="6"
        strokeLinecap="round"
        strokeDasharray={`${(angle / 180) * 100} 200`}
      />
      {/* Needle */}
      <line
        x1="40"
        y1="40"
        x2={40 + 26 * Math.cos(((180 - angle) * Math.PI) / 180)}
        y2={40 - 26 * Math.sin(((180 - angle) * Math.PI) / 180)}
        stroke="#555"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  )
}

function PieViz({
  value,
  max = 100,
  status,
}: {
  value: number
  max?: number
  status: string
}) {
  const pct = Math.min((value / max) * 100, 100)
  const circumference = 2 * Math.PI * 18
  const fillColor =
    status === "critical"
      ? "#dc4545"
      : status === "warning"
        ? "#d4a030"
        : "#2ea860"
  return (
    <svg viewBox="0 0 44 44" className="mt-2 w-full" style={{ maxWidth: 64 }}>
      <circle
        cx="22"
        cy="22"
        r="18"
        fill="none"
        stroke="#252528"
        strokeWidth="5"
      />
      <circle
        cx="22"
        cy="22"
        r="18"
        fill="none"
        stroke={fillColor}
        strokeWidth="5"
        strokeDasharray={`${(pct / 100) * circumference} ${circumference}`}
        strokeLinecap="round"
        transform="rotate(-90 22 22)"
      />
    </svg>
  )
}

function SparkViz({ status }: { status: string }) {
  const lineColor =
    status === "critical"
      ? "#dc4545"
      : status === "warning"
        ? "#d4a030"
        : "#2ea860"
  // deterministic fake sparkline
  const points = "0,14 8,10 16,12 24,6 32,8 40,4 48,9 56,5 64,7 72,3 80,6"
  return (
    <svg viewBox="0 0 80 18" className="mt-2 w-full" style={{ maxWidth: 120 }}>
      <polyline
        fill="none"
        stroke={lineColor}
        strokeWidth="1.5"
        points={points}
      />
    </svg>
  )
}

function MetricViz({ metric }: { metric: Metric }) {
  switch (metric.viz) {
    case "bar":
      return <BarViz value={metric.value} status={metric.status} />
    case "gauge":
      return (
        <GaugeViz
          value={metric.value}
          max={metric.gaugeMax}
          status={metric.status}
          ticks={metric.gaugeTicks}
        />
      )
    case "pie":
      return <PieViz value={metric.value} status={metric.status} />
    case "spark":
      return <SparkViz status={metric.status} />
  }
}

// --- Status badge ------------------------------------------------------

function StatusDot({ status }: { status: Metric["status"] }) {
  const color =
    status === "critical"
      ? "#dc4545"
      : status === "warning"
        ? "#d4a030"
        : "#2ea860"
  return (
    <span
      className="inline-block size-1.5 rounded-full"
      style={{ backgroundColor: color }}
    />
  )
}

// --- Main component ----------------------------------------------------

function MonitoringDashboard() {
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <div
      className="dark flex w-full flex-col gap-4 rounded-lg p-5 text-sm"
      style={{ backgroundColor: "#1a1a1f", color: "#8a8a94" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span
            className="text-base font-semibold"
            style={{ color: "#c8c8d0" }}
          >
            Station Monitor
          </span>
          <span
            className="rounded-sm px-1.5 py-0.5 text-[10px] font-medium tracking-wide uppercase"
            style={{ backgroundColor: "#2a2a30", color: "#7a7a82" }}
          >
            Live
          </span>
        </div>
        <span style={{ color: "#8a8a90" }} className="text-xs">
          14:30 — 14:35
        </span>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(v) => v && setActiveTab(v)}>
        <TabsList className="gap-0">
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.id}
              value={tab.id}
              className="px-3 text-xs font-medium"
              style={{ cursor: activeTab === tab.id ? "default" : "pointer" }}
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {tabs.map((tab) => (
          <TabsContent key={tab.id} value={tab.id}>
            {/* Masonry-style grid */}
            <div className="mt-3 columns-2 gap-3 sm:columns-3">
              {tab.metrics.map((metric) => (
                <div
                  key={metric.label}
                  className="mb-3 break-inside-avoid rounded-lg p-3"
                  style={{ backgroundColor: "#202024" }}
                >
                  <div className="flex items-center gap-1.5">
                    <StatusDot status={metric.status} />
                    <span className="text-[11px]" style={{ color: "#8a8a92" }}>
                      {metric.label}
                    </span>
                  </div>
                  <div
                    className="mt-1 text-xl font-semibold tabular-nums"
                    style={{ color: "#b0b0b8" }}
                  >
                    {metric.value}
                    <span
                      className="ml-0.5 text-xs font-normal"
                      style={{ color: "#4a4a52" }}
                    >
                      {metric.unit}
                    </span>
                  </div>
                  <MetricViz metric={metric} />
                  {metric.rangeLabel && (
                    <span
                      className="mt-1.5 inline-block text-[10px] font-medium tracking-wide uppercase"
                      style={{ color: "#3a3a3f" }}
                    >
                      {metric.rangeLabel}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {/* Footer */}
      <div
        className="flex items-center justify-between border-t pt-3 text-[11px]"
        style={{ borderColor: "#252528", color: "#3a3a3f" }}
      >
        <span>Monitoring Window: 14.01.2026</span>
        <span>PMP-02 · Supervisor: T. Anderson</span>
      </div>
    </div>
  )
}

export const monitoringDashboard: MiniAppDefinition = {
  id: "monitoring-dashboard",
  name: "Equipment Monitor",
  introduction:
    "An industrial equipment monitoring dashboard showing metrics about station performance, individual units, diagnostics, and maintenance status.",
  category: "dataviz",
  difficulty: "easy",
  component: MonitoringDashboard,
  expectedAnswers: [
    "The metric units have very low contrast against the dark background, making them hard to read.",
    "Some elements lack sufficient contrast even though the main values are readable.",
    "The secondary text is too dark and blends into the dark background due to poor contrast.",
    "While the big numbers are readable, the supporting text (labels, units) fail contrast requirements.",
    "The labels and units are nearly invisible against the dark background.",
    "Can barely read the small text under the numbers — too low contrast.",
    "The units like ms, %, req/s are hard to see because the text is too dim.",
    "Secondary text on the dashboard cards blends into the background.",
    "The metric names and units need more contrast — only the big values are legible.",
    "Some text on the cards is almost impossible to read because it's dark gray on a dark background.",
    "Hard to read the supporting info on each metric card.",
  ],
  hint: "Each metric has a label, value, and unit.",
  wrongAnswers: [
    "The tabs are confusing or don't work properly.",
    "The layout is too cluttered or hard to navigate.",
    "The metrics don't update in real time.",
    "There's no way to interact with the charts.",
    "The masonry layout makes it hard to compare values.",
    "The dashboard is missing important metrics.",
  ],
}
