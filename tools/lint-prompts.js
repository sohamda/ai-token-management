#!/usr/bin/env node

/**
 * lint-prompts.js
 * Fail if any on-demand prompt file exceeds 250 lines:
 * Copilot prompt files, Claude Code subagents and skills, the Ralph prompt.
 */

import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";

const DIRS = [".github/prompts", ".claude/agents", ".claude/skills", ".github/skills"];
const EXTRA = ["tools/ralph-prompt.md"];
const MAX_LINES = 250;

const files = [...EXTRA];
for (const dir of DIRS) {
  const entries = await readdir(dir, { recursive: true }).catch(() => []);
  files.push(...entries.filter((f) => f.endsWith(".md")).map((f) => join(dir, f)));
}

let failed = false;
for (const file of files) {
  const text = await readFile(file, "utf8").catch(() => null);
  if (text === null) continue;
  const lines = text.split("\n").length;
  console.log(`${lines > MAX_LINES ? "❌" : "✅"}  ${file}: ${lines} lines (limit ${MAX_LINES})`);
  if (lines > MAX_LINES) failed = true;
}

if (failed) {
  console.error("\nPrompt files over the limit consume excessive context per invocation.");
  process.exit(1);
}
