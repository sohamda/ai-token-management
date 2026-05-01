# Demo 13 — Context shredding (runtime tier selection)

**Lever:** Scaling layers 3 + 4
**Slides:** "Layers 1–3" + "Layers 4–7"
**Time:** 5 min

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

Use the existing `.github/copilot-instructions.md` as the "skill" and create
two compressed siblings live:

```text
.github/copilot-instructions.md          # full, ~80 lines
.github/copilot-instructions.digest.md   # ~30 lines: keep H2s, drop examples
.github/copilot-instructions.minimal.md  # ~10 lines: just the decisions
```

Walk through the rules used:

- Preserve **tables** (dense info)
- Drop **code blocks** first (verbose)
- Keep **decision rationale** over implementation details
- Always preserve H1 + first paragraph

## Step 2 — Add the `<context_awareness>` tag

In a long prompt file (e.g. `.github/prompts/build.prompt.md`), add at the top:

```markdown
<context_awareness>
This prompt is ~250 lines. At >60% context used, load
copilot-instructions.digest.md instead of the full file.
At >80% switch to copilot-instructions.minimal.md and stop
re-reading prior turns.
</context_awareness>
```

## Step 3 — Mention the generator

The Camunda baseline platform repo includes `tools/scripts/generate-skill-digests.mjs`
that produces digest + minimal automatically by:

1. Extracting H2 sections from `SKILL.md`
2. Prioritizing critical headings
3. Trimming each section to a max line budget
4. Closing dangling code fences
5. Adding `> _See SKILL.md for full content._` pointers

Run it in CI to keep variants in sync.

## Talking points

- This is the most novel pattern from the case study — agents that are
  **self-aware of their own context consumption**.
- Mid-workflow **compaction phase**: at 60–80%, agent pauses, summarizes
  what it's learned, switches to minimal skills, then continues.
- You don't have to build the generator on day one — just maintain the
  three sizes by hand for your top 3 skills first.

## Reset

Delete the `.digest.md` / `.minimal.md` files you created live.
