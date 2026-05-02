<!-- target: ~250 words -->

## The Monday checklist

Pin this to your team's wiki. Take what's useful, ignore the rest.

**Repo setup**
- [ ] Add a top-level instructions file (`copilot-instructions.md`, `AGENTS.md`, `CLAUDE.md`, or your tool's equivalent) with build, test, lint, conventions, and output-style rules.
- [ ] Add path-scoped instruction files for stack-specific rules (e.g. test conventions under `src/`).
- [ ] `.gitignore` build outputs, snapshots, and large fixtures. `git rm --cached` anything already tracked.
- [ ] Add three-line "what does this module do" summary comments to your top 10 modules.
- [ ] Add a CI lint that fails if instruction files exceed ~150 lines or prompt files exceed ~250 lines.

**Per-session habits**
- [ ] Disable MCP servers you don't need this session. Re-enable on demand.
- [ ] Default to a mid-tier model. Escalate to a top-tier model only when stuck — and only with a reason.
- [ ] Use `#file:` (or your tool's equivalent) instead of broad-retrieval / agent mode for scoped tasks.
- [ ] Ask for diffs, not full files.
- [ ] Start each new task in a fresh chat.
- [ ] When responses start to crawl (~60% context), summarize to a `plan.md` and continue in a new chat.

**Workflow patterns to try this week**
- [ ] Run a Ralph loop on a `TODO.md` of small chores.
- [ ] Use the planner / implementer / reviewer split for one real feature. Notice the request count.
- [ ] Treat latency as your token meter. Count Mississippis for one day.

![Print or screenshot this — a one-page Monday checklist](../images/08-checklist-card.png)
