import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AuthForm from '../components/AuthForm';
import { getAllBlogs, updateBlogStatus, deleteBlog } from '../lib/blogStore';

/*
 * AdminPage — content moderation dashboard.
 *
 * Access is gated by REAL auth: you must sign in, and your account must have
 * `is_admin = true` in the database. Approve/reject calls are additionally
 * enforced by Row Level Security server-side, so even a tampered client cannot
 * change a post's status without an admin session.
 */

function formatDate(d) {
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export default function AdminPage() {
  const { user, isAuthed, isAdmin, loading, logout } = useAuth();
  const [blogs, setBlogs] = useState([]);
  const [activeFilter, setActiveFilter] = useState('pending');
  const [preview, setPreview] = useState(null);
  const [busyId, setBusyId] = useState(null);

  useEffect(() => {
    if (!isAdmin) return;
    const refresh = async () => setBlogs(await getAllBlogs());
    refresh();
    window.addEventListener('glancer:blogs-changed', refresh);
    return () => window.removeEventListener('glancer:blogs-changed', refresh);
  }, [isAdmin]);

  async function updateStatus(id, status) {
    setBusyId(id);
    try {
      await updateBlogStatus(id, status);
      setBlogs((bs) => bs.map((b) => (b.id === id ? { ...b, status } : b)));
      if (preview?.id === id) setPreview({ ...preview, status });
    } catch (err) {
      alert(err?.message || 'Could not update the post.');
    } finally {
      setBusyId(null);
    }
  }

  async function deletePost(id) {
    if (!window.confirm('Delete this post permanently?')) return;
    setBusyId(id);
    try {
      await deleteBlog(id);
      setBlogs((bs) => bs.filter((b) => b.id !== id));
      if (preview?.id === id) setPreview(null);
    } catch (err) {
      alert(err?.message || 'Could not delete the post.');
    } finally {
      setBusyId(null);
    }
  }

  const filtered = blogs.filter((b) => activeFilter === 'all' || b.status === activeFilter);
  const counts = {
    pending: blogs.filter((b) => b.status === 'pending').length,
    approved: blogs.filter((b) => b.status === 'approved').length,
    rejected: blogs.filter((b) => b.status === 'rejected').length,
  };

  /* ---------- Loading ---------- */
  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-deep)', color: 'var(--text-muted)' }}>
        Checking access…
      </div>
    );
  }

  /* ---------- Signed out: show login ---------- */
  if (!isAuthed) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-deep)' }}>
        <div style={{ width: '100%', maxWidth: 400, padding: 40 }}>
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <div style={{ width: 52, height: 52, background: 'linear-gradient(135deg,#7C3AED,#06B6D4)', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: 22 }}>🔒</div>
            <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6 }}>Admin Access</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Sign in with your admin account.</p>
          </div>
          <div className="chart-card" style={{ padding: 28 }}>
            <AuthForm />
          </div>
          <p style={{ textAlign: 'center', marginTop: 20 }}>
            <Link to="/" style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textDecoration: 'none' }}>← Back to Glancer AI</Link>
          </p>
        </div>
      </div>
    );
  }

  /* ---------- Signed in but not an admin ---------- */
  if (!isAdmin) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-deep)' }}>
        <div style={{ width: '100%', maxWidth: 420, padding: 40, textAlign: 'center' }}>
          <div style={{ fontSize: '2.6rem', marginBottom: 16 }}>🚫</div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 10 }}>Not authorized</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: 24 }}>
            You're signed in as <strong>{user.email}</strong>, but this account isn't an admin.
            Ask the site owner to grant admin access.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
            <button onClick={logout} className="filter-chip" style={{ cursor: 'pointer', padding: '10px 20px' }}>Sign Out</button>
            <Link to="/" className="filter-chip" style={{ padding: '10px 20px', textDecoration: 'none' }}>← Site</Link>
          </div>
        </div>
      </div>
    );
  }

  /* ---------- Admin dashboard ---------- */
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-deep)', color: 'var(--text-primary)' }}>
      {/* Admin header */}
      <div style={{ background: 'var(--glass-bg)', borderBottom: '1px solid var(--glass-border)', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 60 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 32, height: 32, background: 'linear-gradient(135deg,#7C3AED,#06B6D4)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>🔑</div>
          <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 700 }}>Glancer AI Admin</span>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', background: 'rgba(168,85,247,0.1)', border: '1px solid rgba(168,85,247,0.2)', borderRadius: 20, padding: '2px 10px' }}>Content Management</span>
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{user.email}</span>
          <Link to="/" style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textDecoration: 'none' }}>← Site</Link>
          <button onClick={logout} className="filter-chip" style={{ fontSize: '0.8rem', cursor: 'pointer' }}>Sign Out</button>
        </div>
      </div>

      <div style={{ display: 'flex', minHeight: 'calc(100vh - 60px)' }}>
        {/* Sidebar */}
        <div style={{ width: 240, flexShrink: 0, background: 'rgba(255,255,255,0.02)', borderRight: '1px solid var(--glass-border)', padding: '20px 0' }}>
          <p style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-muted)', padding: '0 16px', marginBottom: 8 }}>Filter</p>
          {[
            { id: 'pending', label: 'Pending Review', count: counts.pending },
            { id: 'approved', label: 'Approved', count: counts.approved },
            { id: 'rejected', label: 'Rejected', count: counts.rejected },
            { id: 'all', label: 'All Posts', count: blogs.length },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setActiveFilter(f.id)}
              style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 16px', background: activeFilter === f.id ? 'rgba(168,85,247,0.12)' : 'none', border: 'none', color: activeFilter === f.id ? 'var(--purple)' : 'var(--text-secondary)', cursor: 'pointer', fontSize: '0.875rem', textAlign: 'left', borderLeft: activeFilter === f.id ? '2px solid var(--purple)' : '2px solid transparent' }}
            >
              <span>{f.label}</span>
              <span style={{ background: 'rgba(255,255,255,0.08)', borderRadius: 20, padding: '1px 8px', fontSize: '0.75rem' }}>{f.count}</span>
            </button>
          ))}
        </div>

        {/* Main content */}
        <div style={{ flex: 1, padding: '24px', overflowY: 'auto' }}>
          {filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
              No {activeFilter === 'all' ? '' : activeFilter} posts yet.
              {activeFilter === 'pending' && <p style={{ marginTop: 10, fontSize: '0.875rem' }}>Community blog submissions will appear here for review.</p>}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {filtered.map((blog) => (
                <div key={blog.id} className="chart-card" style={{ padding: 20, opacity: busyId === blog.id ? 0.6 : 1 }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8 }}>
                        <span className={`news-category-tag ${blog.status === 'approved' ? 'tag-cyan' : blog.status === 'rejected' ? 'tag-orange' : 'tag-purple'}`} style={{ fontSize: '0.65rem' }}>
                          {blog.status.toUpperCase()}
                        </span>
                        <span className="news-category-tag tag-blue" style={{ fontSize: '0.65rem' }}>{blog.category}</span>
                      </div>
                      <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6, fontSize: '0.95rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {blog.title}
                      </h3>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginBottom: 8, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {blog.subtitle}
                      </p>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                        <span>By: {blog.author} ({blog.authorEmail})</span>
                        <span>Submitted: {formatDate(blog.submittedAt || blog.date)}</span>
                        <span>{blog.readTime} min read</span>
                        {(blog.tags || []).length > 0 && <span>Tags: {blog.tags.join(', ')}</span>}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                      <button
                        onClick={() => setPreview(preview?.id === blog.id ? null : blog)}
                        className="filter-chip"
                        style={{ fontSize: '0.78rem', cursor: 'pointer', padding: '6px 12px' }}
                      >
                        {preview?.id === blog.id ? 'Hide' : 'Preview'}
                      </button>
                      {blog.status !== 'approved' && (
                        <button disabled={busyId === blog.id} onClick={() => updateStatus(blog.id, 'approved')} style={{ padding: '6px 14px', borderRadius: 8, border: 'none', background: 'rgba(34,197,94,0.15)', color: '#22C55E', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600 }}>
                          ✓ Approve
                        </button>
                      )}
                      {blog.status !== 'rejected' && (
                        <button disabled={busyId === blog.id} onClick={() => updateStatus(blog.id, 'rejected')} style={{ padding: '6px 14px', borderRadius: 8, border: 'none', background: 'rgba(239,68,68,0.12)', color: '#EF4444', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600 }}>
                          ✗ Reject
                        </button>
                      )}
                      <button disabled={busyId === blog.id} onClick={() => deletePost(blog.id)} style={{ padding: '6px 14px', borderRadius: 8, border: '1px solid rgba(239,68,68,0.3)', background: 'rgba(239,68,68,0.08)', color: '#EF4444', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600 }}>
                        🗑 Delete
                      </button>
                    </div>
                  </div>

                  {/* Inline preview */}
                  {preview?.id === blog.id && (
                    <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid var(--glass-border)' }}>
                      <div className="blog-preview-content" dangerouslySetInnerHTML={{ __html: blog.body }} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
