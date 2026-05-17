import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  Banknote,
  BookOpen,
  BrainCircuit,
  ChevronRight,
  CircleDollarSign,
  Clock3,
  Flame,
  Globe2,
  GraduationCap,
  Landmark,
  Pause,
  Play,
  Radio,
  ShieldAlert,
  Sparkles,
  TrendingDown
} from "lucide-react";
import { Area, AreaChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { economyLessons, historyScenarios } from "../data/historyScenarios";
import type { HistoryScenario, HistoryTimelinePoint } from "../types/economy";

type HistoryModeProps = {
  onExit: () => void;
};

export function HistoryMode({ onExit }: HistoryModeProps) {
  const [selectedId, setSelectedId] = useState(historyScenarios[0].id);
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [section, setSection] = useState<"war-room" | "economy" | "model">("war-room");

  const scenario = useMemo(() => historyScenarios.find((item) => item.id === selectedId) ?? historyScenarios[0], [selectedId]);
  const current = scenario.timeline[step] ?? scenario.timeline[0];

  useEffect(() => {
    setStep(0);
    setPlaying(false);
  }, [selectedId]);

  useEffect(() => {
    if (!playing) return;
    const timer = window.setInterval(() => {
      setStep((value) => (value + 1) % scenario.timeline.length);
    }, 1600);
    return () => window.clearInterval(timer);
  }, [playing, scenario.timeline.length]);

  const visibleTimeline = scenario.timeline.slice(0, step + 1);
  const tickerItems = buildTicker(scenario, current);

  return (
    <div className="min-h-screen bg-ink bg-radial-grid thin-grid">
      <HistoryTicker items={tickerItems} scenario={scenario} />
      <div className="mx-auto max-w-[1600px] px-4 py-5">
        <header className="glass mb-5 rounded-[8px] p-5">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-amber/25 bg-amber/10 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.22em] text-amber">
                <Flame className="h-3.5 w-3.5" />
                Echoes of History
              </div>
              <h1 className="text-3xl font-bold text-white sm:text-4xl">History Mode</h1>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">
                Replay historical crises, civilizations, bubbles, shocks, and growth miracles as living economic systems.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <ModeButton active={section === "war-room"} onClick={() => setSection("war-room")} label="War Room" />
              <ModeButton active={section === "economy"} onClick={() => setSection("economy")} label="How Economy Works" />
              <ModeButton active={section === "model"} onClick={() => setSection("model")} label="Simulation Model" />
              <button onClick={onExit} className="inline-flex items-center gap-2 rounded-[8px] border border-white/10 bg-white/[0.04] px-3 py-2 text-sm font-semibold text-white hover:border-cyan/40">
                Sandbox
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </header>

        {section === "war-room" && (
          <div className="grid gap-5 xl:grid-cols-[360px_1fr]">
            <aside className="space-y-5 xl:sticky xl:top-20 xl:h-[calc(100vh-6rem)] xl:overflow-auto xl:pr-1">
              <ScenarioSelector selectedId={selectedId} onSelect={setSelectedId} />
              <CrisisMap scenario={scenario} current={current} />
            </aside>
            <main className="space-y-5">
              <HeroScenario scenario={scenario} current={current} />
              <TimelineControl scenario={scenario} current={current} step={step} setStep={setStep} playing={playing} setPlaying={setPlaying} />
              <HistoryMetrics current={current} />
              <div className="grid gap-5 2xl:grid-cols-[1.15fr_0.85fr]">
                <HistoryChart title="Output, inflation, and stability" data={visibleTimeline} />
                <StressPanel scenario={scenario} current={current} />
              </div>
              <ChainReactions scenario={scenario} />
              <HistorianPanel scenario={scenario} current={current} />
            </main>
          </div>
        )}

        {section === "economy" && <EconomyEducation />}
        {section === "model" && <ModelExplanation />}
      </div>
    </div>
  );
}

function ModeButton({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-[8px] border px-3 py-2 text-sm font-semibold transition ${
        active ? "border-cyan/40 bg-cyan/10 text-cyan" : "border-white/10 bg-white/[0.04] text-white hover:border-white/25"
      }`}
    >
      {label}
    </button>
  );
}

function HistoryTicker({ items, scenario }: { items: string[]; scenario: HistoryScenario }) {
  return (
    <div className="sticky top-0 z-50 border-b border-amber/20 bg-black/70 py-2 backdrop-blur-xl">
      <div className="mx-auto flex max-w-[1600px] items-center gap-4 overflow-hidden px-4">
        <div className="flex shrink-0 items-center gap-2 font-mono text-[11px] uppercase tracking-[0.22em] text-amber">
          <Radio className="h-3.5 w-3.5 animate-pulse" />
          {scenario.region} Live Session
        </div>
        <div className="relative flex overflow-hidden">
          <div className="ticker-track flex min-w-max gap-8 text-xs text-slate-200">
            {[...items, ...items].map((item, index) => (
              <span key={`${item}-${index}`} className="inline-flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-rose shadow-[0_0_14px_rgba(251,113,133,.9)]" />
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ScenarioSelector({ selectedId, onSelect }: { selectedId: string; onSelect: (id: string) => void }) {
  return (
    <section className="glass rounded-[8px] p-4">
      <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-amber">Historical Scenarios</p>
      <h2 className="mt-1 text-lg font-semibold text-white">Select a crisis or turning point</h2>
      <div className="mt-4 space-y-2">
        {historyScenarios.map((scenario) => (
          <button
            key={scenario.id}
            onClick={() => onSelect(scenario.id)}
            className={`w-full rounded-[8px] border p-3 text-left transition ${
              selectedId === scenario.id ? "border-amber/50 bg-amber/10" : "border-white/10 bg-white/[0.035] hover:border-white/25"
            }`}
          >
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm font-semibold text-white">{scenario.title}</span>
              <span className="rounded-full bg-white/10 px-2 py-0.5 font-mono text-[10px] uppercase text-slate-400">{scenario.category}</span>
            </div>
            <div className="mt-2 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-slate-500">
              <Clock3 className="h-3 w-3" />
              {scenario.era}
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}

function CrisisMap({ scenario, current }: { scenario: HistoryScenario; current: HistoryTimelinePoint }) {
  const points = [
    ["ROME", "left-[48%] top-[38%]"],
    ["BERLIN", "left-[51%] top-[31%]"],
    ["TOKYO", "left-[79%] top-[42%]"],
    ["NEW YORK", "left-[25%] top-[36%]"],
    ["BEIJING", "left-[74%] top-[43%]"],
    ["BUENOS AIRES", "left-[34%] top-[72%]"]
  ];

  return (
    <section className="glass rounded-[8px] p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-slate-500">World Stress Map</p>
          <h2 className="text-base font-semibold text-white">{scenario.region}</h2>
        </div>
        <Globe2 className="h-5 w-5 text-cyan" />
      </div>
      <div className="relative mt-4 aspect-[1.55] overflow-hidden rounded-[8px] border border-white/10 bg-slate-950">
        <div className="absolute inset-0 opacity-60 [background:radial-gradient(circle_at_24%_42%,rgba(56,213,255,.25),transparent_13%),radial-gradient(circle_at_50%_36%,rgba(245,196,81,.32),transparent_15%),radial-gradient(circle_at_78%_45%,rgba(110,231,183,.24),transparent_14%),linear-gradient(135deg,rgba(15,23,42,.7),rgba(2,6,23,.95))]" />
        <div className="absolute left-[8%] top-[18%] h-[62%] w-[28%] rounded-[50%] border border-cyan/10 bg-cyan/5 blur-[1px]" />
        <div className="absolute left-[43%] top-[20%] h-[38%] w-[24%] rounded-[50%] border border-amber/10 bg-amber/5 blur-[1px]" />
        <div className="absolute left-[66%] top-[28%] h-[48%] w-[24%] rounded-[50%] border border-mint/10 bg-mint/5 blur-[1px]" />
        {points.map(([label, position]) => (
          <div key={label} className={`absolute ${position}`}>
            <span className="relative flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose opacity-60" />
              <span className="relative inline-flex h-3 w-3 rounded-full bg-rose" />
            </span>
          </div>
        ))}
        <div className="absolute bottom-3 left-3 right-3 rounded-[8px] border border-white/10 bg-black/45 p-3 backdrop-blur">
          <div className="flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.18em] text-slate-400">
            <span>Crisis intensity</span>
            <span className="text-rose">{current.crisisIntensity.toFixed(0)}%</span>
          </div>
          <div className="mt-2 h-1.5 rounded-full bg-white/10">
            <div className="h-1.5 rounded-full bg-rose" style={{ width: `${current.crisisIntensity}%` }} />
          </div>
        </div>
      </div>
    </section>
  );
}

function HeroScenario({ scenario, current }: { scenario: HistoryScenario; current: HistoryTimelinePoint }) {
  return (
    <section className="glass rounded-[8px] p-5">
      <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full border border-amber/25 bg-amber/10 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.18em] text-amber">{scenario.severity}</span>
            <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 font-mono text-[11px] uppercase tracking-[0.18em] text-slate-400">{scenario.era}</span>
          </div>
          <h2 className="mt-4 text-3xl font-bold text-white">{scenario.title}</h2>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">{scenario.context}</p>
        </div>
        <div className="rounded-[8px] border border-white/10 bg-black/20 p-4">
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-cyan">Current moment</p>
          <div className="mt-2 text-xl font-semibold text-white">{current.year}</div>
          <p className="mt-2 text-sm leading-6 text-slate-300">{current.event}</p>
          <div className="mt-4 rounded-[8px] bg-white/[0.04] p-3 text-xs leading-5 text-slate-400">
            Policy desk: <span className="text-slate-100">{current.policy}</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function TimelineControl({
  scenario,
  current,
  step,
  setStep,
  playing,
  setPlaying
}: {
  scenario: HistoryScenario;
  current: HistoryTimelinePoint;
  step: number;
  setStep: (step: number) => void;
  playing: boolean;
  setPlaying: (playing: boolean) => void;
}) {
  return (
    <section className="glass rounded-[8px] p-4">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-slate-500">Timeline System</p>
          <h2 className="text-base font-semibold text-white">Move through the crisis</h2>
        </div>
        <button onClick={() => setPlaying(!playing)} className="inline-flex items-center gap-2 rounded-[8px] bg-white px-3 py-2 text-sm font-semibold text-slate-950 hover:bg-amber">
          {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          {playing ? "Pause" : "Replay"}
        </button>
      </div>
      <input
        aria-label="Historical timeline"
        type="range"
        min={0}
        max={scenario.timeline.length - 1}
        value={step}
        onChange={(event) => setStep(Number(event.target.value))}
      />
      <div className="mt-4 grid gap-2 md:grid-cols-4">
        {scenario.timeline.map((point, index) => (
          <button
            key={`${point.year}-${point.event}`}
            onClick={() => setStep(index)}
            className={`rounded-[8px] border p-3 text-left transition ${
              index === step ? "border-cyan/50 bg-cyan/10" : "border-white/10 bg-white/[0.03] hover:border-white/25"
            }`}
          >
            <div className="font-mono text-[11px] text-cyan">{point.year}</div>
            <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-300">{point.event}</p>
          </button>
        ))}
      </div>
      <p className="mt-4 text-sm leading-6 text-slate-300">{current.year}: {current.event}</p>
    </section>
  );
}

function HistoryMetrics({ current }: { current: HistoryTimelinePoint }) {
  const cards = [
    ["Economic Stress", current.crisisIntensity, ShieldAlert, "text-rose", "bg-rose"],
    ["Social Stability", current.socialStability, Landmark, "text-mint", "bg-mint"],
    ["Currency Warning", 100 - current.currency, Banknote, "text-amber", "bg-amber"],
    ["Fear / Greed", current.fearGreed, TrendingDown, "text-cyan", "bg-cyan"],
    ["Public Trust", current.publicTrust, GraduationCap, "text-mint", "bg-mint"],
    ["Debt Pressure", current.debt / 2.2, CircleDollarSign, "text-amber", "bg-amber"]
  ] as const;

  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-6">
      {cards.map(([label, value, Icon, textClass, barClass]) => (
        <motion.article key={label} layout className="glass rounded-[8px] p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">{label}</span>
            <Icon className={`h-4 w-4 ${textClass}`} />
          </div>
          <div className="mt-3 font-mono text-2xl font-semibold text-white">{Math.round(value)}</div>
          <div className="mt-3 h-1.5 rounded-full bg-white/10">
            <div className={`h-1.5 rounded-full ${barClass}`} style={{ width: `${clampPercent(value)}%` }} />
          </div>
        </motion.article>
      ))}
    </div>
  );
}

function HistoryChart({ title, data }: { title: string; data: HistoryTimelinePoint[] }) {
  return (
    <section className="glass rounded-[8px] p-5">
      <div className="mb-4">
        <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-slate-500">Historical Dashboard</p>
        <h2 className="text-lg font-semibold text-white">{title}</h2>
      </div>
      <div className="h-[360px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ left: -24, right: 8, top: 8, bottom: 0 }}>
            <defs>
              <linearGradient id="historyGdp" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#38d5ff" stopOpacity={0.45} />
                <stop offset="100%" stopColor="#38d5ff" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="rgba(148,163,184,.09)" vertical={false} />
            <XAxis dataKey="year" stroke="#64748b" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
            <YAxis stroke="#64748b" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
            <Tooltip contentStyle={{ background: "#080d18", border: "1px solid rgba(148,163,184,.18)", borderRadius: 8 }} />
            <Area type="monotone" dataKey="gdp" stroke="#38d5ff" fill="url(#historyGdp)" strokeWidth={2.4} dot={false} />
            <Line type="monotone" dataKey="inflation" stroke="#f5c451" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="socialStability" stroke="#6ee7b7" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="crisisIntensity" stroke="#fb7185" strokeWidth={2} dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}

function StressPanel({ scenario, current }: { scenario: HistoryScenario; current: HistoryTimelinePoint }) {
  const meters = [
    ["Central bank credibility", current.centralBankCredibility],
    ["Population pressure", current.populationPressure],
    ["Currency collapse warning", 100 - current.currency],
    ["Stock fear index", 100 - current.fearGreed]
  ];

  return (
    <section className="glass rounded-[8px] p-5">
      <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-slate-500">Crisis Instruments</p>
      <h2 className="mt-1 text-lg font-semibold text-white">War room gauges</h2>
      <div className="mt-5 space-y-4">
        {meters.map(([label, value]) => (
          <div key={label as string}>
            <div className="mb-2 flex justify-between text-sm">
              <span className="text-slate-300">{label}</span>
              <span className="font-mono text-white">{Math.round(value as number)}</span>
            </div>
            <div className="h-2 rounded-full bg-white/10">
              <div className="h-2 rounded-full bg-gradient-to-r from-cyan via-amber to-rose" style={{ width: `${clampPercent(value as number)}%` }} />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 rounded-[8px] border border-white/10 bg-white/[0.035] p-4">
        <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-white">
          <AlertTriangle className="h-4 w-4 text-amber" />
          Historical parallels
        </div>
        <div className="flex flex-wrap gap-2">
          {scenario.parallels.map((parallel) => (
            <span key={parallel} className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs text-slate-300">{parallel}</span>
          ))}
        </div>
      </div>
    </section>
  );
}

function ChainReactions({ scenario }: { scenario: HistoryScenario }) {
  return (
    <section className="glass rounded-[8px] p-5">
      <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-slate-500">Scenario Consequences</p>
      <h2 className="mt-1 text-lg font-semibold text-white">Chain reactions</h2>
      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        {scenario.consequences.map((item) => (
          <div key={item.trigger} className="rounded-[8px] border border-white/10 bg-black/20 p-4">
            <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-white">
              <Flame className="h-4 w-4 text-rose" />
              {item.trigger}
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {item.chain.map((link, index) => (
                <span key={link} className="inline-flex items-center gap-2">
                  <span className="rounded-[8px] border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-slate-300">{link}</span>
                  {index < item.chain.length - 1 && <ChevronRight className="h-4 w-4 text-slate-600" />}
                </span>
              ))}
            </div>
            <p className="mt-4 text-sm text-amber">Outcome: {item.outcome}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function HistorianPanel({ scenario, current }: { scenario: HistoryScenario; current: HistoryTimelinePoint }) {
  return (
    <section className="glass rounded-[8px] p-5">
      <div className="mb-4 flex items-center gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-[8px] bg-amber/10 text-amber">
          <BrainCircuit className="h-5 w-5" />
        </div>
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-amber">AI Historian / Economist</p>
          <h2 className="text-lg font-semibold text-white">Interpretation brief</h2>
        </div>
      </div>
      <p className="text-sm leading-6 text-slate-200">{scenario.historianBrief}</p>
      <div className="mt-4 grid gap-3 md:grid-cols-3">
        <Brief title="What is happening" body={`${current.event}. The current policy response is ${current.policy.toLowerCase()}, while stress sits near ${Math.round(current.crisisIntensity)}.`} />
        <Brief title="Why it matters" body="Economic shocks become political shocks when currency trust, employment, public debt, and social stability deteriorate together." />
        <Brief title="Possible future" body={current.crisisIntensity > 70 ? "Without credible stabilization, the model expects more capital flight, social pressure, and institutional strain." : "If trust holds, the system can absorb stress and turn the shock into a managed transition."} />
      </div>
    </section>
  );
}

function Brief({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-[8px] border border-white/10 bg-white/[0.035] p-4">
      <div className="text-sm font-semibold text-white">{title}</div>
      <p className="mt-2 text-xs leading-5 text-slate-400">{body}</p>
    </div>
  );
}

function EconomyEducation() {
  return (
    <main className="space-y-5">
      <section className="glass rounded-[8px] p-6">
        <div className="flex items-center gap-3">
          <BookOpen className="h-6 w-6 text-cyan" />
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-cyan">Educational Mode</p>
            <h2 className="text-2xl font-bold text-white">How the Economy Works</h2>
          </div>
        </div>
        <p className="mt-4 max-w-3xl text-sm leading-6 text-slate-300">
          Economic Recipes translate macroeconomics into compact cause-and-effect formulas. They are simplified, but grounded in common policy frameworks and historical patterns.
        </p>
      </section>
      <div className="grid gap-4 xl:grid-cols-2">
        {economyLessons.map((lesson) => (
          <article key={lesson.title} className="glass rounded-[8px] p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-cyan">Economic Recipe</p>
                <h3 className="mt-1 text-lg font-semibold text-white">{lesson.title}</h3>
              </div>
              <div className="rounded-[8px] border border-mint/20 bg-mint/10 px-3 py-1.5 font-mono text-xs text-mint">
                {lesson.confidence}% confidence
              </div>
            </div>

            <div className="mt-4 rounded-[8px] border border-white/10 bg-black/25 p-4">
              <div className="font-mono text-sm text-white">{lesson.formula}</div>
              <div className="mt-3 flex items-center gap-3 text-sm text-amber">
                <motion.span animate={{ x: [0, 6, 0] }} transition={{ duration: 1.2, repeat: Infinity }} className="text-xl">
                  →
                </motion.span>
                {lesson.result}
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              {lesson.chain.map((item, index) => (
                <span key={item} className="inline-flex items-center gap-2">
                  <span className="rounded-[8px] border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-slate-300">{item}</span>
                  {index < lesson.chain.length - 1 && <ChevronRight className="h-4 w-4 animate-pulse text-slate-600" />}
                </span>
              ))}
            </div>

            <p className="mt-4 text-sm leading-6 text-slate-300">{lesson.explanation}</p>

            <div className="mt-4 rounded-[8px] border border-cyan/15 bg-cyan/10 p-3 text-sm leading-6 text-slate-200">
              Historical examples: {lesson.example}
            </div>

            <details className="mt-3 rounded-[8px] border border-white/10 bg-white/[0.025] p-3">
              <summary className="cursor-pointer list-none text-sm font-semibold text-white">
                <span className="inline-flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-amber" />
                  Sources & Theory
                </span>
              </summary>
              <div className="mt-3 grid gap-2 text-xs leading-5 text-slate-400 sm:grid-cols-2">
                <div>
                  <div className="mb-1 font-semibold text-slate-200">Theory</div>
                  {lesson.theory.map((item) => <div key={item}>{item}</div>)}
                </div>
                <div>
                  <div className="mb-1 font-semibold text-slate-200">References</div>
                  {lesson.sources.map((item) => <div key={item}>{item}</div>)}
                </div>
              </div>
            </details>
          </article>
        ))}
      </div>
    </main>
  );
}

function ModelExplanation() {
  const assumptions = [
    ["GDP estimation", "Growth responds to confidence, employment, public spending, taxes, interest rates, tariffs, and inflation pressure."],
    ["Inflation response", "Inflation rises when demand, tariffs, weak currency, or money pressure dominate. Higher rates cool it over time."],
    ["Labor market", "Employment follows growth and confidence, but high rates, low demand, and crisis intensity weaken hiring."],
    ["Debt pressure", "Debt rises when spending is high, growth is weak, rates are high, or tax intake cannot keep pace."],
    ["Currency stability", "Currency trust improves with credibility and weakens under inflation, fiscal stress, and external pressure."],
    ["Limitations", "The model is simplified and educational. It is not a forecasting engine, academic DSGE model, or investment tool."]
  ];

  return (
    <main className="space-y-5">
      <section className="glass rounded-[8px] p-6">
        <div className="flex items-center gap-3">
          <Landmark className="h-6 w-6 text-amber" />
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-amber">Model Transparency</p>
            <h2 className="text-2xl font-bold text-white">How the Simulation Works</h2>
          </div>
        </div>
        <p className="mt-4 max-w-3xl text-sm leading-6 text-slate-300">
          The simulator uses simplified relationships from macroeconomics: supply and demand, monetary policy, labor markets, fiscal pressure, currency credibility, and confidence feedback loops.
        </p>
      </section>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {assumptions.map(([title, body]) => (
          <article key={title} className="glass rounded-[8px] p-5">
            <h3 className="text-lg font-semibold text-white">{title}</h3>
            <p className="mt-3 text-sm leading-6 text-slate-400">{body}</p>
          </article>
        ))}
      </div>
      <section className="glass rounded-[8px] p-5">
        <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-slate-500">Simplified Formula Logic</p>
        <div className="mt-4 grid gap-3 md:grid-cols-4">
          {["Policy levers", "Economic indicators", "Confidence feedback", "Historical narrative"].map((item, index) => (
            <div key={item} className="flex items-center gap-3 rounded-[8px] border border-white/10 bg-white/[0.035] p-4">
              <div className="grid h-8 w-8 place-items-center rounded-[8px] bg-cyan/10 font-mono text-xs text-cyan">{index + 1}</div>
              <span className="text-sm font-medium text-slate-200">{item}</span>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

function buildTicker(scenario: HistoryScenario, current: HistoryTimelinePoint) {
  return [
    ...scenario.ticker,
    `${scenario.region.toUpperCase()}: Crisis intensity ${Math.round(current.crisisIntensity)} and public trust ${Math.round(current.publicTrust)}`,
    `POLICY DESK: ${current.policy}`,
    `HISTORIAN: ${current.year} event risk repriced across the model`
  ];
}

function clampPercent(value: number) {
  return Math.max(0, Math.min(100, value));
}
