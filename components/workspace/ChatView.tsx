import type { KeyboardEvent, RefObject } from "react";
import type { ChatMessage, Skill } from "@/lib/types";

interface ChatViewProps {
  messages: ChatMessage[];
  blurred: boolean;
  composerBlurred: boolean;
  skillsOpen: boolean;
  skills: Skill[];
  activeSkills: string[];
  plusHighlighted: boolean;
  draft: string;
  threadRef: RefObject<HTMLDivElement | null>;
  inputRef: RefObject<HTMLTextAreaElement | null>;
  onOpenSkills: () => void;
  onCloseSkills: () => void;
  onToggleSkill: (id: string) => void;
  onRemoveSkill: (id: string) => void;
  onDraftChange: (value: string) => void;
  onKeyDown: (e: KeyboardEvent<HTMLTextAreaElement>) => void;
  onSend: () => void;
}

export default function ChatView({
  messages,
  blurred,
  composerBlurred,
  skillsOpen,
  skills,
  activeSkills,
  plusHighlighted,
  draft,
  threadRef,
  inputRef,
  onOpenSkills,
  onCloseSkills,
  onToggleSkill,
  onRemoveSkill,
  onDraftChange,
  onKeyDown,
  onSend,
}: ChatViewProps) {
  const activeSkillList = activeSkills
    .map((id) => skills.find((s) => s.id === id))
    .filter((s): s is Skill => Boolean(s));

  return (
    <>
      <div
        ref={threadRef}
        className="flex-1 overflow-auto flex flex-col transition-[filter] duration-[260ms] ease-in-out"
        style={{ filter: blurred ? "blur(6px)" : "none" }}
      >
        <div className="w-full max-w-[760px] mx-auto px-6 pt-8 pb-2 flex flex-col gap-[26px]">
          {messages.map((m, i) =>
            m.role === "user" ? (
              <div key={i} className="flex justify-end">
                <div className="max-w-[76%] bg-active rounded-[14px] px-[15px] py-[11px] font-sans text-[14.5px] leading-[1.62] text-[oklch(0.93_0.004_60)] text-pretty whitespace-pre-wrap">
                  {m.text}
                </div>
              </div>
            ) : (
              <div key={i} className="flex justify-start">
                <div className="max-w-full bg-transparent font-serif text-[17px] leading-[1.62] text-[oklch(0.93_0.004_60)] text-pretty whitespace-pre-wrap">
                  {m.text}
                </div>
              </div>
            )
          )}
        </div>
        <div className="h-6" />
      </div>

      <div
        className="flex-shrink-0 px-6 pb-[18px] relative transition-[filter] duration-[260ms] ease-in-out"
        style={{ filter: composerBlurred ? "blur(6px)" : "none" }}
      >
        <div className="w-full max-w-[760px] mx-auto relative">
          {skillsOpen && (
            <div onClick={onCloseSkills} className="fixed inset-0 z-[15]" />
          )}
          {skillsOpen && (
            <div className="absolute bottom-[calc(100%+8px)] left-0 w-[340px] bg-popover border border-[oklch(0.31_0.006_60)] rounded-xl shadow-[0_18px_50px_oklch(0.1_0_0_/_0.55)] p-1.5 z-20">
              <div className="flex flex-col gap-px">
                <button className="flex items-center gap-2.5 w-full border-none bg-transparent rounded-lg px-2.5 py-2 cursor-pointer text-left font-sans text-[13px] text-ink hover:bg-[oklch(0.27_0.005_60)]">
                  <span className="w-[15px] flex justify-center">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="oklch(0.72 0.006 60)" strokeWidth="1.2">
                      <rect x="2" y="1.6" width="10" height="10.8" rx="1.6" />
                      <path d="M4.6 5h4.8M4.6 7.6h4.8" />
                    </svg>
                  </span>
                  Upload a file
                </button>
                <button className="flex items-center gap-2.5 w-full border-none bg-transparent rounded-lg px-2.5 py-2 cursor-pointer text-left font-sans text-[13px] text-ink hover:bg-[oklch(0.27_0.005_60)]">
                  <span className="w-[15px] flex justify-center">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="oklch(0.72 0.006 60)" strokeWidth="1.2">
                      <circle cx="4.4" cy="4.4" r="2.6" />
                      <circle cx="9.6" cy="9.6" r="2.6" />
                      <path d="M6.4 6.4l1.2 1.2" />
                    </svg>
                  </span>
                  Connectors
                </button>
              </div>
              <div className="h-px bg-[oklch(0.3_0.006_60)] my-[5px] mx-2" />
              <div className="px-2.5 pt-2 pb-1.5 text-[11.5px] tracking-[0.04em] uppercase text-[oklch(0.58_0.006_60)]">
                Skills
              </div>
              {skills.map((s) => {
                const on = activeSkills.includes(s.id);
                return (
                  <button
                    key={s.id}
                    onClick={() => onToggleSkill(s.id)}
                    className="flex items-start gap-2.5 w-full border-none bg-transparent rounded-lg px-2.5 py-2 cursor-pointer text-left font-sans hover:bg-[oklch(0.27_0.005_60)]"
                  >
                    <span
                      className="w-[15px] h-[15px] rounded mt-px flex-shrink-0 text-accent-ink text-[10px] flex items-center justify-center"
                      style={{
                        border: `1px solid ${on ? "oklch(0.75 0.11 175)" : "oklch(0.42 0.006 60)"}`,
                        background: on ? "oklch(0.75 0.11 175)" : "transparent",
                      }}
                    >
                      {on ? "✓" : ""}
                    </span>
                    <span className="flex flex-col gap-0.5 min-w-0">
                      <span className="text-[13px] text-ink">{s.name}</span>
                      <span className="text-[11.5px] text-[oklch(0.6_0.006_60)]">{s.desc}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          <div className="border border-[oklch(0.32_0.006_60)] bg-composer rounded-[14px] px-3 py-2.5 flex flex-col gap-2">
            <div className="flex items-start gap-2.5">
              <button
                onClick={onOpenSkills}
                className="w-[26px] h-[26px] rounded-full cursor-pointer text-[oklch(0.8_0.006_60)] text-sm leading-none font-sans transition-[background,box-shadow] duration-200 ease-in-out hover:bg-[oklch(0.28_0.005_60)]"
                style={{
                  border: `1px solid ${plusHighlighted ? "oklch(0.72 0.12 250)" : "oklch(0.35 0.006 60)"}`,
                  background: plusHighlighted ? "oklch(0.62 0.16 250)" : "transparent",
                  outline: plusHighlighted ? "2px solid oklch(0.72 0.12 250)" : "none",
                  boxShadow: plusHighlighted ? "0 0 0 6px oklch(0.62 0.19 250 / 0.28)" : "none",
                  animation: plusHighlighted ? "tern-plus 1.9s ease-in-out infinite" : "none",
                }}
              >
                +
              </button>
              <textarea
                ref={inputRef}
                value={draft}
                onChange={(e) => onDraftChange(e.target.value)}
                onKeyDown={onKeyDown}
                rows={1}
                placeholder="Write a message…"
                className="flex-1 min-w-0 resize-none border-none outline-none bg-transparent font-sans text-[14.5px] leading-[1.5] text-[oklch(0.93_0.004_60)] max-h-[340px] overflow-y-auto"
              />
              <div className="flex items-center gap-2.5">
                <div className="text-[12.5px] text-[oklch(0.62_0.006_60)]">
                  Sonnet 4.5 <span className="text-[9px]">▾</span>
                </div>
                <button
                  onClick={onSend}
                  title="Send"
                  className="w-7 h-7 flex-shrink-0 rounded-lg border-none cursor-pointer flex items-center justify-center bg-accent text-accent-ink hover:bg-[oklch(0.82_0.11_175)]"
                >
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 15 15"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M7.5 12.4V3.1" />
                    <path d="M3.6 7l3.9-3.9L11.4 7" />
                  </svg>
                </button>
              </div>
            </div>
            {activeSkillList.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pl-9">
                {activeSkillList.map((s) => (
                  <span
                    key={s.id}
                    className="flex items-center gap-1.5 text-[11.5px] px-2 py-[3px] rounded-full bg-[oklch(0.28_0.03_175)] text-[oklch(0.88_0.05_175)]"
                  >
                    {s.name}
                    <button
                      onClick={() => onRemoveSkill(s.id)}
                      className="border-none bg-transparent p-0 cursor-pointer text-[oklch(0.75_0.05_175)] text-xs leading-none font-sans"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
          <div className="text-center text-[12px] text-[oklch(0.8_0.006_60)] mt-[9px]">
            Prototype — responses are canned. Submit the message or hit Send to view the workflow insight creation
            flow.
          </div>
        </div>
      </div>
    </>
  );
}
