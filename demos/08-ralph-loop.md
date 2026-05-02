# Demo 08 — The Ralph Wiggum loop

**Slide reference:** Lever H · Pattern 1
**Time:** ~5 minutes
**Punchline:** Dumb loop + small context + cheap model = directed AI workload.

## Step 1 — show TODO.md

Open `TODO.md`. Five small tasks, all unchecked:

```
- [ ] Add a unit test for parseAddress …
- [ ] Add a JSDoc @returns to formatMoney …
- [ ] Add a second mock order …
- [ ] Add a test for pluralize …
- [ ] Migrate sendOrderConfirmation to render() …
```

## Step 2 — invoke the loop

Open Copilot Chat in **Agent mode**. Pick **GPT-4.1** or **Claude Sonnet** (cheap).

Type:

> /ralph

(Or paste the contents of `.github/prompts/ralph.prompt.md` if your Copilot
build doesn't auto-discover prompt files.)

## Step 3 — narrate while it runs

The agent will:
1. Read `TODO.md`.
2. Pick the first unchecked item.
3. Do it. Run `npm test`. Mark it `[x]`. Commit.
4. Pick the next. Loop.

Talking points to call out as it runs:
- **Each iteration starts with a small fresh context** — the chat history isn't growing the way it would in a free-form conversation.
- **State lives on disk** (`TODO.md` and git commits), not in conversation tokens.
- **A cheap model is good enough**, because each task is small and self-contained.
- **It's restartable.** Kill the chat halfway, start a new one, run `/ralph` again — it picks up where it left off.

## Step 4 — show the audit trail

After the loop finishes (or you stop it):

```powershell
git log --oneline
```

You see one commit per task. Compare with the typical "fix things" mega-commit.

## Reset

```powershell
git reset --hard HEAD~5    # however many commits ralph made
git checkout -- .
```

(Or back up to a known tag before the demo.)

## References

- [GitHub — Using prompt files in Copilot](https://docs.github.com/en/copilot/customizing-copilot/using-copilot-prompt-files) — `.github/prompts/*.prompt.md` and slash-command invocation
- [GitHub — Adding repository custom instructions](https://docs.github.com/en/copilot/customizing-copilot/adding-repository-custom-instructions-for-github-copilot) — `AGENTS.md` and instruction file conventions
- [Anthropic — Building effective agents](https://www.anthropic.com/engineering/building-effective-agents) — task decomposition, tool-use loops, and orchestration patterns
- [Simon Willison — The “dumb loop” pattern](https://simonwillison.net/2025/Mar/19/link-context-engineering/) — simple loops with on-disk state
