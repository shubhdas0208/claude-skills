# Findings format

Every reviewer writes one file: `design-review/round-NN/findings/<command>.json`. The revision agent writes `findings/_revised.json` with `"command": "revise"`. `ledger.mjs validate` enforces all of this, so write it once, correctly.

## File

```json
{
  "command": "typeset",
  "clean": [
    { "screen": "S31", "why": "One type role per job; the confirmation time is the only large numeral." }
  ],
  "findings": [ /* rows, below */ ]
}
```

`clean` lists screens you reviewed and found nothing to fix, each with the reason it holds up. The ledger shows them as the pattern to follow.

## How a row is shown

**One decision, one place.** The ledger turns each row into one self-contained block, always in this order: chips (`sev`, `cmd`, `size`) and `what` as the title · `why`, `fix`, `evidence` · `preview`, then `mock` under it, both open at full size · the decision buttons and the change-request box. There is no summary list above the blocks and no separate comparison section below them, so a row must stand on its own: do not write "see the mock on S04" or "as in the row above". Keep `what` to one sentence and `why` and `fix` short, because the comparison is the argument and long text pushes it off screen.

## Row

```json
{
  "key": "S19::typeset::stat-label-below-floor",
  "screen": "S19",
  "sev": "P0",
  "size": "MINOR",
  "cmd": "typeset",
  "what": "Stat labels 'AGE' and 'CONDITIONS' render at 9px.",
  "why": "Below the 11px floor for an older audience, on the card a doctor reads.",
  "fix": "Move stat labels to the 11px micro-label step.",
  "evidence": "build/19-dose-history.html:142 · .idcard .quad span",
  "touches": ["build/00-head.html"],
  "preview": { "type": "type", "sample": "AGE · CONDITIONS", "nowStyle": "font-size:9px;color:#83857E", "afterStyle": "font-size:11px;color:#83857E;font-weight:600" },
  "mock": null
}
```

| Field | Rule |
|---|---|
| `key` | `<screen>::<cmd>::<kebab-slug>`. The slug names the issue, not the fix, and stays identical if the same issue is found again next round. That is how rejected rows stay gone. |
| `screen` | An `inventory.json` id, or `SYSTEM` for tokens and patterns every screen inherits. |
| `sev` | `P0` blocks or harms · `P1` fix before shipping · `P2` consider · `P3` optional. Consequence, not effort. |
| `size` | `MAJOR` restructures a screen (give it a `mock`) · `MINOR` token, copy, spacing. |
| `cmd` | The command that would fix it, which is not always the reviewer's own: a critique can find a `typeset` problem. |
| `what` | The observable defect in one sentence. |
| `why` | Why it matters to the person using it. Name instances here when one row covers many. |
| `fix` | The change, specific enough to build. |
| `evidence` | Optional. `file:line`, selector, `url @ 390px`, or image filename. |
| `touches` | Paths relative to the project root that building this row would edit. Always `[]` for screenshot inputs. |
| `preview` | Required. One of the five shapes below. Shown in the row's block, right above the decision. |
| `mock` | Optional whole-screen comparison, expected for `MAJOR`. Shown in the same block, under the preview. |

## Preview shapes

**copy**: wording.
```json
{ "type": "copy", "now": "2 of 5 still reading. This opens as soon as matching finishes.", "after": "2 of 5 read. About 20 seconds.", "cap": 40 }
```
To delete a line, set `"after": ""` and `"deleted": true`. `cap` is optional; the ledger colours the count against it.

**type**: one text style. The same `sample` is rendered with each style string.
```json
{ "type": "type", "sample": "NEXT CHARGE", "nowStyle": "font-size:9.5px;letter-spacing:.1em", "afterStyle": "font-size:11px;letter-spacing:.13em;font-weight:600", "dark": false }
```

**html**: a component or region, rendered inside a shadow root with `product.css` applied.
```json
{ "type": "html", "now": "<div class=\"card soft\">…</div>", "after": "<div class=\"card\">…</div>", "motion": false }
```
- Use the product's own classes and `var(--token)` values. Add a wrapper element if the product's selectors need one (e.g. `<div class="phone">`).
- Fragments may include a `<style>` block, which stays scoped to that preview. `<script>`, iframes and `on*` attributes are stripped.
- `"now": ""` means the thing does not exist today.
- `"motion": true` adds a Replay button. Put the `@keyframes` in the fragment's own `<style>`.

**metric**: numbers you can't see.
```json
{ "type": "metric", "label": "LCP (mobile, 4G)", "now": "4.1 s", "after": "≤ 2.3 s", "basis": "measured" }
```
`basis` is `measured` only when "now" came from a real measurement this round.

**code**: last resort, when nothing visual changes.
```json
{ "type": "code", "lang": "css", "now": "img { }", "after": "img { width: 640px; height: 360px; }" }
```

## Mock (whole-screen comparison)

```json
{
  "id": "m-home-card-stack",
  "title": "Home: one card family instead of four",
  "note": "Same content, one surface, rhythm from spacing instead of borders.",
  "frame": "phone",
  "now": "<div class=\"screen\">…whole screen today…</div>",
  "after": "<div class=\"screen\">…whole screen proposed…</div>",
  "motion": false
}
```
- `frame`: `phone` (up to 380px wide), `desktop` (rendered at 1280px and scaled to fit, with a "Stack to enlarge" control), `none`.
- The mock is drawn inside the block of the row that carries it, under that row's preview and above its decision buttons. It is never moved to a separate section and never reduced to a link or thumbnail.
- Several rows may point at the same mock `id` when one comparison proves them all. The markup must be identical in each, and the ledger draws it again in every one of those blocks, so each row can be decided without leaving it.
- Use whole-screen markup. A mock exists because a fragment can't show the change.
