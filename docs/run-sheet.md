# Run sheet — 45 minutes (Q&A excluded)

Open `presentations/context-is-budget-jfall.html`, press **F** on the projector screen, then **P** to open the presenter window on your laptop. The presenter window shows the notes, a timer (starts when you leave slide 1; **T** restarts it) and "leave this slide by mm:ss", green or red. Both windows follow either one's arrow keys.

**Demo cues.** Every slide with a demo or a file to show has a one-line strip at the bottom: **▶ live**, **▶ recording** or **show**, with the commands and files. The presenter window shows the full steps, and you can click a highlighted prompt or command to copy it before pasting it into the terminal. Its "Next:" line also flags the upcoming demo. Press **D** in either window to hide or show the strips on the projector.

If the browser blocks sync between the two windows from `file://`, serve the folder instead:

```bash
python3 -m http.server 8000 --directory presentations
```

## Before you go on stage

- [ ] `git reset --hard demo-start && git clean -fd`, then `claude` from the repo root. Status line visible.
- [ ] Second terminal open in the repo, font large.
- [ ] Backup recordings of demos 01, 02, 03, 08 and 10 ready to play, one keystroke away.
- [ ] Every dashed **$?.??** / **???** box on the slides replaced with a measured number (list below), then `tools/scripts/export-pdf.sh` to refresh `presentations/context-is-budget-jfall.pdf`.
- [ ] Repo public, so the QR code works (it points at `github.com/sohamda/ai-token-management`).
- [ ] Laptop on power, notifications off, display mirroring off (extended desktop).
- [ ] Open the deck once while online so the browser caches the fonts (Inter, JetBrains Mono from Google Fonts). Offline it falls back to system fonts and re-fits each slide, so nothing breaks; it just looks less on-brand.

The slides scale to fill any screen size. The navigation bar only appears when you move the mouse; a thin progress line at the bottom shows how far through the main talk you are.

## The 45 minutes

| Leave by | Slide | Live / recorded | If it goes wrong |
|---|---|---|---|
| 0:30 | 1 Title | — | — |
| 3:00 | 2 One feature, two ways | numbers from dry run | — |
| 5:00 | 3 The budget is real now | — | — |
| 7:30 | 4 Anatomy of a request | **live** `/context` (1 min) | screenshot |
| 9:00 | 5 What changed in a year | — | — |
| 9:30 | 6 Roadmap | — | — |
| 12:30 | 7 A · Scope the ask | **live** demo 01 (2 min) | recording |
| 15:00 | 8 B · Don't break the cache | **live** demo 02 step 2: `/model` warning (1 min) | describe it |
| 18:30 | 9 C · Tool output | **live** demo 03: reset first (demo 01's edit breaks `OrderConfirmationServiceTest`), then `wc -l` vs hook (2.5 min) | recording |
| 20:30 | 10 D · Codify once | — | — |
| 22:30 | 11 E · Model and effort | — | — |
| 24:00 | 12 F · Output discipline | — | — |
| 25:30 | 13 G · Repo cheap to read | — | — |
| 27:30 | 14 H · Read the meter | **live** status line + `/usage` (1.5 min) | screenshot |
| 28:00 | 15 Same levers, your tool | — | — |
| 32:00 | 16 Pattern 1 · Ralph | **live** reset, then `MAX=1 tools/ralph.sh`, talk over it (its `git add -A` would commit leftover demo edits) | recording |
| 34:00 | 17 Pattern 2 · Checkpoint | — | — |
| 38:00 | 18 Pattern 3 · Plan → Build → Review | **live** demo 10: `/exit`, then `tools/demo10.sh`; acts 2–3 are one @-mention each (time it in the dry run) | recording |
| 39:30 | 19 Java's token sinks | — | — |
| 41:30 | 20 Back to the feature | numbers from dry run | — |
| 43:00 | 21 Three things | — | — |
| 44:00 | 22 Closing + QR | leave up for Q&A | — |

**Behind schedule?** Cut in this order: slide 12 (F), slide 13 (G), the live part of slide 14 (just point at the status line), then switch slides 16 and 18 to their recordings.

## Numbers to measure in the dry run

| Placeholder | Slide | How |
|---|---|---|
| Default-way cost | 2 and 20 | `/clear`, `/model opus`, `/effort max`, prompt: *"Add a VIP line to the order emails when the total is over $100"*, let it finish, `/usage`. |
| Disciplined cost | 2 and 20 | `/clear`, `/model sonnet`, `/effort medium`, run demo 10 (planner → implementer → reviewer), `/usage`. Include the subagents (on a subscription the attribution shows them). |
| Raw vs trimmed test lines | 9 | Done: 53–54 raw, 3 trimmed on a green run (Nov 2026, warm Maven cache). Re-check with `mvn test \| wc -l` only if the build changes. |

Reset between the two feature runs (`git reset --hard demo-start && git clean -fd`). Check that both end with green tests; if they don't, say so on stage. Note wall-clock time for both runs too: speed is the better argument for people who don't pay the bill.

On a subscription, `/usage` shows an estimate at list price. That's fine for comparing the two runs; say "estimated" on stage.
