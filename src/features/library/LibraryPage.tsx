type LibraryBrief = {
  id: string;
  title: string;
  createdAt: string;
};

type LibraryReport = {
  id: string;
  title: string;
  meta: string;
};

type LibraryPreset = {
  id: string;
  name: string;
  meta: string;
};

type LibraryProject = {
  id: string;
  title: string;
  kind: "brief" | "channel-report" | "channel-preset" | "workspace";
  createdAt: string;
};

function formatProjectKind(kind: LibraryProject["kind"]) {
  if (kind === "channel-report") return "Channel Report";
  if (kind === "channel-preset") return "Channel Preset";
  if (kind === "workspace") return "Workspace";
  return "Brief";
}

type LibraryPageProps = {
  activeBriefId: string | null;
  filteredBriefs: LibraryBrief[];
  filteredChannelPresets: LibraryPreset[];
  filteredChannelReports: LibraryReport[];
  filteredProjects: LibraryProject[];
  historySearch: string;
  isProMode: boolean;
  librarySearchPlaceholder: string;
  visibleLibraryItemCount: number;
  formatCreatedAt: (value: string) => string;
  onDeleteBrief: (id: string) => void;
  onDeleteProject: (id: string) => void;
  onDeletePreset: (id: string) => void;
  onDeleteReport: (id: string) => void;
  onHistorySearchChange: (value: string) => void;
  onLoadProject: (id: string) => void;
  onRenameProject: (id: string) => void;
  onLoadBrief: (id: string) => void;
  onLoadPreset: (id: string) => void;
  onLoadReport: (id: string) => void;
};

export function LibraryPage({
  activeBriefId,
  filteredBriefs,
  filteredChannelPresets,
  filteredChannelReports,
  filteredProjects,
  historySearch,
  isProMode,
  librarySearchPlaceholder,
  visibleLibraryItemCount,
  formatCreatedAt,
  onDeleteBrief,
  onDeleteProject,
  onDeletePreset,
  onDeleteReport,
  onHistorySearchChange,
  onLoadProject,
  onRenameProject,
  onLoadBrief,
  onLoadPreset,
  onLoadReport,
}: LibraryPageProps) {
  return (
    <section className="simple-card">
      <div className="section-header"><div><h2>Library</h2></div><span className="meta-text">{visibleLibraryItemCount} Items Shown</span></div>
      <label className="field"><span>Search History</span><input value={historySearch} onChange={(event) => onHistorySearchChange(event.target.value)} placeholder={librarySearchPlaceholder} /></label>
      <div className="saved-library-section">
        <div className="section-header">
          <div>
            <h3>Projects</h3>
            <p>Unified saved items across briefs, reports, presets, and full workspace snapshots so you can reopen work from one place.</p>
          </div>
          <span className="meta-text">{filteredProjects.length} Shown</span>
        </div>
        {filteredProjects.length === 0 ? <p className="empty-copy">No Matching Projects Yet.</p> : <div className="saved-list">{filteredProjects.map((project) => <article key={project.id} className="saved-item"><button type="button" className="saved-open" onClick={() => onLoadProject(project.id)}><strong>{project.title}</strong><span>{formatProjectKind(project.kind)} | {formatCreatedAt(project.createdAt)}</span></button><div className="action-link-row"><button type="button" className="link-button command-link-button" onClick={() => onRenameProject(project.id)}>Rename</button><button type="button" className="link-button danger-button" onClick={() => onDeleteProject(project.id)}>Delete</button></div></article>)}</div>}
      </div>
      <div className="saved-library-section">
        <div className="section-header">
          <div>
            <h3>Saved Briefs</h3>
            <p>Single-video transcript work you saved earlier.</p>
          </div>
          <span className="meta-text">{filteredBriefs.length} Shown</span>
        </div>
        {filteredBriefs.length === 0 ? <p className="empty-copy">No Matching Saved Briefs Yet.</p> : <div className="saved-list">{filteredBriefs.map((brief) => <article key={brief.id} className={`saved-item ${activeBriefId === brief.id ? "is-active" : ""}`}><button type="button" className="saved-open" onClick={() => onLoadBrief(brief.id)}><strong>{brief.title}</strong><span>{formatCreatedAt(brief.createdAt)}</span></button><button type="button" className="link-button danger-button" onClick={() => onDeleteBrief(brief.id)}>Delete</button></article>)}</div>}
      </div>
      {isProMode ? <div className="saved-library-section">
        <div className="section-header">
          <div>
            <h3>Channel Reports</h3>
            <p>Reload saved clone plans, compare reports, and presets without rerunning fetches.</p>
          </div>
          <span className="meta-text">{filteredChannelReports.length} Shown</span>
        </div>
        {filteredChannelReports.length === 0 ? <p className="empty-copy">No Matching Reports Yet.</p> : <div className="saved-list">{filteredChannelReports.map((report) => <article key={report.id} className="saved-item"><button type="button" className="saved-open" onClick={() => onLoadReport(report.id)}><strong>{report.title}</strong><span>{report.meta}</span></button><button type="button" className="link-button danger-button" onClick={() => onDeleteReport(report.id)}>Delete</button></article>)}</div>}
      </div> : null}
      {isProMode ? <div className="saved-library-section">
        <div className="section-header">
          <div>
            <h3>Sample Presets</h3>
            <p>Reusable main, compare, and benchmark video selections for recurring audits and client work.</p>
          </div>
          <span className="meta-text">{filteredChannelPresets.length} Shown</span>
        </div>
        {filteredChannelPresets.length === 0 ? <p className="empty-copy">No Matching Presets Yet.</p> : <div className="saved-list">{filteredChannelPresets.map((preset) => <article key={preset.id} className="saved-item"><button type="button" className="saved-open" onClick={() => onLoadPreset(preset.id)}><strong>{preset.name}</strong><span>{preset.meta}</span></button><button type="button" className="link-button danger-button" onClick={() => onDeletePreset(preset.id)}>Delete</button></article>)}</div>}
      </div> : null}
    </section>
  );
}
