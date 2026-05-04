# Demo 10 — Agent handover (planner → implementer → reviewer)

**Slide reference:** Lever H · Pattern 3
**Time:** ~6 minutes
**Punchline:** One expensive call up front; cheap, bounded work after.

This is the showpiece demo. It combines all three workflow patterns.

## Setup

Three prompt files already exist:

- `.github/prompts/plan.prompt.md`     → `/plan`     (run with GPT-5)
- `.github/prompts/build.prompt.md`    → `/build`    (run with Sonnet, in Agent mode)
- `.github/prompts/review.prompt.md`   → `/review`   (run with GPT-5)

A pre-baked `plan.md` exists in the repo as a reference; **delete or rename it
before the demo** so the planner produces a fresh one live.

```powershell
Move-Item plan.md plan.example.md
```

## Act 1 — the planner

In a fresh Copilot Chat, **switch model to GPT-5**. Type:

> /plan
>
> Feature: when the order total exceeds $100, the order-confirmation email
> should include a "VIP customer — free shipping on your next order" line.

The planner produces a `plan.md` with goal, acceptance criteria, tasks, and
out-of-scope items. **No code yet.** Show the file.

## Act 2 — the implementer (in a fresh chat!)

Open a **new** chat. Switch to **Claude Sonnet**. Enable **Agent mode**. Type:

> /build

The implementer:
- Reads `plan.md`.
- Picks the first task. Edits the file. Runs `./mvnw test`. Checks the box.
- Loops until all tasks are checked.

Talking points:
- This is the **Ralph loop** running on `plan.md` instead of `TODO.md`.
- The implementer never sees the chat history of the planner.
- It only sees `plan.md` (the handover artifact) and the files it touches.

## Act 3 — the reviewer (in a third fresh chat!)

Open a **new** chat. **GPT-5**. Type:

> /review
>
> #file:plan.md
> #changes

The reviewer marks each acceptance criterion PASS/FAIL, lists bugs, smells, and
out-of-scope edits, and ends with `VERDICT: APPROVE` or `VERDICT: REQUEST CHANGES`.

Show the verdict.

## Step 4 — show the meter

Count the requests using **Output panel → "GitHub Copilot Chat"** `ccreq` lines.
Each `success` line is one LLM call. Compare across the three chats.

(Org dashboard: `https://github.com/organizations/<YOUR-ORG>/settings/copilot/usage`.
Individual subscribers: `https://github.com/settings/copilot/usage`.)

Expected totals:

- Planner: 1 GPT-5 call (~1 premium request)
- Implementer: ~3–6 Sonnet calls (~3–6 premium requests)
- Reviewer: 1 GPT-5 call (~1 premium request)

**Total: ~5–8 premium requests** for an end-to-end feature with a paper trail.

Compare this to "one mega-chat with Opus" — easily 30+ requests at 10× the multiplier.

## Talking points

- Specialized agents = specialized contexts.
- Cheap models do cheap work; expensive models only see the hard parts.
- The handover artifact (`plan.md`, diff, review notes) is the only thing
  crossing the boundary — not chat history.
- Failures are localized. Re-run one act, not the whole movie.
- Auditable: every step is on disk.

## Reset

```powershell
Move-Item plan.example.md plan.md -Force
git checkout -- .
git clean -fd
```

## References

- [GitHub — Using prompt files](https://docs.github.com/en/copilot/customizing-copilot/using-copilot-prompt-files) — `.github/prompts/*.prompt.md` for `/plan`, `/build`, `/review`
- [GitHub — Premium requests and model multipliers](https://docs.github.com/en/copilot/managing-copilot/monitoring-usage-and-entitlements/about-premium-requests) — per-model cost comparison
- [Anthropic — Building effective agents](https://www.anthropic.com/engineering/building-effective-agents) — orchestrator/worker pattern, delegation, and sub-agent isolation
- [Cognition — Don’t build multi-agents](https://cognition.ai) — why sub-agent context isolation beats shared conversation
- [Anthropic — Claude Code best practices](https://www.anthropic.com/engineering/claude-code-best-practices) — plan-then-execute workflow
