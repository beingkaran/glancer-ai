# Live Tech-Events Feed — Setup

The `/events` page and the home-page teaser are now backed by a **live global
feed** that refreshes every 24 hours, instead of the hand-typed static list.

## How it works

```
Cron (daily 06:00 UTC) ──▶ worker/eventsCore.js ──▶ KV (EVENTS_KV)
                                                      │
Browser ─ GET /api/events ─▶ worker/index.js ────────┘  (KV-first, then edge cache, then build)
          GET /events.ics ─▶ same data as a subscribable calendar
```

- **Sources (free, no API key, global):**
  - `developers.events` — one big JSON of worldwide dev/tech conferences.
  - `confs.tech` — GitHub conference-data (general, devops, sre, data, security).
- **Curated flagships are always seeded.** The open datasets don't carry
  vendor keynotes (re:Invent, GTC, Ignite, WWDC…), so `src/data/techEvents.js`
  is merged in as always-include majors with hand-written blurbs. It's also the
  fallback if the feed is ever unavailable.
- **Filtering:** future events only, majors + in-scope multi-day conferences,
  meetup/community noise dropped, de-duped by name+year, capped at 150.
- **Caching:** KV holds the daily build; `/api/events` reads KV first, then the
  Cloudflare edge cache, then builds on demand. The client caches in
  localStorage and paints stale-while-revalidate.

## One-time activation (Cloudflare)

The worker guards a missing KV binding, so the site keeps working before this —
it just rebuilds on demand and edge-caches. To turn on the daily cron refresh:

1. **Create the KV namespace:**
   ```bash
   npx wrangler kv namespace create EVENTS_KV
   ```
2. **Paste the returned `id`** into `wrangler.jsonc`, replacing
   `REPLACE_WITH_EVENTS_KV_NAMESPACE_ID` in the `kv_namespaces` block.
3. **Deploy:**
   ```bash
   npm run build && npx wrangler deploy
   ```
   The Cron Trigger (`triggers.crons: ["0 6 * * *"]`) is registered on deploy.
4. **(Optional) prime it now** instead of waiting for the first cron:
   ```bash
   npx wrangler kv key put --binding EVENTS_KV "events:v1" "$(curl -s https://glancerai.com/api/events)"
   ```

## Testing

- **Local dev:** `npm run dev`, then open `/events` or `curl localhost:5173/api/events`.
  A vite middleware (`eventsDevApi` in `vite.config.js`) mirrors the worker and
  rebuilds on each call (no KV/cron locally).
- **Production:** `curl https://glancerai.com/api/events` and
  `curl https://glancerai.com/events.ics`.

## Files

| File | Role |
| --- | --- |
| `worker/eventsCore.js` | Aggregator: fetch → normalize → filter → merge curated → dedupe |
| `worker/index.js` | `/api/events`, live `/events.ics`, `scheduled()` cron handler |
| `wrangler.jsonc` | `triggers.crons` + `kv_namespaces` (EVENTS_KV) |
| `src/lib/eventsFeed.js` | Client `useLiveEvents()` — SWR + static fallback |
| `src/data/techEvents.js` | Curated flagship majors (seed + fallback) |
| `vite.config.js` | `eventsDevApi()` dev middleware |
