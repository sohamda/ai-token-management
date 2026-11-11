# Demo 13 — Context shredding (runtime tier selection)

**Section:** Scaling up (appendix) · **Time:** ~5 min · optional

The point: ship every skill in **three sizes**. The agent picks which one to
load based on how full the context already is.

## Setup

Show the slide table:

| Tier    | File               | Size           | When to load   |
| ------- | ------------------ | -------------- | -------------- |
| Full    | `SKILL.md`         | 400–800 tokens | < 60% context  |
| Digest  | `SKILL.digest.md`  | 150–320 tokens | 60–80%         |
| Minimal | `SKILL.minimal.md` | 40–100 tokens  | > 80%          |

## Step 1 — Demonstrate on the demo skill

Open the shipped example, `.github/skills/context-shredding/`:

```text
SKILL.md          # full
SKILL.digest.md   # keep H2s and tables, drop examples
SKILL.minimal.md  # just the decisions
```

Walk through the rules used:

- Preserve **tables** (dense info)
- Drop **code blocks** first (verbose)
- Keep **decision rationale** over implementation details
- Always preserve H1 + first paragraph

## Step 2 — Add the `<context_awareness>` tag

In a long subagent or prompt file (e.g. `.claude/agents/implementer.md`), add at the top:

```markdown
<context_awareness>
At >60% context used, read SKILL.digest.md instead of SKILL.md.
At >80% read SKILL.minimal.md and stop re-reading earlier files.
</context_awareness>
```

In Claude Code you can check the percentage yourself: it's `ctx %` on the status line.

## Step 3 — The digest generator

This repo includes `tools/scripts/generate-skill-digests.mjs`
that produces digest + minimal variants automatically by:

1. Extracting H2 sections from `SKILL.md`
2. Prioritizing critical headings (tiers, rules, constraints)
3. Dropping non-critical sections and code blocks
4. Condensing tables (removing verbose columns like "Size")
5. Joining wrapped paragraphs into single-sentence summaries
6. Adding `> _See SKILL.md for full content._` pointers

Run it live:

```bash
node tools/scripts/generate-skill-digests.mjs
```

> **Presenter note:** The generator is a useful *starting point* — it gets you
> to ~45% for digest and ~15% for minimal. For production skills you'll
> want to hand-edit the output (tighten prose, reword tables). The checked-in
> versions in this repo have been curated beyond what the script produces.
> Treat the script as scaffolding, not a faithful round-trip.

## Talking points

- This is the most novel pattern from the case study — agents that are
  **self-aware of their own context consumption**.
- Mid-workflow **compaction phase**: at 60–80%, agent pauses, summarizes
  what it's learned, switches to minimal skills, then continues.
- You don't have to build the generator on day one — just maintain the
  three sizes by hand for your top 3 skills first.
- The generator is scaffolding: run it to get a first draft, then curate.
  Don't run it in CI as a clobber-and-replace — a CI check that *diffs*
  generated vs checked-in and warns on drift is more appropriate.

## Reset

```bash
git reset --hard origin/main && git clean -fd
```

## References

- [Anthropic — Effective context engineering for AI agents](https://www.anthropic.com/engineering/claude-code-best-practices) — context-aware agents and compaction strategies
- [Anthropic — Prompt caching](https://docs.anthropic.com/en/docs/build-with-claude/prompt-caching) — why smaller, stable prefixes cache better
- [Chroma Research — Context rot](https://research.trychroma.com/evaluating-chunking) — how recall degrades as context fills
- [GitHub — Adding repository custom instructions](https://docs.github.com/en/copilot/customizing-copilot/adding-repository-custom-instructions-for-github-copilot) — scoped instruction loading
