type ChannelVideoLike = {
  videoId: string;
};

type UseChannelLabSelectionsProps<TVideo extends ChannelVideoLike> = {
  benchmarkChannelVideos: TVideo[];
  channelVideos: TVideo[];
  compareChannelVideos: TVideo[];
  selectedBenchmarkVideoIds: string[];
  selectedChannelVideoIds: string[];
  selectedCompareVideoIds: string[];
};

function countStudioMatches<TVideo extends { studioMetrics?: unknown }>(videos: TVideo[]) {
  return videos.filter((video) => Boolean(video.studioMetrics)).length;
}

function summarizeStudioCoverage<TVideo extends { studioMetrics?: unknown }>(videos: TVideo[]): string {
  if (videos.length === 0) return "No Studio Data";
  const matched = countStudioMatches(videos);
  return matched === 0 ? "No Studio Data" : `${matched}/${videos.length} Studio Matched`;
}

export function useChannelLabSelections<TVideo extends ChannelVideoLike & { studioMetrics?: unknown }>({
  benchmarkChannelVideos,
  channelVideos,
  compareChannelVideos,
  selectedBenchmarkVideoIds,
  selectedChannelVideoIds,
  selectedCompareVideoIds,
}: UseChannelLabSelectionsProps<TVideo>) {
  const selectedChannelVideoIdSet = new Set(selectedChannelVideoIds);
  const selectedCompareVideoIdSet = new Set(selectedCompareVideoIds);
  const selectedBenchmarkVideoIdSet = new Set(selectedBenchmarkVideoIds);

  const selectedChannelVideos = channelVideos.filter((video) => selectedChannelVideoIdSet.has(video.videoId));
  const selectedCompareVideos = compareChannelVideos.filter((video) => selectedCompareVideoIdSet.has(video.videoId));
  const selectedBenchmarkVideos = benchmarkChannelVideos.filter((video) => selectedBenchmarkVideoIdSet.has(video.videoId));

  return {
    benchmarkStudioCoverage: summarizeStudioCoverage(benchmarkChannelVideos),
    mainStudioCoverage: summarizeStudioCoverage(channelVideos),
    compareStudioCoverage: summarizeStudioCoverage(compareChannelVideos),
    selectedBenchmarkVideos,
    selectedChannelVideos,
    selectedCompareVideos,
  };
}
