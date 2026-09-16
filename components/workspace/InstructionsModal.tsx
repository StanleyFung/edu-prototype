interface InstructionsModalProps {
  draft: string;
  onDraftChange: (value: string) => void;
  onCancel: () => void;
  onSave: () => void;
}

export default function InstructionsModal({ draft, onDraftChange, onCancel, onSave }: InstructionsModalProps) {
  return (
    <div className="fixed inset-0 z-[70] bg-[oklch(0.12_0_0_/_0.58)] flex items-center justify-center p-7">
      <div onClick={onCancel} className="absolute inset-0" />
      <div className="relative w-[560px] max-w-full bg-popover border border-[oklch(0.33_0.006_60)] rounded-2xl shadow-[0_28px_70px_oklch(0.1_0_0_/_0.55)] p-5 flex flex-col gap-3.5">
        <div className="flex items-center gap-2.5">
          <div className="font-serif text-[19px] text-ink-bright">Instructions</div>
          <button
            onClick={onCancel}
            className="ml-auto border-none bg-transparent cursor-pointer text-[oklch(0.62_0.006_60)] text-[17px] leading-none font-sans px-1 py-0.5 hover:text-ink"
          >
            ×
          </button>
        </div>
        <p className="m-0 text-[12.5px] leading-[1.5] text-[oklch(0.68_0.006_60)] text-pretty">
          Claude follows these in every chat in this project.
        </p>
        <textarea
          value={draft}
          onChange={(e) => onDraftChange(e.target.value)}
          placeholder="Add instructions for Claude's responses"
          className="w-full h-[300px] border border-[oklch(0.3_0.006_60)] rounded-[10px] bg-surface px-[13px] py-3 resize-none outline-none font-sans text-[13px] leading-[1.65] text-[oklch(0.9_0.004_60)] focus:border-[oklch(0.5_0.06_175)]"
        />
        <div className="flex items-center gap-2 justify-end">
          <button
            onClick={onCancel}
            className="border border-[oklch(0.32_0.006_60)] bg-transparent rounded-lg px-3.5 py-[7px] cursor-pointer font-sans text-[13px] text-[oklch(0.85_0.004_60)] hover:bg-[oklch(0.27_0.005_60)]"
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            className="border-none bg-accent rounded-lg px-4 py-[7px] cursor-pointer font-sans text-[13px] font-medium text-accent-ink hover:bg-[oklch(0.82_0.11_175)]"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
