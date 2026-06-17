---
name: sidenote
description: Maintain a persistent, file-backed side note (a running list of open threads, questions, and to-dos) for the project you are working in. The note lives IN the project folder as SIDENOTE.md and is mirrored by a central index for cross-project views. Use ONLY when the user explicitly invokes /sidenote or asks to add to / show / edit / delete their side note. Do NOT auto-activate on unrelated work — this is always a deliberate, user-triggered capture tool.
---

# Side Note

A live scratchpad for the user. They capture open threads the moment they occur —
a question to revisit, a decision to make, a "come back to this later" — keep
working, and resolve them later by appending answers. The note is file-backed and
**lives inside the project**, so it survives across chats and is right there when
the user reopens the project days later.

This skill is **deliberate-only**: act when the user invokes `/sidenote` or
clearly asks to add/show/edit/delete a side note. Never open or modify a side
note on your own initiative.

## Storage (in-project file + central index)

There is **one note per project**, and it lives **in the project folder**:

- **Note file:** `<project-root>/SIDENOTE.md` — the single source of truth. The
  user can open it directly in the project any time.
  - Example: `C:\Users\SHUBH SANKALP DAS\Desktop\Building\voiceagent\SIDENOTE.md`
- **Central index:** `<CLAUDE_HOME>/side-notes/index.md` (on this machine:
  `C:\Users\SHUBH SANKALP DAS\.claude\side-notes\index.md`). The index holds
  **pointers only — never content**: one line per project mapping its slug to the
  absolute path of its `SIDENOTE.md` plus the last-updated date. This makes
  `show all` work without scanning the whole disk, with no risk of a drifting
  second copy.

On **every** create or write to a note, upsert that project's line in the index
(absolute path + today's date).

### Project root & slug (auto-detected)

- The **project root** is the current working directory.
- The **slug** is a label for the index/header: slugify the working folder's name
  (lowercase, spaces/separators -> hyphens). Use the last 1-2 meaningful path
  segments when the leaf alone is generic
  (e.g. `...\Hellocounsel\Receptionist` -> `hellocounsel-receptionist`).
- **Home directory / no clear project:** slug = `general`, and since there is no
  project folder to live in, this one note falls back to centralized storage at
  `<CLAUDE_HOME>/side-notes/general/SIDENOTE.md`.
- The user may override the target project by naming one explicitly.

### Git safety

When **creating** `SIDENOTE.md`, check whether the project root is a git repo
(a `.git` folder exists). If it is, **offer once** to add `SIDENOTE.md` to the
repo's `.gitignore` so personal notes aren't committed — do not edit `.gitignore`
without the user's yes.

### Note file format (date-sectioned, hybrid)

```markdown
# Side note: voiceagent
Project: voiceagent
Created: 2026-06-17
Updated: 2026-06-18

## 2026-06-17
1. Discuss the eval scoring approach
   - 2026-06-17: we'll use an LLM-judge rubric, 0-5 scale
2. Check if Emma handles after-hours calls

## 2026-06-18
3. Decide GPT-4.1 vs cheaper model for regression runs
```

- Points sit under `## YYYY-MM-DD` date headings — the day they were added — so
  the note reads as a timeline when returning after a break.
- Points are numbered **continuously across all dates** (1, 2, 3 …) so a point
  reference is stable. **Renumber on display** so numbers always match the current
  list (deleting a point renumbers the rest on the next show).
- Appended answers are date-stamped nested bullets under their point. The original
  point text is preserved — a point becomes a living thread.
- Always set `Updated` to today's date (`YYYY-MM-DD`) on any write.

## Active note (one per chat)

Track the **one active note** for the current conversation — its identity is just
the project (which resolves to one `SIDENOTE.md`). All commands operate on it
until the user switches projects. Hold the active project in conversation context.

### Entry / chooser — when no active note is set, or user types bare `/sidenote`

1. **Detect the project** from the working folder (project root + slug).
2. **Look for `<project-root>/SIDENOTE.md`** (and confirm against the index).
   - If it exists, **show a one-line summary** (slug + point count + last date)
     and set it active — this is the carry-forward case.
   - If it does not exist, **offer to create it**. On a git repo, also do the
     `.gitignore` offer above.
3. **Analyze the recent conversation** and, when creating, seed nothing — just
   confirm the empty note is ready and suggest `add`.

Chooser output shape (existing note):

```
Project: <slug>  ->  <project-root>\SIDENOTE.md
<n> points, last updated <date>. Active.
```

Chooser output shape (no note yet):

```
Project: <slug>  ->  no SIDENOTE.md yet.
Create one at <project-root>\SIDENOTE.md? (y)
[if git repo] Also add SIDENOTE.md to .gitignore so it isn't committed? (y/n)
```

Typing `/sidenote` again, or working in a different project, re-runs the chooser
to **switch** the active note.

## Commands

All operate on the active note. If no note is active and the command is not a
plain `show all`, run the chooser first, then perform the command.

### `add <text>`
Append a new point under **today's** date heading (create the `## YYYY-MM-DD`
heading if today's isn't present yet). Use the next continuous number. Bump
`Updated`, update the index, write back. Confirm: `Added #<n> to <slug>.`

### `show`
Print the full active note as stored — date headings preserved, points renumbered
continuously. If empty, say so and suggest `add`.

### `edit <natural language>`
**Intent-aware** — read the user's phrasing to decide:

- Append intent (e.g. *"also add this to 1"*, *"against point 2 note that..."*)
  -> add a date-stamped nested bullet under that point. Keep the original text.
- Rewrite intent (e.g. *"in 1, instead of A put B"*, *"reword point 3 to..."*)
  -> replace that point's text (the point stays under its original date heading).

Identify the target point by number when given, else by matching the words to a
point. If ambiguous (multiple match), ask one short clarifying question naming the
candidates. If the point doesn't exist, say so and show the current list. Bump
`Updated`, update the index, confirm what changed.

### `delete <point ref>`
Remove the referenced point. Remaining points renumber on the next show; if a date
heading is left with no points, drop the empty heading. Bump `Updated`, update the
index. Confirm: `Deleted #<n> ("<short text>") from <slug>.`

### `show all` (cross-project / global)
Read the central index, then read each linked `SIDENOTE.md` and print them grouped
by project. Use this when the user wants the full picture across projects, or asks
for something not in the current chat's active note. If a linked file is missing
(project moved/deleted), note it and prune that index line.

## Carry-forward (new chat continuing prior work)

Because the note lives in the project as `SIDENOTE.md` (and is registered in the
index), reopening the project in a fresh chat and running `/sidenote` finds the
existing note immediately and sets it active — the running, date-sectioned list
reappears so the user can pick up where they left off. This is the whole point of
storing it in-project.

## Edge cases

- **Home directory / no project:** slug = `general`, stored centrally at
  `<CLAUDE_HOME>/side-notes/general/SIDENOTE.md`; user can override by naming a
  project.
- **Empty active note on `show`:** state it's empty, suggest `add`.
- **Ambiguous point reference:** one short clarifying question, name the candidates.
- **Non-existent point reference:** report it, show the current list.
- **Git repo:** offer `.gitignore` on creation only; never auto-edit `.gitignore`.
- **Missing linked file during `show all`:** report and prune the index line.
- **Concurrent/parallel:** single user — no locking needed.

## Do NOT

- Do not auto-open or auto-modify side notes without explicit user action.
- Do not store note **content** in the central index — it holds pointers only.
- Do not commit `SIDENOTE.md` or edit `.gitignore` without the user's yes.
- Do not add tags, priorities, due dates, or status fields. Points are plain text
  under date headings, with optional nested answers (YAGNI).
