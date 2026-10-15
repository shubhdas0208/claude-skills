---
name: impeccable-ledger
description: Runs chosen Impeccable commands (audit, critique, polish, distill, typeset, colorize, layout, bolder, quieter, animate, delight, overdrive, clarify, adapt, harden, onboard, optimize) over an existing UI in parallel, then produces an HTML decision ledger where every suggestion shows a coded before/after. The user approves, rejects, or requests changes per row and exports decisions.json. Feeding that back builds the approved rows (after a file backup), revises change requests, and re-reviews the whole UI in a new round. Use when the user invokes /impeccable-ledger, asks to "run impeccable on my existing UI and let me pick changes", wants a design-suggestions ledger or before/after review like the Voxikin one, or returns with an exported ledger decisions file or pasted "DESIGN DECISIONS" text.
---

# Impeccable Ledger

A review loop over UI that already exists: **pick commands → parallel review → visual ledger → decisions → backup + build → re-review**. Every suggestion is judged as a picture, not a paragraph.

> **One decision, one place.** The description, the full comparison, the choice and the change request for a suggestion live in the same block. Never split a ledger into a summary list and a separate comparison section.

What that means on the page, and it holds for every ledger this skill renders or hand-edits:

- **One block per suggestion, in a fixed order:** severity and command chips with the title, the short rationale (why, fix, where), the full before/after at full size, then Approve / Reject / Changes… with the change-request box directly under the comparison.
- **The comparison is always open and always in the block.** No thumbnails, no collapsed panels, no "see the full comparison" links, no section of mocks further down. A whole-screen mock shared by several suggestions is drawn again inside each of their blocks. A suggestion with only a metric or code preview shows that preview in the same slot.
- **Nothing above the ledger restates the suggestions.** The top is the title, one line of description, one line of counts and the filter bar. Round notes and assumptions fold into a single line. Do not write an overview, a "top findings" list or a per-row summary into `headline`, `dek` or `notes`.
- **"Screens with nothing to fix" and "What happens next" come last,** after every block.

This skill orchestrates. The design judgment comes from the `impeccable` skill's playbooks; the bookkeeping (validation, merging, rendering, round state, backups) comes from `scripts/ledger.mjs`, so it is identical every run.

- `<ledger>`: this skill's base directory.
- `<impeccable>`: the impeccable skill's base directory (normally `~/.claude/skills/impeccable`). If it is missing, stop and tell the user this skill needs Impeccable installed.
- `<root>`: the project root (git root, or the folder holding the UI). All state lives in `<root>/design-review/`.

Run every CLI call as `node "<ledger>/scripts/ledger.mjs" <cmd> --root "<root>"`.

## Which entry point

Check `node "<ledger>/scripts/ledger.mjs" status --root "<root>"` first.

| Situation | Go to |
|---|---|
| User pasted text containing `DESIGN DECISIONS · ROUND`, or gave a `*-decisions.json` path | **Phase 5**, then read [reference/loop.md](reference/loop.md) |
| `status` shows a round still `reviewing` and the user wants the ledger again | `build`, and hand over the path |
| Anything else | **Phase 1** |

## Phase 1: Target and commands

1. **Target.** Use what the user named. If nothing was named, ask for it: an HTML file, a codebase route or folder, a URL, or screenshots. Classify the kind (`html`, `code`, `url`, `images`) using the table in [reference/inputs.md](reference/inputs.md).
2. **Commands.** If the user already gave numbers or names (`/impeccable-ledger app.html 2,5,13`), use them. Otherwise print the numbered list exactly as `ledger.mjs picker` prints it, and ask them to reply with numbers, a range, or `all`. Do not pre-select or recommend.

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

   Wait for the reply. That is the only question in this phase.
3. **Open the round.**
   ```bash
   node "<ledger>/scripts/ledger.mjs" init --kind <kind> --target "<target>" --commands "<reply>" --project "<Product name>" --root "<root>"
   ```

## Phase 2: Prepare the round

Follow [reference/inputs.md](reference/inputs.md) in order: resolve Impeccable context (and **ask each time** when PRODUCT.md / DESIGN.md are missing: run init, or infer and state assumptions), then write `context.md`, `inventory.json` and `product.css`, and gather detector output, captures and measurements as the kind requires.

If `<root>/design-review/` is inside a git repo, suggest adding it to `.gitignore` once. Downloads and screenshots can be large.

## Phase 3: Parallel review

Launch **one agent per selected command in a single message**, using [reference/agent-brief.md](reference/agent-brief.md). From round 2 onward, add the revision agent to the same message when `brief/prior.json` has change requests.

Tell the user in one line how many agents are running and for which commands. Do not narrate the wait.

When an agent fails or returns invalid JSON after its own fix attempt, rerun that one command once with the validator's errors in its brief. If it fails again, build without it and add a `crit` note to `round.json` naming the missing command.

## Phase 4: Build the ledger

```bash
node "<ledger>/scripts/ledger.mjs" build --root "<root>"
```

- **Duplicate candidates** are pairs of rows on the same screen with the same evidence or wording from different commands. Decide each pair: when it is one issue, delete the weaker row from its findings file, keep the stronger one, and credit both in its `why`. When they are distinct, leave both. Rebuild.
- **Warnings** about change requests without a revision mean the revision agent missed a key. Fix it before handing over. A warning about the `dek` means the masthead is summarising: cut it to one line that names the scope.
- **Verify once.** Open `ledger.html` in the Browser pane at desktop width and at 390px. Check that every block reads top to bottom as title, rationale, comparison, decision, with nothing to scroll away for; that previews render in product styling and mocks scale (side by side on desktop, stacked at 390px); that one decision and one note persist after a reload; and that both exports produce files. Fix what that shows in one batch. Findings problems go back into the JSON, and ledger bugs are fixed in `<ledger>/templates/ledger.html`, keeping the block order above. Then rebuild once, and stop.
- **Hand over.** Send the file with SendUserFile (`display: "render"`). Give the path, the headline counts (P0/P1, majors, revised, changed), and the single most consequential row in one sentence. Then say how to return: *"Decide rows, click **Download decisions.json**, and give me the file's path (or paste **Copy as text**)."*

Do not implement anything in this phase, even obvious fixes. The user decides first.

## Phase 5: Decisions → build → next round

Follow [reference/loop.md](reference/loop.md) exactly:

1. `ingest` the export, then report the counts and read back the change requests.
2. `backup`, which copies every file the approved rows touch into `round-NN/backup/`.
3. Build the approved rows, loading each row's Impeccable playbook and `craft-floor.md` first. Screenshot-only inputs get a `spec.md` instead.
4. `built --screens …`, then `init` for the next round with the same commands.
5. Re-review the **whole UI** (changed screens first, decided rows filtered out, change requests revised at the top): Phases 2 → 4 again.

The loop ends when a round has no P0/P1 rows and no change requests, or when the user says stop.

## Rules

- One decision, one place. The description, the full comparison, the choice and the change request for a suggestion live in the same block. Never split a ledger into a summary list and a separate comparison section, and never put a summary of the suggestions above them.
- Never edit product files before decisions arrive, and never before `backup` has run for that round.
- A rejected key never comes back. A change request always comes back revised, at the top, with the user's note shown beside it.
- Mocks use the product's own tokens and components. The "now" side is faithful to what ships today, and the "after" side never invents content, claims or features.
- Measured and estimated numbers are labelled as such. An estimate is never shown as a measurement.
- Project rules (PRODUCT.md, DESIGN.md, copy contracts, "do not edit" markers) bind reviewers and builders alike.
- The ledger chrome stays neutral. It must never look like the product it reviews.

## Files

```
design-review/
  state.json                 round history, decided / carry / pending keys
  round-01/
    round.json               commands, notes, assumptions, scores
    context.md  inventory.json  product.css
    detector.json  measurements.json  captures/
    brief/prior.json         what reviewers must not re-raise
    findings/<cmd>.json      one per reviewer (+ _revised.json)
    merged.json  ledger.html
    decisions.json  build-plan.json  attachments/
    backup/files/…  backup/manifest.json
```
