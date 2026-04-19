import type { ExperienceMode } from "./navigation";

type WorkspaceTopbarProps = {
  commandSearch: string;
  experienceMode: ExperienceMode;
  pageDescription: string;
  pageTitle: string;
  status: string;
  statusTone: "ready" | "busy" | "success" | "error";
  onCommandSearchChange: (value: string) => void;
  onCommandSearchSubmit: () => void;
};

export function WorkspaceTopbar({
  commandSearch,
  experienceMode,
  pageDescription,
  pageTitle,
  status,
  statusTone,
  onCommandSearchChange,
  onCommandSearchSubmit,
}: WorkspaceTopbarProps) {
  return (
    <section className="app-topbar simple-card">
      <div className="topbar-copy">
        <span className="eyebrow">Cipher Lens Workspace</span>
        <h2>{pageTitle}</h2>
        <p className="mode-description">{pageDescription}</p>
      </div>
      <div className="topbar-control-stack">
        <div className="topbar-summary-row">
          <span className={`status-badge is-${statusTone}`}>{status}</span>
          <span className="topbar-mode-chip">{experienceMode === "pro" ? "Pro" : "Basic"}</span>
        </div>
        <label className="field topbar-search">
          <span>Search Library</span>
          <input
            value={commandSearch}
            onChange={(event) => onCommandSearchChange(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") onCommandSearchSubmit();
            }}
            placeholder="Search briefs, reports, presets..."
          />
        </label>
      </div>
    </section>
  );
}
