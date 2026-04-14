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

const results = [];

for (const channel of QA_CHANNELS) {
  try {
    const videos = await fetchChannelSample(channel);
    const deepDive = buildChannelDeepDive({
      channelUrl: channel.url,
      videos,
      sourceVideoCount: videos.length,
      summaryStyle: "executive",
      audiencePreset: "creator",
      outputLanguage: "en",
      cleaner: {
        removeNoiseTags: true,
        removeSpeakerLabels: false,
        dedupeLines: true,
        trimFillers: true,
      },
    });

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
const comparePair = passedResults.length >= 2
  ? buildChannelCompare({
    primary: passedResults[0].deepDive,
    competitor: passedResults[1].deepDive,
  })
  : null;

const lines = [
  "# Channel QA Matrix",
  "",
  `Generated: ${new Date().toISOString()}`,
  "",
  "## QA Summary",
  `- Channels tested: ${results.length}`,
  `- Channels passed: ${passedResults.length}`,
  `- Compare smoke: ${comparePair ? "passed" : "skipped"}`,
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

if (comparePair) {
  lines.push("## Compare Smoke");
  lines.push(`${comparePair.primaryLabel} vs ${comparePair.competitorLabel}`);
  lines.push("");
  lines.push(`- Overview: ${comparePair.overview}`);
  lines.push(`- Winner 1: ${comparePair.decisions[0]?.category} -> ${comparePair.decisions[0]?.winner ?? "n/a"}`);
  lines.push(`- Winner 2: ${comparePair.decisions[1]?.category} -> ${comparePair.decisions[1]?.winner ?? "n/a"}`);
  lines.push(`- Recommendation: ${comparePair.recommendations[0] ?? "n/a"}`);
  lines.push("");
}

const output = `${lines.join("\n")}\n`;
const outputUrl = relativePathFromImportMeta("../QA_CHANNEL_MATRIX.md");
await writeFile(outputUrl, output, "utf8");
console.log(`QA matrix written to ${outputUrl.pathname}`);

await ocrWorker.terminate();
