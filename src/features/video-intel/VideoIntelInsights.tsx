import {
  COPY_FORMAT_OPTIONS,
  formatDuration,
  type AnalysisBundle,
  type CopyFormat,
  type TimestampSearchMatch,
} from "../../premium";

type InsightTab = "summary" | "insights" | "exports" | "chat";

type ClipMoment = AnalysisBundle["clipMoments"][number];
type CalendarEntry = AnalysisBundle["contentCalendar"][number];
type Chapter = AnalysisBundle["summary"]["chapters"][number];

const PRO_QUICK_EXPORTS: CopyFormat[] = ["brief", "calendar", "linkedin", "thread", "newsletter", "instagram", "upload-pack"];

type VideoIntelInsightsProps = {
  analysis: AnalysisBundle;
  answer: string;
  copyFormat: CopyFormat;
  copyPreview: string;
  exportPreview: string;
  filteredClipMoments: ClipMoment[];
  filteredContentCalendar: CalendarEntry[];
  insightTab: InsightTab;
  insightTabLabels: Record<InsightTab, string>;
  isProMode: boolean;
  plannerChannelFilter: string;
  plannerChannelOptions: string[];
  plannerLead: CalendarEntry | null;
  proClipScoreFloor: number;
  question: string;
  repurposeReach: number;
  strategicTrack: string;
  strongestClip: ClipMoment | null;
  timestampMatches: TimestampSearchMatch[];
  timestampSearch: string;
  visibleInsightTabs: readonly InsightTab[];
  onAskTranscript: () => void;
  onInsightTabChange: (tab: InsightTab) => void;
  onOpenTimestamp: (seconds: number | null) => void | Promise<void>;
  onPlannerChannelFilterChange: (value: string) => void;
  onProClipScoreFloorChange: (value: number) => void;
  onQuestionChange: (value: string) => void;
  onQuickExport: (format: CopyFormat) => void;
  onTimestampSearchChange: (value: string) => void;
};

export function VideoIntelInsights({
  analysis,
  answer,
  copyFormat,
  copyPreview,
  exportPreview,
  filteredClipMoments,
  filteredContentCalendar,
  insightTab,
  insightTabLabels,
  isProMode,
  plannerChannelFilter,
  plannerChannelOptions,
  plannerLead,
  proClipScoreFloor,
  question,
  repurposeReach,
  strategicTrack,
  strongestClip,
  timestampMatches,
  timestampSearch,
  visibleInsightTabs,
  onAskTranscript,
  onInsightTabChange,
  onOpenTimestamp,
  onPlannerChannelFilterChange,
  onProClipScoreFloorChange,
  onQuestionChange,
  onQuickExport,
  onTimestampSearchChange,
}: VideoIntelInsightsProps) {
  return (
    <div className="insight-stack">
      <section className="simple-card">
        <div className="section-header"><div><h2>Insight Studio</h2></div><div className="pill-row insight-tab-row">{visibleInsightTabs.map((tab) => <button key={tab} type="button" className={`mode-pill insight-tab-pill ${insightTab === tab ? "is-active" : ""}`} onClick={() => onInsightTabChange(tab)}>{insightTabLabels[tab]}</button>)}</div></div>
        {insightTab === "summary" ? (
          <div className="summary-layout">
            <div className="summary-hero"><div><h2>{analysis.summary.headline}</h2><p className="summary-overview">{analysis.summary.overview}</p></div><div className="chip-row">{analysis.summary.keywords.map((keyword) => <span key={keyword} className="chip">{keyword}</span>)}</div></div>
            <div className="stats-grid"><span>{analysis.summary.stats.wordCount} Words</span><span>{formatDuration(analysis.summary.stats.readingMinutes)} Read</span><span>{analysis.summary.stats.timestampCount} Timestamps</span><span>Title Score {analysis.titleScore}/100</span></div>
            {isProMode ? <div className="strategy-grid">
              <article className="strategy-card">
                <span className="strategy-label">Strongest Clip</span>
                <strong>{strongestClip ? `Score ${strongestClip.score}` : "No Clip"}</strong>
                <p>{strongestClip?.title ?? "Paste more transcript text to surface clip opportunities."}</p>
              </article>
              <article className="strategy-card">
                <span className="strategy-label">Lead Platform</span>
                <strong>{plannerLead?.primaryChannel ?? "YouTube"}</strong>
                <p>{plannerLead?.contentType ?? "Long-form publish remains the main anchor."}</p>
              </article>
              <article className="strategy-card">
                <span className="strategy-label">Repurpose Reach</span>
                <strong>{repurposeReach} Channels</strong>
                <p>{analysis.contentCalendar.length} planned days with cross-posting paths already mapped.</p>
              </article>
              <article className="strategy-card">
                <span className="strategy-label">Strategy Call</span>
                <strong>{analysis.summary.keywords[0] ? analysis.summary.keywords[0] : "Core Theme"}</strong>
                <p>{strategicTrack}</p>
              </article>
            </div> : null}
            <div className="summary-columns"><div className="summary-block"><h3>Key Takeaways</h3><ol className="plain-list">{analysis.summary.takeaways.map((item) => <li key={item}>{item}</li>)}</ol></div><div className="summary-block"><h3>Action Items</h3><ul className="plain-list">{analysis.summary.actionItems.map((item) => <li key={item}>{item}</li>)}</ul></div></div>
            <div className="summary-block"><h3>Chapters</h3><div className="chapter-simple-list">{analysis.summary.chapters.map((chapter: Chapter) => <article key={`${chapter.timeLabel}-${chapter.title}`} className="chapter-simple-item"><button type="button" className="timestamp-button" onClick={() => void onOpenTimestamp(chapter.seconds)}>{chapter.timeLabel}</button><div><div className="chapter-title">{chapter.title}</div><p>{chapter.summary}</p></div></article>)}</div></div>
          </div>
        ) : insightTab === "insights" ? (
          <div className="insight-grid">
            <article className="summary-block pro-control-card">
              <div className="section-header">
                <div>
                  <h3>Idea Filters</h3>
                  <p>Focus Pro mode on the strongest clip scores and the channel you want to ship next.</p>
                </div>
                <span className="meta-text">{filteredClipMoments.length} Clips | {filteredContentCalendar.length} Days</span>
              </div>
              <div className="filter-grid">
                <label className="field">
                  <span>Minimum Clip Score</span>
                  <input type="range" min="8" max="24" step="2" value={proClipScoreFloor} onChange={(event) => onProClipScoreFloorChange(Number(event.target.value))} />
                </label>
                <label className="field">
                  <span>Planner Channel</span>
                  <select value={plannerChannelFilter} onChange={(event) => onPlannerChannelFilterChange(event.target.value)}>
                    {plannerChannelOptions.map((option) => <option key={option} value={option}>{option === "all" ? "All Channels" : option}</option>)}
                  </select>
                </label>
              </div>
              <div className="chip-row">
                {[12, 14, 16, 18].map((score) => (
                  <button key={score} type="button" className={`chip-action ${proClipScoreFloor === score ? "is-active" : ""}`} onClick={() => onProClipScoreFloorChange(score)}>
                    Score {score}+
                  </button>
                ))}
                {plannerChannelFilter !== "all" ? <button type="button" className="chip-action" onClick={() => onPlannerChannelFilterChange("all")}>Show All Channels</button> : null}
              </div>
            </article>
            <article className="summary-block"><h3>Highlight Quotes</h3><div className="quote-list">{analysis.quotes.map((quote) => <blockquote key={quote}>{quote}</blockquote>)}</div></article>
            <article className="summary-block"><h3>Shorts Ideas</h3><div className="shorts-list">{analysis.shortsIdeas.map((idea) => <article key={`${idea.title}-${idea.timeLabel}`} className="shorts-item"><div className="shorts-meta"><span className="chip">{idea.timeLabel}</span><span className="chip">{idea.title}</span></div><strong>{idea.hook}</strong><p>{idea.angle}</p></article>)}</div></article>
            <article className="summary-block">
              <div className="section-header">
                <div>
                  <h3>Chapter Renamer</h3>
                  <p>YouTube-ready chapter titles generated from the transcript flow.</p>
                </div>
                <span className="meta-text">{analysis.renamedChapters.length} Chapters</span>
              </div>
              <ul className="plain-list compact-list">{analysis.renamedChapters.map((chapter) => <li key={chapter}>{chapter}</li>)}</ul>
            </article>
            <article className="summary-block">
              <div className="section-header">
                <div>
                  <h3>Viral Moments</h3>
                  <p>Top transcript moments ranked for hook strength, clarity, and short-form potential.</p>
                </div>
                <span className="meta-text">{filteredClipMoments.length} Visible</span>
              </div>
              <div className="clip-moment-list">
                {filteredClipMoments.length > 0 ? filteredClipMoments.map((moment) => (
                  <article key={`${moment.timeLabel}-${moment.title}`} className="clip-moment-item">
                    <div className="clip-moment-head">
                      <div className="shorts-meta">
                        <span className="chip">{moment.timeLabel}</span>
                        <span className="chip">Score {moment.score}</span>
                        <span className="chip">{moment.clipWindow}</span>
                      </div>
                      <button type="button" className="timestamp-button" onClick={() => void onOpenTimestamp(moment.seconds)}>
                        Jump To Clip
                      </button>
                    </div>
                    <strong>{moment.title}</strong>
                    <p>{moment.hook}</p>
                    <div className="clip-moment-reason">Why it works: {moment.reason}</div>
                  </article>
                )) : <p className="empty-copy">No clip moments match this score floor yet. Lower the threshold to see more candidates.</p>}
              </div>
            </article>
            <article className="summary-block">
              <div className="section-header">
                <div>
                  <h3>Planner</h3>
                  <p>A ready 7-day schedule built from the best clips, repurposing drafts, and review steps.</p>
                </div>
                <span className="meta-text">{filteredContentCalendar.length} Days</span>
              </div>
              <div className="planner-list">
                {filteredContentCalendar.length > 0 ? filteredContentCalendar.map((entry) => (
                  <article key={`${entry.dayLabel}-${entry.title}`} className="planner-item">
                    <div className="planner-head">
                      <div className="shorts-meta">
                        <span className="chip">{entry.dayLabel}</span>
                        <span className="chip">{entry.contentType}</span>
                        <span className="chip">{entry.primaryChannel}</span>
                      </div>
                      <button type="button" className="timestamp-button" onClick={() => void onOpenTimestamp(entry.seconds ?? analysis.summary.chapters.find((chapter) => chapter.timeLabel === entry.timeLabel)?.seconds ?? null)}>
                        {entry.timeLabel}
                      </button>
                    </div>
                    <strong>{entry.title}</strong>
                    <p>{entry.hook}</p>
                    <div className="planner-foot">
                      <span>Repurpose: {entry.repurposeTo.join(", ")}</span>
                      <span>Action: {entry.action}</span>
                    </div>
                  </article>
                )) : <p className="empty-copy">No planner days match this channel filter. Switch back to All Channels to restore the full schedule.</p>}
              </div>
            </article>
            <article className="summary-block timestamp-search-block">
              <div className="section-header">
                <div>
                  <h3>Search Moments</h3>
                  <p>Find the exact transcript moment and jump back to the source clip.</p>
                </div>
                <span className="meta-text">{timestampSearch.trim() ? `${timestampMatches.length} Matches` : `${analysis.summary.stats.timestampCount} Timestamps Ready`}</span>
              </div>
              <label className="field field-stack">
                <span>Search Transcript</span>
                <input value={timestampSearch} onChange={(event) => onTimestampSearchChange(event.target.value)} placeholder="Search promise, filler, review, retention, hook..." />
              </label>
              <div className="chip-row search-chip-row">
                {analysis.summary.keywords.slice(0, 5).map((keyword) => (
                  <button key={keyword} type="button" className={`chip-action ${timestampSearch.trim().toLowerCase() === keyword.toLowerCase() ? "is-active" : ""}`} onClick={() => onTimestampSearchChange(keyword)}>
                    {keyword}
                  </button>
                ))}
                {timestampSearch.trim() ? <button type="button" className="chip-action" onClick={() => onTimestampSearchChange("")}>Clear Search</button> : null}
              </div>
              <div className="timestamp-search-list">
                {timestampSearch.trim() ? (
                  timestampMatches.length > 0 ? timestampMatches.map((match) => (
                    <article key={`${match.timeLabel}-${match.text}`} className="timestamp-search-item">
                      <button type="button" className="timestamp-button" onClick={() => void onOpenTimestamp(match.seconds)}>
                        {match.timeLabel}
                      </button>
                      <div>
                        <strong>Transcript Match</strong>
                        <p>{match.text}</p>
                      </div>
                    </article>
                  )) : <p className="empty-copy">No timestamp matches found. Try a shorter keyword or use one of the suggested chips.</p>
                ) : analysis.summary.chapters.map((chapter) => (
                  <article key={`${chapter.timeLabel}-search-preview`} className="timestamp-search-item">
                    <button type="button" className="timestamp-button" onClick={() => void onOpenTimestamp(chapter.seconds)}>
                      {chapter.timeLabel}
                    </button>
                    <div>
                      <strong>{chapter.title}</strong>
                      <p>{chapter.summary}</p>
                    </div>
                  </article>
                ))}
              </div>
            </article>
            <article className="summary-block"><h3>Title Ideas</h3><ul className="plain-list">{analysis.packagingIdeas.titles.map((idea) => <li key={idea}>{idea}</li>)}</ul></article>
            <article className="summary-block"><h3>Thumbnail Text</h3><div className="chip-row">{analysis.packagingIdeas.thumbnails.map((idea) => <span key={idea} className="chip">{idea}</span>)}</div></article>
            <article className="summary-block"><h3>Hook Lines</h3><ul className="plain-list">{analysis.packagingIdeas.hooks.map((idea) => <li key={idea}>{idea}</li>)}</ul></article>
            <article className="summary-block"><h3>Content Ideas</h3><ul className="plain-list">{analysis.contentIdeas.map((idea) => <li key={idea}>{idea}</li>)}</ul></article>
            <article className="summary-block"><h3>Business Ideas</h3><ul className="plain-list">{analysis.businessIdeas.map((idea) => <li key={idea}>{idea}</li>)}</ul></article>
            <article className="summary-block"><h3>Tools And Names Mentioned</h3><div className="chip-row">{analysis.toolsMentioned.length === 0 ? <span className="chip">No Obvious Tools Detected</span> : analysis.toolsMentioned.map((item) => <span key={item} className="chip">{item}</span>)}</div></article>
            <article className="summary-block"><h3>Title Analyzer</h3><div className="score-badge">Title Score: {analysis.titleScore}/100</div><ul className="plain-list">{analysis.titleNotes.map((note) => <li key={note}>{note}</li>)}</ul></article>
          </div>
        ) : insightTab === "exports" ? (
          <div className="export-grid">
            {isProMode ? <article className="summary-block pro-control-card quick-export-card">
              <div className="section-header">
                <div>
                  <h3>Quick Export Deck</h3>
                  <p>Jump between the highest-value Pro outputs without hunting through dropdowns.</p>
                </div>
                <span className="meta-text">{COPY_FORMAT_OPTIONS.find((option) => option.value === copyFormat)?.label ?? "Preview"}</span>
              </div>
              <div className="quick-export-grid">
                {PRO_QUICK_EXPORTS.map((format) => (
                  <button key={format} type="button" className={`chip-action ${copyFormat === format ? "is-active" : ""}`} onClick={() => onQuickExport(format)}>
                    {COPY_FORMAT_OPTIONS.find((option) => option.value === format)?.label ?? format}
                  </button>
                ))}
              </div>
            </article> : null}
            <article className="summary-block"><h3>Copy Preview</h3><textarea className="export-preview" value={copyPreview} readOnly /></article>
            <article className="summary-block"><h3>Export Preview</h3><textarea className="export-preview" value={exportPreview} readOnly /></article>
            <article className="summary-block">
              <h3>YouTube Description Generator</h3>
              <div className="chip-row">
                {analysis.descriptionHashtags.map((tag) => <span key={tag} className="chip">{tag}</span>)}
              </div>
              <textarea className="export-preview description-preview" value={analysis.youtubeDescription} readOnly />
            </article>
            <article className="summary-block">
              <h3>Chapter Pack</h3>
              <textarea className="export-preview description-preview" value={analysis.renamedChapters.join("\n")} readOnly />
            </article>
            {isProMode ? <article className="summary-block">
              <div className="section-header">
                <div>
                  <h3>Content Calendar</h3>
                  <p>Your weekly publishing plan across long-form, shorts, repurposing, and review.</p>
                </div>
                <span className="meta-text">{analysis.contentCalendar.length} Days Planned</span>
              </div>
              <textarea className="export-preview description-preview" value={analysis.calendarPlan} readOnly />
            </article> : null}
            {isProMode ? <article className="summary-block">
              <div className="section-header">
                <div>
                  <h3>Repurposing Packs</h3>
                  <p>Platform-specific drafts for fast posting across LinkedIn, X, newsletter, and Instagram.</p>
                </div>
                <span className="meta-text">4 Platforms</span>
              </div>
              <div className="repurpose-grid">
                <article className="repurpose-card">
                  <strong>LinkedIn</strong>
                  <textarea className="export-preview repurpose-preview" value={analysis.platformPacks.linkedin} readOnly />
                </article>
                <article className="repurpose-card">
                  <strong>X Thread</strong>
                  <textarea className="export-preview repurpose-preview" value={analysis.platformPacks.thread} readOnly />
                </article>
                <article className="repurpose-card">
                  <strong>Newsletter</strong>
                  <textarea className="export-preview repurpose-preview" value={analysis.platformPacks.newsletter} readOnly />
                </article>
                <article className="repurpose-card">
                  <strong>Instagram</strong>
                  <textarea className="export-preview repurpose-preview" value={analysis.platformPacks.instagram} readOnly />
                </article>
              </div>
            </article> : null}
            {isProMode ? <article className="summary-block">
              <div className="section-header">
                <div>
                  <h3>Full Upload Pack</h3>
                  <p>One bundle for titles, hooks, chapters, description, shorts, and viral moments.</p>
                </div>
                <span className="meta-text">{analysis.packagingIdeas.titles.length + analysis.shortsIdeas.length + analysis.clipMoments.length + analysis.contentCalendar.length} Assets</span>
              </div>
              <textarea className="export-preview description-preview" value={analysis.uploadPack} readOnly />
            </article> : null}
          </div>
        ) : (
          <div className="chat-grid"><article className="summary-block"><h3>Ask The Transcript</h3><textarea className="chat-question" value={question} onChange={(event) => onQuestionChange(event.target.value)} placeholder="What Is The Core Strategy? What Tools Were Mentioned?" /><div className="button-row"><button type="button" className="primary-button" onClick={onAskTranscript}>Ask Transcript</button></div></article><article className="summary-block"><h3>Answer</h3><pre className="chat-answer">{answer || "Answers Will Appear Here."}</pre></article></div>
        )}
      </section>
    </div>
  );
}
