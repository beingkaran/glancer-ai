const PFX = 'glancer_like_v1_';

export function getLike(rid) {
  try { return localStorage.getItem(PFX + rid) || null; } catch { return null; }
}

// Toggles: clicking the same value removes it; clicking the other switches.
export function toggleLike(rid, val) {
  try {
    const cur = localStorage.getItem(PFX + rid);
    if (cur === val) { localStorage.removeItem(PFX + rid); return null; }
    localStorage.setItem(PFX + rid, val);
    return val;
  } catch { return null; }
}
