import { BrainCircuit, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { generateAnalysis } from "../lib/simulation";
import type { EconomicVariables } from "../types/economy";

export function AnalystPanel({ variables }: { variables: EconomicVariables }) {
  const analysis = generateAnalysis(variables);

  return (
    <motion.section layout className="glass rounded-[8px] p-5">
      <div className="mb-4 flex items-center gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-[8px] bg-cyan/10 text-cyan">
          <BrainCircuit className="h-5 w-5" />
        </div>
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-cyan">AI Economic Analysis</p>
          <h2 className="text-lg font-semibold text-white">Policy brief</h2>
        </div>
      </div>
      <motion.p key={analysis.headline} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm leading-6 text-slate-200">
        {analysis.headline}
      </motion.p>
      <div className="mt-5 grid gap-3 lg:grid-cols-3">
        {[
          ["Risks", analysis.risks],
          ["Tradeoffs", analysis.tradeoffs],
          ["Policy Insights", analysis.insights]
        ].map(([title, items]) => (
          <div key={title as string} className="rounded-[8px] border border-white/10 bg-black/20 p-4">
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-white">
              <Sparkles className="h-4 w-4 text-amber" />
              {title as string}
            </div>
            <ul className="space-y-2 text-xs leading-5 text-slate-300">
              {(items as string[]).map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </motion.section>
  );
}
