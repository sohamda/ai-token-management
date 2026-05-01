# AI Token Management — Tech Session

Materials for a developer-focused technical session on **reducing token usage in AI-assisted development**.

Two HTML presentations, a small demo repo with intentional bloat to showcase the techniques, and step-by-step demo scripts for each lever.

## Contents

```
.
├── presentations/
│   ├── token-presentation.html          ← general (Copilot, Claude Code, Cursor, etc.)
│   └── token-presentation-copilot.html  ← GitHub Copilot–focused
├── docs/
│   ├── title-and-abstract.md            ← session title options + abstract
│   └── session-outline.md               ← long-form notes the deck was built from
├── demos/
│   ├── 00-setup.md
│   ├── 01-context-engineering.md        ← @workspace vs #file
│   ├── 02-prompt-caching.md
│   ├── 03-tool-and-mcp-hygiene.md
│   ├── 04-instructions-and-skills.md    ← copilot-instructions.md before/after
│   ├── 05-model-routing.md              ← live calculator
│   ├── 06-output-discipline.md          ← whole-file vs diff
│   ├── 07-repo-hygiene.md               ← .aiignore, content exclusions
│   ├── 08-ralph-loop.md                 ← agent loop on TODO.md
│   ├── 09-auto-compact.md
│   └── 10-agent-handover.md             ← /plan → /build → /review
├── src/                                  ← intentionally messy demo code
│   ├── api/
│   ├── email/
│   ├── utils/
│   └── index.js
├── .github/
│   ├── copilot-instructions.md          ← apply during demo 04
│   ├── instructions/
│   │   └── tests.instructions.md
│   └── prompts/
│       ├── ralph.prompt.md
│       ├── plan.prompt.md
│       ├── build.prompt.md
│       └── review.prompt.md
├── AGENTS.md
├── TODO.md                               ← used by the Ralph loop demo
└── plan.md                               ← used by the handover demo
```

## How to use

1. Open `presentations/token-presentation.html` (or the Copilot variant) in a browser.
2. Walk the audience through the slides; switch to the demos at lever H.
3. For each demo, follow the script in `demos/`.
4. Reset between demos with `git stash && git checkout -- .` so re-runs are clean.

## License

MIT.
