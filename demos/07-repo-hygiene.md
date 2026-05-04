# Demo 07 — Repo hygiene & the indexer

**Slide reference:** Lever G
**Time:** ~3 minutes
**Punchline:** Ignore the noise; retrieval gets sharper.

## Step 1 — show retrieval pollution

In a fresh chat (Agent mode), ask a vague question:

> Where is the build output defined?

Watch the retrieved chunks — the assistant often surfaces `target/` build output
or generated class files, which are noise no one should reason about.

Open the **Output → GitHub Copilot Chat** panel and point at the chunks pulled.

## Step 2 — add `dist/` to `.gitignore`

The repo's `.gitignore` already excludes some entries, but `target/`
may still surface. Ensure it’s excluded:

```diff
+target/
 .DS_Store
 *.log
```

Since `target/` files may be tracked, adding to `.gitignore` alone won't
remove them from the index. Untrack them:

```powershell
git rm -r --cached target/
```

Commit. (For Copilot's repo indexer, `.gitignore` is the primary signal. For
secrets and other org-policy noise, use **content exclusions** in the repo or
org Copilot settings.)

Re-ask the same question. The retrieved chunks no longer include `target/`.

## Step 3 — the "summary at the top" trick

Open `src/main/java/com/example/demo/email/TemplateEngine.java`. Add a Javadoc comment at the top:

```java
/**
 * Central renderer. Use {@link #render(String, Map)} for new emails.
 * {@link #renderLegacy(String, Map)} is deprecated and only used by
 * OrderConfirmationService.
 * Templates registered: welcome, order_confirmation_v2.
 */
```

Now ask the assistant *"what does the template engine do?"* — it answers from
the comment without reading the rest of the file.

## Talking points

- The indexer follows `.gitignore`. Tighten it.
- Use **content exclusions** for secrets, fixtures, vendored deps.
- A 200-token summary at the top of each module beats re-reading 5,000 tokens of code.
- Smaller, well-named modules = better symbol-level retrieval = cheaper context.
- Delete dead code. The indexer doesn't know it's dead.

## Reset

```powershell
git checkout -- .
git clean -fd
```

## References

- [GitHub — Content exclusions for Copilot](https://docs.github.com/en/copilot/managing-copilot/managing-github-copilot-in-your-organization/setting-policies-for-copilot-in-your-organization/excluding-content-from-github-copilot) — org/repo-level content exclusions
- [GitHub — Indexing repositories for Copilot](https://docs.github.com/en/copilot/managing-copilot/managing-github-copilot-in-your-organization/managing-github-copilot-features-in-your-organization/indexing-repositories-for-copilot-chat) — how the indexer follows `.gitignore`
- [Git — `.gitignore` documentation](https://git-scm.com/docs/gitignore) — pattern syntax
- [Cursor — `.cursorignore`](https://docs.cursor.com/context/ignore-files) — equivalent ignore file for Cursor
