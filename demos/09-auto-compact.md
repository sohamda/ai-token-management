# Demo 09 — Auto-compact

**Slide reference:** Lever H · Pattern 2
**Time:** ~3 minutes
**Punchline:** A 4 KB summary keeps 95% of the signal at 3% of the cost.

## Step 1 — fake (or use) a long chat

Either:
- Reuse a chat from the previous demos that's been running for a while, or
- Start a new chat and have a few back-and-forth exchanges asking the agent to
  explore the repo (read `src/email/`, then `src/api/`, then summarize). Three
  or four substantive turns are enough.

Open the chat sidebar; show the "context window" indicator if your Copilot
build exposes one. (If not, just point at how many turns there are.)

## Step 2 — compact

In the same chat, type:

> Summarize what we've discussed: the goal, files we've touched, decisions made,
> open questions, and the next step. Keep it under 300 words and use bullet points.

Save the output to `plan.md` (or any markdown file).

## Step 3 — start fresh

Open a brand new chat. Attach the summary:

> Continue from `#file:plan.md`. The next step is …

Watch:
- The new chat's first request payload is dramatically smaller than the old chat's last one.
- The model picks up the thread without missing a beat.

## Step 4 — show the bonus pattern

The summary file becomes a **stable, cacheable prefix**. Every future chat that
references it benefits from prompt caching on top of the compaction.

## Talking points

- Copilot doesn't auto-compact aggressively. **You** have to drive it.
- **Rule of thumb:** one task per chat. New task → new chat with summary attached.
- For Agent mode and the cloud coding agent, this is doubly important — tool
  output stacks fast.

## Reset

Nothing to reset; this demo is non-destructive.

## References

- [Anthropic — Claude Code best practices: compaction](https://www.anthropic.com/engineering/claude-code-best-practices) — `/compact` command and auto-compaction
- [Anthropic — Effective context engineering for AI agents](https://www.anthropic.com/engineering/claude-code-best-practices) — hierarchical summarization and scratchpad patterns
- [Cursor — Long context chat](https://docs.cursor.com/chat/overview) — Cursor’s auto-summarization behavior
- [GitHub — Using prompt files](https://docs.github.com/en/copilot/customizing-copilot/using-copilot-prompt-files) — attaching `plan.md` via `#file`
