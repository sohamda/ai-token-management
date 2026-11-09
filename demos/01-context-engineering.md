# Demo 01 — Scope the ask

**Lever:** A · **Time:** ~3 min
**Punchline:** Same task. The vague ask reads the wrong code too.

## The setup

The repo has two implementations of the order-confirmation email:

- `src/main/java/com/example/demo/email/OrderConfirmationService.java`: the real one.
- `src/email/orderConfirmation.js`: dead JavaScript from an older version (an intentional trap).

## Step 1 — the vague ask

`/clear`, then:

> Refactor the order confirmation email to use the new template engine.

Narrate while it works:
- It searches for "order confirmation" and finds **both** implementations.
- It reads files it doesn't need: the JS version, often `WelcomeEmailService.java`.
- It either asks which one you meant, or picks one.

Then run `/usage` and read the Session block: cost, and input tokens by model. Leave the number on screen or write it down.

## Step 2 — the scoped ask

`/clear`, then (type `@` to pick the files):

> In @src/main/java/com/example/demo/email/OrderConfirmationService.java, call `render("order_confirmation_v2", …)` from @src/main/java/com/example/demo/email/TemplateEngine.java instead of `renderLegacy`. Keep behaviour identical.

Watch: two files, no search, one small diff. Run `/usage` again and compare.

## Step 3 (optional) — plan mode

For a bigger change, press **Shift+Tab** until the mode shows *plan*, ask the vague version again, and show that Claude proposes an approach for approval **before** editing. Wrong directions get caught at the cost of a plan, not of a diff.

## Talking points

- The agent can't ask you what you meant until it has explored. Exploration is what you pay for.
- `@path`, a method name, and "keep behaviour identical" cost you ten seconds.
- For Java, a code intelligence plugin replaces grep-then-read with "go to definition".
- Copilot: `#file`, `#selection` and `#problems` do the same.

## Reset

```bash
git reset --hard demo-start && git clean -fd
```

## References

- [Claude Code — Write specific prompts](https://code.claude.com/docs/en/costs#write-specific-prompts)
- [Claude Code — Plan mode](https://code.claude.com/docs/en/permission-modes)
- [Claude Code — Code intelligence plugins](https://code.claude.com/docs/en/plugins/code-intelligence)
- [Anthropic — Effective context engineering for AI agents](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents)
