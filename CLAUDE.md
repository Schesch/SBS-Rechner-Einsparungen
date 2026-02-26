# CLAUDE.md — SBS Zeit- & Kostenersparnis-Rechner (Local Desktop App)

## Ziel
Dieses Projekt ist ein **lokal laufender 1-Seiten Rechner**, der für die Südtirol Business School (SBS) die **Zeitersparnis** und **Kostenersparnis** durch KI auf Basis weniger Input-Parameter berechnet.

Wichtig:
- **Single Page**: keine Navigation, keine Menüs, alles auf einer Seite.
- **Offline/Local**: läuft lokal auf dem Rechner.
- **Distribution**: Der Code liegt auf GitHub, Mitarbeitende können eine **fertige App** installieren.
- **Executable**: Es gibt **Windows `.exe`** und **macOS `.dmg`/`.app`**.
- **Start per Doppelklick**: App startet und **öffnet automatisch den lokalen Browser** (Default Browser) mit der UI.

## Empfohlener Tech-Stack (für Claude Code)
- **Frontend**: React + Vite + TypeScript (schnell, stabil, einfacher Build)
- **Desktop Wrapper**: Electron
- **Packaging**: electron-builder (Windows installer `.exe`, macOS `.dmg`/`.app`)
- **CI/CD**: GitHub Actions (Builds + Releases)
- **UI**: minimal, clean (CSS oder Tailwind — wähle eine einfache Lösung, ohne Overengineering)

Warum Electron?
- zuverlässig für cross-platform Desktop Builds
- kann beim Start den **Browser öffnen**
- keine Node-Installation bei Mitarbeitenden nötig

## Fachliche Anforderungen (Business-Logik)
### Inputs
1. **Anzahl Mitarbeiter**
   - Slider: 1–500
   - Verbundenes Number-Input
   - Default: 10

2. **Wochenstunden pro Mitarbeiter**
   - Slider: 20–40
   - Verbundenes Number-Input
   - Default: 40

3. **Zeitersparnis**
   - Eingabefeld (Default: 10 Minuten)
   - Dropdown Einheit: **pro Stunde** | **pro Tag** | **pro Woche**
   - Interpretation: Ersparnis gilt **pro Mitarbeiter**

4. **Lohnmodus** (muss möglich sein)
   - Modus A: **Monatsbruttolohn pro Mitarbeiter**
     - Slider: 1.000€–10.000€ (100er Schritte)
     - Verbundenes Number-Input
     - Default: 2.000€
   - Modus B: **Stundenlohn pro Mitarbeiter**
     - z.B. Slider: 10€–200€ (1€ Schritte) oder frei per Input
     - Wenn Stundenlohn aktiv ist, werden Monatskosten aus Stunden berechnet (siehe PLAN.md)

### Outputs (2x2 Grid, alle Zeiten in **Stunden**)
- **Gesamtzeit pro Monat ohne KI** (in Stunden)
- **Gesamtkosten pro Monat ohne KI** (in €)
- **Eingesparte Zeit pro Monat** (in Stunden)
- **Eingesparte Kosten pro Monat** (in €)

### Monat-Definition
- Verwende **4.33 Wochen pro Monat (52/12)** für realistischere Werte.

## UI/UX Anforderungen
- Alles auf **einer Seite**, oben Inputs, unten Output-Kacheln (2x2).
- Ganz oben soll zentriert das sbs_business_school.jpg grafik angezeigt werden.
- Darunter ein Titel mit "Berechnung der Einsparungen mit KI".
- Slider + Eingabefeld sind synchron (Änderung in einem aktualisiert das andere).
- Sofortige Berechnung (reactive), keine “Submit”-Buttons notwendig.
- Formatierung:
  - Zeiten als Stunden mit sinnvoller Rundung (z.B. 1 Nachkommastelle)
  - Euro als Währung (z.B. `€ 12.345` / `€ 12.345,67` je nach gewähltem Format)
- kleine “Info”-Tooltips für Einheiten/Interpretation für einfaches verständnis.

## Desktop-Startverhalten (Browser öffnen)
Beim Start der Desktop App:
1. Lokalen Webserver starten (oder statische Vite-Builds hosten).
2. Freien Port wählen (z.B. 5173 fallback auf random).
3. Healthcheck abwarten.
4. Default Browser öffnen: `http://127.0.0.1:<port>/`

Die Electron-App soll **nicht** die UI in einem Electron-Fenster zeigen, sondern **nur Browser öffnen** (das ist explizit so gewünscht).

## Projektstruktur (Soll-Zustand)
Claude Code soll dieses Repo so anlegen:

- `apps/ui/`  
  React/Vite Frontend (Inputs, Berechnung, Layout)

- `apps/desktop/`  
  Electron Main Process + lokaler Server + Browser-Open Logik

- `.github/workflows/release.yml`  
  GitHub Actions Workflow für cross-platform Builds & Releases

- `README.md`  
  Installationsanleitung für Mitarbeitende + “Wie starte ich?” + Troubleshooting

- `CLAUDE.md`  
  (diese Datei) Projekt- und Umsetzungsbeschreibung für Claude Code

- `PLAN.md`  
  Konkrete Umsetzungsschritte inkl. Formeln, States, Edge-Cases, Commands

## Build & Release Anforderungen (GitHub)
- GitHub Releases sollen “Assets” enthalten:
  - Windows: `SBS-Rechner-Setup.exe` (oder `.msi`)
  - macOS: `SBS-Rechner.dmg` (oder `.zip` der `.app`)
- Jeder Release wird über Tags ausgelöst (z.B. `v1.0.0`).
- CI baut auf:
  - `windows-latest`
  - `macos-latest`

## Qualitätsanforderungen
Claude Code soll:
- sauberen TypeScript Code schreiben (strict)
- keine unnötige Komplexität (keine Datenbanken, keine Auth)
- klare Benennung von Variablen & Einheiten (Minuten/Stunden/Monat)
- Edge Cases behandeln:
  - negative Werte verhindern
  - NaN verhindern
  - Rundung/Formatierung konsistent

## Definition of Done
- `pnpm install` (oder `npm install`) läuft ohne Fehler
- `pnpm dev` startet UI lokal
- `pnpm dist` (oder entsprechender command) baut Installer/DMG
- Doppelklick auf Windows Installer → App installiert → Start → Browser öffnet die UI
- Doppelklick auf macOS App → Browser öffnet die UI
- Outputs stimmen mit den Formeln (PLAN.md) überein

---

## Claude Code Arbeitsmodus (wie du arbeiten sollst)
1. **Repo initialisieren** und Struktur anlegen.
2. **UI zuerst**: Inputs, State, Berechnungen, Output Grid.
3. **Desktop Wrapper**: Electron Startlogik, Port Handling, Browser öffnen.
4. **Packaging**: electron-builder konfigurieren (App Name, Icons optional).
5. **CI**: GitHub Actions Workflow für Builds & Releases.
6. **Docs**: README mit Download/Install/Start + Troubleshooting (Windows SmartScreen, macOS Gatekeeper).

> Wichtig: Halte das Projekt bewusst klein und wartbar. Fokus ist “funktioniert sofort nach Download & Doppelklick”.