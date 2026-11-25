#!/usr/bin/env bash
# Builds the cheatsheet PDF and the standalone HTML page from README.md.
#   VERSION  version shown in banner and footer (default: dev)
#   OUTPUT   PDF file name (default: Claude-Code-Cheatsheet.pdf)
set -euo pipefail

VERSION="${VERSION:-dev}"
OUTPUT="${OUTPUT:-Claude-Code-Cheatsheet.pdf}"
SOURCE="README.md"
ASSETS=".github/pdf"

tmp="$(mktemp -d)"
trap 'rm -rf "$tmp"' EXIT

sed "s/{{VERSION}}/${VERSION}/g" "$ASSETS/banner.html" > "$tmp/banner.html"

common=(
  "$SOURCE"
  --from gfm
  --standalone
  --embed-resources
  --section-divs
  --metadata title="Claude Code Cheatsheet"
  --metadata lang=de
  --include-before-body "$tmp/banner.html"
  --css "$ASSETS/base.css"
)

# PDF
pandoc "${common[@]}" \
  --css "$ASSETS/print.css" \
  --pdf-engine=weasyprint \
  --output "$OUTPUT"
echo "built $OUTPUT"

# HTML (single self-contained file for GitHub Pages)
{ echo "<script>"; cat "$ASSETS/copy.js"; echo "</script>"; } > "$tmp/copy.html"
mkdir -p site
pandoc "${common[@]}" \
  --css "$ASSETS/web.css" \
  --include-after-body "$tmp/copy.html" \
  --output site/index.html
echo "built site/index.html"
