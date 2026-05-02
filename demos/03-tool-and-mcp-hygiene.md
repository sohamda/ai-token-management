# Demo 03 — Tool & MCP hygiene

**Slide reference:** Lever C
**Time:** ~3 minutes
**Punchline:** Every connected tool's schema is re-sent on every turn.

## Step 1 — show the bloat

Open VS Code → Command Palette → **MCP: List Servers**.
If you have several servers connected (filesystem, github, playwright, brave-search…),
each contributes a tool list that ships with every Copilot Chat request.

Approximate cost per turn:
- Tool name + description: ~50–150 tokens
- Each parameter description: ~20–80 tokens
- A typical MCP server with 8–15 tools: **400–2,500 tokens**, every turn

With 5 servers connected, you might pay **5–10k tokens per turn just for tool definitions** the model never uses.

## Step 2 — disable unused servers

In `.vscode/mcp.json` (or via the UI), disable everything not needed for the
session. For this demo, keep only the filesystem server (or none).

Re-ask a small question. Show the request payload shrank.

## Step 3 — show "good vs bad" tool output

A tool that returns `{ id, summary }` is cheap. A tool that returns a 50-field JSON object is expensive — the model will re-process all 50 fields each turn it's referenced.

Demo with a quick HTTP fetch:

```js
// bad
const r = await fetch("https://api.example.com/orders/o_1001").then(r => r.json());
// returns 1.5kb JSON

// good — server-side projection
const r = await fetch("https://api.example.com/orders/o_1001?fields=id,total,status").then(r => r.json());
// returns 80 bytes
```

## Talking points

- Disable MCP servers per session. Treat them like browser extensions: only the ones you actually use.
- Audit `.vscode/mcp.json` in the repo — a generous default is a tax on every developer.
- Custom tools you build: default to compact responses with optional `?expand=...`.

## Reset

Re-enable any MCP servers you disabled if you actually need them after the demo.

## References

- [GitHub — Using MCP servers in VS Code](https://docs.github.com/en/copilot/customizing-copilot/extending-copilot-in-vs-code/using-mcp-servers-in-vs-code) — configuring `.vscode/mcp.json`, enabling/disabling servers
- [Model Context Protocol — Specification](https://modelcontextprotocol.io/) — the open standard for tool schemas
- [Anthropic — Tool use](https://docs.anthropic.com/en/docs/build-with-claude/tool-use) — how tool definitions consume tokens
- [OpenAI — Function calling](https://platform.openai.com/docs/guides/function-calling) — token cost of tool schemas
