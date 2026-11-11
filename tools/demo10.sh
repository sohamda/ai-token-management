#!/usr/bin/env bash
# Demo 10 (Pattern 3: Plan → Build → Review), live.
# Prepares the repo, then opens an interactive Claude Code session on Sonnet with the
# commands the subagents need pre-approved and act 1 (the planner) already submitted.
#
#   tools/demo10.sh           # run it
#   tools/demo10.sh --check   # check only: prerequisites, repo state, the command it would run
#
# Acts 2-4 are typed in the session (also click-to-copy in the deck's presenter view):
#   @agent-implementer execute plan.md
#   @agent-reviewer review the build commits against plan.md
#   /context   then   /usage
set -euo pipefail
cd "$(dirname "$0")/.."

CHECK=0; [ "${1:-}" = "--check" ] && CHECK=1

FEATURE='when the order total exceeds $100, the order-confirmation email includes the line "VIP customer — free shipping on your next order".'
ACT1="@agent-planner Feature: $FEATURE"
ACT2='@agent-implementer execute plan.md'
ACT3='@agent-reviewer review the build commits against plan.md'
# The planner only writes plan.md (acceptEdits covers it). The implementer runs Maven and commits;
# the reviewer reads git history. Everything else still asks.
ALLOWED='Bash(mvn *) Bash(git add *) Bash(git commit *) Bash(git log *) Bash(git diff *) Bash(git show *) Bash(git status*)'

say()  { printf '%s\n' "$*"; }
fail() { printf 'demo10: %s\n' "$*" >&2; exit 1; }

# 1. Prerequisites
for t in claude mvn jq git; do command -v "$t" >/dev/null || fail "$t not found (see demos/00-setup.md)"; done
for a in planner implementer reviewer; do [ -f ".claude/agents/$a.md" ] || fail ".claude/agents/$a.md is missing"; done

# 2. Repo state: clean tree, and plan.md is the checked-in example (or already moved aside)
[ -z "$(git status --porcelain)" ] || fail "working tree not clean. Reset first: git reset --hard origin/main && git clean -fd"
STASH=0
if [ -f plan.md ]; then
  head -1 plan.md | grep -q '^# plan.md (example)' || fail "plan.md is from an earlier run. Reset first: git reset --hard origin/main && git clean -fd"
  STASH=1
fi

if [ "$CHECK" = 1 ]; then
  say "✓ claude, mvn, jq, git found; planner, implementer, reviewer defined; working tree clean"
  [ "$STASH" = 1 ] && say "→ would move the example plan aside: git mv plan.md plan.example.md + commit" \
                   || say "→ example plan already moved aside"
  say "→ would run: claude \"$ACT1\" --model sonnet --effort medium --permission-mode acceptEdits --allowedTools \"$ALLOWED\""
  exit 0
fi

# 3. Move the example plan aside so the planner writes a fresh one
if [ "$STASH" = 1 ]; then
  git mv plan.md plan.example.md
  git commit -qm "demo: stash example plan"
  say "Moved the example plan aside (plan.example.md)."
fi

# 4. Next prompts on screen, then hand over to Claude Code
cat <<EOF

  Demo 10 · Plan → Build → Review       (main session: Sonnet · medium)
  ─────────────────────────────────────────────────────────────────────
  Act 1  planner      submitted for you; then open plan.md in the 2nd terminal
  Act 2  implementer  $ACT2
  Act 3  reviewer     $ACT3
  Act 4  meter        /context, then /usage

EOF
exec claude "$ACT1" --model sonnet --effort medium --permission-mode acceptEdits --allowedTools "$ALLOWED"
