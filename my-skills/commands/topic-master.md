---
description: Get an AI PM from zero to conversant on a new topic, LOB, or product in hours (sprint) or one workday (marathon). Scrapes real data, runs parallel research across 8 PM dimensions, persists everything to a workspace. Activates the topic-master skill.
---

# Topic Master Command

A thin shim. All behavior lives in the `topic-master` skill (the single source of truth), so the command and the skill can never drift apart.

## What to do

1. Invoke the `topic-master` skill via the Skill tool.
2. Apply topic-master orchestration to the user's request: $ARGUMENTS

Every run must end with a regenerated `_CONSOLIDATED.md` at the workspace root containing every subfolder file verbatim + a TOC at the top. See SKILL.md Step 6b for the rules.
