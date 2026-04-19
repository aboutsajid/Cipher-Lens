import {
  APP_VIEW_DESCRIPTIONS,
  APP_VIEW_LABELS,
  type AppView,
} from "./navigation";

type WorkspaceMode = "single" | "batch" | "channel";

type WorkspaceSectionHeaderProps = {
  activeView: AppView;
  isProMode: boolean;
  visibleAppViews: readonly AppView[];
  visibleStudioModes: readonly WorkspaceMode[];
  workspaceMode: WorkspaceMode;
  workspaceModeLabels: Record<WorkspaceMode, string>;
  onSelectView: (view: AppView) => void;
  onSelectWorkspaceMode: (mode: WorkspaceMode) => void;
};

export function WorkspaceSectionHeader({
  activeView,
  isProMode,
  visibleAppViews,
  visibleStudioModes,
  workspaceMode,
  workspaceModeLabels,
  onSelectView,
  onSelectWorkspaceMode,
}: WorkspaceSectionHeaderProps) {
  return (
    <section className="simple-card brand-control-panel">
      <div className="status-row mode-header-row">
        <div>
          <h2>{
            activeView === "studio"
              ? (isProMode ? "Video Intel Pro" : "Video Intel")
              : activeView === "channel"
                ? "Channel Lab"
                : activeView === "compare"
                  ? "Channel Compare"
                : activeView === "analytics"
                    ? "Studio Analytics"
                  : activeView === "projects"
                    ? "Projects"
                  : activeView === "exports"
                    ? "Exports"
                    : activeView === "settings"
                      ? "Settings"
                  : "Library"
          }</h2>
          <p className="mode-description">{APP_VIEW_DESCRIPTIONS[activeView]}</p>
        </div>
        <div className="header-control-stack">
          <div className="pill-row">
            {visibleAppViews.map((view) => (
              <button key={view} type="button" className={`mode-pill ${activeView === view ? "is-active" : ""}`} onClick={() => onSelectView(view)}>
                {APP_VIEW_LABELS[view]}
              </button>
            ))}
          </div>
        </div>
      </div>
      {activeView === "studio" && isProMode ? (
        <div className="mode-subrow">
          <span className="mode-note">Batch, transcript chat, and richer export tools are active here.</span>
          <div className="pill-row">
            {visibleStudioModes.map((mode) => (
              <button key={mode} type="button" className={`mode-pill ${workspaceMode === mode ? "is-active" : ""}`} onClick={() => onSelectWorkspaceMode(mode)}>
                {workspaceModeLabels[mode]}
              </button>
            ))}
          </div>
        </div>
      ) : activeView === "channel" ? (
        <div className="mode-subrow">
          <span className="mode-note">Clone plans and advanced compare workflows stay here, so channel research no longer competes with single-video work.</span>
        </div>
      ) : activeView === "compare" ? (
        <div className="mode-subrow">
          <span className="mode-note">Use Channel Lab to build the compare, then review the finished winner matrix, adaptation read, and niche model here.</span>
        </div>
      ) : activeView === "analytics" ? (
        <div className="mode-subrow">
          <span className="mode-note">Studio CSV imports now have their own page, so matched CTR, impressions, and retention data no longer get buried in the setup screen.</span>
        </div>
      ) : activeView === "projects" ? (
        <div className="mode-subrow">
          <span className="mode-note">Projects gives saved work its own department, so reopening and managing briefs, reports, presets, and workspaces no longer depends on the general library view.</span>
        </div>
      ) : activeView === "exports" ? (
        <div className="mode-subrow">
          <span className="mode-note">This page gathers the live brief, clone, and compare deliverables so export work stops competing with analysis work.</span>
        </div>
      ) : activeView === "settings" ? (
        <div className="mode-subrow">
          <span className="mode-note">Use this page for workspace defaults and runtime checks instead of burying them inside individual workflows.</span>
        </div>
      ) : activeView === "library" ? (
        <div className="mode-subrow">
          <span className="mode-note">{isProMode ? "History stays in its own screen, so saved items do not crowd the active workflow." : "Saved briefs stay easy to reopen without crowding the active workflow."}</span>
        </div>
      ) : null}
    </section>
  );
}
