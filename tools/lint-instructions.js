#!/usr/bin/env node

/**
 * lint-instructions.js
 * Fail if instruction files grow past their line budget.
 *   Always-loaded files (AGENTS.md, CLAUDE.md, copilot-instructions.md): 200 lines
 *   Scoped files (.github/instructions/*.md, .claude/rules/**.md):         150 lines
 */

import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";

const ALWAYS = ["AGENTS.md", "CLAUDE.md", ".github/copilot-instructions.md"];
const SCOPED_DIRS = [".github/instructions", ".claude/rules"];
const LIMITS = { always: 200, scoped: 150 };

const scoped = [];
for (const dir of SCOPED_DIRS) {
  const entries = await readdir(dir, { recursive: true }).catch(() => []);
  scoped.push(...entries.filter((f) => f.endsWith(".md")).map((f) => join(dir, f)));
}

let failed = false;
const check = async (file, limit) => {
  const text = await readFile(file, "utf8").catch(() => null);
  if (text === null) return;
  const lines = text.split("\n").length;
  console.log(`${lines > limit ? "❌" : "✅"}  ${file}: ${lines} lines (limit ${limit})`);
  if (lines > limit) failed = true;
};

for (const file of ALWAYS) await check(file, LIMITS.always);
for (const file of scoped) await check(file, LIMITS.scoped);

if (failed) {
  console.error("\nInstruction files over the limit add ambient token cost to every request.");
  process.exit(1);
}
