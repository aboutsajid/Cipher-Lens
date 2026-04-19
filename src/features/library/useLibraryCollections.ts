type BriefLike = {
  id: string;
  title: string;
  url: string;
  createdAt: string;
  analysis: {
    summary: {
      keywords: string[];
    };
  };
};

type ChannelReportLike = {
  id: string;
  title: string;
  channelUrl: string;
  myChannelUrl: string;
  compareChannelUrl: string;
  benchmarkChannelUrl: string;
  deepDive: { channelLabel?: string } | null;
  compare: { primaryLabel?: string; competitorLabel?: string } | null;
};

type ChannelPresetLike = {
  id: string;
  name: string;
  channelUrl: string;
  myChannelUrl: string;
  compareChannelUrl: string;
  benchmarkChannelUrl: string;
};

type ProjectLike = {
  createdAt: string;
  id: string;
  kind: "brief" | "channel-report" | "channel-preset" | "workspace";
  title: string;
};

type UseLibraryCollectionsProps<
  TBrief extends BriefLike,
  TReport extends ChannelReportLike,
  TPreset extends ChannelPresetLike,
  TProject extends ProjectLike,
> = {
  briefs: TBrief[];
  historySearch: string;
  isProMode: boolean;
  projects: TProject[];
  savedChannelPresets: TPreset[];
  savedChannelReports: TReport[];
  buildSavedPresetMeta: (preset: TPreset) => string;
  buildSavedReportMeta: (report: TReport) => string;
};

function includesNeedle(value: string | null | undefined, needle: string) {
  return (value ?? "").toLowerCase().includes(needle);
}

export function useLibraryCollections<
  TBrief extends BriefLike,
  TReport extends ChannelReportLike,
  TPreset extends ChannelPresetLike,
  TProject extends ProjectLike,
>({
  briefs,
  historySearch,
  isProMode,
  projects,
  savedChannelPresets,
  savedChannelReports,
  buildSavedPresetMeta,
  buildSavedReportMeta,
}: UseLibraryCollectionsProps<TBrief, TReport, TPreset, TProject>) {
  const needle = historySearch.trim().toLowerCase();

  const filteredBriefs = briefs.filter((brief) => {
    if (!needle) return true;
    return brief.title.toLowerCase().includes(needle)
      || brief.url.toLowerCase().includes(needle)
      || brief.analysis.summary.keywords.some((keyword) => keyword.includes(needle));
  });

  const filteredChannelReports = savedChannelReports.filter((report) => {
    if (!needle) return true;
    return includesNeedle(report.title, needle)
      || includesNeedle(report.channelUrl, needle)
      || includesNeedle(report.myChannelUrl, needle)
      || includesNeedle(report.compareChannelUrl, needle)
      || includesNeedle(report.benchmarkChannelUrl, needle)
      || includesNeedle(report.deepDive?.channelLabel, needle)
      || includesNeedle(report.compare?.primaryLabel, needle)
      || includesNeedle(report.compare?.competitorLabel, needle);
  });

  const filteredChannelPresets = savedChannelPresets.filter((preset) => {
    if (!needle) return true;
    return includesNeedle(preset.name, needle)
      || includesNeedle(preset.channelUrl, needle)
      || includesNeedle(preset.myChannelUrl, needle)
      || includesNeedle(preset.compareChannelUrl, needle)
      || includesNeedle(preset.benchmarkChannelUrl, needle);
  });

  const filteredProjects = projects.filter((project) => {
    if (!needle) return true;
    return includesNeedle(project.title, needle)
      || includesNeedle(project.kind, needle);
  });

  const visibleLibraryItemCount = filteredProjects.length + filteredBriefs.length + (isProMode ? filteredChannelReports.length + filteredChannelPresets.length : 0);
  const librarySearchPlaceholder = isProMode
    ? "Search projects, briefs, channels, URLs, or compare reports"
    : "Search saved briefs or URLs";
  const projectCount = projects.length;

  const homeRecentProjects = projects.slice(0, 4).map((project) => ({
    id: project.id,
    title: project.title,
    kind: project.kind,
    createdAt: project.createdAt,
  }));

  const homeRecentBriefs = briefs.slice(0, 3).map((brief) => ({
    id: brief.id,
    title: brief.title,
    createdAt: brief.createdAt,
  }));
  const homeRecentReports = savedChannelReports.slice(0, 3).map((report) => ({
    id: report.id,
    title: report.title,
    meta: buildSavedReportMeta(report),
  }));
  const homeRecentPresets = savedChannelPresets.slice(0, 3).map((preset) => ({
    id: preset.id,
    name: preset.name,
    meta: buildSavedPresetMeta(preset),
  }));

  const libraryBriefs = filteredBriefs.map((brief) => ({
    id: brief.id,
    title: brief.title,
    createdAt: brief.createdAt,
  }));
  const libraryReports = filteredChannelReports.map((report) => ({
    id: report.id,
    title: report.title,
    meta: buildSavedReportMeta(report),
  }));
  const libraryProjects = filteredProjects.map((project) => ({
    id: project.id,
    title: project.title,
    kind: project.kind,
    createdAt: project.createdAt,
  }));
  const libraryPresets = filteredChannelPresets.map((preset) => ({
    id: preset.id,
    name: preset.name,
    meta: buildSavedPresetMeta(preset),
  }));
  const channelPresetCards = savedChannelPresets.map((preset) => ({
    id: preset.id,
    name: preset.name,
    meta: buildSavedPresetMeta(preset),
  }));

  return {
    channelPresetCards,
    filteredBriefs,
    filteredChannelPresets,
    filteredChannelReports,
    filteredProjects,
    homeRecentProjects,
    homeRecentBriefs,
    homeRecentPresets,
    homeRecentReports,
    libraryBriefs,
    libraryProjects,
    libraryPresets,
    libraryReports,
    librarySearchPlaceholder,
    projectCount,
    visibleLibraryItemCount,
  };
}
