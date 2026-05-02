#!/usr/bin/env node

// lint-glob-audit.js
// Warn/fail if any instructions file uses an overly broad applyTo glob.
//
// Rules:
//   applyTo: "**"        → FAIL  (matches everything, always loaded)
//   applyTo: "**/ *.js"  → WARN  (broad, but at least type-scoped)
//   applyTo: "src/**"    → ok    (directory-scoped)

import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";

const DIR = ".github/instructions";

const files = (await readdir(DIR).catch(() => [])).filter((f) =>
  f.endsWith(".md"),
);

let failed = false;

for (const file of files) {
  const text = await readFile(join(DIR, file), "utf8");
  const match = text.match(/applyTo:\s*["']([^"']+)["']/);

  if (!match) {
    console.log(`⚠️  ${file}: no applyTo found (loaded globally)`);
    continue;
  }

  const glob = match[1];

  if (glob === "**" || glob === "**/*") {
    console.log(
      `❌  ${file}: applyTo: "${glob}" — matches everything, loaded every turn`,
    );
    failed = true;
  } else if (glob.startsWith("**/*.") || glob.startsWith("**/{")) {
    console.log(
      `⚠️  ${file}: applyTo: "${glob}" — broad extension match, consider scoping to a directory`,
    );
  } else {
    console.log(`✅  ${file}: applyTo: "${glob}"`);
  }
}

if (files.length === 0) {
  console.log("No instruction files found in", DIR);
}

if (failed) {
  console.error(
    '\nBroad applyTo globs cause instructions to load on every turn. Use "src/**/*.js" or narrower.',
  );
  process.exit(1);
}
