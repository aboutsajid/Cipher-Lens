const { contextBridge, ipcRenderer } = require("electron");

const platform = typeof process === "object" && typeof process.platform === "string"
  ? process.platform
  : "unknown";

contextBridge.exposeInMainWorld("desktopRuntime", {
  platform,
  fetchYoutubeTranscript: (url, language) => ipcRenderer.invoke("youtube-transcript:fetch", { url, language }),
  importTranscriptFile: () => ipcRenderer.invoke("transcript:import-file"),
  importAnalyticsFile: () => ipcRenderer.invoke("analytics:import-file"),
  saveExportFile: (payload) => ipcRenderer.invoke("export:save-file", payload),
  savePdfFile: (payload) => ipcRenderer.invoke("export:save-pdf", payload),
  fetchYoutubeChannelVideos: (url, limit) => ipcRenderer.invoke("youtube:channel-videos", { url, limit }),
  fetchYoutubeVideoMetadata: (url) => ipcRenderer.invoke("youtube:video-metadata", { url }),
  openExternal: (url) => ipcRenderer.invoke("app:open-external", { url }),
});
