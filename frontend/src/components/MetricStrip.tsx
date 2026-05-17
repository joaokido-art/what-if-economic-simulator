import { ArrowDown, ArrowUp, ShieldAlert } from "lucide-react";
import { motion } from "framer-motion";
import type { IndicatorKey } from "../types/economy";

const labels: Record<IndicatorKey, string> = {
  gdpGrowth: "GDP Growth",
  costOfLiving: "Cost of Living",
  employment: "Employment",
  purchasingPower: "Purchasing Power",
  currencyStability: "Currency Stability",
  publicDebt: "Public Debt",
  marketConfidence: "Market Confidence"
};

type MetricStripProps = {
  indicators: Record<IndicatorKey, number>;
  riskScore: number;
};

export function MetricStrip({ indicators, riskScore }: MetricStripProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {(Object.keys(labels) as IndicatorKey[]).slice(0, 7).map((key, index) => {
        const value = indicators[key];
        const positive = key === "publicDebt" || key === "costOfLiving" ? value < 95 : value > 50 || (key === "gdpGrowth" && value > 1);
        return (
          <motion.div
            key={key}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.035 }}
            className="glass rounded-[8px] p-4"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400">{labels[key]}</span>
              {positive ? <ArrowUp className="h-4 w-4 text-mint" /> : <ArrowDown className="h-4 w-4 text-rose" />}
            </div>
            <div className="mt-3 font-mono text-2xl font-semibold text-white">{value.toFixed(1)}</div>
            <div className="mt-3 h-1.5 rounded-full bg-white/10">
              <div
                className={`h-1.5 rounded-full ${positive ? "bg-mint" : "bg-rose"}`}
                style={{ width: `${Math.min(100, Math.abs(value))}%` }}
              />
            </div>
          </motion.div>
        );
      })}
      <motion.div className="glass rounded-[8px] p-4" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-400">Policy Risk Score</span>
          <ShieldAlert className="h-4 w-4 text-amber" />
        </div>
        <div className="mt-3 font-mono text-2xl font-semibold text-white">{riskScore}</div>
        <div className="mt-3 h-1.5 rounded-full bg-white/10">
          <div className="h-1.5 rounded-full bg-amber" style={{ width: `${riskScore}%` }} />
        </div>
      </motion.div>
    </div>
  );
}
