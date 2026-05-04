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

## Step 3 — Run the context-bloat lint scripts

The repo ships three lint scripts in `tools/` and wires them up in `package.json`.
Run them live:

```powershell
npm run lint:context
```

This runs all three in sequence:

| Script | What it checks | Threshold |
|---|---|---|
| `lint:instr-size` | `.github/instructions/*.md` line count | > 150 lines → FAIL |
| `lint:prompt-size` | `.github/prompts/*.md` line count | > 250 lines → FAIL |
| `lint:glob-audit` | `applyTo:` globs in instruction files | `**` → FAIL, broad extension → WARN |

All three should pass on this repo. To show a **failure**, temporarily bloat
an instruction file:

```powershell
# Add 200 blank lines to trip the lint
1..200 | ForEach-Object { Add-Content .github\instructions\tests.instructions.md "" }
npm run lint:instr-size   # now fails with ❌
git checkout -- .github/instructions/   # restore
```

## Talking points

- "The worst tokens are the ones you're paying for and not noticing."
- Run these in CI — context bloat accumulates silently across PRs the
  same way JAR size does.
- `npm run lint:context` is a single command to catch all context-size regressions.
- Parse the VS Code Copilot Chat log's `ccreq` lines to get per-turn
  latency, model, and status:
  ```powershell
  Get-ChildItem "$env:APPDATA\Code\logs" -Recurse -Filter "GitHub Copilot Chat.log" |
    Sort-Object LastWriteTime -Descending | Select-Object -First 1 | ForEach-Object {
      Select-String "ccreq.*success" $_.FullName
    }
  ```

## Reset

Nothing to reset — the scripts are committed.

## References

- [GitHub — Monitoring your Copilot usage](https://docs.github.com/en/copilot/managing-copilot/monitoring-usage-and-entitlements/monitoring-your-copilot-usage-and-entitlements) — premium-request dashboard and org-level metrics
- [GitHub — Copilot Metrics API](https://docs.github.com/en/rest/copilot/copilot-metrics) — REST API for programmatic usage tracking
- [GitHub — Premium requests](https://docs.github.com/en/copilot/managing-copilot/monitoring-usage-and-entitlements/about-premium-requests) — model multipliers and plan allowances
- [VS Code — Developer Tools](https://code.visualstudio.com/docs/devadvanced/devtools) — using `Ctrl+Shift+I` to inspect network requests
