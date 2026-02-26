# SBS KI Rechner

Berechnung der Zeit- und Kostenersparnis durch KI-Einsatz im Unternehmen.

Ein lokaler Rechner der Südtirol Business School (SBS).

## Schnellstart

### 1. Repository herunterladen

Auf der [GitHub-Seite](../../) oben auf den grünen Button **"Code" → "Download ZIP"** klicken und entpacken.

Oder mit Git:
```bash
git clone <repository-url>
```

### 2. Voraussetzung: Node.js installieren

Falls Node.js noch nicht installiert ist:
1. Gehe zu **https://nodejs.org**
2. Lade die **LTS-Version** herunter
3. Installiere sie (Standard-Einstellungen reichen)

### 3. Rechner starten

| Betriebssystem | Datei | Aktion |
|---|---|---|
| **macOS** | `start.command` | Doppelklick |
| **Windows** | `start.bat` | Doppelklick |

Das Script:
- Installiert automatisch `pnpm` (falls nicht vorhanden)
- Installiert automatisch die Abhängigkeiten (nur beim ersten Start)
- Startet den lokalen Server
- Öffnet den **Browser** mit dem Rechner

> **macOS Hinweis**: Beim ersten Doppelklick auf `start.command` kann macOS warnen. In dem Fall: **Rechtsklick** → "Öffnen" → "Öffnen" bestätigen.

### 4. Beenden

Einfach das Terminal-Fenster schließen oder `Ctrl+C` drücken.

## Troubleshooting

| Problem | Lösung |
|---------|--------|
| "Node.js ist nicht installiert" | Node.js von https://nodejs.org installieren |
| Browser öffnet nicht | Im Terminal steht die URL (z.B. `http://127.0.0.1:5173`). Manuell im Browser öffnen. |
| Port belegt | Vite wählt automatisch einen anderen freien Port |
| macOS warnt bei start.command | Rechtsklick → "Öffnen" → "Öffnen" bestätigen |
| Windows warnt (SmartScreen) | "Weitere Informationen" → "Trotzdem ausführen" |