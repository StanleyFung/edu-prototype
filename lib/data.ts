import type {
  ChatMessage,
  FilterDef,
  Insight,
  InsightActions,
  InsightKind,
  InsightSource,
  Project,
  RunSteps,
  Skill,
  Task,
} from "./types";

export const PROJECTS: Project[] = [
  {
    name: "Education Prototype Brainstorming",
    dot: "oklch(0.7 0.1 280)",
    desc: "Concepts and research for the K-12 pilot.",
    meta: "12 chats · 4 files",
  },
  {
    name: "Q3 Reporting",
    dot: "oklch(0.75 0.11 175)",
    desc: "Weekly digests, metrics pulls, exec summaries.",
    meta: "8 chats · 11 files",
  },
  {
    name: "Support Triage",
    dot: "oklch(0.78 0.12 75)",
    desc: "Ticket clustering and response drafting.",
    meta: "23 chats · 2 files",
  },
  {
    name: "Hiring Loop",
    dot: "oklch(0.68 0.06 60)",
    desc: "Rubrics, debrief notes, scorecard drafts.",
    meta: "5 chats",
  },
];

export const RECENTS: string[] = [
  "Weekly digest for the platform team",
  "Rewrite onboarding email sequence",
  "Compare vendor SOC 2 reports",
  "Summarize Monday's design review",
  "Draft standup notes from transcript",
  "Untitled",
];

export const SKILLS: Skill[] = [
  { id: "digest", name: "Weekly Digest", desc: "Rolls sources into a fixed summary format" },
  { id: "triage", name: "Ticket Triage", desc: "Clusters tickets and drafts replies" },
  { id: "brief", name: "Research Brief", desc: "Sourced findings, three-section output" },
  { id: "notes", name: "Meeting Notes", desc: "Decisions, owners, open questions" },
];

export const MESSAGES: ChatMessage[] = [
  {
    role: "user",
    text: "Can you pull together the weekly digest for the platform team again? Same format as last time.",
  },
  {
    role: "ai",
    text: "Here's this week's digest across the three sources you usually include.\n\nShipped: queue retries, audit-log export, two schema migrations.\nIn review: rate-limit rewrite (blocked on load test), SSO group sync.\nRisks: the migration backlog is growing faster than it's draining.",
  },
  {
    role: "user",
    text: "Great. Do the same thing next Monday and every Monday after that.",
  },
];

export const BASE_TASKS: Task[] = [
  { name: "Platform weekly digest", cadence: "Mondays at 9:00am", next: "in 3 days" },
  { name: "Overnight deploy changelog", cadence: "Weekdays at 8:30am", next: "tomorrow" },
  { name: "Support backlog sweep", cadence: "Fridays at 4:00pm", next: "in 7 days" },
];

export const INSIGHTS: Insight[] = [
  {
    id: "i1",
    kind: "skill",
    title: "You've requested the same digest format in four chats",
    detail: "Saving it as a Skill means you stop restating the format every Monday.",
    action: "Create skill",
    meta: "4 chats",
  },
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
    detail: "A Project would hold the files once instead of re-uploading them per chat.",
    action: "Create project",
    meta: "6 chats",
  },
  {
    id: "i4",
    kind: "prompt",
    title: "You correct tone the same way most sessions",
    detail: '"Shorter, no hedging" appears in 9 of your last 14 chats. Put it in your prompt.md.',
    action: "Add to prompt.md",
    meta: "9 of 14",
  },
  {
    id: "i5",
    kind: "skill",
    title: "Your triage replies follow a consistent four-part shape",
    detail: "Turning it into a Skill would keep the structure stable across teammates.",
    action: "Create skill",
    meta: "11 chats",
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
    steps: ["Updating…", "Drafting instruction", "Updating prompt.md", "Validating"],
    done: "prompt.md updated",
  },
};

export const FILTERS: FilterDef[] = [
  { id: "all", label: "All" },
  { id: "skill", label: "Skills" },
  { id: "task", label: "Tasks" },
  { id: "project", label: "Projects" },
  { id: "prompt", label: "prompt.md" },
];

export const KIND_COLORS: Record<InsightKind, { bg: string; fg: string }> = {
  skill: { bg: "oklch(0.32 0.05 175)", fg: "oklch(0.86 0.09 175)" },
  task: { bg: "oklch(0.33 0.05 75)", fg: "oklch(0.88 0.1 75)" },
  project: { bg: "oklch(0.32 0.05 280)", fg: "oklch(0.86 0.08 280)" },
  prompt: { bg: "oklch(0.3 0.01 60)", fg: "oklch(0.82 0.006 60)" },
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
