import { Component } from 'react';

/*
 * ErrorBoundary — the app's "500" page. Catches render/runtime errors anywhere
 * in the tree and shows a recoverable error screen instead of a blank white
 * page. (A real HTTP 500 comes from the server; in a SPA this is the equivalent
 * client-side safety net.)
 */
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    // Surface it for debugging / monitoring; swap console for your error tracker.
    console.error('[Glancer] Unhandled UI error:', error, info);
  }

  render() {
    if (!this.state.hasError) return this.props.children;
    return (
      <div className="page-section">
        <div className="container error-page">
          <p className="error-code">500</p>
          <h1 className="error-title">Something went wrong</h1>
          <p className="error-sub">
            An unexpected error broke this page. Reloading usually fixes it — if it keeps happening, let us know.
          </p>
          <div className="error-actions">
            <button type="button" className="write-cta-btn" onClick={() => window.location.reload()}>
              Reload the page
            </button>
            <a href="/" className="filter-chip error-chip">Back to AI News</a>
            <a href="mailto:karan.igniite@gmail.com" className="filter-chip error-chip">Report it</a>
          </div>
        </div>
      </div>
    );
  }
}
