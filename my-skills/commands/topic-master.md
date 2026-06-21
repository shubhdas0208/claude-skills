---
description: Get an AI PM from zero to conversant on a new topic, LOB, or product in hours (sprint) or one workday (marathon). Scrapes real data, runs parallel research across 8 PM dimensions, persists everything to a workspace. Activates the topic-master skill.
---

# Topic Master Command

A thin shim. All behavior lives in the `topic-master` skill (the single source of truth), so the command and the skill can never drift apart.

## What to do

1. Invoke the `topic-master` skill via the Skill tool.
2. Apply topic-master orchestration to the user's request: $ARGUMENTS

## Mandatory consolidated-doc directive (mirror of SKILL.md Step 6b)

After all per-folder files are written and the sprint/marathon deliverables exist, always (re)build a single root-level file at the workspace root:

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

## Sub-commands

These run **inside an existing workspace** for the same topic:

- `/topic-master next` — Read the workspace, recommend the single next-best thing to tackle. Don't auto-execute; propose.
- `/topic-master status` — Read `README.md` + `open-questions.md` + `study-log.md`. Print: dimensions covered, open Qs count, top 5 open Qs, last session date.
- `/topic-master quiz` — Generate 8-12 mixed-difficulty questions from `glossary.md` + `domain/` + `regulatory-india/`. Ask one at a time. Track wrong answers → append to `open-questions.md` as "weak spots."
- `/topic-master brief [audience]` — Generate a fresh brief from the current workspace state for the named audience (defaults to "senior PM"). Drop into `briefs/<date>-<audience>-brief.md`. Always ends with PUMMR. Then **regenerate `_CONSOLIDATED.md`** so the new brief is included.

Any sub-command that adds or modifies a file under the workspace MUST trigger a regeneration of `_CONSOLIDATED.md` before the closing message.
