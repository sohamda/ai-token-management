# Demo 07 — Repo hygiene & the indexer

**Slide reference:** Lever G
**Time:** ~3 minutes
**Punchline:** Ignore the noise; retrieval gets sharper.

## Step 1 — show retrieval pollution

In a fresh chat (Agent mode), ask a vague question:

> Where is the build output defined?

Watch the retrieved chunks — the assistant often surfaces `dist/bundle.js`,
which is generated noise no one should reason about.

Open the **Output → GitHub Copilot Chat** panel and point at the chunks pulled.

## Step 2 — add `dist/` to `.gitignore`

The repo’s `.gitignore` already excludes `node_modules/` and `*.log`, but `dist/`
is missing. Add it:

```diff
+dist/
 node_modules/
 .DS_Store
 *.log
```

Commit. (For Copilot's repo indexer, `.gitignore` is the primary signal. For
secrets and other org-policy noise, use **content exclusions** in the repo or
org Copilot settings.)

Re-ask the same question. The retrieved chunks no longer include `dist/`.

## Step 3 — the "summary at the top" trick

Open `src/email/templateEngine.js`. Add a 3-line comment at the top:

```js
// templateEngine — central renderer. Use `render(id, data)` for new emails.
// `renderLegacy(id, data)` is deprecated and only used by orderConfirmation.js.
// Templates registered: welcome, order_confirmation_v2.
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
