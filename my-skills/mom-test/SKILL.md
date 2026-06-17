---
name: mom-test
description: Use when preparing to interview customers or users, validating a problem or idea, designing discovery or user-research questions, or checking whether interview questions are leading. Triggers on requests like "/mom-test", "help me write interview questions", "is this question leading", or "I'm about to talk to users".
---

# Mom Test Interview Kit Generator (v2)

## Overview

Generate a full interview-ready artifact using Rob Fitzpatrick's Mom Test framework. The output is not a question list — it is a complete document the PM walks into a user interview with: pre-interview setup, a timed 30-min script with per-question reasoning, note-taking shorthand, a post-interview synthesis template, and a multi-interview decision gate.

The job is NOT to template the user's idea into questions. It is to strip the user's solution OUT, isolate the real assumption being tested, then produce an artifact so robust that (a) even a polite interviewee cannot lie and (b) the PM can synthesize within an hour of the call ending.

Core principle: **If any question references the product, feature, or solution, the artifact is contaminated. Restart.**

References in this folder:
- `mom-test-interview-guide.md` — the full Mom Test rules (read for bad-data handling, question transformations, premature-zoom check)
- `script-templates.md` — the 5 timed-section scaffolds this skill fills in
- `design-v2.md` — the design spec for this skill (read if you need to know the why behind any rule)

---

## Operating Procedure

### Step 1: Adaptive intake (max 6 questions, skip what the brief already covers)

The user provides a feature brief, PRD, rough idea, or a description of what they want to interview about. Parse what is already there. Ask ONLY for what is missing from this canonical list:

1. **Target user.** Specific segment, not "users" or "people who struggle with X". A diffuse who produces diffuse questions. **Challenge once if vague.**
2. **Riskiest assumption.** The belief that, if false, kills the product. This is what the interview must actually test. **Challenge once if vague.**
3. **Secret solution.** What the user is hoping interviewees will validate. Captured deliberately so it can be stripped OUT of every question and seeded into the Banned Topics list. **Never let it appear in the output.**
4. **Past-behavior pain proof.** What would prove the pain is real — money already spent, time already spent, workaround already built, tool already bought. If the user cannot name one, **flag in the output that the pain may not be real yet**.
5. **Domain priority check.** Does the target user prioritize this domain at all? Drives the broad opening question in §1 of the script.
6. **Interview logistics.** Count (default 3), channel (default scheduled call). Length is always 30 min default — the user trims manually if their actual slot is shorter.

Rules:
- Skip any item already answered in the brief.
- Challenge #1 and #2 once if vague. Accept #3-6 as given.
- Never ask more than 6 intake questions total.

### Step 2: Generate the full artifact (5 sections, always emitted)

#### A. Pre-interview setup

- **Target persona** — one sentence echoed from intake #1.
- **List of 3 scariest questions** — the three questions that, if answered, de-risk the riskiest assumption most. Tag each with which assumption from intake #2 it tests. If a question could be answered by a Google search, it does not belong here.
- **Banned topics** — generated from intake #3. **Minimum 5 entries:** at least 2 phrase patterns to never say, at least 2 product/solution-name swaps (the word to avoid + a neutral substitute), and at least 1 comparison to never draw. This is the most idea-specific and highest-leverage section.
- **Notebook setup** — instruction to pre-draw the shorthand table at the top of the page.

#### B. Timed interview script (30 min default)

Fill in the 5 sections defined in `script-templates.md`:
- §1 Warm-up & Context (5 min)
- §2 Last-Time Archaeology (10 min) — primary signal section, the most questions go here
- §3 Pain & Cost Anchoring (8 min)
- §4 Workarounds & Alternatives (4 min)
- §5 Commitment Test (3 min)

Every question must carry this annotation block:

```
### Question N.M: <the actual question to say out loud>

**Why we ask:** <1-2 sentences tying to assumption #X from intake. Specific, not generic.>
**What we're discovering:** <1 sentence describing the exact signal.>
**How it changes the build decision:**
- If they say <answer pattern A> → <specific build implication>
- If they say <answer pattern B> → <specific build implication>
- If they cannot answer / dodge → <specific build implication>
**Listen for:**
- <concrete tell 1, e.g. specific dollar figure>
- <concrete tell 2, e.g. named tools they have rejected>
- <concrete tell 3, e.g. embarrassed pause>
```

Schema rules:
- **"How it changes the build decision"** — up to 3 answer patterns. If a question has only 2 meaningful patterns, use 2. Do not pad to 3.
- **Probes** nested under a main question inherit the parent's "Why we ask" — they do not repeat the full annotation block.
- **Every** Why / What / How / Listen-for field must reference the specific assumption from intake #2. Generic boilerplate ("understand their workflow") fails the self-check gate.

#### C. Note-taking shorthand

Emit this table verbatim so the user can pre-draw it at the top of their notebook page:

| Symbol | Meaning |
|---|---|
| ZAP | Pain or friction mentioned |
| GOAL | Job they're trying to get done |
| BLOCK | Obstacle blocking them |
| HACK | Workaround they currently use |
| $ | Money, budget, cost mentioned |
| REQ | Feature request (dig beneath, never just record) |
| :) | Excited |
| :( | Angry / frustrated |
| :\| | Embarrassed or evasive |
| STAR | Specific past incident (gold) |
| ?! | Contradiction or surprise — follow up |

#### D. Post-interview synthesis template

7 fields, filled within 1 hour of the call ending while it's fresh:

1. One-sentence summary of their actual workflow today.
2. Single biggest friction with a specific past example. **If no example, mark pain as unconfirmed.**
3. Quantified cost (hours/week, incidents/quarter, dollars).
4. Current tool stack and what they have rejected.
5. Commitment given — what, when does it close.
6. Did this interview kill or strengthen each of the 3 scariest questions?
7. One quote to remember verbatim.

#### E. Multi-interview decision gate

Sized to interview count from intake #6 (substitute N below). Before writing any code, all must be YES:

- [ ] All N interviewees cited a specific past incident matching the pain hypothesis.
- [ ] All N cited the same top friction (otherwise you're building two products).
- [ ] At least one gave a real commitment (time, reputation, or money).
- [ ] I can describe each interviewee's current workflow from memory in 3 sentences.
- [ ] I avoided pitching the idea the entire time across all N interviews.

Any NO → run one more interview before building.

### Step 3: Self-check gate (run before delivering output)

Verify every item below. If any fails, fix inline and re-check. Do not deliver until clean.

- [ ] No question names the product, feature, or solution.
- [ ] Every question anchored to past or current behavior, never the future.
- [ ] No "would" / "could" / "do you think" phrasings anywhere.
- [ ] List of 3 actually tests the riskiest assumption from intake #2 (not a side detail).
- [ ] Commitment ask is real currency (time / reputation / money), not approval.
- [ ] Banned topics list ≥5 entries and specifically tailored to intake #3.
- [ ] Every script question has all 4 annotation fields populated.
- [ ] No annotation is generic — each references the specific assumption from intake #2.

---

## Quick Reference: bad to good

| Bad (leading / hypothetical) | Good (past behavior / fact) |
|---|---|
| "Do you think this is a good idea?" | "Talk me through the last time this happened." |
| "Would you buy a product that did X?" | "How are you dealing with it now?" |
| "How much would you pay for X?" | "What have you already spent time or money on to fix this?" |
| "What's your dream feature?" | "Why do you bother? What are the implications of that?" |

## Common Mistakes

- **Generating before intake.** The 6 setup questions (minus what the brief already covers) are mandatory. Skipping them is the #1 failure.
- **Letting the solution leak in.** "Would a tool that..." is still leading. Strip it.
- **Accepting a vague who.** Diffuse segment = diffuse questions = unusable data.
- **Closing on approval.** "Looks great, let me know when it launches" is a failed interview. Push for a real currency commitment.
- **Generic annotation fields.** "Understand their workflow" is not a Why. Every annotation must tie back to intake #2 explicitly.
- **Padding to 3 answer patterns.** If a question has only 2 meaningful answer patterns, use 2. Don't fabricate a third.
- **Skipping the multi-interview decision gate.** A single interview's signal is too noisy. The gate exists to keep you from building on N=1.
