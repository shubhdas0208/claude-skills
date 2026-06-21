---
name: topic-master
description: Get an AI Product Manager from zero to conversant on a new topic, product line, or LOB in hours (sprint) or one workday (marathon). Scrapes real web data, runs parallel research across 8 PM-shaped dimensions (domain, regulatory, competitors, market, JTBD, metrics, AI angles, stakeholder prep), and persists everything to a file-backed workspace so nothing is lost between sessions. Use when the user invokes /topic-master or explicitly asks to research/master/prep a topic, product, or LOB. Defaults to Indian market context.
---

# Topic Master

Turn an AI PM into the most-prepared person in the room on a new topic — fast.

This skill exists because in real PM life, you don't get 10 days to study a new LOB. You get hours before a meeting, or one workday before stakeholders expect a take. The skill produces a workspace of structured briefs, competitor teardowns, regulatory notes, and stakeholder Q&A — pushed to you, not waiting to be asked for.

The user is shubhdas0208 (joining Dezerv as PM 2026-06, Indian wealthtech). Default to **Indian market** context unless told otherwise. Bake the PUMMR lens (Problem > User > Metric > MVP > Risk) into every brief.

## When to use

**Use when:**
- User invokes `/topic-master` (any form)
- User says "help me prep for [meeting/topic]", "I'm joining X, master this topic", "I have a meeting on Y in N hours"
- User asks to research/teardown a product, LOB, market, or competitor landscape

**Do NOT auto-activate** on unrelated work. This is a deliberate, user-triggered tool.

**Do NOT call `/deep-research`** — the user explicitly prefers single-orchestrator synthesis over deep-research-style fan-outs. Use parallel `Agent` subagents inside this skill instead.

## Workspace (file-backed, persistent)

One workspace per topic, on disk at:

```
C:\Users\SHUBH SANKALP DAS\Desktop\Building\topic-master\<topic-slug>\
```

Slug = lowercase topic name with spaces → hyphens (e.g., `loan-against-security`).

### Fixed folder schema (do not invent new top-level folders)

```
<topic-slug>/
├── README.md                  # Dashboard: mode used, dimensions covered, open Qs, last touched
├── glossary.md                # Every term encountered, defined
├── open-questions.md          # Flagged "come back to this" items
├── study-log.md               # Dated session entries
├── sources.md                 # Every URL/source consumed, with one-line note + date
├── _CONSOLIDATED.md           # Single-file view: every subfolder file concatenated verbatim, TOC at top, regenerated each run (see Step 6b)
├── domain/                    # What it is, how it works, mechanics
├── regulatory-india/          # RBI, SEBI, tax, legal
├── market-india/              # Sizing, segments, trends
├── customer-jtbd/             # Pain points, jobs-to-be-done, personas
├── competitors/               # One card per competitor + comparison matrix + trial checklist
├── metric-tree/               # What a PM would measure / optimize
├── ai-angles/                 # Where AI/ML helps build or optimize
├── stakeholder-prep/          # Likely Qs + your answers, counter-arguments
└── briefs/                    # Polished outputs (exec brief, mini-PRD)
```

Files inside subfolders are free-form — create whatever fits.

## Invocation flow

### Step 1 — Workspace check

Check if `Desktop\Building\topic-master\<slug>\` exists.

- **Exists:** Read `README.md`. Report to user: "Resuming `<topic>`. Last touched: <date>. Covered: <dimensions>. Open questions: <count>." Ask: continue, or fresh teardown?
- **Doesn't exist:** Scaffold the folder schema above. Create empty `README.md`, `glossary.md`, `open-questions.md`, `study-log.md`, `sources.md`.

### Step 2 — Mode resolution (hybrid)

Scan the user's invocation for time signals:

- "in N hours", "meeting in", "before <today/tomorrow>", "tonight" → propose **SPRINT**, ask one-line confirm
- "joining in N days", "ramp up", "master this", "workday", no time signal → propose **MARATHON**, ask one-line confirm
- Genuinely ambiguous → ask: Sprint (hours, meeting-focused) or Marathon (~1 workday, full coverage)?

**Sprint** = 1-4 hours, focused on impending meeting.
**Marathon** = ~1 workday (6-8 hours), full coverage, ends with mini-PRD-grade deliverable.

### Step 3 — Dimension selection

Show the 8 dimensions with mode defaults pre-selected. User confirms or edits.

```
1. Domain mastery          (what / how / mechanics)
2. Regulatory + legal (IN) (RBI, SEBI, tax)
3. Competitors + products  (teardowns + trial checklist)
4. Market data + sizing    (TAM/SAM, segments, trends)
5. Customer pain / JTBD    (who hurts, what jobs)
6. Metric tree             (what to measure as PM)
7. AI / ML build angles    (where AI helps build/optimize)
8. Stakeholder prep        (likely Qs + counter-args)
```

**Sprint defaults:** 1 (light) + 2 (light) + 3 + 8. Add others only if user names them.
**Marathon defaults:** all 8.

User can override by typing comma-separated indices: "1,3,4,8".

### Step 4 — Sprint-only context capture

If SPRINT, ask 2 questions in one message:

1. **Who's in the meeting + what's the agenda?** (Drives stakeholder Q&A targeting.)
2. **What's your current knowledge level on this topic?** (None / surface / working / deep — drives depth.)

Skip these for MARATHON — assume zero baseline, full coverage.

### Step 5 — GO: announce plan, dispatch parallel research

Announce in one short message:

> "Launching <N> research agents in parallel: <dimensions>. I'll stream files into `<workspace>` as they finish. You can read the first ones while others are running."

Then dispatch **parallel `Agent` subagents** — one per selected dimension — in a **single message with multiple tool calls** for true concurrency.

Each subagent gets:
- Topic + Indian-market context
- Its dimension's research brief (see "Per-dimension research briefs" below)
- A source budget (see "Source discipline")
- Instructions to return structured markdown ready to write to the workspace
- Instructions to flag open questions and log sources

Use the `general-purpose` subagent type unless a more specific one fits.

Use `WebSearch` and `WebFetch` inside the agents. For Indian regulatory specifically, prefer `site:rbi.org.in` and `site:sebi.gov.in` queries.

### Step 6 — Write outputs, then synthesize

After all agents return:

1. **Write each agent's output** to the right workspace file. Append, don't overwrite, if file exists.
2. **Update `glossary.md`** with new terms (deduplicated).
3. **Update `sources.md`** with all sources used (URL + one-line note + dimension + date).
4. **Append `study-log.md`** with today's session: date, mode, dimensions covered.
5. **Update `open-questions.md`** with anything agents flagged as unknown.
6. **Update `README.md`** dashboard.

Then generate the **mandatory deliverable(s)**:

- **Sprint deliverables (both required):**
  - `briefs/<YYYY-MM-DD>-exec-brief.md` — 1-page brief ending with PUMMR block
  - `stakeholder-prep/<YYYY-MM-DD>-meeting-prep.md` — likely Qs from named audience + your answers + 3 hot takes you can defend
- **Marathon deliverables (all three required):**
  - `briefs/<YYYY-MM-DD>-exec-brief.md` — 1-page brief ending with PUMMR
  - `stakeholder-prep/<YYYY-MM-DD>-stakeholder-qa.md` — broad Q&A across roles
  - `briefs/<YYYY-MM-DD>-mini-prd.md` — strategy doc / mini-PRD for the LOB, ending with PUMMR

### Step 6b — Build the consolidated single-file view (MANDATORY, every session)

After all per-folder files are written and the deliverables above exist, always (re)build a single root-level file at the workspace root:

```
<topic-slug>/_CONSOLIDATED.md
```

This file is the **single-source consolidated view of the entire workspace**. The user uses individual folders to jump back to a specific part later, but uses `_CONSOLIDATED.md` to read the whole topic in one pass (mobile, print, sharing, before-meeting cram).

**Hard rules:**

1. **Word-for-word inclusion.** Every `.md` file from every subfolder must be embedded verbatim. Do NOT summarise, paraphrase, or rewrite. Just `cat` the file contents under a section heading. The folder file remains the source of truth — `_CONSOLIDATED.md` is a derived view, regenerated on every `/topic-master` run on this topic.
2. **Index at the top.** First content section of the file is a Table of Contents that lists every part + every section number + the source file path. Group by Part:
   - **Part 1 — Workspace meta:** README, glossary, open-questions, study-log, sources
   - **Part 2 — Sprint/Marathon deliverables:** exec brief, meeting prep / stakeholder Q&A, mini-PRD (marathon only)
   - **Part 3 — Competitors:** comparison matrix, app trial checklist, then every per-competitor file
   - **Part 4 — Domain mastery:** every file in `domain/`
   - **Part 5 — Regulatory + legal (India):** every file in `regulatory-india/`
   - **Part 6 — Market — India:** every file in `market-india/`
   - **Part 7 — Customer pain / JTBD** (if covered)
   - **Part 8 — Metric tree** (if covered)
   - **Part 9 — AI / ML build angles** (if covered)
   - **Part 10 — Stakeholder prep** (if not already in Part 2)
3. **Section dividers.** Use `---` between sections and a clear `## N. <Section title>` heading with a `> **Source file:** <relative path>` line so the reader can jump back.
4. **Read order.** Deliverables (Part 2) come **before** raw research (Parts 3+) so a cold reader hits the spine of the POV first, then drops into the supporting evidence.
5. **Header block.** Top of file mirrors `README.md` metadata: topic name, created date, mode used, last consolidated date.
6. **Regenerate, don't append.** On a resumed session this file is fully rewritten — never appended to.

**Implementation hint (sh):** loop through a known file list with a separator + heading + `cat`. Do NOT try to summarise with an LLM call — this must be a deterministic concatenation so a future read is faithful to the source files.

After writing `_CONSOLIDATED.md`, mention its path in the closing message as "single-file read of the whole topic" so the user knows it exists alongside the folder structure.

### Step 7 — Surface what's next

Single closing message to the user:

- What was just written (file paths as clickable links)
- Top 3 things to read first, in order
- Top 3 open questions still standing
- For sprint with competitors: point at `competitors/_app-trials.md` (B2 consolidated trial checklist)
- For marathon with competitors: point at per-competitor checklists (B1)

## Per-dimension research briefs

Each subagent is briefed tightly. Copy-adapt these templates when dispatching.

### Domain mastery
Cover: what it is in plain English, mechanics end-to-end (e.g., for LAS: pledge → valuation → LTV → disbursement → monitoring → margin call → liquidation), risk model, key numbers/ratios, common terms. Source budget: 5-7 reputable explainers + 1 textbook-grade source. Output structure: `domain/01-what-is-it.md`, `domain/02-how-it-works.md`, `domain/03-risk-mechanics.md`.

### Regulatory + legal (India)
Cover: which regulator owns it, key circulars/rules currently in force (cite circular numbers + dates), licensing requirements, prudential norms, consumer protection, taxation. Source budget: RBI/SEBI official + 2 reputable Indian legal/fintech blogs. Output: `regulatory-india/rbi.md`, `regulatory-india/sebi.md` (if applicable), `regulatory-india/tax.md`, `regulatory-india/licensing.md`.

### Competitors + products
Identify top 4-7 Indian players. For each: company, product name, target segment, pricing/rates, distinguishing features, UX notes from public material (marketing site, Play Store description + top 20 reviews, YouTube walkthroughs if transcripts available), known gaps from review complaints. Source budget per competitor: 4-6 sources.

**Per-competitor file:** `competitors/<name>.md`.
**Always create:** `competitors/_comparison-matrix.md` — table across all competitors on the same axes.

**Trial checklist (Option B):**
- **Sprint mode** → write `competitors/_app-trials.md` — one consolidated checklist with the 10-15 things to look for across ALL competitor apps in one phone session.
- **Marathon mode** → write `competitors/<name>-trial-checklist.md` per competitor — 8-12 things to check in each app individually.

Each checklist item is concrete: "Screenshot the LTV slider range", "Note disbursement TAT shown on quote screen", "Check if partial liquidation is offered", not vague.

### Market data + sizing
Cover: TAM/SAM for India, growth rate, customer segments + their share, recent trends, macro tailwinds/headwinds. Cite numbers with sources and dates. Flag any number older than 24 months as "verify before quoting." Output: `market-india/sizing.md`, `market-india/segments.md`, `market-india/trends.md`.

### Customer pain / JTBD
Cover: who the actual customer is (not "users"), the job they're hiring this product for, current alternatives they use, friction points, willingness-to-pay signals. Pull from reviews, forum posts, Quora, Reddit India. Output: `customer-jtbd/personas.md`, `customer-jtbd/pain-points.md`, `customer-jtbd/jobs.md`.

### Metric tree
Cover: what a PM would actually measure for this LOB. Top-line metric → driver tree → leading indicators → guardrails. Be opinionated. Output: `metric-tree/tree.md` (use indented markdown bullets or an ASCII tree), plus `metric-tree/rationale.md` explaining why those metrics.

### AI / ML build angles
Cover: where AI/ML genuinely helps in this LOB — underwriting, fraud, monitoring, collections, personalization, support. For each angle: the problem, the model class (classification, ranking, LLM, etc.), data needed, build vs buy vs integrate, latency/cost/accuracy tradeoffs. Output: `ai-angles/opportunities.md` + `ai-angles/build-vs-buy.md`.

### Stakeholder prep
Generate likely questions from each stakeholder type the user will face. Default stakeholder types if user didn't name them: senior PM, eng lead, design lead, business/BD, leadership, compliance/legal. For each: 4-6 questions they'd actually ask, plus your model answer (1-3 sentences), plus the strongest counter-argument and how to respond. End with 3 hot takes the user can defend in the meeting. Output: `stakeholder-prep/<YYYY-MM-DD>-meeting-prep.md` (sprint) or `stakeholder-prep/<YYYY-MM-DD>-stakeholder-qa.md` (marathon).

## Source discipline

- Each dimension agent gets a **fixed source budget** (see per-dimension briefs above). No "let me read 40 things" sprawl.
- **Every source used → logged in `sources.md`** with: URL, one-line summary of what it taught, the dimension it informed, today's date.
- Prefer official + reputable: regulator sites, large fintech publications, company official material. Avoid SEO-bait blogs unless they're the only source for something specific.
- For numbers: cite source + date inline in the brief. Numbers older than 24 months → tag "verify before quoting."

## The PUMMR block (mandatory in every brief)

Every `briefs/*.md` file ends with this exact block, filled in:

```
## PM lens (PUMMR)

- **Problem:** <who suffers, what evidence, what breaks today>
- **User:** <specific persona, never "users">
- **Metric:** <outcome-tied metric this LOB would move>
- **MVP:** <smallest thing that proves the riskiest assumption>
- **Risk:** <what kills this if it goes wrong>
```

This is the difference between this skill and a generic research dump.

## Sub-commands (within-session orchestration)

When the user invokes any of these AFTER a workspace exists, branch behavior:

- `/topic-master next` — Read the workspace, recommend the single next-best thing to tackle now based on what's covered and what's open. Don't auto-execute; propose.
- `/topic-master status` — Read `README.md` + `open-questions.md` + `study-log.md`. Print: dimensions covered, open Qs count, top 5 open Qs, last session date.
- `/topic-master quiz` — Generate 8-12 mixed-difficulty questions from `glossary.md` + `domain/` + `regulatory-india/`. Ask one at a time. After each answer, evaluate and reveal correct answer. Track wrong answers → append to `open-questions.md` as "weak spots."
- `/topic-master brief [audience]` — Generate a fresh brief from the current workspace state for the named audience (defaults to "senior PM"). Drop into `briefs/<date>-<audience>-brief.md`. Always ends with PUMMR.

## What to skip / not do

- **Do NOT** call `/deep-research` or recommend it. We are deliberately not that.
- **Do NOT** invent new top-level folders. Stick to the schema.
- **Do NOT** ask 10 clarifying questions. Sprint asks 2-3 max; Marathon asks 1 (mode confirm).
- **Do NOT** dump everything in one giant file. One file per concrete sub-topic, even if short.
- **Do NOT** trust the model's training data for numbers — scrape with WebSearch + WebFetch and cite.
- **Do NOT** auto-format the user's `glossary.md` or other persistent files into a different style than what's already there.

## First-run example (Loan Against Security, sprint)

```
User: /topic-master "Loan Against Security, meeting in 3h with senior PMs at Dezerv"

Skill:
  1. Scaffolds Desktop\Building\topic-master\loan-against-security\
  2. Detects "in 3h" → proposes SPRINT, confirms.
  3. Shows 8 dimensions, sprint defaults pre-selected (1, 2, 3, 8).
  4. Asks: agenda + your current level?
  5. User: "discuss whether we should launch LAS as a Dezerv LOB; I know surface level"
  6. Dispatches 4 parallel research agents.
  7. Streams files in: domain/, regulatory-india/, competitors/, _comparison-matrix.md, _app-trials.md, stakeholder-prep/2026-06-21-meeting-prep.md, briefs/2026-06-21-exec-brief.md
  8. Closes with: "Read in this order: brief → meeting-prep → _comparison-matrix. Open questions: 5. Trial checklist ready at competitors/_app-trials.md if you have 15 min before the meeting."
```

## Persistence across sessions

A topic workspace persists forever. Re-invoking on the same topic resumes — never re-scrapes what's already there unless the user asks for a refresh. If the user wants to redo a dimension fresh, they ask explicitly: "refresh competitors" or "redo regulatory."
