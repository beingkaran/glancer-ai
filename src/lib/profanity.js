/*
 * profanity.js — a lightweight, dependency-free profanity filter for comments.
 *
 * Goal: block clearly abusive words while avoiding the "Scunthorpe problem"
 * (false positives like "class", "assassin", "Cockburn"). To do that we match
 * whole WORDS only — each token is normalized for common leetspeak/character
 * substitutions and compared for an exact match against the blocklist, rather
 * than doing naive substring matching.
 *
 * This runs on the client for instant feedback. It is a UX guard, not a
 * security control — never rely on it alone for anything that matters.
 */

// Base blocklist (lowercase, no leetspeak — normalization handles variants).
const BLOCKLIST = [
  'fuck', 'fucker', 'fucking', 'motherfucker', 'fuckface',
  'shit', 'bullshit', 'shithead', 'dipshit',
  'bitch', 'bitches', 'asshole', 'arsehole', 'ass', 'arse', 'jackass',
  'bastard', 'dick', 'dickhead', 'prick', 'cock', 'cocksucker',
  'pussy', 'cunt', 'twat', 'wanker', 'slut', 'whore', 'hoe',
  'damn', 'goddamn', 'crap',
  'nigger', 'nigga', 'faggot', 'fag', 'retard', 'retarded',
  'spic', 'chink', 'kike', 'coon',
  'rape', 'rapist', 'molest',
  'douche', 'douchebag', 'jerkoff', 'jackoff', 'bollocks', 'bugger',
];

const BLOCKSET = new Set(BLOCKLIST);

// Common leetspeak / obfuscation → letter.
const LEET = { '0': 'o', '1': 'i', '!': 'i', '3': 'e', '4': 'a', '@': 'a', '5': 's', '$': 's', '7': 't', '8': 'b', '9': 'g' };

/* Normalize a single token: lowercase, map leetspeak, drop non-letters, and
 * collapse 3+ repeated letters ("fuuuck" → "fuck", "shiiit" → "shit"). */
function normalizeToken(token) {
  let out = '';
  for (const ch of token.toLowerCase()) {
    const mapped = LEET[ch] ?? ch;
    if (mapped >= 'a' && mapped <= 'z') out += mapped;
  }
  return out.replace(/([a-z])\1{2,}/g, '$1$1'); // 3+ repeats → 2
}

/* Returns the list of blocked words found in the text (empty if clean). */
export function findProfanity(text) {
  if (!text) return [];
  const found = new Set();
  for (const raw of String(text).split(/[^A-Za-z0-9@!$]+/)) {
    if (!raw) continue;
    const norm = normalizeToken(raw);
    if (!norm) continue;
    // exact match, plus the de-doubled form ("fuuck"→"fuck" already handled;
    // also collapse ALL repeats to catch "fuuuuck"→"fuck").
    const collapsed = norm.replace(/([a-z])\1+/g, '$1');
    if (BLOCKSET.has(norm) || BLOCKSET.has(collapsed)) found.add(collapsed);
  }
  return [...found];
}

/* Convenience boolean. */
export function containsProfanity(text) {
  return findProfanity(text).length > 0;
}
