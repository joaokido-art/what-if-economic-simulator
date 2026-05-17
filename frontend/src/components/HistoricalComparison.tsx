import { buildHistoricalEvents } from "../lib/simulation";
import type { HistoricalEvent } from "../types/economy";

const events = buildHistoricalEvents();

export function HistoricalComparison({
  selected,
  onSelect
}: {
  selected: HistoricalEvent;
  onSelect: (event: HistoricalEvent) => void;
}) {
  return (
    <section className="glass rounded-[8px] p-4">
      <div className="mb-4">
        <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-slate-500">Historical Comparison</p>
        <h2 className="text-base font-semibold text-white">Overlay current policy against known shocks</h2>
      </div>
      <div className="grid gap-3 md:grid-cols-4">
        {events.map((event) => (
          <button
            key={event.name}
            onClick={() => onSelect(event)}
            className={`rounded-[8px] border p-3 text-left transition ${
              selected.name === event.name ? "border-amber/60 bg-amber/10" : "border-white/10 bg-white/[0.035] hover:border-white/25"
            }`}
          >
            <div className="font-semibold text-white">{event.name}</div>
            <div className="mt-1 font-mono text-[11px] text-slate-500">{event.years}</div>
            <p className="mt-2 text-xs leading-5 text-slate-400">{event.summary}</p>
          </button>
        ))}
      </div>
    </section>
  );
}

export { events as historicalEvents };
