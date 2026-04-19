import { Component, type ErrorInfo, type ReactNode } from "react";

type AppErrorBoundaryProps = {
  children: ReactNode;
};

type AppErrorBoundaryState = {
  error: Error | null;
};

export class AppErrorBoundary extends Component<AppErrorBoundaryProps, AppErrorBoundaryState> {
  state: AppErrorBoundaryState = {
    error: null,
  };

  static getDerivedStateFromError(error: Error): AppErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Cipher Lens render error", error, info);
  }

  private handleReload = () => {
    window.location.reload();
  };

  render() {
    if (!this.state.error) {
      return this.props.children;
    }

    return (
      <main className="lens-app app-shell">
        <section className="simple-card app-error-card">
          <div className="section-header">
            <div>
              <h2>Workspace Error</h2>
              <p>The current screen hit a render error. Reload the app to recover the workspace.</p>
            </div>
            <span className="meta-text">Recovery Mode</span>
          </div>
          <p className="empty-copy">{this.state.error.message || "Unknown render error"}</p>
          <div className="button-row">
            <button type="button" className="primary-button" onClick={this.handleReload}>Reload App</button>
          </div>
        </section>
      </main>
    );
  }
}
