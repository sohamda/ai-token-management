#!/usr/bin/env bash
# Status line (Lever H): model, effort, context used, cache hit rate, session cost.
# Field names: https://code.claude.com/docs/en/statusline
jq -r '
  [ "\(.model.display_name) · \(.effort.level // "-")",
    "ctx \(.context_window.used_percentage // 0 | floor)%",
    (if .prompt_cache then "cache \(.prompt_cache.hit_ratio * 100 | floor)%" else empty end),
    "$\(.cost.total_cost_usd // 0 | . * 100 | round / 100)",
    (if .rate_limits.five_hour then "5h \(.rate_limits.five_hour.used_percentage | floor)%" else empty end)
  ] | join("  │  ")'
