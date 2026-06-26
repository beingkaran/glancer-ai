import { useEffect, useRef } from 'react';
import { ADSENSE_CLIENT, ADSENSE_ENABLED } from '../lib/adsense';

/*
 * AdSlot — a single Google AdSense responsive display unit.
 *
 * Renders nothing until you set your publisher id + slot ids in lib/adsense.js
 * (ADSENSE_ENABLED becomes true once ADSENSE_CLIENT is a real ca-pub-… value),
 * so the layout never shows an empty ad box during development or review.
 *
 * Props:
 *   slot   – the AdSense ad-unit slot id (string of digits)
 *   format – 'auto' (default) | 'fluid' | 'horizontal' | 'rectangle'
 *   label  – small "Advertisement" caption (kept for AdSense policy clarity)
 */
export default function AdSlot({ slot, format = 'auto', layout, className = '', style, label = true }) {
  const ref = useRef(null);
  const pushed = useRef(false);

  useEffect(() => {
    if (!ADSENSE_ENABLED || pushed.current) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      pushed.current = true;
    } catch { /* adsbygoogle not ready yet */ }
  }, []);

  if (!ADSENSE_ENABLED || !slot) return null;

  return (
    <div className={`ad-slot ${className}`} style={style} aria-hidden="true">
      {label && <span className="ad-slot-label">Advertisement</span>}
      <ins
        ref={ref}
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={ADSENSE_CLIENT}
        data-ad-slot={slot}
        data-ad-layout={layout}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
}
