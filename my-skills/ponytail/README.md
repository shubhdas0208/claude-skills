# ponytail

Lazy senior-dev mode for Claude Code. Forces the laziest solution that actually
works — simplest, shortest, most minimal — by walking a YAGNI-first ladder
before writing any code.

## What's inside

**Skills** (auto-invoked when relevant):
- `ponytail` — the core lazy-mode skill (lite/full/ultra)
- `ponytail-review` — review a change for over-engineering
- `ponytail-audit` — audit a codebase for bloat
- `ponytail-debt` — surface complexity debt
- `ponytail-gain` — find high-leverage simplifications
- `ponytail-help` — usage reference

**Commands** (you invoke with `/`):
- `/ponytail [lite|full|ultra|off]`
- `/ponytail-review`, `/ponytail-audit`, `/ponytail-debt`, `/ponytail-gain`, `/ponytail-help`

## Install

```
/plugin marketplace add C:\Users\SHUBH SANKALP DAS\.claude\ponytail-marketplace
/plugin install ponytail@ponytail-local
```

## The ladder

Stop at the first rung that holds:

1. Does this need to exist at all? (YAGNI)
2. Stdlib does it? Use it.
3. Native platform feature covers it?
4. Already-installed dependency solves it?
5. Can it be one line?
6. Only then: the minimum code that works.

License: MIT
