import { useState } from 'react';
import AdSlot from './AdSlot';
import { ADSENSE_ENABLED, AD_SLOTS } from '../lib/adsense';

/*
 * StickyAnchorAd — a bottom-fixed anchor ad, the highest-RPM unit on mobile
 * because it's always in view. Mobile-only (hidden ≥768px via .sticky-anchor-ad
 * in index.css), dismissible, and — like every AdSlot — renders nothing until a
 * real AdSense publisher id is set, so it never shows an empty bar in dev.
 */
export default function StickyAnchorAd() {
  const [closed, setClosed] = useState(false);
  if (!ADSENSE_ENABLED || closed) return null;

  return (
    <div className="sticky-anchor-ad" role="complementary" aria-label="Advertisement">
      <button
        type="button"
        className="sticky-anchor-close"
        aria-label="Close ad"
        onClick={() => setClosed(true)}
      >
        ✕
      </button>
      <AdSlot slot={AD_SLOTS.articleAnchor} format="horizontal" label={false} />
    </div>
  );
}
