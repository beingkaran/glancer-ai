import { useEffect, useState } from 'react';
import { TECH_EVENTS } from '../data/techEvents';

/*
 * eventsFeed — client access to the live global tech-events feed.
 *
 *  - Primary:   GET /api/events — the edge aggregator (worker/eventsCore.js),
 *               rebuilt daily by a Cron Trigger into KV and shared by all
 *               visitors. Returns the curated flagship majors merged with the
 *               live global long-tail, already in the TECH_EVENTS shape.
 *  - Cache:     localStorage, served stale-while-revalidate — a cached list
 *               paints instantly while a fresh copy loads in the background.
 *  - Fallback:  the static curated TECH_EVENTS list (used in local dev without
 *               the worker, or if /api/events is ever unavailable).
 */

const CACHE_KEY = 'glancer_events_cache_v1';
// The feed only changes daily, but we still revalidate on every mount and just
// use the cache for the instant first paint — so no hard TTL gate is needed.

function readCache() {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed?.events) && parsed.events.length ? parsed.events : null;
  } catch {
    return null;
  }
}

function writeCache(events) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ ts: Date.now(), events }));
  } catch {
    /* private mode / quota — non-fatal, we just skip caching */
  }
}

/** Fetch the live feed once. Throws on network error or an empty payload. */
export async function fetchLiveEvents({ signal } = {}) {
  const res = await fetch('/api/events', { signal, headers: { accept: 'application/json' } });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  const events = Array.isArray(data?.events) ? data.events : [];
  if (!events.length) throw new Error('empty events payload');
  return events;
}

/**
 * React hook: returns the best events list available right now and upgrades it
 * to the live feed when it arrives. Paints cache (or the static list) instantly,
 * then revalidates. Never throws — a failed fetch just keeps the current list.
 */
export function useLiveEvents() {
  const [events, setEvents] = useState(() => readCache() || TECH_EVENTS);

  useEffect(() => {
    const ctrl = new AbortController();
    fetchLiveEvents({ signal: ctrl.signal })
      .then((live) => {
        setEvents(live);
        writeCache(live);
      })
      .catch(() => {
        /* offline / no worker → keep the cached or static list */
      });
    return () => ctrl.abort();
  }, []);

  return events;
}
