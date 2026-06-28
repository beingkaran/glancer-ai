import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AuthForm from '../components/AuthForm';
import AnalyticsPanel from '../components/AnalyticsPanel';
import {
  getAllBlogs, updateBlogStatus, deleteBlog,
  getWriterAccess, setRestrictWriters, addWriter, removeWriter,
} from '../lib/blogStore';

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
  const [access, setAccess] = useState({ restrict: false, emails: [] });
  const [newWriter, setNewWriter] = useState('');
  const [accessBusy, setAccessBusy] = useState(false);

  useEffect(() => {
    if (!isAdmin) return;
    const refresh = async () => setBlogs(await getAllBlogs());
    refresh();
    getWriterAccess().then(setAccess);
    window.addEventListener('glancer:blogs-changed', refresh);
    return () => window.removeEventListener('glancer:blogs-changed', refresh);
  }, [isAdmin]);

  async function toggleRestrict() {
    setAccessBusy(true);
    try {
      await setRestrictWriters(!access.restrict);
      setAccess((a) => ({ ...a, restrict: !a.restrict }));
    } catch (err) { alert(err?.message || 'Could not update setting.'); }
    finally { setAccessBusy(false); }
  }

  async function handleAddWriter(e) {
    e.preventDefault();
    const email = newWriter.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { alert('Enter a valid email.'); return; }
    setAccessBusy(true);
    try {
      await addWriter(email);
      setAccess((a) => ({ ...a, emails: a.emails.includes(email) ? a.emails : [...a.emails, email] }));
      setNewWriter('');
    } catch (err) { alert(err?.message || 'Could not add writer.'); }
    finally { setAccessBusy(false); }
  }

  async function handleRemoveWriter(email) {
    setAccessBusy(true);
    try {
      await removeWriter(email);
      setAccess((a) => ({ ...a, emails: a.emails.filter((x) => x !== email) }));
    } catch (err) { alert(err?.message || 'Could not remove writer.'); }
    finally { setAccessBusy(false); }
  }

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

          <p style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-muted)', padding: '0 16px', margin: '18px 0 8px' }}>Access</p>
          <button
            onClick={() => setActiveFilter('writers')}
            style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 16px', background: activeFilter === 'writers' ? 'rgba(168,85,247,0.12)' : 'none', border: 'none', color: activeFilter === 'writers' ? 'var(--purple)' : 'var(--text-secondary)', cursor: 'pointer', fontSize: '0.875rem', textAlign: 'left', borderLeft: activeFilter === 'writers' ? '2px solid var(--purple)' : '2px solid transparent' }}
          >
            <span>Writer Access</span>
            {access.restrict && <span style={{ background: 'rgba(168,85,247,0.2)', color: 'var(--purple)', borderRadius: 20, padding: '1px 8px', fontSize: '0.7rem' }}>ON</span>}
          </button>

          <p style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-muted)', padding: '0 16px', margin: '18px 0 8px' }}>Analytics</p>
          <button
            onClick={() => setActiveFilter('analytics')}
            style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 8, padding: '10px 16px', background: activeFilter === 'analytics' ? 'rgba(168,85,247,0.12)' : 'none', border: 'none', color: activeFilter === 'analytics' ? 'var(--purple)' : 'var(--text-secondary)', cursor: 'pointer', fontSize: '0.875rem', textAlign: 'left', borderLeft: activeFilter === 'analytics' ? '2px solid var(--purple)' : '2px solid transparent' }}
          >
            <span>📊 Page Hits</span>
          </button>
        </div>

        {/* Main content */}
        <div style={{ flex: 1, padding: '24px', overflowY: 'auto' }}>
          {activeFilter === 'analytics' ? (
            <AnalyticsPanel />
          ) : activeFilter === 'writers' ? (
            <div style={{ maxWidth: 620 }}>
              <h2 className="section-title-lg" style={{ marginBottom: 8 }}>Writer Access</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: 20, lineHeight: 1.6 }}>
                Control who can submit articles. (Everyone still needs admin approval before a post goes public.)
              </p>

              <div className="chart-card" style={{ padding: 20, marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
                <div>
                  <div style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>Restrict to allowlist</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    {access.restrict
                      ? 'ON — only allowlisted emails (and admins) can publish.'
                      : 'OFF — any signed-in user can submit articles.'}
                  </div>
                </div>
                <button disabled={accessBusy} onClick={toggleRestrict} className="filter-chip"
                  style={{ cursor: 'pointer', padding: '10px 20px', fontWeight: 600, color: access.restrict ? '#22C55E' : 'var(--text-secondary)' }}>
                  {access.restrict ? 'Turn Off' : 'Turn On'}
                </button>
              </div>

              <div className="chart-card" style={{ padding: 20, opacity: access.restrict ? 1 : 0.55 }}>
                <h3 className="chart-title" style={{ marginBottom: 14 }}>Allowed writers</h3>
                <form onSubmit={handleAddWriter} style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
                  <input className="field-input" type="email" value={newWriter} onChange={(e) => setNewWriter(e.target.value)}
                    placeholder="writer@example.com" style={{ flex: 1 }} />
                  <button type="submit" disabled={accessBusy} className="btn-grad" style={{ padding: '0 20px' }}>Add</button>
                </form>
                {access.emails.length === 0 ? (
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>No emails on the allowlist yet.</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {access.emails.map((email) => (
                      <div key={email} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: 'var(--surface)', borderRadius: 10, border: '1px solid var(--glass-border)' }}>
                        <span style={{ fontSize: '0.875rem', color: 'var(--text-primary)' }}>{email}</span>
                        <button disabled={accessBusy} onClick={() => handleRemoveWriter(email)}
                          style={{ background: 'rgba(239,68,68,0.1)', border: 'none', color: '#EF4444', borderRadius: 8, padding: '5px 12px', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600 }}>Remove</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : filtered.length === 0 ? (
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
