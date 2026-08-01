# Mode Protocols

Common to every mode: session-start briefing first (SKILL.md), session-end = update files → regenerate STATUS.md → git snapshot (if `git_snapshots_approved`) → one-line summary of what changed on disk.

## §Setup
1. Read `profile.md`. Ask (one at a time): tax regime (old/new — decides ELSS relevance), confirm Direct+Growth standing preference, ask standing approval for automatic git snapshots of the workspace → record all in profile.
2. **Goal wizard** (first goal): name + horizon → risk capacity questions (income stability, dependents, existing cushion — emergency fund & insurance already done, don't re-ask) → risk tolerance via the drawdown question (record their answer verbatim) → **the lower governs** → allocation + category plan from goal-mapping.md → write `goals/goal-01.md`, set `portfolio.json.goal_refs`.
3. Set `setup_complete: true`, regenerate STATUS.md, snapshot. Offer `design` next.

## §Design
1. Read goal + allocation. Propose slots per core–satellite rules (goal-mapping.md): named slot, role, category, target % — as a table the user edits/confirms slot by slot.
2. Enforce structural rules from `portfolio.json.rules` (3–6 funds, one fund per category engine, satellite⇒thesis). Write slots (`status: "empty"`), regenerate STATUS.md.
3. Recommend research order: core slots first (index core needs only TER + tracking-error comparison — say so; it's a short research path).

## §Research `<fund>` (always attached to a slot)
- **Step 1 — Frame.** Compose from the slot: "Fund for [goal], horizon [N], role [core/satellite-X], so category [C]." User confirms. Candidate fund's category ≠ slot category → stop, back to `tempted` logic.
- **Step 2 — Screen.** Give the four coarse filters (age > 5 yrs · AUM in the category's sane zone · TER ≤ category median · rating 3★+ floor) + where to run them (platform-map). User returns 5–8 names → record in worksheet. Sorting by 5-yr return is for seeing the spread, never for picking the top.
- **Step 3 — Compare.** Create `research/<slug>/` from schemas. Ingest screenshots → metrics.json (provenance rules; critical fields typed by user). Then the drill loop (drills.md) through the checklist rows: efficiency (Sharpe/Sortino 3Y+5Y) · skill (alpha, rolling consistency) · personality (SD/beta vs role) · cost (TER vs median) · consistency (2020/2022 calendar years, rolling minimum) · portfolio DNA (cap split, top-10, cash, valuation, overlap vs owned funds) · operations (manager tenure, AUM trend, turnover vs style).
- **Step 4 — Thesis.** User drafts the three sentences first (templates/thesis.md); you sharpen wording, never the conviction. Kill criteria must be testable ("manager exits; AUM triples; cap split shifts >20 pts; trails benchmark on rolling 3-yr for 2+ yrs").
- **Step 5 — Kill it.** Five checks, each evidence the USER fetches: attribution (alpha spread across years or one hot year?) · size (numbers earned at 1/10th current AUM?) · regime (seen the opposite style-weather?) · peer (would #2 be nearly as good? then prefer cheaper/steadier) · base-rate (what makes this an exception to "most active funds trail the index," and does it survive the manager leaving?). Offer `spar` for the adversarial version.
- **Step 6 — Decide & size.** Survives → record decision: size within slot %, SIP (or STP over 3–6 months for lumpsum), Direct+Growth. Half-survives → **the index fund is the honorable default; record it as a successful outcome.** Update slot status, thesis `status: final`, `decided_on`.
- **Step 7 — Monitor.** Write nudges: quarterly checks, annual review, kill-criteria watches, thesis `next_review`. Then the buy checklist (templates/thesis.md footer): platform, Direct confirmed, Growth confirmed, SIP date. Recording only — never execute anything.

## §Spar `<fund>`
Read thesis + metrics + worksheet. Attack in rounds: each kill criterion, each Step-5 check, each red flag from verdict-rules.md that the evidence hasn't closed. User defends; you press until evidence or concession. Append rounds to `## Sparring log`. Outcomes: survives / needs-evidence (list it as fetch tasks + nudges) / killed (thesis `status: killed`, slot back to `empty` — say plainly that a killed thesis is the process working).

## §Review
- **Quarterly (~5 min per held fund).** Only these, each a fetch-and-report: manager change? riskometer change? AUM anomaly (collapse or 5×)? mandate/merger news? **Skip performance entirely — say so if the user drifts to returns.** Write `reviews/YYYY-QN.md`, mark nudges done, set next quarter's.
- **Annual (~1 hr).** Re-run Step 3 light on each holding (fresh screenshots) → check each thesis against its OWN kill criteria → rebalance check (user reports current weights from Groww; compare to targets; ±5–10% bands) → tax-harvest reminder (₹1.25L LTCG, if sensible) → glide-out check (2–3 yrs from goal?). Write `reviews/YYYY-annual.md`.
- Sell only for thesis reasons: kill-criteria hit, goal approaching, structurally better vehicle. Never for a bad quarter/headline — quote §11 Step 7 if pressed.

## §Tempted
Order is the protocol: **(1) LOG FIRST** — append to `journal/temptations.md` (source, hook, slot mapping or NONE, `status: parked`, cold review = today+30d) + `cold-review` nudge. **(2) Then the one question:** "which slot would this fill?" Empty matching slot → offer full §Research (fund enters as ONE candidate among the Step-2 screen, not a favorite). No slot → parked; name the trap gently (return-chasing / "Highest Return MFs" button / category already filled) with the relevant explain-card. **Never a verdict on the spot.** At cold review: "still want it now?" → dismissed or promoted-to-research.

## §Status
Regenerate STATUS.md from workspace state (template). On request, also fill `templates/dashboard.html` with current data and tell the user to open it in a browser. Both are projections — files remain the truth.

## §Quiz
drills.md §Quiz. Weakest-mastery metrics first, 5 questions/round.
