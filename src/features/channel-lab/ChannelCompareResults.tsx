import { type ChannelCompareBundle } from "../../premium";
import { formatStudioDuration } from "../../youtube-studio";

type CompareResultTab = "summary" | "winners" | "adapt" | "niche" | "deck";

type ChannelCompareResultsProps = {
  channelCompare: ChannelCompareBundle;
  cloneContextLabel: string;
  compareResultTab: CompareResultTab;
  onCompareResultTabChange: (tab: CompareResultTab) => void;
  onCopyReport: () => void;
  onExportPdf: () => void;
  onExportReport: () => void;
};

const COMPARE_RESULT_TAB_LABELS: Record<CompareResultTab, string> = {
  summary: "Summary",
  winners: "Winners",
  adapt: "Adapt",
  niche: "Niche Model",
  deck: "Deck",
};

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

export function ChannelCompareResults({
  channelCompare,
  cloneContextLabel,
  compareResultTab,
  onCompareResultTabChange,
  onCopyReport,
  onExportPdf,
  onExportReport,
}: ChannelCompareResultsProps) {
  return (
    <section className="simple-card">
      <div className="section-header">
        <div>
          <h2>Channel Compare</h2>
          <p>{channelCompare.primaryLabel} versus {channelCompare.competitorLabel} across packaging, topic breadth, and transcript intelligence.</p>
        </div>
        <span className="meta-text">{channelCompare.overlapThemes.length} Shared Themes | Avg Views {formatMetricCount(channelCompare.metrics.primaryAverageViews)} vs {formatMetricCount(channelCompare.metrics.competitorAverageViews)} | Studio {channelCompare.metrics.primaryStudioCoverage}% vs {channelCompare.metrics.competitorStudioCoverage}%</span>
      </div>
      <div className="result-tab-row">
        {(Object.keys(COMPARE_RESULT_TAB_LABELS) as CompareResultTab[]).map((tab) => (
          <button key={tab} type="button" className={`mode-pill ${compareResultTab === tab ? "is-active" : ""}`} onClick={() => onCompareResultTabChange(tab)}>
            {COMPARE_RESULT_TAB_LABELS[tab]}
          </button>
        ))}
      </div>
      <div className="compare-grid">
        {compareResultTab === "summary" ? (
          <>
            <article className="summary-block compare-hero-card">
              <h3>Overview</h3>
              <p>{channelCompare.overview}</p>
              <div className="report-kpi-row">
                <article className="report-kpi-card">
                  <strong>{channelCompare.overlapThemes.length}</strong>
                  <span>Shared Themes</span>
                </article>
                <article className="report-kpi-card">
                  <strong>{formatMetricCount(channelCompare.metrics.primaryAverageViews)}</strong>
                  <span>{channelCompare.primaryLabel} Avg Views</span>
                </article>
                <article className="report-kpi-card">
                  <strong>{formatMetricCount(channelCompare.metrics.competitorAverageViews)}</strong>
                  <span>{channelCompare.competitorLabel} Avg Views</span>
                </article>
                {channelCompare.metrics.primaryAverageCtr > 0 ? <article className="report-kpi-card">
                  <strong>{formatPercentage(channelCompare.metrics.primaryAverageCtr)}</strong>
                  <span>{channelCompare.primaryLabel} Avg CTR</span>
                </article> : null}
                {channelCompare.metrics.competitorAverageCtr > 0 ? <article className="report-kpi-card">
                  <strong>{formatPercentage(channelCompare.metrics.competitorAverageCtr)}</strong>
                  <span>{channelCompare.competitorLabel} Avg CTR</span>
                </article> : null}
              </div>
              <div className="chip-row">
                {channelCompare.overlapThemes.length > 0 ? channelCompare.overlapThemes.map((theme) => <span key={theme} className="chip">{theme}</span>) : <span className="chip">Low Direct Topic Overlap</span>}
              </div>
            </article>
            <article className="summary-block">
              <h3>Scoreboard</h3>
              <div className="compare-metric-list">
                <div className="compare-metric-item"><strong>{channelCompare.primaryLabel}</strong><span>Sample {channelCompare.metrics.primarySampleSize} Videos</span><span>Avg Title Score {channelCompare.metrics.primaryAverageTitleScore}</span><span>Avg Views {formatMetricCount(channelCompare.metrics.primaryAverageViews)}</span><span>Studio Coverage {channelCompare.metrics.primaryStudioCoverage}%</span><span>Avg Impressions {formatMetricCount(channelCompare.metrics.primaryAverageImpressions)}</span><span>Avg CTR {formatPercentage(channelCompare.metrics.primaryAverageCtr)}</span><span>Avg Retention {formatPercentage(channelCompare.metrics.primaryAverageRetention)}</span><span>Avg View Duration {channelCompare.metrics.primaryAverageViewDurationSeconds > 0 ? formatStudioDuration(channelCompare.metrics.primaryAverageViewDurationSeconds) : "n/a"}</span><span>Transcript Coverage {channelCompare.metrics.primaryTranscriptCoverage}%</span><span>Avg Transcript Words {channelCompare.metrics.primaryAverageTranscriptWords}</span></div>
                <div className="compare-metric-item"><strong>{channelCompare.competitorLabel}</strong><span>Sample {channelCompare.metrics.competitorSampleSize} Videos</span><span>Avg Title Score {channelCompare.metrics.competitorAverageTitleScore}</span><span>Avg Views {formatMetricCount(channelCompare.metrics.competitorAverageViews)}</span><span>Studio Coverage {channelCompare.metrics.competitorStudioCoverage}%</span><span>Avg Impressions {formatMetricCount(channelCompare.metrics.competitorAverageImpressions)}</span><span>Avg CTR {formatPercentage(channelCompare.metrics.competitorAverageCtr)}</span><span>Avg Retention {formatPercentage(channelCompare.metrics.competitorAverageRetention)}</span><span>Avg View Duration {channelCompare.metrics.competitorAverageViewDurationSeconds > 0 ? formatStudioDuration(channelCompare.metrics.competitorAverageViewDurationSeconds) : "n/a"}</span><span>Transcript Coverage {channelCompare.metrics.competitorTranscriptCoverage}%</span><span>Avg Transcript Words {channelCompare.metrics.competitorAverageTranscriptWords}</span></div>
              </div>
            </article>
          </>
        ) : null}

        {compareResultTab === "winners" ? (
          <>
            <article className="summary-block">
              <h3>Key Winners</h3>
              <div className="compare-decision-list">
                {channelCompare.decisions.map((decision) => (
                  <article key={decision.category} className="compare-decision-item">
                    <strong>{decision.category}</strong>
                    <span className="chip">{decision.winner}</span>
                    <p>{decision.note}</p>
                  </article>
                ))}
              </div>
            </article>
            <article className="summary-block">
              <h3>Recommendations</h3>
              <ul className="plain-list">{channelCompare.recommendations.map((item) => <li key={item}>{item}</li>)}</ul>
            </article>
            <article className="summary-block">
              <h3>Whitespace Opportunities</h3>
              <ul className="plain-list">{channelCompare.whitespaceOpportunities.map((item) => <li key={item}>{item}</li>)}</ul>
            </article>
          </>
        ) : null}

        {compareResultTab === "adapt" ? (
          <>
            <article className="summary-block compare-hero-card">
              <h3>Adapt To Me</h3>
              <p>{channelCompare.adaptToMe.overview}</p>
              <div className="chip-row">
                <span className="chip">Main Feed = Your Channel</span>
                <span className="chip">Compare Feed = Model Channel</span>
                <span className="chip">{cloneContextLabel}</span>
              </div>
            </article>
            <article className="summary-block">
              <h3>Strengths To Keep</h3>
              <ul className="plain-list">{channelCompare.adaptToMe.strengthsToKeep.map((item) => <li key={item}>{item}</li>)}</ul>
            </article>
            <article className="summary-block">
              <h3>Close These Gaps</h3>
              <ul className="plain-list">{channelCompare.adaptToMe.closeGaps.map((item) => <li key={item}>{item}</li>)}</ul>
            </article>
            <article className="summary-block">
              <h3>Borrow First</h3>
              <ul className="plain-list">{channelCompare.adaptToMe.borrowFirst.map((item) => <li key={item}>{item}</li>)}</ul>
            </article>
            <article className="summary-block">
              <h3>30-Day Experiments</h3>
              <ul className="plain-list">{channelCompare.adaptToMe.experiments.map((item) => <li key={item}>{item}</li>)}</ul>
            </article>
            <article className="summary-block">
              <h3>Cautions</h3>
              <ul className="plain-list">{channelCompare.adaptToMe.cautions.map((item) => <li key={item}>{item}</li>)}</ul>
            </article>
          </>
        ) : null}

        {compareResultTab === "niche" ? (
          channelCompare.nicheModel ? (
            <>
              <article className="summary-block compare-hero-card">
                <h3>Niche Model</h3>
                <p>{channelCompare.nicheModel.overview}</p>
                <div className="report-kpi-row">
                  <article className="report-kpi-card">
                    <strong>{channelCompare.nicheModel.comparedChannels.length}</strong>
                    <span>Channels Modeled</span>
                  </article>
                  <article className="report-kpi-card">
                    <strong>{channelCompare.nicheModel.sharedThemes.length}</strong>
                    <span>Shared Themes</span>
                  </article>
                  <article className="report-kpi-card">
                    <strong>{channelCompare.nicheModel.sharedFormats.length}</strong>
                    <span>Shared Formats</span>
                  </article>
                  <article className="report-kpi-card">
                    <strong>{channelCompare.nicheModel.sharedThumbnailPhrases.length}</strong>
                    <span>Shared Thumbnail Phrases</span>
                  </article>
                </div>
                <div className="chip-row">
                  {channelCompare.nicheModel.comparedChannels.map((channel) => <span key={channel} className="chip">{channel}</span>)}
                </div>
              </article>
              <article className="summary-block">
                <h3>Shared Themes</h3>
                <ul className="plain-list">{channelCompare.nicheModel.sharedThemes.length > 0 ? channelCompare.nicheModel.sharedThemes.map((item) => <li key={item}>{item}</li>) : <li>No strong shared themes surfaced yet.</li>}</ul>
              </article>
              <article className="summary-block">
                <h3>Shared Formats</h3>
                <ul className="plain-list">{channelCompare.nicheModel.sharedFormats.length > 0 ? channelCompare.nicheModel.sharedFormats.map((item) => <li key={item}>{item}</li>) : <li>No clear format consensus surfaced yet.</li>}</ul>
              </article>
              <article className="summary-block">
                <h3>Shared Hooks</h3>
                <ul className="plain-list">{channelCompare.nicheModel.sharedHooks.length > 0 ? channelCompare.nicheModel.sharedHooks.map((item) => <li key={item}>{item}</li>) : <li>No clear hook consensus surfaced yet.</li>}</ul>
              </article>
              <article className="summary-block">
                <h3>Shared Thumbnail Phrases</h3>
                <ul className="plain-list">{channelCompare.nicheModel.sharedThumbnailPhrases.length > 0 ? channelCompare.nicheModel.sharedThumbnailPhrases.map((item) => <li key={item}>{item}</li>) : <li>Thumbnail phrasing still looks more channel-specific than niche-wide.</li>}</ul>
              </article>
              <article className="summary-block">
                <h3>Shared Growth System</h3>
                <ul className="plain-list">{channelCompare.nicheModel.growthSystem.map((item) => <li key={item}>{item}</li>)}</ul>
              </article>
              <article className="summary-block">
                <h3>Packaging Rules</h3>
                <ul className="plain-list">{channelCompare.nicheModel.packagingRules.map((item) => <li key={item}>{item}</li>)}</ul>
              </article>
              <article className="summary-block">
                <h3>Content System</h3>
                <ul className="plain-list">{channelCompare.nicheModel.contentSystem.map((item) => <li key={item}>{item}</li>)}</ul>
              </article>
              <article className="summary-block">
                <h3>Audience Angles</h3>
                <ul className="plain-list">{channelCompare.nicheModel.audienceAngles.map((item) => <li key={item}>{item}</li>)}</ul>
              </article>
              <article className="summary-block">
                <h3>Momentum Signals</h3>
                <ul className="plain-list">{channelCompare.nicheModel.momentumSignals.map((item) => <li key={item}>{item}</li>)}</ul>
              </article>
              <article className="summary-block">
                <h3>Whitespace Angles</h3>
                <ul className="plain-list">{channelCompare.nicheModel.whitespaceAngles.map((item) => <li key={item}>{item}</li>)}</ul>
              </article>
              <article className="summary-block">
                <h3>Experiments</h3>
                <ul className="plain-list">{channelCompare.nicheModel.experiments.map((item) => <li key={item}>{item}</li>)}</ul>
              </article>
              <article className="summary-block">
                <h3>Cautions</h3>
                <ul className="plain-list">{channelCompare.nicheModel.cautions.map((item) => <li key={item}>{item}</li>)}</ul>
              </article>
              <article className="summary-block channel-breakdown-card">
                <div className="section-header">
                  <div>
                    <h3>Channel Snapshots</h3>
                    <p>Quick per-channel reads so the shared niche system stays grounded in the actual sample.</p>
                  </div>
                  <span className="meta-text">{channelCompare.nicheModel.channelSnapshots.length} Channels</span>
                </div>
                <div className="channel-video-list">
                  {channelCompare.nicheModel.channelSnapshots.map((item) => (
                    <article key={item.channelLabel} className="channel-video-item">
                      <strong>{item.channelLabel}</strong>
                      <div className="chip-row">
                        <span className="chip">{item.sampleSize} Videos</span>
                        <span className="chip">Avg Views {formatMetricCount(item.averageViews)}</span>
                        <span className="chip">Title Score {item.averageTitleScore}</span>
                        <span className="chip">Transcript {item.transcriptCoverage}%</span>
                        <span className="chip">{item.dominantFormat}</span>
                        <span className="chip">{item.dominantHook}</span>
                        <span className="chip">{item.leadTheme}</span>
                        {item.leadThumbnailPhrase ? <span className="chip">{item.leadThumbnailPhrase}</span> : null}
                      </div>
                    </article>
                  ))}
                </div>
              </article>
            </>
          ) : (
            <article className="summary-block compare-hero-card">
              <h3>Niche Model</h3>
              <p>Reload this compare to generate the latest niche model across the loaded channels.</p>
            </article>
          )
        ) : null}

        {compareResultTab === "deck" ? (
          <article className="summary-block compare-export-card">
            <div className="section-header">
              <div>
                <h3>Compare Report</h3>
                <p>A ready markdown compare report for strategy, client audits, or competitor research.</p>
              </div>
              <span className="meta-text">Markdown</span>
            </div>
            <div className="button-row">
              <button type="button" className="secondary-button" onClick={onCopyReport}>Copy Report</button>
              <button type="button" className="secondary-button" onClick={onExportReport}>Export Report</button>
              <button type="button" className="secondary-button" onClick={onExportPdf}>Export PDF</button>
            </div>
            <textarea className="export-preview description-preview" value={channelCompare.exportDeck} readOnly />
          </article>
        ) : null}
      </div>
    </section>
  );
}
