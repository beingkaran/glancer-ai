/*
 * adsense — single source of truth for Google AdSense configuration.
 *
 * ┌─────────────────────────────────────────────────────────────────────────┐
 * │ TO GO LIVE (two edits, both in THIS file, plus one in /public/ads.txt):  │
 * │  1. Get approved at https://adsense.google.com and copy your publisher    │
 * │     id, then replace ADSENSE_CLIENT below (format 'ca-pub-XXXXXXXXXXXXXX').│
 * │  2. In AdSense, create one display ad unit per placement in AD_SLOTS and   │
 * │     paste each unit's slot id (the digits) over the placeholders below.    │
 * │  3. Put the same publisher id in /public/ads.txt.                         │
 * └─────────────────────────────────────────────────────────────────────────┘
 *
 * Until ADSENSE_CLIENT is a real ca-pub value, every <AdSlot> renders NOTHING
 * and the loader script in index.html is skipped — so the site stays clean in
 * dev and during AdSense's review crawl (no broken/empty ad boxes). That means
 * the article placements below are already wired and will light up the moment
 * you paste real ids — no component changes needed.
 */

export const ADSENSE_CLIENT = 'ca-pub-0000000000000000'; // ← replace with your publisher id

export const ADSENSE_ENABLED =
  /^ca-pub-\d{16}$/.test(ADSENSE_CLIENT) && ADSENSE_CLIENT !== 'ca-pub-0000000000000000';

// Named ad placements → AdSense ad-unit slot ids (create these in your account).
// Article placements are the money pages: high-viewability, 3–4 units max so
// Core Web Vitals stay green (viewability, not quantity, drives RPM).
export const AD_SLOTS = {
  // Tools / utility pages
  toolsTop: '0000000001',
  toolsInline: '0000000002',
  toolRunner: '0000000003',
  content: '0000000004',
  // Article (blog post) money-page placements
  articleTop: '0000000005',    // ① after the intro / byline, top viewability
  articleMid: '0000000006',    // ② mid-article, in the flow of reading
  articleEnd: '0000000007',    // ③ end of article, high completion intent
  articleAnchor: '0000000008', // ④ sticky bottom anchor (mobile), highest RPM
};
