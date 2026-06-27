import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getComments, addComment, deleteComment, toggleCommentLike } from '../lib/blogStore';
import { findProfanity } from '../lib/profanity';

/* "3 hours ago" style relative time. */
function timeAgo(iso) {
  const then = new Date(iso).getTime();
  if (isNaN(then)) return '';
  const s = Math.floor((Date.now() - then) / 1000);
  if (s < 60) return 'just now';
  const m = Math.floor(s / 60);
  if (m < 60) return `${m} min${m > 1 ? 's' : ''} ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} hour${h > 1 ? 's' : ''} ago`;
  const d = Math.floor(h / 24);
  if (d < 30) return `${d} day${d > 1 ? 's' : ''} ago`;
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function initialsOf(name) {
  return (name || 'U').split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();
}

function HeartIcon({ filled }) {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}

export default function Comments({ postId }) {
  const { user, isAuthed, isAdmin, configured } = useAuth();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [draft, setDraft] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [busyId, setBusyId] = useState(null);

  const refresh = useCallback(async () => {
    setComments(await getComments(postId));
    setLoading(false);
  }, [postId]);

  useEffect(() => {
    if (!configured) { setLoading(false); return; }
    refresh();
  }, [refresh, configured]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    const text = draft.trim();
    if (!text) { setError('Please write something first.'); return; }

    const bad = findProfanity(text);
    if (bad.length) {
      setError(`Please keep it respectful — remove inappropriate language before posting.`);
      return;
    }

    setSubmitting(true);
    try {
      await addComment(postId, text);
      setDraft('');
      await refresh();
    } catch (err) {
      setError(err?.message || 'Could not post your comment. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this comment?')) return;
    setBusyId(id);
    try {
      await deleteComment(id);
      setComments((cs) => cs.filter((c) => c.id !== id));
    } catch (err) {
      alert(err?.message || 'Could not delete the comment.');
    } finally {
      setBusyId(null);
    }
  }

  async function handleLike(c) {
    if (!isAuthed) { setError('Sign in to like comments.'); return; }
    // Optimistic flip.
    setComments((cs) => cs.map((x) => x.id === c.id
      ? { ...x, likedByMe: !x.likedByMe, likeCount: x.likeCount + (x.likedByMe ? -1 : 1) }
      : x));
    try {
      await toggleCommentLike(c.id, c.likedByMe);
    } catch (err) {
      // Roll back on failure.
      setComments((cs) => cs.map((x) => x.id === c.id
        ? { ...x, likedByMe: c.likedByMe, likeCount: c.likeCount }
        : x));
      alert(err?.message || 'Could not update your like.');
    }
  }

  if (!configured) return null; // comments need the Supabase backend

  return (
    <section style={{ marginTop: 48, paddingTop: 32, borderTop: '1px solid var(--glass-border)' }}>
      <h2 className="section-title-lg" style={{ marginBottom: 20 }}>
        Comments{comments.length ? ` (${comments.length})` : ''}
      </h2>

      {/* Composer */}
      {isAuthed ? (
        <form onSubmit={handleSubmit} className="chart-card" style={{ padding: 18, marginBottom: 24 }}>
          <textarea
            className="field-input"
            value={draft}
            onChange={(e) => { setDraft(e.target.value); if (error) setError(''); }}
            placeholder="Share your thoughts… (be respectful)"
            rows={3}
            maxLength={2000}
            style={{ resize: 'vertical', minHeight: 72, fontFamily: 'inherit' }}
          />
          {error && (
            <div style={{ color: '#EF4444', fontSize: '0.82rem', marginTop: 8 }}>{error}</div>
          )}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 10, gap: 12 }}>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              Posting as <strong style={{ color: 'var(--text-secondary)' }}>{user?.name || user?.email}</strong>
            </span>
            <button type="submit" disabled={submitting} className="btn-grad" style={{ padding: '9px 22px' }}>
              {submitting ? 'Posting…' : 'Post Comment'}
            </button>
          </div>
        </form>
      ) : (
        <div className="chart-card" style={{ padding: 20, marginBottom: 24, textAlign: 'center' }}>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: 0, display: 'inline-flex', gap: 6, justifyContent: 'center', flexWrap: 'wrap', width: '100%' }}>
            <Link to="/profile" className="read-more-link" style={{ textDecoration: 'none' }}>Sign in</Link>
            <span>to join the conversation.</span>
          </p>
        </div>
      )}

      {/* List */}
      {loading ? (
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Loading comments…</p>
      ) : comments.length === 0 ? (
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: 16 }}>
          No comments yet. Be the first to share your thoughts.
        </p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {comments.map((c) => {
            const canDelete = c.mine || isAdmin;
            return (
              <div key={c.id} className="chart-card" style={{ padding: 16, opacity: busyId === c.id ? 0.5 : 1 }}>
                <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'linear-gradient(135deg,#7C3AED,#06B6D4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 700, color: '#fff', flexShrink: 0 }}>
                    {initialsOf(c.author)}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, flexWrap: 'wrap', marginBottom: 4 }}>
                      <span style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.88rem' }}>{c.author}</span>
                      {c.mine && <span className="news-category-tag tag-purple" style={{ fontSize: '0.58rem', margin: 0 }}>You</span>}
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{timeAgo(c.createdAt)}</span>
                    </div>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.55, whiteSpace: 'pre-wrap', wordBreak: 'break-word', margin: 0 }}>
                      {c.body}
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 10 }}>
                      <button
                        type="button"
                        onClick={() => handleLike(c)}
                        aria-pressed={c.likedByMe}
                        aria-label={c.likedByMe ? 'Unlike comment' : 'Like comment'}
                        style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: c.likedByMe ? '#EC4899' : 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 600 }}
                      >
                        <HeartIcon filled={c.likedByMe} />
                        {c.likeCount > 0 ? c.likeCount : 'Like'}
                      </button>
                      {canDelete && (
                        <button
                          type="button"
                          disabled={busyId === c.id}
                          onClick={() => handleDelete(c.id)}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 600 }}
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
