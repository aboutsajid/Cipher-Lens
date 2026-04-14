import { useEffect, useState, useTransition } from "react";
import "./App.css";
import {
  AUDIENCE_OPTIONS,
  CLEANER_DEFAULTS,
  COPY_FORMAT_OPTIONS,
  EXPORT_FORMAT_OPTIONS,
  OUTPUT_LANGUAGE_OPTIONS,
  SAMPLE_TITLE,
  SAMPLE_TRANSCRIPT,
  SAMPLE_URL,
  SUMMARY_STYLE_OPTIONS,
  buildAnalysis,
  buildChannelCompare,
  buildChannelDeepDive,
  buildExportContent,
  buildQuestionAnswer,
  buildTimestampSearchMatches,
  convertSubtitleContent,
  cleanTranscriptInput,
  formatDuration,
  getWordCount,
  type AnalysisBundle,
  type AudiencePreset,
  type ChannelDeepDiveBundle,
  type ChannelCompareBundle,
  type CleanerSettings,
  type CopyFormat,
  type ExportFormat,
  type OutputLanguage,
  type SummaryStyle,
} from "./premium";

const STORAGE_KEY = "cipher-lens/briefs";
const CHANNEL_REPORTS_STORAGE_KEY = "cipher-lens/channel-reports";
const CHANNEL_PRESETS_STORAGE_KEY = "cipher-lens/channel-presets";
const MAX_BRIEFS = 30;
const MAX_CHANNEL_REPORTS = 20;
const MAX_CHANNEL_PRESETS = 20;
const LANGUAGE_OPTIONS = [
  { value: "", label: "Auto Detect" },
  { value: "en", label: "English" },
  { value: "es", label: "Spanish" },
  { value: "fr", label: "French" },
  { value: "de", label: "German" },
  { value: "pt", label: "Portuguese" },
  { value: "ar", label: "Arabic" },
  { value: "hi", label: "Hindi" },
];

type WorkspaceMode = "single" | "batch" | "channel";
type ExperienceMode = "basic" | "pro";
type AppView = "studio" | "channel" | "library";
type InsightTab = "summary" | "insights" | "exports" | "chat";
type ChannelResultTab = "overview" | "strategy" | "opportunities" | "deck" | "breakdown";
type CompareResultTab = "summary" | "winners" | "deck";
type StatusTone = "ready" | "busy" | "success" | "error";
type StatusState = { message: string; tone: StatusTone };
type TranscriptSource = { lineCount: number; language: string; videoId: string };
type SavedBrief = {
  id: string;
  title: string;
  url: string;
  transcript: string;
  createdAt: string;
  analysis: AnalysisBundle;
  summaryStyle: SummaryStyle;
  audiencePreset: AudiencePreset;
  outputLanguage: OutputLanguage;
};
type SavedChannelReport = {
  id: string;
  kind: "deep-dive" | "compare";
  title: string;
  createdAt: string;
  channelUrl: string;
  compareChannelUrl: string;
  channelSampleSize: number;
  compareSampleSize: number;
  channelVideos: ChannelVideo[];
  selectedChannelVideoIds: string[];
  compareChannelVideos: ChannelVideo[];
  selectedCompareVideoIds: string[];
  deepDive: ChannelDeepDiveBundle | null;
  compare: ChannelCompareBundle | null;
};
type SavedChannelPreset = {
  id: string;
  name: string;
  createdAt: string;
  channelUrl: string;
  compareChannelUrl: string;
  channelSampleSize: number;
  compareSampleSize: number;
  channelVideos: ChannelVideo[];
  selectedChannelVideoIds: string[];
  compareChannelVideos: ChannelVideo[];
  selectedCompareVideoIds: string[];
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
type ChannelVideo = {
  title: string;
  url: string;
  videoId: string;
  publishedLabel?: string;
  viewLabel?: string;
  description?: string;
  thumbnailUrl?: string;
  thumbnailText?: string;
};
const WORKSPACE_MODE_LABELS: Record<WorkspaceMode, string> = {
  single: "Single",
  batch: "Batch",
  channel: "Channel",
};
const EXPERIENCE_MODE_LABELS: Record<ExperienceMode, string> = {
  basic: "Basic",
  pro: "Pro",
};
const APP_VIEW_LABELS: Record<AppView, string> = {
  studio: "Brief Studio",
  channel: "Channel Lab",
  library: "Library",
};
const INSIGHT_TAB_LABELS: Record<InsightTab, string> = {
  summary: "Summary",
  insights: "Insights",
  exports: "Exports",
  chat: "Chat",
};
const CHANNEL_RESULT_TAB_LABELS: Record<ChannelResultTab, string> = {
  overview: "Overview",
  strategy: "Strategy",
  opportunities: "Opportunities",
  deck: "Deck",
  breakdown: "Breakdown",
};
const COMPARE_RESULT_TAB_LABELS: Record<CompareResultTab, string> = {
  summary: "Summary",
  winners: "Winners",
  deck: "Deck",
};
const RESULT_STATUS_LABELS: Record<BatchResult["status"], string> = {
  pending: "Pending",
  done: "Done",
  failed: "Failed",
};
const READY_STATUS: StatusState = { message: "Ready", tone: "ready" };
const BASIC_INSIGHT_TABS: InsightTab[] = ["summary", "exports"];
const PRO_INSIGHT_TABS: InsightTab[] = ["summary", "insights", "exports", "chat"];
const BASIC_COPY_FORMATS = new Set<CopyFormat>(["brief", "description", "youtube", "meeting"]);
const PRO_QUICK_EXPORTS: CopyFormat[] = ["brief", "calendar", "linkedin", "thread", "newsletter", "instagram", "upload-pack"];
const CHANNEL_SAMPLE_SIZE_OPTIONS = [5, 8, 10, 12, 15, 20] as const;

function normalizeSummaryStyle(value: unknown): SummaryStyle {
  return SUMMARY_STYLE_OPTIONS.some((option) => option.value === value) ? value as SummaryStyle : "executive";
}

function normalizeAudiencePreset(value: unknown): AudiencePreset {
  return AUDIENCE_OPTIONS.some((option) => option.value === value) ? value as AudiencePreset : "general";
}

function normalizeOutputLanguage(value: unknown): OutputLanguage {
  return OUTPUT_LANGUAGE_OPTIONS.some((option) => option.value === value) ? value as OutputLanguage : "en";
}

function formatCreatedAt(value: string): string {
  const date = new Date(value);
  return date.toLocaleString([], { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
}

function formatMetricCount(value: number): string {
  if (value >= 1_000_000) return `${Math.round((value / 100_000)) / 10}M`;
  if (value >= 1_000) return `${Math.round((value / 100)) / 10}K`;
  return `${Math.round(value)}`;
}

function formatSampleScope(selectedCount: number, loadedCount: number): string {
  if (loadedCount === 0) return "No Sample";
  return selectedCount >= loadedCount ? "Full Sample" : "Filtered Sample";
}

function buildSavedReportMeta(report: SavedChannelReport): string {
  const mainSelected = report.selectedChannelVideoIds.length;
  const mainLoaded = report.channelVideos.length;
  const mainMeta = `${mainSelected}/${mainLoaded} main (${formatSampleScope(mainSelected, mainLoaded)})`;

  if (report.kind === "compare") {
    const compareSelected = report.selectedCompareVideoIds.length;
    const compareLoaded = report.compareChannelVideos.length;
    const compareMeta = `${compareSelected}/${compareLoaded} compare (${formatSampleScope(compareSelected, compareLoaded)})`;
    return `Compare Report | ${formatCreatedAt(report.createdAt)} | ${mainMeta} | ${compareMeta}`;
  }

  return `Deep Dive | ${formatCreatedAt(report.createdAt)} | ${mainMeta}`;
}

function inferTitleFromUrl(url: string): string {
  try {
    const parsed = new URL(url);
    const queryTitle = parsed.searchParams.get("title");
    if (queryTitle) return queryTitle;
    if (parsed.hostname.includes("youtube.com") || parsed.hostname.includes("youtu.be")) return "YouTube Video Brief";
  } catch {
    return "";
  }
  return "";
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function formatPdfInline(value: string): string {
  return escapeHtml(value).replace(/(https?:\/\/[^\s<]+)/g, '<a href="$1">$1</a>');
}

function renderDeckToPdfHtml(deck: string): string {
  const lines = deck.split(/\r?\n/);
  const blocks: string[] = [];
  let listItems: string[] = [];

  const flushList = () => {
    if (listItems.length === 0) return;
    blocks.push(`<ul>${listItems.join("")}</ul>`);
    listItems = [];
  };

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) {
      flushList();
      continue;
    }
    if (trimmed.startsWith("# ")) {
      flushList();
      blocks.push(`<h1>${formatPdfInline(trimmed.slice(2))}</h1>`);
      continue;
    }
    if (trimmed.startsWith("## ")) {
      flushList();
      blocks.push(`<h2>${formatPdfInline(trimmed.slice(3))}</h2>`);
      continue;
    }
    if (trimmed.startsWith("- ")) {
      listItems.push(`<li>${formatPdfInline(trimmed.slice(2))}</li>`);
      continue;
    }
    flushList();
    blocks.push(`<p>${formatPdfInline(trimmed)}</p>`);
  }

  flushList();
  return blocks.join("");
}

function buildReportPdfHtml(options: {
  title: string;
  label: string;
  subtitle: string;
  deck: string;
  generatedAt: string;
  stats?: Array<{ label: string; value: string }>;
}): string {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>${escapeHtml(options.title)}</title>
    <style>
      @page {
        size: A4;
        margin: 16mm;
      }
      :root {
        color-scheme: light;
        --ink: #0f172a;
        --muted: #64748b;
        --line: #dbe7f5;
        --surface: #f8fbff;
        --accent: #0f766e;
        --accent-soft: #dff7f1;
      }
      * {
        box-sizing: border-box;
      }
      body {
        margin: 0;
        font-family: "Segoe UI", "Arial", sans-serif;
        color: var(--ink);
        background: #ffffff;
      }
      .page {
        display: grid;
        gap: 18px;
      }
      .hero {
        padding: 22px 24px;
        border: 1px solid var(--line);
        border-radius: 22px;
        background:
          radial-gradient(circle at top right, rgba(15, 118, 110, 0.12), transparent 32%),
          linear-gradient(135deg, #ffffff 0%, #f4fbff 100%);
      }
      .brand-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 16px;
      }
      .brand {
        display: inline-flex;
        align-items: center;
        gap: 12px;
      }
      .brand-mark {
        width: 18px;
        height: 18px;
        border-radius: 6px;
        background: linear-gradient(135deg, #00d8b0 0%, #0f172a 100%);
      }
      .brand-copy {
        display: grid;
        gap: 3px;
      }
      .brand-copy strong {
        font-size: 14px;
        letter-spacing: 0.08em;
        text-transform: uppercase;
      }
      .brand-copy span,
      .meta,
      .report-body p,
      .report-body li,
      .report-body a {
        color: var(--muted);
      }
      .tag {
        padding: 8px 12px;
        border-radius: 999px;
        background: var(--accent-soft);
        color: var(--accent);
        font-size: 12px;
        font-weight: 700;
        letter-spacing: 0.08em;
        text-transform: uppercase;
      }
      h1 {
        margin: 18px 0 8px;
        font-size: 32px;
        line-height: 1.15;
      }
      .subtitle {
        margin: 0;
        font-size: 15px;
        line-height: 1.7;
        color: var(--muted);
      }
      .meta {
        font-size: 12px;
      }
      .report-body {
        padding: 24px;
        border: 1px solid var(--line);
        border-radius: 22px;
        background: #ffffff;
      }
      .stats-grid {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 12px;
        margin-top: 18px;
      }
      .stat-card {
        padding: 14px 16px;
        border: 1px solid var(--line);
        border-radius: 16px;
        background: linear-gradient(135deg, #ffffff 0%, #f5fbfa 100%);
      }
      .stat-card strong {
        display: block;
        font-size: 18px;
        line-height: 1.2;
      }
      .stat-card span {
        display: block;
        margin-top: 6px;
        color: var(--muted);
        font-size: 11px;
        letter-spacing: 0.08em;
        text-transform: uppercase;
      }
      .report-body h1 {
        margin-top: 0;
        font-size: 26px;
      }
      .report-body h2 {
        margin: 22px 0 10px;
        font-size: 17px;
        color: var(--ink);
      }
      .report-body p,
      .report-body li {
        font-size: 13px;
        line-height: 1.7;
      }
      .report-body ul {
        margin: 0 0 8px 0;
        padding-left: 18px;
      }
      .report-body a {
        color: var(--accent);
        text-decoration: none;
      }
      .footer {
        padding-top: 6px;
        font-size: 11px;
        color: var(--muted);
      }
    </style>
  </head>
  <body>
    <main class="page">
      <section class="hero">
        <div class="brand-row">
          <div class="brand">
            <div class="brand-mark"></div>
            <div class="brand-copy">
              <strong>Cipher Lens</strong>
              <span>Premium YouTube channel intelligence</span>
            </div>
          </div>
          <div class="tag">${escapeHtml(options.label)}</div>
        </div>
        <h1>${escapeHtml(options.title)}</h1>
        <p class="subtitle">${escapeHtml(options.subtitle)}</p>
        <div class="meta">Generated ${escapeHtml(options.generatedAt)}</div>
        ${options.stats?.length ? `<div class="stats-grid">${options.stats.map((item) => `<div class="stat-card"><strong>${escapeHtml(item.value)}</strong><span>${escapeHtml(item.label)}</span></div>`).join("")}</div>` : ""}
      </section>
      <section class="report-body">${renderDeckToPdfHtml(options.deck)}</section>
      <div class="footer">Prepared in Cipher Lens for strategy, research, and client-ready reporting.</div>
    </main>
  </body>
</html>`;
}

function loadBriefs(): SavedBrief[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Array<Partial<SavedBrief> & { summary?: AnalysisBundle["summary"] }>;
    if (!Array.isArray(parsed)) return [];
    return parsed.map((brief) => {
      const title = typeof brief.title === "string" ? brief.title : "";
      const url = typeof brief.url === "string" ? brief.url : "";
      const transcript = typeof brief.transcript === "string" ? brief.transcript : "";
      const summaryStyle = normalizeSummaryStyle(brief.summaryStyle);
      const audiencePreset = normalizeAudiencePreset(brief.audiencePreset);
      const outputLanguage = normalizeOutputLanguage(brief.outputLanguage);

      if (
        brief.analysis
        && title
        && transcript
        && Array.isArray(brief.analysis.clipMoments)
        && Array.isArray(brief.analysis.renamedChapters)
        && Array.isArray(brief.analysis.contentCalendar)
        && typeof brief.analysis.youtubeDescription === "string"
        && typeof brief.analysis.calendarPlan === "string"
        && typeof brief.analysis.platformPacks?.linkedin === "string"
        && typeof brief.analysis.platformPacks?.thread === "string"
        && typeof brief.analysis.platformPacks?.newsletter === "string"
        && typeof brief.analysis.platformPacks?.instagram === "string"
        && typeof brief.analysis.uploadPack === "string"
        && Array.isArray(brief.analysis.descriptionHashtags)
        && typeof brief.analysis.copyDeck?.description === "string"
        && typeof brief.analysis.copyDeck?.calendar === "string"
        && typeof brief.analysis.copyDeck?.["upload-pack"] === "string"
        && typeof brief.analysis.copyDeck?.newsletter === "string"
        && typeof brief.analysis.copyDeck?.instagram === "string"
      ) {
        return {
          id: typeof brief.id === "string" ? brief.id : `brief-${Date.now()}`,
          title,
          url,
          transcript,
          createdAt: typeof brief.createdAt === "string" ? brief.createdAt : new Date().toISOString(),
          analysis: brief.analysis as AnalysisBundle,
          summaryStyle,
          audiencePreset,
          outputLanguage,
        };
      }
      return {
        id: typeof brief.id === "string" ? brief.id : `brief-${Date.now()}`,
        title,
        url,
        transcript,
        createdAt: typeof brief.createdAt === "string" ? brief.createdAt : new Date().toISOString(),
        analysis: buildAnalysis({
          title,
          url,
          transcript,
          summaryStyle,
          audiencePreset,
          outputLanguage,
          cleaner: CLEANER_DEFAULTS,
        }),
        summaryStyle,
        audiencePreset,
        outputLanguage,
      };
    });
  } catch {
    return [];
  }
}

function loadChannelReports(): SavedChannelReport[] {
  try {
    const raw = window.localStorage.getItem(CHANNEL_REPORTS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Array<Partial<SavedChannelReport>>;
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((item) => item && typeof item === "object")
      .map((item) => ({
        id: typeof item.id === "string" ? item.id : `channel-report-${Date.now()}`,
        kind: item.kind === "compare" ? "compare" : "deep-dive",
        title: typeof item.title === "string" ? item.title : "Channel Report",
        createdAt: typeof item.createdAt === "string" ? item.createdAt : new Date().toISOString(),
        channelUrl: typeof item.channelUrl === "string" ? item.channelUrl : "",
        compareChannelUrl: typeof item.compareChannelUrl === "string" ? item.compareChannelUrl : "",
        channelSampleSize: typeof item.channelSampleSize === "number" ? item.channelSampleSize : 8,
        compareSampleSize: typeof item.compareSampleSize === "number" ? item.compareSampleSize : 8,
        channelVideos: Array.isArray(item.channelVideos) ? item.channelVideos as ChannelVideo[] : [],
        selectedChannelVideoIds: Array.isArray(item.selectedChannelVideoIds) ? item.selectedChannelVideoIds.filter((value): value is string => typeof value === "string") : [],
        compareChannelVideos: Array.isArray(item.compareChannelVideos) ? item.compareChannelVideos as ChannelVideo[] : [],
        selectedCompareVideoIds: Array.isArray(item.selectedCompareVideoIds) ? item.selectedCompareVideoIds.filter((value): value is string => typeof value === "string") : [],
        deepDive: item.deepDive && typeof item.deepDive === "object" ? item.deepDive as ChannelDeepDiveBundle : null,
        compare: item.compare && typeof item.compare === "object" ? item.compare as ChannelCompareBundle : null,
      }));
  } catch {
    return [];
  }
}

function loadChannelPresets(): SavedChannelPreset[] {
  try {
    const raw = window.localStorage.getItem(CHANNEL_PRESETS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Array<Partial<SavedChannelPreset>>;
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((item) => item && typeof item === "object")
      .map((item) => ({
        id: typeof item.id === "string" ? item.id : `channel-preset-${Date.now()}`,
        name: typeof item.name === "string" && item.name.trim() ? item.name : "Selection Preset",
        createdAt: typeof item.createdAt === "string" ? item.createdAt : new Date().toISOString(),
        channelUrl: typeof item.channelUrl === "string" ? item.channelUrl : "",
        compareChannelUrl: typeof item.compareChannelUrl === "string" ? item.compareChannelUrl : "",
        channelSampleSize: typeof item.channelSampleSize === "number" ? item.channelSampleSize : 8,
        compareSampleSize: typeof item.compareSampleSize === "number" ? item.compareSampleSize : 8,
        channelVideos: Array.isArray(item.channelVideos) ? item.channelVideos as ChannelVideo[] : [],
        selectedChannelVideoIds: Array.isArray(item.selectedChannelVideoIds) ? item.selectedChannelVideoIds.filter((value): value is string => typeof value === "string") : [],
        compareChannelVideos: Array.isArray(item.compareChannelVideos) ? item.compareChannelVideos as ChannelVideo[] : [],
        selectedCompareVideoIds: Array.isArray(item.selectedCompareVideoIds) ? item.selectedCompareVideoIds.filter((value): value is string => typeof value === "string") : [],
      }));
  } catch {
    return [];
  }
}

function uniqueUrls(value: string): string[] {
  const seen = new Set<string>();
  return value.split(/\r?\n|,|;/).map((item) => item.trim()).filter(Boolean).filter((item) => {
    if (seen.has(item)) return false;
    seen.add(item);
    return true;
  });
}

export default function App() {
  const [experienceMode, setExperienceMode] = useState<ExperienceMode>("basic");
  const [activeView, setActiveView] = useState<AppView>("studio");
  const [workspaceMode, setWorkspaceMode] = useState<WorkspaceMode>("single");
  const [insightTab, setInsightTab] = useState<InsightTab>("summary");
  const [channelResultTab, setChannelResultTab] = useState<ChannelResultTab>("overview");
  const [compareResultTab, setCompareResultTab] = useState<CompareResultTab>("summary");
  const [videoTitle, setVideoTitle] = useState(SAMPLE_TITLE);
  const [videoUrl, setVideoUrl] = useState(SAMPLE_URL);
  const [transcriptLanguage, setTranscriptLanguage] = useState("");
  const [transcript, setTranscript] = useState(SAMPLE_TRANSCRIPT);
  const [summaryStyle, setSummaryStyle] = useState<SummaryStyle>("executive");
  const [audiencePreset, setAudiencePreset] = useState<AudiencePreset>("general");
  const [outputLanguage, setOutputLanguage] = useState<OutputLanguage>("en");
  const [copyFormat, setCopyFormat] = useState<CopyFormat>("brief");
  const [exportFormat, setExportFormat] = useState<ExportFormat>("md");
  const [cleaner, setCleaner] = useState<CleanerSettings>(CLEANER_DEFAULTS);
  const [analysis, setAnalysis] = useState<AnalysisBundle>(() => buildAnalysis({
    title: SAMPLE_TITLE,
    url: SAMPLE_URL,
    transcript: SAMPLE_TRANSCRIPT,
    summaryStyle: "executive",
    audiencePreset: "general",
    outputLanguage: "en",
    cleaner: CLEANER_DEFAULTS,
  }));
  const [briefs, setBriefs] = useState<SavedBrief[]>(() => loadBriefs());
  const [savedChannelReports, setSavedChannelReports] = useState<SavedChannelReport[]>(() => loadChannelReports());
  const [savedChannelPresets, setSavedChannelPresets] = useState<SavedChannelPreset[]>(() => loadChannelPresets());
  const [activeBriefId, setActiveBriefId] = useState<string | null>(null);
  const [transcriptSource, setTranscriptSource] = useState<TranscriptSource | null>(null);
  const [statusState, setStatusState] = useState<StatusState>(READY_STATUS);
  const [batchInput, setBatchInput] = useState("");
  const [batchResults, setBatchResults] = useState<BatchResult[]>([]);
  const [channelUrl, setChannelUrl] = useState("");
  const [channelSampleSize, setChannelSampleSize] = useState<number>(8);
  const [channelVideos, setChannelVideos] = useState<ChannelVideo[]>([]);
  const [selectedChannelVideoIds, setSelectedChannelVideoIds] = useState<string[]>([]);
  const [channelDeepDive, setChannelDeepDive] = useState<ChannelDeepDiveBundle | null>(null);
  const [compareChannelUrl, setCompareChannelUrl] = useState("");
  const [compareSampleSize, setCompareSampleSize] = useState<number>(8);
  const [compareChannelVideos, setCompareChannelVideos] = useState<ChannelVideo[]>([]);
  const [selectedCompareVideoIds, setSelectedCompareVideoIds] = useState<string[]>([]);
  const [channelCompare, setChannelCompare] = useState<ChannelCompareBundle | null>(null);
  const [channelPresetName, setChannelPresetName] = useState("");
  const [historySearch, setHistorySearch] = useState("");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [timestampSearch, setTimestampSearch] = useState("");
  const [proClipScoreFloor, setProClipScoreFloor] = useState(14);
  const [plannerChannelFilter, setPlannerChannelFilter] = useState("all");
  const [busy, setBusy] = useState(false);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(briefs.slice(0, MAX_BRIEFS)));
  }, [briefs]);

  useEffect(() => {
    window.localStorage.setItem(CHANNEL_REPORTS_STORAGE_KEY, JSON.stringify(savedChannelReports.slice(0, MAX_CHANNEL_REPORTS)));
  }, [savedChannelReports]);

  useEffect(() => {
    window.localStorage.setItem(CHANNEL_PRESETS_STORAGE_KEY, JSON.stringify(savedChannelPresets.slice(0, MAX_CHANNEL_PRESETS)));
  }, [savedChannelPresets]);

  useEffect(() => {
    if (experienceMode !== "basic") return;
    if (workspaceMode !== "single") setWorkspaceMode("single");
    if (!BASIC_INSIGHT_TABS.includes(insightTab)) setInsightTab("summary");
    if (!BASIC_COPY_FORMATS.has(copyFormat)) setCopyFormat("brief");
    if (activeView === "channel") setActiveView("studio");
  }, [activeView, copyFormat, experienceMode, insightTab, workspaceMode]);

  useEffect(() => {
    if (!transcript.trim()) return;
    startTransition(() => {
      setAnalysis(buildAnalysis({
        title: videoTitle.trim() || inferTitleFromUrl(videoUrl),
        url: videoUrl,
        transcript,
        summaryStyle,
        audiencePreset,
        outputLanguage,
        cleaner,
      }));
    });
  }, [summaryStyle, audiencePreset, outputLanguage, cleaner, startTransition, transcript, videoTitle, videoUrl]);

  const runtimeReady = typeof window.desktopRuntime?.fetchYoutubeTranscript === "function";
  const canImportFile = typeof window.desktopRuntime?.importTranscriptFile === "function";
  const canExportFile = typeof window.desktopRuntime?.saveExportFile === "function";
  const canExportPdf = typeof window.desktopRuntime?.savePdfFile === "function";
  const canFetchChannel = typeof window.desktopRuntime?.fetchYoutubeChannelVideos === "function";
  const isProMode = experienceMode === "pro";
  const visibleAppViews = isProMode ? (["studio", "channel", "library"] as const) : (["studio", "library"] as const);
  const visibleStudioModes = isProMode ? (["single", "batch"] as const) : (["single"] as const);
  const visibleInsightTabs = isProMode ? PRO_INSIGHT_TABS : BASIC_INSIGHT_TABS;
  const availableCopyFormats = COPY_FORMAT_OPTIONS.filter((option) => isProMode || BASIC_COPY_FORMATS.has(option.value));
  const transcriptWordCount = getWordCount(transcript);
  const canFetchTranscript = runtimeReady && videoUrl.trim().length > 0;
  const canGenerate = transcriptWordCount >= 30;
  const copyPreview = analysis.copyDeck[copyFormat];
  const exportPreview = buildExportContent(exportFormat, videoTitle, videoUrl, analysis, copyFormat);
  const timestampMatches = buildTimestampSearchMatches(timestampSearch, transcript);
  const { message: status, tone: statusTone } = statusState;
  const plannerChannelOptions = ["all", ...new Set(analysis.contentCalendar.map((entry) => entry.primaryChannel))];
  const filteredClipMoments = analysis.clipMoments.filter((moment) => moment.score >= proClipScoreFloor);
  const filteredContentCalendar = analysis.contentCalendar.filter((entry) => plannerChannelFilter === "all" || entry.primaryChannel === plannerChannelFilter);
  const strongestClip = filteredClipMoments[0] ?? analysis.clipMoments[0] ?? null;
  const plannerLead = filteredContentCalendar[0] ?? analysis.contentCalendar[0] ?? null;
  const repurposeReach = new Set(analysis.contentCalendar.flatMap((entry) => entry.repurposeTo)).size;
  const strategicTrack = strongestClip && strongestClip.score >= 18
    ? "Double down on short-form hooks first."
    : analysis.contentCalendar.some((entry) => entry.primaryChannel === "YouTube")
      ? "Anchor with long-form, then repurpose aggressively."
      : "Lead with repurposed posts and test response.";
  const filteredBriefs = briefs.filter((brief) => {
    const needle = historySearch.trim().toLowerCase();
    if (!needle) return true;
    return brief.title.toLowerCase().includes(needle) || brief.url.toLowerCase().includes(needle) || brief.analysis.summary.keywords.some((keyword) => keyword.includes(needle));
  });
  const filteredChannelReports = savedChannelReports.filter((report) => {
    const needle = historySearch.trim().toLowerCase();
    if (!needle) return true;
    return report.title.toLowerCase().includes(needle)
      || report.channelUrl.toLowerCase().includes(needle)
      || report.compareChannelUrl.toLowerCase().includes(needle)
      || report.deepDive?.channelLabel.toLowerCase().includes(needle)
      || report.compare?.primaryLabel.toLowerCase().includes(needle)
      || report.compare?.competitorLabel.toLowerCase().includes(needle);
  });
  const filteredChannelPresets = savedChannelPresets.filter((preset) => {
    const needle = historySearch.trim().toLowerCase();
    if (!needle) return true;
    return preset.name.toLowerCase().includes(needle)
      || preset.channelUrl.toLowerCase().includes(needle)
      || preset.compareChannelUrl.toLowerCase().includes(needle);
  });
  const selectedChannelVideoIdSet = new Set(selectedChannelVideoIds);
  const selectedChannelVideos = channelVideos.filter((video) => selectedChannelVideoIdSet.has(video.videoId));
  const selectedCompareVideoIdSet = new Set(selectedCompareVideoIds);
  const selectedCompareVideos = compareChannelVideos.filter((video) => selectedCompareVideoIdSet.has(video.videoId));
  const visibleLibraryItemCount = filteredBriefs.length + (isProMode ? filteredChannelReports.length + filteredChannelPresets.length : 0);
  const librarySearchPlaceholder = isProMode
    ? "Search briefs, channels, URLs, or compare reports"
    : "Search saved briefs or URLs";

  useEffect(() => {
    if (plannerChannelFilter === "all") return;
    if (analysis.contentCalendar.some((entry) => entry.primaryChannel === plannerChannelFilter)) return;
    setPlannerChannelFilter("all");
  }, [analysis.contentCalendar, plannerChannelFilter]);

  useEffect(() => {
    if (channelDeepDive) {
      setChannelResultTab("overview");
    }
  }, [channelDeepDive]);

  useEffect(() => {
    if (channelCompare) {
      setCompareResultTab("summary");
    }
  }, [channelCompare]);

  function regenerate(nextTranscript = transcript, nextTitle = videoTitle, nextUrl = videoUrl) {
    startTransition(() => {
      setAnalysis(buildAnalysis({
        title: nextTitle.trim() || inferTitleFromUrl(nextUrl),
        url: nextUrl,
        transcript: nextTranscript,
        summaryStyle,
        audiencePreset,
        outputLanguage,
        cleaner,
      }));
    });
  }

  function handleGenerateFromText() {
    if (!canGenerate) return showStatus("Paste More Transcript Text", "error");
    showStatus("Generating From Text", "busy");
    setInsightTab("summary");
    setAnswer("");
    regenerate();
    window.setTimeout(() => {
      setStatusState((current) => current.message === "Generating From Text" ? { message: "Brief Ready", tone: "success" } : current);
    }, 200);
  }

  function showStatus(message: string, tone: StatusTone) {
    setStatusState({ message, tone });
  }

  function handleSelectView(view: AppView) {
    if (view === "channel") {
      setExperienceMode("pro");
      setWorkspaceMode("channel");
      setActiveView("channel");
      showStatus("Channel Lab Ready", "success");
      return;
    }

    if (view === "studio") {
      setActiveView("studio");
      if (workspaceMode === "channel") setWorkspaceMode("single");
      showStatus("Brief Studio Ready", "success");
      return;
    }

    setActiveView("library");
    showStatus("Library Ready", "success");
  }

  function updateChannelSelection(nextIds: string[]) {
    const allowedIds = new Set(channelVideos.map((video) => video.videoId));
    const uniqueIds = nextIds.filter((videoId, index) => allowedIds.has(videoId) && nextIds.indexOf(videoId) === index);
    setSelectedChannelVideoIds(uniqueIds);
    setChannelDeepDive(null);
    setChannelCompare(null);
  }

  function handleToggleChannelVideo(videoId: string) {
    updateChannelSelection(selectedChannelVideoIdSet.has(videoId)
      ? selectedChannelVideoIds.filter((id) => id !== videoId)
      : [...selectedChannelVideoIds, videoId]);
  }

  function handleSelectAllChannelVideos() {
    updateChannelSelection(channelVideos.map((video) => video.videoId));
    showStatus("All Loaded Videos Selected", "success");
  }

  function handleSelectTopChannelVideos(count: number) {
    const nextIds = channelVideos.slice(0, count).map((video) => video.videoId);
    updateChannelSelection(nextIds);
    showStatus(`${nextIds.length} Videos Selected`, "success");
  }

  function handleClearChannelSelection() {
    updateChannelSelection([]);
    showStatus("Channel Selection Cleared", "success");
  }

  function updateCompareSelection(nextIds: string[]) {
    const allowedIds = new Set(compareChannelVideos.map((video) => video.videoId));
    const uniqueIds = nextIds.filter((videoId, index) => allowedIds.has(videoId) && nextIds.indexOf(videoId) === index);
    setSelectedCompareVideoIds(uniqueIds);
    setChannelCompare(null);
  }

  function handleToggleCompareVideo(videoId: string) {
    updateCompareSelection(selectedCompareVideoIdSet.has(videoId)
      ? selectedCompareVideoIds.filter((id) => id !== videoId)
      : [...selectedCompareVideoIds, videoId]);
  }

  function handleSelectAllCompareVideos() {
    updateCompareSelection(compareChannelVideos.map((video) => video.videoId));
    showStatus("All Compare Videos Selected", "success");
  }

  function handleSelectTopCompareVideos(count: number) {
    const nextIds = compareChannelVideos.slice(0, count).map((video) => video.videoId);
    updateCompareSelection(nextIds);
    showStatus(`${nextIds.length} Compare Videos Selected`, "success");
  }

  function handleClearCompareSelection() {
    updateCompareSelection([]);
    showStatus("Compare Selection Cleared", "success");
  }

  function persistChannelReport(report: SavedChannelReport) {
    setSavedChannelReports((current) => [report, ...current.filter((item) => item.id !== report.id)].slice(0, MAX_CHANNEL_REPORTS));
  }

  function buildSavedChannelReport(kind: SavedChannelReport["kind"], deepDive: ChannelDeepDiveBundle, compare: ChannelCompareBundle | null): SavedChannelReport {
    return {
      id: `channel-report-${Date.now()}`,
      kind,
      title: kind === "compare" && compare ? `${compare.primaryLabel} vs ${compare.competitorLabel}` : `${deepDive.channelLabel} Deep Dive`,
      createdAt: new Date().toISOString(),
      channelUrl: channelUrl.trim(),
      compareChannelUrl: compareChannelUrl.trim(),
      channelSampleSize,
      compareSampleSize,
      channelVideos,
      selectedChannelVideoIds,
      compareChannelVideos,
      selectedCompareVideoIds,
      deepDive,
      compare,
    };
  }

  function handleLoadSavedChannelReport(report: SavedChannelReport) {
    setExperienceMode("pro");
    setActiveView("channel");
    setWorkspaceMode("channel");
    setChannelUrl(report.channelUrl);
    setCompareChannelUrl(report.compareChannelUrl);
    setChannelSampleSize(report.channelSampleSize);
    setCompareSampleSize(report.compareSampleSize);
    setChannelVideos(report.channelVideos);
    setSelectedChannelVideoIds(report.selectedChannelVideoIds);
    setCompareChannelVideos(report.compareChannelVideos);
    setSelectedCompareVideoIds(report.selectedCompareVideoIds);
    setChannelDeepDive(report.deepDive);
    setChannelCompare(report.compare);
    showStatus(report.kind === "compare" ? "Compare Report Loaded" : "Channel Report Loaded", "success");
  }

  function persistChannelPreset(preset: SavedChannelPreset) {
    setSavedChannelPresets((current) => [preset, ...current.filter((item) => item.id !== preset.id)].slice(0, MAX_CHANNEL_PRESETS));
  }

  function handleSaveChannelPreset() {
    if (channelVideos.length === 0 && compareChannelVideos.length === 0) return showStatus("Load Channel Samples First", "error");
    const name = channelPresetName.trim() || `${channelUrl.trim() ? "Channel" : "Selection"} Preset`;
    persistChannelPreset({
      id: `channel-preset-${Date.now()}`,
      name,
      createdAt: new Date().toISOString(),
      channelUrl: channelUrl.trim(),
      compareChannelUrl: compareChannelUrl.trim(),
      channelSampleSize,
      compareSampleSize,
      channelVideos,
      selectedChannelVideoIds,
      compareChannelVideos,
      selectedCompareVideoIds,
    });
    setChannelPresetName("");
    showStatus(`Preset Saved: ${name}`, "success");
  }

  function handleLoadChannelPreset(preset: SavedChannelPreset) {
    setExperienceMode("pro");
    setActiveView("channel");
    setWorkspaceMode("channel");
    setChannelUrl(preset.channelUrl);
    setCompareChannelUrl(preset.compareChannelUrl);
    setChannelSampleSize(preset.channelSampleSize);
    setCompareSampleSize(preset.compareSampleSize);
    setChannelVideos(preset.channelVideos);
    setSelectedChannelVideoIds(preset.selectedChannelVideoIds);
    setCompareChannelVideos(preset.compareChannelVideos);
    setSelectedCompareVideoIds(preset.selectedCompareVideoIds);
    setChannelDeepDive(null);
    setChannelCompare(null);
    showStatus(`Preset Loaded: ${preset.name}`, "success");
  }

  function handleExperienceModeChange(nextMode: ExperienceMode) {
    setExperienceMode(nextMode);
    if (nextMode === "basic") {
      setWorkspaceMode("single");
      if (!BASIC_INSIGHT_TABS.includes(insightTab)) setInsightTab("summary");
      if (!BASIC_COPY_FORMATS.has(copyFormat)) setCopyFormat("brief");
      showStatus("Basic Mode Ready", "success");
      return;
    }
    showStatus("Pro Mode Activated", "success");
  }

  function handleProQuickExport(nextFormat: CopyFormat) {
    setCopyFormat(nextFormat);
    setInsightTab("exports");
    const label = COPY_FORMAT_OPTIONS.find((option) => option.value === nextFormat)?.label ?? "Export";
    showStatus(`${label} Preview Ready`, "success");
  }

  async function handleFetch(generateAfterFetch: boolean) {
    if (!canFetchTranscript) return showStatus("Paste A URL", "error");
    setBusy(true);
    showStatus(generateAfterFetch ? "Generating" : "Fetching", "busy");
    try {
      const result = await window.desktopRuntime.fetchYoutubeTranscript(videoUrl.trim(), transcriptLanguage || undefined);
      startTransition(() => {
        setTranscript(result.transcript);
        setTranscriptSource({ lineCount: result.lineCount, language: result.language, videoId: result.videoId });
        if (!videoTitle.trim() && result.title) setVideoTitle(result.title);
      });
      if (generateAfterFetch) regenerate(result.transcript, videoTitle.trim() || result.title, videoUrl);
      showStatus(generateAfterFetch ? "Brief Ready" : "Fetched", "success");
    } catch (error) {
      showStatus(error instanceof Error ? error.message : "Fetch Failed", "error");
    } finally {
      setBusy(false);
    }
  }

  async function handleImportTranscript() {
    if (!canImportFile) return showStatus("Import Unavailable", "error");
    try {
      const result = await window.desktopRuntime.importTranscriptFile();
      if (result.canceled) return showStatus("Import Cancelled", "ready");
      const imported = convertSubtitleContent(result.content, result.extension ?? "");
      setTranscript(imported);
      if (!videoTitle.trim()) setVideoTitle(result.fileName.replace(/\.[^.]+$/, ""));
      showStatus("Imported", "success");
    } catch (error) {
      showStatus(error instanceof Error ? error.message : "Import Failed", "error");
    }
  }

  function handleCleanTranscript() {
    setTranscript(cleanTranscriptInput(transcript, cleaner));
    showStatus("Cleaned", "success");
  }

  function handleSave() {
    const nextBrief: SavedBrief = {
      id: activeBriefId ?? `brief-${Date.now()}`,
      title: videoTitle.trim() || analysis.summary.headline,
      url: videoUrl.trim(),
      transcript,
      createdAt: new Date().toISOString(),
      analysis,
      summaryStyle,
      audiencePreset,
      outputLanguage,
    };
    setBriefs((current) => [nextBrief, ...current.filter((brief) => brief.id !== nextBrief.id)].slice(0, MAX_BRIEFS));
    setActiveBriefId(nextBrief.id);
    showStatus("Saved", "success");
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(copyPreview);
      showStatus("Copied", "success");
    } catch {
      showStatus("Copy Failed", "error");
    }
  }

  async function handleExport() {
    if (!canExportFile) return handleCopy();
    try {
      const result = await window.desktopRuntime.saveExportFile({
        suggestedName: videoTitle.trim() || analysis.summary.headline || "cipher-lens-brief",
        extension: exportFormat,
        content: exportPreview,
      });
      showStatus(result.canceled ? "Export Cancelled" : "Exported", result.canceled ? "ready" : "success");
    } catch (error) {
      showStatus(error instanceof Error ? error.message : "Export Failed", "error");
    }
  }

  async function handleOpenTimestamp(seconds: number | null) {
    if (seconds === null || !videoUrl.trim()) return showStatus("No Timestamp", "error");
    const targetUrl = `${videoUrl}${videoUrl.includes("?") ? "&" : "?"}t=${Math.max(0, Math.floor(seconds))}s`;
    if (typeof window.desktopRuntime?.openExternal === "function") await window.desktopRuntime.openExternal(targetUrl);
  }

  async function handleRunBatch() {
    const urls = uniqueUrls(batchInput);
    if (urls.length === 0) return showStatus("Add Batch URLs", "error");
    if (!runtimeReady) return showStatus("Desktop Bridge Required", "error");
    setBusy(true);
    showStatus("Batch Running", "busy");
    setBatchResults(urls.map((url, index) => ({ id: `batch-${index}`, title: url, url, status: "pending", message: "Queued" })));
    for (let index = 0; index < urls.length; index += 1) {
      const url = urls[index];
      try {
        const result = await window.desktopRuntime.fetchYoutubeTranscript(url, transcriptLanguage || undefined);
        const nextAnalysis = buildAnalysis({ title: result.title || inferTitleFromUrl(url), url, transcript: result.transcript, summaryStyle, audiencePreset, outputLanguage, cleaner });
        setBatchResults((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, title: result.title || item.title, transcript: result.transcript, analysis: nextAnalysis, status: "done", message: `Fetched ${result.lineCount} Lines` } : item));
      } catch (error) {
        setBatchResults((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, status: "failed", message: error instanceof Error ? error.message : "Failed" } : item));
      }
    }
    setBusy(false);
    showStatus("Batch Done", "success");
  }

  async function handleLoadChannelVideos() {
    if (!canFetchChannel) return showStatus("Channel Unavailable", "error");
    if (!channelUrl.trim()) return showStatus("Paste A Channel URL", "error");
    setBusy(true);
    showStatus("Loading Channel", "busy");
    try {
      const videos = await window.desktopRuntime.fetchYoutubeChannelVideos(channelUrl.trim(), channelSampleSize);
      setChannelVideos(videos);
      setSelectedChannelVideoIds(videos.map((video) => video.videoId));
      setChannelDeepDive(null);
      setChannelCompare(null);
      showStatus(`Channel Loaded (${videos.length} Videos)`, "success");
    } catch (error) {
      showStatus(error instanceof Error ? error.message : "Channel Failed", "error");
    } finally {
      setBusy(false);
    }
  }

  async function handleLoadCompareChannelVideos() {
    if (!canFetchChannel) return showStatus("Channel Unavailable", "error");
    if (!compareChannelUrl.trim()) return showStatus("Paste A Compare Channel URL", "error");
    setBusy(true);
    showStatus("Loading Compare Channel", "busy");
    try {
      const videos = await window.desktopRuntime.fetchYoutubeChannelVideos(compareChannelUrl.trim(), compareSampleSize);
      setCompareChannelVideos(videos);
      setSelectedCompareVideoIds(videos.map((video) => video.videoId));
      setChannelCompare(null);
      showStatus(`Compare Channel Loaded (${videos.length} Videos)`, "success");
    } catch (error) {
      showStatus(error instanceof Error ? error.message : "Compare Channel Failed", "error");
    } finally {
      setBusy(false);
    }
  }

  async function enrichChannelVideos(videos: ChannelVideo[]) {
    return Promise.all(videos.map(async (video) => {
      const [transcriptResult, metadataResult] = await Promise.allSettled([
        window.desktopRuntime.fetchYoutubeTranscript(video.url, transcriptLanguage || undefined),
        typeof window.desktopRuntime?.fetchYoutubeVideoMetadata === "function"
          ? window.desktopRuntime.fetchYoutubeVideoMetadata(video.url)
          : Promise.resolve({ title: "", description: "", thumbnailUrl: "", thumbnailText: "" }),
      ]);

      try {
        return {
          ...video,
          title: transcriptResult.status === "fulfilled" && transcriptResult.value.title
            ? transcriptResult.value.title
            : metadataResult.status === "fulfilled" && metadataResult.value.title
              ? metadataResult.value.title
              : video.title,
          transcript: transcriptResult.status === "fulfilled" ? transcriptResult.value.transcript : "",
          description: metadataResult.status === "fulfilled" ? metadataResult.value.description : video.description ?? "",
          thumbnailUrl: metadataResult.status === "fulfilled" ? metadataResult.value.thumbnailUrl : video.thumbnailUrl ?? "",
          thumbnailText: metadataResult.status === "fulfilled" ? metadataResult.value.thumbnailText : video.thumbnailText ?? "",
        };
      } catch {
        return {
          ...video,
          transcript: "",
        };
      }
    }));
  }

  async function handleRunChannelDeepDive() {
    if (!runtimeReady) return showStatus("Desktop Bridge Required", "error");
    if (channelVideos.length === 0) return showStatus("Load Channel Videos First", "error");
    if (selectedChannelVideos.length === 0) return showStatus("Select At Least One Channel Video", "error");
    setBusy(true);
    showStatus("Building Deep Dive", "busy");
    try {
      const enrichedVideos = await enrichChannelVideos(selectedChannelVideos);
      const deepDive = buildChannelDeepDive({
        channelUrl: channelUrl.trim(),
        videos: enrichedVideos,
        sourceVideoCount: channelVideos.length,
        summaryStyle,
        audiencePreset,
        outputLanguage,
        cleaner,
      });
      setChannelDeepDive(deepDive);
      persistChannelReport(buildSavedChannelReport("deep-dive", deepDive, null));
      showStatus("Deep Dive Ready", "success");
    } catch (error) {
      showStatus(error instanceof Error ? error.message : "Deep Dive Failed", "error");
    } finally {
      setBusy(false);
    }
  }

  async function handleRunChannelCompare() {
    if (!runtimeReady) return showStatus("Desktop Bridge Required", "error");
    if (channelVideos.length === 0) return showStatus("Load Main Channel First", "error");
    if (selectedChannelVideos.length === 0) return showStatus("Select At Least One Main Channel Video", "error");
    if (!compareChannelUrl.trim()) return showStatus("Paste A Compare Channel URL", "error");
    if (compareChannelVideos.length === 0) return showStatus("Load Compare Channel First", "error");
    if (selectedCompareVideos.length === 0) return showStatus("Select At Least One Compare Video", "error");
    setBusy(true);
    showStatus("Comparing Channels", "busy");
    try {
      const [primaryVideos, competitorVideos] = await Promise.all([
        enrichChannelVideos(selectedChannelVideos),
        enrichChannelVideos(selectedCompareVideos),
      ]);
      const primaryDeepDive = buildChannelDeepDive({
        channelUrl: channelUrl.trim(),
        videos: primaryVideos,
        sourceVideoCount: channelVideos.length,
        summaryStyle,
        audiencePreset,
        outputLanguage,
        cleaner,
      });
      const competitorDeepDive = buildChannelDeepDive({
        channelUrl: compareChannelUrl.trim(),
        videos: competitorVideos,
        sourceVideoCount: competitorVideos.length,
        summaryStyle,
        audiencePreset,
        outputLanguage,
        cleaner,
      });
      const compareBundle = buildChannelCompare({
        primary: primaryDeepDive,
        competitor: competitorDeepDive,
      });
      setChannelDeepDive(primaryDeepDive);
      setChannelCompare(compareBundle);
      persistChannelReport(buildSavedChannelReport("compare", primaryDeepDive, compareBundle));
      showStatus("Channel Compare Ready", "success");
    } catch (error) {
      showStatus(error instanceof Error ? error.message : "Channel Compare Failed", "error");
    } finally {
      setBusy(false);
    }
  }

  async function handleCopyChannelDeepDive() {
    if (!channelDeepDive) return showStatus("Run Channel Deep Dive First", "error");
    try {
      await navigator.clipboard.writeText(channelDeepDive.exportDeck);
      showStatus("Channel Report Copied", "success");
    } catch {
      showStatus("Copy Failed", "error");
    }
  }

  async function handleExportChannelDeepDive() {
    if (!channelDeepDive) return showStatus("Run Channel Deep Dive First", "error");
    if (!canExportFile) return handleCopyChannelDeepDive();
    try {
      const result = await window.desktopRuntime.saveExportFile({
        suggestedName: `${channelDeepDive.channelLabel || "channel"}-deep-dive`,
        extension: "md",
        content: channelDeepDive.exportDeck,
      });
      showStatus(result.canceled ? "Export Cancelled" : "Channel Report Exported", result.canceled ? "ready" : "success");
    } catch (error) {
      showStatus(error instanceof Error ? error.message : "Export Failed", "error");
    }
  }

  async function handleExportChannelDeepDivePdf() {
    if (!channelDeepDive) return showStatus("Run Channel Deep Dive First", "error");
    if (!canExportPdf) return handleExportChannelDeepDive();
    try {
      const result = await window.desktopRuntime.savePdfFile({
        suggestedName: `${channelDeepDive.channelLabel || "channel"}-deep-dive`,
        html: buildReportPdfHtml({
          title: `${channelDeepDive.channelLabel} Channel Deep Dive`,
          label: "Deep Dive PDF",
          subtitle: `${channelDeepDive.analyzedVideos} selected videos, ${channelDeepDive.transcriptCoverage}% transcript coverage, average visible views ${formatMetricCount(channelDeepDive.averageViewCount)}, and a premium strategy deck.`,
          deck: channelDeepDive.exportDeck,
          generatedAt: formatCreatedAt(new Date().toISOString()),
          stats: [
            { label: "Selected Videos", value: `${channelDeepDive.analyzedVideos}` },
            { label: "Transcript Coverage", value: `${channelDeepDive.transcriptCoverage}%` },
            { label: "Average Visible Views", value: formatMetricCount(channelDeepDive.averageViewCount) },
          ],
        }),
      });
      showStatus(result.canceled ? "PDF Export Cancelled" : "Channel PDF Exported", result.canceled ? "ready" : "success");
    } catch (error) {
      showStatus(error instanceof Error ? error.message : "PDF Export Failed", "error");
    }
  }

  async function handleCopyChannelCompare() {
    if (!channelCompare) return showStatus("Run Channel Compare First", "error");
    try {
      await navigator.clipboard.writeText(channelCompare.exportDeck);
      showStatus("Compare Report Copied", "success");
    } catch {
      showStatus("Copy Failed", "error");
    }
  }

  async function handleExportChannelCompare() {
    if (!channelCompare) return showStatus("Run Channel Compare First", "error");
    if (!canExportFile) return handleCopyChannelCompare();
    try {
      const result = await window.desktopRuntime.saveExportFile({
        suggestedName: `${channelCompare.primaryLabel}-vs-${channelCompare.competitorLabel}`.replace(/\s+/g, "-").toLowerCase(),
        extension: "md",
        content: channelCompare.exportDeck,
      });
      showStatus(result.canceled ? "Export Cancelled" : "Compare Report Exported", result.canceled ? "ready" : "success");
    } catch (error) {
      showStatus(error instanceof Error ? error.message : "Export Failed", "error");
    }
  }

  async function handleExportChannelComparePdf() {
    if (!channelCompare) return showStatus("Run Channel Compare First", "error");
    if (!canExportPdf) return handleExportChannelCompare();
    try {
      const result = await window.desktopRuntime.savePdfFile({
        suggestedName: `${channelCompare.primaryLabel}-vs-${channelCompare.competitorLabel}`.replace(/\s+/g, "-").toLowerCase(),
        html: buildReportPdfHtml({
          title: `${channelCompare.primaryLabel} vs ${channelCompare.competitorLabel}`,
          label: "Compare PDF",
          subtitle: `${channelCompare.metrics.primarySampleSize} vs ${channelCompare.metrics.competitorSampleSize} selected videos with avg visible views ${formatMetricCount(channelCompare.metrics.primaryAverageViews)} vs ${formatMetricCount(channelCompare.metrics.competitorAverageViews)}.`,
          deck: channelCompare.exportDeck,
          generatedAt: formatCreatedAt(new Date().toISOString()),
          stats: [
            { label: `${channelCompare.primaryLabel} Sample`, value: `${channelCompare.metrics.primarySampleSize}` },
            { label: `${channelCompare.competitorLabel} Sample`, value: `${channelCompare.metrics.competitorSampleSize}` },
            { label: "Shared Themes", value: `${channelCompare.overlapThemes.length}` },
          ],
        }),
      });
      showStatus(result.canceled ? "PDF Export Cancelled" : "Compare PDF Exported", result.canceled ? "ready" : "success");
    } catch (error) {
      showStatus(error instanceof Error ? error.message : "PDF Export Failed", "error");
    }
  }

  const shellTitle = activeView === "studio"
    ? workspaceMode === "batch"
      ? "Batch workflow, without the clutter"
      : "Fast insight from one video"
    : activeView === "channel"
      ? "Channel research now has its own command center"
      : "Saved work, separate from live analysis";
  return (
    <main className="lens-app app-shell">
      <section className="hero-panel">
        <div className="hero-status-row">
          <span className={`status-badge is-${statusTone}`}>{status}</span>
        </div>
        <div className="hero-copy-stack">
          <div className="cipher-logo hero-logo" aria-label="Cipher Lens">
            <img className="cipher-logo-icon" src="/brand/cipher-mark.svg" alt="" />
            <span className="word">Cipher</span>
            <span className="tm">TM</span>
            <span className="tool-name">Lens</span>
          </div>
          <span className="hero-version">Cipher Suite | Cipher Lens v1.0.0</span>
          <p className="hero-motto">{shellTitle}</p>
        </div>
      </section>

      <section className="simple-card brand-control-panel">
        <div className="status-row">
          <div>
            <h2>Experience Mode</h2>
            <p className="mode-description">Choose the workspace depth you want before jumping into the app.</p>
          </div>
          <div className="pill-row hero-mode-row">
            {(["basic", "pro"] as ExperienceMode[]).map((mode) => <button key={mode} type="button" className={`mode-pill ${experienceMode === mode ? "is-active" : ""}`} onClick={() => handleExperienceModeChange(mode)}>{EXPERIENCE_MODE_LABELS[mode]}</button>)}
          </div>
        </div>
      </section>

      <section className="simple-card">
        <div className="status-row mode-header-row">
          <div>
            <h2>{activeView === "studio" ? (isProMode ? "Pro Studio" : "Basic Studio") : activeView === "channel" ? "Channel Lab" : "Library"}</h2>
            <p className="mode-description">{activeView === "studio" ? (isProMode ? "Single-video analysis, batch runs, exports, transcript chat, and publishing intelligence." : "Fast single-video briefs for summaries, exports, and quick decisions.") : activeView === "channel" ? "Dedicated flow for Deep Dive, Compare, sample control, and presets." : (isProMode ? "Saved briefs, reports, and reusable presets in one separate place." : "Saved briefs stay separate from your live workspace.")}</p>
          </div>
          <div className="header-control-stack">
            <div className="pill-row">
              {visibleAppViews.map((view) => <button key={view} type="button" className={`mode-pill ${activeView === view ? "is-active" : ""}`} onClick={() => handleSelectView(view)}>{APP_VIEW_LABELS[view]}</button>)}
            </div>
          </div>
        </div>
        {activeView === "studio" && isProMode ? <div className="mode-subrow">
          <span className="mode-note">Batch, transcript chat, and richer export tools are active here.</span>
          <div className="pill-row">
            {visibleStudioModes.map((mode) => <button key={mode} type="button" className={`mode-pill ${workspaceMode === mode ? "is-active" : ""}`} onClick={() => setWorkspaceMode(mode)}>{WORKSPACE_MODE_LABELS[mode]}</button>)}
          </div>
        </div> : activeView === "channel" ? <div className="mode-subrow">
          <span className="mode-note">Deep Dive and Compare stay here, so channel research no longer competes with single-video work.</span>
        </div> : activeView === "library" ? <div className="mode-subrow">
          <span className="mode-note">{isProMode ? "History stays in its own screen, so saved items do not crowd the active workflow." : "Saved briefs stay easy to reopen without crowding the active workflow."}</span>
        </div> : null}
      </section>

      <div className="workspace-grid">
        <section className="workspace-main">
          {activeView !== "library" ? <section className="simple-card">
            <div className="section-header"><div><h2>{activeView === "channel" ? "Channel Command" : workspaceMode === "batch" ? "Batch Studio" : "Input Studio"}</h2></div><div className="header-meta-row"><span className="meta-text">{transcriptWordCount} Transcript Words</span><span className="meta-text">{analysis.quotes.length} Highlight Quotes</span><span className="meta-text">{analysis.summary.stats.transcriptLines} Lines Analyzed</span></div></div>

            {activeView === "studio" && workspaceMode === "single" ? (
              <>
                <div className="form-grid premium-grid">
                  <label className="field field-wide"><span>YouTube URL</span><input value={videoUrl} onChange={(event) => setVideoUrl(event.target.value)} placeholder="https://www.youtube.com/watch?v=..." /></label>
                  <label className="field"><span>Video Title</span><input value={videoTitle} onChange={(event) => setVideoTitle(event.target.value)} placeholder="Optional Title" /></label>
                  <label className="field"><span>Caption Language</span><select value={transcriptLanguage} onChange={(event) => setTranscriptLanguage(event.target.value)}>{LANGUAGE_OPTIONS.map((option) => <option key={option.value || "auto"} value={option.value}>{option.label}</option>)}</select></label>
                  <label className="field"><span>Summary Style</span><select value={summaryStyle} onChange={(event) => setSummaryStyle(event.target.value as SummaryStyle)}>{SUMMARY_STYLE_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></label>
                  <label className="field"><span>Audience</span><select value={audiencePreset} onChange={(event) => setAudiencePreset(event.target.value as AudiencePreset)}>{AUDIENCE_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></label>
                  <label className="field"><span>Output Language</span><select value={outputLanguage} onChange={(event) => setOutputLanguage(event.target.value as OutputLanguage)}>{OUTPUT_LANGUAGE_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></label>
                  <label className="field"><span>Copy Format</span><select value={copyFormat} onChange={(event) => setCopyFormat(event.target.value as CopyFormat)}>{availableCopyFormats.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></label>
                  <label className="field"><span>Export Format</span><select value={exportFormat} onChange={(event) => setExportFormat(event.target.value as ExportFormat)}>{EXPORT_FORMAT_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></label>
                </div>

                {isProMode ? <div className="cleaner-panel">
                  <label className="toggle-row"><input type="checkbox" checked={cleaner.removeNoiseTags} onChange={(event) => setCleaner((current) => ({ ...current, removeNoiseTags: event.target.checked }))} /><span>Remove Noise Tags</span></label>
                  <label className="toggle-row"><input type="checkbox" checked={cleaner.removeSpeakerLabels} onChange={(event) => setCleaner((current) => ({ ...current, removeSpeakerLabels: event.target.checked }))} /><span>Strip Speaker Labels</span></label>
                  <label className="toggle-row"><input type="checkbox" checked={cleaner.dedupeLines} onChange={(event) => setCleaner((current) => ({ ...current, dedupeLines: event.target.checked }))} /><span>Remove Duplicates</span></label>
                  <label className="toggle-row"><input type="checkbox" checked={cleaner.trimFillers} onChange={(event) => setCleaner((current) => ({ ...current, trimFillers: event.target.checked }))} /><span>Trim Filler Words</span></label>
                </div> : null}

                {transcriptSource ? <div className="meta-row"><span>Source: YouTube</span><span>Language: {transcriptSource.language || "Default"}</span><span>Video ID: {transcriptSource.videoId}</span></div> : null}
                <label className="field field-stack"><span>Transcript</span><textarea value={transcript} onChange={(event) => setTranscript(event.target.value)} placeholder="Paste Subtitles, Timestamps, Or Transcript Paragraphs Here." /></label>
                <div className="command-deck">
                  <section className="command-hero">
                    <div className="command-hero-copy">
                      <span className="action-cluster-label">Command Deck</span>
                      <h3>Run the brief first, then use the utility rail only when you need it.</h3>
                    </div>
                    <div className="command-hero-actions">
                      <button type="button" className="primary-button" onClick={() => void handleFetch(true)} disabled={busy || isPending || (!canFetchTranscript && !canGenerate)}>{busy || isPending ? "Working..." : canFetchTranscript ? "Fetch + Generate" : isProMode ? "Generate Premium Brief" : "Generate Brief"}</button>
                      <button type="button" className="secondary-button" onClick={() => void handleFetch(false)} disabled={busy || !canFetchTranscript}>Fetch</button>
                      <button type="button" className="secondary-button" onClick={handleGenerateFromText} disabled={!canGenerate || isPending}>Generate</button>
                    </div>
                  </section>
                  <div className="command-grid">
                    <section className="command-card">
                      <div className="command-card-head">
                        <span className="action-cluster-label">Transcript</span>
                        <p>Bring text in or clean it before analysis.</p>
                      </div>
                      <div className="action-cluster-buttons">
                        <button type="button" className="secondary-button" onClick={() => void handleImportTranscript()} disabled={!canImportFile}>Import</button>
                        <button type="button" className="secondary-button" onClick={handleCleanTranscript} disabled={!transcript.trim()}>Clean Transcript</button>
                      </div>
                    </section>
                    <section className="command-card">
                      <div className="command-card-head">
                        <span className="action-cluster-label">Output</span>
                        <p>Save the current brief or send it out fast.</p>
                      </div>
                      <div className="action-cluster-buttons">
                        <button type="button" className="secondary-button" onClick={handleSave}>Save</button>
                        <button type="button" className="secondary-button" onClick={() => void handleCopy()}>Copy</button>
                        <button type="button" className="secondary-button" onClick={() => void handleExport()}>Export</button>
                      </div>
                    </section>
                    <section className="command-card command-card-muted">
                      <div className="command-card-head">
                        <span className="action-cluster-label">Reset</span>
                        <p>Use these when you want to restart, not during normal flow.</p>
                      </div>
                      <div className="action-link-row">
                        <button type="button" className="link-button command-link-button" onClick={() => { setVideoTitle(SAMPLE_TITLE); setVideoUrl(SAMPLE_URL); setTranscript(SAMPLE_TRANSCRIPT); setTranscriptLanguage(""); setTranscriptSource(null); setAnswer(""); showStatus("Sample Loaded", "success"); }}>Load Sample</button>
                        <button type="button" className="link-button command-link-button danger-button" onClick={() => { setVideoTitle(""); setVideoUrl(""); setTranscript(""); setTranscriptLanguage(""); setTranscriptSource(null); setAnswer(""); setAnalysis(buildAnalysis({ title: "", url: "", transcript: "", summaryStyle, audiencePreset, outputLanguage, cleaner })); setStatusState(READY_STATUS); }}>Clear</button>
                      </div>
                    </section>
                  </div>
                </div>
              </>
            ) : activeView === "studio" && isProMode && workspaceMode === "batch" ? (
              <div className="mode-panel">
                <label className="field"><span>Batch URLs</span><textarea className="batch-textarea" value={batchInput} onChange={(event) => setBatchInput(event.target.value)} placeholder="Paste One YouTube URL Per Line." /></label>
                <div className="button-row"><button type="button" className="primary-button" onClick={() => void handleRunBatch()} disabled={busy}>Run Batch Summary</button></div>
                <div className="batch-list">{batchResults.length === 0 ? <p className="empty-copy">No Batch Results Yet.</p> : batchResults.map((item) => <article key={item.id} className={`result-item is-${item.status}`}><div><strong>{item.title}</strong><p>{item.message}</p></div><div className="result-actions"><span className={`result-badge is-${item.status}`}>{RESULT_STATUS_LABELS[item.status]}</span><button type="button" className="secondary-button" onClick={() => { if (!item.analysis || !item.transcript) return; setActiveView("studio"); setWorkspaceMode("single"); setVideoTitle(item.title); setVideoUrl(item.url); setTranscript(item.transcript); setAnalysis(item.analysis); showStatus("Batch Loaded", "success"); }} disabled={!item.analysis}>Open</button></div></article>)}</div>
              </div>
            ) : activeView === "channel" && isProMode ? (
              <div className="mode-panel">
                <div className="form-grid premium-grid">
                  <label className="field field-wide"><span>YouTube Channel URL</span><input value={channelUrl} onChange={(event) => setChannelUrl(event.target.value)} placeholder="https://www.youtube.com/@channelname" /></label>
                  <label className="field"><span>Recent Videos To Load</span><select value={String(channelSampleSize)} onChange={(event) => setChannelSampleSize(Number(event.target.value) || 8)}>{CHANNEL_SAMPLE_SIZE_OPTIONS.map((value) => <option key={value} value={value}>{value} Videos</option>)}</select></label>
                  <label className="field field-wide"><span>Compare Channel URL</span><input value={compareChannelUrl} onChange={(event) => { setCompareChannelUrl(event.target.value); setCompareChannelVideos([]); setSelectedCompareVideoIds([]); setChannelCompare(null); }} placeholder="https://www.youtube.com/@competitor" /></label>
                  <label className="field"><span>Compare Sample Size</span><select value={String(compareSampleSize)} onChange={(event) => setCompareSampleSize(Number(event.target.value) || 8)}>{CHANNEL_SAMPLE_SIZE_OPTIONS.map((value) => <option key={value} value={value}>{value} Videos</option>)}</select></label>
                </div>
                <div className="button-row">
                  <button type="button" className="primary-button" onClick={() => void handleLoadChannelVideos()} disabled={busy || !canFetchChannel}>Load Main Feed</button>
                  <button type="button" className="secondary-button" onClick={() => void handleLoadCompareChannelVideos()} disabled={busy || !canFetchChannel || !compareChannelUrl.trim()}>Load Compare Feed</button>
                  <button type="button" className="secondary-button" onClick={() => void handleRunChannelDeepDive()} disabled={busy || selectedChannelVideos.length === 0 || !runtimeReady}>Run Deep Dive</button>
                  <button type="button" className="secondary-button" onClick={() => void handleRunChannelCompare()} disabled={busy || selectedChannelVideos.length === 0 || selectedCompareVideos.length === 0 || !compareChannelUrl.trim() || !runtimeReady}>Run Compare</button>
                  <button type="button" className="secondary-button" onClick={() => { setActiveView("studio"); setBatchInput(selectedChannelVideos.map((video) => video.url).join("\n")); setWorkspaceMode("batch"); showStatus("Moved To Batch Studio", "success"); }} disabled={selectedChannelVideos.length === 0}>Send To Batch</button>
                </div>
                <p className="channel-helper-note">Compare uses its own separately loaded competitor feed. Loading the main feed does not populate the compare side automatically.</p>
                <div className="section-header channel-selection-header">
                  <div>
                    <h3>Main Sample</h3>
                    <p>Select the videos that should power Deep Dive and the main side of Compare.</p>
                  </div>
                  <span className="meta-text">{selectedChannelVideos.length} Selected / {channelVideos.length} Loaded</span>
                </div>
                {channelVideos.length > 0 ? <div className="button-row channel-selection-actions">
                  <button type="button" className="secondary-button" onClick={handleSelectAllChannelVideos}>Select All</button>
                  <button type="button" className="secondary-button" onClick={() => handleSelectTopChannelVideos(5)}>Top 5</button>
                  <button type="button" className="secondary-button" onClick={() => handleSelectTopChannelVideos(10)}>Top 10</button>
                  <button type="button" className="secondary-button" onClick={handleClearChannelSelection}>Clear Selection</button>
                </div> : null}
                <div className="batch-list">
                  {channelVideos.length === 0 ? <p className="empty-copy">No Main Videos Loaded Yet.</p> : channelVideos.map((video) => {
                    const isSelected = selectedChannelVideoIdSet.has(video.videoId);
                    return (
                      <article key={video.videoId} className={`result-item channel-sample-item ${isSelected ? "is-selected" : "is-muted"}`}>
                        <div className="planner-head">
                          <label className="toggle-row selection-toggle">
                            <input type="checkbox" checked={isSelected} onChange={() => handleToggleChannelVideo(video.videoId)} />
                            <span>{isSelected ? "Included In Analysis" : "Excluded From Analysis"}</span>
                          </label>
                          <button type="button" className="secondary-button" onClick={() => { setActiveView("studio"); setWorkspaceMode("single"); setVideoTitle(video.title); setVideoUrl(video.url); showStatus("Video Loaded", "success"); }}>Open Brief</button>
                        </div>
                        <div>
                          <strong>{video.title}</strong>
                          <p>{video.url}</p>
                          <p>{[video.publishedLabel, video.viewLabel].filter(Boolean).join(" | ") || "Recent Channel Upload"}</p>
                        </div>
                      </article>
                    );
                  })}
                </div>
                <div className="section-header channel-selection-header">
                  <div>
                    <h3>Compare Sample</h3>
                    <p>Load competitor uploads, then choose the exact videos that should represent that side.</p>
                  </div>
                  <span className="meta-text">{selectedCompareVideos.length} Selected / {compareChannelVideos.length} Loaded</span>
                </div>
                {compareChannelVideos.length > 0 ? <div className="button-row channel-selection-actions">
                  <button type="button" className="secondary-button" onClick={handleSelectAllCompareVideos}>Select All</button>
                  <button type="button" className="secondary-button" onClick={() => handleSelectTopCompareVideos(5)}>Top 5</button>
                  <button type="button" className="secondary-button" onClick={() => handleSelectTopCompareVideos(10)}>Top 10</button>
                  <button type="button" className="secondary-button" onClick={handleClearCompareSelection}>Clear Selection</button>
                </div> : null}
                <div className="batch-list">
                  {compareChannelVideos.length === 0 ? <div className="empty-state-card"><strong>No Compare Videos Loaded Yet.</strong><p className="empty-copy">Paste a competitor channel URL above, then click <span className="empty-state-emphasis">Load Compare Feed</span>. Main feed selections stay separate so the compare side always reflects the competitor sample you choose.</p></div> : compareChannelVideos.map((video) => {
                    const isSelected = selectedCompareVideoIdSet.has(video.videoId);
                    return (
                      <article key={video.videoId} className={`result-item channel-sample-item ${isSelected ? "is-selected" : "is-muted"}`}>
                        <div className="planner-head">
                          <label className="toggle-row selection-toggle">
                            <input type="checkbox" checked={isSelected} onChange={() => handleToggleCompareVideo(video.videoId)} />
                            <span>{isSelected ? "Included In Compare" : "Excluded From Compare"}</span>
                          </label>
                          <button type="button" className="secondary-button" onClick={() => { setActiveView("studio"); setWorkspaceMode("single"); setVideoTitle(video.title); setVideoUrl(video.url); showStatus("Video Loaded", "success"); }}>Open Brief</button>
                        </div>
                        <div>
                          <strong>{video.title}</strong>
                          <p>{video.url}</p>
                          <p>{[video.publishedLabel, video.viewLabel].filter(Boolean).join(" | ") || "Recent Compare Upload"}</p>
                        </div>
                      </article>
                    );
                  })}
                </div>
                <div className="section-header channel-selection-header">
                  <div>
                    <h3>Sample Presets</h3>
                    <p>Save the current main and compare setup so you can reopen it later without rebuilding it manually.</p>
                  </div>
                  <span className="meta-text">{savedChannelPresets.length} Saved</span>
                </div>
                <div className="form-grid premium-grid">
                  <label className="field field-wide"><span>Preset Name</span><input value={channelPresetName} onChange={(event) => setChannelPresetName(event.target.value)} placeholder="Client audit preset, Gaming compare sample, Creator cohort..." /></label>
                </div>
                <div className="button-row">
                  <button type="button" className="secondary-button" onClick={handleSaveChannelPreset} disabled={channelVideos.length === 0 && compareChannelVideos.length === 0}>Save Preset</button>
                </div>
                <div className="saved-list">
                  {savedChannelPresets.length === 0 ? <p className="empty-copy">No Presets Saved Yet.</p> : savedChannelPresets.map((preset) => <article key={preset.id} className="saved-item"><button type="button" className="saved-open" onClick={() => handleLoadChannelPreset(preset)}><strong>{preset.name}</strong><span>{formatCreatedAt(preset.createdAt)} | {preset.selectedChannelVideoIds.length} main | {preset.selectedCompareVideoIds.length} compare</span></button><button type="button" className="link-button danger-button" onClick={() => setSavedChannelPresets((current) => current.filter((item) => item.id !== preset.id))}>Delete</button></article>)}
                </div>
              </div>
            ) : null
            }
          </section> : null}

          {activeView === "channel" && isProMode && workspaceMode === "channel" && channelCompare ? (
            <section className="simple-card">
              <div className="section-header">
                <div>
                  <h2>Channel Compare</h2>
                  <p>{channelCompare.primaryLabel} versus {channelCompare.competitorLabel} across packaging, topic breadth, and transcript intelligence.</p>
                </div>
                <span className="meta-text">{channelCompare.overlapThemes.length} Shared Themes | Avg Views {formatMetricCount(channelCompare.metrics.primaryAverageViews)} vs {formatMetricCount(channelCompare.metrics.competitorAverageViews)}</span>
              </div>
              <div className="result-tab-row">
                {(Object.keys(COMPARE_RESULT_TAB_LABELS) as CompareResultTab[]).map((tab) => (
                  <button key={tab} type="button" className={`mode-pill ${compareResultTab === tab ? "is-active" : ""}`} onClick={() => setCompareResultTab(tab)}>
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
                      </div>
                      <div className="chip-row">
                        {channelCompare.overlapThemes.length > 0 ? channelCompare.overlapThemes.map((theme) => <span key={theme} className="chip">{theme}</span>) : <span className="chip">Low Direct Topic Overlap</span>}
                      </div>
                    </article>
                    <article className="summary-block">
                      <h3>Scoreboard</h3>
                      <div className="compare-metric-list">
                        <div className="compare-metric-item"><strong>{channelCompare.primaryLabel}</strong><span>Sample {channelCompare.metrics.primarySampleSize} Videos</span><span>Avg Title Score {channelCompare.metrics.primaryAverageTitleScore}</span><span>Avg Visible Views {formatMetricCount(channelCompare.metrics.primaryAverageViews)}</span><span>Transcript Coverage {channelCompare.metrics.primaryTranscriptCoverage}%</span><span>Avg Transcript Words {channelCompare.metrics.primaryAverageTranscriptWords}</span></div>
                        <div className="compare-metric-item"><strong>{channelCompare.competitorLabel}</strong><span>Sample {channelCompare.metrics.competitorSampleSize} Videos</span><span>Avg Title Score {channelCompare.metrics.competitorAverageTitleScore}</span><span>Avg Visible Views {formatMetricCount(channelCompare.metrics.competitorAverageViews)}</span><span>Transcript Coverage {channelCompare.metrics.competitorTranscriptCoverage}%</span><span>Avg Transcript Words {channelCompare.metrics.competitorAverageTranscriptWords}</span></div>
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
                      <button type="button" className="secondary-button" onClick={() => void handleCopyChannelCompare()}>Copy Report</button>
                      <button type="button" className="secondary-button" onClick={() => void handleExportChannelCompare()}>Export Report</button>
                      <button type="button" className="secondary-button" onClick={() => void handleExportChannelComparePdf()}>Export PDF</button>
                    </div>
                    <textarea className="export-preview description-preview" value={channelCompare.exportDeck} readOnly />
                  </article>
                ) : null}
              </div>
            </section>
          ) : null}

          {activeView === "channel" && isProMode && workspaceMode === "channel" && channelDeepDive ? (
            <section className="simple-card">
              <div className="section-header">
                <div>
                  <h2>Deep Dive</h2>
                  <p>{channelDeepDive.channelLabel} decoded across SEO, style, content structure, and opportunity signals.</p>
                </div>
                <span className="meta-text">{channelDeepDive.analyzedVideos} Selected / {channelDeepDive.sourceVideoCount} Loaded | {channelDeepDive.transcriptCoverage}% Transcript Coverage | Avg Views {formatMetricCount(channelDeepDive.averageViewCount)}</span>
              </div>
              <div className="result-tab-row">
                {(Object.keys(CHANNEL_RESULT_TAB_LABELS) as ChannelResultTab[]).map((tab) => (
                  <button key={tab} type="button" className={`mode-pill ${channelResultTab === tab ? "is-active" : ""}`} onClick={() => setChannelResultTab(tab)}>
                    {CHANNEL_RESULT_TAB_LABELS[tab]}
                  </button>
                ))}
              </div>
              <div className="channel-dive-grid">
                {channelResultTab === "overview" ? (
                  <>
                    <article className="summary-block channel-hero-card">
                      <h3>Overview</h3>
                      <p>{channelDeepDive.overview}</p>
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
                      </div>
                      <div className="chip-row">
                        {channelDeepDive.topicClusters.map((cluster) => <span key={cluster} className="chip">{cluster}</span>)}
                      </div>
                    </article>
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

                {channelResultTab === "strategy" ? (
                  <>
                    <article className="summary-block">
                      <h3>Signature Moves</h3>
                      <ul className="plain-list">{channelDeepDive.signatureMoves.map((item) => <li key={item}>{item}</li>)}</ul>
                    </article>
                    <article className="summary-block">
                      <h3>SEO Audit</h3>
                      <ul className="plain-list">{channelDeepDive.seoAudit.map((item) => <li key={item}>{item}</li>)}</ul>
                    </article>
                    <article className="summary-block">
                      <h3>Description Signals</h3>
                      <ul className="plain-list">{channelDeepDive.descriptionSignals.map((item) => <li key={item}>{item}</li>)}</ul>
                    </article>
                    <article className="summary-block">
                      <h3>Title Templates</h3>
                      <ul className="plain-list">{channelDeepDive.titleTemplates.map((item) => <li key={item}>{item}</li>)}</ul>
                    </article>
                    <article className="summary-block">
                      <h3>Style DNA</h3>
                      <ul className="plain-list">{channelDeepDive.styleDNA.map((item) => <li key={item}>{item}</li>)}</ul>
                    </article>
                    <article className="summary-block">
                      <h3>Thumbnail Text Signals</h3>
                      <ul className="plain-list">{channelDeepDive.thumbnailTextSignals.map((item) => <li key={item}>{item}</li>)}</ul>
                    </article>
                    <article className="summary-block">
                      <h3>Content Architecture</h3>
                      <ul className="plain-list">{channelDeepDive.contentArchitecture.map((item) => <li key={item}>{item}</li>)}</ul>
                    </article>
                    <article className="summary-block">
                      <h3>Audience Positioning</h3>
                      <ul className="plain-list">{channelDeepDive.audiencePositioning.map((item) => <li key={item}>{item}</li>)}</ul>
                    </article>
                    <article className="summary-block">
                      <h3>Publishing System</h3>
                      <ul className="plain-list">{channelDeepDive.publishingSystem.map((item) => <li key={item}>{item}</li>)}</ul>
                    </article>
                    <article className="summary-block">
                      <h3>View Signals</h3>
                      <ul className="plain-list">{channelDeepDive.viewSignals.map((item) => <li key={item}>{item}</li>)}</ul>
                    </article>
                  </>
                ) : null}

                {channelResultTab === "opportunities" ? (
                  <>
                    <article className="summary-block">
                      <h3>Opportunities</h3>
                      <ul className="plain-list">{channelDeepDive.opportunityFinder.map((item) => <li key={item}>{item}</li>)}</ul>
                    </article>
                    <article className="summary-block">
                      <h3>Next Video Ideas</h3>
                      <ul className="plain-list">{channelDeepDive.nextVideoIdeas.map((item) => <li key={item}>{item}</li>)}</ul>
                    </article>
                    <article className="summary-block">
                      <h3>Clone Brief</h3>
                      <ul className="plain-list">{channelDeepDive.cloneBrief.map((item) => <li key={item}>{item}</li>)}</ul>
                    </article>
                    <article className="summary-block">
                      <h3>Takeover Sprint</h3>
                      <ul className="plain-list">{channelDeepDive.takeoverSprint.map((item) => <li key={item}>{item}</li>)}</ul>
                    </article>
                  </>
                ) : null}

                {channelResultTab === "deck" ? (
                  <article className="summary-block channel-export-card">
                    <div className="section-header">
                      <div>
                        <h3>Deep Dive Report</h3>
                        <p>A ready markdown report for strategy, onboarding, or client review.</p>
                      </div>
                      <span className="meta-text">Markdown</span>
                    </div>
                    <div className="button-row">
                      <button type="button" className="secondary-button" onClick={() => void handleCopyChannelDeepDive()}>Copy Report</button>
                      <button type="button" className="secondary-button" onClick={() => void handleExportChannelDeepDive()}>Export Report</button>
                      <button type="button" className="secondary-button" onClick={() => void handleExportChannelDeepDivePdf()}>Export PDF</button>
                    </div>
                    <textarea className="export-preview description-preview" value={channelDeepDive.exportDeck} readOnly />
                  </article>
                ) : null}

                {channelResultTab === "breakdown" ? (
                  <article className="summary-block channel-breakdown-card">
                    <div className="section-header">
                      <div>
                        <h3>Video Breakdown</h3>
                        <p>Per-video read for titles, theme, transcript coverage, and repeatable patterns.</p>
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
                              <span className="chip">{video.transcriptAvailable ? `${video.transcriptWordCount} Words` : "No Transcript"}</span>
                              <span className="chip">{video.descriptionAvailable ? "Description Ready" : "No Description"}</span>
                              {video.thumbnailText ? <span className="chip">Thumb OCR</span> : null}
                            </div>
                            <button type="button" className="timestamp-button" onClick={() => { setActiveView("studio"); setWorkspaceMode("single"); setVideoTitle(video.title); setVideoUrl(video.url); showStatus("Video Loaded", "success"); }}>
                            Open Brief
                            </button>
                          </div>
                          <strong>{video.title}</strong>
                          <p>{video.summary}</p>
                          {video.thumbnailText ? <p>Thumbnail text: {video.thumbnailText}</p> : null}
                          <div className="planner-foot">
                            <span>{video.publishedLabel || "Recent Upload"}</span>
                            <span>{video.viewLabel || "View Count Unavailable"}</span>
                          </div>
                        </article>
                      ))}
                    </div>
                  </article>
                ) : null}
              </div>
            </section>
          ) : null}

          {activeView === "studio" ? <div className="insight-stack">
            <section className="simple-card">
              <div className="section-header"><div><h2>Insight Studio</h2></div><div className="pill-row insight-tab-row">{visibleInsightTabs.map((tab) => <button key={tab} type="button" className={`mode-pill insight-tab-pill ${insightTab === tab ? "is-active" : ""}`} onClick={() => setInsightTab(tab)}>{INSIGHT_TAB_LABELS[tab]}</button>)}</div></div>
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
                  <div className="summary-block"><h3>Chapters</h3><div className="chapter-simple-list">{analysis.summary.chapters.map((chapter) => <article key={`${chapter.timeLabel}-${chapter.title}`} className="chapter-simple-item"><button type="button" className="timestamp-button" onClick={() => void handleOpenTimestamp(chapter.seconds)}>{chapter.timeLabel}</button><div><div className="chapter-title">{chapter.title}</div><p>{chapter.summary}</p></div></article>)}</div></div>
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
                        <input type="range" min="8" max="24" step="2" value={proClipScoreFloor} onChange={(event) => setProClipScoreFloor(Number(event.target.value))} />
                      </label>
                      <label className="field">
                        <span>Planner Channel</span>
                        <select value={plannerChannelFilter} onChange={(event) => setPlannerChannelFilter(event.target.value)}>
                          {plannerChannelOptions.map((option) => <option key={option} value={option}>{option === "all" ? "All Channels" : option}</option>)}
                        </select>
                      </label>
                    </div>
                    <div className="chip-row">
                      {[12, 14, 16, 18].map((score) => (
                        <button key={score} type="button" className={`chip-action ${proClipScoreFloor === score ? "is-active" : ""}`} onClick={() => setProClipScoreFloor(score)}>
                          Score {score}+
                        </button>
                      ))}
                      {plannerChannelFilter !== "all" ? <button type="button" className="chip-action" onClick={() => setPlannerChannelFilter("all")}>Show All Channels</button> : null}
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
                            <button type="button" className="timestamp-button" onClick={() => void handleOpenTimestamp(moment.seconds)}>
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
                            <button type="button" className="timestamp-button" onClick={() => void handleOpenTimestamp(entry.seconds ?? analysis.summary.chapters.find((chapter) => chapter.timeLabel === entry.timeLabel)?.seconds ?? null)}>
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
                      <input value={timestampSearch} onChange={(event) => setTimestampSearch(event.target.value)} placeholder="Search promise, filler, review, retention, hook..." />
                    </label>
                    <div className="chip-row search-chip-row">
                      {analysis.summary.keywords.slice(0, 5).map((keyword) => (
                        <button key={keyword} type="button" className={`chip-action ${timestampSearch.trim().toLowerCase() === keyword.toLowerCase() ? "is-active" : ""}`} onClick={() => setTimestampSearch(keyword)}>
                          {keyword}
                        </button>
                      ))}
                      {timestampSearch.trim() ? <button type="button" className="chip-action" onClick={() => setTimestampSearch("")}>Clear Search</button> : null}
                    </div>
                    <div className="timestamp-search-list">
                      {timestampSearch.trim() ? (
                        timestampMatches.length > 0 ? timestampMatches.map((match) => (
                          <article key={`${match.timeLabel}-${match.text}`} className="timestamp-search-item">
                            <button type="button" className="timestamp-button" onClick={() => void handleOpenTimestamp(match.seconds)}>
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
                          <button type="button" className="timestamp-button" onClick={() => void handleOpenTimestamp(chapter.seconds)}>
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
                        <button key={format} type="button" className={`chip-action ${copyFormat === format ? "is-active" : ""}`} onClick={() => handleProQuickExport(format)}>
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
                <div className="chat-grid"><article className="summary-block"><h3>Ask The Transcript</h3><textarea className="chat-question" value={question} onChange={(event) => setQuestion(event.target.value)} placeholder="What Is The Core Strategy? What Tools Were Mentioned?" /><div className="button-row"><button type="button" className="primary-button" onClick={() => { setAnswer(buildQuestionAnswer(question, analysis)); showStatus("Answered", "success"); }}>Ask Transcript</button></div></article><article className="summary-block"><h3>Answer</h3><pre className="chat-answer">{answer || "Answers Will Appear Here."}</pre></article></div>
              )}
            </section>
          </div> : null}

          {activeView === "library" ? <section className="simple-card">
            <div className="section-header"><div><h2>Library</h2></div><span className="meta-text">{visibleLibraryItemCount} Items Shown</span></div>
            <label className="field"><span>Search History</span><input value={historySearch} onChange={(event) => setHistorySearch(event.target.value)} placeholder={librarySearchPlaceholder} /></label>
            <div className="saved-library-section">
              <div className="section-header">
                <div>
                  <h3>Saved Briefs</h3>
                  <p>Single-video transcript work you saved earlier.</p>
                </div>
                <span className="meta-text">{filteredBriefs.length} Shown</span>
              </div>
              {filteredBriefs.length === 0 ? <p className="empty-copy">No Matching Saved Briefs Yet.</p> : <div className="saved-list">{filteredBriefs.map((brief) => <article key={brief.id} className={`saved-item ${activeBriefId === brief.id ? "is-active" : ""}`}><button type="button" className="saved-open" onClick={() => { setActiveView("studio"); setWorkspaceMode("single"); setVideoTitle(brief.title); setVideoUrl(brief.url); setTranscript(brief.transcript); setAnalysis(brief.analysis); setSummaryStyle(brief.summaryStyle); setAudiencePreset(brief.audiencePreset); setOutputLanguage(brief.outputLanguage); setActiveBriefId(brief.id); showStatus("Brief Loaded", "success"); }}><strong>{brief.title}</strong><span>{formatCreatedAt(brief.createdAt)}</span></button><button type="button" className="link-button danger-button" onClick={() => setBriefs((current) => current.filter((item) => item.id !== brief.id))}>Delete</button></article>)}</div>}
            </div>
            {isProMode ? <div className="saved-library-section">
              <div className="section-header">
                <div>
                  <h3>Channel Reports</h3>
                  <p>Reload saved Deep Dives and competitor compares without rerunning fetches.</p>
                </div>
                <span className="meta-text">{filteredChannelReports.length} Shown</span>
              </div>
              {filteredChannelReports.length === 0 ? <p className="empty-copy">No Matching Reports Yet.</p> : <div className="saved-list">{filteredChannelReports.map((report) => <article key={report.id} className="saved-item"><button type="button" className="saved-open" onClick={() => handleLoadSavedChannelReport(report)}><strong>{report.title}</strong><span>{buildSavedReportMeta(report)}</span></button><button type="button" className="link-button danger-button" onClick={() => setSavedChannelReports((current) => current.filter((item) => item.id !== report.id))}>Delete</button></article>)}</div>}
            </div> : null}
            {isProMode ? <div className="saved-library-section">
              <div className="section-header">
                <div>
                  <h3>Sample Presets</h3>
                  <p>Reusable main and compare video selections for recurring audits and client work.</p>
                </div>
                <span className="meta-text">{filteredChannelPresets.length} Shown</span>
              </div>
              {filteredChannelPresets.length === 0 ? <p className="empty-copy">No Matching Presets Yet.</p> : <div className="saved-list">{filteredChannelPresets.map((preset) => <article key={preset.id} className="saved-item"><button type="button" className="saved-open" onClick={() => handleLoadChannelPreset(preset)}><strong>{preset.name}</strong><span>{formatCreatedAt(preset.createdAt)} | {preset.selectedChannelVideoIds.length} main | {preset.selectedCompareVideoIds.length} compare</span></button><button type="button" className="link-button danger-button" onClick={() => setSavedChannelPresets((current) => current.filter((item) => item.id !== preset.id))}>Delete</button></article>)}</div>}
            </div> : null}
          </section> : null}
        </section>
      </div>
    </main>
  );
}
