/*
 * calendarLinks — turn a tech-event record into add-to-calendar links and an
 * .ics file the browser can download. All events are treated as all-day (date,
 * not time) since conference schedules span whole days across time zones.
 *
 * The subscribable feed (webcal) points at /events.ics, which is generated at
 * build time by scripts/generate-events-ics.mjs from the same TECH_EVENTS data,
 * so a subscriber's calendar auto-updates whenever we add or change an event.
 */

export const SITE_ORIGIN = 'https://glancerai.com';
export const FEED_PATH = '/events.ics';
export const FEED_URL = `${SITE_ORIGIN}${FEED_PATH}`;
// webcal:// makes desktop calendar apps offer to *subscribe* (auto-refresh)
// rather than one-time import.
export const WEBCAL_URL = `webcal://glancerai.com${FEED_PATH}`;

// 'YYYY-MM-DD' -> 'YYYYMMDD'
function compact(dateStr) {
  return String(dateStr).replace(/-/g, '');
}

// Day after the given date, as 'YYYYMMDD'. ICS/Google all-day DTEND is
// *exclusive*, so a single-day event on the 9th ends on the 10th.
function nextDay(dateStr) {
  const d = new Date(`${dateStr}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + 1);
  return d.toISOString().slice(0, 10).replace(/-/g, '');
}

function endExclusive(ev) {
  return nextDay(ev.end || ev.start);
}

export function locationText(ev) {
  return [ev.venue, ev.city, ev.country].filter(Boolean).join(', ');
}

function detailText(ev) {
  const parts = [ev.blurb, ev.organizer ? `Hosted by ${ev.organizer}.` : '', ev.url].filter(Boolean);
  return parts.join('\n\n');
}

/* ------------------------------------------------------------------ links */

// Google Calendar "create event" template (all-day: dates=start/endExclusive).
export function googleCalUrl(ev) {
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: ev.name,
    dates: `${compact(ev.start)}/${endExclusive(ev)}`,
    details: detailText(ev),
    location: locationText(ev),
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

// Outlook.com deep-link compose (all-day event).
export function outlookUrl(ev) {
  const params = new URLSearchParams({
    path: '/calendar/action/compose',
    rru: 'addevent',
    allday: 'true',
    subject: ev.name,
    startdt: ev.start,
    enddt: ev.end || ev.start,
    body: detailText(ev),
    location: locationText(ev),
  });
  return `https://outlook.live.com/calendar/0/deeplink/compose?${params.toString()}`;
}

// Subscribe the whole feed into a Google account (auto-updating).
export function googleSubscribeUrl() {
  return `https://calendar.google.com/calendar/r?cid=${encodeURIComponent(WEBCAL_URL)}`;
}

/* -------------------------------------------------------------------- ics */

function icsEscape(text = '') {
  return String(text)
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\r?\n/g, '\\n');
}

// A single VEVENT block (all-day). `stamp` is a compact UTC timestamp string.
export function vevent(ev, stamp) {
  return [
    'BEGIN:VEVENT',
    `UID:${ev.id}@glancerai.com`,
    `DTSTAMP:${stamp}`,
    `DTSTART;VALUE=DATE:${compact(ev.start)}`,
    `DTEND;VALUE=DATE:${endExclusive(ev)}`,
    `SUMMARY:${icsEscape(ev.name)}`,
    `DESCRIPTION:${icsEscape(detailText(ev))}`,
    `LOCATION:${icsEscape(locationText(ev))}`,
    `URL:${icsEscape(ev.url)}`,
    'END:VEVENT',
  ].join('\r\n');
}

function nowStamp() {
  // Browser context — Date is available here (this file is never run inside the
  // Workflow sandbox). Format: YYYYMMDDTHHMMSSZ.
  return new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
}

export function calendarText(events, name = 'Glancer AI — Tech Events') {
  const stamp = nowStamp();
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Glancer AI//Tech Events//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    `X-WR-CALNAME:${icsEscape(name)}`,
    'X-WR-TIMEZONE:UTC',
    'REFRESH-INTERVAL;VALUE=DURATION:PT12H',
    'X-PUBLISHED-TTL:PT12H',
    ...events.map((ev) => vevent(ev, stamp)),
    'END:VCALENDAR',
  ];
  return lines.join('\r\n');
}

// Single-event .ics text (for the per-event "Download" option).
export function eventIcsText(ev) {
  return calendarText([ev], ev.name);
}

// Trigger a client-side download of ics text.
export function downloadIcs(filename, text) {
  const blob = new Blob([text], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename.endsWith('.ics') ? filename : `${filename}.ics`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
