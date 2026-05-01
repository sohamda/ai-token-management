# Demo 00 — Setup

Do this **before** the session.

## Prerequisites

- Node.js 20+
- VS Code with the GitHub Copilot + Copilot Chat extensions
- (Optional) Anthropic Claude Code CLI or Cursor for cross-tool comparisons
- A second monitor or large window so the audience can see two panes at once

## One-time setup

```powershell
cd C:\Users\sohadasgupta\IdeaProjects\ai-token-management
npm install
npm test     # should pass (no tests yet — exits 0)
npm start    # should print "Demo app starting…"
```

## Reset between demos

After each demo, restore the repo to a clean state:

```powershell
git stash --include-untracked
git checkout -- .
git clean -fd
```

Or, if you committed during a demo:

```powershell
git reset --hard origin/main
```

## Useful panels to keep visible

- **Copilot Chat** — the main demo surface
- **VS Code Output panel → "GitHub Copilot Chat"** — shows what context was sent
- **Browser tab on https://github.com/settings/copilot/usage** — premium-request meter
- **Terminal** — for `npm test`, `git status`, `git diff`
- **The presentation** in fullscreen on the projector

## Demo order

The demos are numbered to mirror the slide order. Run them in sequence, or
cherry-pick. Each demo has a clear "before" and "after" you can re-stage.
