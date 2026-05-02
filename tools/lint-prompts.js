#!/usr/bin/env node

/**
 * lint-prompts.js
 * Fail if any .github/prompts/*.md exceeds a line-count limit.
 * Default limit: 250 lines.
 */

import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";

const DIR = ".github/prompts";
const MAX_LINES = 250;

const files = (await readdir(DIR).catch(() => [])).filter((f) =>
  f.endsWith(".md"),
);

let failed = false;

for (const file of files) {
  const text = await readFile(join(DIR, file), "utf8");
  const lines = text.split("\n").length;
  const status = lines > MAX_LINES ? "FAIL" : "ok";
  const marker = lines > MAX_LINES ? "❌" : "✅";
  console.log(`${marker}  ${file}: ${lines} lines (limit ${MAX_LINES})`);
  if (lines > MAX_LINES) failed = true;
}

if (files.length === 0) {
  console.log("No prompt files found in", DIR);
}

if (failed) {
  console.error(
    "\nPrompt files over the limit consume excessive context per invocation.",
  );
  process.exit(1);
}
