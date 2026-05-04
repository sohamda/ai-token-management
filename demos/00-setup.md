# Demo 00 — Setup

Do this **before** the session.

## Prerequisites

- Java 17+ (JDK)
- Maven 3.9+ (or use the included `./mvnw` wrapper)
- VS Code with the GitHub Copilot + Copilot Chat extensions
- (Optional) Anthropic Claude Code CLI or Cursor for cross-tool comparisons
- A second monitor or large window so the audience can see two panes at once

## One-time setup

```powershell
cd <repo-root>   # wherever you cloned ai-token-management
./mvnw package   # build + run tests — should pass
./mvnw spring-boot:run   # should print "Demo app starting…"
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
- **VS Code Output panel → "GitHub Copilot Chat"** — shows `ccreq` lines with model, latency, and request type per turn
- **Developer Tools → Network tab** (`Ctrl+Shift+I` → Network → filter `completions`) — shows request/response payload sizes
- **Terminal** — for `./mvnw test`, `git status`, `git diff`
- **The presentation** in fullscreen on the projector

### How to show usage

The personal URL `https://github.com/settings/copilot/usage` only works for
**individual** Copilot subscribers. If your seat is org/enterprise-managed, use:

- **Org-level:** `https://github.com/organizations/<YOUR-ORG>/settings/copilot/usage`
- **Copilot Metrics API:** `GET /orgs/{org}/copilot/metrics` (requires admin token)

**Live alternatives that always work:**

1. **Output panel `ccreq` lines** — each line shows model, latency, request type.
2. **DevTools Network tab** — filter `completions`, compare **Size** column before/after.
3. **Latency as a proxy** — same question in a fresh chat vs. a bloated one; the time delta is the token delta.
4. **Post-session log parsing:**
   ```powershell
   Get-ChildItem "$env:APPDATA\Code\logs" -Recurse -Filter "GitHub Copilot Chat.log" |
     Sort-Object LastWriteTime -Descending | Select-Object -First 1 | ForEach-Object {
       Select-String "ccreq.*success" $_.FullName
     }
   ```

## Demo order

The demos are numbered to mirror the slide order. Run them in sequence, or
cherry-pick. Each demo has a clear "before" and "after" you can re-stage.

## References

- [GitHub — Monitoring your Copilot usage](https://docs.github.com/en/copilot/managing-copilot/monitoring-usage-and-entitlements/monitoring-your-copilot-usage-and-entitlements) — org and individual usage dashboards
- [GitHub — Copilot Metrics API](https://docs.github.com/en/rest/copilot/copilot-metrics) — REST API for programmatic usage tracking
- [VS Code — Developer Tools](https://code.visualstudio.com/docs/devadvanced/devtools) — `Ctrl+Shift+I` to open Network tab for request inspection
