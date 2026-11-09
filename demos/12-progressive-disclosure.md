# Demo 12 — Progressive disclosure (appendix)

**Section:** Scaling up · **Time:** ~3 min · optional, mostly slides
**Punchline:** `AGENTS.md` is a menu, not the meal.

No single file should try to be comprehensive. Each layer points to the next, and each loads later than the one above it.

## The layers in this repo

```text
AGENTS.md                         # L1 — every session, 30 lines
.claude/rules/tests.md            # L2 — only when a test file is read or edited
.claude/agents/*.md               # L2 — only when a subagent is invoked
.github/skills/context-shredding/ # L2/L3 — skill + references, read on demand
  ├─ SKILL.md
  └─ references/compression-templates.md
```

Copilot's equivalents: `copilot-instructions.md` (L1), `*.instructions.md` with `applyTo` (L2), prompt files and skills (L2/L3).

## Step 1 — the anti-pattern

Imagine pasting the full testing guide, the Checkstyle rationale and the deployment runbook into `AGENTS.md`. Every session pays for all of it, and the agent has to find the two lines that matter in a wall of prose.

## Step 2 — the refactor

Sketch it on the slide, don't create files:

```text
AGENTS.md                                   # "tests: see .claude/rules/tests.md"
.claude/rules/tests.md                      # paths: src/test/java/**
.claude/skills/checkstyle/SKILL.md          # loads when Claude decides it's relevant
.claude/skills/checkstyle/references/
  └─ rule-by-rule.md                        # read only when asked "why this rule?"
```

## Talking points

- A 200-line `AGENTS.md` that points to the right place beats a 2,000-line one that tries to be the place.
- Reference files cost nothing until they're opened.
- Invoking a skill appends to the conversation, so it doesn't break the cache.

## References

- [Claude Code — Skills](https://code.claude.com/docs/en/skills)
- [Claude Code — Organize rules with .claude/rules/](https://code.claude.com/docs/en/memory#organize-rules-with-claude%2Frules%2F)
- [agentsmd/agents.md](https://github.com/agentsmd/agents.md) — the cross-tool `AGENTS.md` convention
