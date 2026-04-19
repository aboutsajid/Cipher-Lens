import { formatStudioDuration, type StudioImportSummary, type StudioVideoMetrics } from "../../youtube-studio";

type ChannelVideo = {
  title: string;
  url: string;
  videoId: string;
  publishedLabel?: string;
  viewLabel?: string;
  studioMetrics?: StudioVideoMetrics;
};

type AnalyticsSample = {
  coverageLabel: string;
  importSummary: StudioImportSummary | null;
  videos: ChannelVideo[];
};

type StudioAnalyticsPageProps = {
  benchmark: AnalyticsSample;
  busy: boolean;
  canImportAnalytics: boolean;
  compare: AnalyticsSample;
  main: AnalyticsSample;
  onImportBenchmarkAnalytics: () => void;
  onImportCompareAnalytics: () => void;
  onImportMainAnalytics: () => void;
  onOpenChannelLab: () => void;
  onOpenVideoBrief: (video: ChannelVideo) => void;
};

type AnalyticsAggregate = {
  averageCtr: number | null;
  averageImpressions: number | null;
  averageRetention: number | null;
  averageViews: number | null;
  matchedVideos: number;
  topTrafficSource: string;
};

function formatMetricCount(value: number | null | undefined): string {
  if (value === null || value === undefined || !Number.isFinite(value)) return "n/a";
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(value >= 10_000_000 ? 0 : 1)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(value >= 100_000 ? 0 : 1)}K`;
  return `${Math.round(value)}`;
}

function formatPercentage(value: number | null | undefined): string {
  if (value === null || value === undefined || !Number.isFinite(value)) return "n/a";
  return `${value.toFixed(value >= 10 ? 0 : 1)}%`;
}

function average(values: Array<number | null | undefined>): number | null {
  const numeric = values.filter((value): value is number => value !== null && value !== undefined && Number.isFinite(value));
  if (numeric.length === 0) return null;
  return numeric.reduce((sum, value) => sum + value, 0) / numeric.length;
}

function buildAggregate(videos: ChannelVideo[]): AnalyticsAggregate {
  const matched = videos.filter((video) => video.studioMetrics);
  const trafficCounts = new Map<string, number>();

  for (const video of matched) {
    const source = video.studioMetrics?.trafficSources[0]?.source?.trim();
    if (!source) continue;
    trafficCounts.set(source, (trafficCounts.get(source) ?? 0) + 1);
  }

  const topTrafficSource = [...trafficCounts.entries()].sort((left, right) => right[1] - left[1])[0]?.[0] ?? "";

  return {
    averageCtr: average(matched.map((video) => video.studioMetrics?.impressionsCtr ?? null)),
    averageImpressions: average(matched.map((video) => video.studioMetrics?.impressions ?? null)),
    averageRetention: average(matched.map((video) => video.studioMetrics?.averagePercentageViewed ?? null)),
    averageViews: average(matched.map((video) => video.studioMetrics?.views ?? null)),
    matchedVideos: matched.length,
    topTrafficSource,
  };
}

function SampleAnalyticsSection({
  aggregate,
  busy,
  canImportAnalytics,
  coverageLabel,
  importSummary,
  onImport,
  onOpenVideoBrief,
  title,
  videos,
}: {
  aggregate: AnalyticsAggregate;
  busy: boolean;
  canImportAnalytics: boolean;
  coverageLabel: string;
  importSummary: StudioImportSummary | null;
  onImport: () => void;
  onOpenVideoBrief: (video: ChannelVideo) => void;
  title: string;
  videos: ChannelVideo[];
}) {
  return (
    <article className="summary-block channel-breakdown-card">
      <div className="section-header">
        <div>
          <h3>{title}</h3>
          <p>Matched Studio metrics, packaging performance, and the clearest handoff signals from the imported CSV.</p>
        </div>
        <span className="meta-text">{coverageLabel}</span>
      </div>

      <div className="button-row">
        <button type="button" className="secondary-button" onClick={onImport} disabled={busy || !canImportAnalytics || videos.length === 0}>Import Studio CSV</button>
      </div>

      {importSummary ? (
        <p className="channel-helper-note">
          {importSummary.fileName} | {importSummary.kind === "traffic-source" ? "Traffic Source" : "Video Performance"} | {importSummary.matchedCount} matched{importSummary.unmatchedCount > 0 ? ` | ${importSummary.unmatchedCount} unmatched` : ""} | {importSummary.rowCount} rows
        </p>
      ) : null}

      {videos.length === 0 ? (
        <div className="empty-state-card">
          <strong>No Videos Loaded Yet</strong>
          <p className="empty-copy">Load this feed in Channel Lab first, then import the matching YouTube Studio CSV here.</p>
        </div>
      ) : (
        <>
          <div className="report-kpi-row">
            <article className="report-kpi-card">
              <strong>{aggregate.matchedVideos}</strong>
              <span>Matched Videos</span>
            </article>
            <article className="report-kpi-card">
              <strong>{formatMetricCount(aggregate.averageViews)}</strong>
              <span>Avg Views</span>
            </article>
            <article className="report-kpi-card">
              <strong>{formatMetricCount(aggregate.averageImpressions)}</strong>
              <span>Avg Impressions</span>
            </article>
            <article className="report-kpi-card">
              <strong>{formatPercentage(aggregate.averageCtr)}</strong>
              <span>Avg CTR</span>
            </article>
            <article className="report-kpi-card">
              <strong>{formatPercentage(aggregate.averageRetention)}</strong>
              <span>Avg Retention</span>
            </article>
          </div>

          <div className="chip-row">
            <span className="chip">{coverageLabel}</span>
            <span className="chip">{aggregate.topTrafficSource ? `Top Traffic: ${aggregate.topTrafficSource}` : "Traffic Source Pending"}</span>
          </div>

          <div className="channel-video-list">
            {videos.map((video) => (
              <article key={video.videoId} className="channel-video-item">
                <div className="planner-head">
                  <strong>{video.title}</strong>
                  <button type="button" className="secondary-button" onClick={() => onOpenVideoBrief(video)}>Open Brief</button>
                </div>
                <p>{[video.publishedLabel, video.viewLabel].filter(Boolean).join(" | ") || video.url}</p>
                {video.studioMetrics ? (
                  <div className="chip-row studio-chip-row">
                    {video.studioMetrics.views !== null ? <span className="chip">Views {formatMetricCount(video.studioMetrics.views)}</span> : null}
                    {video.studioMetrics.impressions !== null ? <span className="chip">Imp {formatMetricCount(video.studioMetrics.impressions)}</span> : null}
                    {video.studioMetrics.impressionsCtr !== null ? <span className="chip">CTR {formatPercentage(video.studioMetrics.impressionsCtr)}</span> : null}
                    {video.studioMetrics.averagePercentageViewed !== null ? <span className="chip">Retention {formatPercentage(video.studioMetrics.averagePercentageViewed)}</span> : null}
                    {video.studioMetrics.averageViewDurationSeconds !== null ? <span className="chip">AVD {formatStudioDuration(video.studioMetrics.averageViewDurationSeconds)}</span> : null}
                    {video.studioMetrics.trafficSources[0] ? <span className="chip">{video.studioMetrics.trafficSources[0].source}</span> : null}
                  </div>
                ) : (
                  <p className="empty-copy">No Studio metrics matched yet for this video.</p>
                )}
              </article>
            ))}
          </div>
        </>
      )}
    </article>
  );
}

export function StudioAnalyticsPage({
  benchmark,
  busy,
  canImportAnalytics,
  compare,
  main,
  onImportBenchmarkAnalytics,
  onImportCompareAnalytics,
  onImportMainAnalytics,
  onOpenChannelLab,
  onOpenVideoBrief,
}: StudioAnalyticsPageProps) {
  const allVideos = [...main.videos, ...compare.videos, ...benchmark.videos];
  const overallMatched = allVideos.filter((video) => video.studioMetrics).length;
  const overallLoaded = allVideos.length;
  const overallCoverage = overallLoaded > 0 ? `${overallMatched}/${overallLoaded} Matched Across Loaded Feeds` : "No Loaded Feeds Yet";

  return (
    <section className="simple-card">
      <div className="section-header">
        <div>
          <h2>Studio Analytics</h2>
          <p>Import YouTube Studio CSVs against the currently loaded channel samples, then review packaging and retention signals in one place.</p>
        </div>
        <span className="meta-text">{overallCoverage}</span>
      </div>

      <div className="button-row">
        <button type="button" className="secondary-button" onClick={onOpenChannelLab}>Open Channel Lab</button>
      </div>

      {overallLoaded === 0 ? (
        <div className="empty-state-card">
          <strong>No Analytics Feeds Ready Yet</strong>
          <p className="empty-copy">Load a main, compare, or benchmark feed in Channel Lab first. After that, this page becomes the dedicated home for Studio CSV overlays.</p>
        </div>
      ) : null}

      <div className="compare-grid">
        <SampleAnalyticsSection
          aggregate={buildAggregate(main.videos)}
          busy={busy}
          canImportAnalytics={canImportAnalytics}
          coverageLabel={main.coverageLabel}
          importSummary={main.importSummary}
          onImport={onImportMainAnalytics}
          onOpenVideoBrief={onOpenVideoBrief}
          title="Main Feed Analytics"
          videos={main.videos}
        />
        <SampleAnalyticsSection
          aggregate={buildAggregate(compare.videos)}
          busy={busy}
          canImportAnalytics={canImportAnalytics}
          coverageLabel={compare.coverageLabel}
          importSummary={compare.importSummary}
          onImport={onImportCompareAnalytics}
          onOpenVideoBrief={onOpenVideoBrief}
          title="Compare Feed Analytics"
          videos={compare.videos}
        />
        <SampleAnalyticsSection
          aggregate={buildAggregate(benchmark.videos)}
          busy={busy}
          canImportAnalytics={canImportAnalytics}
          coverageLabel={benchmark.coverageLabel}
          importSummary={benchmark.importSummary}
          onImport={onImportBenchmarkAnalytics}
          onOpenVideoBrief={onOpenVideoBrief}
          title="Benchmark Feed Analytics"
          videos={benchmark.videos}
        />
      </div>
    </section>
  );
}
