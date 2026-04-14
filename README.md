# SBS KI Rechner

Berechnung der Zeit- und Kostenersparnis durch KI-Einsatz im Unternehmen.

Ein lokaler Rechner der Südtirol Business School (SBS).

---

## Schnellstart (3 Schritte)

### 1. Repository herunterladen

Auf der GitHub-Seite den grünen Button **"Code"** klicken → **"Download ZIP"** → ZIP-Datei entpacken.

### 2. Rechner starten

| Betriebssystem | Datei | Aktion |
|---|---|---|
| **macOS** | `start.command` | Doppelklick |
| **Windows** | `start.bat` | Doppelklick |

**Das war's!** Der Browser öffnet sich automatisch mit dem Rechner.

> Es wird **keine** Software-Installation benötigt — der Rechner nutzt nur Programme, die bereits auf jedem Computer vorinstalliert sind (Python 3 auf macOS, PowerShell auf Windows).

### 3. Beenden

Das Terminal-/Kommandozeilen-Fenster schließen oder `Ctrl+C` drücken.

---

## macOS: Beim allerersten Öffnen

macOS blockiert möglicherweise das Script beim allerersten Mal. So gehst du vor:

1. **Rechtsklick** auf `start.command`
2. **"Öffnen"** wählen
3. Im Dialog **"Öffnen"** bestätigen

Ab dem zweiten Mal funktioniert ein normaler Doppelklick.

> Falls "Rechtsklick → Öffnen" nicht funktioniert: **Systemeinstellungen** → **Datenschutz & Sicherheit** → unten bei "start.command wurde blockiert" auf **"Trotzdem öffnen"** klicken.

---

## Troubleshooting

| Problem | Lösung |
|---------|--------|
| macOS: "kann nicht geöffnet werden" | Rechtsklick → Öffnen → Öffnen bestätigen (siehe oben) |
| macOS: "Permission denied" | Terminal öffnen, eintippen: `chmod +x start.command` |
| Windows: SmartScreen warnt | "Weitere Informationen" → "Trotzdem ausführen" |
| Browser öffnet nicht | Im Terminal steht die URL (z.B. `http://localhost:8080`). Manuell im Browser öffnen |
| Port belegt | Das Script findet automatisch einen freien Port (8080–8100) |

---

## Für Entwickler

Wer den Code ändern möchte, braucht [Node.js](https://nodejs.org) (LTS) und pnpm:

```bash
pnpm install
pnpm dev          # Vite Dev-Server mit Hot Reload
pnpm build        # Neu bauen (apps/ui/dist/)
pnpm test         # Unit-Tests
pnpm lint         # ESLint
```

> **Wichtig:** Nach Code-Änderungen `pnpm build` ausführen und `apps/ui/dist/` committen, damit die Start-Scripts die aktuelle Version verwenden.
