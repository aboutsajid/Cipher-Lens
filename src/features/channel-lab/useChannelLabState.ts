import { useState } from "react";

type ChannelVideoLike = {
  videoId: string;
};

type SavedChannelReportLike<
  TVideo extends ChannelVideoLike,
  TDeepDive,
  TClone,
  TCompare,
  TStage extends string,
  TPresentation extends string,
  TGoal extends string,
> = {
  channelUrl: string;
  myChannelUrl: string;
  compareChannelUrl: string;
  benchmarkChannelUrl: string;
  channelSampleSize: number;
  compareSampleSize: number;
  benchmarkSampleSize: number;
  cloneNiche: string;
  cloneStage: TStage;
  clonePresentationStyle: TPresentation;
  cloneGoal: TGoal;
  channelVideos: TVideo[];
  selectedChannelVideoIds: string[];
  compareChannelVideos: TVideo[];
  selectedCompareVideoIds: string[];
  benchmarkChannelVideos: TVideo[];
  selectedBenchmarkVideoIds: string[];
  deepDive: TDeepDive | null;
  clone: TClone | null;
  compare: TCompare | null;
};

type SavedChannelPresetLike<
  TVideo extends ChannelVideoLike,
  TStage extends string,
  TPresentation extends string,
  TGoal extends string,
> = {
  channelUrl: string;
  myChannelUrl: string;
  compareChannelUrl: string;
  benchmarkChannelUrl: string;
  channelSampleSize: number;
  compareSampleSize: number;
  benchmarkSampleSize: number;
  cloneNiche: string;
  cloneStage: TStage;
  clonePresentationStyle: TPresentation;
  cloneGoal: TGoal;
  channelVideos: TVideo[];
  selectedChannelVideoIds: string[];
  compareChannelVideos: TVideo[];
  selectedCompareVideoIds: string[];
  benchmarkChannelVideos: TVideo[];
  selectedBenchmarkVideoIds: string[];
};

type UseChannelLabStateProps<TStage extends string, TPresentation extends string, TGoal extends string> = {
  initialCloneGoal: TGoal;
  initialClonePresentationStyle: TPresentation;
  initialCloneStage: TStage;
};

export function useChannelLabState<
  TVideo extends ChannelVideoLike,
  TDeepDive,
  TClone,
  TCompare,
  TStudioImport,
  TStage extends string,
  TPresentation extends string,
  TGoal extends string,
>({
  initialCloneGoal,
  initialClonePresentationStyle,
  initialCloneStage,
}: UseChannelLabStateProps<TStage, TPresentation, TGoal>) {
  const [channelUrl, setChannelUrl] = useState("");
  const [myChannelUrl, setMyChannelUrl] = useState("");
  const [channelSampleSize, setChannelSampleSize] = useState<number>(8);
  const [channelVideos, setChannelVideos] = useState<TVideo[]>([]);
  const [myChannelVideos, setMyChannelVideos] = useState<TVideo[]>([]);
  const [selectedChannelVideoIds, setSelectedChannelVideoIds] = useState<string[]>([]);
  const [channelDeepDive, setChannelDeepDive] = useState<TDeepDive | null>(null);
  const [myChannelDeepDive, setMyChannelDeepDive] = useState<TDeepDive | null>(null);
  const [cloneChannel, setCloneChannel] = useState<TClone | null>(null);
  const [cloneNiche, setCloneNiche] = useState("");
  const [cloneStage, setCloneStage] = useState<TStage>(initialCloneStage);
  const [clonePresentationStyle, setClonePresentationStyle] = useState<TPresentation>(initialClonePresentationStyle);
  const [cloneGoal, setCloneGoal] = useState<TGoal>(initialCloneGoal);
  const [mainStudioImport, setMainStudioImport] = useState<TStudioImport | null>(null);
  const [compareChannelUrl, setCompareChannelUrl] = useState("");
  const [compareSampleSize, setCompareSampleSize] = useState<number>(8);
  const [compareChannelVideos, setCompareChannelVideos] = useState<TVideo[]>([]);
  const [selectedCompareVideoIds, setSelectedCompareVideoIds] = useState<string[]>([]);
  const [channelCompare, setChannelCompare] = useState<TCompare | null>(null);
  const [compareStudioImport, setCompareStudioImport] = useState<TStudioImport | null>(null);
  const [benchmarkChannelUrl, setBenchmarkChannelUrl] = useState("");
  const [benchmarkSampleSize, setBenchmarkSampleSize] = useState<number>(8);
  const [benchmarkChannelVideos, setBenchmarkChannelVideos] = useState<TVideo[]>([]);
  const [selectedBenchmarkVideoIds, setSelectedBenchmarkVideoIds] = useState<string[]>([]);
  const [benchmarkStudioImport, setBenchmarkStudioImport] = useState<TStudioImport | null>(null);
  const [channelPresetName, setChannelPresetName] = useState("");

  function resetDerivedResults() {
    setChannelDeepDive(null);
    setMyChannelDeepDive(null);
    setCloneChannel(null);
    setChannelCompare(null);
  }

  function updateSelection(nextIds: string[], videos: TVideo[]) {
    const allowedIds = new Set(videos.map((video) => video.videoId));
    return nextIds.filter((videoId, index) => allowedIds.has(videoId) && nextIds.indexOf(videoId) === index);
  }

  function updateChannelSelection(nextIds: string[]) {
    setSelectedChannelVideoIds(updateSelection(nextIds, channelVideos));
    resetDerivedResults();
  }

  function toggleChannelVideo(videoId: string) {
    updateChannelSelection(
      selectedChannelVideoIds.includes(videoId)
        ? selectedChannelVideoIds.filter((id) => id !== videoId)
        : [...selectedChannelVideoIds, videoId],
    );
  }

  function selectAllChannelVideos() {
    updateChannelSelection(channelVideos.map((video) => video.videoId));
  }

  function selectTopChannelVideos(count: number) {
    const nextIds = channelVideos.slice(0, count).map((video) => video.videoId);
    updateChannelSelection(nextIds);
    return nextIds.length;
  }

  function clearChannelSelection() {
    updateChannelSelection([]);
  }

  function updateCompareSelection(nextIds: string[]) {
    setSelectedCompareVideoIds(updateSelection(nextIds, compareChannelVideos));
    setChannelCompare(null);
  }

  function toggleCompareVideo(videoId: string) {
    updateCompareSelection(
      selectedCompareVideoIds.includes(videoId)
        ? selectedCompareVideoIds.filter((id) => id !== videoId)
        : [...selectedCompareVideoIds, videoId],
    );
  }

  function selectAllCompareVideos() {
    updateCompareSelection(compareChannelVideos.map((video) => video.videoId));
  }

  function selectTopCompareVideos(count: number) {
    const nextIds = compareChannelVideos.slice(0, count).map((video) => video.videoId);
    updateCompareSelection(nextIds);
    return nextIds.length;
  }

  function clearCompareSelection() {
    updateCompareSelection([]);
  }

  function updateBenchmarkSelection(nextIds: string[]) {
    setSelectedBenchmarkVideoIds(updateSelection(nextIds, benchmarkChannelVideos));
    setChannelCompare(null);
  }

  function toggleBenchmarkVideo(videoId: string) {
    updateBenchmarkSelection(
      selectedBenchmarkVideoIds.includes(videoId)
        ? selectedBenchmarkVideoIds.filter((id) => id !== videoId)
        : [...selectedBenchmarkVideoIds, videoId],
    );
  }

  function selectAllBenchmarkVideos() {
    updateBenchmarkSelection(benchmarkChannelVideos.map((video) => video.videoId));
  }

  function selectTopBenchmarkVideos(count: number) {
    const nextIds = benchmarkChannelVideos.slice(0, count).map((video) => video.videoId);
    updateBenchmarkSelection(nextIds);
    return nextIds.length;
  }

  function clearBenchmarkSelection() {
    updateBenchmarkSelection([]);
  }

  function handleCompareChannelUrlChange(value: string) {
    setCompareChannelUrl(value);
    setCompareChannelVideos([]);
    setCompareStudioImport(null);
    setSelectedCompareVideoIds([]);
    setChannelCompare(null);
  }

  function handleBenchmarkChannelUrlChange(value: string) {
    setBenchmarkChannelUrl(value);
    setBenchmarkChannelVideos([]);
    setBenchmarkStudioImport(null);
    setSelectedBenchmarkVideoIds([]);
    setChannelCompare(null);
  }

  function applySavedReport(
    report: SavedChannelReportLike<TVideo, TDeepDive, TClone, TCompare, TStage, TPresentation, TGoal>,
    getCloneFromDeepDive: (deepDive: TDeepDive) => TClone | null,
  ) {
    setChannelUrl(report.channelUrl);
    setMyChannelUrl(report.myChannelUrl);
    setCompareChannelUrl(report.compareChannelUrl);
    setBenchmarkChannelUrl(report.benchmarkChannelUrl);
    setChannelSampleSize(report.channelSampleSize);
    setCompareSampleSize(report.compareSampleSize);
    setBenchmarkSampleSize(report.benchmarkSampleSize);
    setCloneNiche(report.cloneNiche);
    setCloneStage(report.cloneStage);
    setClonePresentationStyle(report.clonePresentationStyle);
    setCloneGoal(report.cloneGoal);
    setChannelVideos(report.channelVideos);
    setMainStudioImport(null);
    setSelectedChannelVideoIds(report.selectedChannelVideoIds);
    setCompareChannelVideos(report.compareChannelVideos);
    setCompareStudioImport(null);
    setSelectedCompareVideoIds(report.selectedCompareVideoIds);
    setBenchmarkChannelVideos(report.benchmarkChannelVideos);
    setBenchmarkStudioImport(null);
    setSelectedBenchmarkVideoIds(report.selectedBenchmarkVideoIds);
    setChannelDeepDive(report.deepDive);
    setMyChannelVideos([]);
    setChannelCompare(report.compare);
    setMyChannelDeepDive(null);
    setCloneChannel(report.clone ?? (report.deepDive ? getCloneFromDeepDive(report.deepDive) : null));
  }

  function applySavedPreset(
    preset: SavedChannelPresetLike<TVideo, TStage, TPresentation, TGoal>,
  ) {
    setChannelUrl(preset.channelUrl);
    setMyChannelUrl(preset.myChannelUrl);
    setCompareChannelUrl(preset.compareChannelUrl);
    setBenchmarkChannelUrl(preset.benchmarkChannelUrl);
    setChannelSampleSize(preset.channelSampleSize);
    setCompareSampleSize(preset.compareSampleSize);
    setBenchmarkSampleSize(preset.benchmarkSampleSize);
    setCloneNiche(preset.cloneNiche);
    setCloneStage(preset.cloneStage);
    setClonePresentationStyle(preset.clonePresentationStyle);
    setCloneGoal(preset.cloneGoal);
    setChannelVideos(preset.channelVideos);
    setMainStudioImport(null);
    setSelectedChannelVideoIds(preset.selectedChannelVideoIds);
    setCompareChannelVideos(preset.compareChannelVideos);
    setCompareStudioImport(null);
    setSelectedCompareVideoIds(preset.selectedCompareVideoIds);
    setBenchmarkChannelVideos(preset.benchmarkChannelVideos);
    setBenchmarkStudioImport(null);
    setSelectedBenchmarkVideoIds(preset.selectedBenchmarkVideoIds);
    setChannelDeepDive(null);
    setMyChannelVideos([]);
    setMyChannelDeepDive(null);
    setCloneChannel(null);
    setChannelCompare(null);
  }

  return {
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
    setBenchmarkChannelUrl,
    setBenchmarkChannelVideos,
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
  };
}
