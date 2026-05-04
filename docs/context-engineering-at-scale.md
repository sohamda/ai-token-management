# Deep Dive: Token & Context Window Management

This repo implements a **6-layer system** (plus observability) for managing LLM context windows. Each layer is independently portable.

---

## Layer 1: Context Budget Planning (Design Time)

Every agent is designed against a **token budget** before it's ever invoked. This is defined in `context-optimization.instructions.md`:

```text
Model limit:           200,000 tokens (Opus)
─ System overhead:      -2,000 tokens
─ Tool schemas (25):    -1,875 tokens  (25 tools × ~75 tokens each)
─ Agent body (200 ln):  -1,500 tokens
─ Instructions (5):     -3,000 tokens  (5 matched files × ~600 avg)
─ Skill (1 SKILL.md):   -2,000 tokens
─ Output headroom:     -20,000 tokens
────────────────────────────────────
Available for conversation: ~169,625 tokens
Per-turn budget: ~8,481 tokens/turn (over ~20 turns)
```

### Concrete limits enforced at authoring time

| Component           | Hard Limit         | Why                                                   |
| ------------------- | ------------------ | ----------------------------------------------------- |
| Agent body          | ≤ 350 lines        | Always in context; every line costs tokens every turn |
| Tool list           | ≤ 30 tools         | Each tool schema adds ~75 tokens                      |
| Handoffs            | ≤ 8                | Each adds ~40 tokens                                  |
| Instruction files   | ≤ 150 lines each   | Auto-loaded when glob matches                         |
| SKILL.md            | ≤ 500 lines        | Loaded on-demand but still large                      |
| Inline templates    | ≤ 50 lines         | Move larger ones to `references/`                     |
| Skill reads in body | ≤ 5 `"Read"` lines | Progressive, not bulk                                 |

**How to apply this**: Before writing any agent, do the math. Know your model's limit, subtract the fixed costs, divide by expected turns. If the budget is negative, split into subagents.

---

## Layer 2: Progressive Disclosure (3-Level Information Architecture)

Information is organized in a strict hierarchy where each level adds detail **only when needed**:

```text
Level 1: AGENTS.md (always loaded, ~200 lines)
    ↓ points to
Level 2: SKILL.md files (loaded on-demand, ≤500 lines)
    ↓ points to
Level 3: references/*.md (loaded only when specific deep content is needed)
```

**The key principle**: No single file tries to be comprehensive. `AGENTS.md` is a table of contents. Skills hold domain knowledge. References hold the implementation details.

**Concrete example**: The `azure-defaults` skill says "use CAF naming" and lists the patterns. But the full SKU matrix or pricing guidance lives in `azure-defaults/references/pricing-guidance.md` — only loaded if the agent actually needs pricing details.

### How to apply this

Structure your repo as:

```text
AGENTS.md                          # L1: overview, conventions, entry point
.github/skills/{name}/SKILL.md     # L2: domain knowledge, loaded on demand
.github/skills/{name}/references/  # L3: deep content, loaded by reference
```

---

## Layer 3: Context Shredding (Runtime Compression)

This is the most novel pattern. Defined in `context-shredding/SKILL.md`, it makes agents **self-aware of their own context consumption** and adaptively compress what they load.

### The Protocol (what agents do before reading any file)

```text
1. Estimate current context usage: total_chars_in_conversation / 4 ≈ tokens
2. Check model limit (Opus: 200K, Codex: 128K)
3. Calculate usage %
4. Select compression tier:
   < 60%  → full     (load entire file)
   60-80% → summarized (load key H2 sections only)
   > 80%  → minimal   (load decision summaries only, <500 chars)
```

### Compression Templates (per artifact)

Each artifact has explicit rules for what to keep at each tier (from `compression-templates.md`):

| Artifact                        | Full | Summarized (60-80%)                                           | Minimal (>80%)                                     |
| ------------------------------- | ---- | ------------------------------------------------------------- | -------------------------------------------------- |
| `01-requirements.md`            | All  | Project Overview, Functional/NFR, Constraints (~3000 chars)   | First paragraph + Key Decisions table (~500 chars) |
| `02-architecture-assessment.md` | All  | Pattern, WAF, Decisions, Resources (~4000 chars)              | Pattern paragraph + Decisions table (~500 chars)   |
| `04-implementation-plan.md`     | All  | Module Inventory, Deploy Strategy, Params, Deps (~5000 chars) | Module table + Strategy paragraph (~800 chars)     |
| `04-governance-constraints.md`  | All  | Deny Policies, Tags, Network (~3000 chars)                    | Deny Policies table only (~500 chars)              |

### General compression rules

- Preserve **tables** (dense information)
- Drop **code blocks** first (verbose)
- Keep **decision rationale** over implementation details
- Keep **resource names and SKUs** over configuration details
- Always preserve H1 title + first paragraph
- At minimal tier, prefer `apex-recall show <project> --json` over reading prose

### Skill Compression (auto-generated digests)

Skills also have 3 tiers. The `generate-skill-digests.mjs` script auto-generates compressed variants:

| Tier    | File               | Target Size                           | When          |
| ------- | ------------------ | ------------------------------------- | ------------- |
| Full    | `SKILL.md`         | 400-800 tokens                        | < 60% context |
| Digest  | `SKILL.digest.md`  | 150-320 tokens (~55% of source lines) | 60-80%        |
| Minimal | `SKILL.minimal.md` | 40-100 tokens (~50% of digest)        | > 80%         |

The generator works by:

1. Extracting H2 sections from `SKILL.md`
2. Prioritizing critical headings (e.g., "Mandatory Icon Embedding")
3. Trimming each section to a max line budget
4. Ensuring code fences are properly closed
5. Adding `> _See SKILL.md for full content._` pointers

**How to apply this**: Create a `generate-digests` script that reads your `SKILL.md` files and produces compressed variants. Embed the tier-selection protocol in your agent definitions.

---

## Layer 4: Context Awareness Tags (Agent-Level Self-Monitoring)

Every agent embeds a `<context_awareness>` XML tag in its body that tells it how to behave as context fills up:

```xml
<context_awareness>
Large agent definition (~590 lines). At >60% context, load SKILL.digest.md variants.
At >80% switch to SKILL.minimal.md and stop re-reading predecessor artifacts.
</context_awareness>
```

Paired with a `<subagent_budget>` tag:

```xml
<subagent_budget>
Invoke no more than 3 subagents sequentially before checkpointing with the user.
</subagent_budget>
```

### Mid-Workflow Compaction Phase

The Bicep CodeGen agent (Step 5) has a dedicated **"Phase 1.6: Context Compaction"** — a mandatory mid-workflow pause where the agent:

1. Summarizes everything learned in Phases 1-1.5 into a single concise message
2. Switches to `SKILL.minimal.md` for all future reads
3. Stops re-reading predecessor artifacts (relies on the summary)
4. Checkpoints to session state so a resume skips re-loading prior context

**How to apply this**: Add a `<context_awareness>` block to every agent definition. Include the agent's approximate line count and explicit instructions for what to do at 60% and 80% thresholds. For long-running agents, add an explicit compaction phase.

---

## Layer 5: Subagent Extraction (Context Isolation)

When a task would add too many tokens to an agent's context, it's extracted into a **subagent** that runs in a fresh context window and returns only a structured result.

### The decision framework

| Condition                                 | Action              |
| ----------------------------------------- | ------------------- |
| > 5 sequential tool calls for one subtask | Extract to subagent |
| Domain shift (infra → app → docs)         | Extract to subagent |
| Estimated context > 60% of limit          | Extract to subagent |
| Turn latency > 15s consistently           | Extract to subagent |
| Task produces structured PASS/FAIL        | Extract to subagent |

### Concrete savings example

```text
Before: Architect does planning (5K) + pricing API calls (40K) + reporting (10K) = 55K tokens
After:  Architect does planning (5K) + delegates to cost-estimate-subagent → gets back 2K result + reporting (12K) = 19K tokens
```

The parent sends a **focused brief** (not raw conversation history):

```text
Instead of: "Here's everything we discussed about pricing..."
Do:         "Get pricing for: Standard_D4s_v5 in swedencentral, P1v3 App Service, S1 SQL DB"
```

**How to apply this**: Identify the tool-heavy or data-heavy phases in your agents. Extract them into subagents that take structured input and return structured output. The parent agent's context only grows by the size of the result, not the intermediate work.

---

## Layer 6: Instruction Glob Targeting (Reducing Ambient Cost)

Instruction files in `.github/instructions/` are auto-loaded based on `applyTo` glob patterns. A broad glob like `**` means the file is loaded **every single time**, regardless of relevance.

### The rules

```yaml
# GOOD: Only loads for Bicep files
applyTo: "**/*.bicep"

# GOOD: Scoped to a specific output folder
applyTo: "**/agent-output/**/*.md"

# BAD: Loads for every file — costs ~500 tokens per request
applyTo: "**"
# Only acceptable for truly universal rules
```

### Real cost

Each instruction file consumes `file_chars / 4` tokens. A 150-line instruction file ≈ 600 tokens. If 10 instruction files match, that's 6,000 tokens of fixed overhead on every turn.

**How to apply this**: Audit your `applyTo` patterns. Narrow `**` to specific file types. If an instruction only matters for `.tf` files, don't load it for `.md` files too.

---

## Layer 7: Observability & Continuous Optimization

The repo includes tooling to **measure** context efficiency and prevent regression.

### Token Estimation Heuristics

| Content Type   | Chars/Token | Fixed Costs                       |
| -------------- | ----------- | --------------------------------- |
| English prose  | ~4.0        | Base system prompt: ~2,000 tokens |
| Code (Java/Kotlin) | ~3.5        | Per tool: ~50-100 tokens          |
| Bicep/ARM JSON | ~3.0-3.2    | Per handoff: ~30-50 tokens        |
| Markdown       | ~3.8        | Workspace info: ~200-500 tokens   |

### Warning thresholds

| Metric                          | Yellow          | Red             |
| ------------------------------- | --------------- | --------------- |
| Fixed agent context cost        | > 5,000         | > 10,000        |
| Instructions loaded per request | > 5 files       | > 10 files      |
| Turns without hand-off          | > 15            | > 25            |
| Single file read                | > 5,000 tokens  | > 15,000 tokens |
| Cumulative file reads/session   | > 30,000 tokens | > 60,000 tokens |

### Latency as a Proxy for Context Size

Since you can't directly observe token counts, latency is used as a signal:

| Latency (Claude Opus) | Estimated Input Tokens         |
| --------------------- | ------------------------------ |
| < 5s                  | < 20K                          |
| 5-10s                 | 20-60K                         |
| 10-20s                | 60-120K                        |
| 20-30s                | 120-160K                       |
| > 30s                 | Near limit — quality degrading |

### Automated Auditing

- **Debug log parsing**: A Python script (`parse-chat-logs.py`) extracts `ccreq` lines from VS Code logs, giving per-turn latency, model, and status
- **Baseline snapshots**: `snapshot-agent-context.sh` captures all agent/skill/instruction files as a snapshot; `diff-context-baseline.sh` generates diffs after optimization
- **Quarterly audit commands**:

  ```bash
  npm run lint:skill-size        # Skills >200 lines without references
  npm run lint:agent-body-size   # Agent bodies >350 lines
  npm run lint:glob-audit        # Broad wildcards on large files
  ```

---

## Portable Checklist: Applying This to Another Repo

1. **Budget your agents** — Calculate fixed costs (system prompt + tools + body + instructions) against your model's limit. If > 10K fixed, refactor.

2. **Create the 3-level hierarchy** — `AGENTS.md` → `SKILL.md` → `references/`. Never inline deep content.

3. **Add `<context_awareness>` tags** — Every agent definition should declare its size and what to do at 60%/80% thresholds.

4. **Build compression templates** — For each artifact type, define what H2 sections to keep/drop at each tier.

5. **Auto-generate skill digests** — Port the `generate-skill-digests.mjs` script. Run it in CI to keep digests in sync.

6. **Extract subagents for heavy phases** — Any phase with > 5 tool calls or > 30K tokens of intermediate data should be a subagent returning a structured result.

7. **Narrow your instruction globs** — Audit every `applyTo` pattern. Replace `**` with file-type-specific globs.

8. **Add a compaction phase** — For long-running agents, add an explicit "summarize and compress" step at ~60-80% estimated context.

9. **Set up observability** — Track turn latency as a proxy for context size. Set up the snapshot/diff baseline workflow.

10. **Run quarterly audits** — Lint for oversized agents, skills, and overly broad globs. Context bloat accumulates silently.
