# Context Shredding (digest)

Ship every skill in **three sizes** so the agent can pick the right tier based on how full the context window already is.

## Tiers

| Tier    | File               | When to load   |
| ------- | ------------------ | -------------- |
| Full    | `SKILL.md`         | < 60% context  |
| Digest  | `SKILL.digest.md`  | 60–80%         |
| Minimal | `SKILL.minimal.md` | > 80%          |

## Compression rules

1. Preserve **tables** — they're the densest format.
2. Drop **code blocks** first — they're verbose.
3. Keep **decision rationale** over implementation details.
4. Always preserve H1 + first paragraph.
5. Add a `> _See SKILL.md for full content._` pointer in compressed variants.

> _See SKILL.md for full content._