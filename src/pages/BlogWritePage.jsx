import { useState, useEffect, useCallback, useRef } from 'react';
import { Link as RouterLink, useNavigate, useParams } from 'react-router-dom';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import TiptapImage from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import CharacterCount from '@tiptap/extension-character-count';
import { useAuth } from '../context/AuthContext';
import { addBlog, updateBlog, getBlogById, canCurrentUserWrite } from '../lib/blogStore';
import { sanitizeBlogHtml } from '../lib/sanitizeHtml';
import AuthForm from '../components/AuthForm';
import { useDocumentMeta } from '../lib/useDocumentMeta';

const CATEGORIES = ['Observability','AIOps','APM','SRE','Distributed Tracing','Kubernetes','Cloud Native','Security','DevOps','AI / ML','Open Source','Industry'];
const GRADIENTS = [
  'linear-gradient(135deg, #0a1628 0%, #1e3a8a 60%, #2563eb 100%)',
  'linear-gradient(135deg, #1e1b4b 0%, #4c1d95 60%, #7c3aed 100%)',
  'linear-gradient(135deg, #0d2400 0%, #166534 60%, #22c55e 100%)',
  'linear-gradient(135deg, #2d0a2e 0%, #831843 60%, #ec4899 100%)',
  'linear-gradient(135deg, #1c1200 0%, #78350f 60%, #f97316 100%)',
  'linear-gradient(135deg, #000f40 0%, #1e3a8a 60%, #06b6d4 100%)',
];
const EMOJIS = ['🔭','📊','🤖','⚡','🛡️','🔗','☁️','⚙️','🧠','📟','🔍','🚀'];

/* Read an image file, downscale it, and compress to a WebP data URL — WebP is
 * typically 25–35% smaller than JPEG at the same visual quality, which keeps the
 * inline-stored images (banner + body) small. Falls back to JPEG on the rare
 * engine that can't encode WebP.
 * NOTE: the browser's global `Image` is shadowed by the TipTap `TiptapImage`
 * import, so we construct a real HTMLImageElement via `window.Image`. */
function fileToCompressedDataURL(file, maxW = 1280, quality = 0.82) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new window.Image();
      img.onload = () => {
        const scale = Math.min(1, maxW / img.width);
        const w = Math.max(1, Math.round(img.width * scale));
        const h = Math.max(1, Math.round(img.height * scale));
        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, w, h);
        try {
          // Prefer WebP; if the engine ignores it (returns PNG), fall back to JPEG.
          let url = canvas.toDataURL('image/webp', quality);
          if (!url.startsWith('data:image/webp')) {
            url = canvas.toDataURL('image/jpeg', quality);
          }
          resolve(url);
        } catch (err) {
          reject(err);
        }
      };
      img.onerror = reject;
      img.src = reader.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function ToolbarBtn({ onClick, active, title, children }) {
  return (
    <button
      type="button"
      onMouseDown={e => { e.preventDefault(); onClick(); }}
      className={`editor-toolbar-btn${active ? ' active' : ''}`}
      title={title}
      aria-label={title}
      aria-pressed={active}
    >
      {children}
    </button>
  );
}

export default function BlogWritePage() {
  // Account page — no search value; keep out of the index.
  useDocumentMeta({
    title: 'Write an Article',
    description: 'Draft and submit a practitioner article to Glancer AI.',
    robots: 'noindex, nofollow',
  });

  const navigate = useNavigate();
  const { id: editId } = useParams();
  const isEditing = Boolean(editId);
  const { user, isAuthed } = useAuth();
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [category, setCategory] = useState('Observability');
  const [tags, setTags] = useState('');
  const [emoji, setEmoji] = useState('🔭');
  const [gradient, setGradient] = useState(GRADIENTS[0]);
  const [bannerImage, setBannerImage] = useState('');
  const [bannerName, setBannerName] = useState('');
  const [uploading, setUploading] = useState(false);
  const [readTime, setReadTime] = useState(5);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  // Editing an already-approved post doesn't re-require the rights agreement.
  const [agreed, setAgreed] = useState(isEditing);
  const [canWrite, setCanWrite] = useState(null); // null = checking
  const [loadingPost, setLoadingPost] = useState(isEditing);
  const [error, setError] = useState('');

  // Check publish permission once signed in (open mode → always true).
  useEffect(() => {
    if (!isAuthed) { setCanWrite(null); return; }
    let active = true;
    canCurrentUserWrite().then((ok) => { if (active) setCanWrite(ok); });
    return () => { active = false; };
  }, [isAuthed]);

  async function handleBannerUpload(e) {
    const file = e.target.files?.[0];
    e.target.value = ''; // allow re-selecting the same file
    if (!file) return;
    setError('');
    if (!file.type.startsWith('image/')) { setError('Please choose an image file (JPG, PNG, WebP, or GIF).'); return; }
    if (file.size > 10 * 1024 * 1024) { setError('That image is too large. Please pick one under 10 MB.'); return; }
    setUploading(true);
    try {
      const dataUrl = await fileToCompressedDataURL(file);
      setBannerImage(dataUrl);
      setBannerName(file.name);
    } catch {
      setError('Could not process that image. Please try a different file.');
    } finally {
      setUploading(false);
    }
  }

  function removeBanner() {
    setBannerImage('');
    setBannerName('');
  }

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({ openOnClick: false, HTMLAttributes: { class: 'editor-link' } }),
      TiptapImage.configure({ inline: false, HTMLAttributes: { class: 'editor-image' } }),
      Placeholder.configure({ placeholder: 'Share your insights, experiences, and knowledge with the Glancer AI community…' }),
      CharacterCount,
    ],
    content: '',
    editorProps: {
      attributes: { class: 'tiptap-editor', spellcheck: 'true' },
    },
  });

  const setLink = useCallback(() => {
    const url = window.prompt('Enter URL');
    if (!url) return;
    if (editor.isActive('link')) {
      editor.chain().focus().unsetLink().run();
    } else {
      editor.chain().focus().setLink({ href: url }).run();
    }
  }, [editor]);

  // Insert an inline image into the article body. Reuses the same downscale +
  // compress step as the banner, then embeds it as a data URL so it travels
  // with the post body (no separate upload/storage needed).
  const imageInputRef = useRef(null);
  const [insertingImage, setInsertingImage] = useState(false);

  async function handleInsertImage(e) {
    const file = e.target.files?.[0];
    e.target.value = ''; // allow re-selecting the same file
    if (!file) return;
    setError('');
    if (!file.type.startsWith('image/')) { setError('Please choose an image file (JPG, PNG, WebP, or GIF).'); return; }
    if (file.size > 10 * 1024 * 1024) { setError('That image is too large. Please pick one under 10 MB.'); return; }
    setInsertingImage(true);
    try {
      const dataUrl = await fileToCompressedDataURL(file, 1000, 0.8);
      editor?.chain().focus().setImage({ src: dataUrl }).run();
    } catch {
      setError('Could not insert that image. Please try a different file.');
    } finally {
      setInsertingImage(false);
    }
  }

  // Edit mode: load the existing post once and prefill every field + the editor.
  useEffect(() => {
    if (!isEditing || !editor) return;
    let active = true;
    (async () => {
      const post = await getBlogById(editId);
      if (!active) return;
      if (!post) {
        setError("This article couldn't be loaded — it may have been removed, or you may not have permission to edit it.");
        setLoadingPost(false);
        return;
      }
      setTitle(post.title || '');
      setSubtitle(post.subtitle || '');
      setCategory(post.category || 'Observability');
      setTags((post.tags || []).join(', '));
      setEmoji(post.icon || post.emoji || '🔭');
      setGradient(post.gradient || GRADIENTS[0]);
      setBannerImage(post.bannerImage || '');
      setBannerName(post.bannerImage ? 'Current banner image' : '');
      setReadTime(post.readTime || 5);
      editor.commands.setContent(post.body || '');
      setLoadingPost(false);
    })();
    return () => { active = false; };
  }, [isEditing, editId, editor]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (!title.trim()) { setError('Please enter a title.'); return; }
    if (!editor || editor.isEmpty) { setError('Please write some content.'); return; }
    if (!agreed) { setError('Please confirm you own the rights to this content and accept the Terms of Use.'); return; }

    const blog = {
      title: title.trim(),
      subtitle: subtitle.trim(),
      category,
      icon: emoji,
      emoji,
      gradient,
      bannerImage: bannerImage || undefined,
      author: user?.name || 'Community',
      readTime: Number(readTime),
      tags: tags.split(',').map(t => t.trim()).filter(Boolean),
      // Sanitize before persisting so active content never reaches the DB
      // (render paths sanitize again — defense in depth for existing records).
      body: sanitizeBlogHtml(editor.getHTML()),
    };

    setSubmitting(true);
    try {
      if (isEditing) {
        await updateBlog(editId, blog);
      } else {
        await addBlog(blog);
      }
      setSubmitted(true);
    } catch (err) {
      setError(err?.message || 'Could not save your article. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  /* Gate: writing requires sign-in. */
  if (!isAuthed) {
    return (
      <div className="page-section">
        <div className="container" style={{ maxWidth: 460 }}>
          <div className="page-hero" style={{ paddingTop: 'calc(var(--navbar-h) + 70px)', paddingBottom: 28, textAlign: 'center' }}>
            <p className="section-label" style={{ marginBottom: 12 }}>Write an Article</p>
            <h1 className="page-hero-title" style={{ fontSize: '2rem' }}>Sign in to start writing</h1>
            <p className="hero-sub" style={{ margin: '0 auto' }}>
              You need an account to write and publish articles. Your work stays as a draft until approved.
            </p>
          </div>
          <div className="chart-card" style={{ padding: 36, marginBottom: 80 }}>
            <AuthForm />
          </div>
        </div>
      </div>
    );
  }

  /* Gate: account must be allowed to publish (writer-restrict mode). */
  if (canWrite === false) {
    return (
      <div className="page-section">
        <div className="container" style={{ maxWidth: 480 }}>
          <div className="page-hero" style={{ paddingTop: 'calc(var(--navbar-h) + 70px)', paddingBottom: 28, textAlign: 'center' }}>
            <p className="section-label" style={{ marginBottom: 12 }}>Write an Article</p>
            <h1 className="page-hero-title" style={{ fontSize: '2rem' }}>Writer access pending</h1>
          </div>
          <div className="chart-card" style={{ padding: 36, textAlign: 'center', marginBottom: 80 }}>
            <div style={{ fontSize: '2.4rem', marginBottom: 16 }}>✋</div>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 24 }}>
              You're signed in as <strong style={{ color: 'var(--text-primary)' }}>{user?.email}</strong>, but
              this account isn't approved to publish yet. Ask the site admin to add you to the writer allowlist.
            </p>
            <RouterLink to="/profile" className="filter-chip" style={{ padding: '10px 22px', textDecoration: 'none' }}>← Back to profile</RouterLink>
          </div>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="page-section" style={{ textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: 560, paddingTop: 'calc(var(--navbar-h) + 80px)', paddingBottom: 80 }}>
          <div style={{ fontSize: '4rem', marginBottom: 20 }}>✅</div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 12 }}>
            {isEditing ? 'Changes Saved!' : 'Article Submitted!'}
          </h1>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 32 }}>
            Your article <strong style={{ color: 'var(--text-primary)' }}>"{title}"</strong>{' '}
            {isEditing
              ? 'has been updated and sent back for review. It will reappear publicly once an admin re-approves it.'
              : 'has been submitted for review. It will appear publicly once approved by the Glancer AI team.'}
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
            <button className="btn-grad" onClick={() => navigate(isEditing ? '/profile' : '/')} style={{ padding: '12px 28px' }}>
              {isEditing ? 'Back to Profile' : 'View All Blogs'}
            </button>
            {!isEditing && (
              <button className="filter-chip" onClick={() => { setSubmitted(false); setTitle(''); setSubtitle(''); removeBanner(); editor?.commands.clearContent(); }} style={{ padding: '12px 28px', cursor: 'pointer' }}>
                Write Another
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  /* Loading the post being edited. */
  if (isEditing && loadingPost) {
    return (
      <div className="page-section">
        <div className="container" style={{ maxWidth: 560, paddingTop: 'calc(var(--navbar-h) + 90px)', paddingBottom: 80, textAlign: 'center', color: 'var(--text-muted)' }}>
          Loading your article…
        </div>
      </div>
    );
  }

  return (
    <div className="page-section">
      <div className="container" style={{ maxWidth: 840, paddingTop: 'calc(var(--navbar-h) + 40px)', paddingBottom: 80 }}>
        <div style={{ marginBottom: 32 }}>
          <p className="section-label" style={{ marginBottom: 8 }}>Community</p>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            {isEditing ? 'Edit Article' : 'Write an Article'}
          </h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: 8 }}>
            {isEditing
              ? 'Update your article below. Saved changes go back to the review queue before they reappear publicly.'
              : 'Share your knowledge with the Glancer AI community. Articles are reviewed before publishing.'}
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Meta fields */}
          <div className="chart-card" style={{ marginBottom: 20 }}>
            <h3 className="chart-title" style={{ marginBottom: 20 }}>Article Details</h3>

            <div style={{ marginBottom: 16 }}>
              <label className="field-label">Title *</label>
              <input
                className="field-input"
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Your article headline…"
                maxLength={120}
                required
              />
            </div>

            <div style={{ marginBottom: 16 }}>
              <label className="field-label">Subtitle / Summary</label>
              <input
                className="field-input"
                type="text"
                value={subtitle}
                onChange={e => setSubtitle(e.target.value)}
                placeholder="One-line description shown on the card…"
                maxLength={220}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
              <div>
                <label className="field-label">Category</label>
                <select className="field-input" value={category} onChange={e => setCategory(e.target.value)}>
                  {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="field-label">Estimated Read Time (min)</label>
                <input className="field-input" type="number" min={1} max={60} value={readTime} onChange={e => setReadTime(e.target.value)} />
              </div>
            </div>

            <div style={{ marginBottom: 16 }}>
              <label className="field-label">Tags (comma-separated)</label>
              <input className="field-input" type="text" value={tags} onChange={e => setTags(e.target.value)} placeholder="e.g. observability, AIOps, metrics" />
            </div>

            {/* Cover card preview */}
            <div style={{ marginBottom: 8 }}>
              <label className="field-label">Card Appearance</label>

              {/* Banner image upload */}
              <div style={{ marginBottom: 16 }}>
                <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: 6 }}>Banner image (optional)</p>
                {bannerImage ? (
                  <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
                    <div style={{ width: 200, height: 110, borderRadius: 12, overflow: 'hidden', border: '1px solid var(--glass-border)', flexShrink: 0 }}>
                      <img src={bannerImage} alt="Banner preview" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', maxWidth: 220, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {bannerName || 'Uploaded image'}
                      </span>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <label className="filter-chip" style={{ padding: '6px 14px', cursor: 'pointer', fontSize: '0.78rem' }}>
                          Replace
                          <input type="file" accept="image/*" onChange={handleBannerUpload} style={{ display: 'none' }} />
                        </label>
                        <button type="button" className="filter-chip" onClick={removeBanner} style={{ padding: '6px 14px', cursor: 'pointer', fontSize: '0.78rem' }}>
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <label
                    style={{
                      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6,
                      padding: '22px 16px', borderRadius: 12, cursor: uploading ? 'wait' : 'pointer',
                      border: '2px dashed var(--glass-border)', background: 'var(--surface)', textAlign: 'center',
                    }}
                  >
                    <span style={{ fontSize: '1.5rem', lineHeight: 1 }}>🖼️</span>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-primary)', fontWeight: 600 }}>
                      {uploading ? 'Processing image…' : 'Upload a banner image'}
                    </span>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                      JPG, PNG, WebP or GIF · up to 10 MB · shown across the top of your article
                    </span>
                    <input type="file" accept="image/*" onChange={handleBannerUpload} disabled={uploading} style={{ display: 'none' }} />
                  </label>
                )}
              </div>

              <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: 10 }}>
                {bannerImage ? 'These are used only if you remove the banner image.' : 'No image? Pick an icon and gradient instead.'}
              </p>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center', opacity: bannerImage ? 0.5 : 1 }}>
                <div>
                  <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: 6 }}>Icon</p>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {EMOJIS.map(e => (
                      <button key={e} type="button" onClick={() => setEmoji(e)}
                        style={{ fontSize: '1.4rem', padding: '4px 6px', borderRadius: 8, border: `2px solid ${emoji === e ? 'var(--purple)' : 'var(--glass-border)'}`, background: emoji === e ? 'rgba(168,85,247,0.15)' : 'var(--surface)', cursor: 'pointer', lineHeight: 1 }}>
                        {e}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: 6 }}>Cover gradient</p>
                  <div style={{ display: 'flex', gap: 6 }}>
                    {GRADIENTS.map((g, i) => (
                      <button key={i} type="button" onClick={() => setGradient(g)}
                        style={{ width: 32, height: 32, borderRadius: 8, background: g, border: `2px solid ${gradient === g ? 'var(--purple)' : 'transparent'}`, cursor: 'pointer', flexShrink: 0 }} />
                    ))}
                  </div>
                </div>
                {/* Live preview */}
                <div style={{ width: 80, height: 60, borderRadius: 10, background: bannerImage ? undefined : gradient, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', border: '1px solid var(--glass-border)', flexShrink: 0, overflow: 'hidden' }}>
                  {bannerImage
                    ? <img src={bannerImage} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    : emoji}
                </div>
              </div>
            </div>
          </div>

          {/* Editor */}
          <div className="chart-card editor-card" style={{ marginBottom: 20 }}>
            <h3 className="chart-title" style={{ marginBottom: 16 }}>Content *</h3>

            {/* Toolbar */}
            <div className="editor-toolbar" role="toolbar" aria-label="Text formatting">
              <ToolbarBtn onClick={() => editor?.chain().focus().toggleBold().run()} active={editor?.isActive('bold')} title="Bold (Ctrl+B)">
                <strong>B</strong>
              </ToolbarBtn>
              <ToolbarBtn onClick={() => editor?.chain().focus().toggleItalic().run()} active={editor?.isActive('italic')} title="Italic (Ctrl+I)">
                <em>I</em>
              </ToolbarBtn>
              <ToolbarBtn onClick={() => editor?.chain().focus().toggleUnderline().run()} active={editor?.isActive('underline')} title="Underline (Ctrl+U)">
                <u>U</u>
              </ToolbarBtn>
              <div className="editor-toolbar-sep" />
              <ToolbarBtn onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()} active={editor?.isActive('heading', { level: 2 })} title="Heading 2">H2</ToolbarBtn>
              <ToolbarBtn onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()} active={editor?.isActive('heading', { level: 3 })} title="Heading 3">H3</ToolbarBtn>
              <div className="editor-toolbar-sep" />
              <ToolbarBtn onClick={() => editor?.chain().focus().toggleBulletList().run()} active={editor?.isActive('bulletList')} title="Bullet list">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="9" y1="6" x2="20" y2="6"/><line x1="9" y1="12" x2="20" y2="12"/><line x1="9" y1="18" x2="20" y2="18"/><circle cx="4" cy="6" r="1.5" fill="currentColor"/><circle cx="4" cy="12" r="1.5" fill="currentColor"/><circle cx="4" cy="18" r="1.5" fill="currentColor"/></svg>
              </ToolbarBtn>
              <ToolbarBtn onClick={() => editor?.chain().focus().toggleOrderedList().run()} active={editor?.isActive('orderedList')} title="Numbered list">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="10" y1="6" x2="21" y2="6"/><line x1="10" y1="12" x2="21" y2="12"/><line x1="10" y1="18" x2="21" y2="18"/><path d="M4 6h1v4"/><path d="M4 10H6"/><path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1"/></svg>
              </ToolbarBtn>
              <div className="editor-toolbar-sep" />
              <ToolbarBtn onClick={() => editor?.chain().focus().toggleBlockquote().run()} active={editor?.isActive('blockquote')} title="Quote">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"/><path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"/></svg>
              </ToolbarBtn>
              <ToolbarBtn onClick={() => editor?.chain().focus().toggleCode().run()} active={editor?.isActive('code')} title="Inline code">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
              </ToolbarBtn>
              <ToolbarBtn onClick={() => editor?.chain().focus().toggleCodeBlock().run()} active={editor?.isActive('codeBlock')} title="Code block">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M10 9L7 12l3 3"/><path d="M14 9l3 3-3 3"/></svg>
              </ToolbarBtn>
              <ToolbarBtn onClick={setLink} active={editor?.isActive('link')} title="Add link">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
              </ToolbarBtn>
              <ToolbarBtn onClick={() => imageInputRef.current?.click()} active={editor?.isActive('image')} title={insertingImage ? 'Inserting image…' : 'Insert image'}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>
              </ToolbarBtn>
              <input ref={imageInputRef} type="file" accept="image/*" onChange={handleInsertImage} style={{ display: 'none' }} />
              <div className="editor-toolbar-sep" />
              <ToolbarBtn onClick={() => editor?.chain().focus().undo().run()} title="Undo">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M3 7v6h6"/><path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13"/></svg>
              </ToolbarBtn>
              <ToolbarBtn onClick={() => editor?.chain().focus().redo().run()} title="Redo">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 7v6h-6"/><path d="M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3L21 13"/></svg>
              </ToolbarBtn>
            </div>

            <EditorContent editor={editor} />

            {editor && (
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 10, textAlign: 'right' }}>
                {editor.storage.characterCount.characters()} characters · {editor.storage.characterCount.words()} words
              </div>
            )}
          </div>

          {error && (
            <div style={{ color: '#EF4444', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 10, padding: '12px 16px', marginBottom: 16, fontSize: '0.875rem' }}>
              {error}
            </div>
          )}

          {!isEditing && (
            <label className="rights-agree">
              <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} />
              <span>
                I confirm this is my own work or that I have the rights to publish it, it doesn't
                infringe anyone's copyright, and I agree to the{' '}
                <a href="/terms" target="_blank" rel="noopener noreferrer">Terms of Use</a>.
              </span>
            </label>
          )}

          <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
            <button type="button" className="filter-chip" onClick={() => navigate(isEditing ? '/profile' : '/')} style={{ padding: '12px 24px', cursor: 'pointer' }}>
              Cancel
            </button>
            <button type="submit" disabled={submitting} className="btn-grad" style={{ padding: '12px 32px' }}>
              {submitting ? 'Saving…' : isEditing ? 'Save Changes →' : 'Submit for Review →'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
