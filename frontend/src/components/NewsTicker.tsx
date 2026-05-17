import { Radio } from "lucide-react";

const items = [
  "Bond desks price 35 bps of easing over the next two quarters",
  "Fictional Republic industrial output surprises to the upside",
  "Analysts warn tariff pass-through is showing up in household staples",
  "Equity futures rise as confidence index rebounds",
  "Treasury office prepares long-duration debt auction"
];

export function NewsTicker() {
  return (
    <div className="border-y border-white/10 bg-white/[0.035] py-2">
      <div className="mx-auto flex max-w-7xl items-center gap-4 overflow-hidden px-4">
        <div className="flex shrink-0 items-center gap-2 font-mono text-[11px] uppercase tracking-[0.24em] text-cyan">
          <Radio className="h-3.5 w-3.5" />
          Live Macro Wire
        </div>
        <div className="no-scrollbar flex overflow-hidden">
          <div className="ticker-track flex min-w-max gap-8 text-xs text-slate-300">
            {[...items, ...items].map((item, index) => (
              <span key={`${item}-${index}`}>{item}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
