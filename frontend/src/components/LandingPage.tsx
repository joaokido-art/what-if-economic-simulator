import { useRef, useState } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { ArrowRight, Flame, Brain, Globe2, Swords, BarChart3, ChevronDown } from "lucide-react";
import type { SimulationPoint } from "../types/economy";

type Props = {
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
    problem: "Memory couldn't scale beyond a village.",
    solution: "Temple ledgers tracked grain, labor, and obligation.",
    pressure: "Cities needed permanent accounting infrastructure.",
    transition: "cities needed ledgers",
    color: "#f5c451",
  },
  {
    icon: "🪙",
    title: "Coinage",
    period: "c. 600 BCE",
    problem: "Barter collapsed at empire scale.",
    solution: "State-stamped metal created portable trust.",
    pressure: "Debasement by rulers eroded currency credibility.",
    transition: "currency trust became fragile",
    color: "#38d5ff",
  },
  {
    icon: "🏦",
    title: "Banking & Credit",
    period: "c. 1200–1600",
    problem: "Metal alone couldn't fund global trade.",
    solution: "Bills of exchange and credit ledgers moved capital across continents.",
    pressure: "Leverage and speculation triggered early bank runs.",
    transition: "capital pooling enabled speculation",
    color: "#6ee7b7",
  },
  {
    icon: "⚙️",
    title: "Industrial Capital",
    period: "c. 1760–1914",
    problem: "Local capital couldn't fund mass production.",
    solution: "Joint-stock companies, steam power, and wage labor transformed scale.",
    pressure: "Inequality and labor unrest demanded political response.",
    transition: "inequality demanded intervention",
    color: "#a78bfa",
  },
  {
    icon: "🏛️",
    title: "Managed Fiat",
    period: "c. 1914–1971",
    problem: "Gold rules broke under war and depression.",
    solution: "Central banks and fiscal policy stabilized demand.",
    pressure: "Inflation credibility and sovereign debt became new constraints.",
    transition: "energy shocks exposed inflation risk",
    color: "#38d5ff",
  },
  {
    icon: "🤖",
    title: "Digital & AI",
    period: "2008 – now",
    problem: "Physical intermediaries were too slow and costly.",
    solution: "Platforms, data, and AI capital reorganized production.",
    pressure: "Monopoly concentration and labor displacement still unfolding.",
    transition: "still unfolding",
    color: "#fb7185",
  },
];

const modernPatterns = [
  {
    old: "Roman Debasement",
    now: "QE and inflation risk",
    insight: "Printing money under political pressure is 2,000 years old. The dilemma didn't change.",
    accent: "amber",
  },
  {
    old: "Black Death Labor Shock",
    now: "Post-COVID wage pressure",
    insight: "When workers become scarce, bargaining power shifts — even if institutions resist it.",
    accent: "mint",
  },
  {
    old: "Tulip Mania, 1637",
    now: "Crypto cycles, AI stocks",
    insight: "Speculation disconnects price from value in the same four-step pattern every time.",
    accent: "rose",
  },
  {
    old: "Volcker Disinflation",
    now: "2022–24 rate hike cycle",
    insight: "Breaking entrenched inflation requires pain. History confirmed this again.",
    accent: "cyan",
  },
  {
    old: "Dutch East India Co.",
    now: "AI and platform monopolies",
    insight: "When one company controls a critical system, it shapes everyone else's rules.",
    accent: "amber",
  },
  {
    old: "Great Depression",
    now: "Balance-sheet recession risk",
    insight: "When debt deflation sets in, fiscal stimulus becomes the last defense. Keynes recurs.",
    accent: "rose",
  },
];

const debates = [
  {
    left: { name: "Adam Smith", school: "Classical", quote: "It is not from the benevolence of the butcher that we expect our dinner.", position: "Markets coordinate millions of choices without central command." },
    right: { name: "Karl Marx", school: "Critique", quote: "Capital is dead labour which, vampire-like, only lives by sucking living labour.", position: "Markets conceal the power relations that decide who wins." },
    question: "Do markets create freedom — or hide power?",
    era: "1776 – 1883",
    accent: "amber" as const,
  },
  {
    left: { name: "John M. Keynes", school: "Keynesian", quote: "In the long run, we are all dead.", position: "During a collapse, waiting for markets to heal condemns millions to poverty." },
    right: { name: "F. A. Hayek", school: "Austrian", quote: "The curious task of economics is to demonstrate how little men really know.", position: "No planner knows enough to replace decentralized price signals." },
    question: "Can governments stabilize economies without trapping them?",
    era: "1930s – 1970s",
    accent: "cyan" as const,
  },
  {
    left: { name: "Milton Friedman", school: "Monetarist", quote: "Inflation is always and everywhere a monetary phenomenon.", position: "Credible monetary institutions are the true foundation of prosperity." },
    right: { name: "Joseph Schumpeter", school: "Innovation", quote: "Creative destruction is the essential fact about capitalism.", position: "Capitalism's virtue is the disruption that enables innovation." },
    question: "Is stability the goal, or disruption the engine?",
    era: "1950s – 1980s",
    accent: "mint" as const,
  },
];

const causeChains = [
  { title: "Cheap Credit", accent: "amber" as const, steps: ["Rates fall", "Borrowing rises", "Asset prices surge", "Speculation spreads", "Bubbles form", "Crash risk grows"] },
  { title: "Labor Scarcity", accent: "mint" as const, steps: ["Population shock", "Workers scarce", "Wages rise", "Landlord power weakens", "Feudal bonds erode", "Market labor emerges"] },
  { title: "Inflation Surge", accent: "rose" as const, steps: ["Prices accelerate", "Real wages fall", "Purchasing power drops", "Political anger rises", "Institutions lose trust", "Instability grows"] },
];

// ─── EconomicGlobe: Living World Simulation ───────────────────────────────────

const CITIES = [
  { id: "nyc", x: 183, y: 150, color: "#38d5ff", dur: 2.4 },
  { id: "lon", x: 271, y: 118, color: "#6ee7b7", dur: 3.1 },
  { id: "dxb", x: 332, y: 176, color: "#f5c451", dur: 2.7 },
  { id: "sha", x: 397, y: 158, color: "#a78bfa", dur: 2.2 },
  { id: "sin", x: 385, y: 228, color: "#a78bfa", dur: 2.9 },
  { id: "lag", x: 272, y: 238, color: "#6ee7b7", dur: 3.6 },
  { id: "sao", x: 218, y: 282, color: "#fb7185", dur: 2.6 },
  { id: "mum", x: 350, y: 192, color: "#f5c451", dur: 3.3 },
] as const;

const ROUTES = [
  { id: "r1", path: "M183,150 Q227,82 271,118",   color: "#38d5ff", dur: 3.2 },
  { id: "r2", path: "M271,118 Q334,88 397,158",    color: "#6ee7b7", dur: 4.1 },
  { id: "r3", path: "M397,158 Q400,195 385,228",   color: "#a78bfa", dur: 2.8 },
  { id: "r4", path: "M183,150 Q196,218 218,282",   color: "#38d5ff", dur: 3.7 },
  { id: "r5", path: "M271,118 Q302,148 332,176",   color: "#f5c451", dur: 2.5 },
  { id: "r6", path: "M272,238 Q312,210 332,176",   color: "#6ee7b7", dur: 3.0 },
] as const;

const SIGNALS = [
  { id: "s1", label: "GDP GROWTH", value: "+3.2%",  accent: "#38d5ff", x:  58, y: 122, dy: -6 },
  { id: "s2", label: "AI SURGE",   value: "↑ +41%", accent: "#a78bfa", x: 444, y: 108, dy: -8 },
  { id: "s3", label: "TRADE FLOW", value: "↓ –8%",  accent: "#f5c451", x: 444, y: 268, dy:  7 },
  { id: "s4", label: "LABOR GAP",  value: "–2.1M",  accent: "#6ee7b7", x:  58, y: 268, dy:  5 },
  { id: "s5", label: "INFLATION",  value: "↓ 3.1%", accent: "#fb7185", x: 178, y: 354, dy:  6 },
  { id: "s6", label: "RATE PAUSE", value: "5.25%",  accent: "#f5c451", x: 318, y: 354, dy:  4 },
] as const;

function EconomicGlobe() {
  return (
    <svg viewBox="0 0 580 420" className="w-full max-w-[640px]" style={{ overflow: "visible" }} aria-hidden>
      <defs>
        <clipPath id="eg-clip">
          <circle cx="290" cy="210" r="170" />
        </clipPath>
        <radialGradient id="eg-body" cx="38%" cy="32%" r="65%">
          <stop offset="0%"   stopColor="#0d2340" />
          <stop offset="65%"  stopColor="#061428" />
          <stop offset="100%" stopColor="#020810" />
        </radialGradient>
        <radialGradient id="eg-atm" cx="50%" cy="50%" r="50%">
          <stop offset="78%"  stopColor="transparent" stopOpacity="0" />
          <stop offset="100%" stopColor="#38d5ff"     stopOpacity="0.15" />
        </radialGradient>
        <radialGradient id="eg-spec" cx="34%" cy="26%" r="45%">
          <stop offset="0%"   stopColor="rgba(255,255,255,0.07)" />
          <stop offset="100%" stopColor="transparent" stopOpacity="0" />
        </radialGradient>
        <filter id="eg-halo" x="-25%" y="-25%" width="150%" height="150%">
          <feGaussianBlur stdDeviation="10" />
        </filter>
        <filter id="eg-city" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id="eg-particle" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="1.5" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* Outer atmosphere halo */}
      <circle cx="290" cy="210" r="185" fill="rgba(56,213,255,0.08)" filter="url(#eg-halo)" />

      {/* Globe body */}
      <circle cx="290" cy="210" r="170" fill="url(#eg-body)" />

      {/* Globe grid — clipped */}
      <g clipPath="url(#eg-clip)" fill="none" stroke="rgba(56,213,255,0.55)" strokeWidth="0.55" opacity="0.22">
        {/* Latitude lines */}
        <ellipse cx="290" cy="90"  rx="120" ry="36" />
        <ellipse cx="290" cy="150" rx="159" ry="48" />
        <ellipse cx="290" cy="210" rx="170" ry="51" />
        <ellipse cx="290" cy="270" rx="159" ry="48" />
        <ellipse cx="290" cy="330" rx="120" ry="36" />
        {/* Longitude curves */}
        <path d="M290,40 Q133,210 290,380" />
        <path d="M290,40 Q195,210 290,380" />
        <line x1="290" y1="40" x2="290" y2="380" />
        <path d="M290,40 Q385,210 290,380" />
        <path d="M290,40 Q447,210 290,380" />
      </g>

      {/* Trade routes — clipped */}
      <g clipPath="url(#eg-clip)" fill="none">
        {ROUTES.map((r) => (
          <path key={r.id} d={r.path} stroke={r.color} strokeWidth="0.9" opacity="0.2" />
        ))}
      </g>

      {/* Route particles */}
      {ROUTES.map((r) => (
        <g key={`rp-${r.id}`} filter="url(#eg-particle)">
          <circle r="2.2" fill={r.color} opacity="0.9">
            <animateMotion dur={`${r.dur}s`} repeatCount="indefinite" path={r.path} />
          </circle>
          <circle r="1.2" fill={r.color} opacity="0.45">
            <animateMotion dur={`${r.dur * 1.6}s`} begin={`${r.dur * 0.5}s`} repeatCount="indefinite" path={r.path} />
          </circle>
        </g>
      ))}

      {/* Atmosphere + specular overlay */}
      <circle cx="290" cy="210" r="170" fill="url(#eg-atm)" />
      <circle cx="290" cy="210" r="170" fill="url(#eg-spec)" />

      {/* Globe border ring */}
      <circle cx="290" cy="210" r="170" fill="none" stroke="rgba(56,213,255,0.2)" strokeWidth="1" />

      {/* Scan ring */}
      <ellipse cx="290" cy="210" rx="0" ry="0" fill="none" stroke="rgba(56,213,255,0.55)" strokeWidth="0.8">
        <animate attributeName="rx"      from="0"   to="170" dur="3.2s" repeatCount="indefinite" />
        <animate attributeName="ry"      from="0"   to="51"  dur="3.2s" repeatCount="indefinite" />
        <animate attributeName="opacity" from="0.6" to="0"   dur="3.2s" repeatCount="indefinite" />
      </ellipse>

      {/* City nodes */}
      {CITIES.map((city) => (
        <g key={city.id} filter="url(#eg-city)">
          <circle cx={city.x} cy={city.y} r="5" fill="none" stroke={city.color} strokeWidth="0.7" opacity="0.12">
            <animate attributeName="r"       values="5;15;5"           dur={`${city.dur}s`} repeatCount="indefinite" calcMode="ease" />
            <animate attributeName="opacity" values="0.08;0.22;0.08"   dur={`${city.dur}s`} repeatCount="indefinite" calcMode="ease" />
          </circle>
          <circle cx={city.x} cy={city.y} r="2.8" fill={city.color} opacity="0.95" />
          <circle cx={city.x} cy={city.y} r="1.1" fill="white"      opacity="0.85" />
        </g>
      ))}

      {/* Orbiting data ribbon */}
      <path id="eg-ribbon" d="M105,210 A185,58 0 0,1 475,210 A185,58 0 0,1 105,210" fill="none" />
      <text fontSize="6.5" fill="rgba(56,213,255,0.2)" fontFamily="monospace" letterSpacing="2.5">
        <textPath href="#eg-ribbon">
          GDP · TRADE · INFLATION · CREDIT · LABOR · INTEREST RATES · FISCAL POLICY · MONETARY SUPPLY · GDP · TRADE · INFLATION ·
          <animate attributeName="startOffset" from="0%" to="100%" dur="22s" repeatCount="indefinite" />
        </textPath>
      </text>

      {/* Floating signal cards */}
      {SIGNALS.map((sig, i) => (
        <motion.g
          key={sig.id}
          initial={{ y: 0 }}
          animate={{ y: [0, sig.dy, 0] }}
          transition={{ duration: 3.2 + i * 0.38, repeat: Infinity, ease: "easeInOut" }}
        >
          <rect x={sig.x} y={sig.y} width="80" height="34" rx="5"
            fill="rgba(5,7,13,0.88)" stroke={sig.accent} strokeWidth="0.6" strokeOpacity="0.45" />
          <text x={sig.x + 7} y={sig.y + 12} fontSize="6.5" fill={sig.accent} opacity="0.62"
            fontFamily="monospace" letterSpacing="0.8">
            {sig.label}
          </text>
          <text x={sig.x + 7} y={sig.y + 25} fontSize="10.5" fill="white" opacity="0.9"
            fontFamily="monospace" fontWeight="bold">
            {sig.value}
          </text>
          <circle cx={sig.x + 72} cy={sig.y + 8} r="2" fill={sig.accent} opacity="0.65">
            <animate attributeName="opacity" values="0.25;1;0.25" dur="1.9s" repeatCount="indefinite" />
          </circle>
        </motion.g>
      ))}
    </svg>
  );
}

// ─── Utilities ────────────────────────────────────────────────────────────────

function Reveal({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function SectionBridge({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0 }}
      animate={inView ? { opacity: 1 } : {}}
      transition={{ duration: 0.8 }}
      className="mx-auto max-w-2xl px-6 py-16 text-center"
    >
      <p className="text-lg leading-8 text-slate-500 italic">{children}</p>
    </motion.div>
  );
}

function Label({ children }: { children: string }) {
  return <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-cyan">{children}</p>;
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export function LandingPage({ previewData: _, onEnter, onHistory, onEconomics }: Props) {
  return (
    <div className="overflow-x-hidden bg-ink text-slate-100">
      <HeroSection onEnter={onEnter} onHistory={onHistory} onEconomics={onEconomics} />
      <EvolutionSection onEconomics={onEconomics} />
      <SectionBridge>As systems scaled, crises became larger, faster, and harder to contain.</SectionBridge>
      <CrisisSection onHistory={onHistory} />
      <SectionBridge>These patterns didn't stay in history. They recur — often in new clothing.</SectionBridge>
      <ModernRelevanceSection />
      <SectionBridge>Every crisis also became an argument between competing economic schools.</SectionBridge>
      <IdeologySection onEconomics={onEconomics} />
      <CauseEffectSection />
      <FinalCTA onEnter={onEnter} onHistory={onHistory} onEconomics={onEconomics} />
    </div>
  );
}

// ─── 1. Hero ──────────────────────────────────────────────────────────────────

function HeroSection({ onEnter, onHistory, onEconomics }: { onEnter: () => void; onHistory: () => void; onEconomics: () => void }) {
  return (
    <section className="relative flex min-h-screen flex-col justify-center overflow-hidden">
      {/* Ambient atmosphere */}
      <div className="pointer-events-none absolute inset-0 [background:radial-gradient(ellipse_90%_65%_at_50%_-5%,rgba(56,213,255,.08),transparent),radial-gradient(ellipse_40%_50%_at_10%_60%,rgba(110,231,183,.05),transparent),radial-gradient(ellipse_35%_40%_at_90%_55%,rgba(167,139,250,.04),transparent)]" />
      <div className="pointer-events-none absolute inset-0 opacity-40 [background-image:linear-gradient(rgba(255,255,255,.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.03)_1px,transparent_1px)] [background-size:72px_72px]" />

      <div className="relative mx-auto grid w-full max-w-[1480px] items-center gap-16 px-6 py-28 lg:grid-cols-[1fr_1fr] lg:py-0 xl:gap-24">
        {/* Left: Headline */}
        <motion.div
          initial={{ opacity: 0, y: 36 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="mb-7 inline-flex items-center gap-2.5 rounded-full border border-cyan/20 bg-cyan/[0.06] px-4 py-1.5">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-cyan shadow-[0_0_8px_rgba(56,213,255,1)]" />
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-cyan">Interactive Macroeconomic Platform</span>
          </div>

          <h1 className="text-[3rem] font-extrabold leading-[1.03] tracking-tight text-white sm:text-[3.8rem] lg:text-[4.4rem]">
            Every economy<br />
            <span className="bg-gradient-to-br from-cyan via-slate-200 to-slate-400 bg-clip-text text-transparent">
              solves one problem
            </span>
            <br />
            then creates<br />
            the next.
          </h1>

          <p className="mt-7 max-w-[440px] text-[1.05rem] leading-[1.8] text-slate-400">
            Explore how trade, fear, technology, inflation, and political power
            reshaped civilizations — and still do.
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
              className="inline-flex items-center gap-2.5 rounded-[8px] border border-white/12 bg-white/[0.04] px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-white/[0.07]"
            >
              <Globe2 className="h-4 w-4 text-mint" />
              Explore History
            </button>
            <button
              onClick={onHistory}
              className="inline-flex items-center gap-2.5 rounded-[8px] border border-white/12 bg-white/[0.04] px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-white/[0.07]"
            >
              <Flame className="h-4 w-4 text-rose" />
              Crisis Replay
            </button>
          </div>

          <div className="mt-12 grid grid-cols-3 gap-5">
            {[["12,000", "years of history"], ["40+", "historical events"], ["9", "policy levers"]].map(([n, l]) => (
              <div key={l}>
                <div className="font-mono text-2xl font-bold text-white">{n}</div>
                <div className="mt-1 font-mono text-[9px] uppercase tracking-[0.18em] text-slate-600">{l}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Right: Economic Globe */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.3, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="relative flex items-center justify-center"
        >
          <EconomicGlobe />
        </motion.div>
      </div>

      {/* Scroll nudge */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <ChevronDown className="h-5 w-5 animate-bounce text-slate-700" />
      </motion.div>

      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-ink to-transparent" />
    </section>
  );
}

// ─── 2. How Economies Evolve ──────────────────────────────────────────────────

function EvolutionSection({ onEconomics }: { onEconomics: () => void }) {
  const [active, setActive] = useState<number | null>(null);

  return (
    <section className="relative py-24">
      <div className="pointer-events-none absolute inset-0 [background:radial-gradient(ellipse_50%_60%_at_50%_40%,rgba(245,196,81,.04),transparent)]" />
      <div className="mx-auto max-w-[900px] px-6">
        <Reveal className="mb-16 text-center">
          <Label>Section 01 · Civilization Arc</Label>
          <h2 className="mt-3 text-4xl font-extrabold text-white lg:text-5xl">How Economies Evolve</h2>
          <p className="mx-auto mt-5 max-w-lg text-base leading-7 text-slate-500">
            Each system solved one problem — and accidentally created the pressure that broke it.
          </p>
        </Reveal>

        <div className="relative">
          {/* Vertical spine line */}
          <div className="absolute left-[27px] top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-white/10 to-transparent lg:left-1/2 lg:-ml-px" />

          <div className="space-y-0">
            {evolutionStages.map((stage, i) => {
              const isActive = active === i;
              const isLast = i === evolutionStages.length - 1;
              return (
                <div key={stage.title}>
                  <Reveal delay={i * 0.07}>
                    <button
                      onClick={() => setActive(isActive ? null : i)}
                      className="group relative w-full text-left"
                    >
                      <div className="flex items-start gap-5 py-5 lg:grid lg:grid-cols-2 lg:gap-10">
                        {/* Era node */}
                        <div className="flex items-center gap-4">
                          <div
                            className="relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-full border text-xl transition-all"
                            style={{
                              borderColor: isActive ? stage.color + "60" : "rgba(255,255,255,0.08)",
                              backgroundColor: isActive ? stage.color + "14" : "rgba(255,255,255,0.03)",
                              boxShadow: isActive ? `0 0 24px ${stage.color}22` : "none",
                            }}
                          >
                            {stage.icon}
                          </div>
                          <div>
                            <div className="font-mono text-[9px] uppercase tracking-[0.2em] text-slate-600">{stage.period}</div>
                            <div className="mt-0.5 text-lg font-bold text-white">{stage.title}</div>
                          </div>
                        </div>

                        {/* Description (always visible on lg) */}
                        <div className="hidden pl-0 lg:block">
                          <AnimatePresence>
                            {isActive && (
                              <motion.div
                                initial={{ opacity: 0, y: 6 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -6 }}
                                className="space-y-3 text-sm"
                              >
                                <div>
                                  <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-rose">Problem</span>
                                  <p className="mt-1 leading-5 text-slate-300">{stage.problem}</p>
                                </div>
                                <div>
                                  <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-mint">Solution</span>
                                  <p className="mt-1 leading-5 text-slate-300">{stage.solution}</p>
                                </div>
                                <div>
                                  <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-amber">New Pressure</span>
                                  <p className="mt-1 leading-5 text-slate-300">{stage.pressure}</p>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                          {!isActive && (
                            <p className="text-sm leading-6 text-slate-600 group-hover:text-slate-500 transition">
                              {stage.problem}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Mobile expand */}
                      <AnimatePresence>
                        {isActive && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="overflow-hidden pl-[76px] lg:hidden"
                          >
                            <div className="space-y-3 pb-4 text-sm">
                              <div>
                                <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-rose">Problem</span>
                                <p className="mt-1 leading-5 text-slate-300">{stage.problem}</p>
                              </div>
                              <div>
                                <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-mint">Solution</span>
                                <p className="mt-1 leading-5 text-slate-300">{stage.solution}</p>
                              </div>
                              <div>
                                <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-amber">New Pressure</span>
                                <p className="mt-1 leading-5 text-slate-300">{stage.pressure}</p>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </button>
                  </Reveal>

                  {/* Transition connector */}
                  {!isLast && (
                    <div className="flex items-center gap-4 py-1 pl-[27px] lg:pl-0 lg:justify-center">
                      <div className="flex items-center gap-2 pl-[27px] lg:pl-0">
                        <div className="h-5 w-px bg-gradient-to-b from-white/10 to-transparent lg:hidden" />
                        <span className="rounded-full border border-white/[0.07] bg-white/[0.025] px-3 py-1 font-mono text-[9px] uppercase tracking-[0.16em] text-slate-600">
                          {stage.transition}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <Reveal delay={0.2} className="mt-12 flex justify-center">
          <button onClick={onEconomics} className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-white">
            Explore the full 12,000-year timeline
            <ArrowRight className="h-4 w-4" />
          </button>
        </Reveal>
      </div>
    </section>
  );
}

// ─── 3. Crisis Showcase ───────────────────────────────────────────────────────

const crises = [
  { title: "Fall of Rome", period: "235–476 CE", trigger: "Currency debasement to fund frontier armies.", c: 91, inf: 76, stab: 14, trust: 20 },
  { title: "Great Depression", period: "1929–1939", trigger: "Banking panic cascaded into demand collapse.", c: 98, inf: 8, stab: 22, trust: 16 },
  { title: "Oil Shock", period: "1973–1979", trigger: "OPEC embargo hit energy-dependent economies.", c: 72, inf: 93, stab: 48, trust: 36 },
  { title: "2008 Collapse", period: "2008–2010", trigger: "Housing debt and leveraged banking contagion.", c: 96, inf: 30, stab: 38, trust: 22 },
  { title: "COVID Inflation", period: "2020–2023", trigger: "Supply shock met unprecedented stimulus.", c: 65, inf: 84, stab: 55, trust: 43 },
];

function AnimBar({ value, color }: { value: number; color: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  return (
    <div ref={ref} className="h-0.5 rounded-full bg-white/[0.07]">
      <motion.div
        className={`h-0.5 rounded-full ${color}`}
        initial={{ width: 0 }}
        animate={inView ? { width: `${value}%` } : {}}
        transition={{ duration: 0.9, ease: "easeOut" }}
      />
    </div>
  );
}

function CrisisSection({ onHistory }: { onHistory: () => void }) {
  return (
    <section className="relative py-24">
      <div className="pointer-events-none absolute inset-0 [background:radial-gradient(ellipse_60%_40%_at_30%_50%,rgba(251,113,133,.04),transparent)]" />
      <div className="mx-auto max-w-[1480px] px-6">
        <Reveal className="mb-14">
          <Label>Section 02 · Crisis Replay</Label>
          <h2 className="mt-3 text-4xl font-extrabold text-white lg:text-5xl">History's Greatest Collapses</h2>
        </Reveal>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {crises.map((c, i) => (
            <Reveal key={c.title} delay={i * 0.05}>
              <button
                onClick={onHistory}
                className="group w-full rounded-2xl bg-white/[0.025] p-5 text-left transition hover:bg-white/[0.04]"
              >
                <Flame className="mb-4 h-4 w-4 text-rose opacity-50 transition group-hover:opacity-100" />
                <div className="mb-1 font-mono text-[9px] uppercase tracking-[0.2em] text-slate-600">{c.period}</div>
                <h3 className="mb-3 text-sm font-bold text-white">{c.title}</h3>
                <p className="mb-5 text-xs leading-5 text-slate-600">{c.trigger}</p>
                <div className="space-y-2">
                  {[["Crisis", c.c, "bg-rose"], ["Inflation", c.inf, "bg-amber"], ["Stability", c.stab, "bg-cyan"], ["Trust", c.trust, "bg-mint"]].map(([l, v, cl]) => (
                    <div key={l as string}>
                      <div className="mb-1 flex justify-between font-mono text-[8px] uppercase tracking-[0.12em] text-slate-700">
                        <span>{l}</span><span>{v}</span>
                      </div>
                      <AnimBar value={v as number} color={cl as string} />
                    </div>
                  ))}
                </div>
              </button>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.25} className="mt-8 flex justify-end">
          <button onClick={onHistory} className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-white">
            Enter Crisis Replay Mode <ArrowRight className="h-4 w-4" />
          </button>
        </Reveal>
      </div>
    </section>
  );
}

// ─── 4. Modern Relevance ──────────────────────────────────────────────────────

const accentStyles = {
  amber: { tag: "border-amber/25 text-amber", bar: "bg-amber", dot: "bg-amber" },
  mint: { tag: "border-mint/25 text-mint", bar: "bg-mint", dot: "bg-mint" },
  rose: { tag: "border-rose/25 text-rose", bar: "bg-rose", dot: "bg-rose" },
  cyan: { tag: "border-cyan/25 text-cyan", bar: "bg-cyan", dot: "bg-cyan" },
};

function ModernRelevanceSection() {
  return (
    <section className="relative py-24">
      <div className="pointer-events-none absolute inset-0 [background:radial-gradient(ellipse_60%_50%_at_70%_50%,rgba(56,213,255,.04),transparent)]" />
      <div className="mx-auto max-w-[1480px] px-6">
        <Reveal className="mb-14">
          <Label>Section 03 · Why This Matters Today</Label>
          <h2 className="mt-3 text-4xl font-extrabold text-white lg:text-5xl">Old Patterns, New Names</h2>
          <p className="mt-5 max-w-lg text-base leading-7 text-slate-500">
            Economic history isn't a museum. It is a pattern library for the present.
          </p>
        </Reveal>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {modernPatterns.map((p, i) => {
            const a = accentStyles[p.accent as keyof typeof accentStyles];
            return (
              <Reveal key={p.old} delay={i * 0.06}>
                <div className="rounded-2xl bg-white/[0.025] p-6 transition hover:bg-white/[0.04]">
                  <div className="mb-4 flex items-center gap-3">
                    <span className={`rounded-full border px-2.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.18em] ${a.tag}`}>
                      Then
                    </span>
                    <span className="text-xs font-semibold text-slate-400">{p.old}</span>
                  </div>
                  <div className="mb-4 flex items-center gap-2">
                    <div className={`h-px flex-1 ${a.bar} opacity-30`} />
                    <span className="font-mono text-[8px] uppercase tracking-[0.2em] text-slate-700">now</span>
                    <div className={`h-px flex-1 ${a.bar} opacity-30`} />
                  </div>
                  <p className="mb-4 text-sm font-semibold text-white">{p.now}</p>
                  <p className="text-xs leading-5 text-slate-500">{p.insight}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─── 5. Ideology Debates ──────────────────────────────────────────────────────

function IdeologySection({ onEconomics }: { onEconomics: () => void }) {
  const [active, setActive] = useState(0);
  const d = debates[active];
  const borderMap = { amber: "border-amber/25 bg-amber/[0.05]", cyan: "border-cyan/25 bg-cyan/[0.05]", mint: "border-mint/25 bg-mint/[0.05]" };
  const textMap = { amber: "text-amber", cyan: "text-cyan", mint: "text-mint" };

  return (
    <section className="relative py-24">
      <div className="pointer-events-none absolute inset-0 [background:radial-gradient(ellipse_50%_50%_at_50%_50%,rgba(167,139,250,.04),transparent)]" />
      <div className="mx-auto max-w-[1480px] px-6">
        <Reveal className="mb-10 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <Label>Section 04 · Ideology Wars</Label>
            <h2 className="mt-3 text-4xl font-extrabold text-white lg:text-5xl">The Battle of Ideas</h2>
          </div>
          <div className="flex gap-2">
            {debates.map((deb, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className={`rounded-[8px] px-4 py-2 text-sm font-semibold transition ${active === i ? "bg-white/[0.08] text-white" : "text-slate-600 hover:text-slate-300"}`}
              >
                {deb.left.name.split(" ").pop()} vs {deb.right.name.split(" ").pop()}
              </button>
            ))}
          </div>
        </Reveal>

        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.24 }}
          >
            <div className="mb-4 rounded-2xl bg-white/[0.02] py-4 px-6 text-center">
              <p className={`text-lg font-bold ${textMap[d.accent]}`}>{d.question}</p>
              <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.2em] text-slate-600">{d.era}</p>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              {[d.left, d.right].map((side, si) => (
                <div key={side.name} className={`rounded-2xl border p-7 ${si === 0 ? borderMap[d.accent] : "border-white/[0.06] bg-white/[0.02]"}`}>
                  <div className="mb-5 flex items-center gap-3">
                    <span className={`rounded-full border px-2.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.18em] ${si === 0 ? `border-${d.accent}/25 text-${d.accent}` : "border-slate-700 text-slate-600"}`}>
                      {side.school}
                    </span>
                    <span className="font-semibold text-white">{side.name}</span>
                  </div>
                  <blockquote className="mb-4 border-l-2 border-white/10 pl-4 text-sm italic leading-6 text-slate-500">
                    "{side.quote}"
                  </blockquote>
                  <p className="text-sm leading-6 text-slate-300">{side.position}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        <Reveal delay={0.15} className="mt-8 flex justify-end">
          <button onClick={onEconomics} className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-white">
            See all ideological debates <ArrowRight className="h-4 w-4" />
          </button>
        </Reveal>
      </div>
    </section>
  );
}

// ─── 6. Cause → Effect ────────────────────────────────────────────────────────

const chainAccent = {
  amber: "bg-amber/[0.06] border-amber/20",
  mint: "bg-mint/[0.06] border-mint/20",
  rose: "bg-rose/[0.06] border-rose/20",
};
const stepAccent = {
  amber: "border-amber/25 text-amber",
  mint: "border-mint/25 text-mint",
  rose: "border-rose/25 text-rose",
};
const arrowAccent = { amber: "text-amber", mint: "text-mint", rose: "text-rose" };

function CauseEffectSection() {
  return (
    <section className="relative py-24">
      <div className="mx-auto max-w-[1480px] px-6">
        <Reveal className="mb-14 max-w-xl">
          <Label>Section 05 · Causal Logic</Label>
          <h2 className="mt-3 text-4xl font-extrabold text-white lg:text-5xl">Every Effect Has a Cause Chain</h2>
          <p className="mt-5 text-base leading-7 text-slate-500">Economic outcomes don't appear randomly. They are the last link in a sequence.</p>
        </Reveal>
        <div className="space-y-4">
          {causeChains.map((chain, ci) => (
            <Reveal key={chain.title} delay={ci * 0.08}>
              <div className={`rounded-2xl border p-6 ${chainAccent[chain.accent]}`}>
                <p className={`mb-5 font-mono text-[10px] uppercase tracking-[0.3em] ${arrowAccent[chain.accent]}`}>{chain.title}</p>
                <div className="flex flex-wrap items-center gap-2">
                  {chain.steps.map((step, si) => (
                    <span key={si} className="inline-flex items-center gap-2">
                      <span className={`rounded-[8px] border px-3.5 py-2 text-sm font-medium ${stepAccent[chain.accent]}`}>{step}</span>
                      {si < chain.steps.length - 1 && (
                        <span className={`font-mono text-xs ${arrowAccent[chain.accent]} opacity-50`}>→</span>
                      )}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── 7. Final CTA ─────────────────────────────────────────────────────────────

function FinalCTA({ onEnter, onHistory, onEconomics }: { onEnter: () => void; onHistory: () => void; onEconomics: () => void }) {
  return (
    <section className="relative overflow-hidden py-36">
      <div className="pointer-events-none absolute inset-0 [background:radial-gradient(ellipse_80%_70%_at_50%_50%,rgba(56,213,255,.07),transparent)]" />
      <div className="pointer-events-none absolute inset-0 opacity-25 [background-image:linear-gradient(rgba(255,255,255,.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.03)_1px,transparent_1px)] [background-size:72px_72px]" />
      <div className="relative mx-auto max-w-3xl px-6 text-center">
        <Reveal>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan/20 bg-cyan/[0.06] px-4 py-1.5">
            <BarChart3 className="h-3.5 w-3.5 text-cyan" />
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-cyan">What If? Economic Simulator</span>
          </div>
          <h2 className="text-balance text-5xl font-extrabold leading-[1.04] text-white lg:text-6xl">
            Start exploring<br />
            <span className="bg-gradient-to-r from-cyan to-mint bg-clip-text text-transparent">the simulation</span>
          </h2>
          <p className="mx-auto mt-7 max-w-md text-base leading-8 text-slate-500">
            The interactive museum of economic systems. Adjust variables, replay crises, explore ideologies.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <button onClick={onEnter} className="group inline-flex items-center gap-2.5 rounded-[8px] bg-white px-7 py-4 text-sm font-bold text-slate-950 transition hover:bg-cyan">
              Enter Simulation <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </button>
            <button onClick={onHistory} className="inline-flex items-center gap-2.5 rounded-[8px] border border-white/10 bg-white/[0.03] px-7 py-4 text-sm font-semibold text-white transition hover:bg-white/[0.06]">
              <Flame className="h-4 w-4 text-rose" /> Crisis Replay
            </button>
            <button onClick={onEconomics} className="inline-flex items-center gap-2.5 rounded-[8px] border border-white/10 bg-white/[0.03] px-7 py-4 text-sm font-semibold text-white transition hover:bg-white/[0.06]">
              <Globe2 className="h-4 w-4 text-mint" /> Economic History
            </button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
