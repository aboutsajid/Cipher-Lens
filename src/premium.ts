import type { StudioVideoMetrics } from "./youtube-studio";

export const SAMPLE_URL = "https://www.youtube.com/watch?v=workflow-review";
export const SAMPLE_TITLE = "Creator Workflow Review";
export const SAMPLE_TRANSCRIPT = `00:00 Host: Today we're breaking down how small creators can publish better videos without adding more editing time.
00:18 Host: The first shift is planning around a single promise instead of trying to cover every angle in one upload.
00:39 Host: When the opening thirty seconds clearly state the payoff, watch time improves because viewers know why they should stay.
01:03 Host: We also started scripting transitions in advance, which removed awkward pauses and made the final cut shorter.
01:31 Host: The team now batches thumbnail tests before recording, so title and packaging decisions do not delay publishing.
01:54 Host: One of the biggest lessons was using transcript reviews to spot repeated filler phrases that weaken the message.
02:22 Host: After each upload we review retention dips, then map those timestamps back to the script outline.
02:45 Host: That feedback loop helps us tighten future intros, clarify examples, and cut segments that do not move the promise forward.
03:11 Host: If you only copy one idea from this workflow, create a short post-upload review with three notes: what landed, what dragged, and what to test next.
03:36 Host: That simple review process gave us clearer videos, faster revisions, and a more reliable publishing cadence.`;

export const SUMMARY_STYLE_OPTIONS = [
  { value: "executive", label: "Executive" },
  { value: "detailed", label: "Detailed" },
  { value: "bullet", label: "Bullet List" },
  { value: "creator", label: "Creator" },
  { value: "brief", label: "Ultra Brief" },
] as const;

export const AUDIENCE_OPTIONS = [
  { value: "general", label: "General" },
  { value: "student", label: "Student" },
  { value: "founder", label: "Founder" },
  { value: "creator", label: "Creator" },
  { value: "team", label: "Team" },
] as const;

export const OUTPUT_LANGUAGE_OPTIONS = [
  { value: "en", label: "English" },
  { value: "hinglish", label: "Hinglish" },
  { value: "ur-roman", label: "Urdu Roman" },
] as const;

export const COPY_FORMAT_OPTIONS = [
  { value: "brief", label: "Brief" },
  { value: "description", label: "YouTube Description" },
  { value: "upload-pack", label: "Full Upload Pack" },
  { value: "calendar", label: "Content Calendar" },
  { value: "youtube", label: "YouTube Notes" },
  { value: "linkedin", label: "LinkedIn Post" },
  { value: "thread", label: "X Thread" },
  { value: "newsletter", label: "Newsletter Draft" },
  { value: "instagram", label: "Instagram Caption" },
  { value: "meeting", label: "Meeting Notes" },
] as const;

export const EXPORT_FORMAT_OPTIONS = [
  { value: "md", label: "Markdown" },
  { value: "txt", label: "Text" },
  { value: "json", label: "JSON" },
  { value: "html", label: "HTML" },
] as const;

export type SummaryStyle = (typeof SUMMARY_STYLE_OPTIONS)[number]["value"];
export type AudiencePreset = (typeof AUDIENCE_OPTIONS)[number]["value"];
export type OutputLanguage = (typeof OUTPUT_LANGUAGE_OPTIONS)[number]["value"];
export type CopyFormat = (typeof COPY_FORMAT_OPTIONS)[number]["value"];
export type ExportFormat = (typeof EXPORT_FORMAT_OPTIONS)[number]["value"];

export type CleanerSettings = {
  removeNoiseTags: boolean;
  removeSpeakerLabels: boolean;
  dedupeLines: boolean;
  trimFillers: boolean;
};

export type Chapter = {
  title: string;
  timeLabel: string;
  summary: string;
  seconds: number | null;
};

export type SummaryData = {
  headline: string;
  overview: string;
  takeaways: string[];
  chapters: Chapter[];
  actionItems: string[];
  keywords: string[];
  stats: {
    wordCount: number;
    readingMinutes: number;
    timestampCount: number;
    transcriptLines: number;
  };
};

export type PackagingIdeas = {
  titles: string[];
  thumbnails: string[];
  hooks: string[];
};

export type ShortsIdea = {
  title: string;
  hook: string;
  angle: string;
  timeLabel: string;
};

export type TimestampSearchMatch = {
  timeLabel: string;
  seconds: number | null;
  text: string;
  score: number;
};

export type ClipMoment = {
  title: string;
  hook: string;
  reason: string;
  timeLabel: string;
  seconds: number | null;
  score: number;
  clipWindow: string;
};

export type PlatformPacks = {
  linkedin: string;
  thread: string;
  newsletter: string;
  instagram: string;
};

export type CalendarEntry = {
  dayLabel: string;
  contentType: string;
  title: string;
  primaryChannel: string;
  repurposeTo: string[];
  hook: string;
  timeLabel: string;
  seconds?: number | null;
  action: string;
};

export type AnalysisBundle = {
  cleanedTranscript: string;
  summary: SummaryData;
  quotes: string[];
  contentIdeas: string[];
  businessIdeas: string[];
  toolsMentioned: string[];
  titleScore: number;
  titleNotes: string[];
  packagingIdeas: PackagingIdeas;
  shortsIdeas: ShortsIdea[];
  clipMoments: ClipMoment[];
  renamedChapters: string[];
  descriptionHashtags: string[];
  youtubeDescription: string;
  platformPacks: PlatformPacks;
  contentCalendar: CalendarEntry[];
  calendarPlan: string;
  uploadPack: string;
  copyDeck: Record<CopyFormat, string>;
};

export type ChannelDeepDiveVideo = {
  title: string;
  url: string;
  videoId: string;
  publishedLabel: string;
  viewLabel: string;
  viewCount: number | null;
  descriptionAvailable: boolean;
  thumbnailText: string;
  transcriptAvailable: boolean;
  transcriptWordCount: number;
  primaryTheme: string;
  summary: string;
  titleScore: number;
  formatType: string;
  hookType: string;
  ctaType: string;
  performanceLabel: string;
  commentCountLabel: string;
  topComments: Array<{
    author: string;
    text: string;
    likeCount: string;
    publishedLabel: string;
  }>;
  studioMetrics?: StudioVideoMetrics;
};

export type ChannelScorecardItem = {
  label: string;
  score: number;
  note: string;
};

export type CloneChannelStage = "new" | "small" | "growing" | "established";
export type ClonePresentationStyle = "faceless" | "on-camera";
export type CloneGoal = "views" | "subs" | "authority" | "sales";

export type CloneContext = {
  niche: string;
  channelStage: CloneChannelStage;
  presentationStyle: ClonePresentationStyle;
  goal: CloneGoal;
};

export type ChannelDNA = {
  audience: string[];
  promise: string;
  pillars: string[];
  formats: string[];
  tone: string[];
  creatorEdge: string[];
};

export type ThumbnailBoard = {
  summary: string;
  densityNotes: string[];
  messagingNotes: string[];
  repeatedPhrases: string[];
  rules: string[];
  examples: Array<{
    title: string;
    thumbnailText: string;
  }>;
};

export type ChannelAdaptationPlan = {
  fits: string[];
  adapt: string[];
  avoid: string[];
  firstMoves: string[];
  day30: string[];
  day60: string[];
  day90: string[];
  differentiate: string[];
};

export type CloneChannelWinningVideos = {
  topPerformer: ChannelDeepDiveVideo | null;
  winners: ChannelDeepDiveVideo[];
  underperformers: ChannelDeepDiveVideo[];
  winnerVsBaseline: string[];
  stealTheseStructures: string[];
};

export type CloneChannelTitleIntel = {
  formulaMix: string[];
  triggerWords: string[];
  clarityVsCuriosity: string[];
  templates: string[];
  avoidPatterns: string[];
};

export type CloneChannelThumbnailIntel = {
  summary: string;
  textSignals: string[];
  playbook: string[];
  board: ThumbnailBoard;
};

export type CloneChannelHookIntel = {
  dominantStyles: string[];
  distribution: string[];
  retentionNotes: string[];
  templates: string[];
};

export type CloneChannelAudienceIntel = {
  positioning: string[];
  valueDrivers: string[];
  praise: string[];
  requests: string[];
  confusion: string[];
  highSignalComments: string[];
};

export type CloneChannelMonetizationIntel = {
  overview: string[];
  ctaMix: string[];
  offerTypes: string[];
  lessons: string[];
};

export type CloneChannelAdaptationIntel = {
  overview: string;
  fits: string[];
  needsAdapting: string[];
  ignore: string[];
  fastestLift: string[];
  bestPillarToStart: string[];
  packagingToBorrowSafely: string[];
};

export type CloneChannelActionPlan = {
  borrow: string[];
  adapt: string[];
  avoid: string[];
  firstMoves: string[];
  day30: string[];
  day60: string[];
  day90: string[];
  nextVideoIdeas: string[];
  differentiate: string[];
};

export type ChannelDeepDiveBundle = {
  channelLabel: string;
  channelUrl: string;
  analyzedVideos: number;
  sourceVideoCount: number;
  transcriptCoverage: number;
  averageViewCount: number;
  studioMetrics: {
    matchedVideos: number;
    coverage: number;
    averageViews: number;
    averageImpressions: number;
    averageImpressionsCtr: number;
    averageViewDurationSeconds: number;
    averagePercentageViewed: number;
    averageWatchTimeHours: number;
    topTrafficSources: string[];
  };
  sampleNote: string;
  overview: string;
  scorecard: ChannelScorecardItem[];
  cloneScores: ChannelScorecardItem[];
  channelDNA: ChannelDNA;
  signatureMoves: string[];
  winnerPatterns: string[];
  topicClusters: string[];
  titlePatterns: string[];
  titleTemplates: string[];
  seoAudit: string[];
  descriptionSignals: string[];
  styleDNA: string[];
  thumbnailTextSignals: string[];
  thumbnailPlaybook: string[];
  thumbnailBoard: ThumbnailBoard;
  hookPlaybook: string[];
  contentArchitecture: string[];
  audiencePositioning: string[];
  audienceIntel: string[];
  commentIntelligence: string[];
  publishingSystem: string[];
  viewSignals: string[];
  monetizationSignals: string[];
  opportunityFinder: string[];
  nextVideoIdeas: string[];
  cloneBrief: string[];
  takeoverSprint: string[];
  adaptationPlan: ChannelAdaptationPlan;
  cloneContext: CloneContext;
  exportDeck: string;
  videoBreakdowns: ChannelDeepDiveVideo[];
};

export type CloneChannelBundle = {
  targetLabel: string;
  targetUrl: string;
  myChannelLabel: string | null;
  overview: string;
  scores: ChannelScorecardItem[];
  topLessons: string[];
  topRisks: string[];
  dna: ChannelDNA;
  winningVideos: CloneChannelWinningVideos;
  titleIntel: CloneChannelTitleIntel;
  thumbnailIntel: CloneChannelThumbnailIntel;
  hookIntel: CloneChannelHookIntel;
  audienceIntel: CloneChannelAudienceIntel;
  monetizationIntel: CloneChannelMonetizationIntel;
  adaptationPlan: CloneChannelAdaptationIntel;
  actionPlan: CloneChannelActionPlan;
  exportDeck: string;
};

export type ChannelCompareDecision = {
  category: string;
  winner: string;
  note: string;
};

export type ChannelAdaptCompareBundle = {
  overview: string;
  strengthsToKeep: string[];
  closeGaps: string[];
  borrowFirst: string[];
  experiments: string[];
  cautions: string[];
};

export type ChannelNicheModelSnapshot = {
  channelLabel: string;
  sampleSize: number;
  averageViews: number;
  averageTitleScore: number;
  transcriptCoverage: number;
  dominantFormat: string;
  dominantHook: string;
  leadTheme: string;
  leadThumbnailPhrase: string;
};

export type ChannelNicheModelBundle = {
  comparedChannels: string[];
  overview: string;
  sharedThemes: string[];
  sharedFormats: string[];
  sharedHooks: string[];
  sharedThumbnailPhrases: string[];
  growthSystem: string[];
  packagingRules: string[];
  contentSystem: string[];
  audienceAngles: string[];
  momentumSignals: string[];
  whitespaceAngles: string[];
  experiments: string[];
  cautions: string[];
  channelSnapshots: ChannelNicheModelSnapshot[];
  exportDeck: string;
};

export type ChannelCompareBundle = {
  primaryLabel: string;
  competitorLabel: string;
  overview: string;
  overlapThemes: string[];
  decisions: ChannelCompareDecision[];
  recommendations: string[];
  whitespaceOpportunities: string[];
  adaptToMe: ChannelAdaptCompareBundle;
  nicheModel: ChannelNicheModelBundle | null;
  metrics: {
    primarySampleSize: number;
    competitorSampleSize: number;
    primaryAverageTitleScore: number;
    competitorAverageTitleScore: number;
    primaryAverageViews: number;
    competitorAverageViews: number;
    primaryStudioCoverage: number;
    competitorStudioCoverage: number;
    primaryAverageImpressions: number;
    competitorAverageImpressions: number;
    primaryAverageCtr: number;
    competitorAverageCtr: number;
    primaryAverageRetention: number;
    competitorAverageRetention: number;
    primaryAverageViewDurationSeconds: number;
    competitorAverageViewDurationSeconds: number;
    primaryTranscriptCoverage: number;
    competitorTranscriptCoverage: number;
    primaryAverageTranscriptWords: number;
    competitorAverageTranscriptWords: number;
  };
  exportDeck: string;
};

export const CLEANER_DEFAULTS: CleanerSettings = {
  removeNoiseTags: true,
  removeSpeakerLabels: false,
  dedupeLines: true,
  trimFillers: true,
};

const STOP_WORDS = new Set(["the", "and", "for", "that", "with", "this", "from", "into", "your", "you", "are", "have", "were", "they", "there", "about", "would", "could", "should", "while", "where", "when", "what", "which", "because", "without", "after", "before", "being", "been", "then", "also", "just", "only", "more", "less", "very", "around", "through", "using", "used", "use", "like", "will", "does", "did", "doing", "done", "make", "made", "much", "many", "some", "most", "here", "want", "need", "next", "video", "videos", "youtube", "host", "team", "today", "get", "can", "our", "their", "them", "people", "actually", "going", "first", "look", "back", "real", "thing", "things", "time", "times", "year", "years", "still", "even", "ever", "every", "other", "another", "but", "than", "was", "one", "out"]);
const NOISE_PATTERN = /\[(music|applause|laughter|noise|silence).*?\]/gi;
const FILLERS = [/\buh\b/gi, /\bum\b/gi, /\byou know\b/gi, /\bkind of\b/gi, /\bsort of\b/gi, /\bi mean\b/gi];

export function getWordCount(value: string): number {
  return value.trim() ? value.trim().split(/\s+/).filter(Boolean).length : 0;
}

export function formatDuration(minutes: number): string {
  if (minutes < 1) return "<1 Min";
  if (minutes < 60) return `${minutes} Min`;
  const hours = Math.floor(minutes / 60);
  const remainder = minutes % 60;
  return remainder > 0 ? `${hours}H ${remainder}M` : `${hours}H`;
}

export function parseTimestampToSeconds(value: string): number | null {
  const parts = value.replace(/[[\]]/g, "").trim().split(":").map(Number);
  if (parts.some((part) => !Number.isFinite(part))) return null;
  if (parts.length === 2) return parts[0] * 60 + parts[1];
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
  return null;
}

function compactSentence(value: string, maxLength = 160): string {
  const normalized = value.replace(/\s+/g, " ").trim();
  return normalized.length <= maxLength ? normalized : `${normalized.slice(0, maxLength - 3).trimEnd()}...`;
}

function compactLabel(value: string, maxLength = 68): string {
  const normalized = value.replace(/\s+/g, " ").replace(/[.!?]+$/g, "").trim();
  if (normalized.length <= maxLength) return normalized;
  return normalized.slice(0, maxLength).trimEnd();
}

function titleCase(value: string): string {
  return value
    .split(/[\s-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function uniqueItems(values: string[], limit: number): string[] {
  const seen = new Set<string>();
  const items: string[] = [];
  for (const value of values) {
    const normalized = value.replace(/\s+/g, " ").trim();
    const key = normalized.toLowerCase();
    if (!normalized || seen.has(key)) continue;
    seen.add(key);
    items.push(normalized);
    if (items.length >= limit) break;
  }
  return items;
}

function toHashtag(value: string): string {
  const normalized = titleCase(value).replace(/[^A-Za-z0-9]+/g, "");
  return normalized ? `#${normalized}` : "";
}

function stripSpeakerPrefix(value: string): string {
  return value.replace(/^[A-Za-z][A-Za-z\s]{1,24}:\s*/, "").trim();
}

export function convertSubtitleContent(content: string, extension = ""): string {
  if (extension === ".srt") {
    return content.split(/\r?\n\r?\n/).map((block) => {
      const lines = block.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
      const cueIndex = /^\d+$/.test(lines[0] ?? "") ? 1 : 0;
      const timestampLine = lines[cueIndex] ?? "";
      const text = lines.slice(cueIndex + 1).join(" ");
      const time = timestampLine.match(/(\d{2}:\d{2}:\d{2})/);
      return text ? `${time ? time[1] : ""} ${text}`.trim() : "";
    }).filter(Boolean).join("\n");
  }

  if (extension === ".vtt") {
    return content.replace(/^WEBVTT.*$/gim, "").split(/\r?\n\r?\n/).map((block) => {
      const lines = block.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
      const timestampLine = lines.find((line) => line.includes("-->")) ?? "";
      const text = lines.filter((line) => !line.includes("-->")).join(" ");
      const time = timestampLine.match(/(\d{2}:)?\d{2}:\d{2}\.\d{3}/);
      return text ? `${time ? time[0].replace(".", ":").slice(0, 8) : ""} ${text}`.trim() : "";
    }).filter(Boolean).join("\n");
  }

  return content;
}

export function cleanTranscriptInput(transcript: string, cleaner: CleanerSettings): string {
  let next = transcript.replace(/\r/g, "").trim();
  if (cleaner.removeNoiseTags) next = next.replace(NOISE_PATTERN, " ");
  if (cleaner.trimFillers) {
    for (const filler of FILLERS) next = next.replace(filler, " ");
  }
  const lines = next.split(/\n+/).map((line) => {
    const stripped = cleaner.removeSpeakerLabels ? line.replace(/^[A-Za-z][A-Za-z\s]{1,24}:\s*/, "") : line;
    return stripped.replace(/\s+/g, " ").trim();
  }).filter(Boolean);

  if (!cleaner.dedupeLines) return lines.join("\n");
  const deduped: string[] = [];
  let previous = "";
  for (const line of lines) {
    const normalized = line.toLowerCase();
    if (normalized === previous) continue;
    deduped.push(line);
    previous = normalized;
  }
  return deduped.join("\n");
}

function extractLines(transcript: string) {
  return transcript.split(/\r?\n/).map((line) => line.trim()).filter(Boolean).map((line) => {
    const match = line.match(/^(\[?\d{1,2}:\d{2}(?::\d{2})?\]?)[\s\-:|]*(.*)$/);
    return {
      timeLabel: match ? match[1].replace(/[[\]]/g, "") : "",
      seconds: match ? parseTimestampToSeconds(match[1]) : null,
      text: (match ? match[2] : line).replace(/\s+/g, " ").trim(),
    };
  }).filter((line) => line.text.length > 0);
}

function splitSentences(transcript: string): string[] {
  return transcript.replace(/\r?\n/g, " ").replace(/\s+/g, " ").split(/(?<=[.!?])\s+/).map((sentence) => sentence.trim()).filter((sentence) => sentence.length >= 24);
}

function collectKeywords(sentences: string[]): string[] {
  const counts = new Map<string, number>();
  for (const sentence of sentences) {
    for (const token of sentence.toLowerCase().match(/[a-z][a-z-]{2,}/g) ?? []) {
      if (STOP_WORDS.has(token)) continue;
      counts.set(token, (counts.get(token) ?? 0) + 1);
    }
  }
  return [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).slice(0, 8).map(([token]) => token);
}

function isMeaningfulTopicLabel(value: string): boolean {
  const normalized = String(value ?? "").trim().toLowerCase();
  if (!normalized) return false;
  if (STOP_WORDS.has(normalized)) return false;
  if (/^(how|why|best|worst|ever|more|less|than|into|onto|over|under|between|inside|outside|around|across|after|before|every|again|still|maybe)$/.test(normalized)) return false;
  return /[a-z0-9]/.test(normalized);
}

function scoreSentence(sentence: string, keywords: string[]): number {
  const normalized = sentence.toLowerCase();
  return keywords.reduce((score, keyword) => score + (normalized.includes(keyword) ? 2 : 0), 0)
    + (/\b(workflow|results?|strategy|system|money|growth|process|review|publish)\b/i.test(sentence) ? 3 : 0)
    + (/\b\d+\b/.test(sentence) ? 1 : 0);
}

function topSentences(sentences: string[], keywords: string[], count: number): string[] {
  return sentences.map((sentence, index) => ({ sentence, index, score: scoreSentence(sentence, keywords) }))
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .slice(0, count)
    .sort((a, b) => a.index - b.index)
    .map((entry) => compactSentence(entry.sentence));
}

function buildCopyDeck(title: string, url: string, summary: SummaryData): Record<CopyFormat, string> {
  return {
    brief: [title || summary.headline, url, "", "Overview:", summary.overview, "", "Takeaways:", ...summary.takeaways.map((item, index) => `${index + 1}. ${item}`)].filter(Boolean).join("\n"),
    description: "",
    "upload-pack": "",
    calendar: "",
    youtube: [title || summary.headline, "", "In This Video:", ...summary.takeaways.slice(0, 4).map((item) => `- ${item}`), "", "Chapters:", ...summary.chapters.map((chapter) => `- ${chapter.timeLabel} ${chapter.title}`)].join("\n"),
    linkedin: "",
    thread: "",
    newsletter: "",
    instagram: "",
    meeting: ["Executive Summary:", summary.overview, "", "Discussion Points:", ...summary.chapters.map((chapter) => `- ${chapter.title}: ${chapter.summary}`), "", "Action Items:", ...summary.actionItems.map((item) => `- ${item}`)].join("\n"),
  };
}

function buildDescriptionHashtags(keywords: string[]): string[] {
  return uniqueItems(keywords.map((keyword) => toHashtag(keyword)).filter(Boolean), 5);
}

function buildYoutubeDescription(options: {
  title: string;
  summary: SummaryData;
  hashtags: string[];
  outputLanguage: OutputLanguage;
}): string {
  const introLabel = options.outputLanguage === "hinglish"
    ? "Is video mein:"
    : options.outputLanguage === "ur-roman"
      ? "Is video mein:"
      : "In this video:";
  const takeawayLabel = options.outputLanguage === "hinglish"
    ? "Key points:"
    : options.outputLanguage === "ur-roman"
      ? "Aham points:"
      : "Key takeaways:";
  const chapterLabel = options.outputLanguage === "hinglish"
    ? "Timestamps:"
    : options.outputLanguage === "ur-roman"
      ? "Timestamps:"
      : "Chapters:";
  const ctaLine = options.outputLanguage === "hinglish"
    ? "Agar yeh useful laga, isse save karo aur next video mein ek idea test karo."
    : options.outputLanguage === "ur-roman"
      ? "Agar yeh useful laga, isay save karein aur next video mein ek idea test karein."
      : "If this helped, save the video and test one idea in your next upload.";

  return [
    options.title || options.summary.headline,
    "",
    introLabel,
    options.summary.overview,
    "",
    takeawayLabel,
    ...options.summary.takeaways.slice(0, 4).map((item) => `- ${item}`),
    "",
    chapterLabel,
    ...options.summary.chapters.map((chapter) => `- ${chapter.timeLabel} ${chapter.title}`),
    "",
    "Next step:",
    `- ${options.summary.actionItems[0] ?? "Apply one clear insight from this video today."}`,
    "",
    ctaLine,
    "",
    options.hashtags.join(" "),
  ].filter(Boolean).join("\n");
}

function dedupeTitles(values: string[]): string[] {
  const counts = new Map<string, number>();
  return values.map((value) => {
    const key = value.toLowerCase();
    const seen = counts.get(key) ?? 0;
    counts.set(key, seen + 1);
    return seen === 0 ? value : `${value} ${seen + 1}`;
  });
}

function buildChapterTitle(text: string, index: number, keywords: string[]): string {
  const cleanedText = stripSpeakerPrefix(text);
  const normalized = cleanedText.toLowerCase();

  const patternTitles: Array<[RegExp, string]> = [
    [/\b(opening|first shift|promise|payoff|hook)\b/i, "State The Core Promise"],
    [/\b(transition|awkward pauses|final cut)\b/i, "Script Better Transitions"],
    [/\b(thumbnail|packaging|recording)\b/i, "Test Packaging Before Recording"],
    [/\b(filler|phrases|weaken)\b/i, "Cut Filler From The Script"],
    [/\b(retention|timestamps|script outline)\b/i, "Review Retention Dips"],
    [/\b(feedback loop|future intros|clarify examples)\b/i, "Tighten The Next Edit"],
    [/\b(review process|three notes|test next)\b/i, "Run A Post-Upload Review"],
    [/\b(clearer videos|faster revisions|publishing cadence)\b/i, "Build A Repeatable Workflow"],
  ];

  const matched = patternTitles.find(([pattern]) => pattern.test(cleanedText));
  if (matched) return matched[1];

  const leadTokens = uniqueItems(
    (normalized.match(/[a-z][a-z-]{3,}/g) ?? [])
      .filter((token) => !STOP_WORDS.has(token))
      .slice(0, 4)
      .map((token) => titleCase(token)),
    3,
  );

  if (leadTokens.length >= 2) {
    const prefix = index === 0 ? "Start With" : "Focus On";
    return compactLabel(`${prefix} ${leadTokens.join(" ")}`, 42);
  }

  if (keywords[index]) {
    return compactLabel(`${index === 0 ? "Start With" : "Use"} ${titleCase(keywords[index])}`, 42);
  }

  return index === 0 ? "Opening Hook" : `Chapter ${index + 1}`;
}

function buildRenamedChapters(chapters: Chapter[]): string[] {
  return chapters.map((chapter) => `${chapter.timeLabel} ${chapter.title}`);
}

function buildContentCalendar(options: {
  title: string;
  summary: SummaryData;
  shortsIdeas: ShortsIdea[];
  clipMoments: ClipMoment[];
  renamedChapters: string[];
}): CalendarEntry[] {
  const chapterOne = options.renamedChapters[0] ?? `${options.summary.chapters[0]?.timeLabel ?? "00:00"} ${options.summary.chapters[0]?.title ?? "Opening Hook"}`;
  const shortOne = options.shortsIdeas[0];
  const shortTwo = options.shortsIdeas[1] ?? options.shortsIdeas[0];
  const momentOne = options.clipMoments[0];
  const momentTwo = options.clipMoments[1] ?? options.clipMoments[0];
  const leadTakeaway = options.summary.takeaways[0] ?? options.summary.overview;
  const supportTakeaway = options.summary.takeaways[1] ?? leadTakeaway;
  const actionItem = options.summary.actionItems[0] ?? "Apply one clear takeaway and review the response.";
  const resolveSeconds = (timeLabel?: string): number | null => {
    if (!timeLabel) return null;
    return options.summary.chapters.find((chapter) => chapter.timeLabel === timeLabel)?.seconds
      ?? options.clipMoments.find((moment) => moment.timeLabel === timeLabel)?.seconds
      ?? null;
  };

  return [
    {
      dayLabel: "Day 1",
      contentType: "Long-Form Publish",
      title: options.title || options.summary.headline,
      primaryChannel: "YouTube",
      repurposeTo: ["LinkedIn", "X"],
      hook: compactSentence(leadTakeaway, 120),
      timeLabel: options.summary.chapters[0]?.timeLabel ?? "Opening",
      seconds: options.summary.chapters[0]?.seconds ?? null,
      action: `Publish the main video and pin chapter cue: ${chapterOne}.`,
    },
    {
      dayLabel: "Day 2",
      contentType: "Short Clip",
      title: shortOne?.title ?? "Lead Shorts Clip",
      primaryChannel: "YouTube Shorts",
      repurposeTo: ["Instagram Reels", "TikTok"],
      hook: shortOne?.hook ?? compactSentence(leadTakeaway, 120),
      timeLabel: shortOne?.timeLabel ?? momentOne?.timeLabel ?? "Best Moment",
      seconds: resolveSeconds(shortOne?.timeLabel) ?? resolveSeconds(momentOne?.timeLabel),
      action: `Cut a punchy clip around ${shortOne?.timeLabel ?? momentOne?.timeLabel ?? "the strongest timestamp"} and test one bold hook.`,
    },
    {
      dayLabel: "Day 3",
      contentType: "Authority Post",
      title: "LinkedIn Insight Post",
      primaryChannel: "LinkedIn",
      repurposeTo: ["Newsletter"],
      hook: compactSentence(supportTakeaway, 120),
      timeLabel: options.summary.chapters[1]?.timeLabel ?? options.summary.chapters[0]?.timeLabel ?? "Key Point",
      seconds: options.summary.chapters[1]?.seconds ?? options.summary.chapters[0]?.seconds ?? null,
      action: "Post the strongest professional takeaway and ask one discussion question in the close.",
    },
    {
      dayLabel: "Day 4",
      contentType: "Thread Breakdown",
      title: "X Thread Recap",
      primaryChannel: "X",
      repurposeTo: ["LinkedIn Carousel"],
      hook: momentOne?.hook ?? compactSentence(leadTakeaway, 120),
      timeLabel: momentOne?.timeLabel ?? shortOne?.timeLabel ?? "Top Clip",
      seconds: resolveSeconds(momentOne?.timeLabel) ?? resolveSeconds(shortOne?.timeLabel),
      action: "Expand the core lesson into a 5-part thread and link back to the source video.",
    },
    {
      dayLabel: "Day 5",
      contentType: "Second Clip",
      title: shortTwo?.title ?? momentTwo?.title ?? "Follow-Up Clip",
      primaryChannel: "Instagram Reels",
      repurposeTo: ["YouTube Shorts"],
      hook: shortTwo?.hook ?? momentTwo?.hook ?? compactSentence(supportTakeaway, 120),
      timeLabel: shortTwo?.timeLabel ?? momentTwo?.timeLabel ?? "Follow-Up",
      seconds: resolveSeconds(shortTwo?.timeLabel) ?? resolveSeconds(momentTwo?.timeLabel),
      action: `Ship a second angle from ${shortTwo?.timeLabel ?? momentTwo?.timeLabel ?? "the next strongest moment"} with a clearer CTA.`,
    },
    {
      dayLabel: "Day 6",
      contentType: "Newsletter Draft",
      title: "Weekly Creator Note",
      primaryChannel: "Email",
      repurposeTo: ["LinkedIn", "X"],
      hook: compactSentence(`${leadTakeaway} ${supportTakeaway}`, 120),
      timeLabel: options.summary.chapters[2]?.timeLabel ?? options.summary.chapters[0]?.timeLabel ?? "Main Lesson",
      seconds: options.summary.chapters[2]?.seconds ?? options.summary.chapters[0]?.seconds ?? null,
      action: "Send the distilled lesson with one example and one next-step prompt.",
    },
    {
      dayLabel: "Day 7",
      contentType: "Review And Refresh",
      title: "Weekly Batch Review",
      primaryChannel: "Internal Workflow",
      repurposeTo: ["Next Video Brief"],
      hook: compactSentence(actionItem, 120),
      timeLabel: options.summary.chapters.at(-1)?.timeLabel ?? "Review",
      seconds: options.summary.chapters.at(-1)?.seconds ?? null,
      action: "Review what landed, pick the best format, and queue the next batch from the winning angle.",
    },
  ];
}

function buildCalendarPlan(entries: CalendarEntry[]): string {
  return entries.map((entry) => [
    `${entry.dayLabel} | ${entry.contentType} | ${entry.primaryChannel}`,
    `Title: ${entry.title}`,
    `Hook: ${entry.hook}`,
    `Timestamp Cue: ${entry.timeLabel}`,
    `Repurpose To: ${entry.repurposeTo.join(", ")}`,
    `Action: ${entry.action}`,
  ].join("\n")).join("\n\n");
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function buildUploadPack(options: {
  title: string;
  url: string;
  summary: SummaryData;
  renamedChapters: string[];
  packagingIdeas: PackagingIdeas;
  shortsIdeas: ShortsIdea[];
  clipMoments: ClipMoment[];
  youtubeDescription: string;
  platformPacks: PlatformPacks;
  contentCalendar: CalendarEntry[];
  hashtags: string[];
}): string {
  return [
    options.title || options.summary.headline,
    options.url,
    "",
    "TITLE IDEAS",
    ...options.packagingIdeas.titles.map((item, index) => `${index + 1}. ${item}`),
    "",
    "THUMBNAIL TEXT",
    ...options.packagingIdeas.thumbnails.map((item) => `- ${item}`),
    "",
    "HOOK LINES",
    ...options.packagingIdeas.hooks.map((item) => `- ${item}`),
    "",
    "YOUTUBE DESCRIPTION",
    options.youtubeDescription,
    "",
    "REPURPOSING PACKS",
    "LINKEDIN",
    options.platformPacks.linkedin,
    "",
    "X THREAD",
    options.platformPacks.thread,
    "",
    "NEWSLETTER",
    options.platformPacks.newsletter,
    "",
    "INSTAGRAM",
    options.platformPacks.instagram,
    "",
    "CONTENT CALENDAR",
    ...options.contentCalendar.map((entry) => `${entry.dayLabel} | ${entry.contentType} | ${entry.primaryChannel}\nTitle: ${entry.title}\nHook: ${entry.hook}\nRepurpose: ${entry.repurposeTo.join(", ")}\nAction: ${entry.action}`),
    "",
    "HASHTAGS",
    options.hashtags.join(" "),
    "",
    "CHAPTERS",
    ...options.renamedChapters.map((chapter, index) => `- ${chapter}: ${options.summary.chapters[index]?.summary ?? ""}`),
    "",
    "SHORTS IDEAS",
    ...options.shortsIdeas.map((idea, index) => `${index + 1}. ${idea.timeLabel} | ${idea.title}\nHook: ${idea.hook}\nAngle: ${idea.angle}`),
    "",
    "VIRAL MOMENTS",
    ...options.clipMoments.map((moment, index) => `${index + 1}. ${moment.timeLabel} | Score ${moment.score} | ${moment.clipWindow}\nMoment: ${moment.hook}\nWhy: ${moment.reason}`),
  ].filter(Boolean).join("\n");
}

function buildPlatformPacks(options: {
  title: string;
  url: string;
  summary: SummaryData;
  hashtags: string[];
}): PlatformPacks {
  const title = options.title || options.summary.headline;
  const leadTakeaway = options.summary.takeaways[0] ?? options.summary.overview;
  const supportTakeaway = options.summary.takeaways[1] ?? leadTakeaway;
  const actionItem = options.summary.actionItems[0] ?? "Apply one clear idea this week.";
  const linkedIn = [
    `${title}`,
    "",
    options.summary.overview,
    "",
    "A few ideas worth stealing:",
    ...options.summary.takeaways.slice(0, 3).map((item) => `- ${item}`),
    "",
    `My favorite takeaway: ${compactSentence(leadTakeaway, 140)}`,
    "",
    `Next move: ${actionItem}`,
  ].join("\n");
  const thread = [
    `1/5 ${compactSentence(options.summary.overview, 220)}`,
    `2/5 ${compactSentence(leadTakeaway, 220)}`,
    `3/5 ${compactSentence(supportTakeaway, 220)}`,
    `4/5 ${compactSentence(options.summary.chapters[0]?.summary ?? actionItem, 220)}`,
    `5/5 ${compactSentence(actionItem, 220)}${options.url ? `\n\nSource: ${options.url}` : ""}`,
  ].join("\n\n");
  const newsletter = [
    `Subject: ${compactLabel(title, 64)}`,
    "",
    "Opening:",
    options.summary.overview,
    "",
    "What stood out:",
    ...options.summary.takeaways.slice(0, 4).map((item) => `- ${item}`),
    "",
    "Why it matters:",
    compactSentence(`${leadTakeaway} ${supportTakeaway}`, 240),
    "",
    "Try this next:",
    `- ${actionItem}`,
  ].join("\n");
  const instagram = [
    compactSentence(leadTakeaway, 140),
    "",
    ...options.summary.takeaways.slice(0, 3).map((item, index) => `${index + 1}. ${compactSentence(item, 120)}`),
    "",
    `${compactSentence(actionItem, 120)}`,
    "",
    options.hashtags.join(" "),
  ].join("\n");

  return {
    linkedin: linkedIn,
    thread,
    newsletter,
    instagram,
  };
}

function buildPackagingIdeas(options: {
  title: string;
  summary: SummaryData;
  keywords: string[];
  quotes: string[];
  audiencePreset: AudiencePreset;
}): PackagingIdeas {
  const leadKeyword = titleCase(options.keywords[0] ?? "Creator");
  const supportKeyword = titleCase(options.keywords[1] ?? "Workflow");
  const audienceAngle = options.audiencePreset === "creator"
    ? "More Views"
    : options.audiencePreset === "founder"
      ? "Faster Execution"
      : options.audiencePreset === "student"
        ? "Better Results"
        : "Clear Results";
  const openingTakeaway = compactLabel(options.summary.takeaways[0] ?? options.summary.overview, 54);
  const supportTakeaway = compactLabel(options.summary.takeaways[1] ?? options.summary.overview, 52);
  const rawTitles = [
    options.title ? compactLabel(`${options.title}: What Actually Works`) : "",
    compactLabel(`How To ${openingTakeaway}`),
    compactLabel(`The ${leadKeyword} ${supportKeyword} Playbook For ${audienceAngle}`),
    compactLabel(`${leadKeyword} System: ${supportTakeaway}`),
    compactLabel(`${leadKeyword} Strategy That Helps You ${audienceAngle}`),
  ];
  const rawThumbnails = [
    `${leadKeyword.toUpperCase()} SYSTEM`,
    "BETTER HOOKS",
    "CUT THE FILLER",
    audienceAngle.toUpperCase(),
    `${supportKeyword.toUpperCase()} FIX`,
  ];
  const rawHooks = [
    compactSentence(options.quotes[0] ?? options.summary.takeaways[0] ?? options.summary.overview, 110),
    compactSentence(options.quotes[1] ?? options.summary.takeaways[1] ?? options.summary.overview, 110),
    compactSentence(options.summary.takeaways[0] ?? options.summary.overview, 110),
  ];

  return {
    titles: uniqueItems(rawTitles, 5),
    thumbnails: uniqueItems(rawThumbnails, 5),
    hooks: uniqueItems(rawHooks, 3),
  };
}

function buildShortsIdeas(options: {
  summary: SummaryData;
  keywords: string[];
  quotes: string[];
}): ShortsIdea[] {
  const leadKeyword = titleCase(options.keywords[0] ?? "Creator");
  const supportKeyword = titleCase(options.keywords[1] ?? "Workflow");
  const angleLabels = [
    "Hook Breakdown",
    "Fast Lesson",
    "Workflow Fix",
    "Action Clip",
  ];
  const angleCopy = [
    `Open with the strongest payoff, then cut straight to the core promise behind ${leadKeyword}.`,
    `Turn this into a quick tactical lesson with one clean before-and-after example.`,
    `Frame it as a practical ${supportKeyword.toLowerCase()} mistake, then show the fix in under 30 seconds.`,
    `Use this as a punchy takeaway clip with one action viewers can try immediately.`,
  ];

  return options.summary.chapters.slice(0, 4).map((chapter, index) => ({
    title: compactLabel(`${leadKeyword} ${angleLabels[index] ?? `Short ${index + 1}`}: ${chapter.title}`, 58),
    hook: compactSentence(options.quotes[index] ?? options.summary.takeaways[index] ?? chapter.summary, 110),
    angle: compactSentence(angleCopy[index] ?? angleCopy[angleCopy.length - 1], 100),
    timeLabel: chapter.timeLabel || `Part ${index + 1}`,
  }));
}

function buildClipMoments(options: {
  lines: Array<{ timeLabel: string; seconds: number | null; text: string }>;
  keywords: string[];
}): ClipMoment[] {
  const signalPattern = /\b(hook|promise|lesson|mistake|fix|review|retention|watch time|workflow|strategy|system|results?|payoff|secret|simple|clear|faster|better|test|publish|create|cut)\b/i;
  const actionPattern = /\b(review|test|build|plan|ship|compare|create|cut|improve|tighten|clarify|map|batch|script)\b/i;
  const urgencyPattern = /\b(first|biggest|only|one|fast|simple|short)\b/i;

  const scored = options.lines
    .filter((line) => line.text.length >= 28)
    .map((line, index) => {
      const cleanedText = stripSpeakerPrefix(line.text);
      const normalized = cleanedText.toLowerCase();
      const keywordScore = options.keywords.slice(0, 4).reduce((score, keyword) => score + (normalized.includes(keyword) ? 2 : 0), 0);
      const score = keywordScore
        + (signalPattern.test(cleanedText) ? 5 : 0)
        + (actionPattern.test(cleanedText) ? 4 : 0)
        + (urgencyPattern.test(cleanedText) ? 3 : 0)
        + (/\b\d+\b/.test(cleanedText) ? 2 : 0)
        + (cleanedText.length >= 48 && cleanedText.length <= 150 ? 4 : 1)
        + (/[?!]/.test(cleanedText) ? 2 : 0)
        + (line.seconds !== null ? 2 : 0);

      const reasonParts = [
        signalPattern.test(cleanedText) ? "strong hook" : "",
        actionPattern.test(cleanedText) ? "actionable takeaway" : "",
        urgencyPattern.test(cleanedText) ? "fast-scroll phrasing" : "",
        /\b\d+\b/.test(cleanedText) ? "specific proof cue" : "",
      ].filter(Boolean);

      const clipWindow = cleanedText.length <= 70
        ? "15-20 sec clip"
        : cleanedText.length <= 120
          ? "20-30 sec clip"
          : "30-45 sec clip";

      return {
        title: compactLabel(cleanedText, 56),
        hook: compactSentence(cleanedText, 120),
        reason: reasonParts.length > 0 ? titleCase(reasonParts.slice(0, 2).join(" + ")) : "Clear moment for a short-form clip",
        timeLabel: line.timeLabel || `Line ${index + 1}`,
        seconds: line.seconds,
        score,
        clipWindow,
      };
    })
    .sort((a, b) => b.score - a.score || (a.seconds ?? Number.MAX_SAFE_INTEGER) - (b.seconds ?? Number.MAX_SAFE_INTEGER));

  return uniqueItems(scored.map((item) => `${item.timeLabel}||${item.title}`), 5)
    .map((key) => scored.find((item) => `${item.timeLabel}||${item.title}` === key))
    .filter((item): item is ClipMoment => Boolean(item));
}

export function buildQuestionAnswer(question: string, analysis: AnalysisBundle): string {
  const tokens = question.toLowerCase().match(/[a-z][a-z-]{2,}/g) ?? [];
  const sentences = splitSentences(analysis.cleanedTranscript);
  const matches = sentences.map((sentence, index) => ({
    sentence,
    index,
    score: tokens.reduce((score, token) => score + (sentence.toLowerCase().includes(token) ? 3 : 0), 0),
  })).filter((entry) => entry.score > 0).sort((a, b) => b.score - a.score || a.index - b.index).slice(0, 3);
  if (matches.length === 0) return `No direct match found. Best broad answer: ${analysis.summary.overview}`;
  return ["Best Answer From The Transcript:", ...matches.map((entry) => `- ${compactSentence(entry.sentence, 180)}`)].join("\n");
}

export function buildTimestampSearchMatches(query: string, transcript: string, limit = 8): TimestampSearchMatch[] {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) return [];

  const tokens = normalizedQuery.match(/[a-z0-9][a-z0-9-]*/g) ?? [];
  if (tokens.length === 0) return [];

  return extractLines(transcript)
    .map((line, index) => {
      const normalizedText = line.text.toLowerCase();
      const phraseScore = normalizedText.includes(normalizedQuery) ? 8 : 0;
      const tokenScore = tokens.reduce((score, token) => score + (normalizedText.includes(token) ? 3 : 0), 0);
      const coverageBonus = tokens.every((token) => normalizedText.includes(token)) ? 4 : 0;
      const score = phraseScore + tokenScore + coverageBonus;
      return {
        timeLabel: line.timeLabel || `Line ${index + 1}`,
        seconds: line.seconds,
        text: compactSentence(line.text, 180),
        score,
      };
    })
    .filter((match) => match.score > 0)
    .sort((a, b) => b.score - a.score || (a.seconds ?? Number.MAX_SAFE_INTEGER) - (b.seconds ?? Number.MAX_SAFE_INTEGER))
    .slice(0, limit);
}

export function buildExportContent(format: ExportFormat, title: string, url: string, analysis: AnalysisBundle, copyFormat: CopyFormat): string {
  if (format === "json") {
    return JSON.stringify({ title, url, analysis }, null, 2);
  }
  if (format === "html") {
    const safeTitle = escapeHtml(title || analysis.summary.headline);
    const safeUrl = escapeHtml(url);
    const safeOverview = escapeHtml(analysis.summary.overview);
    const safeTakeaways = analysis.summary.takeaways.map((item) => `<li>${escapeHtml(item)}</li>`).join("");
    const safeCalendarPlan = escapeHtml(analysis.calendarPlan);
    const safeYoutubeDescription = escapeHtml(analysis.youtubeDescription);
    const safeLinkedIn = escapeHtml(analysis.platformPacks.linkedin);
    const safeThread = escapeHtml(analysis.platformPacks.thread);
    const safeNewsletter = escapeHtml(analysis.platformPacks.newsletter);
    const safeInstagram = escapeHtml(analysis.platformPacks.instagram);
    const safeUploadPack = escapeHtml(analysis.uploadPack);
    const safeQuotes = analysis.quotes.map((quote) => `<blockquote>${escapeHtml(quote)}</blockquote>`).join("");
    return `<!doctype html><html><head><meta charset="utf-8" /><title>${safeTitle}</title></head><body><h1>${safeTitle}</h1><p>${safeUrl}</p><h2>Overview</h2><p>${safeOverview}</p><h2>Takeaways</h2><ul>${safeTakeaways}</ul><h2>Content Calendar</h2><pre>${safeCalendarPlan}</pre><h2>YouTube Description</h2><pre>${safeYoutubeDescription}</pre><h2>Repurposing Packs</h2><h3>LinkedIn</h3><pre>${safeLinkedIn}</pre><h3>X Thread</h3><pre>${safeThread}</pre><h3>Newsletter</h3><pre>${safeNewsletter}</pre><h3>Instagram</h3><pre>${safeInstagram}</pre><h2>Upload Pack</h2><pre>${safeUploadPack}</pre><h2>Quotes</h2>${safeQuotes}</body></html>`;
  }
  if (format === "txt") {
    return analysis.copyDeck[copyFormat];
  }
  return [`# ${title || analysis.summary.headline}`, "", url, "", "## Overview", analysis.summary.overview, "", "## Takeaways", ...analysis.summary.takeaways.map((item) => `- ${item}`), "", "## Content Calendar", analysis.calendarPlan, "", "## YouTube Description", analysis.youtubeDescription, "", "## Repurposing Packs", "### LinkedIn", analysis.platformPacks.linkedin, "", "### X Thread", analysis.platformPacks.thread, "", "### Newsletter", analysis.platformPacks.newsletter, "", "### Instagram", analysis.platformPacks.instagram, "", "## Full Upload Pack", analysis.uploadPack, "", "## Content Ideas", ...analysis.contentIdeas.map((item) => `- ${item}`)].filter(Boolean).join("\n");
}

export function buildAnalysis(options: {
  title: string;
  url: string;
  transcript: string;
  summaryStyle: SummaryStyle;
  audiencePreset: AudiencePreset;
  outputLanguage: OutputLanguage;
  cleaner: CleanerSettings;
}): AnalysisBundle {
  const cleanedTranscript = cleanTranscriptInput(options.transcript, options.cleaner);
  const lines = extractLines(cleanedTranscript);
  const sentences = splitSentences(cleanedTranscript);
  const keywords = collectKeywords(sentences);
  const takeawayCount = options.summaryStyle === "brief" ? 3 : options.summaryStyle === "bullet" ? 5 : options.summaryStyle === "detailed" ? 6 : 4;
  const takeaways = topSentences(sentences, keywords, takeawayCount);
  const quotes = topSentences(sentences.filter((sentence) => sentence.length >= 40 && sentence.length <= 180), keywords, 5);
  const chapterSource = lines.filter((line) => line.timeLabel).length > 0
    ? lines.filter((line, index) => line.timeLabel && index % Math.max(1, Math.floor(lines.length / 4)) === 0).slice(0, 5)
    : lines.slice(0, 4);
  const chapterTitles = dedupeTitles(chapterSource.map((line, index) => buildChapterTitle(line.text, index, keywords)));
  const chapters = chapterSource.map((line, index) => ({
    title: chapterTitles[index] ?? (index === 0 ? "Opening Hook" : `Chapter ${index + 1}`),
    timeLabel: line.timeLabel || `Part ${index + 1}`,
    summary: compactSentence(line.text, 130),
    seconds: line.seconds,
  }));
  const actionItems = [...topSentences(sentences.filter((sentence) => /\b(should|need to|review|test|build|plan|ship|compare|create)\b/i.test(sentence)), keywords, 3), options.audiencePreset === "founder" ? "Turn the strongest idea into one measurable experiment." : options.audiencePreset === "creator" ? "Convert one insight into a script hook and thumbnail test." : "Apply one useful idea this week."];
  const toolsMentioned = [...new Set((cleanedTranscript.match(/\b[A-Z][A-Za-z0-9+#.-]{2,}\b/g) ?? []).filter((item) => !["Host", "Today", "YouTube"].includes(item)))].slice(0, 8);
  const titleScore = Math.min(100, (options.title.trim().length >= 36 && options.title.trim().length <= 68 ? 30 : 16) + (/\b\d+\b/.test(options.title) ? 20 : 8) + (keywords.some((keyword) => options.title.toLowerCase().includes(keyword)) ? 20 : 10) + (/\b(best|secret|easy|fast|make|money|growth|strategy|guide)\b/i.test(options.title) ? 20 : 10));
  const titleNotes = [
    titleScore >= 75 ? "Title has a strong hook / specificity balance." : "Title can be sharpened with more specificity or a clearer promise.",
    /\b\d+\b/.test(options.title) ? "Numbers help credibility and click intent." : "Try adding a number, result, or timeframe.",
    keywords[0] ? `Try a version focused on ${keywords[0]}.` : "Use a concrete keyword from the transcript.",
  ];
  const summary: SummaryData = {
    headline: options.title.trim() || (keywords[0] ? `${keywords[0]} Brief` : "Transcript Brief"),
    overview: compactSentence(`${options.outputLanguage === "hinglish" ? "Scene yeh hai:" : options.outputLanguage === "ur-roman" ? "Seedhi baat:" : "Quick summary:"} ${takeaways.slice(0, 2).join(" ")}`, 320),
    takeaways,
    chapters,
    actionItems,
    keywords,
    stats: {
      wordCount: getWordCount(cleanedTranscript),
      readingMinutes: Math.max(1, Math.ceil(getWordCount(cleanedTranscript) / 220)),
      timestampCount: chapters.filter((chapter) => chapter.seconds !== null).length,
      transcriptLines: lines.length,
    },
  };
  const contentIdeas = [
    summary.takeaways[0] ? `Turn "${compactSentence(summary.takeaways[0], 70)}" into a short carousel.` : "",
    summary.chapters[0] ? `Use ${summary.chapters[0].timeLabel} as the hook for a short-form clip.` : "",
    keywords[0] ? `Create a practical breakdown on ${keywords[0]} with one real example.` : "",
  ].filter(Boolean);
  const businessIdeas = [
    keywords[0] ? `Package the ${keywords[0]} workflow into a checklist or service.` : "",
    summary.actionItems[0] ? `Turn the first action item into an offer or internal SOP.` : "",
    "Save the cleaned transcript plus brief as a reusable knowledge asset.",
  ].filter(Boolean);
  const descriptionHashtags = buildDescriptionHashtags(keywords);
  const packagingIdeas = buildPackagingIdeas({
    title: options.title.trim(),
    summary,
    keywords,
    quotes,
    audiencePreset: options.audiencePreset,
  });
  const shortsIdeas = buildShortsIdeas({
    summary,
    keywords,
    quotes,
  });
  const clipMoments = buildClipMoments({
    lines: lines.length > 0 ? lines : summary.chapters.map((chapter) => ({ timeLabel: chapter.timeLabel, seconds: chapter.seconds, text: chapter.summary })),
    keywords,
  });
  const renamedChapters = buildRenamedChapters(chapters);
  const youtubeDescription = buildYoutubeDescription({
    title: options.title.trim(),
    summary,
    hashtags: descriptionHashtags,
    outputLanguage: options.outputLanguage,
  });
  const platformPacks = buildPlatformPacks({
    title: options.title.trim(),
    url: options.url.trim(),
    summary,
    hashtags: descriptionHashtags,
  });
  const contentCalendar = buildContentCalendar({
    title: options.title.trim(),
    summary,
    shortsIdeas,
    clipMoments,
    renamedChapters,
  });
  const calendarPlan = buildCalendarPlan(contentCalendar);
  const copyDeck = buildCopyDeck(options.title, options.url, summary);
  copyDeck.description = youtubeDescription;
  copyDeck.calendar = calendarPlan;
  copyDeck.linkedin = platformPacks.linkedin;
  copyDeck.thread = platformPacks.thread;
  copyDeck.newsletter = platformPacks.newsletter;
  copyDeck.instagram = platformPacks.instagram;
  const uploadPack = buildUploadPack({
    title: options.title.trim(),
    url: options.url.trim(),
    summary,
    renamedChapters,
    packagingIdeas,
    shortsIdeas,
    clipMoments,
    youtubeDescription,
    platformPacks,
    contentCalendar,
    hashtags: descriptionHashtags,
  });
  copyDeck["upload-pack"] = uploadPack;
  return {
    cleanedTranscript,
    summary,
    quotes,
    contentIdeas,
    businessIdeas,
    toolsMentioned,
    titleScore,
    titleNotes,
    packagingIdeas,
    shortsIdeas,
    clipMoments,
    renamedChapters,
    descriptionHashtags,
    youtubeDescription,
    platformPacks,
    contentCalendar,
    calendarPlan,
    uploadPack,
    copyDeck,
  };
}

function inferChannelLabel(channelUrl: string): string {
  try {
    const parsed = new URL(channelUrl);
    const cleanPath = parsed.pathname.replace(/\/+$/, "");
    const leaf = cleanPath.split("/").filter(Boolean).at(-1) ?? "YouTube Channel";
    return leaf.startsWith("@") ? leaf.slice(1) : titleCase(leaf.replace(/[-_]+/g, " "));
  } catch {
    return "YouTube Channel";
  }
}

function parseRelativeAgeLabel(value: string): number | null {
  const match = value.toLowerCase().match(/(\d+)\s+(hour|day|week|month|year)/);
  if (!match) return null;
  const count = Number(match[1]);
  const unit = match[2];
  if (!Number.isFinite(count)) return null;
  if (unit.startsWith("hour")) return count / 24;
  if (unit.startsWith("day")) return count;
  if (unit.startsWith("week")) return count * 7;
  if (unit.startsWith("month")) return count * 30;
  return count * 365;
}

function parseViewCountLabel(value: string): number | null {
  const normalized = String(value ?? "").toLowerCase().replace(/views?/g, "").replace(/,/g, "").trim();
  const match = normalized.match(/([\d.]+)\s*([kmb])?/i);
  if (!match) return null;
  const amount = Number(match[1]);
  if (!Number.isFinite(amount)) return null;
  const suffix = (match[2] ?? "").toLowerCase();
  if (suffix === "k") return Math.round(amount * 1_000);
  if (suffix === "m") return Math.round(amount * 1_000_000);
  if (suffix === "b") return Math.round(amount * 1_000_000_000);
  return Math.round(amount);
}

function formatCompactViews(value: number): string {
  if (value >= 1_000_000) return `${Math.round((value / 100_000)) / 10}M`;
  if (value >= 1_000) return `${Math.round((value / 100)) / 10}K`;
  return `${Math.round(value)}`;
}

function averageMetric(values: Array<number | null | undefined>): number {
  const valid = values.filter((value): value is number => value !== null && value !== undefined && Number.isFinite(value));
  if (valid.length === 0) return 0;
  return valid.reduce((sum, value) => sum + value, 0) / valid.length;
}

function formatPercentage(value: number): string {
  return `${Math.round(value * 10) / 10}%`;
}

function formatCompactMetric(value: number): string {
  if (value >= 1_000_000) return `${Math.round((value / 100_000)) / 10}M`;
  if (value >= 1_000) return `${Math.round((value / 100)) / 10}K`;
  return `${Math.round(value * 10) / 10}`;
}

function formatDurationLabel(seconds: number): string {
  const safeSeconds = Math.max(0, Math.round(seconds));
  const minutes = Math.floor(safeSeconds / 60);
  const remaining = safeSeconds % 60;
  return `${minutes}:${String(remaining).padStart(2, "0")}`;
}

function summarizeTopTrafficSources(videoBreakdowns: ChannelDeepDiveVideo[]): string[] {
  const sourceCounts = new Map<string, number>();
  for (const video of videoBreakdowns) {
    for (const source of video.studioMetrics?.trafficSources ?? []) {
      if (!source.source) continue;
      sourceCounts.set(source.source, (sourceCounts.get(source.source) ?? 0) + (source.views ?? 0));
    }
  }

  return [...sourceCounts.entries()]
    .sort((left, right) => right[1] - left[1])
    .slice(0, 4)
    .map(([source]) => source);
}

function detectAudiencePositioning(source: string): string[] {
  const normalized = source.toLowerCase();
  const audience: string[] = [];
  if (/\bcreator|youtube|thumbnail|video|channel|views\b/.test(normalized)) audience.push("Speaks directly to creators and channel builders.");
  if (/\bfounder|startup|business|client|revenue|offer\b/.test(normalized)) audience.push("Frames content for founders, operators, or business-focused viewers.");
  if (/\bstudent|beginner|learn|start|first\b/.test(normalized)) audience.push("Keeps enough teaching cues to stay friendly for newer viewers.");
  if (/\bteam|workflow|system|process|sop\b/.test(normalized)) audience.push("Positions ideas as repeatable systems rather than one-off inspiration.");
  return uniqueItems(audience, 3);
}

function summarizeTitlePatterns(titles: string[]): string[] {
  const total = Math.max(1, titles.length);
  const numberCount = titles.filter((title) => /\b\d+\b/.test(title)).length;
  const questionCount = titles.filter((title) => /\?/.test(title)).length;
  const howToCount = titles.filter((title) => /^\s*how\s+to\b/i.test(title)).length;
  const versusCount = titles.filter((title) => /\bvs\b|versus/i.test(title)).length;
  const resultCount = titles.filter((title) => /\b(secret|strategy|playbook|system|guide|mistake|fix|review)\b/i.test(title)).length;
  const averageLength = Math.round(titles.reduce((sum, title) => sum + title.length, 0) / total);
  return [
    `Average title length sits around ${averageLength} characters, which is ${averageLength >= 38 && averageLength <= 68 ? "within a strong YouTube SEO range" : "worth tightening for cleaner search and CTR balance"}.`,
    `${Math.round((numberCount / total) * 100)}% of recent titles use numbers or concrete counts to add specificity.`,
    `${Math.round((questionCount / total) * 100)}% of titles lean on question framing, while ${Math.round((howToCount / total) * 100)}% start directly with a how-to promise.`,
    `${Math.round((resultCount / total) * 100)}% of titles use strategy / system / fix language, showing how explicit the channel is about outcomes.`,
    versusCount > 0 ? `${versusCount} recent titles use comparison framing, which suggests the channel occasionally wins clicks through contrast.` : "Comparison framing is mostly absent, so head-to-head titles are an obvious test area.",
  ];
}

function summarizeDescriptionSignals(videos: Array<{ description?: string }>): string[] {
  const descriptions = videos.map((video) => String(video.description ?? "").trim()).filter(Boolean);
  if (descriptions.length === 0) {
    return [
      "Descriptions were not available in the current sample, so this SEO read leans more heavily on titles and transcripts.",
      "Once descriptions are visible, use them to spot repeated CTA language, keyword stacking, and resource-link habits.",
    ];
  }

  const withLinks = descriptions.filter((description) => /https?:\/\//i.test(description)).length;
  const withHashtags = descriptions.filter((description) => /#[A-Za-z0-9_]+/.test(description)).length;
  const averageLength = Math.round(descriptions.reduce((sum, description) => sum + description.length, 0) / descriptions.length);

  return [
    `Average description length sits around ${averageLength} characters in the visible sample, which suggests ${averageLength >= 180 ? "the channel uses description space intentionally" : "descriptions are relatively light and title-led packaging is doing more of the work"}.`,
    `${Math.round((withLinks / descriptions.length) * 100)}% of sampled descriptions include links, pointing to how often the channel uses descriptions for CTA or resource routing.`,
    `${Math.round((withHashtags / descriptions.length) * 100)}% of sampled descriptions include hashtags, which gives a rough read on how much metadata padding the channel relies on.`,
  ];
}

function summarizeThumbnailTextSignals(videos: Array<{ thumbnailText?: string }>, titles: string[]): string[] {
  const thumbnailTexts = videos.map((video) => String(video.thumbnailText ?? "").trim()).filter(Boolean);
  if (thumbnailTexts.length === 0) {
    return [
      "Thumbnail OCR did not return strong text in this sample, which usually means the channel uses face-led or low-text thumbnails.",
      "Treat title formulas as the stronger packaging signal until thumbnail text is easier to read.",
    ];
  }

  const shortTextCount = thumbnailTexts.filter((value) => value.split(/\s+/).length <= 4).length;
  const titleOverlapCount = thumbnailTexts.filter((value, index) => {
    const title = titles[index] ?? "";
    return value && title && title.toLowerCase().includes(value.toLowerCase().split("|")[0].trim().toLowerCase());
  }).length;

  return [
    `${Math.round((shortTextCount / thumbnailTexts.length) * 100)}% of readable thumbnails use compact copy, which suggests ${shortTextCount > 0 ? "the channel often prefers punchy visual text over sentence-length overlays." : "thumbnail text is either longer-form or visually sparse rather than ultra-compact."}`,
    titleOverlapCount > 0 ? `${titleOverlapCount} thumbnails echo title language directly, so packaging repetition between title and thumbnail is part of the click system.` : "Thumbnail text often diverges from the title, so visual packaging likely adds a second angle rather than repeating the headline.",
    `Readable thumbnail text examples: ${thumbnailTexts.slice(0, 3).map((value) => `"${compactLabel(value, 28)}"`).join(", ")}.`,
  ];
}

function inferStyleDNA(text: string, titles: string[]): string[] {
  const normalized = text.toLowerCase();
  const tacticalHits = (normalized.match(/\b(system|process|framework|steps|review|plan|workflow|test|script|publish)\b/g) ?? []).length;
  const storyHits = (normalized.match(/\b(story|felt|realized|lesson|journey|experience|mistake|learned)\b/g) ?? []).length;
  const urgencyHits = (titles.join(" ").match(/\b(now|fast|quick|today|best|secret|mistake|fix)\b/gi) ?? []).length;
  return [
    tacticalHits >= storyHits ? "The channel sounds tactical-first: it teaches via frameworks, tests, workflows, and repeatable steps." : "The channel sounds story-led first, then converts lessons into tactics.",
    urgencyHits >= 2 ? "Title packaging leans on urgency and immediate payoff language instead of pure neutral descriptors." : "Packaging is relatively calm and could push harder on urgency if the goal is sharper click-through.",
    /\byou\b/.test(normalized) ? "Direct second-person phrasing shows the host talks to the viewer, not just about the topic." : "Viewer address is lighter, so the tone reads more observational than directly coaching.",
    /\bwe\b/.test(normalized) ? "Frequent 'we' language suggests collaborative team-style delivery instead of solo guru positioning." : "The delivery feels more individual and authority-led than team-led.",
  ];
}

function inferContentArchitecture(videoBreakdowns: ChannelDeepDiveVideo[], topicClusters: string[]): string[] {
  const themes = videoBreakdowns.map((video) => video.primaryTheme).filter(Boolean);
  const themeCounts = new Map<string, number>();
  for (const theme of themes) {
    themeCounts.set(theme, (themeCounts.get(theme) ?? 0) + 1);
  }
  const recurring = [...themeCounts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 3).map(([theme, count]) => `${titleCase(theme)} (${count})`);
  const seriesCount = videoBreakdowns.filter((video) => /\b(ep|episode|part|series)\b/i.test(video.title)).length;
  return [
    recurring.length > 0 ? `The recent feed clusters around these repeating content buckets: ${recurring.join(", ")}.` : `The recent feed still looks broad, with topic clusters around ${topicClusters.slice(0, 3).join(", ")}.`,
    seriesCount > 0 ? `${seriesCount} recent uploads use explicit series markers, which means the channel is comfortable building recurring formats.` : "Most recent uploads look standalone, so turning winners into named series is a practical growth lever.",
    videoBreakdowns.some((video) => video.transcriptAvailable) ? "Transcript-backed analysis suggests the channel teaches through repeatable concepts instead of one-off commentary alone." : "Without transcript coverage, the current read is title-led and should be treated as a lighter strategic snapshot.",
  ];
}

function inferPublishingSystem(videoBreakdowns: ChannelDeepDiveVideo[]): string[] {
  const ages = videoBreakdowns.map((video) => parseRelativeAgeLabel(video.publishedLabel)).filter((value): value is number => value !== null);
  const labeledCount = videoBreakdowns.filter((video) => video.publishedLabel).length;
  if (ages.length >= 2) {
    const span = Math.max(...ages) - Math.min(...ages);
    return [
      `Recent uploads span roughly ${Math.round(span)} days in the visible sample, which helps estimate the current publishing rhythm.`,
      labeledCount === videoBreakdowns.length ? "Every sampled video includes a recency label, so the cadence read is grounded in channel metadata rather than title inference alone." : "Some recency metadata is missing, so cadence is directional rather than exact.",
      span <= 21 ? "The channel appears actively publishing in a relatively tight recent window." : "The recent sample stretches out, which may indicate a slower cadence or broader archive mix on the page.",
    ];
  }

  return [
    labeledCount > 0 ? "The page includes some recency labels, but not enough to confidently estimate cadence from this sample alone." : "Publishing cadence could not be inferred cleanly from the available channel metadata.",
    "Use recent feed sequencing plus repeated themes to judge consistency until we add richer channel metadata.",
  ];
}

function buildViewSignals(videoBreakdowns: ChannelDeepDiveVideo[], topicClusters: string[]): string[] {
  const viewCounts = videoBreakdowns.map((video) => video.viewCount).filter((value): value is number => value !== null);
  const studioBackedVideos = videoBreakdowns.filter((video) => video.studioMetrics);
  const averageCtr = averageMetric(videoBreakdowns.map((video) => video.studioMetrics?.impressionsCtr));
  const averageRetention = averageMetric(videoBreakdowns.map((video) => video.studioMetrics?.averagePercentageViewed));
  const averageImpressions = averageMetric(videoBreakdowns.map((video) => video.studioMetrics?.impressions));
  const averageViewDuration = averageMetric(videoBreakdowns.map((video) => video.studioMetrics?.averageViewDurationSeconds));
  const topTrafficSources = summarizeTopTrafficSources(videoBreakdowns);

  if (viewCounts.length === 0 && studioBackedVideos.length === 0) {
    return [
      "Visible view-count labels were not available in this sample, so momentum signals are lighter than the rest of the audit.",
      "Once view labels appear consistently, use them to separate proven winners from merely repeated formats.",
    ];
  }

  const averageViews = viewCounts.reduce((sum, value) => sum + value, 0) / viewCounts.length;
  const sorted = [...videoBreakdowns]
    .filter((video) => video.viewCount !== null)
    .sort((left, right) => (right.viewCount ?? 0) - (left.viewCount ?? 0));
  const topVideo = sorted[0] ?? null;
  const medianViews = [...viewCounts].sort((left, right) => left - right)[Math.floor(viewCounts.length / 2)] ?? averageViews;
  const momentumRatio = medianViews > 0 ? averageViews / medianViews : 1;

  return uniqueItems([
    studioBackedVideos.length > 0
      ? `Imported Studio data covers ${studioBackedVideos.length}/${videoBreakdowns.length} selected videos, with average views around ${formatCompactViews(averageViews)} and impressions near ${formatCompactMetric(averageImpressions)}.`
      : `Average visible views sit around ${formatCompactViews(averageViews)}, which gives a rough read on current reach per sampled upload.`,
    topVideo?.viewCount !== null ? `The strongest visible pull currently comes from "${compactLabel(topVideo.title, 54)}" at about ${formatCompactViews(topVideo.viewCount)} views.` : "",
    averageCtr > 0 ? `Average click-through rate sits around ${formatPercentage(averageCtr)}, which helps separate weak packaging from weak topic demand.` : "",
    averageRetention > 0 ? `Average percentage viewed is about ${formatPercentage(averageRetention)}, so retention is ${averageRetention >= 45 ? "healthy enough to support repeatable winners" : "leaving room for sharper hooks and faster payoff delivery"}.` : "",
    averageViewDuration > 0 ? `Average view duration lands near ${formatDurationLabel(averageViewDuration)}, which gives a better watch-quality read than public view labels alone.` : "",
    momentumRatio >= 1.35 ? "The sample shows a few stronger spikes above the median, which suggests breakout-style topics or packaging outliers matter here." : "View performance looks relatively even across the visible sample, which suggests consistency may matter more than one-off spikes.",
    topTrafficSources[0] ? `Traffic-source mix is led by ${topTrafficSources.slice(0, 3).join(", ")}, which helps explain where discovery is actually coming from.` : "",
    topicClusters[0] ? `Use view labels to pressure-test whether ${topicClusters[0]} is just frequent or actually one of the channel's strongest audience magnets.` : "",
  ].filter(Boolean), 6);
}

function inferOpportunities(videoBreakdowns: ChannelDeepDiveVideo[], titlePatterns: string[], topicClusters: string[]): string[] {
  const lowSpecificityCount = videoBreakdowns.filter((video) => video.titleScore < 70).length;
  const noTranscriptCount = videoBreakdowns.filter((video) => !video.transcriptAvailable).length;
  const opportunities = [
    lowSpecificityCount > 0 ? `${lowSpecificityCount} recent titles could be sharpened with a number, timeframe, or more explicit result promise.` : "Recent titles already have decent specificity, so the next win is better contrast between formats rather than raw SEO tightening.",
    !titlePatterns.some((item) => item.toLowerCase().includes("comparison framing")) ? "Test comparison-style titles and contrarian framing to widen click appeal beyond the current formula." : "Comparison framing already appears, so the next win is likely stronger audience segmentation inside the title copy.",
    topicClusters[0] ? `Build a named series around ${topicClusters[0]} so repeated winners feel intentional instead of accidental.` : "Create one visible repeatable series so the audience can anticipate what comes next.",
    noTranscriptCount > 0 ? `${noTranscriptCount} videos could not be transcript-read, so richer style analysis would improve as caption coverage increases.` : "Transcript coverage is strong enough to start building reusable channel playbooks from the current sample.",
  ];
  return uniqueItems(opportunities, 4);
}

function buildTitleTemplates(titles: string[], topicClusters: string[]): string[] {
  const templates = titles.map((title) => {
    let next = title.replace(/\b\d+\b/g, "[Number]");
    for (const topic of topicClusters.slice(0, 4)) {
      const escaped = topic.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      next = next.replace(new RegExp(escaped, "ig"), "[Topic]");
    }
    next = next.replace(/\b(strategy|system|guide|review|mistake|fix|playbook)\b/gi, "[Angle]");
    next = next.replace(/\b(you|your|creators?|founders?|students?|teams?)\b/gi, "[Audience]");
    next = next.replace(/\s+/g, " ").trim();
    return compactLabel(next, 72);
  });

  const fallback = [
    "How To [Topic] Without [Main Friction]",
    "[Number] [Topic] Fixes That Improve [Outcome]",
    "[Topic] [Angle]: What Actually Works",
    "The [Topic] Playbook For [Audience]",
  ];
  return uniqueItems([...templates, ...fallback], 5);
}

function buildNextVideoIdeas(topicClusters: string[], titleTemplates: string[], videoBreakdowns: ChannelDeepDiveVideo[]): string[] {
  const topTheme = topicClusters[0] ?? "Creator Workflow";
  const secondTheme = topicClusters[1] ?? topTheme;
  const weakerTitle = videoBreakdowns.find((video) => video.titleScore < 72);
  return uniqueItems([
    `Make a sharper follow-up on ${topTheme} with one measurable result in the title.`,
    `Turn ${secondTheme} into a beginner-friendly breakdown that uses a before/after example.`,
    weakerTitle ? `Rewrite and remake the idea behind "${compactLabel(weakerTitle.title, 52)}" with a stronger payoff promise.` : "",
    titleTemplates[0] ? titleTemplates[0].replace(/\[Topic\]/g, topTheme).replace(/\[Number\]/g, "3").replace(/\[Angle\]/g, "Guide").replace(/\[Audience\]/g, "Creators") : "",
    titleTemplates[1] ? titleTemplates[1].replace(/\[Topic\]/g, secondTheme).replace(/\[Number\]/g, "5").replace(/\[Angle\]/g, "Fix").replace(/\[Audience\]/g, "Founders") : "",
  ].filter(Boolean), 5);
}

function clampScore(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function buildChannelScorecard(videoBreakdowns: ChannelDeepDiveVideo[], transcriptCoverage: number, styleDNA: string[], titlePatterns: string[]): ChannelScorecardItem[] {
  const averageTitleScore = videoBreakdowns.length > 0
    ? videoBreakdowns.reduce((sum, video) => sum + video.titleScore, 0) / videoBreakdowns.length
    : 0;
  const themeCounts = new Map<string, number>();
  for (const video of videoBreakdowns) {
    const key = video.primaryTheme.toLowerCase();
    themeCounts.set(key, (themeCounts.get(key) ?? 0) + 1);
  }
  const sortedThemeCounts = [...themeCounts.values()].sort((left, right) => right - left);
  const topThemeShare = videoBreakdowns.length > 0
    ? ((sortedThemeCounts[0] ?? 0) + (sortedThemeCounts[1] ?? 0)) / videoBreakdowns.length
    : 0;
  const averageTranscriptWords = videoBreakdowns.filter((video) => video.transcriptAvailable).length > 0
    ? videoBreakdowns.filter((video) => video.transcriptAvailable).reduce((sum, video) => sum + video.transcriptWordCount, 0) / videoBreakdowns.filter((video) => video.transcriptAvailable).length
    : 0;
  const averageViews = averageMetric(videoBreakdowns.map((video) => video.viewCount));
  const averageCtr = averageMetric(videoBreakdowns.map((video) => video.studioMetrics?.impressionsCtr));
  const averageRetention = averageMetric(videoBreakdowns.map((video) => video.studioMetrics?.averagePercentageViewed));
  const tacticalSignal = /(framework|playbook|system|template|guide|steps?|mistake|fix)/i.test([styleDNA.join(" "), titlePatterns.join(" ")].join(" "))
    ? 8
    : 0;
  const repurposeSignal = videoBreakdowns.filter((video) => video.titleScore >= 72).length / Math.max(videoBreakdowns.length, 1);
  const audiencePullScoreBase = averageViews > 0 ? Math.min(96, 36 + Math.log10(averageViews + 1) * 12) : 42;
  const studioBonus = (averageCtr > 0 ? Math.min(10, averageCtr * 1.2) : 0) + (averageRetention > 0 ? Math.min(12, averageRetention / 5) : 0);

  return [
    {
      label: "SEO Packaging",
      score: clampScore(averageTitleScore),
      note: `Recent titles average ${Math.round(averageTitleScore)} on packaging strength, which shows how searchable and clickable the feed feels.`,
    },
    {
      label: "Topic Focus",
      score: clampScore(58 + (topThemeShare * 34)),
      note: `${Math.round(topThemeShare * 100)}% of sampled videos cluster around the top two themes, so the channel feels ${topThemeShare >= 0.7 ? "highly focused" : "moderately spread"} in positioning.`,
    },
    {
      label: "Teaching Depth",
      score: clampScore((transcriptCoverage * 0.58) + Math.min(34, averageTranscriptWords / 55)),
      note: `Transcript coverage sits at ${transcriptCoverage}% with roughly ${Math.round(averageTranscriptWords)} words per transcript-backed video.`,
    },
    {
      label: "Repurpose Leverage",
      score: clampScore((transcriptCoverage * 0.42) + (repurposeSignal * 36) + 22 + tacticalSignal),
      note: "This estimates how easily the channel can be turned into clips, threads, posts, and repeatable content systems.",
    },
    {
      label: "Audience Pull",
      score: clampScore(audiencePullScoreBase + studioBonus),
      note: averageCtr > 0 || averageRetention > 0
        ? `Studio-backed reach averages about ${formatCompactViews(averageViews)}, with CTR near ${formatPercentage(averageCtr)} and retention around ${formatPercentage(averageRetention)}.`
        : averageViews > 0
          ? `Visible sample views average roughly ${formatCompactViews(averageViews)}, which helps estimate how much audience pull the current formats have.`
          : "View labels are too light in this sample for a stronger audience-pull read, so treat this as directional.",
    },
  ];
}

function buildSignatureMoves(titlePatterns: string[], styleDNA: string[], contentArchitecture: string[], audiencePositioning: string[]): string[] {
  return uniqueItems([
    titlePatterns[0] ? `Packaging move: ${titlePatterns[0]}` : "",
    styleDNA[0] ? `Delivery move: ${styleDNA[0]}` : "",
    contentArchitecture[0] ? `Content system move: ${contentArchitecture[0]}` : "",
    audiencePositioning[0] ? `Audience move: ${audiencePositioning[0]}` : "",
    styleDNA[1] ? `Secondary cue: ${styleDNA[1]}` : "",
  ].filter(Boolean), 5);
}

function buildTakeoverSprint(channelLabel: string, topicClusters: string[], nextVideoIdeas: string[], opportunityFinder: string[], titleTemplates: string[]): string[] {
  const primaryTheme = topicClusters[0] ?? "the main channel theme";
  const secondaryTheme = topicClusters[1] ?? primaryTheme;
  return uniqueItems([
    `Week 1: map ${channelLabel}'s best-performing promise around ${primaryTheme}, then rewrite three of your own titles using that payoff structure.`,
    `Week 2: publish one sharper video on ${secondaryTheme} with a title that names the result in the first 45 characters.`,
    nextVideoIdeas[0] ? `Week 3: ship this angle fast -> ${nextVideoIdeas[0]}` : "",
    opportunityFinder[0] ? `Week 4: attack the whitespace -> ${opportunityFinder[0]}` : "",
    titleTemplates[0] ? `Keep one repeatable packaging formula live: ${titleTemplates[0]}` : "",
  ].filter(Boolean), 5);
}

function modeLabel(values: string[], fallback: string): string {
  const counts = new Map<string, number>();
  for (const value of values.map((item) => item.trim()).filter(Boolean)) {
    counts.set(value, (counts.get(value) ?? 0) + 1);
  }
  return [...counts.entries()].sort((left, right) => right[1] - left[1])[0]?.[0] ?? fallback;
}

function ratioToPercentage(count: number, total: number): number {
  if (total <= 0) return 0;
  return Math.round((count / total) * 100);
}

function inferVideoFormat(title: string, transcript: string): string {
  const normalized = `${title} ${transcript}`.toLowerCase();
  if (/\b(interview|podcast|conversation|guest)\b/.test(normalized)) return "Interview";
  if (/\b(reaction|reacts?)\b/.test(normalized)) return "Reaction";
  if (/\b(review|tested?|tool review)\b/.test(normalized)) return "Review";
  if (/\b(vs|versus|compare|comparison)\b/.test(normalized)) return "Comparison";
  if (/\b(case study|i tried|we tried|breakdown of)\b/.test(normalized)) return "Case Study";
  if (/\b(top \d+|\d+ ways|\d+ mistakes|\d+ lessons|\d+ ideas)\b/.test(normalized)) return "List";
  if (/\b(how to|guide|playbook|framework|system|template|fix)\b/.test(normalized)) return "Tutorial";
  if (/\b(why|truth|opinion|hot take|wrong about)\b/.test(normalized)) return "Commentary";
  return "Breakdown";
}

function inferHookType(title: string, transcript: string): string {
  const intro = `${title}. ${transcript}`.slice(0, 320).toLowerCase();
  if (/\b(i used to|this happened|last year|once|when i|story|journey)\b/.test(intro)) return "Story-first";
  if (/\b(problem|mistake|wrong|avoid|struggle|pain|failing|stuck)\b/.test(intro)) return "Pain-first";
  if (/\b(results?|grew|made|generated|earned|views|subscribers|proof)\b/.test(intro)) return "Proof-first";
  if (/\b(secret|truth|actually|nobody tells you|real reason)\b/.test(intro)) return "Bold-claim";
  if (/\b(by the end|today we're|in this video|i'm going to show|here's how|let's break down)\b/.test(intro)) return "Roadmap-first";
  if (/\b(you will|you'll|this will|the fastest way|how to)\b/.test(intro)) return "Result-first";
  return "Direct-payoff";
}

function inferCtaType(description: string, transcript: string): string {
  const normalized = `${description} ${transcript}`.toLowerCase();
  if (/\b(course|community|consult|coaching|agency|book a call|work with me)\b/.test(normalized)) return "Offer CTA";
  if (/\b(newsletter|template|download|free guide|free resource|link below|get the)\b/.test(normalized)) return "Lead Magnet";
  if (/\b(sponsor|sponsored|affiliate|use code|discount|partner)\b/.test(normalized)) return "Sponsor CTA";
  if (/\b(subscribe|comment|like this video|leave a comment|share this)\b/.test(normalized)) return "Engagement CTA";
  return "Low CTA";
}

function inferToneTraits(aggregateText: string, titles: string[]): string[] {
  const normalized = `${titles.join(" ")} ${aggregateText}`.toLowerCase();
  const traits = [
    /\b(framework|playbook|system|template|process|steps?)\b/.test(normalized) ? "Tactical" : "",
    /\b(review|analy|compare|breakdown|case study)\b/.test(normalized) ? "Analytical" : "",
    /\b(story|journey|experience|learned|lesson)\b/.test(normalized) ? "Story-led" : "",
    /\b(beginner|simple|easy|clear)\b/.test(normalized) ? "Beginner-friendly" : "",
    /\b(stop|avoid|mistake|wrong|truth)\b/.test(normalized) ? "Contrarian" : "",
    /\b(fast|quick|immediately|today)\b/.test(normalized) ? "Urgent" : "",
  ].filter(Boolean);
  return uniqueItems(traits.length > 0 ? traits : ["Practical", "Direct"], 3);
}

function buildChannelDNA(
  channelLabel: string,
  aggregateText: string,
  titlePatterns: string[],
  topicClusters: string[],
  audiencePositioning: string[],
  styleDNA: string[],
  videoBreakdowns: ChannelDeepDiveVideo[],
): ChannelDNA {
  const tone = inferToneTraits(aggregateText, videoBreakdowns.map((video) => video.title));
  const formats = uniqueItems(videoBreakdowns.map((video) => video.formatType), 3);
  const audience = uniqueItems(audiencePositioning, 3);
  const pillars = uniqueItems(topicClusters, 4);
  const dominantFormat = formats[0] ?? "breakdown";
  const dominantTone = tone[0]?.toLowerCase() ?? "practical";
  const promise = compactSentence(
    `${channelLabel} promises clearer wins around ${pillars[0] ?? "its main topic"} through ${dominantTone} ${dominantFormat.toLowerCase()} videos that push toward concrete outcomes.`,
    170,
  );
  const creatorEdge = uniqueItems([
    pillars[0] ? `Turns ${pillars[0]} into repeatable, creator-friendly lessons.` : "",
    titlePatterns[0] ? `Packaging is anchored in ${titlePatterns[0].toLowerCase()}.` : "",
    styleDNA[0] ? styleDNA[0] : "",
  ].filter(Boolean), 3);

  return {
    audience: audience.length > 0 ? audience : ["Audience intent is still emerging from the current sample."],
    promise,
    pillars,
    formats,
    tone,
    creatorEdge,
  };
}

function scoreVideoPerformance(video: ChannelDeepDiveVideo, baselineViews: number): number {
  const viewRatio = baselineViews > 0 && video.viewCount !== null ? Math.min(1.7, video.viewCount / baselineViews) : 0.7;
  const ctrBonus = video.studioMetrics?.impressionsCtr ? Math.min(18, video.studioMetrics.impressionsCtr * 2) : 0;
  const retentionBonus = video.studioMetrics?.averagePercentageViewed ? Math.min(18, video.studioMetrics.averagePercentageViewed / 4.5) : 0;
  const transcriptBonus = video.transcriptAvailable ? Math.min(8, video.transcriptWordCount / 220) : 0;
  return (video.titleScore * 0.58) + (viewRatio * 18) + ctrBonus + retentionBonus + transcriptBonus;
}

function buildCloneScores(
  videoBreakdowns: ChannelDeepDiveVideo[],
  transcriptCoverage: number,
  titlePatterns: string[],
  titleTemplates: string[],
  aggregateText: string,
  descriptions: string[],
): ChannelScorecardItem[] {
  const averageTitleScore = averageMetric(videoBreakdowns.map((video) => video.titleScore));
  const topThemeShare = (() => {
    const counts = new Map<string, number>();
    for (const video of videoBreakdowns) {
      const key = video.primaryTheme.toLowerCase();
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }
    const sorted = [...counts.values()].sort((left, right) => right - left);
    return videoBreakdowns.length > 0 ? ((sorted[0] ?? 0) + (sorted[1] ?? 0)) / videoBreakdowns.length : 0;
  })();
  const firstPersonShare = videoBreakdowns.length > 0
    ? videoBreakdowns.filter((video) => /\b(i|my|me|our|we)\b/i.test(video.title)).length / videoBreakdowns.length
    : 0;
  const storySignal = /\b(story|journey|experience|i learned|we learned)\b/i.test(aggregateText) ? 0.18 : 0;
  const linksInDescriptions = descriptions.filter((description) => /https?:\/\//i.test(description)).length;
  const monetizationMarkers = descriptions.filter((description) => /\b(newsletter|template|download|course|consult|affiliate|sponsor|community|link below)\b/i.test(description)).length;
  const packagingDependence = clampScore((averageTitleScore * 0.7) + Math.min(16, titleTemplates.length * 4) + Math.min(14, titlePatterns.length * 2.4));
  const systemStrength = clampScore(44 + (topThemeShare * 32) + (transcriptCoverage * 0.18) + Math.min(12, titleTemplates.length * 2.5));
  const personalityDependence = clampScore((firstPersonShare * 56) + (storySignal * 100) + (/\b(interview|podcast|conversation)\b/i.test(aggregateText) ? 12 : 4));
  const monetizationMaturity = clampScore((ratioToPercentage(linksInDescriptions, descriptions.length) * 0.34) + (ratioToPercentage(monetizationMarkers, descriptions.length) * 0.48) + 14);
  const cloneability = clampScore(42 + (systemStrength * 0.42) + (packagingDependence * 0.14) + (transcriptCoverage * 0.12) - (personalityDependence * 0.34));

  return [
    {
      label: "Cloneability",
      score: cloneability,
      note: cloneability >= 70
        ? "The channel looks system-led enough to adapt without copying the creator's identity."
        : "Parts of the strategy are reusable, but you'll need heavier adaptation before it fits another channel cleanly.",
    },
    {
      label: "System Strength",
      score: systemStrength,
      note: `${Math.round(topThemeShare * 100)}% of the sample sits inside the top two themes, which makes the growth engine feel ${systemStrength >= 70 ? "structured and repeatable" : "more mixed than locked-in"}.`,
    },
    {
      label: "Packaging Dependence",
      score: packagingDependence,
      note: `Titles average ${Math.round(averageTitleScore)}/100 and the feed shows ${titleTemplates.length} reusable packaging templates in the current sample.`,
    },
    {
      label: "Personality Dependence",
      score: personalityDependence,
      note: personalityDependence >= 65
        ? "The channel leans heavily on the creator's voice or story, so clone the structure more than the persona."
        : "The feed reads more system-first than personality-first, which makes adaptation easier.",
    },
    {
      label: "Monetization Maturity",
      score: monetizationMaturity,
      note: descriptions.length === 0
        ? "Description coverage is light in this sample, so monetization maturity is still directional."
        : `${ratioToPercentage(linksInDescriptions, descriptions.length)}% of sampled descriptions contain links, and ${ratioToPercentage(monetizationMarkers, descriptions.length)}% show explicit offer or resource language.`,
    },
  ];
}

function buildWinnerPatterns(videoBreakdowns: ChannelDeepDiveVideo[], baselineViews: number): string[] {
  const ranked = [...videoBreakdowns]
    .map((video) => ({ video, score: scoreVideoPerformance(video, baselineViews) }))
    .sort((left, right) => right.score - left.score);
  const winners = ranked.slice(0, Math.min(3, ranked.length)).map((item) => item.video);
  const lowerHalf = ranked.slice(Math.max(0, Math.floor(ranked.length / 2))).map((item) => item.video);
  const winnerFormat = modeLabel(winners.map((video) => video.formatType), "Breakdown");
  const winnerHook = modeLabel(winners.map((video) => video.hookType), "Direct-payoff");
  const winnerTheme = modeLabel(winners.map((video) => video.primaryTheme), "the core theme");
  const winnerCta = modeLabel(winners.map((video) => video.ctaType), "Low CTA");
  const winnerScore = winners.length > 0 ? Math.round(averageMetric(winners.map((video) => video.titleScore))) : 0;
  const baselineScore = lowerHalf.length > 0 ? Math.round(averageMetric(lowerHalf.map((video) => video.titleScore))) : winnerScore;

  return uniqueItems([
    winners.length > 0 ? `Top performers cluster around ${winnerTheme}, which suggests the channel wins when it stays closest to that promise.` : "",
    winners.length > 0 ? `${winnerFormat} is the dominant winning format in the current sample.` : "",
    winners.length > 0 ? `${winnerHook} is the most common opening shape among the strongest videos.` : "",
    winners.length > 0 ? `Winner titles average ${winnerScore}/100 versus ${baselineScore}/100 for the lower half, so packaging quality is materially different.` : "",
    winnerCta !== "Low CTA" ? `The stronger videos usually pair the content with ${winnerCta.toLowerCase()} rather than leaving the call-to-action vague.` : "Winning videos tend to sell the idea first and keep the CTA lighter.",
  ].filter(Boolean), 5);
}

function buildThumbnailPlaybook(videos: Array<{ thumbnailText?: string; title: string }>): string[] {
  const readableTexts = videos.map((video) => String(video.thumbnailText ?? "").trim()).filter(Boolean);
  const compactThumbs = readableTexts.filter((text) => text.split(/\s+/).length <= 4).length;
  const zeroTextCount = videos.length - readableTexts.length;
  return uniqueItems([
    readableTexts.length > 0 ? `${ratioToPercentage(compactThumbs, readableTexts.length)}% of readable thumbnails use four words or fewer, so the channel usually favors short visual copy.` : "Thumbnail OCR is sparse in this sample, which often means the channel leans more on imagery or face-led composition than text.",
    zeroTextCount > 0 ? `${zeroTextCount} sampled thumbnails returned no meaningful OCR text, so low-text packaging is part of the visual system.` : "",
    readableTexts[0] ? `When text does appear, keep it punchy and support the title rather than repeating it verbatim.` : "Treat the thumbnail as a second promise layer, not a paragraph.",
  ].filter(Boolean), 4);
}

function buildThumbnailBoard(videos: Array<{ title: string; thumbnailText?: string }>): ThumbnailBoard {
  const readableEntries = videos
    .map((video) => ({
      title: video.title,
      thumbnailText: String(video.thumbnailText ?? "").trim(),
    }))
    .filter((video) => video.thumbnailText);
  const readableTexts = readableEntries.map((video) => video.thumbnailText);
  const compactCount = readableTexts.filter((text) => text.split(/\s+/).length <= 4).length;
  const zeroTextCount = videos.length - readableTexts.length;
  const averageWords = readableTexts.length > 0
    ? Math.round(readableTexts.reduce((sum, text) => sum + text.split(/\s+/).filter(Boolean).length, 0) / readableTexts.length)
    : 0;
  const overlapCount = readableEntries.filter((video) => {
    const thumbTokens = video.thumbnailText.toLowerCase().split(/[\s|]+/).filter((token) => token.length >= 4);
    const title = video.title.toLowerCase();
    return thumbTokens.some((token) => title.includes(token));
  }).length;
  const complementaryCount = readableEntries.length - overlapCount;
  const repeatedPhrases = collectKeywords(splitSentences(readableTexts.join(". "))).slice(0, 5).map((item) => titleCase(item));
  const examples = readableEntries.slice(0, 6).map((video) => ({
    title: compactLabel(video.title, 78),
    thumbnailText: compactLabel(video.thumbnailText, 64),
  }));

  const summary = readableTexts.length === 0
    ? "The current sample reads as image-led or low-text on thumbnails, so the channel likely relies more on composition and title pairing than visible text overlays."
    : compactSentence(
      `This thumbnail system is ${compactCount >= Math.ceil(readableTexts.length * 0.6) ? "compact-copy first" : "mixed between compact and longer text"} with ${zeroTextCount > 0 ? `${zeroTextCount} low-text thumbnails in the sample` : "consistent readable overlay text"}. ${complementaryCount > overlapCount ? "Thumbnail text usually adds a second angle beyond the title." : "Thumbnail text often reinforces the title directly."}`,
      220,
    );

  return {
    summary,
    densityNotes: uniqueItems([
      readableTexts.length > 0 ? `${ratioToPercentage(readableTexts.length, videos.length)}% of sampled thumbnails returned readable OCR text.` : "Readable thumbnail text was limited in this sample.",
      readableTexts.length > 0 ? `${ratioToPercentage(compactCount, readableTexts.length)}% of readable thumbnails stay at four words or fewer.` : "",
      zeroTextCount > 0 ? `${zeroTextCount} thumbnails appear low-text or image-led, which suggests the channel is comfortable letting the visual do more of the work.` : "",
      averageWords > 0 ? `Readable thumbnails average about ${averageWords} words of visible text.` : "",
    ].filter(Boolean), 4),
    messagingNotes: uniqueItems([
      overlapCount > 0 ? `${overlapCount} readable thumbnails echo title language directly, which means repetition is part of the click system.` : "",
      complementaryCount > 0 ? `${complementaryCount} readable thumbnails add a second angle rather than repeating the exact title promise.` : "",
      repeatedPhrases[0] ? `The visual vocabulary keeps circling back to phrases around ${repeatedPhrases.slice(0, 3).join(", ")}.` : "",
    ].filter(Boolean), 4),
    repeatedPhrases,
    rules: uniqueItems([
      compactCount >= Math.ceil(Math.max(1, readableTexts.length) * 0.6) ? "Keep thumbnail text short and forceful instead of sentence-length overlays." : "Tighten thumbnail copy where possible so the promise lands faster.",
      complementaryCount > overlapCount ? "Let the thumbnail add a second angle instead of repeating the title word-for-word." : "Use the title and thumbnail together to hammer the same core promise when clarity matters most.",
      zeroTextCount > 0 ? "Do not assume every winning thumbnail needs text; some of the packaging is clearly image-led." : "",
      repeatedPhrases[0] ? `Build a repeatable visual lexicon around words like ${repeatedPhrases.slice(0, 3).join(", ")} without turning the board into a copy-paste template.` : "",
    ].filter(Boolean), 4),
    examples,
  };
}

function buildHookPlaybook(videoBreakdowns: ChannelDeepDiveVideo[]): string[] {
  const dominantHook = modeLabel(videoBreakdowns.map((video) => video.hookType), "Direct-payoff");
  const roadmapCount = videoBreakdowns.filter((video) => video.hookType === "Roadmap-first").length;
  const proofCount = videoBreakdowns.filter((video) => video.hookType === "Proof-first").length;
  return uniqueItems([
    `${dominantHook} is the dominant opening style across the current sample.`,
    roadmapCount > 0 ? `${ratioToPercentage(roadmapCount, videoBreakdowns.length)}% of sampled videos open by clearly signaling where the video is headed.` : "",
    proofCount > 0 ? `${ratioToPercentage(proofCount, videoBreakdowns.length)}% of sampled videos lead with proof, outcomes, or hard payoff language before explanation.` : "",
    "If you borrow this system, keep the first 15-30 seconds brutally clear on what result the viewer is about to get.",
  ].filter(Boolean), 4);
}

function buildAudienceIntel(
  audiencePositioning: string[],
  viewSignals: string[],
  opportunityFinder: string[],
  topicClusters: string[],
): string[] {
  return uniqueItems([
    audiencePositioning[0] ?? "",
    audiencePositioning[1] ?? "",
    topicClusters[0] ? `The audience appears to reward clarity around ${topicClusters[0]} more than broad lifestyle or personality content.` : "",
    viewSignals[0] ?? "",
    opportunityFinder[0] ? `A likely audience request gap: ${opportunityFinder[0]}` : "",
  ].filter(Boolean), 5);
}

function buildCommentIntelligence(videos: Array<{
  topComments?: Array<{
    author: string;
    text: string;
    likeCount: string;
    publishedLabel: string;
  }>;
  commentCountLabel?: string;
}>): string[] {
  const comments = videos.flatMap((video) => Array.isArray(video.topComments) ? video.topComments : []);
  if (comments.length === 0) {
    return ["Top comments were not available in this sample yet, so audience intelligence still leans on titles, transcripts, and visible view signals."];
  }

  const normalized = comments.map((comment) => comment.text.toLowerCase());
  const praiseCount = normalized.filter((text) => /\b(great|good|love|amazing|awesome|helpful|useful|brilliant|perfect|genius|legend)\b/.test(text)).length;
  const requestComments = comments.filter((comment) => /\b(please|can you|could you|would love|more on|make a video|next video|part 2|do one on|cover)\b/i.test(comment.text));
  const confusionComments = comments.filter((comment) => /\b(confused|don't understand|dont understand|what do you mean|question|how do|why does|not sure)\b/i.test(comment.text));
  const requestKeywords = collectKeywords(splitSentences(requestComments.map((comment) => comment.text).join(". "))).slice(0, 4).map((item) => titleCase(item));
  const loudestComment = comments[0];
  const likeHeavyComment = comments.find((comment) => comment.likeCount) ?? loudestComment;
  const commentCountLabel = videos.map((video) => String(video.commentCountLabel ?? "").trim()).find(Boolean) ?? "";

  return uniqueItems([
    commentCountLabel ? `The visible sample points to ${commentCountLabel.toLowerCase()}, so audience signal is strong enough to influence strategy, not just flavor text.` : "Comments are active enough in the current sample to treat audience feedback as a real strategy input.",
    praiseCount > 0 ? `${ratioToPercentage(praiseCount, comments.length)}% of sampled top comments read as explicit praise, which suggests the channel is delivering a recognizable payoff.` : "",
    requestComments.length > 0 ? `Viewer requests are visible in the top comments, especially around ${requestKeywords.join(", ") || "follow-up coverage"}, so the audience is actively steering future topics.` : "Top comments are less request-heavy and more reaction-heavy, which usually means the current packaging already matches audience intent.",
    confusionComments.length > 0 ? `${confusionComments.length} sampled top comments still ask clarifying questions, which hints at a chance to tighten examples or simplify explanations.` : "",
    loudestComment?.text ? `Highest-signal comment vibe: "${compactLabel(loudestComment.text, 110)}"` : "",
    likeHeavyComment?.likeCount ? `One of the strongest visible audience endorsements sits around ${likeHeavyComment.likeCount} likes, which helps separate passing reactions from real resonance.` : "",
  ].filter(Boolean), 6);
}

function buildMonetizationSignals(videos: Array<{ description?: string; transcript?: string }>): string[] {
  const descriptions = videos.map((video) => String(video.description ?? "").trim()).filter(Boolean);
  const combined = videos.map((video) => `${video.description ?? ""} ${video.transcript ?? ""}`.toLowerCase());
  const linkCount = descriptions.filter((description) => /https?:\/\//i.test(description)).length;
  const leadMagnetCount = combined.filter((text) => /\b(newsletter|template|download|free guide|resource|link below)\b/.test(text)).length;
  const offerCount = combined.filter((text) => /\b(course|consult|coaching|community|book a call|work with me)\b/.test(text)).length;
  const sponsorCount = combined.filter((text) => /\b(sponsor|sponsored|affiliate|use code|partner)\b/.test(text)).length;

  return uniqueItems([
    descriptions.length > 0 ? `${ratioToPercentage(linkCount, descriptions.length)}% of sampled descriptions contain links, so the channel is using YouTube as a routing surface rather than leaving the description empty.` : "Description coverage is too thin to map monetization deeply yet.",
    leadMagnetCount > 0 ? `${leadMagnetCount} sampled videos reference free resources, templates, or newsletter-style lead magnets.` : "",
    offerCount > 0 ? `${offerCount} sampled videos show direct offer language, which suggests the channel monetizes beyond pure ad revenue.` : "",
    sponsorCount > 0 ? `${sponsorCount} sampled videos contain sponsor or affiliate markers.` : "",
  ].filter(Boolean), 4);
}

function buildAdaptationPlan(
  channelLabel: string,
  cloneContext: CloneContext,
  channelDNA: ChannelDNA,
  cloneScores: ChannelScorecardItem[],
  titleTemplates: string[],
  hookPlaybook: string[],
  topicClusters: string[],
): ChannelAdaptationPlan {
  const cloneability = cloneScores.find((item) => item.label === "Cloneability")?.score ?? 0;
  const personalityDependence = cloneScores.find((item) => item.label === "Personality Dependence")?.score ?? 0;
  const dominantFormat = channelDNA.formats[0] ?? "Breakdown";
  const topPillar = channelDNA.pillars[0] ?? topicClusters[0] ?? "your main topic";
  const nicheLine = cloneContext.niche.trim() ? ` for ${cloneContext.niche.trim()}` : "";
  const goalLine = cloneContext.goal === "sales"
    ? "Lead with one educational format that naturally supports a product or service CTA."
    : cloneContext.goal === "authority"
      ? "Favor breakdowns and case studies that build trust faster than trend-chasing uploads."
      : cloneContext.goal === "subs"
        ? "Bias toward repeatable series that train viewers to come back."
        : "Bias toward sharper packaging and faster hooks to maximize top-of-funnel pull.";

  return {
    fits: uniqueItems([
      cloneability >= 70 ? `${channelLabel}'s system looks structured enough to adapt${nicheLine} without copying it outright.` : `Use ${channelLabel} as a pattern source, but expect to translate the system before it fits${nicheLine}.`,
      titleTemplates[0] ? `Borrow the title structure behind "${titleTemplates[0]}" and rewrite it in your own words.` : "",
      hookPlaybook[0] ? `Keep the opening logic from the channel: ${hookPlaybook[0].replace(/\.$/, "")}.` : "",
    ].filter(Boolean), 3),
    adapt: uniqueItems([
      cloneContext.presentationStyle === "faceless"
        ? `Translate the strategy into faceless-friendly ${dominantFormat.toLowerCase()} videos that rely on proof, screenshots, or examples instead of personality shots.`
        : `Use the channel's structure, but let your on-camera delivery create a distinct brand feel.`,
      `Rebuild the top pillar around ${topPillar}${nicheLine} instead of mirroring the target channel's exact topic wording.`,
      goalLine,
    ].filter(Boolean), 3),
    avoid: uniqueItems([
      "Do not reuse exact title wording, catchphrases, or signature series names.",
      "Do not mirror thumbnail composition shot-for-shot, even if the psychology is worth borrowing.",
      personalityDependence >= 65 ? "Avoid imitating the creator's persona directly. Copy the structure, not the voice." : "Avoid becoming too surface-level with the clone. Keep the logic and change the expression.",
    ], 3),
    firstMoves: uniqueItems([
      `Publish one ${dominantFormat.toLowerCase()} video around ${topPillar} using a sharper payoff-driven title.`,
      "Test one direct-payoff intro against one roadmap-first intro and compare which feels more natural to your audience.",
      "Turn your best-performing topic into a named mini-series so the packaging becomes easier to repeat.",
    ], 3),
    day30: uniqueItems([
      `Ship 4 videos that stay inside one primary pillar: ${topPillar}.`,
      "Reuse 2-3 title structures instead of inventing a new packaging style every upload.",
      "Keep one post-publish review doc tracking hook quality, title strength, and retention risks.",
    ], 3),
    day60: uniqueItems([
      "Double down on the pillar that gives the cleanest click-to-retention fit.",
      "Build one repeatable CTA that matches your goal, then attach it to your strongest format.",
      "Start comparing your winners versus your baseline uploads to spot the repeatable pattern earlier.",
    ], 3),
    day90: uniqueItems([
      `Turn the best-performing pillar into a durable content system${nicheLine}.`,
      "Package the strongest lessons into shorts, threads, or newsletter assets to compound the channel's reach.",
      "Keep the structural DNA of the target channel while making the tone, examples, and visual language unmistakably yours.",
    ], 3),
    differentiate: uniqueItems([
      "Keep the lesson. Change the wording.",
      "Keep the hook logic. Change the persona and examples.",
      "Keep the packaging psychology. Change the visual treatment.",
    ], 3),
  };
}

function buildChannelDeepDiveExport(bundle: ChannelDeepDiveBundle): string {
  return [
    `# ${bundle.channelLabel} Channel Deep Dive`,
    "",
    bundle.channelUrl,
    "",
    "## Sample",
    bundle.sampleNote,
    "",
    "## Overview",
    bundle.overview,
    "",
    "## Scorecard",
    ...bundle.scorecard.map((item) => `- ${item.label}: ${item.score}/100 | ${item.note}`),
    "",
    "## Clone Scores",
    ...bundle.cloneScores.map((item) => `- ${item.label}: ${item.score}/100 | ${item.note}`),
    "",
    "## Channel DNA",
    `- Promise: ${bundle.channelDNA.promise}`,
    ...bundle.channelDNA.audience.map((item) => `- Audience: ${item}`),
    ...bundle.channelDNA.pillars.map((item) => `- Pillar: ${item}`),
    ...bundle.channelDNA.formats.map((item) => `- Format: ${item}`),
    ...bundle.channelDNA.tone.map((item) => `- Tone: ${item}`),
    ...bundle.channelDNA.creatorEdge.map((item) => `- Edge: ${item}`),
    "",
    "## Signature Moves",
    ...bundle.signatureMoves.map((item) => `- ${item}`),
    "",
    "## Winner Patterns",
    ...bundle.winnerPatterns.map((item) => `- ${item}`),
    "",
    "## Topic Clusters",
    ...bundle.topicClusters.map((item) => `- ${item}`),
    "",
    "## SEO Audit",
    ...bundle.seoAudit.map((item) => `- ${item}`),
    "",
    "## Description Signals",
    ...bundle.descriptionSignals.map((item) => `- ${item}`),
    "",
    "## Title Templates",
    ...bundle.titleTemplates.map((item) => `- ${item}`),
    "",
    "## Style DNA",
    ...bundle.styleDNA.map((item) => `- ${item}`),
    "",
    "## Thumbnail Text Signals",
    ...bundle.thumbnailTextSignals.map((item) => `- ${item}`),
    "",
    "## Thumbnail Playbook",
    ...bundle.thumbnailPlaybook.map((item) => `- ${item}`),
    "",
    "## Thumbnail Board",
    bundle.thumbnailBoard.summary,
    "",
    "### Density Notes",
    ...bundle.thumbnailBoard.densityNotes.map((item) => `- ${item}`),
    "",
    "### Messaging Notes",
    ...bundle.thumbnailBoard.messagingNotes.map((item) => `- ${item}`),
    "",
    "### Repeated Phrases",
    ...bundle.thumbnailBoard.repeatedPhrases.map((item) => `- ${item}`),
    "",
    "### Rules Worth Borrowing",
    ...bundle.thumbnailBoard.rules.map((item) => `- ${item}`),
    "",
    "### Thumbnail Examples",
    ...(bundle.thumbnailBoard.examples.length > 0
      ? bundle.thumbnailBoard.examples.map((item) => `- ${item.title} -> ${item.thumbnailText}`)
      : ["- No readable thumbnail-text examples were available in this sample."]),
    "",
    "## Hook Playbook",
    ...bundle.hookPlaybook.map((item) => `- ${item}`),
    "",
    "## Content Architecture",
    ...bundle.contentArchitecture.map((item) => `- ${item}`),
    "",
    "## Audience Positioning",
    ...bundle.audiencePositioning.map((item) => `- ${item}`),
    "",
    "## Audience Intel",
    ...bundle.audienceIntel.map((item) => `- ${item}`),
    "",
    "## Comment Intelligence",
    ...bundle.commentIntelligence.map((item) => `- ${item}`),
    "",
    "## Publishing System",
    ...bundle.publishingSystem.map((item) => `- ${item}`),
    "",
    "## View Signals",
    ...bundle.viewSignals.map((item) => `- ${item}`),
    "",
    "## Monetization Signals",
    ...bundle.monetizationSignals.map((item) => `- ${item}`),
    "",
    "## Studio Metrics",
    `- Matched videos: ${bundle.studioMetrics.matchedVideos}/${bundle.analyzedVideos} (${bundle.studioMetrics.coverage}% coverage)`,
    `- Average Studio views: ${bundle.studioMetrics.averageViews || 0}`,
    `- Average impressions: ${bundle.studioMetrics.averageImpressions || 0}`,
    `- Average CTR: ${bundle.studioMetrics.averageImpressionsCtr ? formatPercentage(bundle.studioMetrics.averageImpressionsCtr) : "n/a"}`,
    `- Average retention: ${bundle.studioMetrics.averagePercentageViewed ? formatPercentage(bundle.studioMetrics.averagePercentageViewed) : "n/a"}`,
    `- Average view duration: ${bundle.studioMetrics.averageViewDurationSeconds ? formatDurationLabel(bundle.studioMetrics.averageViewDurationSeconds) : "n/a"}`,
    ...(bundle.studioMetrics.topTrafficSources.length > 0
      ? [`- Top traffic sources: ${bundle.studioMetrics.topTrafficSources.join(", ")}`]
      : ["- Top traffic sources: n/a"]),
    "",
    "## Opportunities",
    ...bundle.opportunityFinder.map((item) => `- ${item}`),
    "",
    "## Next Video Ideas",
    ...bundle.nextVideoIdeas.map((item) => `- ${item}`),
    "",
    "## Clone Brief",
    ...bundle.cloneBrief.map((item) => `- ${item}`),
    "",
    "## Takeover Sprint",
    ...bundle.takeoverSprint.map((item) => `- ${item}`),
    "",
    "## Adaptation Plan",
    ...bundle.adaptationPlan.fits.map((item) => `- Fit: ${item}`),
    ...bundle.adaptationPlan.adapt.map((item) => `- Adapt: ${item}`),
    ...bundle.adaptationPlan.avoid.map((item) => `- Avoid: ${item}`),
    ...bundle.adaptationPlan.firstMoves.map((item) => `- First Move: ${item}`),
    ...bundle.adaptationPlan.day30.map((item) => `- Day 30: ${item}`),
    ...bundle.adaptationPlan.day60.map((item) => `- Day 60: ${item}`),
    ...bundle.adaptationPlan.day90.map((item) => `- Day 90: ${item}`),
    "",
    "## Differentiate",
    ...bundle.adaptationPlan.differentiate.map((item) => `- ${item}`),
  ].join("\n");
}

export function buildChannelDeepDive(options: {
  channelUrl: string;
  videos: Array<{
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
    transcript?: string;
    studioMetrics?: StudioVideoMetrics;
  }>;
  sourceVideoCount?: number;
  summaryStyle: SummaryStyle;
  audiencePreset: AudiencePreset;
  outputLanguage: OutputLanguage;
  cleaner: CleanerSettings;
  cloneContext?: Partial<CloneContext>;
}): ChannelDeepDiveBundle {
  const channelLabel = inferChannelLabel(options.channelUrl);
  const cloneContext: CloneContext = {
    niche: String(options.cloneContext?.niche ?? "").trim(),
    channelStage: options.cloneContext?.channelStage ?? "small",
    presentationStyle: options.cloneContext?.presentationStyle ?? "on-camera",
    goal: options.cloneContext?.goal ?? "views",
  };

  const initialVideoBreakdowns = options.videos.map((video) => {
    const transcript = String(video.transcript ?? "").trim();
    const transcriptAvailable = transcript.length > 0;
    const analysis = transcriptAvailable ? buildAnalysis({
      title: video.title,
      url: video.url,
      transcript,
      summaryStyle: options.summaryStyle,
      audiencePreset: options.audiencePreset,
      outputLanguage: options.outputLanguage,
      cleaner: options.cleaner,
    }) : null;
    const titleScore = analysis?.titleScore ?? Math.min(100, (video.title.length >= 36 && video.title.length <= 68 ? 70 : 52) + (/\b\d+\b/.test(video.title) ? 12 : 0) + (/\b(secret|strategy|guide|system|fix|mistake|review)\b/i.test(video.title) ? 10 : 0));
    const primaryTheme = analysis?.summary.keywords[0] ?? (video.title.toLowerCase().match(/[a-z][a-z-]{3,}/g) ?? []).find((token) => !STOP_WORDS.has(token)) ?? "general";
    return {
      title: video.title,
      url: video.url,
      videoId: video.videoId,
      publishedLabel: video.publishedLabel ?? "",
      viewLabel: video.viewLabel ?? "",
      viewCount: video.studioMetrics?.views ?? parseViewCountLabel(video.viewLabel ?? ""),
      descriptionAvailable: String(video.description ?? "").trim().length > 0,
      thumbnailText: compactLabel(String(video.thumbnailText ?? "").trim(), 64),
      transcriptAvailable,
      transcriptWordCount: transcriptAvailable ? getWordCount(transcript) : 0,
      primaryTheme,
      summary: analysis?.summary.overview ?? compactSentence(video.title, 120),
      titleScore,
      formatType: inferVideoFormat(video.title, transcript),
      hookType: inferHookType(video.title, transcript),
      ctaType: inferCtaType(String(video.description ?? ""), transcript),
      performanceLabel: "",
      commentCountLabel: String(video.commentCountLabel ?? "").trim(),
      topComments: Array.isArray(video.topComments) ? video.topComments.filter((comment) => comment && typeof comment.text === "string").slice(0, 5) : [],
      studioMetrics: video.studioMetrics,
    };
  });

  const transcriptCoverage = initialVideoBreakdowns.length > 0
    ? Math.round((initialVideoBreakdowns.filter((video) => video.transcriptAvailable).length / initialVideoBreakdowns.length) * 100)
    : 0;
  const averageViewCount = Math.round(averageMetric(initialVideoBreakdowns.map((video) => video.viewCount)));
  const rankedBreakdowns = [...initialVideoBreakdowns]
    .map((video) => ({ videoId: video.videoId, score: scoreVideoPerformance(video, averageViewCount) }))
    .sort((left, right) => right.score - left.score);
  const rankedIndex = new Map(rankedBreakdowns.map((item, index) => [item.videoId, index]));
  const videoBreakdowns = initialVideoBreakdowns.map((video) => {
    const index = rankedIndex.get(video.videoId) ?? 0;
    const topCut = Math.max(1, Math.ceil(initialVideoBreakdowns.length / 3));
    const midCut = Math.max(topCut + 1, Math.ceil((initialVideoBreakdowns.length * 2) / 3));
    return {
      ...video,
      performanceLabel: index < topCut ? "Winner Candidate" : index < midCut ? "Baseline Performer" : "Needs Sharper Packaging",
    };
  });
  const studioMatchedVideos = videoBreakdowns.filter((video) => video.studioMetrics).length;
  const studioCoverage = videoBreakdowns.length > 0 ? Math.round((studioMatchedVideos / videoBreakdowns.length) * 100) : 0;
  const studioMetrics = {
    matchedVideos: studioMatchedVideos,
    coverage: studioCoverage,
    averageViews: Math.round(averageMetric(videoBreakdowns.map((video) => video.studioMetrics?.views))),
    averageImpressions: Math.round(averageMetric(videoBreakdowns.map((video) => video.studioMetrics?.impressions))),
    averageImpressionsCtr: Math.round(averageMetric(videoBreakdowns.map((video) => video.studioMetrics?.impressionsCtr)) * 10) / 10,
    averageViewDurationSeconds: Math.round(averageMetric(videoBreakdowns.map((video) => video.studioMetrics?.averageViewDurationSeconds))),
    averagePercentageViewed: Math.round(averageMetric(videoBreakdowns.map((video) => video.studioMetrics?.averagePercentageViewed)) * 10) / 10,
    averageWatchTimeHours: Math.round(averageMetric(videoBreakdowns.map((video) => video.studioMetrics?.watchTimeHours)) * 10) / 10,
    topTrafficSources: summarizeTopTrafficSources(videoBreakdowns),
  };
  const sourceVideoCount = Math.max(videoBreakdowns.length, options.sourceVideoCount ?? videoBreakdowns.length);
  const sampleNote = sourceVideoCount > videoBreakdowns.length
    ? `Built from ${videoBreakdowns.length} selected videos out of ${sourceVideoCount} loaded recent uploads.`
    : `Built from ${videoBreakdowns.length} recent videos in the current sample.`;
  const aggregateText = options.videos.map((video) => [video.title, video.description ?? "", video.thumbnailText ?? "", video.transcript ?? ""].filter(Boolean).join(". ")).join("\n");
  const aggregateSentences = splitSentences(aggregateText);
  const topicClusters = collectKeywords(aggregateSentences)
    .filter((keyword) => isMeaningfulTopicLabel(keyword))
    .slice(0, 8)
    .map((keyword) => titleCase(keyword));
  const titlePatterns = summarizeTitlePatterns(options.videos.map((video) => video.title));
  const descriptionSignals = summarizeDescriptionSignals(options.videos);
  const titleTemplates = buildTitleTemplates(options.videos.map((video) => video.title), topicClusters);
  const styleDNA = inferStyleDNA(aggregateText, options.videos.map((video) => video.title));
  const thumbnailTextSignals = summarizeThumbnailTextSignals(options.videos, options.videos.map((video) => video.title));
  const thumbnailPlaybook = buildThumbnailPlaybook(options.videos);
  const thumbnailBoard = buildThumbnailBoard(options.videos);
  const hookPlaybook = buildHookPlaybook(videoBreakdowns);
  const contentArchitecture = inferContentArchitecture(videoBreakdowns, topicClusters);
  const audiencePositioning = uniqueItems([
    ...detectAudiencePositioning(aggregateText),
    options.audiencePreset === "creator" ? "Current workspace is tuned for creator-facing outputs, which aligns well with creator education channels." : "",
  ].filter(Boolean), 4);
  const publishingSystem = inferPublishingSystem(videoBreakdowns);
  const viewSignals = buildViewSignals(videoBreakdowns, topicClusters);
  const opportunityFinder = inferOpportunities(videoBreakdowns, titlePatterns, topicClusters);
  const channelDNA = buildChannelDNA(channelLabel, aggregateText, titlePatterns, topicClusters, audiencePositioning, styleDNA, videoBreakdowns);
  const winnerPatterns = buildWinnerPatterns(videoBreakdowns, averageViewCount);
  const audienceIntel = buildAudienceIntel(audiencePositioning, viewSignals, opportunityFinder, topicClusters);
  const commentIntelligence = buildCommentIntelligence(options.videos);
  const monetizationSignals = buildMonetizationSignals(options.videos);
  const nextVideoIdeas = buildNextVideoIdeas(topicClusters, titleTemplates, videoBreakdowns);
  const scorecard = buildChannelScorecard(videoBreakdowns, transcriptCoverage, styleDNA, titlePatterns);
  const cloneScores = buildCloneScores(videoBreakdowns, transcriptCoverage, titlePatterns, titleTemplates, aggregateText, options.videos.map((video) => String(video.description ?? "")));
  const signatureMoves = buildSignatureMoves(titlePatterns, styleDNA, contentArchitecture, audiencePositioning);
  const cloneBrief = uniqueItems([
    topicClusters[0] ? `Lead with ${topicClusters[0]}-anchored titles, then make the payoff explicit in the first 45 characters.` : "Lead with one clear theme per title and avoid trying to promise too many outcomes at once.",
    "Open each video with a direct payoff statement, then move into the framework or example quickly.",
    "Turn the strongest recurring topic into a named repeatable series so viewers can recognize the format immediately.",
    "Repurpose every strong long-form lesson into Shorts, LinkedIn, and thread-sized takeaways to compound reach.",
  ], 4);
  const takeoverSprint = buildTakeoverSprint(channelLabel, topicClusters, nextVideoIdeas, opportunityFinder, titleTemplates);
  const adaptationPlan = buildAdaptationPlan(channelLabel, cloneContext, channelDNA, cloneScores, titleTemplates, hookPlaybook, topicClusters);
  const overview = compactSentence(`${channelLabel} looks like a ${topicClusters[0] ? `${topicClusters[0]}-led` : "topic-driven"} channel with ${transcriptCoverage}% transcript coverage across ${videoBreakdowns.length} recent videos, and average visible views sit around ${formatCompactViews(averageViewCount || 0)}.${studioCoverage > 0 ? ` Imported Studio analytics cover ${studioCoverage}% of the sample, with average CTR around ${formatPercentage(studioMetrics.averageImpressionsCtr)} and retention near ${formatPercentage(studioMetrics.averagePercentageViewed)}.` : ""} The feed leans on ${titlePatterns[1]?.toLowerCase() ?? "repeatable title formulas"}, while the delivery reads as ${styleDNA[0]?.toLowerCase() ?? "system-oriented and tactical"}. Cloneability currently reads ${cloneScores.find((item) => item.label === "Cloneability")?.score ?? 0}/100, which suggests ${cloneContext.niche ? `this strategy can be adapted for ${cloneContext.niche}` : "the system is reusable if you keep the logic and change the surface"}.`, 360);
  const exportDeck = buildChannelDeepDiveExport({
    channelLabel,
    channelUrl: options.channelUrl,
    analyzedVideos: videoBreakdowns.length,
    sourceVideoCount,
    transcriptCoverage,
    averageViewCount,
    studioMetrics,
    sampleNote,
    overview,
    scorecard,
    cloneScores,
    channelDNA,
    signatureMoves,
    winnerPatterns,
    topicClusters,
    titlePatterns,
    titleTemplates,
    seoAudit: titlePatterns,
    descriptionSignals,
    styleDNA,
    thumbnailTextSignals,
    thumbnailPlaybook,
    thumbnailBoard,
    hookPlaybook,
    contentArchitecture,
    audiencePositioning,
    audienceIntel,
    commentIntelligence,
    publishingSystem,
    viewSignals,
    monetizationSignals,
    opportunityFinder,
    nextVideoIdeas,
    cloneBrief,
    takeoverSprint,
    adaptationPlan,
    cloneContext,
    exportDeck: "",
    videoBreakdowns,
  });

  return {
    channelLabel,
    channelUrl: options.channelUrl,
    analyzedVideos: videoBreakdowns.length,
    sourceVideoCount,
    transcriptCoverage,
    averageViewCount,
    studioMetrics,
    sampleNote,
    overview,
    scorecard,
    cloneScores,
    channelDNA,
    signatureMoves,
    winnerPatterns,
    topicClusters,
    titlePatterns,
    titleTemplates,
    seoAudit: titlePatterns,
    descriptionSignals,
    styleDNA,
    thumbnailTextSignals,
    thumbnailPlaybook,
    thumbnailBoard,
    hookPlaybook,
    contentArchitecture,
    audiencePositioning,
    audienceIntel,
    commentIntelligence,
    publishingSystem,
    viewSignals,
    monetizationSignals,
    opportunityFinder,
    nextVideoIdeas,
    cloneBrief,
    takeoverSprint,
    adaptationPlan,
    cloneContext,
    exportDeck,
    videoBreakdowns,
  };
}

function getCloneScoreValue(bundle: ChannelDeepDiveBundle, label: string): number {
  return bundle.cloneScores.find((item) => item.label === label)?.score ?? 0;
}

function buildCloneTopLessons(target: ChannelDeepDiveBundle): string[] {
  return uniqueItems([
    target.winnerPatterns[0] ?? "",
    target.titleTemplates[0] ? `Reusable packaging pattern: ${target.titleTemplates[0]}` : "",
    target.thumbnailBoard.rules[0] ?? "",
    target.hookPlaybook[0] ?? "",
    target.audienceIntel[0] ?? "",
    target.monetizationSignals[0] ?? "",
  ].filter(Boolean), 6);
}

function buildCloneTopRisks(target: ChannelDeepDiveBundle): string[] {
  const cloneability = getCloneScoreValue(target, "Cloneability");
  const personalityDependence = getCloneScoreValue(target, "Personality Dependence");
  const monetizationMaturity = getCloneScoreValue(target, "Monetization Maturity");
  return uniqueItems([
    personalityDependence >= 65 ? "The channel leans heavily on creator identity, so copying the surface would backfire." : "",
    cloneability < 65 ? "The system is only partially reusable as-is, so adaptation matters more than imitation." : "",
    target.transcriptCoverage < 50 ? "Transcript coverage is limited, so some scripting and hook conclusions are still directional." : "",
    target.studioMetrics.coverage === 0 ? "No Studio metrics were matched in this sample, so retention and CTR reads stay lighter." : "",
    monetizationMaturity < 45 ? "The business model is less visible than the content model, so monetization lessons are still partial." : "",
    target.thumbnailBoard.examples.length === 0 ? "Thumbnail psychology is inferred mostly from OCR-light signals instead of richer visual evidence." : "",
  ].filter(Boolean), 6);
}

function buildCloneWinningVideos(target: ChannelDeepDiveBundle): CloneChannelWinningVideos {
  const baselineViews = averageViews(target);
  const ranked = [...target.videoBreakdowns]
    .map((video) => ({ video, score: scoreVideoPerformance(video, baselineViews) }))
    .sort((left, right) => right.score - left.score);
  const winners = ranked.slice(0, Math.min(3, ranked.length)).map((item) => item.video);
  const underperformers = [...ranked].reverse().slice(0, Math.min(3, ranked.length)).map((item) => item.video);
  const winnerFormat = modeLabel(winners.map((video) => video.formatType), "Breakdown");
  const baselineFormat = modeLabel(underperformers.map((video) => video.formatType), "Breakdown");
  const winnerHook = modeLabel(winners.map((video) => video.hookType), "Direct-payoff");
  const baselineHook = modeLabel(underperformers.map((video) => video.hookType), "Direct-payoff");
  const winnerTitleScore = Math.round(averageMetric(winners.map((video) => video.titleScore)));
  const baselineTitleScore = Math.round(averageMetric(underperformers.map((video) => video.titleScore)));

  return {
    topPerformer: winners[0] ?? null,
    winners,
    underperformers,
    winnerVsBaseline: uniqueItems([
      winners[0] ? `${winners[0].title} is the clearest current winner in this sample.` : "",
      winners.length > 0 ? `Winning videos lean toward ${winnerFormat.toLowerCase()} structures, while weaker uploads skew more ${baselineFormat.toLowerCase()}.` : "",
      winners.length > 0 ? `Top performers open more often with ${winnerHook.toLowerCase()} hooks, while baseline uploads drift toward ${baselineHook.toLowerCase()}.` : "",
      winnerTitleScore > 0 ? `Winning titles average ${winnerTitleScore}/100 versus ${baselineTitleScore}/100 for the lower performers.` : "",
    ].filter(Boolean), 4),
    stealTheseStructures: uniqueItems([
      winners[0] ? `Model the structure behind "${winners[0].title}" rather than copying the wording.` : "",
      winners[1] ? `A second winning pattern worth adapting is the ${winners[1].formatType.toLowerCase()} format paired with ${winners[1].hookType.toLowerCase()} openings.` : "",
      target.winnerPatterns[0] ?? "",
    ].filter(Boolean), 4),
  };
}

function buildCloneTitleIntel(target: ChannelDeepDiveBundle): CloneChannelTitleIntel {
  const triggerWords = collectKeywords(splitSentences(target.videoBreakdowns.map((video) => video.title).join(". ")))
    .slice(0, 8)
    .map((item) => titleCase(item));
  const titles = target.videoBreakdowns.map((video) => video.title);
  const total = Math.max(1, titles.length);
  const questionCount = titles.filter((title) => /\?/.test(title)).length;
  const howToCount = titles.filter((title) => /^\s*how\s+to\b/i.test(title)).length;
  const resultCount = titles.filter((title) => /\b(secret|strategy|playbook|system|guide|mistake|fix|review)\b/i.test(title)).length;
  const lowScoringTitles = [...target.videoBreakdowns]
    .sort((left, right) => left.titleScore - right.titleScore)
    .slice(0, Math.min(3, target.videoBreakdowns.length))
    .map((video) => video.title);

  return {
    formulaMix: target.titlePatterns,
    triggerWords,
    clarityVsCuriosity: uniqueItems([
      `${Math.round((questionCount / total) * 100)}% of titles use question framing, while ${Math.round((howToCount / total) * 100)}% start with direct how-to intent.`,
      `${Math.round((resultCount / total) * 100)}% of titles use explicit result language like strategy, system, fix, or guide.`,
      questionCount > howToCount ? "The channel currently leans more curiosity-first than direct tutorial framing." : "The channel currently leans more clarity-first than pure curiosity bait.",
    ], 3),
    templates: target.titleTemplates,
    avoidPatterns: uniqueItems([
      lowScoringTitles[0] ? `Avoid broad or fuzzy packaging like "${compactLabel(lowScoringTitles[0], 84)}" when the payoff is not obvious fast enough.` : "",
      "Avoid stacking too many promises into one headline; the strongest titles usually sell one clear result.",
      "Avoid generic descriptor-led titles when the winning sample uses sharper outcome language.",
    ].filter(Boolean), 3),
  };
}

function buildCloneHookIntel(target: ChannelDeepDiveBundle): CloneChannelHookIntel {
  const hookCounts = new Map<string, number>();
  for (const video of target.videoBreakdowns) {
    hookCounts.set(video.hookType, (hookCounts.get(video.hookType) ?? 0) + 1);
  }
  const distribution = [...hookCounts.entries()]
    .sort((left, right) => right[1] - left[1])
    .map(([hook, count]) => `${hook}: ${count}/${target.videoBreakdowns.length} videos`);
  const retention = target.studioMetrics.averagePercentageViewed;

  return {
    dominantStyles: target.hookPlaybook,
    distribution,
    retentionNotes: uniqueItems([
      retention > 0 ? `Imported average retention sits near ${formatPercentage(retention)}, so the opening needs to hand off to real payoff instead of just curiosity.` : "No retention import is available, so hook quality is inferred from transcript and performance patterns.",
      target.hookPlaybook[0] ?? "",
      "Keep the first 15-30 seconds brutally clear on what the viewer is about to get.",
    ].filter(Boolean), 4),
    templates: target.hookPlaybook.slice(0, 3),
  };
}

function buildCloneAudienceIntel(target: ChannelDeepDiveBundle): CloneChannelAudienceIntel {
  const comments = target.videoBreakdowns.flatMap((video) => video.topComments ?? []);
  const praise = comments
    .filter((comment) => /\b(great|good|love|amazing|awesome|helpful|useful|brilliant|perfect|genius|legend)\b/i.test(comment.text))
    .slice(0, 3)
    .map((comment) => compactLabel(comment.text, 110));
  const requests = comments
    .filter((comment) => /\b(please|can you|could you|would love|more on|make a video|next video|part 2|do one on|cover)\b/i.test(comment.text))
    .slice(0, 3)
    .map((comment) => compactLabel(comment.text, 110));
  const confusion = comments
    .filter((comment) => /\b(confused|don't understand|dont understand|what do you mean|question|how do|why does|not sure)\b/i.test(comment.text))
    .slice(0, 3)
    .map((comment) => compactLabel(comment.text, 110));

  return {
    positioning: target.audiencePositioning,
    valueDrivers: target.audienceIntel,
    praise,
    requests,
    confusion,
    highSignalComments: uniqueItems(comments.slice(0, 3).map((comment) => compactLabel(comment.text, 110)), 3),
  };
}

function buildCloneMonetizationIntel(target: ChannelDeepDiveBundle): CloneChannelMonetizationIntel {
  const ctaCounts = new Map<string, number>();
  for (const video of target.videoBreakdowns) {
    ctaCounts.set(video.ctaType, (ctaCounts.get(video.ctaType) ?? 0) + 1);
  }
  const ctaMix = [...ctaCounts.entries()]
    .sort((left, right) => right[1] - left[1])
    .map(([cta, count]) => `${cta}: ${count}/${target.videoBreakdowns.length} videos`);
  const offerTypes = uniqueItems([
    target.monetizationSignals.find((item) => /newsletter|resource|template|download/i.test(item)) ? "Lead magnets or resources are part of the monetization path." : "",
    target.monetizationSignals.find((item) => /offer|consult|course|community/i.test(item)) ? "Direct offers appear in the visible sample." : "",
    target.monetizationSignals.find((item) => /sponsor|affiliate/i.test(item)) ? "Sponsor or affiliate-style monetization appears in the visible sample." : "",
  ].filter(Boolean), 3);

  return {
    overview: target.monetizationSignals,
    ctaMix,
    offerTypes,
    lessons: uniqueItems([
      target.monetizationSignals[0] ?? "",
      ctaMix[0] ? `The dominant CTA mix is currently ${ctaMix[0].toLowerCase()}.` : "",
      "The content system should stay useful on its own; monetization works better when it feels like a natural extension of the lesson.",
    ].filter(Boolean), 4),
  };
}

function buildCloneAdaptationIntel(target: ChannelDeepDiveBundle, myChannel?: ChannelDeepDiveBundle | null): CloneChannelAdaptationIntel {
  if (!myChannel) {
    return {
      overview: compactSentence(
        `Adapt this system to your situation using the niche, stage, presentation, and goal inputs. The aim is to borrow the structure behind ${target.channelLabel}, not the surface style.`,
        220,
      ),
      fits: target.adaptationPlan.fits,
      needsAdapting: target.adaptationPlan.adapt,
      ignore: target.adaptationPlan.avoid,
      fastestLift: target.adaptationPlan.firstMoves.slice(0, 2),
      bestPillarToStart: uniqueItems([
        target.channelDNA.pillars[0] ? `Start with ${target.channelDNA.pillars[0]} because it is the clearest pillar in the current sample.` : "",
      ].filter(Boolean), 1),
      packagingToBorrowSafely: uniqueItems([
        target.titleTemplates[0] ? `Borrow the structure behind ${target.titleTemplates[0]}.` : "",
        target.thumbnailBoard.rules[0] ?? "",
      ].filter(Boolean), 3),
    };
  }

  const titleGap = averageChannelTitleScore(target) - averageChannelTitleScore(myChannel);
  const ctrGap = (target.studioMetrics.averageImpressionsCtr || 0) - (myChannel.studioMetrics.averageImpressionsCtr || 0);
  const retentionGap = (target.studioMetrics.averagePercentageViewed || 0) - (myChannel.studioMetrics.averagePercentageViewed || 0);
  const sharedPillar = target.channelDNA.pillars.find((pillar) => myChannel.channelDNA.pillars.includes(pillar)) ?? target.channelDNA.pillars[0] ?? "the strongest target pillar";

  return {
    overview: compactSentence(
      `${target.channelLabel} is being translated against ${myChannel.channelLabel}. The goal is to keep what already works on your channel while borrowing the strongest structural wins from the model channel.`,
      240,
    ),
    fits: uniqueItems([
      myChannel.channelDNA.creatorEdge[0] ? `${myChannel.channelLabel} already has a usable edge: ${myChannel.channelDNA.creatorEdge[0]}` : "",
      myChannel.channelDNA.formats[0] && target.channelDNA.formats.includes(myChannel.channelDNA.formats[0]) ? `Your channel already publishes in a compatible format lane: ${myChannel.channelDNA.formats[0]}.` : "",
      target.adaptationPlan.fits[0] ?? "",
    ].filter(Boolean), 3),
    needsAdapting: uniqueItems([
      titleGap > 3 ? `Packaging needs work first: ${target.channelLabel} is ahead by about ${Math.round(titleGap)} title-score points.` : "",
      ctrGap > 0.4 ? `Click efficiency is trailing: the target channel is converting impressions more effectively.` : "",
      retentionGap > 2 ? `Viewer hold is trailing: the target sample keeps attention longer after the click.` : "",
      target.adaptationPlan.adapt[0] ?? "",
      target.adaptationPlan.adapt[1] ?? "",
    ].filter(Boolean), 5),
    ignore: uniqueItems([
      ...target.adaptationPlan.avoid,
      target.cloneScores.find((item) => item.label === "Personality Dependence")?.score ?? 0 >= 65 ? `Do not force ${target.channelLabel}'s persona onto ${myChannel.channelLabel}.` : "",
    ].filter(Boolean), 4),
    fastestLift: uniqueItems([
      titleGap > 3 ? "Fastest lift: rewrite the next 3 titles with clearer payoff and sharper specificity before changing the whole content system." : "",
      retentionGap > 2 ? "Fastest lift: tighten the first 30 seconds and get to proof or payoff earlier." : "",
      ctrGap > 0.4 ? "Fastest lift: upgrade title-thumbnail pairing before expanding into new topics." : "",
      target.adaptationPlan.firstMoves[0] ?? "",
    ].filter(Boolean), 3),
    bestPillarToStart: uniqueItems([
      `Best pillar to start with: ${sharedPillar}.`,
      target.channelDNA.pillars[1] ? `Second pillar to test later: ${target.channelDNA.pillars[1]}.` : "",
    ].filter(Boolean), 2),
    packagingToBorrowSafely: uniqueItems([
      target.titleTemplates[0] ? `Borrow the title structure behind ${target.titleTemplates[0]}, but rewrite every surface phrase.` : "",
      target.thumbnailBoard.rules[0] ?? "",
      target.thumbnailBoard.rules[1] ?? "",
    ].filter(Boolean), 3),
  };
}

function buildCloneActionPlan(target: ChannelDeepDiveBundle): CloneChannelActionPlan {
  return {
    borrow: uniqueItems([
      target.cloneBrief[0] ?? "",
      target.cloneBrief[1] ?? "",
      target.winnerPatterns[0] ?? "",
    ].filter(Boolean), 4),
    adapt: target.adaptationPlan.adapt,
    avoid: target.adaptationPlan.avoid,
    firstMoves: target.adaptationPlan.firstMoves,
    day30: target.adaptationPlan.day30,
    day60: target.adaptationPlan.day60,
    day90: target.adaptationPlan.day90,
    nextVideoIdeas: target.nextVideoIdeas,
    differentiate: target.adaptationPlan.differentiate,
  };
}

function buildCloneChannelExport(bundle: Omit<CloneChannelBundle, "exportDeck">): string {
  return [
    `# ${bundle.targetLabel} Clone Channel Plan`,
    "",
    bundle.targetUrl,
    "",
    bundle.myChannelLabel ? `Adapted against: ${bundle.myChannelLabel}` : "Adapted against: niche/stage/presentation/goal inputs",
    "",
    "## Overview",
    bundle.overview,
    "",
    "## Scores",
    ...bundle.scores.map((item) => `- ${item.label}: ${item.score}/100 | ${item.note}`),
    "",
    "## Top Lessons",
    ...bundle.topLessons.map((item) => `- ${item}`),
    "",
    "## Top Risks",
    ...bundle.topRisks.map((item) => `- ${item}`),
    "",
    "## DNA",
    `- Core Promise: ${bundle.dna.promise}`,
    ...bundle.dna.audience.map((item) => `- Audience: ${item}`),
    ...bundle.dna.pillars.map((item) => `- Pillar: ${item}`),
    ...bundle.dna.formats.map((item) => `- Format: ${item}`),
    ...bundle.dna.tone.map((item) => `- Tone: ${item}`),
    ...bundle.dna.creatorEdge.map((item) => `- Creator Edge: ${item}`),
    "",
    "## Winning Videos",
    ...(bundle.winningVideos.topPerformer ? [`- Top Performer: ${bundle.winningVideos.topPerformer.title}`] : []),
    ...bundle.winningVideos.winnerVsBaseline.map((item) => `- ${item}`),
    ...bundle.winningVideos.stealTheseStructures.map((item) => `- ${item}`),
    "",
    "## Titles",
    ...bundle.titleIntel.formulaMix.map((item) => `- Formula Mix: ${item}`),
    ...bundle.titleIntel.triggerWords.map((item) => `- Trigger Word: ${item}`),
    ...bundle.titleIntel.clarityVsCuriosity.map((item) => `- ${item}`),
    ...bundle.titleIntel.templates.map((item) => `- Template: ${item}`),
    ...bundle.titleIntel.avoidPatterns.map((item) => `- Avoid: ${item}`),
    "",
    "## Thumbnails",
    bundle.thumbnailIntel.summary,
    ...bundle.thumbnailIntel.textSignals.map((item) => `- ${item}`),
    ...bundle.thumbnailIntel.playbook.map((item) => `- ${item}`),
    ...bundle.thumbnailIntel.board.rules.map((item) => `- Rule: ${item}`),
    ...(bundle.thumbnailIntel.board.examples.length > 0
      ? bundle.thumbnailIntel.board.examples.map((item) => `- Example: ${item.title} -> ${item.thumbnailText}`)
      : []),
    "",
    "## Hooks",
    ...bundle.hookIntel.dominantStyles.map((item) => `- ${item}`),
    ...bundle.hookIntel.distribution.map((item) => `- Distribution: ${item}`),
    ...bundle.hookIntel.retentionNotes.map((item) => `- ${item}`),
    ...bundle.hookIntel.templates.map((item) => `- Template: ${item}`),
    "",
    "## Audience",
    ...bundle.audienceIntel.positioning.map((item) => `- Positioning: ${item}`),
    ...bundle.audienceIntel.valueDrivers.map((item) => `- Value Driver: ${item}`),
    ...bundle.audienceIntel.praise.map((item) => `- Praise: ${item}`),
    ...bundle.audienceIntel.requests.map((item) => `- Request: ${item}`),
    ...bundle.audienceIntel.confusion.map((item) => `- Confusion: ${item}`),
    ...bundle.audienceIntel.highSignalComments.map((item) => `- High-Signal Comment: ${item}`),
    "",
    "## Monetization",
    ...bundle.monetizationIntel.overview.map((item) => `- ${item}`),
    ...bundle.monetizationIntel.ctaMix.map((item) => `- CTA Mix: ${item}`),
    ...bundle.monetizationIntel.offerTypes.map((item) => `- Offer Type: ${item}`),
    ...bundle.monetizationIntel.lessons.map((item) => `- Lesson: ${item}`),
    "",
    "## Adapt To Me",
    bundle.adaptationPlan.overview,
    ...bundle.adaptationPlan.fits.map((item) => `- Fits: ${item}`),
    ...bundle.adaptationPlan.needsAdapting.map((item) => `- Needs Adapting: ${item}`),
    ...bundle.adaptationPlan.ignore.map((item) => `- Ignore: ${item}`),
    ...bundle.adaptationPlan.fastestLift.map((item) => `- Fastest Lift: ${item}`),
    ...bundle.adaptationPlan.bestPillarToStart.map((item) => `- Best Pillar: ${item}`),
    ...bundle.adaptationPlan.packagingToBorrowSafely.map((item) => `- Safe Packaging Borrow: ${item}`),
    "",
    "## Action Plan",
    ...bundle.actionPlan.borrow.map((item) => `- Borrow: ${item}`),
    ...bundle.actionPlan.adapt.map((item) => `- Adapt: ${item}`),
    ...bundle.actionPlan.avoid.map((item) => `- Avoid: ${item}`),
    ...bundle.actionPlan.firstMoves.map((item) => `- First Move: ${item}`),
    ...bundle.actionPlan.day30.map((item) => `- Day 30: ${item}`),
    ...bundle.actionPlan.day60.map((item) => `- Day 60: ${item}`),
    ...bundle.actionPlan.day90.map((item) => `- Day 90: ${item}`),
    ...bundle.actionPlan.nextVideoIdeas.map((item) => `- Next Video Idea: ${item}`),
    "",
    "## Differentiate",
    ...bundle.actionPlan.differentiate.map((item) => `- ${item}`),
  ].join("\n");
}

export function buildCloneChannel(options: {
  target: ChannelDeepDiveBundle;
  myChannel?: ChannelDeepDiveBundle | null;
}): CloneChannelBundle {
  const winningVideos = buildCloneWinningVideos(options.target);
  const titleIntel = buildCloneTitleIntel(options.target);
  const thumbnailIntel: CloneChannelThumbnailIntel = {
    summary: options.target.thumbnailBoard.summary,
    textSignals: options.target.thumbnailTextSignals,
    playbook: options.target.thumbnailPlaybook,
    board: options.target.thumbnailBoard,
  };
  const hookIntel = buildCloneHookIntel(options.target);
  const audienceIntel = buildCloneAudienceIntel(options.target);
  const monetizationIntel = buildCloneMonetizationIntel(options.target);
  const adaptationPlan = buildCloneAdaptationIntel(options.target, options.myChannel ?? null);
  const actionPlan = buildCloneActionPlan(options.target);
  const topLessons = buildCloneTopLessons(options.target);
  const topRisks = buildCloneTopRisks(options.target);
  const baseBundle: Omit<CloneChannelBundle, "exportDeck"> = {
    targetLabel: options.target.channelLabel,
    targetUrl: options.target.channelUrl,
    myChannelLabel: options.myChannel?.channelLabel ?? null,
    overview: compactSentence(
      `${options.target.channelLabel} looks like a repeatable channel system built around ${options.target.channelDNA.pillars[0] ?? "its main promise"}, ${options.target.channelDNA.formats[0]?.toLowerCase() ?? "repeatable formats"}, and ${options.target.hookPlaybook[0]?.toLowerCase() ?? "clear openings"}. Average visible views in the selected sample sit near ${formatCompactViews(options.target.averageViewCount || 0)}.${options.myChannel ? ` This plan translates that system against ${options.myChannel.channelLabel} instead of treating the model channel as a copy target.` : ""}`,
      320,
    ),
    scores: options.target.cloneScores,
    topLessons,
    topRisks,
    dna: options.target.channelDNA,
    winningVideos,
    titleIntel,
    thumbnailIntel,
    hookIntel,
    audienceIntel,
    monetizationIntel,
    adaptationPlan,
    actionPlan,
  };

  return {
    ...baseBundle,
    exportDeck: buildCloneChannelExport(baseBundle),
  };
}

function averageChannelTitleScore(bundle: ChannelDeepDiveBundle): number {
  if (bundle.videoBreakdowns.length === 0) return 0;
  return Math.round(bundle.videoBreakdowns.reduce((sum, video) => sum + video.titleScore, 0) / bundle.videoBreakdowns.length);
}

function averageTranscriptWords(bundle: ChannelDeepDiveBundle): number {
  const transcriptVideos = bundle.videoBreakdowns.filter((video) => video.transcriptAvailable);
  if (transcriptVideos.length === 0) return 0;
  return Math.round(transcriptVideos.reduce((sum, video) => sum + video.transcriptWordCount, 0) / transcriptVideos.length);
}

function averageViews(bundle: ChannelDeepDiveBundle): number {
  const videos = bundle.videoBreakdowns.filter((video) => video.viewCount !== null);
  if (videos.length === 0) return 0;
  return Math.round(videos.reduce((sum, video) => sum + (video.viewCount ?? 0), 0) / videos.length);
}

function compareWinnerLabel(primaryLabel: string, primaryValue: number, competitorLabel: string, competitorValue: number): string {
  if (Math.abs(primaryValue - competitorValue) <= 2) return "Tie";
  return primaryValue > competitorValue ? primaryLabel : competitorLabel;
}

function pickSharedLabels(labelGroups: string[][], limit: number): string[] {
  const threshold = Math.max(2, Math.ceil(labelGroups.length * 0.67));
  const counts = new Map<string, number>();
  for (const group of labelGroups) {
    const seen = new Set<string>();
    for (const item of group.map((value) => value.trim()).filter(Boolean)) {
      const key = item.toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }
  }
  return [...counts.entries()]
    .filter(([, count]) => count >= threshold)
    .sort((left, right) => right[1] - left[1] || left[0].localeCompare(right[0]))
    .slice(0, limit)
    .map(([label]) => titleCase(label));
}

function formatCompactViewsOrZero(value: number): string {
  return formatCompactViews(Number.isFinite(value) ? value : 0);
}

function buildChannelNicheModelExport(bundle: Omit<ChannelNicheModelBundle, "exportDeck">): string {
  return [
    `## Niche Model (${bundle.comparedChannels.length} Channels)`,
    bundle.overview,
    "",
    "### Shared Themes",
    ...(bundle.sharedThemes.length > 0 ? bundle.sharedThemes.map((item) => `- ${item}`) : ["- No strong shared themes surfaced across the sampled channels."]),
    "",
    "### Shared Formats",
    ...(bundle.sharedFormats.length > 0 ? bundle.sharedFormats.map((item) => `- ${item}`) : ["- No clear format consensus surfaced."]),
    "",
    "### Shared Hooks",
    ...(bundle.sharedHooks.length > 0 ? bundle.sharedHooks.map((item) => `- ${item}`) : ["- No clear hook consensus surfaced."]),
    "",
    "### Shared Thumbnail Phrases",
    ...(bundle.sharedThumbnailPhrases.length > 0 ? bundle.sharedThumbnailPhrases.map((item) => `- ${item}`) : ["- Thumbnail text appears more channel-specific than niche-wide."]),
    "",
    "### Shared Growth System",
    ...bundle.growthSystem.map((item) => `- ${item}`),
    "",
    "### Packaging Rules",
    ...bundle.packagingRules.map((item) => `- ${item}`),
    "",
    "### Content System",
    ...bundle.contentSystem.map((item) => `- ${item}`),
    "",
    "### Audience Angles",
    ...bundle.audienceAngles.map((item) => `- ${item}`),
    "",
    "### Momentum Signals",
    ...bundle.momentumSignals.map((item) => `- ${item}`),
    "",
    "### Whitespace Angles",
    ...bundle.whitespaceAngles.map((item) => `- ${item}`),
    "",
    "### Experiments",
    ...bundle.experiments.map((item) => `- ${item}`),
    "",
    "### Cautions",
    ...bundle.cautions.map((item) => `- ${item}`),
    "",
    "### Channel Snapshots",
    ...bundle.channelSnapshots.map((item) => `- ${item.channelLabel}: ${item.sampleSize} videos | Avg views ${formatCompactViewsOrZero(item.averageViews)} | Avg title score ${item.averageTitleScore} | Transcript coverage ${item.transcriptCoverage}% | Dominant format ${item.dominantFormat} | Dominant hook ${item.dominantHook} | Lead theme ${item.leadTheme}${item.leadThumbnailPhrase ? ` | Thumbnail phrase ${item.leadThumbnailPhrase}` : ""}`),
  ].join("\n");
}

function buildChannelNicheModel(channels: ChannelDeepDiveBundle[]): ChannelNicheModelBundle {
  const comparedChannels = channels.map((channel) => channel.channelLabel);
  const sharedThemes = pickSharedLabels(channels.map((channel) => channel.topicClusters), 5);
  const sharedFormats = pickSharedLabels(channels.map((channel) => channel.channelDNA.formats), 3);
  const sharedHooks = pickSharedLabels(channels.map((channel) => channel.hookPlaybook), 3);
  const sharedThumbnailPhrases = pickSharedLabels(channels.map((channel) => channel.thumbnailBoard.repeatedPhrases), 5);
  const channelSnapshots = channels.map((channel) => ({
    channelLabel: channel.channelLabel,
    sampleSize: channel.analyzedVideos,
    averageViews: averageViews(channel),
    averageTitleScore: averageChannelTitleScore(channel),
    transcriptCoverage: channel.transcriptCoverage,
    dominantFormat: modeLabel(channel.videoBreakdowns.map((video) => video.formatType), "Breakdown"),
    dominantHook: modeLabel(channel.videoBreakdowns.map((video) => video.hookType), "Direct-payoff"),
    leadTheme: channel.topicClusters[0] ?? "General",
    leadThumbnailPhrase: channel.thumbnailBoard.repeatedPhrases[0] ?? "",
  }));
  const averageCtr = Math.round((averageMetric(channels.map((channel) => channel.studioMetrics.averageImpressionsCtr)) || 0) * 10) / 10;
  const averageRetention = Math.round((averageMetric(channels.map((channel) => channel.studioMetrics.averagePercentageViewed)) || 0) * 10) / 10;
  const averageTranscriptCoverage = Math.round(averageMetric(channels.map((channel) => channel.transcriptCoverage)));
  const nicheLine = channels[0]?.cloneContext.niche.trim() ? ` for ${channels[0].cloneContext.niche.trim()}` : "";
  const overview = compactSentence(
    `${comparedChannels.join(", ")} point to a shared niche system${nicheLine}: ${sharedThemes[0] ? `${sharedThemes[0]} is the clearest common theme,` : "the topic mix is wider, but"} the winning packaging keeps leaning on ${sharedFormats[0]?.toLowerCase() ?? "repeatable formats"}, ${sharedHooks[0]?.toLowerCase() ?? "fast payoff openings"}, and ${sharedThumbnailPhrases[0] ? `${sharedThumbnailPhrases[0].toLowerCase()}-style` : "tight"} thumbnail messaging.`,
    340,
  );
  const growthSystem = uniqueItems([
    sharedThemes[0] ? `The niche repeatedly wins by returning to ${sharedThemes[0]} instead of constantly reinventing the topic lane.` : "",
    sharedFormats[0] ? `The dominant format pattern is ${sharedFormats[0].toLowerCase()}, which suggests the niche rewards familiar episode shapes.` : "",
    sharedHooks[0] ? `The common opening move is ${sharedHooks[0].toLowerCase()}, so viewers are being sold the payoff quickly.` : "",
    averageTranscriptCoverage >= 60 ? `Most sampled channels back the packaging with enough transcript depth to teach, not just tease.` : "Packaging looks stronger than teaching depth, so shallow imitation would likely underperform.",
    "The reusable system is topic clarity plus strong packaging plus a repeatable structure, not one channel's exact wording.",
  ].filter(Boolean), 5);
  const packagingRules = uniqueItems([
    channels.map((channel) => channel.titleTemplates[0]).filter(Boolean)[0] ? `Title pattern to study: ${channels.map((channel) => channel.titleTemplates[0]).filter(Boolean)[0]}` : "",
    sharedThumbnailPhrases[0] ? `Thumbnail text often compresses the promise into short repeated phrasing like ${sharedThumbnailPhrases[0]}.` : "Thumbnail systems skew toward short, high-clarity wording instead of sentence-length copy.",
    "Pair titles and thumbnails around one promise each; the niche does not reward split-focus packaging.",
    "Borrow the decision rules behind the thumbnails, not the exact phrasing or layout.",
    averageCtr > 0 ? `Imported Studio CTR averages roughly ${formatPercentage(averageCtr)}, so packaging efficiency is a real differentiator in this sample.` : "",
  ].filter(Boolean), 5);
  const contentSystem = uniqueItems([
    ...channels.flatMap((channel) => channel.winnerPatterns.slice(0, 1)),
    ...channels.flatMap((channel) => channel.contentArchitecture.slice(0, 1)),
    "The niche keeps turning one strong pillar into multiple episodes instead of treating each upload as a standalone idea.",
    "Winning channels appear to build series logic around clear transformations, breakdowns, or lessons viewers can reuse quickly.",
  ].filter(Boolean), 5);
  const audienceAngles = uniqueItems([
    ...pickSharedLabels(channels.map((channel) => channel.audiencePositioning), 4),
    ...channels.flatMap((channel) => channel.audienceIntel.slice(0, 1)),
  ].filter(Boolean), 5);
  const momentumSignals = uniqueItems([
    `Across the niche sample, average transcript coverage sits near ${averageTranscriptCoverage}%.`,
    averageCtr > 0 ? `Imported Studio CTR clusters around ${formatPercentage(averageCtr)} across the matched sample.` : "",
    averageRetention > 0 ? `Imported retention clusters near ${formatPercentage(averageRetention)}, so strong packaging still has to hand off to real payoff.` : "",
    ...channels.flatMap((channel) => channel.viewSignals.slice(0, 1)),
  ].filter(Boolean), 5);
  const whitespaceAngles = uniqueItems([
    sharedThemes[0] ? `Attack ${sharedThemes[0]} with a sharper audience promise than the current leaders are using.` : "Combine two adjacent topic lanes into one tighter niche promise.",
    ...channels.flatMap((channel) => channel.opportunityFinder.slice(0, 1).map((item) => `${channel.channelLabel}: ${item}`)),
    channels.find((channel) => channel.topicClusters.find((theme) => !sharedThemes.includes(theme)))
      ? `One gap worth testing is ${channels.find((channel) => channel.topicClusters.find((theme) => !sharedThemes.includes(theme)))?.topicClusters.find((theme) => !sharedThemes.includes(theme))}, since it shows up on one feed without owning the full niche yet.`
      : "",
  ].filter(Boolean), 5);
  const experiments = uniqueItems([
    `Map your next 5 uploads against the shared system${nicheLine}: one core pillar, one explicit promise, one repeatable format.`,
    sharedHooks[0] ? `Rewrite three upcoming intros to match the niche's ${sharedHooks[0].toLowerCase()} tendency, then keep whichever version holds attention best.` : "",
    sharedThumbnailPhrases[0] ? `Create a thumbnail board that tests ${sharedThumbnailPhrases[0]}-style brevity without copying any exact niche leader phrase.` : "",
    sharedFormats[0] ? `Ship one ${sharedFormats[0].toLowerCase()} video every week for a month so the audience can recognize the format as a series.` : "",
  ].filter(Boolean), 4);
  const cautions = uniqueItems([
    "Do not merge all channel traits into one upload; the value is in the repeated system, not in stuffing every tactic together.",
    "Do not copy exact title phrasing, thumbnail text, or signature turns of phrase from the leaders.",
    "If one channel is much larger than the others, avoid treating its surface style as the whole niche.",
  ], 3);

  const baseBundle: Omit<ChannelNicheModelBundle, "exportDeck"> = {
    comparedChannels,
    overview,
    sharedThemes,
    sharedFormats,
    sharedHooks,
    sharedThumbnailPhrases,
    growthSystem,
    packagingRules,
    contentSystem,
    audienceAngles,
    momentumSignals,
    whitespaceAngles,
    experiments,
    cautions,
    channelSnapshots,
  };

  return {
    ...baseBundle,
    exportDeck: buildChannelNicheModelExport(baseBundle),
  };
}

function buildAdaptToMeCompare(primary: ChannelDeepDiveBundle, competitor: ChannelDeepDiveBundle): ChannelAdaptCompareBundle {
  const titleGap = averageChannelTitleScore(competitor) - averageChannelTitleScore(primary);
  const retentionGap = (competitor.studioMetrics.averagePercentageViewed || 0) - (primary.studioMetrics.averagePercentageViewed || 0);
  const ctrGap = (competitor.studioMetrics.averageImpressionsCtr || 0) - (primary.studioMetrics.averageImpressionsCtr || 0);
  const transcriptGap = competitor.transcriptCoverage - primary.transcriptCoverage;
  const sharedTheme = competitor.topicClusters.find((theme) => primary.topicClusters.includes(theme)) ?? competitor.topicClusters[0] ?? "the target theme";
  const primaryHook = modeLabel(primary.videoBreakdowns.map((video) => video.hookType), "Direct-payoff");
  const competitorHook = modeLabel(competitor.videoBreakdowns.map((video) => video.hookType), "Direct-payoff");
  const primaryFormat = modeLabel(primary.videoBreakdowns.map((video) => video.formatType), "Breakdown");
  const competitorFormat = modeLabel(competitor.videoBreakdowns.map((video) => video.formatType), "Breakdown");
  const competitorTitleTemplate = competitor.titleTemplates[0] ?? "";
  const primaryStrength = primary.winnerPatterns[0] ?? primary.signatureMoves[0] ?? `${primary.topicClusters[0] ?? primary.channelLabel} already has a usable foundation.`;
  const nicheLine = primary.cloneContext.niche.trim() ? ` for ${primary.cloneContext.niche.trim()}` : "";

  return {
    overview: compactSentence(
      `Use this compare as an adaptation view: ${primary.channelLabel} is your current channel, and ${competitor.channelLabel} is the model you're studying.${titleGap > 0 ? ` The clearest gap is packaging.` : ""}${retentionGap > 0 ? ` Retention is also trailing.` : ""} The fastest path is to keep what already works on ${primary.channelLabel} while borrowing the structure behind ${competitor.channelLabel}'s winners${nicheLine}.`,
      340,
    ),
    strengthsToKeep: uniqueItems([
      primaryStrength,
      primary.topicClusters[0] ? `${primary.channelLabel} already has a visible anchor around ${primary.topicClusters[0]}, so keep that instead of pivoting your niche too abruptly.` : "",
      primary.commentIntelligence[0] ? `Audience proof to protect: ${primary.commentIntelligence[0]}` : "",
    ].filter(Boolean), 3),
    closeGaps: uniqueItems([
      titleGap > 3 ? `Packaging gap: ${competitor.channelLabel} is beating ${primary.channelLabel} by about ${Math.round(titleGap)} title-score points, so titles need clearer payoff language.` : "",
      ctrGap > 0.4 ? `CTR gap: ${competitor.channelLabel} is converting impressions more efficiently, which usually means the title-thumbnail pairing is sharper.` : "",
      retentionGap > 2 ? `Retention gap: ${competitor.channelLabel} is holding viewers longer, so intros and payoff structure need tightening.` : "",
      transcriptGap > 10 ? `Teaching-depth gap: ${competitor.channelLabel} has richer transcript coverage, which often signals more developed explanations or cleaner scripting.` : "",
      primaryHook !== competitorHook ? `Hook gap: ${primary.channelLabel} leans on ${primaryHook.toLowerCase()} while ${competitor.channelLabel} wins more often with ${competitorHook.toLowerCase()}.` : "",
      primaryFormat !== competitorFormat ? `Format gap: ${competitor.channelLabel} is leaning into ${competitorFormat.toLowerCase()} while ${primary.channelLabel} is more ${primaryFormat.toLowerCase()}-led.` : "",
    ].filter(Boolean), 5),
    borrowFirst: uniqueItems([
      competitorTitleTemplate ? `Borrow this title structure first: ${competitorTitleTemplate}` : "",
      competitor.hookPlaybook[0] ? `Borrow this opening logic: ${competitor.hookPlaybook[0]}` : "",
      competitor.winnerPatterns[0] ? `Model this winning pattern next: ${competitor.winnerPatterns[0]}` : "",
      sharedTheme ? `Start with the overlap theme ${sharedTheme} so the adaptation feels natural instead of forced.` : "",
    ].filter(Boolean), 4),
    experiments: uniqueItems([
      `Rewrite 3 upcoming ${primary.channelLabel} titles using ${competitor.channelLabel}'s payoff structure, then pick the strongest one to ship first.`,
      `Test one ${competitorHook.toLowerCase()} intro on a ${sharedTheme}-led video and compare it against your usual opening style.`,
      `Publish one ${competitorFormat.toLowerCase()} video${nicheLine} without copying the target channel's exact wording or examples.`,
      `Run a 30-day sprint where every upload keeps the same core pillar but improves packaging, hook speed, and CTA clarity.`,
    ], 4),
    cautions: uniqueItems([
      "Keep the niche logic and change the wording, visual treatment, and examples.",
      primary.cloneContext.presentationStyle !== competitor.cloneContext.presentationStyle ? `Do not force ${competitor.channelLabel}'s presentation style if it clashes with how ${primary.channelLabel} is built.` : "",
      "Do not copy exact title phrasing, thumbnail layouts, or signature catchphrases from the model channel.",
    ].filter(Boolean), 3),
  };
}

function buildChannelCompareExport(bundle: Omit<ChannelCompareBundle, "exportDeck">): string {
  return [
    `# ${bundle.primaryLabel} vs ${bundle.competitorLabel}`,
    "",
    "## Overview",
    bundle.overview,
    "",
    "## Shared Themes",
    ...(bundle.overlapThemes.length > 0 ? bundle.overlapThemes.map((item) => `- ${item}`) : ["- No major topic overlap detected in the sampled videos."]),
    "",
    "## Key Winners",
    ...bundle.decisions.map((item) => `- ${item.category}: ${item.winner} | ${item.note}`),
    "",
    "## Recommendations",
    ...bundle.recommendations.map((item) => `- ${item}`),
    "",
    "## Whitespace Opportunities",
    ...bundle.whitespaceOpportunities.map((item) => `- ${item}`),
    "",
    "## Adapt To Me",
    bundle.adaptToMe.overview,
    "",
    "### Strengths To Keep",
    ...bundle.adaptToMe.strengthsToKeep.map((item) => `- ${item}`),
    "",
    "### Close These Gaps",
    ...bundle.adaptToMe.closeGaps.map((item) => `- ${item}`),
    "",
    "### Borrow First",
    ...bundle.adaptToMe.borrowFirst.map((item) => `- ${item}`),
    "",
    "### 30-Day Experiments",
    ...bundle.adaptToMe.experiments.map((item) => `- ${item}`),
    "",
    "### Cautions",
    ...bundle.adaptToMe.cautions.map((item) => `- ${item}`),
    "",
    ...(bundle.nicheModel
      ? [
        bundle.nicheModel.exportDeck,
        "",
      ]
      : []),
    "## Metrics",
    `- ${bundle.primaryLabel} sample size: ${bundle.metrics.primarySampleSize} videos`,
    `- ${bundle.competitorLabel} sample size: ${bundle.metrics.competitorSampleSize} videos`,
    `- ${bundle.primaryLabel} average title score: ${bundle.metrics.primaryAverageTitleScore}`,
    `- ${bundle.competitorLabel} average title score: ${bundle.metrics.competitorAverageTitleScore}`,
    `- ${bundle.primaryLabel} average visible views: ${bundle.metrics.primaryAverageViews}`,
    `- ${bundle.competitorLabel} average visible views: ${bundle.metrics.competitorAverageViews}`,
    `- ${bundle.primaryLabel} Studio coverage: ${bundle.metrics.primaryStudioCoverage}%`,
    `- ${bundle.competitorLabel} Studio coverage: ${bundle.metrics.competitorStudioCoverage}%`,
    `- ${bundle.primaryLabel} average impressions: ${bundle.metrics.primaryAverageImpressions}`,
    `- ${bundle.competitorLabel} average impressions: ${bundle.metrics.competitorAverageImpressions}`,
    `- ${bundle.primaryLabel} average CTR: ${bundle.metrics.primaryAverageCtr ? formatPercentage(bundle.metrics.primaryAverageCtr) : "n/a"}`,
    `- ${bundle.competitorLabel} average CTR: ${bundle.metrics.competitorAverageCtr ? formatPercentage(bundle.metrics.competitorAverageCtr) : "n/a"}`,
    `- ${bundle.primaryLabel} average retention: ${bundle.metrics.primaryAverageRetention ? formatPercentage(bundle.metrics.primaryAverageRetention) : "n/a"}`,
    `- ${bundle.competitorLabel} average retention: ${bundle.metrics.competitorAverageRetention ? formatPercentage(bundle.metrics.competitorAverageRetention) : "n/a"}`,
    `- ${bundle.primaryLabel} average view duration: ${bundle.metrics.primaryAverageViewDurationSeconds ? formatDurationLabel(bundle.metrics.primaryAverageViewDurationSeconds) : "n/a"}`,
    `- ${bundle.competitorLabel} average view duration: ${bundle.metrics.competitorAverageViewDurationSeconds ? formatDurationLabel(bundle.metrics.competitorAverageViewDurationSeconds) : "n/a"}`,
    `- ${bundle.primaryLabel} transcript coverage: ${bundle.metrics.primaryTranscriptCoverage}%`,
    `- ${bundle.competitorLabel} transcript coverage: ${bundle.metrics.competitorTranscriptCoverage}%`,
    `- ${bundle.primaryLabel} average transcript words: ${bundle.metrics.primaryAverageTranscriptWords}`,
    `- ${bundle.competitorLabel} average transcript words: ${bundle.metrics.competitorAverageTranscriptWords}`,
  ].join("\n");
}

export function buildChannelCompare(options: {
  primary: ChannelDeepDiveBundle;
  competitor: ChannelDeepDiveBundle;
  benchmarks?: ChannelDeepDiveBundle[];
}): ChannelCompareBundle {
  const primaryAverageTitleScore = averageChannelTitleScore(options.primary);
  const competitorAverageTitleScore = averageChannelTitleScore(options.competitor);
  const primaryAverageViews = averageViews(options.primary);
  const competitorAverageViews = averageViews(options.competitor);
  const primaryStudioCoverage = options.primary.studioMetrics.coverage;
  const competitorStudioCoverage = options.competitor.studioMetrics.coverage;
  const primaryAverageImpressions = options.primary.studioMetrics.averageImpressions;
  const competitorAverageImpressions = options.competitor.studioMetrics.averageImpressions;
  const primaryAverageCtr = options.primary.studioMetrics.averageImpressionsCtr;
  const competitorAverageCtr = options.competitor.studioMetrics.averageImpressionsCtr;
  const primaryAverageRetention = options.primary.studioMetrics.averagePercentageViewed;
  const competitorAverageRetention = options.competitor.studioMetrics.averagePercentageViewed;
  const primaryAverageViewDurationSeconds = options.primary.studioMetrics.averageViewDurationSeconds;
  const competitorAverageViewDurationSeconds = options.competitor.studioMetrics.averageViewDurationSeconds;
  const primaryAverageTranscriptWords = averageTranscriptWords(options.primary);
  const competitorAverageTranscriptWords = averageTranscriptWords(options.competitor);
  const overlapThemes = options.primary.topicClusters
    .filter((theme) => options.competitor.topicClusters.includes(theme))
    .filter((theme) => isMeaningfulTopicLabel(theme))
    .slice(0, 5);

  const decisions: ChannelCompareDecision[] = [
    {
      category: "SEO Packaging Edge",
      winner: compareWinnerLabel(options.primary.channelLabel, primaryAverageTitleScore, options.competitor.channelLabel, competitorAverageTitleScore),
      note: `${options.primary.channelLabel} averages ${primaryAverageTitleScore} vs ${options.competitor.channelLabel} at ${competitorAverageTitleScore} on title score.`,
    },
    {
      category: "Visible View Momentum",
      winner: compareWinnerLabel(options.primary.channelLabel, primaryAverageViews, options.competitor.channelLabel, competitorAverageViews),
      note: `${options.primary.channelLabel} averages about ${formatCompactViews(primaryAverageViews || 0)} visible views vs ${formatCompactViews(competitorAverageViews || 0)} for ${options.competitor.channelLabel}.`,
    },
    {
      category: "CTR Edge",
      winner: compareWinnerLabel(options.primary.channelLabel, primaryAverageCtr, options.competitor.channelLabel, competitorAverageCtr),
      note: `${options.primary.channelLabel} averages ${formatPercentage(primaryAverageCtr || 0)} CTR vs ${formatPercentage(competitorAverageCtr || 0)} for ${options.competitor.channelLabel}.`,
    },
    {
      category: "Retention Edge",
      winner: compareWinnerLabel(options.primary.channelLabel, primaryAverageRetention, options.competitor.channelLabel, competitorAverageRetention),
      note: `${options.primary.channelLabel} averages ${formatPercentage(primaryAverageRetention || 0)} average percentage viewed vs ${formatPercentage(competitorAverageRetention || 0)} for ${options.competitor.channelLabel}.`,
    },
    {
      category: "Transcript Intelligence Depth",
      winner: compareWinnerLabel(options.primary.channelLabel, options.primary.transcriptCoverage, options.competitor.channelLabel, options.competitor.transcriptCoverage),
      note: `${options.primary.channelLabel} has ${options.primary.transcriptCoverage}% transcript coverage vs ${options.competitor.transcriptCoverage}% for ${options.competitor.channelLabel}.`,
    },
    {
      category: "Teaching Depth",
      winner: compareWinnerLabel(options.primary.channelLabel, primaryAverageTranscriptWords, options.competitor.channelLabel, competitorAverageTranscriptWords),
      note: `${options.primary.channelLabel} averages ${primaryAverageTranscriptWords} transcript words vs ${competitorAverageTranscriptWords} for ${options.competitor.channelLabel}.`,
    },
    {
      category: "Topic Breadth",
      winner: compareWinnerLabel(options.primary.channelLabel, options.primary.topicClusters.length, options.competitor.channelLabel, options.competitor.topicClusters.length),
      note: `${options.primary.channelLabel} shows ${options.primary.topicClusters.length} visible topic clusters vs ${options.competitor.topicClusters.length} for ${options.competitor.channelLabel}.`,
    },
  ];

  const recommendations = uniqueItems([
    primaryAverageTitleScore >= competitorAverageTitleScore
      ? `Steal packaging cues from ${options.primary.channelLabel} if you want more explicit result-driven titles.`
      : `Steal packaging cues from ${options.competitor.channelLabel} if you want more explicit result-driven titles.`,
    overlapThemes[0]
      ? `Both channels compete around ${overlapThemes[0]}, so differentiation should come from format, audience promise, or speed of execution.`
      : "The sampled feeds do not strongly overlap on topics, so a positioning gap may be easier to win than a direct content clone.",
    primaryAverageViews >= competitorAverageViews
      ? `${options.primary.channelLabel} currently shows stronger visible view momentum in this sample; study which topics and title shapes are carrying that pull.`
      : `${options.competitor.channelLabel} currently shows stronger visible view momentum in this sample; inspect those winners before copying lower-pull formats.`,
    primaryAverageCtr >= competitorAverageCtr
      ? `${options.primary.channelLabel} is currently winning more clicks per impression, so its packaging system deserves extra scrutiny.`
      : `${options.competitor.channelLabel} is currently winning more clicks per impression, so study its thumbnail-title pairing before copying topics alone.`,
    primaryAverageRetention >= competitorAverageRetention
      ? `${options.primary.channelLabel} is holding viewers longer in the imported sample, which usually points to stronger pacing or better payoff delivery.`
      : `${options.competitor.channelLabel} is holding viewers longer in the imported sample, so scripting and structure may be stronger than the title alone suggests.`,
    options.primary.transcriptCoverage >= options.competitor.transcriptCoverage
      ? `${options.primary.channelLabel} gives a richer transcript-backed teaching signal; use its structure as the cleaner model for scripting.`
      : `${options.competitor.channelLabel} gives a richer transcript-backed teaching signal; use its structure as the cleaner model for scripting.`,
    primaryAverageTitleScore < competitorAverageTitleScore
      ? `If you are modeling ${options.primary.channelLabel}, the fastest lift is stronger specificity, numbers, and harder payoff language in titles.`
      : `If you are modeling ${options.competitor.channelLabel}, the fastest lift is stronger specificity, numbers, and harder payoff language in titles.`,
  ], 5);
  const whitespaceOpportunities = uniqueItems([
    overlapThemes[0]
      ? `Attack ${overlapThemes[0]} with a tighter audience promise than both feeds currently use.`
      : "The topic lanes barely overlap, so there is room to combine both positioning angles into a hybrid niche play.",
    options.primary.opportunityFinder[0] ? `${options.primary.channelLabel} gap: ${options.primary.opportunityFinder[0]}` : "",
    options.competitor.opportunityFinder[0] ? `${options.competitor.channelLabel} gap: ${options.competitor.opportunityFinder[0]}` : "",
    options.primary.topicClusters.find((theme) => !options.competitor.topicClusters.includes(theme))
      ? `Own ${options.primary.topicClusters.find((theme) => !options.competitor.topicClusters.includes(theme))} before ${options.competitor.channelLabel} expands into it.`
      : "",
    options.competitor.topicClusters.find((theme) => !options.primary.topicClusters.includes(theme))
      ? `Borrow ${options.competitor.topicClusters.find((theme) => !options.primary.topicClusters.includes(theme))} and repackage it with a clearer result promise.`
      : "",
  ].filter(Boolean), 5);
  const adaptToMe = buildAdaptToMeCompare(options.primary, options.competitor);
  const nicheChannels = [options.primary, options.competitor, ...(options.benchmarks ?? [])];
  const nicheModel = nicheChannels.length >= 2 ? buildChannelNicheModel(nicheChannels.slice(0, 3)) : null;

  const overview = compactSentence(`${options.primary.channelLabel} and ${options.competitor.channelLabel} ${overlapThemes.length > 0 ? `intersect around ${overlapThemes.slice(0, 2).join(" and ")}` : "appear to attack the market from different topic angles"}. This compare reads ${options.primary.analyzedVideos} vs ${options.competitor.analyzedVideos} sampled videos, and the clearest competitive edge currently sits with ${decisions[0]?.winner ?? "the stronger packager"} on packaging.`, 320);

  const baseBundle: Omit<ChannelCompareBundle, "exportDeck"> = {
    primaryLabel: options.primary.channelLabel,
    competitorLabel: options.competitor.channelLabel,
    overview,
    overlapThemes,
    decisions,
    recommendations,
    whitespaceOpportunities,
    adaptToMe,
    nicheModel,
    metrics: {
      primarySampleSize: options.primary.analyzedVideos,
      competitorSampleSize: options.competitor.analyzedVideos,
      primaryAverageTitleScore,
      competitorAverageTitleScore,
      primaryAverageViews,
      competitorAverageViews,
      primaryStudioCoverage,
      competitorStudioCoverage,
      primaryAverageImpressions,
      competitorAverageImpressions,
      primaryAverageCtr,
      competitorAverageCtr,
      primaryAverageRetention,
      competitorAverageRetention,
      primaryAverageViewDurationSeconds,
      competitorAverageViewDurationSeconds,
      primaryTranscriptCoverage: options.primary.transcriptCoverage,
      competitorTranscriptCoverage: options.competitor.transcriptCoverage,
      primaryAverageTranscriptWords,
      competitorAverageTranscriptWords,
    },
  };

  return {
    ...baseBundle,
    exportDeck: buildChannelCompareExport(baseBundle),
  };
}
