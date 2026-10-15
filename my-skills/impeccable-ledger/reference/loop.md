# Decisions in, next round out

Runs when the user comes back with an export: pasted "Copy as text", or a path to `<project>-round-NN-decisions.json` (usually in their Downloads folder), or the downloaded report HTML. The report is for reading; ask for the JSON or the text if that is all they gave.

## 1. Ingest

Pasted text: write it verbatim to `design-review/round-NN/decisions.txt` first, then ingest the file.

```bash
node "<ledger-base-dir>/scripts/ledger.mjs" ingest "<path>" --root "<root>"
```

This writes `round-NN/decisions.json` and `round-NN/build-plan.json`, saves screenshots to `round-NN/attachments/`, and updates `state.json`:

- approved → `decided`, and into the build plan
- rejected → `decided`, never re-suggested
- change (a "Changes…" click, or any note or screenshot) → `carry`, revised next round
- undecided → `pending`, shown again next round tagged with its original round

Read the warnings. If the text export mentions images, ask for the JSON before building, because the screenshots usually carry the actual instruction.

Tell the user the counts in one line, then list the change requests with their notes in their own words, so they can catch a misread before anything is built.

## 2. Back up

```bash
node "<ledger-base-dir>/scripts/ledger.mjs" backup --root "<root>"
```

Copies every file in `build-plan.json` → `touches` into `round-NN/backup/files/` with a manifest. The first copy of a file is kept; running backup again never overwrites the pre-build original. If you discover mid-build that you must edit a file not in the plan, back it up before touching it:

```bash
node "<ledger-base-dir>/scripts/ledger.mjs" backup --files "src/theme.css,src/Button.tsx" --root "<root>"
```

Skip this and the build for `images` inputs.

## 3. Build the approved rows

Work from `build-plan.json` → `approved`. Each row has `fix`, `preview.after`, `mock.after`, `touches`, and the user's `note` if they left one.

- Load the Impeccable playbook for each row's `cmd` (`<impeccable-base-dir>/reference/<cmd>.md`) and `craft-floor.md` before editing UI, as Impeccable's own setup requires. Group rows by `cmd` and load each playbook once.
- The approved `after` is the spec. Build what the user approved, not a re-imagining. When the source makes the approved after impossible, stop and ask about that row only.
- A note on an approved row is part of the approval. Follow it.
- Fix mechanisms before instances: SYSTEM rows first (tokens, shared components), then screens.
- Respect project rules that say a file must not be edited without saying so (e.g. a CONTRACT.md). Say so when an approval sanctions it.
- For `url` inputs with no source in the workspace, and for `images`, do not build. Instead write `round-NN/spec.md` listing each approved row as a buildable instruction, and tell the user.

After building, run the impeccable detector on the touched files and render the changed screens once at desktop and mobile width. Fix what that shows in a single batch. Do not start an open-ended polish loop; the next round is the review.

Record what changed:

```bash
node "<ledger-base-dir>/scripts/ledger.mjs" built --screens "S01,S07,SYSTEM" --files "build/00-head.html,build/07-about.html" --root "<root>"
```

## 4. Re-review, whole UI, changed screens first

The next round starts immediately, with the same commands, unless the user named different numbers alongside their decisions.

```bash
node "<ledger-base-dir>/scripts/ledger.mjs" init --root "<root>"
```

It copies last round's inventory, product.css and context.md, and writes `brief/prior.json` (decided keys, open change requests, undecided rows, changed screens and files). Then:

1. Refresh `inventory.json` if the build added or removed screens, and `product.css` if tokens changed. It usually did for SYSTEM rows.
2. Rerun the detector and captures/measurements as in inputs.md.
3. Launch every reviewer again over the **whole** UI, plus the revision agent if `prior.json` has `changeRequests`. They skip decided keys and look hardest at changed screens.
4. `ledger.mjs build`, check its warnings and duplicate candidates, and hand over the new ledger.

The ledger orders itself: **Your change requests, revised** → **Changed in the last build** → every area. Decided rows are filtered out by key; undecided ones reappear tagged "From R01".

One decision, one place holds in every round. A revised row is one block: the user's note from last round, the revised rationale, the full before and after, and the decision buttons under it. Do not add a recap of last round's decisions, or a list of what changed, above the blocks.

## 5. When the loop ends

Stop proposing another round when a build produces a ledger with no P0 or P1 rows and no change requests. Say that plainly, and offer to stop or run a different command set. The user can also stop at any point. Their decisions and backups stay in `design-review/`.

## Reverting

If the user wants a round's build undone, show them the manifest's file list first, then after they confirm:

```bash
node "<ledger-base-dir>/scripts/ledger.mjs" restore --round NN --yes --root "<root>"
```

Files the build created are deleted and files it edited are put back. `state.json` still records the round's decisions, so tell the user those rows stay decided unless they ask you to reopen them.
