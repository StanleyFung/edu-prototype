export type InsightKind = "skill" | "task" | "project" | "prompt";
export type InsightFilter = "all" | InsightKind;

export type RunPhase = "idle" | "running" | "done";

export interface Insight {
  id: string;
  kind: InsightKind;
  title: string;
  detail: string;
  action: string;
  meta: string;
}

export interface RunState {
  phase: "running" | "done";
  step: number;
}

export interface RunSteps {
  steps: string[];
  done: string;
}

export interface Project {
  id: string;
  name: string;
  dot: string;
  desc: string;
  meta: string;
}

export interface ProjectFile {
  name: string;
  meta: string;
}

export type ProjectDetailSection = "instructions" | "context";

export interface Skill {
  id: string;
  name: string;
  desc: string;
}

export interface ChatMessage {
  role: "user" | "ai";
  text: string;
}

export interface Task {
  name: string;
  cadence: string;
  next: string;
}

export interface FilterDef {
  id: InsightFilter;
  label: string;
}

/** Seam: where insights come from. Static today; a real pattern-detection
 * pass can implement this later without touching any component. */
export interface InsightSource {
  list(): Promise<Insight[]> | Insight[];
}

/** Seam: what happens when a user acts on an insight. Static/simulated
 * today; real accept/dismiss flows can implement this later. */
export interface InsightActions {
  accept(insight: Insight): Promise<void> | void;
  dismiss(insight: Insight): Promise<void> | void;
}
