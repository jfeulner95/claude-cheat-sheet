# Design: Schöneres PDF + HTML-Version mit Copy-Buttons auf GitHub Pages

Stand: 2026-11-25 · Branch: `feature/pdf-styling`

## Ziel und Warum

Das Cheatsheet wird am PC neben dem Terminal genutzt, als PDF heruntergeladen und ausgedruckt.
Befehle und Links sollen sich schnell kopieren lassen, und beide Ausgaben sollen optisch hochwertiger wirken.

## Ziele

- **HTML-Version** auf GitHub Pages, gebaut aus derselben `README.md`, mit Copy-Buttons für Codeblöcke, Inline-Code und Links.
- **PDF** optisch aufgewertet, gleichermaßen gut am Bildschirm und auf Papier.
- PDF und HTML teilen sich ein Grund-Stylesheet und sehen gleich aus.
- Pages wird **nur bei einem Tag `v*`** aktualisiert, wie das Release.

## Nicht-Ziele

- Copy-Buttons im PDF. PDF-Viewer führen kein JavaScript aus, deshalb ist das technisch nicht machbar.
- Inhaltliche Änderungen an der `README.md`.
- Suche, Navigation über mehrere Seiten, Static-Site-Generator.

## Anti-Ziele

- Neue Build-Werkzeuge oder Abhängigkeiten außer pandoc und WeasyPrint.
- Das PDF wird am Bildschirm schöner, aber ausgedruckt schlechter, etwa durch dunkle Flächen oder Links, die auf Papier verloren gehen.
- Die Seite lädt externe Skripte oder Fonts, also keine CDNs und kein Tracking.

## Ansätze

1. **pandoc-HTML plus eigenes Copy-Skript.** **Gewählt.** Gleiche Quelle, gleiches Stylesheet, kein neues Tool, Buttons auch an Inline-Code in Tabellen.
2. MkDocs Material: Copy-Buttons sind eingebaut, aber es kommt eine neue Abhängigkeit dazu, die Seite sieht anders aus als das PDF, und Inline-Code in Tabellen bekommt keine Buttons.
3. Jekyll rendert die README direkt: keine Copy-Buttons, verfehlt also das Ziel.

## Entscheidungen des Nutzers

- Weg 1.
- Pages wird nur bei Tags deployt. Das Pages-Setting „Source: GitHub Actions“ ist gesetzt.
- Das PDF bleibt Download, Druckvorlage und Bildschirm-Dokument zugleich.

## Aufbau (Claudes Vorschläge)

**Dateien**

- `.github/pdf/base.css`: gemeinsame Typografie, Farben, Tabellen und Code (aus `style.css` hervorgegangen).
- `.github/pdf/print.css`: nur PDF (`@page`, Seitenzahlen, Umbrüche, Druck-Regeln).
- `.github/pdf/web.css`: nur HTML (Layout, Copy-Buttons, Dark Mode über `prefers-color-scheme`).
- `.github/pdf/copy.js`: Copy-Logik, wird per pandoc eingebettet, damit die Seite eine einzige Datei ist.

**PDF-Optik**

- Saubere Titelzeile: Titel, Datum bzw. Version und ein Hinweis auf die interaktive Version mit der Pages-URL. Der Hinweis wird nur im Build eingefügt, die README bleibt unverändert.
- H2-Abschnitte mit farbigem Akzent, Tabellen mit dezentem Zebra-Muster, Kopfzeile wiederholt sich beim Seitenumbruch, kein Umbruch innerhalb einer Zeile.
- Codeblöcke mit linker Akzentlinie, keine Silbentrennung in Code, damit kopierter Text stimmt.
- Links sind unterstrichen, damit man sie auch in Schwarzweiß erkennt. Im Abschnitt „Quellen und Weiterlesen“ steht im PDF die URL hinter dem Linktext, damit sie auf Papier nutzbar ist.
- Fußzeile mit Seitenzahl und Version.

**HTML-Copy-Verhalten**

- Codeblöcke: sichtbarer „Kopieren“-Button oben rechts.
- Inline-Code: Ein Klick auf den Code kopiert ihn, danach erscheint kurz „Kopiert“. Ein Button pro Inline-Code würde die Tabellen überladen.
- Links: kleines Kopier-Symbol, das beim Hovern erscheint und die URL kopiert. Ein normaler Klick öffnet den Link weiterhin.
- Fallback ohne Clipboard-API: Text wird markiert.

**Workflow**

- Der `build`-Job erzeugt PDF und `index.html`. Beide werden als Artefakte hochgeladen und sind auch bei PRs prüfbar.
- Neuer `pages`-Job, nur bei `refs/tags/v*`: `actions/upload-pages-artifact` und dann `actions/deploy-pages`, mit `pages: write`, `id-token: write` und `environment: github-pages`.
- Der `release`-Job bleibt unverändert.

## Einschränkungen und offene Punkte

- **Environment-Schutz:** Die Umgebung `github-pages` erlaubt standardmäßig nur Deployments vom Default-Branch. Tag-Deployments werden abgelehnt, bis du unter **Settings → Environments → github-pages → Deployment branches and tags** die Regel `v*` für Tags hinzufügst. Das musst du einmalig selbst tun.
- Die Pages-URL wird als `https://jfeulner95.github.io/claude-cheat-sheet/` angenommen.

## Dem Umsetzer überlassen

Genaue Farben und Abstände, Wortlaut der Tooltips und Struktur des Skripts.
