# Demo 02 — Don't break the cache

**Lever:** B · **Time:** ~3 min
**Punchline:** Caching is automatic now. Breaking it is still up to you.

## Step 1 — a warm cache

`/clear`, then ask three small questions in a row, for example:

> What does `FormatUtils.pluralize` return for 0?

> Which class calls `renderLegacy`?

> Where are the tests for `AddressParser`?

Watch the status line's `cache` figure climb. Then run `/usage` and read the line:

```
Prompt cache (main):   4 requests · 9x% of input tokens from cache · 0 misses · warm (…)
```

Point out: every turn re-sends the whole conversation, but almost all of it is billed at the cached rate (10% of input on Sonnet 5.5, 5% on Opus 5.5).

## Step 2 — break it on purpose

Run `/model opus`. Claude Code asks you to confirm, because the cache is warm. **Read the warning aloud**: that prompt exists because switching models throws away the cache.

Confirm, ask one more question, and run `/usage` again. The miss count goes up, and when Claude Code can tell, the line names the likely cause.

Switch back with `/model sonnet` (another miss) and make the point: **pick the model at the start of a session; if you need another one, `/clear` first.**

## Step 3 — what *doesn't* break it

Say it, don't demo it:
- Editing files, invoking skills, plan mode, spawning subagents: all cache-safe.
- `/effort` on the 5.5 models (API key or subscription): cache-safe. That's why lever E says "turn effort before you switch model".
- Editing `AGENTS.md` mid-session: cache-safe, but it also doesn't apply until `/clear`, `/compact` or a restart.
- Coming back after a break longer than the cache lifetime (one hour on a subscription's main conversation, five minutes on an API key): a full re-read.

## Optional — under the hood, on the API

```bash
cd scratch && npm install
export ANTHROPIC_API_KEY=…            # your own key, set before the talk
node cache-demo.js && node cache-demo.js
```

First run: `cache_creation_input_tokens` is large. Second run within five minutes: `cache_read_input_tokens` is large instead. Same answer, a fraction of the input cost.

Anti-pattern for your own agents: `"Today is " + Instant.now()` at the top of a system prompt busts the cache on every request.

## Reset

`/model sonnet`, then `/clear`.

## References

- [Claude Code — How Claude Code uses prompt caching](https://code.claude.com/docs/en/prompt-caching)
- [Claude Code — Prompt cache statistics in /usage](https://code.claude.com/docs/en/costs#prompt-cache-statistics)
- [Claude API — Prompt caching](https://platform.claude.com/docs/en/build-with-claude/prompt-caching)
- [GitHub blog — Getting more from each token: context handling and model routing](https://github.blog/ai-and-ml/github-copilot/getting-more-from-each-token-how-copilot-improves-context-handling-and-model-routing/)
