import { Info } from "lucide-react";
import { motion } from "framer-motion";
import { variableMeta } from "../data/economicVariables";
import type { EconomicVariables, VariableKey } from "../types/economy";

type ControlPanelProps = {
  variables: EconomicVariables;
  onChange: (key: VariableKey, value: number) => void;
};

const keys = Object.keys(variableMeta) as VariableKey[];

export function ControlPanel({ variables, onChange }: ControlPanelProps) {
  return (
    <section className="glass rounded-[8px] p-4 sm:p-5">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-cyan">Control Room</p>
          <h2 className="mt-1 text-lg font-semibold text-white">Economic levers</h2>
        </div>
        <span className="rounded-full border border-cyan/20 bg-cyan/10 px-3 py-1 font-mono text-[11px] text-cyan">LIVE</span>
      </div>

      <div className="space-y-4">
        {keys.map((key, index) => {
          const meta = variableMeta[key];
          const value = variables[key];
          return (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.025 }}
              className="rounded-[8px] border border-white/10 bg-white/[0.035] p-3"
            >
              <div className="mb-2 flex items-center justify-between gap-3">
                <div className="group relative flex items-center gap-2">
                  <label className="text-sm font-medium text-slate-200" htmlFor={key}>
                    {meta.label}
                  </label>
                  <Info className="h-3.5 w-3.5 text-slate-500" />
                  <div className="pointer-events-none absolute left-0 top-6 z-20 w-64 rounded-[8px] border border-white/10 bg-slate-950/95 p-3 text-xs leading-relaxed text-slate-300 opacity-0 shadow-card transition group-hover:opacity-100">
                    {meta.explanation}
                  </div>
                </div>
                <div className="font-mono text-sm text-white">
                  {meta.unit === "$" && meta.unit}
                  {Number(value).toFixed(meta.step < 1 ? 1 : 0)}
                  {meta.unit !== "$" && <span className="text-slate-500"> {meta.unit}</span>}
                </div>
              </div>
              <input
                id={key}
                type="range"
                min={meta.min}
                max={meta.max}
                step={meta.step}
                value={value}
                onChange={(event) => onChange(key, Number(event.target.value))}
                aria-label={meta.label}
              />
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
