#!/usr/bin/env bash
# PreToolUse hook (Lever C): when Claude runs the Maven test suite, write the
# full log to disk and hand Claude only the summary and the failures.
# Adapted from https://code.claude.com/docs/en/costs (filter-test-output.sh).
input=$(cat)
cmd=$(jq -r '.tool_input.command // ""' <<<"$input")

pattern='^(\./mvnw|mvn)( +-[^ ;&|<>`$]+)* +(test|verify)( +[^;&|<>`$]*)?$'
if [[ "$cmd" =~ $pattern ]]; then
  tmp="${TMPDIR:-/tmp}"; log="${tmp%/}/claude-mvn-test.log"
  keep='<<< (FAILURE|ERROR)!|Tests run:|BUILD (SUCCESS|FAILURE)|ERROR\].*\.java'
  filtered="$cmd > '$log' 2>&1; rc=\$?; grep -E -A3 '$keep' '$log' | head -60; echo \"(full log: $log)\"; exit \$rc"
  jq --arg c "$filtered" \
    '{hookSpecificOutput: {hookEventName: "PreToolUse", updatedInput: (.tool_input + {command: $c})}}' <<<"$input"
else
  echo '{}'
fi
