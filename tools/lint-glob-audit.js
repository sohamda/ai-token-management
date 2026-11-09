#!/usr/bin/env node

// lint-glob-audit.js
// Fail on scoped instructions whose glob matches everything, warn on broad ones.
//   Copilot:     applyTo: "..."   in .github/instructions/*.md
//   Claude Code: paths: [...]     in .claude/rules/**/*.md (no paths = loaded every session)
//
//   "**" or "**/*"       → FAIL  (always loaded)
//   "**/*.java"          → WARN  (type-scoped but repo-wide)
//   "src/test/java/**"   → ok    (directory-scoped)

import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";

const SOURCES = [
  { dir: ".github/instructions", key: "applyTo" },
  { dir: ".claude/rules", key: "paths" },
];

function globsFor(text, key) {
  const front = text.match(/^---\n([\s\S]*?)\n---/)?.[1] ?? "";
  const inline = front.match(new RegExp(`^${key}:\\s*["']?([^"'\\n]+)["']?\\s*$`, "m"));
  if (inline && inline[1].trim()) return inline[1].split(",").map((g) => g.trim());
  const list = front.match(new RegExp(`^${key}:\\s*\\n((?:\\s+-.*\\n?)+)`, "m"));
  if (!list) return [];
  return [...list[1].matchAll(/-\s*["']?([^"'\n]+)["']?/g)].map((m) => m[1].trim());
}

let failed = false;
for (const { dir, key } of SOURCES) {
  const entries = await readdir(dir, { recursive: true }).catch(() => []);
  for (const file of entries.filter((f) => f.endsWith(".md")).map((f) => join(dir, f))) {
    const globs = globsFor(await readFile(file, "utf8"), key);
    if (globs.length === 0) {
      console.log(`⚠️  ${file}: no ${key} (loaded every session)`);
      continue;
    }
    for (const glob of globs) {
      if (glob === "**" || glob === "**/*") {
        console.log(`❌  ${file}: ${key} "${glob}" matches everything`);
        failed = true;
      } else if (glob.startsWith("**/")) {
        console.log(`⚠️  ${file}: ${key} "${glob}" is repo-wide; consider scoping to a directory`);
      } else {
        console.log(`✅  ${file}: ${key} "${glob}"`);
      }
    }
  }
}

if (failed) {
  console.error("\nGlobs that match everything load those instructions on every turn.");
  process.exit(1);
}
