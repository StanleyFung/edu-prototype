# Workflow Insights — prototype handoff

Original-design AI chat workspace ("Tern") used as a structural stand-in for the real product shell. Visual language is deliberately *not* a replica; swap tokens for the real ones at implementation time.

## Files

| File | Role |
|---|---|
| `Workspace.dc.html` | App shell: sidebar, header, chat thread, composer, Projects view, Scheduled view, skills popover, **Workflow Insights overlay panel** |
| `InsightCard.dc.html` | One insight row. Props: `kind`, `title`, `detail`, `action`, `meta`, `onAccept`, `onDismiss` |

## The feature

**Entry point** — header button `Insights` with a count badge (count = open insights). Badge hides at zero.

**Panel** — 404px wide, fixed to the right edge, slides in on `transform: translateX(104% → 0)` over 320ms `cubic-bezier(.22,.61,.24,1)`. Scrim over the main column dismisses on click; `×` and `Dismiss all` also close/clear.

**Panel anatomy** — title + open count, one-line explainer, filter chips (All / Skills / Tasks / Projects / prompt.md), scrolling rows, footer with `Dismiss all` + freshness stamp.

**Row anatomy** — 2-letter kind chip (SK / TA / PR / MD, color-coded), pattern statement as the title, the reason a feature would help as the detail, primary CTA (`Create skill`, `Schedule it`, `Create project`, `Add to prompt.md`), `Dismiss`, and an evidence stat right-aligned (`4 chats`, `9 of 14`).

**Behaviors wired in the prototype**
- Accept → row leaves the list, toast confirms. `task` accepts also append a row to the Scheduled view (the visible payoff).
- Dismiss → row leaves the list, no side effect.
- Filter chips scope the list; empty state renders when a filter or dismissals clear it.

## Alternative surface — inline suggestion (`insightSurface: "inline"`)

Off by default. Flipping the flag changes *where* an insight appears, not what it does.

- One insight renders as its own block in the thread, directly under the latest assistant response — not a queue: only the insight tied to the current exchange shows (the digest-format pattern at rest; after the user corrects the format, the new insight replaces it).
- Block anatomy: mono kind eyebrow (`SUGGESTED SKILL`) with a color dot, evidence stat + `×` right-aligned, pattern statement, reason, then `Create skill` / `Not now` and a right-aligned `Learn more`.
- Accept runs the same progress → `View` sequence as the panel row, in place. `Not now` and `×` remove the block with no side effect.
- The header badge count is suppressed in this mode (the thread is the notification); the `Workflow Insights` button still opens the panel as the backlog.
- Open question for the real thing: what happens when two patterns land on the same turn, and whether a dismissed inline suggestion should fall back to the panel rather than disappear.

## Alternative surface — interception (`insightSurface: "intercept"`)

Same block, moved one step earlier: it lands *instead of* the response.

- Submitting the message shows the user turn, then the insight block with a paused status strip (`Waiting for your input — the response is paused`, amber pulse) rather than an answer.
- `Ignore and continue` releases the response immediately and drops the block.
- `Create skill` runs the creation steps in place, confirms by toast (`Skill created — applied to this response`), then releases the response.
- Trade-off to test: this is the only variant that blocks the thing the user actually asked for. Needs a rule for how rarely it can fire, and a timeout that continues on its own.

## What a real implementation needs (not in the prototype)

1. **Detection** — insights are a static array. Real version needs a pattern-detection pass over conversation history, with a confidence threshold and per-insight dedupe so the same pattern isn't re-surfaced after dismissal.
2. **Evidence drill-in** — the stat (`4 chats`) should link to the source conversations. Currently inert.
3. **Accept flows** — CTAs are instant. Real flows open the respective creation surface prefilled (skill definition, task schedule, project with files attached, prompt.md diff) and let the user edit before committing.
4. **Dismissal memory** — needs persistence and a "don't suggest this kind again" escape hatch.
5. **Notification policy** — when the badge appears, how often, and whether there's a quiet period.

## Design tokens used

- Canvas `oklch(0.185 0.005 60)` · sidebar/panel `oklch(0.20–0.212 0.005 60)` · borders `oklch(0.25–0.32 0.006 60)`
- Text `oklch(0.92 0.004 60)` / muted `oklch(0.62 0.006 60)` / faint `oklch(0.52 0.006 60)`
- Accent `oklch(0.75 0.11 175)` (primary CTA, badge, active states); kind chips shift hue only: 175 / 75 / 280 / neutral
- Type: system sans for UI, **Newsreader** serif for assistant prose and page titles
- Radii 6–14px, 8px spacing grid

## Prototype tweaks

`insightSurface` (panel / inline / intercept) switches the surface. `initialView` (chat / projects / scheduled) and `insightsInitiallyOpen` — for screenshotting states without clicking.
