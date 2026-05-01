# Demo 14 — Observability: latency as a proxy + lint scripts

**Lever:** Scaling layer 7
**Slides:** "Layers 4–7"
**Time:** 3 min

The point: you can't watch token counts directly in Copilot — but you can
watch **latency**. And you can lint for context bloat the same way you lint
for code smells.

## Setup

Have a stopwatch (or just count "one Mississippi") visible.

## Step 1 — Show the latency-tokens correlation

Live: ask Copilot the same question twice — once in a fresh chat, once
after pasting a 5,000-line file with `#file:`.

| Copilot reply latency | ≈ Input tokens                |
| --------------------- | ----------------------------- |
| < 5s                  | < 20K                         |
| 5–10s                 | 20–60K                        |
| 10–20s                | 60–120K                       |
| > 20s                 | Near limit — start a new chat |

When the second one takes 3× longer, you've just shown the audience their
own token meter — they had it the whole time.

## Step 2 — Show the warning thresholds

```text
Yellow flags                                Red flags
─────────────────────────────────────────────────────────────
Fixed agent context > 5,000 tokens          > 10,000
Instruction files matched > 5               > 10
Turns without handoff > 15                  > 25
Single file read > 5,000 tokens             > 15,000
Cumulative file reads / session > 30,000    > 60,000
```

## Step 3 — Add 3 tiny lint scripts

Add to `package.json`:

```json
"scripts": {
  "lint:instr-size":  "node tools/lint-instructions.js",
  "lint:prompt-size": "node tools/lint-prompts.js",
  "lint:glob-audit":  "node tools/lint-glob-audit.js"
}
```

Talk through what each one does (don't actually implement them in the demo):

- `lint:instr-size` — fail if any `.github/instructions/*.md` > 150 lines
- `lint:prompt-size` — fail if any `.github/prompts/*.md` > 250 lines
- `lint:glob-audit` — fail if any `applyTo:` is just `**` (or warn if
  match count would exceed 5 files)

## Talking points

- "The worst tokens are the ones you're paying for and not noticing."
- Run these in CI — context bloat accumulates silently across PRs the
  same way bundle size does.
- The Camunda baseline platform repo also parses VS Code Copilot debug
  logs (`ccreq` lines) to get per-turn latency, model, and status.

## Reset

Revert `package.json` if you actually edited it.
