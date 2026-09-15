import type { Task } from "@/lib/types";

interface ScheduledViewProps {
  tasks: Task[];
  taskOff: number[];
  blurred: boolean;
  onToggleTask: (index: number) => void;
}

export default function ScheduledView({ tasks, taskOff, blurred, onToggleTask }: ScheduledViewProps) {
  return (
    <div className="flex-1 overflow-auto px-8 py-9">
      <div
        className="max-w-[820px] mx-auto transition-[filter] duration-[260ms] ease-in-out"
        style={{ filter: blurred ? "blur(6px)" : "none" }}
      >
        <h1 className="font-serif font-normal text-[30px] m-0 mb-1.5 text-ink-bright">Scheduled</h1>
        <p className="m-0 mb-[26px] text-[13.5px] text-[oklch(0.62_0.006_60)]">
          Tasks that run on their own and report back in chat.
        </p>
        <div className="border border-[oklch(0.27_0.005_60)] rounded-xl overflow-hidden">
          {tasks.map((t, idx) => {
            const off = taskOff.includes(idx);
            return (
              <div
                key={`${t.name}-${idx}`}
                className="flex items-center gap-3.5 px-4 py-3.5 border-b border-line bg-raised last:border-b-0"
              >
                <span
                  className="w-[7px] h-[7px] rounded-full flex-shrink-0"
                  style={{ background: off ? "oklch(0.45 0.006 60)" : "oklch(0.75 0.11 175)" }}
                />
                <div className="flex-1 min-w-0 flex flex-col gap-[3px]">
                  <div className="text-[14px] text-[oklch(0.93_0.004_60)]">{t.name}</div>
                  <div className="text-xs text-[oklch(0.6_0.006_60)]">{t.cadence}</div>
                </div>
                <div className="text-[11.5px] text-[oklch(0.55_0.006_60)] font-mono">
                  {off ? "paused" : t.next}
                </div>
                <button
                  onClick={() => onToggleTask(idx)}
                  className="w-[38px] h-[21px] rounded-full border-none cursor-pointer p-0.5 flex"
                  style={{
                    justifyContent: off ? "flex-start" : "flex-end",
                    background: off ? "oklch(0.32 0.006 60)" : "oklch(0.55 0.09 175)",
                  }}
                >
                  <span className="w-[17px] h-[17px] rounded-full bg-[oklch(0.96_0.004_60)] block" />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
