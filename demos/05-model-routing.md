# Demo 05 — Model routing & live calculator

**Slide reference:** Lever E
**Time:** ~4 minutes
**Punchline:** You probably just paid 10× for the same answer.

## Step 1 — same task, three models

Pick a routine task:

> Rename the `parseAddress` method to `parseAddressLine` in `AddressParser.java` and update all usages. Show me the diff.

Run it three times, in three fresh chats, with the model picker set to:

1. **GPT-4.1** (premium-request multiplier 0× on most plans — base model)
2. **GPT-5** (1×)
3. **Claude Opus 4** (10×)

After each run, show the cost difference:

- **Output panel** — compare `ccreq` lines: same `success` result, but note the model name.
- **DevTools Network tab** — compare request/response sizes across the three runs.
- **Org usage dashboard** — `https://github.com/organizations/<YOUR-ORG>/settings/copilot/usage`
  (or `https://github.com/settings/copilot/usage` for individual subscribers).

Compare the diffs side-by-side. They are essentially identical.

> **Punchline:** "Same answer. The Opus version cost 10 premium requests instead of 1."

## Step 2 — open the live calculator

In the Copilot deck (`presentations/token-presentation-copilot.html`), navigate
to **slide 4 — Live calculator**.

Take audience input:
- Their team size
- Their typical chat requests/day
- Their typical agent runs/day
- Switch the model dropdown

Watch the **% of monthly quota** field. Some combinations exceed 100% — that's the moment the room goes quiet.

## Step 3 — the routing rule

Show this slide of recommended defaults:

| Task | Model | Multiplier |
|---|---|---|
| Inline completions, simple chat | GPT-4.1 | 0× |
| Real coding work | GPT-5 / Claude Sonnet | 1× |
| Long-context refactor / agent mode | Claude Sonnet | 1× |
| Genuinely hard reasoning | Claude Opus | **10×** |

Rule: **start cheap, escalate only when stuck.**

## Reset

```powershell
git checkout -- src/
```

## References

- [GitHub — Premium requests and model multipliers](https://docs.github.com/en/copilot/managing-copilot/monitoring-usage-and-entitlements/about-premium-requests) — per-model multiplier table, plan allowances
- [GitHub — Monitoring your Copilot usage](https://docs.github.com/en/copilot/managing-copilot/monitoring-usage-and-entitlements/monitoring-your-copilot-usage-and-entitlements) — how to track premium request consumption
- [GitHub — Plans for GitHub Copilot](https://docs.github.com/en/copilot/about-github-copilot/subscription-plans-for-github-copilot) — monthly quota per plan
- [GitHub — Copilot auto model selection](https://docs.github.com/en/copilot/concepts/auto-model-selection) — 10% multiplier discount when using auto selection
- [OpenAI — Batch API](https://platform.openai.com/docs/guides/batch) — 50% discount for offline workloads (direct API)
