# Demos — index

All live demos run in **Claude Code**. Each is small (2–6 minutes), has a clear before and after, and ties to a slide. Copilot equivalents are noted in each script for the slides, not demoed.

Listed in talk order (file numbers are historical).

| File | Demo | Slide | Time |
|---|---|---|---|
| [00](./00-setup.md) | Setup and prerequisites | (prep) | — |
| [01](./01-context-engineering.md) | Vague vs scoped ask | A — Scope the ask | 3 min |
| [02](./02-prompt-caching.md) | Warm cache, then break it with `/model` | B — Don't break the cache | 3 min |
| [03](./03-tool-and-mcp-hygiene.md) | `/context`, `/mcp`, the `mvn test` hook | C — Make tool output cheap | 4 min |
| [04](./04-instructions-and-skills.md) | `AGENTS.md`, scoped rules, the `CLAUDE.md` gotcha | D — Codify once, load on demand | 4 min |
| [05](./05-model-routing.md) | Haiku vs Sonnet vs Opus, effort, calculator | E — Right-size model and effort | 4 min |
| [06](./06-output-discipline.md) | Open vs bounded question | F — Output discipline | 2 min |
| [07](./07-repo-hygiene.md) | Dead code in search results | G — Make the repo cheap to read | 3 min |
| [14](./14-observability.md) | Status line, `/context`, `/usage`, CI lint | H — Read the meter, set a budget | 4 min |
| [08](./08-ralph-loop.md) | `tools/ralph.sh`: headless loop over `TODO.md` | Pattern 1 — Loop with state on disk | 5 min |
| [09](./09-auto-compact.md) | `/clear`, `/rewind`, `/compact`, hand-off notes | Pattern 2 — Checkpoint & reset | 3 min |
| [10](./10-agent-handover.md) | planner → implementer → reviewer subagents | Pattern 3 — Plan → Build → Review | 6 min |
| [11](./11-context-budget.md) | Measure fixed cost with `/context` | Appendix — Scaling up | 3 min |
| [12](./12-progressive-disclosure.md) | `AGENTS.md` → rules → skills → references | Appendix — Scaling up | 3 min |
| [13](./13-context-shredding.md) | Skills in three sizes | Appendix — Scaling up | 5 min |

**Total:** ~45 min for the full set, so pick a subset. The 45-minute talk ([docs/run-sheet.md](../docs/run-sheet.md)) runs **01, 02 (step 2), 03, 14, 08 (`MAX=1`) and 10 (`tools/demo10.sh`)** live. Record backups of all six before the talk.

## Reset between demos

```bash
git reset --hard origin/main && git clean -fd
```

This puts the repo back to what's on GitHub, so push your own changes before you present (see [00-setup](./00-setup.md)).
