/** Clamps text to a maximum number of wrapped lines (estimated at `perLine`
 * characters per line), appending an ellipsis when truncated. Used for the
 * Instructions preview box in the project detail view. */
export function clampText(text: string, maxLines: number, perLine: number): string {
  const out: string[] = [];
  let used = 0;
  for (const raw of text.split("\n")) {
    const words = raw.length ? raw.split(" ") : [""];
    let line = "";
    for (const w of words) {
      const cand = line ? line + " " + w : w;
      if (cand.length > perLine && line) {
        out.push(line);
        used++;
        line = w;
        if (used >= maxLines) break;
      } else {
        line = cand;
      }
    }
    if (used >= maxLines) break;
    out.push(line);
    used++;
    if (used >= maxLines) break;
  }
  const flat = out.join("\n");
  return flat.length < text.length ? flat.replace(/[\s·•-]+$/, "") + "…" : flat;
}
