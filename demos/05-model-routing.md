# Demo 05 — Right-size the model and the effort

**Lever:** E · **Time:** ~4 min
**Punchline:** Haiku to Sonnet is 20×. Effort can move cost as much as the model does.

## Step 1 — same task, three models

A routine task, each run starting from `/clear` **and** a fresh `/model` (so no run pays for a cache rebuild):

> Rename `parseAddress` to `parseAddressLine` in @src/main/java/com/example/demo/utils/AddressParser.java and update all usages. Run the tests.

1. `/clear`, `/model haiku`, run it, `/usage` → note the cost.
2. `git reset --hard demo-start`, `/clear`, `/model sonnet`, run it, `/usage`.
3. `git reset --hard demo-start`, `/clear`, `/model opus`, run it, `/usage`.

Compare the diffs (`git diff` after each run, before resetting). For a mechanical rename they're the same.

## Step 2 — effort

Stay on Sonnet. `/clear`, `/effort low`, run the task again, `/usage`. Then the same with `/effort high`.

Point out the token count next to the spinner: thinking is output, and output costs 5× input. On the 5.5 models, changing effort mid-session keeps the cache (API key or subscription); changing model doesn't.

## Step 3 — routing inside one session

Open `.claude/agents/planner.md` and `implementer.md`: each sets its own `model:` and `effort:`. Your session can stay on Sonnet while the planner runs on Opus, with no model switch and no cache rebuild (demo 10).

## Step 4 — the calculator

In the deck, the **"What does this actually cost?"** slide. Take numbers from the room: team size, requests per day. Switch Haiku / Sonnet / Opus and the cache hit rate.

## Talking points

| Task | Model · effort |
|---|---|
| Search, summarise, mechanical edits (often as a subagent) | Haiku · low/medium |
| Day-to-day coding | Sonnet · medium |
| Hard design or debugging | Sonnet · high, then Opus |

- Go up in effort before you go up in model. Switch model only right after `/clear`.
- Haiku 5.5's low price applies to prompts up to 100K tokens; above that it's 5× more. Another reason to keep context small.
- Copilot: since June 1, 2026 it bills tokens at these same API rates. The old "Opus = 10×" multiplier is gone.

## Reset

```bash
git reset --hard demo-start && git clean -fd
```

Then `/model sonnet`, `/effort medium`, `/clear`.

## References

- [Claude Code — Choose the right model / Adjust extended thinking](https://code.claude.com/docs/en/costs#choose-the-right-model)
- [Claude Code — Model configuration and effort](https://code.claude.com/docs/en/model-config)
- [Claude — Pricing](https://platform.claude.com/docs/en/about-claude/pricing)
- [GitHub blog — Copilot is moving to usage-based billing](https://github.blog/news-insights/company-news/github-copilot-is-moving-to-usage-based-billing/)
