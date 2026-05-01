# Demo 01 — Context engineering: `@workspace` vs `#file`

**Slide reference:** Lever A
**Time:** ~3 minutes
**Punchline:** Same task, ~10× cheaper, *better* answer.

## The setup

This repo has two email files that are easy to confuse:
`src/email/orderConfirmation.js` (legacy) and `src/email/templateEngine.js` (new).

## Step 1 — the bad way

Open Copilot Chat in a fresh chat. Ask:

> @workspace Refactor the order confirmation email to use the new template engine.

Watch:
- The chat sits "thinking" while it indexes / retrieves.
- Open **Output → GitHub Copilot Chat**. Note the request size — typically tens of thousands of tokens of retrieved chunks.
- The model often grabs `welcomeEmail.js` and unrelated files too.
- The proposed diff sometimes wanders (renames functions, adds Jest, etc.).

Show the audience the response time and the context breakdown.

## Step 2 — the good way

Reset the chat (`/clear` or new chat). Ask:

> Refactor `#file:src/email/orderConfirmation.js` to use `render` from `#file:src/email/templateEngine.js` instead of `renderLegacy`. Keep behaviour identical.

Watch:
- Response is faster.
- The request payload is a fraction of the size (you can compare in the Output panel).
- The diff is tightly scoped — only the file that needed to change.

## Talking points

- `@workspace` is powerful, but it's the **most expensive** retrieval Copilot offers.
- `#file`, `#selection`, `#problems`, `#changes` should be your defaults.
- `#codebase` is a middle ground — narrower than `@workspace`, broader than `#file`.

## Reset

```powershell
git checkout -- src/
```
