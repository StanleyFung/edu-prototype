import type {
  ChatMessage,
  FilterDef,
  Insight,
  InsightActions,
  InsightFilter,
  InsightKind,
  InsightSource,
  Project,
  ProjectFile,
  RunSteps,
  Skill,
  Task,
} from "./types";

export const PROJECTS: Project[] = [
  {
    id: "edu",
    name: "Education Prototype Brainstorming",
    dot: "oklch(0.7 0.1 280)",
    desc: "Concepts and research for the K-12 pilot.",
    meta: "12 chats · 4 files",
  },
  {
    id: "q3",
    name: "Q3 Reporting",
    dot: "oklch(0.75 0.11 175)",
    desc: "Weekly digests, metrics pulls, exec summaries.",
    meta: "8 chats · 11 files",
  },
  {
    id: "triage",
    name: "Support Triage",
    dot: "oklch(0.78 0.12 75)",
    desc: "Ticket clustering and response drafting.",
    meta: "23 chats · 2 files",
  },
];

export const VENDOR_PROJECT: Project = {
  id: "vendor",
  name: "Vendor Security Review",
  dot: "oklch(0.72 0.1 30)",
  desc: "SOC 2 reports and questionnaire answers for the three shortlisted vendors.",
  meta: "6 chats · 3 files",
};

export const VENDOR_FILES: ProjectFile[] = [
  { name: "Northwind-SOC2-TypeII-2026.pdf", meta: "84 pages · added just now" },
  { name: "Cloudmark-SOC2-BridgeLetter.pdf", meta: "6 pages · added just now" },
  { name: "Orbital-Security-Questionnaire.pdf", meta: "22 pages · added just now" },
];

export const TRIAGE_INSTRUCTIONS =
  'Tone: short and direct. No hedging.\n\n• Lead with the answer in the first sentence, then at most two sentences of reasoning.\n• Cut qualifiers — "it depends", "you may want to", "generally speaking", "I think". If something is genuinely uncertain, say so once in plain words and move on.\n• Prefer plain verbs over softeners: "do X" instead of "you might consider doing X".\n• No preamble, no summary of the question back to me, no closing offer to help further.\n• Use the customer\'s wording for their problem rather than internal shorthand.\n• Bullets over paragraphs whenever there is more than one item.';

export const RECENTS: string[] = [
  "Weekly digest for the platform team",
  "Rewrite onboarding email sequence",
  "Compare vendor SOC 2 reports",
  "Summarize Monday's design review",
  "Draft standup notes from transcript",
  "Untitled",
];

export const DIGEST_SKILL: Skill = {
  id: "digest",
  name: "Weekly Digest",
  desc: "Rolls sources into a fixed summary format",
};

export const SKILLS: Skill[] = [
  { id: "triage", name: "Ticket Triage", desc: "Clusters tickets and drafts replies" },
  { id: "brief", name: "Research Brief", desc: "Sourced findings, three-section output" },
  { id: "notes", name: "Meeting Notes", desc: "Decisions, owners, open questions" },
];

export const MESSAGES: ChatMessage[] = [
  {
    role: "user",
    text: "Can you pull together the weekly digest for the platform team again?",
  },
  {
    role: "ai",
    text: "Here's this week's digest across the three sources you usually include.\n\nShipped: queue retries, audit-log export, two schema migrations.\nIn review: rate-limit rewrite (blocked on load test), SSO group sync.\nRisks: the migration backlog is growing faster than it's draining.",
  },
];

export const DRAFT =
  "No that's not right, I want the format to look like this:\n\n## Week of Mar 4\n**Shipped** — one line per item, ticket ID first\n**At risk** — item, owner, blocker\n**Numbers** — p95 latency, error rate, queue depth\n\nNo prose paragraphs, keep it under 150 words.";

export const FOLLOW_UP: ChatMessage = {
  role: "ai",
  text: "Got it — reformatted to that structure.\n\n## Week of Mar 4\n**Shipped** — PLAT-412 queue retries · PLAT-418 audit-log export · PLAT-421 schema migrations\n**At risk** — Rate-limit rewrite, Dana, blocked on load test\n**Numbers** — p95 412ms · error rate 0.28% · queue depth 1.4k",
};

export const NEW_INSIGHT: Insight = {
  id: "i7",
  kind: "skill",
  title: "You just corrected the digest format by hand",
  detail:
    "Saving this exact structure as a Skill would keep every future digest in it without you pasting the template.",
  action: "Create skill",
  meta: "",
};

export const BASE_TASKS: Task[] = [
  { name: "Platform weekly digest", cadence: "Mondays at 9:00am", next: "in 3 days" },
  { name: "Overnight deploy changelog", cadence: "Weekdays at 8:30am", next: "tomorrow" },
  { name: "Support backlog sweep", cadence: "Fridays at 4:00pm", next: "in 7 days" },
];

export const INSIGHTS: Insight[] = [
  {
    id: "i2",
    kind: "task",
    title: '"Do the same thing next Monday" looks like a recurring job',
    detail: "A Scheduled Task can run the digest weekly and post the result here.",
    action: "Schedule it",
    meta: "this chat",
  },
  {
    id: "i3",
    kind: "project",
    title: "Six chats reference the same three vendor PDFs",
    detail:
      "Northwind's SOC 2 Type II, Cloudmark's bridge letter, and Orbital's security questionnaire — you re-upload all three every time you compare the shortlist. A Project would hold them once.",
    action: "Create project",
    meta: "6 chats",
  },
  {
    id: "i4",
    kind: "prompt",
    title: "You correct tone the same way most sessions",
    detail:
      '"Shorter, no hedging" appears in 9 of the last 14 chats in your Support Triage project. Put it in that project\'s Instructions.',
    action: "Add to Instructions",
    meta: "9 of 14",
  },
  {
    id: "i6",
    kind: "task",
    title: "You check the deploy changelog every morning",
    detail: "A 8:30am task could summarize overnight changes before you ask.",
    action: "Schedule it",
    meta: "13 days",
  },
];

export const VIEW_FOR: Record<InsightKind, "chat" | "scheduled" | "projects"> = {
  skill: "chat",
  task: "scheduled",
  project: "projects",
  prompt: "projects",
};

export const STEPS: Record<InsightKind, RunSteps> = {
  skill: {
    steps: ["Updating…", "Reading 4 conversations", "Drafting skill definition", "Validating"],
    done: "Skill created",
  },
  task: {
    steps: ["Updating…", "Reading the request", "Scheduling", "Validating"],
    done: "Task scheduled",
  },
  project: {
    steps: ["Updating…", "Creating project", "Moving chats", "Attaching files"],
    done: "Project created",
  },
  prompt: {
    steps: ["Updating…", "Drafting instruction", "Updating Instructions", "Validating"],
    done: "Instructions updated",
  },
};

export const FILTER_BLURBS: Record<InsightFilter, string> = {
  all: "Patterns spotted across your chats, with the feature that would handle them.",
  skill:
    "Skills save a way of working — a format, a structure, a set of rules — so Claude applies it on demand instead of you restating it each time.",
  task: "Scheduled Tasks run a prompt on a cadence you set and post the result back in chat, without you starting the conversation.",
  project:
    "Projects keep related chats, files, and instructions in one place, so Claude has the same context every time you work there.",
  prompt: "Patterns spotted across your chats, with the feature that would handle them.",
};

export const FILTERS: FilterDef[] = [
  { id: "all", label: "All" },
  { id: "skill", label: "Skills" },
  { id: "task", label: "Tasks" },
  { id: "project", label: "Projects" },
];

export const KIND_COLORS: Record<InsightKind, { bg: string; fg: string }> = {
  skill: { bg: "oklch(0.32 0.05 175)", fg: "oklch(0.86 0.09 175)" },
  task: { bg: "oklch(0.33 0.05 75)", fg: "oklch(0.88 0.1 75)" },
  project: { bg: "oklch(0.32 0.05 280)", fg: "oklch(0.86 0.08 280)" },
  prompt: { bg: "oklch(0.3 0.01 60)", fg: "oklch(0.82 0.006 60)" },
};

const PROJECTS_DOC = "https://support.claude.com/en/articles/9517075-what-are-projects";

export const KIND_DOCS: Record<InsightKind, string> = {
  skill: "https://support.claude.com/en/articles/12512176-what-are-skills",
  task: "https://code.claude.com/docs/en/scheduled-tasks",
  project: PROJECTS_DOC,
  prompt: PROJECTS_DOC,
};

/** Default static InsightSource — swap for a real detection pass later. */
export const staticInsightSource: InsightSource = {
  list: () => INSIGHTS,
};

/** Default no-op InsightActions — the prototype's accept/dismiss run entirely
 * as local UI state (see Workspace's step-run simulation). A real
 * implementation can hook API calls here without touching the components. */
export const staticInsightActions: InsightActions = {
  accept: () => {},
  dismiss: () => {},
};
