# Mom Test v2 — Interview Script Templates

Scaffolds for the 5 timed sections of the interview script. The skill fills in the question text and the four annotation fields (Why / What / How / Listen-for) based on the user's intake answers. This file defines the structure; SKILL.md defines the rules for filling it in.

Default total runtime: 30 minutes. User trims sections manually if the actual interview slot is shorter.

---

## §1 Warm-up & Context (5 min)

**Goal:** Get them talking about their actual work, not your topic. Anchors them in their world before you zoom in.

**Listen for the whole section:** Whether the domain you care about is even relevant to their week. If they barely touch it, urgency is low and you can stop early.

**Question count:** 2-3.

**Required content per question:**
- The actual question to say out loud
- Why we ask (tied to intake #2 — the riskiest assumption)
- What we're discovering
- How it changes the build decision (2-3 answer patterns)
- Listen for (3-5 concrete tells)

**Required opener:** A broad question that does NOT assume the interviewee prioritizes the domain. This implements the "premature zoom" check from `mom-test-interview-guide.md` §5.

---

## §2 Last-Time Archaeology (10 min) — primary signal section

**Goal:** Extract one concrete story of the last time they faced this problem end to end. This is where Mom Test data actually lives.

**Listen for the whole section:** Whether they have a specific past story at all. If they speak in generics ("I usually...", "I always...") instead of one named incident, the pain may not be real. Anchor them to a specific date or instance — "the most recent time" or "last week."

**Question count:** 3-4 main questions, with 2-3 nested probes under at least one of them.

**Required structure:**
- One anchor question: "Tell me about the last time [specific problem scenario from intake]..."
- Nested probes (inherit parent's "Why we ask"): step-by-step walkthrough, where they did it, what tool, who else was involved, how they knew it was done
- One follow-up that surfaces friction: "What annoyed you about that flow?"
- One follow-up that surfaces gaps: "What did you NOT do that you wish you had?"

---

## §3 Pain & Cost Anchoring (8 min)

**Goal:** Convert vague pain ("it's annoying") into measurable pain (time, money, incidents, reputation, customer impact).

**Listen for the whole section:** Concrete numbers. Hours per week, dollars, ticket counts, named customers, lost deals. If everything stays qualitative, the cost is imagined, not real.

**Question count:** 3-5.

**Required content:**
- One question that anchors to the past-behavior pain proof from intake #4
- One question that asks who told them when it broke (surfaces who actually feels the pain — them, their team, their customer, their boss)
- One question that asks for the cost (money, hours, ticket count, deal impact — let them pick the unit)
- One question on frequency (once a month? a quarter? a year? — distinguishes annoyance from must-solve)
- One question on why they skipped the obvious workaround last time

---

## §4 Workarounds & Alternatives (4 min)

**Goal:** Understand what they already pay (time or money) to solve this, and what they've tried and rejected.

**Listen for the whole section:** Do they have a setup at all, or are they vibe-checking? Have they paid for any tool? Money already spent = real validation. "Nothing" = problem may not be real enough to act on.

**Question count:** 3.

**Required content:**
- One question on the current setup (let them name the tools — don't name yours)
- One question on what they tried before and rejected (and why they stopped)
- One question on what others on their team do differently

---

## §5 Commitment Test (3 min) — the close

**Goal:** Extract a commitment. Words are worthless. Time, reputation, or money is real.

**Listen for the whole section:** "Yes, send me a calendar invite right now" = real commitment. "Sure, sounds great, ping me later" = polite no, mark the interview as a failure. A counter-offer of a smaller commitment = good, take it.

**Format:** Pick ONE of these options based on how the interview went. Do NOT ask all three.

### Option 5.A — Time commitment
[Skill fills: a concrete time ask, e.g. "Can you spend 30 min next week walking me through your actual workflow so I can watch the real flow? I'll bring coffee."]

### Option 5.B — Reputation commitment
[Skill fills: an intro ask, e.g. "Can you introduce me to one other person on your team who also faces this? I want their take too."]

### Option 5.C — Beta commitment
[Skill fills: a beta-use ask, e.g. "If I built a rough prototype in 2 weeks, can you use it on your next real [scenario] and tell me where it fails? No production use, just a side-by-side test against your current flow."]

### Bonus ask (only if they're enthusiastic)
A question that surfaces what the fix is worth in real terms: "What is the worst part of this flow worth fixing, in real terms — time saved per week, or anything you'd ask your manager to pay for?" Above-zero answers are signal. "It depends" or "hard to say" is a polite zero.

---

## Coverage check (run by the skill before delivering)

The skill must verify after generation:

- [ ] Every section has the required minimum question count above (not 0, not 10+).
- [ ] Every question has all 4 annotation fields populated.
- [ ] §2 Last-Time Archaeology has the most questions (this is the primary signal section).
- [ ] §1 has a broad opener that does NOT assume the user prioritizes the domain.
- [ ] §5 has all three commitment options drafted; the user picks at runtime.
- [ ] No question text contains "would" / "could" / "do you think" / the secret solution from intake #3.
