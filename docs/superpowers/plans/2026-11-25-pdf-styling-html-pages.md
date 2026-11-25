# PDF Styling + HTML Version on GitHub Pages Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a nicer print/screen PDF and a standalone HTML page with copy buttons from `README.md`, and deploy the HTML to GitHub Pages on `v*` tags.

**Architecture:** One shell script `scripts/build.sh` renders both outputs with pandoc (PDF through WeasyPrint) from shared CSS plus a print-only or web-only stylesheet. `scripts/check.sh` asserts properties of the built files and acts as the test suite. The workflow calls both scripts. A new `pages` job deploys on tags only.

**Tech Stack:** bash, pandoc (gfm input), WeasyPrint, poppler-utils (`pdftotext`), plain CSS, vanilla JS, GitHub Actions (`actions/upload-pages-artifact@v3`, `actions/deploy-pages@v4`).

**Spec:** `docs/superpowers/specs/2026-11-25-pdf-styling-html-pages-design.md`

## Global Constraints

- No new tools beyond pandoc, WeasyPrint, poppler-utils. No CDNs, no external fonts or scripts in the HTML.
- `README.md` content is not modified.
- Pages URL: `https://jfeulner95.github.io/claude-cheat-sheet/`
- PDF name: `Claude-Code-Cheatsheet_<tag>.pdf` on tags, else `Claude-Code-Cheatsheet.pdf` (unchanged behaviour).
- Pages deploys only when `github.ref` starts with `refs/tags/v`.
- `VERSION` = tag name on tags, else `dev`.
- Commits: English, signed off (`git commit -s`), with the Co-Authored-By trailer.
- Local runs need `brew install pandoc weasyprint poppler`; otherwise verify through the PR CI run.

## Review Focus

1. Long commands in table cells (e.g. `--allowedTools "Bash(git diff *)" "Read"`) must wrap without overflowing the page or the table, in the PDF and on narrow screens. → check.sh asserts no `pdftotext` line is wider than the page (Task 1). For narrow screens, a manual check at 375 px width (Task 2).
2. Copying `cat logs.txt \| claude -p "explain"` (escaped pipe in the table) must yield `cat logs.txt | claude -p "explain"`. → Manual check in Task 2.
3. A page without Clipboard API (http, old browser) must still let the user copy: the text gets selected. → Manual check in Task 2 (call `navigator.clipboard = undefined` in the devtools console).
4. Printing the HTML page from the browser must not print copy buttons. → `@media print` hides `.copy-btn`, checked in Task 2.
5. Dark mode must keep code and links readable. → Manual check in Task 2.

---

### Task 1: Build script, check script, restyled PDF

**Files:**
- Create: `scripts/build.sh`, `scripts/check.sh`, `.github/pdf/base.css`, `.github/pdf/print.css`, `.github/pdf/banner.html`
- Delete: `.github/pdf/style.css` (content moves to base.css and print.css)
- Modify: `.github/workflows/build-pdf.yml` (build job)

**Interfaces:**
- Produces: `scripts/build.sh` reads env `VERSION` (default `dev`) and `OUTPUT` (default `Claude-Code-Cheatsheet.pdf`) and writes `$OUTPUT` and `site/index.html`. In this task it writes only the PDF. Task 2 adds the HTML.
- Produces: `scripts/check.sh` reads the same env, exits non-zero with a message per failed assertion.
- Produces: `banner.html` contains the placeholder `{{VERSION}}`, which build.sh replaces with sed into a temp file.

- [ ] **Step 1: Write `scripts/check.sh` with the PDF assertions**

```bash
pdftotext -layout "$OUTPUT" - > /tmp/pdf.txt
assert_contains /tmp/pdf.txt "https://jfeulner95.github.io/claude-cheat-sheet/"   # banner
assert_contains /tmp/pdf.txt "Version $VERSION"                                    # banner/footer
assert_contains /tmp/pdf.txt "https://code.claude.com/docs/en/quickstart"          # URL printed in Quellen
assert_max_width /tmp/pdf.txt 130   # no line wider than 130 chars = no overflow off the page
```

`assert_contains` and `assert_max_width` are small functions inside the script. `set -euo pipefail`. On failure, print what failed and keep counting, then exit 1 if anything failed.

- [ ] **Step 2: Run it against the current build to see it fail**

Run: `VERSION=dev scripts/build.sh` is not available yet, so build with the old pandoc command from the workflow, then run `VERSION=dev scripts/check.sh`.
Expected: FAIL on the Pages URL, `Version dev` and the Quellen URL.

- [ ] **Step 3: Implement `scripts/build.sh` (PDF part), the CSS split and the banner**

- pandoc flags: `--from gfm --standalone --embed-resources --section-divs --metadata title="Claude Code Cheatsheet" --css .github/pdf/base.css --css .github/pdf/print.css --include-before-body <rendered banner> --pdf-engine=weasyprint`.
- `base.css`: everything shared from the old `style.css`, plus a one-variable colour palette (`--accent: #b4532a`), zebra `tbody tr:nth-child(even)`, `code, pre { hyphens: none; }`, links underlined (`text-decoration: underline; text-decoration-thickness: .5pt`).
- `print.css`: `@page` from the old file, footer `"Claude Code Cheatsheet · Version " string(version) " · " counter(page) " / " counter(pages)` (set via `.banner .version { string-set: version content(); }`), H2 with a left accent bar, `thead { display: table-header-group }`, `tr, pre { break-inside: avoid }`, and `#quellen-und-weiterlesen a::after { content: " – " attr(href); }`.
- `banner.html`: version line plus "Interaktive Version mit Kopier-Buttons: <Pages URL>", as a visible link with the URL as its text.

- [ ] **Step 4: Run build + check**

Run: `VERSION=dev scripts/build.sh && VERSION=dev scripts/check.sh`
Expected: exit 0. Open the PDF and check the banner, the zebra tables, the accent headings, the footer and the URLs under Quellen.

- [ ] **Step 5: Switch the workflow build job to the scripts**

Add `poppler-utils` to the apt install. Replace the pandoc step with `scripts/build.sh` and add a `scripts/check.sh` step, both with `env: VERSION: ${{ startsWith(github.ref, 'refs/tags/v') && github.ref_name || 'dev' }}`. Keep the PDF artifact upload and the release job unchanged.

- [ ] **Step 6: Commit**

```bash
git add scripts .github
git commit -s -m "build: restyle PDF and move build into scripts with output checks"
```

### Task 2: HTML page with copy buttons

**Files:**
- Create: `.github/pdf/web.css`, `.github/pdf/copy.js`
- Modify: `scripts/build.sh`, `scripts/check.sh`, `.github/workflows/build-pdf.yml` (upload site)

**Interfaces:**
- Consumes: `build.sh`/`check.sh` env from Task 1, `base.css`, `banner.html`.
- Produces: `site/index.html` (a single self-contained file) and the Pages artifact `github-pages` (via `actions/upload-pages-artifact@v3`, `path: site`), which Task 3 deploys.

- [ ] **Step 1: Add the HTML assertions to `check.sh`**

```bash
assert_file site/index.html
assert_contains site/index.html "navigator.clipboard"                # copy.js is embedded
assert_contains site/index.html "Version $VERSION"                          # banner present
assert_not_matches site/index.html '<(script|link)[^>]+(src|href)="https?://'  # no external resources
assert_contains site/index.html "prefers-color-scheme: dark"
```

- [ ] **Step 2: Run check to see it fail**

Run: `VERSION=dev scripts/build.sh && VERSION=dev scripts/check.sh`
Expected: FAIL on `site/index.html` missing.

- [ ] **Step 3: Implement the HTML build, `web.css` and `copy.js`**

- `build.sh`: a second pandoc call with the same input and flags, but `--css base.css --css web.css` instead of print.css, `--include-after-body` with a temp file `<script>` + `copy.js` + `</script>`, and output `site/index.html`.
- `copy.js` (runs on `DOMContentLoaded`):
  - every `pre` gets a `<button class="copy-btn">Kopieren</button>` that copies `pre.innerText`
  - every `code` not inside `pre` gets `role="button"`, `tabindex="0"`, `title="Klicken zum Kopieren"`, and click/Enter copies `code.textContent`
  - every `a[href^="http"]` gets a sibling `button.copy-link` (icon "⧉", `aria-label="Link kopieren"`) that copies `a.href`
  - `copy(text, el)`: `navigator.clipboard.writeText`. If the API is missing or rejects, select the element's text with a Range. Then show "Kopiert" for 1.2 s through a `data-copied` attribute.
- `web.css`: max-width ~ 980 px centred, tables scroll horizontally inside a wrapper below 700 px (`overflow-x: auto` on `table` with `display: block`), `.copy-btn` top right inside `pre { position: relative }`, `.copy-link` hidden until `a:hover + .copy-link, .copy-link:hover, :focus-visible`, `code[role=button] { cursor: copy }`, `[data-copied]::after` tooltip, a dark palette under `@media (prefers-color-scheme: dark)`, and `@media print { .copy-btn, .copy-link { display: none } }`.

- [ ] **Step 4: Run build + check, then check by hand in the browser**

Run: `VERSION=dev scripts/build.sh && VERSION=dev scripts/check.sh` → exit 0.
Open `site/index.html` and confirm Review Focus items 1–5: narrow window at 375 px, copy of the `cat logs.txt | claude` cell, fallback with `navigator.clipboard = undefined`, print preview without buttons, dark mode.

- [ ] **Step 5: Upload the site in the build job**

After the check step: `actions/upload-pages-artifact@v3` with `path: site`. It runs on every build, so PRs can download and inspect the page.

- [ ] **Step 6: Commit**

```bash
git add scripts .github
git commit -s -m "feat: add HTML version with copy buttons for code and links"
```

### Task 3: Deploy to GitHub Pages on tags

**Files:**
- Modify: `.github/workflows/build-pdf.yml` (new `pages` job)

**Interfaces:**
- Consumes: the Pages artifact `github-pages` from Task 2.

- [ ] **Step 1: Add the job**

```yaml
pages:
  if: startsWith(github.ref, 'refs/tags/v')
  needs: build
  runs-on: ubuntu-24.04
  permissions: { pages: write, id-token: write }
  environment: { name: github-pages, url: "${{ steps.deploy.outputs.page_url }}" }
  steps:
    - id: deploy
      uses: actions/deploy-pages@v4
```

- [ ] **Step 2: Verify the workflow YAML**

Run: `python3 -c "import yaml,sys; yaml.safe_load(open('.github/workflows/build-pdf.yml'))"` (or `actionlint` if available)
Expected: no error. On the PR: the `build` job is green, the `pages` and `release` jobs are skipped.

- [ ] **Step 3: Commit**

```bash
git add .github/workflows/build-pdf.yml
git commit -s -m "ci: deploy HTML version to GitHub Pages on version tags"
```

- [ ] **Step 4: Note for the user (not a code step)**

The real deploy is only verified on the next tag. Prerequisite: tag rule `v*` under Settings → Environments → github-pages.
