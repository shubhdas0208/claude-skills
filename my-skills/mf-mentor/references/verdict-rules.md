# Verdict Rules — quote these, never vibe

Every verdict-shaped statement must cite a rule from this file AND have the underlying numbers (fund + category/benchmark, same window) present in `metrics.json`. Missing context numbers → no verdict; send the user to fetch (platform-map.md).

## Iron rules of comparison (§2.1)
1. Every metric is meaningful only within a category, against category peers/average, same window.
2. Category choice matters more than fund choice.

## What "good" looks like — equity, 3-yr window (§5.7; recalibrate against current category spread)
| Metric | Weak | Acceptable | Strong |
| --- | --- | --- | --- |
| Sharpe | < 0.4 | 0.4–0.8 | > 0.8–1.0 |
| Sortino | < 0.6 | 0.6–1.2 | > 1.2 |
| Alpha | < 0 | 0–3 | 3+ sustained (episodic 12 ≠ sustained 4) |
| SD | ≫ peers unpaid | ≈ peers | ≤ peers with ≥ peer returns |
| Beta | contradicts mandate | 0.8–1.1 typical | matches stated personality |

Beta/alpha need R² > ~80 to be trusted; R² < ~70 → "statistically mushy," say so.

## Category SD ranges (§4.3, annualized, India recent)
liquid 0.5–1 · short-duration 1–2 · conservative hybrid 4–6 · aggressive hybrid 9–12 · large-cap 12–15 · flexi 12–16 · mid-cap 15–18 · small-cap 17–25+

## AUM zones (§6.1) — category decides the reading
- < ~₹500 Cr: viability/key-person questions
- ~₹1,000–20,000 Cr: comfort zone for active equity
- Very large: nearly free in large-cap/liquid; **the enemy in small/mid-cap** (past returns were earned by a smaller fund that no longer exists)
- Flows: AUM growing ≫ NAV = hot inflows (alpha risk in cap-constrained categories); AUM shrinking while NAV rises = exodus, ask why

## Costs (§6.2, direct all-in)
index 0.05–0.25 · active equity 0.4–1.0 · debt 0.2–0.6 · liquid < 0.25. Direct active equity at 1.5%+ needs an extraordinary excuse. Expense is the single most predictive metric — lower wins.

## Turnover (§6.5) — read with the style
single digits/teens = buy-and-hold · 50–100% fine for value-rotation styles · 150%+ in a plain diversified fund = yellow flag · a SPIKE vs the fund's own history = ask why (manager change? drift? panic?)

## Debt rules (§2.4, §8.2)
- Expected return ≈ YTM − TER. No mystery.
- Outlier-high YTM vs peers = hidden credit risk. In debt, unusual return is a RISK signal, not skill.
- Duration matched to horizon; default credit posture ≥90% sovereign+AAA; one issuer at 8–10% of a credit-tilted book = concentration flag.

## Interpretation matrix (§5.6) — combinations of changes
| Observation | Most likely story | Move |
| --- | --- | --- |
| Return ↑, SD flat, Sharpe ↑ | Efficient improvement | Confirm with rolling returns |
| Return ↑, SD ↑ faster, Sharpe ↓ | Bought returns with risk | Check portfolio for style drift |
| Return flat, SD ↓, Sharpe ↑ | De-risking | Verify not closet-indexing (alpha→0, R²→95+) |
| Beta ↑ over periods | Manager getting aggressive | OK if mandated; flag if "conservative" fund |
| Alpha ↓ as AUM balloons | Size killing alpha | Does the edge still exist at this size? |
| Sharpe great, Sortino barely higher | Symmetric volatility | Prefer peer with fatter Sortino gap |
| Dashes at 3Y/5Y (young fund) | Unproven | "No data" is data — wait or size tiny |
| Whole category's Sharpe collapses | Market regime | Judge relative position only |

## Red flags — any one = stop and investigate (§11.9)
Returns wildly above category with no style reason · debt fund with outlier YTM · SD/beta inconsistent with label · manager exit within a year · AUM collapsed or 5×'d in 2 yrs · turnover spike vs own history · NFO marketing · anyone selling a Regular plan · "flexi-cap" that is 85% large-cap (label-truth check via cap split) · closet indexer (sector ≈ benchmark, alpha ≈ 0, R² ≈ 95+) → index performance at active prices: sell.

## Evidence hierarchy (§8.3) — weight claims accordingly
1. Costs (strong) → 2. Category choice (definitional) → 3. Process discipline: stable mandate/team/size (moderate) → 4. Past risk-adjusted performance (weak; eliminates losers, doesn't crown winners) → 5. Ratings/recent returns/checklists (screening only).

## Ratings usage (§7)
3★+ as a FLOOR filter, never a ranking. Two independent raters agreeing (VR + Morningstar) > either alone. Stars predict expenses/survivorship more than future returns.
