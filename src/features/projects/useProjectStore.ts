import { useEffect, useMemo, useState } from "react";

export const PROJECTS_STORAGE_KEY = "cipher-lens/projects";

export type ProjectKind = "brief" | "channel-report" | "channel-preset" | "workspace";

export type WorkspaceProject<TPayload = unknown> = {
  id: string;
  kind: ProjectKind;
  title: string;
  createdAt: string;
  updatedAt: string;
  payload: TPayload;
};

type ProjectSnapshot = {
  createdAt: string;
  id: string;
  payload: unknown;
  title: string;
  updatedAt?: string;
};

type ProjectCollections<TBrief, TReport, TPreset, TWorkspace> = {
  briefs: TBrief[];
  reports: TReport[];
  presets: TPreset[];
  workspaces: TWorkspace[];
};

type UseProjectStoreOptions<TBrief, TReport, TPreset, TWorkspace> = {
  deserializeBrief: (payload: unknown) => TBrief | null;
  deserializePreset: (payload: unknown) => TPreset | null;
  deserializeReport: (payload: unknown) => TReport | null;
  deserializeWorkspace: (payload: unknown) => TWorkspace | null;
  getBriefSnapshot: (brief: TBrief) => ProjectSnapshot;
  getPresetSnapshot: (preset: TPreset) => ProjectSnapshot;
  getReportSnapshot: (report: TReport) => ProjectSnapshot;
  getWorkspaceSnapshot: (workspace: TWorkspace) => ProjectSnapshot;
  loadLegacyCollections: () => ProjectCollections<TBrief, TReport, TPreset, TWorkspace>;
};

function isProjectKind(value: unknown): value is ProjectKind {
  return value === "brief" || value === "channel-report" || value === "channel-preset" || value === "workspace";
}

function fallbackTitle(kind: ProjectKind) {
  if (kind === "brief") return "Saved Brief";
  if (kind === "channel-report") return "Channel Report";
  if (kind === "channel-preset") return "Selection Preset";
  return "Workspace Snapshot";
}

function normalizeProjectRecord(value: unknown): WorkspaceProject | null {
  if (!value || typeof value !== "object") return null;
  const project = value as Partial<WorkspaceProject>;
  if (!isProjectKind(project.kind)) return null;
  if (typeof project.id !== "string" || !project.id.trim()) return null;

  const createdAt = typeof project.createdAt === "string" ? project.createdAt : new Date().toISOString();
  return {
    id: project.id,
    kind: project.kind,
    title: typeof project.title === "string" && project.title.trim() ? project.title : fallbackTitle(project.kind),
    createdAt,
    updatedAt: typeof project.updatedAt === "string" ? project.updatedAt : createdAt,
    payload: project.payload ?? null,
  };
}

function sortProjectsNewestFirst<TPayload>(projects: WorkspaceProject<TPayload>[]) {
  return [...projects].sort((left, right) => {
    const leftTime = Number(new Date(left.updatedAt || left.createdAt || 0));
    const rightTime = Number(new Date(right.updatedAt || right.createdAt || 0));
    return rightTime - leftTime;
  });
}

function loadProjectsFromStorage<TBrief, TReport, TPreset, TWorkspace>({
  deserializeBrief,
  deserializePreset,
  deserializeReport,
  deserializeWorkspace,
}: Pick<UseProjectStoreOptions<TBrief, TReport, TPreset, TWorkspace>, "deserializeBrief" | "deserializePreset" | "deserializeReport" | "deserializeWorkspace">) {
  try {
    const raw = window.localStorage.getItem(PROJECTS_STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return null;

    const projects = parsed
      .map(normalizeProjectRecord)
      .filter((project): project is WorkspaceProject => project !== null);

    if (projects.length === 0) return null;

    const briefs: TBrief[] = [];
    const reports: TReport[] = [];
    const presets: TPreset[] = [];
    const workspaces: TWorkspace[] = [];

    for (const project of projects) {
      if (project.kind === "brief") {
        const brief = deserializeBrief(project.payload);
        if (brief) briefs.push(brief);
        continue;
      }

      if (project.kind === "channel-report") {
        const report = deserializeReport(project.payload);
        if (report) reports.push(report);
        continue;
      }

      if (project.kind === "channel-preset") {
        const preset = deserializePreset(project.payload);
        if (preset) presets.push(preset);
        continue;
      }

      const workspace = deserializeWorkspace(project.payload);
      if (workspace) workspaces.push(workspace);
    }

    return {
      briefs,
      presets,
      projects: sortProjectsNewestFirst(projects),
      reports,
      workspaces,
    };
  } catch {
    return null;
  }
}

function buildProjectsFromCollections<TBrief, TReport, TPreset, TWorkspace>({
  briefs,
  getBriefSnapshot,
  getPresetSnapshot,
  getReportSnapshot,
  getWorkspaceSnapshot,
  presets,
  reports,
  workspaces,
}: {
  briefs: TBrief[];
  getBriefSnapshot: UseProjectStoreOptions<TBrief, TReport, TPreset, TWorkspace>["getBriefSnapshot"];
  getPresetSnapshot: UseProjectStoreOptions<TBrief, TReport, TPreset, TWorkspace>["getPresetSnapshot"];
  getReportSnapshot: UseProjectStoreOptions<TBrief, TReport, TPreset, TWorkspace>["getReportSnapshot"];
  getWorkspaceSnapshot: UseProjectStoreOptions<TBrief, TReport, TPreset, TWorkspace>["getWorkspaceSnapshot"];
  presets: TPreset[];
  reports: TReport[];
  workspaces: TWorkspace[];
}) {
  const projects: WorkspaceProject[] = [
    ...briefs.map((brief) => {
      const snapshot = getBriefSnapshot(brief);
      return {
        id: snapshot.id,
        kind: "brief" as const,
        title: snapshot.title,
        createdAt: snapshot.createdAt,
        updatedAt: snapshot.updatedAt ?? snapshot.createdAt,
        payload: snapshot.payload,
      };
    }),
    ...reports.map((report) => {
      const snapshot = getReportSnapshot(report);
      return {
        id: snapshot.id,
        kind: "channel-report" as const,
        title: snapshot.title,
        createdAt: snapshot.createdAt,
        updatedAt: snapshot.updatedAt ?? snapshot.createdAt,
        payload: snapshot.payload,
      };
    }),
    ...presets.map((preset) => {
      const snapshot = getPresetSnapshot(preset);
      return {
        id: snapshot.id,
        kind: "channel-preset" as const,
        title: snapshot.title,
        createdAt: snapshot.createdAt,
        updatedAt: snapshot.updatedAt ?? snapshot.createdAt,
        payload: snapshot.payload,
      };
    }),
    ...workspaces.map((workspace) => {
      const snapshot = getWorkspaceSnapshot(workspace);
      return {
        id: snapshot.id,
        kind: "workspace" as const,
        title: snapshot.title,
        createdAt: snapshot.createdAt,
        updatedAt: snapshot.updatedAt ?? snapshot.createdAt,
        payload: snapshot.payload,
      };
    }),
  ];

  return sortProjectsNewestFirst(projects);
}

export function useProjectStore<TBrief, TReport, TPreset, TWorkspace>({
  deserializeBrief,
  deserializePreset,
  deserializeReport,
  deserializeWorkspace,
  getBriefSnapshot,
  getPresetSnapshot,
  getReportSnapshot,
  getWorkspaceSnapshot,
  loadLegacyCollections,
}: UseProjectStoreOptions<TBrief, TReport, TPreset, TWorkspace>) {
  const [initial] = useState(() => {
    const fromProjects = loadProjectsFromStorage({
      deserializeBrief,
      deserializePreset,
      deserializeReport,
      deserializeWorkspace,
    });

    if (fromProjects) {
      return fromProjects;
    }

    const legacy = loadLegacyCollections();
    return {
      ...legacy,
      projects: buildProjectsFromCollections({
        briefs: legacy.briefs,
        getBriefSnapshot,
        getPresetSnapshot,
        getReportSnapshot,
        getWorkspaceSnapshot,
        presets: legacy.presets,
        reports: legacy.reports,
        workspaces: legacy.workspaces,
      }),
    };
  });

  const [briefs, setBriefs] = useState<TBrief[]>(initial.briefs);
  const [savedChannelReports, setSavedChannelReports] = useState<TReport[]>(initial.reports);
  const [savedChannelPresets, setSavedChannelPresets] = useState<TPreset[]>(initial.presets);
  const [workspaceProjects, setWorkspaceProjects] = useState<TWorkspace[]>(initial.workspaces);

  const projects = useMemo(() => buildProjectsFromCollections({
    briefs,
    getBriefSnapshot,
    getPresetSnapshot,
    getReportSnapshot,
    getWorkspaceSnapshot,
    presets: savedChannelPresets,
    reports: savedChannelReports,
    workspaces: workspaceProjects,
  }), [briefs, getBriefSnapshot, getPresetSnapshot, getReportSnapshot, getWorkspaceSnapshot, savedChannelPresets, savedChannelReports, workspaceProjects]);

  useEffect(() => {
    window.localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(projects));
  }, [projects]);

  return {
    briefs,
    projects,
    savedChannelPresets,
    savedChannelReports,
    setBriefs,
    setSavedChannelPresets,
    setSavedChannelReports,
    setWorkspaceProjects,
    workspaceProjects,
  };
}
