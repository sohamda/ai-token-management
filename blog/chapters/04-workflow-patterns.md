<!-- target: ~600 words (~200 each) -->

## Three workflow patterns that compound

The eight levers above shrink the cost of an individual turn. These three patterns shrink the *number* of expensive turns. Apply them on top.

---

### 1. The Ralph Wiggum loop

Named after the *Simpsons* character whose superpower is relentless dumbness. The recipe is unglamorous on purpose:

1. Write a `TODO.md` with checkbox tasks.
2. Open agent-mode chat with a **cheap model**.
3. Tell it: *"Read `TODO.md`. Pick the first unchecked item. Implement only that. Run `npm test`. If green, check the box and commit. Pick the next. Repeat."*

That's it. The agent burns through the list one item at a time.

Why it works:

- **Each iteration starts with a small, fresh context.** The chat history isn't growing the way it would in a free-form conversation.
- **State lives on disk** (`TODO.md` and git commits), not in conversation tokens.
- **A cheap model is good enough**, because each task is small and self-contained.
- **It's restartable.** Kill the chat halfway, start a new one, run the prompt again — it picks up where it left off.

After it runs, `git log --oneline` reads like a changelog: one commit per task, message starts with the task title, easy to revert any one step. Compare with the typical "fix things" mega-commit and you'll never go back.

![TODO.md mid-loop on the left, the per-task git log on the right — disk is the memory](../images/07-todo-gitlog.png)

---

### 2. Auto-compact

Most assistants don't compact aggressively on their own. **You** have to drive it.

When a chat hits 60–80% of the context window (you'll know — replies start to crawl), stop and ask:

> *Summarize what we've discussed: the goal, files we've touched, decisions made, open questions, and the next step. Keep it under 300 words and use bullet points.*

Save the output to `plan.md`. Open a brand new chat. Attach it:

> *Continue from `#file:plan.md`. The next step is…*

The new chat's first request is dramatically smaller than the old chat's last one. The model picks up the thread without missing a beat. Roughly: **a 4 KB summary keeps 95% of the signal at 3% of the cost.**

The bonus pattern: that summary file becomes a **stable, cacheable prefix**. Every future chat that references it benefits from prompt caching on top of the compaction. Two compounding wins for one summarization.

**Rule of thumb:** one task per chat. New task → new chat with summary attached.

---

### 3. Planner → Implementer → Reviewer (agent handover)

This is the one that changes how features get built. Three short, focused chats with three different model choices and one shared artifact:

![The handover artifact is the only thing that crosses the boundary — never chat history](../images/06-handover-flow.png)

- **Planner** — *expensive* model, one call. Reads the feature request, produces `plan.md` with goal, acceptance criteria, tasks, files expected to change, out-of-scope items, and risks. **No code yet.**
- **Implementer** — *cheap* model, agent mode, fresh chat. Sees only `plan.md`. Runs a Ralph loop on it: pick first unchecked task, implement, test, check the box, commit, repeat.
- **Reviewer** — *expensive* model, fresh chat. Sees only `plan.md` and the diff. Marks each acceptance criterion PASS or FAIL, lists bugs, smells, out-of-scope edits. Ends with `VERDICT: APPROVE` or `VERDICT: REQUEST CHANGES`.

Three chats, ~5–8 premium requests total for an end-to-end feature. Compare with one mega-chat using the most expensive model the whole way: easily 30+ requests at 10× the multiplier.

The crucial discipline: the **handover artifact** (`plan.md`, the diff, the review notes) is the *only* thing that crosses the boundary. Never chat history. That's how you keep each agent's context small, focused, and cheap.
