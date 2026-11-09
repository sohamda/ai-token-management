# Context Is a Budget — token management for coding agents

Materials for the talk *Context Is a Budget*: eight levers and three workflow patterns for spending tokens well with coding agents. Live demos run in **Claude Code**; every slide also shows the GitHub Copilot equivalent.

## Contents

```
.
├── presentations/
│   ├── token-presentation.html             ← the talk (J-Fall 2026): levers A–H, patterns 1–3
│   ├── token-presentation-copilot.html     ← older Copilot-only deck (premium requests era)
│   ├── token-presentation-enterprise.html  ← older 15-minute exec briefing
│   └── session-copilot-end-to-end.html     ← older Copilot end-to-end session
├── blog/                                    ← the companion post (chapters + merged draft)
├── demos/                                   ← one script per demo, Claude Code (see demos/README.md)
├── docs/                                    ← abstract, long-form outline, scaling case study
├── src/main/java/…                          ← the demo app (Java 17, Spring Boot 3.4)
├── src/email/, src/api/, src/utils/, dist/  ← intentional dead JS, used by demos 01 and 07
├── AGENTS.md                                ← always-loaded instructions (Claude Code reads it natively)
├── .claude/
│   ├── settings.json                        ← test-output hook, status line, Read deny for target/
│   ├── rules/tests.md                       ← path-scoped rule (paths: src/test/java/**)
│   ├── agents/                              ← planner, implementer, reviewer subagents
│   ├── hooks/filter-test-output.sh          ← trims `mvn test` output before Claude sees it
│   └── statusline.sh                        ← model · effort │ ctx % │ cache % │ cost
├── .github/                                 ← the Copilot equivalents (instructions, prompts, skills)
├── tools/
│   ├── ralph.sh, ralph-prompt.md            ← headless Ralph loop (`claude -p` per TODO item)
│   └── lint-*.js                            ← `npm run lint:context`: instruction size and glob checks
├── TODO.md                                  ← backlog for the Ralph loop
└── plan.md                                  ← example output of the planner subagent
```

## The levers and patterns

| | |
|---|---|
| **A** Scope the ask | **E** Right-size the model *and* the effort |
| **B** Don't break the cache | **F** Output discipline |
| **C** Make tool output cheap | **G** Make the repo cheap to read |
| **D** Codify once, load on demand | **H** Read the meter, set a budget |

Patterns: **1** Loop with state on disk (Ralph) · **2** Checkpoint & reset · **3** Plan → Build → Review.

## How to use

1. Follow [demos/00-setup.md](demos/00-setup.md) the day before: JDK 17, Maven, jq, Claude Code v2.1.305+, then `git tag -f demo-start`.
2. Open `presentations/token-presentation.html` in a browser, press `F` for fullscreen and `P` for the presenter view (notes, timer, time cues). The 45-minute plan is in [docs/run-sheet.md](docs/run-sheet.md).
3. Run the demos from `demos/` when a slide's eyebrow says so. Reset with `git reset --hard demo-start && git clean -fd`.

## Credits

- Patterns inspired by Geoffrey Huntley's *Ralph Wiggum* loop, Anthropic's Claude Code documentation and *Effective context engineering for AI agents*, and Cognition's *Don't build multi-agents*.
- The scaling section (`docs/context-engineering-at-scale.md`) is adapted from a production landing-zone repo running ~40 specialised skills.

## License

MIT.
