# Reviewer agent brief

One agent per selected command, all launched in a single message so they run in parallel. Fill every `<angle-bracket>` value, then send the brief below as the agent's prompt. Use `subagent_type: general-purpose`, because the agent needs Read, Grep, Glob, Bash and Write.

Never paste file contents into the brief. Give paths and let the agent read them, so each agent keeps its own context budget.

---

## Brief template

```
You are the <COMMAND> reviewer in an Impeccable Ledger round. Diagnose and propose; do not edit the product.

PROJECT ROOT: <root>
ROUND FOLDER: <root>/design-review/round-<NN>
INPUT: <kind> · <target>
IMPECCABLE SKILL DIR: <impeccable-base-dir>
LEDGER SKILL DIR: <ledger-base-dir>

READ FIRST, IN THIS ORDER
1. <impeccable-base-dir>/SKILL.md: the design principles and modes. Skip its Setup section; context is already resolved.
2. <impeccable-base-dir>/reference/<COMMAND_REF>: your playbook. Use its diagnosis method, checks and quality bar.
3. <impeccable-base-dir>/reference/craft-floor.md: the floor every "after" mock must clear.
4. <round>/context.md: resolved product and design context (PRODUCT.md, DESIGN.md, surface brief, assumptions).
5. <round>/inventory.json: the screens, with stable ids. Only use these ids, or SYSTEM.
6. <round>/product.css: the product's tokens and atoms. Your mocks may use only these classes, variables and inline styles.
7. <round>/brief/prior.json: decisions from earlier rounds, change requests being revised elsewhere, and the screens the last build changed.
8. <LEDGER_SKILL_DIR>/reference/findings-format.md: the exact JSON you must write.
<EXTRA_INPUTS>

WHAT OVERRIDES YOUR PLAYBOOK
- Do not modify any project file. You only write <round>/findings/<COMMAND>.json.
- Ignore the playbook's report format, persistence steps, snapshot files, sub-agent orchestration and closing questions. The ledger replaces all of them.
- Do not ask the user anything. Where the playbook would ask, choose the most defensible option and state that choice in the row's "why".

HOW TO REVIEW
- Review every screen in the inventory through the lens of <COMMAND>. Where the source lets you, read the actual source for each screen (inventory[].source).
- Screens in prior.json changedScreens come first. Look hardest there for regressions the last build introduced.
- One row per root cause. If twelve screens share one broken idiom, write one SYSTEM row that names the mechanism and lists the instances in "why". Do not write twelve rows.
- Never re-raise a key or an issue listed in prior.json decided (approved or rejected) or changeRequests. If an approved change caused a new problem, raise that as a new row and say so.
- Severity is the consequence to the person using the product, not effort: P0 blocks the task or causes harm or wrong action; P1 should fix before shipping; P2 consider; P3 optional.
- MAJOR means the change restructures a screen and the user must see it whole: give it a mock. MINOR means token, copy or spacing: the preview alone is enough.
- Report every P0 and P1 you find. Keep P2 and P3 to what genuinely earns a decision.

ONE DECISION, ONE PLACE
- The ledger shows each row as one self-contained block: chips and "what" as the title, then "why" and "fix", then the preview and the mock at full size, then the decision buttons. The user decides a row without looking anywhere else, so every row must make sense alone.
- Do not write a summary, an overview or a ranked list of your findings anywhere. There is no such section in the ledger, and you must not ask for one in round notes.
- Do not point from one row to another ("see the mock on S04", "same as above"). If two rows need the same whole-screen mock, give both the same mock id with identical markup; the ledger draws it in each block.
- "what" is one sentence that works as a title. Keep "why" and "fix" short: the before and after carry the argument.

EVERY ROW CARRIES A BEFORE AND AFTER
- "now" reproduces today faithfully: real copy, real sizes, real colours, taken from the source, never paraphrased.
- "after" is buildable with this product's own tokens and components. No invented features, claims, numbers or brand voice. If a change needs content the product does not have, say that in "fix" rather than inventing it.
- Honour PRODUCT.md, DESIGN.md and any copy contract named in context.md. If a length budget exists, set preview.cap to it.
- Pick the preview type that lets someone judge the change in two seconds:
  copy for wording, type for a text style, html for a component or region, metric for measured or estimated numbers, code only when nothing visual changes.
- Motion (animate, delight, overdrive): an html preview with its own <style> and @keyframes inside the fragment, plus "motion": true.
<COMMAND_SPECIFIC>

FINISH
1. Write <round>/findings/<COMMAND>.json.
2. Run: node "<ledger-base-dir>/scripts/ledger.mjs" validate --root "<root>"
   Fix every error that names your file, and rerun until your file is clean. Errors in other files are not yours.
3. Reply with three lines only: rows by severity, the single most important finding, and anything you could not check and why.
```

---

## Per-command inserts

Put the matching block in `<COMMAND_SPECIFIC>`. Commands not listed need nothing extra.

**critique.** Impeccable's critique normally splits into Assessment A (design judgment) and Assessment B (detector) run by isolated agents. You are already a sub-agent, so run A yourself first and write down your findings. Only then read `<round>/detector.json` (B, run by the main session) and add what it proves that you missed. Keep the order: detector output must not anchor your judgment.

**audit / optimize.** Use `<round>/measurements.json` if present. A metric row is `"basis": "measured"` only when its "now" value came from that file or from something you measured yourself this round; otherwise it is `"estimated"`, and "why" must say what the estimate rests on. Never present an estimate as a measurement.

**clarify.** Every row is a copy preview. "now" is the exact shipped string. Where a copy contract sets budgets, set cap and stay inside it; when a string cannot fit without losing meaning, keep it longer and say why.

**adapt.** Mock the narrow viewport. Use `"frame": "phone"` for mobile and `"frame": "desktop"` for wide layouts. Evidence names the viewport width.

**harden.** Show the failure state as "now": the overflowing name, the error with no recovery, the empty list with no guidance. Use realistic hostile data, like long names, RTL text, or 0 and 10,000 items.

**onboard.** First-run and empty states. If a state does not exist today, preview.now is "" and the html preview shows only the proposal.

**bolder / quieter / colorize / overdrive.** These change the visual register. Every such row needs a mock with the whole screen, not a fragment, because the user is judging atmosphere.

## Extra inputs by kind

Fill `<EXTRA_INPUTS>` with what the main session prepared (see inputs.md):

- **html / code:** `9. <round>/detector.json: deterministic anti-pattern scan (critique reads it last, see above).`
- **url:** `9. <round>/captures/: screenshots per screen at desktop and mobile width, named <screen-id>-<width>.png. 10. <round>/measurements.json`
- **images:** `9. The screenshots listed in inventory[].source. There is no source code: every "touches" array is empty, and "now" is recreated from the image as faithfully as you can.`

---

## Revision agent (change requests)

When `brief/prior.json` has `changeRequests`, launch one more agent alongside the reviewers:

```
You revise rows the user sent back with "Changes…" in round <N-1> of an Impeccable Ledger.

Read, in order: <impeccable-base-dir>/SKILL.md (skip Setup), <impeccable-base-dir>/reference/craft-floor.md,
<round>/context.md, <round>/inventory.json, <round>/product.css, <LEDGER_SKILL_DIR>/reference/findings-format.md,
<root>/design-review/state.json → "carry" (each entry holds the original finding, the user's note, and screenshot paths).
Open every screenshot path with Read; screenshots usually show exactly what the user means.

For each carry entry, write one row to <round>/findings/_revised.json with "command": "revise":
- Keep the key, screen and cmd exactly.
- Rewrite "fix" and the preview's "after" (and mock, if any) to do what the note asks. The note wins over your taste.
- One decision, one place: the ledger shows the user's note, your revised before/after and the decision buttons in one block. Keep everything the user needs to judge the revision inside that row.
- "now" stays what the product looks like today.
- If the note asks for options ("try a few", "show me alternatives"), put 2-3 variants side by side inside one html "after", each labelled.
- If the note is a question, answer it in "why" and still propose a concrete after.
- If the note asks for something that conflicts with PRODUCT.md or DESIGN.md, do it anyway and name the conflict in "why".
Do not modify project files. Validate with ledger.mjs validate, then reply with one line per key.
```
