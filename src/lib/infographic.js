/*
 * infographic — turn a single news story into a shareable square image (1080×1080,
 * ideal for Instagram / LinkedIn / X / WhatsApp status). Everything is drawn on a
 * <canvas> so there are no external services, fonts load from the page, and the
 * result is a PNG Blob we can hand to the native share sheet or download.
 *
 * Every card carries the brand call-to-action:
 *   "Visit glancerai.com for catching up to AI updates mentioned"
 */

import { ORIGIN, SHARE_TAGLINE } from './socialShare';
import { displayImage } from './newsFeed';

const SIZE = 1080;
const CTA = 'Visit glancerai.com for catching up to AI updates mentioned';

// Per-category accent pair (top-left → bottom-right) for the backdrop. Mirrors
// the chip hues so a shared card feels of-a-piece with the in-app category.
const PALETTE = {
  Research: ['#4c1d95', '#7c3aed'],
  Models: ['#831843', '#ec4899'],
  Industry: ['#0e4d8a', '#06b6d4'],
  'Open Source': ['#1e3a8a', '#3b82f6'],
  Tools: ['#0e7490', '#06b6d4'],
  Hardware: ['#78350f', '#f97316'],
  AIOps: ['#1e3a8a', '#2563eb'],
  Policy: ['#7c2d12', '#f59e0b'],
};
const DEFAULT_PAIR = ['#4c1d95', '#7c3aed'];

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

// Greedy word-wrap → array of lines that each fit `maxWidth`, capped at
// `maxLines` (last line gets an ellipsis if the text overflows).
function wrapLines(ctx, text, maxWidth, maxLines) {
  const words = (text || '').split(/\s+/).filter(Boolean);
  const lines = [];
  let line = '';
  for (const word of words) {
    const trial = line ? `${line} ${word}` : word;
    if (ctx.measureText(trial).width > maxWidth && line) {
      lines.push(line);
      line = word;
      if (lines.length === maxLines) break;
    } else {
      line = trial;
    }
  }
  if (line && lines.length < maxLines) lines.push(line);
  if (lines.length === maxLines && words.length) {
    // Trim the final line until it + an ellipsis fits.
    let last = lines[maxLines - 1];
    while (last && ctx.measureText(last + '…').width > maxWidth) last = last.slice(0, -1).trim();
    lines[maxLines - 1] = last + '…';
  }
  return lines;
}

// Load the article's cover image (proxied so CORS/hot-link blocks don't taint
// the canvas). Resolves to null on any failure so the card still renders.
function loadCover(url) {
  return new Promise((resolve) => {
    if (!url) return resolve(null);
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.referrerPolicy = 'no-referrer';
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = displayImage(url, 1080);
  });
}

// Cover-fit draw: fill the (x,y,w,h) box, cropping overflow, preserving aspect.
function drawCover(ctx, img, x, y, w, h) {
  const ir = img.width / img.height;
  const br = w / h;
  let sw = img.width, sh = img.height, sx = 0, sy = 0;
  if (ir > br) { sw = img.height * br; sx = (img.width - sw) / 2; }
  else { sh = img.width / br; sy = (img.height - sh) / 2; }
  ctx.drawImage(img, sx, sy, sw, sh, x, y, w, h);
}

/**
 * Build the infographic for one story. Returns a PNG Blob (1080×1080).
 */
export async function buildInfographicBlob(item = {}) {
  const canvas = document.createElement('canvas');
  canvas.width = SIZE;
  canvas.height = SIZE;
  const ctx = canvas.getContext('2d');
  const [c1, c2] = PALETTE[item.category] || DEFAULT_PAIR;

  // Backdrop gradient.
  const g = ctx.createLinearGradient(0, 0, SIZE, SIZE);
  g.addColorStop(0, '#0a0a1b');
  g.addColorStop(0.5, c1);
  g.addColorStop(1, c2);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, SIZE, SIZE);

  const PAD = 72;
  let y = PAD;

  // Brand header.
  ctx.textBaseline = 'top';
  ctx.fillStyle = '#ffffff';
  ctx.font = '700 44px Inter, system-ui, sans-serif';
  ctx.fillText('Glancer', PAD, y);
  const gw = ctx.measureText('Glancer ').width;
  ctx.fillStyle = '#a855f7';
  ctx.fillText('AI', PAD + gw, y);
  ctx.fillStyle = 'rgba(255,255,255,0.55)';
  ctx.font = '500 24px Inter, system-ui, sans-serif';
  ctx.textAlign = 'right';
  ctx.fillText('AI news, daily', SIZE - PAD, y + 12);
  ctx.textAlign = 'left';
  y += 92;

  // Cover image band (rounded).
  const cover = await loadCover(item.image);
  const imgH = 360;
  ctx.save();
  roundRect(ctx, PAD, y, SIZE - PAD * 2, imgH, 28);
  ctx.clip();
  if (cover) {
    drawCover(ctx, cover, PAD, y, SIZE - PAD * 2, imgH);
  } else {
    const ig = ctx.createLinearGradient(PAD, y, SIZE - PAD, y + imgH);
    ig.addColorStop(0, c1); ig.addColorStop(1, c2);
    ctx.fillStyle = ig;
    ctx.fillRect(PAD, y, SIZE - PAD * 2, imgH);
    ctx.font = '160px serif';
    ctx.textAlign = 'center';
    ctx.fillText(item.emoji || '🧠', SIZE / 2, y + imgH / 2 - 96);
    ctx.textAlign = 'left';
  }
  ctx.restore();
  y += imgH + 40;

  // Category pill.
  if (item.category) {
    ctx.font = '700 26px Inter, system-ui, sans-serif';
    const label = item.category.toUpperCase();
    const pw = ctx.measureText(label).width + 44;
    ctx.fillStyle = 'rgba(255,255,255,0.16)';
    roundRect(ctx, PAD, y, pw, 50, 25);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.fillText(label, PAD + 22, y + 12);
    y += 78;
  }

  // Title (large, up to 4 lines).
  ctx.fillStyle = '#ffffff';
  ctx.font = '800 56px Inter, system-ui, sans-serif';
  const titleLines = wrapLines(ctx, item.title || 'AI update', SIZE - PAD * 2, 4);
  for (const line of titleLines) { ctx.fillText(line, PAD, y); y += 70; }
  y += 14;

  // Excerpt (muted, up to 3 lines).
  if (item.excerpt) {
    ctx.fillStyle = 'rgba(255,255,255,0.78)';
    ctx.font = '400 30px Inter, system-ui, sans-serif';
    const ex = wrapLines(ctx, item.excerpt, SIZE - PAD * 2, 3);
    for (const line of ex) { ctx.fillText(line, PAD, y); y += 42; }
  }

  // Source + date line.
  if (item.source) {
    ctx.fillStyle = 'rgba(255,255,255,0.6)';
    ctx.font = '600 26px Inter, system-ui, sans-serif';
    ctx.fillText(`${item.source}${item.date ? '  ·  ' + item.date : ''}`, PAD, y + 8);
  }

  // Footer CTA band — the brand call-to-action, always present.
  const bandH = 132;
  const by = SIZE - bandH;
  ctx.fillStyle = 'rgba(0,0,0,0.34)';
  ctx.fillRect(0, by, SIZE, bandH);
  ctx.fillStyle = '#ffffff';
  ctx.font = '700 30px Inter, system-ui, sans-serif';
  const ctaLines = wrapLines(ctx, CTA, SIZE - PAD * 2, 2);
  let cy = by + (bandH - ctaLines.length * 38) / 2;
  for (const line of ctaLines) { ctx.fillText(line, PAD, cy); cy += 38; }

  return new Promise((resolve) => canvas.toBlob((b) => resolve(b), 'image/png', 0.92));
}

/**
 * Share one story as an infographic. Prefers the native share sheet with the
 * image FILE attached (so the card itself travels); falls back to downloading
 * the PNG and copying the link. Returns 'shared' | 'downloaded' | 'failed'.
 */
export async function shareInfographic(item = {}) {
  let blob;
  try {
    blob = await buildInfographicBlob(item);
  } catch {
    return 'failed';
  }
  if (!blob) return 'failed';

  const safe = (item.title || 'glancer-ai').replace(/[^a-z0-9]+/gi, '-').slice(0, 60).toLowerCase();
  const file = new File([blob], `${safe}.png`, { type: 'image/png' });
  const url = item.url || ORIGIN;
  const text = `${item.title || 'AI update'}\n\n${CTA}\n${SHARE_TAGLINE}`;

  // Native share with file (mobile + supported desktop browsers).
  if (typeof navigator !== 'undefined' && navigator.canShare && navigator.canShare({ files: [file] })) {
    try {
      await navigator.share({ files: [file], title: item.title || 'Glancer AI', text, url });
      return 'shared';
    } catch (err) {
      if (err && err.name === 'AbortError') return 'shared';
      /* fall through to download */
    }
  }

  // Fallback: download the PNG and copy the link so the user can paste it.
  try {
    const objUrl = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = objUrl;
    a.download = `${safe}.png`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(objUrl), 4000);
    try { await navigator.clipboard.writeText(`${item.title || ''}\n${url}\n\n${CTA}`); } catch { /* noop */ }
    return 'downloaded';
  } catch {
    return 'failed';
  }
}
