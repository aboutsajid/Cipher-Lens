import { type ReactNode, useEffect, useState, useTransition } from "react";
import "./App.css";
import { AppErrorBoundary } from "./app/AppErrorBoundary";
import {
  APP_VIEW_DESCRIPTIONS,
  type AppView,
  type ExperienceMode,
} from "./app/navigation";
import { ChannelCommandWorkspace } from "./features/channel-lab/ChannelCommandWorkspace";
import { ComparePage } from "./features/compare/ComparePage";
import { StudioAnalyticsPage } from "./features/analytics/StudioAnalyticsPage";
import { ExportsPage } from "./features/exports/ExportsPage";
import { useChannelLabState } from "./features/channel-lab/useChannelLabState";
import { HomeDashboard } from "./features/home/HomeDashboard";
import { LibraryPage } from "./features/library/LibraryPage";
import { SettingsPage } from "./features/settings/SettingsPage";
import { useLibraryCollections } from "./features/library/useLibraryCollections";
import { ProjectsPage } from "./features/projects/ProjectsPage";
import { useProjectStore } from "./features/projects/useProjectStore";
import { useChannelLabSelections } from "./features/channel-lab/useChannelLabSelections";
import { VideoIntelInsights } from "./features/video-intel/VideoIntelInsights";
import { VideoIntelWorkspace } from "./features/video-intel/VideoIntelWorkspace";
import {
  AUDIENCE_OPTIONS,
  CLEANER_DEFAULTS,
  COPY_FORMAT_OPTIONS,
  OUTPUT_LANGUAGE_OPTIONS,
  SAMPLE_TITLE,
  SAMPLE_TRANSCRIPT,
  SAMPLE_URL,
  SUMMARY_STYLE_OPTIONS,
  buildAnalysis,
  buildChannelCompare,
  buildChannelDeepDive,
  buildCloneChannel,
  buildExportContent,
  buildQuestionAnswer,
  buildTimestampSearchMatches,
  convertSubtitleContent,
  cleanTranscriptInput,
  getWordCount,
  type AnalysisBundle,
  type AudiencePreset,
  type CloneChannelStage,
  type CloneGoal,
  type ClonePresentationStyle,
  type CloneChannelBundle,
  type ChannelDeepDiveBundle,
  type ChannelCompareBundle,
  type ChannelNicheModelBundle,
  type CleanerSettings,
  type CopyFormat,
  type ExportFormat,
  type OutputLanguage,
  type SummaryStyle,
} from "./premium";
import {
  mergeStudioCsvIntoVideos,
  type StudioImportSummary,
  type StudioVideoMetrics,
} from "./youtube-studio";

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
type InsightTab = "summary" | "insights" | "exports" | "chat";
type ViSection = "input" | InsightTab;
type LibrarySection = "overview" | "projects" | "briefs" | "presets" | "reports";
type ProjectsSection = "all" | "workspaces" | "briefs" | "reports" | "presets";
type AnalyticsSection = "overview" | "main" | "compare" | "benchmark";
type CompareSection = "overview" | "winners" | "adapt" | "niche" | "deck";
type ChannelResultTab = "overview" | "dna" | "winning" | "titles" | "thumbnails" | "hooks" | "audience" | "monetization" | "adapt" | "action";
type CompareResultTab = "summary" | "winners" | "adapt" | "niche" | "deck";
type AnalyzePanelSection = "overview" | "seo" | "style" | "opportunities" | "clone" | "scorecard";
type ModeMetric = { label: string; value: string; note: string };
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
  myChannelUrl: string;
  compareChannelUrl: string;
  benchmarkChannelUrl: string;
  channelSampleSize: number;
  compareSampleSize: number;
  benchmarkSampleSize: number;
  cloneNiche: string;
  cloneStage: CloneChannelStage;
  clonePresentationStyle: ClonePresentationStyle;
  cloneGoal: CloneGoal;
  channelVideos: ChannelVideo[];
  selectedChannelVideoIds: string[];
  compareChannelVideos: ChannelVideo[];
  selectedCompareVideoIds: string[];
  benchmarkChannelVideos: ChannelVideo[];
  selectedBenchmarkVideoIds: string[];
  deepDive: ChannelDeepDiveBundle | null;
  clone: CloneChannelBundle | null;
  compare: ChannelCompareBundle | null;
};
type SavedChannelPreset = {
  id: string;
  name: string;
  createdAt: string;
  channelUrl: string;
  myChannelUrl: string;
  compareChannelUrl: string;
  benchmarkChannelUrl: string;
  channelSampleSize: number;
  compareSampleSize: number;
  benchmarkSampleSize: number;
  cloneNiche: string;
  cloneStage: CloneChannelStage;
  clonePresentationStyle: ClonePresentationStyle;
  cloneGoal: CloneGoal;
  channelVideos: ChannelVideo[];
  selectedChannelVideoIds: string[];
  compareChannelVideos: ChannelVideo[];
  selectedCompareVideoIds: string[];
  benchmarkChannelVideos: ChannelVideo[];
  selectedBenchmarkVideoIds: string[];
};
type SavedWorkspaceProject = {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  activeView: AppView;
  experienceMode: ExperienceMode;
  workspaceMode: WorkspaceMode;
  insightTab: InsightTab;
  channelResultTab: ChannelResultTab;
  compareResultTab: CompareResultTab;
  videoTitle: string;
  videoUrl: string;
  transcriptLanguage: string;
  transcript: string;
  summaryStyle: SummaryStyle;
  audiencePreset: AudiencePreset;
  outputLanguage: OutputLanguage;
  copyFormat: CopyFormat;
  exportFormat: ExportFormat;
  cleaner: CleanerSettings;
  analysis: AnalysisBundle;
  activeBriefId: string | null;
  transcriptSource: TranscriptSource | null;
  batchInput: string;
  batchResults: BatchResult[];
  channelUrl: string;
  myChannelUrl: string;
  compareChannelUrl: string;
  benchmarkChannelUrl: string;
  channelSampleSize: number;
  compareSampleSize: number;
  benchmarkSampleSize: number;
  cloneNiche: string;
  cloneStage: CloneChannelStage;
  clonePresentationStyle: ClonePresentationStyle;
  cloneGoal: CloneGoal;
  channelVideos: ChannelVideo[];
  selectedChannelVideoIds: string[];
  compareChannelVideos: ChannelVideo[];
  selectedCompareVideoIds: string[];
  benchmarkChannelVideos: ChannelVideo[];
  selectedBenchmarkVideoIds: string[];
  mainStudioImport: StudioImportSummary | null;
  compareStudioImport: StudioImportSummary | null;
  benchmarkStudioImport: StudioImportSummary | null;
  channelDeepDive: ChannelDeepDiveBundle | null;
  cloneChannel: CloneChannelBundle | null;
  channelCompare: ChannelCompareBundle | null;
  myChannelDeepDive: ChannelDeepDiveBundle | null;
  myChannelVideos: ChannelVideo[];
  channelPresetName: string;
  historySearch: string;
  commandSearch: string;
  question: string;
  answer: string;
  timestampSearch: string;
  proClipScoreFloor: number;
  plannerChannelFilter: string;
  statusState: StatusState;
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
  commentCountLabel?: string;
  topComments?: Array<{
    author: string;
    text: string;
    likeCount: string;
    publishedLabel: string;
  }>;
  studioMetrics?: StudioVideoMetrics;
};
const WORKSPACE_MODE_LABELS: Record<WorkspaceMode, string> = {
  single: "Single",
  batch: "Batch",
  channel: "Channel",
};
const INSIGHT_TAB_LABELS: Record<InsightTab, string> = {
  summary: "Summary",
  insights: "Insights",
  exports: "Exports",
  chat: "Chat",
};
const READY_STATUS: StatusState = { message: "Ready", tone: "ready" };
const BASIC_INSIGHT_TABS: InsightTab[] = ["summary", "exports"];
const PRO_INSIGHT_TABS: InsightTab[] = ["summary", "insights", "exports", "chat"];
const BASIC_COPY_FORMATS = new Set<CopyFormat>(["brief", "description", "youtube", "meeting"]);
const CHANNEL_SAMPLE_SIZE_OPTIONS = [5, 8, 10, 12, 15, 20] as const;
const CLONE_STAGE_OPTIONS: CloneChannelStage[] = ["new", "small", "growing", "established"];
const CLONE_PRESENTATION_OPTIONS: ClonePresentationStyle[] = ["faceless", "on-camera"];
const CLONE_GOAL_OPTIONS: CloneGoal[] = ["views", "subs", "authority", "sales"];
const ANALYZE_SECTIONS: Array<{
  id: AnalyzePanelSection;
  label: string;
  group: "analysis" | "outputs";
}> = [
  { id: "overview", label: "Overview", group: "analysis" },
  { id: "seo", label: "SEO Audit", group: "analysis" },
  { id: "style", label: "Style DNA", group: "analysis" },
  { id: "opportunities", label: "Opportunities", group: "analysis" },
  { id: "clone", label: "Clone Brief", group: "outputs" },
  { id: "scorecard", label: "Scorecard", group: "outputs" },
];
const ANALYZE_SECTION_DESCRIPTIONS: Record<AnalyzePanelSection, string> = {
  overview: "Load a target channel, shape the sample, and review the high-level clone thesis in one place.",
  seo: "Inspect titles, search signals, and packaging patterns that the channel uses to win discovery.",
  style: "Break down promise, tone, content pillars, and repeatable format choices into a reusable DNA.",
  opportunities: "Surface the gaps, easiest lifts, and next-video moves worth testing first.",
  clone: "Turn the channel read into an action-ready brief with borrow, adapt, and rollout steps.",
  scorecard: "Review the category scores that show what is strong, weak, and worth differentiating.",
};
const TOOL_BREADCRUMB_LABELS: Record<AppView, string> = {
  home: "Cipher Command Center",
  studio: "Video Intel",
  channel: "Channel Clone",
  compare: "Compare",
  analytics: "Studio Analytics",
  projects: "Projects",
  library: "Library",
  exports: "Export",
  settings: "Settings",
};

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

function formatPercentageValue(value: number | null | undefined): string {
  if (value === null || value === undefined || !Number.isFinite(value)) return "n/a";
  return `${value.toFixed(value >= 10 ? 0 : 1)}%`;
}

function formatCloneContextMeta(niche: string, stage: CloneChannelStage, presentation: ClonePresentationStyle, goal: CloneGoal): string {
  const parts = [
    niche.trim() ? niche.trim() : "General niche",
    stage,
    presentation === "on-camera" ? "on-camera" : "faceless",
    goal,
  ];
  return parts.join(" | ");
}

function compareSectionToResultTab(section: CompareSection): CompareResultTab {
  return section === "overview" ? "summary" : section;
}

function compareResultTabToSection(tab: CompareResultTab): CompareSection {
  return tab === "summary" ? "overview" : tab;
}

function normalizeSavedChannelCompare(value: unknown): ChannelCompareBundle | null {
  if (!value || typeof value !== "object") return null;
  const compare = value as Partial<ChannelCompareBundle> & { adaptToMe?: Partial<ChannelCompareBundle["adaptToMe"]> };
  const nicheModel = compare.nicheModel && typeof compare.nicheModel === "object"
    ? compare.nicheModel as Partial<ChannelNicheModelBundle>
    : null;
  return {
    primaryLabel: typeof compare.primaryLabel === "string" ? compare.primaryLabel : "Primary Channel",
    competitorLabel: typeof compare.competitorLabel === "string" ? compare.competitorLabel : "Compare Channel",
    overview: typeof compare.overview === "string" ? compare.overview : "",
    overlapThemes: Array.isArray(compare.overlapThemes) ? compare.overlapThemes.filter((item): item is string => typeof item === "string") : [],
    decisions: Array.isArray(compare.decisions) ? compare.decisions.filter((item): item is ChannelCompareBundle["decisions"][number] => Boolean(item && typeof item === "object")) : [],
    recommendations: Array.isArray(compare.recommendations) ? compare.recommendations.filter((item): item is string => typeof item === "string") : [],
    whitespaceOpportunities: Array.isArray(compare.whitespaceOpportunities) ? compare.whitespaceOpportunities.filter((item): item is string => typeof item === "string") : [],
    adaptToMe: {
      overview: typeof compare.adaptToMe?.overview === "string" ? compare.adaptToMe.overview : "Reload this compare to generate the latest Adapt To Me plan.",
      strengthsToKeep: Array.isArray(compare.adaptToMe?.strengthsToKeep) ? compare.adaptToMe.strengthsToKeep.filter((item): item is string => typeof item === "string") : [],
      closeGaps: Array.isArray(compare.adaptToMe?.closeGaps) ? compare.adaptToMe.closeGaps.filter((item): item is string => typeof item === "string") : [],
      borrowFirst: Array.isArray(compare.adaptToMe?.borrowFirst) ? compare.adaptToMe.borrowFirst.filter((item): item is string => typeof item === "string") : [],
      experiments: Array.isArray(compare.adaptToMe?.experiments) ? compare.adaptToMe.experiments.filter((item): item is string => typeof item === "string") : [],
      cautions: Array.isArray(compare.adaptToMe?.cautions) ? compare.adaptToMe.cautions.filter((item): item is string => typeof item === "string") : [],
    },
    nicheModel: nicheModel ? {
      comparedChannels: Array.isArray(nicheModel.comparedChannels) ? nicheModel.comparedChannels.filter((item): item is string => typeof item === "string") : [],
      overview: typeof nicheModel.overview === "string" ? nicheModel.overview : "Reload this compare to generate the latest niche model.",
      sharedThemes: Array.isArray(nicheModel.sharedThemes) ? nicheModel.sharedThemes.filter((item): item is string => typeof item === "string") : [],
      sharedFormats: Array.isArray(nicheModel.sharedFormats) ? nicheModel.sharedFormats.filter((item): item is string => typeof item === "string") : [],
      sharedHooks: Array.isArray(nicheModel.sharedHooks) ? nicheModel.sharedHooks.filter((item): item is string => typeof item === "string") : [],
      sharedThumbnailPhrases: Array.isArray(nicheModel.sharedThumbnailPhrases) ? nicheModel.sharedThumbnailPhrases.filter((item): item is string => typeof item === "string") : [],
      growthSystem: Array.isArray(nicheModel.growthSystem) ? nicheModel.growthSystem.filter((item): item is string => typeof item === "string") : [],
      packagingRules: Array.isArray(nicheModel.packagingRules) ? nicheModel.packagingRules.filter((item): item is string => typeof item === "string") : [],
      contentSystem: Array.isArray(nicheModel.contentSystem) ? nicheModel.contentSystem.filter((item): item is string => typeof item === "string") : [],
      audienceAngles: Array.isArray(nicheModel.audienceAngles) ? nicheModel.audienceAngles.filter((item): item is string => typeof item === "string") : [],
      momentumSignals: Array.isArray(nicheModel.momentumSignals) ? nicheModel.momentumSignals.filter((item): item is string => typeof item === "string") : [],
      whitespaceAngles: Array.isArray(nicheModel.whitespaceAngles) ? nicheModel.whitespaceAngles.filter((item): item is string => typeof item === "string") : [],
      experiments: Array.isArray(nicheModel.experiments) ? nicheModel.experiments.filter((item): item is string => typeof item === "string") : [],
      cautions: Array.isArray(nicheModel.cautions) ? nicheModel.cautions.filter((item): item is string => typeof item === "string") : [],
      channelSnapshots: Array.isArray(nicheModel.channelSnapshots)
        ? nicheModel.channelSnapshots.filter((item): item is ChannelNicheModelBundle["channelSnapshots"][number] => Boolean(item && typeof item === "object"))
        : [],
      exportDeck: typeof nicheModel.exportDeck === "string" ? nicheModel.exportDeck : "",
    } : null,
    metrics: {
      primarySampleSize: typeof compare.metrics?.primarySampleSize === "number" ? compare.metrics.primarySampleSize : 0,
      competitorSampleSize: typeof compare.metrics?.competitorSampleSize === "number" ? compare.metrics.competitorSampleSize : 0,
      primaryAverageTitleScore: typeof compare.metrics?.primaryAverageTitleScore === "number" ? compare.metrics.primaryAverageTitleScore : 0,
      competitorAverageTitleScore: typeof compare.metrics?.competitorAverageTitleScore === "number" ? compare.metrics.competitorAverageTitleScore : 0,
      primaryAverageViews: typeof compare.metrics?.primaryAverageViews === "number" ? compare.metrics.primaryAverageViews : 0,
      competitorAverageViews: typeof compare.metrics?.competitorAverageViews === "number" ? compare.metrics.competitorAverageViews : 0,
      primaryStudioCoverage: typeof compare.metrics?.primaryStudioCoverage === "number" ? compare.metrics.primaryStudioCoverage : 0,
      competitorStudioCoverage: typeof compare.metrics?.competitorStudioCoverage === "number" ? compare.metrics.competitorStudioCoverage : 0,
      primaryAverageImpressions: typeof compare.metrics?.primaryAverageImpressions === "number" ? compare.metrics.primaryAverageImpressions : 0,
      competitorAverageImpressions: typeof compare.metrics?.competitorAverageImpressions === "number" ? compare.metrics.competitorAverageImpressions : 0,
      primaryAverageCtr: typeof compare.metrics?.primaryAverageCtr === "number" ? compare.metrics.primaryAverageCtr : 0,
      competitorAverageCtr: typeof compare.metrics?.competitorAverageCtr === "number" ? compare.metrics.competitorAverageCtr : 0,
      primaryAverageRetention: typeof compare.metrics?.primaryAverageRetention === "number" ? compare.metrics.primaryAverageRetention : 0,
      competitorAverageRetention: typeof compare.metrics?.competitorAverageRetention === "number" ? compare.metrics.competitorAverageRetention : 0,
      primaryAverageViewDurationSeconds: typeof compare.metrics?.primaryAverageViewDurationSeconds === "number" ? compare.metrics.primaryAverageViewDurationSeconds : 0,
      competitorAverageViewDurationSeconds: typeof compare.metrics?.competitorAverageViewDurationSeconds === "number" ? compare.metrics.competitorAverageViewDurationSeconds : 0,
      primaryTranscriptCoverage: typeof compare.metrics?.primaryTranscriptCoverage === "number" ? compare.metrics.primaryTranscriptCoverage : 0,
      competitorTranscriptCoverage: typeof compare.metrics?.competitorTranscriptCoverage === "number" ? compare.metrics.competitorTranscriptCoverage : 0,
      primaryAverageTranscriptWords: typeof compare.metrics?.primaryAverageTranscriptWords === "number" ? compare.metrics.primaryAverageTranscriptWords : 0,
      competitorAverageTranscriptWords: typeof compare.metrics?.competitorAverageTranscriptWords === "number" ? compare.metrics.competitorAverageTranscriptWords : 0,
    },
    exportDeck: typeof compare.exportDeck === "string" ? compare.exportDeck : "",
  };
}

function normalizeSavedCloneChannel(value: unknown): CloneChannelBundle | null {
  if (!value || typeof value !== "object") return null;
  const clone = value as Partial<CloneChannelBundle>;
  return {
    targetLabel: typeof clone.targetLabel === "string" ? clone.targetLabel : "Target Channel",
    targetUrl: typeof clone.targetUrl === "string" ? clone.targetUrl : "",
    myChannelLabel: typeof clone.myChannelLabel === "string" ? clone.myChannelLabel : null,
    overview: typeof clone.overview === "string" ? clone.overview : "",
    scores: Array.isArray(clone.scores) ? clone.scores.filter((item): item is CloneChannelBundle["scores"][number] => Boolean(item && typeof item === "object")) : [],
    topLessons: Array.isArray(clone.topLessons) ? clone.topLessons.filter((item): item is string => typeof item === "string") : [],
    topRisks: Array.isArray(clone.topRisks) ? clone.topRisks.filter((item): item is string => typeof item === "string") : [],
    dna: clone.dna && typeof clone.dna === "object"
      ? {
        audience: Array.isArray(clone.dna.audience) ? clone.dna.audience.filter((item): item is string => typeof item === "string") : [],
        promise: typeof clone.dna.promise === "string" ? clone.dna.promise : "",
        pillars: Array.isArray(clone.dna.pillars) ? clone.dna.pillars.filter((item): item is string => typeof item === "string") : [],
        formats: Array.isArray(clone.dna.formats) ? clone.dna.formats.filter((item): item is string => typeof item === "string") : [],
        tone: Array.isArray(clone.dna.tone) ? clone.dna.tone.filter((item): item is string => typeof item === "string") : [],
        creatorEdge: Array.isArray(clone.dna.creatorEdge) ? clone.dna.creatorEdge.filter((item): item is string => typeof item === "string") : [],
      }
      : { audience: [], promise: "", pillars: [], formats: [], tone: [], creatorEdge: [] },
    winningVideos: clone.winningVideos && typeof clone.winningVideos === "object"
      ? {
        topPerformer: clone.winningVideos.topPerformer && typeof clone.winningVideos.topPerformer === "object" ? clone.winningVideos.topPerformer : null,
        winners: Array.isArray(clone.winningVideos.winners) ? clone.winningVideos.winners.filter((item): item is CloneChannelBundle["winningVideos"]["winners"][number] => Boolean(item && typeof item === "object")) : [],
        underperformers: Array.isArray(clone.winningVideos.underperformers) ? clone.winningVideos.underperformers.filter((item): item is CloneChannelBundle["winningVideos"]["underperformers"][number] => Boolean(item && typeof item === "object")) : [],
        winnerVsBaseline: Array.isArray(clone.winningVideos.winnerVsBaseline) ? clone.winningVideos.winnerVsBaseline.filter((item): item is string => typeof item === "string") : [],
        stealTheseStructures: Array.isArray(clone.winningVideos.stealTheseStructures) ? clone.winningVideos.stealTheseStructures.filter((item): item is string => typeof item === "string") : [],
      }
      : { topPerformer: null, winners: [], underperformers: [], winnerVsBaseline: [], stealTheseStructures: [] },
    titleIntel: clone.titleIntel && typeof clone.titleIntel === "object"
      ? {
        formulaMix: Array.isArray(clone.titleIntel.formulaMix) ? clone.titleIntel.formulaMix.filter((item): item is string => typeof item === "string") : [],
        triggerWords: Array.isArray(clone.titleIntel.triggerWords) ? clone.titleIntel.triggerWords.filter((item): item is string => typeof item === "string") : [],
        clarityVsCuriosity: Array.isArray(clone.titleIntel.clarityVsCuriosity) ? clone.titleIntel.clarityVsCuriosity.filter((item): item is string => typeof item === "string") : [],
        templates: Array.isArray(clone.titleIntel.templates) ? clone.titleIntel.templates.filter((item): item is string => typeof item === "string") : [],
        avoidPatterns: Array.isArray(clone.titleIntel.avoidPatterns) ? clone.titleIntel.avoidPatterns.filter((item): item is string => typeof item === "string") : [],
      }
      : { formulaMix: [], triggerWords: [], clarityVsCuriosity: [], templates: [], avoidPatterns: [] },
    thumbnailIntel: clone.thumbnailIntel && typeof clone.thumbnailIntel === "object"
      ? {
        summary: typeof clone.thumbnailIntel.summary === "string" ? clone.thumbnailIntel.summary : "",
        textSignals: Array.isArray(clone.thumbnailIntel.textSignals) ? clone.thumbnailIntel.textSignals.filter((item): item is string => typeof item === "string") : [],
        playbook: Array.isArray(clone.thumbnailIntel.playbook) ? clone.thumbnailIntel.playbook.filter((item): item is string => typeof item === "string") : [],
        board: clone.thumbnailIntel.board && typeof clone.thumbnailIntel.board === "object"
          ? {
            summary: typeof clone.thumbnailIntel.board.summary === "string" ? clone.thumbnailIntel.board.summary : "",
            densityNotes: Array.isArray(clone.thumbnailIntel.board.densityNotes) ? clone.thumbnailIntel.board.densityNotes.filter((item): item is string => typeof item === "string") : [],
            messagingNotes: Array.isArray(clone.thumbnailIntel.board.messagingNotes) ? clone.thumbnailIntel.board.messagingNotes.filter((item): item is string => typeof item === "string") : [],
            repeatedPhrases: Array.isArray(clone.thumbnailIntel.board.repeatedPhrases) ? clone.thumbnailIntel.board.repeatedPhrases.filter((item): item is string => typeof item === "string") : [],
            rules: Array.isArray(clone.thumbnailIntel.board.rules) ? clone.thumbnailIntel.board.rules.filter((item): item is string => typeof item === "string") : [],
            examples: Array.isArray(clone.thumbnailIntel.board.examples) ? clone.thumbnailIntel.board.examples.filter((item): item is { title: string; thumbnailText: string } => Boolean(item && typeof item === "object")) : [],
          }
          : { summary: "", densityNotes: [], messagingNotes: [], repeatedPhrases: [], rules: [], examples: [] },
      }
      : { summary: "", textSignals: [], playbook: [], board: { summary: "", densityNotes: [], messagingNotes: [], repeatedPhrases: [], rules: [], examples: [] } },
    hookIntel: clone.hookIntel && typeof clone.hookIntel === "object"
      ? {
        dominantStyles: Array.isArray(clone.hookIntel.dominantStyles) ? clone.hookIntel.dominantStyles.filter((item): item is string => typeof item === "string") : [],
        distribution: Array.isArray(clone.hookIntel.distribution) ? clone.hookIntel.distribution.filter((item): item is string => typeof item === "string") : [],
        retentionNotes: Array.isArray(clone.hookIntel.retentionNotes) ? clone.hookIntel.retentionNotes.filter((item): item is string => typeof item === "string") : [],
        templates: Array.isArray(clone.hookIntel.templates) ? clone.hookIntel.templates.filter((item): item is string => typeof item === "string") : [],
      }
      : { dominantStyles: [], distribution: [], retentionNotes: [], templates: [] },
    audienceIntel: clone.audienceIntel && typeof clone.audienceIntel === "object"
      ? {
        positioning: Array.isArray(clone.audienceIntel.positioning) ? clone.audienceIntel.positioning.filter((item): item is string => typeof item === "string") : [],
        valueDrivers: Array.isArray(clone.audienceIntel.valueDrivers) ? clone.audienceIntel.valueDrivers.filter((item): item is string => typeof item === "string") : [],
        praise: Array.isArray(clone.audienceIntel.praise) ? clone.audienceIntel.praise.filter((item): item is string => typeof item === "string") : [],
        requests: Array.isArray(clone.audienceIntel.requests) ? clone.audienceIntel.requests.filter((item): item is string => typeof item === "string") : [],
        confusion: Array.isArray(clone.audienceIntel.confusion) ? clone.audienceIntel.confusion.filter((item): item is string => typeof item === "string") : [],
        highSignalComments: Array.isArray(clone.audienceIntel.highSignalComments) ? clone.audienceIntel.highSignalComments.filter((item): item is string => typeof item === "string") : [],
      }
      : { positioning: [], valueDrivers: [], praise: [], requests: [], confusion: [], highSignalComments: [] },
    monetizationIntel: clone.monetizationIntel && typeof clone.monetizationIntel === "object"
      ? {
        overview: Array.isArray(clone.monetizationIntel.overview) ? clone.monetizationIntel.overview.filter((item): item is string => typeof item === "string") : [],
        ctaMix: Array.isArray(clone.monetizationIntel.ctaMix) ? clone.monetizationIntel.ctaMix.filter((item): item is string => typeof item === "string") : [],
        offerTypes: Array.isArray(clone.monetizationIntel.offerTypes) ? clone.monetizationIntel.offerTypes.filter((item): item is string => typeof item === "string") : [],
        lessons: Array.isArray(clone.monetizationIntel.lessons) ? clone.monetizationIntel.lessons.filter((item): item is string => typeof item === "string") : [],
      }
      : { overview: [], ctaMix: [], offerTypes: [], lessons: [] },
    adaptationPlan: clone.adaptationPlan && typeof clone.adaptationPlan === "object"
      ? {
        overview: typeof clone.adaptationPlan.overview === "string" ? clone.adaptationPlan.overview : "",
        fits: Array.isArray(clone.adaptationPlan.fits) ? clone.adaptationPlan.fits.filter((item): item is string => typeof item === "string") : [],
        needsAdapting: Array.isArray(clone.adaptationPlan.needsAdapting) ? clone.adaptationPlan.needsAdapting.filter((item): item is string => typeof item === "string") : [],
        ignore: Array.isArray(clone.adaptationPlan.ignore) ? clone.adaptationPlan.ignore.filter((item): item is string => typeof item === "string") : [],
        fastestLift: Array.isArray(clone.adaptationPlan.fastestLift) ? clone.adaptationPlan.fastestLift.filter((item): item is string => typeof item === "string") : [],
        bestPillarToStart: Array.isArray(clone.adaptationPlan.bestPillarToStart) ? clone.adaptationPlan.bestPillarToStart.filter((item): item is string => typeof item === "string") : [],
        packagingToBorrowSafely: Array.isArray(clone.adaptationPlan.packagingToBorrowSafely) ? clone.adaptationPlan.packagingToBorrowSafely.filter((item): item is string => typeof item === "string") : [],
      }
      : { overview: "", fits: [], needsAdapting: [], ignore: [], fastestLift: [], bestPillarToStart: [], packagingToBorrowSafely: [] },
    actionPlan: clone.actionPlan && typeof clone.actionPlan === "object"
      ? {
        borrow: Array.isArray(clone.actionPlan.borrow) ? clone.actionPlan.borrow.filter((item): item is string => typeof item === "string") : [],
        adapt: Array.isArray(clone.actionPlan.adapt) ? clone.actionPlan.adapt.filter((item): item is string => typeof item === "string") : [],
        avoid: Array.isArray(clone.actionPlan.avoid) ? clone.actionPlan.avoid.filter((item): item is string => typeof item === "string") : [],
        firstMoves: Array.isArray(clone.actionPlan.firstMoves) ? clone.actionPlan.firstMoves.filter((item): item is string => typeof item === "string") : [],
        day30: Array.isArray(clone.actionPlan.day30) ? clone.actionPlan.day30.filter((item): item is string => typeof item === "string") : [],
        day60: Array.isArray(clone.actionPlan.day60) ? clone.actionPlan.day60.filter((item): item is string => typeof item === "string") : [],
        day90: Array.isArray(clone.actionPlan.day90) ? clone.actionPlan.day90.filter((item): item is string => typeof item === "string") : [],
        nextVideoIdeas: Array.isArray(clone.actionPlan.nextVideoIdeas) ? clone.actionPlan.nextVideoIdeas.filter((item): item is string => typeof item === "string") : [],
        differentiate: Array.isArray(clone.actionPlan.differentiate) ? clone.actionPlan.differentiate.filter((item): item is string => typeof item === "string") : [],
      }
      : { borrow: [], adapt: [], avoid: [], firstMoves: [], day30: [], day60: [], day90: [], nextVideoIdeas: [], differentiate: [] },
    exportDeck: typeof clone.exportDeck === "string" ? clone.exportDeck : "",
  };
}

function formatSampleScope(selectedCount: number, loadedCount: number): string {
  if (loadedCount === 0) return "No Sample";
  return selectedCount >= loadedCount ? "Full Sample" : "Filtered Sample";
}

function arrayCount(value: unknown): number {
  return Array.isArray(value) ? value.length : 0;
}

function stringValue(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function buildSavedReportMeta(report: SavedChannelReport): string {
  const mainSelected = arrayCount(report.selectedChannelVideoIds);
  const mainLoaded = arrayCount(report.channelVideos);
  const mainMeta = `${mainSelected}/${mainLoaded} main (${formatSampleScope(mainSelected, mainLoaded)})`;
  const cloneMeta = formatCloneContextMeta(report.cloneNiche, report.cloneStage, report.clonePresentationStyle, report.cloneGoal);
  const myChannelMeta = stringValue(report.myChannelUrl).trim() ? " | my channel linked" : "";
  const benchmarkSelected = arrayCount(report.selectedBenchmarkVideoIds);
  const benchmarkLoaded = arrayCount(report.benchmarkChannelVideos);
  const benchmarkMeta = benchmarkLoaded > 0 ? ` | ${benchmarkSelected}/${benchmarkLoaded} benchmark (${formatSampleScope(benchmarkSelected, benchmarkLoaded)})` : "";

  if (report.kind === "compare") {
    const compareSelected = arrayCount(report.selectedCompareVideoIds);
    const compareLoaded = arrayCount(report.compareChannelVideos);
    const compareMeta = `${compareSelected}/${compareLoaded} compare (${formatSampleScope(compareSelected, compareLoaded)})`;
    return `Compare Report | ${formatCreatedAt(report.createdAt)} | ${mainMeta} | ${compareMeta}${benchmarkMeta}${myChannelMeta} | ${cloneMeta}`;
  }

  return `Clone Plan | ${formatCreatedAt(report.createdAt)} | ${mainMeta}${benchmarkMeta}${myChannelMeta} | ${cloneMeta}`;
}

function buildSavedPresetMeta(preset: SavedChannelPreset): string {
  const mainSelected = arrayCount(preset.selectedChannelVideoIds);
  const mainLoaded = arrayCount(preset.channelVideos);
  const mainMeta = `${mainSelected}/${mainLoaded} main (${formatSampleScope(mainSelected, mainLoaded)})`;
  const compareSelected = arrayCount(preset.selectedCompareVideoIds);
  const compareLoaded = arrayCount(preset.compareChannelVideos);
  const compareMeta = compareLoaded > 0
    ? ` | ${compareSelected}/${compareLoaded} compare (${formatSampleScope(compareSelected, compareLoaded)})`
    : "";
  const benchmarkSelected = arrayCount(preset.selectedBenchmarkVideoIds);
  const benchmarkLoaded = arrayCount(preset.benchmarkChannelVideos);
  const benchmarkMeta = benchmarkLoaded > 0
    ? ` | ${benchmarkSelected}/${benchmarkLoaded} benchmark (${formatSampleScope(benchmarkSelected, benchmarkLoaded)})`
    : "";
  const myChannelMeta = stringValue(preset.myChannelUrl).trim() ? " | my channel" : "";
  return `${formatCreatedAt(preset.createdAt)} | ${mainMeta}${compareMeta}${benchmarkMeta}${myChannelMeta} | ${formatCloneContextMeta(preset.cloneNiche, preset.cloneStage, preset.clonePresentationStyle, preset.cloneGoal)}`;
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
        myChannelUrl: typeof item.myChannelUrl === "string" ? item.myChannelUrl : "",
        compareChannelUrl: typeof item.compareChannelUrl === "string" ? item.compareChannelUrl : "",
        benchmarkChannelUrl: typeof item.benchmarkChannelUrl === "string" ? item.benchmarkChannelUrl : "",
        channelSampleSize: typeof item.channelSampleSize === "number" ? item.channelSampleSize : 8,
        compareSampleSize: typeof item.compareSampleSize === "number" ? item.compareSampleSize : 8,
        benchmarkSampleSize: typeof item.benchmarkSampleSize === "number" ? item.benchmarkSampleSize : 8,
        cloneNiche: typeof item.cloneNiche === "string" ? item.cloneNiche : "",
        cloneStage: item.cloneStage === "new" || item.cloneStage === "small" || item.cloneStage === "growing" || item.cloneStage === "established" ? item.cloneStage : "small",
        clonePresentationStyle: item.clonePresentationStyle === "faceless" || item.clonePresentationStyle === "on-camera" ? item.clonePresentationStyle : "on-camera",
        cloneGoal: item.cloneGoal === "views" || item.cloneGoal === "subs" || item.cloneGoal === "authority" || item.cloneGoal === "sales" ? item.cloneGoal : "views",
        channelVideos: Array.isArray(item.channelVideos) ? item.channelVideos as ChannelVideo[] : [],
        selectedChannelVideoIds: Array.isArray(item.selectedChannelVideoIds) ? item.selectedChannelVideoIds.filter((value): value is string => typeof value === "string") : [],
        compareChannelVideos: Array.isArray(item.compareChannelVideos) ? item.compareChannelVideos as ChannelVideo[] : [],
        selectedCompareVideoIds: Array.isArray(item.selectedCompareVideoIds) ? item.selectedCompareVideoIds.filter((value): value is string => typeof value === "string") : [],
        benchmarkChannelVideos: Array.isArray(item.benchmarkChannelVideos) ? item.benchmarkChannelVideos as ChannelVideo[] : [],
        selectedBenchmarkVideoIds: Array.isArray(item.selectedBenchmarkVideoIds) ? item.selectedBenchmarkVideoIds.filter((value): value is string => typeof value === "string") : [],
        deepDive: item.deepDive && typeof item.deepDive === "object" ? item.deepDive as ChannelDeepDiveBundle : null,
        clone: normalizeSavedCloneChannel((item as Partial<SavedChannelReport>).clone),
        compare: normalizeSavedChannelCompare(item.compare),
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
        myChannelUrl: typeof item.myChannelUrl === "string" ? item.myChannelUrl : "",
        compareChannelUrl: typeof item.compareChannelUrl === "string" ? item.compareChannelUrl : "",
        benchmarkChannelUrl: typeof item.benchmarkChannelUrl === "string" ? item.benchmarkChannelUrl : "",
        channelSampleSize: typeof item.channelSampleSize === "number" ? item.channelSampleSize : 8,
        compareSampleSize: typeof item.compareSampleSize === "number" ? item.compareSampleSize : 8,
        benchmarkSampleSize: typeof item.benchmarkSampleSize === "number" ? item.benchmarkSampleSize : 8,
        cloneNiche: typeof item.cloneNiche === "string" ? item.cloneNiche : "",
        cloneStage: item.cloneStage === "new" || item.cloneStage === "small" || item.cloneStage === "growing" || item.cloneStage === "established" ? item.cloneStage : "small",
        clonePresentationStyle: item.clonePresentationStyle === "faceless" || item.clonePresentationStyle === "on-camera" ? item.clonePresentationStyle : "on-camera",
        cloneGoal: item.cloneGoal === "views" || item.cloneGoal === "subs" || item.cloneGoal === "authority" || item.cloneGoal === "sales" ? item.cloneGoal : "views",
        channelVideos: Array.isArray(item.channelVideos) ? item.channelVideos as ChannelVideo[] : [],
        selectedChannelVideoIds: Array.isArray(item.selectedChannelVideoIds) ? item.selectedChannelVideoIds.filter((value): value is string => typeof value === "string") : [],
        compareChannelVideos: Array.isArray(item.compareChannelVideos) ? item.compareChannelVideos as ChannelVideo[] : [],
        selectedCompareVideoIds: Array.isArray(item.selectedCompareVideoIds) ? item.selectedCompareVideoIds.filter((value): value is string => typeof value === "string") : [],
        benchmarkChannelVideos: Array.isArray(item.benchmarkChannelVideos) ? item.benchmarkChannelVideos as ChannelVideo[] : [],
        selectedBenchmarkVideoIds: Array.isArray(item.selectedBenchmarkVideoIds) ? item.selectedBenchmarkVideoIds.filter((value): value is string => typeof value === "string") : [],
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

function renderLayoutIcon(kind: "home" | "library" | "analyze" | "compare" | "saved" | "export" | "settings" | "overview" | "seo" | "style" | "opportunities" | "clone" | "scorecard") {
  if (kind === "home") {
    return <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M2.5 7.5L8 3l5.5 4.5" strokeLinecap="round" strokeLinejoin="round" /><path d="M4.5 6.8v6h7v-6" strokeLinecap="round" strokeLinejoin="round" /></svg>;
  }
  if (kind === "library") {
    return <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 2.5h8a1 1 0 0 1 1 1V13l-5-2-5 2V3.5a1 1 0 0 1 1-1z" strokeLinejoin="round" /></svg>;
  }
  if (kind === "analyze" || kind === "seo") {
    return <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="7" cy="7" r="4" /><path d="M10.5 10.5L13.5 13.5" strokeLinecap="round" /></svg>;
  }
  if (kind === "compare") {
    return <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 4h4M3 8h6M3 12h4" strokeLinecap="round" /><path d="M10 7l3 1-3 1" strokeLinecap="round" strokeLinejoin="round" /></svg>;
  }
  if (kind === "saved") {
    return <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="2" width="12" height="12" rx="2" /><path d="M5 6h6M5 9h4" strokeLinecap="round" /></svg>;
  }
  if (kind === "export") {
    return <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M8 2v8M5 7l3 3 3-3" strokeLinecap="round" strokeLinejoin="round" /><path d="M3 13h10" strokeLinecap="round" /></svg>;
  }
  if (kind === "settings") {
    return <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="8" cy="8" r="2" /><path d="M8 2v1M8 13v1M2 8h1M13 8h1M3.8 3.8l.7.7M11.5 11.5l.7.7M3.8 12.2l.7-.7M11.5 4.5l.7-.7" strokeLinecap="round" /></svg>;
  }
  if (kind === "overview") {
    return <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="2" width="5" height="5" rx="1" /><rect x="9" y="2" width="5" height="5" rx="1" /><rect x="2" y="9" width="5" height="5" rx="1" /><rect x="9" y="9" width="5" height="5" rx="1" /></svg>;
  }
  if (kind === "style") {
    return <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 11c0 0 2-4 5-4s5 4 5 4" strokeLinecap="round" /><circle cx="8" cy="5" r="2" /></svg>;
  }
  if (kind === "opportunities") {
    return <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M8 3v3M8 10v3M3 8h3M10 8h3" strokeLinecap="round" /></svg>;
  }
  if (kind === "clone") {
    return <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="4" width="8" height="10" rx="1.5" /><path d="M5 4V3a1.5 1.5 0 0 1 3 0v1M6 2h6a1.5 1.5 0 0 1 1.5 1.5V10" strokeLinecap="round" /></svg>;
  }
  return <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M2 11l4-4 2 2 5-5" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

export default function App() {
  const [experienceMode, setExperienceMode] = useState<ExperienceMode>("basic");
  const [activeView, setActiveView] = useState<AppView>("home");
  const [workspaceMode, setWorkspaceMode] = useState<WorkspaceMode>("single");
  const [insightTab, setInsightTab] = useState<InsightTab>("summary");
  const [viSection, setViSection] = useState<ViSection>("input");
  const [librarySection, setLibrarySection] = useState<LibrarySection>("overview");
  const [projectsSection, setProjectsSection] = useState<ProjectsSection>("all");
  const [analyticsSection, setAnalyticsSection] = useState<AnalyticsSection>("overview");
  const [channelResultTab, setChannelResultTab] = useState<ChannelResultTab>("overview");
  const [compareResultTab, setCompareResultTab] = useState<CompareResultTab>("summary");
  const [compareSection, setCompareSection] = useState<CompareSection>("overview");
  const [analyzeSection, setAnalyzeSection] = useState<AnalyzePanelSection>("overview");
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
  const {
    briefs,
    projects,
    savedChannelPresets,
    savedChannelReports,
    setBriefs,
    setSavedChannelPresets,
    setSavedChannelReports,
    setWorkspaceProjects,
    workspaceProjects,
  } = useProjectStore<SavedBrief, SavedChannelReport, SavedChannelPreset, SavedWorkspaceProject>({
    deserializeBrief: (payload) => {
      if (!payload || typeof payload !== "object") return null;
      const brief = payload as Partial<SavedBrief>;
      const nextTitle = typeof brief.title === "string" ? brief.title : "";
      const nextUrl = typeof brief.url === "string" ? brief.url : "";
      const nextTranscript = typeof brief.transcript === "string" ? brief.transcript : "";
      if (!nextTitle || !nextTranscript) return null;
      const nextSummaryStyle = normalizeSummaryStyle(brief.summaryStyle);
      const nextAudiencePreset = normalizeAudiencePreset(brief.audiencePreset);
      const nextOutputLanguage = normalizeOutputLanguage(brief.outputLanguage);
      return {
        id: typeof brief.id === "string" ? brief.id : `brief-${Date.now()}`,
        title: nextTitle,
        url: nextUrl,
        transcript: nextTranscript,
        createdAt: typeof brief.createdAt === "string" ? brief.createdAt : new Date().toISOString(),
        analysis: brief.analysis && typeof brief.analysis === "object"
          ? brief.analysis as AnalysisBundle
          : buildAnalysis({
            title: nextTitle,
            url: nextUrl,
            transcript: nextTranscript,
            summaryStyle: nextSummaryStyle,
            audiencePreset: nextAudiencePreset,
            outputLanguage: nextOutputLanguage,
            cleaner: CLEANER_DEFAULTS,
          }),
        summaryStyle: nextSummaryStyle,
        audiencePreset: nextAudiencePreset,
        outputLanguage: nextOutputLanguage,
      };
    },
    deserializePreset: (payload) => {
      if (!payload || typeof payload !== "object") return null;
      const item = payload as Partial<SavedChannelPreset>;
      return {
        id: typeof item.id === "string" ? item.id : `channel-preset-${Date.now()}`,
        name: typeof item.name === "string" && item.name.trim() ? item.name : "Selection Preset",
        createdAt: typeof item.createdAt === "string" ? item.createdAt : new Date().toISOString(),
        channelUrl: typeof item.channelUrl === "string" ? item.channelUrl : "",
        myChannelUrl: typeof item.myChannelUrl === "string" ? item.myChannelUrl : "",
        compareChannelUrl: typeof item.compareChannelUrl === "string" ? item.compareChannelUrl : "",
        benchmarkChannelUrl: typeof item.benchmarkChannelUrl === "string" ? item.benchmarkChannelUrl : "",
        channelSampleSize: typeof item.channelSampleSize === "number" ? item.channelSampleSize : 8,
        compareSampleSize: typeof item.compareSampleSize === "number" ? item.compareSampleSize : 8,
        benchmarkSampleSize: typeof item.benchmarkSampleSize === "number" ? item.benchmarkSampleSize : 8,
        cloneNiche: typeof item.cloneNiche === "string" ? item.cloneNiche : "",
        cloneStage: item.cloneStage === "new" || item.cloneStage === "small" || item.cloneStage === "growing" || item.cloneStage === "established" ? item.cloneStage : "small",
        clonePresentationStyle: item.clonePresentationStyle === "faceless" || item.clonePresentationStyle === "on-camera" ? item.clonePresentationStyle : "on-camera",
        cloneGoal: item.cloneGoal === "views" || item.cloneGoal === "subs" || item.cloneGoal === "authority" || item.cloneGoal === "sales" ? item.cloneGoal : "views",
        channelVideos: Array.isArray(item.channelVideos) ? item.channelVideos as ChannelVideo[] : [],
        selectedChannelVideoIds: Array.isArray(item.selectedChannelVideoIds) ? item.selectedChannelVideoIds.filter((value): value is string => typeof value === "string") : [],
        compareChannelVideos: Array.isArray(item.compareChannelVideos) ? item.compareChannelVideos as ChannelVideo[] : [],
        selectedCompareVideoIds: Array.isArray(item.selectedCompareVideoIds) ? item.selectedCompareVideoIds.filter((value): value is string => typeof value === "string") : [],
        benchmarkChannelVideos: Array.isArray(item.benchmarkChannelVideos) ? item.benchmarkChannelVideos as ChannelVideo[] : [],
        selectedBenchmarkVideoIds: Array.isArray(item.selectedBenchmarkVideoIds) ? item.selectedBenchmarkVideoIds.filter((value): value is string => typeof value === "string") : [],
      };
    },
    deserializeReport: (payload) => {
      if (!payload || typeof payload !== "object") return null;
      const item = payload as Partial<SavedChannelReport>;
      return {
        id: typeof item.id === "string" ? item.id : `channel-report-${Date.now()}`,
        kind: item.kind === "compare" ? "compare" : "deep-dive",
        title: typeof item.title === "string" ? item.title : "Channel Report",
        createdAt: typeof item.createdAt === "string" ? item.createdAt : new Date().toISOString(),
        channelUrl: typeof item.channelUrl === "string" ? item.channelUrl : "",
        myChannelUrl: typeof item.myChannelUrl === "string" ? item.myChannelUrl : "",
        compareChannelUrl: typeof item.compareChannelUrl === "string" ? item.compareChannelUrl : "",
        benchmarkChannelUrl: typeof item.benchmarkChannelUrl === "string" ? item.benchmarkChannelUrl : "",
        channelSampleSize: typeof item.channelSampleSize === "number" ? item.channelSampleSize : 8,
        compareSampleSize: typeof item.compareSampleSize === "number" ? item.compareSampleSize : 8,
        benchmarkSampleSize: typeof item.benchmarkSampleSize === "number" ? item.benchmarkSampleSize : 8,
        cloneNiche: typeof item.cloneNiche === "string" ? item.cloneNiche : "",
        cloneStage: item.cloneStage === "new" || item.cloneStage === "small" || item.cloneStage === "growing" || item.cloneStage === "established" ? item.cloneStage : "small",
        clonePresentationStyle: item.clonePresentationStyle === "faceless" || item.clonePresentationStyle === "on-camera" ? item.clonePresentationStyle : "on-camera",
        cloneGoal: item.cloneGoal === "views" || item.cloneGoal === "subs" || item.cloneGoal === "authority" || item.cloneGoal === "sales" ? item.cloneGoal : "views",
        channelVideos: Array.isArray(item.channelVideos) ? item.channelVideos as ChannelVideo[] : [],
        selectedChannelVideoIds: Array.isArray(item.selectedChannelVideoIds) ? item.selectedChannelVideoIds.filter((value): value is string => typeof value === "string") : [],
        compareChannelVideos: Array.isArray(item.compareChannelVideos) ? item.compareChannelVideos as ChannelVideo[] : [],
        selectedCompareVideoIds: Array.isArray(item.selectedCompareVideoIds) ? item.selectedCompareVideoIds.filter((value): value is string => typeof value === "string") : [],
        benchmarkChannelVideos: Array.isArray(item.benchmarkChannelVideos) ? item.benchmarkChannelVideos as ChannelVideo[] : [],
        selectedBenchmarkVideoIds: Array.isArray(item.selectedBenchmarkVideoIds) ? item.selectedBenchmarkVideoIds.filter((value): value is string => typeof value === "string") : [],
        deepDive: item.deepDive && typeof item.deepDive === "object" ? item.deepDive as ChannelDeepDiveBundle : null,
        clone: normalizeSavedCloneChannel(item.clone),
        compare: normalizeSavedChannelCompare(item.compare),
      };
    },
    deserializeWorkspace: (payload) => {
      if (!payload || typeof payload !== "object") return null;
      const item = payload as Partial<SavedWorkspaceProject>;
      return {
        id: typeof item.id === "string" ? item.id : `workspace-${Date.now()}`,
        title: typeof item.title === "string" && item.title.trim() ? item.title : "Workspace Snapshot",
        createdAt: typeof item.createdAt === "string" ? item.createdAt : new Date().toISOString(),
        updatedAt: typeof item.updatedAt === "string" ? item.updatedAt : (typeof item.createdAt === "string" ? item.createdAt : new Date().toISOString()),
        activeView: item.activeView ?? "home",
        experienceMode: item.experienceMode === "pro" ? "pro" : "basic",
        workspaceMode: item.workspaceMode === "batch" || item.workspaceMode === "channel" ? item.workspaceMode : "single",
        insightTab: item.insightTab === "insights" || item.insightTab === "exports" || item.insightTab === "chat" ? item.insightTab : "summary",
        channelResultTab: item.channelResultTab ?? "overview",
        compareResultTab: item.compareResultTab ?? "summary",
        videoTitle: typeof item.videoTitle === "string" ? item.videoTitle : "",
        videoUrl: typeof item.videoUrl === "string" ? item.videoUrl : "",
        transcriptLanguage: typeof item.transcriptLanguage === "string" ? item.transcriptLanguage : "",
        transcript: typeof item.transcript === "string" ? item.transcript : "",
        summaryStyle: normalizeSummaryStyle(item.summaryStyle),
        audiencePreset: normalizeAudiencePreset(item.audiencePreset),
        outputLanguage: normalizeOutputLanguage(item.outputLanguage),
        copyFormat: COPY_FORMAT_OPTIONS.some((option) => option.value === item.copyFormat) ? item.copyFormat as CopyFormat : "brief",
        exportFormat: item.exportFormat === "html" || item.exportFormat === "txt" ? item.exportFormat : "md",
        cleaner: item.cleaner && typeof item.cleaner === "object"
          ? {
            removeNoiseTags: Boolean(item.cleaner.removeNoiseTags),
            removeSpeakerLabels: Boolean(item.cleaner.removeSpeakerLabels),
            dedupeLines: Boolean(item.cleaner.dedupeLines),
            trimFillers: Boolean(item.cleaner.trimFillers),
          }
          : CLEANER_DEFAULTS,
        analysis: item.analysis && typeof item.analysis === "object"
          ? item.analysis as AnalysisBundle
          : buildAnalysis({
            title: typeof item.videoTitle === "string" ? item.videoTitle : "",
            url: typeof item.videoUrl === "string" ? item.videoUrl : "",
            transcript: typeof item.transcript === "string" ? item.transcript : "",
            summaryStyle: normalizeSummaryStyle(item.summaryStyle),
            audiencePreset: normalizeAudiencePreset(item.audiencePreset),
            outputLanguage: normalizeOutputLanguage(item.outputLanguage),
            cleaner: item.cleaner && typeof item.cleaner === "object"
              ? {
                removeNoiseTags: Boolean(item.cleaner.removeNoiseTags),
                removeSpeakerLabels: Boolean(item.cleaner.removeSpeakerLabels),
                dedupeLines: Boolean(item.cleaner.dedupeLines),
                trimFillers: Boolean(item.cleaner.trimFillers),
              }
              : CLEANER_DEFAULTS,
          }),
        activeBriefId: typeof item.activeBriefId === "string" ? item.activeBriefId : null,
        transcriptSource: item.transcriptSource && typeof item.transcriptSource === "object"
          ? {
            lineCount: typeof item.transcriptSource.lineCount === "number" ? item.transcriptSource.lineCount : 0,
            language: typeof item.transcriptSource.language === "string" ? item.transcriptSource.language : "",
            videoId: typeof item.transcriptSource.videoId === "string" ? item.transcriptSource.videoId : "",
          }
          : null,
        batchInput: typeof item.batchInput === "string" ? item.batchInput : "",
        batchResults: Array.isArray(item.batchResults) ? item.batchResults as BatchResult[] : [],
        channelUrl: typeof item.channelUrl === "string" ? item.channelUrl : "",
        myChannelUrl: typeof item.myChannelUrl === "string" ? item.myChannelUrl : "",
        compareChannelUrl: typeof item.compareChannelUrl === "string" ? item.compareChannelUrl : "",
        benchmarkChannelUrl: typeof item.benchmarkChannelUrl === "string" ? item.benchmarkChannelUrl : "",
        channelSampleSize: typeof item.channelSampleSize === "number" ? item.channelSampleSize : 8,
        compareSampleSize: typeof item.compareSampleSize === "number" ? item.compareSampleSize : 8,
        benchmarkSampleSize: typeof item.benchmarkSampleSize === "number" ? item.benchmarkSampleSize : 8,
        cloneNiche: typeof item.cloneNiche === "string" ? item.cloneNiche : "",
        cloneStage: item.cloneStage === "new" || item.cloneStage === "small" || item.cloneStage === "growing" || item.cloneStage === "established" ? item.cloneStage : "small",
        clonePresentationStyle: item.clonePresentationStyle === "faceless" || item.clonePresentationStyle === "on-camera" ? item.clonePresentationStyle : "on-camera",
        cloneGoal: item.cloneGoal === "views" || item.cloneGoal === "subs" || item.cloneGoal === "authority" || item.cloneGoal === "sales" ? item.cloneGoal : "views",
        channelVideos: Array.isArray(item.channelVideos) ? item.channelVideos as ChannelVideo[] : [],
        selectedChannelVideoIds: Array.isArray(item.selectedChannelVideoIds) ? item.selectedChannelVideoIds.filter((value): value is string => typeof value === "string") : [],
        compareChannelVideos: Array.isArray(item.compareChannelVideos) ? item.compareChannelVideos as ChannelVideo[] : [],
        selectedCompareVideoIds: Array.isArray(item.selectedCompareVideoIds) ? item.selectedCompareVideoIds.filter((value): value is string => typeof value === "string") : [],
        benchmarkChannelVideos: Array.isArray(item.benchmarkChannelVideos) ? item.benchmarkChannelVideos as ChannelVideo[] : [],
        selectedBenchmarkVideoIds: Array.isArray(item.selectedBenchmarkVideoIds) ? item.selectedBenchmarkVideoIds.filter((value): value is string => typeof value === "string") : [],
        mainStudioImport: item.mainStudioImport && typeof item.mainStudioImport === "object" ? item.mainStudioImport as StudioImportSummary : null,
        compareStudioImport: item.compareStudioImport && typeof item.compareStudioImport === "object" ? item.compareStudioImport as StudioImportSummary : null,
        benchmarkStudioImport: item.benchmarkStudioImport && typeof item.benchmarkStudioImport === "object" ? item.benchmarkStudioImport as StudioImportSummary : null,
        channelDeepDive: item.channelDeepDive && typeof item.channelDeepDive === "object" ? item.channelDeepDive as ChannelDeepDiveBundle : null,
        cloneChannel: normalizeSavedCloneChannel(item.cloneChannel),
        channelCompare: normalizeSavedChannelCompare(item.channelCompare),
        myChannelDeepDive: item.myChannelDeepDive && typeof item.myChannelDeepDive === "object" ? item.myChannelDeepDive as ChannelDeepDiveBundle : null,
        myChannelVideos: Array.isArray(item.myChannelVideos) ? item.myChannelVideos as ChannelVideo[] : [],
        channelPresetName: typeof item.channelPresetName === "string" ? item.channelPresetName : "",
        historySearch: typeof item.historySearch === "string" ? item.historySearch : "",
        commandSearch: typeof item.commandSearch === "string" ? item.commandSearch : "",
        question: typeof item.question === "string" ? item.question : "",
        answer: typeof item.answer === "string" ? item.answer : "",
        timestampSearch: typeof item.timestampSearch === "string" ? item.timestampSearch : "",
        proClipScoreFloor: typeof item.proClipScoreFloor === "number" ? item.proClipScoreFloor : 14,
        plannerChannelFilter: typeof item.plannerChannelFilter === "string" ? item.plannerChannelFilter : "all",
        statusState: item.statusState && typeof item.statusState === "object"
          ? {
            message: typeof item.statusState.message === "string" ? item.statusState.message : READY_STATUS.message,
            tone: item.statusState.tone === "busy" || item.statusState.tone === "success" || item.statusState.tone === "error" ? item.statusState.tone : "ready",
          }
          : READY_STATUS,
      };
    },
    getBriefSnapshot: (brief) => ({
      id: brief.id,
      title: brief.title,
      createdAt: brief.createdAt,
      updatedAt: brief.createdAt,
      payload: brief,
    }),
    getPresetSnapshot: (preset) => ({
      id: preset.id,
      title: preset.name,
      createdAt: preset.createdAt,
      updatedAt: preset.createdAt,
      payload: preset,
    }),
    getReportSnapshot: (report) => ({
      id: report.id,
      title: report.title,
      createdAt: report.createdAt,
      updatedAt: report.createdAt,
      payload: report,
    }),
    getWorkspaceSnapshot: (workspace) => ({
      id: workspace.id,
      title: workspace.title,
      createdAt: workspace.createdAt,
      updatedAt: workspace.updatedAt,
      payload: workspace,
    }),
    loadLegacyCollections: () => ({
      briefs: loadBriefs(),
      reports: loadChannelReports(),
      presets: loadChannelPresets(),
      workspaces: [],
    }),
  });
  const [activeBriefId, setActiveBriefId] = useState<string | null>(null);
  const [currentWorkspaceProjectId, setCurrentWorkspaceProjectId] = useState<string | null>(null);
  const [transcriptSource, setTranscriptSource] = useState<TranscriptSource | null>(null);
  const [statusState, setStatusState] = useState<StatusState>(READY_STATUS);
  const [batchInput, setBatchInput] = useState("");
  const [batchResults, setBatchResults] = useState<BatchResult[]>([]);
  const {
    benchmarkChannelUrl,
    benchmarkChannelVideos,
    benchmarkSampleSize,
    benchmarkStudioImport,
    channelCompare,
    channelDeepDive,
    channelPresetName,
    channelSampleSize,
    channelUrl,
    channelVideos,
    clearBenchmarkSelection,
    clearChannelSelection,
    clearCompareSelection,
    cloneChannel,
    cloneGoal,
    cloneNiche,
    clonePresentationStyle,
    cloneStage,
    compareChannelUrl,
    compareChannelVideos,
    compareSampleSize,
    compareStudioImport,
    handleBenchmarkChannelUrlChange,
    handleCompareChannelUrlChange,
    mainStudioImport,
    myChannelDeepDive,
    myChannelUrl,
    myChannelVideos,
    selectedBenchmarkVideoIds,
    selectedChannelVideoIds,
    selectedCompareVideoIds,
    selectAllBenchmarkVideos,
    selectAllChannelVideos,
    selectAllCompareVideos,
    selectTopBenchmarkVideos,
    selectTopChannelVideos,
    selectTopCompareVideos,
    setBenchmarkChannelVideos,
    setBenchmarkChannelUrl,
    setBenchmarkSampleSize,
    setBenchmarkStudioImport,
    setChannelCompare,
    setChannelDeepDive,
    setChannelPresetName,
    setChannelSampleSize,
    setChannelUrl,
    setChannelVideos,
    setCloneChannel,
    setCloneGoal,
    setCloneNiche,
    setClonePresentationStyle,
    setCloneStage,
    setCompareChannelUrl,
    setCompareChannelVideos,
    setCompareSampleSize,
    setCompareStudioImport,
    setMainStudioImport,
    setMyChannelDeepDive,
    setMyChannelUrl,
    setMyChannelVideos,
    setSelectedBenchmarkVideoIds,
    setSelectedChannelVideoIds,
    setSelectedCompareVideoIds,
    toggleBenchmarkVideo,
    toggleChannelVideo,
    toggleCompareVideo,
    applySavedPreset,
    applySavedReport,
  } = useChannelLabState<
    ChannelVideo,
    ChannelDeepDiveBundle,
    CloneChannelBundle,
    ChannelCompareBundle,
    StudioImportSummary,
    CloneChannelStage,
    ClonePresentationStyle,
    CloneGoal
  >({
    initialCloneGoal: "views",
    initialClonePresentationStyle: "on-camera",
    initialCloneStage: "small",
  });
  const [historySearch, setHistorySearch] = useState("");
  const [commandSearch, setCommandSearch] = useState("");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [channelPresetStatusMessage, setChannelPresetStatusMessage] = useState("");
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
    if (activeView === "channel" || activeView === "compare" || activeView === "analytics") setActiveView("studio");
  }, [activeView, copyFormat, experienceMode, insightTab, workspaceMode]);

  useEffect(() => {
    if (viSection === "input") return;
    if (viSection !== insightTab) setViSection(insightTab);
  }, [insightTab, viSection]);

  useEffect(() => {
    const nextCompareSection = compareResultTabToSection(compareResultTab);
    if (compareSection !== nextCompareSection) setCompareSection(nextCompareSection);
  }, [compareResultTab, compareSection]);

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
  const canImportAnalytics = typeof window.desktopRuntime?.importAnalyticsFile === "function";
  const canExportFile = typeof window.desktopRuntime?.saveExportFile === "function";
  const canExportPdf = typeof window.desktopRuntime?.savePdfFile === "function";
  const canFetchChannel = typeof window.desktopRuntime?.fetchYoutubeChannelVideos === "function";
  const isProMode = experienceMode === "pro";
  const visibleAppViews = ["home", "studio", "channel", "compare", "analytics", "projects", "library", "exports", "settings"] as const;
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
  const {
    benchmarkStudioCoverage,
    mainStudioCoverage,
    compareStudioCoverage,
    selectedBenchmarkVideos,
    selectedChannelVideos,
    selectedCompareVideos,
  } = useChannelLabSelections({
    benchmarkChannelVideos,
    channelVideos,
    compareChannelVideos,
    selectedBenchmarkVideoIds,
    selectedChannelVideoIds,
    selectedCompareVideoIds,
  });
  const {
    channelPresetCards,
    homeRecentProjects,
    homeRecentBriefs,
    homeRecentPresets,
    homeRecentReports,
    libraryBriefs,
    libraryProjects,
    libraryPresets,
    libraryReports,
    librarySearchPlaceholder,
    projectCount: libraryProjectCount,
    visibleLibraryItemCount,
  } = useLibraryCollections({
    briefs,
    historySearch,
    isProMode,
    projects,
    savedChannelPresets,
    savedChannelReports,
    buildSavedPresetMeta,
    buildSavedReportMeta,
  });
  const projectCount = projects.length || libraryProjectCount;
  const pageTitle = activeView === "home"
    ? "Home"
    : activeView === "studio"
      ? "Video Intel"
    : activeView === "channel"
      ? "Channel Lab"
      : activeView === "compare"
      ? "Channel Compare"
        : activeView === "analytics"
          ? "Studio Analytics"
          : activeView === "projects"
            ? "Projects"
        : activeView === "exports"
          ? "Exports"
          : activeView === "settings"
            ? "Settings"
        : "Library";
  const pageDescription = activeView === "home"
    ? "Launch work fast, jump back into saved research, and keep the product organized by department."
    : APP_VIEW_DESCRIPTIONS[activeView];
  const shellTitle = activeView === "home"
    ? "A creator intelligence workspace, not a single tool"
    : activeView === "studio"
      ? workspaceMode === "batch"
        ? "Batch workflow, without the clutter"
        : "Fast insight from one video"
      : activeView === "channel"
        ? "Channel research now has its own command center"
        : activeView === "compare"
          ? "Compare results now live in their own review space"
          : activeView === "analytics"
            ? "Studio metrics now live in a dedicated review space"
            : activeView === "projects"
              ? "Saved work now has a dedicated project hub"
          : activeView === "exports"
            ? "Deliverables now have their own handoff space"
            : activeView === "settings"
              ? "Workspace defaults are no longer buried in the workflow"
        : "Saved work, separate from live analysis";

  useEffect(() => {
    if (plannerChannelFilter === "all") return;
    if (analysis.contentCalendar.some((entry) => entry.primaryChannel === plannerChannelFilter)) return;
    setPlannerChannelFilter("all");
  }, [analysis.contentCalendar, plannerChannelFilter]);

  useEffect(() => {
    if (cloneChannel) {
      setChannelResultTab("overview");
    }
  }, [cloneChannel]);

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
    setViSection("summary");
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
    if (view === "home") {
      setActiveView("home");
      showStatus("Home Ready", "success");
      return;
    }

    if (view === "channel") {
      setExperienceMode("pro");
      setWorkspaceMode("channel");
      setActiveView("channel");
      showStatus("Channel Lab Ready", "success");
      return;
    }

    if (view === "compare") {
      setExperienceMode("pro");
      setWorkspaceMode("channel");
      setActiveView("compare");
      showStatus("Channel Compare Ready", "success");
      return;
    }

    if (view === "analytics") {
      setExperienceMode("pro");
      setWorkspaceMode("channel");
      setActiveView("analytics");
      showStatus("Studio Analytics Ready", "success");
      return;
    }

    if (view === "projects") {
      setActiveView("projects");
      showStatus("Projects Ready", "success");
      return;
    }

    if (view === "studio") {
      setActiveView("studio");
      if (workspaceMode === "channel") setWorkspaceMode("single");
      showStatus("Brief Studio Ready", "success");
      return;
    }

    if (view === "exports") {
      setActiveView("exports");
      showStatus("Exports Ready", "success");
      return;
    }

    if (view === "settings") {
      setActiveView("settings");
      showStatus("Settings Ready", "success");
      return;
    }

    setActiveView("library");
    showStatus("Library Ready", "success");
  }

  function handleCommandSearchSubmit() {
    const normalized = commandSearch.trim();
    if (!normalized) return;
    setHistorySearch(normalized);
    setActiveView("library");
    showStatus("Searching Library", "success");
  }

  function handleGoHome() {
    setHistorySearch("");
    setCommandSearch("");
    setActiveView("home");
    showStatus("Home Ready", "success");
  }

  function handleLoadWorkspaceProject(project: SavedWorkspaceProject) {
    setCurrentWorkspaceProjectId(project.id);
    setExperienceMode(project.experienceMode);
    setActiveView(project.activeView);
    setWorkspaceMode(project.workspaceMode);
    setInsightTab(project.insightTab);
    setViSection(project.activeView === "studio" ? project.insightTab : "input");
    setChannelResultTab(project.channelResultTab);
    setCompareResultTab(project.compareResultTab);
    setCompareSection(compareResultTabToSection(project.compareResultTab));
    setVideoTitle(project.videoTitle);
    setVideoUrl(project.videoUrl);
    setTranscriptLanguage(project.transcriptLanguage);
    setTranscript(project.transcript);
    setSummaryStyle(project.summaryStyle);
    setAudiencePreset(project.audiencePreset);
    setOutputLanguage(project.outputLanguage);
    setCopyFormat(project.copyFormat);
    setExportFormat(project.exportFormat);
    setCleaner(project.cleaner);
    setAnalysis(project.analysis);
    setActiveBriefId(project.activeBriefId);
    setTranscriptSource(project.transcriptSource);
    setBatchInput(project.batchInput);
    setBatchResults(project.batchResults);
    setChannelUrl(project.channelUrl);
    setMyChannelUrl(project.myChannelUrl);
    setCompareChannelUrl(project.compareChannelUrl);
    setBenchmarkChannelUrl(project.benchmarkChannelUrl);
    setChannelSampleSize(project.channelSampleSize);
    setCompareSampleSize(project.compareSampleSize);
    setBenchmarkSampleSize(project.benchmarkSampleSize);
    setCloneNiche(project.cloneNiche);
    setCloneStage(project.cloneStage);
    setClonePresentationStyle(project.clonePresentationStyle);
    setCloneGoal(project.cloneGoal);
    setChannelVideos(project.channelVideos);
    setSelectedChannelVideoIds(project.selectedChannelVideoIds);
    setCompareChannelVideos(project.compareChannelVideos);
    setSelectedCompareVideoIds(project.selectedCompareVideoIds);
    setBenchmarkChannelVideos(project.benchmarkChannelVideos);
    setSelectedBenchmarkVideoIds(project.selectedBenchmarkVideoIds);
    setMainStudioImport(project.mainStudioImport);
    setCompareStudioImport(project.compareStudioImport);
    setBenchmarkStudioImport(project.benchmarkStudioImport);
    setChannelDeepDive(project.channelDeepDive);
    setCloneChannel(project.cloneChannel);
    setChannelCompare(project.channelCompare);
    setMyChannelDeepDive(project.myChannelDeepDive);
    setMyChannelVideos(project.myChannelVideos);
    setChannelPresetName(project.channelPresetName);
    setHistorySearch(project.historySearch);
    setCommandSearch(project.commandSearch);
    setQuestion(project.question);
    setAnswer(project.answer);
    setTimestampSearch(project.timestampSearch);
    setProClipScoreFloor(project.proClipScoreFloor);
    setPlannerChannelFilter(project.plannerChannelFilter);
    setStatusState(project.statusState);
    showStatus(`Workspace Loaded: ${project.title}`, "success");
  }

  function handleLoadProject(projectId: string) {
    const project = projects.find((item) => item.id === projectId);
    if (!project) return;

    if (project.kind === "brief") {
      const brief = briefs.find((item) => item.id === project.id);
      if (brief) handleLoadBrief(brief);
      return;
    }

    if (project.kind === "channel-report") {
      const report = savedChannelReports.find((item) => item.id === project.id);
      if (report) handleLoadSavedChannelReport(report);
      return;
    }

    if (project.kind === "workspace") {
      const workspace = workspaceProjects.find((item) => item.id === project.id);
      if (workspace) handleLoadWorkspaceProject(workspace);
      return;
    }

    const preset = savedChannelPresets.find((item) => item.id === project.id);
    if (preset) handleLoadChannelPreset(preset);
  }

  function handleDeleteProject(projectId: string) {
    const project = projects.find((item) => item.id === projectId);
    if (!project) return;

    if (project.kind === "brief") {
      setBriefs((current) => current.filter((item) => item.id !== projectId));
      if (activeBriefId === projectId) setActiveBriefId(null);
      showStatus("Project Deleted", "success");
      return;
    }

    if (project.kind === "channel-report") {
      setSavedChannelReports((current) => current.filter((item) => item.id !== projectId));
      showStatus("Project Deleted", "success");
      return;
    }

    if (project.kind === "channel-preset") {
      setSavedChannelPresets((current) => current.filter((item) => item.id !== projectId));
      showStatus("Project Deleted", "success");
      return;
    }

    if (projectId === currentWorkspaceProjectId) {
      setCurrentWorkspaceProjectId(null);
    }
    setWorkspaceProjects((current) => current.filter((item) => item.id !== projectId));
    showStatus("Workspace Deleted", "success");
  }

  function handleRenameProject(projectId: string) {
    const project = projects.find((item) => item.id === projectId);
    if (!project) return;

    const suggestedName = project.title.trim();
    const nextTitle = window.prompt("Rename project", suggestedName)?.trim();
    if (!nextTitle || nextTitle === suggestedName) return;

    if (project.kind === "brief") {
      setBriefs((current) => current.map((item) => item.id === projectId ? { ...item, title: nextTitle } : item));
      showStatus("Project Renamed", "success");
      return;
    }

    if (project.kind === "channel-report") {
      setSavedChannelReports((current) => current.map((item) => item.id === projectId ? { ...item, title: nextTitle } : item));
      showStatus("Project Renamed", "success");
      return;
    }

    if (project.kind === "channel-preset") {
      setSavedChannelPresets((current) => current.map((item) => item.id === projectId ? { ...item, name: nextTitle } : item));
      showStatus("Project Renamed", "success");
      return;
    }

    setWorkspaceProjects((current) => current.map((item) => item.id === projectId ? { ...item, title: nextTitle, updatedAt: new Date().toISOString() } : item));
    showStatus("Workspace Renamed", "success");
  }

  function handleLoadBrief(brief: SavedBrief) {
    setCurrentWorkspaceProjectId(null);
    setActiveView("studio");
    setWorkspaceMode("single");
    setVideoTitle(brief.title);
    setVideoUrl(brief.url);
    setTranscript(brief.transcript);
    setAnalysis(brief.analysis);
    setSummaryStyle(brief.summaryStyle);
    setAudiencePreset(brief.audiencePreset);
    setOutputLanguage(brief.outputLanguage);
    setActiveBriefId(brief.id);
    showStatus("Brief Loaded", "success");
  }

  function handleLoadStudioSample() {
    setVideoTitle(SAMPLE_TITLE);
    setVideoUrl(SAMPLE_URL);
    setTranscript(SAMPLE_TRANSCRIPT);
    setTranscriptLanguage("");
    setTranscriptSource(null);
    setAnswer("");
    showStatus("Sample Loaded", "success");
  }

  function handleClearStudioWorkspace() {
    setVideoTitle("");
    setVideoUrl("");
    setTranscript("");
    setTranscriptLanguage("");
    setTranscriptSource(null);
    setAnswer("");
    setAnalysis(buildAnalysis({ title: "", url: "", transcript: "", summaryStyle, audiencePreset, outputLanguage, cleaner }));
    setStatusState(READY_STATUS);
  }

  function handleLoadBatchResult(itemId: string) {
    const item = batchResults.find((entry) => entry.id === itemId);
    if (!item?.analysis || !item.transcript) return;
    setActiveView("studio");
    setWorkspaceMode("single");
    setVideoTitle(item.title);
    setVideoUrl(item.url);
    setTranscript(item.transcript);
    setAnalysis(item.analysis);
    showStatus("Batch Loaded", "success");
  }

  function handleAskTranscript() {
    setAnswer(buildQuestionAnswer(question, analysis));
    showStatus("Answered", "success");
  }

  function handleToggleChannelVideo(videoId: string) {
    toggleChannelVideo(videoId);
  }

  function handleSelectAllChannelVideos() {
    selectAllChannelVideos();
    showStatus("All Loaded Videos Selected", "success");
  }

  function handleSelectTopChannelVideos(count: number) {
    showStatus(`${selectTopChannelVideos(count)} Videos Selected`, "success");
  }

  function handleClearChannelSelection() {
    clearChannelSelection();
    showStatus("Channel Selection Cleared", "success");
  }

  function handleToggleCompareVideo(videoId: string) {
    toggleCompareVideo(videoId);
  }

  function handleSelectAllCompareVideos() {
    selectAllCompareVideos();
    showStatus("All Compare Videos Selected", "success");
  }

  function handleSelectTopCompareVideos(count: number) {
    showStatus(`${selectTopCompareVideos(count)} Compare Videos Selected`, "success");
  }

  function handleClearCompareSelection() {
    clearCompareSelection();
    showStatus("Compare Selection Cleared", "success");
  }

  function handleToggleBenchmarkVideo(videoId: string) {
    toggleBenchmarkVideo(videoId);
  }

  function handleSelectAllBenchmarkVideos() {
    selectAllBenchmarkVideos();
    showStatus("All Benchmark Videos Selected", "success");
  }

  function handleSelectTopBenchmarkVideos(count: number) {
    showStatus(`${selectTopBenchmarkVideos(count)} Benchmark Videos Selected`, "success");
  }

  function handleClearBenchmarkSelection() {
    clearBenchmarkSelection();
    showStatus("Benchmark Selection Cleared", "success");
  }

  function persistChannelReport(report: SavedChannelReport) {
    setSavedChannelReports((current) => [report, ...current.filter((item) => item.id !== report.id)].slice(0, MAX_CHANNEL_REPORTS));
  }

  function buildSavedChannelReport(kind: SavedChannelReport["kind"], deepDive: ChannelDeepDiveBundle, clone: CloneChannelBundle | null, compare: ChannelCompareBundle | null): SavedChannelReport {
    return {
      id: `channel-report-${Date.now()}`,
      kind,
      title: kind === "compare" && compare ? `${compare.primaryLabel} vs ${compare.competitorLabel}` : `${deepDive.channelLabel} Clone Plan`,
      createdAt: new Date().toISOString(),
      channelUrl: channelUrl.trim(),
      myChannelUrl: myChannelUrl.trim(),
      compareChannelUrl: compareChannelUrl.trim(),
      benchmarkChannelUrl: benchmarkChannelUrl.trim(),
      channelSampleSize,
      compareSampleSize,
      benchmarkSampleSize,
      cloneNiche,
      cloneStage,
      clonePresentationStyle,
      cloneGoal,
      channelVideos,
      selectedChannelVideoIds,
      compareChannelVideos,
      selectedCompareVideoIds,
      benchmarkChannelVideos,
      selectedBenchmarkVideoIds,
      deepDive,
      clone,
      compare,
    };
  }

  function handleLoadSavedChannelReport(report: SavedChannelReport) {
    setCurrentWorkspaceProjectId(null);
    setExperienceMode("pro");
    setActiveView("channel");
    setWorkspaceMode("channel");
    applySavedReport(report, (deepDive) => buildCloneChannel({ target: deepDive }));
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
      myChannelUrl: myChannelUrl.trim(),
      compareChannelUrl: compareChannelUrl.trim(),
      benchmarkChannelUrl: benchmarkChannelUrl.trim(),
      channelSampleSize,
      compareSampleSize,
      benchmarkSampleSize,
      cloneNiche,
      cloneStage,
      clonePresentationStyle,
      cloneGoal,
      channelVideos,
      selectedChannelVideoIds,
      compareChannelVideos,
      selectedCompareVideoIds,
      benchmarkChannelVideos,
      selectedBenchmarkVideoIds,
    });
    setChannelPresetName("");
    setChannelPresetStatusMessage(`Saved preset "${name}" with ${selectedChannelVideoIds.length}/${channelVideos.length} main, ${selectedCompareVideoIds.length}/${compareChannelVideos.length} compare, and ${selectedBenchmarkVideoIds.length}/${benchmarkChannelVideos.length} benchmark selections.`);
    showStatus(`Preset Saved: ${name}`, "success");
  }

  function handleLoadChannelPreset(preset: SavedChannelPreset) {
    setCurrentWorkspaceProjectId(null);
    setExperienceMode("pro");
    setActiveView("channel");
    setWorkspaceMode("channel");
    applySavedPreset(preset);
    setChannelPresetStatusMessage(`Loaded preset "${preset.name}" with ${preset.selectedChannelVideoIds.length}/${preset.channelVideos.length} main, ${preset.selectedCompareVideoIds.length}/${preset.compareChannelVideos.length} compare, and ${preset.selectedBenchmarkVideoIds.length}/${preset.benchmarkChannelVideos.length} benchmark selections.`);
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
    setViSection("exports");
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
      setMainStudioImport(null);
      setSelectedChannelVideoIds(videos.map((video) => video.videoId));
      setChannelDeepDive(null);
      setMyChannelDeepDive(null);
      setCloneChannel(null);
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
      setCompareStudioImport(null);
      setSelectedCompareVideoIds(videos.map((video) => video.videoId));
      setChannelCompare(null);
      showStatus(`Compare Channel Loaded (${videos.length} Videos)`, "success");
    } catch (error) {
      showStatus(error instanceof Error ? error.message : "Compare Channel Failed", "error");
    } finally {
      setBusy(false);
    }
  }

  async function handleLoadBenchmarkChannelVideos() {
    if (!canFetchChannel) return showStatus("Channel Unavailable", "error");
    if (!benchmarkChannelUrl.trim()) return showStatus("Paste A Benchmark Channel URL", "error");
    setBusy(true);
    showStatus("Loading Benchmark Channel", "busy");
    try {
      const videos = await window.desktopRuntime.fetchYoutubeChannelVideos(benchmarkChannelUrl.trim(), benchmarkSampleSize);
      setBenchmarkChannelVideos(videos);
      setBenchmarkStudioImport(null);
      setSelectedBenchmarkVideoIds(videos.map((video) => video.videoId));
      setChannelCompare(null);
      showStatus(`Benchmark Channel Loaded (${videos.length} Videos)`, "success");
    } catch (error) {
      showStatus(error instanceof Error ? error.message : "Benchmark Channel Failed", "error");
    } finally {
      setBusy(false);
    }
  }

  async function handleImportStudioAnalytics(target: "main" | "compare" | "benchmark") {
    if (!canImportAnalytics) return showStatus("Studio Import Unavailable", "error");
    const targetVideos = target === "main"
      ? channelVideos
      : target === "compare"
        ? compareChannelVideos
        : benchmarkChannelVideos;
    if (targetVideos.length === 0) return showStatus(target === "main" ? "Load Main Channel First" : target === "compare" ? "Load Compare Channel First" : "Load Benchmark Channel First", "error");
    setBusy(true);
    showStatus(`Importing ${target === "main" ? "Main" : target === "compare" ? "Compare" : "Benchmark"} Studio CSV`, "busy");
    try {
      const result = await window.desktopRuntime.importAnalyticsFile();
      if (result.canceled) {
        showStatus("Studio Import Cancelled", "ready");
        return;
      }

      const importResult = mergeStudioCsvIntoVideos(targetVideos, result.fileName, result.content);
      if (importResult.summary.kind === "unknown" || importResult.summary.rowCount === 0) {
        showStatus("Could Not Read That Studio CSV", "error");
        return;
      }

      if (target === "main") {
        setChannelVideos(importResult.videos);
        setMainStudioImport(importResult.summary);
      } else if (target === "compare") {
        setCompareChannelVideos(importResult.videos);
        setCompareStudioImport(importResult.summary);
      } else {
        setBenchmarkChannelVideos(importResult.videos);
        setBenchmarkStudioImport(importResult.summary);
      }

      setChannelDeepDive(null);
      setMyChannelDeepDive(null);
      setCloneChannel(null);
      setChannelCompare(null);
      showStatus(
        `${target === "main" ? "Main" : target === "compare" ? "Compare" : "Benchmark"} Studio Imported (${importResult.summary.matchedCount} matched${importResult.summary.unmatchedCount > 0 ? `, ${importResult.summary.unmatchedCount} unmatched` : ""})`,
        "success",
      );
    } catch (error) {
      showStatus(error instanceof Error ? error.message : "Studio Import Failed", "error");
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
          commentCountLabel: metadataResult.status === "fulfilled" ? metadataResult.value.commentCountLabel : video.commentCountLabel ?? "",
          topComments: metadataResult.status === "fulfilled" ? metadataResult.value.topComments : video.topComments ?? [],
          studioMetrics: video.studioMetrics,
        };
      } catch {
        return {
          ...video,
          transcript: "",
          topComments: video.topComments ?? [],
          studioMetrics: video.studioMetrics,
        };
      }
    }));
  }

  async function handleRunChannelDeepDive() {
    if (!runtimeReady) return showStatus("Desktop Bridge Required", "error");
    if (channelVideos.length === 0) return showStatus("Load Channel Videos First", "error");
    if (selectedChannelVideos.length === 0) return showStatus("Select At Least One Channel Video", "error");
    setBusy(true);
    showStatus("Building Clone Plan", "busy");
    try {
      const enrichedVideos = await enrichChannelVideos(selectedChannelVideos);
      const nextMyChannelVideos = myChannelUrl.trim() && canFetchChannel
        ? await window.desktopRuntime.fetchYoutubeChannelVideos(myChannelUrl.trim(), channelSampleSize)
        : [];
      const enrichedMyChannelVideos = nextMyChannelVideos.length > 0
        ? await enrichChannelVideos(nextMyChannelVideos)
        : [];
      const deepDive = buildChannelDeepDive({
        channelUrl: channelUrl.trim(),
        videos: enrichedVideos,
        sourceVideoCount: channelVideos.length,
        summaryStyle,
        audiencePreset,
        outputLanguage,
        cleaner,
        cloneContext: {
          niche: cloneNiche,
          channelStage: cloneStage,
          presentationStyle: clonePresentationStyle,
          goal: cloneGoal,
        },
      });
      const nextMyChannelDeepDive = enrichedMyChannelVideos.length > 0 ? buildChannelDeepDive({
        channelUrl: myChannelUrl.trim(),
        videos: enrichedMyChannelVideos,
        sourceVideoCount: nextMyChannelVideos.length,
        summaryStyle,
        audiencePreset,
        outputLanguage,
        cleaner,
        cloneContext: {
          niche: cloneNiche,
          channelStage: cloneStage,
          presentationStyle: clonePresentationStyle,
          goal: cloneGoal,
        },
      }) : null;
      const clonePlan = buildCloneChannel({
        target: deepDive,
        myChannel: nextMyChannelDeepDive,
      });
      setChannelDeepDive(deepDive);
      setMyChannelVideos(nextMyChannelVideos);
      setMyChannelDeepDive(nextMyChannelDeepDive);
      setCloneChannel(clonePlan);
      persistChannelReport(buildSavedChannelReport("deep-dive", deepDive, clonePlan, null));
      showStatus("Clone Plan Ready", "success");
    } catch (error) {
      showStatus(error instanceof Error ? error.message : "Clone Plan Failed", "error");
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
      const benchmarkEnabled = benchmarkChannelVideos.length > 0 && selectedBenchmarkVideos.length > 0;
      const [primaryVideos, competitorVideos, benchmarkVideos] = await Promise.all([
        enrichChannelVideos(selectedChannelVideos),
        enrichChannelVideos(selectedCompareVideos),
        benchmarkEnabled ? enrichChannelVideos(selectedBenchmarkVideos) : Promise.resolve([]),
      ]);
      const primaryDeepDive = buildChannelDeepDive({
        channelUrl: channelUrl.trim(),
        videos: primaryVideos,
        sourceVideoCount: channelVideos.length,
        summaryStyle,
        audiencePreset,
        outputLanguage,
        cleaner,
        cloneContext: {
          niche: cloneNiche,
          channelStage: cloneStage,
          presentationStyle: clonePresentationStyle,
          goal: cloneGoal,
        },
      });
      const competitorDeepDive = buildChannelDeepDive({
        channelUrl: compareChannelUrl.trim(),
        videos: competitorVideos,
        sourceVideoCount: compareChannelVideos.length,
        summaryStyle,
        audiencePreset,
        outputLanguage,
        cleaner,
        cloneContext: {
          niche: cloneNiche,
          channelStage: cloneStage,
          presentationStyle: clonePresentationStyle,
          goal: cloneGoal,
        },
      });
      const benchmarkDeepDive = benchmarkEnabled ? buildChannelDeepDive({
        channelUrl: benchmarkChannelUrl.trim(),
        videos: benchmarkVideos,
        sourceVideoCount: benchmarkChannelVideos.length,
        summaryStyle,
        audiencePreset,
        outputLanguage,
        cleaner,
        cloneContext: {
          niche: cloneNiche,
          channelStage: cloneStage,
          presentationStyle: clonePresentationStyle,
          goal: cloneGoal,
        },
      }) : null;
      const compareBundle = buildChannelCompare({
        primary: primaryDeepDive,
        competitor: competitorDeepDive,
        benchmarks: benchmarkDeepDive ? [benchmarkDeepDive] : [],
      });
      const clonePlan = buildCloneChannel({ target: primaryDeepDive });
      setChannelDeepDive(primaryDeepDive);
      setCloneChannel(clonePlan);
      setMyChannelDeepDive(null);
      setChannelCompare(compareBundle);
      persistChannelReport(buildSavedChannelReport("compare", primaryDeepDive, clonePlan, compareBundle));
      showStatus("Channel Compare Ready", "success");
    } catch (error) {
      showStatus(error instanceof Error ? error.message : "Channel Compare Failed", "error");
    } finally {
      setBusy(false);
    }
  }

  async function handleCopyChannelDeepDive() {
    if (!cloneChannel || !channelDeepDive) return showStatus("Build My Clone Plan First", "error");
    try {
      await navigator.clipboard.writeText(cloneChannel.exportDeck);
      showStatus("Clone Plan Copied", "success");
    } catch {
      showStatus("Copy Failed", "error");
    }
  }

  async function handleExportChannelDeepDive() {
    if (!cloneChannel || !channelDeepDive) return showStatus("Build My Clone Plan First", "error");
    if (!canExportFile) return handleCopyChannelDeepDive();
    try {
      const result = await window.desktopRuntime.saveExportFile({
        suggestedName: `${channelDeepDive.channelLabel || "channel"}-clone-plan`,
        extension: "md",
        content: cloneChannel.exportDeck,
      });
      showStatus(result.canceled ? "Export Cancelled" : "Clone Plan Exported", result.canceled ? "ready" : "success");
    } catch (error) {
      showStatus(error instanceof Error ? error.message : "Export Failed", "error");
    }
  }

  async function handleExportChannelDeepDivePdf() {
    if (!cloneChannel || !channelDeepDive) return showStatus("Build My Clone Plan First", "error");
    if (!canExportPdf) return handleExportChannelDeepDive();
    try {
      const result = await window.desktopRuntime.savePdfFile({
        suggestedName: `${channelDeepDive.channelLabel || "channel"}-clone-plan`,
        html: buildReportPdfHtml({
          title: `${channelDeepDive.channelLabel} Clone Channel Plan`,
          label: "Clone Plan PDF",
          subtitle: `${channelDeepDive.analyzedVideos} selected videos, ${channelDeepDive.transcriptCoverage}% transcript coverage, average visible views ${formatMetricCount(channelDeepDive.averageViewCount)}, and a clone-first strategy plan.`,
          deck: cloneChannel.exportDeck,
          generatedAt: formatCreatedAt(new Date().toISOString()),
          stats: [
            { label: "Selected Videos", value: `${channelDeepDive.analyzedVideos}` },
            { label: "Transcript Coverage", value: `${channelDeepDive.transcriptCoverage}%` },
            { label: "Average Visible Views", value: formatMetricCount(channelDeepDive.averageViewCount) },
          ],
        }),
      });
      showStatus(result.canceled ? "PDF Export Cancelled" : "Clone Plan PDF Exported", result.canceled ? "ready" : "success");
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

  const showAnalyzePanel = activeView === "channel";
  const currentChannelLabel = channelDeepDive?.channelLabel || channelUrl.trim() || "Channel Clone";
  const currentVideoCount = selectedChannelVideos.length > 0 ? selectedChannelVideos.length : channelVideos.length;
  const currentTranscriptCoverage = channelDeepDive?.transcriptCoverage ?? null;
  const breadcrumbToolName = TOOL_BREADCRUMB_LABELS[activeView];
  const isHomeNavActive = activeView !== "library" && activeView !== "exports" && activeView !== "settings";
  const isLibraryNavActive = activeView === "library";
  const isExportNavActive = activeView === "exports";
  const isSettingsNavActive = activeView === "settings";
  const canSaveCurrentView = (activeView === "channel" && Boolean(channelDeepDive && cloneChannel))
    || (activeView === "compare" && Boolean(channelDeepDive && channelCompare))
    || activeView === "studio";
  const canExportCurrentView = (activeView === "channel" && Boolean(channelDeepDive && cloneChannel))
    || (activeView === "compare" && Boolean(channelCompare))
    || activeView === "exports"
    || activeView === "studio";

  async function handleTopbarSaveReport() {
    if (activeView === "studio") {
      handleSave();
      return;
    }
    if (activeView === "channel" && channelDeepDive && cloneChannel) {
      persistChannelReport(buildSavedChannelReport("deep-dive", channelDeepDive, cloneChannel, channelCompare));
      showStatus("Report Saved", "success");
      return;
    }
    if (activeView === "compare" && channelDeepDive && channelCompare) {
      persistChannelReport(buildSavedChannelReport("compare", channelDeepDive, cloneChannel, channelCompare));
      showStatus("Compare Report Saved", "success");
      return;
    }
    showStatus("Nothing To Save Yet", "error");
  }

  async function handleTopbarExport() {
    if (activeView === "channel" && channelDeepDive && cloneChannel) {
      await handleExportChannelDeepDive();
      return;
    }
    if (activeView === "compare" && channelCompare) {
      await handleExportChannelCompare();
      return;
    }
    if (activeView === "studio" || activeView === "exports") {
      await handleExport();
      return;
    }
    showStatus("Nothing To Export Yet", "error");
  }

  function renderAnalyzeArrayCard(title: string, items: string[], emptyCopy: string) {
    return (
      <article className="cipher-view-card">
        <div className="cipher-card-title">{title}</div>
        {items.length > 0 ? (
          <ul className="plain-list">
            {items.map((item) => <li key={`${title}-${item}`}>{item}</li>)}
          </ul>
        ) : (
          <p className="empty-copy">{emptyCopy}</p>
        )}
      </article>
    );
  }

  function renderModeStatCard(metric: ModeMetric) {
    return (
      <article key={`${metric.label}-${metric.value}`} className="cipher-stat-card cipher-mode-stat-card">
        <span className="cipher-stat-label">{metric.label}</span>
        <strong className="cipher-stat-value">{metric.value}</strong>
        <span className="cipher-stat-sub">{metric.note}</span>
      </article>
    );
  }

  function renderModeShell(options: {
    eyebrow: string;
    title: string;
    description: string;
    badges?: string[];
    metrics: ModeMetric[];
    body: ReactNode;
  }) {
    return (
      <section className="cipher-mode-shell">
        <article className="cipher-view-card cipher-mode-hero">
          <div className="cipher-mode-head">
            <div className="cipher-mode-copy">
              <span className="cipher-card-title">{options.eyebrow}</span>
              <h2 className="cipher-mode-title">{options.title}</h2>
              <p className="cipher-mode-description">{options.description}</p>
            </div>
            <div className={`cipher-status-pill is-${statusTone}`}>
              <span className="cipher-status-dot" />
              <span>{status}</span>
            </div>
          </div>
          {options.badges && options.badges.length > 0 ? (
            <div className="cipher-badge-row">
              {options.badges.map((badge) => (
                <span key={`${options.title}-${badge}`} className="cipher-chip">{badge}</span>
              ))}
            </div>
          ) : null}
        </article>
        <div className="cipher-stats-grid cipher-mode-grid">
          {options.metrics.map((metric) => renderModeStatCard(metric))}
        </div>
        <div className="cipher-mode-body">
          {options.body}
        </div>
      </section>
    );
  }

  function renderAnalyzeSectionShell(section: AnalyzePanelSection, cards: ReactNode) {
    const meta = ANALYZE_SECTIONS.find((item) => item.id === section) ?? ANALYZE_SECTIONS[0];

    return (
      <section className="cipher-analyze-grid">
        <article className="cipher-view-card cipher-analyze-hero">
          <div className="cipher-card-title">Channel Clone</div>
          <div className="cipher-analyze-hero-copy">
            <h2>{meta.label}</h2>
            <p>{ANALYZE_SECTION_DESCRIPTIONS[section]}</p>
          </div>
          <div className="cipher-badge-row">
            <span className="cipher-chip">{currentVideoCount} videos</span>
            <span className="cipher-chip">{channelUrl.trim() ? "channel loaded" : "channel pending"}</span>
            <span className="cipher-chip">{cloneChannel ? "clone brief ready" : "clone brief pending"}</span>
          </div>
        </article>
        {cards}
      </section>
    );
  }

  function renderAnalyzeOverview() {
    return renderAnalyzeSectionShell("overview", (
      <>
        <div className="cipher-stats-grid">
          <article className="cipher-stat-card">
            <span className="cipher-stat-label">Sample Size</span>
            <strong className="cipher-stat-value">{channelDeepDive ? `${channelDeepDive.analyzedVideos}/${channelDeepDive.sourceVideoCount}` : `${currentVideoCount}`}</strong>
            <span className="cipher-stat-sub">selected / loaded videos</span>
          </article>
          <article className="cipher-stat-card">
            <span className="cipher-stat-label">Transcript Coverage</span>
            <strong className="cipher-stat-value">{channelDeepDive ? `${channelDeepDive.transcriptCoverage}%` : "Pending"}</strong>
            <span className="cipher-stat-sub">channel deep dive coverage</span>
          </article>
          <article className="cipher-stat-card">
            <span className="cipher-stat-label">Avg Views</span>
            <strong className="cipher-stat-value">{channelDeepDive ? formatMetricCount(channelDeepDive.averageViewCount) : "Pending"}</strong>
            <span className="cipher-stat-sub">visible average per selected upload</span>
          </article>
        </div>
        <article className="cipher-view-card cipher-setup-card">
          <div className="cipher-card-title">Channel Setup</div>
          <ChannelCommandWorkspace
            benchmarkChannelUrl={benchmarkChannelUrl}
            benchmarkSampleSize={benchmarkSampleSize}
            benchmarkSampleSizeOptions={CHANNEL_SAMPLE_SIZE_OPTIONS}
            benchmarkStudioCoverage={benchmarkStudioCoverage}
            benchmarkStudioImport={benchmarkStudioImport}
            benchmarkVideos={benchmarkChannelVideos}
            busy={busy}
            canFetchChannel={canFetchChannel}
            canImportAnalytics={canImportAnalytics}
            channelPresetName={channelPresetName}
            channelPresetStatusMessage={channelPresetStatusMessage}
            channelSampleSize={channelSampleSize}
            channelSampleSizeOptions={CHANNEL_SAMPLE_SIZE_OPTIONS}
            channelUrl={channelUrl}
            cloneGoal={cloneGoal}
            cloneGoalOptions={CLONE_GOAL_OPTIONS}
            cloneNiche={cloneNiche}
            clonePresentationOptions={CLONE_PRESENTATION_OPTIONS}
            clonePresentationStyle={clonePresentationStyle}
            cloneStage={cloneStage}
            cloneStageOptions={CLONE_STAGE_OPTIONS}
            compareChannelUrl={compareChannelUrl}
            compareSampleSize={compareSampleSize}
            compareSampleSizeOptions={CHANNEL_SAMPLE_SIZE_OPTIONS}
            compareStudioCoverage={compareStudioCoverage}
            compareStudioImport={compareStudioImport}
            compareVideos={compareChannelVideos}
            loadedQuotesCount={analysis.quotes.length}
            mainStudioCoverage={mainStudioCoverage}
            mainStudioImport={mainStudioImport}
            myChannelUrl={myChannelUrl}
            runtimeReady={runtimeReady}
            savedPresets={channelPresetCards}
            selectedBenchmarkVideoIds={selectedBenchmarkVideoIds}
            selectedChannelVideoIds={selectedChannelVideoIds}
            selectedChannelVideosCount={selectedChannelVideos.length}
            selectedCompareVideoIds={selectedCompareVideoIds}
            selectedCompareVideosCount={selectedCompareVideos.length}
            totalTranscriptLines={analysis.summary.stats.transcriptLines}
            transcriptWordCount={transcriptWordCount}
            videos={channelVideos}
            onBenchmarkChannelUrlChange={handleBenchmarkChannelUrlChange}
            onBenchmarkSampleSizeChange={setBenchmarkSampleSize}
            onChannelPresetNameChange={setChannelPresetName}
            onChannelSampleSizeChange={setChannelSampleSize}
            onChannelUrlChange={setChannelUrl}
            onCloneGoalChange={setCloneGoal}
            onCloneNicheChange={setCloneNiche}
            onClonePresentationStyleChange={setClonePresentationStyle}
            onCloneStageChange={setCloneStage}
            onCompareChannelUrlChange={handleCompareChannelUrlChange}
            onCompareSampleSizeChange={setCompareSampleSize}
            onDeletePreset={(id) => setSavedChannelPresets((current) => current.filter((item) => item.id !== id))}
            onImportBenchmarkAnalytics={() => void handleImportStudioAnalytics("benchmark")}
            onImportCompareAnalytics={() => void handleImportStudioAnalytics("compare")}
            onImportMainAnalytics={() => void handleImportStudioAnalytics("main")}
            onLoadBenchmarkFeed={() => void handleLoadBenchmarkChannelVideos()}
            onLoadCompareFeed={() => void handleLoadCompareChannelVideos()}
            onLoadMainFeed={() => void handleLoadChannelVideos()}
            onLoadPreset={(id) => {
              const preset = savedChannelPresets.find((item) => item.id === id);
              if (preset) handleLoadChannelPreset(preset);
            }}
            onMyChannelUrlChange={setMyChannelUrl}
            onOpenVideoBrief={(video) => {
              setActiveView("studio");
              setWorkspaceMode("single");
              setVideoTitle(video.title);
              setVideoUrl(video.url);
              showStatus("Video Loaded", "success");
            }}
            onRunClonePlan={() => void handleRunChannelDeepDive()}
            onRunCompare={() => void handleRunChannelCompare()}
            onSavePreset={handleSaveChannelPreset}
            onSelectAllBenchmarkVideos={handleSelectAllBenchmarkVideos}
            onSelectAllChannelVideos={handleSelectAllChannelVideos}
            onSelectAllCompareVideos={handleSelectAllCompareVideos}
            onSelectTopBenchmarkVideos={handleSelectTopBenchmarkVideos}
            onSelectTopChannelVideos={handleSelectTopChannelVideos}
            onSelectTopCompareVideos={handleSelectTopCompareVideos}
            onSendToBatch={() => {
              setActiveView("studio");
              setBatchInput(selectedChannelVideos.map((video) => video.url).join("\n"));
              setWorkspaceMode("batch");
              showStatus("Moved To Batch Studio", "success");
            }}
            onToggleBenchmarkVideo={handleToggleBenchmarkVideo}
            onToggleChannelVideo={handleToggleChannelVideo}
            onToggleCompareVideo={handleToggleCompareVideo}
            onClearBenchmarkSelection={handleClearBenchmarkSelection}
            onClearChannelSelection={handleClearChannelSelection}
            onClearCompareSelection={handleClearCompareSelection}
          />
        </article>
        <article className="cipher-view-card">
          <div className="cipher-card-title">Overview</div>
          <p>{cloneChannel?.overview || channelDeepDive?.overview || "Load a main channel sample and run Clone Plan to populate the overview."}</p>
        </article>
        {renderAnalyzeArrayCard("Top Lessons", cloneChannel?.topLessons ?? [], "Run Clone Plan to surface the main strategic lessons.")}
        {renderAnalyzeArrayCard("Top Risks", cloneChannel?.topRisks ?? [], "Run Clone Plan to reveal platform and execution risks.")}
        {renderAnalyzeArrayCard("Topic Clusters", channelDeepDive?.topicClusters ?? [], "Topic clusters will appear once the channel sample has been analyzed.")}
      </>
    ));
  }

  function renderAnalyzeSeo() {
    return renderAnalyzeSectionShell("seo", (
      <>
        {renderAnalyzeArrayCard("SEO Audit", channelDeepDive?.seoAudit ?? [], "Run Clone Plan to generate the channel SEO audit.")}
        {renderAnalyzeArrayCard("Title Patterns", channelDeepDive?.titlePatterns ?? [], "Title patterns will appear after channel analysis runs.")}
        {renderAnalyzeArrayCard("Title Templates", cloneChannel?.titleIntel.templates ?? channelDeepDive?.titleTemplates ?? [], "Title templates will appear after channel analysis runs.")}
        {renderAnalyzeArrayCard("Trigger Words", cloneChannel?.titleIntel.triggerWords ?? [], "Trigger word analysis will appear after Clone Plan finishes.")}
        {renderAnalyzeArrayCard("Description Signals", channelDeepDive?.descriptionSignals ?? [], "Description and packaging signals will appear after the audit runs.")}
      </>
    ));
  }

  function renderAnalyzeStyle() {
    return renderAnalyzeSectionShell("style", (
      <>
        <article className="cipher-view-card">
          <div className="cipher-card-title">Core Promise</div>
          <p>{cloneChannel?.dna.promise || channelDeepDive?.channelDNA.promise || "The channel promise will appear after channel analysis runs."}</p>
        </article>
        {renderAnalyzeArrayCard("Style DNA", channelDeepDive?.styleDNA ?? [], "Style DNA will appear after the current channel sample has been processed.")}
        {renderAnalyzeArrayCard("Tone", cloneChannel?.dna.tone ?? [], "Tone markers will appear after Clone Plan finishes.")}
        {renderAnalyzeArrayCard("Content Pillars", cloneChannel?.dna.pillars ?? channelDeepDive?.channelDNA.pillars ?? [], "Content pillars will appear after the deep dive runs.")}
        {renderAnalyzeArrayCard("Format Mix", cloneChannel?.dna.formats ?? channelDeepDive?.channelDNA.formats ?? [], "Format mix will appear after the deep dive runs.")}
        {renderAnalyzeArrayCard("Creator Edge", cloneChannel?.dna.creatorEdge ?? [], "Creator edge observations will appear after Clone Plan finishes.")}
      </>
    ));
  }

  function renderAnalyzeOpportunities() {
    return renderAnalyzeSectionShell("opportunities", (
      <>
        {renderAnalyzeArrayCard("Opportunities", channelDeepDive?.opportunityFinder ?? [], "Opportunity gaps will appear after the deep dive runs.")}
        {renderAnalyzeArrayCard("Fits", cloneChannel?.adaptationPlan.fits ?? [], "Adaptation fit notes will appear after Clone Plan finishes.")}
        {renderAnalyzeArrayCard("Needs Adapting", cloneChannel?.adaptationPlan.needsAdapting ?? [], "Adaptation changes will appear after Clone Plan finishes.")}
        {renderAnalyzeArrayCard("Fastest Lift", cloneChannel?.adaptationPlan.fastestLift ?? [], "Fastest-lift opportunities will appear after Clone Plan finishes.")}
        {renderAnalyzeArrayCard("Next Video Ideas", cloneChannel?.actionPlan.nextVideoIdeas ?? channelDeepDive?.nextVideoIdeas ?? [], "Next-video opportunities will appear after analysis runs.")}
      </>
    ));
  }

  function renderAnalyzeCloneBrief() {
    return renderAnalyzeSectionShell("clone", (
      <>
        {renderAnalyzeArrayCard("Clone Brief", channelDeepDive?.cloneBrief ?? [], "Run Clone Plan to generate the clone brief.")}
        {renderAnalyzeArrayCard("Borrow", cloneChannel?.actionPlan.borrow ?? [], "Borrow recommendations will appear after Clone Plan finishes.")}
        {renderAnalyzeArrayCard("Adapt", cloneChannel?.actionPlan.adapt ?? [], "Adaptation recommendations will appear after Clone Plan finishes.")}
        {renderAnalyzeArrayCard("First Moves", cloneChannel?.actionPlan.firstMoves ?? [], "First moves will appear after Clone Plan finishes.")}
        {renderAnalyzeArrayCard("30-Day Plan", cloneChannel?.actionPlan.day30 ?? [], "The 30-day action plan will appear after Clone Plan finishes.")}
        {renderAnalyzeArrayCard("60-Day Plan", cloneChannel?.actionPlan.day60 ?? [], "The 60-day action plan will appear after Clone Plan finishes.")}
        {renderAnalyzeArrayCard("90-Day Plan", cloneChannel?.actionPlan.day90 ?? [], "The 90-day action plan will appear after Clone Plan finishes.")}
      </>
    ));
  }

  function renderAnalyzeScorecard() {
    return renderAnalyzeSectionShell("scorecard", (
      <>
        <article className="cipher-view-card">
          <div className="cipher-card-title">Clone Scorecard</div>
          {cloneChannel?.scores.length ? (
            <div className="cipher-score-grid">
              {cloneChannel.scores.map((item) => (
                <article key={`clone-score-${item.label}`} className="cipher-score-card">
                  <div className="cipher-score-head">
                    <strong>{item.label}</strong>
                    <span>{item.score}/100</span>
                  </div>
                  <p>{item.note}</p>
                </article>
              ))}
            </div>
          ) : (
            <p className="empty-copy">Run Clone Plan to generate the clone scorecard.</p>
          )}
        </article>
        <article className="cipher-view-card">
          <div className="cipher-card-title">Channel Scorecard</div>
          {channelDeepDive?.scorecard.length ? (
            <div className="cipher-score-grid">
              {channelDeepDive.scorecard.map((item) => (
                <article key={`channel-score-${item.label}`} className="cipher-score-card">
                  <div className="cipher-score-head">
                    <strong>{item.label}</strong>
                    <span>{item.score}/100</span>
                  </div>
                  <p>{item.note}</p>
                </article>
              ))}
            </div>
          ) : (
            <p className="empty-copy">Run the deep dive to populate the channel scorecard.</p>
          )}
        </article>
        {renderAnalyzeArrayCard("Differentiate", cloneChannel?.actionPlan.differentiate ?? channelDeepDive?.adaptationPlan.differentiate ?? [], "Differentiation guidance will appear after Clone Plan finishes.")}
      </>
    ));
  }

  function renderAnalyzeSectionContent() {
    if (analyzeSection === "seo") return renderAnalyzeSeo();
    if (analyzeSection === "style") return renderAnalyzeStyle();
    if (analyzeSection === "opportunities") return renderAnalyzeOpportunities();
    if (analyzeSection === "clone") return renderAnalyzeCloneBrief();
    if (analyzeSection === "scorecard") return renderAnalyzeScorecard();
    return renderAnalyzeOverview();
  }

  function renderCompareWorkspace() {
    const compareMetrics: ModeMetric[] = [
      {
        label: "Primary Sample",
        value: channelCompare ? `${channelCompare.metrics.primarySampleSize}` : `${selectedChannelVideos.length || channelVideos.length}`,
        note: channelCompare ? `${channelCompare.primaryLabel} videos reviewed` : "selected main-channel videos",
      },
      {
        label: "Compare Sample",
        value: channelCompare ? `${channelCompare.metrics.competitorSampleSize}` : `${selectedCompareVideos.length || compareChannelVideos.length}`,
        note: channelCompare ? `${channelCompare.competitorLabel} videos reviewed` : "selected competitor videos",
      },
      {
        label: "Shared Themes",
        value: `${channelCompare?.overlapThemes.length ?? 0}`,
        note: channelCompare ? "overlap opportunities identified" : "appears once compare runs",
      },
      {
        label: "Avg Views Gap",
        value: channelCompare
          ? `${formatMetricCount(channelCompare.metrics.primaryAverageViews)} / ${formatMetricCount(channelCompare.metrics.competitorAverageViews)}`
          : "Pending",
        note: channelCompare ? "primary vs competitor visible average" : "run compare to populate",
      },
    ];
    const compareTitle = channelCompare
      ? `${channelCompare.primaryLabel} vs ${channelCompare.competitorLabel}`
      : "Compare channels side by side";
    const compareDescription = channelCompare
      ? channelCompare.overview || "Review overlap, whitespace, and adaptation guidance in one workspace."
      : "Load a main channel and a competitor to generate overlap, winners, and adaptation guidance.";
    const compareBadges = [
      compareChannelUrl.trim() ? "competitor loaded" : "competitor pending",
      cloneNiche.trim() ? cloneNiche.trim() : "general niche",
      `${cloneStage} stage`,
    ];

    return renderModeShell({
      eyebrow: "Compare",
      title: compareTitle,
      description: compareDescription,
      badges: compareBadges,
      metrics: compareMetrics,
      body: (
        <ComparePage
          channelCompare={channelCompare}
          cloneContextLabel={formatCloneContextMeta(cloneNiche, cloneStage, clonePresentationStyle, cloneGoal)}
          compareResultTab={compareResultTab}
          reportCount={savedChannelReports.length}
          onCompareResultTabChange={setCompareResultTab}
          onCopyReport={() => void handleCopyChannelCompare()}
          onExportPdf={() => void handleExportChannelComparePdf()}
          onExportReport={() => void handleExportChannelCompare()}
          onOpenChannelLab={() => handleSelectView("channel")}
          onOpenLibrary={() => {
            setHistorySearch("compare");
            handleSelectView("library");
          }}
        />
      ),
    });
  }

  function renderSavedReportsWorkspace() {
    const searchValue = historySearch.trim();
    const libraryMetrics: ModeMetric[] = [
      {
        label: "Projects",
        value: `${libraryProjects.length}`,
        note: searchValue ? "matching saved projects" : "workspace snapshots available",
      },
      {
        label: "Briefs",
        value: `${libraryBriefs.length}`,
        note: searchValue ? "matching brief exports" : "saved video-intel outputs",
      },
      {
        label: "Presets",
        value: `${libraryPresets.length}`,
        note: searchValue ? "matching channel presets" : "reusable channel setups",
      },
      {
        label: "Reports",
        value: `${libraryReports.length}`,
        note: searchValue ? "matching deep-dive reports" : "saved compare and clone reports",
      },
    ];
    const libraryDescription = visibleLibraryItemCount > 0
      ? `Showing ${visibleLibraryItemCount} saved item${visibleLibraryItemCount === 1 ? "" : "s"} across briefs, presets, reports, and projects.`
      : searchValue
        ? "No saved items match the current search. Clear the filter or save new work from Analyze or Compare."
        : "Saved briefs, reports, presets, and projects will appear here as you capture work across the app.";
    const libraryBadges = [
      searchValue ? `filter: ${searchValue}` : "all saved items",
      isProMode ? "pro workspace" : "basic workspace",
      `${projectCount} total projects`,
    ];

    return (
      <div className="vi-shell">
        <aside className="vi-section-panel cipher-section-panel">
          <div className="cipher-section-header">
            <div className="cipher-section-eyebrow">Library</div>
            <div className="cipher-section-channel">Saved Assets</div>
            <div className="cipher-chip-row">
              <span className="cipher-chip">{projectCount} saved</span>
            </div>
          </div>
          <div className="cipher-section-list">
            {(["overview", "projects", "briefs", "presets", "reports"] as const).map((s) => (
              <button
                key={s}
                type="button"
                className={`cipher-section-item ${librarySection === s ? "is-active" : ""}`}
                onClick={() => setLibrarySection(s)}
              >
                <span className="cipher-section-icon">
                  {renderLayoutIcon(
                    s === "overview"
                      ? "overview"
                      : s === "projects"
                        ? "saved"
                        : s === "briefs"
                          ? "library"
                          : s === "presets"
                            ? "clone"
                            : "export",
                  )}
                </span>
                <span>{s.charAt(0).toUpperCase() + s.slice(1)}</span>
              </button>
            ))}
          </div>
        </aside>
        <div className="vi-main">
          {renderModeShell({
            eyebrow: "Saved Reports",
            title: "Saved research and reusable setups",
            description: libraryDescription,
            badges: libraryBadges,
            metrics: libraryMetrics,
            body: (
              <LibraryPage
                activeBriefId={activeBriefId}
                activeSection={librarySection}
                filteredBriefs={libraryBriefs}
                filteredChannelPresets={libraryPresets}
                filteredChannelReports={libraryReports}
                filteredProjects={libraryProjects}
                formatCreatedAt={formatCreatedAt}
                historySearch={historySearch}
                isProMode={isProMode}
                librarySearchPlaceholder={librarySearchPlaceholder}
                visibleLibraryItemCount={visibleLibraryItemCount}
                onDeleteBrief={(id) => setBriefs((current) => current.filter((item) => item.id !== id))}
                onDeleteProject={handleDeleteProject}
                onDeletePreset={(id) => setSavedChannelPresets((current) => current.filter((item) => item.id !== id))}
                onDeleteReport={(id) => setSavedChannelReports((current) => current.filter((item) => item.id !== id))}
                onHistorySearchChange={setHistorySearch}
                onLoadProject={handleLoadProject}
                onRenameProject={handleRenameProject}
                onLoadBrief={(id) => {
                  const brief = briefs.find((item) => item.id === id);
                  if (brief) handleLoadBrief(brief);
                }}
                onLoadPreset={(id) => {
                  const preset = savedChannelPresets.find((item) => item.id === id);
                  if (preset) handleLoadChannelPreset(preset);
                }}
                onLoadReport={(id) => {
                  const report = savedChannelReports.find((item) => item.id === id);
                  if (report) handleLoadSavedChannelReport(report);
                }}
              />
            ),
          })}
        </div>
      </div>
    );
  }

  function renderExportsWorkspace() {
    const exportMetrics: ModeMetric[] = [
      {
        label: "Brief Export",
        value: transcriptWordCount >= 30 ? `${getWordCount(exportPreview)} words` : "Pending",
        note: transcriptWordCount >= 30 ? "current video-intel package" : "generate a brief to populate",
      },
      {
        label: "Clone Plan",
        value: cloneChannel?.exportDeck ? "Ready" : "Pending",
        note: cloneChannel?.exportDeck ? "channel plan deck available" : "run Clone Plan in Analyze",
      },
      {
        label: "Compare Deck",
        value: channelCompare?.exportDeck ? "Ready" : "Pending",
        note: channelCompare?.exportDeck ? "compare report deck available" : "run Channel Compare first",
      },
      {
        label: "File Output",
        value: exportFormat.toUpperCase(),
        note: canExportPdf ? "PDF export supported" : "markdown and copy-first handoff",
      },
    ];
    const exportDescription = cloneChannel?.exportDeck || channelCompare?.exportDeck || transcriptWordCount >= 30
      ? "Everything ready to hand off lives here: brief exports, clone plan decks, and compare reports."
      : "Exports will fill in as soon as you generate a brief, run a clone plan, or complete a channel compare.";
    const exportBadges = [
      `${copyFormat} copy`,
      `${summaryStyle} summary`,
      outputLanguage.toUpperCase(),
    ];

    return renderModeShell({
      eyebrow: "Export",
      title: "Deliverables and handoff surfaces",
      description: exportDescription,
      badges: exportBadges,
      metrics: exportMetrics,
      body: (
        <ExportsPage
          briefPreview={exportPreview}
          briefTitle={videoTitle || analysis.summary.headline}
          cloneReport={cloneChannel?.exportDeck ?? null}
          compareReport={channelCompare?.exportDeck ?? null}
          onCopyBrief={() => void handleCopy()}
          onCopyCloneReport={() => void handleCopyChannelDeepDive()}
          onCopyCompareReport={() => void handleCopyChannelCompare()}
          onExportBrief={() => void handleExport()}
          onExportClonePdf={() => void handleExportChannelDeepDivePdf()}
          onExportCloneReport={() => void handleExportChannelDeepDive()}
          onExportComparePdf={() => void handleExportChannelComparePdf()}
          onExportCompareReport={() => void handleExportChannelCompare()}
        />
      ),
    });
  }

  function renderSettingsWorkspace() {
    const settingsMetrics: ModeMetric[] = [
      {
        label: "Experience",
        value: experienceMode.toUpperCase(),
        note: isProMode ? "channel, compare, and analytics unlocked" : "brief-first workspace",
      },
      {
        label: "Transcript Fetch",
        value: canFetchTranscript ? "Ready" : "Idle",
        note: canFetchTranscript ? "video URL is ready for import" : "add a video URL in Video Intel",
      },
      {
        label: "Channel Import",
        value: canFetchChannel ? "Ready" : "Offline",
        note: canFetchChannel ? "channel feeds can be loaded" : "desktop runtime needed for feed loading",
      },
      {
        label: "Studio Analytics",
        value: canImportAnalytics ? "Ready" : "Unavailable",
        note: canImportAnalytics ? "CSV workflow is available" : "desktop runtime needed for analytics import",
      },
    ];
    const settingsBadges = [
      runtimeReady ? "desktop runtime connected" : "web-safe mode",
      `${copyFormat} output`,
      `${summaryStyle} summaries`,
    ];

    return renderModeShell({
      eyebrow: "Settings",
      title: "Workspace defaults and environment controls",
      description: "Tune how Cipher Lens writes, exports, and behaves without leaving the main shell.",
      badges: settingsBadges,
      metrics: settingsMetrics,
      body: (
        <SettingsPage
          audiencePreset={audiencePreset}
          availableCopyFormats={availableCopyFormats}
          canExportPdf={canExportPdf}
          canFetchChannel={canFetchChannel}
          canFetchTranscript={canFetchTranscript}
          canImportAnalytics={canImportAnalytics}
          cleaner={cleaner}
          copyFormat={copyFormat}
          experienceMode={experienceMode}
          exportFormat={exportFormat}
          outputLanguage={outputLanguage}
          runtimeReady={runtimeReady}
          summaryStyle={summaryStyle}
          onAudiencePresetChange={setAudiencePreset}
          onCleanerChange={setCleaner}
          onCopyFormatChange={setCopyFormat}
          onExperienceModeChange={setExperienceMode}
          onExportFormatChange={setExportFormat}
          onOutputLanguageChange={setOutputLanguage}
          onSummaryStyleChange={setSummaryStyle}
        />
      ),
    });
  }

  function renderStudioWorkspace() {
    const activeStudioSectionLabel = viSection === "input" ? "Input" : INSIGHT_TAB_LABELS[viSection];
    const studioMetrics: ModeMetric[] = [
      {
        label: "Transcript Words",
        value: `${transcriptWordCount}`,
        note: transcriptSource ? "loaded transcript words" : "manual or sample transcript",
      },
      {
        label: "Active Section",
        value: activeStudioSectionLabel,
        note: "current video intel workspace section",
      },
      {
        label: "Workspace Mode",
        value: WORKSPACE_MODE_LABELS[workspaceMode],
        note: workspaceMode === "batch" ? "batch pipeline is available" : "single-video workflow is active",
      },
      {
        label: "Transcript Source",
        value: transcriptSource ? "Ready" : "Pending",
        note: transcriptSource ? "youtube transcript has been loaded" : canFetchTranscript ? "ready to fetch from URL" : "paste transcript text or add a URL",
      },
    ];
    const studioDescription = viSection === "input"
      ? "Load a video, fetch or paste transcript text, and tune the brief inputs in one command surface."
      : "Review summaries, insights, exports, and transcript chat inside the same structured workspace.";
    const studioBadges = [
      videoUrl.trim() ? "url ready" : "url pending",
      transcriptSource ? "transcript ready" : "transcript pending",
      `${summaryStyle} summary`,
    ];

    return renderModeShell({
      eyebrow: "Video Intel",
      title: videoTitle || "No Video Loaded",
      description: studioDescription,
      badges: studioBadges,
      metrics: studioMetrics,
      body: viSection === "input" ? (
        <article className="cipher-view-card cipher-setup-card">
          <div className="cipher-card-title">Input Studio</div>
          <VideoIntelWorkspace
            audiencePreset={audiencePreset}
            availableCopyFormats={availableCopyFormats}
            batchInput={batchInput}
            batchResults={batchResults}
            busy={busy}
            canFetchTranscript={canFetchTranscript}
            canGenerate={canGenerate}
            canImportFile={canImportFile}
            cleaner={cleaner}
            copyFormat={copyFormat}
            exportFormat={exportFormat}
            isPending={isPending}
            isProMode={isProMode}
            languageOptions={LANGUAGE_OPTIONS}
            outputLanguage={outputLanguage}
            summaryStyle={summaryStyle}
            transcript={transcript}
            transcriptLanguage={transcriptLanguage}
            transcriptSource={transcriptSource}
            videoTitle={videoTitle}
            videoUrl={videoUrl}
            workspaceMode={workspaceMode}
            onAudiencePresetChange={setAudiencePreset}
            onBatchInputChange={setBatchInput}
            onCleanerChange={setCleaner}
            onCleanTranscript={handleCleanTranscript}
            onCopyFormatChange={setCopyFormat}
            onExport={() => void handleExport()}
            onExportFormatChange={setExportFormat}
            onFetch={(generate) => void handleFetch(generate)}
            onGenerateFromText={handleGenerateFromText}
            onImportTranscript={() => void handleImportTranscript()}
            onLoadBatchItem={handleLoadBatchResult}
            onLoadSample={handleLoadStudioSample}
            onOutputLanguageChange={setOutputLanguage}
            onRunBatch={() => void handleRunBatch()}
            onSave={handleSave}
            onSaveCopy={() => void handleCopy()}
            onSetTranscript={setTranscript}
            onSetTranscriptLanguage={setTranscriptLanguage}
            onSetVideoTitle={setVideoTitle}
            onSetVideoUrl={setVideoUrl}
            onSummaryStyleChange={setSummaryStyle}
            onResetWorkspace={handleClearStudioWorkspace}
          />
        </article>
      ) : (
        <article className="cipher-view-card cipher-setup-card">
          <div className="cipher-card-title">{activeStudioSectionLabel}</div>
          <VideoIntelInsights
            analysis={analysis}
            answer={answer}
            copyFormat={copyFormat}
            copyPreview={copyPreview}
            exportPreview={exportPreview}
            filteredClipMoments={filteredClipMoments}
            filteredContentCalendar={filteredContentCalendar}
            insightTab={viSection}
            insightTabLabels={INSIGHT_TAB_LABELS}
            isProMode={isProMode}
            plannerChannelFilter={plannerChannelFilter}
            plannerChannelOptions={plannerChannelOptions}
            plannerLead={plannerLead}
            proClipScoreFloor={proClipScoreFloor}
            question={question}
            repurposeReach={repurposeReach}
            strategicTrack={strategicTrack}
            strongestClip={strongestClip}
            timestampMatches={timestampMatches}
            timestampSearch={timestampSearch}
            visibleInsightTabs={visibleInsightTabs}
            onAskTranscript={handleAskTranscript}
            onInsightTabChange={(tab) => {
              setInsightTab(tab);
              setViSection(tab);
            }}
            onOpenTimestamp={(seconds) => void handleOpenTimestamp(seconds)}
            onPlannerChannelFilterChange={setPlannerChannelFilter}
            onProClipScoreFloorChange={setProClipScoreFloor}
            onQuestionChange={setQuestion}
            onQuickExport={handleProQuickExport}
            onTimestampSearchChange={setTimestampSearch}
          />
        </article>
      ),
    });
  }

  function renderMainView() {
    if (activeView === "channel") {
      return renderAnalyzeSectionContent();
    }
    if (activeView === "compare" && isProMode) {
      return renderCompareWorkspace();
    }
    if (activeView === "library") {
      return renderSavedReportsWorkspace();
    }
    if (activeView === "exports") {
      return renderExportsWorkspace();
    }
    if (activeView === "settings") {
      return renderSettingsWorkspace();
    }
    if (activeView === "studio") {
      return (
        <div className="vi-shell">
          <aside className="vi-section-panel cipher-section-panel">
            <div className="cipher-section-header">
              <div className="cipher-section-eyebrow">Video Intel</div>
              <div className="cipher-section-channel">{videoTitle || "No Video Loaded"}</div>
              <div className="cipher-chip-row">
                <span className="cipher-chip">{transcriptWordCount} words</span>
                <span className="cipher-chip">{transcriptSource ? "transcript ready" : "no transcript"}</span>
              </div>
            </div>
            <div className="cipher-section-list">
              <button type="button" className={`cipher-section-item ${viSection === "input" ? "is-active" : ""}`} onClick={() => setViSection("input")}>
                <span className="cipher-section-icon">{renderLayoutIcon("overview")}</span>
                <span>Input</span>
              </button>
              <button type="button" className={`cipher-section-item ${viSection === "summary" ? "is-active" : ""}`} onClick={() => {
                setViSection("summary");
                setInsightTab("summary");
              }}>
                <span className="cipher-section-icon">{renderLayoutIcon("saved")}</span>
                <span>Summary</span>
              </button>
              <button type="button" className={`cipher-section-item ${viSection === "insights" ? "is-active" : ""}`} onClick={() => {
                setViSection("insights");
                setInsightTab("insights");
              }}>
                <span className="cipher-section-icon">{renderLayoutIcon("seo")}</span>
                <span>Insights</span>
              </button>
              <button type="button" className={`cipher-section-item ${viSection === "exports" ? "is-active" : ""}`} onClick={() => {
                setViSection("exports");
                setInsightTab("exports");
              }}>
                <span className="cipher-section-icon">{renderLayoutIcon("export")}</span>
                <span>Exports</span>
              </button>
              <button type="button" className={`cipher-section-item ${viSection === "chat" ? "is-active" : ""}`} onClick={() => {
                setViSection("chat");
                setInsightTab("chat");
              }}>
                <span className="cipher-section-icon">{renderLayoutIcon("compare")}</span>
                <span>Chat</span>
              </button>
            </div>
          </aside>

          <div className="vi-main">
            {renderStudioWorkspace()}
          </div>
        </div>
      );
    }
    if (activeView === "analytics" && isProMode) {
      return (
        <StudioAnalyticsPage
          benchmark={{
            coverageLabel: benchmarkStudioCoverage,
            importSummary: benchmarkStudioImport,
            videos: benchmarkChannelVideos,
          }}
          busy={busy}
          canImportAnalytics={canImportAnalytics}
          compare={{
            coverageLabel: compareStudioCoverage,
            importSummary: compareStudioImport,
            videos: compareChannelVideos,
          }}
          main={{
            coverageLabel: mainStudioCoverage,
            importSummary: mainStudioImport,
            videos: channelVideos,
          }}
          onImportBenchmarkAnalytics={() => void handleImportStudioAnalytics("benchmark")}
          onImportCompareAnalytics={() => void handleImportStudioAnalytics("compare")}
          onImportMainAnalytics={() => void handleImportStudioAnalytics("main")}
          onOpenChannelLab={() => handleSelectView("channel")}
          onOpenVideoBrief={(video) => {
            setActiveView("studio");
            setWorkspaceMode("single");
            setVideoTitle(video.title);
            setVideoUrl(video.url);
            showStatus("Video Loaded", "success");
          }}
        />
      );
    }
    if (activeView === "projects") {
      return (
        <ProjectsPage
          formatCreatedAt={formatCreatedAt}
          historySearch={historySearch}
          items={libraryProjects}
          onDeleteProject={handleDeleteProject}
          onHistorySearchChange={setHistorySearch}
          onLoadProject={handleLoadProject}
          onRenameProject={handleRenameProject}
          visibleCount={libraryProjects.length}
        />
      );
    }
    return (
      <HomeDashboard
        projectCount={projectCount}
        recentProjects={homeRecentProjects}
        recentBriefs={homeRecentBriefs}
        recentPresets={homeRecentPresets}
        recentReports={homeRecentReports}
        formatCreatedAt={formatCreatedAt}
        onLoadProject={handleLoadProject}
        onLoadBrief={(id) => {
          const brief = briefs.find((item) => item.id === id);
          if (brief) handleLoadBrief(brief);
        }}
        onLoadPreset={(id) => {
          const preset = savedChannelPresets.find((item) => item.id === id);
          if (preset) handleLoadChannelPreset(preset);
        }}
        onLoadReport={(id) => {
          const report = savedChannelReports.find((item) => item.id === id);
          if (report) handleLoadSavedChannelReport(report);
        }}
        onOpenChannelLab={() => handleSelectView("channel")}
        onOpenCompareReports={() => {
          setHistorySearch("compare");
          handleSelectView("library");
        }}
        onOpenAnalytics={() => handleSelectView("analytics")}
        onOpenLibrary={() => {
          setHistorySearch("");
          handleSelectView("library");
        }}
        onOpenProjects={() => handleSelectView("projects")}
        onOpenVideoIntel={() => handleSelectView("studio")}
      />
    );
  }

  return (
    <AppErrorBoundary>
      <main className="lens-app app-shell cipher-shell">
        <div className={`cipher-layout ${showAnalyzePanel ? "is-analyze" : "is-full"}`}>
          <aside className="cipher-icon-sidebar">
            <div className="cipher-sidebar-logo" aria-label="Cipher Lens">
              <div className="cipher-sidebar-logo-mark">CL</div>
            </div>
            <div className="cipher-nav-group">
              <button type="button" className={`cipher-icon-button ${isHomeNavActive ? "is-active" : ""}`} onClick={() => handleSelectView("home")} title="Home">
                {renderLayoutIcon("home")}
              </button>
              <button type="button" className={`cipher-icon-button ${isLibraryNavActive ? "is-active" : ""}`} onClick={() => handleSelectView("library")} title="Library">
                {renderLayoutIcon("library")}
              </button>
            </div>
            <div className="cipher-sidebar-spacer" />
            <div className="cipher-nav-group">
              <button type="button" className={`cipher-icon-button ${isExportNavActive ? "is-active" : ""}`} onClick={() => handleSelectView("exports")} title="Export">
                {renderLayoutIcon("export")}
              </button>
              <button type="button" className={`cipher-icon-button ${isSettingsNavActive ? "is-active" : ""}`} onClick={() => handleSelectView("settings")} title="Settings">
                {renderLayoutIcon("settings")}
              </button>
            </div>
            <div className="cipher-pro-badge">PRO</div>
          </aside>

          {showAnalyzePanel ? (
            <aside className="cipher-section-panel">
              <div className="cipher-section-header">
                <div className="cipher-section-eyebrow">Channel Clone</div>
                <div className="cipher-section-channel">{currentChannelLabel}</div>
                <div className="cipher-chip-row">
                  <span className="cipher-chip">{currentVideoCount} videos</span>
                  {currentTranscriptCoverage !== null ? <span className="cipher-chip">{currentTranscriptCoverage}% transcript</span> : null}
                </div>
              </div>
              <div className="cipher-section-list">
                {ANALYZE_SECTIONS.map((section) => (
                  <button key={section.id} type="button" className={`cipher-section-item ${analyzeSection === section.id ? "is-active" : ""}`} onClick={() => setAnalyzeSection(section.id)}>
                    <span className="cipher-section-icon">{renderLayoutIcon(section.id)}</span>
                    <span>{section.label}</span>
                  </button>
                ))}
              </div>
            </aside>
          ) : null}

          <section className="cipher-main-stage">
            <header className="cipher-topbar">
                <div className="cipher-topbar-title">
                  {activeView === "home" ? (
                  <span className="cipher-breadcrumb-current">Cipher Command Center</span>
                  ) : (
                  <>
                    <button type="button" className="cipher-breadcrumb-link" onClick={() => handleSelectView("home")}>Home</button>
                    <span className="cipher-breadcrumb-separator">&gt;</span>
                    <span className="cipher-breadcrumb-current">{breadcrumbToolName}</span>
                  </>
                )}
              </div>
              <div className="cipher-topbar-actions">
                <button type="button" className="cipher-action-button" onClick={() => void handleTopbarExport()} disabled={!canExportCurrentView}>Export</button>
                <button type="button" className="cipher-action-button is-primary" onClick={() => void handleTopbarSaveReport()} disabled={!canSaveCurrentView}>Save Report</button>
              </div>
            </header>

            <div className="cipher-content-area">
              {renderMainView()}
            </div>
          </section>
        </div>
      </main>
    </AppErrorBoundary>
  );
}

