import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BarChart3, ChevronRight, Gauge, Layers3, Pause, Play, RotateCcw } from "lucide-react";
import { AnalystPanel } from "./components/AnalystPanel";
import { ChartCard } from "./components/ChartCard";
import { ControlPanel } from "./components/ControlPanel";
import { EconomicHistory } from "./components/EconomicHistory";
import { HistoryMode } from "./components/HistoryMode";
import { historicalEvents, HistoricalComparison } from "./components/HistoricalComparison";
import { IntelligencePanels } from "./components/IntelligencePanels";
import { LandingPage } from "./components/LandingPage";
import { MetricStrip } from "./components/MetricStrip";
import { NewsTicker } from "./components/NewsTicker";
import { PresetRail } from "./components/PresetRail";
import { ScenarioTools } from "./components/ScenarioTools";
import { defaultVariables, presets } from "./data/economicVariables";
import { computeIndicators, generateAnalysis, generateSimulation } from "./lib/simulation";
import type { EconomicVariables, Preset, SavedScenario, VariableKey } from "./types/economy";

const storageKey = "what-if-scenarios";

function App() {
  const [mode, setMode] = useState<"landing" | "sandbox" | "history" | "economics">("landing");
  const [variables, setVariables] = useState<EconomicVariables>(defaultVariables);
  const [activePreset, setActivePreset] = useState("Custom");
  const [selectedHistory, setSelectedHistory] = useState(historicalEvents[0]);
  const [saved, setSaved] = useState<SavedScenario[]>([]);
  const [compareMode, setCompareMode] = useState(false);
  const [policyB, setPolicyB] = useState<EconomicVariables>(presets.find((p) => p.name === "High Growth Boom")?.variables ?? defaultVariables);
  const [isPlaying, setIsPlaying] = useState(false);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const stored = localStorage.getItem(storageKey);
    if (stored) setSaved(JSON.parse(stored));
  }, []);

  useEffect(() => {
    if (!isPlaying) return;
    const timer = window.setInterval(() => {
      setTick((value) => value + 1);
      setVariables((current) => ({
        ...current,
        interestRate: Number(Math.max(0, current.interestRate + Math.sin(tick / 2) * 0.12).toFixed(2)),
        consumerConfidence: Math.min(100, Math.max(0, current.consumerConfidence + Math.cos(tick / 2.5) * 0.8)),
        inflation: Number(Math.max(-2, current.inflation + Math.sin(tick / 3) * 0.08).toFixed(1))
      }));
    }, 1200);
    return () => window.clearInterval(timer);
  }, [isPlaying, tick]);

  const simulation = useMemo(() => generateSimulation(variables), [variables]);
  const indicators = useMemo(() => computeIndicators(variables), [variables]);
  const analysis = useMemo(() => generateAnalysis(variables), [variables]);
  const comparison = useMemo(() => generateSimulation(policyB), [policyB]);

  const updateVariable = (key: VariableKey, value: number) => {
    setVariables((current) => ({ ...current, [key]: value }));
    setActivePreset("Custom");
  };

  const applyPreset = (preset: Preset) => {
    setVariables(preset.variables);
    setActivePreset(preset.name);
  };

  const saveScenario = () => {
    const scenario: SavedScenario = {
      id: crypto.randomUUID(),
      name: `${activePreset === "Custom" ? "Custom" : activePreset} scenario ${saved.length + 1}`,
      createdAt: new Date().toISOString(),
      variables
    };
    const next = [scenario, ...saved].slice(0, 6);
    setSaved(next);
    localStorage.setItem(storageKey, JSON.stringify(next));
  };

  const deleteScenario = (id: string) => {
    const next = saved.filter((scenario) => scenario.id !== id);
    setSaved(next);
    localStorage.setItem(storageKey, JSON.stringify(next));
  };

  const exportPng = async () => {
    const svg = document.querySelector(".recharts-surface");
    if (!(svg instanceof SVGElement)) return;
    const xml = new XMLSerializer().serializeToString(svg);
    const image = new Image();
    const blob = new Blob([xml], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    image.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 1200;
      canvas.height = 700;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.fillStyle = "#05070d";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(image, 30, 30, 1140, 640);
      const anchor = document.createElement("a");
      anchor.download = "what-if-economic-simulation.png";
      anchor.href = canvas.toDataURL("image/png");
      anchor.click();
      URL.revokeObjectURL(url);
    };
    image.src = url;
  };

  const preview = useMemo(() => generateSimulation(presets[5].variables), []);

  return (
    <div className="min-h-screen bg-ink text-slate-100">
      <AnimatePresence mode="wait">
        {mode === "landing" ? (
          <motion.div key="landing" exit={{ opacity: 0, y: -12 }}>
            <Nav onLanding={() => setMode("landing")} onSandbox={() => setMode("sandbox")} onHistory={() => setMode("history")} onEconomics={() => setMode("economics")} mode={mode} />
            <LandingPage previewData={preview} onEnter={() => setMode("sandbox")} />
            <Footer />
          </motion.div>
        ) : mode === "history" ? (
          <motion.div key="history" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <HistoryMode onExit={() => setMode("sandbox")} />
            <Footer />
          </motion.div>
        ) : mode === "economics" ? (
          <motion.div key="economics" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <Nav onLanding={() => setMode("landing")} onSandbox={() => setMode("sandbox")} onHistory={() => setMode("history")} onEconomics={() => setMode("economics")} mode={mode} />
            <EconomicHistory variables={variables} onSandbox={() => setMode("sandbox")} />
            <Footer />
          </motion.div>
        ) : (
          <motion.div key="dashboard" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-radial-grid thin-grid">
            <Nav onLanding={() => setMode("landing")} onSandbox={() => setMode("sandbox")} onHistory={() => setMode("history")} onEconomics={() => setMode("economics")} mode={mode} />
            <NewsTicker />
            <div className="mx-auto grid max-w-[1560px] gap-5 px-4 py-5 xl:grid-cols-[320px_1fr]">
              <aside className="space-y-5 xl:sticky xl:top-20 xl:h-[calc(100vh-6rem)] xl:overflow-auto xl:pr-1">
                <ControlPanel variables={variables} onChange={updateVariable} />
              </aside>

              <main className="space-y-5">
                <section className="glass rounded-[8px] p-5">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                      <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-cyan">Macroeconomic Simulator</p>
                      <h1 className="mt-2 text-3xl font-bold text-white">Fictional Republic policy cockpit</h1>
                      <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">
                        Adjust policy levers, compare shocks, and convert simulated outcomes into a concise analyst brief.
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <button onClick={() => setIsPlaying((value) => !value)} className="inline-flex items-center gap-2 rounded-[8px] border border-white/10 bg-white/[0.04] px-3 py-2 text-sm font-semibold text-white hover:border-white/25">
                        {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                        Playback
                      </button>
                      <button onClick={() => applyPreset({ ...presets[0], variables: defaultVariables, name: "Custom" })} className="inline-flex items-center gap-2 rounded-[8px] border border-white/10 bg-white/[0.04] px-3 py-2 text-sm font-semibold text-white hover:border-white/25">
                        <RotateCcw className="h-4 w-4" />
                        Reset
                      </button>
                    </div>
                  </div>
                </section>

                <MetricStrip indicators={indicators} riskScore={analysis.riskScore} />
                <PresetRail active={activePreset} onSelect={applyPreset} />

                <div className="grid gap-5 2xl:grid-cols-[1.1fr_0.9fr]">
                  <ChartCard title="GDP over time" eyebrow="Output index" data={simulation} dataKey="gdp" color="#38d5ff" overlay={selectedHistory.overlay} />
                  <ChartCard title="Inflation curve" eyebrow="Price pressure" data={simulation} dataKey="inflation" color="#f5c451" overlay={selectedHistory.overlay} />
                  <ChartCard title="Employment trends" eyebrow="Labor market" data={simulation} dataKey="employment" color="#6ee7b7" overlay={selectedHistory.overlay} />
                  <ChartCard title="Debt and cost pressure" eyebrow="Fiscal load" data={simulation} dataKey="debt" secondaryKey="costOfLiving" color="#fb7185" />
                  <ChartCard title="Purchasing power index" eyebrow="Households" data={simulation} dataKey="purchasingPower" color="#a7f3d0" overlay={selectedHistory.overlay} />
                  <ChartCard title="Currency strength" eyebrow="External stability" data={simulation} dataKey="currency" color="#93c5fd" overlay={selectedHistory.overlay} />
                </div>

                <AnalystPanel variables={variables} />
                <IntelligencePanels variables={variables} onChange={updateVariable} />
                <HistoricalComparison selected={selectedHistory} onSelect={setSelectedHistory} />

                <ScenarioTools
                  variables={variables}
                  saved={saved}
                  onSave={saveScenario}
                  onLoad={(scenario) => {
                    setVariables(scenario.variables);
                    setActivePreset(scenario.name);
                  }}
                  onDelete={deleteScenario}
                  onExportPng={exportPng}
                  compareMode={compareMode}
                  onToggleCompare={() => setCompareMode((value) => !value)}
                />

                {compareMode && (
                  <section className="grid gap-5 lg:grid-cols-2">
                    <div className="glass rounded-[8px] p-4">
                      <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-white">
                        <Layers3 className="h-4 w-4 text-cyan" />
                        Current policy
                      </div>
                      <ChartCard title="Policy A: GDP and confidence" eyebrow="Side-by-side" data={simulation} dataKey="gdp" secondaryKey="marketConfidence" color="#38d5ff" compact />
                    </div>
                    <div className="glass rounded-[8px] p-4">
                      <div className="mb-4 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2 text-sm font-semibold text-white">
                          <Gauge className="h-4 w-4 text-mint" />
                          Policy B
                        </div>
                        <select
                          value={JSON.stringify(policyB)}
                          onChange={(event) => setPolicyB(JSON.parse(event.target.value) as EconomicVariables)}
                          className="rounded-[8px] border border-white/10 bg-slate-950 px-3 py-2 text-xs text-white"
                        >
                          {presets.map((preset) => (
                            <option key={preset.name} value={JSON.stringify(preset.variables)}>
                              {preset.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <ChartCard title="Policy B: GDP and confidence" eyebrow="Alternative" data={comparison} dataKey="gdp" secondaryKey="marketConfidence" color="#6ee7b7" compact />
                    </div>
                  </section>
                )}
              </main>
            </div>
            <Footer />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Nav({
  onLanding,
  onSandbox,
  onHistory,
  onEconomics,
  mode
}: {
  onLanding: () => void;
  onSandbox: () => void;
  onHistory: () => void;
  onEconomics: () => void;
  mode: "landing" | "sandbox" | "history" | "economics";
}) {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-ink/78 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <button onClick={onLanding} className="flex items-center gap-3">
          <div className="grid h-9 w-9 place-items-center rounded-[8px] bg-cyan/10 text-cyan">
            <BarChart3 className="h-5 w-5" />
          </div>
          <div className="text-left">
            <div className="font-semibold text-white">What If?</div>
            <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-slate-500">Economic Simulator</div>
          </div>
        </button>
        <nav className="flex flex-wrap items-center justify-end gap-2">
          <button
            onClick={onSandbox}
            className={`rounded-[8px] border px-3 py-2 text-sm font-semibold ${mode === "sandbox" ? "border-cyan/40 bg-cyan/10 text-cyan" : "border-white/10 bg-white/[0.04] text-white hover:border-cyan/40"}`}
          >
            Sandbox
          </button>
          <button
            onClick={onHistory}
            className={`rounded-[8px] border px-3 py-2 text-sm font-semibold ${mode === "history" ? "border-amber/40 bg-amber/10 text-amber" : "border-white/10 bg-white/[0.04] text-white hover:border-amber/40"}`}
          >
            History Mode
          </button>
          <button
            onClick={onEconomics}
            className={`rounded-[8px] border px-3 py-2 text-sm font-semibold ${mode === "economics" ? "border-mint/40 bg-mint/10 text-mint" : "border-white/10 bg-white/[0.04] text-white hover:border-mint/40"}`}
          >
            History of Economics
          </button>
          <button onClick={onLanding} className="inline-flex items-center gap-2 rounded-[8px] border border-white/10 bg-white/[0.04] px-3 py-2 text-sm font-semibold text-white hover:border-cyan/40">
            Landing
            <ChevronRight className="h-4 w-4" />
          </button>
        </nav>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black/30 px-4 py-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
        <p>What If? Economic Simulator. Fictional data, educational model.</p>
        <p className="font-mono text-[11px] uppercase tracking-[0.24em]">Built for policy analysis, teaching, and scenario design.</p>
      </div>
    </footer>
  );
}

export default App;
