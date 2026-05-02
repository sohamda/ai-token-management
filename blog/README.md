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
    ├── 01-token-distribution.png   ← generated chart
    ├── 02-ccreq-output.png         ← simulated screenshot, replace with real
    ├── 03-network-tab.png          ← simulated screenshot, replace with real
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
| 01 token distribution | ✅ generated (matplotlib) |
| 02 ccreq output | ⚠ simulated — replace with a real VS Code Output panel screenshot before publishing |
| 03 network tab | ⚠ simulated — replace with a real DevTools screenshot |
| 04 instructions snippet | ✅ generated (code card) |
| 05 lint output | ✅ generated (terminal render) |
| 06 handover flow | ✅ generated (Mermaid) |
| 07 TODO + git log | ⚠ simulated — replace with a real terminal screenshot |
| 08 checklist card | ✅ generated (card render) |

## Word count target

~3,200 words. Section budgets are noted at the top of each chapter file.

## Build the merged post

The merged file `00-full-draft.md` is hand-assembled from the chapters. When you change a chapter, update the merged file too, or concatenate:

```powershell
Get-Content chapters/01-hook.md, chapters/02-where-tokens-go.md, chapters/03-eight-levers.md, chapters/04-workflow-patterns.md, chapters/05-checklist.md, chapters/06-closing.md | Set-Content 00-full-draft.md
```
