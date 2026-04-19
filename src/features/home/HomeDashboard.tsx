type HomeBrief = {
  id: string;
  title: string;
  createdAt: string;
};

type HomeReport = {
  id: string;
  title: string;
  meta: string;
};

type HomePreset = {
  id: string;
  name: string;
  meta: string;
};

type HomeProject = {
  id: string;
  title: string;
  kind: "brief" | "channel-report" | "channel-preset" | "workspace";
  createdAt: string;
};

function formatProjectKind(kind: HomeProject["kind"]) {
  if (kind === "channel-report") return "Channel Report";
  if (kind === "channel-preset") return "Channel Preset";
  if (kind === "workspace") return "Workspace";
  return "Brief";
}

type HomeDashboardProps = {
  projectCount: number;
  recentProjects: HomeProject[];
  recentBriefs: HomeBrief[];
  recentReports: HomeReport[];
  recentPresets: HomePreset[];
  formatCreatedAt: (value: string) => string;
  onLoadProject: (id: string) => void;
  onLoadBrief: (id: string) => void;
  onLoadPreset: (id: string) => void;
  onLoadReport: (id: string) => void;
  onOpenChannelLab: () => void;
  onOpenCompareReports: () => void;
  onOpenAnalytics: () => void;
  onOpenLibrary: () => void;
  onOpenProjects: () => void;
  onOpenVideoIntel: () => void;
};

function renderHomeActionIcon(kind: "video" | "clone" | "library" | "projects" | "analytics" | "compare") {
  if (kind === "video") {
    return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="6.7" /><path d="M10.1 9.2l4.7 2.8-4.7 2.8z" strokeLinejoin="round" /></svg>;
  }
  if (kind === "clone") {
    return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="5.5" y="8" width="8.5" height="10" rx="1.8" /><rect x="10" y="5.5" width="8.5" height="10" rx="1.8" /></svg>;
  }
  if (kind === "library") {
    return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M6 4.8h12a1.6 1.6 0 0 1 1.6 1.6v13.8L12 17l-7.6 3.2V6.4A1.6 1.6 0 0 1 6 4.8z" strokeLinejoin="round" /></svg>;
  }
  if (kind === "projects") {
    return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M4.5 8.7h6.3l1.8 2.3h7v8a1.6 1.6 0 0 1-1.6 1.6H6.1A1.6 1.6 0 0 1 4.5 19z" strokeLinejoin="round" /><path d="M4.5 8.7V6.9a1.6 1.6 0 0 1 1.6-1.6h3.8l1.5 1.7" strokeLinecap="round" /></svg>;
  }
  if (kind === "analytics") {
    return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M6 18.5v-5.5M12 18.5V9M18 18.5V6.5" strokeLinecap="round" /><path d="M5 18.5h14" strokeLinecap="round" /></svg>;
  }
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="5" y="5.2" width="5.8" height="13.6" rx="1.4" /><rect x="13.2" y="5.2" width="5.8" height="13.6" rx="1.4" /></svg>;
}

function renderHomeCipherCore() {
  return (
    <svg viewBox="0 0 64 64" fill="none">
      <circle cx="32" cy="32" r="20" stroke="currentColor" strokeOpacity="0.22" strokeWidth="3" />
      <path d="M42.5 18.5A16 16 0 1 0 42.5 45.5" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
      <circle cx="45" cy="24.5" r="3.7" fill="currentColor" fillOpacity="0.96" />
      <path d="M35.5 42L42.2 38.9" stroke="currentColor" strokeOpacity="0.55" strokeWidth="2.6" strokeLinecap="round" />
    </svg>
  );
}

export function HomeDashboard({
  projectCount,
  recentProjects,
  recentBriefs,
  recentReports,
  recentPresets,
  formatCreatedAt,
  onLoadProject,
  onLoadBrief,
  onLoadPreset,
  onLoadReport,
  onOpenChannelLab,
  onOpenCompareReports,
  onOpenAnalytics,
  onOpenLibrary,
  onOpenProjects,
  onOpenVideoIntel,
}: HomeDashboardProps) {
  const actionItems = [
    {
      accentClass: "is-video" as const,
      icon: "video" as const,
      title: "Video Intel",
      eyebrow: "Single Video",
      description: "Pull transcript, analyze hooks, packaging, timestamps, and export a polished brief.",
      onClick: onOpenVideoIntel,
    },
    {
      accentClass: "is-clone" as const,
      icon: "clone" as const,
      title: "Channel Clone",
      eyebrow: "Strategy",
      description: "Build clone-first plans, inspect winning videos, and generate an action-ready strategy deck.",
      onClick: onOpenChannelLab,
    },
    {
      accentClass: "is-library" as const,
      icon: "library" as const,
      title: "Library",
      eyebrow: "Saved Assets",
      description: "Jump back into saved briefs, channel reports, and presets without rebuilding them.",
      onClick: onOpenLibrary,
    },
    {
      accentClass: "is-projects" as const,
      icon: "projects" as const,
      title: "Projects",
      eyebrow: "Workspace",
      description: "Open the dedicated project hub for saved workspaces, briefs, reports, and presets.",
      onClick: onOpenProjects,
    },
    {
      accentClass: "is-analytics" as const,
      icon: "analytics" as const,
      title: "Studio Analytics",
      eyebrow: "Performance",
      description: "Overlay CTR, impressions, retention, and traffic-source data onto the feeds you already loaded.",
      onClick: onOpenAnalytics,
    },
    {
      accentClass: "is-compare" as const,
      icon: "compare" as const,
      title: "Compare Reports",
      eyebrow: "Competition",
      description: "Surface saved competitive audits fast and reopen the strongest channel models.",
      onClick: onOpenCompareReports,
    },
  ];

  return (
    <div className="workspace-grid shell-workspace-grid">
      <section className="workspace-main">
        <section className="home-command-center">
          <div className="section-header home-command-center-copy">
            <div>
              <h2>Cipher Command Center</h2>
              <p>Start from the department you need, then keep outputs organized as reusable assets.</p>
            </div>
            <span className="meta-text">{projectCount} Total Saved Assets</span>
          </div>
          <div className="home-action-grid">
            {actionItems.map((action) => (
              <button key={action.title} type="button" className={`home-action-card ${action.accentClass}`} onClick={action.onClick}>
                <span className="home-action-crown" aria-hidden="true">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M2 10h10M2 10L1 4l3.5 3L7 1l2.5 6L13 4l-1 6H2z" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <div className="home-action-icon-shell" aria-hidden="true">
                  <span className="home-action-icon-aura" />
                  <span className="home-action-icon-orbit" />
                  <div className="home-action-icon-core">
                    {renderHomeCipherCore()}
                  </div>
                  <div className="home-action-icon-badge">
                    {renderHomeActionIcon(action.icon)}
                  </div>
                </div>
                <span className="home-action-eyebrow">{action.eyebrow}</span>
                <div className="home-action-head">
                  <strong>{action.title}</strong>
                </div>
                <span className="home-action-description">{action.description}</span>
                <div className="home-action-foot">
                  <span className="home-action-meta">Last used: Never</span>
                  <span className="home-action-cta">OPEN</span>
                </div>
              </button>
            ))}
          </div>
        </section>
      </section>
    </div>
  );
}
