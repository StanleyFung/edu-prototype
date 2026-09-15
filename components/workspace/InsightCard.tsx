import { KIND_COLORS } from "@/lib/data";
import type { Insight, RunPhase } from "@/lib/types";

interface InsightCardProps {
  insight: Insight;
  phase: RunPhase;
  statusText: string;
  onStart: () => void;
  onView: () => void;
  onDismiss: () => void;
  onHoverStart: () => void;
  onHoverEnd: () => void;
}

function KindIcon({ kind, color }: { kind: Insight["kind"]; color: string }) {
  switch (kind) {
    case "project":
      return (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke={color} strokeWidth="1.2">
          <rect x="1.2" y="3" width="11.6" height="9" rx="1.5" />
          <rect x="4.2" y="1.6" width="5.6" height="2.4" rx="1" />
        </svg>
      );
    case "task":
      return (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke={color} strokeWidth="1.2">
          <circle cx="7" cy="7" r="5.6" />
          <path d="M7 4.2V7l2 1.6" />
        </svg>
      );
    case "skill":
      return (
        <svg
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none"
          stroke={color}
          strokeWidth="1.2"
          strokeLinecap="round"
        >
          <circle cx="4.1" cy="4.1" r="2.5" />
          <path d="M5.9 5.9l5.4 5.4M2.4 2.4l1.7 1.7" />
        </svg>
      );
    case "prompt":
      return (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke={color} strokeWidth="1.2">
          <rect x="2.2" y="1.6" width="9.6" height="10.8" rx="1.4" />
          <path d="M4.6 5h4.8M4.6 7.4h4.8M4.6 9.8h2.8" />
        </svg>
      );
  }
}

export default function InsightCard({
  insight,
  phase,
  statusText,
  onStart,
  onView,
  onDismiss,
  onHoverStart,
  onHoverEnd,
}: InsightCardProps) {
  const kindColors = KIND_COLORS[insight.kind];
  const showPrimary = phase === "idle";
  const showDismiss = phase !== "running";
  const isRunning = phase === "running";
  const isDone = phase === "done";

  return (
    <div className="group relative flex gap-3 px-4 py-3.5 border-b border-line-soft hover:bg-[oklch(0.235_0.006_60)]">
      <div
        className="flex-shrink-0 w-[26px] h-[26px] mt-0.5 rounded-[7px] flex items-center justify-center text-[10px] font-semibold"
        style={{ background: kindColors.bg, color: kindColors.fg }}
      >
        <KindIcon kind={insight.kind} color={kindColors.fg} />
      </div>
      <div className="flex-1 min-w-0 flex flex-col gap-1.5">
        <div className="flex items-baseline gap-2">
          <div className="text-[13.5px] leading-[1.35] text-ink font-medium text-pretty">
            {insight.title}
          </div>
        </div>
        <div className="text-[12.5px] leading-[1.5] text-muted text-pretty">{insight.detail}</div>
        <div className="flex items-center gap-2.5 mt-1">
          {showPrimary && (
            <button
              onClick={onStart}
              className="border-none rounded-md px-[11px] py-[5px] text-xs font-medium cursor-pointer bg-accent text-accent-ink hover:bg-[oklch(0.8_0.11_175)]"
            >
              {insight.action}
            </button>
          )}
          {isDone && (
            <button
              onClick={onView}
              onMouseEnter={onHoverStart}
              onMouseLeave={onHoverEnd}
              onFocus={onHoverStart}
              onBlur={onHoverEnd}
              className="border-none rounded-md px-[13px] py-[5px] text-xs font-medium cursor-pointer bg-focus text-[oklch(0.98_0.02_250)] hover:bg-[oklch(0.7_0.15_250)]"
              style={{ animation: "tern-fade-in 320ms ease both" }}
            >
              View
            </button>
          )}
          {showDismiss && (
            <button
              onClick={onDismiss}
              className="border-none bg-transparent px-1 py-[5px] text-[13px] cursor-pointer text-[oklch(0.82_0.004_60)] hover:text-[oklch(0.97_0.004_60)]"
              style={{ animation: isDone ? "tern-fade-in 320ms ease both" : "none" }}
            >
              Dismiss
            </button>
          )}
        </div>
        <div
          className="overflow-hidden transition-[max-height,opacity] duration-[320ms,240ms] ease-[cubic-bezier(0.22,0.61,0.24,1),ease]"
          style={{
            maxHeight: phase === "idle" ? "0px" : "60px",
            opacity: phase === "idle" ? 0 : 1,
          }}
        >
          <div className="flex items-center gap-[9px] mt-2 px-[11px] py-[9px] rounded-lg bg-[oklch(0.26_0.02_250)] border border-[oklch(0.34_0.04_250)]">
            {isRunning && (
              <span
                className="w-3 h-3 rounded-full flex-shrink-0 border-[1.6px] border-[oklch(0.45_0.05_250)]"
                style={{
                  borderTopColor: "oklch(0.85 0.12 250)",
                  animation: "tern-spin 0.75s linear infinite",
                }}
              />
            )}
            {isDone && (
              <span className="w-3 h-3 rounded-full flex-shrink-0 bg-accent text-accent-ink text-[9px] flex items-center justify-center">
                ✓
              </span>
            )}
            <span className="text-xs text-[oklch(0.88_0.02_250)]">{statusText}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
