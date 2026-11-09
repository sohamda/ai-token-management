# Demo 06 — Output discipline

**Lever:** F · **Time:** ~2 min
**Punchline:** Output costs 5× input, and every word of it is re-read on every later turn.

## Step 1 — the open question

`/clear`, then:

> Explain @src/main/java/com/example/demo/email/TemplateEngine.java.

Watch the token count next to the spinner (`↓ … tokens`): it's the current turn's output, growing live. You'll get paragraphs and a method-by-method tour.

## Step 2 — the bounded question

`/clear`, then:

> In three bullets: what does @src/main/java/com/example/demo/email/TemplateEngine.java do, and which method should new emails call?

Compare the spinner count, then `/usage`.

## Step 3 — make it the default

Open `AGENTS.md`, section *Output style*:

```
- Be concise. No preamble. No re-explaining the request back to the user.
- Return diffs, not full files, when editing.
- If you need more context, ask one targeted question instead of guessing.
```

Every session in the repo inherits this; nobody has to remember to ask.

## Talking points

- Code edits are already diffs in agentic tools. The waste that's left is prose: narration, recaps, unrequested explanations.
- Thinking tokens bill as output too. That's lever E's effort knob.
- For machine consumers (scripts, CI), ask for JSON: `claude -p … --output-format json`.

## Reset

`/clear`.

## References

- [Claude Code — Read the token count beside the spinner](https://code.claude.com/docs/en/costs#read-the-token-count-beside-the-spinner)
- [Claude Code — Output styles](https://code.claude.com/docs/en/output-styles)
- [Claude — Pricing](https://platform.claude.com/docs/en/about-claude/pricing)
