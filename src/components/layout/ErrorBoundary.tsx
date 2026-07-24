import { Component, type ReactNode } from "react";

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "100vh",
            padding: 24,
            textAlign: "center",
          }}
        >
          <h2 style={{ marginBottom: 12 }}>Terjadi Kesalahan</h2>
          <p style={{ opacity: 0.7, marginBottom: 16 }}>
            Aplikasi mengalami error yang tidak terduga. Detail error
            tercetak di terminal (jalankan <code>tauri dev</code>).
          </p>
          <pre
            style={{
              padding: 12,
              backgroundColor: "var(--bg-primary)",
              borderRadius: 8,
              maxWidth: 500,
              overflow: "auto",
              fontSize: 13,
              marginBottom: 16,
              textAlign: "left",
            }}
          >
            {this.state.error?.message}
          </pre>
          <button
            className="btn btn-primary"
            onClick={() => window.location.reload()}
          >
            Muat Ulang
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
