# Claude Code Cheatsheet

Nov 24, 2026 · @Johannes Feulner

## Getting Started

In fünf Minuten startklar: installieren, im Projektordner `claude` starten, einloggen, loslegen. Voraussetzung ist ein Claude-Abo (Pro, Max, Team, Enterprise), ein Claude-Console-Konto oder Zugang über Bedrock, Google Cloud oder Microsoft Foundry.

1. **Installieren** (nativer Installer, empfohlen – aktualisiert sich selbst):
   - macOS / Linux / WSL: `curl -fsSL https://claude.ai/install.sh | bash`
   - Windows PowerShell: `irm https://claude.ai/install.ps1 | iex`
   - Alternativ: `brew install --cask claude-code` oder `winget install Anthropic.ClaudeCode` (beide ohne Auto-Update)
2. **Prüfen:** neues Terminal öffnen, `claude --version` – gibt die Version aus. „command not found“ → Install-Ordner fehlt im PATH.
3. **Starten:** `cd /pfad/zum/projekt` und dann `claude`.
4. **Einloggen:** Beim ersten Start öffnet sich der Browser-Login. Später wechseln mit `/login`.
5. **Projekt einrichten:** `/init` erzeugt eine `CLAUDE.md` mit Projektwissen (Build-Befehle, Konventionen).
6. **Erste Prompts ausprobieren:**
   - `what does this project do?`
   - `where is the main entry point?`
   - `add input validation to the registration form`
   - `write unit tests for the calculator functions`
   - `commit my changes with a descriptive message`

Tipp: Auf nativem Windows Git for Windows installieren, damit Claude Code die Bash nutzen kann. Mit `Shift+Tab` wechselst du jederzeit, ob Claude vor Änderungen fragt.

## CLI-Befehle und Flags

Diese Befehle tippst du in der Shell, nicht in der Claude-Session. Vollständige Liste: [CLI reference](https://code.claude.com/docs/en/cli-reference).

| Befehl | Was er tut |
| --- | --- |
| `claude` | Interaktive Session starten |
| `claude "fix the build error"` | Session mit erstem Prompt starten |
| `claude -p "explain this function"` | Einmalige Abfrage, dann beenden (Skripte, CI) |
| `cat logs.txt \| claude -p "explain"` | Gepipten Inhalt verarbeiten |
| `claude -c` | Letzte Session im aktuellen Ordner fortsetzen |
| `claude -r` / `claude -r "name"` | Session per Auswahl oder Name/ID fortsetzen |
| `claude -n "feature-x"` | Session benennen (später per `-r` auffindbar) |
| `claude -w feature-auth` | In isoliertem Git-Worktree starten |
| `claude --bg "investigate the flaky test"` | Als Hintergrund-Agent starten; Überblick mit `claude agents` |
| `claude update` | Auf neueste Version aktualisieren |
| `claude doctor` | Installation und Settings prüfen |
| `claude mcp` | MCP-Server verwalten |
| `claude plugin install <name>@<marketplace>` | Plugin installieren |
| `claude auth login` / `status` / `logout` | Anmeldung verwalten |

**Nützliche Flags**

| Flag | Wirkung |
| --- | --- |
| `--model sonnet` / `opus` / `haiku` | Modell für die Session wählen |
| `--effort high` | Denkaufwand: `low` bis `max` |
| `--permission-mode plan` | Im gewählten Permission Mode starten |
| `--allowedTools "Bash(git diff *)" "Read"` | Diese Tools ohne Nachfrage erlauben |
| `--disallowedTools "Bash(rm *)"` | Bestimmte Aufrufe verbieten |
| `--add-dir ../lib` | Weitere Ordner freigeben |
| `--append-system-prompt "Always use TypeScript"` | Eigene Regeln an den System-Prompt hängen |
| `--output-format json` | Ausgabe als JSON (mit `-p`) |
| `--max-turns 3` | Agenten-Schritte begrenzen (mit `-p`) |
| `--safe-mode` | Ohne CLAUDE.md, Plugins, Hooks, MCP starten (Fehlersuche) |
| `--dangerously-skip-permissions` | Alle Nachfragen überspringen – nur in Sandbox/Container |

## Slash-Commands in der Session

Tippe `/` für das Menü aller Befehle und Skills; Buchstaben danach filtern. Vollständige Liste: [Commands](https://code.claude.com/docs/en/commands).

| Befehl | Wofür |
| --- | --- |
| **Projekt & Kontext** |  |
| `/init` | `CLAUDE.md` für das Projekt anlegen |
| `/memory` | `CLAUDE.md` bearbeiten, Auto-Memory an/aus |
| `/context` | Kontextverbrauch als Raster anzeigen |
| `/compact [Fokus]` | Gespräch zusammenfassen, Kontext freimachen |
| `/clear` | Neues Gespräch mit leerem Kontext |
| `/add-dir <pfad>` | Weiteren Ordner freigeben |
| **Session** |  |
| `/resume` | Frühere Session fortsetzen |
| `/rename [name]` | Session benennen |
| `/rewind` | Gespräch und/oder Code auf früheren Stand zurücksetzen (auch `Esc Esc`) |
| `/branch` | Gespräch abzweigen, um eine Alternative zu testen |
| `/btw <frage>` | Nebenfrage stellen, ohne den Verlauf zu füllen |
| `/export` / `/copy` | Gespräch exportieren / letzte Antwort kopieren |
| `/exit` | Beenden |
| **Modell & Einstellungen** |  |
| `/model` | Modell und Effort wählen |
| `/config` | Einstellungen (Theme, Editor-Modus inkl. Vim, Output Style) |
| `/permissions` | Allow/Ask/Deny-Regeln verwalten |
| `/status` | Version, Modell, Account |
| `/usage` (= `/cost`) | Kosten und Plan-Limits |
| `/login` | Account wechseln |
| **Code & Review** |  |
| `/diff` | Änderungen im Working Tree ansehen |
| `/security-review` | Branch-Diff auf Sicherheitslücken prüfen |
| `/simplify` | Geänderten Code aufräumen lassen |
| `/batch <anweisung>` | Große Änderungen parallel über die Codebasis |
| **Erweiterungen** |  |
| `/mcp` | MCP-Server verwalten und authentifizieren |
| `/skills` | Verfügbare Skills anzeigen |
| `/agents` | Subagents anlegen/verwalten (über Claude oder `.claude/agents/`) |
| `/hooks` | Hook-Konfiguration ansehen |
| `/plugin` | Plugins installieren, aktivieren, deaktivieren |
| `/tasks` | Hintergrund-Shells und Subagents verwalten |
| **Hilfe & Setup** |  |
| `/help` | Hilfe und Befehlsübersicht |
| `/doctor` | Setup-Check mit Reparaturvorschlägen |
| `/terminal-setup` | Shift+Enter für Zeilenumbrüche einrichten |
| `/statusline` | Statuszeile konfigurieren |

## Tastenkürzel und Eingabe-Präfixe

`?` bei leerer Eingabe zeigt alle Kürzel. Auf macOS brauchen Option-Kürzel „Option as Meta“ im Terminal. Details: [Interactive mode](https://code.claude.com/docs/en/interactive-mode).

| Eingabe | Wirkung |
| --- | --- |
| `/` am Anfang | Befehl oder Skill |
| `!` am Anfang | Shell-Befehl direkt ausführen, Ausgabe landet im Kontext |
| `@datei` | Datei/Ordner referenzieren (mit Autovervollständigung) |
| `Esc` | Claude unterbrechen und umlenken (Arbeit bleibt erhalten) |
| `Esc` `Esc` | Eingabe leeren – bei leerer Eingabe: Rewind-Menü |
| `Shift+Tab` | Permission Mode wechseln (Manual → Accept Edits → Plan …) |
| `Ctrl+C` | Abbrechen bzw. Eingabe leeren; 2× beendet |
| `Ctrl+D` 2× | Session beenden |
| `Ctrl+R` | Verlauf rückwärts durchsuchen |
| `↑` | Vorherige Eingabe |
| `Ctrl+O` | Transcript mit Tool-Details anzeigen |
| `Ctrl+B` | Laufenden Bash-Befehl/Agent in den Hintergrund |
| `Ctrl+T` | Claudes To-do-Liste ein/aus |
| `Ctrl+G` | Prompt im externen Editor schreiben |
| `Ctrl+V` (Windows/WSL: `Alt+V`) | Bild aus Zwischenablage einfügen |
| `Ctrl+S` | Prompt zwischenparken / wiederherstellen |
| `Ctrl+L` | Bildschirm neu zeichnen |
| `Option+P` / `Alt+P` | Modell wechseln |
| `Option+T` / `Alt+T` | Extended Thinking umschalten (ältere Modelle) |

**Mehrzeilige Eingabe:** `\` + `Enter` (überall), `Ctrl+J` (überall), `Shift+Enter` (iTerm2, Ghostty, Kitty, WezTerm, Windows Terminal u. a. – sonst `/terminal-setup`).

**Nachrichten einreihen:** Während Claude arbeitet, kannst du weitertippen – die Nachricht wird nach dem aktuellen Schritt gesendet.

## CLAUDE.md und Memory

`CLAUDE.md` ist das dauerhafte Gedächtnis: Claude liest es zu Beginn jeder Session. Zusätzlich schreibt Claude per Auto-Memory eigene Notizen. Details: [Memory](https://code.claude.com/docs/en/memory).

| Datei | Gilt für | Typischer Inhalt |
| --- | --- | --- |
| `~/.claude/CLAUDE.md` | Dich, alle Projekte | Persönlicher Stil, eigene Tools |
| `./CLAUDE.md` oder `./.claude/CLAUDE.md` | Team, dieses Projekt (committen) | Build-/Test-Befehle, Architektur, Konventionen |
| `./CLAUDE.local.md` | Dich, dieses Projekt (in `.gitignore`) | Sandbox-URLs, Testdaten |
| `.claude/rules/*.md` | Projekt, optional auf Pfade begrenzt | Regeln nur für bestimmte Dateitypen |

- **Importe:** `@README` oder `@docs/api.md` im CLAUDE.md bindet weitere Dateien ein (max. 4 Ebenen tief).
- **Hierarchie:** CLAUDE.md-Dateien im Arbeitsordner und allen Ordnern darüber laden beim Start; in Unterordnern bei Bedarf.
- **AGENTS.md:** wird gelesen, wenn kein CLAUDE.md existiert.
- **Bearbeiten:** `/memory` öffnet die Dateien und schaltet Auto-Memory an/aus; `/init` erzeugt einen Startentwurf.
- **Faustregel:** unter 200 Zeilen pro Datei, konkret und knapp. CLAUDE.md ist Kontext, keine harte Regel – Verbote setzt du per Hook oder Deny-Regel durch.

**Minimal-Beispiel**

```markdown
# Projekt: sensor-fw
- Build: `cmake --build build`
- Tests: `ctest --test-dir build`
- C11, keine dynamische Speicherallokation
- Vor jedem Commit: `clang-format -i` auf geänderte Dateien
```

## Permission Modes und Settings

Der Permission Mode legt fest, was Claude ohne Nachfrage darf. `Shift+Tab` wechselt zwischen Manual → Accept Edits → Plan (und Auto, falls verfügbar). Ab v2.1.283 starten interaktive Sessions standardmäßig im Auto-Modus. Details: [Permission modes](https://code.claude.com/docs/en/permission-modes).

| Mode | Was ohne Nachfrage läuft |
| --- | --- |
| `default` (Manual) | Nur Lesen; fragt vor Edits, Shell-Befehlen, Netzwerk |
| `acceptEdits` | Lesen, Datei-Edits, einfache Dateisystem-Befehle im Projektordner |
| `plan` | Recherchiert und schlägt vor, ändert erst nach deiner Freigabe |
| `auto` | Alles, ein Klassifikator-Modell prüft jede Aktion vorab |
| `dontAsk` | Nur Lesen und vorab erlaubte Tools, alles andere wird abgelehnt |
| `bypassPermissions` | Alles ohne Nachfrage – nur in isolierten Containern/VMs |

**Settings-Dateien** (höhere Ebene gewinnt; Listen wie `allow` werden zusammengeführt):

1. Managed Settings der Organisation
2. `--settings` auf der Kommandozeile
3. `.claude/settings.local.json` – persönlich, dieses Projekt, nicht committen
4. `.claude/settings.json` – Team, committen
5. `~/.claude/settings.json` – persönlich, alle Projekte

**Beispiel** `~/.claude/settings.json`:

```json
{
  "$schema": "https://json.schemastore.org/claude-code-settings.json",
  "permissions": {
    "defaultMode": "acceptEdits",
    "allow": ["Bash(npm run lint)", "Bash(npm run test *)"],
    "deny": ["Read(./.env)", "Read(./.env.*)"]
  }
}
```

`/permissions` verwaltet die Regeln interaktiv, `/status` zeigt, welche Dateien geladen sind. „Yes, and don't ask again“ speichert automatisch eine Allow-Regel in `settings.local.json`.

## Erweitern: Skills, MCP, Subagents, Hooks, Plugins

Starte mit CLAUDE.md und ergänze den Rest erst, wenn der Anlass auftaucht. Überblick: [Extend Claude Code](https://code.claude.com/docs/en/features-overview).

| Feature | Wann einsetzen | Wo / wie |
| --- | --- | --- |
| **Skill** | Du tippst denselben Prompt oder Ablauf immer wieder | `~/.claude/skills/<name>/SKILL.md` oder `.claude/skills/<name>/SKILL.md`; Aufruf mit `/<name>` oder automatisch |
| **MCP-Server** | Claude braucht Daten/Aktionen eines externen Systems | `claude mcp add …`; Status mit `/mcp` |
| **Subagent** | Nebenaufgabe würde den Kontext fluten (viel lesen, wenig zurück) | `.claude/agents/<name>.md` oder `~/.claude/agents/`; Claude bitten, einen anzulegen |
| **Hook** | Etwas soll *immer* passieren oder blockiert werden | `hooks`-Block in einer `settings.json`; ansehen mit `/hooks` |
| **Plugin** | Setup in mehreren Repos nutzen oder teilen | `/plugin` bzw. `claude plugin install <name>@<marketplace>` |
| **Output Style** | Antworten sollen dauerhaft anders klingen (kürzer, erklärender) | `/output-style` |

**Skill – Minimalbeispiel** (`~/.claude/skills/summarize-changes/SKILL.md`):

```markdown
---
description: Summarizes uncommitted changes and flags anything risky. Use when the user asks what changed or wants a commit message.
---

Summarize the changes in two or three bullet points, then list any risks.
```

**MCP-Server hinzufügen**

```bash
# Remote (HTTP, empfohlen)
claude mcp add --transport http notion https://mcp.notion.com/mcp

# Lokal (stdio) – alles nach -- ist der Startbefehl
claude mcp add --env API_KEY=xyz --transport stdio myserver -- npx -y my-mcp-server

# Scope: local (Standard) | project (.mcp.json, committen) | user (alle Projekte)
claude mcp add --scope user --transport http hubspot https://mcp.hubspot.com/anthropic

claude mcp list | get <name> | remove <name>
```

**Hook – Auto-Format nach jeder Dateiänderung** (`.claude/settings.json`):

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          { "type": "command", "command": "jq -r '.tool_input.file_path' | xargs npx prettier --write" }
        ]
      }
    ]
  }
}
```

Wichtige Events: `SessionStart`, `UserPromptSubmit`, `PreToolUse` (kann blockieren), `PostToolUse`, `Notification`, `Stop`, `PreCompact`. Ein Hook-Skript mit **Exit-Code 2** blockiert die Aktion; die Begründung geht über stderr. Faustregel: Was garantiert passieren muss, gehört in einen Hook, nicht in CLAUDE.md.

## Best Practices und Workflows

Der Kontext ist die knappste Ressource: Je voller er ist, desto schlechter arbeitet Claude. Fast alle Tipps zielen darauf. Quelle: [Best practices](https://code.claude.com/docs/en/best-practices).

**Standard-Workflow für größere Aufgaben**

1. **Erkunden** im Plan Mode (`Shift+Tab` bis „plan mode on“): `read src/auth and understand how sessions work`
2. **Planen:** `What files need to change? Create a plan.` – Plan mit `Ctrl+G` im Editor nachschärfen.
3. **Umsetzen:** Plan freigeben, `implement the plan, write tests, run them and fix failures`
4. **Committen:** `commit with a descriptive message and open a PR`

Kleine, klare Änderungen (Tippfehler, Umbenennung) direkt anfordern – ohne Plan.

**Regeln, die am meisten bringen**

- **Prüfbar machen:** Gib Claude Tests, Build oder Linter, die es selbst ausführen kann („run the tests after implementing“).
- **Konkret sein:** Datei, Szenario, Erwartung nennen. Statt „fix the login bug“: Symptom, vermuteter Ort, Definition von „gefixt“.
- **Mit `@` referenzieren**, Screenshots einfügen, Logs pipen: `cat error.log | claude -p "explain"`.
- **Früh korrigieren:** `Esc` stoppt, `Esc Esc` / `/rewind` springt zurück.
- **`/clear` zwischen unabhängigen Aufgaben.** Nach zwei erfolglosen Korrekturen: `/clear` und mit besserem Prompt neu starten.
- **Subagents für Recherche:** „use subagents to investigate X“ hält den Hauptkontext sauber.
- **CLAUDE.md schlank halten:** Bei jeder Zeile fragen, ob ohne sie Fehler passieren würden.
- **CLI-Tools nutzen:** `gh`, `aws`, `gcloud` sind kontexteffizienter als Web-APIs.
- **Unabhängig reviewen:** `/code-review` oder ein Subagent prüft den Diff mit frischem Kontext.
- **Sessions benennen** mit `/rename`, später mit `claude -r <name>` fortsetzen.

**Automatisieren**

```bash
# Skript/CI: einmalig, mit JSON-Ausgabe
claude -p "List all API endpoints" --output-format json

# Batch über viele Dateien, nur vorab erlaubte Tools
for file in $(cat files.txt); do
  claude -p "Migrate $file to the new API. Return OK or FAIL." \
    --allowedTools "Edit,Bash(git commit *)" --permission-mode dontAsk
done
```

Parallel arbeiten: `claude -w <name>` (eigener Worktree pro Session), `claude --bg` plus `claude agents` für Hintergrund-Sessions.

## Quellen und Weiterlesen

Alle Angaben geprüft gegen die offizielle Doku (Stand siehe Datum oben). Befehle und Flags ändern sich schnell – im Zweifel `claude --help`, `/help` oder Claude direkt fragen („how do I … in Claude Code?“).

- [Quickstart](https://code.claude.com/docs/en/quickstart)
- [CLI reference](https://code.claude.com/docs/en/cli-reference)
- [Commands](https://code.claude.com/docs/en/commands)
- [Interactive mode & Shortcuts](https://code.claude.com/docs/en/interactive-mode)
- [Memory / CLAUDE.md](https://code.claude.com/docs/en/memory)
- [Settings](https://code.claude.com/docs/en/settings) · [Permission modes](https://code.claude.com/docs/en/permission-modes)
- [Extend Claude Code](https://code.claude.com/docs/en/features-overview) · [Skills](https://code.claude.com/docs/en/skills) · [MCP](https://code.claude.com/docs/en/mcp) · [Hooks](https://code.claude.com/docs/en/hooks-guide)
- [Best practices](https://code.claude.com/docs/en/best-practices)
- Kurs: [Claude Code 101](https://academy.claude.com/courses/claude-code-101) (Claude Academy, kostenlos)
