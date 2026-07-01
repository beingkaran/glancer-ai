import { useState } from 'react';

const MailIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
    <polyline points="22,6 12,13 2,6"/>
  </svg>
);
const LinkedInIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.13 1.45-2.13 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14zM7.12 20.45H3.55V9h3.57v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z"/>
  </svg>
);

// Profile photo with graceful fallback to the gradient "KS" avatar.
// Save your photo to glancer-ai/public/karan.jpg to display it here.
function ProfilePhoto() {
  const [broken, setBroken] = useState(false);
  if (broken) {
    return (
      <div style={{
        width: 88, height: 88, borderRadius: '50%',
        background: 'var(--accent)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '2.2rem', fontWeight: 700, color: '#fff', margin: '0 auto 20px',
      }}>KS</div>
    );
  }
  // Serve a 4.4 KB WebP first (84% smaller than the old JPG) so it loads
  // instantly on mobile; browsers without WebP fall back to the optimized JPG.
  // width/height are set so the avatar reserves its box and never shifts layout.
  return (
    <picture>
      <source srcSet="/karan.webp" type="image/webp" />
      <img
        src="/karan.jpg"
        alt="Karan Shah"
        width={110}
        height={110}
        decoding="async"
        fetchpriority="high"
        onError={() => setBroken(true)}
        style={{ width: 110, height: 110, borderRadius: '50%', objectFit: 'cover', margin: '0 auto 20px', display: 'block', border: '3px solid rgba(44,201,224,0.4)', boxShadow: '0 8px 32px rgba(0,0,0,0.3)' }}
      />
    </picture>
  );
}
const GlobeIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <line x1="2" y1="12" x2="22" y2="12"/>
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
  </svg>
);
const ZapIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
  </svg>
);

const VALUES = [
  { icon:'🎯', title:'Clarity First', desc:'Every definition, article, and metric should make something clearer — not more confusing.' },
  { icon:'🛠️', title:'Built for Practitioners', desc:'Not marketing copy. Written by engineers, for engineers who need to solve real problems.' },
  { icon:'🌐', title:'Open & Free', desc:'The core glossary and content will always be free. Knowledge shouldn\'t be paywalled.' },
  { icon:'⚡', title:'Always Current', desc:'The AI space moves fast. We keep the metrics, news, and glossary up to date with what\'s actually happening.' },
];

export default function AboutPage() {
  return (
    <div className="page-section">
      <div className="container" style={{ maxWidth: 860 }}>
        {/* Hero */}
        <div className="page-hero" style={{ paddingTop: 'calc(var(--navbar-h) + 60px)', paddingBottom: 40, textAlign: 'center' }}>
          <p className="section-label" style={{ marginBottom: 12 }}>About</p>
          <h1 className="page-hero-title">Built to Make Sense of AI</h1>
          <p className="hero-sub" style={{ margin: '0 auto' }}>
            Glancer AI is an AI intelligence hub — glossary, news, metrics, and expert writing in one place — built by an engineer who wanted a single source of truth for the AI and observability ecosystem.
          </p>
        </div>

        {/* Creator card */}
        <div className="chart-card" style={{ marginBottom: 32, textAlign: 'center', padding: 48 }}>
          <ProfilePhoto />
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.6rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6 }}>
            Karan Shah
          </h2>
          <p style={{ color: 'var(--purple)', fontWeight: 600, fontSize: '0.9rem', marginBottom: 16 }}>
            Founder &amp; Creator of Glancer AI
          </p>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.75, maxWidth: 560, margin: '0 auto 28px', fontSize: '0.95rem' }}>
            Karan is a technology enthusiast and builder passionate about making the complex world of AI, AIOps, and observability accessible to everyone. He created Glancer AI as a free, independent resource for engineers, SREs, and learners who need clear, up-to-date information without the noise.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a
              href="https://www.linkedin.com/in/beingkaran/"
              className="write-cta-btn"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8, textDecoration: 'none', background: 'linear-gradient(135deg,#0a66c2,#0284c7)' }}
              target="_blank"
              rel="noopener noreferrer"
            >
              <LinkedInIcon /> Connect on LinkedIn
            </a>
            <a
              href="mailto:karan.igniite@gmail.com"
              className="filter-chip"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8, textDecoration: 'none', padding: '10px 20px' }}
            >
              <MailIcon /> karan.igniite@gmail.com
            </a>
            <a
              href="https://glancerai.com"
              className="filter-chip"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8, textDecoration: 'none', padding: '10px 20px' }}
              target="_blank"
              rel="noopener noreferrer"
            >
              <GlobeIcon /> glancerai.com
            </a>
          </div>
        </div>

        {/* What is Glancer AI */}
        <div className="chart-card" style={{ marginBottom: 32 }}>
          <h2 style={{ fontFamily:'var(--font-heading)', fontSize:'1.3rem', fontWeight:700, color:'var(--text-primary)', marginBottom:16 }}>What is Glancer AI?</h2>
          <p style={{ color:'var(--text-secondary)', lineHeight:1.75, marginBottom:14 }}>
            Glancer AI started as a searchable glossary for AIOps, Observability, and APM terminology — a place to quickly look up what "distributed tracing", "error budget", or "AIOps" actually means in the context of how modern engineering teams operate.
          </p>
          <p style={{ color:'var(--text-secondary)', lineHeight:1.75, marginBottom:14 }}>
            It has since grown into a full intelligence hub: <strong style={{ color:'var(--text-primary)' }}>AI News</strong> covering breaking developments from labs and the industry; <strong style={{ color:'var(--text-primary)' }}>Metrics</strong> tracking the numbers that matter (funding, benchmarks, adoption); and <strong style={{ color:'var(--text-primary)' }}>Blogs</strong> with in-depth technical guides written for practitioners.
          </p>
          <p style={{ color:'var(--text-secondary)', lineHeight:1.75 }}>
            Everything is free. There are no paywalls, no mandatory sign-ups. Ads help keep the lights on.
          </p>
        </div>

        {/* Values */}
        <div style={{ marginBottom: 48 }}>
          <h2 style={{ fontFamily:'var(--font-heading)', fontSize:'1.3rem', fontWeight:700, color:'var(--text-primary)', marginBottom:24 }}>What We Believe</h2>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:16 }}>
            {VALUES.map(v => (
              <div key={v.title} className="metric-stat" style={{ textAlign:'left', padding:24 }}>
                <div style={{ fontSize:'1.8rem', marginBottom:10 }}>{v.icon}</div>
                <div style={{ fontFamily:'var(--font-heading)', fontWeight:700, color:'var(--text-primary)', marginBottom:6 }}>{v.title}</div>
                <div style={{ fontSize:'0.875rem', color:'var(--text-secondary)', lineHeight:1.6 }}>{v.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Contact */}
        <div className="chart-card" style={{ marginBottom:80, textAlign:'center', padding:40 }} id="contact">
          <div style={{ fontSize:'2rem', marginBottom:12 }}><ZapIcon /></div>
          <h2 style={{ fontFamily:'var(--font-heading)', fontSize:'1.2rem', fontWeight:700, color:'var(--text-primary)', marginBottom:10 }}>Get in Touch</h2>
          <p style={{ color:'var(--text-secondary)', marginBottom:20, fontSize:'0.9rem' }}>
            Have a suggestion, spotted an error, or want to contribute? Reach out directly.
          </p>
          <a
            href="mailto:karan.igniite@gmail.com"
            className="write-cta-btn"
            style={{ display:'inline-flex', alignItems:'center', gap:8, textDecoration:'none' }}
          >
            <MailIcon /> karan.igniite@gmail.com
          </a>
        </div>
      </div>
    </div>
  );
}
