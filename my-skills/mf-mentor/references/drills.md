# Drill Engine — ask first, explain after

The user's standing instruction: they are learning to analyse; their attempt ALWAYS precedes your explanation. This file is the protocol. Violating it in a friendly way is still violating it.

## The loop (per checklist row / metric)

1. **Numbers first.** Fund value AND its comparison context (category average / benchmark, same window) must exist in `metrics.json`. Missing → ONE fetch request via platform-map.md (source + exact tab + what to read out). No verdicts on missing context — ever.
2. **Check `mastery.json`.** Level ≥4 → show the numbers, ask only "your read?" (no scripted question, no card unless asked). Level <4 → scripted question from the bank below. File missing/unreadable → treat every metric as level 0.
3. **User attempts.** Wait. Do not hint at the answer in the question. Do not "confirm their direction" before they commit.
4. **Grade together.** Compare their attempt against the card's "Strong answer mentions" bullets. Propose: got-it / partly / missed — one line of why — user confirms. Update `mastery.json` (rules in schemas.md).
5. **Reveal.** Level <3: the full explain-card content, connected to THIS fund's numbers. Level ≥3: one-line takeaway + "expand?".
6. **Record** in `worksheet.md` (question, attempt verbatim, grade, card ref).

## Rush protocol — "just tell me", "I'm in a rush", "teach me later"

This is the tested failure mode. The compliant sequence:

1. Acknowledge, then offer the **micro-drill**: ONE question on the single most decision-relevant metric for this fund (you pick it), ~2 minutes. Most rushes accept this.
2. If declined: give the read — every claim citing verdict-rules.md, no comparisons without fetched context — and then, without fail:
   - mark all bypassed rows `SKIPPED (rush)` in the worksheet, zero mastery credit;
   - add a `drill-redo` nudge for the next session;
   - say one line: "Logged as untaught — we redo this properly next session."
3. **Two consecutive rushed sessions** → open the next session by naming the pattern (`pattern-flag` nudge). The mentor's job is to outlast moods, not to win each argument.

Invalid rationalizations (from baseline testing, verbatim): "respecting an explicit request is good mentorship" · "forcing questions would be rigid/patronizing" · "I'll teach while answering". The standing instruction to teach IS the user's explicit request; a mood does not override it — the micro-drill + logged skip is how both are honored.

## Stuck protocol
"I don't know" ≠ failure. Hint ladder: (1) point at what to compare ("SD means nothing alone — what's the category number next to it?"), (2) narrow the question, (3) reveal, grade `missed`, kindly. Never let stuck escalate to you just lecturing for the rest of the session — next metric returns to the loop.

## Question bank (templates; {f}=fund value, {c}=context value)

- **sd**: "SD {f} vs category avg {c}. What personality does that imply — and is the risk being paid? (Look at mean/Sharpe before answering.)"
- **sharpe**: "Sharpe {f}, category {c}. What is this number actually dividing, and what does the gap vs peers tell you?"
- **sortino**: "Sortino {f} vs Sharpe {s}. What does the SIZE of the gap between them reveal about how this fund wobbles?"
- **beta**: "Beta {f}. In a −10% market month, what do you expect this fund to do — and is that a quality or a personality?"
- **r-squared**: "R² is {f}. How much should we trust the beta/alpha we just discussed?"
- **alpha**: "Alpha {f}. What exactly did the manager add beyond market exposure — and what two caveats apply before you believe it?"
- **mean-vs-cagr**: "Mean here is {f} but 3-yr CAGR shows {c}. Why don't they match, and does it matter?"
- **trailing**: "1-yr is {f}, 5-yr {c}. Which of these deserves weight for selection, and what bias do both share?"
- **rolling**: "Rolling 3-yr: average {f}, minimum {c}. What question does the MINIMUM answer that no trailing table can?"
- **aum**: "AUM ₹{f} Cr in a {category} fund. Is size a tailwind, neutral, or the enemy here — and why does category decide?"
- **ter**: "TER {f}% vs category median {c}. Why is this the single most predictive number on the sheet?"
- **exit-load**: "Exit load {f}. For YOUR horizon, does this matter — and what is a stiff load actually telling you about the fund's intended clientele?"
- **turnover**: "Turnover {f}% for a {style} fund. Metabolism read: conviction, rotation, or churn — and what would make this a flag?"
- **age-tenure**: "Fund age {f} yrs, manager since {c}. How much of this track record actually belongs to the current driver?"
- **cap-split**: "Label says {category}; split is {f}. Does the label survive contact with the portfolio?"
- **top10**: "Top-10 = {f}%. Concentrated conviction or diversified hug — and which risks come with this one?"
- **sector**: "Biggest overweight vs benchmark: {f}. What implicit call is the manager making, and is that where the alpha comes from?"
- **cash**: "Cash at {f}%. What does persistent cash this size do in crashes vs melt-ups?"
- **overlap**: "Overlap with {other}: {f}%. At what point are you buying the same portfolio twice, per your bar?"
- **calendar-stress**: "2020: {f}. 2022: {c}. What do the stress years say that the 5-yr CAGR hides?"
- **ytm-debt**: "YTM {f}%, TER {c}%. What return is this fund TELLING you to expect — and what would an outlier YTM vs peers mean?"
- **duration-debt**: "Duration {f} yrs against your {horizon} horizon. Match or gamble?"
- **ratings**: "VR {f}★, Morningstar {c}★. What is a star mathematically — and what is it for in OUR process?"

## Quiz mode
Same loop, stakes-free, on past `metrics.json` data or the handbook's five-fund worked example (§11.8). Grades update mastery normally. Prefer metrics with the lowest mastery levels; 5 questions per round, then STATUS mastery snapshot.
