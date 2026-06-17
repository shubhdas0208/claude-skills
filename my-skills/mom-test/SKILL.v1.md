---
name: mom-test
description: Use when preparing to interview customers or users, validating a problem or idea, designing discovery or user-research questions, or checking whether interview questions are leading. Triggers on requests like "/mom-test", "help me write interview questions", "is this question leading", or "I'm about to talk to users".
---

# Mom Test Question Generator

## Overview
Generate non-leading customer interview questions using Rob Fitzpatrick's Mom Test framework. The job is NOT to template the user's idea into questions. It is to strip the user's solution OUT, isolate the real assumption being tested, then produce questions anchored to past behavior so even a polite interviewee cannot lie.

Core principle: **If the questions reference the product, idea, or solution, they are contaminated. Restart.**

Deep reference: `mom-test-interview-guide.md` in this skill folder. Read it when you need the full rules, bad-data handling, or the question-transformation table.

## Operating Procedure

### Step 1: Interrogate the user FIRST (do not skip)
Before generating anything, ask these four questions and wait for answers. Do not generate questions until all four are answered, because without them the output will be leading or aimed at the wrong person.

1. **Who exactly is the user?** Push for a specific segment, not "people who struggle with X". A diffuse "who" produces diffuse questions.
2. **What assumption, if false, kills this?** This is the riskiest belief. It is what the interview must actually test.
3. **What solution are you secretly hoping they validate?** Capture this so it can be deliberately stripped OUT of every question. Never let it appear in the output.
4. **What concrete past behavior would prove the pain is real?** (e.g. money spent, time spent, a workaround built, a tool already bought). If they cannot name one, flag that the pain may not be real yet.

If the user's answer to #1 or #2 is vague, challenge it once and ask again. Do not proceed on fluff.

### Step 2: Check for the premature zoom
If the assumption (#2) presumes the user already cares about the domain, add a broad opening question that tests whether the domain matters at all before zooming into the specific problem. See section 5 of the reference. Skipping this produces questions that assume a priority the interviewee may not have.

### Step 3: Generate the full interview kit
Output these five sections, in this order:

1. **List of 3** — the three scariest, most important questions that, if answered, de-risk the assumption most. If a question could be answered by a Google search, it does not belong here.
2. **Good questions** — 5 to 8 non-leading questions anchored to specific past events ("Talk me through the last time..."), current workarounds, and the cost/implications of the problem. Map them loosely to the assumption from #2.
3. **Avoid these** — 3 to 5 leading questions specific to THIS user's idea, showing the exact way their solution would leak in (compliment-bait, hypotheticals, "would you pay"). This is the most valuable section because it is tailored to their blind spot.
4. **Commitment ask** — one concrete advancement to close on (time, reputation, or money), not a wishy-washy "let me know when it launches".
5. **Note-taking reminder** — the shorthand signals to capture live (lightning = pain, goal = job-to-be-done, box = obstacle, arrow = workaround, $ = money, check = feature request).

### Step 4: Self-check before delivering
Run the output against this gate. If any check fails, fix it before showing the user.
- Does any question name the product, feature, or solution? If yes, rewrite it.
- Is every "good question" anchored to the past or to current behavior, not the future?
- Does the "List of 3" test the assumption from Step 1 #2, not a side detail?
- Is the commitment ask a real currency (time/reputation/money), not approval?

## Quick Reference: bad to good
| Bad (leading / hypothetical) | Good (past behavior / fact) |
|------------------------------|------------------------------|
| "Do you think this is a good idea?" | "Talk me through the last time this happened." |
| "Would you buy a product that did X?" | "How are you dealing with it now?" |
| "How much would you pay for X?" | "What have you already spent time or money on to fix this?" |
| "What's your dream feature?" | "Why do you bother? What are the implications of that?" |

## Common Mistakes
- **Generating before interrogating.** The four setup questions are mandatory. Skipping them is the #1 failure.
- **Letting the solution leak in.** "Would a tool that..." is still leading. Strip it.
- **Accepting a vague "who".** Diffuse segment = diffuse questions = unusable data.
- **Closing on approval.** "Looks great" is a failed meeting. Push for a commitment.
