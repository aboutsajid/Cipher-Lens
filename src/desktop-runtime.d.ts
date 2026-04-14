export {};

type YoutubeTranscriptFetchResult = {
  title: string;
  transcript: string;
  language: string;
  lineCount: number;
  videoId: string;
};

type TranscriptImportResult = {
  canceled: boolean;
  fileName: string;
  path: string;
  extension?: string;
  content: string;
};

type ExportSaveResult = {
  canceled: boolean;
  path: string;
};

type ChannelVideoResult = {
  title: string;
  url: string;
  videoId: string;
  publishedLabel?: string;
  viewLabel?: string;
  description?: string;
  thumbnailUrl?: string;
  thumbnailText?: string;
};

type YoutubeVideoMetadataResult = {
  title: string;
  description: string;
  thumbnailUrl: string;
  thumbnailText: string;
};

declare global {
  interface Window {
    desktopRuntime: {
      platform: string;
      fetchYoutubeTranscript: (
        url: string,
        language?: string,
      ) => Promise<YoutubeTranscriptFetchResult>;
      importTranscriptFile: () => Promise<TranscriptImportResult>;
      saveExportFile: (payload: {
        suggestedName: string;
        extension: string;
        content: string;
      }) => Promise<ExportSaveResult>;
      savePdfFile: (payload: {
        suggestedName: string;
        html: string;
      }) => Promise<ExportSaveResult>;
      fetchYoutubeChannelVideos: (
        url: string,
        limit?: number,
      ) => Promise<ChannelVideoResult[]>;
      fetchYoutubeVideoMetadata: (
        url: string,
      ) => Promise<YoutubeVideoMetadataResult>;
      openExternal: (url: string) => Promise<boolean>;
    };
  }
}
