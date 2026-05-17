import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  BookOpen,
  Brain,
  ChevronLeft,
  ChevronRight,
  CircleDollarSign,
  Compass,
  Factory,
  Flame,
  Landmark,
  LineChart,
  Network,
  Pause,
  Play,
  ScrollText,
  Sparkles,
  Swords,
  Users
} from "lucide-react";
import { butterflyEffects, eraCards, ideologicalBattles, thinkers, timelineEvents, type EconomicEra, type IdeologicalBattle, type Metric, type TimelineEvent } from "../data/economicHistory";
import type { EconomicVariables } from "../types/economy";

type EconomicHistoryProps = {
  variables: EconomicVariables;
  onSandbox: () => void;
};

const allEras = ["All Eras", ...eraCards.map((era) => era.name)] as const;

export function EconomicHistory({ variables, onSandbox }: EconomicHistoryProps) {
  const [activeEra, setActiveEra] = useState<(typeof allEras)[number]>("All Eras");
  const [activeEventId, setActiveEventId] = useState("agricultural-surplus");
  const [activeThinker, setActiveThinker] = useState("John Maynard Keynes");
  const [activeButterfly, setActiveButterfly] = useState("Black Death");
  const [guidedMode, setGuidedMode] = useState(true);

  const visibleEvents = useMemo(
    () => (activeEra === "All Eras" ? timelineEvents : timelineEvents.filter((event) => event.era === activeEra)),
    [activeEra]
  );
  const activeEvent = timelineEvents.find((event) => event.id === activeEventId) ?? visibleEvents[0] ?? timelineEvents[0];
  const activeEventIndex = timelineEvents.findIndex((event) => event.id === activeEvent.id);
  const activeEraCard = eraCards.find((era) => era.name === activeEvent.era) ?? eraCards[0];
  const selectedThinker = thinkers.find((thinker) => thinker.name === activeThinker) ?? thinkers[0];
  const selectedButterfly = butterflyEffects.find((effect) => effect.trigger === activeButterfly) ?? butterflyEffects[0];

  const selectEra = (era: (typeof allEras)[number]) => {
    setActiveEra(era);
    const first = era === "All Eras" ? timelineEvents[0] : timelineEvents.find((event) => event.era === era);
    if (first) setActiveEventId(first.id);
  };

  const previousEvent = () => {
    const nextIndex = Math.max(0, activeEventIndex - 1);
    setActiveEventId(timelineEvents[nextIndex].id);
  };

  const nextEvent = () => {
    const nextIndex = Math.min(timelineEvents.length - 1, activeEventIndex + 1);
    setActiveEventId(timelineEvents[nextIndex].id);
  };

  return (
    <div className="min-h-screen bg-ink bg-radial-grid thin-grid">
      <MuseumTicker />
      <main className="mx-auto max-w-[1600px] space-y-6 px-4 py-5">
        <Hero
          onStart={() => {
            setActiveEra("All Eras");
            setActiveEventId("agricultural-surplus");
          }}
          onCrises={() => {
            setActiveEra("All Eras");
            setActiveEventId("great-depression");
          }}
          onThinkers={() => document.getElementById("thinkers")?.scrollIntoView({ behavior: "smooth" })}
        />

        <StickyProgress
          activeEra={activeEraCard}
          activeEvent={activeEvent}
          activeEraFilter={activeEra}
          setActiveEra={selectEra}
          guidedMode={guidedMode}
          setGuidedMode={setGuidedMode}
        />

        <EraMap />

        <section className="grid gap-5 xl:grid-cols-[0.95fr_1.05fr]">
          <GuidedTimeline
            events={visibleEvents}
            activeEvent={activeEvent}
            setActiveEventId={setActiveEventId}
          />
          <EventIntelligence
            event={activeEvent}
            previousEvent={previousEvent}
            nextEvent={nextEvent}
            canGoPrevious={activeEventIndex > 0}
            canGoNext={activeEventIndex < timelineEvents.length - 1}
          />
        </section>

        <ThinkersPolicyPlaybooks
          variables={variables}
          activeThinker={activeThinker}
          setActiveThinker={setActiveThinker}
          thinker={selectedThinker}
        />

        <ButterflyEffect active={activeButterfly} setActive={setActiveButterfly} effect={selectedButterfly} />
      </main>
    </div>
  );
}

function MuseumTicker() {
  const items = [
    "MESOPOTAMIA: temple ledgers increase state capacity",
    "LYDIA: coinage improves transaction efficiency",
    "ROME: fiscal pressure weakens currency trust",
    "LONDON: gold standard stabilizes exchange rates",
    "WASHINGTON: dollar-gold convertibility ends",
    "GLOBAL: AI capital boom raises productivity debate"
  ];
  return (
    <div className="sticky top-0 z-50 border-b border-cyan/20 bg-black/70 py-2 backdrop-blur-xl">
      <div className="mx-auto flex max-w-[1600px] items-center gap-4 overflow-hidden px-4">
        <div className="flex shrink-0 items-center gap-2 font-mono text-[11px] uppercase tracking-[0.22em] text-cyan">
          <ScrollText className="h-3.5 w-3.5" />
          Economic History Wire
        </div>
        <div className="overflow-hidden">
          <div className="ticker-track flex min-w-max gap-8 text-xs text-slate-200">
            {[...items, ...items].map((item, index) => (
              <span key={`${item}-${index}`} className="inline-flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-amber shadow-[0_0_14px_rgba(245,196,81,.9)]" />
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const moneyEvolutionStages = [
  {
    title: "Surplus",
    date: "c. 10,000 BCE",
    icon: "🌾",
    summary: "Food storage created the first coordination problem.",
    solved: "seasonal survival and local obligations",
    pressure: "cities scale; accounting complexity rises",
    transition: "stored grain needed ledgers",
    example: "early farming villages and temple granaries",
    winners: "settled farmers, storage managers",
    lost: "purely mobile exchange systems",
    crises: "famine, disputed obligations"
  },
  {
    title: "Coinage",
    date: "c. 600 BCE",
    icon: "🪙",
    summary: "Empires needed portable trust.",
    solved: "trade friction and tax collection",
    pressure: "currency trust and debasement risk",
    transition: "trade networks expanded beyond local trust",
    example: "Lydia, Greece, Rome",
    winners: "merchants, tax states, paid armies",
    lost: "barter networks and informal tribute",
    crises: "Roman debasement, inflation pressure"
  },
  {
    title: "Banking & Credit",
    date: "c. 1200-1600",
    icon: "🏦",
    summary: "Trade became too large for metal alone.",
    solved: "long-distance settlement and pooled capital",
    pressure: "bank runs, leverage, merchant risk",
    transition: "capital needs grew faster than coin supply",
    example: "bills of exchange, Italian banks, VOC finance",
    winners: "merchant houses, banks, investors",
    lost: "local lenders and metal-only trade",
    crises: "Tulip Mania, South Sea Bubble"
  },
  {
    title: "Central Banking & Fiat",
    date: "c. 1900-1971",
    icon: "🏛️",
    summary: "Governments gained monetary flexibility, but also new risks.",
    solved: "crisis response and managed demand",
    pressure: "inflation credibility and sovereign debt",
    transition: "gold rules strained under war and depression",
    example: "Federal Reserve, Bretton Woods, Nixon Shock",
    winners: "central banks, governments, depositors",
    lost: "gold constraint and fixed exchange orthodoxy",
    crises: "Great Depression, 1970s stagflation"
  },
  {
    title: "Digital & AI Capital",
    date: "2008-present",
    icon: "🤖",
    summary: "Data became infrastructure.",
    solved: "instant coordination, platforms, automated allocation",
    pressure: "monopoly power, speculation, labor disruption",
    transition: "platforms turned information into capital",
    example: "digital payments, crypto, cloud, AI chips",
    winners: "platforms, chipmakers, cloud providers",
    lost: "offline intermediaries and routine work",
    crises: "crypto crashes, AI concentration risk"
  }
];

function Hero({ onStart, onCrises, onThinkers }: { onStart: () => void; onCrises: () => void; onThinkers: () => void }) {
  const [activeMoneyStage, setActiveMoneyStage] = useState(0);
  const [playingEvolution, setPlayingEvolution] = useState(false);
  const selectedStage = moneyEvolutionStages[activeMoneyStage];

  useEffect(() => {
    if (!playingEvolution) return;
    const interval = window.setInterval(() => {
      setActiveMoneyStage((stage) => (stage + 1) % moneyEvolutionStages.length);
    }, 1800);
    return () => window.clearInterval(interval);
  }, [playingEvolution]);

  return (
    <section className="glass overflow-hidden rounded-[8px] p-6">
      <div className="grid gap-6 lg:grid-cols-[1fr_0.85fr]">
        <div>
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber/25 bg-amber/10 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.22em] text-amber">
            <Compass className="h-3.5 w-3.5" />
            Interactive Macro Museum
          </div>
          <h1 className="text-4xl font-extrabold text-white sm:text-5xl">History of Economics</h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-slate-300">
            Follow how money, trade, technology, crises, and ideas changed the way societies work.
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {["12,000+ years of exchange", "40+ key events", "8 major economic eras"].map((stat) => (
              <div key={stat} className="rounded-[8px] border border-white/10 bg-white/[0.04] p-4 font-mono text-sm text-white">{stat}</div>
            ))}
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <button onClick={onStart} className="inline-flex items-center gap-2 rounded-[8px] bg-white px-4 py-3 text-sm font-semibold text-slate-950 hover:bg-cyan">
              Start from the beginning
              <ArrowRight className="h-4 w-4" />
            </button>
            <button onClick={onCrises} className="inline-flex items-center gap-2 rounded-[8px] border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-semibold text-white hover:border-rose/40">
              Jump to crises
              <Flame className="h-4 w-4" />
            </button>
            <button onClick={onThinkers} className="inline-flex items-center gap-2 rounded-[8px] border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-semibold text-white hover:border-mint/40">
              Explore thinkers
              <Brain className="h-4 w-4" />
            </button>
          </div>
        </div>
        <div className="relative min-h-[420px] overflow-hidden rounded-[8px] border border-white/10 bg-slate-950 p-5">
          <div className="absolute inset-0 opacity-70 [background:linear-gradient(90deg,rgba(56,213,255,.08)_1px,transparent_1px),linear-gradient(0deg,rgba(255,255,255,.04)_1px,transparent_1px),radial-gradient(circle_at_20%_18%,rgba(56,213,255,.12),transparent_28%),radial-gradient(circle_at_74%_22%,rgba(245,196,81,.10),transparent_24%),linear-gradient(135deg,rgba(15,23,42,.64),rgba(2,6,23,.96))] [background-size:42px_42px,42px_42px,auto,auto,auto]" />
          <div className="relative flex flex-col gap-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-cyan">Evolution of Money and Coordination Systems</div>
                <h2 className="mt-2 text-xl font-bold text-white">How societies scaled exchange</h2>
              </div>
              <button
                onClick={() => setPlayingEvolution(!playingEvolution)}
                className={`shrink-0 rounded-[8px] border px-3 py-2 text-xs font-semibold transition ${
                  playingEvolution ? "border-amber/45 bg-amber/10 text-amber" : "border-white/10 bg-white/[0.04] text-white hover:border-cyan/40"
                }`}
              >
                {playingEvolution ? "Pause evolution" : "Play evolution"}
              </button>
            </div>

            <div className="overflow-x-auto pb-2">
              <div className="flex min-w-[760px] items-center">
                {moneyEvolutionStages.map((stage, index) => {
                  const active = activeMoneyStage === index;
                  return (
                    <div key={stage.title} className="flex items-center">
                      <button
                        onMouseEnter={() => setActiveMoneyStage(index)}
                        onFocus={() => setActiveMoneyStage(index)}
                        onClick={() => {
                          setActiveMoneyStage(index);
                          setPlayingEvolution(false);
                        }}
                        className={`relative min-h-[152px] w-[136px] rounded-[8px] border p-3 text-left transition ${
                          active
                            ? "border-cyan/45 bg-cyan/10 shadow-[0_0_32px_rgba(56,213,255,.14)]"
                            : "border-white/[0.08] bg-white/[0.035] hover:border-white/20"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span className="grid h-8 w-8 place-items-center rounded-[8px] bg-black/30 text-base">{stage.icon}</span>
                          <span className="max-w-[72px] text-right font-mono text-[8px] uppercase leading-3 tracking-[0.08em] text-slate-500">{stage.date}</span>
                        </div>
                        <h3 className="mt-3 text-sm font-bold uppercase tracking-[0.02em] text-white">{stage.title}</h3>
                        <p className="mt-2 line-clamp-3 text-[11px] leading-4 text-slate-400">{stage.summary}</p>
                      </button>
                      {index < moneyEvolutionStages.length - 1 && (
                        <div className="mx-2 w-16 shrink-0">
                          <div className="flex items-center">
                            <span className="h-px flex-1 bg-gradient-to-r from-cyan via-amber to-mint" />
                            <ArrowRight className="h-3.5 w-3.5 animate-pulse text-amber" />
                          </div>
                          <p className="mt-2 text-center text-[10px] leading-4 text-slate-500">{moneyEvolutionStages[index + 1].transition}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <motion.div
              key={selectedStage.title}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-[8px] border border-cyan/15 bg-black/30 p-4 backdrop-blur"
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-amber">{selectedStage.date}</div>
                  <h3 className="mt-1 text-xl font-bold text-white">{selectedStage.title}</h3>
                  <p className="mt-2 max-w-xl text-sm leading-6 text-slate-300">{selectedStage.summary}</p>
                </div>
                <div className="grid gap-2 text-xs sm:grid-cols-2 md:w-[360px]">
                  <MiniMoneyFact label="Solved" value={selectedStage.solved} tone="cyan" />
                  <MiniMoneyFact label="Pressure" value={selectedStage.pressure} tone="amber" />
                </div>
              </div>
              <div className="mt-4 grid gap-3 text-xs md:grid-cols-4">
                <MiniMoneyFact label="Example" value={selectedStage.example} tone="slate" />
                <MiniMoneyFact label="Who benefited" value={selectedStage.winners} tone="mint" />
                <MiniMoneyFact label="Lost power" value={selectedStage.lost} tone="rose" />
                <MiniMoneyFact label="Crisis pattern" value={selectedStage.crises} tone="gold" />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

function MiniMoneyFact({ label, value, tone }: { label: string; value: string; tone: "cyan" | "amber" | "mint" | "rose" | "gold" | "slate" }) {
  const toneClass = {
    cyan: "text-cyan",
    amber: "text-amber",
    mint: "text-mint",
    rose: "text-rose",
    gold: "text-amber",
    slate: "text-slate-400"
  }[tone];

  return (
    <div className="min-w-0">
      <div className={`font-mono text-[9px] uppercase tracking-[0.18em] ${toneClass}`}>{label}</div>
      <p className="mt-1 leading-5 text-slate-200">{value}</p>
    </div>
  );
}

function StickyProgress({
  activeEra,
  activeEvent,
  activeEraFilter,
  setActiveEra,
  guidedMode,
  setGuidedMode
}: {
  activeEra: (typeof eraCards)[number];
  activeEvent: TimelineEvent;
  activeEraFilter: (typeof allEras)[number];
  setActiveEra: (era: (typeof allEras)[number]) => void;
  guidedMode: boolean;
  setGuidedMode: (value: boolean) => void;
}) {
  return (
    <section className="sticky top-[40px] z-40 rounded-[8px] border border-white/10 bg-slate-950/92 p-2 backdrop-blur-xl">
      <div className="flex flex-col gap-2 xl:flex-row xl:items-center xl:justify-between">
        <div className="min-w-0 truncate text-xs text-slate-300">
          You are viewing <span className="font-semibold text-white">{activeEra.name}</span>, <span className="font-mono text-cyan">{activeEra.date}</span> · selected event: <span className="text-amber">{activeEvent.title}</span>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1 xl:max-w-[980px]">
          <button
            onClick={() => setGuidedMode(!guidedMode)}
            className={`shrink-0 rounded-[8px] border px-2.5 py-1.5 text-[11px] font-semibold ${guidedMode ? "border-mint/40 bg-mint/10 text-mint" : "border-white/10 bg-white/[0.04] text-white"}`}
          >
            Start here: {guidedMode ? "On" : "Off"}
          </button>
          {allEras.map((era) => (
            <button
              key={era}
              onClick={() => setActiveEra(era)}
              className={`shrink-0 rounded-[8px] border px-2.5 py-1.5 text-[11px] font-semibold ${
                activeEraFilter === era ? "border-cyan/40 bg-cyan/10 text-cyan" : "border-white/10 bg-white/[0.04] text-white hover:border-white/25"
              }`}
            >
              {era}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

function EraMap() {
  const [activeEraName, setActiveEraName] = useState<EconomicEra>("Pre-Money Exchange");
  const [compareEraName, setCompareEraName] = useState<EconomicEra>("Ancient Economies");
  const [comparisonMode, setComparisonMode] = useState(false);
  const active = eraFlowDetails[activeEraName];
  const comparisonTargetName =
    compareEraName === activeEraName ? eraCards.find((era) => era.name !== activeEraName)?.name ?? "Ancient Economies" : compareEraName;
  const compare = eraFlowDetails[comparisonTargetName];

  return (
    <section className="glass relative overflow-hidden rounded-[8px] p-5">
      <div className="pointer-events-none absolute inset-0 opacity-50 [background:radial-gradient(circle_at_16%_20%,rgba(56,213,255,.12),transparent_24%),radial-gradient(circle_at_82%_12%,rgba(245,196,81,.10),transparent_26%)]" />
      <div className="relative flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <SectionTitle icon={Landmark} eyebrow="Section 2" title="Economic Eras Map" />
        <div className="flex flex-col gap-2 lg:items-end">
          <p className="max-w-2xl text-sm leading-6 text-slate-400">
            People solved one survival problem, then accidentally created the next one.
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setComparisonMode(!comparisonMode)}
              className={`rounded-[8px] border px-3 py-2 text-xs font-semibold transition ${
                comparisonMode ? "border-mint/40 bg-mint/10 text-mint" : "border-white/10 bg-white/[0.04] text-white hover:border-white/25"
              }`}
            >
              Comparison: {comparisonMode ? "On" : "Off"}
            </button>
            {comparisonMode && (
              <select
                value={comparisonTargetName}
                onChange={(event) => setCompareEraName(event.target.value as EconomicEra)}
                className="rounded-[8px] border border-white/10 bg-slate-950 px-3 py-2 text-xs font-semibold text-white outline-none"
              >
                {eraCards
                  .filter((era) => era.name !== activeEraName)
                  .map((era) => (
                    <option key={era.name} value={era.name}>
                      Compare with {era.name}
                    </option>
                  ))}
              </select>
            )}
          </div>
        </div>
      </div>

      <div className="relative mt-5 overflow-x-auto pb-2">
        <div className="flex min-w-[1120px] items-center">
          {eraCards.map((era, index) => {
            const detail = eraFlowDetails[era.name];
            const activeNode = activeEraName === era.name;
            return (
              <div key={era.name} className="flex items-center">
                <button
                  onClick={() => setActiveEraName(era.name)}
                  className={`group relative min-h-[142px] w-[136px] overflow-hidden rounded-[8px] border px-3 py-3 text-left transition ${
                    activeNode
                      ? `${detail.border} ${detail.bg} shadow-[0_0_42px_rgba(56,213,255,.12)]`
                      : "border-white/[0.08] bg-white/[0.025] hover:border-white/20 hover:bg-white/[0.045]"
                  }`}
                >
                  <div className={`absolute inset-0 opacity-35 ${detail.aura}`} />
                  <div className="relative flex h-full flex-col">
                    <div className="flex items-start justify-between gap-2">
                      <div className={`grid h-8 w-8 place-items-center rounded-[8px] bg-black/25 text-base ${activeNode ? "" : "opacity-75"}`}>
                        {detail.symbol}
                      </div>
                      <span className="max-w-[70px] text-right font-mono text-[8px] uppercase leading-3 tracking-[0.08em] text-slate-500">{era.date}</span>
                    </div>
                    <h3 className="mt-3 text-[13px] font-bold leading-4 text-white">{era.name}</h3>
                    <p className="mt-2 font-mono text-[8px] uppercase leading-3 tracking-[0.12em] text-cyan">{detail.keywords.slice(0, 3).join(" • ")}</p>
                    <p className="mt-2 line-clamp-2 text-[11px] leading-4 text-slate-400">{detail.summary}</p>
                  </div>
                </button>
                {index < eraCards.length - 1 && (
                  <div className="relative mx-1 h-px w-7 shrink-0 overflow-visible bg-gradient-to-r from-cyan/60 via-amber/80 to-mint/60">
                    <span className="absolute -right-0.5 -top-[4px] h-2 w-2 rotate-45 border-r border-t border-amber" />
                    <span className="absolute inset-0 animate-pulse bg-white/40 blur-sm" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {comparisonMode ? <EraComparison left={active} right={compare} /> : <EraInspector era={active} />}
    </section>
  );
}

type EraFlowDetail = {
  name: EconomicEra;
  date: string;
  keywords: string[];
  symbol: string;
  system: string;
  summary: string;
  ordinaryLife: string;
  powered: string[];
  madeMoney: string[];
  power: string[];
  fear: string[];
  broke: string[];
  emerged: string;
  transformations: string[];
  snapshot: Record<string, string>;
  optimizedFor: string;
  problem: string;
  transition: string;
  bg: string;
  border: string;
  aura: string;
};

const eraFlowDetails: Record<EconomicEra, EraFlowDetail> = {
  "Pre-Money Exchange": {
    name: "Pre-Money Exchange",
    date: "c. 10,000-3,000 BCE",
    keywords: ["Food", "Trust", "Villages"],
    symbol: "🌾",
    system: "Barter, gift exchange, kinship obligations",
    summary: "Villages stored food, then had to decide who controlled it.",
    ordinaryLife: "People began staying in one place, storing food, trading favors, and remembering who owed what.",
    powered: ["settled farming", "grain storage", "seasonal labor", "kinship trust"],
    madeMoney: ["agriculture", "livestock", "craft exchange", "labor obligations"],
    power: ["village elders", "storage controllers", "families with land"],
    fear: ["famine", "bad harvests", "forgotten obligations"],
    broke: ["memory could not scale", "trade stayed local", "stored surplus needed rules"],
    emerged: "Cities needed durable accounting systems, so ledgers and temple administration became economic infrastructure.",
    transformations: ["foraging → farming", "immediate use → stored surplus", "memory → proto-accounting"],
    snapshot: { "Population trend": "↑", "Trade complexity": "↑", "Technology speed": "↑", "Financial complexity": "low", "Political stability": "local" },
    optimizedFor: "survival and storage",
    problem: "memory and barter could not scale",
    transition: "accounting systems",
    bg: "bg-amber/10",
    border: "border-amber/25",
    aura: "bg-[radial-gradient(circle_at_40%_20%,rgba(245,196,81,.24),transparent_35%)]"
  },
  "Ancient Economies": {
    name: "Ancient Economies",
    date: "c. 3,000 BCE-500 CE",
    keywords: ["Coins", "Taxes", "Empires"],
    symbol: "🪙",
    system: "Palace economies, taxation, coinage, trade routes",
    summary: "Coins helped strangers trade and rulers collect taxes.",
    ordinaryLife: "Ordinary people paid taxes, used coins in markets, supplied armies, and lived inside economies shaped by empire.",
    powered: ["temple ledgers", "coinage", "armies", "roads", "grain taxation"],
    madeMoney: ["farming", "tax collection", "trade", "military supply"],
    power: ["emperors", "priests", "tax officials", "army commanders"],
    fear: ["tax pressure", "currency debasement", "war finance"],
    broke: ["military costs exceeded revenue", "coin trust weakened", "empires fragmented"],
    emerged: "As empires fragmented, regional trade networks, merchant routes, and credit relationships became more important.",
    transformations: ["barter → coinage", "villages → empires", "local ledgers → state taxation"],
    snapshot: { "Population trend": "↑↑", "Trade complexity": "↑↑", "Technology speed": "↑", "Financial complexity": "↑", "Political stability": "uneven" },
    optimizedFor: "imperial scale",
    problem: "fiscal pressure and debasement",
    transition: "regional trade networks",
    bg: "bg-yellow-500/10",
    border: "border-yellow-400/25",
    aura: "bg-[radial-gradient(circle_at_55%_20%,rgba(250,204,21,.20),transparent_35%)]"
  },
  "Medieval Trade and Banking": {
    name: "Medieval Trade and Banking",
    date: "c. 500-1500",
    keywords: ["Towns", "Credit", "Merchants"],
    symbol: "🏦",
    system: "Feudal obligations, merchant networks, early banking",
    summary: "Merchants needed promises that could travel farther than coins.",
    ordinaryLife: "Most people worked land, but merchants, towns, fairs, and bankers made money move farther than armies could govern.",
    powered: ["merchant fairs", "bills of exchange", "guilds", "long-distance routes"],
    madeMoney: ["agriculture", "craft guilds", "merchant trade", "credit ledgers"],
    power: ["landlords", "church institutions", "merchant families", "guilds"],
    fear: ["famine", "plague", "fragmented authority"],
    broke: ["plague changed labor power", "towns grew", "merchants needed larger capital"],
    emerged: "Long-distance trade and urban merchants pushed Europe toward chartered companies, colonial trade, and mercantilism.",
    transformations: ["feudal dues → wage bargaining", "local fairs → trade networks", "coinage → credit ledgers"],
    snapshot: { "Population trend": "volatile", "Trade complexity": "↑↑", "Technology speed": "↑", "Financial complexity": "↑↑", "Political stability": "fragmented" },
    optimizedFor: "regional exchange",
    problem: "fragmented authority and shocks",
    transition: "merchant capital",
    bg: "bg-emerald-500/10",
    border: "border-emerald-300/25",
    aura: "bg-[radial-gradient(circle_at_45%_25%,rgba(110,231,183,.18),transparent_35%)]"
  },
  Mercantilism: {
    name: "Mercantilism",
    date: "c. 1500-1750",
    keywords: ["Ships", "Colonies", "Monopoly"],
    symbol: "⛵",
    system: "Colonial trade, chartered monopolies, bullion accumulation",
    summary: "States used ships and companies to turn trade into power.",
    ordinaryLife: "Global goods became more common, but wealth often came through extraction, monopoly, and empire.",
    powered: ["global shipping", "colonial extraction", "navies", "joint-stock finance"],
    madeMoney: ["overseas trade", "plantations", "shipping", "monopoly privileges"],
    power: ["kings", "navies", "chartered companies", "merchant families"],
    fear: ["war debt", "monopoly abuse", "colonial revolt"],
    broke: ["rigid trade systems limited productive expansion", "monopolies distorted incentives", "industry needed machines and private capital"],
    emerged: "Industrial machinery, private capital, and factories transformed production beyond colonial trade structures.",
    transformations: ["regional trade → global shipping", "merchant capital → joint-stock finance", "bullion hoarding → productive investment"],
    snapshot: { "Population trend": "↑", "Trade complexity": "↑↑↑", "Technology speed": "↑↑", "Financial complexity": "↑↑", "Political stability": "imperial rivalry" },
    optimizedFor: "state-controlled trade power",
    problem: "monopoly and extraction limits",
    transition: "industrial production",
    bg: "bg-cyan/10",
    border: "border-cyan/25",
    aura: "bg-[radial-gradient(circle_at_50%_20%,rgba(56,213,255,.18),transparent_35%)]"
  },
  "Industrial Capitalism": {
    name: "Industrial Capitalism",
    date: "c. 1750-1914",
    keywords: ["Factories", "Railroads", "Mass Production"],
    symbol: "⚙️",
    system: "Factories, wage labor, railroads, mass production",
    summary: "Machines moved work from homes and farms into factories.",
    ordinaryLife: "People stopped working where they lived and began selling labor in cities.",
    powered: ["steam power", "coal", "railroads", "banking systems", "global shipping"],
    madeMoney: ["factory wages", "industrial capital", "rail finance", "mass consumer goods"],
    power: ["industrialists", "banks", "railroad owners", "factory managers"],
    fear: ["labor unrest", "bank runs", "inequality", "unsafe cities"],
    broke: ["inequality and financial panics grew", "global war overwhelmed old liberal systems", "mass politics demanded intervention"],
    emerged: "World wars, depression, and social conflict pushed governments toward central banking, welfare states, and fiscal policy.",
    transformations: ["handcraft → mechanized production", "villages → industrial cities", "local trade → global shipping"],
    snapshot: { "Population trend": "↑↑", "Trade complexity": "↑↑↑", "Technology speed": "↑↑↑", "Financial complexity": "↑↑", "Political stability": "medium" },
    optimizedFor: "production scale",
    problem: "social disruption and panics",
    transition: "managed capitalism",
    bg: "bg-slate-500/10",
    border: "border-slate-300/25",
    aura: "bg-[radial-gradient(circle_at_45%_20%,rgba(148,163,184,.20),transparent_35%)]"
  },
  "Managed Capitalism": {
    name: "Managed Capitalism",
    date: "c. 1914-1971",
    keywords: ["Jobs", "Banks", "Safety Nets"],
    symbol: "🏛️",
    system: "Welfare states, central banking, fiscal policy",
    summary: "Governments tried to protect jobs, banks, and families from shocks.",
    ordinaryLife: "Jobs, pensions, deposits, mortgages, and recessions became matters of public policy.",
    powered: ["central banking", "fiscal policy", "welfare states", "postwar institutions"],
    madeMoney: ["manufacturing jobs", "public contracts", "suburban housing", "managed trade"],
    power: ["central banks", "treasuries", "labor unions", "international institutions"],
    fear: ["depression", "war debt", "inflation", "unemployment"],
    broke: ["dollar-gold convertibility became unsustainable", "inflation pressure rose", "fixed exchange rules strained"],
    emerged: "Ending dollar-gold convertibility opened the floating fiat era and global financial markets.",
    transformations: ["gold-backed money → managed fiat", "minimal state → welfare state", "local banking → central banking dominance"],
    snapshot: { "Population trend": "↑↑", "Trade complexity": "↑↑", "Technology speed": "↑↑", "Financial complexity": "↑↑", "Political stability": "managed" },
    optimizedFor: "stability and employment",
    problem: "inflation and gold constraint",
    transition: "floating fiat finance",
    bg: "bg-blue-500/10",
    border: "border-blue-300/25",
    aura: "bg-[radial-gradient(circle_at_55%_20%,rgba(96,165,250,.18),transparent_35%)]"
  },
  "Global Financial Era": {
    name: "Global Financial Era",
    date: "c. 1971-2008",
    keywords: ["Credit", "Markets", "Speed"],
    symbol: "📈",
    system: "Floating exchange rates, global capital markets, deregulation",
    summary: "Money moved around the world faster than crises could be contained.",
    ordinaryLife: "Mortgages, pensions, credit cards, exchange rates, and asset prices became tied to global finance.",
    powered: ["floating currencies", "computerized markets", "derivatives", "global banking"],
    madeMoney: ["finance", "real estate", "global trade", "credit expansion"],
    power: ["central banks", "global banks", "markets", "rating agencies"],
    fear: ["asset bubbles", "debt crises", "banking contagion"],
    broke: ["housing leverage and weak risk controls triggered a global crisis", "trust in finance fell", "digital platforms rose"],
    emerged: "The 2008 crisis and digital platforms pushed the economy toward data, platforms, crypto experiments, and AI infrastructure.",
    transformations: ["fixed exchange → floating FX", "bank lending → securitized credit", "national finance → global capital flows"],
    snapshot: { "Population trend": "↑", "Trade complexity": "↑↑↑", "Technology speed": "↑↑", "Financial complexity": "↑↑↑", "Political stability": "fragile" },
    optimizedFor: "capital mobility",
    problem: "contagion and leverage",
    transition: "digital platforms",
    bg: "bg-rose/10",
    border: "border-rose/25",
    aura: "bg-[radial-gradient(circle_at_50%_20%,rgba(251,113,133,.18),transparent_35%)]"
  },
  "Digital and AI Economy": {
    name: "Digital and AI Economy",
    date: "c. 2008-present",
    keywords: ["Platforms", "Data", "AI"],
    symbol: "🤖",
    system: "Platforms, data, automation, crypto, AI infrastructure",
    summary: "Platforms and data became as important as roads and banks.",
    ordinaryLife: "Work, shopping, media, finance, and learning increasingly pass through digital platforms and algorithmic systems.",
    powered: ["data infrastructure", "cloud computing", "AI models", "network effects", "chips"],
    madeMoney: ["digital platforms", "subscriptions", "ads", "automation", "compute infrastructure"],
    power: ["tech platforms", "cloud providers", "AI labs", "chipmakers"],
    fear: ["monopoly power", "speculation", "labor displacement", "inequality"],
    broke: ["still unfolding: concentration, trust, labor disruption, and energy constraints are the unresolved pressures"],
    emerged: "The next era is not visible yet; it depends on whether AI becomes broad productivity or concentrated power.",
    transformations: ["physical networks → digital platforms", "human workflows → automation", "financial speculation → data and compute assets"],
    snapshot: { "Population trend": "mixed", "Trade complexity": "↑↑↑", "Technology speed": "↑↑↑", "Financial complexity": "↑↑↑", "Political stability": "uncertain" },
    optimizedFor: "information scale",
    problem: "concentration and disruption",
    transition: "still unfolding",
    bg: "bg-purple-500/10",
    border: "border-purple-300/25",
    aura: "bg-[radial-gradient(circle_at_50%_20%,rgba(168,85,247,.20),transparent_35%)]"
  }
};

const comparisonFacts: Record<EconomicEra, { money: string; power: string; labor: string; trade: string; tech: string }> = {
  "Pre-Money Exchange": {
    money: "grain, livestock, obligation memory",
    power: "elders and storage controllers",
    labor: "family farming and reciprocal labor",
    trade: "local barter and gift exchange",
    tech: "farming, storage, seasonal tools"
  },
  "Ancient Economies": {
    money: "silver, grain, coinage",
    power: "palaces, temples, tax officials, armies",
    labor: "farmers, soldiers, builders, enslaved labor",
    trade: "imperial routes and taxed markets",
    tech: "writing, roads, mints, ships"
  },
  "Medieval Trade and Banking": {
    money: "coins, bills of exchange, ledgers",
    power: "landlords, church institutions, guilds, merchants",
    labor: "peasants, artisans, guild members, paid town labor",
    trade: "fairs, merchant routes, regional networks",
    tech: "credit ledgers, mills, navigation improvements"
  },
  Mercantilism: {
    money: "gold, silver, bills of exchange",
    power: "empires, navies, chartered companies",
    labor: "sailors, plantations, artisans, coerced labor",
    trade: "colonial monopolies and shipping lanes",
    tech: "ocean navigation, joint-stock finance, cannons"
  },
  "Industrial Capitalism": {
    money: "gold standard, banknotes, industrial credit",
    power: "industrialists, banks, railroads",
    labor: "factory wages and urban labor markets",
    trade: "global shipping, rail networks, mass exports",
    tech: "steam, coal, factories, railroads"
  },
  "Managed Capitalism": {
    money: "managed fiat linked partly to gold",
    power: "central banks, treasuries, unions, institutions",
    labor: "manufacturing jobs, public sector, organized labor",
    trade: "managed global trade and Bretton Woods rules",
    tech: "mass production, electrification, bureaucracy"
  },
  "Global Financial Era": {
    money: "floating fiat, credit, derivatives",
    power: "central banks, global banks, markets",
    labor: "services, finance, globalized supply chains",
    trade: "capital flows, FX markets, containerized trade",
    tech: "computers, derivatives, trading systems"
  },
  "Digital and AI Economy": {
    money: "fiat, digital payments, crypto assets",
    power: "platforms, cloud firms, AI labs, chipmakers",
    labor: "platform work, knowledge work, automation exposure",
    trade: "data networks, software, compute supply chains",
    tech: "cloud, chips, AI models, data centers"
  }
};

type EraHumanDetail = {
  story: string;
  before: string;
  after: string;
  whyWorked: string;
  whyFailed: string;
  dailyLife: string;
  life: {
    mostPeople: string[];
    travel: string;
    money: string;
    biggestFear: string;
  };
  chain: string[];
};

const eraHumanDetails: Record<EconomicEra, EraHumanDetail> = {
  "Pre-Money Exchange": {
    story: "Villages stored food for the first time. Suddenly people needed to know who contributed, who could take grain, and who controlled the storage.",
    before: "People moved often, ate what they found, and relied on small groups.",
    after: "People settled down, stored food, and permanent villages appeared.",
    whyWorked: "Small communities could rely on memory, family ties, and local trust.",
    whyFailed: "Once villages became towns, people could no longer remember every debt, promise, and grain claim.",
    dailyLife: "Food storage made survival easier, but it also created arguments over ownership, taxes, and power.",
    life: {
      mostPeople: ["farmed", "shared favors", "stored grain", "trusted neighbors"],
      travel: "rare",
      money: "food, animals, tools, favors",
      biggestFear: "crop failure"
    },
    chain: ["more stored food", "villages grow", "people specialize", "trade increases", "memory becomes unreliable", "accounting systems appear"]
  },
  "Ancient Economies": {
    story: "Cities, armies, and empires needed a way to collect taxes, pay soldiers, and trade with strangers.",
    before: "Trade depended on records, local trust, and goods that were hard to move.",
    after: "Coins let strangers trade quickly and helped rulers collect taxes across large territories.",
    whyWorked: "Coins, roads, and tax systems made empires easier to organize.",
    whyFailed: "Armies and bureaucracy became expensive. When rulers weakened coins to pay bills, people lost trust in money.",
    dailyLife: "Markets became more common, but ordinary people also faced taxes, military demands, and price instability.",
    life: {
      mostPeople: ["farmed", "paid taxes", "used coins", "served empires"],
      travel: "limited, but trade routes expanded",
      money: "grain, silver, coins",
      biggestFear: "war, taxes, currency losing value"
    },
    chain: ["cities expand", "taxes grow", "coins spread", "armies get expensive", "money gets weakened", "regional trade replaces empire control"]
  },
  "Medieval Trade and Banking": {
    story: "Most people still lived from land, but towns, fairs, merchants, and bankers made money travel farther than kings could govern.",
    before: "Power sat mostly with landowners, and most trade was local or seasonal.",
    after: "Merchants used credit, contracts, and banking families to trade across regions.",
    whyWorked: "Credit let merchants trade without carrying heavy metal everywhere.",
    whyFailed: "Plague, famine, and bigger trade routes changed who had leverage and demanded larger pools of capital.",
    dailyLife: "When workers became scarce after plague, landlords could no longer easily control them.",
    life: {
      mostPeople: ["worked land", "joined guilds", "sold crafts", "paid rents"],
      travel: "rare for peasants, common for merchants",
      money: "coins, promises, credit notes",
      biggestFear: "famine and plague"
    },
    chain: ["towns grow", "merchants travel farther", "credit replaces heavy coins", "plague makes labor scarce", "wages rise", "merchant capitalism grows"]
  },
  Mercantilism: {
    story: "European states treated trade routes like weapons. Ships, colonies, and monopolies became paths to power.",
    before: "Merchants traded across regions, but states had limited reach overseas.",
    after: "Empires used navies, colonies, and chartered companies to control global commerce.",
    whyWorked: "States could concentrate wealth, protect ships, and fund large overseas ventures.",
    whyFailed: "Monopolies, extraction, and colonial limits could not keep up with machinery, factories, and private investment.",
    dailyLife: "Global goods became more visible, but many fortunes came from coercion, monopoly, and colonial labor.",
    life: {
      mostPeople: ["farmed", "worked ports", "sailed", "produced colonial goods"],
      travel: "dangerous, but global for sailors and merchants",
      money: "gold, silver, trade bills",
      biggestFear: "war, piracy, monopoly abuse"
    },
    chain: ["ships cross oceans", "colonies feed empires", "companies pool investors", "monopolies slow innovation", "machines raise output", "factories take over"]
  },
  "Industrial Capitalism": {
    story: "Machines changed work. People stopped working where they lived and began selling their time in factories and cities.",
    before: "Production was slower, smaller, and often tied to homes, farms, or workshops.",
    after: "Factories, railroads, and steam power produced goods at a scale people had never seen.",
    whyWorked: "Machines made goods cheaper, transport faster, and cities more productive.",
    whyFailed: "Crowded cities, inequality, unsafe work, labor anger, and financial panics became too large to ignore.",
    dailyLife: "Factory clocks replaced seasonal rhythms. Wages became normal, cities exploded, and family life reorganized around work schedules.",
    life: {
      mostPeople: ["worked factories", "moved to cities", "bought mass goods", "depended on wages"],
      travel: "faster by rail and steamship",
      money: "wages, banknotes, gold-backed currency",
      biggestFear: "job loss, unsafe work, panic"
    },
    chain: ["steam power spreads", "factories scale", "cities swell", "workers organize", "panics hit banks", "governments intervene more"]
  },
  "Managed Capitalism": {
    story: "After wars and depression, governments became economic shock absorbers, not just tax collectors.",
    before: "Markets and gold rules limited how much governments could respond to crisis.",
    after: "Central banks, welfare states, public spending, and global institutions tried to stabilize jobs and money.",
    whyWorked: "People wanted protection from depression, bank failure, war debt, and mass unemployment.",
    whyFailed: "The gold link strained under global pressure, and inflation made the old monetary rules harder to defend.",
    dailyLife: "Jobs, pensions, mortgages, bank deposits, and recessions became public policy issues.",
    life: {
      mostPeople: ["worked industrial jobs", "used banks", "expected safety nets", "bought homes"],
      travel: "mass travel expanded",
      money: "fiat money partly tied to gold",
      biggestFear: "depression, inflation, unemployment"
    },
    chain: ["depression shocks politics", "states spend more", "central banks gain power", "welfare expands", "gold link strains", "floating money begins"]
  },
  "Global Financial Era": {
    story: "Money moved globally in seconds. Investment scaled dramatically, but crises could now spread just as fast.",
    before: "Money rules were more fixed, and many financial systems were more national.",
    after: "Floating currencies, global banks, credit markets, and derivatives connected households to world finance.",
    whyWorked: "Capital could move quickly to fund trade, homes, companies, and governments.",
    whyFailed: "Debt, leverage, and complex finance made local bubbles capable of becoming global crises.",
    dailyLife: "Mortgages, pensions, credit cards, exchange rates, and asset prices became tied to global markets.",
    life: {
      mostPeople: ["used credit", "owned pensions", "borrowed for homes", "worked in services"],
      travel: "cheap global travel expanded",
      money: "fiat, cards, credit, financial assets",
      biggestFear: "banking crisis and job loss"
    },
    chain: ["currencies float", "credit expands", "markets globalize", "housing debt grows", "banks lose trust", "digital platforms rise"]
  },
  "Digital and AI Economy": {
    story: "Platforms stopped being websites and became infrastructure. Data, chips, cloud systems, and AI began shaping how money and work move.",
    before: "Finance and trade were digital, but most economic power still looked like banks, factories, stores, and offices.",
    after: "Platforms, algorithms, cloud computing, and AI systems became gatekeepers for work, attention, commerce, and investment.",
    whyWorked: "Digital systems made coordination instant and allowed tiny teams to reach global markets.",
    whyFailed: "Power concentrated around platforms, data, chips, and models while workers faced automation and volatility.",
    dailyLife: "Shopping, work, entertainment, payments, learning, and even identity increasingly pass through digital systems.",
    life: {
      mostPeople: ["use platforms", "pay digitally", "work with software", "depend on data systems"],
      travel: "less necessary for many services",
      money: "digital payments, fiat, crypto, platform balances",
      biggestFear: "automation, monopoly power, digital instability"
    },
    chain: ["platforms scale", "data becomes valuable", "cloud centralizes power", "AI automates tasks", "labor shifts", "new rules are still emerging"]
  }
};

function EraInspector({ era }: { era: EraFlowDetail }) {
  const human = eraHumanDetails[era.name];

  return (
    <motion.div
      key={era.name}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative mt-4 overflow-hidden rounded-[8px] border ${era.border} ${era.bg} p-5`}
    >
      <div className={`pointer-events-none absolute inset-0 opacity-50 ${era.aura}`} />
      <div className="relative grid gap-6 xl:grid-cols-[1fr_320px]">
        <div>
          <div className="flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-[8px] bg-black/25 text-2xl">{era.symbol}</div>
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-slate-500">{era.date}</p>
              <h3 className="text-2xl font-bold text-white">{era.name}</h3>
            </div>
          </div>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-100">{human.story}</p>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-400">{human.dailyLife}</p>

          <div className="mt-6 grid gap-3 md:grid-cols-2">
            <BeforeAfter label="Before" value={human.before} />
            <BeforeAfter label="After" value={human.after} highlighted />
          </div>
        </div>

        <aside className="rounded-[8px] bg-black/20 p-4">
          <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-mint">Life in this era</div>
          <div className="mt-4 space-y-4">
            <LifeRow label="Most people" value={human.life.mostPeople.join(", ")} />
            <LifeRow label="Travel" value={human.life.travel} />
            <LifeRow label="Money" value={human.life.money} />
            <LifeRow label="Biggest fear" value={human.life.biggestFear} />
          </div>
        </aside>
      </div>

      <div className="relative mt-6 grid gap-5 lg:grid-cols-[0.86fr_1.14fr]">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-cyan">Why it worked</div>
            <p className="mt-2 text-sm leading-6 text-slate-200">{human.whyWorked}</p>
          </div>
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-rose">Why it failed</div>
            <p className="mt-2 text-sm leading-6 text-slate-200">{human.whyFailed}</p>
          </div>
        </div>
        <div>
          <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-amber">What forced change?</div>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            {human.chain.map((step, index) => (
              <div key={step} className="flex items-center gap-2">
                <span className="rounded-full bg-white/[0.07] px-3 py-2 text-xs font-semibold text-slate-100">{step}</span>
                {index < human.chain.length - 1 && <ArrowRight className="h-3.5 w-3.5 shrink-0 text-amber" />}
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function BeforeAfter({ label, value, highlighted = false }: { label: string; value: string; highlighted?: boolean }) {
  return (
    <div className={`${highlighted ? "bg-cyan/10" : "bg-black/20"} rounded-[8px] p-4`}>
      <div className={`font-mono text-[10px] uppercase tracking-[0.22em] ${highlighted ? "text-cyan" : "text-slate-500"}`}>{label}</div>
      <p className="mt-2 text-sm leading-6 text-slate-200">{value}</p>
    </div>
  );
}

function LifeRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="font-mono text-[9px] uppercase tracking-[0.18em] text-slate-500">{label}</div>
      <p className="mt-1 text-sm leading-5 text-slate-200">{value}</p>
    </div>
  );
}

function EraComparison({ left, right }: { left: EraFlowDetail; right: EraFlowDetail }) {
  const leftFacts = comparisonFacts[left.name];
  const rightFacts = comparisonFacts[right.name];
  const rows = [
    ["Money system", leftFacts.money, rightFacts.money],
    ["Dominant power", leftFacts.power, rightFacts.power],
    ["Labor structure", leftFacts.labor, rightFacts.labor],
    ["Trade structure", leftFacts.trade, rightFacts.trade],
    ["Technology base", leftFacts.tech, rightFacts.tech]
  ];

  return (
    <motion.div
      key={`${left.name}-${right.name}`}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-4 rounded-[8px] border border-white/10 bg-black/20 p-5"
    >
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-mint">Era comparison</div>
          <h3 className="mt-1 text-xl font-bold text-white">
            {left.name} <span className="text-slate-500">vs</span> {right.name}
          </h3>
        </div>
        <p className="max-w-xl text-sm leading-6 text-slate-400">
          Compare how power, money, labor, trade, and technology changed between systems.
        </p>
      </div>
      <div className="mt-5 overflow-hidden rounded-[8px] bg-white/[0.035]">
        <div className="grid grid-cols-[0.85fr_1fr_1fr] border-b border-white/10 px-4 py-3 font-mono text-[10px] uppercase tracking-[0.16em] text-slate-500">
          <span>Dimension</span>
          <span>{left.name}</span>
          <span>{right.name}</span>
        </div>
        {rows.map(([label, leftValue, rightValue]) => (
          <div key={label} className="grid grid-cols-[0.85fr_1fr_1fr] gap-4 border-b border-white/[0.06] px-4 py-3 last:border-b-0">
            <span className="text-xs font-semibold text-cyan">{label}</span>
            <span className="text-sm leading-5 text-slate-200">{leftValue}</span>
            <span className="text-sm leading-5 text-slate-200">{rightValue}</span>
          </div>
        ))}
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-slate-400">
        <span className="rounded-full bg-cyan/10 px-3 py-1 text-cyan">{left.transition}</span>
        <ArrowRight className="h-3.5 w-3.5 text-amber" />
        <span className="rounded-full bg-amber/10 px-3 py-1 text-amber">{right.optimizedFor}</span>
      </div>
    </motion.div>
  );
}

function GuidedTimeline({
  events,
  activeEvent,
  setActiveEventId
}: {
  events: TimelineEvent[];
  activeEvent: TimelineEvent;
  setActiveEventId: (id: string) => void;
}) {
  return (
    <section className="glass rounded-[8px] p-5">
      <SectionTitle icon={Network} eyebrow="Section 3" title="Guided Causal Timeline" />
      <div className="mt-5 max-h-[880px] space-y-0 overflow-auto pr-1">
        {events.map((event, index) => {
          const active = event.id === activeEvent.id;
          return (
            <div key={event.id} className="relative pl-7">
              <div className="absolute left-2 top-0 h-full w-px bg-white/10" />
              <div className={`absolute left-[3px] top-5 h-4 w-4 rounded-full border ${active ? "border-amber bg-amber shadow-[0_0_18px_rgba(245,196,81,.7)]" : "border-cyan/40 bg-slate-950"}`} />
              <motion.button
                layout
                onClick={() => setActiveEventId(event.id)}
                className={`mb-3 w-full rounded-[8px] border p-4 text-left transition ${
                  active ? "border-amber/50 bg-amber/10" : "border-white/10 bg-white/[0.035] hover:border-white/25"
                }`}
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="font-mono text-xs text-cyan">{event.date}</div>
                    <div className="mt-1 text-base font-semibold text-white">{event.title}</div>
                  </div>
                  <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-slate-400">
                    {event.era}
                  </span>
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-300">{event.summary}</p>
                <div className="mt-3 grid gap-2 md:grid-cols-3">
                  <MiniFlow label="Cause" value={event.cause} />
                  <MiniFlow label="Immediate effect" value={event.immediateEffect} />
                  <MiniFlow label="Long-term impact" value={event.longTermImpact} />
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-400">
                  {event.previous && <span className="rounded-full bg-white/[0.04] px-2 py-1">prev: {labelFor(event.previous)}</span>}
                  {event.next && <span className="rounded-full bg-white/[0.04] px-2 py-1">next: {labelFor(event.next)}</span>}
                  <span className="rounded-full bg-white/[0.04] px-2 py-1">step {index + 1} / {events.length}</span>
                </div>
              </motion.button>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function EventIntelligence({
  event,
  previousEvent,
  nextEvent,
  canGoPrevious,
  canGoNext
}: {
  event: TimelineEvent;
  previousEvent: () => void;
  nextEvent: () => void;
  canGoPrevious: boolean;
  canGoNext: boolean;
}) {
  return (
    <section className="glass rounded-[8px] p-5">
      <SectionTitle icon={LineChart} eyebrow="Section 4" title="Event Intelligence Panel" />
      <div className="mt-5 rounded-[8px] border border-white/10 bg-black/20 p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="font-mono text-xs uppercase tracking-[0.2em] text-cyan">{event.date} · {event.era}</div>
            <h2 className="mt-2 text-2xl font-bold text-white">{event.title}</h2>
            <p className="mt-3 text-sm leading-6 text-slate-300">{event.summary}</p>
          </div>
          <div className="flex gap-2">
            <button disabled={!canGoPrevious} onClick={previousEvent} className="inline-flex items-center gap-2 rounded-[8px] border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-semibold text-white disabled:opacity-40">
              <ChevronLeft className="h-4 w-4" />
              Previous event
            </button>
            <button disabled={!canGoNext} onClick={nextEvent} className="inline-flex items-center gap-2 rounded-[8px] bg-white px-3 py-2 text-xs font-semibold text-slate-950 disabled:opacity-40">
              Next event
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="mt-5">
          <div className="mb-2 text-sm font-semibold text-white">Cause chain</div>
          <CausalChain items={event.causeChain} />
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-2">
          <PeopleBlock title="Who gained?" items={event.gained} tone="mint" />
          <PeopleBlock title="Who lost?" items={event.lost} tone="rose" />
        </div>

        <div className="mt-5">
          <div className="mb-3 text-sm font-semibold text-white">Impact metrics</div>
          <div className="space-y-3">
            {event.metrics.map((item) => <MetricBar key={item.label} metric={item} />)}
          </div>
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-2">
          <Mini title="What changed next?" body={event.changedNext} />
          <Mini title="Modern parallel" body={event.modernParallel} />
        </div>

        <Sources items={event.sources} />
      </div>
    </section>
  );
}

type ModernDebateKey = "Inflation" | "Housing crisis" | "AI regulation" | "Tariffs" | "Universal basic income";

type ThinkerWarProfile = {
  symbol: string;
  ideology: string;
  movement: string;
  philosophy: string;
  crisis: string;
  problem: string;
  fear: string;
  whyFollowed: string;
  actions: string[];
  today: string;
  conflicts: { with: string; axis: string }[];
  modernDebates: Record<ModernDebateKey, string>;
};

const thinkerWarProfiles: Record<string, ThinkerWarProfile> = {
  "Adam Smith": {
    symbol: "⚖",
    ideology: "Markets • Incentives • Competition",
    movement: "Classical liberalism",
    philosophy: "Prices and competition can coordinate millions of choices without a king telling everyone what to do.",
    crisis: "Mercantilist empires restricted trade, protected monopolies, and treated wealth like a pile of gold to hoard.",
    problem: "How do you create prosperity without letting monarchs and monopolies control every trade route?",
    fear: "Monopoly power, protected privilege, and rulers blocking ordinary exchange.",
    whyFollowed: "Smith made markets feel like a system of coordination, not just selfish chaos.",
    actions: ["open trade", "protect competition", "remove monopoly privilege", "raise productivity"],
    today: "He would watch platform monopolies closely: markets need competition, not just big private gatekeepers.",
    conflicts: [
      { with: "Marx", axis: "Are markets freedom and coordination, or a system that concentrates power over labor?" },
      { with: "Ricardo", axis: "Smith emphasized broad market coordination; Ricardo sharpened the logic of trade specialization." }
    ],
    modernDebates: {
      Inflation: "Smith would look at supply, competition, and distorted incentives before blaming one single lever.",
      "Housing crisis": "He would likely attack artificial scarcity, local restrictions, and rent-seeking around land.",
      "AI regulation": "He would defend innovation but worry if a few firms controlled the market.",
      Tariffs: "He would usually oppose tariffs that protect inefficient producers at consumers' expense.",
      "Universal basic income": "He would ask whether it preserves incentives while protecting people from hardship."
    }
  },
  "David Ricardo": {
    symbol: "⇄",
    ideology: "Trade • Specialization • Advantage",
    movement: "Classical trade theory",
    philosophy: "Countries can gain by trading even when one is better at producing almost everything.",
    crisis: "Protectionist politics made trade look like a zero-sum fight between nations.",
    problem: "Why should countries trade instead of trying to make everything themselves?",
    fear: "Protectionism that makes everyone poorer while claiming to defend national strength.",
    whyFollowed: "Ricardo gave free trade one of its cleanest arguments: specialize where your relative advantage is strongest.",
    actions: ["lower tariffs", "specialize production", "trade when gains are clear", "watch distributional damage"],
    today: "He would defend trade gains but would have to confront the workers and towns harmed by globalization.",
    conflicts: [
      { with: "Marx", axis: "Ricardo saw trade efficiency; Marx focused on who captured the gains." },
      { with: "Keynes", axis: "Ricardo trusted trade logic; Keynes worried demand collapse could overpower elegant theory." }
    ],
    modernDebates: {
      Inflation: "Ricardo would ask whether trade restrictions and supply bottlenecks are pushing prices higher.",
      "Housing crisis": "He would focus on land scarcity, rents, and who captures gains from limited locations.",
      "AI regulation": "He would ask which economies have relative advantage in chips, compute, and AI services.",
      Tariffs: "He would warn that tariffs can protect some jobs while quietly raising costs for everyone else.",
      "Universal basic income": "He would ask how it is funded and how it changes wages, rents, and incentives."
    }
  },
  "Karl Marx": {
    symbol: "✊",
    ideology: "Labor • Power • Ownership",
    movement: "Critique of industrial capitalism",
    philosophy: "An economy is also a power structure: who owns production shapes who gets security, voice, and wealth.",
    crisis: "Industrial workers often faced brutal conditions while factory owners accumulated enormous power.",
    problem: "What happens when the people who create value do not control the system they depend on?",
    fear: "Capital concentration, exploitation, alienation, and workers losing control over their lives.",
    whyFollowed: "Marx gave industrial workers a language for anger that felt political, historical, and personal.",
    actions: ["strengthen labor power", "redistribute ownership", "watch inequality", "challenge monopoly capital"],
    today: "He would see platform labor, AI displacement, and wealth concentration as new versions of old power struggles.",
    conflicts: [
      { with: "Smith", axis: "Smith saw market coordination; Marx saw class power inside the market." },
      { with: "Hayek", axis: "Marx wanted ownership transformed; Hayek feared that transformation would centralize coercive power." }
    ],
    modernDebates: {
      Inflation: "Marx would ask who benefits from price increases and who has enough power to pass costs along.",
      "Housing crisis": "He would focus on landlords, asset ownership, and housing as a wealth extraction system.",
      "AI regulation": "He would ask who owns the models, the data, and the productivity gains.",
      Tariffs: "He would ask whether tariffs protect workers or merely protect owners from competition.",
      "Universal basic income": "He might support income security but argue it does not solve ownership and power."
    }
  },
  "John Maynard Keynes": {
    symbol: "↯",
    ideology: "Demand • Stabilization • Spending",
    movement: "Keynesian economics",
    philosophy: "Markets can freeze from fear, so governments sometimes need to restart demand before damage becomes permanent.",
    crisis: "The Great Depression created mass unemployment that traditional economics struggled to explain.",
    problem: "How do you restart an economy when fear stops spending, hiring, lending, and investment?",
    fear: "Economic paralysis caused by collapsing demand and self-reinforcing pessimism.",
    whyFollowed: "Keynes became influential because waiting for markets to heal themselves felt morally and politically impossible in the 1930s.",
    actions: ["increase public spending", "support jobs", "lower rates if possible", "cool demand when overheated"],
    today: "If unemployment rose while demand weakened, he would likely support temporary stimulus and public investment.",
    conflicts: [
      { with: "Hayek", axis: "Keynes accepted state stabilization; Hayek feared intervention would distort price signals." },
      { with: "Friedman", axis: "Keynes emphasized demand and fiscal policy; Friedman emphasized inflation credibility and money." }
    ],
    modernDebates: {
      Inflation: "Keynes would distinguish demand inflation from supply shocks, then avoid stimulus if the economy is already overheated.",
      "Housing crisis": "He would support public investment when private markets fail to provide enough homes.",
      "AI regulation": "He would ask whether AI creates enough demand and jobs, not just productivity.",
      Tariffs: "He would tolerate strategic intervention but worry tariffs can raise prices and reduce demand.",
      "Universal basic income": "He might support income support during demand slumps, especially if households are cutting spending."
    }
  },
  "F. A. Hayek": {
    symbol: "◌",
    ideology: "Markets • Signals • Decentralization",
    movement: "Austrian economics",
    philosophy: "No planner can know enough. Prices carry local knowledge that centralized systems often destroy.",
    crisis: "The rise of socialism and central planning made state control look modern, scientific, and inevitable.",
    problem: "How do you prevent governments from controlling more information than they can possibly understand?",
    fear: "Centralized economic control, price manipulation, and the slow loss of freedom through planning.",
    whyFollowed: "Hayek appealed to people who feared that crisis politics would make temporary control permanent.",
    actions: ["protect price signals", "limit central control", "avoid price caps", "trust decentralized adjustment"],
    today: "If he saw algorithmic planning and AI monopolies, he might warn about concentrated information power.",
    conflicts: [
      { with: "Keynes", axis: "Keynes saw emergency stabilization; Hayek saw dangerous interference with market signals." },
      { with: "Marx", axis: "Marx distrusted capitalist ownership; Hayek distrusted centralized alternatives." }
    ],
    modernDebates: {
      Inflation: "Hayek would warn against price controls and argue that distorted money and signals create bigger problems.",
      "Housing crisis": "He would emphasize zoning, distorted incentives, and supply restrictions over central allocation.",
      "AI regulation": "He would worry about both state planning and private platforms controlling too much information.",
      Tariffs: "He would oppose tariffs that block price signals and hide real costs.",
      "Universal basic income": "He might prefer simple cash support over complex planning, but worry about incentives and fiscal limits."
    }
  },
  "Milton Friedman": {
    symbol: "π",
    ideology: "Money • Inflation • Discipline",
    movement: "Monetarism",
    philosophy: "Inflation becomes dangerous when people stop believing money will hold its value.",
    crisis: "Persistent inflation in the 1970s weakened trust in older Keynesian policy frameworks.",
    problem: "How do you stop inflation from becoming permanent?",
    fear: "Runaway inflation, unstable expectations, and governments trying to fine-tune too much.",
    whyFollowed: "Friedman gained force when inflation made old policy confidence look naive.",
    actions: ["anchor expectations", "tighten money", "avoid stop-go policy", "prioritize credibility"],
    today: "If inflation stayed high, he would focus on central bank credibility and monetary discipline.",
    conflicts: [
      { with: "Keynes", axis: "Friedman distrusted fiscal fine-tuning; Keynes saw fiscal policy as necessary in deep slumps." },
      { with: "Fisher", axis: "Friedman emphasized money growth; Fisher emphasized debt and falling prices in crisis." }
    ],
    modernDebates: {
      Inflation: "Friedman would ask whether central banks are credible enough to keep expectations anchored.",
      "Housing crisis": "He would separate monetary conditions from local supply restrictions and bad incentives.",
      "AI regulation": "He would prefer clear rules and competition over heavy discretionary control.",
      Tariffs: "He would warn tariffs raise prices and invite political favoritism.",
      "Universal basic income": "He might compare it to a negative income tax if it replaces messy welfare systems."
    }
  },
  "Joseph Schumpeter": {
    symbol: "✦",
    ideology: "Innovation • Disruption • Entrepreneurs",
    movement: "Innovation economics",
    philosophy: "Capitalism advances by destroying old systems and building new ones through entrepreneurs and technology.",
    crisis: "Static theories made capitalism look like equilibrium, while real economies kept being remade by invention.",
    problem: "Why does capitalism keep changing its own rules?",
    fear: "Stagnation, bureaucratic dullness, and societies resisting the disruption that creates growth.",
    whyFollowed: "Schumpeter made instability feel like the engine of capitalism rather than a bug in the system.",
    actions: ["fund innovation", "accept churn", "support entrepreneurs", "manage displacement"],
    today: "He would see AI as classic creative destruction: enormous growth potential with real social cost.",
    conflicts: [
      { with: "Marx", axis: "Both saw capitalism as dynamic; Marx stressed exploitation, Schumpeter stressed innovation." },
      { with: "Malthus", axis: "Malthus feared limits; Schumpeter trusted invention to break limits." }
    ],
    modernDebates: {
      Inflation: "Schumpeter would ask whether price pressure reflects bottlenecks before a productivity wave.",
      "Housing crisis": "He would look for construction, finance, and zoning innovations that break scarcity.",
      "AI regulation": "He would defend experimentation while warning that disruption creates losers.",
      Tariffs: "He would support competition unless strategic protection truly accelerates innovation.",
      "Universal basic income": "He would frame it as a way to soften disruption without stopping innovation."
    }
  },
  "Irving Fisher": {
    symbol: "↓",
    ideology: "Debt • Deflation • Credit",
    movement: "Debt-deflation theory",
    philosophy: "Debt can turn a downturn into a trap when falling prices make every loan harder to repay.",
    crisis: "The Great Depression exposed how debt, bank failures, and falling prices could reinforce each other.",
    problem: "How do you stop debt from pulling an economy into a downward spiral?",
    fear: "Debt-deflation: people sell assets, prices fall, real debt rises, and panic feeds itself.",
    whyFollowed: "Fisher became crucial because balance sheets explained pain that simple market stories missed.",
    actions: ["stabilize credit", "prevent deflation", "repair balance sheets", "watch leverage"],
    today: "He would watch housing debt, private credit, and deflation risk like warning lights.",
    conflicts: [
      { with: "Friedman", axis: "Friedman watched money; Fisher watched debt burdens and falling prices." },
      { with: "Hayek", axis: "Fisher favored stabilization to stop spirals; Hayek feared interventions could hide bad signals." }
    ],
    modernDebates: {
      Inflation: "Fisher would ask whether rate hikes risk breaking debt-heavy households and firms.",
      "Housing crisis": "He would focus on mortgage debt, falling home prices, and bank balance sheets.",
      "AI regulation": "He would ask whether AI investment is funded by fragile debt or real productivity.",
      Tariffs: "He would worry tariffs could squeeze indebted firms through higher costs.",
      "Universal basic income": "He would ask whether income support prevents defaults during downturns."
    }
  },
  "Thomas Malthus": {
    symbol: "⌁",
    ideology: "Population • Scarcity • Resources",
    movement: "Population theory",
    philosophy: "Human needs can grow faster than food, land, and resources unless productivity changes the equation.",
    crisis: "Poverty and food insecurity made resource limits feel like a permanent threat.",
    problem: "What happens when population pressure outruns the resources people need to survive?",
    fear: "Scarcity, famine, and societies assuming growth can continue without limits.",
    whyFollowed: "Malthus gave policymakers a stark warning: prosperity can vanish if resources fail.",
    actions: ["watch food supply", "track population pressure", "raise productivity", "prepare for scarcity shocks"],
    today: "He would see climate stress, water scarcity, and food security as central economic issues.",
    conflicts: [
      { with: "Schumpeter", axis: "Malthus feared limits; Schumpeter trusted innovation to break them." },
      { with: "Smith", axis: "Smith saw exchange creating prosperity; Malthus worried nature could still impose hard ceilings." }
    ],
    modernDebates: {
      Inflation: "Malthus would focus on food, energy, climate, and resource bottlenecks.",
      "Housing crisis": "He would see population pressure colliding with limited land and slow construction.",
      "AI regulation": "He would ask whether AI truly raises productivity enough to ease scarcity.",
      Tariffs: "He would worry food and resource tariffs can create shortages.",
      "Universal basic income": "He would ask whether income support is matched by real food, housing, and energy capacity."
    }
  }
};

const oppositionBriefs: Record<string, { question: string; opponent: string; thinkerView: string; opponentView: string }> = {
  "Adam Smith": {
    question: "Do markets create freedom or hide power?",
    opponent: "Marx",
    thinkerView: "Competition can coordinate society and weaken old privileges.",
    opponentView: "Ownership still decides who has power over work and survival."
  },
  "David Ricardo": {
    question: "Does trade make everyone richer?",
    opponent: "Marx",
    thinkerView: "Specialization and trade can raise total wealth.",
    opponentView: "The gains can flow to owners while workers absorb the pain."
  },
  "Karl Marx": {
    question: "Who should control production?",
    opponent: "Smith",
    thinkerView: "Workers create value but owners capture power.",
    opponentView: "Competitive markets can coordinate prosperity better than control."
  },
  "John Maynard Keynes": {
    question: "Can governments stabilize economies safely?",
    opponent: "Hayek",
    thinkerView: "Yes. Demand collapses require intervention before fear becomes permanent.",
    opponentView: "No. Intervention can distort prices and make temporary control permanent."
  },
  "F. A. Hayek": {
    question: "Who knows enough to guide an economy?",
    opponent: "Keynes",
    thinkerView: "No central planner can replace local price signals.",
    opponentView: "During collapse, waiting for signals can leave millions unemployed."
  },
  "Milton Friedman": {
    question: "What anchors economic trust?",
    opponent: "Keynes",
    thinkerView: "Stable money and credible inflation control come first.",
    opponentView: "In a slump, public demand support can matter more than monetary rules."
  },
  "Joseph Schumpeter": {
    question: "Is disruption a crisis or the engine of progress?",
    opponent: "Marx",
    thinkerView: "Creative destruction renews capitalism through innovation.",
    opponentView: "Disruption can deepen exploitation when ownership stays concentrated."
  },
  "Irving Fisher": {
    question: "Why do downturns become spirals?",
    opponent: "Friedman",
    thinkerView: "Debt and falling prices can trap households and banks.",
    opponentView: "Money and expectations are the main levers to stabilize prices."
  },
  "Thomas Malthus": {
    question: "Can growth outrun scarcity forever?",
    opponent: "Schumpeter",
    thinkerView: "Resources can impose hard limits on society.",
    opponentView: "Innovation can break limits that once seemed permanent."
  }
};

function ThinkersPolicyPlaybooks({
  variables,
  activeThinker,
  setActiveThinker,
  thinker
}: {
  variables: EconomicVariables;
  activeThinker: string;
  setActiveThinker: (name: string) => void;
  thinker: (typeof thinkers)[number];
}) {
  const [tab, setTab] = useState<"explore" | "battle">("explore");
  const [activeBattleId, setActiveBattleId] = useState(ideologicalBattles[0].id);
  const activeBattle = ideologicalBattles.find((b) => b.id === activeBattleId) ?? ideologicalBattles[0];

  const scenarioRead =
    variables.inflation > 6
      ? "sandbox: inflation pressure"
      : variables.unemployment > 8
        ? "sandbox: labor-market stress"
        : variables.tariffs > 18
          ? "sandbox: trade friction"
          : "sandbox: relatively balanced";
  const profile = thinkerWarProfiles[thinker.name] ?? thinkerWarProfiles["John Maynard Keynes"];
  const opposition = oppositionBriefs[thinker.name] ?? oppositionBriefs["John Maynard Keynes"];
  const solution = profile.actions.slice(0, 2).join(" + ");
  const currentDebate =
    variables.inflation > 6
      ? "Inflation"
      : variables.unemployment > 8
        ? "Universal basic income"
        : variables.tariffs > 18
          ? "Tariffs"
          : "AI regulation";
  const modernEntries = (Object.entries(profile.modernDebates) as [ModernDebateKey, string][]).slice(0, 4);

  return (
    <section id="thinkers" className="glass relative overflow-visible rounded-[8px] p-5">
      <div className="pointer-events-none absolute inset-0 opacity-25 [background:radial-gradient(circle_at_10%_12%,rgba(56,213,255,.12),transparent_26%)]" />
      <div className="relative flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <SectionTitle icon={Brain} eyebrow="Section 5" title="Economic Ideologies and Policy Wars" />
        <p className="max-w-2xl text-sm leading-6 text-slate-400">
          Competing survival strategies for society, shaped by crisis, fear, and disagreement.
        </p>
      </div>

      <div className="relative mt-4 flex gap-2">
        <button
          onClick={() => setTab("explore")}
          className={`inline-flex items-center gap-2 rounded-[8px] border px-3 py-2 text-sm font-semibold transition ${tab === "explore" ? "border-cyan/40 bg-cyan/10 text-cyan" : "border-white/10 bg-white/[0.04] text-white hover:border-white/25"}`}
        >
          <Brain className="h-4 w-4" />
          Explore Thinkers
        </button>
        <button
          onClick={() => setTab("battle")}
          className={`inline-flex items-center gap-2 rounded-[8px] border px-3 py-2 text-sm font-semibold transition ${tab === "battle" ? "border-rose/40 bg-rose/10 text-rose" : "border-white/10 bg-white/[0.04] text-white hover:border-rose/30"}`}
        >
          <Swords className="h-4 w-4" />
          Battle of Ideas
        </button>
      </div>

      <AnimatePresence mode="wait">
        {tab === "battle" ? (
          <motion.div key="battle" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="mt-5">
            <BattleArena activeBattle={activeBattle} activeBattleId={activeBattleId} setActiveBattleId={setActiveBattleId} />
          </motion.div>
        ) : (
          <motion.div key="explore" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="relative mt-5 grid items-start gap-5 xl:grid-cols-[270px_1fr]">
            <div className="max-h-[360px] space-y-2 overflow-y-auto pr-1 xl:sticky xl:top-24 xl:max-h-[calc(100vh-120px)]">
              {thinkers.map((item) => (
                <button
                  key={item.name}
                  onClick={() => setActiveThinker(item.name)}
                  className={`w-full rounded-[8px] border px-4 py-3 text-left transition ${
                    activeThinker === item.name ? "border-cyan/45 bg-cyan/10" : "border-white/10 bg-white/[0.025] hover:border-white/25"
                  }`}
                >
                  <div className="text-sm font-semibold text-white">{item.name}</div>
                  <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.16em] text-slate-500">{item.dates}</div>
                  <div className="mt-3 font-mono text-[9px] uppercase leading-4 tracking-[0.16em] text-cyan">
                    {thinkerWarProfiles[item.name]?.ideology ?? item.school}
                  </div>
                </button>
              ))}
            </div>

            <article className="rounded-[8px] border border-white/10 bg-black/20 p-6">
              <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                <div>
                  <h3 className="mt-1 text-3xl font-bold text-white">{thinker.name}</h3>
                  <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.18em] text-cyan">{thinker.dates} · {profile.movement}</p>
                  <p className="mt-5 max-w-4xl text-2xl leading-9 text-slate-100">{profile.philosophy}</p>
                </div>
                <span className="shrink-0 rounded-full border border-amber/20 bg-amber/10 px-3 py-1 text-xs text-amber">{scenarioRead}</span>
              </div>

              <div className="mt-6 grid gap-3 border-y border-white/10 py-4 md:grid-cols-5">
                <MetaItem label="Crisis" value={thinker.respondingTo} />
                <MetaItem label="Fear" value={profile.fear} />
                <MetaItem label="Solution" value={solution} />
                <MetaItem label="Opponent" value={opposition.opponent} />
                <MetaItem label="Today" value={currentDebate} />
              </div>

              <div className="mt-6">
                <h4 className="text-lg font-semibold text-white">What would they do?</h4>
                <div className="mt-3 flex flex-wrap gap-2">
                  {profile.actions.map((action) => (
                    <span key={action} className="rounded-full bg-white/[0.07] px-3 py-2 text-xs font-semibold text-slate-100">{action}</span>
                  ))}
                </div>
              </div>

              <div className="mt-7 rounded-[8px] bg-white/[0.035] p-5">
                <div className="text-sm font-semibold text-amber">Key question: {opposition.question}</div>
                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <div>
                    <div className="text-sm font-semibold text-white">{thinker.name.split(" ").slice(-1)[0]}</div>
                    <p className="mt-2 text-sm leading-6 text-slate-300">{opposition.thinkerView}</p>
                  </div>
                  <div className="border-l border-white/10 pl-4">
                    <div className="text-sm font-semibold text-cyan">{opposition.opponent}</div>
                    <p className="mt-2 text-sm leading-6 text-slate-300">{opposition.opponentView}</p>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <h4 className="text-lg font-semibold text-white">Where this appears today</h4>
                <div className="mt-3 grid gap-3 md:grid-cols-2">
                  {modernEntries.map(([debate, reaction]) => (
                    <div key={debate} className="border-l border-cyan/20 pl-4">
                      <div className="text-sm font-semibold text-cyan">{debate}</div>
                      <p className="mt-1 text-sm leading-6 text-slate-300">{reaction}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 divide-y divide-white/10 border-y border-white/10">
                <CollapsibleBrief title="Why people followed them">{profile.whyFollowed}</CollapsibleBrief>
                <CollapsibleBrief title="Main criticism">{thinker.criticism}</CollapsibleBrief>
                <CollapsibleBrief title="If they saw today's world">{profile.today}</CollapsibleBrief>
                <CollapsibleBrief title="Famous historical example">{thinker.modernExample}</CollapsibleBrief>
                <CollapsibleBrief title="More debates with opponents">
                  {profile.conflicts.map((conflict) => `${thinker.name.split(" ").slice(-1)[0]} vs ${conflict.with}: ${conflict.axis}`).join(" ")}
                </CollapsibleBrief>
              </div>

              <div className="mt-5">
                <Sources items={thinker.sources} />
              </div>
            </article>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

function BattleArena({
  activeBattle,
  activeBattleId,
  setActiveBattleId
}: {
  activeBattle: IdeologicalBattle;
  activeBattleId: string;
  setActiveBattleId: (id: string) => void;
}) {
  const leftProfile = thinkerWarProfiles[activeBattle.left];
  const rightProfile = thinkerWarProfiles[activeBattle.right];
  const leftOpposition = oppositionBriefs[activeBattle.left];
  const rightOpposition = oppositionBriefs[activeBattle.right];
  const leftThinker = thinkers.find((t) => t.name === activeBattle.left);
  const rightThinker = thinkers.find((t) => t.name === activeBattle.right);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {ideologicalBattles.map((battle) => (
          <button
            key={battle.id}
            onClick={() => setActiveBattleId(battle.id)}
            className={`rounded-[8px] border px-3 py-2 text-sm font-semibold transition ${
              activeBattleId === battle.id
                ? "border-rose/40 bg-rose/10 text-rose"
                : "border-white/10 bg-white/[0.04] text-white hover:border-white/25"
            }`}
          >
            {battle.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeBattleId}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.22 }}
          className="space-y-4"
        >
          <div className="relative overflow-hidden rounded-[8px] border border-white/10 bg-black/20">
            <div className="absolute inset-0 [background:radial-gradient(circle_at_20%_50%,rgba(56,213,255,.07),transparent_38%),radial-gradient(circle_at_80%_50%,rgba(251,113,133,.07),transparent_38%)]" />
            <div className="relative grid md:grid-cols-[1fr_auto_1fr]">
              <div className="flex flex-col gap-4 p-6">
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-cyan/10 text-xl">{leftProfile?.symbol}</span>
                  <div>
                    <div className="font-semibold text-white">{activeBattle.left}</div>
                    <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-cyan">{leftProfile?.movement}</div>
                  </div>
                </div>
                <p className="text-sm leading-6 text-slate-300">{leftOpposition?.thinkerView}</p>
                <div className="space-y-2">
                  <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-slate-500">Policy playbook</div>
                  <div className="flex flex-wrap gap-1.5">
                    {leftProfile?.actions.map((a) => (
                      <span key={a} className="rounded-full border border-cyan/20 bg-cyan/10 px-2.5 py-1 text-xs text-cyan">{a}</span>
                    ))}
                  </div>
                </div>
                {leftThinker && (
                  <div className="rounded-[8px] border border-white/10 bg-white/[0.03] p-3 text-xs leading-5 text-slate-400">
                    <span className="font-semibold text-white">Main criticism: </span>{leftThinker.criticism}
                  </div>
                )}
              </div>

              <div className="flex flex-col items-center justify-center gap-3 px-4 py-6">
                <div className="hidden h-full w-px bg-gradient-to-b from-transparent via-white/15 to-transparent md:block" />
                <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full border border-rose/30 bg-rose/10">
                  <Swords className="h-5 w-5 text-rose" />
                </div>
                <div className="hidden h-full w-px bg-gradient-to-b from-transparent via-white/15 to-transparent md:block" />
              </div>

              <div className="flex flex-col gap-4 border-t border-white/10 p-6 md:border-l md:border-t-0">
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-rose/10 text-xl">{rightProfile?.symbol}</span>
                  <div>
                    <div className="font-semibold text-white">{activeBattle.right}</div>
                    <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-rose">{rightProfile?.movement}</div>
                  </div>
                </div>
                <p className="text-sm leading-6 text-slate-300">{leftOpposition?.opponentView}</p>
                <div className="space-y-2">
                  <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-slate-500">Policy playbook</div>
                  <div className="flex flex-wrap gap-1.5">
                    {rightProfile?.actions.map((a) => (
                      <span key={a} className="rounded-full border border-rose/20 bg-rose/10 px-2.5 py-1 text-xs text-rose">{a}</span>
                    ))}
                  </div>
                </div>
                {rightThinker && (
                  <div className="rounded-[8px] border border-white/10 bg-white/[0.03] p-3 text-xs leading-5 text-slate-400">
                    <span className="font-semibold text-white">Main criticism: </span>{rightThinker.criticism}
                  </div>
                )}
              </div>
            </div>

            <div className="relative border-t border-white/10 bg-white/[0.025] px-6 py-4">
              <div className="mb-1 font-mono text-[10px] uppercase tracking-[0.22em] text-amber">The question</div>
              <p className="text-base font-semibold text-white">{activeBattle.question}</p>
              <p className="mt-2 text-sm leading-6 text-slate-400">{activeBattle.stakes}</p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-[8px] border border-mint/20 bg-mint/5 p-5">
              <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.22em] text-mint">Historical verdict</div>
              <p className="text-sm leading-6 text-slate-300">{activeBattle.historicalVerdict}</p>
            </div>
            <div className="rounded-[8px] border border-amber/20 bg-amber/5 p-5">
              <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.22em] text-amber">Modern resonance</div>
              <p className="text-sm leading-6 text-slate-300">{activeBattle.modernResonance}</p>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function MetaItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <div className="text-xs font-semibold text-slate-500">{label}</div>
      <p className="mt-1 line-clamp-2 text-sm leading-5 text-slate-200">{value}</p>
    </div>
  );
}

function CollapsibleBrief({ title, children }: { title: string; children: string }) {
  return (
    <details className="group py-3">
      <summary className="cursor-pointer list-none text-sm font-semibold text-white">
        <span className="mr-2 inline-block text-slate-500 transition group-open:rotate-90">›</span>
        {title}
      </summary>
      <p className="mt-2 pl-5 text-sm leading-6 text-slate-400">{children}</p>
    </details>
  );
}

function ButterflyEffect({
  active,
  setActive,
  effect
}: {
  active: string;
  setActive: (trigger: string) => void;
  effect: (typeof butterflyEffects)[number];
}) {
  return (
    <section className="glass rounded-[8px] p-5">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <SectionTitle icon={Flame} eyebrow="Section 6" title="Economic Butterfly Effect" />
        <p className="max-w-xl text-sm leading-6 text-slate-400">Select a shock and play through the causal chain to see how one event reshapes an entire economy.</p>
      </div>
      <div className="mt-5 flex flex-wrap gap-2">
        {butterflyEffects.map((item) => (
          <button
            key={item.trigger}
            onClick={() => setActive(item.trigger)}
            className={`rounded-[8px] border px-3 py-2 text-sm font-semibold transition ${
              active === item.trigger ? "border-amber/40 bg-amber/10 text-amber" : "border-white/10 bg-white/[0.04] text-white hover:border-white/25"
            }`}
          >
            {item.trigger}
          </button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
          className="mt-5 rounded-[8px] border border-white/10 bg-black/20 p-5"
        >
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-amber">Initial shock</div>
              <h3 className="mt-1 text-2xl font-bold text-white">{effect.initialShock}</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {effect.indicators.map((indicator) => (
                <span key={indicator} className="rounded-full border border-amber/20 bg-amber/10 px-3 py-1 text-xs text-amber">{indicator}</span>
              ))}
            </div>
          </div>
          <div className="mt-5">
            <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.18em] text-slate-500">Propagation chain</div>
            <CausalChain items={effect.chain} />
          </div>
          <div className="mt-5 grid gap-3 md:grid-cols-3">
            <Mini title="Who is affected" body={effect.affectedGroups} />
            <Mini title="Political and social spillovers" body={effect.spillovers} />
            <Mini title="Historical lesson" body={effect.lesson} />
          </div>
          <Sources items={effect.sources} />
        </motion.div>
      </AnimatePresence>
    </section>
  );
}

function SectionTitle({ icon: Icon, eyebrow, title }: { icon: typeof BookOpen; eyebrow: string; title: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="grid h-10 w-10 place-items-center rounded-[8px] bg-cyan/10 text-cyan">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-cyan">{eyebrow}</p>
        <h2 className="text-xl font-bold text-white">{title}</h2>
      </div>
    </div>
  );
}

function Legend() {
  const items = [
    ["Blue", "economic impact", "bg-cyan"],
    ["Gold", "political impact", "bg-amber"],
    ["Green", "technology impact", "bg-mint"],
    ["Pink", "social impact", "bg-rose"]
  ];
  return (
    <div className="mt-4 flex flex-wrap gap-2">
      {items.map(([label, text, color]) => (
        <span key={label} className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.035] px-3 py-1 text-xs text-slate-300">
          <span className={`h-2 w-2 rounded-full ${color}`} />
          {label} = {text}
        </span>
      ))}
    </div>
  );
}

function MiniFlow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[8px] border border-white/10 bg-black/20 p-3">
      <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-slate-500">{label}</div>
      <p className="mt-1 text-xs leading-5 text-slate-300">{value}</p>
    </div>
  );
}

function CausalChain({ items }: { items: string[] }) {
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const visible = step === items.length - 1 ? items.length : step + 1;

  useEffect(() => {
    setStep(0);
    setPlaying(false);
  }, [items]);

  useEffect(() => {
    if (!playing) { if (timerRef.current) clearInterval(timerRef.current); return; }
    timerRef.current = setInterval(() => {
      setStep((s) => {
        if (s >= items.length - 1) { setPlaying(false); return s; }
        return s + 1;
      });
    }, 700);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [playing, items.length]);

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <button
          onClick={() => { if (step >= items.length - 1) { setStep(0); setTimeout(() => setPlaying(true), 40); } else setPlaying(!playing); }}
          className="inline-flex items-center gap-1.5 rounded-[8px] border border-white/10 bg-white/[0.04] px-2.5 py-1.5 text-xs font-semibold text-white hover:border-amber/40"
        >
          {playing ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
          {step >= items.length - 1 ? "Replay" : playing ? "Pause" : "Play chain"}
        </button>
        <span className="font-mono text-[10px] text-slate-500">{Math.min(visible, items.length)} / {items.length}</span>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {items.map((item, index) => (
          <span key={`${item}-${index}`} className="inline-flex items-center gap-2">
            <motion.button
              layout
              onClick={() => { setStep(index); setPlaying(false); }}
              animate={{ opacity: index <= step ? 1 : 0.2 }}
              transition={{ duration: 0.35 }}
              className={`rounded-[8px] border px-3 py-2 text-xs transition ${
                index === step
                  ? "border-amber/50 bg-amber/10 text-amber shadow-[0_0_12px_rgba(245,196,81,.18)]"
                  : index < step
                    ? "border-white/15 bg-white/[0.05] text-slate-200"
                    : "border-white/[0.06] bg-white/[0.02] text-slate-500"
              }`}
            >
              {item}
            </motion.button>
            {index < items.length - 1 && (
              <motion.span animate={{ opacity: index < step ? 1 : 0.2 }} transition={{ duration: 0.35 }}>
                <ChevronRight className={`h-4 w-4 ${index < step ? "text-amber" : "text-slate-600"}`} />
              </motion.span>
            )}
          </span>
        ))}
      </div>
    </div>
  );
}

function PeopleBlock({ title, items, tone }: { title: string; items: string[]; tone: "mint" | "rose" }) {
  return (
    <div className={`rounded-[8px] border p-4 ${tone === "mint" ? "border-mint/20 bg-mint/10" : "border-rose/20 bg-rose/10"}`}>
      <div className="mb-2 text-sm font-semibold text-white">{title}</div>
      <ul className="space-y-1 text-xs leading-5 text-slate-300">
        {items.map((item) => <li key={item}>{item}</li>)}
      </ul>
    </div>
  );
}

function MetricBar({ metric }: { metric: Metric }) {
  const color = {
    blue: "bg-cyan",
    gold: "bg-amber",
    green: "bg-mint",
    pink: "bg-rose"
  }[metric.color];
  return (
    <div title={metric.tooltip} className="rounded-[8px] border border-white/10 bg-white/[0.035] p-3">
      <div className="mb-2 flex justify-between gap-3 text-sm">
        <span className="text-slate-200">{metric.label}</span>
        <span className="font-mono text-white">{metric.value}</span>
      </div>
      <div className="h-2 rounded-full bg-white/10">
        <div className={`h-2 rounded-full ${color}`} style={{ width: `${metric.value}%` }} />
      </div>
      <p className="mt-2 text-xs leading-5 text-slate-500">{metric.tooltip}</p>
    </div>
  );
}

function Mini({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-[8px] border border-white/10 bg-white/[0.035] p-3">
      <div className="text-sm font-semibold text-white">{title}</div>
      <p className="mt-2 text-xs leading-5 text-slate-400">{body}</p>
    </div>
  );
}

function Sources({ items }: { items: string[] }) {
  return (
    <details className="mt-5 rounded-[8px] border border-white/10 bg-white/[0.025] p-3">
      <summary className="cursor-pointer list-none text-sm font-semibold text-white">
        <span className="inline-flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-amber" />
          Sources and theory
        </span>
      </summary>
      <div className="mt-3 flex flex-wrap gap-2">
        {items.map((item) => (
          <span key={item} className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs text-slate-300">{item}</span>
        ))}
      </div>
    </details>
  );
}

function labelFor(id: string) {
  return timelineEvents.find((event) => event.id === id)?.title ?? id;
}
