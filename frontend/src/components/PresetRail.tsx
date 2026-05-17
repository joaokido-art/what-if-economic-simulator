import { motion } from "framer-motion";
import { presets } from "../data/economicVariables";
import type { Preset } from "../types/economy";

export function PresetRail({ active, onSelect }: { active: string; onSelect: (preset: Preset) => void }) {
  return (
    <section className="glass rounded-[8px] p-4">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-slate-500">Country Presets</p>
          <h2 className="text-base font-semibold text-white">Scenario library</h2>
        </div>
      </div>
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
        {presets.map((preset) => (
          <motion.button
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            key={preset.name}
            onClick={() => onSelect(preset)}
            className={`rounded-[8px] border p-3 text-left transition ${
              active === preset.name ? "border-cyan/50 bg-cyan/10" : "border-white/10 bg-white/[0.035] hover:border-white/25"
            }`}
          >
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm font-semibold text-white">{preset.name}</span>
              <span className="rounded-full bg-white/10 px-2 py-0.5 font-mono text-[10px] uppercase text-slate-400">
                {preset.category}
              </span>
            </div>
            <p className="mt-2 line-clamp-2 text-xs leading-5 text-slate-400">{preset.description}</p>
          </motion.button>
        ))}
      </div>
    </section>
  );
}
