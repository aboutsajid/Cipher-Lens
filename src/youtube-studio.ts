export type StudioTrafficSource = {
  source: string;
  views: number | null;
  watchTimeHours: number | null;
  impressions: number | null;
};

export type StudioVideoMetrics = {
  views: number | null;
  impressions: number | null;
  impressionsCtr: number | null;
  averageViewDurationSeconds: number | null;
  averagePercentageViewed: number | null;
  watchTimeHours: number | null;
  trafficSources: StudioTrafficSource[];
  sourceFiles: string[];
};

export type StudioImportKind = "video-performance" | "traffic-source" | "unknown";

export type StudioImportSummary = {
  fileName: string;
  kind: StudioImportKind;
  matchedCount: number;
  unmatchedCount: number;
  rowCount: number;
};

type NormalizedRow = Record<string, string>;

type StudioPerformanceRow = {
  kind: "video-performance";
  videoId: string;
  title: string;
  views: number | null;
  impressions: number | null;
  impressionsCtr: number | null;
  averageViewDurationSeconds: number | null;
  averagePercentageViewed: number | null;
  watchTimeHours: number | null;
};

type StudioTrafficRow = {
  kind: "traffic-source";
  videoId: string;
  title: string;
  source: string;
  views: number | null;
  watchTimeHours: number | null;
  impressions: number | null;
};

type ParsedStudioRow = StudioPerformanceRow | StudioTrafficRow;

type VideoLike = {
  title: string;
  url: string;
  videoId: string;
  studioMetrics?: StudioVideoMetrics;
};

function normalizeHeader(value: string): string {
  return String(value ?? "")
    .replace(/^\ufeff/, "")
    .trim()
    .toLowerCase()
    .replace(/[%()]/g, " ")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeTitle(value: string): string {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function splitCsvLine(line: string): string[] {
  const values: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    const next = line[index + 1];

    if (char === '"') {
      if (inQuotes && next === '"') {
        current += '"';
        index += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (char === "," && !inQuotes) {
      values.push(current);
      current = "";
      continue;
    }

    current += char;
  }

  values.push(current);
  return values.map((value) => value.trim());
}

function parseCsv(content: string): NormalizedRow[] {
  const lines = String(content ?? "")
    .replace(/\r/g, "")
    .split("\n")
    .filter((line) => line.trim().length > 0);

  if (lines.length < 2) return [];

  const headers = splitCsvLine(lines[0]).map(normalizeHeader);
  return lines.slice(1).map((line) => {
    const cells = splitCsvLine(line);
    const row: NormalizedRow = {};

    headers.forEach((header, index) => {
      row[header] = String(cells[index] ?? "").trim();
    });

    return row;
  });
}

function pickFirstValue(row: NormalizedRow, aliases: string[]): string {
  for (const alias of aliases) {
    const normalizedAlias = normalizeHeader(alias);
    if (row[normalizedAlias]) return row[normalizedAlias];
  }

  return "";
}

function parseNumericCell(value: string): number | null {
  const normalized = String(value ?? "")
    .replace(/[$,]/g, "")
    .replace(/%/g, "")
    .trim();

  if (!normalized) return null;

  const number = Number(normalized);
  return Number.isFinite(number) ? number : null;
}

function parseDurationToSeconds(value: string): number | null {
  const normalized = String(value ?? "").trim();
  if (!normalized) return null;

  const parts = normalized.split(":").map((part) => Number(part.trim()));
  if (parts.length === 0 || parts.some((part) => !Number.isFinite(part))) return null;
  if (parts.length === 3) return (parts[0] * 3600) + (parts[1] * 60) + parts[2];
  if (parts.length === 2) return (parts[0] * 60) + parts[1];
  if (parts.length === 1) return parts[0];
  return null;
}

function extractVideoId(value: string): string {
  const normalized = String(value ?? "").trim();
  if (!normalized) return "";
  const directMatch = normalized.match(/(?:^|[^a-z0-9_-])([\w-]{11})(?:$|[^a-z0-9_-])/i);
  if (/^[\w-]{11}$/.test(normalized)) return normalized;
  if (directMatch?.[1]) return directMatch[1];

  const watchMatch = normalized.match(/[?&]v=([\w-]{11})/i);
  if (watchMatch?.[1]) return watchMatch[1];

  const pathMatch = normalized.match(/\/(?:watch|embed|shorts|live)\/?([\w-]{11})/i) || normalized.match(/youtu\.be\/([\w-]{11})/i);
  return pathMatch?.[1] ?? "";
}

function buildPerformanceRow(row: NormalizedRow): StudioPerformanceRow | null {
  const title = pickFirstValue(row, ["video title", "content title", "content", "video"]);
  const videoId = extractVideoId(pickFirstValue(row, ["video id", "content id", "video", "content", "video url", "content url"]));

  if (!videoId && !title) return null;
  if ((title || "").toLowerCase() === "total") return null;

  return {
    kind: "video-performance",
    videoId,
    title,
    views: parseNumericCell(pickFirstValue(row, ["views"])),
    impressions: parseNumericCell(pickFirstValue(row, ["impressions"])),
    impressionsCtr: parseNumericCell(pickFirstValue(row, [
      "impressions click through rate",
      "impressions ctr",
      "impressions click through rate %",
    ])),
    averageViewDurationSeconds: parseDurationToSeconds(pickFirstValue(row, [
      "average view duration",
      "avg view duration",
    ])),
    averagePercentageViewed: parseNumericCell(pickFirstValue(row, [
      "average percentage viewed",
      "avg percentage viewed",
      "average percentage viewed %",
    ])),
    watchTimeHours: parseNumericCell(pickFirstValue(row, [
      "watch time hours",
      "watch time",
      "watch time hours estimated",
    ])),
  };
}

function buildTrafficRow(row: NormalizedRow): StudioTrafficRow | null {
  const title = pickFirstValue(row, ["video title", "content title", "content", "video"]);
  const videoId = extractVideoId(pickFirstValue(row, ["video id", "content id", "video", "content", "video url", "content url"]));
  const source = pickFirstValue(row, ["traffic source", "traffic source type", "traffic source category"]);

  if ((!videoId && !title) || !source) return null;
  if ((title || "").toLowerCase() === "total") return null;

  return {
    kind: "traffic-source",
    videoId,
    title,
    source,
    views: parseNumericCell(pickFirstValue(row, ["views"])),
    watchTimeHours: parseNumericCell(pickFirstValue(row, ["watch time hours", "watch time"])),
    impressions: parseNumericCell(pickFirstValue(row, ["impressions"])),
  };
}

function parseStudioRows(content: string): { kind: StudioImportKind; rows: ParsedStudioRow[] } {
  const rows = parseCsv(content);
  if (rows.length === 0) return { kind: "unknown", rows: [] };

  const hasTrafficSource = rows.some((row) => Boolean(pickFirstValue(row, ["traffic source", "traffic source type", "traffic source category"])));

  if (hasTrafficSource) {
    return {
      kind: "traffic-source",
      rows: rows.map(buildTrafficRow).filter((row): row is StudioTrafficRow => row !== null),
    };
  }

  const performanceRows = rows.map(buildPerformanceRow).filter((row): row is StudioPerformanceRow => row !== null);
  if (performanceRows.length === 0) {
    return { kind: "unknown", rows: [] };
  }

  return {
    kind: "video-performance",
    rows: performanceRows,
  };
}

function mergeMetricValue(current: number | null, incoming: number | null): number | null {
  return incoming ?? current ?? null;
}

function mergeTrafficSources(current: StudioTrafficSource[], incoming: StudioTrafficSource): StudioTrafficSource[] {
  const bySource = new Map(current.map((item) => [normalizeTitle(item.source), item]));
  const key = normalizeTitle(incoming.source);
  const existing = bySource.get(key);
  bySource.set(key, {
    source: incoming.source,
    views: mergeMetricValue(existing?.views ?? null, incoming.views),
    watchTimeHours: mergeMetricValue(existing?.watchTimeHours ?? null, incoming.watchTimeHours),
    impressions: mergeMetricValue(existing?.impressions ?? null, incoming.impressions),
  });

  return [...bySource.values()].sort((left, right) => (right.views ?? 0) - (left.views ?? 0));
}

function findVideoMatch<T extends VideoLike>(videos: T[], row: ParsedStudioRow): T | null {
  if (row.videoId) {
    const byId = videos.find((video) => video.videoId === row.videoId);
    if (byId) return byId;
  }

  const normalizedTitle = normalizeTitle(row.title);
  if (!normalizedTitle) return null;

  const exactMatches = videos.filter((video) => normalizeTitle(video.title) === normalizedTitle);
  if (exactMatches.length === 1) return exactMatches[0];

  const looseMatches = videos.filter((video) => {
    const currentTitle = normalizeTitle(video.title);
    return currentTitle && (currentTitle.includes(normalizedTitle) || normalizedTitle.includes(currentTitle));
  });

  return looseMatches.length === 1 ? looseMatches[0] : null;
}

export function mergeStudioCsvIntoVideos<T extends VideoLike>(
  videos: T[],
  fileName: string,
  content: string,
): { videos: T[]; summary: StudioImportSummary } {
  const parsed = parseStudioRows(content);

  if (parsed.kind === "unknown" || parsed.rows.length === 0) {
    return {
      videos,
      summary: {
        fileName,
        kind: "unknown",
        matchedCount: 0,
        unmatchedCount: 0,
        rowCount: 0,
      },
    };
  }

  const matchedVideoIds = new Set<string>();
  let unmatchedCount = 0;

  const nextVideos = videos.map((video) => {
    const matchingRows = parsed.rows.filter((row) => {
      const match = findVideoMatch([video], row);
      return match?.videoId === video.videoId;
    });

    if (matchingRows.length === 0) return video;

    matchedVideoIds.add(video.videoId);
    let studioMetrics: StudioVideoMetrics = {
      views: video.studioMetrics?.views ?? null,
      impressions: video.studioMetrics?.impressions ?? null,
      impressionsCtr: video.studioMetrics?.impressionsCtr ?? null,
      averageViewDurationSeconds: video.studioMetrics?.averageViewDurationSeconds ?? null,
      averagePercentageViewed: video.studioMetrics?.averagePercentageViewed ?? null,
      watchTimeHours: video.studioMetrics?.watchTimeHours ?? null,
      trafficSources: [...(video.studioMetrics?.trafficSources ?? [])],
      sourceFiles: [...(video.studioMetrics?.sourceFiles ?? [])],
    };

    for (const row of matchingRows) {
      if (!studioMetrics.sourceFiles.includes(fileName)) {
        studioMetrics = { ...studioMetrics, sourceFiles: [...studioMetrics.sourceFiles, fileName] };
      }

      if (row.kind === "video-performance") {
        studioMetrics = {
          ...studioMetrics,
          views: mergeMetricValue(studioMetrics.views, row.views),
          impressions: mergeMetricValue(studioMetrics.impressions, row.impressions),
          impressionsCtr: mergeMetricValue(studioMetrics.impressionsCtr, row.impressionsCtr),
          averageViewDurationSeconds: mergeMetricValue(studioMetrics.averageViewDurationSeconds, row.averageViewDurationSeconds),
          averagePercentageViewed: mergeMetricValue(studioMetrics.averagePercentageViewed, row.averagePercentageViewed),
          watchTimeHours: mergeMetricValue(studioMetrics.watchTimeHours, row.watchTimeHours),
        };
      } else {
        studioMetrics = {
          ...studioMetrics,
          trafficSources: mergeTrafficSources(studioMetrics.trafficSources, {
            source: row.source,
            views: row.views,
            watchTimeHours: row.watchTimeHours,
            impressions: row.impressions,
          }),
        };
      }
    }

    return {
      ...video,
      studioMetrics,
    };
  });

  for (const row of parsed.rows) {
    if (!findVideoMatch(videos, row)) {
      unmatchedCount += 1;
    }
  }

  return {
    videos: nextVideos,
    summary: {
      fileName,
      kind: parsed.kind,
      matchedCount: matchedVideoIds.size,
      unmatchedCount,
      rowCount: parsed.rows.length,
    },
  };
}

export function formatStudioDuration(value: number | null | undefined): string {
  if (value === null || value === undefined || !Number.isFinite(value)) return "n/a";
  const seconds = Math.max(0, Math.round(value));
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;
  if (hours > 0) return `${hours}:${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;
  return `${minutes}:${String(remainingSeconds).padStart(2, "0")}`;
}
