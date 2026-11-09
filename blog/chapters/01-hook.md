<!-- target: ~250 words -->

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
