# Blog: Context Is a Budget

Working draft of the blog post *"Context Is a Budget — Reducing Token Usage in AI-Assisted Development."*

## Layout

```
blog/
├── README.md                ← you are here
├── 00-full-draft.md         ← the merged post (publish from this)
├── chapters/
│   ├── 01-hook.md
│   ├── 02-where-tokens-go.md
│   ├── 03-eight-levers.md
│   ├── 04-workflow-patterns.md
│   ├── 05-checklist.md
│   └── 06-closing.md
└── images/
    ├── 01-token-distribution.png   ← generated chart (no longer referenced)
    ├── 02-ccreq-output.png         ← Copilot-era, no longer referenced
    ├── 03-network-tab.png          ← Copilot-era, no longer referenced
    ├── 04-instructions-snippet.png ← code-card render
    ├── 05-lint-output.png          ← terminal render
    ├── 06-handover-flow.png        ← Mermaid render
    ├── 06-handover-flow.mmd        ← Mermaid source
    ├── 07-todo-gitlog.png          ← simulated screenshot, replace with real
    └── 08-checklist-card.png       ← rendered card
```

## Image policy

| Image | Status |
|---|---|
| `/context` screenshot | ⚠ to capture — real `/context` output from a session in the demo repo (placeholder comment in `01-hook.md`) |
| 01 token distribution | not referenced any more (shares were illustrative, not measured) |
| 02 ccreq output / 03 network tab | not referenced any more (Copilot-only, simulated) |
| 04 instructions snippet | ✅ generated (code card) |
| 05 lint output | ✅ generated (terminal render) |
| 06 handover flow | ✅ generated (Mermaid) |
| 07 TODO + git log | ⚠ simulated — replace with a real screenshot of `tools/ralph.sh` output + `git log --oneline` |
| 08 checklist card | ✅ generated (card render) |

## Word count target

~4,500 words. Section budgets are noted at the top of each chapter file.

## Build the merged post

The merged file `00-full-draft.md` is hand-assembled from the chapters. When you change a chapter, update the merged file too, or concatenate:

```bash
cat chapters/0[1-6]*.md | grep -v '^<!-- target' > 00-full-draft.md
```
