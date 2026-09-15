import type { Project } from "@/lib/types";

interface ProjectsViewProps {
  projects: Project[];
  blurred: boolean;
}

export default function ProjectsView({ projects, blurred }: ProjectsViewProps) {
  return (
    <div className="flex-1 overflow-auto px-8 py-9">
      <div
        className="max-w-[900px] mx-auto transition-[filter] duration-[260ms] ease-in-out"
        style={{ filter: blurred ? "blur(6px)" : "none" }}
      >
        <h1 className="font-serif font-normal text-[30px] m-0 mb-1.5 text-ink-bright">Projects</h1>
        <p className="m-0 mb-[26px] text-[13.5px] text-[oklch(0.62_0.006_60)]">
          Keep chats, files, and instructions together.
        </p>
        <div className="grid gap-3.5" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))" }}>
          {projects.map((p) => (
            <div
              key={p.name}
              className="border border-[oklch(0.27_0.005_60)] bg-raised rounded-xl p-4 flex flex-col gap-2 min-h-[132px] hover:border-[oklch(0.38_0.006_60)]"
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
