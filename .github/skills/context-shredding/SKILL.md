# Context Shredding

Ship every skill in **three sizes** so the agent can pick the right tier based
on how full the context window already is.

## Tiers

| Tier    | File               | Size           | When to load   |
| ------- | ------------------ | -------------- | -------------- |
| Full    | `SKILL.md`         | 400–800 tokens | < 60% context  |
| Digest  | `SKILL.digest.md`  | 150–320 tokens | 60–80%         |
| Minimal | `SKILL.minimal.md` | 40–100 tokens  | > 80%          |

## Compression rules

1. Preserve **tables** — they're the densest format.
2. Drop **code blocks** first — they're verbose.
3. Keep **decision rationale** over implementation details.
4. Always preserve H1 + first paragraph.
5. Add a `> _See SKILL.md for full content._` pointer in compressed variants.

## Context awareness tag

Add this at the top of long prompt files:

```markdown
<context_awareness>
At >60% context used, load SKILL.digest.md instead of SKILL.md.
At >80% switch to SKILL.minimal.md and stop re-reading prior turns.
</context_awareness>
```

## Mid-workflow compaction

At 60–80% context fill, the agent should:
1. Pause and summarize what it's learned so far.
2. Switch to digest/minimal skill variants.
3. Continue work with the compressed context.

## Generator

Run `tools/scripts/generate-skill-digests.mjs` in CI to auto-generate
digest and minimal variants from the full SKILL.md.

> _See `references/compression-templates.md` for detailed template examples._
