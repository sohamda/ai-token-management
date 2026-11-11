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

## Try it yourself

Everything in this demo works in your own repo in about five minutes. You need Claude Code 2.1.305 or later (`claude update`) and `jq`.

1. **Turn on the status line.** Copy [`.claude/statusline.sh`](../.claude/statusline.sh) and make it executable (`chmod +x`). Then register it:

   ```json
   { "statusLine": { "type": "command", "command": ".claude/statusline.sh" } }
   ```

   - One repo: add that to the repo's `.claude/settings.json`. Claude Code asks you to trust the folder the first time.
   - Every project: put the script in `~/.claude/` and the block in `~/.claude/settings.json`, with `"command": "~/.claude/statusline.sh"`.
   - Or run `/statusline`, describe what you want, and Claude Code writes the script for you.

   Claude Code runs the script on your machine and pipes it the session's JSON; nothing is sent to the model, so it costs no tokens.

   | Field | Means | Act when |
   |---|---|---|
   | `Sonnet 5.5 · medium` | model and effort | it's more than the task needs (lever E) |
   | `ctx 23%` | how full the context window is | it's high and you're at a natural break: `/compact` or `/clear` (pattern 2) |
   | `cache 91%` | share of input read from the prompt cache | it drops: you switched model, changed MCP servers, compacted or left it idle (lever B) |
   | `$0.46` | estimated cost of this session | it's out of proportion to the task |
   | `5h 12%` | subscription's 5-hour allowance used | you're about to hit the limit mid-task |

2. **Look before you act.** `/context` shows what fills the window (system prompt, tools, memory files, skills, messages). `/usage` shows cost by model and the `Prompt cache (main)` line; on a subscription it also breaks usage down by skill, subagent and MCP server, and `f` applies its recommendations.
3. **Cap what runs unattended.** Add `--max-budget-usd` to every `claude -p` run, as [`tools/ralph.sh`](../tools/ralph.sh) does. For a team: spend limits in the Console or the Team/Enterprise admin settings, and [OpenTelemetry export](https://code.claude.com/docs/en/monitoring-usage) for your own dashboards.
4. **Lint your instructions in CI.** Copy `tools/lint-instructions.js`, `tools/lint-prompts.js`, `tools/lint-glob-audit.js` and the `lint:*` scripts from [`package.json`](../package.json). They need Node 20+ and no dependencies. Adjust the paths at the top of each script to your repo, then run `npm run lint:context` in CI.

### Questions people ask

- **Is the dollar figure real?** On an API key it's the session's cost at list price. On a subscription it's an estimate at list price, not what you pay, but it's the right number for comparing two ways of doing the same task.
- **Does the status line cost tokens?** No. It runs locally and never reaches the model.
- **What's a good cache %?** Around 90% in a steady session. Expect it to drop after a model switch, an MCP change mid-session, a compaction, or a break longer than the cache lifetime (1 hour on a subscription, 5 minutes on an API key).
- **When should I act on ctx %?** At a natural break in the task, before auto-compaction picks a moment for you. Which reset to use is pattern 2.
- **Windows?** The script needs bash and `jq`. Any command that reads JSON on stdin and prints one line works, PowerShell included.

## Reset

Nothing to reset.

## References

- [Claude Code — Manage costs effectively](https://code.claude.com/docs/en/costs)
- [Claude Code — Status line](https://code.claude.com/docs/en/statusline)
- [Claude Code — Monitoring usage (OpenTelemetry)](https://code.claude.com/docs/en/monitoring-usage)
- [GitHub — Copilot billing for organizations and enterprises](https://docs.github.com/en/copilot/concepts/billing-and-usage/organizations-and-enterprises/billing)
