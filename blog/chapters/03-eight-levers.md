<!-- target: ~2,200 words (~275 per lever × 8) -->

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

The tax moved. Today it's in what tools *return*. One `mvn test` run prints hundreds of lines of plugin banners, download progress and stack frames, and every one of them lands in context and gets re-read, from cache, on every turn after.

Three ways to shrink it:

- **Filter before the model sees it.** This repo ships a Claude Code `PreToolUse` hook (`.claude/hooks/filter-test-output.sh`) that rewrites `mvn test` so the full log goes to a file and Claude sees only the `Tests run:` lines, the failures and `BUILD SUCCESS` or `BUILD FAILURE`. The exit code survives, so Claude still knows when tests fail.
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
