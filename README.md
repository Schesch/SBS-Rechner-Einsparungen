# SBS KI Rechner

Berechnung der Zeit- und Kostenersparnis durch KI-Einsatz im Unternehmen.

Ein lokaler Rechner der Südtirol Business School (SBS).

---

## Voraussetzung: Node.js installieren

Falls Node.js noch nicht installiert ist:

1. Gehe zu **https://nodejs.org**
2. Lade die **LTS-Version** herunter
3. Installiere sie (Standard-Einstellungen reichen)

---

## Repository herunterladen

### Option A: ZIP-Download (empfohlen für Einsteiger)

1. Auf der GitHub-Seite oben den grünen Button **"Code"** klicken
2. **"Download ZIP"** wählen
3. ZIP-Datei entpacken

### Option B: Git Clone (empfohlen für macOS — kein Gatekeeper-Problem)

```bash
git clone <repository-url>
```

---

## Rechner starten

### macOS

#### Erster Start nach ZIP-Download

Beim ersten Mal nach dem ZIP-Download muss das Script einmalig über Terminal gestartet werden:

1. **Terminal** öffnen (Spotlight: `Cmd + Leertaste` → "Terminal" eintippen)
2. Folgenden Befehl eintippen und mit **Enter** bestätigen:

```bash
bash ~/Downloads/ErsparnisRechner-main/start.command
```

> **Hinweis:** Falls du den Ordner woanders hin verschoben hast, passe den Pfad entsprechend an.

Ab dem **zweiten Start** kannst du `start.command` per **Doppelklick** öffnen — das Script repariert sich beim ersten Durchlauf selbst.

#### Erster Start nach Git Clone

Bei `git clone` funktioniert **Doppelklick** auf `start.command` sofort. Falls macOS trotzdem warnt: **Rechtsklick** → "Öffnen" → "Öffnen" bestätigen (nur einmalig nötig).

#### Alle weiteren Starts

Einfach **Doppelklick** auf `start.command`.

---

### Windows

**Doppelklick** auf `start.bat`.

Falls Windows SmartScreen warnt: **"Weitere Informationen"** → **"Trotzdem ausführen"** klicken.

---

## Was passiert beim Start?

Das Script:
- Installiert automatisch `pnpm` (falls nicht vorhanden)
- Installiert automatisch die Abhängigkeiten (nur beim ersten Start, dauert ca. 30 Sekunden)
- Startet den lokalen Server
- Öffnet den **Browser** mit dem Rechner

## Beenden

Terminal-Fenster schließen oder `Ctrl+C` drücken.

---

## Troubleshooting

| Problem | Lösung |
|---------|--------|
| "Node.js ist nicht installiert" | Node.js von https://nodejs.org installieren und Terminal neu starten |
| Browser öffnet nicht | Im Terminal steht die URL (z.B. `http://127.0.0.1:5173`). Manuell im Browser öffnen |
| Port belegt | Vite wählt automatisch einen anderen freien Port |
| macOS: "kann nicht geöffnet werden" / Gatekeeper | Terminal öffnen und `bash start.command` ausführen (siehe oben) |
| macOS: "Permission denied" | Terminal: `chmod +x start.command` ausführen, dann erneut starten |
| macOS: Node.js nicht gefunden trotz Installation | Terminal schließen und neu öffnen, damit der PATH aktualisiert wird |
| Windows: SmartScreen warnt | "Weitere Informationen" → "Trotzdem ausführen" |
