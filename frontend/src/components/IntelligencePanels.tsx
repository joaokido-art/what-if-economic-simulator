import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, BrainCircuit, ChevronRight, Dice5, Flame, HelpCircle, Landmark, Scale, Sparkles, Users } from "lucide-react";
import { historyScenarios } from "../data/historyScenarios";
import { computeIndicators } from "../lib/simulation";
import type { EconomicVariables, VariableKey } from "../types/economy";

type IntelligencePanelsProps = {
  variables: EconomicVariables;
  onChange: (key: VariableKey, value: number) => void;
};

const whyItMatters = [
  ["Inflation", "Persistent inflation reduces purchasing power and hits lower-income households first because essentials take a larger share of income."],
  ["Interest rates", "Higher borrowing costs affect mortgages, startups, business investment, hiring, and the value of future cash flows."],
  ["Unemployment", "A weak labor market is not just a statistic; it changes bargaining power, household confidence, migration, and politics."],
  ["Currency strength", "Currency weakness can make imports, energy, food, and foreign debt more expensive."],
  ["Public debt", "Debt can stabilize a crisis, but high debt plus weak growth reduces future policy room."]
];

const ideologyModes = [
  ["Keynesian", "During downturns, increase public demand and protect employment until private spending recovers."],
  ["Monetarist", "Stabilize money growth and inflation expectations; credibility is the anchor."],
  ["Austrian", "Avoid artificial credit booms; let malinvestment clear instead of extending bubbles."],
  ["Modern Monetary Theory", "Focus on real resource constraints and inflation, not household-style budget analogies."],
  ["Classical", "Improve productivity, savings, trade, and predictable rules rather than fine-tuning demand."]
];

const shocks: Array<{ name: string; effect: Partial<EconomicVariables>; note: string }> = [
  { name: "Oil shortage", effect: { inflation: 2.8, consumerConfidence: -8, currencyStrength: -4 }, note: "Energy costs rise and households cut discretionary spending." },
  { name: "Banking panic", effect: { unemployment: 3.5, consumerConfidence: -18, interestRate: -1.2 }, note: "Credit freezes and central bank emergency easing begins." },
  { name: "AI productivity boom", effect: { consumerConfidence: 12, inflation: -1.2, unemployment: -1.1, currencyStrength: 5 }, note: "Productivity improves, but labor displacement risk remains." },
  { name: "Trade war", effect: { tariffs: 12, inflation: 2.2, unemployment: 1.7, consumerConfidence: -7 }, note: "Import costs rise while export markets become less reliable." },
  { name: "Migration wave", effect: { minimumWage: -1.5, governmentSpending: 6, consumerConfidence: -3, unemployment: 1.2 }, note: "Labor supply and public service pressure rise together." }
];

export function IntelligencePanels({ variables, onChange }: IntelligencePanelsProps) {
  const [activeShock, setActiveShock] = useState(shocks[0]);
  const parallels = useMemo(() => calculateParallels(variables), [variables]);
  const indicators = useMemo(() => computeIndicators(variables), [variables]);
  const psychology = useMemo(() => buildPsychology(variables), [variables]);
  const score = Math.round((indicators.currencyStability + indicators.marketConfidence + indicators.employment + psychology.socialStability) / 4);

  const applyShock = () => {
    activeShock.effect.interestRate && onChange("interestRate", clamp(variables.interestRate + activeShock.effect.interestRate, 0, 18));
    activeShock.effect.inflation && onChange("inflation", clamp(variables.inflation + activeShock.effect.inflation, -2, 28));
    activeShock.effect.tariffs && onChange("tariffs", clamp(variables.tariffs + activeShock.effect.tariffs, 0, 45));
    activeShock.effect.minimumWage && onChange("minimumWage", clamp(variables.minimumWage + activeShock.effect.minimumWage, 7, 35));
    activeShock.effect.governmentSpending && onChange("governmentSpending", clamp(variables.governmentSpending + activeShock.effect.governmentSpending, 20, 85));
    activeShock.effect.unemployment && onChange("unemployment", clamp(variables.unemployment + activeShock.effect.unemployment, 2, 28));
    activeShock.effect.consumerConfidence && onChange("consumerConfidence", clamp(variables.consumerConfidence + activeShock.effect.consumerConfidence, 0, 100));
    activeShock.effect.currencyStrength && onChange("currencyStrength", clamp(variables.currencyStrength + activeShock.effect.currencyStrength, 0, 100));
    activeShock.effect.taxRate && onChange("taxRate", clamp(variables.taxRate + activeShock.effect.taxRate, 5, 60));
  };

  return (
    <div className="grid gap-5 2xl:grid-cols-[1.1fr_0.9fr]">
      <section className="glass rounded-[8px] p-5">
        <div className="mb-4 flex items-center justify-between gap-4">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-amber">Historical Parallels</p>
            <h2 className="text-lg font-semibold text-white">This resembles</h2>
          </div>
          <Sparkles className="h-5 w-5 text-amber" />
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          {parallels.map((parallel) => (
            <div key={parallel.title} className="rounded-[8px] border border-white/10 bg-black/20 p-4">
              <div className="text-sm font-semibold text-white">{parallel.title}</div>
              <div className="mt-2 font-mono text-2xl text-amber">{parallel.similarity}%</div>
              <div className="mt-3 h-1.5 rounded-full bg-white/10">
                <div className="h-1.5 rounded-full bg-amber" style={{ width: `${parallel.similarity}%` }} />
              </div>
              <p className="mt-3 text-xs leading-5 text-slate-400">{parallel.reason}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="glass rounded-[8px] p-5">
        <div className="mb-4 flex items-center gap-2">
          <Users className="h-5 w-5 text-cyan" />
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-cyan">Live Market Psychology</p>
            <h2 className="text-lg font-semibold text-white">Human pressure layer</h2>
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {Object.entries(psychology).map(([label, value]) => (
            <div key={label} className="rounded-[8px] border border-white/10 bg-white/[0.035] p-3">
              <div className="flex items-center justify-between text-sm">
                <span className="capitalize text-slate-300">{label.replace(/([A-Z])/g, " $1")}</span>
                <span className="font-mono text-white">{Math.round(value)}</span>
              </div>
              <div className="mt-2 h-1.5 rounded-full bg-white/10">
                <div className="h-1.5 rounded-full bg-cyan" style={{ width: `${value}%` }} />
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="glass rounded-[8px] p-5">
        <div className="mb-4 flex items-center gap-2">
          <Flame className="h-5 w-5 text-rose" />
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-rose">Economic Chains</p>
            <h2 className="text-lg font-semibold text-white">Systems map</h2>
          </div>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          {buildChains(variables).map((chain) => (
            <div key={chain[0]} className="rounded-[8px] border border-white/10 bg-black/20 p-4">
              <div className="flex flex-wrap items-center gap-2">
                {chain.map((item, index) => (
                  <span key={item} className="inline-flex items-center gap-2">
                    <motion.span layout className="rounded-[8px] border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-slate-300">{item}</motion.span>
                    {index < chain.length - 1 && <ChevronRight className="h-4 w-4 animate-pulse text-slate-600" />}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="glass rounded-[8px] p-5">
        <div className="mb-4 flex items-center gap-2">
          <Landmark className="h-5 w-5 text-mint" />
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-mint">Policy Experiments</p>
            <h2 className="text-lg font-semibold text-white">Strategy lab score</h2>
          </div>
        </div>
        <div className="rounded-[8px] border border-mint/20 bg-mint/10 p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-300">Can you engineer a soft landing?</span>
            <span className="font-mono text-3xl text-white">{score}</span>
          </div>
          <div className="mt-3 h-2 rounded-full bg-white/10">
            <div className="h-2 rounded-full bg-mint" style={{ width: `${score}%` }} />
          </div>
          <p className="mt-3 text-xs leading-5 text-slate-300">{score > 72 ? "Stable recovery path. Public trust and market confidence are reinforcing each other." : score > 48 ? "Playable but fragile. One shock could push the economy toward recession or inflation stress." : "Crisis conditions. Stabilize currency, trust, and employment before growth can recover."}</p>
        </div>
      </section>

      <section className="glass rounded-[8px] p-5">
        <div className="mb-4 flex items-center gap-2">
          <Dice5 className="h-5 w-5 text-amber" />
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-amber">Global Shock Engine</p>
            <h2 className="text-lg font-semibold text-white">Random event desk</h2>
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
          <select
            value={activeShock.name}
            onChange={(event) => setActiveShock(shocks.find((shock) => shock.name === event.target.value) ?? shocks[0])}
            className="rounded-[8px] border border-white/10 bg-slate-950 px-3 py-2 text-sm text-white"
          >
            {shocks.map((shock) => <option key={shock.name}>{shock.name}</option>)}
          </select>
          <button onClick={applyShock} className="rounded-[8px] bg-white px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-amber">Apply shock</button>
        </div>
        <p className="mt-3 text-sm leading-6 text-slate-300">{activeShock.note}</p>
      </section>

      <section className="glass rounded-[8px] p-5">
        <div className="mb-4 flex items-center gap-2">
          <Scale className="h-5 w-5 text-cyan" />
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-cyan">Economic Ideology Modes</p>
            <h2 className="text-lg font-semibold text-white">Schools of response</h2>
          </div>
        </div>
        <div className="space-y-2">
          {ideologyModes.map(([name, text]) => (
            <details key={name} className="rounded-[8px] border border-white/10 bg-white/[0.035] p-3">
              <summary className="cursor-pointer list-none text-sm font-semibold text-white">{name}</summary>
              <p className="mt-2 text-xs leading-5 text-slate-400">{text}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="glass rounded-[8px] p-5 2xl:col-span-2">
        <div className="mb-4 flex items-center gap-2">
          <HelpCircle className="h-5 w-5 text-cyan" />
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-cyan">Why This Matters</p>
            <h2 className="text-lg font-semibold text-white">What normal people feel</h2>
          </div>
        </div>
        <div className="grid gap-3 md:grid-cols-5">
          {whyItMatters.map(([label, text]) => (
            <div key={label} className="rounded-[8px] border border-white/10 bg-white/[0.035] p-3">
              <div className="text-sm font-semibold text-white">{label}</div>
              <p className="mt-2 text-xs leading-5 text-slate-400">{text}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function calculateParallels(variables: EconomicVariables) {
  return historyScenarios
    .map((scenario) => {
      const distance = Object.entries(variables).reduce((score, [key, value]) => {
        const scenarioValue = scenario.variables[key as keyof EconomicVariables];
        return score + Math.abs(value - scenarioValue);
      }, 0);
      const similarity = Math.max(18, Math.min(96, Math.round(100 - distance / 5.6)));
      return {
        title: scenario.title,
        similarity,
        reason: `Shared signals: ${dominantSignals(variables, scenario.variables).join(", ")}.`
      };
    })
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, 3);
}

function dominantSignals(a: EconomicVariables, b: EconomicVariables) {
  const pairs: Array<[string, number]> = [
    ["inflation", Math.abs(a.inflation - b.inflation)],
    ["rates", Math.abs(a.interestRate - b.interestRate)],
    ["debt/fiscal pressure", Math.abs(a.governmentSpending - b.governmentSpending)],
    ["currency trust", Math.abs(a.currencyStrength - b.currencyStrength)],
    ["labor stress", Math.abs(a.unemployment - b.unemployment)]
  ];
  return pairs.sort((x, y) => x[1] - y[1]).slice(0, 3).map(([label]) => label as string);
}

function buildPsychology(v: EconomicVariables) {
  return {
    fearIndex: clamp(35 + v.inflation * 1.8 + v.unemployment * 1.9 - v.consumerConfidence * 0.35, 0, 100),
    investorOptimism: clamp(v.consumerConfidence * 0.5 + v.currencyStrength * 0.28 - v.interestRate * 1.2 - v.inflation * 0.9 + 22, 0, 100),
    socialStability: clamp(105 - v.unemployment * 2.2 - v.inflation * 1.4 - v.tariffs * 0.35 + v.minimumWage * 0.5, 0, 100),
    politicalPressure: clamp(v.inflation * 1.7 + v.unemployment * 2 + v.governmentSpending * 0.25 - v.consumerConfidence * 0.35, 0, 100)
  };
}

function buildChains(v: EconomicVariables) {
  const chains = [
    ["Interest Rates ↑", "Consumer Spending ↓", "Business Revenue ↓", "Hiring ↓", "Unemployment ↑"],
    ["Tariffs ↑", "Import Costs ↑", "Prices ↑", "Trade Volume ↓", "Political Pressure ↑"],
    ["Money Trust ↓", "Currency Weakens", "Real Asset Demand ↑", "Inflation Expectations ↑", "Social Stability ↓"]
  ];
  if (v.consumerConfidence > 70) chains.push(["Confidence ↑", "Spending ↑", "Revenue ↑", "Investment ↑", "GDP ↑"]);
  if (v.governmentSpending > 60) chains.push(["Spending ↑", "Demand Support ↑", "Debt Pressure ↑", "Credibility Test", "Risk Premium ↑"]);
  return chains.slice(0, 4);
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}
