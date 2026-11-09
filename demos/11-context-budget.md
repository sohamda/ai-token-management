# Demo 11 — Context budget planning (appendix)

**Section:** Scaling up · **Time:** ~3 min · optional
**Punchline:** Know your fixed cost before you write the agent.

In the first version of this demo you estimated the fixed cost by hand. Claude Code shows it.

## Step 1 — measure the fixed cost

Start `claude` fresh and run `/context` **before typing anything**. Everything listed is paid on every turn of the session: system prompt, tool definitions, `AGENTS.md`, unscoped rules, skill descriptions. Write the total on the whiteboard.

## Step 2 — see what a component costs

Add an unscoped rule and measure again:

```bash
cp .claude/rules/tests.md .claude/rules/everything.md
sed -i '' '/^---$/,/^---$/d' .claude/rules/everything.md   # strip the paths: frontmatter
```

Restart `claude`, `/context` again: the memory files line grew by the size of that rule. Delete it and restart.

## Step 3 — write the budget down

Add a comment at the top of `AGENTS.md` and keep it current:

```markdown
<!--
context budget (measured with /context, fresh session):
  fixed:        ~N tokens
  limits:       AGENTS.md ≤ 200 lines · rules ≤ 150 · subagents/skills ≤ 250
  enforced by:  npm run lint:context
-->
```

## Talking points

- "If you can't write down the budget, you don't have one."
- Fixed cost is paid on every turn, mostly from cache. Halve it and every turn gets cheaper and every session lasts longer.

## Reset

```bash
rm -f .claude/rules/everything.md && git checkout -- AGENTS.md
```

## References

- [Claude Code — Explore the context window](https://code.claude.com/docs/en/context-window)
- [Anthropic — Effective context engineering for AI agents](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents)
