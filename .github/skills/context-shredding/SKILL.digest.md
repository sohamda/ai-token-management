# Context Shredding (digest)

Ship skills in three sizes: full, digest, minimal. Agent picks by context fill.

## Tiers

| Tier    | File               | When to load   |
| ------- | ------------------ | -------------- |
| Full    | `SKILL.md`         | < 60% context  |
| Digest  | `SKILL.digest.md`  | 60–80%         |
| Minimal | `SKILL.minimal.md` | > 80%          |

## Key rules

- Preserve tables, drop code blocks first.
- Keep decision rationale over implementation details.
- At 60–80% fill: pause, summarize, switch to compressed variants.

> _See SKILL.md for full content._
