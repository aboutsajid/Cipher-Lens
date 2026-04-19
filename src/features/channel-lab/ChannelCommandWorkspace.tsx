import type {
  CloneChannelStage,
  CloneGoal,
  ClonePresentationStyle,
} from "../../premium";
import {
  formatStudioDuration,
  type StudioImportSummary,
  type StudioVideoMetrics,
} from "../../youtube-studio";

type ChannelVideo = {
  title: string;
  url: string;
  videoId: string;
  publishedLabel?: string;
  viewLabel?: string;
  studioMetrics?: StudioVideoMetrics;
};

type SavedPresetCard = {
  id: string;
  name: string;
  meta: string;
};

type SampleSectionProps = {
  actionsLabel: string;
  coverageLabel: string;
  emptyDescription: string;
  emptyTitle: string;
  importSummary: StudioImportSummary | null;
  importedLabel: string;
  loadedLabel: string;
  openLabel: string;
  sampleMetaFallback: string;
  selectedIds: string[];
  selectedLabel: string;
  title: string;
  videos: ChannelVideo[];
  canImportAnalytics: boolean;
  busy: boolean;
  onClearSelection: () => void;
  onImportStudioAnalytics: () => void;
  onOpenVideoBrief: (video: ChannelVideo) => void;
  onSelectAll: () => void;
  onSelectTop: (count: number) => void;
  onToggleVideo: (videoId: string) => void;
};

type ChannelCommandWorkspaceProps = {
  benchmarkChannelUrl: string;
  benchmarkSampleSize: number;
  benchmarkSampleSizeOptions: readonly number[];
  benchmarkStudioCoverage: string;
  benchmarkStudioImport: StudioImportSummary | null;
  benchmarkVideos: ChannelVideo[];
  busy: boolean;
  canFetchChannel: boolean;
  canImportAnalytics: boolean;
  channelPresetName: string;
  channelPresetStatusMessage: string;
  channelSampleSize: number;
  channelSampleSizeOptions: readonly number[];
  channelUrl: string;
  cloneGoal: CloneGoal;
  cloneGoalOptions: readonly CloneGoal[];
  cloneNiche: string;
  clonePresentationOptions: readonly ClonePresentationStyle[];
  clonePresentationStyle: ClonePresentationStyle;
  cloneStage: CloneChannelStage;
  cloneStageOptions: readonly CloneChannelStage[];
  compareChannelUrl: string;
  compareSampleSize: number;
  compareSampleSizeOptions: readonly number[];
  compareStudioCoverage: string;
  compareStudioImport: StudioImportSummary | null;
  compareVideos: ChannelVideo[];
  loadedQuotesCount: number;
  mainStudioCoverage: string;
  mainStudioImport: StudioImportSummary | null;
  myChannelUrl: string;
  runtimeReady: boolean;
  savedPresets: SavedPresetCard[];
  selectedBenchmarkVideoIds: string[];
  selectedChannelVideoIds: string[];
  selectedChannelVideosCount: number;
  selectedCompareVideoIds: string[];
  selectedCompareVideosCount: number;
  totalTranscriptLines: number;
  transcriptWordCount: number;
  videos: ChannelVideo[];
  onBenchmarkChannelUrlChange: (value: string) => void;
  onBenchmarkSampleSizeChange: (value: number) => void;
  onChannelPresetNameChange: (value: string) => void;
  onChannelSampleSizeChange: (value: number) => void;
  onChannelUrlChange: (value: string) => void;
  onCloneGoalChange: (value: CloneGoal) => void;
  onCloneNicheChange: (value: string) => void;
  onClonePresentationStyleChange: (value: ClonePresentationStyle) => void;
  onCloneStageChange: (value: CloneChannelStage) => void;
  onCompareChannelUrlChange: (value: string) => void;
  onCompareSampleSizeChange: (value: number) => void;
  onDeletePreset: (id: string) => void;
  onImportBenchmarkAnalytics: () => void;
  onImportCompareAnalytics: () => void;
  onImportMainAnalytics: () => void;
  onLoadBenchmarkFeed: () => void;
  onLoadCompareFeed: () => void;
  onLoadMainFeed: () => void;
  onLoadPreset: (id: string) => void;
  onMyChannelUrlChange: (value: string) => void;
  onOpenVideoBrief: (video: ChannelVideo) => void;
  onRunClonePlan: () => void;
  onRunCompare: () => void;
  onSavePreset: () => void;
  onSelectAllBenchmarkVideos: () => void;
  onSelectAllChannelVideos: () => void;
  onSelectAllCompareVideos: () => void;
  onSelectTopBenchmarkVideos: (count: number) => void;
  onSelectTopChannelVideos: (count: number) => void;
  onSelectTopCompareVideos: (count: number) => void;
  onSendToBatch: () => void;
  onToggleBenchmarkVideo: (videoId: string) => void;
  onToggleChannelVideo: (videoId: string) => void;
  onToggleCompareVideo: (videoId: string) => void;
  onClearBenchmarkSelection: () => void;
  onClearChannelSelection: () => void;
  onClearCompareSelection: () => void;
};

function SampleSection({
  actionsLabel,
  coverageLabel,
  emptyDescription,
  emptyTitle,
  importSummary,
  importedLabel,
  loadedLabel,
  openLabel,
  sampleMetaFallback,
  selectedIds,
  selectedLabel,
  title,
  videos,
  canImportAnalytics,
  busy,
  onClearSelection,
  onImportStudioAnalytics,
  onOpenVideoBrief,
  onSelectAll,
  onSelectTop,
  onToggleVideo,
}: SampleSectionProps) {
  const selectedIdSet = new Set(selectedIds);

  return (
    <>
      <div className="section-header channel-selection-header">
        <div>
          <h3>{title}</h3>
          <p>{actionsLabel}</p>
        </div>
        <span className="meta-text">{selectedIds.length} Selected / {videos.length} Loaded | {coverageLabel}</span>
      </div>
      {videos.length > 0 ? (
        <div className="button-row channel-selection-actions">
          <button type="button" className="secondary-button" onClick={onSelectAll}>Select All</button>
          <button type="button" className="secondary-button" onClick={() => onSelectTop(5)}>Top 5</button>
          <button type="button" className="secondary-button" onClick={() => onSelectTop(10)}>Top 10</button>
          <button type="button" className="secondary-button" onClick={onImportStudioAnalytics} disabled={busy || !canImportAnalytics}>Import Studio CSV</button>
          <button type="button" className="secondary-button" onClick={onClearSelection}>Clear Selection</button>
        </div>
      ) : null}
      {importSummary ? (
        <p className="channel-helper-note">
          {importedLabel}: {importSummary.fileName} | {importSummary.kind === "traffic-source" ? "Traffic Source" : "Video Performance"} | {importSummary.matchedCount} matched{importSummary.unmatchedCount > 0 ? ` | ${importSummary.unmatchedCount} unmatched` : ""}
        </p>
      ) : null}
      <div className="batch-list">
        {videos.length === 0 ? (
          title === "Main Sample" ? (
            <p className="empty-copy">No Main Videos Loaded Yet.</p>
          ) : (
            <div className="empty-state-card">
              <strong>{emptyTitle}</strong>
              <p className="empty-copy">{emptyDescription}</p>
            </div>
          )
        ) : videos.map((video) => {
          const isSelected = selectedIdSet.has(video.videoId);

          return (
            <article key={video.videoId} className={`result-item channel-sample-item ${isSelected ? "is-selected" : "is-muted"}`}>
              <div className="planner-head">
                <label className="toggle-row selection-toggle">
                  <input type="checkbox" checked={isSelected} onChange={() => onToggleVideo(video.videoId)} />
                  <span>{isSelected ? selectedLabel : `Excluded From ${loadedLabel}`}</span>
                </label>
                <button type="button" className="secondary-button" onClick={() => onOpenVideoBrief(video)}>{openLabel}</button>
              </div>
              <div>
                <strong>{video.title}</strong>
                <p>{video.url}</p>
                <p>{[video.publishedLabel, video.viewLabel].filter(Boolean).join(" | ") || sampleMetaFallback}</p>
                {video.studioMetrics ? (
                  <div className="chip-row studio-chip-row">
                    {video.studioMetrics.views !== null ? <span className="chip">Studio {formatMetricCount(video.studioMetrics.views)}</span> : null}
                    {video.studioMetrics.impressions !== null ? <span className="chip">Imp {formatMetricCount(video.studioMetrics.impressions)}</span> : null}
                    {video.studioMetrics.impressionsCtr !== null ? <span className="chip">CTR {formatPercentage(video.studioMetrics.impressionsCtr)}</span> : null}
                    {video.studioMetrics.averagePercentageViewed !== null ? <span className="chip">Retention {formatPercentage(video.studioMetrics.averagePercentageViewed)}</span> : null}
                    {video.studioMetrics.averageViewDurationSeconds !== null ? <span className="chip">AVD {formatStudioDuration(video.studioMetrics.averageViewDurationSeconds)}</span> : null}
                    {video.studioMetrics.trafficSources[0] ? <span className="chip">{video.studioMetrics.trafficSources[0].source}</span> : null}
                  </div>
                ) : null}
              </div>
            </article>
          );
        })}
      </div>
    </>
  );
}

function formatMetricCount(value: number): string {
  if (!Number.isFinite(value)) return "0";
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(value >= 10_000_000 ? 0 : 1)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(value >= 100_000 ? 0 : 1)}K`;
  return `${Math.round(value)}`;
}

function formatPercentage(value: number | null | undefined): string {
  if (value === null || value === undefined || !Number.isFinite(value)) return "n/a";
  return `${value.toFixed(value >= 10 ? 0 : 1)}%`;
}

export function ChannelCommandWorkspace({
  benchmarkChannelUrl,
  benchmarkSampleSize,
  benchmarkSampleSizeOptions,
  benchmarkStudioCoverage,
  benchmarkStudioImport,
  benchmarkVideos,
  busy,
  canFetchChannel,
  canImportAnalytics,
  channelPresetName,
  channelPresetStatusMessage,
  channelSampleSize,
  channelSampleSizeOptions,
  channelUrl,
  cloneGoal,
  cloneGoalOptions,
  cloneNiche,
  clonePresentationOptions,
  clonePresentationStyle,
  cloneStage,
  cloneStageOptions,
  compareChannelUrl,
  compareSampleSize,
  compareSampleSizeOptions,
  compareStudioCoverage,
  compareStudioImport,
  compareVideos,
  loadedQuotesCount,
  mainStudioCoverage,
  mainStudioImport,
  myChannelUrl,
  runtimeReady,
  savedPresets,
  selectedBenchmarkVideoIds,
  selectedChannelVideoIds,
  selectedChannelVideosCount,
  selectedCompareVideoIds,
  selectedCompareVideosCount,
  totalTranscriptLines,
  transcriptWordCount,
  videos,
  onBenchmarkChannelUrlChange,
  onBenchmarkSampleSizeChange,
  onChannelPresetNameChange,
  onChannelSampleSizeChange,
  onChannelUrlChange,
  onCloneGoalChange,
  onCloneNicheChange,
  onClonePresentationStyleChange,
  onCloneStageChange,
  onCompareChannelUrlChange,
  onCompareSampleSizeChange,
  onDeletePreset,
  onImportBenchmarkAnalytics,
  onImportCompareAnalytics,
  onImportMainAnalytics,
  onLoadBenchmarkFeed,
  onLoadCompareFeed,
  onLoadMainFeed,
  onLoadPreset,
  onMyChannelUrlChange,
  onOpenVideoBrief,
  onRunClonePlan,
  onRunCompare,
  onSavePreset,
  onSelectAllBenchmarkVideos,
  onSelectAllChannelVideos,
  onSelectAllCompareVideos,
  onSelectTopBenchmarkVideos,
  onSelectTopChannelVideos,
  onSelectTopCompareVideos,
  onSendToBatch,
  onToggleBenchmarkVideo,
  onToggleChannelVideo,
  onToggleCompareVideo,
  onClearBenchmarkSelection,
  onClearChannelSelection,
  onClearCompareSelection,
}: ChannelCommandWorkspaceProps) {
  return (
    <section className="simple-card">
      <div className="section-header">
        <div><h2>Channel Command</h2></div>
        <div className="header-meta-row">
          <span className="meta-text">{transcriptWordCount} Transcript Words</span>
          <span className="meta-text">{loadedQuotesCount} Highlight Quotes</span>
          <span className="meta-text">{totalTranscriptLines} Lines Analyzed</span>
        </div>
      </div>
      <div className="mode-panel">
        <div className="form-grid premium-grid">
          <label className="field field-wide"><span>YouTube Channel URL</span><input value={channelUrl} onChange={(event) => onChannelUrlChange(event.target.value)} placeholder="https://www.youtube.com/@channelname" /></label>
          <label className="field"><span>Recent Videos To Load</span><select value={String(channelSampleSize)} onChange={(event) => onChannelSampleSizeChange(Number(event.target.value) || 8)}>{channelSampleSizeOptions.map((value) => <option key={value} value={value}>{value} Videos</option>)}</select></label>
          <label className="field field-wide"><span>Compare Channel URL</span><input value={compareChannelUrl} onChange={(event) => onCompareChannelUrlChange(event.target.value)} placeholder="https://www.youtube.com/@competitor" /></label>
          <label className="field"><span>Compare Sample Size</span><select value={String(compareSampleSize)} onChange={(event) => onCompareSampleSizeChange(Number(event.target.value) || 8)}>{compareSampleSizeOptions.map((value) => <option key={value} value={value}>{value} Videos</option>)}</select></label>
          <label className="field field-wide"><span>Benchmark Channel URL</span><input value={benchmarkChannelUrl} onChange={(event) => onBenchmarkChannelUrlChange(event.target.value)} placeholder="Optional: https://www.youtube.com/@nicheleader" /></label>
          <label className="field"><span>Benchmark Sample Size</span><select value={String(benchmarkSampleSize)} onChange={(event) => onBenchmarkSampleSizeChange(Number(event.target.value) || 8)}>{benchmarkSampleSizeOptions.map((value) => <option key={value} value={value}>{value} Videos</option>)}</select></label>
          <label className="field field-wide"><span>My Channel URL</span><input value={myChannelUrl} onChange={(event) => onMyChannelUrlChange(event.target.value)} placeholder="Optional: https://www.youtube.com/@mychannel" /></label>
          <label className="field field-wide"><span>Your Niche Or Angle</span><input value={cloneNiche} onChange={(event) => onCloneNicheChange(event.target.value)} placeholder="Optional: faceless creator education for beginners" /></label>
          <label className="field"><span>Your Stage</span><select value={cloneStage} onChange={(event) => onCloneStageChange(event.target.value as CloneChannelStage)}>{cloneStageOptions.map((value) => <option key={value} value={value}>{value.charAt(0).toUpperCase() + value.slice(1)}</option>)}</select></label>
          <label className="field"><span>Presentation</span><select value={clonePresentationStyle} onChange={(event) => onClonePresentationStyleChange(event.target.value as ClonePresentationStyle)}>{clonePresentationOptions.map((value) => <option key={value} value={value}>{value === "on-camera" ? "On-Camera" : "Faceless"}</option>)}</select></label>
          <label className="field"><span>Primary Goal</span><select value={cloneGoal} onChange={(event) => onCloneGoalChange(event.target.value as CloneGoal)}>{cloneGoalOptions.map((value) => <option key={value} value={value}>{value.charAt(0).toUpperCase() + value.slice(1)}</option>)}</select></label>
        </div>
        <div className="button-row">
          <button type="button" className="primary-button" onClick={onLoadMainFeed} disabled={busy || !canFetchChannel}>Load Main Feed</button>
          <button type="button" className="secondary-button" onClick={onLoadCompareFeed} disabled={busy || !canFetchChannel || !compareChannelUrl.trim()}>Load Compare Feed</button>
          <button type="button" className="secondary-button" onClick={onLoadBenchmarkFeed} disabled={busy || !canFetchChannel || !benchmarkChannelUrl.trim()}>Load Benchmark Feed</button>
          <button type="button" className="secondary-button" onClick={onRunClonePlan} disabled={busy || selectedChannelVideosCount === 0 || !runtimeReady}>Build My Clone Plan</button>
          <button type="button" className="secondary-button" onClick={onRunCompare} disabled={busy || selectedChannelVideosCount === 0 || selectedCompareVideosCount === 0 || !compareChannelUrl.trim() || !runtimeReady}>Run Compare</button>
          <button type="button" className="secondary-button" onClick={onSendToBatch} disabled={selectedChannelVideosCount === 0}>Send To Batch</button>
        </div>
        <p className="channel-helper-note">Build My Clone Plan is now the main single-target workflow. The optional My Channel URL is fetched privately in the background and strengthens Adapt To Me without changing the visible compare flow. Compare uses its own separately loaded competitor feed, and the optional benchmark feed turns that advanced workflow into a niche-model read across 2-3 channels. After loading any sample, you can import a YouTube Studio CSV to attach CTR, impressions, view duration, retention, and traffic-source data.</p>

        <SampleSection
          actionsLabel="Select the videos that should power your clone plan and the main side of Compare."
          coverageLabel={mainStudioCoverage}
          emptyDescription=""
          emptyTitle=""
          importSummary={mainStudioImport}
          importedLabel="Main import"
          loadedLabel="Analysis"
          openLabel="Open Brief"
          sampleMetaFallback="Recent Channel Upload"
          selectedIds={selectedChannelVideoIds}
          selectedLabel="Included In Analysis"
          title="Main Sample"
          videos={videos}
          canImportAnalytics={canImportAnalytics}
          busy={busy}
          onClearSelection={onClearChannelSelection}
          onImportStudioAnalytics={onImportMainAnalytics}
          onOpenVideoBrief={onOpenVideoBrief}
          onSelectAll={onSelectAllChannelVideos}
          onSelectTop={onSelectTopChannelVideos}
          onToggleVideo={onToggleChannelVideo}
        />

        <SampleSection
          actionsLabel="Load competitor uploads, then choose the exact videos that should represent that side."
          coverageLabel={compareStudioCoverage}
          emptyDescription="Paste a competitor channel URL above, then click Load Compare Feed. Main feed selections stay separate so the compare side always reflects the competitor sample you choose."
          emptyTitle="No Compare Videos Loaded Yet."
          importSummary={compareStudioImport}
          importedLabel="Compare import"
          loadedLabel="Compare"
          openLabel="Open Brief"
          sampleMetaFallback="Recent Compare Upload"
          selectedIds={selectedCompareVideoIds}
          selectedLabel="Included In Compare"
          title="Compare Sample"
          videos={compareVideos}
          canImportAnalytics={canImportAnalytics}
          busy={busy}
          onClearSelection={onClearCompareSelection}
          onImportStudioAnalytics={onImportCompareAnalytics}
          onOpenVideoBrief={onOpenVideoBrief}
          onSelectAll={onSelectAllCompareVideos}
          onSelectTop={onSelectTopCompareVideos}
          onToggleVideo={onToggleCompareVideo}
        />

        <SampleSection
          actionsLabel="Optional third channel for extracting the shared niche system instead of only a head-to-head compare."
          coverageLabel={benchmarkStudioCoverage}
          emptyDescription="Add an optional third channel, then click Load Benchmark Feed to unlock a broader niche model across multiple leaders."
          emptyTitle="No Benchmark Videos Loaded Yet."
          importSummary={benchmarkStudioImport}
          importedLabel="Benchmark import"
          loadedLabel="Niche Model"
          openLabel="Open Brief"
          sampleMetaFallback="Recent Benchmark Upload"
          selectedIds={selectedBenchmarkVideoIds}
          selectedLabel="Included In Niche Model"
          title="Benchmark Sample"
          videos={benchmarkVideos}
          canImportAnalytics={canImportAnalytics}
          busy={busy}
          onClearSelection={onClearBenchmarkSelection}
          onImportStudioAnalytics={onImportBenchmarkAnalytics}
          onOpenVideoBrief={onOpenVideoBrief}
          onSelectAll={onSelectAllBenchmarkVideos}
          onSelectTop={onSelectTopBenchmarkVideos}
          onToggleVideo={onToggleBenchmarkVideo}
        />

        <div className="section-header channel-selection-header">
          <div>
            <h3>Sample Presets</h3>
            <p>Save the current main, compare, and optional benchmark setup so you can reopen it later without rebuilding it manually.</p>
          </div>
          <span className="meta-text">{savedPresets.length} Saved</span>
        </div>
        <div className="form-grid premium-grid">
          <label className="field field-wide"><span>Preset Name</span><input value={channelPresetName} onChange={(event) => onChannelPresetNameChange(event.target.value)} placeholder="Client audit preset, Gaming compare sample, Creator cohort..." /></label>
        </div>
        <div className="button-row">
          <button type="button" className="secondary-button" onClick={onSavePreset} disabled={videos.length === 0 && compareVideos.length === 0}>Save Preset</button>
        </div>
        {channelPresetStatusMessage ? <p className="channel-helper-note preset-status-note">{channelPresetStatusMessage}</p> : null}
        <div className="saved-list">
          {savedPresets.length === 0 ? <p className="empty-copy">No Presets Saved Yet.</p> : savedPresets.map((preset) => (
            <article key={preset.id} className="saved-item">
              <button type="button" className="saved-open" onClick={() => onLoadPreset(preset.id)}>
                <strong>{preset.name}</strong>
                <span>{preset.meta}</span>
              </button>
              <button type="button" className="link-button danger-button" onClick={() => onDeletePreset(preset.id)}>Delete</button>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
