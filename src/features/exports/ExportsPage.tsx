type ExportsPageProps = {
  briefPreview: string;
  briefTitle: string;
  cloneReport: string | null;
  compareReport: string | null;
  onCopyBrief: () => void;
  onCopyCloneReport: () => void;
  onCopyCompareReport: () => void;
  onExportBrief: () => void;
  onExportClonePdf: () => void;
  onExportCloneReport: () => void;
  onExportComparePdf: () => void;
  onExportCompareReport: () => void;
};

export function ExportsPage({
  briefPreview,
  briefTitle,
  cloneReport,
  compareReport,
  onCopyBrief,
  onCopyCloneReport,
  onCopyCompareReport,
  onExportBrief,
  onExportClonePdf,
  onExportCloneReport,
  onExportComparePdf,
  onExportCompareReport,
}: ExportsPageProps) {
  const availableDeliverables = [briefPreview, cloneReport, compareReport].filter(Boolean).length;

  return (
    <section className="simple-card">
      <div className="section-header">
        <div>
          <h2>Exports</h2>
          <p>Review and ship the current deliverables without jumping back into each workflow.</p>
        </div>
        <span className="meta-text">{availableDeliverables} Live Deliverables</span>
      </div>

      <div className="compare-grid">
        <article className="summary-block compare-export-card">
          <div className="section-header">
            <div>
              <h3>Current Video Brief</h3>
              <p>{briefTitle || "The current single-video export preview is ready below."}</p>
            </div>
            <span className="meta-text">Brief</span>
          </div>
          <div className="button-row">
            <button type="button" className="secondary-button" onClick={onCopyBrief}>Copy Brief</button>
            <button type="button" className="secondary-button" onClick={onExportBrief}>Export Brief</button>
          </div>
          <textarea className="export-preview description-preview" value={briefPreview} readOnly />
        </article>

        {cloneReport ? (
          <article className="summary-block compare-export-card">
            <div className="section-header">
              <div>
                <h3>Clone Plan Report</h3>
                <p>The latest clone-plan export deck is ready for copy, markdown export, or PDF export.</p>
              </div>
              <span className="meta-text">Clone</span>
            </div>
            <div className="button-row">
              <button type="button" className="secondary-button" onClick={onCopyCloneReport}>Copy Report</button>
              <button type="button" className="secondary-button" onClick={onExportCloneReport}>Export Report</button>
              <button type="button" className="secondary-button" onClick={onExportClonePdf}>Export PDF</button>
            </div>
            <textarea className="export-preview description-preview" value={cloneReport} readOnly />
          </article>
        ) : null}

        {compareReport ? (
          <article className="summary-block compare-export-card">
            <div className="section-header">
              <div>
                <h3>Compare Report</h3>
                <p>The latest compare deck is ready for strategy review, client handoff, or archive.</p>
              </div>
              <span className="meta-text">Compare</span>
            </div>
            <div className="button-row">
              <button type="button" className="secondary-button" onClick={onCopyCompareReport}>Copy Report</button>
              <button type="button" className="secondary-button" onClick={onExportCompareReport}>Export Report</button>
              <button type="button" className="secondary-button" onClick={onExportComparePdf}>Export PDF</button>
            </div>
            <textarea className="export-preview description-preview" value={compareReport} readOnly />
          </article>
        ) : null}
      </div>
    </section>
  );
}
