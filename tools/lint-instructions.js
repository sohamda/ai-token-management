#!/usr/bin/env node

/**
 * lint-instructions.js
 * Fail if any .github/instructions/*.md exceeds a line-count limit.
 * Default limit: 150 lines.
 */

import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";

const DIR = ".github/instructions";
const MAX_LINES = 150;

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
  console.log("No instruction files found in", DIR);
}

if (failed) {
  console.error(
    "\nInstruction files over the limit increase ambient token cost every turn.",
  );
  process.exit(1);
}
