# Demo 03 — Make tool output cheap

**Lever:** C · **Time:** ~4 min
**Punchline:** Tool definitions are deferred now. The tax moved to what tools *return*.

## Step 1 — tool definitions are cheap now

`/clear`, then `/context`. Point at the tools section: MCP tools show as deferred (names only) until Claude actually uses one. Then `/mcp` and disable anything you won't use today. Do it **now, at the start of the session**: lever B says tool changes mid-session can cost a cache rebuild.

## Step 2 — tool output is the new tax

If you ran demo 01 before this one, reset first: demo 01 leaves its edits in the working tree, and this demo should run the tests on the committed code.

```bash
git reset --hard origin/main && git clean -fd
```

In the second terminal:

```bash
mvn test | wc -l          # 50-odd lines of banners, plugin output and per-class results (more on a cold cache)
```

Every one of those lines would land in Claude's context and be re-read on every later turn.

In Claude Code:

> Run the tests.

Show what Claude actually received: three lines, the `Tests run:` total, `BUILD SUCCESS` and `(full log: …/claude-mvn-test.log)`. Then open `.claude/hooks/filter-test-output.sh` and `.claude/settings.json`: a `PreToolUse` hook rewrites `mvn test` so the full log goes to a file and only summary and failures come back. The exit code survives, so Claude still sees red as red.

## Step 3 — make it fail

Break a test on purpose, for example change an expected value in `FormatUtilsTest.java`, then:

> Run the tests and fix what fails.

The hook passes through Surefire's failure list, for example `FormatUtilsTest.formatMoney_defaultUSD:13` with the expected and actual values, and drops the stack traces. That's all Claude needs; the full log is on disk if it wants more.

## Step 4 — delegate the noisy part

> Use a subagent to run the full test suite and report only the failures.

The verbose output stays in the subagent's context; only its summary lands in yours.

## Talking points

- Prefer CLIs to MCP servers where both exist: `gh pr view 42` returns what you asked for; an MCP server returns whole JSON objects.
- Tools you build yourself: return `{id, summary}` by default, make the big object opt-in.
- Copilot: tool search does the deferring; output filtering is up to the commands you let it run.

## Reset

```bash
git reset --hard origin/main && git clean -fd
```

## References

- [Claude Code — Offload processing to hooks and skills](https://code.claude.com/docs/en/costs#offload-processing-to-hooks-and-skills) — the hook this one is adapted from
- [Claude Code — Hooks reference](https://code.claude.com/docs/en/hooks)
- [Claude Code — Reduce MCP server overhead](https://code.claude.com/docs/en/costs#reduce-mcp-server-overhead)
- [VS Code blog — Improving token efficiency in GitHub Copilot](https://code.visualstudio.com/blogs/2026/06/17/improving-token-efficiency-in-github-copilot) — tool search, −18% tokens per user
