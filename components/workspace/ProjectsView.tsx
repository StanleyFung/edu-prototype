import type { Project } from "@/lib/types";

interface ProjectsViewProps {
  projects: Project[];
  blurred: boolean;
  onOpenProject: (id: string) => void;
  onNewProject: () => void;
  onNoop: () => void;
}

export default function ProjectsView({ projects, blurred, onOpenProject, onNewProject, onNoop }: ProjectsViewProps) {
  return (
    <div className="flex-1 overflow-auto px-8 py-9">
      <div
        className="max-w-[900px] mx-auto transition-[filter] duration-[260ms] ease-in-out"
        style={{ filter: blurred ? "blur(6px)" : "none" }}
      >
        <div className="flex items-start gap-4">
          <div className="min-w-0">
            <h1 className="font-serif font-normal text-[30px] m-0 mb-1.5 text-ink-bright">Projects</h1>
            <p className="m-0 mb-[26px] text-[13.5px] text-[oklch(0.62_0.006_60)]">
              Keep chats, files, and instructions together.
            </p>
          </div>
          <div className="ml-auto flex items-center gap-2 pt-1.5">
            <button
              onClick={onNoop}
              title="Search projects"
              className="w-[30px] h-[30px] rounded-lg border-none bg-transparent cursor-pointer text-[oklch(0.78_0.006_60)] flex items-center justify-center hover:bg-[oklch(0.26_0.005_60)]"
            >
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.3">
                <circle cx="6.6" cy="6.6" r="4.3" />
                <path d="M9.8 9.8l3 3" />
              </svg>
            </button>
            <button
              onClick={onNoop}
              title="Sort"
              className="w-[30px] h-[30px] rounded-lg border-none bg-transparent cursor-pointer text-[oklch(0.78_0.006_60)] flex items-center justify-center hover:bg-[oklch(0.26_0.005_60)]"
            >
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.3">
                <path d="M4.3 12.2V3.4M4.3 3.4L2.2 5.6M4.3 3.4l2.1 2.2" />
                <path d="M10.7 2.8v8.8M10.7 11.6l2.1-2.2M10.7 11.6l-2.1-2.2" />
              </svg>
            </button>
            <button
              onClick={onNewProject}
              className="border-none bg-[oklch(0.96_0.003_60)] rounded-[9px] px-[15px] py-2 cursor-pointer font-sans text-[13.5px] font-medium text-[oklch(0.2_0.005_60)] whitespace-nowrap hover:bg-white"
            >
              New project
            </button>
          </div>
        </div>
        <div className="grid gap-3.5" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))" }}>
          {projects.map((p) => (
            <div
              key={p.id}
              onClick={() => onOpenProject(p.id)}
              className="border border-[oklch(0.27_0.005_60)] bg-raised rounded-xl p-4 flex flex-col gap-2 min-h-[132px] cursor-pointer transition-[background,border-color] duration-[400ms] ease-in-out hover:border-[oklch(0.38_0.006_60)]"
            >
              <span className="w-2 h-2 rounded-[3px]" style={{ background: p.dot }} />
              <div className="text-[14.5px] text-ink-bright font-medium text-pretty">{p.name}</div>
              <div className="text-[12.5px] leading-[1.5] text-[oklch(0.62_0.006_60)] text-pretty">{p.desc}</div>
              <div className="mt-auto text-[11.5px] text-[oklch(0.5_0.006_60)] font-mono">{p.meta}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
