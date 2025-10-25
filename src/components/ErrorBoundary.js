import React from "react";

/**
 * Simple ErrorBoundary to catch render errors and show easier diagnostics in UI + console.
 */
export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null, info: null };
  }

  componentDidCatch(error, info) {
    // Log to console for debugging
    console.error("Uncaught error in subtree:", error, info);
    this.setState({ error, info });
  }

  render() {
    if (this.state.error) {
      const { error, info } = this.state;
      return (
        <div className="min-h-screen bg-gray-900 text-white p-8">
          <div className="max-w-4xl mx-auto bg-red-900 bg-opacity-20 rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-2">Something went wrong</h2>
            <p className="text-sm text-red-300 mb-4">
              {String(error?.message || "Unknown error")}
            </p>
            <details className="text-sm text-gray-200 whitespace-pre-wrap">
              {info?.componentStack || ""}
            </details>
            <p className="text-gray-400 mt-4">
              Check the browser console for the full stack trace.
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
