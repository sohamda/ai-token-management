<!-- target: ~300 words -->

## Where the tokens actually go

Every request to a coding agent is a stack of layers, re-sent in full on every turn:

| Layer | What makes it grow | Re-sent each turn? |
|---|---|---|
| System prompt and tool definitions | MCP servers, plugins. Much smaller now that tools load on demand | Yes, usually from cache |
| Project instructions | `CLAUDE.md`, `AGENTS.md`, `copilot-instructions.md`, unscoped rules | Yes, usually from cache |
| Files and tool output | Broad exploration, whole-file reads, test and build logs | Yes, once they're in the conversation |
| Conversation history | Every turn you don't clear or compact | Yes |
| Model output and thinking | Narration, recaps, high effort on easy tasks | Produced once, then re-read as history |

A few things to notice:

- **Everything is re-sent.** The model has no memory between requests, so turn 30 pays to re-read turns 1 to 29. Caching makes that re-read cheap (10% of the input price on Sonnet 5.5) but not free, and a cache miss makes it full price.
- **Tool output is the new tool schema.** Two years ago the surprise was how much the tool definitions cost. Both major tools now defer them. Today's surprise is a single `mvn test` dumping hundreds of lines into context, where they're re-read for the rest of the session.
- **Output is small in volume but expensive.** Output tokens cost five times input on every current Claude model, and thinking tokens bill as output.

> **Rule of thumb:** measure your own sessions before optimising. The layer dominating *your* sessions is rarely the one your gut says.

You no longer have to guess. In Claude Code, `/context` breaks down the current window by layer, and `/usage` shows the session's cost and cache hit rate. In VS Code, Copilot shows a context-window indicator; Copilot CLI has `/context` too. Run one of those now, before you read the levers. It's the most useful minute in this post.
