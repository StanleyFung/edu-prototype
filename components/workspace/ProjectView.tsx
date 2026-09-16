import { clampText } from "@/lib/clampText";
import type { Project, ProjectDetailSection, ProjectFile } from "@/lib/types";

interface ProjectViewProps {
  project: Project;
  instructions: string;
  files: ProjectFile[];
  flashSection: ProjectDetailSection | null;
  draft: string;
  blurred: boolean;
  onBack: () => void;
  onDraftChange: (value: string) => void;
  onOpenInstructions: () => void;
  onNoop: () => void;
}

const FLASH_RING = "2px solid oklch(0.6 0.09 175)";
const FLASH_BG = "oklch(0.24 0.02 175)";

export default function ProjectView({
  project,
  instructions,
  files,
  flashSection,
  draft,
  blurred,
  onBack,
  onDraftChange,
  onOpenInstructions,
  onNoop,
}: ProjectViewProps) {
  const hasContext = files.length > 0;
  const instrFlashing = flashSection === "instructions";
  const ctxFlashing = flashSection === "context";

  return (
    <div
      className="flex-1 overflow-auto px-[30px] pt-[26px] pb-10 transition-[filter] duration-[260ms] ease-in-out"
      style={{ filter: blurred ? "blur(6px)" : "none" }}
    >
      <div className="max-w-[1080px] mx-auto flex flex-col gap-[18px]">
        <button
          onClick={onBack}
          className="self-start border-none bg-transparent p-0 cursor-pointer font-sans text-[12.5px] text-[oklch(0.62_0.006_60)] hover:text-ink-bright"
        >
          ← All projects
        </button>

        <div className="flex items-center gap-3">
          <span className="w-[9px] h-[9px] rounded-sm flex-shrink-0" style={{ background: project.dot }} />
          <h1 className="font-serif font-normal text-[28px] m-0 text-ink-bright text-pretty">{project.name}</h1>
          <div className="ml-auto flex items-center gap-1">
            <button
              onClick={onNoop}
              className="w-7 h-7 rounded-lg border-none bg-transparent cursor-pointer text-[oklch(0.72_0.006_60)] flex items-center justify-center hover:bg-[oklch(0.26_0.005_60)]"
            >
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.2">
                <path d="M6 2.2h3l.5 4.1 2.1 2.1H3.4l2.1-2.1z" />
                <path d="M7.5 8.4v4.4" />
              </svg>
            </button>
            <button
              onClick={onNoop}
              className="w-7 h-7 rounded-lg border-none bg-transparent cursor-pointer text-[oklch(0.72_0.006_60)] text-[15px] leading-none font-sans hover:bg-[oklch(0.26_0.005_60)]"
            >
              ⋯
            </button>
          </div>
        </div>

        <div className="grid gap-[22px] items-start" style={{ gridTemplateColumns: "minmax(0, 1fr) 356px" }}>
          <div className="flex flex-col gap-11 min-w-0">
            <div className="border border-[oklch(0.32_0.006_60)] bg-composer rounded-[14px] px-[13px] py-[11px] flex flex-col gap-[11px]">
              <textarea
                value={draft}
                onChange={(e) => onDraftChange(e.target.value)}
                rows={2}
                placeholder="Type / for skills"
                className="border-none outline-none resize-none bg-transparent font-sans text-[14.5px] leading-[1.5] text-[oklch(0.93_0.004_60)]"
              />
              <div className="flex items-center gap-2.5">
                <button
                  onClick={onNoop}
                  className="w-[26px] h-[26px] rounded-full border border-[oklch(0.35_0.006_60)] bg-transparent cursor-pointer text-[oklch(0.8_0.006_60)] text-sm leading-none font-sans hover:bg-[oklch(0.28_0.005_60)]"
                >
                  +
                </button>
                <div className="flex gap-0.5 bg-popover rounded-lg p-0.5">
                  <span className="px-2.5 py-[3px] rounded-md text-[12.5px] bg-[oklch(0.3_0.005_60)] text-ink-bright">
                    Chat
                  </span>
                  <span className="px-2.5 py-[3px] rounded-md text-[12.5px] text-[oklch(0.58_0.006_60)]">Cowork</span>
                </div>
                <div className="ml-auto text-[12.5px] text-[oklch(0.62_0.006_60)]">
                  Sonnet 4.5 <span className="text-[9px]">▾</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center gap-3 px-5">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="oklch(0.55 0.006 60)" strokeWidth="1.2">
                <path d="M3 5.5A2.5 2.5 0 0 1 5.5 3h9A2.5 2.5 0 0 1 17 5.5v5A2.5 2.5 0 0 1 14.5 13H8l-4 3.4V13" />
                <path d="M7 8h6" />
              </svg>
              <div className="text-[13.5px] leading-[1.6] text-[oklch(0.62_0.006_60)] text-center max-w-[420px] text-pretty">
                Claude references the same instructions and files every time you talk to it in this project.
              </div>
            </div>
          </div>

          <div className="border border-[oklch(0.27_0.005_60)] bg-panel rounded-[14px] overflow-hidden">
            <div
              className="px-[18px] pt-4 pb-[15px] border-b border-line transition-[background] duration-[400ms] ease-in-out"
              style={{ outline: instrFlashing ? FLASH_RING : "none", background: instrFlashing ? FLASH_BG : "transparent" }}
            >
              <div className="flex items-center gap-2.5 mb-2">
                <div className="text-[14.5px] text-ink-bright">Instructions</div>
              </div>
              <div
                onClick={onOpenInstructions}
                title="Edit instructions"
                className="h-32 rounded-[10px] px-3.5 py-3 cursor-pointer overflow-hidden whitespace-pre-wrap break-words text-[12.5px] leading-[1.65] transition-[background,border-color] duration-[400ms] ease-in-out hover:border-[oklch(0.42_0.006_60)] hover:bg-[oklch(0.24_0.005_60)]"
                style={{
                  border: `1px solid ${instrFlashing ? "oklch(0.6 0.09 175)" : "oklch(0.28 0.006 60)"}`,
                  background: instrFlashing ? "oklch(0.27 0.03 175)" : "oklch(0.225 0.005 60)",
                  color: instructions.length ? "oklch(0.88 0.004 60)" : "oklch(0.6 0.006 60)",
                }}
              >
                {instructions.length ? clampText(instructions, 5, 44) : "Add instructions for Claude's responses"}
              </div>
            </div>

            <div className="px-[18px] pt-4 pb-[15px] border-b border-line">
              <div className="flex items-center gap-2.5 mb-2">
                <div className="text-[14.5px] text-ink-bright">Memory</div>
                <span className="ml-auto flex items-center gap-[5px] border border-[oklch(0.3_0.006_60)] rounded-[7px] px-2 py-[3px] text-[11.5px] text-[oklch(0.7_0.006_60)]">
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.1">
                    <rect x="1.6" y="4.4" width="6.8" height="4.4" rx="1" />
                    <path d="M3.3 4.4V3.2a1.7 1.7 0 0 1 3.4 0v1.2" />
                  </svg>
                  Only you
                </span>
              </div>
              <div className="text-[12.5px] text-[oklch(0.6_0.006_60)]">
                Project memory will show here after a few chats.
              </div>
            </div>

            <div
              className="px-[18px] pt-4 pb-[15px] border-b border-line transition-[background] duration-[400ms] ease-in-out"
              style={{ outline: ctxFlashing ? FLASH_RING : "none", background: ctxFlashing ? FLASH_BG : "transparent" }}
            >
              <div className="flex items-center gap-2.5 mb-2.5">
                <div className="text-[14.5px] text-ink-bright">Context</div>
                {hasContext && (
                  <div className="text-[11.5px] text-[oklch(0.55_0.006_60)] font-mono">{files.length} files</div>
                )}
                <button
                  onClick={onNoop}
                  className="ml-auto border-none bg-transparent cursor-pointer text-[oklch(0.7_0.006_60)] text-base leading-none font-sans px-0.5 hover:text-ink-bright"
                >
                  +
                </button>
              </div>
              {hasContext ? (
                <div className="flex flex-col gap-1.5">
                  {files.map((f) => (
                    <div
                      key={f.name}
                      className="flex items-center gap-2.5 border border-[oklch(0.27_0.005_60)] bg-[oklch(0.225_0.005_60)] rounded-[9px] px-2.5 py-[9px]"
                    >
                      <span className="w-[22px] h-[26px] flex-shrink-0 rounded-[3px] bg-[oklch(0.33_0.05_25)] text-[oklch(0.9_0.04_25)] text-[8px] font-semibold tracking-[0.02em] flex items-center justify-center">
                        PDF
                      </span>
                      <span className="flex flex-col gap-0.5 min-w-0">
                        <span className="text-[12.5px] text-ink-bright whitespace-nowrap overflow-hidden text-ellipsis">
                          {f.name}
                        </span>
                        <span className="text-[11px] text-[oklch(0.58_0.006_60)]">{f.meta}</span>
                      </span>
                      <button
                        onClick={onNoop}
                        className="ml-auto flex-shrink-0 border-none bg-transparent cursor-pointer text-[oklch(0.55_0.006_60)] text-[13px] leading-none font-sans hover:text-ink-bright"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="border border-dashed border-[oklch(0.3_0.006_60)] rounded-[10px] bg-[oklch(0.195_0.005_60)] px-[22px] py-[30px] flex flex-col items-center gap-3">
                  <svg width="40" height="26" viewBox="0 0 40 26" fill="none" stroke="oklch(0.5 0.006 60)" strokeWidth="1.1">
                    <rect x="1" y="8" width="12" height="15" rx="1.5" />
                    <rect x="14" y="6" width="12" height="17" rx="1.5" />
                    <rect x="27" y="3" width="12" height="20" rx="1.5" />
                  </svg>
                  <div className="text-[12.5px] leading-[1.55] text-[oklch(0.62_0.006_60)] text-center text-pretty">
                    Add PDFs, documents, or other text to reference in this project.
                  </div>
                </div>
              )}
            </div>

            <div className="px-[18px] pt-4 pb-4">
              <div className="flex items-center gap-2.5 mb-2">
                <div className="text-[14.5px] text-ink-bright">Scheduled</div>
                <button
                  onClick={onNoop}
                  className="ml-auto border-none bg-transparent cursor-pointer text-[oklch(0.7_0.006_60)] text-base leading-none font-sans px-0.5 hover:text-ink-bright"
                >
                  +
                </button>
              </div>
              <div className="text-[12.5px] text-[oklch(0.6_0.006_60)]">Set up recurring tasks for this project.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
