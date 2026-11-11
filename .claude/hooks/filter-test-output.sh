#!/usr/bin/env bash
# PreToolUse hook (Lever C): when Claude runs the Maven test suite, write the
# full log to disk and hand Claude only the summary and the failures.
# Adapted from https://code.claude.com/docs/en/costs (filter-test-output.sh).
input=$(cat)
cmd=$(jq -r '.tool_input.command // ""' <<<"$input")

# Claude often wraps a test run as `mvn test 2>&1 | tail -40`. Strip exactly that wrapper
# (2>&1 and/or | tail|head -N); the filter below replaces it. Other pipes (| wc -l, | grep) pass through.
wrap='^(.*[^ ]) +2>&1( *\| *(tail|head)( +-n)? +-?[0-9]+)? *$'
pipe='^(.*[^ ]) *\| *(tail|head)( +-n)? +-?[0-9]+ *$'
if [[ "$cmd" =~ $wrap ]]; then cmd="${BASH_REMATCH[1]}"; elif [[ "$cmd" =~ $pipe ]]; then cmd="${BASH_REMATCH[1]}"; fi

pattern='^(\./mvnw|mvn)( +-[^ ;&|<>`$]+)* +(test|verify)( +[^;&|<>`$]*)?$'
if [[ "$cmd" =~ $pattern ]]; then
  tmp="${TMPDIR:-/tmp}"; log="${tmp%/}/claude-mvn-test.log"
  # Keep: Surefire's "Results" list of failing tests (Class.method:line + expected/actual), the
  # test totals (not the per-class lines), the BUILD line, and compile errors (once each).
  # A green run comes back as 2 lines; stack traces stay in the log.
  keep='/^\[ERROR\] (Failures|Errors): *$/{res=1;print;next}
        res&&(/^ *$/||/^\[(INFO|ERROR|WARNING)\] *$/||/Tests run:/){res=0}
        res{print;next}
        /Tests run:/&&!/ in /{print;next}
        /BUILD (SUCCESS|FAILURE)/{print;next}
        /\.java:\[[0-9]+,[0-9]+\]/||/^\[ERROR\] +(symbol|location):/{if(!seen[$0]++)print;next}'
  filtered="$cmd > '$log' 2>&1; rc=\$?; awk '$keep' '$log' | head -60; echo \"(full log: $log)\"; exit \$rc"
  jq --arg c "$filtered" \
    '{hookSpecificOutput: {hookEventName: "PreToolUse", updatedInput: (.tool_input + {command: $c})}}' <<<"$input"
else
  echo '{}'
fi
