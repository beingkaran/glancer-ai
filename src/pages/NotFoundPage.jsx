import { Link } from 'react-router-dom';
import { useDocumentMeta } from '../lib/useDocumentMeta';

/*
 * NotFoundPage — client-side 404 for unknown routes (catch-all `path="*"`).
 * Marked noindex so search engines don't index soft-404 URLs.
 */
export default function NotFoundPage() {
  useDocumentMeta({
    title: 'Page not found (404)',
    description: 'The page you were looking for could not be found on Glancer AI.',
    path: '/404',
    robots: 'noindex, follow',
  });

  return (
    <div className="page-section">
      <div className="container error-page">
        <p className="error-code">404</p>
        <h1 className="error-title">This page wandered off</h1>
        <p className="error-sub">
          The page you’re looking for doesn’t exist or may have moved. Let’s get you back to the AI news.
        </p>
        <div className="error-actions">
          <Link to="/" className="write-cta-btn">← Back to AI News</Link>
          <Link to="/glossary" className="filter-chip error-chip">Glossary</Link>
          <Link to="/faq" className="filter-chip error-chip">FAQ</Link>
          <Link to="/ai-tools" className="filter-chip error-chip">Free AI Tools</Link>
        </div>
      </div>
    </div>
  );
}
