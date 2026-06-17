# Mom Test Skill v2 — Design Spec

**Date:** 2026-06-14
**Author:** Shubh Sankalp Das (PM, joining Dezerv 2026-06)
**Skill path:** `C:\Users\SHUBH SANKALP DAS\.claude\skills\mom-test\`
**Status:** Design approved by user. Ready for implementation plan.

---

## Problem

The existing `/mom-test` skill produces a usable but thin question kit. As a PM about to run customer interviews (wealthtech users at Dezerv, plus general product discovery work), I need a full interview-ready artifact — not just a list of questions, but the reasoning behind each, the signals to listen for, a synthesis template for what I heard, and a multi-interview decision gate for whether to actually build.

The current skill's gap, measured against the bar I already set in `C:\Users\SHUBH SANKALP DAS\Desktop\MomTest_DevInterview_PromptEvalUI.md`:

- No per-question reasoning (why ask / what we discover / how it changes the build decision / listen-for signals)
- Fixed 4-question intake instead of adaptive probing against the spec or brief I provide
- No interview script structure (timed sections, banned topics, listen-fors)
- No post-interview synthesis template
- No multi-interview decision gate

## User

A PM preparing for user interviews. Inputs a product spec, feature brief, or rough idea — sometimes thorough, often thin. Wants to walk into an interview with one document and walk out able to synthesize the data the same hour.

## Success criteria

- I can walk into 3 user interviews with the skill's output and never need to consult another resource during the call.
- Post-interview, the synthesis template fills out in under 15 minutes while the conversation is fresh.
- The decision gate produces a clear YES/NO on "should I build this" after the planned interview count.
- Zero leading questions slip through (enforced by self-check gate).

## Scope: update the existing skill in place

No new skill name, no sibling. `/mom-test` continues to be the trigger. Existing `SKILL.md` is rewritten to v2. Existing `mom-test-interview-guide.md` is kept as the rules deep-reference. One new file is added for the timed-section scaffolds.

---

## Behavior

### Step 1 — Adaptive intake (replaces the fixed 4-question setup)

Skill receives a spec, brief, or rough idea as input. It parses what is already there, and only asks for what is missing from this canonical list:

1. **Target user** — specific segment, not "users" or "people who struggle with X". Push back once if vague.
2. **Riskiest assumption** — the belief that kills the product if false. This is what the interview must actually test.
3. **Secret solution** — the answer I am hoping to validate. Captured deliberately so it can be stripped OUT of every question and seeded into the Banned Topics list.
4. **Past-behavior pain proof** — what would prove the pain is real (money spent, workaround built, tool already bought). If I cannot name one, flag that the pain may not yet be real.
5. **Domain priority check** — does the target user prioritize this domain at all? Drives the broad opening question.
6. **Interview logistics** — interview count (default: 3), channel (default: scheduled call). Length is always 30 min default.

Rules:
- Skip any item already answered in the spec or brief
- Challenge vague answers on #1 and #2 once before proceeding
- Do not challenge #3-6 unless absent
- Never ask more than 6 intake questions total

### Step 2 — Output artifact (5 sections, always emitted, 30-min default)

#### A. Pre-interview setup

- One-sentence target persona (echoed back from intake #1)
- **List of 3** scariest questions — the three that, if answered, de-risk the assumption most. Each tagged with the specific assumption it tests.
- **Banned topics** — auto-generated from intake #3. Phrases I must not say, comparisons I must not draw, words to swap (e.g. every "would" becomes "did"). This is the most idea-specific section and the highest-leverage one.
- Notebook setup with shorthand pre-drawn at top of page

#### B. Timed interview script (30 min default)

Section breakdown:
- §1 Warm-up & Context (5 min)
- §2 Last-Time Archaeology (10 min) — primary signal section
- §3 Pain & Cost Anchoring (8 min)
- §4 Workarounds & Alternatives (4 min)
- §5 Commitment Test (3 min)

Every question carries this annotation block (the core PM ask):

```
### Question N: <the actual question to say out loud>

**Why we ask:** <ties to assumption #X from intake. 1-2 sentences.>
**What we're discovering:** <the specific signal we want. 1 sentence.>
**How it changes the build decision:**
- If they say <answer pattern A> → <implication for build>
- If they say <answer pattern B> → <implication for build>
- If they can't answer → <implication for build>
**Listen for:** <3-5 concrete tells: dollar figures, named tools, embarrassed pauses, contradictions, specific past incidents>
```

Probes are nested under main questions where relevant. Probes inherit the parent's "Why we ask" — they don't repeat the full annotation block.

#### C. Note-taking shorthand table

Pre-printed for the notebook page header. From the Mom Test guide §7.3:

| Symbol | Meaning |
|---|---|
| ZAP | Pain or friction mentioned |
| GOAL | Job they're trying to get done |
| BLOCK | Obstacle blocking them |
| HACK | Workaround they currently use |
| $ | Money, budget, or cost mentioned |
| REQ | Feature request (dig beneath, never just record) |
| :) | Excited |
| :( | Angry / frustrated |
| :\| | Embarrassed or evasive |
| STAR | Specific past incident (gold) |
| ?! | Contradiction or surprise — follow up |

#### D. Post-interview synthesis template

7 fields to fill within 1 hour while it's fresh:

1. One-sentence summary of their actual workflow today
2. Single biggest friction with a specific past example (if no example, pain is unconfirmed)
3. Quantified cost (hours per week, incidents per quarter, dollars)
4. Current tool stack and what they've rejected
5. Commitment given — what was it, when does it close
6. Did this interview kill or strengthen each of the 3 scariest questions?
7. One quote to remember verbatim

#### E. Multi-interview decision gate

Sized to the interview count from intake #6. Before writing a single line of code, all must be YES:

- [ ] All interviewees cited a specific past incident matching the pain hypothesis
- [ ] All interviewees cited the same top friction (otherwise you're building two products)
- [ ] At least one gave a real commitment (time, reputation, or money)
- [ ] I can describe each interviewee's current workflow from memory in 3 sentences
- [ ] I avoided pitching the idea the entire time across all interviews

Any NO → run one more interview before building.

### Step 3 — Self-check gate (skill runs before delivering output)

The skill must verify every item below. If any fails, fix inline and re-check. Do not deliver until clean.

- [ ] No question names the product, feature, or solution
- [ ] Every question anchored to past or current behavior, never the future
- [ ] No "would" / "could" / "do you think" phrasings anywhere
- [ ] List of 3 actually tests the riskiest assumption from intake #2, not a side detail
- [ ] Commitment ask is real currency (time, reputation, money), not approval
- [ ] Banned topics list is non-empty and specifically tailored to intake #3
- [ ] Every question has all 4 annotation fields populated (Why / What / How / Listen-for)
- [ ] No annotation is generic boilerplate — each must reference the specific assumption being tested

---

## Risks and mitigations

**Risk 1 — Output too rigid.** The 30-min script template may not fit a 15-min cafe chat or a 60-min deep dive.
*Mitigation:* Always emit 30-min default. User explicitly chose "let me trim" over "scale to length". Sections are templates, not contracts.

**Risk 2 — Intake annoys when spec is thorough.** Asking 6 questions after I just pasted a full PRD wastes both our time.
*Mitigation:* Skill skips any item already answered in the spec. Only challenges #1 and #2 if vague. Hard cap of 6 intake questions.

**Risk 3 — Per-question reasoning becomes generic boilerplate.** "Understand their workflow" is not reasoning.
*Mitigation:* Self-check gate fails any reasoning block that does not reference the specific assumption from intake #2. Forces specificity.

**Risk 4 — Banned topics list is too short to actually constrain me.** If the skill just lists 2 obvious words, I'll still slip.
*Mitigation:* Banned topics auto-generated from intake #3 with a minimum of 5 entries: at least 2 phrase patterns, 2 product-name swaps, and 1 comparison to avoid.

---

## File changes

- **Update** `C:\Users\SHUBH SANKALP DAS\.claude\skills\mom-test\SKILL.md` to v2 with the new operating procedure (Step 1 adaptive intake → Step 2 5-section artifact → Step 3 self-check gate)
- **Keep** `C:\Users\SHUBH SANKALP DAS\.claude\skills\mom-test\mom-test-interview-guide.md` as the rules deep-reference, linked from SKILL.md
- **Add** `C:\Users\SHUBH SANKALP DAS\.claude\skills\mom-test\script-templates.md` containing the 5 timed-section scaffolds with empty Why/Discover/Decision/Listen-for slots that the skill fills in per use

---

## Out of scope (cut deliberately)

- Persona generator — I already know who I'm interviewing
- Question scoring or AI feedback loop — over-engineering
- Auto-export to Notion or calendar integration — not what the skill is for
- Live interview transcription or summarization — separate problem
- Multiple language support
- Scaling script duration to interview length — user trims manually

---

## Per-question annotation schema (enforced)

```
### Question N: <the actual question to say out loud>

**Why we ask:**
<1-2 sentences tying back to assumption #X from intake. Specific, not generic.>

**What we're discovering:**
<1 sentence describing the exact signal we want to extract.>

**How it changes the build decision:**
- If they say <answer pattern A> → <specific implication for build>
- If they say <answer pattern B> → <specific implication for build>
- If they can't answer → <specific implication for build>

**Listen for:**
- <concrete tell 1, e.g. specific dollar figure>
- <concrete tell 2, e.g. names of tools they've already rejected>
- <concrete tell 3, e.g. embarrassed pause when asked about cost>
```

This schema is enforced by the self-check gate. Any question missing a field, or with a generic field, fails the gate and gets rewritten before delivery.
