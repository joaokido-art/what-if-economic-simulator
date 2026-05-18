import { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { ArrowRight, Play, Flame, Brain, Activity, Globe2, Zap, ChevronRight, Swords, TrendingUp, BarChart3 } from "lucide-react";
import type { SimulationPoint } from "../types/economy";

type LandingPageProps = {
  previewData: SimulationPoint[];
  onEnter: () => void;
  onHistory: () => void;
  onEconomics: () => void;
};

// ─── Data ─────────────────────────────────────────────────────────────────────

const evolutionStages = [
  {
    icon: "🌾",
    title: "Surplus",
    period: "c. 10,000 BCE",
    problem: "Memory could not scale beyond a village.",
    solution: "Temple ledgers tracked obligations.",
    pressure: "Cities needed permanent accounting systems.",
  },
  {
    icon: "🪙",
    title: "Coinage",
    period: "c. 600 BCE",
    problem: "Barter broke down at trade-route distances.",
    solution: "Portable, state-stamped metal as universal value.",
    pressure: "Debasement threatened currency trust.",
  },
  {
    icon: "🏦",
    title: "Banking",
    period: "c. 1200 CE",
    problem: "Metal supply couldn't fund empire-scale trade.",
    solution: "Bills of exchange and credit across merchant networks.",
    pressure: "Leverage and speculation created bank runs.",
  },
  {
    icon: "⚙️",
    title: "Industry",
    period: "c. 1760",
    problem: "Local capital couldn't fund mass production.",
    solution: "Joint-stock companies, wage labor, steam power.",
    pressure: "Inequality, labor unrest, financial panics.",
  },
  {
    icon: "🏛️",
    title: "Fiat",
    period: "c. 1944",
    problem: "Gold constrained crisis response in depression and war.",
    solution: "Managed central banking and fiscal policy.",
    pressure: "Inflation credibility and sovereign debt spirals.",
  },
  {
    icon: "🤖",
    title: "Digital",
    period: "2008 – now",
    problem: "Physical intermediaries were too slow and costly.",
    solution: "Platforms, data infrastructure, AI capital.",
    pressure: "Monopoly concentration, labor displacement.",
  },
];

const crises = [
  {
    title: "Fall of Rome",
    period: "235–476 CE",
    trigger: "Currency debasement to finance frontier armies.",
    metrics: { crisis: 91, inflation: 76, stability: 14, trust: 20 },
    color: "rose",
  },
  {
    title: "Great Depression",
    period: "1929–1939",
    trigger: "Banking panic cascaded into demand collapse.",
    metrics: { crisis: 98, inflation: 8, stability: 22, trust: 16 },
    color: "amber",
  },
  {
    title: "Oil Shock",
    period: "1973–1979",
    trigger: "OPEC embargo hit energy-dependent economies.",
    metrics: { crisis: 72, inflation: 93, stability: 48, trust: 36 },
    color: "amber",
  },
  {
    title: "2008 Collapse",
    period: "2008–2010",
    trigger: "Housing debt and leveraged banking contagion.",
    metrics: { crisis: 96, inflation: 30, stability: 38, trust: 22 },
    color: "rose",
  },
  {
    title: "COVID Inflation",
    period: "2020–2023",
    trigger: "Supply disruption met unprecedented stimulus.",
    metrics: { crisis: 65, inflation: 84, stability: 55, trust: 43 },
    color: "mint",
  },
];

const debates = [
  {
    left: {
      name: "Adam Smith",
      school: "Classical",
      quote: "It is not from the benevolence of the butcher that we expect our dinner.",
      position: "Markets coordinate millions of individual choices without central command.",
    },
    right: {
      name: "Karl Marx",
      school: "Critique",
      quote: "Capital is dead labour which, vampire-like, only lives by sucking living labour.",
      position: "Markets conceal the power relations that decide who wins and who is exploited.",
    },
    question: "Do markets create freedom — or hide power?",
    era: "1776 – 1883",
    accent: "amber" as const,
  },
  {
    left: {
      name: "John M. Keynes",
      school: "Keynesian",
      quote: "In the long run, we are all dead.",
      position: "During a collapse, waiting for markets to self-correct condemns millions to poverty.",
    },
    right: {
      name: "F. A. Hayek",
      school: "Austrian",
      quote: "The curious task of economics is to demonstrate to men how little they really know.",
      position: "No planner knows enough to replace decentralized price signals without distorting them.",
    },
    question: "Can governments stabilize economies without trapping them?",
    era: "1930s – 1970s",
    accent: "cyan" as const,
  },
  {
    left: {
      name: "Milton Friedman",
      school: "Monetarist",
      quote: "Inflation is always and everywhere a monetary phenomenon.",
      position: "Credible monetary institutions and stable expectations are the true foundation of prosperity.",
    },
    right: {
      name: "Joseph Schumpeter",
      school: "Innovation",
      quote: "Creative destruction is the essential fact about capitalism.",
      position: "Capitalism's virtue is not stability — it is the innovation that disruption enables.",
    },
    question: "Is stability the goal, or is disruption the engine?",
    era: "1950s – 1980s",
    accent: "mint" as const,
  },
];

const causeChains = [
  {
    title: "Cheap Credit",
    accent: "amber" as const,
    steps: ["Rates fall", "Borrowing rises", "Asset prices surge", "Speculation spreads", "Bubbles form", "Crash risk grows"],
  },
  {
    title: "Labor Scarcity",
    accent: "mint" as const,
    steps: ["Population shock", "Workers become scarce", "Wages rise", "Landlord power weakens", "Feudal bonds erode", "Market labor emerges"],
  },
  {
    title: "Inflation Surge",
    accent: "rose" as const,
    steps: ["Prices accelerate", "Real wages fall", "Purchasing power drops", "Political anger rises", "Trust in institutions weakens", "Instability grows"],
  },
];

const features = [
  {
    icon: Activity,
    title: "Sandbox Policy Lab",
    body: "Adjust nine economic levers — interest rates, tariffs, wages, spending — and watch 24-month forecasts recalculate in real time.",
    tag: "Interactive",
    accent: "cyan" as const,
  },
  {
    icon: Flame,
    title: "Historical Crisis Replay",
    body: "Step through the Great Depression, 2008, Japan's Lost Decades, and more. Watch stress metrics, chain reactions, and policy decisions unfold.",
    tag: "Cinematic",
    accent: "rose" as const,
  },
  {
    icon: Swords,
    title: "Battle of Economic Ideas",
    body: "Keynes vs Hayek. Smith vs Marx. Friedman vs Schumpeter. See the great ideological confrontations in economics, what each side argued, and who history sided with.",
    tag: "Intellectual",
    accent: "amber" as const,
  },
  {
    icon: Globe2,
    title: "Civilization Evolution Map",
    body: "Follow 12,000 years of economic systems: from grain surplus to digital capital. Understand what each era solved and what new pressure it created.",
    tag: "Historical",
    accent: "mint" as const,
  },
];

// ─── Hero SVG Chart ─────────────────────────────────────────────────────────

function HeroChart({ data }: { data: SimulationPoint[] }) {
  const pts = data.slice(0, 20);
  const W = 480;
  const H = 180;

  const norm = (arr: number[], H: number) => {
    const min = Math.min(...arr);
    const max = Math.max(...arr);
    const range = max - min || 1;
    return arr.map((v) => H - ((v - min) / range) * H * 0.78 - H * 0.1);
  };

  const xOf = (i: number) => (i / (pts.length - 1)) * W;

  const gdpY = norm(pts.map((p) => p.gdp), H);
  const inflY = norm(pts.map((p) => p.inflation), H);
  const empY = norm(pts.map((p) => p.employment), H);

  const toPath = (ys: number[]) =>
    ys.map((y, i) => `${i === 0 ? "M" : "L"} ${xOf(i).toFixed(1)} ${y.toFixed(1)}`).join(" ");

  const toFill = (ys: number[]) =>
    `${toPath(ys)} L ${W} ${H} L 0 ${H} Z`;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" preserveAspectRatio="none">
      <defs>
        <linearGradient id="gdpFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#38d5ff" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#38d5ff" stopOpacity="0" />
        </linearGradient>
        <filter id="glowCyan" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id="glowAmber" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {[0.25, 0.5, 0.75].map((f) => (
        <line key={f} x1={0} y1={f * H} x2={W} y2={f * H} stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
      ))}

      <motion.path
        d={toFill(gdpY)}
        fill="url(#gdpFill)"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.4, delay: 0.4 }}
      />
      <motion.path
        d={toPath(empY)}
        fill="none"
        stroke="#6ee7b7"
        strokeWidth="1.5"
        opacity={0.45}
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 2.2, delay: 0.6 }}
      />
      <motion.path
        d={toPath(inflY)}
        fill="none"
        stroke="#f5c451"
        strokeWidth="1.5"
        opacity={0.55}
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 2, delay: 0.8 }}
      />
      <motion.path
        d={toPath(gdpY)}
        fill="none"
        stroke="#38d5ff"
        strokeWidth="2.5"
        filter="url(#glowCyan)"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.8, delay: 0.2, ease: "easeInOut" }}
      />

      {pts.length > 0 && (
        <motion.circle
          cx={xOf(pts.length - 1)}
          cy={gdpY[gdpY.length - 1]}
          r="4"
          fill="#38d5ff"
          filter="url(#glowCyan)"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 2.1 }}
        />
      )}
    </svg>
  );
}

// ─── Animated Metric Ticker ──────────────────────────────────────────────────

const liveLabels = [
  "FISCAL STRESS ↑", "LABOR MARKET: TIGHT", "CURRENCY RISK: LOW",
  "DEMAND: RECOVERING", "CREDIT CONDITIONS: EASY", "INFLATION: ANCHORED",
  "TRADE BALANCE: −2.1%", "CB CREDIBILITY: HIGH", "PUBLIC TRUST: STABLE"
];

function LiveTicker() {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % liveLabels.length), 2200);
    return () => clearInterval(t);
  }, []);
  return (
    <AnimatePresence mode="wait">
      <motion.span
        key={idx}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -6 }}
        transition={{ duration: 0.25 }}
        className="font-mono text-[11px] uppercase tracking-[0.22em] text-slate-400"
      >
        {liveLabels[idx]}
      </motion.span>
    </AnimatePresence>
  );
}

// ─── Reveal on scroll ───────────────────────────────────────────────────────

function Reveal({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── Section label ───────────────────────────────────────────────────────────

function SectionLabel({ text }: { text: string }) {
  return (
    <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-cyan">{text}</p>
  );
}

// ─── Metric bar in crisis cards ──────────────────────────────────────────────

function CrisisBar({ label, value, color }: { label: string; value: number; color: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  return (
    <div ref={ref}>
      <div className="mb-1 flex justify-between font-mono text-[9px] uppercase tracking-[0.14em] text-slate-500">
        <span>{label}</span>
        <span>{value}</span>
      </div>
      <div className="h-1 rounded-full bg-white/10">
        <motion.div
          className={`h-1 rounded-full ${color}`}
          initial={{ width: 0 }}
          animate={inView ? { width: `${value}%` } : {}}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────

export function LandingPage({ previewData, onEnter, onHistory, onEconomics }: LandingPageProps) {
  return (
    <div className="overflow-x-hidden bg-ink text-slate-100">
      <HeroSection data={previewData} onEnter={onEnter} onHistory={onHistory} onEconomics={onEconomics} />
      <EvolutionSection onEconomics={onEconomics} />
      <CoreExperienceSection onEnter={onEnter} onHistory={onHistory} onEconomics={onEconomics} />
      <CrisisShowcase onHistory={onHistory} />
      <IdeologyDebates onEconomics={onEconomics} />
      <CauseEffectSection />
      <FinalCTA onEnter={onEnter} onHistory={onHistory} onEconomics={onEconomics} />
    </div>
  );
}

// ─── 1. Hero ────────────────────────────────────────────────────────────────

function HeroSection({ data, onEnter, onHistory, onEconomics }: { data: SimulationPoint[]; onEnter: () => void; onHistory: () => void; onEconomics: () => void }) {
  return (
    <section className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-0 [background:radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(56,213,255,.09),transparent),radial-gradient(ellipse_40%_40%_at_15%_60%,rgba(110,231,183,.05),transparent),radial-gradient(ellipse_30%_50%_at_85%_40%,rgba(245,196,81,.04),transparent)]" />
      <div className="pointer-events-none absolute inset-0 bg-radial-grid thin-grid opacity-50" />

      <div className="relative mx-auto grid min-h-screen max-w-[1480px] items-center gap-12 px-6 py-24 lg:grid-cols-[1fr_1.1fr] lg:py-0 xl:gap-20">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan/20 bg-cyan/[0.07] px-4 py-1.5">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-cyan shadow-[0_0_8px_rgba(56,213,255,.9)]" />
            <span className="font-mono text-[11px] uppercase tracking-[0.28em] text-cyan">Interactive Macroeconomic Platform</span>
          </div>

          <h1 className="text-balance text-[3.25rem] font-extrabold leading-[1.01] tracking-tight text-white sm:text-[4.2rem] lg:text-[4.8rem]">
            Understand
            <br />
            <span className="bg-gradient-to-r from-cyan via-slate-200 to-white bg-clip-text text-transparent">Economies</span>
            <br />
            by Stress-Testing
            <br />
            Them.
          </h1>

          <p className="mt-7 max-w-[480px] text-lg leading-[1.75] text-slate-400">
            Simulate policy. Replay crises. Explore 12,000 years of economic history. Compare ideologies. Visualize cause and effect.
          </p>

          <div className="mt-9 flex flex-wrap gap-3">
            <button
              onClick={onEnter}
              className="group inline-flex items-center gap-2.5 rounded-[8px] bg-white px-6 py-3.5 text-sm font-bold text-slate-950 transition hover:bg-cyan"
            >
              Enter Simulation
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </button>
            <button
              onClick={onEconomics}
              className="inline-flex items-center gap-2.5 rounded-[8px] border border-white/15 bg-white/[0.04] px-6 py-3.5 text-sm font-semibold text-white transition hover:border-white/30 hover:bg-white/[0.07]"
            >
              <Globe2 className="h-4 w-4 text-mint" />
              Explore History
            </button>
          </div>

          <div className="mt-12 flex items-center gap-5">
            <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent" />
            <div className="flex items-center gap-6 text-center">
              {[["12,000", "years of history"], ["40+", "events"], ["9", "policy levers"]].map(([n, l]) => (
                <div key={l}>
                  <div className="font-mono text-xl font-bold text-white">{n}</div>
                  <div className="font-mono text-[9px] uppercase tracking-[0.18em] text-slate-500">{l}</div>
                </div>
              ))}
            </div>
            <div className="h-px flex-1 bg-gradient-to-l from-white/10 to-transparent" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.97, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
          className="relative"
        >
          <div className="absolute -inset-px rounded-2xl bg-gradient-to-br from-cyan/20 via-transparent to-mint/10 opacity-60" />
          <div className="relative rounded-2xl border border-white/[0.08] bg-slate-950/80 p-6 shadow-[0_0_80px_rgba(56,213,255,.06)] backdrop-blur-xl">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-rose/70" />
                  <span className="h-2.5 w-2.5 rounded-full bg-amber/70" />
                  <span className="h-2.5 w-2.5 rounded-full bg-mint/70" />
                </div>
                <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-slate-500">whatif · macro terminal</span>
              </div>
              <div className="flex items-center gap-1.5 rounded-full border border-cyan/20 bg-cyan/[0.07] px-2.5 py-1">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-cyan" />
                <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-cyan">live</span>
              </div>
            </div>

            <div className="mb-1 h-[190px]">
              <HeroChart data={data} />
            </div>

            <div className="mb-5 flex items-center justify-between border-t border-white/[0.06] pt-3">
              <LiveTicker />
              <div className="flex gap-4 font-mono text-[9px] uppercase tracking-[0.14em]">
                <span className="flex items-center gap-1 text-cyan"><span className="h-2 w-4 rounded-full bg-cyan" />GDP</span>
                <span className="flex items-center gap-1 text-amber"><span className="h-2 w-4 rounded-full bg-amber" />Infl</span>
                <span className="flex items-center gap-1 text-mint"><span className="h-2 w-4 rounded-full bg-mint" />Empl</span>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-2">
              {[
                { label: "GDP Growth", value: "+2.4%", accent: "text-cyan", up: true },
                { label: "Inflation", value: "2.8%", accent: "text-amber", up: false },
                { label: "Employment", value: "96.1%", accent: "text-mint", up: true },
                { label: "Risk Score", value: "38 / 100", accent: "text-rose", up: false },
              ].map((m) => (
                <div key={m.label} className="rounded-[8px] border border-white/[0.07] bg-white/[0.03] p-3 text-center">
                  <div className={`font-mono text-sm font-bold ${m.accent}`}>{m.value}</div>
                  <div className="mt-1 font-mono text-[8px] uppercase tracking-[0.12em] text-slate-600">{m.label}</div>
                </div>
              ))}
            </div>

            <div className="mt-4 rounded-[8px] bg-white/[0.025] px-3 py-2 text-center font-mono text-[10px] uppercase tracking-[0.22em] text-slate-500">
              Scenario: Neutral Economy · 24-month forecast
            </div>
          </div>
        </motion.div>
      </div>

      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-ink to-transparent" />
    </section>
  );
}

// ─── 2. How Economies Evolve ─────────────────────────────────────────────────

function EvolutionSection({ onEconomics }: { onEconomics: () => void }) {
  const [active, setActive] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  return (
    <section ref={ref} className="relative py-28">
      <div className="pointer-events-none absolute inset-0 [background:radial-gradient(ellipse_60%_40%_at_50%_50%,rgba(56,213,255,.04),transparent)]" />
      <div className="mx-auto max-w-[1480px] px-6">
        <Reveal className="mb-14 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <SectionLabel text="Section 01 · Civilization Arc" />
            <h2 className="mt-3 text-4xl font-extrabold text-white lg:text-5xl">
              How Economies<br />Evolve
            </h2>
          </div>
          <p className="max-w-md text-base leading-7 text-slate-400">
            Every economic system solved one problem — and accidentally created the next one. Each era was an answer to pressure the previous era produced.
          </p>
        </Reveal>

        <div className="relative overflow-x-auto pb-6">
          <div className="flex min-w-[900px] items-stretch gap-0">
            {evolutionStages.map((stage, i) => {
              const isActive = active === i;
              return (
                <div key={stage.title} className="flex flex-1 items-stretch">
                  <motion.button
                    animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{ delay: i * 0.08, duration: 0.5 }}
                    onClick={() => setActive(i)}
                    onMouseEnter={() => setActive(i)}
                    className={`relative flex flex-1 flex-col rounded-[8px] border p-5 text-left transition-all ${
                      isActive
                        ? "border-cyan/30 bg-cyan/[0.06] shadow-[0_0_30px_rgba(56,213,255,.08)]"
                        : "border-white/[0.06] bg-white/[0.02] hover:border-white/15 hover:bg-white/[0.04]"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-2xl">{stage.icon}</span>
                      <span className="font-mono text-[8px] uppercase leading-3 tracking-[0.1em] text-slate-600">{stage.period}</span>
                    </div>
                    <div className="mt-4 font-semibold text-white">{stage.title}</div>
                    <AnimatePresence>
                      {isActive && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="mt-4 space-y-2.5 text-xs leading-5">
                            <div>
                              <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-rose">Problem</span>
                              <p className="mt-1 text-slate-300">{stage.problem}</p>
                            </div>
                            <div>
                              <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-mint">Solution</span>
                              <p className="mt-1 text-slate-300">{stage.solution}</p>
                            </div>
                            <div>
                              <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-amber">New Pressure</span>
                              <p className="mt-1 text-slate-300">{stage.pressure}</p>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.button>
                  {i < evolutionStages.length - 1 && (
                    <div className="flex shrink-0 items-center px-2">
                      <ChevronRight className={`h-4 w-4 transition ${isActive ? "text-cyan" : "text-slate-700"}`} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <Reveal delay={0.2} className="mt-8 flex justify-end">
          <button onClick={onEconomics} className="inline-flex items-center gap-2 text-sm font-semibold text-slate-400 transition hover:text-white">
            Explore the full timeline
            <ArrowRight className="h-4 w-4" />
          </button>
        </Reveal>
      </div>
    </section>
  );
}

// ─── 3. Core Experience ──────────────────────────────────────────────────────

function CoreExperienceSection({ onEnter, onHistory, onEconomics }: { onEnter: () => void; onHistory: () => void; onEconomics: () => void }) {
  const actions = [onEnter, onHistory, onEconomics, onEconomics];
  const accentBorder = { cyan: "border-cyan/25 group-hover:border-cyan/50", rose: "border-rose/25 group-hover:border-rose/50", amber: "border-amber/25 group-hover:border-amber/50", mint: "border-mint/25 group-hover:border-mint/50" };
  const accentIcon = { cyan: "bg-cyan/10 text-cyan", rose: "bg-rose/10 text-rose", amber: "bg-amber/10 text-amber", mint: "bg-mint/10 text-mint" };
  const accentTag = { cyan: "border-cyan/20 text-cyan", rose: "border-rose/20 text-rose", amber: "border-amber/20 text-amber", mint: "border-mint/20 text-mint" };
  const accentHeading = { cyan: "group-hover:text-cyan", rose: "group-hover:text-rose", amber: "group-hover:text-amber", mint: "group-hover:text-mint" };

  return (
    <section className="relative py-28">
      <div className="pointer-events-none absolute inset-0 [background:radial-gradient(ellipse_50%_50%_at_80%_30%,rgba(110,231,183,.04),transparent)]" />
      <div className="mx-auto max-w-[1480px] px-6">
        <Reveal className="mb-14 max-w-2xl">
          <SectionLabel text="Section 02 · Core Experience" />
          <h2 className="mt-3 text-4xl font-extrabold text-white lg:text-5xl">
            Four Ways to Think<br />About an Economy
          </h2>
        </Reveal>

        <div className="grid gap-5 md:grid-cols-2">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <Reveal key={f.title} delay={i * 0.07}>
                <button
                  onClick={actions[i]}
                  className={`group w-full rounded-2xl border bg-white/[0.02] p-8 text-left transition hover:bg-white/[0.04] ${accentBorder[f.accent]}`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className={`grid h-11 w-11 place-items-center rounded-xl ${accentIcon[f.accent]}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className={`rounded-full border px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.2em] ${accentTag[f.accent]}`}>
                      {f.tag}
                    </span>
                  </div>
                  <h3 className={`mt-6 text-xl font-bold text-white transition ${accentHeading[f.accent]}`}>{f.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-400">{f.body}</p>
                  <div className="mt-6 flex items-center gap-2 text-sm font-semibold text-slate-500 transition group-hover:text-slate-300">
                    Open
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </button>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─── 4. Crisis Showcase ──────────────────────────────────────────────────────

function CrisisShowcase({ onHistory }: { onHistory: () => void }) {
  const colorMap = { rose: "bg-rose", amber: "bg-amber", mint: "bg-mint" };

  return (
    <section className="relative py-28">
      <div className="pointer-events-none absolute inset-0 [background:radial-gradient(ellipse_70%_50%_at_30%_60%,rgba(251,113,133,.04),transparent)]" />
      <div className="mx-auto max-w-[1480px] px-6">
        <Reveal className="mb-14 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <SectionLabel text="Section 03 · Crisis Replay" />
            <h2 className="mt-3 text-4xl font-extrabold text-white lg:text-5xl">
              History's Greatest<br />Economic Collapses
            </h2>
          </div>
          <p className="max-w-md text-base leading-7 text-slate-400">
            Every crisis followed a pattern. Step through it — stress gauge by stress gauge — to understand how systems break.
          </p>
        </Reveal>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {crises.map((c, i) => (
            <Reveal key={c.title} delay={i * 0.06}>
              <button
                onClick={onHistory}
                className="group w-full rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5 text-left transition hover:border-white/15 hover:bg-white/[0.04]"
              >
                <div className="mb-4 flex items-start justify-between gap-2">
                  <div>
                    <div className="font-mono text-[9px] uppercase tracking-[0.18em] text-slate-500">{c.period}</div>
                    <h3 className="mt-1 text-base font-bold text-white">{c.title}</h3>
                  </div>
                  <Flame className="h-4 w-4 shrink-0 text-rose opacity-60 transition group-hover:opacity-100" />
                </div>
                <p className="mb-5 text-xs leading-5 text-slate-500">{c.trigger}</p>
                <div className="space-y-2.5">
                  <CrisisBar label="Crisis" value={c.metrics.crisis} color={colorMap[c.color as keyof typeof colorMap]} />
                  <CrisisBar label="Inflation" value={c.metrics.inflation} color="bg-amber" />
                  <CrisisBar label="Stability" value={c.metrics.stability} color="bg-cyan" />
                  <CrisisBar label="Trust" value={c.metrics.trust} color="bg-mint" />
                </div>
              </button>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.3} className="mt-8 flex justify-end">
          <button onClick={onHistory} className="inline-flex items-center gap-2 text-sm font-semibold text-slate-400 transition hover:text-white">
            Enter Crisis Replay Mode
            <ArrowRight className="h-4 w-4" />
          </button>
        </Reveal>
      </div>
    </section>
  );
}

// ─── 5. Battle of Economic Ideas ─────────────────────────────────────────────

function IdeologyDebates({ onEconomics }: { onEconomics: () => void }) {
  const [active, setActive] = useState(0);
  const debate = debates[active];
  const accentMap = {
    amber: { border: "border-amber/30", bg: "bg-amber/[0.06]", text: "text-amber", leftTag: "border-amber/25 text-amber", rightTag: "border-rose/25 text-rose" },
    cyan: { border: "border-cyan/30", bg: "bg-cyan/[0.06]", text: "text-cyan", leftTag: "border-cyan/25 text-cyan", rightTag: "border-rose/25 text-rose" },
    mint: { border: "border-mint/30", bg: "bg-mint/[0.06]", text: "text-mint", leftTag: "border-mint/25 text-mint", rightTag: "border-rose/25 text-rose" },
  };
  const accent = accentMap[debate.accent];

  return (
    <section className="relative py-28">
      <div className="pointer-events-none absolute inset-0 [background:radial-gradient(ellipse_60%_50%_at_70%_40%,rgba(56,213,255,.04),transparent)]" />
      <div className="mx-auto max-w-[1480px] px-6">
        <Reveal className="mb-14 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <SectionLabel text="Section 04 · Ideology Wars" />
            <h2 className="mt-3 text-4xl font-extrabold text-white lg:text-5xl">
              The Battle of<br />Economic Ideas
            </h2>
          </div>
          <p className="max-w-md text-base leading-7 text-slate-400">
            The debates that shaped every recession response, trade policy, and social contract. They are not resolved — they recur.
          </p>
        </Reveal>

        <div className="mb-6 flex gap-3">
          {debates.map((d, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`rounded-[8px] border px-4 py-2 text-sm font-semibold transition ${
                active === i ? "border-white/25 bg-white/[0.07] text-white" : "border-white/[0.07] text-slate-500 hover:border-white/15 hover:text-slate-300"
              }`}
            >
              {d.left.name.split(" ").pop()} vs {d.right.name.split(" ").pop()}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.28 }}
          >
            <div className="mb-4 rounded-2xl border border-white/[0.07] bg-white/[0.02] px-8 py-5">
              <div className="flex flex-col items-center gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div className="font-mono text-[10px] uppercase tracking-[0.28em] text-slate-500">{debate.era}</div>
                <p className={`text-center text-lg font-bold ${accent.text}`}>{debate.question}</p>
                <Swords className="h-5 w-5 text-slate-600" />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {[debate.left, debate.right].map((side, si) => (
                <div
                  key={side.name}
                  className={`rounded-2xl border p-7 ${si === 0 ? `${accent.border} ${accent.bg}` : "border-white/[0.07] bg-white/[0.025]"}`}
                >
                  <div className="mb-5 flex items-center gap-3">
                    <div className={`rounded-[8px] border px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.18em] ${si === 0 ? accent.leftTag : "border-slate-700 text-slate-500"}`}>
                      {side.school}
                    </div>
                    <span className="text-base font-bold text-white">{side.name}</span>
                  </div>
                  <blockquote className="mb-5 border-l-2 border-white/15 pl-4 text-sm italic leading-6 text-slate-400">
                    "{side.quote}"
                  </blockquote>
                  <p className="text-sm leading-6 text-slate-300">{side.position}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        <Reveal delay={0.2} className="mt-8 flex justify-end">
          <button onClick={onEconomics} className="inline-flex items-center gap-2 text-sm font-semibold text-slate-400 transition hover:text-white">
            See all ideological debates
            <ArrowRight className="h-4 w-4" />
          </button>
        </Reveal>
      </div>
    </section>
  );
}

// ─── 6. Cause → Effect ──────────────────────────────────────────────────────

function CauseEffectSection() {
  const accentColors = {
    amber: { border: "border-amber/25", bg: "bg-amber/[0.07]", text: "text-amber", step: "border-amber/30 bg-amber/10 text-amber", arrow: "text-amber" },
    mint: { border: "border-mint/25", bg: "bg-mint/[0.07]", text: "text-mint", step: "border-mint/30 bg-mint/10 text-mint", arrow: "text-mint" },
    rose: { border: "border-rose/25", bg: "bg-rose/[0.07]", text: "text-rose", step: "border-rose/30 bg-rose/10 text-rose", arrow: "text-rose" },
  };

  return (
    <section className="relative py-28">
      <div className="pointer-events-none absolute inset-0 [background:radial-gradient(ellipse_50%_40%_at_50%_50%,rgba(110,231,183,.03),transparent)]" />
      <div className="mx-auto max-w-[1480px] px-6">
        <Reveal className="mb-14 max-w-2xl">
          <SectionLabel text="Section 05 · Causal Logic" />
          <h2 className="mt-3 text-4xl font-extrabold text-white lg:text-5xl">
            Every Effect Has<br />a Cause Chain
          </h2>
          <p className="mt-5 text-base leading-7 text-slate-400">
            Economic outcomes don't appear randomly. They are the last link in a sequence that starts somewhere specific.
          </p>
        </Reveal>

        <div className="space-y-6">
          {causeChains.map((chain, ci) => {
            const a = accentColors[chain.accent];
            return (
              <Reveal key={chain.title} delay={ci * 0.1}>
                <div className={`rounded-2xl border ${a.border} ${a.bg} p-6`}>
                  <div className={`mb-5 font-mono text-[11px] uppercase tracking-[0.28em] ${a.text}`}>{chain.title}</div>
                  <div className="flex flex-wrap items-center gap-2">
                    {chain.steps.map((step, si) => (
                      <span key={si} className="inline-flex items-center gap-2">
                        <span className={`rounded-[8px] border px-3.5 py-2 text-sm font-medium ${a.step}`}>{step}</span>
                        {si < chain.steps.length - 1 && (
                          <ChevronRight className={`h-4 w-4 ${a.arrow} opacity-60`} />
                        )}
                      </span>
                    ))}
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─── 7. Final CTA ────────────────────────────────────────────────────────────

function FinalCTA({ onEnter, onHistory, onEconomics }: { onEnter: () => void; onHistory: () => void; onEconomics: () => void }) {
  return (
    <section className="relative overflow-hidden py-36">
      <div className="pointer-events-none absolute inset-0 [background:radial-gradient(ellipse_70%_60%_at_50%_50%,rgba(56,213,255,.07),transparent)]" />
      <div className="pointer-events-none absolute inset-0 bg-radial-grid thin-grid opacity-30" />

      <div className="relative mx-auto max-w-3xl px-6 text-center">
        <Reveal>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan/20 bg-cyan/[0.07] px-4 py-1.5">
            <BarChart3 className="h-3.5 w-3.5 text-cyan" />
            <span className="font-mono text-[11px] uppercase tracking-[0.28em] text-cyan">What If? Economic Simulator</span>
          </div>
          <h2 className="text-balance text-5xl font-extrabold leading-[1.04] text-white lg:text-6xl">
            Start Exploring
            <br />
            <span className="bg-gradient-to-r from-cyan to-mint bg-clip-text text-transparent">Now</span>
          </h2>
          <p className="mx-auto mt-7 max-w-xl text-lg leading-8 text-slate-400">
            The interactive museum of economic systems. Built for policy thinkers, educators, students, and the curious.
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <button onClick={onEnter} className="group inline-flex items-center gap-2.5 rounded-[8px] bg-white px-7 py-4 text-sm font-bold text-slate-950 transition hover:bg-cyan">
              Enter Simulation
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </button>
            <button onClick={onHistory} className="inline-flex items-center gap-2.5 rounded-[8px] border border-white/15 bg-white/[0.04] px-7 py-4 text-sm font-semibold text-white transition hover:border-rose/35 hover:bg-rose/[0.06]">
              <Flame className="h-4 w-4 text-rose" />
              Crisis Replay
            </button>
            <button onClick={onEconomics} className="inline-flex items-center gap-2.5 rounded-[8px] border border-white/15 bg-white/[0.04] px-7 py-4 text-sm font-semibold text-white transition hover:border-mint/35 hover:bg-mint/[0.06]">
              <Globe2 className="h-4 w-4 text-mint" />
              Economic History
            </button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
