import {
  AUDIENCE_OPTIONS,
  EXPORT_FORMAT_OPTIONS,
  OUTPUT_LANGUAGE_OPTIONS,
  SUMMARY_STYLE_OPTIONS,
  type AnalysisBundle,
  type AudiencePreset,
  type CleanerSettings,
  type CopyFormat,
  type ExportFormat,
  type OutputLanguage,
  type SummaryStyle,
} from "../../premium";

type LanguageOption = {
  value: string;
  label: string;
};

type TranscriptSource = {
  lineCount: number;
  language: string;
  videoId: string;
};

type BatchResult = {
  id: string;
  title: string;
  url: string;
  status: "pending" | "done" | "failed";
  message: string;
  transcript?: string;
  analysis?: AnalysisBundle;
};

type VideoIntelWorkspaceProps = {
  availableCopyFormats: ReadonlyArray<{ value: CopyFormat; label: string }>;
  audiencePreset: AudiencePreset;
  batchInput: string;
  batchResults: BatchResult[];
  busy: boolean;
  canFetchTranscript: boolean;
  canGenerate: boolean;
  canImportFile: boolean;
  cleaner: CleanerSettings;
  exportFormat: ExportFormat;
  isPending: boolean;
  isProMode: boolean;
  languageOptions: LanguageOption[];
  outputLanguage: OutputLanguage;
  summaryStyle: SummaryStyle;
  transcript: string;
  transcriptLanguage: string;
  transcriptSource: TranscriptSource | null;
  copyFormat: CopyFormat;
  videoTitle: string;
  videoUrl: string;
  workspaceMode: "single" | "batch" | "channel";
  onAudiencePresetChange: (value: AudiencePreset) => void;
  onBatchInputChange: (value: string) => void;
  onCleanerChange: (value: CleanerSettings) => void;
  onCopyFormatChange: (value: CopyFormat) => void;
  onCleanTranscript: () => void;
  onExport: () => void | Promise<void>;
  onExportFormatChange: (value: ExportFormat) => void;
  onFetch: (generate: boolean) => void | Promise<void>;
  onGenerateFromText: () => void;
  onImportTranscript: () => void | Promise<void>;
  onLoadBatchItem: (id: string) => void;
  onLoadSample: () => void;
  onOutputLanguageChange: (value: OutputLanguage) => void;
  onRunBatch: () => void | Promise<void>;
  onSave: () => void;
  onSaveCopy: () => void | Promise<void>;
  onSetTranscript: (value: string) => void;
  onSetTranscriptLanguage: (value: string) => void;
  onSetVideoTitle: (value: string) => void;
  onSetVideoUrl: (value: string) => void;
  onSummaryStyleChange: (value: SummaryStyle) => void;
  onResetWorkspace: () => void;
};

const RESULT_STATUS_LABELS: Record<BatchResult["status"], string> = {
  pending: "Pending",
  done: "Done",
  failed: "Failed",
};

export function VideoIntelWorkspace({
  availableCopyFormats,
  audiencePreset,
  batchInput,
  batchResults,
  busy,
  canFetchTranscript,
  canGenerate,
  canImportFile,
  cleaner,
  exportFormat,
  isPending,
  isProMode,
  languageOptions,
  outputLanguage,
  summaryStyle,
  transcript,
  transcriptLanguage,
  transcriptSource,
  copyFormat,
  videoTitle,
  videoUrl,
  workspaceMode,
  onAudiencePresetChange,
  onBatchInputChange,
  onCleanerChange,
  onCopyFormatChange,
  onCleanTranscript,
  onExport,
  onExportFormatChange,
  onFetch,
  onGenerateFromText,
  onImportTranscript,
  onLoadBatchItem,
  onLoadSample,
  onOutputLanguageChange,
  onRunBatch,
  onSave,
  onSaveCopy,
  onSetTranscript,
  onSetTranscriptLanguage,
  onSetVideoTitle,
  onSetVideoUrl,
  onSummaryStyleChange,
  onResetWorkspace,
}: VideoIntelWorkspaceProps) {
  return (
    <section className="simple-card">
      <div className="section-header"><div><h2>{workspaceMode === "batch" ? "Batch Studio" : "Input Studio"}</h2></div></div>

      {workspaceMode === "single" ? (
        <>
          <div className="form-grid premium-grid">
            <label className="field field-wide"><span>YouTube URL</span><input value={videoUrl} onChange={(event) => onSetVideoUrl(event.target.value)} placeholder="https://www.youtube.com/watch?v=..." /></label>
            <label className="field"><span>Video Title</span><input value={videoTitle} onChange={(event) => onSetVideoTitle(event.target.value)} placeholder="Optional Title" /></label>
            <label className="field"><span>Caption Language</span><select value={transcriptLanguage} onChange={(event) => onSetTranscriptLanguage(event.target.value)}>{languageOptions.map((option) => <option key={option.value || "auto"} value={option.value}>{option.label}</option>)}</select></label>
            <label className="field"><span>Summary Style</span><select value={summaryStyle} onChange={(event) => onSummaryStyleChange(event.target.value as SummaryStyle)}>{SUMMARY_STYLE_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></label>
            <label className="field"><span>Audience</span><select value={audiencePreset} onChange={(event) => onAudiencePresetChange(event.target.value as AudiencePreset)}>{AUDIENCE_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></label>
            <label className="field"><span>Output Language</span><select value={outputLanguage} onChange={(event) => onOutputLanguageChange(event.target.value as OutputLanguage)}>{OUTPUT_LANGUAGE_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></label>
            <label className="field"><span>Copy Format</span><select value={copyFormat} onChange={(event) => onCopyFormatChange(event.target.value as CopyFormat)}>{availableCopyFormats.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></label>
            <label className="field"><span>Export Format</span><select value={exportFormat} onChange={(event) => onExportFormatChange(event.target.value as ExportFormat)}>{EXPORT_FORMAT_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></label>
          </div>

          {isProMode ? <div className="cleaner-panel">
            <label className="toggle-row"><input type="checkbox" checked={cleaner.removeNoiseTags} onChange={(event) => onCleanerChange({ ...cleaner, removeNoiseTags: event.target.checked })} /><span>Remove Noise Tags</span></label>
            <label className="toggle-row"><input type="checkbox" checked={cleaner.removeSpeakerLabels} onChange={(event) => onCleanerChange({ ...cleaner, removeSpeakerLabels: event.target.checked })} /><span>Strip Speaker Labels</span></label>
            <label className="toggle-row"><input type="checkbox" checked={cleaner.dedupeLines} onChange={(event) => onCleanerChange({ ...cleaner, dedupeLines: event.target.checked })} /><span>Remove Duplicates</span></label>
            <label className="toggle-row"><input type="checkbox" checked={cleaner.trimFillers} onChange={(event) => onCleanerChange({ ...cleaner, trimFillers: event.target.checked })} /><span>Trim Filler Words</span></label>
          </div> : null}

          {transcriptSource ? <div className="meta-row"><span>Source: YouTube</span><span>Language: {transcriptSource.language || "Default"}</span><span>Video ID: {transcriptSource.videoId}</span></div> : null}
          <label className="field field-stack"><span>Transcript</span><textarea value={transcript} onChange={(event) => onSetTranscript(event.target.value)} placeholder="Paste Subtitles, Timestamps, Or Transcript Paragraphs Here." /></label>
          <div className="command-deck">
            <section className="command-hero">
              <div className="command-hero-copy">
                <span className="action-cluster-label">Command Deck</span>
                <h3>Run the brief first, then use the utility rail only when you need it.</h3>
              </div>
              <div className="command-hero-actions">
                <button type="button" className="primary-button" onClick={() => void onFetch(true)} disabled={busy || isPending || (!canFetchTranscript && !canGenerate)}>{busy || isPending ? "Working..." : canFetchTranscript ? "Fetch + Generate" : isProMode ? "Generate Premium Brief" : "Generate Brief"}</button>
                <button type="button" className="secondary-button" onClick={() => void onFetch(false)} disabled={busy || !canFetchTranscript}>Fetch</button>
                <button type="button" className="secondary-button" onClick={onGenerateFromText} disabled={!canGenerate || isPending}>Generate</button>
              </div>
            </section>
            <div className="command-grid">
              <section className="command-card">
                <div className="command-card-head">
                  <span className="action-cluster-label">Transcript</span>
                  <p>Bring text in or clean it before analysis.</p>
                </div>
                <div className="action-cluster-buttons">
                  <button type="button" className="secondary-button" onClick={() => void onImportTranscript()} disabled={!canImportFile}>Import</button>
                  <button type="button" className="secondary-button" onClick={onCleanTranscript} disabled={!transcript.trim()}>Clean Transcript</button>
                </div>
              </section>
              <section className="command-card">
                <div className="command-card-head">
                  <span className="action-cluster-label">Output</span>
                  <p>Save the current brief or send it out fast.</p>
                </div>
                <div className="action-cluster-buttons">
                  <button type="button" className="secondary-button" onClick={onSave}>Save</button>
                  <button type="button" className="secondary-button" onClick={() => void onSaveCopy()}>Copy</button>
                  <button type="button" className="secondary-button" onClick={() => void onExport()}>Export</button>
                </div>
              </section>
              <section className="command-card command-card-muted">
                <div className="command-card-head">
                  <span className="action-cluster-label">Reset</span>
                  <p>Use these when you want to restart, not during normal flow.</p>
                </div>
                <div className="action-link-row">
                  <button type="button" className="link-button command-link-button" onClick={onLoadSample}>Load Sample</button>
                  <button type="button" className="link-button command-link-button danger-button" onClick={onResetWorkspace}>Clear</button>
                </div>
              </section>
            </div>
          </div>
        </>
      ) : isProMode && workspaceMode === "batch" ? (
        <div className="mode-panel">
          <label className="field"><span>Batch URLs</span><textarea className="batch-textarea" value={batchInput} onChange={(event) => onBatchInputChange(event.target.value)} placeholder="Paste One YouTube URL Per Line." /></label>
          <div className="button-row"><button type="button" className="primary-button" onClick={() => void onRunBatch()} disabled={busy}>Run Batch Summary</button></div>
          <div className="batch-list">{batchResults.length === 0 ? <p className="empty-copy">No Batch Results Yet.</p> : batchResults.map((item) => <article key={item.id} className={`result-item is-${item.status}`}><div><strong>{item.title}</strong><p>{item.message}</p></div><div className="result-actions"><span className={`result-badge is-${item.status}`}>{RESULT_STATUS_LABELS[item.status]}</span><button type="button" className="secondary-button" onClick={() => onLoadBatchItem(item.id)} disabled={!item.analysis}>Open</button></div></article>)}</div>
        </div>
      ) : null}
    </section>
  );
}
