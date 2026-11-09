# Run sheet — 45 minutes (Q&A excluded)

Open `presentations/token-presentation.html`, press **F** on the projector screen, then **P** to open the presenter window on your laptop. The presenter window shows the notes, a timer (starts when you leave slide 1; **T** restarts it) and "leave this slide by mm:ss", green or red. Both windows follow either one's arrow keys.

If the browser blocks sync between the two windows from `file://`, serve the folder instead:

```bash
python3 -m http.server 8000 --directory presentations
```

## Before you go on stage

- [ ] `git reset --hard demo-start && git clean -fd`, then `claude` from the repo root. Status line visible.
- [ ] Second terminal open in the repo, font large.
- [ ] Backup recordings of demos 01, 02, 03, 08 and 10 ready to play, one keystroke away.
- [ ] Every dashed **$?.??** / **???** box on the slides replaced with a measured number (list below).
- [ ] Repo public, so the QR code works (it points at `github.com/sohamda/ai-token-management`).
- [ ] Laptop on power, notifications off, display mirroring off (extended desktop).

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
| 18:30 | 9 C · Tool output | **live** demo 03: `wc -l` vs hook (2.5 min) | recording |
| 20:30 | 10 D · Codify once | — | — |
| 22:30 | 11 E · Model and effort | — | — |
| 24:00 | 12 F · Output discipline | — | — |
| 25:30 | 13 G · Repo cheap to read | — | — |
| 27:30 | 14 H · Read the meter | **live** status line + `/usage` (1.5 min) | screenshot |
| 28:00 | 15 Same levers, your tool | — | — |
| 32:00 | 16 Pattern 1 · Ralph | **live** `MAX=1 tools/ralph.sh`, talk over it | recording |
| 34:00 | 17 Pattern 2 · Checkpoint | — | — |
| 38:00 | 18 Pattern 3 · Plan → Build → Review | **recorded** demo 10 time-lapse (3 min) | — |
| 39:30 | 19 Java's token sinks | — | — |
| 41:30 | 20 Back to the feature | numbers from dry run | — |
| 43:00 | 21 Three things | — | — |
| 44:00 | 22 Closing + QR | leave up for Q&A | — |

**Behind schedule?** Cut in this order: slide 12 (F), slide 13 (G), the live part of slide 14 (just point at the status line), then switch slide 16 to the recording.

## Numbers to measure in the dry run

| Placeholder | Slide | How |
|---|---|---|
| Default-way cost | 2 and 20 | `/clear`, `/model opus`, `/effort max`, prompt: *"Add a VIP line to the order emails when the total is over $100"*, let it finish, `/usage`. |
| Disciplined cost | 2 and 20 | `/clear`, `/model sonnet`, `/effort medium`, run demo 10 (planner → implementer → reviewer), `/usage`. Include the subagents (on a subscription the attribution shows them). |
| Raw vs trimmed test lines | 9 | `mvn test \| wc -l`, then count the lines Claude received after "Run the tests". |

Reset between the two feature runs (`git reset --hard demo-start && git clean -fd`). Check that both end with green tests; if they don't, say so on stage. Note wall-clock time for both runs too: speed is the better argument for people who don't pay the bill.

On a subscription, `/usage` shows an estimate at list price. That's fine for comparing the two runs; say "estimated" on stage.
