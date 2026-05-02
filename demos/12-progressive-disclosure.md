# Demo 12 — Progressive disclosure (3-level hierarchy)

**Lever:** Scaling layer 2
**Slides:** "Layers 1–3"
**Time:** 4 min

The point: no single file should try to be comprehensive. `AGENTS.md` is a
table of contents. Skills hold domain knowledge. References hold the deep
content — only loaded when needed.

## Setup

Show the current `AGENTS.md` (intentionally short) and the four prompt files
in `.github/prompts/`.

## Step 1 — Anti-pattern: dump everything in copilot-instructions.md

Open `.github/copilot-instructions.md`. Imagine pasting the full Node
testing guide, full ESLint config rationale, full deployment runbook here.
Talk through what happens:

- Loaded on **every** turn → ambient cost balloons
- Copilot has to scan irrelevant prose to find what matters
- Bad signal-to-noise → worse suggestions

## Step 2 — Refactor into the 3-level hierarchy

Mock up the structure live (don't actually create the files for a 4-min
demo — describe and show the slide):

```text
AGENTS.md                                  # L1 — TOC, ~200 lines, always loaded
.github/instructions/tests.instructions.md # L2 — applyTo: src/**/*.js
.github/skills/eslint-rationale/SKILL.md   # L2 — on-demand
.github/skills/eslint-rationale/references/
  ├─ rule-by-rule.md                       # L3 — only if asked "why this rule?"
  └─ migration-from-airbnb.md              # L3 — only during a migration
```

Each level points to the next. Copilot follows the breadcrumbs only when
it needs to.

## Step 3 — Show a real example

Point at the structure already in this repo:

```text
AGENTS.md                                       # L1 — always loaded
.github/copilot-instructions.md                 # L1 — always loaded
.github/instructions/tests.instructions.md      # L2 — only when src/**/*.js matched
.github/prompts/ralph.prompt.md                 # L2 — only when /ralph invoked
```

Then show the demo-13 three-tier pattern (used in the next demo):

```text
.github/skills/context-shredding/
  ├─ SKILL.md                # full — 400–800 tokens
  ├─ SKILL.digest.md         # digest — 150–320 tokens
  ├─ SKILL.minimal.md        # minimal — 40–100 tokens
  └─ references/
       └─ compression-templates.md   # L3 — only if asked
```

Each level points to the next. Copilot follows the breadcrumbs only when
it needs to.

## Talking points

- "AGENTS.md is a menu, not the meal."
- A 200-line `AGENTS.md` that points to the right place beats a 2,000-line
  one that tries to be the place.
- Reference files have ZERO ambient cost — they're only loaded when an
  agent explicitly opens them.

## Reset

No changes — this is a discussion + slide demo.
