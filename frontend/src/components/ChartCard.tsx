import { motion } from "framer-motion";
import { Area, AreaChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { SimulationPoint } from "../types/economy";

type ChartCardProps = {
  title: string;
  eyebrow: string;
  data: SimulationPoint[];
  dataKey: keyof SimulationPoint;
  color: string;
  secondaryKey?: keyof SimulationPoint;
  overlay?: SimulationPoint[];
  compact?: boolean;
};

export function ChartCard({ title, eyebrow, data, dataKey, color, secondaryKey, overlay, compact }: ChartCardProps) {
  const latest = data[data.length - 1]?.[dataKey];

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-[8px] p-4 sm:p-5"
    >
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-slate-500">{eyebrow}</p>
          <h3 className="mt-1 text-sm font-semibold text-slate-100">{title}</h3>
        </div>
        <div className="rounded-[8px] border border-white/10 bg-white/[0.04] px-3 py-1.5 text-right font-mono text-sm text-white">
          {typeof latest === "number" ? latest.toFixed(1) : latest}
        </div>
      </div>
      <div className={compact ? "h-36" : "h-56"}>
        <ResponsiveContainer width="100%" height="100%">
          {secondaryKey ? (
            <AreaChart data={data} margin={{ top: 6, right: 8, left: -26, bottom: 0 }}>
              <defs>
                <linearGradient id={`${String(dataKey)}Fill`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={color} stopOpacity={0.45} />
                  <stop offset="95%" stopColor={color} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="rgba(148,163,184,.09)" vertical={false} />
              <XAxis dataKey="month" stroke="#64748b" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
              <YAxis stroke="#64748b" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ background: "#080d18", border: "1px solid rgba(148,163,184,.18)", borderRadius: 8 }} />
              <Area type="monotone" dataKey={dataKey as string} stroke={color} fill={`url(#${String(dataKey)}Fill)`} strokeWidth={2.4} dot={false} />
              <Line type="monotone" dataKey={secondaryKey as string} stroke="rgba(245,196,81,.8)" strokeWidth={1.6} dot={false} />
            </AreaChart>
          ) : (
            <LineChart data={data} margin={{ top: 6, right: 8, left: -26, bottom: 0 }}>
              <CartesianGrid stroke="rgba(148,163,184,.09)" vertical={false} />
              <XAxis dataKey="month" stroke="#64748b" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
              <YAxis stroke="#64748b" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ background: "#080d18", border: "1px solid rgba(148,163,184,.18)", borderRadius: 8 }} />
              {overlay && <Line type="monotone" data={overlay} dataKey={dataKey as string} stroke="rgba(148,163,184,.45)" strokeWidth={1.6} dot={false} strokeDasharray="5 5" />}
              <Line type="monotone" dataKey={dataKey as string} stroke={color} strokeWidth={2.6} dot={false} activeDot={{ r: 4, fill: color }} />
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>
    </motion.article>
  );
}
