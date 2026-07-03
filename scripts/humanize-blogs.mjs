#!/usr/bin/env node
/*
 * humanize-blogs.mjs — unify author metadata, replace em dashes, soften AI tone,
 * add light grammatical imperfection (~2–3%) across curated blog bodies.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const FILE = resolve(dirname(fileURLToPath(import.meta.url)), '../src/data/allBlogs.js');

const AUTHOR_BLOCK = `author: 'Karan Shah',
    authorRole: 'Service Delivery Director AIOPS/DATA/AI',
    authorBio: 'Karan Shah is an engineer and the founder of Glancer AI. He got tired of vendor blogs explaining observability badly and built this site as a free, independent resource for engineers, SREs, and learners who want current, plainly written information without the noise.',
    authorImage: 'https://glancerai.com/karan.webp',
    authorLinkedIn: 'https://www.linkedin.com/in/beingkaran/',
    avatar: 'KS',`;

const PHRASE_MAP = [
  [/Key takeaways/g, 'What to remember'],
  [/The takeaway/g, 'Bottom line'],
  [/The reframe:/g, 'Worth reframing:'],
  [/Here's the uncomfortable part/g, "Here's the part that stings"],
  [/It is worth noting that/gi, 'Worth saying:'],
  [/It is important to note/gi, 'Quick note:'],
  [/In today's/gi, 'These days,'],
  [/Furthermore,/g, 'Also,'],
  [/Additionally,/g, 'Plus,'],
  [/\butilize\b/gi, 'use'],
  [/\bleverage\b/gi, 'use'],
  [/\brobust\b/gi, 'solid'],
  [/\bcomprehensive\b/gi, 'full'],
  [/\blandscape\b/gi, 'space'],
  [/\bdelve into\b/gi, 'dig into'],
  [/\bnavigate\b/gi, 'work through'],
  [/game-changer/gi, 'big shift'],
  [/cutting-edge/gi, 'latest'],
  [/\bin order to\b/gi, 'to'],
  [/a holistic/gi, 'a full'],
  [/This is where the incident stops being a news story and becomes a checklist/g, 'At this point it stops being news and turns into a checklist'],
  [/practitioner-grade/gi, 'practical'],
  [/The shape of the incident is simple/g, 'Strip the drama and the incident is pretty simple'],
  [/You did not get/g, "You didn't get"],
  [/\bdid not return\b/g, "didn't return"],
  [/\bdo not\b/g, "don't"],
  [/\bdoes not\b/g, "doesn't"],
  [/\bis not\b/g, "isn't"],
  [/\bare not\b/g, "aren't"],
  [/\bwill not\b/g, "won't"],
  [/\bcannot\b/g, "can't"],
  [/\bit is\b/g, "it's"],
  [/\bthat is\b/g, "that's"],
  [/\bthere is\b/g, "there's"],
  [/\byou will\b/g, "you'll"],
  [/\bwe are\b/g, "we're"],
  [/I think that read is fair/g, 'I think that read holds up'],
];

const HUMAN_SLIPS = [
  ['a honest', 'an honest'],
  ['its a', "it's a"],
  ['alot of', 'a lot of'],
  ['wich ', 'which '],
  ['teh ', 'the '],
  ['seperate ', 'separate '],
  ['occured', 'occurred'],
  ['recieve', 'receive'],
  ['definately', 'definitely'],
  ['loosing ', 'losing '],
  ['affect the latency', 'effect the latency'],
  ['than you expect', 'then you expect'],
  ['your going to', "you're going to"],
  ['could of', 'could have'],
  ['should of', 'should have'],
];

function humanizeBody(body, slipOffset) {
  let b = body.replace(/—/g, ' - ').replace(/–/g, ' - ').replace(/  -  /g, ' - ');
  for (const [re, rep] of PHRASE_MAP) b = b.replace(re, rep);
  let applied = 0;
  let idx = slipOffset;
  while (applied < 2 && idx < slipOffset + HUMAN_SLIPS.length) {
    const [wrong, right] = HUMAN_SLIPS[idx % HUMAN_SLIPS.length];
    idx += 1;
    if (b.includes(right) && !b.includes(wrong)) {
      b = b.replace(right, wrong);
      applied += 1;
    }
  }
  return b;
}

let src = readFileSync(FILE, 'utf8');

src = src.replace(/—/g, ' - ').replace(/–/g, ' - ').replace(/  -  /g, ' - ');
src = src.replace(/author: 'Admin',\s*avatar: '📡',/g, AUTHOR_BLOCK);
src = src.replace(/author: 'Karan Shah',\s*avatar: '✍️',/g, AUTHOR_BLOCK);
src = src.replace(/(title|subtitle): '([^']*)'/g, (_, key, val) => `${key}: '${val.replace(/—/g, ' - ').replace(/–/g, ' - ')}'`);

let slipOffset = 0;
src = src.replace(/body: `\n([\s\S]*?)\n    `/g, (full, body) => {
  const next = humanizeBody(body, slipOffset);
  slipOffset += 2;
  return 'body: `\n' + next + '\n    `';
});

writeFileSync(FILE, src, 'utf8');
console.log('✓ humanized allBlogs.js (dashes, author bios, tone, light slips)');