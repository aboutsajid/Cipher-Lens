const { appendFileSync } = require("node:fs");
const { readFile, writeFile } = require("node:fs/promises");
const { basename, extname, join } = require("node:path");
const { pathToFileURL } = require("node:url");

const windowTitle = "Cipher Lens";
const windowsAppId = "com.cipher.generated.cipher.lens";
const transcriptFetchChannel = "youtube-transcript:fetch";
const transcriptImportChannel = "transcript:import-file";
const analyticsImportChannel = "analytics:import-file";
const exportSaveChannel = "export:save-file";
const exportPdfChannel = "export:save-pdf";
const channelVideosChannel = "youtube:channel-videos";
const videoMetadataChannel = "youtube:video-metadata";
const externalOpenChannel = "app:open-external";
const devServerUrl = String(process.env.CIPHER_LENS_DEV_SERVER_URL ?? "").trim();
const youtubeWatchUserAgent =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36";
const youtubeRequestHeaders = {
  "User-Agent": youtubeWatchUserAgent,
  "Accept-Language": "en-US,en;q=0.9",
};
const startupLogPath = join(process.env.TEMP || __dirname, "cipher-lens-main.log");
const youtubeTranscriptModuleUrl = pathToFileURL(join(__dirname, "..", "node_modules", "youtube-transcript", "dist", "youtube-transcript.esm.js")).href;

let electronModule;

try {
  electronModule = require("electron/main");
} catch {
  electronModule = require("electron");
}

try {
  appendFileSync(
    startupLogPath,
    `[${new Date().toISOString()}] electron module probe type=${typeof electronModule} keys=${Array.isArray(electronModule) ? electronModule.length : Object.keys(electronModule || {}).join(",")} value=${typeof electronModule === "string" ? electronModule : ""}\n`,
  );
} catch {
  // Ignore probe logging failures.
}

const { app, BrowserWindow, dialog, ipcMain, Menu, shell } = electronModule || {};
let mainWindow = null;

function resolveAppIconPath() {
  return app.isPackaged
    ? join(__dirname, "..", "dist", "brand", "icon-256.png")
    : join(__dirname, "..", "public", "brand", "icon-256.png");
}

function writeStartupLog(message, detail = "") {
  try {
    appendFileSync(startupLogPath, `[${new Date().toISOString()}] ${message}${detail ? ` ${detail}` : ""}\n`);
  } catch {
    // Ignore logging failures.
  }
}

function configureAppIdentity() {
  if (!app) return;

  try {
    app.setName(windowTitle);
    if (process.platform === "win32") {
      app.setAppUserModelId(windowsAppId);
    }

    const userDataDirectoryName = app.isPackaged ? "cipher-lens" : "cipher-lens-dev";
    const userDataPath = join(app.getPath("appData"), userDataDirectoryName);
    app.setPath("userData", userDataPath);
    writeStartupLog("userData configured", userDataPath);
  } catch (error) {
    writeStartupLog("userData configure failed", error instanceof Error ? error.message : String(error));
  }
}

async function loadFetchTranscript() {
  const module = await import(youtubeTranscriptModuleUrl);
  return module.fetchTranscript;
}

let tesseractModulePromise = null;

async function loadTesseract() {
  if (!tesseractModulePromise) {
    tesseractModulePromise = import("tesseract.js").catch((error) => {
      tesseractModulePromise = null;
      throw error;
    });
  }

  return tesseractModulePromise;
}

function extractVideoId(value) {
  const normalized = String(value ?? "").trim();
  if (!normalized) {
    throw new Error("Paste A YouTube URL First.");
  }

  if (/^[\w-]{11}$/.test(normalized)) {
    return normalized;
  }

  try {
    const parsed = new URL(normalized);
    if (parsed.hostname === "youtu.be") {
      const shortId = parsed.pathname.replace(/\//g, "");
      if (/^[\w-]{11}$/.test(shortId)) {
        return shortId;
      }
    }

    const directId = parsed.searchParams.get("v");
    if (/^[\w-]{11}$/.test(directId ?? "")) {
      return directId;
    }

    const pathMatch = parsed.pathname.match(/\/(?:embed|shorts|live)\/([\w-]{11})/i);
    if (pathMatch) {
      return pathMatch[1];
    }
  } catch {
    // Let the generic validation below surface a friendly error.
  }

  throw new Error("That Does Not Look Like A Valid YouTube Video URL.");
}

function decodeHtmlEntities(value) {
  return value
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

function toSafeFileName(value, fallback = "cipher-lens-export") {
  const normalized = String(value ?? "")
    .trim()
    .replace(/[<>:"/\\|?*\u0000-\u001f]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  return normalized || fallback;
}

function normalizeChannelUrl(value) {
  const normalized = String(value ?? "").trim();
  if (!normalized) {
    throw new Error("Paste A YouTube Channel URL First.");
  }

  const parsed = new URL(normalized);
  if (!parsed.hostname.includes("youtube.com")) {
    throw new Error("That Does Not Look Like A Valid YouTube Channel URL.");
  }

  const cleanPath = parsed.pathname.replace(/\/+$/, "");
  const channelPath = cleanPath.endsWith("/videos") ? cleanPath : `${cleanPath}/videos`;
  return `${parsed.origin}${channelPath}`;
}

function extractChannelVideos(html, limit = 8) {
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

  const fallbackPattern = /"url":"\/watch\?v=([^"&]{11})[\s\S]*?"title":\{"runs":\[\{"text":"([^"]+)"\}\]/g;
  for (const match of html.matchAll(fallbackPattern)) {
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
      break;
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

function extractVideoMetadataFromHtml(html) {
  const title = extractMetaContent(html, /<meta\s+property="og:title"\s+content="([^"]+)"/i)
    || extractMetaContent(html, /<title>([^<]+)<\/title>/i).replace(/\s+-\s+YouTube$/i, "").trim();
  const description = extractVideoDescription(html);
  const thumbnailUrl = extractMetaContent(html, /<meta\s+property="og:image"\s+content="([^"]+)"/i);
  return {
    title,
    description,
    thumbnailUrl,
  };
}

function collectNodesByKey(node, key, results = []) {
  if (!node || typeof node !== "object") {
    return results;
  }

  if (Array.isArray(node)) {
    for (const item of node) {
      collectNodesByKey(item, key, results);
    }
    return results;
  }

  for (const [entryKey, value] of Object.entries(node)) {
    if (entryKey === key) {
      results.push(value);
    }
    collectNodesByKey(value, key, results);
  }

  return results;
}

function extractRunText(value) {
  if (!value) return "";
  if (typeof value === "string") return decodeHtmlEntities(value).trim();
  if (typeof value.simpleText === "string") return decodeHtmlEntities(value.simpleText).trim();
  if (Array.isArray(value.runs)) {
    return decodeHtmlEntities(value.runs.map((entry) => String(entry?.text ?? "")).join("")).trim();
  }
  if (value.content && typeof value.content === "string") {
    return decodeHtmlEntities(value.content).trim();
  }
  return "";
}

function extractYoutubeContext(html) {
  const apiKey = html.match(/INNERTUBE_API_KEY":"([^"]+)"/)?.[1] ?? "";
  const clientVersion = html.match(/INNERTUBE_CLIENT_VERSION":"([^"]+)"/)?.[1] ?? "";
  const visitorData = html.match(/visitorData":"([^"]+)"/)?.[1] ?? "";
  return { apiKey, clientVersion, visitorData };
}

async function fetchTopComments(videoId, html) {
  const { apiKey, clientVersion, visitorData } = extractYoutubeContext(html);
  const continuationToken = [...html.matchAll(/token":"([^"]+)/g)].map((match) => match[1])[0] ?? "";
  if (!apiKey || !clientVersion || !continuationToken) {
    return { commentCountLabel: "", topComments: [] };
  }

  const response = await fetch(`https://www.youtube.com/youtubei/v1/next?key=${apiKey}`, {
    method: "POST",
    headers: {
      ...youtubeRequestHeaders,
      "Content-Type": "application/json",
      "Origin": "https://www.youtube.com",
      "Referer": `https://www.youtube.com/watch?v=${videoId}`,
      "X-Goog-Visitor-Id": visitorData,
      "X-YouTube-Client-Name": "1",
      "X-YouTube-Client-Version": clientVersion,
    },
    body: JSON.stringify({
      context: {
        client: {
          hl: "en",
          gl: "US",
          clientName: "WEB",
          clientVersion,
          visitorData,
        },
      },
      continuation: continuationToken,
    }),
  });

  if (!response.ok) {
    return { commentCountLabel: "", topComments: [] };
  }

  const data = await response.json();
  const header = collectNodesByKey(data, "commentsHeaderRenderer")[0];
  const commentCountLabel = extractRunText(header?.countText);
  const entities = collectNodesByKey(data, "commentEntityPayload");
  const seenIds = new Set();
  const topComments = [];

  for (const entity of entities) {
    const commentId = String(entity?.properties?.commentId ?? "").trim();
    const text = extractRunText(entity?.properties?.content);
    if (!commentId || !text || seenIds.has(commentId)) {
      continue;
    }
    seenIds.add(commentId);
    topComments.push({
      author: String(entity?.author?.displayName ?? "").trim(),
      text,
      likeCount: String(entity?.toolbar?.likeCountLiked ?? entity?.toolbar?.likeCountNotliked ?? "").trim(),
      publishedLabel: String(entity?.properties?.publishedTime ?? "").trim(),
    });
    if (topComments.length >= 5) {
      break;
    }
  }

  return {
    commentCountLabel,
    topComments,
  };
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

let ocrWorkerPromise = null;
const thumbnailOcrCache = new Map();

async function getOcrWorker() {
  if (!ocrWorkerPromise) {
    ocrWorkerPromise = loadTesseract().then(({ createWorker, PSM }) => createWorker("eng", 1, {
      logger: () => {},
    }).then(async (worker) => {
      await worker.setParameters({
        tessedit_pageseg_mode: PSM.SPARSE_TEXT,
      });
      return worker;
    }).catch((error) => {
      ocrWorkerPromise = null;
      throw error;
    }));
  }
  return ocrWorkerPromise;
}

async function extractThumbnailText(thumbnailUrl) {
  const cacheKey = String(thumbnailUrl ?? "").trim();
  if (!cacheKey) return "";
  if (thumbnailOcrCache.has(cacheKey)) {
    return thumbnailOcrCache.get(cacheKey) ?? "";
  }

  try {
    const worker = await getOcrWorker();
    const { data } = await worker.recognize(cacheKey);
    const text = normalizeThumbnailText(data?.text ?? "");
    thumbnailOcrCache.set(cacheKey, text);
    return text;
  } catch {
    thumbnailOcrCache.set(cacheKey, "");
    return "";
  }
}

function formatTimestamp(totalSeconds) {
  const safeSeconds = Math.max(0, Math.floor(totalSeconds));
  const hours = Math.floor(safeSeconds / 3600);
  const minutes = Math.floor((safeSeconds % 3600) / 60);
  const seconds = safeSeconds % 60;

  if (hours > 0) {
    return [hours, minutes, seconds].map((part) => String(part).padStart(2, "0")).join(":");
  }

  return [minutes, seconds].map((part) => String(part).padStart(2, "0")).join(":");
}

function normalizeOffsetSeconds(entry) {
  if ((entry.offset ?? 0) > 1000 || (entry.duration ?? 0) > 1000) {
    return entry.offset / 1000;
  }

  return entry.offset;
}

function buildTranscriptText(entries) {
  return entries
    .map((entry) => {
      const lineText = String(entry.text ?? "").replace(/\s+/g, " ").trim();
      if (!lineText) {
        return "";
      }

      return `${formatTimestamp(normalizeOffsetSeconds(entry))} ${lineText}`;
    })
    .filter(Boolean)
    .join("\n");
}

async function fetchVideoTitle(videoId) {
  const response = await fetch(`https://www.youtube.com/watch?v=${videoId}`, {
    headers: youtubeRequestHeaders,
  });

  if (!response.ok) {
    return "";
  }

  const html = await response.text();
  const metaMatch = html.match(/<meta\s+property="og:title"\s+content="([^"]+)"/i);
  if (metaMatch) {
    return decodeHtmlEntities(metaMatch[1]).trim();
  }

  const titleMatch = html.match(/<title>([^<]+)<\/title>/i);
  if (!titleMatch) {
    return "";
  }

  return decodeHtmlEntities(titleMatch[1]).replace(/\s+-\s+YouTube$/i, "").trim();
}

async function fetchVideoMetadata(urlOrVideoId) {
  const videoId = extractVideoId(urlOrVideoId);
  const response = await fetch(`https://www.youtube.com/watch?v=${videoId}`, {
    headers: youtubeRequestHeaders,
  });

  if (!response.ok) {
    throw new Error("Could Not Load That YouTube Video Right Now.");
  }

  const html = await response.text();
  const metadata = extractVideoMetadataFromHtml(html);
  const thumbnailText = metadata.thumbnailUrl ? await extractThumbnailText(metadata.thumbnailUrl) : "";
  const { commentCountLabel, topComments } = await fetchTopComments(videoId, html).catch(() => ({ commentCountLabel: "", topComments: [] }));
  return {
    title: metadata.title,
    description: metadata.description,
    thumbnailUrl: metadata.thumbnailUrl,
    thumbnailText,
    commentCountLabel,
    topComments,
  };
}

function createWindow() {
  writeStartupLog("createWindow", devServerUrl || "file://dist/index.html");
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 860,
    minWidth: 980,
    minHeight: 720,
    autoHideMenuBar: true,
    backgroundColor: "#f4f6fb",
    icon: resolveAppIconPath(),
    title: windowTitle,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
      preload: join(__dirname, "preload.cjs"),
    },
  });

  mainWindow.removeMenu();
  mainWindow.on("closed", () => {
    mainWindow = null;
  });
  mainWindow.webContents.on("before-input-event", (event, input) => {
    if (input.type !== "keyDown") {
      return;
    }

    const key = String(input.key ?? "").toLowerCase();
    const isCommandOrControl = input.control || input.meta;
    if (!isCommandOrControl || input.alt) {
      return;
    }

    if (key === "c") {
      event.preventDefault();
      mainWindow?.webContents.copy();
      return;
    }

    if (key === "v") {
      event.preventDefault();
      mainWindow?.webContents.paste();
      return;
    }

    if (key === "x") {
      event.preventDefault();
      mainWindow?.webContents.cut();
      return;
    }

    if (key === "a") {
      event.preventDefault();
      mainWindow?.webContents.selectAll();
      return;
    }

    if (key === "z") {
      event.preventDefault();
      if (input.shift) {
        mainWindow?.webContents.redo();
        return;
      }

      mainWindow?.webContents.undo();
      return;
    }

    if (key === "y" && process.platform !== "darwin") {
      event.preventDefault();
      mainWindow?.webContents.redo();
    }
  });
  mainWindow.webContents.on("context-menu", () => {
    const editMenu = Menu.buildFromTemplate([
      { role: "undo" },
      { role: "redo" },
      { type: "separator" },
      { role: "cut" },
      { role: "copy" },
      { role: "paste" },
      { role: "selectAll" },
    ]);

    if (mainWindow) {
      editMenu.popup({ window: mainWindow });
    }
  });
  mainWindow.webContents.on("did-fail-load", (_event, code, description, validatedUrl) => {
    writeStartupLog("did-fail-load", `${code} ${description} ${validatedUrl}`);
  });

  if (devServerUrl) {
    void mainWindow.loadURL(devServerUrl);
    return;
  }

  void mainWindow.loadFile(join(__dirname, "..", "dist", "index.html"));
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function buildPdfBuffer(html) {
  const pdfWindow = new BrowserWindow({
    show: false,
    width: 1240,
    height: 1754,
    backgroundColor: "#ffffff",
    webPreferences: {
      sandbox: false,
    },
  });

  try {
    await pdfWindow.loadURL(`data:text/html;charset=UTF-8,${encodeURIComponent(String(html ?? ""))}`);
    await delay(180);
    return await pdfWindow.webContents.printToPDF({
      printBackground: true,
      preferCSSPageSize: true,
      pageSize: "A4",
    });
  } finally {
    if (!pdfWindow.isDestroyed()) {
      pdfWindow.close();
    }
  }
}

async function fetchChannelVideosWithRetry(channelUrl, limit, attempts = 3) {
  let lastError = null;
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      const response = await fetch(channelUrl, {
        headers: youtubeRequestHeaders,
      });
      if (!response.ok) {
        throw new Error("Could Not Load That YouTube Channel Right Now.");
      }

      const html = await response.text();
      const videos = extractChannelVideos(html, limit);
      if (videos.length > 0) {
        return videos;
      }
      lastError = new Error("No Recent Videos Were Found On That Channel Page.");
    } catch (error) {
      lastError = error instanceof Error ? error : new Error("Could Not Load That YouTube Channel Right Now.");
    }

    if (attempt < attempts) {
      await delay(220 * attempt);
    }
  }

  throw lastError ?? new Error("Could Not Load That YouTube Channel Right Now.");
}

if (!app || !BrowserWindow || !dialog || !ipcMain || !Menu || !shell) {
  throw new Error("Electron main-process APIs were not available during startup.");
}

configureAppIdentity();
writeStartupLog("main module loaded", app.isPackaged ? "packaged" : "dev");
process.on("uncaughtException", (error) => {
  writeStartupLog("uncaughtException", error?.stack || String(error));
});
process.on("unhandledRejection", (error) => {
  writeStartupLog("unhandledRejection", error instanceof Error ? error.stack || error.message : String(error));
});

ipcMain.handle(transcriptFetchChannel, async (_event, payload) => {
  const url = String(payload?.url ?? "").trim();
  const language = String(payload?.language ?? "").trim();
  const videoId = extractVideoId(url);
  const fetchTranscript = await loadFetchTranscript();
  const transcriptEntries = await fetchTranscript(url, language ? { lang: language } : undefined);

  if (!Array.isArray(transcriptEntries) || transcriptEntries.length === 0) {
    throw new Error("No Transcript Lines Were Returned For This Video.");
  }

  const transcript = buildTranscriptText(transcriptEntries);
  const title = await fetchVideoTitle(videoId).catch(() => "");

  return {
    title,
    transcript,
    language: transcriptEntries.find((entry) => entry.lang)?.lang ?? language,
    lineCount: transcriptEntries.length,
    videoId,
  };
});

ipcMain.handle(transcriptImportChannel, async () => {
  const result = await dialog.showOpenDialog({
    title: "Import Transcript Or Subtitle File",
    properties: ["openFile"],
    filters: [
      { name: "Transcript Files", extensions: ["txt", "md", "srt", "vtt", "json"] },
      { name: "All Files", extensions: ["*"] },
    ],
  });

  if (result.canceled || result.filePaths.length === 0) {
    return { canceled: true, fileName: "", path: "", content: "" };
  }

  const filePath = result.filePaths[0];
  const content = await readFile(filePath, "utf8");

  return {
    canceled: false,
    fileName: basename(filePath),
    path: filePath,
    extension: extname(filePath).toLowerCase(),
    content,
  };
});

ipcMain.handle(analyticsImportChannel, async () => {
  const result = await dialog.showOpenDialog({
    title: "Import YouTube Studio CSV",
    properties: ["openFile"],
    filters: [
      { name: "CSV Files", extensions: ["csv"] },
      { name: "All Files", extensions: ["*"] },
    ],
  });

  if (result.canceled || result.filePaths.length === 0) {
    return { canceled: true, fileName: "", path: "", content: "" };
  }

  const filePath = result.filePaths[0];
  const content = await readFile(filePath, "utf8");

  return {
    canceled: false,
    fileName: basename(filePath),
    path: filePath,
    extension: extname(filePath).toLowerCase(),
    content,
  };
});

ipcMain.handle(exportSaveChannel, async (_event, payload) => {
  const content = String(payload?.content ?? "");
  const suggestedName = toSafeFileName(payload?.suggestedName, "cipher-lens-export");
  const extension = String(payload?.extension ?? "txt").replace(/^\./, "") || "txt";
  const result = await dialog.showSaveDialog({
    title: "Export Cipher Lens File",
    defaultPath: join(app.getPath("documents"), `${suggestedName}.${extension}`),
  });

  if (result.canceled || !result.filePath) {
    return { canceled: true, path: "" };
  }

  await writeFile(result.filePath, content, "utf8");
  return { canceled: false, path: result.filePath };
});

ipcMain.handle(exportPdfChannel, async (_event, payload) => {
  const html = String(payload?.html ?? "").trim();
  if (!html) {
    throw new Error("No PDF Content Was Provided.");
  }

  const suggestedName = toSafeFileName(payload?.suggestedName, "cipher-lens-report");
  const result = await dialog.showSaveDialog({
    title: "Export Cipher Lens PDF",
    defaultPath: join(app.getPath("documents"), `${suggestedName}.pdf`),
    filters: [
      { name: "PDF Files", extensions: ["pdf"] },
    ],
  });

  if (result.canceled || !result.filePath) {
    return { canceled: true, path: "" };
  }

  const pdfBuffer = await buildPdfBuffer(html);
  await writeFile(result.filePath, pdfBuffer);
  return { canceled: false, path: result.filePath };
});

ipcMain.handle(channelVideosChannel, async (_event, payload) => {
  const channelUrl = normalizeChannelUrl(payload?.url);
  const limit = Math.min(20, Math.max(1, Number(payload?.limit ?? 8) || 8));
  return fetchChannelVideosWithRetry(channelUrl, limit);
});

ipcMain.handle(videoMetadataChannel, async (_event, payload) => {
  const url = String(payload?.url ?? "").trim();
  if (!url) {
    throw new Error("Paste A YouTube Video URL First.");
  }
  return fetchVideoMetadata(url);
});

ipcMain.handle(externalOpenChannel, async (_event, payload) => {
  const url = String(payload?.url ?? "").trim();
  if (!url) return false;
  await shell.openExternal(url);
  return true;
});

app.whenReady().then(() => {
  writeStartupLog("app ready");
  createWindow();
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
