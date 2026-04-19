import {
  APP_VIEW_DESCRIPTIONS,
  APP_VIEW_GROUPS,
  APP_VIEW_LABELS,
  EXPERIENCE_MODE_LABELS,
  type AppView,
  type ExperienceMode,
} from "./navigation";

type AppSidebarProps = {
  activeView: AppView;
  experienceMode: ExperienceMode;
  visibleAppViews: readonly AppView[];
  onExperienceModeChange: (mode: ExperienceMode) => void;
  onSelectView: (view: AppView) => void;
};

export function AppSidebar({
  activeView,
  experienceMode,
  visibleAppViews,
  onExperienceModeChange,
  onSelectView,
}: AppSidebarProps) {
  return (
    <aside className="app-sidebar">
      {APP_VIEW_GROUPS.map((group) => {
        const views = group.views.filter((view) => visibleAppViews.includes(view));
        if (views.length === 0) return null;

        return (
          <div key={group.label} className="sidebar-group">
            <span className="sidebar-label">{group.label}</span>
            {views.map((view) => (
              <button
                key={view}
                type="button"
                className={`sidebar-link ${activeView === view ? "is-active" : ""}`}
                onClick={() => onSelectView(view)}
              >
                <strong>{APP_VIEW_LABELS[view]}</strong>
                <span>{APP_VIEW_DESCRIPTIONS[view]}</span>
              </button>
            ))}
          </div>
        );
      })}

      <section className="sidebar-card">
        <div className="sidebar-card-head">
          <strong>Experience Mode</strong>
          <span>{EXPERIENCE_MODE_LABELS[experienceMode]}</span>
        </div>
        <div className="pill-row hero-mode-row">
          {(["basic", "pro"] as ExperienceMode[]).map((mode) => (
            <button
              key={mode}
              type="button"
              className={`mode-pill ${experienceMode === mode ? "is-active" : ""}`}
              onClick={() => onExperienceModeChange(mode)}
            >
              {EXPERIENCE_MODE_LABELS[mode]}
            </button>
          ))}
        </div>
        <p className="sidebar-note">Use Basic for quick single-video briefs. Use Pro for channel strategy, compare workflows, and heavier exports.</p>
      </section>
    </aside>
  );
}
