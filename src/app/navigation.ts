export type AppView = "home" | "studio" | "channel" | "compare" | "analytics" | "projects" | "library" | "exports" | "settings";
export type ExperienceMode = "basic" | "pro";

export const EXPERIENCE_MODE_LABELS: Record<ExperienceMode, string> = {
  basic: "Basic",
  pro: "Pro",
};

export const APP_VIEW_LABELS: Record<AppView, string> = {
  home: "Home",
  studio: "Video Intel",
  channel: "Channel Lab",
  compare: "Channel Compare",
  analytics: "Studio Analytics",
  projects: "Projects",
  library: "Library",
  exports: "Exports",
  settings: "Settings",
};

export const APP_VIEW_DESCRIPTIONS: Record<AppView, string> = {
  home: "A creator command center for projects, quick starts, and recent work.",
  studio: "Single-video analysis, transcript intelligence, exports, and publishing support.",
  channel: "Clone-first channel plans, compare workflows, sample control, and strategy decks.",
  compare: "Head-to-head channel scoreboards, adaptation guidance, niche modeling, and exportable compare decks.",
  analytics: "YouTube Studio CSV overlays, matched-sample metrics, and per-video packaging versus retention reads.",
  projects: "Unified saved briefs, reports, presets, and workspace snapshots with project-level actions and reopening.",
  library: "Saved briefs, reports, presets, and reusable work assets in one place.",
  exports: "Current brief, clone, and compare deliverables gathered into one export-focused review space.",
  settings: "Workspace defaults, mode controls, and desktop capability status in one place.",
};

export const APP_VIEW_GROUPS: Array<{
  label: string;
  views: AppView[];
}> = [
  { label: "Core", views: ["home"] },
  { label: "Research", views: ["studio", "channel", "compare", "analytics"] },
  { label: "Assets", views: ["projects", "library", "exports"] },
  { label: "System", views: ["settings"] },
];
