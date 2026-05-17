import { ArrowRight, BarChart3, BriefcaseBusiness, Landmark, LineChart, Play, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import { ResponsiveContainer, AreaChart, Area, Line, XAxis } from "recharts";
import type { SimulationPoint } from "../types/economy";

export function LandingPage({ previewData, onEnter }: { previewData: SimulationPoint[]; onEnter: () => void }) {
  const shortData = previewData.slice(0, 14);
  return (
    <main className="relative overflow-hidden bg-radial-grid thin-grid">
      <section className="mx-auto grid min-h-[78vh] max-w-7xl items-center gap-10 px-4 py-16 lg:grid-cols-[1fr_1.05fr]">
        <motion.div initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-cyan/20 bg-cyan/10 px-3 py-1 text-xs text-cyan">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan shadow-[0_0_18px_rgba(56,213,255,.9)]" />
            Scenario intelligence for macro decisions
          </div>
          <h1 className="text-balance text-5xl font-extrabold leading-[1.02] text-white sm:text-6xl lg:text-7xl">
            Understand the Economy by Changing It.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-300">
            A premium what-if simulator for policy teams, classrooms, research desks, and market strategists exploring how macro levers reshape growth, inflation, jobs, and risk.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <button onClick={onEnter} className="group inline-flex items-center gap-2 rounded-[8px] bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan">
              Launch simulator
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
            </button>
            <a href="#preview" className="inline-flex items-center gap-2 rounded-[8px] border border-white/15 bg-white/[0.04] px-5 py-3 text-sm font-semibold text-white hover:border-white/30">
              <Play className="h-4 w-4" />
              View preview
            </a>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }} className="relative">
          <div className="glass rounded-[8px] p-4 shadow-glow">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-cyan">What If? Terminal</p>
                <h2 className="mt-1 text-xl font-semibold text-white">Growth vs. Inflation forecast</h2>
              </div>
              <div className="rounded-[8px] border border-mint/30 bg-mint/10 px-3 py-1 font-mono text-xs text-mint">+2.8 GDP</div>
            </div>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={shortData} margin={{ left: -18, right: 10, top: 8, bottom: 0 }}>
                  <defs>
                    <linearGradient id="heroGdp" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#38d5ff" stopOpacity={0.55} />
                      <stop offset="100%" stopColor="#38d5ff" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="month" stroke="#64748b" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                  <Area dataKey="gdp" type="monotone" fill="url(#heroGdp)" stroke="#38d5ff" strokeWidth={3} dot={false} />
                  <Line dataKey="inflation" type="monotone" stroke="#f5c451" strokeWidth={2} dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="absolute -bottom-6 left-5 right-5 grid grid-cols-3 gap-3">
            {["Inflation -0.8", "Jobs +1.4", "Risk 42"].map((item) => (
              <div key={item} className="rounded-[8px] border border-white/10 bg-slate-950/85 px-3 py-3 text-center font-mono text-xs text-slate-200 backdrop-blur">
                {item}
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      <section id="preview" className="mx-auto max-w-7xl px-4 pb-24">
        <div className="grid gap-4 md:grid-cols-3">
          {[
            [Landmark, "Policy Lab", "Tune rates, taxes, wages, tariffs, spending, and confidence with immediate feedback."],
            [LineChart, "Animated Forecasts", "Watch GDP, inflation, employment, debt, currency, and purchasing power evolve over time."],
            [BriefcaseBusiness, "Analyst Briefs", "Translate each scenario into crisp risks, tradeoffs, and policy insight."]
          ].map(([Icon, title, copy]) => (
            <article key={title as string} className="glass rounded-[8px] p-5">
              <Icon className="h-5 w-5 text-cyan" />
              <h3 className="mt-5 text-lg font-semibold text-white">{title as string}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-400">{copy as string}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-10 px-4 pb-24 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-cyan">How It Works</p>
          <h2 className="mt-3 text-3xl font-bold text-white">From assumptions to policy narrative in seconds.</h2>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            [BarChart3, "Model simplified relationships"],
            [ShieldCheck, "Score macro fragility"],
            [LineChart, "Compare against historical shocks"],
            [Landmark, "Save and revisit scenarios"]
          ].map(([Icon, text]) => (
            <div key={text as string} className="rounded-[8px] border border-white/10 bg-white/[0.035] p-4">
              <Icon className="h-5 w-5 text-mint" />
              <p className="mt-4 font-medium text-slate-100">{text as string}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
