import {
  type ChannelDeepDiveBundle,
  type CloneChannelBundle,
} from "../../premium";

type ChannelResultTab = "overview" | "dna" | "winning" | "titles" | "thumbnails" | "hooks" | "audience" | "monetization" | "adapt" | "action";

type ClonePlanResultsProps = {
  channelDeepDive: ChannelDeepDiveBundle;
  channelResultTab: ChannelResultTab;
  cloneChannel: CloneChannelBundle;
  cloneContextLabel: string;
  myChannelDeepDive: ChannelDeepDiveBundle | null;
  myChannelVideoCount: number;
  onChannelResultTabChange: (tab: ChannelResultTab) => void;
  onCopyReport: () => void;
  onExportPdf: () => void;
  onExportReport: () => void;
  onOpenVideoBrief: (title: string, url: string) => void;
};

const CHANNEL_RESULT_TAB_LABELS: Record<ChannelResultTab, string> = {
  overview: "Overview",
  dna: "DNA",
  winning: "Winning Videos",
  titles: "Titles",
  thumbnails: "Thumbnails",
  hooks: "Hooks",
  audience: "Audience",
  monetization: "Monetization",
  adapt: "Adapt To Me",
  action: "Action Plan",
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

function getScorecardItem(items: { label: string; score: number; note: string }[], label: string) {
  return items.find((item) => item.label === label);
}

function formatSampleScopeLabel(selectedCount: number, loadedCount: number) {
  if (loadedCount === 0) return "No Sample";
  return selectedCount >= loadedCount ? "Full Sample" : "Filtered Sample";
}

export function ClonePlanResults({
  channelDeepDive,
  channelResultTab,
  cloneChannel,
  cloneContextLabel,
  myChannelDeepDive,
  myChannelVideoCount,
  onChannelResultTabChange,
  onCopyReport,
  onExportPdf,
  onExportReport,
  onOpenVideoBrief,
}: ClonePlanResultsProps) {
  return (
    <section className="simple-card">
      <div className="section-header">
        <div>
          <h2>Clone Plan</h2>
          <p>{cloneChannel.targetLabel} translated into a clone-first operating system across packaging, content DNA, and action steps.</p>
        </div>
        <span className="meta-text">{formatSampleScopeLabel(channelDeepDive.analyzedVideos, channelDeepDive.sourceVideoCount)} | {channelDeepDive.analyzedVideos} Selected / {channelDeepDive.sourceVideoCount} Loaded | {channelDeepDive.transcriptCoverage}% Transcript Coverage | Avg Views {formatMetricCount(channelDeepDive.averageViewCount)} | Studio {channelDeepDive.studioMetrics.coverage}% | {cloneChannel.myChannelLabel ? `Adapted Against ${cloneChannel.myChannelLabel}` : "Context-Led Adaptation"}</span>
      </div>
      <div className="result-tab-row">
        {(Object.keys(CHANNEL_RESULT_TAB_LABELS) as ChannelResultTab[]).map((tab) => (
          <button key={tab} type="button" className={`mode-pill ${channelResultTab === tab ? "is-active" : ""}`} onClick={() => onChannelResultTabChange(tab)}>
            {CHANNEL_RESULT_TAB_LABELS[tab]}
          </button>
        ))}
      </div>
      <div className="channel-dive-grid">
        {channelResultTab === "overview" ? (
          <>
            <article className="summary-block channel-hero-card">
              <h3>Overview</h3>
              <p>{cloneChannel.overview}</p>
              <div className="report-kpi-row">
                <article className="report-kpi-card">
                  <strong>{channelDeepDive.analyzedVideos}</strong>
                  <span>Selected Videos</span>
                </article>
                <article className="report-kpi-card">
                  <strong>{channelDeepDive.transcriptCoverage}%</strong>
                  <span>Transcript Coverage</span>
                </article>
                <article className="report-kpi-card">
                  <strong>{formatMetricCount(channelDeepDive.averageViewCount)}</strong>
                  <span>Average Views</span>
                </article>
                {channelDeepDive.studioMetrics.averageImpressionsCtr > 0 ? <article className="report-kpi-card">
                  <strong>{formatPercentage(channelDeepDive.studioMetrics.averageImpressionsCtr)}</strong>
                  <span>Average CTR</span>
                </article> : null}
                {channelDeepDive.studioMetrics.averagePercentageViewed > 0 ? <article className="report-kpi-card">
                  <strong>{formatPercentage(channelDeepDive.studioMetrics.averagePercentageViewed)}</strong>
                  <span>Average Retention</span>
                </article> : null}
                {getScorecardItem(cloneChannel.scores, "Cloneability") ? <article className="report-kpi-card">
                  <strong>{getScorecardItem(cloneChannel.scores, "Cloneability")?.score}</strong>
                  <span>Cloneability</span>
                </article> : null}
              </div>
              <div className="chip-row">
                <span className="chip">{formatSampleScopeLabel(channelDeepDive.analyzedVideos, channelDeepDive.sourceVideoCount)}</span>
                <span className="chip">{cloneContextLabel}</span>
                {cloneChannel.myChannelLabel ? <span className="chip">My Channel: {cloneChannel.myChannelLabel}</span> : null}
                {myChannelVideoCount > 0 ? <span className="chip">My Channel Sample {myChannelVideoCount}</span> : null}
                {channelDeepDive.topicClusters.map((cluster) => <span key={cluster} className="chip">{cluster}</span>)}
              </div>
            </article>
            <article className="summary-block">
              <h3>Clone Score Snapshot</h3>
              <div className="scorecard-grid">
                {cloneChannel.scores.map((item) => (
                  <article key={item.label} className="scorecard-item">
                    <div className="scorecard-header">
                      <strong>{item.label}</strong>
                      <span>{item.score}/100</span>
                    </div>
                    <p>{item.note}</p>
                  </article>
                ))}
              </div>
            </article>
            <article className="summary-block">
              <h3>Top Lessons</h3>
              <ul className="plain-list">{cloneChannel.topLessons.map((item) => <li key={item}>{item}</li>)}</ul>
            </article>
            <article className="summary-block">
              <h3>Top Risks</h3>
              <ul className="plain-list">{cloneChannel.topRisks.map((item) => <li key={item}>{item}</li>)}</ul>
            </article>
            {channelDeepDive.studioMetrics.coverage > 0 ? <article className="summary-block">
              <h3>Studio Metrics</h3>
              <p>{channelDeepDive.studioMetrics.matchedVideos} of {channelDeepDive.analyzedVideos} selected videos matched imported Studio rows. Average impressions sit around {formatMetricCount(channelDeepDive.studioMetrics.averageImpressions)}, CTR around {formatPercentage(channelDeepDive.studioMetrics.averageImpressionsCtr)}, and average percentage viewed around {formatPercentage(channelDeepDive.studioMetrics.averagePercentageViewed)}.</p>
              {channelDeepDive.studioMetrics.topTrafficSources.length > 0 ? <div className="chip-row">{channelDeepDive.studioMetrics.topTrafficSources.map((source) => <span key={source} className="chip">{source}</span>)}</div> : null}
            </article> : null}
            <article className="summary-block">
              <h3>Sample Read</h3>
              <p>{channelDeepDive.sampleNote}</p>
            </article>
            <article className="summary-block">
              <h3>Channel Scorecard</h3>
              <div className="scorecard-grid">
                {channelDeepDive.scorecard.map((item) => (
                  <article key={item.label} className="scorecard-item">
                    <div className="scorecard-header">
                      <strong>{item.label}</strong>
                      <span>{item.score}/100</span>
                    </div>
                    <p>{item.note}</p>
                  </article>
                ))}
              </div>
            </article>
          </>
        ) : null}

        {channelResultTab === "dna" ? (
          <>
            <article className="summary-block channel-hero-card">
              <h3>Core Promise</h3>
              <p>{cloneChannel.dna.promise}</p>
              <div className="chip-row">
                {cloneChannel.dna.pillars.map((item) => <span key={`dna-pillar-${item}`} className="chip">{item}</span>)}
              </div>
            </article>
            <article className="summary-block">
              <h3>Audience</h3>
              <ul className="plain-list">{cloneChannel.dna.audience.map((item) => <li key={`aud-${item}`}>{item}</li>)}</ul>
            </article>
            <article className="summary-block">
              <h3>Content Pillars</h3>
              <ul className="plain-list">{cloneChannel.dna.pillars.map((item) => <li key={`pillar-${item}`}>{item}</li>)}</ul>
            </article>
            <article className="summary-block">
              <h3>Format Mix</h3>
              <ul className="plain-list">{cloneChannel.dna.formats.map((item) => <li key={`format-${item}`}>{item}</li>)}</ul>
            </article>
            <article className="summary-block">
              <h3>Tone</h3>
              <ul className="plain-list">{cloneChannel.dna.tone.map((item) => <li key={`tone-${item}`}>{item}</li>)}</ul>
            </article>
            <article className="summary-block">
              <h3>Creator Edge</h3>
              <ul className="plain-list">{cloneChannel.dna.creatorEdge.map((item) => <li key={`edge-${item}`}>{item}</li>)}</ul>
            </article>
            <article className="summary-block">
              <h3>Signature Moves</h3>
              <ul className="plain-list">{channelDeepDive.signatureMoves.map((item) => <li key={item}>{item}</li>)}</ul>
            </article>
            <article className="summary-block">
              <h3>Style DNA</h3>
              <ul className="plain-list">{channelDeepDive.styleDNA.map((item) => <li key={item}>{item}</li>)}</ul>
            </article>
            <article className="summary-block">
              <h3>Content Architecture</h3>
              <ul className="plain-list">{channelDeepDive.contentArchitecture.map((item) => <li key={item}>{item}</li>)}</ul>
            </article>
            <article className="summary-block">
              <h3>Publishing System</h3>
              <ul className="plain-list">{channelDeepDive.publishingSystem.map((item) => <li key={item}>{item}</li>)}</ul>
            </article>
          </>
        ) : null}

        {channelResultTab === "winning" ? (
          <>
            <article className="summary-block channel-hero-card">
              <h3>Top Performer Snapshot</h3>
              {cloneChannel.winningVideos.topPerformer ? (
                <>
                  <strong>{cloneChannel.winningVideos.topPerformer.title}</strong>
                  <p>{cloneChannel.winningVideos.topPerformer.summary}</p>
                  <div className="chip-row">
                    <span className="chip">Score {cloneChannel.winningVideos.topPerformer.titleScore}</span>
                    <span className="chip">{cloneChannel.winningVideos.topPerformer.primaryTheme}</span>
                    <span className="chip">{cloneChannel.winningVideos.topPerformer.formatType}</span>
                    <span className="chip">{cloneChannel.winningVideos.topPerformer.hookType}</span>
                    <span className="chip">{cloneChannel.winningVideos.topPerformer.performanceLabel}</span>
                  </div>
                </>
              ) : <p>No performance snapshot is available yet.</p>}
            </article>
            <article className="summary-block">
              <h3>Winner Vs Baseline</h3>
              <ul className="plain-list">{cloneChannel.winningVideos.winnerVsBaseline.map((item) => <li key={item}>{item}</li>)}</ul>
            </article>
            <article className="summary-block">
              <h3>Steal These Structures</h3>
              <ul className="plain-list">{cloneChannel.winningVideos.stealTheseStructures.map((item) => <li key={item}>{item}</li>)}</ul>
            </article>
            <article className="summary-block channel-breakdown-card">
              <div className="section-header">
                <div>
                  <h3>Winning Videos</h3>
                  <p>Highest-performing uploads in the current sample.</p>
                </div>
                <span className="meta-text">{cloneChannel.winningVideos.winners.length} Videos</span>
              </div>
              <div className="channel-video-list">
                {cloneChannel.winningVideos.winners.map((video) => (
                  <article key={video.videoId} className="channel-video-item">
                    <strong>{video.title}</strong>
                    <p>{video.summary}</p>
                    <div className="chip-row">
                      <span className="chip">Score {video.titleScore}</span>
                      <span className="chip">{video.primaryTheme}</span>
                      <span className="chip">{video.formatType}</span>
                      <span className="chip">{video.hookType}</span>
                      <span className="chip">{video.performanceLabel}</span>
                    </div>
                  </article>
                ))}
              </div>
            </article>
            <article className="summary-block channel-breakdown-card">
              <div className="section-header">
                <div>
                  <h3>Underperformers</h3>
                  <p>Useful baseline uploads so the winning system stays grounded.</p>
                </div>
                <span className="meta-text">{cloneChannel.winningVideos.underperformers.length} Videos</span>
              </div>
              <div className="channel-video-list">
                {cloneChannel.winningVideos.underperformers.map((video) => (
                  <article key={video.videoId} className="channel-video-item">
                    <strong>{video.title}</strong>
                    <p>{video.summary}</p>
                    <div className="chip-row">
                      <span className="chip">Score {video.titleScore}</span>
                      <span className="chip">{video.primaryTheme}</span>
                      <span className="chip">{video.formatType}</span>
                      <span className="chip">{video.hookType}</span>
                      <span className="chip">{video.performanceLabel}</span>
                    </div>
                  </article>
                ))}
              </div>
            </article>
            <article className="summary-block channel-breakdown-card">
              <div className="section-header">
                <div>
                  <h3>Per-Video Performance Breakdown</h3>
                  <p>Full sample view filtered through performance framing so you can inspect repeatable patterns.</p>
                </div>
                <span className="meta-text">{channelDeepDive.videoBreakdowns.length} Selected Videos</span>
              </div>
              <div className="channel-video-list">
                {channelDeepDive.videoBreakdowns.map((video) => (
                  <article key={video.videoId} className="channel-video-item">
                    <div className="planner-head">
                      <div className="shorts-meta">
                        <span className="chip">Score {video.titleScore}</span>
                        <span className="chip">{video.primaryTheme}</span>
                        <span className="chip">{video.formatType}</span>
                        <span className="chip">{video.hookType}</span>
                        <span className="chip">{video.performanceLabel}</span>
                      </div>
                      <button type="button" className="timestamp-button" onClick={() => onOpenVideoBrief(video.title, video.url)}>
                        Open Brief
                      </button>
                    </div>
                    <strong>{video.title}</strong>
                    <p>{video.summary}</p>
                    <div className="planner-foot">
                      <span>{video.publishedLabel || "Recent Upload"}</span>
                      <span>{video.viewLabel || "View Count Unavailable"}</span>
                    </div>
                  </article>
                ))}
              </div>
            </article>
          </>
        ) : null}

        {channelResultTab === "titles" ? (
          <>
            <article className="summary-block channel-hero-card">
              <h3>Title System</h3>
              <p>{cloneChannel.titleIntel.clarityVsCuriosity[0] ?? "Title strategy patterns are ready below."}</p>
              <div className="chip-row">
                {cloneChannel.titleIntel.triggerWords.length > 0
                  ? cloneChannel.titleIntel.triggerWords.map((item) => <span key={item} className="chip">{item}</span>)
                  : <span className="chip">Low Trigger-Word Repetition</span>}
              </div>
            </article>
            <article className="summary-block">
              <h3>Title Formula Mix</h3>
              <ul className="plain-list">{cloneChannel.titleIntel.formulaMix.map((item) => <li key={item}>{item}</li>)}</ul>
            </article>
            <article className="summary-block">
              <h3>Curiosity Vs Clarity</h3>
              <ul className="plain-list">{cloneChannel.titleIntel.clarityVsCuriosity.map((item) => <li key={item}>{item}</li>)}</ul>
            </article>
            <article className="summary-block">
              <h3>Templates To Adapt</h3>
              <ul className="plain-list">{cloneChannel.titleIntel.templates.map((item) => <li key={item}>{item}</li>)}</ul>
            </article>
            <article className="summary-block">
              <h3>Patterns To Avoid</h3>
              <ul className="plain-list">{cloneChannel.titleIntel.avoidPatterns.map((item) => <li key={item}>{item}</li>)}</ul>
            </article>
            <article className="summary-block">
              <h3>SEO Audit</h3>
              <ul className="plain-list">{channelDeepDive.seoAudit.map((item) => <li key={item}>{item}</li>)}</ul>
            </article>
            <article className="summary-block">
              <h3>Description Signals</h3>
              <ul className="plain-list">{channelDeepDive.descriptionSignals.map((item) => <li key={item}>{item}</li>)}</ul>
            </article>
          </>
        ) : null}

        {channelResultTab === "thumbnails" ? (
          <>
            <article className="summary-block">
              <h3>Thumbnail Board</h3>
              <p>{cloneChannel.thumbnailIntel.summary}</p>
              <div className="chip-row">
                {cloneChannel.thumbnailIntel.board.repeatedPhrases.length > 0
                  ? cloneChannel.thumbnailIntel.board.repeatedPhrases.map((item) => <span key={item} className="chip">{item}</span>)
                  : <span className="chip">Low-Text Visual System</span>}
              </div>
            </article>
            <article className="summary-block">
              <h3>Density Notes</h3>
              <ul className="plain-list">{cloneChannel.thumbnailIntel.board.densityNotes.map((item) => <li key={item}>{item}</li>)}</ul>
            </article>
            <article className="summary-block">
              <h3>Messaging Notes</h3>
              <ul className="plain-list">{cloneChannel.thumbnailIntel.board.messagingNotes.map((item) => <li key={item}>{item}</li>)}</ul>
            </article>
            <article className="summary-block">
              <h3>Rules Worth Borrowing</h3>
              <ul className="plain-list">{cloneChannel.thumbnailIntel.board.rules.map((item) => <li key={item}>{item}</li>)}</ul>
            </article>
            <article className="summary-block">
              <h3>Thumbnail Text Signals</h3>
              <ul className="plain-list">{cloneChannel.thumbnailIntel.textSignals.map((item) => <li key={item}>{item}</li>)}</ul>
            </article>
            <article className="summary-block">
              <h3>Thumbnail Playbook</h3>
              <ul className="plain-list">{cloneChannel.thumbnailIntel.playbook.map((item) => <li key={item}>{item}</li>)}</ul>
            </article>
            <article className="summary-block channel-breakdown-card">
              <div className="section-header">
                <div>
                  <h3>Thumbnail Examples</h3>
                  <p>Readable title and thumbnail-text pairings from the current sample.</p>
                </div>
                <span className="meta-text">{cloneChannel.thumbnailIntel.board.examples.length} Examples</span>
              </div>
              <div className="channel-video-list">
                {cloneChannel.thumbnailIntel.board.examples.length === 0 ? <p className="empty-copy">No readable thumbnail-text examples were available in this sample.</p> : cloneChannel.thumbnailIntel.board.examples.map((example) => (
                  <article key={`${example.title}-${example.thumbnailText}`} className="channel-video-item">
                    <strong>{example.title}</strong>
                    <p>Thumbnail text: {example.thumbnailText}</p>
                  </article>
                ))}
              </div>
            </article>
          </>
        ) : null}

        {channelResultTab === "hooks" ? (
          <>
            <article className="summary-block">
              <h3>Dominant Hook Style</h3>
              <ul className="plain-list">{cloneChannel.hookIntel.dominantStyles.map((item) => <li key={item}>{item}</li>)}</ul>
            </article>
            <article className="summary-block">
              <h3>Hook Distribution</h3>
              <ul className="plain-list">{cloneChannel.hookIntel.distribution.map((item) => <li key={item}>{item}</li>)}</ul>
            </article>
            <article className="summary-block">
              <h3>Retention And Pacing Notes</h3>
              <ul className="plain-list">{cloneChannel.hookIntel.retentionNotes.map((item) => <li key={item}>{item}</li>)}</ul>
            </article>
            <article className="summary-block">
              <h3>Hook Templates</h3>
              <ul className="plain-list">{cloneChannel.hookIntel.templates.map((item) => <li key={item}>{item}</li>)}</ul>
            </article>
            <article className="summary-block">
              <h3>Hook Playbook</h3>
              <ul className="plain-list">{channelDeepDive.hookPlaybook.map((item) => <li key={item}>{item}</li>)}</ul>
            </article>
          </>
        ) : null}

        {channelResultTab === "audience" ? (
          <>
            <article className="summary-block channel-hero-card">
              <h3>Audience Positioning</h3>
              <p>{cloneChannel.audienceIntel.positioning[0] ?? "Audience positioning patterns are ready below."}</p>
              <div className="chip-row">
                {cloneChannel.dna.audience.map((item) => <span key={`aud-chip-${item}`} className="chip">{item}</span>)}
              </div>
            </article>
            <article className="summary-block">
              <h3>Audience Positioning</h3>
              <ul className="plain-list">{cloneChannel.audienceIntel.positioning.map((item) => <li key={item}>{item}</li>)}</ul>
            </article>
            <article className="summary-block">
              <h3>Audience Value Drivers</h3>
              <ul className="plain-list">{cloneChannel.audienceIntel.valueDrivers.map((item) => <li key={item}>{item}</li>)}</ul>
            </article>
            <article className="summary-block">
              <h3>Repeated Praise</h3>
              <ul className="plain-list">{cloneChannel.audienceIntel.praise.length > 0 ? cloneChannel.audienceIntel.praise.map((item) => <li key={item}>{item}</li>) : <li>No clear repeated praise surfaced from the current sample.</li>}</ul>
            </article>
            <article className="summary-block">
              <h3>Requests</h3>
              <ul className="plain-list">{cloneChannel.audienceIntel.requests.length > 0 ? cloneChannel.audienceIntel.requests.map((item) => <li key={item}>{item}</li>) : <li>No repeated requests surfaced from the current sample.</li>}</ul>
            </article>
            <article className="summary-block">
              <h3>Confusion</h3>
              <ul className="plain-list">{cloneChannel.audienceIntel.confusion.length > 0 ? cloneChannel.audienceIntel.confusion.map((item) => <li key={item}>{item}</li>) : <li>No major confusion patterns surfaced from the current sample.</li>}</ul>
            </article>
            <article className="summary-block">
              <h3>High-Signal Comments</h3>
              <ul className="plain-list">{cloneChannel.audienceIntel.highSignalComments.length > 0 ? cloneChannel.audienceIntel.highSignalComments.map((item) => <li key={item}>{item}</li>) : <li>Comment availability was light, so this view leans more on transcript and metadata signals.</li>}</ul>
            </article>
            <article className="summary-block">
              <h3>Comment Intelligence</h3>
              <ul className="plain-list">{channelDeepDive.commentIntelligence.map((item) => <li key={item}>{item}</li>)}</ul>
            </article>
          </>
        ) : null}

        {channelResultTab === "monetization" ? (
          <>
            <article className="summary-block channel-hero-card">
              <h3>Monetization</h3>
              <p>{cloneChannel.monetizationIntel.lessons[0] ?? cloneChannel.monetizationIntel.overview[0] ?? "Monetization signals are ready below."}</p>
              <div className="chip-row">
                {cloneChannel.monetizationIntel.offerTypes.length > 0
                  ? cloneChannel.monetizationIntel.offerTypes.map((item) => <span key={item} className="chip">{item}</span>)
                  : <span className="chip">Offer Visibility Limited</span>}
              </div>
            </article>
            <article className="summary-block">
              <h3>Monetization Signals</h3>
              <ul className="plain-list">{cloneChannel.monetizationIntel.overview.map((item) => <li key={item}>{item}</li>)}</ul>
            </article>
            <article className="summary-block">
              <h3>CTA Mix</h3>
              <ul className="plain-list">{cloneChannel.monetizationIntel.ctaMix.map((item) => <li key={item}>{item}</li>)}</ul>
            </article>
            <article className="summary-block">
              <h3>Offer Types</h3>
              <ul className="plain-list">{cloneChannel.monetizationIntel.offerTypes.length > 0 ? cloneChannel.monetizationIntel.offerTypes.map((item) => <li key={item}>{item}</li>) : <li>No strong offer type pattern is visible in the current sample.</li>}</ul>
            </article>
            <article className="summary-block">
              <h3>Lessons</h3>
              <ul className="plain-list">{cloneChannel.monetizationIntel.lessons.map((item) => <li key={item}>{item}</li>)}</ul>
            </article>
          </>
        ) : null}

        {channelResultTab === "adapt" ? (
          <>
            <article className="summary-block channel-hero-card">
              <h3>Adapt To Me</h3>
              <p>{cloneChannel.adaptationPlan.overview}</p>
              <div className="chip-row">
                <span className="chip">{cloneContextLabel}</span>
                {cloneChannel.myChannelLabel ? <span className="chip">My Channel: {cloneChannel.myChannelLabel}</span> : <span className="chip">Using Form Inputs Only</span>}
              </div>
            </article>
            <article className="summary-block">
              <h3>What Fits</h3>
              <ul className="plain-list">{cloneChannel.adaptationPlan.fits.map((item) => <li key={item}>{item}</li>)}</ul>
            </article>
            <article className="summary-block">
              <h3>What Needs Adapting</h3>
              <ul className="plain-list">{cloneChannel.adaptationPlan.needsAdapting.map((item) => <li key={item}>{item}</li>)}</ul>
            </article>
            <article className="summary-block">
              <h3>What To Ignore</h3>
              <ul className="plain-list">{cloneChannel.adaptationPlan.ignore.map((item) => <li key={item}>{item}</li>)}</ul>
            </article>
            <article className="summary-block">
              <h3>Fastest Lift</h3>
              <ul className="plain-list">{cloneChannel.adaptationPlan.fastestLift.map((item) => <li key={item}>{item}</li>)}</ul>
            </article>
            <article className="summary-block">
              <h3>Best Pillar To Start</h3>
              <ul className="plain-list">{cloneChannel.adaptationPlan.bestPillarToStart.map((item) => <li key={item}>{item}</li>)}</ul>
            </article>
            <article className="summary-block">
              <h3>Packaging I Can Borrow Safely</h3>
              <ul className="plain-list">{cloneChannel.adaptationPlan.packagingToBorrowSafely.map((item) => <li key={item}>{item}</li>)}</ul>
            </article>
            {myChannelDeepDive ? <article className="summary-block">
              <h3>My Channel Snapshot</h3>
              <p>{myChannelDeepDive.channelLabel} was analyzed privately across {myChannelDeepDive.analyzedVideos} videos with {myChannelDeepDive.transcriptCoverage}% transcript coverage and average visible views around {formatMetricCount(myChannelDeepDive.averageViewCount)}.</p>
              <div className="chip-row">
                {myChannelDeepDive.channelDNA.pillars.map((item) => <span key={`my-pillar-${item}`} className="chip">{item}</span>)}
              </div>
            </article> : null}
          </>
        ) : null}

        {channelResultTab === "action" ? (
          <>
            <article className="summary-block channel-hero-card">
              <h3>Action Plan</h3>
              <p>{cloneChannel.actionPlan.firstMoves[0] ?? cloneChannel.actionPlan.borrow[0] ?? "Action steps are ready below."}</p>
              <div className="chip-row">
                {cloneChannel.actionPlan.borrow.slice(0, 3).map((item) => <span key={item} className="chip">{item}</span>)}
              </div>
            </article>
            <article className="summary-block">
              <h3>Borrow</h3>
              <ul className="plain-list">{cloneChannel.actionPlan.borrow.map((item) => <li key={item}>{item}</li>)}</ul>
            </article>
            <article className="summary-block">
              <h3>Adapt</h3>
              <ul className="plain-list">{cloneChannel.actionPlan.adapt.map((item) => <li key={item}>{item}</li>)}</ul>
            </article>
            <article className="summary-block">
              <h3>Avoid</h3>
              <ul className="plain-list">{cloneChannel.actionPlan.avoid.map((item) => <li key={item}>{item}</li>)}</ul>
            </article>
            <article className="summary-block">
              <h3>First Moves</h3>
              <ul className="plain-list">{cloneChannel.actionPlan.firstMoves.map((item) => <li key={item}>{item}</li>)}</ul>
            </article>
            <article className="summary-block">
              <h3>30-Day Plan</h3>
              <ul className="plain-list">{cloneChannel.actionPlan.day30.map((item) => <li key={item}>{item}</li>)}</ul>
            </article>
            <article className="summary-block">
              <h3>60-Day Plan</h3>
              <ul className="plain-list">{cloneChannel.actionPlan.day60.map((item) => <li key={item}>{item}</li>)}</ul>
            </article>
            <article className="summary-block">
              <h3>90-Day Plan</h3>
              <ul className="plain-list">{cloneChannel.actionPlan.day90.map((item) => <li key={item}>{item}</li>)}</ul>
            </article>
            <article className="summary-block">
              <h3>Next Video Ideas</h3>
              <ul className="plain-list">{cloneChannel.actionPlan.nextVideoIdeas.map((item) => <li key={item}>{item}</li>)}</ul>
            </article>
            <article className="summary-block">
              <h3>Differentiate</h3>
              <ul className="plain-list">{cloneChannel.actionPlan.differentiate.map((item) => <li key={item}>{item}</li>)}</ul>
            </article>
            <article className="summary-block">
              <h3>Opportunities</h3>
              <ul className="plain-list">{channelDeepDive.opportunityFinder.map((item) => <li key={item}>{item}</li>)}</ul>
            </article>
            <article className="summary-block">
              <h3>Clone Brief</h3>
              <ul className="plain-list">{channelDeepDive.cloneBrief.map((item) => <li key={item}>{item}</li>)}</ul>
            </article>
            <article className="summary-block">
              <h3>Takeover Sprint</h3>
              <ul className="plain-list">{channelDeepDive.takeoverSprint.map((item) => <li key={item}>{item}</li>)}</ul>
            </article>
            <article className="summary-block channel-export-card">
              <div className="section-header">
                <div>
                  <h3>Clone Plan Report</h3>
                  <p>A ready markdown clone plan for strategy, onboarding, or client review.</p>
                </div>
                <span className="meta-text">Markdown</span>
              </div>
              <div className="button-row">
                <button type="button" className="secondary-button" onClick={onCopyReport}>Copy Report</button>
                <button type="button" className="secondary-button" onClick={onExportReport}>Export Report</button>
                <button type="button" className="secondary-button" onClick={onExportPdf}>Export PDF</button>
              </div>
              <textarea className="export-preview description-preview" value={cloneChannel.exportDeck} readOnly />
            </article>
          </>
        ) : null}
      </div>
    </section>
  );
}
