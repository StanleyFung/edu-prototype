"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import ChatView from "./ChatView";
import ProjectsView from "./ProjectsView";
import ProjectView from "./ProjectView";
import InstructionsModal from "./InstructionsModal";
import ScheduledView from "./ScheduledView";
import InsightsPanel from "./InsightsPanel";
import InsightBlock from "./InsightBlock";
import Toast from "./Toast";
import {
  BASE_TASKS,
  DIGEST_SKILL,
  DRAFT,
  FILTER_BLURBS,
  FILTERS,
  FOLLOW_UP,
  MESSAGES,
  NEW_INSIGHT,
  PROJECTS,
  RECENTS,
  SKILLS,
  STEPS,
  TRIAGE_INSTRUCTIONS,
  VENDOR_FILES,
  VENDOR_PROJECT,
  VIEW_FOR,
  staticInsightActions,
  staticInsightSource,
} from "@/lib/data";
import type {
  ChatMessage,
  Insight,
  InsightActions,
  InsightFilter,
  InsightKind,
  InsightSource,
  InsightSurface,
  ProjectDetailSection,
  RunState,
  Skill,
  Task,
} from "@/lib/types";

type View = "chat" | "projects" | "project" | "scheduled";

interface WorkspaceProps {
  source?: InsightSource;
  actions?: InsightActions;
  insightSurface?: InsightSurface;
}

export default function Workspace({
  source = staticInsightSource,
  actions = staticInsightActions,
  insightSurface = "panel",
}: WorkspaceProps) {
  const [allInsights, setAllInsights] = useState<Insight[]>([]);
  const [view, setView] = useState<View>("chat");
  const [insightsOpen, setInsightsOpen] = useState(false);
  const [filter, setFilter] = useState<InsightFilter>("all");
  const [dismissed, setDismissed] = useState<string[]>([]);
  const [resolved, setResolved] = useState<string[]>([]);
  const [runs, setRuns] = useState<Record<string, RunState>>({});
  const [skillsOpen, setSkillsOpen] = useState(false);
  const [activeSkills, setActiveSkills] = useState<string[]>([]);
  const [createdSkills, setCreatedSkills] = useState<Skill[]>([]);
  const [taskOff, setTaskOff] = useState<number[]>([]);
  const [extraTasks, setExtraTasks] = useState<Task[]>([]);
  const [hoverTarget, setHoverTarget] = useState<InsightKind | null>(null);
  const [draft, setDraft] = useState(DRAFT);
  const [sent, setSent] = useState(false);
  const [sentText, setSentText] = useState("");
  const [replied, setReplied] = useState(false);
  const [newInsight, setNewInsight] = useState(false);
  const [intercepted, setIntercepted] = useState(false);
  const [badgeBounce, setBadgeBounce] = useState(false);
  const [openProject, setOpenProject] = useState<string | null>(null);
  const [instrEdits, setInstrEdits] = useState<Record<string, string>>({});
  const [instrModal, setInstrModal] = useState(false);
  const [instrDraft, setInstrDraft] = useState("");
  const [projDraft, setProjDraft] = useState("");
  const [instructionsAdded, setInstructionsAdded] = useState(false);
  const [projectCreated, setProjectCreated] = useState(false);
  const [flashedSection, setFlashedSection] = useState<ProjectDetailSection | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const runTimeouts = useRef<ReturnType<typeof setTimeout>[]>([]);
  const hoverTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const flashTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const toastTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const threadRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

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
      if (flashTimeout.current) clearTimeout(flashTimeout.current);
      if (toastTimeout.current) clearTimeout(toastTimeout.current);
    };
  }, []);

  function grow() {
    const el = inputRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 340) + "px";
  }

  useEffect(() => {
    grow();
    const t1 = setTimeout(grow, 60);
    const t2 = setTimeout(grow, 400);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  function scrollThread() {
    const el = threadRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }

  function flashToast(msg: string) {
    if (toastTimeout.current) clearTimeout(toastTimeout.current);
    setToast(msg);
    toastTimeout.current = setTimeout(() => setToast(null), 2600);
  }

  function flashSection(which: ProjectDetailSection) {
    if (flashTimeout.current) clearTimeout(flashTimeout.current);
    setFlashedSection(which);
    flashTimeout.current = setTimeout(() => setFlashedSection(null), 2600);
  }

  function send() {
    const text = draft.trim();
    if (!text || sent) return;
    setDraft("");
    setSent(true);
    setSentText(text);
    requestAnimationFrame(() => {
      grow();
      scrollThread();
    });

    if (insightSurface === "intercept") {
      setTimeout(() => {
        setIntercepted(true);
        requestAnimationFrame(() => scrollThread());
      }, 700);
      return;
    }

    setTimeout(() => {
      setReplied(true);
      requestAnimationFrame(() => scrollThread());
    }, 700);
    setTimeout(() => {
      setNewInsight(true);
      setInsightsOpen(false);
      requestAnimationFrame(() => scrollThread());
      if (insightSurface !== "panel") return;
      setBadgeBounce(true);
      setTimeout(() => setBadgeBounce(false), 1900);
    }, 1000);
  }

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
        if (insight.kind === "skill") {
          setCreatedSkills((prev) => prev.concat([DIGEST_SKILL]));
          setActiveSkills((prev) => prev.concat(DIGEST_SKILL.id));
        }
        if (insight.kind === "project") setProjectCreated(true);
        if (insight.kind === "prompt") setInstructionsAdded(true);
        Promise.resolve(actions.accept(insight)).catch(() => {});
      }, def.steps.length * 780)
    );
  }

  function inlineStart(insight: Insight) {
    start(insight);
    if (insightSurface !== "intercept") return;
    const def = STEPS[insight.kind];
    runTimeouts.current.push(
      setTimeout(() => {
        flashToast("Skill created — applied to this response");
        setReplied(true);
        requestAnimationFrame(() => scrollThread());
      }, def.steps.length * 780 + 900)
    );
  }

  function inlineDismiss(insight: Insight) {
    setDismissed((prev) => prev.concat(insight.id));
    if (insightSurface === "intercept") {
      setReplied(true);
      requestAnimationFrame(() => scrollThread());
    }
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
    const go: View = { task: "scheduled", project: "project", prompt: "project", skill: "chat" }[
      insight.kind
    ] as View;
    if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
    setView(go);
    setInsightsOpen(false);
    setHoverTarget(null);
    setSkillsOpen(insight.kind === "skill");
    setDismissed((prev) => prev.concat(insight.id));
    if (insight.kind === "project") {
      setOpenProject("vendor");
      flashSection("context");
    }
    if (insight.kind === "prompt") {
      setOpenProject("triage");
      flashSection("instructions");
    }
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
  }

  function removeSkill(id: string) {
    setActiveSkills((prev) => prev.filter((x) => x !== id));
  }

  function toggleTask(idx: number) {
    setTaskOff((prev) => (prev.includes(idx) ? prev.filter((x) => x !== idx) : prev.concat(idx)));
  }

  function openProjectDetail(id: string) {
    setView("project");
    setOpenProject(id);
    setSkillsOpen(false);
  }

  const insightPool = useMemo(
    () => (newInsight ? [NEW_INSIGHT, ...allInsights] : allInsights),
    [newInsight, allInsights]
  );
  const open = useMemo(() => insightPool.filter((i) => !dismissed.includes(i.id)), [insightPool, dismissed]);
  const unresolved = useMemo(() => open.filter((i) => !resolved.includes(i.id)), [open, resolved]);
  const visibleInsights = useMemo(
    () => open.filter((i) => filter === "all" || i.kind === filter),
    [open, filter]
  );

  const inlineCandidate = useMemo(() => {
    if (dismissed.includes(NEW_INSIGHT.id)) return null;
    if (insightSurface === "intercept") {
      return intercepted && !replied ? NEW_INSIGHT : null;
    }
    if (insightSurface === "inline") {
      return newInsight ? NEW_INSIGHT : null;
    }
    return null;
  }, [insightSurface, intercepted, replied, newInsight, dismissed]);
  const inlineRun = inlineCandidate ? runs[inlineCandidate.id] : null;
  const inlinePhase = inlineRun ? inlineRun.phase : "idle";
  const inlineWaiting = insightSurface === "intercept" && inlinePhase === "idle";
  const inlineStatusText = inlineRun
    ? (inlinePhase === "done" ? STEPS[inlineCandidate!.kind].done : STEPS[inlineCandidate!.kind].steps[inlineRun.step])
    : inlineWaiting
      ? "Waiting for your input — the response is paused"
      : "";

  const baseTasks = useMemo(() => BASE_TASKS.concat(extraTasks), [extraTasks]);
  const skills = useMemo(() => createdSkills.concat(SKILLS), [createdSkills]);
  const chatMessages = useMemo<ChatMessage[]>(() => {
    const msgs = MESSAGES.slice();
    if (sent) msgs.push({ role: "user", text: sentText });
    if (replied) msgs.push(FOLLOW_UP);
    return msgs;
  }, [sent, sentText, replied]);

  const allProjects = useMemo(
    () => (projectCreated ? [VENDOR_PROJECT] : []).concat(PROJECTS),
    [projectCreated]
  );
  const currentProject = useMemo(
    () => allProjects.find((p) => p.id === openProject) ?? null,
    [allProjects, openProject]
  );
  const baseInstructions =
    currentProject?.id === "triage" && instructionsAdded ? TRIAGE_INSTRUCTIONS : "";
  const instrText =
    currentProject && instrEdits[currentProject.id] !== undefined
      ? instrEdits[currentProject.id]
      : baseInstructions;
  const contextFiles = currentProject?.id === "vendor" ? VENDOR_FILES : [];

  const hv = hoverTarget;
  const headerTitle =
    view === "chat"
      ? "Weekly digest for the platform team"
      : view === "projects"
        ? "Projects"
        : view === "project"
          ? (currentProject?.name ?? "Project")
          : "Scheduled";

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
        highlightedProjectId={hv === "project" && projectCreated ? "vendor" : null}
        scheduledHighlighted={hv === "task"}
        newChatHighlighted={hv === "skill"}
        projects={allProjects}
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
        onOpenProject={openProjectDetail}
      />

      <main className="flex-1 min-w-0 flex flex-col relative">
        <Header
          title={headerTitle}
          blurred={Boolean(hv)}
          insightsOpen={insightsOpen}
          unreadCount={insightSurface === "panel" ? unresolved.length : 0}
          badgeBounce={badgeBounce}
          onToggleInsights={() => setInsightsOpen((v) => !v)}
        />

        {view === "chat" && (
          <ChatView
            messages={chatMessages}
            blurred={Boolean(hv)}
            composerBlurred={Boolean(hv) && hv !== "skill"}
            skillsOpen={skillsOpen}
            skills={skills}
            activeSkills={activeSkills}
            plusHighlighted={hv === "skill"}
            draft={draft}
            threadRef={threadRef}
            inputRef={inputRef}
            onOpenSkills={() => {
              setView("chat");
              setSkillsOpen((v) => !v);
            }}
            onCloseSkills={() => setSkillsOpen(false)}
            onToggleSkill={toggleSkill}
            onRemoveSkill={removeSkill}
            onDraftChange={(value) => {
              setDraft(value);
              requestAnimationFrame(grow);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send();
              }
            }}
            onSend={send}
            showBulb={insightSurface === "panel" && newInsight && !dismissed.includes(NEW_INSIGHT.id)}
            onOpenInsights={() => setInsightsOpen(true)}
            inlineInsight={
              inlineCandidate && (
                <InsightBlock
                  insight={inlineCandidate}
                  phase={inlinePhase}
                  statusText={inlineStatusText}
                  waiting={inlineWaiting}
                  secondaryLabel={insightSurface === "intercept" ? "Ignore and continue" : "Not now"}
                  onStart={() => inlineStart(inlineCandidate)}
                  onView={() => viewInsight(inlineCandidate)}
                  onDismiss={() => inlineDismiss(inlineCandidate)}
                />
              )
            }
          />
        )}

        {view === "projects" && (
          <ProjectsView
            projects={allProjects}
            blurred={Boolean(hv)}
            onOpenProject={openProjectDetail}
            onNewProject={() => flashToast("Prototype — project creation isn't wired up")}
            onNoop={() => flashToast("Prototype — this control isn't wired up")}
          />
        )}

        {view === "project" && currentProject && (
          <ProjectView
            project={currentProject}
            instructions={instrText}
            files={contextFiles}
            flashSection={flashedSection}
            draft={projDraft}
            blurred={Boolean(hv)}
            onBack={() => setView("projects")}
            onDraftChange={setProjDraft}
            onOpenInstructions={() => {
              setInstrDraft(instrText);
              setInstrModal(true);
            }}
            onNoop={() => flashToast("Prototype — this control isn't wired up")}
          />
        )}

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
        blurb={FILTER_BLURBS[filter]}
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

      {instrModal && currentProject && (
        <InstructionsModal
          draft={instrDraft}
          onDraftChange={setInstrDraft}
          onCancel={() => setInstrModal(false)}
          onSave={() => {
            setInstrEdits((prev) => ({ ...prev, [currentProject.id]: instrDraft }));
            setInstrModal(false);
          }}
        />
      )}

      <Toast message={toast} />
    </div>
  );
}
