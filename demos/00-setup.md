# Demo 00 — Setup

Do this **the day before**, on the laptop you'll present from. All live demos use Claude Code.

## Prerequisites

| Tool | Why | Check |
|---|---|---|
| JDK 17+ | the demo app (compiled for Java 17) | `mvn -v` shows the JDK Maven uses |
| Maven 3.9+ | build and tests (the repo has no `./mvnw`) | `mvn -v` |
| Claude Code v2.1.305+ | `/usage` cache line (2.1.251), native `AGENTS.md` (2.1.277), `f` to fix (2.1.305) | `claude --version` |
| jq | the test-output hook and the status line | `jq --version` |
| Node 20+ | only for `npm run lint:context` and the optional API cache script | `node -v` |

On macOS: `brew install maven jq`. Homebrew's Maven brings its own current JDK (27 in November 2026), and the build passes on it. Skip `openjdk@17`: its Homebrew build (17.0.21) is killed at startup on macOS 26.7. SDKMAN works too.

## One-time checks

```bash
cd ai-token-management
mvn -q test                # all tests green
git status -sb             # "## main...origin/main", nothing ahead: every reset goes back to origin/main
claude                     # start from the repo root
```

In the first Claude Code session, accept the workspace trust prompt (the project hook and status line need it), then check:

- The transcript shows `no CLAUDE.md found; AGENTS.md loaded: …/AGENTS.md`.
- The status line shows `model · effort │ ctx % │ cache % │ $ cost`.
- `/hooks` lists the `PreToolUse` hook for `Bash`.
- `/agents` lists `planner`, `implementer` and `reviewer`.
- `/mcp` — note which MCP servers you have, for demo 03.

## Measuring each attempt

Run `/clear` before every "before" and every "after". Since v2.1.211, `/clear` resets the `/usage` Session block and the status line cost, so each attempt's cost reads directly off the screen.

On a subscription the dollar figure is an estimate at list price, not what you pay. It's still the right number for comparing two attempts.

## What's in the repo for the demos

| Path | Used in |
|---|---|
| `src/email/`, `src/api/`, `src/utils/`, `src/index.js`, `dist/` | **Intentional dead code**: an old JS version of the app. Demos 01 and 07. |
| `AGENTS.md` | Demo 04: the always-loaded instructions |
| `.claude/rules/tests.md` | Demo 04: path-scoped rule |
| `.claude/hooks/filter-test-output.sh` | Demo 03: trims `mvn test` output |
| `.claude/statusline.sh` | Demo 14 (and on screen throughout) |
| `.claude/agents/` | Demo 10: planner, implementer, reviewer |
| `tools/ralph.sh`, `TODO.md` | Demo 08: the headless loop |
| `.github/` | The Copilot equivalents, for slides only |

## Record the backups

Live LLM demos are not deterministic, and conference wifi is not reliable. During the dry run, screen-record demos 01, 02, 03, 08 and 10 (on macOS: Cmd+Shift+5), and capture the numbers listed in [docs/run-sheet.md](../docs/run-sheet.md) for the dashed placeholders on the slides.

## Reset between demos

```bash
git reset --hard origin/main && git clean -fd
```

Then `/clear` in Claude Code (or restart it after demo 04, whose `CLAUDE.md` hides `AGENTS.md` until the reset removes it).

## Screen layout

- Terminal with Claude Code, font large enough for the back row.
- A second terminal for `mvn`, `git log` and `wc -l`.
- The deck (`presentations/context-is-budget-jfall.html`) fullscreen on the projector; press `F`.
