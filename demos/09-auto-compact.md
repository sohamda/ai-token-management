# Demo 09 — Checkpoint & reset

**Pattern:** 2 · **Time:** ~3 min
**Punchline:** Compaction is automatic now. *When* you reset is still your call, and the options cost very different amounts.

## Step 1 — a session with history

Reuse a session from the earlier demos, or build one in three turns:

> Read the classes under @src/main/java/com/example/demo/email/ and summarise how emails are built.

> Now do the same for @src/main/java/com/example/demo/api/.

> Which of these classes have no tests?

Run `/context`: the messages section is now the biggest layer. Point at the status line's `ctx %`.

## Step 2 — the four options

Walk through them on the slide, demo two:

| Action | Cost | When |
|---|---|---|
| `/clear` | free | switching to an unrelated task (`/rename` first, `/resume` later) |
| `/rewind` (or Esc Esc) | small: returns to an already-cached prefix | the last turns went down a wrong path |
| `/compact <focus>` | one request that reads the whole conversation: cheap while the cache is warm | mid-task, you want to continue with less |
| auto-compaction | same as `/compact`, at a moment you didn't pick | you forgot the other three |

Demo `/compact keep the list of untested classes and nothing else`, then `/context` again: the messages layer shrank. Then `/rename email-audit` and `/clear`, and show `/resume` brings it back.

## Step 3 — a deliberate hand-off

> Write NOTES.md: goal, decisions, files touched, next step. Under 15 lines.

`/clear`, then:

> Read @NOTES.md and do the next step.

## Talking points

- Project-root `CLAUDE.md` / `AGENTS.md` are re-read after compaction; instructions you only typed in chat are not. Put anything you'll need again in a file.
- A `# Compact instructions` section in `CLAUDE.md` steers every compaction (see demo 04 for the `@AGENTS.md` import that makes that work in this repo).
- Compacting right after a long break is the expensive case: the cache is cold, so the summary request re-reads everything at full price.
- Rule of thumb: one task per session, and compact at a natural break.

## Reset

```bash
rm -f NOTES.md
```

Then `/clear`.

## References

- [Claude Code — Manage context proactively](https://code.claude.com/docs/en/costs#manage-context-proactively)
- [Claude Code — Compacting the conversation (cache cost)](https://code.claude.com/docs/en/prompt-caching#compacting-the-conversation)
- [Claude Code — Instructions seem lost after /compact](https://code.claude.com/docs/en/memory#instructions-seem-lost-after-%2Fcompact)
- [Claude Code — Checkpointing and /rewind](https://code.claude.com/docs/en/checkpointing)
