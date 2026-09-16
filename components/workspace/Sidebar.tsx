import type { Project } from "@/lib/types";

interface SidebarProps {
  view: "chat" | "projects" | "project" | "scheduled";
  blurred: boolean;
  projectPreviewHighlighted: boolean;
  highlightedProjectId: string | null;
  scheduledHighlighted: boolean;
  newChatHighlighted: boolean;
  projects: Project[];
  recents: string[];
  onGoChat: () => void;
  onGoProjects: () => void;
  onGoScheduled: () => void;
  onOpenProject: (id: string) => void;
}

export default function Sidebar({
  view,
  blurred,
  projectPreviewHighlighted,
  highlightedProjectId,
  scheduledHighlighted,
  newChatHighlighted,
  projects,
  recents,
  onGoChat,
  onGoProjects,
  onGoScheduled,
  onOpenProject,
}: SidebarProps) {
  const highlightBg = "oklch(0.58 0.11 250 / 0.5)";
  const ringStyle = "2px solid oklch(0.72 0.12 250)";

  return (
    <aside className="w-[248px] flex-shrink-0 border-r border-line flex flex-col bg-surface">
      <div
        className="flex items-center justify-between px-4 pt-3.5 pb-2.5 transition-[filter] duration-[260ms] ease-in-out"
        style={{ filter: blurred ? "blur(6px)" : "none" }}
      >
        <div className="font-serif text-[22px] font-normal tracking-[-0.01em] text-ink-bright">Claude</div>
        <div className="flex gap-0.5 bg-popover rounded-[7px] p-0.5">
          <button
            onClick={onGoChat}
            className="border-none cursor-pointer rounded-[5px] w-[26px] h-[22px] text-[11px] font-sans text-[oklch(0.8_0.004_60)]"
            style={{ background: view === "chat" ? "oklch(0.3 0.005 60)" : "transparent" }}
          >
            ◌
          </button>
          <button
            onClick={onGoProjects}
            className="border-none cursor-pointer rounded-[5px] w-[26px] h-[22px] text-[11px] font-sans text-[oklch(0.8_0.004_60)]"
            style={{ background: view !== "chat" ? "oklch(0.3 0.005 60)" : "transparent" }}
          >
            ◫
          </button>
        </div>
      </div>

      <nav className="flex flex-col gap-px px-2 py-1.5">
        <button
          onClick={onGoChat}
          className="flex items-center gap-[11px] px-2 py-[7px] border-none rounded-[7px] cursor-pointer text-ink text-[13.5px] font-sans text-left transition-[filter,background] duration-200 ease-in-out hover:bg-hover"
          style={{
            background: newChatHighlighted ? highlightBg : "transparent",
            outline: newChatHighlighted ? ringStyle : "none",
            animation: newChatHighlighted ? "tern-target 1.9s ease-in-out infinite" : "none",
            filter: blurred && !newChatHighlighted ? "blur(6px)" : "none",
          }}
        >
          <span className="w-[18px] h-[18px] rounded-full border border-[oklch(0.55_0.006_60)] flex items-center justify-center text-xs leading-none text-[oklch(0.7_0.006_60)]">
            +
          </span>
          New chat
        </button>
        <button
          onClick={onGoProjects}
          className="flex items-center gap-[11px] px-2 py-[7px] border-none rounded-[7px] cursor-pointer text-ink text-[13.5px] font-sans text-left transition-[filter,background] duration-200 ease-in-out hover:bg-hover"
          style={{
            background: projectPreviewHighlighted
              ? highlightBg
              : view === "projects" || view === "project"
                ? "oklch(0.26 0.005 60)"
                : "transparent",
            outline: projectPreviewHighlighted ? ringStyle : "none",
            animation: projectPreviewHighlighted ? "tern-target 1.9s ease-in-out infinite" : "none",
            filter: blurred && !projectPreviewHighlighted ? "blur(6px)" : "none",
          }}
        >
          <span className="w-[18px] flex justify-center">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="oklch(0.7 0.006 60)" strokeWidth="1.2">
              <rect x="1.2" y="3" width="11.6" height="9" rx="1.5" />
              <rect x="4.2" y="1.6" width="5.6" height="2.4" rx="1" />
            </svg>
          </span>
          Projects
        </button>
        <button
          onClick={onGoScheduled}
          className="flex items-center gap-[11px] px-2 py-[7px] border-none rounded-[7px] cursor-pointer text-ink text-[13.5px] font-sans text-left transition-[filter,background] duration-200 ease-in-out hover:bg-hover"
          style={{
            background: scheduledHighlighted
              ? highlightBg
              : view === "scheduled"
                ? "oklch(0.26 0.005 60)"
                : "transparent",
            outline: scheduledHighlighted ? ringStyle : "none",
            animation: scheduledHighlighted ? "tern-target 1.9s ease-in-out infinite" : "none",
            filter: blurred && !scheduledHighlighted ? "blur(6px)" : "none",
          }}
        >
          <span className="w-[18px] flex justify-center">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="oklch(0.7 0.006 60)" strokeWidth="1.2">
              <circle cx="7" cy="7" r="5.6" />
              <path d="M7 4.2V7l2 1.6" />
            </svg>
          </span>
          Scheduled
        </button>
      </nav>

      <div
        className="px-4 pt-[18px] pb-1.5 text-[11.5px] tracking-[0.04em] uppercase text-[oklch(0.55_0.006_60)] transition-[filter] duration-[260ms] ease-in-out"
        style={{ filter: blurred ? "blur(6px)" : "none" }}
      >
        Projects
      </div>
      <div className="flex flex-col px-2">
        {projects.map((p) => {
          const rowHighlighted = highlightedProjectId === p.id;
          return (
            <button
              key={p.id}
              onClick={() => onOpenProject(p.id)}
              className="flex items-center gap-2.5 px-2 py-1.5 border-none rounded-[7px] cursor-pointer text-[oklch(0.82_0.004_60)] text-[13px] font-sans text-left overflow-hidden hover:bg-hover transition-[filter,background] duration-200 ease-in-out"
              style={{
                background: rowHighlighted ? highlightBg : "transparent",
                outline: rowHighlighted ? ringStyle : "none",
                animation: rowHighlighted ? "tern-target 1.9s ease-in-out infinite" : "none",
                filter: blurred && !rowHighlighted ? "blur(6px)" : "none",
              }}
            >
              <span className="w-1.5 h-1.5 rounded-sm flex-shrink-0" style={{ background: p.dot }} />
              <span className="whitespace-nowrap overflow-hidden text-ellipsis">{p.name}</span>
            </button>
          );
        })}
      </div>

      <div
        className="px-4 pt-[18px] pb-1.5 text-[11.5px] tracking-[0.04em] uppercase text-[oklch(0.55_0.006_60)] transition-[filter] duration-[260ms] ease-in-out"
        style={{ filter: blurred ? "blur(6px)" : "none" }}
      >
        Recents
      </div>
      <div
        className="flex flex-col px-2 overflow-auto flex-1 transition-[filter] duration-[260ms] ease-in-out"
        style={{ filter: blurred ? "blur(6px)" : "none" }}
      >
        {recents.map((title) => (
          <button
            key={title}
            onClick={onGoChat}
            className="px-2 py-1.5 border-none bg-transparent rounded-[7px] cursor-pointer text-[oklch(0.74_0.004_60)] text-[13px] font-sans text-left whitespace-nowrap overflow-hidden text-ellipsis hover:bg-hover hover:text-ink"
          >
            {title}
          </button>
        ))}
      </div>

      <div
        className="border-t border-line px-3 py-2.5 flex items-center gap-2.5 rounded-lg transition-[filter] duration-[260ms] ease-in-out"
        style={{ filter: blurred ? "blur(6px)" : "none" }}
      >
        <div className="w-6 h-6 rounded-full bg-[oklch(0.45_0.07_175)] text-[oklch(0.95_0.02_175)] flex items-center justify-center text-[11px] font-semibold">
          S
        </div>
        <div className="text-[13px] text-[oklch(0.85_0.004_60)]">Stan</div>
        <div className="text-[11px] text-[oklch(0.55_0.006_60)] ml-auto">Pro</div>
      </div>
    </aside>
  );
}
