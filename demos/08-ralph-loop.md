# Demo 08 — Loop with state on disk (Ralph)

**Pattern:** 1 · **Time:** ~5 min
**Punchline:** A fresh context per item. Disk is the memory.

## Step 1 — show the state

Open `TODO.md`: five small, independent chores. Then open the two loop files:

- `tools/ralph-prompt.md`: one iteration. Take the first `- [ ]`, implement it, `mvn test`, tick it, commit, **stop**.
- `tools/ralph.sh`: the shell loop. Each iteration is a new `claude -p` process with:
  - `--model sonnet --effort medium`: small tasks don't need Opus.
  - `--max-budget-usd 0.50`: a hard cap per iteration.
  - `--permission-mode acceptEdits` and `--allowedTools "Bash(mvn *) Bash(git add *) Bash(git commit *) …"`: it can edit, test and commit, nothing else.

## Step 2 — run it

Reset first if earlier demos left edits behind: each iteration runs `git add -A`, so leftovers would end up in Ralph's commit.

```bash
git reset --hard demo-start && git clean -fd
MAX=3 tools/ralph.sh
```

Each iteration prints its result line and its own cost and turn count. Narrate:
- **The context doesn't grow.** Iteration 3 costs about what iteration 1 did; no transcript carries over.
- **The hook still applies.** Project settings load in headless runs, so `mvn test` output is trimmed here too.
- **It's restartable.** Ctrl+C, run it again: it starts at the first unchecked box.

## Step 3 — the audit trail

```bash
git log --oneline -5
git diff demo-start -- TODO.md
```

One commit per item. Any one of them is easy to revert.

## Step 4 — the item designed to fail

The last item (migrate `OrderConfirmationService` to `render`) breaks a test that pins the legacy email text. Depending on the run, the iteration updates the test or gives up and marks the item `- [!]` with a reason. Either way, the next iteration isn't polluted by it. Point: **Ralph is only as good as your tests.**

## Talking points

- The first version of this demo looped *inside one chat* ("repeat until TODO.md is done"). That's a long chat with a to-do list: item five carried items one to four. The shell loop is the fix.
- `/loop` and scheduled tasks look similar but run inside your session and re-send its full context each time.
- Copilot: the cloud agent working one issue at a time has the same shape. `.github/prompts/ralph.prompt.md` is the in-chat version, kept for comparison.

## Reset

```bash
git reset --hard demo-start && git clean -fd
```

## References

- [Geoffrey Huntley — Ralph Wiggum as a "software engineer"](https://ghuntley.com/ralph/)
- [Claude Code — Run Claude Code programmatically (headless)](https://code.claude.com/docs/en/headless)
- [Claude Code — CLI reference (`--max-budget-usd`, `--allowedTools`)](https://code.claude.com/docs/en/cli-reference)
- [Claude Code — Why usage climbs in a long session](https://code.claude.com/docs/en/costs#why-usage-climbs-in-a-long-session)
