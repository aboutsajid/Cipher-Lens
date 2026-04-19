type WorkspaceRailProps = {
  canExportPdf: boolean;
  canFetchChannel: boolean;
  canImportAnalytics: boolean;
  pageTitle: string;
  projectCount: number;
  runtimeReady: boolean;
  status: string;
  statusTone: "ready" | "busy" | "success" | "error";
  transcriptWordCount: number;
  clipMomentCount: number;
  plannerDayCount: number;
  onOpenAnalytics: () => void;
  onOpenCompare: () => void;
  onGoHome: () => void;
  onOpenChannelLab: () => void;
  onOpenLibrary: () => void;
  onOpenProjects: () => void;
  onOpenVideoIntel: () => void;
};

export function WorkspaceRail({
  canExportPdf,
  canFetchChannel,
  canImportAnalytics,
  pageTitle,
  projectCount,
  runtimeReady,
  status,
  statusTone,
  transcriptWordCount,
  clipMomentCount,
  plannerDayCount,
  onOpenAnalytics,
  onOpenCompare,
  onGoHome,
  onOpenChannelLab,
  onOpenLibrary,
  onOpenProjects,
  onOpenVideoIntel,
}: WorkspaceRailProps) {
  return (
    <aside className="workspace-rail">
      <section className="simple-card rail-card">
        <div className="section-header">
          <div>
            <h2>Workspace Signal</h2>
            <p>Keep the live state visible while you move between departments.</p>
          </div>
          <span className={`status-badge is-${statusTone}`}>{status}</span>
        </div>
        <div className="rail-metric-list">
          <span><strong>{pageTitle}</strong> Active Department</span>
          <span><strong>{projectCount}</strong> Saved Assets</span>
          <span><strong>{transcriptWordCount}</strong> Transcript Words</span>
          <span><strong>{clipMomentCount}</strong> Clip Candidates</span>
          <span><strong>{plannerDayCount}</strong> Planner Days</span>
          <span><strong>{runtimeReady ? "Desktop" : "Web"}</strong> Runtime</span>
        </div>
      </section>

      <section className="simple-card rail-card">
        <div className="section-header">
          <div>
            <h2>Quick Actions</h2>
            <p>Shortcuts for the most common next move.</p>
          </div>
        </div>
        <div className="rail-action-list">
          <button type="button" className="secondary-button" onClick={onOpenVideoIntel}>Open Video Intel</button>
          <button type="button" className="secondary-button" onClick={onOpenChannelLab}>Open Channel Lab</button>
          <button type="button" className="secondary-button" onClick={onOpenCompare}>Open Compare</button>
          <button type="button" className="secondary-button" onClick={onOpenAnalytics}>Open Analytics</button>
          <button type="button" className="secondary-button" onClick={onOpenProjects}>Open Projects</button>
          <button type="button" className="secondary-button" onClick={onOpenLibrary}>Open Library</button>
          <button type="button" className="secondary-button" onClick={onGoHome}>Back To Home</button>
        </div>
      </section>

      <section className="simple-card rail-card">
        <div className="section-header">
          <div>
            <h2>Capability Snapshot</h2>
            <p>Desktop bridge and export readiness.</p>
          </div>
        </div>
        <div className="rail-metric-list">
          <span><strong>{runtimeReady ? "Ready" : "Unavailable"}</strong> Transcript Fetch</span>
          <span><strong>{canFetchChannel ? "Ready" : "Unavailable"}</strong> Channel Pull</span>
          <span><strong>{canImportAnalytics ? "Ready" : "Unavailable"}</strong> Studio Import</span>
          <span><strong>{canExportPdf ? "Ready" : "Unavailable"}</strong> PDF Export</span>
        </div>
      </section>
    </aside>
  );
}
