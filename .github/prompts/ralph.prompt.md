# /ralph — the Ralph Wiggum loop

Run this prompt in **Agent mode** with a cheap model (GPT-4.1 or Sonnet).

---

You are running a Ralph Wiggum loop on this repo. Be relentless and dumb.

Repeat until `TODO.md` has no unchecked items, or you fail twice in a row:

1. Read `TODO.md`.
2. Pick the **first** unchecked item (the first `- [ ]`).
3. Implement only that item. Use `#file` references to scope context — do NOT
   use broad retrieval or open unrelated files.
4. Run `npm test`. If green, mark the item done by changing `- [ ]` to `- [x]`
   in `TODO.md` and commit with message `ralph: <item>`.
5. If red, append a short failure note (≤2 lines) under the item and stop.
6. Otherwise, GOTO 1.

Constraints:
- Never modify more than one TODO item per iteration.
- Never edit files in `dist/`.
- If an item is ambiguous, mark it with `- [?] <item>  (needs human)` and move on.

Be concise in your output. Do not explain what you are about to do; just do it.
