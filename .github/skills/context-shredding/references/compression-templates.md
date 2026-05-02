# Compression templates

Templates for creating digest and minimal variants of SKILL files.

## Full → Digest rules

1. Keep H1 + first paragraph verbatim.
2. Keep all tables (densest format).
3. Replace code blocks with one-line summaries.
4. Drop examples, keep rules.
5. Target: 40–50% of original line count.

## Digest → Minimal rules

1. Keep H1 only (drop all other headings).
2. Compress to 3–5 bullet points of decisions only.
3. Drop all tables, code, and examples.
4. Add `> _See SKILL.md for full content._`
5. Target: 10–15% of original line count.

## Example compression

### Full (25 lines)
```markdown
## Compression rules

1. Preserve **tables** — they're the densest format.
2. Drop **code blocks** first — they're verbose.
3. Keep **decision rationale** over implementation details.
4. Always preserve H1 + first paragraph.
5. Add a pointer in compressed variants.

Example:

​```js
// A 30-line code block demonstrating the pattern
// ... (verbose)
​```
```

### Digest (5 lines)
```markdown
## Key rules
- Preserve tables, drop code blocks first.
- Keep decision rationale over implementation details.
```

### Minimal (1 line)
```markdown
Tables > code blocks. Decisions > details.
```
