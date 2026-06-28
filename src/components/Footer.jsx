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
            <p>Your AI-first intelligence hub — breaking news, industry metrics, and expert glossary for engineers and researchers.</p>
          </div>

          <div className="footer-col">
            <h4>Explore</h4>
            <Link to="/">Home</Link>
            <Link to="/blogs">All Blogs</Link>
            <Link to="/metrics">Metrics</Link>
            <Link to="/glossary">Glossary</Link>
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
            <Link to="/about#privacy">Privacy Policy</Link>
            <Link to="/about#terms">Terms of Use</Link>
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
