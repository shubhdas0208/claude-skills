# claude-skills

Private backup and home for my Claude Code skills and commands.

## Structure

- **`my-skills/`** — skills I authored myself.
  - `sidenote/` — persistent, project-scoped side note (SIDENOTE.md in-project + central index).
  - `factcheck/` — verify-before-you-answer mode: live web research, citations, no guessing.
  - `commands/` — slash-command shims that pair with the skills above.
- **`borrowed-skills/`** — `MANIFEST.md` catalogues installed third-party skills/commands
  (gstack, ECC, Matt Pocock). Six key skills are vendored in full as backup:
  `brainstorming/`, `writing-plans/`, `ponytail/`, `improve/`, `drawio-skill/`,
  `ui-ux-pro-max/`. The rest are listed in the manifest without copying.

## Reclaiming authored skills

`~/.claude/skills/` mixes hand-made and pack-installed skills in one folder, so authorship
cannot be detected automatically. To promote one from the manifest into `my-skills/`,
identify it by name and copy its full folder across.

## Install a skill locally

Copy a skill folder into `~/.claude/skills/<name>/` (and any command into
`~/.claude/commands/`). It becomes available as `/<name>` in every project.
