# Demos — index

Each demo is small (2–6 minutes), has a clear "before / after," and ties to a slide.

| #  | Demo                                          | Slide / lever          | Time |
|----|-----------------------------------------------|------------------------|------|
| 00 | [Setup](./00-setup.md)                        | (prep)                 | —    |
| 01 | [Broad retrieval vs `#file`](./01-context-engineering.md)     | A — Context engineering   | 3 min |
| 02 | [Prompt caching](./02-prompt-caching.md)      | B — Prompt caching     | 3 min |
| 03 | [Tool & MCP hygiene](./03-tool-and-mcp-hygiene.md)       | C — Tools              | 3 min |
| 04 | [Instructions before/after](./04-instructions-and-skills.md) | D — Skills & standards | 4 min |
| 05 | [Model routing & calculator](./05-model-routing.md) | E — Model routing      | 4 min |
| 06 | [Whole file vs diff](./06-output-discipline.md) | F — Output discipline  | 2 min |
| 07 | [.gitignore & summaries](./07-repo-hygiene.md) | G — Repo hygiene       | 3 min |
| 08 | [Ralph Wiggum loop](./08-ralph-loop.md)       | H1 — Ralph loop        | 5 min |
| 09 | [Auto-compact](./09-auto-compact.md)          | H2 — Auto-compact      | 3 min |
| 10 | [Planner → Implementer → Reviewer](./10-agent-handover.md) | H3 — Agent handover    | 6 min |
| 11 | [Context budget planning](./11-context-budget.md) | Scaling L1            | 4 min |
| 12 | [Progressive disclosure](./12-progressive-disclosure.md) | Scaling L2     | 4 min |
| 13 | [Context shredding](./13-context-shredding.md) | Scaling L3 + L4         | 5 min |
| 14 | [Observability & lint](./14-observability.md) | Scaling L7              | 3 min |

**Total demo time:** ~52 min if you run them all. For a 60-minute session,
pick 5–6 highlights (suggested: 01, 04, 05, 08, 10, **13**).

## Reset between demos

```powershell
git stash --include-untracked
git checkout -- .
git clean -fd
```
