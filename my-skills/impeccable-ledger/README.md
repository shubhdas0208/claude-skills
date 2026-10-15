# Impeccable Ledger

**A design review loop for UI you already have.** Pick which Impeccable design commands to run. Claude reviews your screens and hands you a web page where every suggestion shows a **before and after picture**. You approve, reject, or ask for changes on each one. You give your decisions back to Claude, it builds the approved changes, and the next round starts.

```
pick commands → Claude reviews → ledger page → you decide → Claude builds → re-review → …
```

This README has two parts:

- **Part 1** is for you, the person using the skill.
- **Part 2** is for Claude. If you hand this folder to Claude and say "set this up for me", it reads Part 2 and takes it from there.

---

# Part 1: For people

## What you need

| | |
|---|---|
| **Claude Code** | Desktop app, terminal, or IDE extension |
| **Node.js 18 or newer** | Runs the ledger's scripts. Check with `node --version`. |
| **The Impeccable skill** | This skill runs Impeccable's design playbooks, so it does nothing without it. Install Impeccable separately (tested with version 4.1.2). |
| **A browser** | To open the ledger page |

## Install

Put the whole `impeccable-ledger` folder, not just one file, into your Claude skills folder:

- **Windows:** `C:\Users\<you>\.claude\skills\impeccable-ledger\`
- **Mac / Linux:** `~/.claude/skills/impeccable-ledger/`

Impeccable goes in the same place, next to it:

```
.claude/
  skills/
    impeccable/            ← the Impeccable skill
    impeccable-ledger/     ← this folder
      SKILL.md
      README.md
      scripts/  templates/  reference/
```

Restart Claude Code. Type `/impeccable-ledger`. If it shows up, you're done.

**Easier option:** open Claude Code, attach or point it at this folder, and say *"Read the README and set this skill up for me."*

## Your first run

Open Claude Code **in your project folder**, then:

### 1. Start it and say what to review

```
/impeccable-ledger src/app/checkout
```

The target can be any of these:

| You have | Example |
|---|---|
| An HTML file or prototype | `/impeccable-ledger prototype.html` |
| A page, route, or folder in your code | `/impeccable-ledger src/pages/settings` |
| A website or local dev server | `/impeccable-ledger http://localhost:3000` |
| Screenshots only | `/impeccable-ledger screenshots/` |

With screenshots, Claude can suggest changes but can't build them. There's no code to edit, so you get a written spec instead.

### 2. Pick the commands

Claude shows a numbered list. Reply with numbers.

```
 1. audit      Technical quality checks (a11y, performance, responsive)
 2. critique   UX design review: hierarchy, clarity, emotional resonance
 3. polish     Final visual pass for shipping readiness
 4. distill    Ruthless subtraction to the essence
 5. typeset    Fix typography
 6. colorize   Add strategic color
 7. layout     Fix spacing, composition, visual rhythm
 8. bolder     Push safe designs toward impact
 9. quieter    Tone down designs that are shouting
10. animate    Purposeful motion
11. delight    Small moments of personality
12. overdrive  Shaders, physics, cinematic transitions
13. clarify    Rewrite confusing UX copy
14. adapt      Responsive layouts
15. harden     Edge cases, i18n, error states, overflow
16. onboard    First-run experiences and empty states
17. optimize   UI performance (LCP, bundle size)
```

You can reply like `2,5,13`, `1-4`, `all`, or even `critique clarify`. You can also skip the list by putting the numbers in the first message: `/impeccable-ledger prototype.html 2,5,13`.

**Good starting sets:**

| Goal | Reply |
|---|---|
| "Is this any good?" | `2` |
| Before shipping | `1,3,15` |
| Looks dull | `2,6,8` |
| Too busy | `4,9` |
| Words are confusing | `13` |
| Works badly on phones | `14` |

> **Cost note:** each number launches its own Claude agent, all running at once. Two or three commands is quick and cheap; `all` means 17 agents and uses a lot of tokens.

### 3. Answer one setup question, maybe

If your project has no `PRODUCT.md` or `DESIGN.md` (files where Impeccable stores what your product is and how it should look), Claude asks you which way to go:

- **Run Impeccable init first.** Claude asks a few questions about your users, brand, and tone, then writes those files. You get a better review, and it's a one-time step.
- **Infer and state assumptions.** Claude guesses from the UI and lists its guesses under *About this round* at the top of the ledger for you to correct.

### 4. Wait, then open the ledger

Claude tells you where the page is: `design-review/round-01/ledger.html`. Open it in your browser.

## Using the ledger page

**One decision, one place.** Each suggestion is a single block, and everything you need to decide it is in that block. You read down it once and never jump to another part of the page:

1. **Chips and title.** What is wrong, in one sentence, with:
   - **Severity:** P0 is blocking, P1 should fix, P2 is worth considering, P3 is optional.
   - **The fixing command:** which Impeccable command would make the change.
   - **Size:** MAJOR changes restructure a screen, MINOR ones don't.
   - The screen it belongs to, on the right.
2. **Why and fix.** A short rationale, and where in the code it was found.
3. **The full before and after.** **Now** and **Proposed** side by side at full size (stacked on a phone). When a change restructures a screen, the whole-screen comparison sits right under the close-up, in the same block. If one whole-screen comparison backs several suggestions, it is shown again in each of them. Suggestions about speed or code show their numbers or code in the same spot.
4. **Your decision,** directly under the comparison: **Approve**, **Reject**, or **Changes…**.
   - **Changes…** opens a box, right there, for your instruction, e.g. *"right idea, but make the button filled, not outlined"*.
   - You can attach screenshots, or paste them with Ctrl+V / Cmd+V. A note or screenshot on any block counts as a change request.
   - Once decided, the block shows *Approved*, *Rejected* or *Change requested* beside its chips.

There is no summary list at the top and no separate section of comparisons at the bottom. Above the first block there is only the title, one line of counts, and the filters. "Screens with nothing to fix" and "What happens next" are at the very end.

Handy extras:

- **Filters** stay stuck to the top as you scroll. They narrow by severity, command, or size, or show *Undecided only*.
- **Approve all P0 + P1** is a quick way to accept the important fixes.
- **Stack to enlarge** appears on wide desktop mocks, when side by side is too small to read.
- **About this round** (one line under the counts) opens the reviewers' assumptions and caveats.
- Your choices **save automatically in this browser**. You can close the tab and come back.

## Giving your decisions back

Use the bar at the bottom of the page:

| Button | When |
|---|---|
| **Download decisions.json** | **Best.** It keeps your screenshots. Then tell Claude: *"Here are my decisions: C:\Users\me\Downloads\myapp-round-01-decisions.json"* |
| **Copy as text** | Quick. Paste it straight into Claude. Screenshots are **not** included. |
| **Download report** | A readable summary to share with teammates. Don't give this one to Claude. |

## What happens next

When Claude gets your decisions:

1. **It reads them back to you.** You see the counts, plus every change request in your own words, so you can catch a misunderstanding before anything is built.
2. **It backs up files.** Every file it's about to edit is copied to `design-review/round-01/backup/`.
3. **It builds the approved changes**, exactly as the Proposed picture showed.
4. **It starts round 2 automatically**, with the same commands, and reviews the **whole** UI again:
   - **Your change requests come first**, redesigned the way you asked, with your note beside them. They aren't built until you approve them.
   - **Screens that just changed come next**, so you can check the build didn't break anything.
   - **Everything you rejected stays gone for good.**
   - **Anything you left undecided comes back**, tagged with its original round.
5. Decide, export, hand it back, and repeat.

**The loop ends** when a round has no P0/P1 issues and no change requests, or whenever you say stop.

## Useful things to say to Claude

| Say | What happens |
|---|---|
| *"What's the status of the design review?"* | A summary of rounds and open items |
| *"Next round, use 3,15 instead"* | Changes the command set |
| *"Undo round 2's build"* | Shows you the backed-up files, then restores them after you confirm |
| *"Stop the design review"* | Ends the loop; everything stays in `design-review/` |
| *"Open the ledger again"* | Rebuilds and gives you the page |

## Where things are saved

Everything lives in your project, in `design-review/`:

```
design-review/
  state.json            what's been approved, rejected, requested
  round-01/
    ledger.html         the page you review
    decisions.json      your decisions as Claude received them
    attachments/        your screenshots
    backup/             original copies of every file the build edited
```

If your project uses git, add `design-review/` to `.gitignore`. Screenshots and backups can get large.

## Troubleshooting

| Problem | Fix |
|---|---|
| `/impeccable-ledger` doesn't appear | The folder must be `.claude/skills/impeccable-ledger/` with `SKILL.md` directly inside it, not inside an extra folder. Restart Claude Code. |
| Claude says Impeccable is missing | Install the Impeccable skill into `.claude/skills/impeccable/`. |
| `node` not found | Install Node.js 18+ and restart your terminal or app. |
| The download buttons do nothing | Some embedded previews block downloads. Open `ledger.html` directly in Chrome, Edge, Firefox, or Safari. |
| My decisions disappeared | They're saved per browser. Opening the page in a different browser or a private window starts empty. Export before switching. |
| "Not saving: browser storage is blocked" | Export now (Download decisions.json) before closing the tab. |

---

# Part 2: For Claude

> You are reading this because a user shared the `impeccable-ledger` skill folder with you, or pointed you at this README. **`SKILL.md` is the source of truth for running reviews.** This part only covers installation, verification, and how to orient a first-time user. Where they differ, `SKILL.md` wins.

## A. Install and verify

Do these in order. Report each result in one short line, and stop at the first failure with a clear fix.

1. **Locate the folder.** Find the directory containing this README and `SKILL.md`.
   - It is installed when its path is `<home>/.claude/skills/impeccable-ledger/SKILL.md`, where `<home>` is `%USERPROFILE%` on Windows and `~` on Mac/Linux.
   - If it is elsewhere (Downloads, Desktop, a zip, or nested one folder too deep like `impeccable-ledger/impeccable-ledger/SKILL.md`), **ask before copying**: *"I'll install it to `<path>`. OK?"* Then copy the whole folder, keeping `scripts/`, `templates/`, and `reference/` beside `SKILL.md`.
   - If `<home>/.claude/skills/impeccable-ledger/` already exists, ask whether to replace it. Never overwrite silently.
2. **Node.js.** Run `node --version`. It needs 18 or newer. If missing, tell the user to install Node.js, and don't continue.
3. **Scripts work.** Run `node "<home>/.claude/skills/impeccable-ledger/scripts/ledger.mjs" picker`. It must print the 17 numbered commands.
4. **Impeccable is present.** Check that `<home>/.claude/skills/impeccable/SKILL.md` exists, along with `reference/critique.md`, `reference/craft-floor.md`, `scripts/context.mjs`, and `scripts/detect.mjs`.
   - If missing, tell the user this skill requires the Impeccable skill (tested with 4.1.2) and ask whether they have it or where they got it.
   - **Do not download it from a source you found yourself.**
   - If present but some referenced files are missing, say which ones. Their Impeccable version may differ, and those commands may not work.
5. **Registered.** Tell the user to restart Claude Code (or start a new session) so `/impeccable-ledger` appears. In the desktop app, a new session is enough.

Then say, in no more than three lines, what the skill does and how to start: *"Open Claude Code in the project you want reviewed and type `/impeccable-ledger <file, folder, URL, or screenshots>`."*

## B. The questions to ask on a first run, in this order

Ask only what the user hasn't already told you. One topic per message, except where noted.

1. **Project root.** If the session isn't obviously in the project to review, ask which folder that is. All state goes to `<root>/design-review/`.
2. **Target.** *"What should I review? A file, a route or folder in your code, a URL, or screenshots?"* If it's a URL and the source code is also in the workspace, confirm: *"Is the code for this site in this folder? Then I can build approved changes, not just suggest them."*
3. **Commands.** Print the numbered list exactly as `ledger.mjs picker` outputs it. Ask them to reply with numbers, a range, or `all`. **Do not recommend or pre-select.** If they ask for help choosing, you may show Part 1's "Good starting sets" table as information, then let them pick.
   - If they pick more than 6, state the count once: *"That's N agents running at once."* Then proceed unless they change it.
4. **Missing context.** Only if `PRODUCT.md` / `DESIGN.md` are missing, ask with two options and no recommendation: **Run Impeccable init first** or **Infer and state assumptions**. Ask this **every time** they are missing, even if the user chose before in another project.
5. Then follow `SKILL.md` Phases 2 to 4 without further questions, and hand over the ledger path with the one-line instruction on how to return decisions.

## C. When the user comes back with decisions

- Accept a path to `*-decisions.json`, pasted text containing `DESIGN DECISIONS · ROUND`, or ask for one of those if they only have the report HTML.
- If they pasted text and it mentions `IMAGES ATTACHED`, ask for the JSON before building. The screenshots usually carry the real instruction.
- Before building, read back the counts and every change request in the user's own words. Then follow `SKILL.md` Phase 5 and `reference/loop.md`.
- **Always** run `ledger.mjs backup` before editing any product file. Ask before `restore`.

## D. Guardrails

- Never edit the user's product files before decisions arrive, and never before backup.
- Never re-suggest a rejected row. Change requests always come back revised, at the top, and are not built until approved.
- One decision, one place. The description, the full comparison, the choice and the change request for a suggestion live in the same block. Never hand over a ledger, or any other decision page, that splits into a summary list and a separate comparison section.
- If the user asks for something this README and `SKILL.md` don't cover, say so plainly and ask. Don't improvise a different workflow.
