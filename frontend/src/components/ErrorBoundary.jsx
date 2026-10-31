import { Component } from "react";
import { AlertTriangle } from "lucide-react";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-deep flex flex-col items-center justify-center p-6 text-center">
          <div className="w-20 h-20 bg-danger/20 rounded-full flex items-center justify-center text-danger mb-6">
            <AlertTriangle size={40} />
          </div>
          <h1 className="text-3xl font-bold text-textp mb-2">Oops! Something went wrong.</h1>
          <p className="text-muted mb-6 max-w-md">
            We've encountered an unexpected error. Please try refreshing the page. If the problem persists, contact support.
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-mint text-deep font-bold rounded-xl hover:bg-mint/90 transition-all"
          >
            Refresh Page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
