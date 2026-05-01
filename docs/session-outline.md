# Reducing Token Usage in AI-Assisted Development
**A technical session for developers**

---

## 1. Why tokens matter

- **Cost.** Every input + output token is billed. A team of 50 devs running an agentic coding tool can easily burn $10k–$50k/month if usage is sloppy.
- **Latency.** Larger contexts → slower time-to-first-token and slower tool loops.
- **Quality (context rot).** Anthropic and Chroma research shows that as context length grows, recall and reasoning *degrade*, even within the model's advertised window. Treat context as a **finite attention budget**, not free real estate.
- **Rate limits.** TPM (tokens-per-minute) caps stall CI, agents, and pair-programming flows.

**Mental model:** Prompt engineering → *Context engineering*. The job is curating the smallest set of tokens that reliably gets the right behavior.

---

## 2. Where tokens actually go (anatomy of a request)

| Bucket | Typical share | Notes |
|---|---|---|
| System prompt / instructions | 5–15% | Often bloated by copy-pasted boilerplate |
| Tool / function schemas | 10–40% | Each tool definition is re-sent every turn |
| Retrieved files & code chunks | 20–60% | Biggest lever |
| Conversation history | 10–30% | Grows linearly without compaction |
| Model output | 5–20% | Verbose explanations are expensive |

> Rule of thumb: profile your own traffic before optimizing. Most teams are surprised by which bucket dominates.

---

## 3. Techniques — grouped by lever

### A. Context engineering (biggest wins)

1. **Just-in-time retrieval over up-front dumping.** Don't paste whole files; let the agent `grep`/`glob`/`view` only what it needs. Anthropic, Cursor, and Cognition all converged on this pattern.
2. **Hierarchical summarization.** Summarize old turns into a compact "scratchpad" or `plan.md`; drop raw history. Claude Code's `/compact` and Cursor's auto-summarize do this.
3. **Sub-agents with isolated context.** Spawn a sub-agent for a focused task; only its *summary* returns to the parent. Dramatic reduction for explore/research workflows.
4. **Read with ranges, not whole files.** `view_range`, line offsets, AST-level slicing. A 2,000-line file becomes 40 lines.
5. **Pruning irrelevant tool output.** Truncate stdout, suppress pagers, pipe through `head`/`grep`.
6. **Structured over prose.** JSON, tables, bullet lists compress more information per token than English paragraphs.

### B. Prompt caching & reuse

- **Anthropic prompt caching, OpenAI automatic prefix caching, Gemini context caching.** Cache hits are typically **10% of base input cost**. Stable system prompts + tool defs + repo conventions belong *first* in the prompt so they cache.
- **Order matters:** static → semi-static → dynamic. Never put a timestamp at the top of a system prompt — it busts the cache.
- **Cache TTLs:** Anthropic = 5 min default, 1 hr paid. Design your session loop to hit within the window.

### C. Tool / plugin design

1. **Fewer, sharper tools.** Each tool schema costs tokens *every turn*. Consolidate overlapping tools; remove unused ones.
2. **Concise descriptions.** Trim parameter docs to the minimum that prevents misuse.
3. **Server-side filtering.** Have the tool return only the fields the model needs (`select`/`fields` parameters), not the full API response.
4. **Pagination & limits as defaults.** Default `limit=10` beats returning 500 rows the model will truncate anyway.
5. **MCP server hygiene.** Disable MCP servers you don't use in the session — their tool lists are loaded into every request.

### D. Skills, rules & standards files

- **Skills / Custom Instructions / Cursor Rules / Copilot Instructions / `AGENTS.md` / `CLAUDE.md`.**
  - Put repo conventions *once* in a file the agent reads on demand, not in every prompt.
  - Anthropic Skills and Copilot custom instructions are **lazy-loaded**: only triggered when relevant, so they don't bloat every turn.
- **Standards to encode:**
  - Build/test/lint commands
  - File layout & naming conventions
  - "Don't read these directories" (node_modules, dist, .venv, generated code)
  - Preferred libraries / patterns
  - Output style (concise, no apologies, no re-explaining)

### E. Model & routing strategy

- **Right-size the model.** Haiku/Mini/Flash for boilerplate, classification, simple edits; Sonnet for normal coding; Opus only for hard reasoning. A router that picks per task can cut spend 50–70%.
- **Batch API.** 50% discount for non-interactive workloads (codemods, doc generation, large refactors).
- **Streaming + early stop.** Stop generation as soon as the answer is complete; use stop sequences.
- **Lower `max_tokens`.** Most coding answers don't need 8k tokens of headroom.

### F. Output discipline

- **"Be concise" in the system prompt** — measurable token savings.
- **Diff-only edits** instead of re-emitting whole files. Tools like `edit`/`apply_patch` exchange tokens for line-anchored deltas.
- **Structured outputs / JSON mode** for machine-consumed responses (no prose padding).
- **No chain-of-thought leakage** in outputs; use thinking blocks or hidden reasoning where supported.

### G. Repo & codebase hygiene (often overlooked)

1. **`.aiignore` / `.cursorignore` / `.copilotignore`.** Exclude lockfiles, fixtures, generated code, large JSON, vendored deps.
2. **Smaller, well-named modules.** Agents retrieve by symbol; long god-files force whole-file reads.
3. **Up-to-date READMEs and module-level docstrings.** A 200-token summary beats the agent re-reading 5,000 tokens of source.
4. **Indexes / symbol maps.** Prebuilt code intelligence (LSP, ctags, repo-map) lets the agent jump rather than scan.
5. **Delete dead code.** It still gets retrieved.

### H. Workflow & process standards

- **Plan-then-execute.** A short plan file (markdown or in-session) prevents the agent from re-discovering the same context every turn.
- **Checkpoint / compact at milestones.** Don't let a single conversation grow past ~50% of the context window.
- **One task per session.** Long-lived sessions accumulate junk; restart with a fresh context for new work.
- **Pair short feedback loops with cheap models.** Lint/typecheck locally before asking the model to fix.
- **Observability.** Log tokens-per-request per developer and per task; create a leaderboard. What gets measured gets optimized.
- **Pre-commit prompts.** Standardize how devs invoke the assistant (templates) so prompts are uniform and cacheable across the team.

---

## 4. Quick-win checklist (for the audience to take home)

- [ ] Add/update `AGENTS.md` (or equivalent) with build, test, lint, conventions
- [ ] Add `.aiignore` for generated/vendored content
- [ ] Move static instructions to the top of the system prompt for cache hits
- [ ] Disable unused MCP servers / tools
- [ ] Default to ranged file reads, not whole-file
- [ ] Route trivial tasks to Haiku/Mini, not Opus/GPT-5
- [ ] Use Batch API for offline jobs
- [ ] Add a "be concise, no preamble" rule to the system prompt
- [ ] Start a new session per task; `/compact` long ones
- [ ] Track tokens per dev per week and review monthly

---

## 5. Anti-patterns to call out

- "Just paste the whole repo into the prompt" — kills cost *and* quality.
- Copy-pasting stack traces with 200 lines of node_modules frames.
- Telling the agent to "explain everything you're doing" — pure output-token tax.
- One giant system prompt that everyone edits — cache misses every change.
- Letting the same chat run for days.
- Adding every shiny MCP server "just in case".

---

## 6. Suggested session structure (60 min)

1. **0–5 min** – Why tokens matter (cost, latency, context rot)
2. **5–15 min** – Anatomy of a request + live token-usage demo
3. **15–35 min** – Walk through the 8 lever groups (A–H) with one concrete code/repo example each
4. **35–50 min** – Hands-on: audit a real prompt + repo, apply 3 quick wins, measure delta
5. **50–60 min** – Q&A + team standards we will adopt

---

## 7. References & further reading

- Anthropic — *Effective context engineering for AI agents* (engineering blog)
- Anthropic docs — *Prompt caching*, *Skills*, *Claude Code best practices*
- Chroma Research — *Context Rot* benchmark
- OpenAI docs — *Prompt caching*, *Batch API*, *Structured outputs*
- Google — *Gemini context caching*
- Cursor docs — *Rules for AI*, *Codebase indexing*
- GitHub — *Copilot custom instructions*, `AGENTS.md` convention
- Cognition — *Don't build multi-agents* (sub-agent context isolation discussion)
