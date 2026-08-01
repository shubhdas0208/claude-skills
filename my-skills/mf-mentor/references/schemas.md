# Workspace Schemas

Root: `C:\Users\SHUBH SANKALP DAS\Desktop\Building\mf-mentor\workspace\`
Never invent fields outside these schemas. Unknown value = `null`, never a guess. All dates ISO `YYYY-MM-DD`.

## profile.md (frontmatter)
`name, setup_complete, tax_regime (old|new), risk_tolerance_notes, standing_preferences {plan_type, option}, git_snapshots_approved (bool), created`

## goals/goal-NN.md (frontmatter + prose)
```yaml
id: goal-01
name: Long-term wealth
horizon_years: 15
target_year: 2041
risk_capacity: high        # low|moderate|high + reasoning in body
risk_tolerance: moderate   # from drawdown question; body records the answer verbatim
governing: moderate        # LOWER of capacity/tolerance — this one rules
allocation: {equity_pct: 70, debt_pct: 30}
category_plan: ["Index/Large-cap core", "Flexi-cap core", "Mid-cap satellite"]
status: active
```
Body: goal story, capacity reasoning, tolerance answer, glide-out plan (start shifting to debt 2–3 yrs before target_year).

## portfolio.json
```json
{ "version": 1, "goal_refs": ["goal-01"],
  "slots": [{
    "id": "slot-core-index", "goal": "goal-01", "role": "core",
    "category": "Index (Nifty 50)", "target_pct_of_equity": 40,
    "status": "empty",   // empty|researching|thesis-written|bought
    "fund": null,         // or {"name": "...", "slug": "..."}
    "thesis_ref": null, "notes": ""
  }],
  "rules": { "max_funds": 6, "min_funds": 3, "overlap_bar_pct": 33, "satellite_requires_thesis": true } }
```

## research/<slug>/metrics.json
```json
{ "fund_name": "", "slug": "", "category": "", "plan": "Direct Growth",
  "as_of": "", "sources": ["VR screenshot 2026-08-01"],
  "metrics": {
    "sharpe_3y": {"value": 0.87, "source": "screenshot"},
    "ter_pct":   {"value": 0.63, "source": "typed"},
    "alpha_3y":  {"value": null, "source": null, "gap": true}
  },
  "context": { "category_avg_sd_3y": {"value": null, "source": null, "gap": true} } }
```
- `source`: `screenshot` | `typed` | `assumed` (metadata only — never for metrics)
- `typed` means the user manually keyed the number — typing it into chat counts; the forcing function is their hand on the number, not any particular input box
- **Critical fields — must be `typed` by the user even if visible in a screenshot:** `ter_pct`, `sd_3y`, `alpha_3y`, `exit_load`
- Standard metric keys: `mean_3y sd_3y sharpe_3y sortino_3y beta_3y alpha_3y r_squared ter_pct turnover_pct aum_cr exit_load fund_age_yrs manager_since ret_1y ret_3y ret_5y ret_7y ret_10y cal_2020 cal_2022 cap_large_pct cap_mid_pct cap_small_pct top10_pct cash_pct` (debt: `ytm_pct mod_duration_yrs credit_sov_aaa_pct`). Extend only when a real number needs a home; keep the `{value, source}` shape.
- `context` keys mirror metrics with `category_avg_` / `benchmark_` prefixes.

## research/<slug>/worksheet.md
Per drill row, append:
```
### <metric> — YYYY-MM-DD
Q: <question asked>
A (user, verbatim): <their attempt — or SKIPPED (rush)>
Grade: got-it | partly | missed | skipped   (user-confirmed)
Card: explain-cards/<slug>.md · Notes: <anything load-bearing>
```

## theses/<slug>.md
```yaml
fund: "", slug: "", slot: "", status: draft   # draft|final|killed
decided_on: null, next_review: null
```
Body sections (exact headings): `## Thesis` (3 sentences: role+evidence / expected outcome / kill criteria), `## Kill criteria` (bulleted, testable), `## Sparring log` (append-only), `## Review log` (append-only).

## journal/temptations.md — append-only, format defined in the file header.

## reviews/YYYY-QN.md or YYYY-annual.md — from templates/.

## mastery.json
`metrics: { "<metric>": {"level": 0-5, "streak": n, "last": date} }`
got-it → streak+1; streak 3 → level+1, streak 0. partly → streak 0. missed → level−1 (min 0), streak 0. skipped → untouched + drill-redo nudge.
Level ≥3: reveal collapsed (one-liner + offer expand). Level ≥4: skip scripted question; free-form note only.

## nudges.json
`nudges: [{ "id", "type": "review-due|cold-review|drill-redo|kill-watch|pattern-flag", "due", "ref", "message", "status": "active|done" }]`

## STATUS.md — regenerate from templates/status-template.md at every session end. Never hand-edit history into it; it is a projection of the other files.
