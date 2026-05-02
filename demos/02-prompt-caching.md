# Demo 02 — Prompt caching

**Slide reference:** Lever B
**Time:** ~3 minutes
**Punchline:** Cache hits cost ~10% of base. Order matters.

Prompt caching is hardest to demo live in Copilot itself (the wire is opaque).
Show the **principle** with a small script, then map it back to Copilot.

## Option A — Anthropic API (clearest)

If you have an `ANTHROPIC_API_KEY`, run this Node snippet twice:

```js
// scratch/cache-demo.js
import Anthropic from "@anthropic-ai/sdk";
const client = new Anthropic();

const bigSystem = "You are a helpful coding assistant. " + "Lorem ipsum ".repeat(2000);

const r = await client.messages.create({
  model: "claude-sonnet-4-5",
  max_tokens: 50,
  system: [{ type: "text", text: bigSystem, cache_control: { type: "ephemeral" } }],
  messages: [{ role: "user", content: "What is 2+2?" }],
});
console.log(r.usage);
```

- **First run:** `cache_creation_input_tokens` is large, `cache_read_input_tokens` is 0.
- **Second run within 5 min:** `cache_creation_input_tokens` is 0, `cache_read_input_tokens` is large. Same answer, ~90% cheaper input.

## Option B — Copilot principle demo

In VS Code, open Copilot Chat with this repo. Ask three small questions in a row
*without* changing the open files. Then change `AGENTS.md` between two questions
and watch (in the Output panel) that the request payload now changes shape.

## The order rule

Show this slide explicitly and walk through it:

```
[ tools ]            ← rarely changes      ┐
[ system prompt ]    ← rarely changes      │ cache these
[ skills / rules ]   ← stable per repo     ┘
[ retrieved files ]  ← changes per task
[ conversation ]     ← changes every turn
```

## Anti-demo

Add `Today is ${new Date().toISOString()}` at the top of a system prompt.
Now every request busts the cache. **Don't do this.**

## Reset

Nothing to reset.

## References

- [Anthropic — Prompt caching](https://docs.anthropic.com/en/docs/build-with-claude/prompt-caching) — cache_control, TTLs, 90% input cost reduction
- [OpenAI — Prompt caching](https://platform.openai.com/docs/guides/prompt-caching) — automatic prefix caching, 50% discount on cached tokens
- [Google — Gemini context caching](https://ai.google.dev/gemini-api/docs/caching) — explicit cache creation for Gemini models
- [Anthropic — Building effective agents](https://www.anthropic.com/engineering/building-effective-agents) — prompt structure and caching strategy
