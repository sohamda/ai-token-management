# Demo 04 — Codify once, load on demand

**Lever:** D · **Time:** ~4 min
**Punchline:** Always-loaded files stay short; everything else loads when it's needed.

## Step 1 — what's always loaded

Start `claude` fresh. Point at the transcript line `no CLAUDE.md found; AGENTS.md loaded: …`. Open `AGENTS.md`: 30 lines of build commands, conventions, what not to touch and output style. Then `/context` and find it under memory files.

## Step 2 — what loads on demand

Open `.claude/rules/tests.md`:

```yaml
---
paths:
  - "src/test/java/**/*.java"
---
```

Ask:

> Add a test to @src/test/java/com/example/demo/utils/AddressParserTest.java for input with empty comma-separated parts, like "Main St, , 10001, US".

As soon as Claude reads the test file, the rule loads. Run `/context` again and show it has appeared. It didn't cost anything in demos 01–03, which never touched a test.

## Step 3 — the glob bug

Show `git show 910a786:.github/instructions/tests.instructions.md | head -3` (the version before this rewrite): the Copilot version of this rule used `applyTo: "src/**/*.java"`, so *test* rules loaded every time the agent touched *production* code. Then run:

```bash
npm run lint:glob-audit
```

## Step 4 — the gotcha

```bash
printf '# Notes\n' > CLAUDE.md
```

Restart `claude`. The `AGENTS.md loaded` line is gone: a `CLAUDE.md` replaces `AGENTS.md` unless it imports it. Fix it live:

```bash
printf '@AGENTS.md\n\n# Compact instructions\nKeep failing test names and file paths.\n' > CLAUDE.md
```

Restart again: `AGENTS.md` is back, imported. Bonus: that `# Compact instructions` section steers every compaction (pattern 2).

## Talking points

- Always-loaded: keep it under 200 lines. Directory-specific → scoped rule. Workflow-specific → skill or subagent.
- Skills and subagents load when invoked, and invoking them doesn't break the cache.
- Copilot: `copilot-instructions.md`, `*.instructions.md` with `applyTo`, prompt files. Same layers, different file names.

## Reset

```bash
rm -f CLAUDE.md && git reset --hard demo-start && git clean -fd
```

Restart `claude` so it reloads `AGENTS.md`.

## References

- [Claude Code — AGENTS.md](https://code.claude.com/docs/en/memory#agents-md)
- [Claude Code — Path-specific rules](https://code.claude.com/docs/en/memory#path-specific-rules)
- [Claude Code — Move instructions from CLAUDE.md to skills](https://code.claude.com/docs/en/costs#move-instructions-from-claude-md-to-skills)
- [GitHub — Adding repository custom instructions](https://docs.github.com/en/copilot/customizing-copilot/adding-repository-custom-instructions-for-github-copilot)
