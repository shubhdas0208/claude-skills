# Mom Test v2 Implementation Plan

> **For agentic workers:** Use superpowers:subagent-driven-development or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax.

**Goal:** Rewrite `/mom-test` from v1 (thin question kit) to v2 (full interview-ready artifact with per-question reasoning), per `design-v2.md` in this folder.

**Architecture:** Three file operations â€” back up current SKILL.md as SKILL.v1.md (rollback safety since not in git), create `script-templates.md` (timed-section scaffolds), rewrite SKILL.md to v2 OP. No code; verification is manual invocation post-build.

**Tech Stack:** Claude Code skill (markdown), no dependencies.

**Date:** 2026-06-14

---

## File structure

| File | Action | Purpose |
|---|---|---|
| `SKILL.v1.md` | Create | Backup of current v1 (rollback safety) |
| `SKILL.md` | Modify (full rewrite) | New v2 operating procedure |
| `script-templates.md` | Create | Empty scaffolds for the 5 timed sections with Why/Discover/Decision/Listen-for slots |
| `mom-test-interview-guide.md` | Keep unchanged | Rules deep-reference linked from SKILL.md |
| `design-v2.md` | Keep unchanged | Design spec |

All paths under `C:\Users\SHUBH SANKALP DAS\.claude\skills\mom-test\`.

---

## Tasks

### Task 1: Backup current SKILL.md
**Files:** Create `SKILL.v1.md`

- [ ] Step 1: Write SKILL.v1.md with the verbatim contents of v1 SKILL.md.
- [ ] Step 2: Verify the file exists and content matches.

### Task 2: Create script-templates.md
**Files:** Create `script-templates.md`

- [ ] Step 1: Write file with 5 sections (Â§1-Â§5 per spec Â§2.B), each containing: section name, duration, goal, "Listen for the whole section" prompt, and 2-5 question slots showing the annotation block schema. Add a final coverage-check section the skill runs internally.
- [ ] Step 2: Verify structure matches design-v2.md Â§2.B.

### Task 3: Rewrite SKILL.md to v2
**Files:** Full rewrite of `SKILL.md`

- [ ] Step 1: Write new SKILL.md with frontmatter unchanged from v1, then Overview, then Operating Procedure (Step 1 adaptive intake â†’ Step 2 5-section artifact â†’ Step 3 self-check gate), then Quick Reference and Common Mistakes â€” all matching design-v2.md.
- [ ] Step 2: Verify references to `mom-test-interview-guide.md` and `script-templates.md` are present.
- [ ] Step 3: Verify the self-check gate has all 8 items from design-v2.md Â§3.

### Task 4: Manual verification (you, next session)
Cannot be automated.

- [ ] Step 1: In a fresh Claude Code session, invoke `/mom-test` with a sample brief (e.g. a Dezerv feature idea).
- [ ] Step 2: Confirm intake asks â‰¤6 questions and skips items already in the brief.
- [ ] Step 3: Confirm output emits all 5 sections (A-E).
- [ ] Step 4: Confirm every script question has all 4 annotation fields and references intake #2.
- [ ] Step 5: Confirm banned topics â‰¥5 entries and tailored to your secret solution.
- [ ] Step 6: If any check fails â†’ return to Task 3 and fix SKILL.md inline.

---

## Self-review
- **Spec coverage:** Intake Â§1 â†’ Task 3. Artifact Â§2 sections A/C/D/E â†’ Task 3. Section B + templates â†’ Tasks 2 + 3. Self-check gate Â§3 â†’ Task 3. File changes â†’ Tasks 1-3. Manual verification â†’ Task 4.
- **Placeholders:** None. Each task references the spec for content.
- **Type consistency:** Annotation schema (Why/Discover/Decision/Listen-for) consistent across Tasks 2 and 3. Section letters A-E consistent.

---

## Rollback
Rollback via `SKILL.v1.md` is no longer available — that backup was deleted on 2026-06-17 once v2 was confirmed working. Recover an earlier version from git history if ever needed.
