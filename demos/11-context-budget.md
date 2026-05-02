# Demo 11 — Context budget planning (design time)

**Lever:** Scaling layer 1
**Slides:** "Scaling: 7-layer system" → "Layers 1–3"
**Time:** 4 min

The point: do the math **before** writing the agent. If fixed cost > 10K
tokens, refactor. Don't discover this in production.

## Setup

Open `.github/copilot-instructions.md` and `.github/instructions/tests.instructions.md`.

## Step 1 — Estimate fixed cost out loud

Walk the audience through it on a whiteboard or in a code comment:

```text
GPT-5 chat (Copilot)            128,000  context window
- Workspace info / file tree:    -500
- copilot-instructions.md:       -400  (≈ 100 lines × 4 chars/token)
- 3 *.instructions.md matched:  -1,800  (3 × 600)
- Open editor file:             -1,500
- 2 #file: pins:                -3,000
- Output headroom:             -16,000
─────────────────────────────────────
Per-turn budget:               ~104,800
```

## Step 2 — Add a budget header

Add at the top of `AGENTS.md`:

```markdown
<!--
context-budget:
  model: gpt-5 (128K)
  fixed: ~7,200 tokens
  per-turn: ~104,800 tokens (over ~15 turns ≈ 7K each)
  hard limits:
    - prompt files ≤ 250 lines
    - instructions ≤ 150 lines each
    - ≤ 30 tools enabled per chat
-->
```

## Step 3 — Show the per-component limits table

Open the slide and read the limits aloud. The numbers don't matter — the
**discipline** of having them does.

## Talking points

- "If you can't write down the budget, you don't have one."
- Consider adding CI lint scripts (like `lint:instr-size` and `lint:prompt-size`
  in demo 14) to enforce these limits automatically.
- Fixed cost compounds: 5K fixed × 20 turns = 100K spent on **the same**
  preamble. Halve the fixed cost, double the useful conversation.

## Reset

Revert the `AGENTS.md` change.

## References

- [GitHub — Adding repository custom instructions](https://docs.github.com/en/copilot/customizing-copilot/adding-repository-custom-instructions-for-github-copilot) — `AGENTS.md`, instruction files, and their scoping
- [OpenAI — Model context windows](https://platform.openai.com/docs/models) — per-model context window sizes
- [Anthropic — Models overview](https://docs.anthropic.com/en/docs/about-claude/models) — Claude context window sizes
- [Anthropic — Effective context engineering](https://www.anthropic.com/engineering/claude-code-best-practices) — treating context as a finite attention budget
