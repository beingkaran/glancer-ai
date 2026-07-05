/*
 * eventsCore — the edge-side tech-events aggregator. Runs inside the Cloudflare
 * Worker (and the vite dev middleware), so the heavy work — pulling the global
 * conference datasets and normalising them — happens ONCE per day (a Cron
 * Trigger writes the result into KV) and is shared by every visitor.
 *
 * Sources (both free, no API key, community-maintained, global):
 *   - developers.events  — one big JSON of dev/tech conferences worldwide, with
 *                          epoch-ms dates and city/country. Primary source.
 *   - confs.tech         — GitHub conference-data, split by topic + year. Used to
 *                          top up the operations-heavy tracks (devops, sre, data,
 *                          security). Secondary.
 *
 * The output matches the shape the UI + ICS already expect (see
 * src/data/techEvents.js): { id, name, organizer, category, start, end, city,
 * country, venue, format, url, blurb, tags, emoji }.
 *
 * We keep only *future* events and bias hard toward the majors — either a known
 * big-vendor / flagship name, or something tagged with our core topics (AI, ML,
 * observability, cloud-native, DevOps, SRE). Everything is de-duped by name+year.
 *
 * The free community datasets carry the global conference long-tail but NOT the
 * vendor-run flagship keynotes (re:Invent, GTC, Ignite, WWDC…), which aren't in
 * any open feed. So we seed the result with our hand-curated majors (the static
 * TECH_EVENTS list) and let the live feed fill in everything around them.
 *
 * Pure Workers-runtime globals only (fetch, URL, AbortController). No DOMParser,
 * no Node APIs. `Date` is available in the Workers runtime.
 */
import { TECH_EVENTS } from '../src/data/techEvents.js';

const UA = 'Mozilla/5.0 (compatible; GlancerAIBot/1.0; +https://glancerai.com)';

const DEVELOPERS_EVENTS = 'https://developers.events/all-events.json';
// confs.tech topic files worth pulling for an AIOps/observability audience.
const CONFS_TECH_TOPICS = ['general', 'devops', 'sre', 'data', 'security'];

// How many upcoming events we keep after filtering + sorting. Plenty for a
// scannable month-grouped agenda without turning it into a firehose.
const MAX_EVENTS = 150;

async function timedFetch(url, ms) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), ms);
  try {
    return await fetch(url, {
      redirect: 'follow',
      signal: ctrl.signal,
      headers: { 'User-Agent': UA, Accept: 'application/json,*/*;q=0.8' },
      // Let Cloudflare cache the upstream too, so a cache-miss rebuild is cheap.
      cf: { cacheTtl: 3600, cacheEverything: true },
    });
  } finally {
    clearTimeout(t);
  }
}

async function fetchJson(url, ms = 9000) {
  const res = await timedFetch(url, ms);
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return res.json();
}

/* ------------------------------------------------------------- classifiers */

// Flagship keynotes / big-vendor conferences we always want to surface.
const MAJOR = new RegExp(
  [
    're:?invent', 'aws\\b', 'amazon web services', 'google (cloud )?next', 'google i/?o',
    'microsoft (ignite|build)', '\\bignite\\b', '\\bwwdc\\b', 'nvidia', '\\bgtc\\b',
    'kubecon', 'cloudnativecon', '\\bcncf\\b', 'gartner', 'red ?hat summit',
    'cisco live', 'ibm think', 'oracle cloudworld', 'databricks', 'data \\+ ai summit',
    'snowflake', 'hashiconf', 'github universe', 'gitlab', 'dockercon', 'docker',
    'datadog', '\\bdash\\b', 'grafana', 'observabilitycon', 'splunk', '\\.conf',
    'dynatrace', 'perform', 'new relic', 'futurestack', 'elastic', 'servicenow',
    'knowledge \\d', 'salesforce', 'dreamforce', 'sap ?sapphire', 'vmware', 'vmworld',
    'atlassian', 'sre ?con', 'devopsdays', 'devops', 'neurips', '\\bicml\\b', '\\biclr\\b',
    'qcon', 'open ?source summit', 'linux', 'platformcon',
  ].join('|'),
  'i',
);

// Community-scale spin-offs we do NOT want on a "major events" agenda: local
// watch parties, meetups, "Extended"/recap editions, regional community days.
const NOISE = new RegExp(
  [
    '\\bextended\\b', 'community days?', '\\bkcd\\b', '\\bgdg\\b', 'meetup', 'indaba',
    'unplugged', 'watch party', 'viewing party', 'user group', 'bootcamp', 'workshop',
    'hackathon', 'study jam', 'codelab', 'road ?show', 'recap', 'study group',
  ].join('|'),
  'i',
);
const NOISE_HOSTS = /(^|\.)(meetup\.com|community\.dev|community2?\.cncf\.io|gdg\.community\.dev)$/i;

function isNoise(ev) {
  if (NOISE.test(ev.name)) return true;
  try {
    if (NOISE_HOSTS.test(new URL(ev.url).hostname)) return true;
  } catch { /* bad url handled elsewhere */ }
  return false;
}

// Drop records whose title advertises a past year (stale/mislabelled entries).
function staleYear(name, startYear) {
  const m = String(name).match(/\b(20\d{2})\b/);
  return m ? Number(m[1]) < startYear : false;
}

// Core topics — an event tagged/named with any of these is in-scope for Glancer.
const CORE_TOPIC = new RegExp(
  [
    '\\bai\\b', 'a\\.i\\.', 'artificial intelligence', '\\bml\\b', 'machine learning',
    '\\bllm', 'gen ?ai', 'deep learning', 'data science', 'mlops',
    'observability', 'monitoring', '\\bapm\\b', 'aiops', 'telemetry', 'opentelemetry',
    'reliabilit', '\\bsre\\b', 'devops', 'gitops', 'platform eng', 'incident',
    'cloud ?native', 'kubernetes', 'serverless', 'container', 'infrastructure', 'data eng',
  ].join('|'),
  'i',
);

// Category buckets (must match EVENT_CATEGORIES keys in src/data/techEvents.js).
function categorize(text) {
  const t = text.toLowerCase();
  if (/observ|monitor|\bapm\b|telemetry|grafana|datadog|splunk|dynatrace|new relic|elastic/.test(t)) return 'Observability';
  if (/aiops|gartner|itops|incident|servicenow|itsm/.test(t)) return 'AIOps';
  if (/\bai\b|a\.i\.|machine learning|\bml\b|\bllm|gen ?ai|neurips|\bgtc\b|nvidia|gemini|deep learning|data science|mlops/.test(t)) return 'AI / ML';
  if (/devops|\bsre\b|reliabilit|gitops|ci\/cd|platform eng|hashiconf|gitlab|jenkins/.test(t)) return 'DevOps / SRE';
  return 'Cloud Native';
}

const CATEGORY_EMOJI = {
  Observability: '🔭',
  AIOps: '🤖',
  'Cloud Native': '☸️',
  'AI / ML': '🧠',
  'DevOps / SRE': '⚙️',
};

// Map a flagship name to a clean organizer label; otherwise fall back to host.
const ORGANIZER_RULES = [
  [/re:?invent|aws|amazon web services/i, 'AWS'],
  [/google (cloud )?next|google i\/?o/i, 'Google'],
  [/wwdc|apple/i, 'Apple'],
  [/microsoft|ignite|\bbuild\b/i, 'Microsoft'],
  [/nvidia|\bgtc\b/i, 'NVIDIA'],
  [/kubecon|cloudnativecon|\bcncf\b|open ?source summit/i, 'CNCF / Linux Foundation'],
  [/gartner/i, 'Gartner'],
  [/red ?hat/i, 'Red Hat'],
  [/datadog|\bdash\b/i, 'Datadog'],
  [/grafana|observabilitycon/i, 'Grafana Labs'],
  [/splunk|\.conf/i, 'Splunk'],
  [/dynatrace|perform/i, 'Dynatrace'],
  [/hashiconf|hashicorp/i, 'HashiCorp'],
  [/github universe/i, 'GitHub'],
  [/gitlab/i, 'GitLab'],
  [/databricks|data \+ ai/i, 'Databricks'],
  [/snowflake/i, 'Snowflake'],
];

function organizerFor(name, url) {
  for (const [re, label] of ORGANIZER_RULES) if (re.test(name)) return label;
  try {
    const host = new URL(url).hostname.replace(/^www\./, '');
    return host || 'Independent';
  } catch {
    return 'Independent';
  }
}

/* -------------------------------------------------------------- utilities */

function slugify(s) {
  return String(s).toLowerCase().normalize('NFKD').replace(/[^\w\s-]/g, '')
    .trim().replace(/\s+/g, '-').replace(/-+/g, '-').slice(0, 60);
}

// epoch-ms -> 'YYYY-MM-DD' (UTC), or '' if not a finite timestamp.
function msToDate(ms) {
  if (!Number.isFinite(ms)) return '';
  const d = new Date(ms);
  if (Number.isNaN(d.getTime())) return '';
  return d.toISOString().slice(0, 10);
}

// Accept 'YYYY-MM-DD' (confs.tech) as-is; anything else is dropped.
function isoDate(s) {
  return typeof s === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(s) ? s : '';
}

function splitLocation(loc = '') {
  // developers.events "City, ST (Country)" or "City (Country)".
  const m = /^(.*?)\s*\(([^)]+)\)\s*$/.exec(loc);
  if (m) return { city: m[1].trim(), country: m[2].trim() };
  return { city: loc.trim(), country: '' };
}

function isVirtual(...bits) {
  return /online|virtual|remote/i.test(bits.filter(Boolean).join(' '));
}

function shortBlurb(ev) {
  const where = [ev.city, ev.country].filter(Boolean).join(', ');
  const lead = ev.category === 'AI / ML' ? 'AI & ML' : ev.category;
  return where ? `${lead} conference in ${where}.` : `${lead} conference.`;
}

/* ----------------------------------------------------------- normalisation */

function normalize(rec) {
  const name = (rec.name || '').trim();
  const url = (rec.url || '').trim();
  const start = rec.start;
  if (!name || !url || !start) return null;
  const end = rec.end && rec.end >= start ? rec.end : start;
  const category = categorize(`${name} ${(rec.tags || []).join(' ')}`);
  const ev = {
    id: '',
    name,
    organizer: organizerFor(name, url),
    category,
    start,
    end,
    city: rec.city || '',
    country: rec.country || '',
    venue: '',
    format: rec.virtual ? 'Virtual' : 'In-person',
    url,
    blurb: '',
    tags: (rec.tags || []).slice(0, 3),
    emoji: CATEGORY_EMOJI[category] || '📅',
  };
  ev.blurb = shortBlurb(ev);
  ev.id = `${slugify(name)}-${start.slice(0, 4)}`;
  return ev;
}

// developers.events record -> intermediate shape.
function fromDevelopersEvents(r) {
  const dates = Array.isArray(r.date) ? r.date : [];
  const start = msToDate(dates[0]);
  const end = msToDate(dates[1] ?? dates[0]);
  const { city, country } = r.city || r.country
    ? { city: r.city || '', country: r.country || '' }
    : splitLocation(r.location || '');
  return {
    name: r.name, url: r.hyperlink, start, end, city, country,
    virtual: isVirtual(r.location, city),
    tags: Array.isArray(r.tags) ? r.tags : [],
  };
}

// confs.tech record -> intermediate shape.
function fromConfsTech(r) {
  return {
    name: r.name, url: r.url, start: isoDate(r.startDate), end: isoDate(r.endDate || r.startDate),
    city: (r.city || '').split(',')[0].trim(), country: r.country || '',
    virtual: r.online === true, tags: [],
  };
}

function isMajor(ev) {
  return MAJOR.test(ev.name);
}

// Multi-day span → a real conference, not a single-evening meetup. Used to gate
// topic-only events (majors are always kept regardless of length).
function multiDay(ev) {
  return ev.end && ev.end > ev.start;
}

function relevant(ev) {
  if (isNoise(ev)) return false;
  const hay = `${ev.name} ${ev.tags.join(' ')}`;
  return isMajor(ev) || (CORE_TOPIC.test(hay) && multiDay(ev));
}

// Curated flagship majors (static list) → always seeded, future ones only. These
// carry the vendor keynotes the open datasets lack, with hand-written blurbs.
function curatedSeeds(today) {
  return TECH_EVENTS
    .map((ev) => ({ ...ev, tags: ev.tags || [], _curated: true }))
    .filter((ev) => (ev.end || ev.start) >= today);
}

/* ------------------------------------------------------------------- build */

/**
 * Pull every source, normalise, keep future majors, de-dupe by name+year, and
 * return them sorted soonest-first. `todayIso` is injected so the same build is
 * deterministic within a day (and testable).
 */
export async function buildRawEvents({ todayIso, timeout = 9000 } = {}) {
  const today = isoDate(todayIso) || new Date().toISOString().slice(0, 10);
  const startYear = Number(today.slice(0, 4));

  const jobs = [];
  jobs.push(
    fetchJson(DEVELOPERS_EVENTS, timeout)
      .then((arr) => (Array.isArray(arr) ? arr.map(fromDevelopersEvents) : []))
      .catch(() => []),
  );
  for (const topic of CONFS_TECH_TOPICS) {
    for (const year of [startYear, startYear + 1]) {
      const u = `https://raw.githubusercontent.com/tech-conferences/conference-data/main/conferences/${year}/${topic}.json`;
      jobs.push(
        fetchJson(u, timeout)
          .then((arr) => (Array.isArray(arr) ? arr.map(fromConfsTech) : []))
          .catch(() => []),
      );
    }
  }

  const settled = await Promise.allSettled(jobs);
  const raw = [];
  for (const s of settled) if (s.status === 'fulfilled') raw.push(...s.value);

  const seen = new Set();
  const majors = [];   // curated seeds + live vendor/flagship matches
  const topics = [];   // in-scope multi-day conferences (the long tail)

  // 1) Seed the hand-curated flagships first, so they always survive the cap.
  for (const ev of curatedSeeds(today)) {
    if (seen.has(ev.id)) continue;
    seen.add(ev.id);
    majors.push(ev);
  }

  // 2) Layer in the live datasets.
  for (const r of raw) {
    const ev = normalize(r);
    if (!ev) continue;
    if (ev.end < today) continue;                 // past — drop it
    if (staleYear(ev.name, startYear)) continue;  // mislabelled past-year entry
    if (!relevant(ev)) continue;                  // noise / out of scope
    if (seen.has(ev.id)) continue;                // de-dupe by name+year
    seen.add(ev.id);
    (isMajor(ev) ? majors : topics).push(ev);
  }

  // Majors are never dropped; topic events fill the remaining slots by date.
  const byDate = (a, b) => (a.start < b.start ? -1 : a.start > b.start ? 1 : 0);
  topics.sort(byDate);
  const kept = majors.concat(topics).slice(0, MAX_EVENTS);
  kept.sort(byDate);
  return kept;
}
