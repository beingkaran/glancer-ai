---
name: natural
description: Write prose that reads as human-authored rather than machine-generated. Use when drafting or rewriting blog posts, articles, essays, emails, docs, or marketing copy, or when the user asks for writing that is "natural", "human", "not AI-sounding", or that should not trip AI detectors.
---

# natural

Write like a person wrote it. This skill is built around what AI-detection research
actually looks for, so the fastest way to sound human is to stop producing the
signals detectors were trained on.

## What detectors look for

Source: Wikipedia, "Artificial intelligence content detection", plus the studies it cites.

Signals used to flag text as AI-written:

1. **Repetition of words and phrases** — the same nouns, verbs, and framings recycled
   across paragraphs.
2. **Unusually consistent grammar** — near-zero typos, no fragments, uniform correctness
   across a long piece. Real writing wobbles.
3. **Formulaic transitions** — "Moreover", "Furthermore", "Additionally", "In conclusion",
   "It's worth noting that", "That said" used at predictable intervals.
4. **Repeated discourse markers** — the same connective tissue opening paragraph after
   paragraph.
5. **Recurring rhetorical templates** — "It's not just X, it's Y", "The truth is",
   rule-of-three lists everywhere, every section closing on a tidy summary sentence.
6. **Uniform sentence length and rhythm** — low burstiness. Humans mix a 4-word sentence
   with a 40-word one.
7. **Stylistic and structural regularity in general** — every section the same length,
   every paragraph 3–4 sentences, headers all parallel.
8. **Hallucination-style filler** — confident generic claims with no specific referent.
9. **Watermarking** — token-distribution watermarks (Kirchenbauer et al., 2023). Not
   something to game; just know statistical fingerprints exist beyond style.

Context worth carrying (it explains why these tools are unreliable, and why the goal here
is *good human prose*, not detector-gaming):

- Weber-Wulff et al. (2023) tested 14 tools incl. Turnitin and GPTZero: all scored under
  80% accuracy, only 5 over 70%.
- Tools skew toward calling text human, and get worse after paraphrasing.
- False positives hit non-native English writers hardest — 61.3% average FPR in Liang et
  al. (2023) — plus neurodivergent writers, and Black students (20% vs 7% for White
  students, Common Sense Media 2024).
- Turnitin claims <1% false positives; Washington Post testing found up to 50%.
  Turnitin's own false-negative rate is 15%.
- Cambridge, other Russell Group universities, and UT Austin opted out of Turnitin's AI
  detection over reliability concerns.
- Paraphrasing alone drops detection sharply: Originality.AI caught GPT-4 text at 91.3%
  accuracy, which fell to 27.8% after adversarial rewriting (Taloni et al., 2023).

The practical takeaway: detectors key on *surface pattern*, so writing with genuine
variation and specificity is the whole technique.

## Hard rules

**No em dashes. Ever.** No `—`, no `--` standing in for one. Use a comma, a period, a
colon, parentheses, or restructure the sentence. This is the single most-cited tell.

**Vary sentence length aggressively.** Follow a long, clause-heavy sentence with a short
one. Four words is fine. Sometimes shorter.

**Vary paragraph length.** One-sentence paragraphs are allowed and good. Not every
paragraph gets three sentences.

**Kill the transition vocabulary.** Ban list: Moreover, Furthermore, Additionally,
In conclusion, It's worth noting, That said, Importantly, Notably, Ultimately,
In today's world, In the ever-evolving landscape. Prefer "But", "So", "And", "Still",
"Here's the thing", or no transition at all. Starting a sentence with a conjunction is
human.

**Kill the templates.** No "It's not just X, it's Y". No "The truth is". No closing
summary sentence on every section. No rule-of-three unless three things genuinely exist.

**Be specific.** Concrete numbers, names, dates, and examples instead of hedged
generalities. Specificity is the hardest thing for generated text to fake and the
easiest way to sound like someone who was actually there.

**Let voice through.** A mild opinion, an aside, a small digression, an admission of
uncertainty ("I'm not sure this holds at scale"). Contractions throughout.

**Uneven structure.** Sections should differ in length. Some get bullets, some don't.
Don't make headers grammatically parallel.

## The 2% imperfection rule

Around **2% of transition points** should carry a small, natural grammatical slip, the
kind a fluent person makes typing quickly and not proofreading hard. Roughly one per
1500–2000 words. Never more than 2%.

What counts (pick sparingly, vary the type):

- subject/verb agreement wobble in a long sentence: "the set of results *are* clearer now"
- comma splice: "It works fine, the problem is throughput."
- a missing comma before a coordinating conjunction
- "which" where "that" is correct
- a slightly dangling modifier
- a sentence fragment used for emphasis
- "less" where "fewer" belongs

What does **not** count and must never appear: misspelled words, factual errors, broken
code, wrong numbers, wrong names, mangled technical terms, or anything that changes
meaning. The slip is grammatical texture only. Never introduce an error into code blocks,
commands, config, data, or quoted material.

If the piece is short (under ~500 words), 2% usually rounds to zero. Ship it clean.

## Where this does not apply

Code, commit messages, API docs, config files, legal or compliance text, and anything the
user says must be formally correct. Keep those clean and conventional.

## Self-check before returning

- [ ] Zero em dashes
- [ ] No banned transition words
- [ ] Sentence lengths visibly uneven, including at least one very short sentence
- [ ] Paragraph lengths uneven
- [ ] No repeated opening word or phrase across paragraphs
- [ ] At least one specific number, name, or concrete example per section
- [ ] Roughly one deliberate grammatical slip per 1500–2000 words, no misspellings
- [ ] Nothing reads like a template
