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
};

export type ChannelScorecardItem = {
  label: string;
  score: number;
  note: string;
};

export type ChannelDeepDiveBundle = {
  channelLabel: string;
  channelUrl: string;
  analyzedVideos: number;
  sourceVideoCount: number;
  transcriptCoverage: number;
  averageViewCount: number;
  sampleNote: string;
  overview: string;
  scorecard: ChannelScorecardItem[];
  signatureMoves: string[];
  topicClusters: string[];
  titlePatterns: string[];
  titleTemplates: string[];
  seoAudit: string[];
  descriptionSignals: string[];
  styleDNA: string[];
  thumbnailTextSignals: string[];
  contentArchitecture: string[];
  audiencePositioning: string[];
  publishingSystem: string[];
  viewSignals: string[];
  opportunityFinder: string[];
  nextVideoIdeas: string[];
  cloneBrief: string[];
  takeoverSprint: string[];
  exportDeck: string;
  videoBreakdowns: ChannelDeepDiveVideo[];
};

export type ChannelCompareDecision = {
  category: string;
  winner: string;
  note: string;
};

export type ChannelCompareBundle = {
  primaryLabel: string;
  competitorLabel: string;
  overview: string;
  overlapThemes: string[];
  decisions: ChannelCompareDecision[];
  recommendations: string[];
  whitespaceOpportunities: string[];
  metrics: {
    primarySampleSize: number;
    competitorSampleSize: number;
    primaryAverageTitleScore: number;
    competitorAverageTitleScore: number;
    primaryAverageViews: number;
    competitorAverageViews: number;
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

const STOP_WORDS = new Set(["the", "and", "for", "that", "with", "this", "from", "into", "your", "you", "are", "have", "were", "they", "there", "about", "would", "could", "should", "while", "where", "when", "what", "which", "because", "without", "after", "before", "being", "been", "then", "also", "just", "only", "more", "less", "very", "around", "through", "using", "used", "use", "like", "will", "does", "did", "doing", "done", "make", "made", "much", "many", "some", "most", "here", "want", "need", "next", "video", "videos", "youtube", "host", "team", "today", "get", "can", "our", "their", "them", "people", "actually", "going", "first", "look", "back", "real", "thing", "things", "time", "times", "year", "years", "still", "even", "ever", "every", "other", "another"]);
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
  if (viewCounts.length === 0) {
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
    `Average visible views sit around ${formatCompactViews(averageViews)}, which gives a rough read on current reach per sampled upload.`,
    topVideo?.viewCount !== null ? `The strongest visible pull currently comes from "${compactLabel(topVideo.title, 54)}" at about ${formatCompactViews(topVideo.viewCount)} views.` : "",
    momentumRatio >= 1.35 ? "The sample shows a few stronger spikes above the median, which suggests breakout-style topics or packaging outliers matter here." : "View performance looks relatively even across the visible sample, which suggests consistency may matter more than one-off spikes.",
    topicClusters[0] ? `Use view labels to pressure-test whether ${topicClusters[0]} is just frequent or actually one of the channel's strongest audience magnets.` : "",
  ].filter(Boolean), 4);
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
  const averageViews = videoBreakdowns.filter((video) => video.viewCount !== null).length > 0
    ? videoBreakdowns.filter((video) => video.viewCount !== null).reduce((sum, video) => sum + (video.viewCount ?? 0), 0) / videoBreakdowns.filter((video) => video.viewCount !== null).length
    : 0;
  const tacticalSignal = /(framework|playbook|system|template|guide|steps?|mistake|fix)/i.test([styleDNA.join(" "), titlePatterns.join(" ")].join(" "))
    ? 8
    : 0;
  const repurposeSignal = videoBreakdowns.filter((video) => video.titleScore >= 72).length / Math.max(videoBreakdowns.length, 1);

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
      score: clampScore(averageViews > 0 ? Math.min(96, 36 + Math.log10(averageViews + 1) * 12) : 42),
      note: averageViews > 0 ? `Visible sample views average roughly ${formatCompactViews(averageViews)}, which helps estimate how much audience pull the current formats have.` : "View labels are too light in this sample for a stronger audience-pull read, so treat this as directional.",
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
    "## Signature Moves",
    ...bundle.signatureMoves.map((item) => `- ${item}`),
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
    "## Content Architecture",
    ...bundle.contentArchitecture.map((item) => `- ${item}`),
    "",
    "## Audience Positioning",
    ...bundle.audiencePositioning.map((item) => `- ${item}`),
    "",
    "## Publishing System",
    ...bundle.publishingSystem.map((item) => `- ${item}`),
    "",
    "## View Signals",
    ...bundle.viewSignals.map((item) => `- ${item}`),
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
    transcript?: string;
  }>;
  sourceVideoCount?: number;
  summaryStyle: SummaryStyle;
  audiencePreset: AudiencePreset;
  outputLanguage: OutputLanguage;
  cleaner: CleanerSettings;
}): ChannelDeepDiveBundle {
  const channelLabel = inferChannelLabel(options.channelUrl);
  const videoBreakdowns = options.videos.map((video) => {
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
      viewCount: parseViewCountLabel(video.viewLabel ?? ""),
      descriptionAvailable: String(video.description ?? "").trim().length > 0,
      thumbnailText: compactLabel(String(video.thumbnailText ?? "").trim(), 64),
      transcriptAvailable,
      transcriptWordCount: transcriptAvailable ? getWordCount(transcript) : 0,
      primaryTheme,
      summary: analysis?.summary.overview ?? compactSentence(video.title, 120),
      titleScore,
    };
  });

  const transcriptCoverage = videoBreakdowns.length > 0
    ? Math.round((videoBreakdowns.filter((video) => video.transcriptAvailable).length / videoBreakdowns.length) * 100)
    : 0;
  const averageViewCount = videoBreakdowns.filter((video) => video.viewCount !== null).length > 0
    ? Math.round(videoBreakdowns.filter((video) => video.viewCount !== null).reduce((sum, video) => sum + (video.viewCount ?? 0), 0) / videoBreakdowns.filter((video) => video.viewCount !== null).length)
    : 0;
  const sourceVideoCount = Math.max(videoBreakdowns.length, options.sourceVideoCount ?? videoBreakdowns.length);
  const sampleNote = sourceVideoCount > videoBreakdowns.length
    ? `Built from ${videoBreakdowns.length} selected videos out of ${sourceVideoCount} loaded recent uploads.`
    : `Built from ${videoBreakdowns.length} recent videos in the current sample.`;
  const aggregateText = options.videos.map((video) => [video.title, video.description ?? "", video.thumbnailText ?? "", video.transcript ?? ""].filter(Boolean).join(". ")).join("\n");
  const aggregateSentences = splitSentences(aggregateText);
  const topicClusters = collectKeywords(aggregateSentences).slice(0, 8).map((keyword) => titleCase(keyword));
  const titlePatterns = summarizeTitlePatterns(options.videos.map((video) => video.title));
  const descriptionSignals = summarizeDescriptionSignals(options.videos);
  const titleTemplates = buildTitleTemplates(options.videos.map((video) => video.title), topicClusters);
  const styleDNA = inferStyleDNA(aggregateText, options.videos.map((video) => video.title));
  const thumbnailTextSignals = summarizeThumbnailTextSignals(options.videos, options.videos.map((video) => video.title));
  const contentArchitecture = inferContentArchitecture(videoBreakdowns, topicClusters);
  const audiencePositioning = uniqueItems([
    ...detectAudiencePositioning(aggregateText),
    options.audiencePreset === "creator" ? "Current workspace is tuned for creator-facing outputs, which aligns well with creator education channels." : "",
  ].filter(Boolean), 4);
  const publishingSystem = inferPublishingSystem(videoBreakdowns);
  const viewSignals = buildViewSignals(videoBreakdowns, topicClusters);
  const opportunityFinder = inferOpportunities(videoBreakdowns, titlePatterns, topicClusters);
  const nextVideoIdeas = buildNextVideoIdeas(topicClusters, titleTemplates, videoBreakdowns);
  const scorecard = buildChannelScorecard(videoBreakdowns, transcriptCoverage, styleDNA, titlePatterns);
  const signatureMoves = buildSignatureMoves(titlePatterns, styleDNA, contentArchitecture, audiencePositioning);
  const cloneBrief = uniqueItems([
    topicClusters[0] ? `Lead with ${topicClusters[0]}-anchored titles, then make the payoff explicit in the first 45 characters.` : "Lead with one clear theme per title and avoid trying to promise too many outcomes at once.",
    "Open each video with a direct payoff statement, then move into the framework or example quickly.",
    "Turn the strongest recurring topic into a named repeatable series so viewers can recognize the format immediately.",
    "Repurpose every strong long-form lesson into Shorts, LinkedIn, and thread-sized takeaways to compound reach.",
  ], 4);
  const takeoverSprint = buildTakeoverSprint(channelLabel, topicClusters, nextVideoIdeas, opportunityFinder, titleTemplates);
  const overview = compactSentence(`${channelLabel} looks like a ${topicClusters[0] ? `${topicClusters[0]}-led` : "topic-driven"} channel with ${transcriptCoverage}% transcript coverage across ${videoBreakdowns.length} recent videos. The feed leans on ${titlePatterns[1]?.toLowerCase() ?? "repeatable title formulas"}, while the delivery reads as ${styleDNA[0]?.toLowerCase() ?? "system-oriented and tactical"}.`, 320);
  const exportDeck = buildChannelDeepDiveExport({
    channelLabel,
    channelUrl: options.channelUrl,
    analyzedVideos: videoBreakdowns.length,
    sourceVideoCount,
    transcriptCoverage,
    averageViewCount,
    sampleNote,
    overview,
    scorecard,
    signatureMoves,
    topicClusters,
    titlePatterns,
    titleTemplates,
    seoAudit: titlePatterns,
    descriptionSignals,
    styleDNA,
    thumbnailTextSignals,
    contentArchitecture,
    audiencePositioning,
    publishingSystem,
    viewSignals,
    opportunityFinder,
    nextVideoIdeas,
    cloneBrief,
    takeoverSprint,
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
    sampleNote,
    overview,
    scorecard,
    signatureMoves,
    topicClusters,
    titlePatterns,
    titleTemplates,
    seoAudit: titlePatterns,
    descriptionSignals,
    styleDNA,
    thumbnailTextSignals,
    contentArchitecture,
    audiencePositioning,
    publishingSystem,
    viewSignals,
    opportunityFinder,
    nextVideoIdeas,
    cloneBrief,
    takeoverSprint,
    exportDeck,
    videoBreakdowns,
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
    "## Metrics",
    `- ${bundle.primaryLabel} sample size: ${bundle.metrics.primarySampleSize} videos`,
    `- ${bundle.competitorLabel} sample size: ${bundle.metrics.competitorSampleSize} videos`,
    `- ${bundle.primaryLabel} average title score: ${bundle.metrics.primaryAverageTitleScore}`,
    `- ${bundle.competitorLabel} average title score: ${bundle.metrics.competitorAverageTitleScore}`,
    `- ${bundle.primaryLabel} average visible views: ${bundle.metrics.primaryAverageViews}`,
    `- ${bundle.competitorLabel} average visible views: ${bundle.metrics.competitorAverageViews}`,
    `- ${bundle.primaryLabel} transcript coverage: ${bundle.metrics.primaryTranscriptCoverage}%`,
    `- ${bundle.competitorLabel} transcript coverage: ${bundle.metrics.competitorTranscriptCoverage}%`,
    `- ${bundle.primaryLabel} average transcript words: ${bundle.metrics.primaryAverageTranscriptWords}`,
    `- ${bundle.competitorLabel} average transcript words: ${bundle.metrics.competitorAverageTranscriptWords}`,
  ].join("\n");
}

export function buildChannelCompare(options: {
  primary: ChannelDeepDiveBundle;
  competitor: ChannelDeepDiveBundle;
}): ChannelCompareBundle {
  const primaryAverageTitleScore = averageChannelTitleScore(options.primary);
  const competitorAverageTitleScore = averageChannelTitleScore(options.competitor);
  const primaryAverageViews = averageViews(options.primary);
  const competitorAverageViews = averageViews(options.competitor);
  const primaryAverageTranscriptWords = averageTranscriptWords(options.primary);
  const competitorAverageTranscriptWords = averageTranscriptWords(options.competitor);
  const overlapThemes = options.primary.topicClusters.filter((theme) => options.competitor.topicClusters.includes(theme)).slice(0, 5);

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
    options.primary.transcriptCoverage >= options.competitor.transcriptCoverage
      ? `${options.primary.channelLabel} gives a richer transcript-backed teaching signal; use its structure as the cleaner model for scripting.`
      : `${options.competitor.channelLabel} gives a richer transcript-backed teaching signal; use its structure as the cleaner model for scripting.`,
    primaryAverageTitleScore < competitorAverageTitleScore
      ? `If you are modeling ${options.primary.channelLabel}, the fastest lift is stronger specificity, numbers, and harder payoff language in titles.`
      : `If you are modeling ${options.competitor.channelLabel}, the fastest lift is stronger specificity, numbers, and harder payoff language in titles.`,
  ], 4);
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

  const overview = compactSentence(`${options.primary.channelLabel} and ${options.competitor.channelLabel} ${overlapThemes.length > 0 ? `intersect around ${overlapThemes.slice(0, 2).join(" and ")}` : "appear to attack the market from different topic angles"}. This compare reads ${options.primary.analyzedVideos} vs ${options.competitor.analyzedVideos} sampled videos, and the clearest competitive edge currently sits with ${decisions[0]?.winner ?? "the stronger packager"} on packaging.`, 320);

  const baseBundle: Omit<ChannelCompareBundle, "exportDeck"> = {
    primaryLabel: options.primary.channelLabel,
    competitorLabel: options.competitor.channelLabel,
    overview,
    overlapThemes,
    decisions,
    recommendations,
    whitespaceOpportunities,
    metrics: {
      primarySampleSize: options.primary.analyzedVideos,
      competitorSampleSize: options.competitor.analyzedVideos,
      primaryAverageTitleScore,
      competitorAverageTitleScore,
      primaryAverageViews,
      competitorAverageViews,
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
