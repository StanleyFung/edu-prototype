interface HeaderProps {
  title: string;
  blurred: boolean;
  insightsOpen: boolean;
  unreadCount: number;
  badgeBounce: boolean;
  onToggleInsights: () => void;
}

export default function Header({
  title,
  blurred,
  insightsOpen,
  unreadCount,
  badgeBounce,
  onToggleInsights,
}: HeaderProps) {
  return (
    <header
      className="h-[52px] flex-shrink-0 border-b border-[oklch(0.23_0.005_60)] flex items-center gap-2.5 px-4 transition-[filter] duration-[260ms] ease-in-out"
      style={{ filter: blurred ? "blur(6px)" : "none" }}
    >
      <div className="flex items-center gap-1.5 px-[9px] py-[5px] rounded-[7px] text-[15px] text-ink">
        {title}
        <span className="text-[9px] text-[oklch(0.6_0.006_60)] ml-1">▾</span>
      </div>
      <div className="ml-auto flex items-center gap-2">
        <button
          onClick={onToggleInsights}
          title="Workflow Insights"
          className="relative flex items-center gap-2 border border-[oklch(0.3_0.006_60)] rounded-lg pl-[9px] pr-[11px] py-1.5 cursor-pointer font-sans text-[15px] text-ink hover:bg-[oklch(0.27_0.005_60)]"
          style={{ background: insightsOpen ? "oklch(0.3 0.03 175)" : "oklch(0.23 0.005 60)" }}
        >
          <svg
            width="15"
            height="15"
            viewBox="0 0 15 15"
            fill="none"
            stroke="oklch(0.8 0.006 60)"
            strokeWidth="1.2"
            strokeLinecap="round"
          >
            <path d="M7.5 1.6a4 4 0 0 0-2.3 7.3v1.4h4.6V8.9a4 4 0 0 0-2.3-7.3z" />
            <path d="M6.1 12.1h2.8M6.5 13.6h2" />
          </svg>
          Workflow Insights
          {unreadCount > 0 && (
            <span
              className="min-w-[17px] h-[17px] rounded-full bg-accent text-accent-ink text-[11px] font-semibold flex items-center justify-center px-[5px]"
              style={{ animation: badgeBounce ? "tern-bounce 900ms ease-in-out 2" : "none" }}
            >
              {unreadCount}
            </span>
          )}
        </button>
        <button className="border border-[oklch(0.3_0.006_60)] bg-transparent rounded-lg px-3 py-1.5 cursor-pointer font-sans text-[15px] text-[oklch(0.85_0.004_60)] hover:bg-[oklch(0.26_0.005_60)]">
          Share
        </button>
      </div>
    </header>
  );
}
