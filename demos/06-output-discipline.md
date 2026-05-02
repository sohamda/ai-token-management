# Demo 06 — Output discipline (whole file vs diff)

**Slide reference:** Lever F
**Time:** ~2 minutes
**Punchline:** Same fix, 50× fewer output tokens.

## Step 1 — the verbose ask

In a fresh chat:

> In `#file:src/email/templateEngine.js`, the `welcome` template is missing an exclamation mark. Show me the **updated file**.

The model returns the entire file (~30 lines). With a 600-line file it would be 600 lines.

## Step 2 — the disciplined ask

> In `#file:src/email/templateEngine.js`, the `welcome` template is missing an exclamation mark. Reply with a **unified diff only**, no commentary.

You get ~5 lines of diff.

## Step 3 — the system-prompt fix

Open `.github/copilot-instructions.md`. Show the lines:

```
- Be concise. No preamble.
- Prefer diffs over full files.
```

Now any chat in this repo defaults to the disciplined behavior — without re-typing it.

## Talking points

- In direct API usage, output tokens are **3–5× more expensive** than input tokens. In Copilot’s premium-request model you pay per request, but verbose output still hurts: it increases latency, fills the context for subsequent turns, and causes earlier context to be evicted sooner.
- Verbose "let me explain what I'm about to do" prefaces are pure tax.
- Diff-mode tools (`apply_patch`, `edit`) are the cheapest editing pattern.
- Structured output / JSON mode for machine consumers — no prose padding.

## Reset

```powershell
git checkout -- src/
```

## References

- [OpenAI — Structured outputs](https://platform.openai.com/docs/guides/structured-outputs) — JSON mode to eliminate prose padding
- [Anthropic — Reducing output tokens](https://docs.anthropic.com/en/docs/build-with-claude/reduce-latency#reduce-output-tokens) — techniques to control output verbosity
- [OpenAI — Pricing](https://openai.com/api/pricing/) — input vs output token cost differential (3–4×)
- [Anthropic — Pricing](https://www.anthropic.com/pricing) — input vs output token cost differential (3–5×)
