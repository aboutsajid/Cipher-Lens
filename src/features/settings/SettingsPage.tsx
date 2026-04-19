import {
  AUDIENCE_OPTIONS,
  EXPORT_FORMAT_OPTIONS,
  OUTPUT_LANGUAGE_OPTIONS,
  SUMMARY_STYLE_OPTIONS,
  type AudiencePreset,
  type CleanerSettings,
  type CopyFormat,
  type ExportFormat,
  type OutputLanguage,
  type SummaryStyle,
} from "../../premium";
import type { ExperienceMode } from "../../app/navigation";

type SettingsPageProps = {
  audiencePreset: AudiencePreset;
  availableCopyFormats: ReadonlyArray<{ label: string; value: CopyFormat }>;
  canExportPdf: boolean;
  canFetchChannel: boolean;
  canFetchTranscript: boolean;
  canImportAnalytics: boolean;
  cleaner: CleanerSettings;
  copyFormat: CopyFormat;
  experienceMode: ExperienceMode;
  exportFormat: ExportFormat;
  outputLanguage: OutputLanguage;
  runtimeReady: boolean;
  summaryStyle: SummaryStyle;
  onAudiencePresetChange: (value: AudiencePreset) => void;
  onCleanerChange: (value: CleanerSettings) => void;
  onCopyFormatChange: (value: CopyFormat) => void;
  onExperienceModeChange: (value: ExperienceMode) => void;
  onExportFormatChange: (value: ExportFormat) => void;
  onOutputLanguageChange: (value: OutputLanguage) => void;
  onSummaryStyleChange: (value: SummaryStyle) => void;
};

export function SettingsPage({
  audiencePreset,
  availableCopyFormats,
  canExportPdf,
  canFetchChannel,
  canFetchTranscript,
  canImportAnalytics,
  cleaner,
  copyFormat,
  experienceMode,
  exportFormat,
  outputLanguage,
  runtimeReady,
  summaryStyle,
  onAudiencePresetChange,
  onCleanerChange,
  onCopyFormatChange,
  onExperienceModeChange,
  onExportFormatChange,
  onOutputLanguageChange,
  onSummaryStyleChange,
}: SettingsPageProps) {
  return (
    <section className="simple-card">
      <div className="section-header">
        <div>
          <h2>Settings</h2>
          <p>Control the defaults that shape new briefs, exports, and day-to-day workspace behavior.</p>
        </div>
        <span className="meta-text">{runtimeReady ? "Desktop Runtime Ready" : "Web Runtime"}</span>
      </div>

      <div className="compare-grid">
        <article className="summary-block">
          <h3>Experience Mode</h3>
          <div className="pill-row hero-mode-row">
            {(["basic", "pro"] as ExperienceMode[]).map((mode) => (
              <button
                key={mode}
                type="button"
                className={`mode-pill ${experienceMode === mode ? "is-active" : ""}`}
                onClick={() => onExperienceModeChange(mode)}
              >
                {mode === "pro" ? "Pro" : "Basic"}
              </button>
            ))}
          </div>
          <p className="mode-note">Basic keeps the app light for single-video briefs. Pro unlocks channel strategy, compare workflows, and heavier deliverables.</p>
        </article>

        <article className="summary-block">
          <h3>Workspace Defaults</h3>
          <div className="form-grid premium-grid">
            <label className="field">
              <span>Summary Style</span>
              <select value={summaryStyle} onChange={(event) => onSummaryStyleChange(event.target.value as SummaryStyle)}>
                {SUMMARY_STYLE_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
              </select>
            </label>
            <label className="field">
              <span>Audience</span>
              <select value={audiencePreset} onChange={(event) => onAudiencePresetChange(event.target.value as AudiencePreset)}>
                {AUDIENCE_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
              </select>
            </label>
            <label className="field">
              <span>Output Language</span>
              <select value={outputLanguage} onChange={(event) => onOutputLanguageChange(event.target.value as OutputLanguage)}>
                {OUTPUT_LANGUAGE_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
              </select>
            </label>
            <label className="field">
              <span>Copy Format</span>
              <select value={copyFormat} onChange={(event) => onCopyFormatChange(event.target.value as CopyFormat)}>
                {availableCopyFormats.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
              </select>
            </label>
            <label className="field">
              <span>Export Format</span>
              <select value={exportFormat} onChange={(event) => onExportFormatChange(event.target.value as ExportFormat)}>
                {EXPORT_FORMAT_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
              </select>
            </label>
          </div>
        </article>

        <article className="summary-block">
          <h3>Transcript Cleanup</h3>
          <div className="cleaner-panel">
            <label className="toggle-row"><input type="checkbox" checked={cleaner.removeNoiseTags} onChange={(event) => onCleanerChange({ ...cleaner, removeNoiseTags: event.target.checked })} /><span>Remove Noise Tags</span></label>
            <label className="toggle-row"><input type="checkbox" checked={cleaner.removeSpeakerLabels} onChange={(event) => onCleanerChange({ ...cleaner, removeSpeakerLabels: event.target.checked })} /><span>Strip Speaker Labels</span></label>
            <label className="toggle-row"><input type="checkbox" checked={cleaner.dedupeLines} onChange={(event) => onCleanerChange({ ...cleaner, dedupeLines: event.target.checked })} /><span>Remove Duplicates</span></label>
            <label className="toggle-row"><input type="checkbox" checked={cleaner.trimFillers} onChange={(event) => onCleanerChange({ ...cleaner, trimFillers: event.target.checked })} /><span>Trim Filler Words</span></label>
          </div>
        </article>

        <article className="summary-block">
          <h3>Capability Snapshot</h3>
          <div className="rail-metric-list">
            <span><strong>{canFetchTranscript ? "Ready" : "Unavailable"}</strong> Transcript Fetch</span>
            <span><strong>{canFetchChannel ? "Ready" : "Unavailable"}</strong> Channel Pull</span>
            <span><strong>{canImportAnalytics ? "Ready" : "Unavailable"}</strong> Studio Import</span>
            <span><strong>{canExportPdf ? "Ready" : "Unavailable"}</strong> PDF Export</span>
          </div>
        </article>
      </div>
    </section>
  );
}
