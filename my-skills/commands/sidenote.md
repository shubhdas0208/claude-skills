---
description: Open or update your persistent side note — a running list of open threads, questions, and to-dos kept as SIDENOTE.md inside the current project, so it's there when you return days later. Subcommands: add, show, edit, delete, show all.
---

# Side Note Command

A thin shim. All behavior lives in the `sidenote` skill (the single source of
truth), so the command and the skill can never drift apart.

## What to do

1. Invoke the `sidenote` skill via the Skill tool.
2. Follow the skill's instructions for the requested subcommand, using the
   arguments below.

Arguments: `$ARGUMENTS`

## Routing the arguments

- No arguments (bare `/sidenote`) -> run the skill's chooser: find the current
  project's `SIDENOTE.md` (or offer to create it) and set it active.
- `add <text>` -> append a new point to the active note.
- `show` -> print the full active note.
- `edit <natural language>` -> intent-aware update of a point (append an answer
  under it, or rewrite it — the skill reads the phrasing to decide).
- `delete <point ref>` -> remove a point.
- `show all` -> derived global view across every project's notes.

If no side note is active yet and the request is anything other than `show all`,
run the chooser first, then carry out the requested subcommand.
