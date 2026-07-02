#!/usr/bin/env node
/*
 * generate-events-ics.mjs — build the subscribable calendar feed served at
 * /events.ics from the single TECH_EVENTS source of truth. Runs before
 * `vite build` so the fresh feed lands in public/ and is copied into dist/.
 *
 * The Events page exposes this file via webcal:// so a subscriber's calendar
 * app auto-refreshes and picks up new events without any action on their part.
 */
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(__dirname, '../public/events.ics');

const { TECH_EVENTS } = await import('../src/data/techEvents.js');
const { calendarText } = await import('../src/lib/calendarLinks.js');

const ics = calendarText(TECH_EVENTS, 'Glancer AI — Major Tech Events');
writeFileSync(OUT, ics, 'utf8');

console.log(`✓ events.ics written with ${TECH_EVENTS.length} events → ${OUT}`);
