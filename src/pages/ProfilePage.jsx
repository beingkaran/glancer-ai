import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AuthForm from '../components/AuthForm';
import { getMyBlogs, deleteBlog } from '../lib/blogStore';

const PenIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
);

const STATUS_META = {
  pending:  { label: 'Pending Review', cls: 'tag-orange' },
  approved: { label: 'Published',      cls: 'tag-cyan' },
  rejected: { label: 'Not Approved',   cls: 'tag-pink' },
};

function Avatar({ user, size = 88 }) {
  const initials = (user.name || user.email).split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();
  const [broken, setBroken] = useState(false);
  if (user.picture && !broken) {
    return <img src={user.picture} alt={user.name} onError={() => setBroken(true)}
      style={{ width: size, height: size, borderRadius: '50%', objectFit: 'cover' }} />;
  }
  return (
    <div style={{ width: size, height: size, borderRadius: '50%', background: 'var(--accent)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: size * 0.32, fontWeight: 700, color: '#fff' }}>
      {initials}
    </div>
  );
}

export default function ProfilePage() {
  const { user, isAuthed, logout } = useAuth();
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [busyId, setBusyId] = useState(null);

  useEffect(() => {
    if (!user) return;
    const refresh = async () => setBlogs(await getMyBlogs());
    refresh();
    window.addEventListener('glancer:blogs-changed', refresh);
    return () => window.removeEventListener('glancer:blogs-changed', refresh);
  }, [user]);

  async function handleDelete(id) {
    if (!window.confirm('Delete this article permanently? This cannot be undone.')) return;
    setBusyId(id);
    try {
      await deleteBlog(id);
      setBlogs((bs) => bs.filter((b) => b.id !== id));
    } catch (err) {
      alert(err?.message || 'Could not delete the article. Please try again.');
    } finally {
      setBusyId(null);
    }
  }

  /* ---------- Signed-out state ---------- */
  if (!isAuthed) {
    return (
      <div className="page-section">
        <div className="container" style={{ maxWidth: 460 }}>
          <div className="page-hero" style={{ paddingTop: 'calc(var(--navbar-h) + 70px)', paddingBottom: 32, textAlign: 'center' }}>
            <p className="section-label" style={{ marginBottom: 12 }}>Account</p>
            <h1 className="page-hero-title" style={{ fontSize: '2rem' }}>Sign in to Glancer AI</h1>
            <p className="hero-sub" style={{ margin: '0 auto' }}>
              Sign in to write articles and manage your contributions. Your published work appears once approved.
            </p>
          </div>
          <div className="chart-card" style={{ padding: 36, marginBottom: 80 }}>
            <AuthForm onSuccess={() => navigate('/profile')} />
          </div>
        </div>
      </div>
    );
  }

  /* ---------- Signed-in state ---------- */
  const counts = {
    total: blogs.length,
    approved: blogs.filter((b) => b.status === 'approved').length,
    pending: blogs.filter((b) => b.status === 'pending').length,
  };

  return (
    <div className="page-section">
      <div className="container" style={{ maxWidth: 860 }}>
        <div style={{ paddingTop: 'calc(var(--navbar-h) + 50px)' }} />

        {/* Profile card */}
        <div className="chart-card" style={{ padding: 32, marginBottom: 24, display: 'flex', gap: 24, alignItems: 'center', flexWrap: 'wrap' }}>
          <Avatar user={user} />
          <div style={{ flex: 1, minWidth: 200 }}>
            <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.6rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>
              {user.name}
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: 14 }}>{user.email}</p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <Link to="/blog/write" className="write-cta-btn" style={{ padding: '10px 22px', fontSize: '0.9rem' }}>
                <PenIcon /> Write New Article
              </Link>
              <button className="filter-chip" style={{ padding: '10px 20px', cursor: 'pointer' }} onClick={logout}>
                Sign Out
              </button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="metrics-grid" style={{ gridTemplateColumns: 'repeat(3,1fr)', marginBottom: 28 }}>
          <div className="metric-stat"><div className="metric-stat-value">{counts.total}</div><div className="metric-stat-label">Articles Written</div></div>
          <div className="metric-stat"><div className="metric-stat-value">{counts.approved}</div><div className="metric-stat-label">Published</div></div>
          <div className="metric-stat"><div className="metric-stat-value">{counts.pending}</div><div className="metric-stat-label">Pending Review</div></div>
        </div>

        {/* My articles */}
        <h2 className="section-title-lg" style={{ marginBottom: 16 }}>My Articles</h2>
        {blogs.length === 0 ? (
          <div className="chart-card" style={{ textAlign: 'center', padding: 48, marginBottom: 80 }}>
            <div style={{ fontSize: '2.4rem', marginBottom: 12 }}>📝</div>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 20 }}>You haven't written any articles yet.</p>
            <Link to="/blog/write" className="write-cta-btn"><PenIcon /> Write Your First Article</Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 80 }}>
            {blogs.map((b) => {
              const meta = STATUS_META[b.status] || STATUS_META.pending;
              const clickable = b.status === 'approved';
              const busy = busyId === b.id;
              return (
                <div key={b.id} className="chart-card profile-blog-row" style={{ padding: 18, display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap', opacity: busy ? 0.6 : 1 }}>
                  <div style={{ width: 54, height: 54, borderRadius: 12, background: b.bgGradient || b.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.6rem', flexShrink: 0 }}>
                    {b.icon || b.emoji}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '0.98rem', color: 'var(--text-primary)', marginBottom: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {b.title}
                    </h3>
                    <div style={{ display: 'flex', gap: 10, alignItems: 'center', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      <span className={`news-category-tag ${meta.cls}`} style={{ fontSize: '0.62rem', margin: 0 }}>{meta.label}</span>
                      <span>{b.category}</span>
                      <span>·</span>
                      <span>{b.readTime} min</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexShrink: 0 }}>
                    {clickable && (
                      <Link to={`/blog/${b.id}`} className="read-more-link" style={{ textDecoration: 'none' }}>View →</Link>
                    )}
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => navigate(`/blog/edit/${b.id}`)}
                      className="filter-chip"
                      style={{ padding: '7px 16px', cursor: 'pointer', fontSize: '0.8rem' }}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => handleDelete(b.id)}
                      className="filter-chip"
                      style={{ padding: '7px 16px', cursor: 'pointer', fontSize: '0.8rem', color: '#EF4444', borderColor: 'rgba(239,68,68,0.3)' }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
