"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import ChatView from "./ChatView";
import ProjectsView from "./ProjectsView";
import ScheduledView from "./ScheduledView";
import InsightsPanel from "./InsightsPanel";
import Toast from "./Toast";
import {
  BASE_TASKS,
  FILTERS,
  MESSAGES,
  PROJECTS,
  RECENTS,
  SKILLS,
  STEPS,
  VIEW_FOR,
  staticInsightActions,
  staticInsightSource,
} from "@/lib/data";
import type { Insight, InsightActions, InsightFilter, InsightKind, InsightSource, RunState, Task } from "@/lib/types";

type View = "chat" | "projects" | "scheduled";

interface WorkspaceProps {
  source?: InsightSource;
  actions?: InsightActions;
}

export default function Workspace({
  source = staticInsightSource,
  actions = staticInsightActions,
}: WorkspaceProps) {
  const [allInsights, setAllInsights] = useState<Insight[]>([]);
  const [view, setView] = useState<View>("chat");
  const [insightsOpen, setInsightsOpen] = useState(false);
  const [filter, setFilter] = useState<InsightFilter>("all");
  const [dismissed, setDismissed] = useState<string[]>([]);
  const [resolved, setResolved] = useState<string[]>([]);
  const [runs, setRuns] = useState<Record<string, RunState>>({});
  const [skillsOpen, setSkillsOpen] = useState(false);
  const [activeSkills, setActiveSkills] = useState<string[]>(["digest"]);
  const [taskOff, setTaskOff] = useState<number[]>([]);
  const [extraTasks, setExtraTasks] = useState<Task[]>([]);
  const [showSkillRun, setShowSkillRun] = useState(false);
  const [hoverTarget, setHoverTarget] = useState<InsightKind | null>(null);
  const [toast] = useState<string | null>(null);

  const runTimeouts = useRef<ReturnType<typeof setTimeout>[]>([]);
  const hoverTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let cancelled = false;
    Promise.resolve(source.list()).then((list) => {
      if (!cancelled) setAllInsights(list);
    });
    return () => {
      cancelled = true;
    };
  }, [source]);

  useEffect(() => {
    const timeouts = runTimeouts.current;
    return () => {
      timeouts.forEach(clearTimeout);
      if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
    };
  }, []);

  function setRun(id: string, val: RunState) {
    setRuns((prev) => ({ ...prev, [id]: val }));
  }

  function start(insight: Insight) {
    if (runs[insight.id]) return;
    const def = STEPS[insight.kind];
    setRun(insight.id, { phase: "running", step: 0 });
    def.steps.slice(1).forEach((_, i) => {
      runTimeouts.current.push(
        setTimeout(() => setRun(insight.id, { phase: "running", step: i + 1 }), (i + 1) * 780)
      );
    });
    runTimeouts.current.push(
      setTimeout(() => {
        setRun(insight.id, { phase: "done", step: def.steps.length - 1 });
        setResolved((prev) => prev.concat(insight.id));
        if (insight.kind === "task") {
          setExtraTasks((prev) =>
            prev.concat([{ name: insight.title, cadence: "Mondays at 9:00am", next: "in 3 days" }])
          );
        }
        Promise.resolve(actions.accept(insight)).catch(() => {});
      }, def.steps.length * 780)
    );
  }

  function hoverTo(kind: InsightKind) {
    if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
    setHoverTarget(kind);
    const dest = VIEW_FOR[kind];
    if (dest && dest !== view) {
      hoverTimeout.current = setTimeout(() => setView(dest), 620);
    }
  }

  function hoverEnd() {
    if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
    setHoverTarget(null);
  }

  function viewInsight(insight: Insight) {
    const go: View = { task: "scheduled", project: "projects", prompt: "projects", skill: "chat" }[
      insight.kind
    ] as View;
    if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
    setView(go);
    setInsightsOpen(false);
    setHoverTarget(null);
    setSkillsOpen(insight.kind === "skill");
    setDismissed((prev) => prev.concat(insight.id));
  }

  function dismissInsight(insight: Insight) {
    setDismissed((prev) => prev.concat(insight.id));
    Promise.resolve(actions.dismiss(insight)).catch(() => {});
  }

  function dismissAll() {
    setDismissed(allInsights.map((i) => i.id));
  }

  function toggleSkill(id: string) {
    const on = activeSkills.includes(id);
    setActiveSkills((prev) => (on ? prev.filter((x) => x !== id) : prev.concat(id)));
    setShowSkillRun(!on);
  }

  function removeSkill(id: string) {
    setActiveSkills((prev) => prev.filter((x) => x !== id));
    setShowSkillRun(false);
  }

  function toggleTask(idx: number) {
    setTaskOff((prev) => (prev.includes(idx) ? prev.filter((x) => x !== idx) : prev.concat(idx)));
  }

  const open = useMemo(() => allInsights.filter((i) => !dismissed.includes(i.id)), [allInsights, dismissed]);
  const unresolved = useMemo(() => open.filter((i) => !resolved.includes(i.id)), [open, resolved]);
  const visibleInsights = useMemo(
    () => open.filter((i) => filter === "all" || i.kind === filter),
    [open, filter]
  );

  const baseTasks = useMemo(() => BASE_TASKS.concat(extraTasks), [extraTasks]);

  const hv = hoverTarget;
  const headerTitle = view === "chat" ? "Weekly digest for the platform team" : view === "projects" ? "Projects" : "Scheduled";

  function stepStatusText(insight: Insight): string {
    const run = runs[insight.id];
    if (!run) return "";
    const def = STEPS[insight.kind];
    return run.phase === "done" ? def.done : def.steps[run.step];
  }

  return (
    <div className="flex h-screen w-full overflow-hidden bg-canvas text-ink text-sm relative font-sans">
      <Sidebar
        view={view}
        blurred={Boolean(hv)}
        projectPreviewHighlighted={hv === "project" || hv === "prompt"}
        scheduledHighlighted={hv === "task"}
        newChatHighlighted={hv === "skill"}
        projects={PROJECTS}
        recents={RECENTS}
        onGoChat={() => setView("chat")}
        onGoProjects={() => {
          setView("projects");
          setSkillsOpen(false);
        }}
        onGoScheduled={() => {
          setView("scheduled");
          setSkillsOpen(false);
        }}
      />

      <main className="flex-1 min-w-0 flex flex-col relative">
        <Header
          title={headerTitle}
          blurred={Boolean(hv)}
          insightsOpen={insightsOpen}
          unreadCount={unresolved.length}
          onToggleInsights={() => setInsightsOpen((v) => !v)}
        />

        {view === "chat" && (
          <ChatView
            messages={MESSAGES}
            showSkillRun={showSkillRun}
            blurred={Boolean(hv)}
            composerBlurred={Boolean(hv) && hv !== "skill"}
            skillsOpen={skillsOpen}
            skills={SKILLS}
            activeSkills={activeSkills}
            plusHighlighted={hv === "skill"}
            onOpenSkills={() => {
              setView("chat");
              setSkillsOpen((v) => !v);
            }}
            onToggleSkill={toggleSkill}
            onRemoveSkill={removeSkill}
          />
        )}

        {view === "projects" && <ProjectsView projects={PROJECTS} blurred={Boolean(hv)} />}

        {view === "scheduled" && (
          <ScheduledView tasks={baseTasks} taskOff={taskOff} blurred={Boolean(hv)} onToggleTask={toggleTask} />
        )}

        {insightsOpen && (
          <div
            onClick={() => setInsightsOpen(false)}
            className="absolute inset-0 bg-[oklch(0.12_0_0_/_0.5)] z-30"
          />
        )}
      </main>

      <InsightsPanel
        open={insightsOpen}
        openCount={unresolved.length}
        filters={FILTERS}
        activeFilter={filter}
        visibleInsights={visibleInsights}
        runs={runs}
        stepStatusText={stepStatusText}
        onClose={() => setInsightsOpen(false)}
        onPickFilter={setFilter}
        onStart={start}
        onView={viewInsight}
        onDismiss={dismissInsight}
        onHoverStart={(insight) => hoverTo(insight.kind)}
        onHoverEnd={hoverEnd}
        onDismissAll={dismissAll}
      />

      <Toast message={toast} />
    </div>
  );
}
