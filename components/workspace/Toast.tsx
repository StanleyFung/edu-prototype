interface ToastProps {
  message: string | null;
}

export default function Toast({ message }: ToastProps) {
  if (!message) return null;
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] bg-[oklch(0.26_0.005_60)] border border-[oklch(0.36_0.006_60)] rounded-[10px] px-4 py-2.5 text-[13px] text-ink-bright shadow-[0_14px_40px_oklch(0.1_0_0_/_0.5)]">
      {message}
    </div>
  );
}
