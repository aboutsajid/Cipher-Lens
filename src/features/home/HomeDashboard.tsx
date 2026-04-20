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
  const resumeProjects = recentProjects.slice(0, 3);
  const spotlightProject = resumeProjects[0];
  const actionItems = [
    {
      title: "Video Intel",
      eyebrow: "Single Video",
      description: "Pull transcript, analyze hooks, packaging, timestamps, and export a polished brief.",
      onClick: onOpenVideoIntel,
    },
    {
      title: "Channel Clone",
      eyebrow: "Strategy",
      description: "Build clone-first plans, inspect winning videos, and generate an action-ready strategy deck.",
      onClick: onOpenChannelLab,
    },
    {
      title: "Library",
      eyebrow: "Saved Assets",
      description: "Jump back into saved briefs, channel reports, and presets without rebuilding them.",
      onClick: onOpenLibrary,
    },
    {
      title: "Projects",
      eyebrow: "Workspace",
      description: "Open the dedicated project hub for saved workspaces, briefs, reports, and presets.",
      onClick: onOpenProjects,
    },
  ].slice(0, 4);

  return (
    <div className="workspace-grid shell-workspace-grid">
      <section className="workspace-main">
        <section className="home-exec-dashboard">
          <section className="home-exec-hero">
            <div className="home-exec-hero-copy">
              <div className="home-exec-eyebrow">Home</div>
              <h2>Mission Control</h2>
              <p>Resume active work, review saved outputs, and move into the next operation without hunting through the app.</p>
              <div className="home-exec-hero-tags">
                <span className="home-exec-tag">{projectCount} saved assets</span>
                <span className="home-exec-tag">{resumeProjects.length} recent workspaces</span>
                <span className="home-exec-tag">Fast resume ready</span>
              </div>
            </div>
            <div className="home-exec-hero-side">
              <span className="home-exec-side-label">Workspace Pulse</span>
              <strong>{projectCount}</strong>
              <span>{spotlightProject ? `Latest: ${spotlightProject.title}` : "Start any workflow and your latest work will appear here."}</span>
            </div>
          </section>

          <section className="home-exec-main-grid">
            <article className="home-exec-panel home-exec-panel-resume">
              <div className="home-exec-panel-head">
                <div>
                  <span className="home-exec-panel-eyebrow">Continue Working</span>
                  <h3>Recent Projects</h3>
                </div>
                <button type="button" className="home-exec-link-button" onClick={onOpenProjects}>
                  Open Projects
                </button>
              </div>
              {resumeProjects.length ? (
                <div className="home-exec-list">
                  {resumeProjects.map((project) => (
                    <button key={project.id} type="button" className="home-exec-list-item" onClick={() => onLoadProject(project.id)}>
                      <span className="home-exec-list-copy">
                        <strong>{project.title}</strong>
                        <span>{formatProjectKind(project.kind)} | {formatCreatedAt(project.createdAt)}</span>
                      </span>
                      <span className="home-exec-list-arrow" aria-hidden="true">Open</span>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="home-exec-empty-state">
                  <p>No recent projects yet. Start in Video Intel or Channel Clone and your latest workspace will appear here.</p>
                  <div className="home-exec-empty-actions">
                    <button type="button" className="home-exec-secondary-button" onClick={onOpenVideoIntel}>
                      Open Video Intel
                    </button>
                    <button type="button" className="home-exec-secondary-button" onClick={onOpenChannelLab}>
                      Open Channel Clone
                    </button>
                  </div>
                </div>
              )}
            </article>
          </section>

          <article className="home-exec-panel home-exec-panel-actions">
            <div className="home-exec-panel-head">
              <div>
                <span className="home-exec-panel-eyebrow">Quick Start</span>
                <h3>Jump into the next workflow</h3>
              </div>
            </div>
            <div className="home-exec-action-grid">
              {actionItems.map((action) => (
                <button key={action.title} type="button" className="home-exec-action-card" onClick={action.onClick}>
                  <div className="home-exec-action-top">
                    <span className="home-exec-action-label">{action.eyebrow}</span>
                  </div>
                  <div className="home-exec-action-body">
                    <strong>{action.title}</strong>
                    <span>{action.description}</span>
                  </div>
                  <span className="home-exec-action-cta">Open</span>
                </button>
              ))}
            </div>
          </article>
        </section>
      </section>
    </div>
  );
}
