import { writeFile } from "node:fs/promises";
import { createWorker, PSM } from "tesseract.js";
import { buildChannelDeepDive, buildChannelCompare } from "../src/premium.ts";
const youtubeTranscriptModule = await import(new URL("../node_modules/youtube-transcript/dist/youtube-transcript.esm.js", import.meta.url).href);
const fetchTranscript = youtubeTranscriptModule.fetchTranscript;

const youtubeWatchUserAgent =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36";
const youtubeRequestHeaders = {
  "User-Agent": youtubeWatchUserAgent,
  "Accept-Language": "en-US,en;q=0.9",
};

const QA_CHANNELS = [
  { label: "Creator Education", url: "https://www.youtube.com/@ThinkMediaTV" },
  { label: "Productivity / Business", url: "https://www.youtube.com/@AliAbdaal" },
  { label: "Software Tutorial", url: "https://www.youtube.com/@Fireship" },
  { label: "Documentary / Commentary", url: "https://www.youtube.com/@ColdFusion" },
  { label: "Startup / Founder", url: "https://www.youtube.com/@ycombinator" },
];

const QA_COMPARE_PAIRS = [
  {
    label: "Creator Education",
    primary: { label: "ThinkMediaTV", url: "https://www.youtube.com/@ThinkMediaTV" },
    competitor: { label: "VideoCreators", url: "https://www.youtube.com/@VideoCreators" },
  },
  {
    label: "Productivity / Business",
    primary: { label: "AliAbdaal", url: "https://www.youtube.com/@AliAbdaal" },
    competitor: { label: "Thomas Frank", url: "https://www.youtube.com/@Thomasfrank" },
  },
  {
    label: "Software Tutorial",
    primary: { label: "Fireship", url: "https://www.youtube.com/@Fireship" },
    competitor: { label: "Traversy Media", url: "https://www.youtube.com/@TraversyMedia" },
  },
];

const DEFAULT_DEEP_DIVE_OPTIONS = {
  summaryStyle: "executive",
  audiencePreset: "creator",
  outputLanguage: "en",
  cleaner: {
    removeNoiseTags: true,
    removeSpeakerLabels: false,
    dedupeLines: true,
    trimFillers: true,
  },
};

function decodeHtmlEntities(value) {
  return String(value ?? "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

function decodeJsonString(value) {
  if (!value) return "";
  try {
    return JSON.parse(`"${value}"`);
  } catch {
    return String(value)
      .replace(/\\n/g, "\n")
      .replace(/\\"/g, '"')
      .replace(/\\\\/g, "\\");
  }
}

function normalizeChannelUrl(value) {
  const parsed = new URL(String(value).trim());
  const cleanPath = parsed.pathname.replace(/\/+$/, "");
  const channelPath = cleanPath.endsWith("/videos") ? cleanPath : `${cleanPath}/videos`;
  return `${parsed.origin}${channelPath}`;
}

function relativePathFromImportMeta(pathname) {
  return new URL(pathname, import.meta.url);
}

function extractChannelVideos(html, limit = 2) {
  const byId = new Map();
  const rendererPattern =
    /"videoRenderer":\{"videoId":"([^"]{11})"[\s\S]*?"title":\{"runs":\[\{"text":"([^"]+)"\}\]/g;

  for (const match of html.matchAll(rendererPattern)) {
    const videoId = match[1];
    const title = decodeHtmlEntities(match[2]).trim();
    const slice = html.slice(match.index ?? 0, (match.index ?? 0) + 2500);
    const publishedLabel = decodeHtmlEntities(slice.match(/"publishedTimeText":\{"simpleText":"([^"]+)"/)?.[1] ?? "").trim();
    const viewLabel = decodeHtmlEntities(slice.match(/"viewCountText":\{"simpleText":"([^"]+)"/)?.[1] ?? "").trim();
    if (!byId.has(videoId)) {
      byId.set(videoId, {
        videoId,
        title: title || "Untitled Video",
        url: `https://www.youtube.com/watch?v=${videoId}`,
        publishedLabel,
        viewLabel,
      });
    }
    if (byId.size >= limit) {
      return [...byId.values()];
    }
  }

  return [...byId.values()];
}

function extractMetaContent(html, pattern) {
  const match = html.match(pattern);
  return decodeHtmlEntities(match?.[1] ?? "").trim();
}

function extractVideoDescription(html) {
  const shortDescription = html.match(/"shortDescription":"((?:\\.|[^"])*)"/);
  if (shortDescription?.[1]) {
    return decodeHtmlEntities(decodeJsonString(shortDescription[1])).replace(/\s+\n/g, "\n").trim();
  }
  return extractMetaContent(html, /<meta\s+(?:name|property)="description"\s+content="([^"]*)"/i);
}

function normalizeThumbnailText(value) {
  return String(value ?? "")
    .split(/\r?\n/)
    .map((line) => line.replace(/[^\p{L}\p{N}&:+'"!?.,\-\s]/gu, " ").replace(/\s+/g, " ").trim())
    .filter(Boolean)
    .slice(0, 4)
    .join(" | ")
    .slice(0, 140)
    .trim();
}

const ocrWorker = await createWorker("eng", 1, { logger: () => {} });
await ocrWorker.setParameters({ tessedit_pageseg_mode: PSM.SPARSE_TEXT });

async function fetchThumbnailText(url) {
  if (!url) return "";
  try {
    const { data } = await ocrWorker.recognize(url);
    return normalizeThumbnailText(data?.text ?? "");
  } catch {
    return "";
  }
}

async function fetchVideoMetadata(url) {
  const response = await fetch(url, {
    headers: youtubeRequestHeaders,
  });
  if (!response.ok) {
    throw new Error(`Could not load video page: ${url}`);
  }
  const html = await response.text();
  const title = extractMetaContent(html, /<meta\s+property="og:title"\s+content="([^"]+)"/i)
    || extractMetaContent(html, /<title>([^<]+)<\/title>/i).replace(/\s+-\s+YouTube$/i, "").trim();
  const description = extractVideoDescription(html);
  const thumbnailUrl = extractMetaContent(html, /<meta\s+property="og:image"\s+content="([^"]+)"/i);
  const thumbnailText = await fetchThumbnailText(thumbnailUrl);
  return {
    title,
    description,
    thumbnailUrl,
    thumbnailText,
  };
}

async function fetchChannelSample(channel) {
  let videos = [];
  let lastError = null;
  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      const response = await fetch(normalizeChannelUrl(channel.url), {
        headers: youtubeRequestHeaders,
      });
      if (!response.ok) {
        throw new Error(`Could not load channel page: ${channel.url}`);
      }
      const html = await response.text();
      videos = extractChannelVideos(html, 2);
      if (videos.length > 0) {
        break;
      }
      lastError = new Error(`No recent videos found for ${channel.url}`);
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(`Could not load channel page: ${channel.url}`);
    }

    if (attempt < 3) {
      await new Promise((resolve) => setTimeout(resolve, 220 * attempt));
    }
  }

  if (videos.length === 0) {
    throw lastError ?? new Error(`No recent videos found for ${channel.url}`);
  }

  return Promise.all(videos.map(async (video) => {
    const [transcriptResult, metadataResult] = await Promise.allSettled([
      fetchTranscript(video.url),
      fetchVideoMetadata(video.url),
    ]);

    return {
      ...video,
      title: metadataResult.status === "fulfilled" && metadataResult.value.title ? metadataResult.value.title : video.title,
      transcript: transcriptResult.status === "fulfilled"
        ? transcriptResult.value.map((entry) => `${entry.offset > 1000 ? Math.floor(entry.offset / 1000) : Math.floor(entry.offset)} ${entry.text}`.trim()).join("\n")
        : "",
      description: metadataResult.status === "fulfilled" ? metadataResult.value.description : "",
      thumbnailUrl: metadataResult.status === "fulfilled" ? metadataResult.value.thumbnailUrl : "",
      thumbnailText: metadataResult.status === "fulfilled" ? metadataResult.value.thumbnailText : "",
    };
  }));
}

function buildDeepDiveFromSample(channelUrl, videos, sourceVideoCount = videos.length) {
  return buildChannelDeepDive({
    channelUrl,
    videos,
    sourceVideoCount,
    ...DEFAULT_DEEP_DIVE_OPTIONS,
  });
}

const results = [];

for (const channel of QA_CHANNELS) {
  try {
    const videos = await fetchChannelSample(channel);
    const deepDive = buildDeepDiveFromSample(channel.url, videos, videos.length);

    results.push({
      label: channel.label,
      url: channel.url,
      videos,
      deepDive,
      status: deepDive.analyzedVideos > 0 ? "passed" : "failed",
      note: deepDive.analyzedVideos > 0 ? "" : "No analyzable videos were returned after sampling.",
    });
    if (deepDive.analyzedVideos === 0) {
      continue;
    }
  } catch (error) {
    results.push({
      label: channel.label,
      url: channel.url,
      videos: [],
      deepDive: null,
      status: "failed",
      note: error instanceof Error ? error.message : "Unknown QA failure",
    });
  }
}

const passedResults = results.filter((result) => result.deepDive);
const resultByUrl = new Map(results.map((result) => [result.url, result]));

async function ensureChannelResult(channel) {
  const existing = resultByUrl.get(channel.url);
  if (existing) return existing;

  try {
    const videos = await fetchChannelSample(channel);
    const deepDive = buildDeepDiveFromSample(channel.url, videos, videos.length);
    const nextResult = {
      label: channel.label,
      url: channel.url,
      videos,
      deepDive,
      status: deepDive.analyzedVideos > 0 ? "passed" : "failed",
      note: deepDive.analyzedVideos > 0 ? "" : "No analyzable videos were returned after sampling.",
    };
    resultByUrl.set(channel.url, nextResult);
    return nextResult;
  } catch (error) {
    const failedResult = {
      label: channel.label,
      url: channel.url,
      videos: [],
      deepDive: null,
      status: "failed",
      note: error instanceof Error ? error.message : "Unknown QA failure",
    };
    resultByUrl.set(channel.url, failedResult);
    return failedResult;
  }
}

const comparePairs = [];
for (const pair of QA_COMPARE_PAIRS) {
  const primaryResult = await ensureChannelResult(pair.primary);
  const competitorResult = await ensureChannelResult(pair.competitor);
  if (!primaryResult.deepDive || !competitorResult.deepDive) continue;
  comparePairs.push({
    label: pair.label,
    primaryResult,
    competitorResult,
    compare: buildChannelCompare({
      primary: primaryResult.deepDive,
      competitor: competitorResult.deepDive,
    }),
  });
}

const compareSmokeStatus = comparePairs.length === QA_COMPARE_PAIRS.length ? "passed" : comparePairs.length > 0 ? "partial" : "skipped";

const noTranscriptCheckSource = passedResults.find((result) => result.videos.length >= 2) ?? null;
const noTranscriptCheck = noTranscriptCheckSource
  ? (() => {
    const adjustedVideos = noTranscriptCheckSource.videos.map((video, index) => (
      index === 0 ? { ...video, transcript: "" } : video
    ));
    const deepDive = buildDeepDiveFromSample(noTranscriptCheckSource.url, adjustedVideos, adjustedVideos.length);
    const passed = deepDive.analyzedVideos > 0 && deepDive.transcriptCoverage < noTranscriptCheckSource.deepDive.transcriptCoverage;
    return {
      label: noTranscriptCheckSource.label,
      passed,
      analyzedVideos: deepDive.analyzedVideos,
      transcriptCoverage: deepDive.transcriptCoverage,
    };
  })()
  : null;

const partialTranscriptCompareSource = comparePairs[0] ?? null;
const partialTranscriptCompareCheck = partialTranscriptCompareSource
  ? (() => {
    const adjustedCompetitorVideos = partialTranscriptCompareSource.competitorResult.videos.map((video, index) => (
      index === 0 ? { ...video, transcript: "" } : video
    ));
    const partialCompetitor = buildDeepDiveFromSample(
      partialTranscriptCompareSource.competitorResult.url,
      adjustedCompetitorVideos,
      adjustedCompetitorVideos.length,
    );
    const compare = buildChannelCompare({
      primary: partialTranscriptCompareSource.primaryResult.deepDive,
      competitor: partialCompetitor,
    });
    const passed = compare.decisions.length > 0
      && partialCompetitor.transcriptCoverage < partialTranscriptCompareSource.competitorResult.deepDive.transcriptCoverage;
    return {
      labels: `${compare.primaryLabel} vs ${compare.competitorLabel}`,
      passed,
      competitorTranscriptCoverage: partialCompetitor.transcriptCoverage,
      recommendation: compare.recommendations[0] ?? "n/a",
    };
  })()
  : null;

const deepDiveSelectionSource = passedResults.find((result) => result.videos.length >= 2) ?? null;
const deepDiveSelectionCheck = deepDiveSelectionSource
  ? (() => {
    const selectedVideos = deepDiveSelectionSource.videos.slice(0, 1);
    const filteredDeepDive = buildDeepDiveFromSample(
      deepDiveSelectionSource.url,
      selectedVideos,
      deepDiveSelectionSource.videos.length,
    );
    const changed = filteredDeepDive.analyzedVideos !== deepDiveSelectionSource.deepDive.analyzedVideos
      || filteredDeepDive.averageViewCount !== deepDiveSelectionSource.deepDive.averageViewCount
      || filteredDeepDive.overview !== deepDiveSelectionSource.deepDive.overview;
    return {
      label: deepDiveSelectionSource.label,
      passed: changed,
      baselineSample: deepDiveSelectionSource.deepDive.analyzedVideos,
      filteredSample: filteredDeepDive.analyzedVideos,
    };
  })()
  : null;

const compareSelectionSource = comparePairs.find((pair) => pair.primaryResult.videos.length >= 2 && pair.competitorResult.videos.length >= 2) ?? null;
const compareSelectionCheck = compareSelectionSource
  ? (() => {
    const filteredPrimary = buildDeepDiveFromSample(
      compareSelectionSource.primaryResult.url,
      compareSelectionSource.primaryResult.videos.slice(0, 1),
      compareSelectionSource.primaryResult.videos.length,
    );
    const filteredCompetitor = buildDeepDiveFromSample(
      compareSelectionSource.competitorResult.url,
      compareSelectionSource.competitorResult.videos.slice(0, 1),
      compareSelectionSource.competitorResult.videos.length,
    );
    const filteredCompare = buildChannelCompare({
      primary: filteredPrimary,
      competitor: filteredCompetitor,
    });
    const baselineCompare = compareSelectionSource.compare;
    const changed = filteredCompare.overview !== baselineCompare.overview
      || filteredCompare.metrics.primarySampleSize !== baselineCompare.metrics.primarySampleSize
      || filteredCompare.metrics.competitorSampleSize !== baselineCompare.metrics.competitorSampleSize
      || filteredCompare.metrics.primaryAverageViews !== baselineCompare.metrics.primaryAverageViews
      || filteredCompare.metrics.competitorAverageViews !== baselineCompare.metrics.competitorAverageViews;
    return {
      labels: `${baselineCompare.primaryLabel} vs ${baselineCompare.competitorLabel}`,
      passed: changed,
      baselineSample: `${baselineCompare.metrics.primarySampleSize}/${baselineCompare.metrics.competitorSampleSize}`,
      filteredSample: `${filteredCompare.metrics.primarySampleSize}/${filteredCompare.metrics.competitorSampleSize}`,
    };
  })()
  : null;

const lines = [
  "# Channel QA Matrix",
  "",
  `Generated: ${new Date().toISOString()}`,
  "",
  "## QA Summary",
  `- Channels tested: ${results.length}`,
  `- Channels passed: ${passedResults.length}`,
  `- Compare pairs tested: ${comparePairs.length}`,
  `- Compare smoke: ${compareSmokeStatus}`,
  `- Deep Dive no-transcript fallback: ${noTranscriptCheck?.passed ? "passed" : "failed"}`,
  `- Compare partial-transcript fallback: ${partialTranscriptCompareCheck?.passed ? "passed" : "failed"}`,
  `- Deep Dive selection impact: ${deepDiveSelectionCheck?.passed ? "passed" : "failed"}`,
  `- Compare selection impact: ${compareSelectionCheck?.passed ? "passed" : "failed"}`,
  "",
];

for (const result of results) {
  lines.push(`## ${result.label}`);
  lines.push(result.url);
  lines.push("");
  lines.push(`- Status: ${result.status}`);
  if (!result.deepDive) {
    lines.push(`- Note: ${result.note}`);
    lines.push("");
    continue;
  }
  lines.push(`- Sample videos: ${result.deepDive.analyzedVideos}`);
  lines.push(`- Transcript coverage: ${result.deepDive.transcriptCoverage}%`);
  lines.push(`- Average visible views: ${result.deepDive.averageViewCount}`);
  lines.push(`- Description signals: ${result.deepDive.descriptionSignals[0] ?? "n/a"}`);
  lines.push(`- Thumbnail signals: ${result.deepDive.thumbnailTextSignals[0] ?? "n/a"}`);
  lines.push(`- View signals: ${result.deepDive.viewSignals[0] ?? "n/a"}`);
  lines.push(`- Opportunity: ${result.deepDive.opportunityFinder[0] ?? "n/a"}`);
  lines.push("");
}

if (comparePairs.length > 0) {
  lines.push("## Compare Smoke");
  lines.push("");
  for (const pair of comparePairs) {
    lines.push(`### ${pair.compare.primaryLabel} vs ${pair.compare.competitorLabel}`);
    lines.push("");
    lines.push(`- Compare lane: ${pair.label}`);
    lines.push(`- Shared themes: ${pair.compare.overlapThemes.length > 0 ? pair.compare.overlapThemes.join(", ") : "None"}`);
    lines.push(`- Overview: ${pair.compare.overview}`);
    lines.push(`- Winner 1: ${pair.compare.decisions[0]?.category} -> ${pair.compare.decisions[0]?.winner ?? "n/a"}`);
    lines.push(`- Winner 2: ${pair.compare.decisions[1]?.category} -> ${pair.compare.decisions[1]?.winner ?? "n/a"}`);
    lines.push(`- Recommendation: ${pair.compare.recommendations[0] ?? "n/a"}`);
    lines.push("");
  }
}

lines.push("## Edge-Case QA");
lines.push("");
if (noTranscriptCheck) {
  lines.push(`- Deep Dive no-transcript fallback (${noTranscriptCheck.label}): ${noTranscriptCheck.passed ? "passed" : "failed"} | ${noTranscriptCheck.analyzedVideos} analyzable videos | ${noTranscriptCheck.transcriptCoverage}% transcript coverage`);
}
if (partialTranscriptCompareCheck) {
  lines.push(`- Compare partial-transcript fallback (${partialTranscriptCompareCheck.labels}): ${partialTranscriptCompareCheck.passed ? "passed" : "failed"} | competitor transcript coverage ${partialTranscriptCompareCheck.competitorTranscriptCoverage}%`);
  lines.push(`- Partial-transcript recommendation: ${partialTranscriptCompareCheck.recommendation}`);
}
if (deepDiveSelectionCheck) {
  lines.push(`- Deep Dive selection impact (${deepDiveSelectionCheck.label}): ${deepDiveSelectionCheck.passed ? "passed" : "failed"} | ${deepDiveSelectionCheck.baselineSample} videos -> ${deepDiveSelectionCheck.filteredSample} selected`);
}
if (compareSelectionCheck) {
  lines.push(`- Compare selection impact (${compareSelectionCheck.labels}): ${compareSelectionCheck.passed ? "passed" : "failed"} | baseline ${compareSelectionCheck.baselineSample} -> filtered ${compareSelectionCheck.filteredSample}`);
}
lines.push("");

const output = `${lines.join("\n")}\n`;
const outputUrl = relativePathFromImportMeta("../QA_CHANNEL_MATRIX.md");
await writeFile(outputUrl, output, "utf8");
console.log(`QA matrix written to ${outputUrl.pathname}`);

await ocrWorker.terminate();
