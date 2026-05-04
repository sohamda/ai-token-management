#!/usr/bin/env node

/**
 * generate-skill-digests.mjs
 *
 * Reads every SKILL.md under .github/skills/ and produces:
 *   - SKILL.digest.md  (~30-40% of original lines)
 *   - SKILL.minimal.md (~10-15% of original lines, max ~10 lines of content)
 *
 * The digest keeps:  H1 (with " (digest)" suffix), one-line summary,
 *                    tables (columns trimmed), key-rule bullets.
 * The minimal keeps: H1 (with " (minimal)" suffix), one-line summary.
 *
 * Both end with a pointer: > _See SKILL.md for full content._
 *
 * Usage:  node tools/scripts/generate-skill-digests.mjs
 * Run in CI to keep compressed variants in sync with the full skill.
 */

import { readdir, readFile, writeFile } from "node:fs/promises";
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

/** Strip BOM if present. */
function stripBom(text) {
  return text.charCodeAt(0) === 0xfeff ? text.slice(1) : text;
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

/**
 * Condense a markdown table: drop the "Size" column (if present) to save
 * tokens, and keep only the remaining columns. Returns the condensed rows.
 */
function condenseTable(tableLines) {
  if (tableLines.length < 2) return tableLines;

  // Parse header to find column indices
  const header = tableLines[0];
  const cols = header.split("|").map((c) => c.trim());

  // Find columns to drop (verbose ones like "Size", "Typical size")
  const dropCols = new Set();
  cols.forEach((c, i) => {
    const lower = c.toLowerCase();
    if (lower.includes("size") || lower.includes("typical")) dropCols.add(i);
  });

  if (dropCols.size === 0) return tableLines;

  return tableLines.map((line) => {
    const parts = line.split("|");
    const kept = parts.filter((_, i) => !dropCols.has(i));
    return kept.join("|");
  });
}

function generateDigest(sections) {
  const out = [];

  for (const s of sections) {
    const isCritical = CRITICAL_HEADINGS.has((s.heading || "").toLowerCase());

    if (s.level === 0 || s.level === 1) {
      // H1 — rename with (digest) suffix
      if (s.heading) {
        out.push(`# ${s.heading} (digest)`);
      }

      // Keep only the first paragraph as a one-liner summary
      const paraLines = [];
      for (const line of s.lines) {
        if (line.trim() === "" && paraLines.length > 0) break;
        if (line.trim()) paraLines.push(line.trim());
      }
      if (paraLines.length) {
        const para = paraLines.join(" ");
        const sentences = para.match(/[^.!?]+[.!?]+/g);
        const summary = sentences ? sentences[0].trim() : para;
        out.push("");
        out.push(summary);
      }
    } else if (isCritical) {
      // Critical sections: keep heading + condensed tables + bullets (max 5)
      out.push("");
      out.push(`${"#".repeat(s.level)} ${s.heading}`);
      out.push("");

      const tableLines = s.lines.filter((l) => l.startsWith("|"));
      if (tableLines.length >= 2) {
        const condensed = condenseTable(tableLines);
        out.push(...condensed);
      }

      // Keep bullet points (max 5) — match both - / * and numbered lists
      let bulletCount = 0;
      for (const line of s.lines) {
        if (bulletCount >= 5) break;
        if (/^\s*[-*\d]/.test(line) && line.trim().length > 5) {
          out.push(line);
          bulletCount++;
        }
      }
    }
    // Non-critical sections: drop entirely in digest
  }

  out.push("");
  out.push("> _See SKILL.md for full content._");
  return out.join("\n");
}

function generateMinimal(sections) {
  const out = [];

  // H1 with (minimal) suffix
  const h1 = sections.find((s) => s.level <= 1 && s.heading);
  if (h1) out.push(`# ${h1.heading} (minimal)`);
  out.push("");

  // One-line summary from the preamble
  const preamble = sections.find((s) => s.level <= 1);
  if (preamble) {
    const paraLines = [];
    for (const line of preamble.lines) {
      if (line.trim() === "" && paraLines.length > 0) break;
      if (line.trim()) paraLines.push(line.trim());
    }
    if (paraLines.length) {
      const para = paraLines.join(" ");
      const sentences = para.match(/[^.!?]+[.!?]+/g);
      const summary = sentences ? sentences[0].trim() : para;
      out.push(summary.length > 150 ? summary.slice(0, 147) + "..." : summary);
    }
  }

  // Extract the most critical one-liner from "tiers" or "key rules" section
  const tiersSection = sections.find(
    (s) => s.heading && s.heading.toLowerCase() === "tiers"
  );
  if (tiersSection) {
    // Emit a condensed prose summary of the tiers table
    const tableLines = tiersSection.lines.filter((l) => l.startsWith("|") && !l.includes("---"));
    if (tableLines.length > 1) {
      // Skip header row, extract tier names and thresholds
      const tiers = [];
      for (const row of tableLines.slice(1)) {
        const cols = row.split("|").map((c) => c.trim()).filter(Boolean);
        if (cols.length >= 3) {
          tiers.push(`${cols[0].toLowerCase()} (${cols[cols.length - 1]})`);
        }
      }
      if (tiers.length) {
        out.push(`Three tiers: ${tiers.join(", ")}.`);
      }
    }
  }

  // Extract one key rule
  const rulesSection = sections.find(
    (s) => s.heading && CRITICAL_HEADINGS.has(s.heading.toLowerCase())
      && s.heading.toLowerCase() !== "tiers"
  );
  if (rulesSection) {
    for (const line of rulesSection.lines) {
      if (/^\s*[-*\d]/.test(line) && line.trim().length > 10) {
        out.push(line.replace(/^\s+/, "").replace(/^\d+\.\s*/, "- "));
        break;
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
    const raw = await readFile(path, "utf-8");
    const text = stripBom(raw);
    const sections = parseSections(text);

    const digest = generateDigest(sections);
    const minimal = generateMinimal(sections);

    const dir = dirname(path);
    const digestPath = join(dir, "SKILL.digest.md");
    const minimalPath = join(dir, "SKILL.minimal.md");

    await writeFile(digestPath, digest, "utf-8");
    await writeFile(minimalPath, minimal, "utf-8");

    const digestLines = digest.split("\n").length;
    const minimalLines = minimal.split("\n").length;
    const sourceLines = text.split("\n").length;

    console.log(`${path} (${sourceLines} lines)`);
    console.log(`  \u2192 ${digestPath} (${digestLines} lines, ${Math.round(digestLines / sourceLines * 100)}%)`);
    console.log(`  \u2192 ${minimalPath} (${minimalLines} lines, ${Math.round(minimalLines / sourceLines * 100)}%)`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
