#!/usr/bin/env bash
# Render the J-Fall deck to a PDF, one 16:9 page per slide, with headless Chrome, Chromium or Edge.
# The deck switches to its print layout on ?print=1: no demo cues, notes or navigation.
# Re-run after editing the deck (for example after filling in the dry-run numbers).
#
#   tools/scripts/export-pdf.sh                          # → presentations/context-is-budget-jfall.pdf
#   tools/scripts/export-pdf.sh path/to/deck.html out.pdf
#   CHROME=/path/to/browser tools/scripts/export-pdf.sh  # if the browser isn't found
#
# Windows: tools/scripts/export-pdf.ps1 does the same with Edge.
set -euo pipefail
cd "$(dirname "$0")/../.."

HTML="${1:-presentations/context-is-budget-jfall.html}"
OUT="${2:-${HTML%.html}.pdf}"
[ -f "$HTML" ] || { echo "HTML not found: $HTML" >&2; exit 1; }

if [ -z "${CHROME:-}" ]; then
  for b in "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
           "/Applications/Chromium.app/Contents/MacOS/Chromium" \
           "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge" \
           "$(command -v google-chrome || true)" "$(command -v chromium || true)" \
           "$(command -v chromium-browser || true)" "$(command -v microsoft-edge || true)"; do
    if [ -n "$b" ] && [ -x "$b" ]; then CHROME="$b"; break; fi
  done
fi
[ -n "${CHROME:-}" ] || { echo "No Chrome, Chromium or Edge found. Set CHROME=/path/to/browser." >&2; exit 1; }

mkdir -p "$(dirname "$OUT")"
PROFILE="$(mktemp -d)"            # throw-away profile, so your own browser state is untouched
trap 'rm -rf "$PROFILE"' EXIT
URL="file://$(cd "$(dirname "$HTML")" && pwd)/$(basename "$HTML")?print=1"
OUT_ABS="$(cd "$(dirname "$OUT")" && pwd)/$(basename "$OUT")"

# virtual-time-budget gives the web fonts time to load and the slides time to re-fit
"$CHROME" --headless=new --disable-gpu --no-pdf-header-footer --hide-scrollbars \
  --no-first-run --no-default-browser-check --user-data-dir="$PROFILE" \
  --run-all-compositor-stages-before-draw --virtual-time-budget=15000 \
  --print-to-pdf="$OUT_ABS" "$URL" 2>/dev/null

[ -s "$OUT_ABS" ] || { echo "The browser ran but produced no PDF." >&2; exit 1; }
echo "Wrote $OUT ($(du -k "$OUT_ABS" | cut -f1) KB)"
