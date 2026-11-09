# Demo 10 — Plan → Build → Review

**Pattern:** 3 · **Time:** ~6 min
**Punchline:** Opus judgement where it matters, without switching your session to Opus.

This is the showpiece. It uses patterns 1 and 2 inside pattern 3.

## Setup

Three subagents in `.claude/agents/`:

| File | Model · effort | Tools |
|---|---|---|
| `planner.md` | opus · high | Read, Grep, Glob, Write |
| `implementer.md` | sonnet · medium | Read, Edit, Write, Grep, Glob, Bash |
| `reviewer.md` | opus · high | Read, Grep, Glob, Bash |

Move the example plan out of the way so the planner writes a fresh one:

```bash
git mv plan.md plan.example.md && git commit -qm "demo: stash example plan"
```

Run `/agents` to show the three, then `/clear`. Keep the main session on **Sonnet**.

## Act 1 — planner

> Use the planner agent. Feature: when the order total exceeds $100, the order-confirmation email includes the line "VIP customer — free shipping on your next order".

Open `plan.md`: goal, acceptance criteria, small tasks, out-of-scope. No code yet. Point at the main transcript: only the planner's one-line reply came back.

## Act 2 — implementer

> Use the implementer agent to execute plan.md.

It works through the tasks, one `mvn test` and one commit each: a Ralph loop over `plan.md`. Its file reads and test logs stay in its own context.

## Act 3 — reviewer

> @agent-reviewer review the build commits against plan.md.

It marks each criterion PASS or FAIL and ends with `VERDICT: APPROVE` or `VERDICT: REQUEST CHANGES`.

## Act 4 — the meter

- `/context`: the main session is small. It holds three briefs and three summaries, not three transcripts.
- `/usage`: on a subscription, the attribution section shows the subagents' share. On the API, the Session block's per-model lines show Opus and Sonnet separately.
- The main session never switched model, so its cache stayed warm the whole time.

## Talking points

- The artifact (`plan.md`, the commits, the verdict) is the only thing that crosses a boundary. Never chat history.
- Subagents aren't free: each loads its own context and warms its own cache. Use them when roles need different contexts.
- Agent teams (several Claude instances working in parallel) use roughly 7× the tokens of a standard session in plan mode. Fan out on purpose, not by default.
- Copilot: `.github/prompts/plan|build|review.prompt.md` in three fresh chats give the same shape.

## Reset

```bash
git reset --hard demo-start && git clean -fd
```

## References

- [Claude Code — Subagents](https://code.claude.com/docs/en/sub-agents)
- [Claude Code — Delegate verbose operations to subagents](https://code.claude.com/docs/en/costs#delegate-verbose-operations-to-subagents)
- [Claude Code — Subagents and the cache](https://code.claude.com/docs/en/prompt-caching#subagents-and-the-cache)
- [Claude Code — Agent team token costs](https://code.claude.com/docs/en/costs#agent-team-token-costs)
- [Cognition — Don't build multi-agents](https://cognition.ai/blog/dont-build-multi-agents)
