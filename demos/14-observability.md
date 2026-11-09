# Demo 14 — Read the meter, set a budget

**Lever:** H · **Time:** ~4 min
**Punchline:** "You can't see the tokens" isn't true any more. Look at them.

## Step 1 — the always-on meter

Point at the status line, which has been on screen all talk:

```
Sonnet 5.5 · medium  │  ctx 23%  │  cache 91%  │  $0.46  │  5h 12%
```

Open `.claude/statusline.sh`: one `jq` expression over the JSON Claude Code pipes in (`context_window.used_percentage`, `prompt_cache.hit_ratio`, `cost.total_cost_usd`, `rate_limits.five_hour`). It's wired up in `.claude/settings.json`.

## Step 2 — what's in the window

`/context`: system prompt, tools (deferred MCP tools listed by name), memory files, skills, messages. This is the "anatomy of a request" slide with your real numbers.

## Step 3 — where the budget went

`/usage`:
- **Session**: cost by model, plus the `Prompt cache (main)` line (demo 02).
- **On subscription plans**: attribution to skills, subagents, plugins and MCP servers, and recommendations with a share of your usage. If the footer says `f to fix`, press `f` and Claude Code applies what it can.

Mention `/insights` for a longer-term report on how you work.

## Step 4 — set a budget

- Headless runs: `--max-budget-usd` (every iteration of `tools/ralph.sh` has one).
- Teams: workspace spend limits in the Console, or spend limits in Team/Enterprise admin settings, and OpenTelemetry export for your own dashboards.
- Baseline from Anthropic's docs: about $13 per developer per active day, $150–250 per month, 90% of users under $30 a day.

## Step 5 — keep bloat out in CI

```bash
npm run lint:context
```

Three checks, Copilot and Claude Code files alike:

| Script | Checks | Limit |
|---|---|---|
| `lint:instr-size` | `AGENTS.md`, `CLAUDE.md`, `copilot-instructions.md` / scoped rules | 200 / 150 lines |
| `lint:prompt-size` | subagents, skills, prompt files, `tools/ralph-prompt.md` | 250 lines |
| `lint:glob-audit` | `paths:` and `applyTo:` globs | `**` fails, `**/*.x` warns |

To show a failure:

```bash
for i in $(seq 1 200); do echo >> .claude/rules/tests.md; done
npm run lint:instr-size        # ❌
git checkout -- .claude/rules/tests.md
```

## Talking points

- Copilot equivalents: the context-window indicator in VS Code, `/context` in Copilot CLI, the usage page, and AI-credit budgets per enterprise, cost center or user.
- The worst tokens are the ones you're paying for and not noticing.

## Reset

Nothing to reset.

## References

- [Claude Code — Manage costs effectively](https://code.claude.com/docs/en/costs)
- [Claude Code — Status line](https://code.claude.com/docs/en/statusline)
- [Claude Code — Monitoring usage (OpenTelemetry)](https://code.claude.com/docs/en/monitoring-usage)
- [GitHub — Copilot billing for organizations and enterprises](https://docs.github.com/en/copilot/concepts/billing-and-usage/organizations-and-enterprises/billing)
