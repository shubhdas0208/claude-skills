# Preparing a round

The reviewers only see what you put in the round folder, so everything here happens in the main session before any agent launches. Each agent then works from the same inventory and tokens, which keeps keys and mocks consistent across commands.

## 1. Classify the input

| Kind | You were given | Source to edit on build | Detector |
|---|---|---|---|
| `html` | A `.html` file or a built prototype (possibly many screens in one file) | The file, or the partials it is built from if a build script exists | `detect.mjs --json <file>` |
| `code` | A route, page, component, or app folder in a React/Next/Vue/Svelte/etc. project | The components, styles and tokens behind it | `detect.mjs --json <dir-or-files>` |
| `url` | A running dev server or deployed site | The repo behind it **if** it is in this workspace; otherwise none (treat as `images` at build time) | `detect.mjs --json <url>` plus `--viewport 390x844` |
| `images` | Screenshots, PNG or JPG | None. Builds are skipped; approved rows become a spec | none |

When a live URL and its source are both available, pass `--kind code` with the source path as target, and use the URL only for captures and measurements.

## 2. Resolve Impeccable context

Run once per session from the project root:

```bash
node "<impeccable-base-dir>/scripts/context.mjs" --target "<target-path>"
```

If it reports no PRODUCT.md / DESIGN.md, ask with AskUserQuestion. Offer two options, "Run impeccable init first" and "Infer and state assumptions", and don't recommend either:

- **Init:** invoke the `impeccable` skill with `init`, let it finish, then continue here. Do not rerun context.mjs; init loads what it wrote.
- **Infer:** read the UI and tokens, then write the inferred audience, platform, tone and constraints as short sentences into `round.json` → `assumptions`. The ledger folds them into the one-line "About this round" above the first block, where the user opens them to correct them.

Write `round-NN/context.md`: a compact summary of what context.mjs resolved (product, users, register, brand constraints, surface mode, any copy contract or length budget, platform), plus the assumptions if any. Reviewers read this instead of rerunning setup.

## 3. Write the inventory

`round-NN/inventory.json`, validated by `ledger.mjs build`:

```json
{
  "project": "Voxikin",
  "screens": [
    { "id": "S01", "name": "Sign up", "purpose": "Caregiver proves they are reachable, once.", "area": "Onboarding", "source": "build/03-signup.html" }
  ]
}
```

- `id`: short, stable, no spaces. Reuse the product's own screen ids when they exist, since keys are built from them and must survive across rounds.
- `area` groups rows in the ledger, in first-seen order. Use the product's own sections (Onboarding, Settings, Checkout…).
- `purpose`: who does what here, in one line.
- `source`: file(s), route, URL, or screenshot path. Reviewers open it.
- Round 2+ starts with last round's copy. Add screens a build created; never renumber existing ones.
- For a codebase, derive screens from the router (pages/app directory, route table). For a big app, have one `Explore` agent list them first.

## 4. Extract product.css

`round-NN/product.css` is what makes the mocks look like the product. Include:

- Every design token (`:root` custom properties): colour, type, spacing, radii, shadows.
- Font loading (`@font-face` or `@import` from Google Fonts). The ledger hoists these to the page.
- The atoms the screens are built from: buttons, cards, inputs, chips, rows, headings, and the screen wrapper.
- Nothing global that would fight a fragment. `:root`, `html` and `body` selectors are rewritten to the shadow host, so keep base typography there.

Sources: the prototype's `<style>` blocks, the Tailwind config plus compiled utilities actually used, CSS modules, theme files, design-token JSON. For Tailwind, write the resolved values as plain classes. The mocks cannot run a build step.

For `images`, infer tokens from the screenshots (sampled colours, estimated sizes) and mark the file's first line `/* inferred from screenshots */`.

## 5. Evidence the reviewers can't gather themselves

- **Detector** (html, code, url): `node "<impeccable-base-dir>/scripts/detect.mjs" --json <target> > round-NN/detector.json`. Put the total into `round.json` → `detectorCount`. The critique agent reads it last.
- **Captures** (url, and html/code when a dev server or file renders): with the Browser tools, screenshot each inventory screen at 1280px and 390px wide into `round-NN/captures/<id>-<width>.png`. Only needed for `url`, or when the selected commands include adapt, audit, polish or optimize.
- **Measurements** (audit, optimize, and a renderable target): collect what the browser can report (navigation and paint timings, LCP entry, CLS, transfer sizes, JS/CSS bytes, image dimensions vs. rendered size) into `round-NN/measurements.json` with the viewport and network conditions noted. Only these values count as `measured`.

## 6. Round notes

Before building the ledger, fill `round.json`. **One decision, one place:** nothing above the ledger may restate or summarise the suggestions. Each suggestion is read and decided in its own block, so the top of the page stays a title, one line of description, one line of counts and the filters.

- `notes`: `[{ "tone": "plain|saf|crit", "title": "…", "body": "…" }]`. Honest caveats about how the review was done, which the user needs in order to judge the rows, e.g. "The reviewers for S14 onward worked from source, not rendered pixels." Keep it to two or three. Never use a note to list, rank or summarise findings, or to describe the comparisons. `plain` and `saf` notes fold into the one-line "About this round"; only `crit` stays open, so keep `crit` for things that change how every block should be read (a reviewer that failed, a scan that could not run).
- `headline` / `dek`: leave `null` for the defaults unless the round has a sharper story. The `dek` is one line, 160 characters at most, naming the scope of the round ("Home and the three tabs, reviewed for clutter"). It never says what was found. `ledger.mjs build` warns when it runs long.
- `scores`: optional `[{ "label": "Health", "value": "28/40" }]` from audit or critique.
