type ProjectItem = {
  id: string;
  title: string;
  kind: "brief" | "channel-report" | "channel-preset" | "workspace";
  createdAt: string;
};

type ProjectsPageProps = {
  formatCreatedAt: (value: string) => string;
  historySearch: string;
  items: ProjectItem[];
  onDeleteProject: (id: string) => void;
  onHistorySearchChange: (value: string) => void;
  onLoadProject: (id: string) => void;
  onRenameProject: (id: string) => void;
  visibleCount: number;
};

function formatProjectKind(kind: ProjectItem["kind"]) {
  if (kind === "channel-report") return "Channel Report";
  if (kind === "channel-preset") return "Channel Preset";
  if (kind === "workspace") return "Workspace";
  return "Brief";
}

function countProjects(items: ProjectItem[], kind: ProjectItem["kind"]) {
  return items.filter((item) => item.kind === kind).length;
}

export function ProjectsPage({
  formatCreatedAt,
  historySearch,
  items,
  onDeleteProject,
  onHistorySearchChange,
  onLoadProject,
  onRenameProject,
  visibleCount,
}: ProjectsPageProps) {
  const workspaceCount = countProjects(items, "workspace");
  const briefCount = countProjects(items, "brief");
  const reportCount = countProjects(items, "channel-report");
  const presetCount = countProjects(items, "channel-preset");

  return (
    <section className="simple-card">
      <div className="section-header">
        <div>
          <h2>Projects</h2>
          <p>Every saved brief, report, preset, and workspace snapshot in one department with direct reopen and management actions.</p>
        </div>
        <span className="meta-text">{visibleCount} Items Shown</span>
      </div>

      <div className="report-kpi-row">
        <article className="report-kpi-card">
          <strong>{workspaceCount}</strong>
          <span>Workspaces</span>
        </article>
        <article className="report-kpi-card">
          <strong>{briefCount}</strong>
          <span>Briefs</span>
        </article>
        <article className="report-kpi-card">
          <strong>{reportCount}</strong>
          <span>Reports</span>
        </article>
        <article className="report-kpi-card">
          <strong>{presetCount}</strong>
          <span>Presets</span>
        </article>
      </div>

      <label className="field">
        <span>Search Projects</span>
        <input
          value={historySearch}
          onChange={(event) => onHistorySearchChange(event.target.value)}
          placeholder="Search projects, briefs, reports, presets, or workspaces"
        />
      </label>

      {items.length === 0 ? (
        <div className="empty-state-card">
          <strong>No Matching Projects Yet</strong>
          <p className="empty-copy">Save a brief, report, preset, or full workspace snapshot to start building a reusable project history here.</p>
        </div>
      ) : (
        <div className="saved-list">
          {items.map((project) => (
            <article key={project.id} className="saved-item">
              <button type="button" className="saved-open" onClick={() => onLoadProject(project.id)}>
                <strong>{project.title}</strong>
                <span>{formatProjectKind(project.kind)} | {formatCreatedAt(project.createdAt)}</span>
              </button>
              <div className="action-link-row">
                <button type="button" className="link-button command-link-button" onClick={() => onRenameProject(project.id)}>Rename</button>
                <button type="button" className="link-button danger-button" onClick={() => onDeleteProject(project.id)}>Delete</button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
