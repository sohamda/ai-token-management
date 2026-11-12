# Stage commands

Everything you type during the talk, in order, one block per thing to copy. Timings and fallbacks are in [run-sheet.md](run-sheet.md); the same prompts are click-to-copy in the deck's presenter view (**P**).

- **T1** = the terminal with Claude Code (on the projector).
- **T2** = the second terminal, a plain shell in the repo root.

---

## Before you go on stage

T2: everything of yours is pushed (must show `## main...origin/main`, nothing ahead):

```bash
git status -sb
```

T2: start from what's on GitHub:

```bash
git reset --hard origin/main && git clean -fd
```

T2: optional, check demo 10 is ready (clean tree, example plan in place):

```bash
tools/demo10.sh --check
```

T2: open the deck, then press **F** (fullscreen) on the projector and **P** (presenter view) on your laptop:

```bash
open presentations/context-is-budget-jfall.html
```

If the two windows don't follow each other from `file://`, serve the folder instead and open <http://localhost:8000/context-is-budget-jfall.html>:

```bash
python3 -m http.server 8000 --directory presentations
```

T1: start Claude Code from the repo root (status line visible at the bottom):

```bash
claude
```

Deck keys: **← →** navigate · **F** fullscreen · **P** presenter view · **D** show/hide the demo cue strips · **T** (presenter window) restart the timer.

---

## Slide 4 · Anatomy of a request (leave by 7:30)

T1:

```text
/context
```

Point at each layer: system prompt and tools, memory files (`AGENTS.md`), messages.

---

## Slide 7 · Lever A, demo 01 (leave by 12:30)

T1, the vague ask:

```text
/clear
```

```text
Refactor the order confirmation email to use the new template engine.
```

While it works, point out it finds the Java **and** `src/email/orderConfirmation.js`. Then:

```text
/usage
```

T1, the scoped ask:

```text
/clear
```

```text
In @src/main/java/com/example/demo/email/OrderConfirmationService.java, call render("order_confirmation_v2", …) from @src/main/java/com/example/demo/email/TemplateEngine.java instead of renderLegacy. Keep behaviour identical.
```

```text
/usage
```

Leave this session open: slide 8 uses its warm cache.

---

## Slide 8 · Lever B, demo 02 (leave by 15:00)

T1, same session:

```text
/usage
```

Read the `Prompt cache (main)` line. Then:

```text
/model opus
```

Read the warning aloud, then **decline** so the session stays on Sonnet.

---

## Slide 9 · Lever C, demo 03 (leave by 18:30)

T2, back to the committed code (demo 01 left edits behind):

```bash
git reset --hard origin/main && git clean -fd
```

T2, what the agent would read without the hook (about 55):

```bash
mvn test | wc -l
```

T1:

```text
Run the tests.
```

It comes back as 3 lines: the `Tests run:` total, `BUILD SUCCESS`, `(full log: …)`. Claude usually types `mvn test 2>&1 | tail -40`; the hook catches that too.

T2, show the hook (10 seconds each):

```bash
cat .claude/hooks/filter-test-output.sh
```

```bash
cat .claude/settings.json
```

Only if you're ahead of time, the red run. T2, break a test:

```bash
sed -i '' 's/isEqualTo("\$49.50")/isEqualTo("$49.99")/' src/test/java/com/example/demo/utils/FormatUtilsTest.java
```

T1:

```text
Run the tests and fix what fails.
```

---

## Slides 10, 11, 13 · Levers D, E, G (optional, 15–20 s each)

T2, slide 10:

```bash
cat AGENTS.md
```

```bash
head -5 .claude/rules/tests.md
```

T2, slide 11:

```bash
head -8 .claude/agents/planner.md .claude/agents/implementer.md
```

T2, slide 13:

```bash
head -20 src/email/orderConfirmation.js
```

```bash
cat .claude/settings.json
```

---

## Slide 14 · Lever H, demo 14 (leave by 27:30)

Point at the status line first. T2, optional:

```bash
cat .claude/statusline.sh
```

T1:

```text
/usage
```

Behind schedule? Skip `/usage` and just point at the status line.

---

## Slide 16 · Pattern 1, demo 08 (leave by 32:00)

Start it at the top of the slide and talk while it runs.

T2, clean tree first (Ralph commits with `git add -A`):

```bash
git reset --hard origin/main && git clean -fd
```

T2:

```bash
MAX=1 tools/ralph.sh
```

While it runs, open `TODO.md` and `tools/ralph-prompt.md` in your editor. When it prints its cost line, T2:

```bash
git log --oneline -3
```

Runs long or fails: **Ctrl+C** and play the recording.

---

## Slide 18 · Pattern 3, demo 10 (leave by 38:00)

T1, quit the running session:

```text
/exit
```

T1, now a plain shell. This moves the example plan aside and submits the planner prompt for you:

```bash
tools/demo10.sh
```

While the planner runs, T2:

```bash
head -8 .claude/agents/planner.md
```

When the planner replies, T2:

```bash
cat plan.md
```

T1, act 2:

```text
@agent-implementer execute plan.md
```

T2, one commit per task:

```bash
git log --oneline -5
```

T1, act 3:

```text
@agent-reviewer review the build commits against plan.md
```

Point at the `VERDICT` line. T1, act 4:

```text
/context
```

```text
/usage
```

Three requests and three summaries, not three transcripts, and the session never changed model.

---

## After the talk

T2, drop the demo commits and edits (they were never pushed):

```bash
git reset --hard origin/main && git clean -fd
```

---

## If something goes wrong

Confirmed `/model opus` by accident on slide 8 (T1):

```text
/model sonnet
```

```text
/clear
```

An approval prompt appears (likely the first time a demo runs `mvn test`): choose **Yes**. "Don't ask again" won't survive the next reset.

`tools/demo10.sh` says the working tree isn't clean, or `plan.md` is from an earlier run (T2):

```bash
git reset --hard origin/main && git clean -fd
```

Claude asks a question instead of acting (for example the planner): answer it in one line and carry on.

A live demo stalls: press **Esc** in T1 to stop the turn, and play that demo's recording.
