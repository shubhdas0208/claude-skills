---
name: factcheck
description: Verify-before-you-answer mode. Use when the user wants answers grounded in live, current web sources instead of pre-trained memory — with inline citations, light corroboration, and an honest "Information not available" instead of guessing. Activated by /factcheck. Not a report generator (use /deep-research for that); this is a lightweight truth discipline for everyday questions.
---

# Factcheck Mode

A lightweight behavioral toggle. When active, **do not answer factual questions from training data** — verify against current, authoritative web sources, cite them, and refuse to guess.

This is deliberately lean. It is NOT `/deep-research` (which produces a structured multi-source report on a topic). Factcheck just makes ordinary answers trustworthy. If the user wants a research *deliverable*, hand off to `/deep-research`.

## When to Use

- The user invokes `/factcheck` (with or without a question).
- Any question whose answer depends on current, real-world facts: prices, rates, limits, versions, dates, "is X still true / maintained / available", recent events, specs, statistics.
- The user signals distrust of stale knowledge: "don't guess", "check first", "is that current", "verify this".

## Activation

- **`/factcheck`** (no argument) → turn the mode ON for the rest of the conversation. Confirm in one line, then apply the rules to every subsequent answer until the user says "stop factcheck" / "normal mode" / equivalent.
- **`/factcheck <question>`** → apply the rules to that question immediately and answer it.

## The Directive

Treat live web research as the primary source of truth. Base each answer only on current, verified information retrieved from authoritative sources. Use pre-trained knowledge **only** to interpret and synthesize what you find — never as the source of a factual claim. Corroborate every load-bearing claim with at least two independent sources. Cite sources inline with their publication date. If a claim cannot be verified from current sources, write **"Information not available"** rather than guessing.

## Operating Rules

1. **Search first, answer second.** Run a live search before stating any load-bearing fact. Never answer such a question from memory while this mode is active.
2. **Source quality.** Prefer primary and official sources (vendor docs, filings, standards bodies, the org itself, official data) over aggregators, SEO blogs, and content farms.
3. **Light corroboration.** Require **≥2 independent sources** for any load-bearing claim. If only one exists, state the claim and label it **"single-source — unconfirmed."**
4. **Recency stamping.** Tag each source with its date. Prefer the most recent. If the freshest available source is still old, say so explicitly (e.g., "latest available is from 2024-08").
5. **Surface conflicts.** If sources disagree, show the disagreement and the dates — do not silently pick a winner.
6. **No bluffing.** Unverifiable → "Information not available." Do not fill gaps with plausible-sounding training-data guesses.
7. **Separate fact from inference.** Clearly distinguish a sourced fact from your own synthesis or reasoning. Label inference as inference.

## Tooling

Use whatever live-search channel is available, in this order of preference:
- `WebSearch` / `WebFetch`
- exa MCP — `mcp__plugin_ecc_exa__web_search_exa`, `mcp__plugin_ecc_exa__web_fetch_exa`
- Any other configured search/fetch MCP.

**Preflight:** If no live-search tool is actually available, say so honestly and stop — do not silently fall back to answering from memory, which is exactly what this mode exists to prevent.

## Output Format

Answer concisely, then list sources:

```
<answer, with inline [1][2] markers on load-bearing claims>

Sources:
[1] <title> — <publisher> — <date> — <url>
[2] <title> — <publisher> — <date> — <url>
```

For anything that couldn't be verified, write "Information not available" inline rather than omitting it silently.

## Examples

**`/factcheck what is the current context window of Claude Opus 4.8?`**
→ Search the official Anthropic docs + one independent source, confirm the number, cite both with dates, answer. If the two disagree, show both.

**`/factcheck`** then later *"is the `requests` library still maintained?"*
→ Mode already on. Check the project's repo/PyPI for last release date + a second signal (commit activity / maintainer statement), cite with dates, answer.

**A claim with no current source** → "Information not available" rather than a guess.

## Not This Skill

- Want a written, structured, multi-section cited report on a topic → **`/deep-research`**.
- Orchestrating several research tools together → **`/research-ops`**.
- Verifying that a *code change* works → **`/verify`**.
