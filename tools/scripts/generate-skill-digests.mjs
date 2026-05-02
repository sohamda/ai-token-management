#!/usr/bin/env node

/**
 * generate-skill-digests.mjs
 *
 * Reads every SKILL.md under .github/skills/ and produces:
 *   - SKILL.digest.md  (~40-50% of original)
 *   - SKILL.minimal.md (~10-15% of original)
 *
 * Usage:  node tools/scripts/generate-skill-digests.mjs
 * Run in CI to keep compressed variants in sync with the full skill.
 */

import { readdir, readFile, writeFile, stat } from "node:fs/promises";
import { join, dirname } from "node:path";

const SKILLS_DIR = ".github/skills";

const CRITICAL_HEADINGS = new Set([
  "tiers",
  "key rules",
  "compression rules",
  "constraints",
  "requirements",
  "conventions",
]);

async function findSkillFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const results = [];
  for (const e of entries) {
    const full = join(dir, e.name);
    if (e.isDirectory()) {
      results.push(...(await findSkillFiles(full)));
    } else if (e.name === "SKILL.md") {
      results.push(full);
    }
  }
  return results;
}

function parseSections(text) {
  const lines = text.split("\n");
  const sections = [];
  let current = { heading: "", level: 0, lines: [] };

  for (const line of lines) {
    const match = line.match(/^(#{1,3})\s+(.*)/);
    if (match) {
      if (current.heading || current.lines.length) sections.push(current);
      current = { heading: match[2], level: match[1].length, lines: [] };
    } else {
      current.lines.push(line);
    }
  }
  if (current.heading || current.lines.length) sections.push(current);
  return sections;
}

function generateDigest(sections, maxLines) {
  const out = [];
  for (const s of sections) {
    if (s.level === 0 || s.level === 1) {
      // Always keep H1 and preamble
      if (s.heading) out.push(`${"#".repeat(s.level || 1)} ${s.heading}`);
      // Keep first paragraph, drop code blocks
      let inCode = false;
      for (const line of s.lines) {
        if (line.startsWith("```")) {
          inCode = !inCode;
          continue;
        }
        if (!inCode) out.push(line);
      }
    } else {
      // Keep tables and critical headings
      const isCritical = CRITICAL_HEADINGS.has(s.heading.toLowerCase());
      if (s.heading) out.push(`${"#".repeat(s.level)} ${s.heading}`);

      let inCode = false;
      for (const line of s.lines) {
        if (line.startsWith("```")) {
          inCode = !inCode;
          continue;
        }
        if (inCode) continue; // drop code blocks in digest

        const isTable = line.startsWith("|");
        const isBullet = /^\s*[-*\d]/.test(line);
        if (isTable || (isCritical && isBullet) || line.trim() === "") {
          out.push(line);
        }
      }
    }
    if (out.length > maxLines) break;
  }

  out.push("");
  out.push("> _See SKILL.md for full content._");
  return out.join("\n");
}

function generateMinimal(sections) {
  const out = [];
  // H1 only
  const h1 = sections.find((s) => s.level <= 1 && s.heading);
  if (h1) out.push(`# ${h1.heading} (minimal)`);
  out.push("");

  // Extract key bullet points (max 5)
  let bullets = 0;
  for (const s of sections) {
    if (bullets >= 5) break;
    for (const line of s.lines) {
      if (bullets >= 5) break;
      if (/^\s*[-*\d]/.test(line) && line.trim().length > 10) {
        out.push(line.replace(/^\s+/, "- "));
        bullets++;
      }
    }
  }

  out.push("");
  out.push("> _See SKILL.md for full content._");
  return out.join("\n");
}

async function main() {
  const skills = await findSkillFiles(SKILLS_DIR);

  if (skills.length === 0) {
    console.log("No SKILL.md files found under", SKILLS_DIR);
    return;
  }

  for (const path of skills) {
    const text = await readFile(path, "utf8");
    const lines = text.split("\n");
    const sections = parseSections(text);

    const digestMaxLines = Math.ceil(lines.length * 0.5);
    const digest = generateDigest(sections, digestMaxLines);
    const minimal = generateMinimal(sections);

    const dir = dirname(path);
    const digestPath = join(dir, "SKILL.digest.md");
    const minimalPath = join(dir, "SKILL.minimal.md");

    await writeFile(digestPath, digest, "utf8");
    await writeFile(minimalPath, minimal, "utf8");

    console.log(`${path}`);
    console.log(`  → ${digestPath} (${digest.split("\n").length} lines)`);
    console.log(`  → ${minimalPath} (${minimal.split("\n").length} lines)`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
