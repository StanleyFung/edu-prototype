import InsightCard from "./InsightCard";
import { ACADEMY_URL } from "@/lib/data";
import type { FilterDef, Insight, InsightFilter, RunState } from "@/lib/types";

interface InsightsPanelProps {
  open: boolean;
  openCount: number;
  blurb: string;
  filters: FilterDef[];
  activeFilter: InsightFilter;
  visibleInsights: Insight[];
  runs: Record<string, RunState>;
  stepStatusText: (insight: Insight) => string;
  onClose: () => void;
  onPickFilter: (id: InsightFilter) => void;
  onStart: (insight: Insight) => void;
  onView: (insight: Insight) => void;
  onDismiss: (insight: Insight) => void;
  onHoverStart: (insight: Insight) => void;
  onHoverEnd: () => void;
  onDismissAll: () => void;
}

export default function InsightsPanel({
  open,
  openCount,
  blurb,
  filters,
  activeFilter,
  visibleInsights,
  runs,
  stepStatusText,
  onClose,
  onPickFilter,
  onStart,
  onView,
  onDismiss,
  onHoverStart,
  onHoverEnd,
  onDismissAll,
}: InsightsPanelProps) {
  return (
    <div
      className="fixed top-0 right-0 bottom-0 w-[404px] max-w-[90vw] z-40 bg-panel border-l border-[oklch(0.32_0.006_60)] shadow-[-24px_0_60px_oklch(0.1_0_0_/_0.45)] flex flex-col transition-transform duration-[320ms] ease-[cubic-bezier(0.22,0.61,0.24,1)]"
      style={{ transform: open ? "translateX(0)" : "translateX(104%)" }}
    >
      <div className="p-5 border-b border-[oklch(0.28_0.006_60)] flex flex-col gap-3">
        <div className="flex items-center gap-2.5">
          <div className="font-serif text-[19px] text-ink-bright">Workflow Insights</div>
          <div className="text-[11.5px] text-[oklch(0.55_0.006_60)] font-mono">{openCount} open</div>
          <button
            onClick={onClose}
            className="ml-auto border-none bg-transparent cursor-pointer text-[oklch(0.62_0.006_60)] text-[17px] leading-none font-sans px-1 py-0.5 hover:text-ink"
          >
            ×
          </button>
        </div>
        <p className="m-0 text-[13px] leading-[1.5] text-muted-strong text-pretty">
          {blurb} Learn more at{" "}
          <a href={ACADEMY_URL} target="_blank" rel="noopener" className="text-inherit">
            Claude Academy
          </a>
          .
        </p>
        <div className="flex gap-1.5">
          {filters.map((f) => {
            const on = f.id === activeFilter;
            return (
              <button
                key={f.id}
                onClick={() => onPickFilter(f.id)}
                className="rounded-full px-[11px] py-1 text-xs font-sans cursor-pointer"
                style={{
                  border: `1px solid ${on ? "oklch(0.45 0.05 175)" : "oklch(0.3 0.006 60)"}`,
                  background: on ? "oklch(0.3 0.03 175)" : "transparent",
                  color: on ? "oklch(0.9 0.05 175)" : "oklch(0.68 0.006 60)",
                }}
              >
                {f.label}
              </button>
            );
          })}
        </div>
      </div>

      <div
        className="flex-1 min-h-0 overflow-y-auto overscroll-contain [scrollbar-width:thin] [scrollbar-color:oklch(0.36_0.006_60)_transparent]"
      >
        {visibleInsights.map((insight) => {
          const run = runs[insight.id];
          const phase = run ? run.phase : "idle";
          return (
            <InsightCard
              key={insight.id}
              insight={insight}
              phase={phase}
              statusText={run ? stepStatusText(insight) : ""}
              onStart={() => onStart(insight)}
              onView={() => onView(insight)}
              onDismiss={() => onDismiss(insight)}
              onHoverStart={() => onHoverStart(insight)}
              onHoverEnd={onHoverEnd}
            />
          );
        })}
        {visibleInsights.length === 0 && (
          <div className="px-7 py-14 text-center flex flex-col gap-2 items-center">
            <span className="w-2.5 h-2.5 rounded-[3px] bg-[oklch(0.4_0.006_60)]" />
            <div className="text-[13.5px] text-[oklch(0.8_0.004_60)]">Nothing here</div>
            <div className="text-[12.5px] text-[oklch(0.58_0.006_60)] max-w-[240px] leading-[1.5]">
              New insights appear as Claude notices repeated patterns in your chats.
            </div>
          </div>
        )}
      </div>

      <div className="border-t border-[oklch(0.28_0.006_60)] px-4 py-[11px] flex items-center gap-2.5">
        <button
          onClick={onDismissAll}
          className="border-none bg-transparent cursor-pointer text-[12.5px] text-[oklch(0.6_0.006_60)] font-sans p-0 hover:text-ink"
        >
          Dismiss all
        </button>
        <div className="ml-auto text-[11.5px] text-[oklch(0.5_0.006_60)]">Updated 4m ago</div>
      </div>
    </div>
  );
}
