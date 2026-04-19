import type { ChannelCompareBundle } from "../../premium";
import { ChannelCompareResults } from "../channel-lab/ChannelCompareResults";

type ComparePageProps = {
  channelCompare: ChannelCompareBundle | null;
  cloneContextLabel: string;
  compareResultTab: "summary" | "winners" | "adapt" | "niche" | "deck";
  reportCount: number;
  onCompareResultTabChange: (tab: "summary" | "winners" | "adapt" | "niche" | "deck") => void;
  onCopyReport: () => void;
  onExportPdf: () => void;
  onExportReport: () => void;
  onOpenChannelLab: () => void;
  onOpenLibrary: () => void;
};

export function ComparePage({
  channelCompare,
  cloneContextLabel,
  compareResultTab,
  reportCount,
  onCompareResultTabChange,
  onCopyReport,
  onExportPdf,
  onExportReport,
  onOpenChannelLab,
  onOpenLibrary,
}: ComparePageProps) {
  if (!channelCompare) {
    return (
      <section className="simple-card">
        <div className="section-header">
          <div>
            <h2>Channel Compare</h2>
            <p>Run compare workflows in Channel Lab, then review the finished scorecard here without mixing it into the main setup screen.</p>
          </div>
          <span className="meta-text">{reportCount} Saved Reports</span>
        </div>
        <div className="home-action-grid">
          <button type="button" className="home-action-card" onClick={onOpenChannelLab}>
            <strong>Open Channel Lab</strong>
            <span>Load the main and competitor feeds, choose the sample, and run a fresh compare.</span>
          </button>
          <button type="button" className="home-action-card" onClick={onOpenLibrary}>
            <strong>Open Library</strong>
            <span>Reload a saved compare report or preset if you already ran one earlier.</span>
          </button>
        </div>
      </section>
    );
  }

  return (
    <ChannelCompareResults
      channelCompare={channelCompare}
      cloneContextLabel={cloneContextLabel}
      compareResultTab={compareResultTab}
      onCompareResultTabChange={onCompareResultTabChange}
      onCopyReport={onCopyReport}
      onExportPdf={onExportPdf}
      onExportReport={onExportReport}
    />
  );
}
