import { Download, Save, SplitSquareHorizontal, Trash2 } from "lucide-react";
import type { EconomicVariables, SavedScenario } from "../types/economy";

type ScenarioToolsProps = {
  variables: EconomicVariables;
  saved: SavedScenario[];
  onSave: () => void;
  onLoad: (scenario: SavedScenario) => void;
  onDelete: (id: string) => void;
  onExportPng: () => void;
  compareMode: boolean;
  onToggleCompare: () => void;
};

export function ScenarioTools({
  saved,
  onSave,
  onLoad,
  onDelete,
  onExportPng,
  compareMode,
  onToggleCompare
}: ScenarioToolsProps) {
  return (
    <section className="glass rounded-[8px] p-4">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-slate-500">Scenario Operations</p>
          <h2 className="text-base font-semibold text-white">Save, export, compare</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={onSave} className="inline-flex items-center gap-2 rounded-[8px] bg-white px-3 py-2 text-xs font-semibold text-slate-950 hover:bg-cyan">
            <Save className="h-4 w-4" />
            Save
          </button>
          <button onClick={onExportPng} className="inline-flex items-center gap-2 rounded-[8px] border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-semibold text-white hover:border-white/25">
            <Download className="h-4 w-4" />
            PNG
          </button>
          <button
            onClick={onToggleCompare}
            className={`inline-flex items-center gap-2 rounded-[8px] border px-3 py-2 text-xs font-semibold ${
              compareMode ? "border-mint/40 bg-mint/10 text-mint" : "border-white/10 bg-white/[0.04] text-white hover:border-white/25"
            }`}
          >
            <SplitSquareHorizontal className="h-4 w-4" />
            Compare
          </button>
        </div>
      </div>

      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {saved.length === 0 && (
          <div className="rounded-[8px] border border-dashed border-white/10 p-4 text-sm text-slate-500">
            Saved scenarios appear here for quick recall.
          </div>
        )}
        {saved.map((scenario) => (
          <div key={scenario.id} className="flex items-center justify-between gap-3 rounded-[8px] border border-white/10 bg-white/[0.035] p-3">
            <button onClick={() => onLoad(scenario)} className="min-w-0 text-left">
              <div className="truncate text-sm font-semibold text-white">{scenario.name}</div>
              <div className="mt-1 font-mono text-[10px] text-slate-500">{new Date(scenario.createdAt).toLocaleString()}</div>
            </button>
            <button onClick={() => onDelete(scenario.id)} aria-label={`Delete ${scenario.name}`} className="grid h-8 w-8 shrink-0 place-items-center rounded-[8px] text-slate-500 hover:bg-rose/10 hover:text-rose">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
