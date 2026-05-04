// scratch/cache-demo.js
// Demo 02 — Prompt caching
// Run twice within 5 min to see cache_read_input_tokens jump.
//
// Prerequisites:
//   cd scratch && npm install
//   export ANTHROPIC_API_KEY=sk-ant-...
//
// Usage:
//   node cache-demo.js

import Anthropic from "@anthropic-ai/sdk";
const client = new Anthropic();

const bigSystem = "You are a helpful coding assistant. " + "Lorem ipsum ".repeat(2000);

const r = await client.messages.create({
  model: "claude-sonnet-4-5",
  max_tokens: 50,
  system: [{ type: "text", text: bigSystem, cache_control: { type: "ephemeral" } }],
  messages: [{ role: "user", content: "What is 2+2?" }],
});
console.log(r.usage);
