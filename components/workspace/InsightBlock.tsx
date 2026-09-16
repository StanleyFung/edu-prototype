import { KIND_DOCS, KIND_INLINE_FG, KIND_LABELS } from "@/lib/data";
import type { Insight, RunPhase } from "@/lib/types";

interface InsightBlockProps {
  insight: Insight;
  phase: RunPhase;
  statusText: string;
  waiting: boolean;
  secondaryLabel: string;
  onStart: () => void;
  onView: () => void;
  onDismiss: () => void;
}

function BulbIcon({ color }: { color: string }) {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 15 15"
      fill="none"
      stroke={color}
      strokeWidth="1.2"
      strokeLinecap="round"
      className="flex-shrink-0"
    >
      <path d="M7.5 1.6a4 4 0 0 0-2.3 7.3v1.4h4.6V8.9a4 4 0 0 0-2.3-7.3z" />
      <path d="M6.1 12.1h2.8M6.5 13.6h2" />
    </svg>
  );
}

/** The inline/intercept surface for a workflow insight — the same insight
 * as InsightCard, rendered as its own block in the thread instead of a
 * panel row. */
export default function InsightBlock({
  insight,
  phase,
  statusText,
  waiting,
  secondaryLabel,
  onStart,
  onView,
  onDismiss,
}: InsightBlockProps) {
  const fg = KIND_INLINE_FG[insight.kind];
  const isIdle = phase === "idle";
  const isDone = phase === "done";
  const isRunning = phase === "running";
  const showStrip = !isIdle || waiting;

  return (
    <div
      className="flex flex-col gap-[9px] border border-[oklch(0.3_0.006_60)] bg-[oklch(0.207_0.005_60)] rounded-xl px-[17px] pt-[15px] pb-3.5"
      style={{ animation: "tern-rise 420ms cubic-bezier(0.22, 0.61, 0.24, 1) both" }}
    >
      <div className="flex items-center gap-2">
        <BulbIcon color={fg} />
        <span className="text-[13px] font-medium" style={{ color: fg }}>
          Workflow Insights
        </span>
        <span className="font-mono text-[11px] tracking-[0.06em] uppercase text-[oklch(0.58_0.006_60)]">
          {KIND_LABELS[insight.kind]}
        </span>
        {insight.meta && (
          <span className="ml-auto font-mono text-[11px] text-[oklch(0.55_0.006_60)]">{insight.meta}</span>
        )}
        <button
          onClick={onDismiss}
          title="Dismiss"
          className={`border-none bg-transparent px-0.5 cursor-pointer font-sans text-[15px] leading-none text-[oklch(0.52_0.006_60)] hover:text-[oklch(0.92_0.004_60)] ${insight.meta ? "" : "ml-auto"}`}
        >
          ×
        </button>
      </div>
      <div className="text-[14.5px] leading-[1.4] font-medium text-[oklch(0.94_0.004_60)] text-pretty">
        {insight.title}
      </div>
      <div className="text-[13.5px] leading-[1.6] text-[oklch(0.76_0.005_60)] text-pretty max-w-[60ch]">
        {insight.detail}
      </div>
      <div className="flex items-center gap-2.5 mt-[3px]">
        {isIdle && (
          <button
            onClick={onStart}
            className="border-none rounded-[7px] px-[13px] py-[6px] text-[12.5px] font-medium cursor-pointer bg-accent text-accent-ink hover:bg-[oklch(0.82_0.11_175)]"
          >
            {insight.action}
          </button>
        )}
        {isDone && (
          <button
            onClick={onView}
            className="border-none rounded-[7px] px-[15px] py-[6px] text-[12.5px] font-medium cursor-pointer bg-focus text-[oklch(0.98_0.02_250)] hover:bg-[oklch(0.7_0.15_250)]"
          >
            View
          </button>
        )}
        {!isRunning && (
          <button
            onClick={onDismiss}
            className="border-none bg-transparent px-0.5 py-[6px] cursor-pointer font-sans text-[12.5px] text-[oklch(0.68_0.006_60)] hover:text-[oklch(0.95_0.004_60)]"
          >
            {secondaryLabel}
          </button>
        )}
        <a
          href={KIND_DOCS[insight.kind]}
          target="_blank"
          rel="noopener"
          className="ml-auto text-xs no-underline text-[oklch(0.62_0.006_60)] hover:text-[oklch(0.85_0.05_175)]"
        >
          Learn more
        </a>
      </div>
      <div
        className="overflow-hidden transition-[max-height,opacity] duration-[320ms,240ms] ease-[cubic-bezier(0.22,0.61,0.24,1),ease]"
        style={{
          maxHeight: showStrip ? "60px" : "0px",
          opacity: showStrip ? 1 : 0,
        }}
      >
        <div
          className="flex items-center gap-[9px] mt-1.5 px-[11px] py-[9px] rounded-lg"
          style={{
            background: waiting ? "oklch(0.26 0.03 75)" : "oklch(0.26 0.02 250)",
            border: `1px solid ${waiting ? "oklch(0.36 0.05 75)" : "oklch(0.34 0.04 250)"}`,
          }}
        >
          {waiting && (
            <span
              className="w-2 h-2 rounded-full flex-shrink-0"
              style={{ background: "oklch(0.78 0.12 75)", animation: "tern-pulse 1.5s ease-in-out infinite" }}
            />
          )}
          {isRunning && (
            <span
              className="w-3 h-3 rounded-full flex-shrink-0 border-[1.6px] border-[oklch(0.45_0.05_250)]"
              style={{ borderTopColor: "oklch(0.85 0.12 250)", animation: "tern-spin 0.75s linear infinite" }}
            />
          )}
          {isDone && (
            <span className="w-3 h-3 rounded-full flex-shrink-0 bg-accent text-accent-ink text-[9px] flex items-center justify-center">
              ✓
            </span>
          )}
          <span
            className="text-xs"
            style={{ color: waiting ? "oklch(0.9 0.04 75)" : "oklch(0.88 0.02 250)" }}
          >
            {statusText}
          </span>
        </div>
      </div>
    </div>
  );
}
