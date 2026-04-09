import { Component, ErrorInfo, ReactNode } from "react";

interface AdminErrorBoundaryProps {
  children: ReactNode;
}

interface AdminErrorBoundaryState {
  hasError: boolean;
  message: string;
}

export class AdminErrorBoundary extends Component<
  AdminErrorBoundaryProps,
  AdminErrorBoundaryState
> {
  state: AdminErrorBoundaryState = {
    hasError: false,
    message: ""
  };

  static getDerivedStateFromError(error: Error): AdminErrorBoundaryState {
    return {
      hasError: true,
      message: error.message
    };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Admin panel render error:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <section className="admin-page">
          <div className="editor-form">
            <h1>Ошибка интерфейса</h1>
            <p>
              Админка столкнулась с ошибкой при отрисовке страницы.
              {this.state.message ? ` ${this.state.message}` : ""}
            </p>
          </div>
        </section>
      );
    }

    return this.props.children;
  }
}
