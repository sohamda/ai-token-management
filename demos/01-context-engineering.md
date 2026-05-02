# Demo 01 — Context engineering: broad retrieval vs `#file`

**Slide reference:** Lever A
**Time:** ~3 minutes
**Punchline:** Same task, ~10× cheaper, *better* answer.

## The setup

This repo has two email files that are easy to confuse:
`src/email/orderConfirmation.js` (legacy) and `src/email/templateEngine.js` (new).

## Step 1 — the bad way

Open Copilot Chat in **Agent mode** (which has full codebase access). Ask a vague question:

> Refactor the order confirmation email to use the new template engine.

Watch:
- The agent reads multiple files, exploring the repo to figure out which ones matter.
- Open **Output → GitHub Copilot Chat**. Note the `ccreq` lines — multiple retrieval and summarization calls.
- The model often grabs `welcomeEmail.js` and unrelated files too.
- The proposed diff sometimes wanders (renames functions, adds Jest, etc.).

Show the audience the response time and the context breakdown.

## Step 2 — the good way

Open a **new chat** (Ask mode, not Agent mode). Ask with precise `#file` references:

> Refactor `#file:src/email/orderConfirmation.js` to use `render` from `#file:src/email/templateEngine.js` instead of `renderLegacy`. Keep behaviour identical.

Watch:
- Response is faster.
- The request payload is a fraction of the size (you can compare in the Output panel).
- The diff is tightly scoped — only the file that needed to change.

## Talking points

- Agent mode and broad questions trigger **expensive** retrieval — the model explores your whole codebase.
- `#file`, `#selection`, `#problems`, `#changes` should be your defaults for scoped work.
- Specificity is free. The more precise your prompt, the less the model has to retrieve.

## Reset

```powershell
git checkout -- src/
```

## References

- [Copilot Chat cheat sheet — chat variables](https://docs.github.com/en/copilot/reference/chat-cheat-sheet?tool=vscode) — `#file`, `#selection`, `#problems`, `#changes` and other context variables
- [Anthropic — Effective context engineering for AI agents](https://www.anthropic.com/engineering/claude-code-best-practices) — why just-in-time retrieval beats up-front dumping
- [GitHub Blog — How to use GitHub Copilot in your IDE](https://github.blog/developer-skills/github/how-to-use-github-copilot-in-your-ide-tips-tricks-and-best-practices/) — tips on scoping context
- [Simon Willison — Context engineering](https://simonwillison.net/2025/Jun/27/context-engineering/) — concept overview
