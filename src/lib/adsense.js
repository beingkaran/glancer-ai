/*
 * adsense — single source of truth for Google AdSense configuration.
 *
 * To go live:
 *   1. Get approved at https://adsense.google.com and copy your publisher id.
 *   2. Replace ADSENSE_CLIENT below with it (format: 'ca-pub-XXXXXXXXXXXXXXXX').
 *   3. Create ad units in AdSense and paste their slot ids into AD_SLOTS.
 *   4. Update /public/ads.txt with the same publisher id.
 *
 * Until ADSENSE_CLIENT is a real ca-pub value, AdSlot renders nothing and the
 * loader script in index.html is skipped — so the site stays clean in dev and
 * during AdSense's review crawl (no broken/empty ad boxes).
 */

export const ADSENSE_CLIENT = 'ca-pub-0000000000000000'; // ← replace with your publisher id

export const ADSENSE_ENABLED =
  /^ca-pub-\d{16}$/.test(ADSENSE_CLIENT) && ADSENSE_CLIENT !== 'ca-pub-0000000000000000';

// Named ad placements → AdSense ad-unit slot ids (create these in your account).
export const AD_SLOTS = {
  toolsTop: '0000000001',
  toolsInline: '0000000002',
  toolRunner: '0000000003',
  content: '0000000004',
};
