import { useState, useEffect, useCallback } from 'react';
import {
  blogPostUrl,
  generateShareHooks,
  formatSharePost,
  PLATFORMS,
  openPlatformShare,
  openAllPlatformShares,
} from '../lib/socialShare';

/*
 * SocialSharePanel — interactive modal for sharing a blog post to all social
 * networks with AI-generated hooks + the blog link. Opens automatically when
 * an admin approves a post (optional via autoOpen prop).
 */

export default function SocialSharePanel({ post, open, onClose, autoOpen = false }) {
  const [hooks, setHooks] = useState([]);
  const [selectedHook, setSelectedHook] = useState(0);
  const [customHook, setCustomHook] = useState('');
  const [generating, setGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [shareProgress, setShareProgress] = useState(null);
  const [sharingAll, setSharingAll] = useState(false);

  const url = post ? blogPostUrl(post) : '';
  const activeHook = customHook.trim() || hooks[selectedHook] || post?.subtitle || post?.title || '';
  const postText = post ? formatSharePost(activeHook, url, { tags: post.tags }) : '';
  const charCount = postText.length;

  const loadHooks = useCallback(async () => {
    if (!post) return;
    setGenerating(true);
    setCustomHook('');
    try {
      const generated = await generateShareHooks(post);
      setHooks(generated);
      setSelectedHook(0);
    } finally {
      setGenerating(false);
    }
  }, [post]);

  useEffect(() => {
    if (open && post) loadHooks();
  }, [open, post, loadHooks]);

  useEffect(() => {
    if (!open) {
      setShareProgress(null);
      setSharingAll(false);
      setCopied(false);
    }
  }, [open]);

  if (!open || !post) return null;

  async function copyPost() {
    try {
      await navigator.clipboard.writeText(postText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt('Copy this post text:', postText);
    }
  }

  function handleShareAll() {
    setSharingAll(true);
    setShareProgress({ current: 0, total: PLATFORMS.length });
    openAllPlatformShares(postText, url, post.title, {
      delayMs: 700,
      onProgress: (_p, current, total) => setShareProgress({ current, total }),
    });
    setTimeout(() => {
      setSharingAll(false);
      setShareProgress(null);
    }, PLATFORMS.length * 700 + 500);
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="social-share-title"
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: 'rgba(0,0,0,0.72)', backdropFilter: 'blur(6px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 20,
      }}
      onClick={(e) => e.target === e.currentTarget && onClose?.()}
    >
      <div
        className="chart-card"
        style={{
          width: '100%', maxWidth: 720, maxHeight: '92vh', overflow: 'auto',
          padding: 0, border: '1px solid var(--glass-border)',
          boxShadow: '0 24px 80px rgba(0,0,0,0.5)',
        }}
      >
        {/* Header */}
        <div style={{
          padding: '20px 24px', borderBottom: '1px solid var(--glass-border)',
          display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16,
          background: 'var(--accent-soft)',
        }}>
          <div>
            <p style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--purple)', marginBottom: 6 }}>
              {autoOpen ? '🚀 Post approved — share it!' : '📣 Social distribution'}
            </p>
            <h2 id="social-share-title" style={{ fontFamily: 'var(--font-heading)', fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>
              Share to all social media
            </h2>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
              Pick an interactive hook, then blast to every platform with one click.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            style={{
              background: 'var(--surface)', border: '1px solid var(--glass-border)',
              borderRadius: 10, width: 36, height: 36, cursor: 'pointer',
              color: 'var(--text-muted)', fontSize: '1.1rem', flexShrink: 0,
            }}
          >
            ×
          </button>
        </div>

        <div style={{ padding: '20px 24px' }}>
          {/* Blog link preview */}
          <div style={{
            padding: '12px 16px', borderRadius: 12, marginBottom: 20,
            background: 'var(--surface)', border: '1px solid var(--glass-border)',
          }}>
            <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: 4, fontWeight: 600 }}>BLOG LINK</p>
            <a href={url} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.85rem', color: 'var(--cyan)', wordBreak: 'break-all' }}>
              {url}
            </a>
            <p style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)', marginTop: 8 }}>{post.title}</p>
          </div>

          {/* Hook picker */}
          <div style={{ marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
              <p style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Interactive hooks {generating && <span style={{ color: 'var(--purple)', fontWeight: 400 }}>— generating…</span>}
              </p>
              <button
                type="button"
                onClick={loadHooks}
                disabled={generating}
                className="filter-chip"
                style={{ fontSize: '0.75rem', cursor: generating ? 'wait' : 'pointer', padding: '4px 12px' }}
              >
                ↻ Regenerate
              </button>
            </div>

            {generating && hooks.length === 0 ? (
              <div style={{ padding: 24, textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                Crafting scroll-stopping hooks…
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {(hooks.length ? hooks : [post.subtitle || post.title]).map((hook, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => { setSelectedHook(i); setCustomHook(''); }}
                    style={{
                      textAlign: 'left', padding: '12px 16px', borderRadius: 12, cursor: 'pointer',
                      border: selectedHook === i && !customHook
                        ? '2px solid var(--purple)'
                        : '1px solid var(--glass-border)',
                      background: selectedHook === i && !customHook
                        ? 'rgba(168,85,247,0.1)'
                        : 'var(--surface)',
                      color: 'var(--text-primary)', fontSize: '0.88rem', lineHeight: 1.5,
                    }}
                  >
                    <span style={{ fontSize: '0.65rem', color: 'var(--purple)', fontWeight: 700, marginRight: 8 }}>
                      HOOK {i + 1}
                    </span>
                    {hook}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Custom edit */}
          <div style={{ marginBottom: 20 }}>
            <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: 8 }}>
              Or write your own hook
            </label>
            <textarea
              className="field-input"
              value={customHook}
              onChange={(e) => setCustomHook(e.target.value)}
              placeholder="Type a custom hook to override the selection above…"
              rows={2}
              style={{ width: '100%', resize: 'vertical', fontSize: '0.88rem' }}
            />
          </div>

          {/* Preview */}
          <div style={{ marginBottom: 20 }}>
            <p style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 8 }}>
              POST PREVIEW <span style={{ fontWeight: 400, color: 'var(--text-muted)' }}>({charCount} chars)</span>
            </p>
            <pre style={{
              whiteSpace: 'pre-wrap', wordBreak: 'break-word',
              padding: 16, borderRadius: 12, fontSize: '0.84rem', lineHeight: 1.55,
              background: 'var(--surface)', border: '1px solid var(--glass-border)',
              color: 'var(--text-primary)', fontFamily: 'inherit', margin: 0,
            }}>
              {postText}
            </pre>
          </div>

          {/* Action buttons */}
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 20 }}>
            <button
              type="button"
              onClick={handleShareAll}
              disabled={sharingAll}
              className="btn-grad"
              style={{ padding: '12px 24px', fontSize: '0.9rem', fontWeight: 700, flex: '1 1 auto', minWidth: 200 }}
            >
              {sharingAll
                ? `Opening… ${shareProgress ? `${shareProgress.current}/${shareProgress.total}` : ''}`
                : `🚀 Share to all ${PLATFORMS.length} platforms`}
            </button>
            <button
              type="button"
              onClick={copyPost}
              className="filter-chip"
              style={{
                padding: '12px 20px', cursor: 'pointer', fontSize: '0.88rem', fontWeight: 600,
                color: copied ? '#22C55E' : undefined,
              }}
            >
              {copied ? '✓ Copied!' : '📋 Copy post text'}
            </button>
          </div>

          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 16, lineHeight: 1.5 }}>
            Tip: Allow pop-ups for glancerai.com so all compose windows open. If blocked, use individual buttons below.
          </p>

          {/* Per-platform buttons */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {PLATFORMS.map((p) => {
              const overLimit = charCount > p.maxChars;
              return (
                <button
                  key={p.id}
                  type="button"
                  title={overLimit ? `Text may be truncated on ${p.name} (max ~${p.maxChars} chars)` : `Share on ${p.name}`}
                  onClick={() => openPlatformShare(p, postText, url, post.title)}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 6,
                    padding: '8px 14px', borderRadius: 10, cursor: 'pointer',
                    border: `1px solid ${overLimit ? 'rgba(251,146,60,0.4)' : 'var(--glass-border)'}`,
                    background: 'var(--surface)',
                    color: p.color, fontSize: '0.8rem', fontWeight: 600,
                  }}
                >
                  <span style={{
                    width: 22, height: 22, borderRadius: 6, background: `${p.color}18`,
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.7rem', fontWeight: 800,
                  }}>
                    {p.icon}
                  </span>
                  {p.name}
                  {overLimit && <span style={{ color: '#FB923C', fontSize: '0.65rem' }}>⚠</span>}
                </button>
              );
            })}
          </div>
        </div>

        <div style={{
          padding: '14px 24px', borderTop: '1px solid var(--glass-border)',
          display: 'flex', justifyContent: 'flex-end',
        }}>
          <button type="button" onClick={onClose} className="filter-chip" style={{ padding: '10px 24px', cursor: 'pointer' }}>
            Done
          </button>
        </div>
      </div>
    </div>
  );
}