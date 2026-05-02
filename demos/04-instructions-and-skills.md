# Demo 04 — Custom instructions & skills (before / after)

**Slide reference:** Lever D
**Time:** ~4 minutes
**Punchline:** Codify it once, never re-type it.

## Step 1 — the "before" demo

Temporarily rename the instructions out of the way:

```powershell
Rename-Item .github\copilot-instructions.md copilot-instructions.md.bak
Rename-Item .github\instructions\tests.instructions.md tests.instructions.md.bak
```

Open a fresh Copilot Chat. Ask:

> Add a unit test for `parseAddress` in `#file:src/utils/parseAddress.js`.

Watch the model:
- Often picks **Jest** or **Vitest** (wrong — we want `node --test`).
- May put the test in a new `__tests__/` folder.
- May use **default** instead of named imports.
- Often verbose: explains what it's about to do, then does it.

## Step 2 — the "after" demo

Restore the instructions:

```powershell
Rename-Item .github\copilot-instructions.md.bak copilot-instructions.md
Rename-Item .github\instructions\tests.instructions.md.bak tests.instructions.md
```

Open a fresh chat. Ask the same question.

Watch:
- Uses `node --test` and `node:assert/strict`.
- Puts the file at `src/utils/parseAddress.test.js`.
- Named imports.
- Concise output, no preamble.

## Step 3 — show the scoping

Open `.github/instructions/tests.instructions.md`. Point out the frontmatter:

```yaml
---
applyTo: "src/**/*.js"
---
```

Explain: this file is **only** loaded into context when matching files are referenced. Repo-wide stuff goes in `copilot-instructions.md`; stack-specific stuff goes in `instructions/*.instructions.md`.

## Talking points

- Anything you find yourself re-typing in chats belongs in instructions.
- Personal style → VS Code settings. Team standards → repo file.
- Instructions are committed and versioned — they're a team artifact.

## Reset

```powershell
git checkout -- .
git clean -fd src/
```

## References

- [GitHub — Adding repository custom instructions](https://docs.github.com/en/copilot/customizing-copilot/adding-repository-custom-instructions-for-github-copilot) — `copilot-instructions.md`, path-scoped `*.instructions.md`, `AGENTS.md`
- [GitHub — Custom instructions in your IDE](https://docs.github.com/en/copilot/customizing-copilot/adding-repository-custom-instructions-for-github-copilot-in-your-ide) — VS Code-specific behavior and `applyTo` globs
- [GitHub — Custom instructions library](https://docs.github.com/en/copilot/tutorials/customization-library/custom-instructions) — curated examples
- [Cursor — Rules for AI](https://docs.cursor.com/context/rules-for-ai) — equivalent in Cursor
- [Anthropic — Claude Code best practices](https://docs.anthropic.com/en/docs/claude-code/overview) — `CLAUDE.md` convention
