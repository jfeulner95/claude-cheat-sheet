#!/usr/bin/env bash
# Checks the outputs of scripts/build.sh. Exits non-zero if any check fails.
set -euo pipefail

VERSION="${VERSION:-dev}"
OUTPUT="${OUTPUT:-Claude-Code-Cheatsheet.pdf}"
PAGES_URL="https://jfeulner95.github.io/claude-cheat-sheet/"

failures=0
fail() { echo "FAIL: $*"; failures=$((failures + 1)); }
pass() { echo "ok:   $*"; }

assert_file() {
  if [[ -s "$1" ]]; then pass "$1 exists"; else fail "$1 missing or empty"; fi
}
assert_contains() { # file, fixed string
  if grep -qF -- "$2" "$1"; then pass "$1 contains '$2'"; else fail "$1 does not contain '$2'"; fi
}
assert_not_matches() { # file, extended regex
  local hit
  if hit=$(grep -oE -- "$2" "$1" | head -1) && [[ -n "$hit" ]]; then
    fail "$1 matches '$2': $hit"
  else
    pass "$1 does not match '$2'"
  fi
}
assert_max_width() { # file, max characters per line
  local widest
  widest=$(awk '{ if (length($0) > m) { m = length($0); l = $0 } } END { print m }' "$1")
  if (( widest <= $2 )); then pass "$1 widest line $widest <= $2"; else fail "$1 widest line $widest > $2"; fi
}

# --- PDF ---
assert_file "$OUTPUT"
pdf_txt="$(mktemp)"
pdftotext "$OUTPUT" "$pdf_txt"
assert_contains "$pdf_txt" "$PAGES_URL"
assert_contains "$pdf_txt" "Version $VERSION"
assert_contains "$pdf_txt" "https://code.claude.com/docs/en/quickstart"
assert_max_width "$pdf_txt" 150

# --- HTML ---
html="site/index.html"
assert_file "$html"
assert_contains "$html" "navigator.clipboard"
assert_contains "$html" "Version $VERSION"
assert_contains "$html" "$PAGES_URL"
assert_contains "$html" "prefers-color-scheme: dark"
assert_not_matches "$html" '<(script|link)[^>]+(src|href)="https?://'

echo
if (( failures > 0 )); then
  echo "$failures check(s) failed"
  exit 1
fi
echo "all checks passed"
