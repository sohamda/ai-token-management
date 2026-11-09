#!/usr/bin/env bash
# Ralph loop (Pattern 1): one fresh, headless Claude Code run per TODO.md item.
# Context never grows across items: state lives in TODO.md and git, not in a chat.
#
#   tools/ralph.sh                      # defaults below
#   MODEL=haiku BUDGET=0.25 tools/ralph.sh
set -euo pipefail
cd "$(dirname "$0")/.."

MODEL="${MODEL:-sonnet}"   # small, well-specified tasks don't need Opus
EFFORT="${EFFORT:-medium}"
BUDGET="${BUDGET:-0.50}"   # USD cap per iteration (--max-budget-usd)
MAX="${MAX:-10}"           # hard stop on iterations
PROMPT="$(cat tools/ralph-prompt.md)"

for i in $(seq 1 "$MAX"); do
  if ! grep -q '^- \[ \]' TODO.md; then
    echo "TODO.md has no unchecked items. Done after $((i - 1)) iteration(s)."
    exit 0
  fi
  echo "── iteration $i: $(grep -m1 '^- \[ \]' TODO.md | cut -c7-80)…"
  claude -p "$PROMPT" \
    --model "$MODEL" --effort "$EFFORT" \
    --max-budget-usd "$BUDGET" \
    --permission-mode acceptEdits \
    --allowedTools "Bash(mvn *) Bash(git add *) Bash(git commit *) Bash(git checkout -- src/)" \
    --output-format json \
    | jq -r '"   \(.result)\n   $\(.total_cost_usd * 100 | round / 100) · \(.num_turns) turns"'
done
echo "Stopped after MAX=$MAX iterations."
