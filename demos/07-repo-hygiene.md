# Demo 07 — Make the repo cheap to read

**Lever:** G · **Time:** ~3 min
**Punchline:** The agent doesn't know your dead code is dead.

## Step 1 — the polluted search

`/clear`, then:

> Where is the order confirmation email body built?

Claude Code has no index; it greps. It finds `src/email/orderConfirmation.js` and `src/email/templateEngine.js` (dead JavaScript) as well as the Java. Point at the extra reads. Run `/usage`.

## Step 2 — delete the dead code

In the second terminal:

```bash
git rm -r -q src/index.js src/api src/email src/utils dist
git commit -qm "Remove dead JS implementation"
```

Git history keeps it for anyone who needs it. `/clear`, ask the same question, `/usage` again.

## Step 3 — hide what you can't delete

Open `.claude/settings.json`:

```json
{ "permissions": { "deny": ["Read(./target/**)"] } }
```

Generated output stays out of reach entirely. Mention `.gitignore`: both Copilot's index and Claude Code's search respect it, and an already-tracked file also needs `git rm --cached`.

## Step 4 — the summary at the top

Open `TemplateEngine.java` and show the class Javadoc:

```java
/**
 * New template engine. All new emails should use render(); legacy
 * code still calls renderLegacy() until migrated.
 */
```

Three lines answer "what does this do, and what should I call?" without reading the rest.

## Talking points

- Search-based agents read whatever matches. Every stale copy is a candidate.
- Small, well-named files mean narrow reads; god classes force whole-file reads.
- Copilot: content exclusions for files that must stay in the repo but out of the model's sight.

## Reset

```bash
git reset --hard demo-start && git clean -fd
```

## References

- [Claude Code — Permission rules (Read deny)](https://code.claude.com/docs/en/permissions)
- [Git — gitignore](https://git-scm.com/docs/gitignore)
- [GitHub — Excluding content from Copilot](https://docs.github.com/en/copilot/managing-copilot/managing-github-copilot-in-your-organization/setting-policies-for-copilot-in-your-organization/excluding-content-from-github-copilot)
