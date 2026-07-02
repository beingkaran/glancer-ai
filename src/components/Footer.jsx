import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-about">
            <Link className="nav-logo" to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1.05rem', textDecoration: 'none' }}>
              <div className="nav-logo-icon">
                <img src="/glancer-mark.svg" alt="" width="24" height="24" />
              </div>
              <span>
                <span className="nav-logo-text">Glancer</span>
                <span className="nav-logo-dot"> AI</span>
              </span>
            </Link>
            <p>Practitioner-grade AIOps &amp; observability intelligence — vendor comparisons, benchmarks, a 2,200-term glossary and live industry news. Built by an engineer.</p>
            <a
              href="https://www.linkedin.com/in/beingkaran/"
              target="_blank"
              rel="noopener noreferrer me"
              className="footer-social"
              aria-label="Karan Shah on LinkedIn"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.13 1.45-2.13 2.94v5.67H9.35V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14zM7.12 20.45H3.55V9h3.57v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.22.79 24 1.77 24h20.45c.98 0 1.78-.78 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z"/></svg>
              <span>Karan Shah</span>
            </a>
          </div>

          <div className="footer-col">
            <h4>Explore</h4>
            <Link to="/topics">Topics</Link>
            <Link to="/blogs">Analysis</Link>
            <Link to="/glossary">Glossary</Link>
            <Link to="/metrics">Metrics</Link>
            <Link to="/ai-tools">Free AI Tools</Link>
          </div>

          <div className="footer-col">
            <h4>Site</h4>
            <Link to="/about">About</Link>
            <Link to="/faq">FAQ</Link>
            <Link to="/blog/write">Write a Blog</Link>
            <Link to="/profile">My Profile</Link>
          </div>

          <div className="footer-col">
            <h4>Legal</h4>
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/terms">Terms of Use</Link>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© 2026 Glancer AI · glancerai.com. All rights reserved.</span>
          <span>Made with <span className="footer-heart" aria-label="love">♥</span> by Karan Shah.</span>
        </div>
      </div>
    </footer>
  );
}
