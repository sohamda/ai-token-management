
# Context Is a Budget — Reducing Token Usage in AI-Assisted Development

*Eight levers and three workflow patterns that pay for themselves in a week.*

On June 1, 2026 GitHub stopped counting Copilot "premium requests" and started billing AI Credits for every input, output and cached token, at each model's API rate. Claude Code already worked that way: per token on the API, or against a seat allowance that resets every five hours and every week. Whichever tool your team uses, the budget is no longer a metaphor. It is either a line on an invoice or the moment the agent stops for the afternoon.

Anthropic's own numbers give a sense of scale: across enterprise deployments, Claude Code averages about $13 per developer per active day, or $150–250 per developer per month. That's affordable. It's also an average, and averages hide the sessions that cost ten times as much.

Cost is the obvious pain. Two others are sneakier:

- **Latency.** A bigger context takes longer to process, and you wait for every turn.
- **Context rot.** Model recall and reasoning *degrade* as the window fills, even well inside the advertised limit. A 1M-token window doesn't mean 1M tokens of useful attention. **More context isn't free, and past a point it's actively harmful.**

The mental model that fixes all three: stop treating context as a free buffet, and treat it as a budget you spend on every turn.

This post is a practical guide to spending it well: where the tokens actually go, eight levers that move the needle, and three workflow patterns that compound on top of them. The examples use a small Java/Spring Boot repo and Claude Code, with the Copilot equivalent alongside each one.

<!-- Image to capture: /context output from a real session in the demo repo (replaces the generated 01-token-distribution chart). -->

## Where the tokens actually go

Every request to a coding agent is a stack of layers, re-sent in full on every turn:

| Layer | What makes it grow | Re-sent each turn? |
|---|---|---|
| System prompt and tool definitions | MCP servers, plugins. Much smaller now that tools load on demand | Yes, usually from cache |
| Project instructions | `CLAUDE.md`, `AGENTS.md`, `copilot-instructions.md`, unscoped rules | Yes, usually from cache |
| Files and tool output | Broad exploration, whole-file reads, test and build logs | Yes, once they're in the conversation |
| Conversation history | Every turn you don't clear or compact | Yes |
| Model output and thinking | Narration, recaps, high effort on easy tasks | Produced once, then re-read as history |

A few things to notice:

- **Everything is re-sent.** The model has no memory between requests, so turn 30 pays to re-read turns 1 to 29. Caching makes that re-read cheap (10% of the input price on Sonnet 5.5) but not free, and a cache miss makes it full price.
- **Tool output is the new tool schema.** Two years ago the surprise was how much the tool definitions cost. Both major tools now defer them. Today's surprise is a single `mvn test` dumping hundreds of lines into context, where they're re-read for the rest of the session.
- **Output is small in volume but expensive.** Output tokens cost five times input on every current Claude model, and thinking tokens bill as output.

> **Rule of thumb:** measure your own sessions before optimising. The layer dominating *your* sessions is rarely the one your gut says.

You no longer have to guess. In Claude Code, `/context` breaks down the current window by layer, and `/usage` shows the session's cost and cache hit rate. In VS Code, Copilot shows a context-window indicator; Copilot CLI has `/context` too. Run one of those now, before you read the levers. It's the most useful minute in this post.

## The eight levers

A year ago, half of this list was plumbing you had to do yourself: put the stable text first so it caches, switch off tool schemas you don't use, summarise the chat before it fills up. The tools do most of that now. Claude Code and Copilot both place cache breakpoints, load tool definitions on demand and compact long sessions on their own.

What they can't do is make your decisions. Each lever below is stated as a principle that will outlive the next release, followed by what it looks like in Claude Code (the tool I demo) and in Copilot.

---

### A. Scope the ask

The most expensive prompt in agentic coding is the vague one. The agent can't ask you what you meant, so it explores, and you pay for every file it opens on the way.

This demo repo has a trap in it: an old JavaScript version of the email code still sits under `src/email/`, next to the real Java under `src/main/java/.../email/`. Watch what a vague ask does:

> **Vague:** *"Refactor the order confirmation email to use the new template engine."*
> The agent greps for "order confirmation", finds both implementations, reads both, reads the welcome email for comparison, and then asks which one you meant. Or it doesn't ask, and edits the wrong one.

> **Scoped:** *"In @src/main/java/com/example/demo/email/OrderConfirmationService.java, call `render("order_confirmation_v2", …)` from @src/main/java/com/example/demo/email/TemplateEngine.java instead of `renderLegacy`. Keep behaviour identical."*
> Two files read, one small diff.

Anthropic's cost guide puts it bluntly: vague requests trigger broad scanning. Specificity costs you ten seconds of typing and saves the agent's whole discovery phase.

- **Claude Code:** `@path` mentions, and plan mode (Shift+Tab) for anything bigger than one file, so you approve the approach before tokens go into the wrong one. For Java, install a code intelligence plugin: one "go to definition" call replaces a grep followed by several candidate file reads.
- **Copilot:** `#file`, `#selection` and `#problems` do the same job.

**Do this Monday:** name the file and the method in the prompt. Use open-ended exploration only when you genuinely don't know where to look.

---

### B. Don't break the cache

Every turn re-sends the whole conversation. Prompt caching is what makes that affordable: the provider recognises the prefix it has already processed and bills it at the cached rate. On Sonnet 5.5 a cached input token costs 10% of a fresh one; on Opus 5.5 it costs 5%. In a long session most of your input should be cache reads.

You no longer place the cache breakpoints yourself. Both tools order each request so the stable parts come first: tools and system prompt, then your project instructions, then the conversation. What you can still do is break the cache. The match is an exact prefix match, so any change near the top makes the next request re-process everything after it.

What breaks it in Claude Code:

- **Switching model mid-session.** Each model has its own cache. Claude Code asks you to confirm `/model` while the cache is warm, for exactly this reason.
- **Coming back after the cache has expired.** The first message after a long break re-processes the full context. On a subscription the main conversation gets a one-hour cache; with an API key it's five minutes by default.
- **Connecting or removing MCP servers, and enabling plugins that bring them**, when tool definitions aren't deferred.
- **Compaction**, by design (more in pattern 2).

What doesn't break it: editing files, invoking skills, entering plan mode, spawning subagents, and changing effort on the 5.5 models with an API key or subscription. Editing CLAUDE.md or AGENTS.md mid-session doesn't break it either, but it also doesn't take effect until the next `/clear`, `/compact` or restart.

Copilot reached the same conclusion from the other side. In June GitHub explained that its Auto model selection only switches model on the first turn or after compaction, because switching mid-session "can cost more than the routing change saves".

If you build your own agents on the API, the old rule still applies: never put a timestamp or request ID at the top of the system prompt.

```java
// Don't: the first 30 characters change every request, so nothing after them caches
String system = "Today is " + Instant.now() + "\n\n" + SYSTEM_PROMPT;
```

**Do this Monday:** pick the model and effort at the start of a session. Run `/usage` and read the `Prompt cache (main)` line. If it shows misses, it names the likely cause.

---

### C. Make tool output cheap

The old version of this lever was "every MCP schema is a tax on every turn". The harnesses fixed most of that: Claude Code defers MCP tool definitions by default, so only tool names enter context until a tool is used, and VS Code measured an 18% drop in total tokens per user (median) after it turned on Anthropic's server-side tool search.

The tax moved. Today it's in what tools *return*. A `mvn test` run prints plugin banners, per-class results and stack frames: 50-odd lines on this repo's small suite, hundreds on a real project or a first build that downloads dependencies. Every one of them lands in context and gets re-read, from cache, on every turn after.

Three ways to shrink it:

- **Filter before the model sees it.** This repo ships a Claude Code `PreToolUse` hook (`.claude/hooks/filter-test-output.sh`) that rewrites `mvn test` so the full log goes to a file and Claude sees only the test totals, each failing test with its expected and actual values, and `BUILD SUCCESS` or `BUILD FAILURE`. On this repo a green run goes from 50-odd lines to 3. The exit code survives, so Claude still knows when tests fail.
- **Delegate verbose work to a subagent.** "Use a subagent to run the tests and report only the failures": the log stays in the subagent's context, and only its summary comes back.
- **Prefer CLIs to MCP servers.** `gh pr view 42` returns what you asked for. A GitHub MCP server adds a tool listing and returns full JSON objects.

If you write tools yourself, the rule from the first version of this talk still stands: return `{id, summary}` by default and make the 50-field object opt-in.

- **Claude Code:** hooks, subagents, `/mcp` to disable servers you aren't using, `/context` to see what's loaded.
- **Copilot:** tool search does the deferring. Output filtering is up to the commands you let the agent run.

**Do this Monday:** run `/context` in a fresh session, then once more after a test run. Whatever grew is your next hook.

---

### D. Codify once, load on demand

Anything you've typed into a chat three times belongs in a file. The question is which file, because files load at different times:

| Loads | Claude Code | Copilot |
|---|---|---|
| Every session | `CLAUDE.md`, or `AGENTS.md` when there's no `CLAUDE.md` | `.github/copilot-instructions.md`, `AGENTS.md` |
| When a matching file is touched | `.claude/rules/*.md` with `paths:` | `.github/instructions/*.instructions.md` with `applyTo:` |
| When invoked or relevant | Skills, subagents | Prompt files, skills |

Keep the always-loaded layer short. Anthropic's guidance is under 200 lines, and anything that only matters for one workflow or one directory moves down a row. This repo's `AGENTS.md` is 30 lines: build and test commands, conventions, what not to touch, output style. Test conventions live in `.claude/rules/tests.md`, scoped with `paths: ["src/test/java/**/*.java"]`, and load only when Claude opens a test.

Two gotchas worth a slide of their own:

- **Scope the glob to where the rule applies.** The first version of this repo scoped its *test* rules to `src/**/*.java`, so they loaded whenever the agent touched production code. It's an easy mistake to make, and the bundled `npm run lint:glob-audit` catches it.
- **AGENTS.md and CLAUDE.md don't stack by default.** Claude Code reads `AGENTS.md` natively (v2.1.277 and later), but only when there's no `CLAUDE.md` or `CLAUDE.local.md`. The day someone adds a `CLAUDE.md`, your `AGENTS.md` silently stops loading, unless that `CLAUDE.md` imports it with `@AGENTS.md`.

**Do this Monday:** count the lines in your always-loaded files. Move anything workflow-specific into a skill and anything directory-specific into a scoped rule.

---

### E. Right-size the model *and* the effort

The old version of this lever was a multiplier table: GPT-4.1 at 0×, Sonnet at 1×, Opus at 10×. That table is gone. Since June 1, 2026 Copilot bills by token at each model's API rate, so both tools now follow the same price list:

| Model | Input / output per million tokens |
|---|---|
| Claude Haiku 5.5 | $0.10 / $0.50 (prompts up to 100K tokens) |
| Claude Sonnet 5.5 | $2 / $10 |
| Claude Opus 5.5 | $4 / $20 |

Two things changed the routing story. Opus now costs twice Sonnet per token, not five or ten times. The new large gap is between Haiku and everything else: Sonnet costs 20× Haiku, which makes Haiku the obvious choice for subagents that search, read and summarise.

The second change is **effort**. The 5.5 models always think, and thinking tokens are billed as output, so the effort level (`low` to `max`) often moves cost more than the model choice does. It's also the cheaper knob to turn: on the 5.5 models with an API key or subscription, changing effort mid-session keeps the cache, while switching model throws it away.

- **Claude Code:** `/model` at the start of a task, `/effort` during it, and `model: haiku` in the frontmatter of subagents that do simple work. The subagents in this repo set `model:` and `effort:` per role.
- **Copilot:** the model picker, the reasoning level, or Auto, which now picks at session boundaries for you.

**Do this Monday:** default to Sonnet at medium effort. Go up in effort before you go up in model, and switch model only right after `/clear`.

---

### F. Output discipline

Output tokens cost five times input on every current Claude model, and every output token you produce is re-read as input on every later turn. A reply that opens with "Great question! Let me explain what I'm going to do…" costs you twice.

The good news: agentic tools already edit with diffs, so "return a diff, not the whole file" is mostly solved for code. The waste that's left is prose: narration before tool calls, recaps after them, and explanations you didn't ask for.

Same question, two ways:

> *"Explain `TemplateEngine.java`."* → several paragraphs, plus a method-by-method tour.
> *"In three bullets: what does `TemplateEngine.java` do, and which method should new emails call?"* → three lines.

Then make it the default, so nobody has to remember. This repo's `AGENTS.md` ends with:

```
- Be concise. No preamble. No re-explaining the request back to the user.
- Return diffs, not full files, when editing.
- If you need more context, ask one targeted question instead of guessing.
```

In Claude Code the token count next to the spinner shows the current turn's output growing live, which makes this lever easy to demo.

**Do this Monday:** add those three lines to the instructions file every session loads.

---

### G. Make the repo cheap to read

Copilot retrieves from a semantic index. Claude Code has no index: it searches with grep and glob, then reads files. Either way, whatever is lying around in the repo gets found, and that includes dead code.

That's the trap from lever A. The old JavaScript under `src/email/`, `src/api/` and `dist/` hasn't run in months, but it matches every search for "order confirmation", so the agent reads it, reasons about it and sometimes edits it. Delete it: git history keeps it for anyone who needs it.

What you can't delete, hide:

```json
// .claude/settings.json
{ "permissions": { "deny": ["Read(./target/**)"] } }
```

`.gitignore` matters too, because both Copilot's index and Claude Code's search respect it. If a file is already tracked, adding it to `.gitignore` doesn't untrack it; you also need `git rm --cached`.

The cheapest read is the one the agent doesn't need to make. A three-line summary at the top of a class answers "what does this do?" without reading the other 200 lines:

```java
/**
 * Central renderer. New emails call render(templateId, data).
 * renderLegacy(...) is deprecated; only OrderConfirmationService still uses it.
 */
```

**Do this Monday:** search your repo for a domain term and count how many of the hits are dead. Delete them.

---

### H. Read the meter, set a budget

The first version of this talk said "you can't see Copilot's token counts, so use latency as a proxy". That's no longer true for either tool, and a talk called *Context is a budget* should show the budget.

In Claude Code:

- `/context` shows what's in the window right now: system prompt, tools, memory files, skills, messages.
- `/usage` shows the session's cost by model and the prompt cache line. On subscription plans it also attributes recent usage to skills, subagents, plugins and MCP servers, and recommends changes; press `f` to apply the ones Claude Code can.
- The status line can show context %, cache hit rate and session cost on every turn. This repo ships one (`.claude/statusline.sh`).
- For automation, `claude -p --max-budget-usd 0.50` stops a headless run at a dollar cap.
- Teams get spend limits (Console workspaces, or Team and Enterprise admin settings) and OpenTelemetry export for their own dashboards.

In Copilot, VS Code shows a context-window indicator, Copilot CLI has `/context`, and admins set AI-credit budgets per enterprise, cost center or user.

For a baseline, Anthropic reports that Claude Code averages about $13 per developer per active day across enterprise deployments, $150–250 per developer per month, with 90% of users under $30 a day. If your numbers are far above that, the levers above tell you where to look.

The meter tells you about today. To stop bloat from creeping back in, lint for it in CI the way you lint for JAR size. The repo's `npm run lint:context` checks instruction and prompt sizes and flags globs that match everything. Here is the core of it in plain Java, for a Java shop:

```java
// LintInstructions.java: java LintInstructions.java
import java.nio.file.*;

public class LintInstructions {
    public static void main(String[] args) throws Exception {
        boolean failed = false;
        for (String f : new String[] {"AGENTS.md", "CLAUDE.md", ".github/copilot-instructions.md"}) {
            Path p = Path.of(f);
            if (!Files.exists(p)) continue;
            long lines = Files.lines(p).count();
            System.out.println((lines > 200 ? "❌ " : "✅ ") + f + ": " + lines + " lines");
            failed |= lines > 200;
        }
        if (failed) System.exit(1);
    }
}
```

**Do this Monday:** add a status line that shows context %, cache hit rate and cost, and leave it on for a week.

## Three workflow patterns that compound

The levers shrink the cost of a single turn. The patterns shrink the *number* of expensive turns, and each one fits a different shape of work:

| Pattern | Shape of work |
|---|---|
| Loop with state on disk | Many small, independent tasks |
| Checkpoint & reset | One long task |
| Plan → Build → Review | One feature, several roles |

---

### 1. Loop with state on disk (the Ralph loop)

Geoffrey Huntley named it after Ralph Wiggum: relentless, not clever. Write a `TODO.md` of small checkbox tasks, then have an agent do the first unchecked item, run the tests, tick the box, commit, and repeat.

The whole point is that **every iteration starts with a fresh, small context**. That's also where the first version of this demo went wrong. It ran the loop as one long prompt inside one chat ("repeat until `TODO.md` is done"), so item five carried the full transcript of items one to four. That isn't Ralph: it's a long chat with a to-do list.

Huntley's original is a shell loop, and that's what this repo now ships as `tools/ralph.sh`:

```bash
while grep -q '^- \[ \]' TODO.md; do
  claude -p "$(cat tools/ralph-prompt.md)" \
    --model sonnet --effort medium \
    --max-budget-usd 0.50 \
    --permission-mode acceptEdits \
    --allowedTools "Bash(mvn *) Bash(git add *) Bash(git commit *)"
done
```

Each `claude -p` is a new process with a new context. The only memory is on disk: `TODO.md` and the git log. That gives you:

- **Flat cost per item.** Item ten costs about what item one did.
- **A hard cap.** `--max-budget-usd` stops any single iteration that runs away.
- **Restartability.** Kill it halfway and run it again; it picks up at the first unchecked box.
- **An audit trail.** `git log --oneline` reads like a changelog, one commit per item.

One warning: `/loop` and session-scoped scheduled tasks look similar but are the opposite. They fire inside your current session and send its full context every time.

In Copilot, the cloud agent working one issue at a time gives you the same shape, and the shell loop works with any agent CLI that has a non-interactive mode.

![TODO.md mid-loop on the left, the per-task git log on the right — disk is the memory](../images/07-todo-gitlog.png)

---

### 2. Checkpoint & reset

Both tools now compact automatically when a session approaches the limit, so you don't need to hand-write summaries any more. What's left is deciding *when* to reset, because the options cost very different amounts:

| Action | What it costs | Use it when |
|---|---|---|
| `/clear` | Nothing | You're switching to an unrelated task. Run `/rename` first so you can `/resume` later. |
| `/rewind` | Little: it returns to a prefix that's already cached | The last few turns went down a wrong path |
| `/compact keep the failing test and the fix plan` | A request that reads the whole conversation: cheap while the cache is warm, expensive after a break | You're mid-task and want to keep going with less context |
| Auto-compaction | Same as `/compact`, but at a moment you didn't choose | You forgot the other three |

Two details make this work better in Claude Code:

- **Steer the summary.** Pass a focus to `/compact`, or add a `# Compact instructions` section to `CLAUDE.md` so every compaction keeps what matters to your project.
- **Know what survives.** The project-root `CLAUDE.md` or `AGENTS.md` is re-read from disk after compaction. Instructions you gave only in the chat are not, so anything you'll need again belongs in a file.

For a deliberate hand-off between sessions, ask for a short `NOTES.md` (goal, decisions, files touched, next step), run `/clear`, and continue with *"Read @NOTES.md and do the next step"*.

**Rule of thumb:** one task per session, and compact at a natural break rather than waiting for the automatic one mid-task.

---

### 3. Plan → Build → Review

This is the pattern that changes how a feature gets built. Three roles, three contexts, and one artifact that crosses the boundaries:

![The handover artifact is the only thing that crosses the boundary — never chat history](../images/06-handover-flow.png)

In Claude Code each role is a subagent in `.claude/agents/`, with its own model, effort and tool list:

| Subagent | Model · effort | Tools | Produces |
|---|---|---|---|
| `planner` | Opus · high | Read, Grep, Glob, Write | `plan.md`: goal, acceptance criteria, small tasks. No code. |
| `implementer` | Sonnet · medium | Read, Edit, Write, Bash | One commit per task, tests green after each |
| `reviewer` | Opus · high | Read, Grep, Glob, Bash | PASS/FAIL per criterion, then `VERDICT: APPROVE` or `REQUEST CHANGES` |

Why this saves tokens:

- **Each subagent starts with a fresh context.** It sees the brief and `plan.md`, not your conversation.
- **Only summaries come back.** The implementer's test logs and file reads stay in its own context.
- **Your main session keeps its model and its cache.** A subagent call appends to the parent conversation and leaves the cached prefix intact, so you get Opus planning without switching your session to Opus.

The discipline that makes it work: the artifact (`plan.md`, the diff, the review) is the only thing that crosses a boundary. Never paste chat history into the next role.

Copilot users can get the same shape with prompt files run in three fresh chats; this repo keeps those under `.github/prompts/`.

#### A warning about fan-out

Subagents are not free. Each one loads its own context (your instructions, its tools, the files it reads) and warms its own cache. Anthropic measured **agent teams at about 7× the tokens** of a standard session when teammates run in plan mode. Use several agents when the roles genuinely need different contexts, not because parallel feels faster.

---

### They compose

The planner writes `plan.md`. The implementer runs a Ralph loop over its tasks, one commit each. A long implementer session checkpoints instead of dragging its history along. The reviewer sees only the plan and the diff. Each piece is cheap on its own, and together they make an expensive model's judgement go a long way.

## The Monday checklist

Pin this to your team's wiki. Take what's useful, ignore the rest.

**Repo setup**
- [ ] One always-loaded instructions file (`AGENTS.md`, `CLAUDE.md` or `copilot-instructions.md`) under 200 lines: build, test, conventions, output style.
- [ ] If you have both `AGENTS.md` and `CLAUDE.md`, make `CLAUDE.md` import `@AGENTS.md`.
- [ ] Scoped rules for directory-specific conventions (`.claude/rules/` with `paths:`, or `*.instructions.md` with `applyTo:`), with globs as narrow as the rule.
- [ ] Workflow-specific instructions moved into skills or subagents.
- [ ] A hook that trims test and build output before the agent sees it.
- [ ] Dead code deleted; generated folders in `.gitignore` and in a `Read` deny rule.
- [ ] A CI lint for instruction size and over-broad globs.

**Per-session habits**
- [ ] Name the file and method in the prompt. Use plan mode for anything multi-file.
- [ ] Pick the model at the start of a session. Turn effort up or down mid-task; switch model only after `/clear`.
- [ ] Default to Sonnet at medium effort. Use Haiku for subagents that search and summarise.
- [ ] `/clear` between unrelated tasks. `/compact <focus>` at natural breaks, not mid-task.
- [ ] Ask for short answers. Let the instructions file make it the default.

**Measure**
- [ ] A status line showing context %, cache hit rate and cost.
- [ ] `/usage` once a day for a week. Act on anything with a share above 10%.
- [ ] `--max-budget-usd` on every headless run.

**Workflow patterns to try this week**
- [ ] Run `tools/ralph.sh` (or your own shell loop) over a `TODO.md` of small chores.
- [ ] Build one real feature with planner, implementer and reviewer subagents. Compare the cost with how you'd normally do it.

![Print or screenshot this — a one-page Monday checklist](../images/08-checklist-card.png)

## Closing

The mindset shift is small and the wins are not.

A year ago, managing tokens meant plumbing: ordering prompts for the cache, pruning tool schemas, writing your own summaries. The tools do most of that now. What's left is judgement: what to put in the window, when to clear it, which model and effort a task deserves, and when a second agent is worth its own context.

None of it is novel. None of it is hard. Most teams don't have a token problem; they have a habits problem. The levers are boring. The compounding is real: a team that adopts even half of the above will see sessions get faster and cheaper, and answers get *better*, because the model isn't wading through context it doesn't need.

One line to take with you:

> **The worst tokens are the ones you're paying for and not noticing.**

So turn on the meter. Run `/context`. Read the cache line in `/usage`. Then spend the budget like it's yours, because now it visibly is.
