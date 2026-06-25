import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// SHA-256 of the admin password (plaintext is never stored in the bundle).
// To change the password: run in a terminal —
//   printf '%s' 'YOUR_NEW_PASSWORD' | shasum -a 256
// and paste the resulting hash below.
const ADMIN_PASSWORD_HASH = '1650f869109142bd9bd556f7d55f8fb824853e3c128ca346eb11b63928e49065';

async function sha256(text) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

function getBlogs() {
  try { return JSON.parse(localStorage.getItem('glancer_user_blogs') || '[]'); }
  catch { return []; }
}
function saveBlogs(blogs) {
  localStorage.setItem('glancer_user_blogs', JSON.stringify(blogs));
}

function formatDate(d) {
  return new Date(d).toLocaleDateString('en-US', { month:'short', day:'numeric', year:'numeric', hour:'2-digit', minute:'2-digit' });
}

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [pw, setPw] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [pwError, setPwError] = useState('');
  const [signingIn, setSigningIn] = useState(false);
  const [blogs, setBlogs] = useState([]);
  const [activeFilter, setActiveFilter] = useState('pending');
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (authed) setBlogs(getBlogs());
  }, [authed]);

  async function login(e) {
    e.preventDefault();
    setPwError('');
    setSigningIn(true);
    try {
      // Trim to tolerate accidental copy-paste whitespace/newlines.
      const hash = await sha256(pw.trim());
      if (hash === ADMIN_PASSWORD_HASH) {
        setAuthed(true);
      } else {
        setPwError('Incorrect password. Tap the eye icon to check what you typed.');
      }
    } catch {
      setPwError('Could not verify the password in this browser. Try Chrome, or use an https:// URL.');
    } finally {
      setSigningIn(false);
    }
  }

  function updateStatus(id, status) {
    const updated = blogs.map(b => b.id === id ? { ...b, status } : b);
    saveBlogs(updated);
    setBlogs(updated);
    if (preview?.id === id) setPreview({ ...preview, status });
  }

  function deletePost(id) {
    if (!window.confirm('Delete this post permanently?')) return;
    const updated = blogs.filter(b => b.id !== id);
    saveBlogs(updated);
    setBlogs(updated);
    if (preview?.id === id) setPreview(null);
  }

  const filtered = blogs.filter(b => activeFilter === 'all' || b.status === activeFilter);
  const counts = {
    pending:  blogs.filter(b => b.status === 'pending').length,
    approved: blogs.filter(b => b.status === 'approved').length,
    rejected: blogs.filter(b => b.status === 'rejected').length,
  };

  if (!authed) {
    return (
      <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'var(--bg-deep)' }}>
        <div style={{ width:'100%', maxWidth:380, padding:40 }}>
          <div style={{ textAlign:'center', marginBottom:32 }}>
            <div style={{ width:52, height:52, background:'linear-gradient(135deg,#7C3AED,#06B6D4)', borderRadius:14, display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 16px', fontSize:22 }}>🔒</div>
            <h1 style={{ fontFamily:'var(--font-heading)', fontSize:'1.5rem', fontWeight:700, color:'var(--text-primary)', marginBottom:6 }}>Admin Access</h1>
            <p style={{ color:'var(--text-muted)', fontSize:'0.875rem' }}>Glancer AI Content Management</p>
          </div>
          <form onSubmit={login}>
            <div style={{ marginBottom:14, position:'relative' }}>
              <input
                type={showPw ? 'text' : 'password'}
                className="field-input"
                style={{ width:'100%', paddingRight:44 }}
                placeholder="Enter admin password"
                value={pw}
                onChange={e => setPw(e.target.value)}
                autoFocus
                autoComplete="off"
              />
              <button
                type="button"
                onClick={() => setShowPw(s => !s)}
                aria-label={showPw ? 'Hide password' : 'Show password'}
                style={{ position:'absolute', right:8, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', color:'var(--text-muted)', padding:6, display:'flex' }}
              >
                {showPw ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                )}
              </button>
            </div>
            {pwError && <p style={{ color:'#EF4444', fontSize:'0.8rem', marginBottom:12 }}>{pwError}</p>}
            <button type="submit" disabled={signingIn} className="search-btn" style={{ width:'100%', border:'none', cursor: signingIn ? 'wait' : 'pointer', padding:'13px', borderRadius:10, fontSize:'0.95rem', opacity: signingIn ? 0.7 : 1 }}>
              {signingIn ? 'Signing in…' : 'Sign In'}
            </button>
          </form>
          <p style={{ textAlign:'center', marginTop:20 }}>
            <Link to="/" style={{ fontSize:'0.8rem', color:'var(--text-muted)', textDecoration:'none' }}>← Back to Glancer AI</Link>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight:'100vh', background:'var(--bg-deep)', color:'var(--text-primary)' }}>
      {/* Admin header */}
      <div style={{ background:'var(--glass-bg)', borderBottom:'1px solid var(--glass-border)', padding:'0 24px', display:'flex', alignItems:'center', justifyContent:'space-between', height:60 }}>
        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
          <div style={{ width:32, height:32, background:'linear-gradient(135deg,#7C3AED,#06B6D4)', borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center', fontSize:14 }}>🔑</div>
          <span style={{ fontFamily:'var(--font-heading)', fontWeight:700 }}>Glancer AI Admin</span>
          <span style={{ fontSize:'0.75rem', color:'var(--text-muted)', background:'rgba(168,85,247,0.1)', border:'1px solid rgba(168,85,247,0.2)', borderRadius:20, padding:'2px 10px' }}>Content Management</span>
        </div>
        <div style={{ display:'flex', gap:12, alignItems:'center' }}>
          <Link to="/" style={{ fontSize:'0.8rem', color:'var(--text-muted)', textDecoration:'none' }}>← Site</Link>
          <button onClick={() => setAuthed(false)} className="filter-chip" style={{ fontSize:'0.8rem', cursor:'pointer' }}>Sign Out</button>
        </div>
      </div>

      <div style={{ display:'flex', minHeight:'calc(100vh - 60px)' }}>
        {/* Sidebar */}
        <div style={{ width:240, flexShrink:0, background:'rgba(255,255,255,0.02)', borderRight:'1px solid var(--glass-border)', padding:'20px 0' }}>
          <p style={{ fontSize:'0.72rem', fontWeight:700, letterSpacing:'0.08em', textTransform:'uppercase', color:'var(--text-muted)', padding:'0 16px', marginBottom:8 }}>Filter</p>
          {[
            { id:'pending',  label:`Pending Review`, count:counts.pending },
            { id:'approved', label:`Approved`,        count:counts.approved },
            { id:'rejected', label:`Rejected`,        count:counts.rejected },
            { id:'all',      label:`All Posts`,       count:blogs.length },
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setActiveFilter(f.id)}
              style={{ width:'100%', display:'flex', alignItems:'center', justifyContent:'space-between', padding:'10px 16px', background:activeFilter===f.id?'rgba(168,85,247,0.12)':'none', border:'none', color:activeFilter===f.id?'var(--purple)':'var(--text-secondary)', cursor:'pointer', fontSize:'0.875rem', textAlign:'left', borderLeft:activeFilter===f.id?'2px solid var(--purple)':'2px solid transparent' }}
            >
              <span>{f.label}</span>
              <span style={{ background:'rgba(255,255,255,0.08)', borderRadius:20, padding:'1px 8px', fontSize:'0.75rem' }}>{f.count}</span>
            </button>
          ))}
        </div>

        {/* Main content */}
        <div style={{ flex:1, padding:'24px', overflowY:'auto' }}>
          {filtered.length === 0 ? (
            <div style={{ textAlign:'center', padding:'60px 0', color:'var(--text-muted)' }}>
              No {activeFilter === 'all' ? '' : activeFilter} posts yet.
              {activeFilter === 'pending' && <p style={{ marginTop:10, fontSize:'0.875rem' }}>Community blog submissions will appear here for review.</p>}
            </div>
          ) : (
            <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
              {filtered.map(blog => (
                <div key={blog.id} className="chart-card" style={{ padding:20 }}>
                  <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:16 }}>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ display:'flex', gap:8, alignItems:'center', marginBottom:8 }}>
                        <span className={`news-category-tag ${blog.status==='approved'?'tag-cyan':blog.status==='rejected'?'tag-orange':'tag-purple'}`} style={{ fontSize:'0.65rem' }}>
                          {blog.status.toUpperCase()}
                        </span>
                        <span className="news-category-tag tag-blue" style={{ fontSize:'0.65rem' }}>{blog.category}</span>
                      </div>
                      <h3 style={{ fontFamily:'var(--font-heading)', fontWeight:700, color:'var(--text-primary)', marginBottom:6, fontSize:'0.95rem', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                        {blog.title}
                      </h3>
                      <p style={{ color:'var(--text-secondary)', fontSize:'0.8rem', marginBottom:8, display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden' }}>
                        {blog.subtitle}
                      </p>
                      <div style={{ fontSize:'0.75rem', color:'var(--text-muted)', display:'flex', gap:12 }}>
                        <span>Submitted: {formatDate(blog.submittedAt || blog.date)}</span>
                        <span>{blog.readTime} min read</span>
                        {(blog.tags||[]).length > 0 && <span>Tags: {blog.tags.join(', ')}</span>}
                      </div>
                    </div>
                    <div style={{ display:'flex', gap:8, flexShrink:0 }}>
                      <button
                        onClick={() => setPreview(preview?.id === blog.id ? null : blog)}
                        className="filter-chip"
                        style={{ fontSize:'0.78rem', cursor:'pointer', padding:'6px 12px' }}
                      >
                        {preview?.id === blog.id ? 'Hide' : 'Preview'}
                      </button>
                      {blog.status !== 'approved' && (
                        <button onClick={() => updateStatus(blog.id, 'approved')} style={{ padding:'6px 14px', borderRadius:8, border:'none', background:'rgba(34,197,94,0.15)', color:'#22C55E', cursor:'pointer', fontSize:'0.78rem', fontWeight:600 }}>
                          ✓ Approve
                        </button>
                      )}
                      {blog.status !== 'rejected' && (
                        <button onClick={() => updateStatus(blog.id, 'rejected')} style={{ padding:'6px 14px', borderRadius:8, border:'none', background:'rgba(239,68,68,0.12)', color:'#EF4444', cursor:'pointer', fontSize:'0.78rem', fontWeight:600 }}>
                          ✗ Reject
                        </button>
                      )}
                      <button onClick={() => deletePost(blog.id)} style={{ padding:'6px 14px', borderRadius:8, border:'1px solid rgba(239,68,68,0.3)', background:'rgba(239,68,68,0.08)', color:'#EF4444', cursor:'pointer', fontSize:'0.78rem', fontWeight:600 }}>
                        🗑 Delete
                      </button>
                    </div>
                  </div>

                  {/* Inline preview */}
                  {preview?.id === blog.id && (
                    <div style={{ marginTop:16, paddingTop:16, borderTop:'1px solid var(--glass-border)' }}>
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
