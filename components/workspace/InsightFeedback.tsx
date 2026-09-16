import { useState } from "react";

type Vote = "up" | "down" | null;

export interface InsightFeedbackState {
  vote: Vote;
  open: boolean;
  note: string;
  sent: boolean;
  setNote: (note: string) => void;
  pick: (dir: "up" | "down") => void;
  send: () => void;
  cancel: () => void;
}

/** Local vote/note state for one insight's feedback control. Split from
 * rendering so the thumbs (inline in the action row) and the note panel
 * (full-width, below the whole row) can live in different places in
 * InsightCard's layout while sharing one piece of state. */
export function useInsightFeedback(): InsightFeedbackState {
  const [vote, setVote] = useState<Vote>(null);
  const [open, setOpen] = useState(false);
  const [note, setNote] = useState("");
  const [sent, setSent] = useState(false);

  function pick(dir: "up" | "down") {
    if (open && vote === dir) {
      setOpen(false);
      return;
    }
    setVote(dir);
    setOpen(true);
    setSent(false);
    setNote("");
  }

  function send() {
    setOpen(false);
    setSent(true);
  }

  function cancel() {
    setOpen(false);
    setVote(null);
  }

  return { vote, open, note, sent, setNote, pick, send, cancel };
}

function ThumbIcon({ down }: { down?: boolean }) {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 15 15"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinejoin="round"
      style={down ? { transform: "rotate(180deg)" } : undefined}
    >
      <path d="M5.4 13V6.6l2.6-4.2a1.15 1.15 0 0 1 2.05.95L9.3 6.2h2.5a1.3 1.3 0 0 1 1.28 1.55l-.62 3.6A1.7 1.7 0 0 1 10.8 13z" />
      <rect x="1.9" y="6.6" width="3.5" height="6.4" rx="0.9" />
    </svg>
  );
}

/** Thumbs up/down pair — sits inline in the action row, right-aligned. */
export function InsightFeedbackThumbs({ state }: { state: InsightFeedbackState }) {
  const { vote, pick } = state;
  return (
    <div className="ml-auto flex items-center gap-0.5">
      <button
        onClick={() => pick("up")}
        title="This was useful"
        className="w-6 h-6 rounded-md border-none cursor-pointer flex items-center justify-center hover:bg-[oklch(0.3_0.005_60)]"
        style={{
          background: vote === "up" ? "oklch(0.3 0.04 175)" : "transparent",
          color: vote === "up" ? "oklch(0.86 0.09 175)" : "oklch(0.66 0.006 60)",
        }}
      >
        <ThumbIcon />
      </button>
      <button
        onClick={() => pick("down")}
        title="Not useful"
        className="w-6 h-6 rounded-md border-none cursor-pointer flex items-center justify-center hover:bg-[oklch(0.3_0.005_60)]"
        style={{
          background: vote === "down" ? "oklch(0.3 0.04 30)" : "transparent",
          color: vote === "down" ? "oklch(0.84 0.09 30)" : "oklch(0.66 0.006 60)",
        }}
      >
        <ThumbIcon down />
      </button>
    </div>
  );
}

/** Note panel / thanks message — full-width, rendered below the whole
 * action row (not nested under the thumbs). */
export function InsightFeedbackPanel({ state }: { state: InsightFeedbackState }) {
  const { vote, open, note, sent, setNote, send, cancel } = state;
  if (!open && !sent) return null;

  const title = vote === "down" ? "What was off about this insight?" : "What made this insight useful?";
  const placeholder =
    vote === "down"
      ? "Wrong pattern, bad timing, already handled…"
      : "Saved me a step, caught something I'd missed…";

  if (open) {
    return (
      <div
        className="flex flex-col gap-2 border border-[oklch(0.33_0.006_60)] bg-[oklch(0.205_0.005_60)] rounded-[9px] px-[11px] py-2.5 mt-1.5"
        style={{ animation: "tern-fade-in 220ms ease both" }}
      >
        <div className="text-xs text-[oklch(0.85_0.004_60)]">{title}</div>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={2}
          placeholder={placeholder}
          className="border border-[oklch(0.3_0.006_60)] rounded-[7px] bg-[oklch(0.225_0.005_60)] px-2 py-[7px] resize-none outline-none font-sans text-xs leading-[1.5] text-[oklch(0.92_0.004_60)] focus:border-[oklch(0.5_0.06_175)]"
        />
        <div className="flex items-center gap-2">
          <button
            onClick={send}
            className="border-none rounded-md px-[11px] py-[5px] text-xs font-medium cursor-pointer bg-accent text-accent-ink hover:bg-[oklch(0.82_0.11_175)]"
          >
            Send feedback
          </button>
          <button
            onClick={cancel}
            className="border-none bg-transparent px-0.5 py-[5px] cursor-pointer font-sans text-xs text-[oklch(0.68_0.006_60)] hover:text-[oklch(0.95_0.004_60)]"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="text-[11.5px] text-[oklch(0.66_0.03_175)] mt-1"
      style={{ animation: "tern-fade-in 220ms ease both" }}
    >
      Thanks — feedback noted.
    </div>
  );
}
