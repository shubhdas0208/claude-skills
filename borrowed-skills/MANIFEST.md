# Borrowed skills — manifest

Generated: 2026-06-17
Updated: 2026-07-13 — six third-party skills are now vendored in full (see table below) as a backup against pack reinstalls.

A catalogue of skills/commands installed locally under `~/.claude/` that were
NOT hand-authored as part of this repo. They mostly come from installed packs
(gstack, ECC, Matt Pocock). Listed here as a record rather than copied in full,
since they are re-installable and third-party.

## Vendored in this folder (full copies)

| Folder | Source | What it does |
|--------|--------|--------------|
| `brainstorming/` | superpowers plugin v5.1.0 | `/brainstorm` — explores intent, requirements, and design before any creative work |
| `writing-plans/` | superpowers plugin v5.1.0 | `/writing-plans` — turns a spec into a step-by-step implementation plan |
| `ponytail/` | ponytail plugin v1.0.0 (full plugin: 6 skills + 6 commands) | `/ponytail` — "lazy senior dev" mode; forces the simplest, shortest solution that works (YAGNI ladder; lite/full/ultra intensities) |
| `improve/` | improve plugin v1.0.0 | `/improve` — codebase and architecture improvement workflow (audit playbook, plan template) |
| `drawio-skill/` | 365-skills drawio plugin v1.14.0 | draw.io architecture flowcharts and diagrams (shape index, autolayout scripts) |
| `ui-ux-pro-max/` | gstack | `/ui-ux-pro-max` — UI/UX design pro workflow |

## How to reclaim your own

If any item below is actually one YOU wrote, tell me the name and I will move
its full folder into `../my-skills/`. (Authored vs installed cannot be told
apart on disk because gstack installs into the same `~/.claude/skills/` folder.)

## ECC plugin

~/.claude/skills/ECC/ — the everything-claude-code plugin: **105** nested skills plus agents/rules/commands. Managed by its own installer; not enumerated individually here.

## Top-level skills (67)

- [ ] autoplan
- [ ] benchmark
- [ ] benchmark-models
- [ ] browse
- [ ] canary
- [ ] careful
- [ ] caveman
- [ ] codex
- [ ] context-restore
- [ ] context-save
- [ ] cso
- [ ] design-consultation
- [ ] design-html
- [ ] design-review
- [ ] design-shotgun
- [ ] devex-review
- [ ] diagnose
- [ ] document-generate
- [ ] document-release
- [ ] freeze
- [ ] grill-me
- [ ] grill-with-docs
- [ ] gstack
- [ ] gstack-upgrade
- [ ] guard
- [ ] handoff
- [ ] health
- [ ] improve-codebase-architecture
- [ ] investigate
- [ ] ios-clean
- [ ] ios-design-review
- [ ] ios-fix
- [ ] ios-qa
- [ ] ios-sync
- [ ] land-and-deploy
- [ ] landing-report
- [ ] learn
- [ ] make-pdf
- [ ] office-hours
- [ ] open-gstack-browser
- [ ] pair-agent
- [ ] plan-ceo-review
- [ ] plan-design-review
- [ ] plan-devex-review
- [ ] plan-eng-review
- [ ] plan-tune
- [ ] prototype
- [ ] prototype-mp
- [ ] qa
- [ ] qa-only
- [ ] retro
- [ ] review
- [ ] scrape
- [ ] setup-browser-cookies
- [ ] setup-deploy
- [ ] setup-gbrain
- [ ] setup-matt-pocock-skills
- [ ] ship
- [ ] skillify
- [ ] sync-gbrain
- [ ] tdd
- [ ] to-issues
- [ ] triage
- [ ] unfreeze
- [ ] write-a-skill
- [ ] zoom-out

## Commands (74)

- [ ] aside
- [ ] auto-update
- [ ] build-fix
- [ ] checkpoint
- [ ] code-review
- [ ] cost-report
- [ ] cpp-build
- [ ] cpp-review
- [ ] cpp-test
- [ ] ecc-guide
- [ ] evolve
- [ ] fastapi-review
- [ ] feature-dev
- [ ] flutter-build
- [ ] flutter-review
- [ ] flutter-test
- [ ] gan-build
- [ ] gan-design
- [ ] go-build
- [ ] go-review
- [ ] go-test
- [ ] gradle-build
- [ ] harness-audit
- [ ] hookify
- [ ] hookify-configure
- [ ] hookify-help
- [ ] hookify-list
- [ ] instinct-export
- [ ] instinct-import
- [ ] instinct-status
- [ ] jira
- [ ] kotlin-build
- [ ] kotlin-review
- [ ] kotlin-test
- [ ] learn
- [ ] learn-eval
- [ ] loop-start
- [ ] loop-status
- [ ] model-route
- [ ] multi-backend
- [ ] multi-execute
- [ ] multi-frontend
- [ ] multi-plan
- [ ] multi-workflow
- [ ] plan
- [ ] pm2
- [ ] pr
- [ ] prd
- [ ] project-init
- [ ] projects
- [ ] promote
- [ ] prp-commit
- [ ] prp-pr
- [ ] prune
- [ ] python-review
- [ ] quality-gate
- [ ] refactor-clean
- [ ] resume-session
- [ ] review-pr
- [ ] rust-build
- [ ] rust-review
- [ ] rust-test
- [ ] santa-loop
- [ ] save-session
- [ ] security-scan
- [ ] session_context
- [ ] sessions
- [ ] setup-pm
- [ ] skill-create
- [ ] skill-health
- [ ] test-coverage
- [ ] update-codemaps
- [ ] update-docs
- [ ] voice

