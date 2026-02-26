# PLAN.md — SBS Zeit- & Kostenersparnis-Rechner (Local Desktop App)

> Referenz: Anforderungen in CLAUDE.md (Single Page, lokale App, Browser-Open, Windows .exe + macOS .dmg/.app, Tests/Validierung).  

---

## 0) Zielbild & Nicht-Ziele

### Zielbild (MVP)
- Eine **einzige Seite** mit:
  - oben zentriert: `sbs_business_school.jpg`
  - Titel: „Berechnung der Einsparungen mit KI“
  - Input-Bereich (Slider + Number Inputs + Dropdowns + Tooltips)
  - Output-Bereich: **2x2 Kacheln**
- Reaktive Berechnung (ohne Submit)
- Desktop-Executable:
  - Windows: Installer `.exe` (oder `.msi`)
  - macOS: `.dmg` oder `.zip` der `.app`
- Beim Start (Doppelklick):
  - lokaler Server startet
  - freier Port wird gewählt
  - App öffnet **Default Browser** mit `http://127.0.0.1:<port>/`

### Nicht-Ziele
- Keine Authentifizierung, kein Login
- Keine Cloud/DB
- Kein Multi-Page Routing
- Keine persistente Speicherung erforderlich (optional später)

---

## 1) Repo-Setup / Monorepo-Struktur

### Ziel-Struktur
- `apps/ui/`        → React/Vite/TS Web UI
- `apps/desktop/`   → Electron Main + local server hosting der UI
- `assets/`         → Bilder/Icons (u.a. `sbs_business_school.jpg`)
- `.github/workflows/release.yml`
- `README.md`
- `CLAUDE.md`
- `PLAN.md`

### Package Manager
- Empfehlung: `pnpm` (schnell & sauber). Falls Team lieber npm: anpassbar.

### Root Scripts
- `pnpm dev` → startet UI dev
- `pnpm test` → Unit/Component Tests
- `pnpm lint` → ESLint
- `pnpm typecheck` → `tsc --noEmit`
- `pnpm dist` → Desktop builds (Win/mac)

---

## 2) UI (apps/ui) — Implementierungsplan

### 2.1 UI Framework & Setup
- `Vite + React + TypeScript`
- Strict TS aktivieren
- Linting: ESLint + (optional) Prettier
- Testing: Vitest + React Testing Library

### 2.2 Assets
- `assets/sbs_business_school.jpg` (im Repo)
- In UI anzeigen:
  - zentriert
  - responsiv (max-width)
  - alt text setzen

### 2.3 State Model (Single Source of Truth)
Definiere einen State-Container (z.B. React `useReducer` oder `useState`):
- `employeeCount: number` (1–500, default 10)
- `hoursPerWeekPerEmployee: number` (20–40, default 40)
- `timeSavingValueMinutes: number` (default 10; intern immer Minuten speichern)
- `timeSavingUnit: "per_hour" | "per_day" | "per_week"` (default per_hour oder per_day? -> gemäß UI default „10min“ + Dropdown, setze default auf `per_hour` ODER über UI klar definieren)
- `wageMode: "monthly" | "hourly"` (default monthly)
- `monthlyGross: number` (1000–10000 step 100, default 2000) – nur wenn wageMode=monthly
- `hourlyWage: number` (z.B. 10–200 step 1, default z.B. 20) – nur wenn wageMode=hourly

> Wichtig: Intern Einheit für Zeitsparen **immer Minuten**; Darstellung in UI kann Minuten sein. Outputs in **Stunden**.

### 2.4 Input Components (Slider + Number Input Sync)
Für jede Slider/Number-Kombi:
- **Controlled** Components
- onChange:
  - parse & clamp
  - `NaN` abfangen
  - Step berücksichtigen
- bidirektionale Sync:
  - Slider bewegt → Number Input ändert sich
  - Number Input tippen → Slider folgt (nach Clamp)

Empfohlene Helper:
- `clamp(value, min, max)`
- `roundToStep(value, step)`
- `parseNumberOrFallback(input, fallback)`

### 2.5 Tooltips (Info)
- Kleine `i` Icons oder `?` Tooltip
- Inhalte:
  - „Zeitersparnis gilt pro Mitarbeiter“
  - „Monat = 4.33 Wochen“
  - Erklärung Lohnmodus (Monat vs Stunde)

---

## 3) Rechenlogik — Spezifikation (mit Einheiten & Edge Cases)

### 3.1 Konstanten
- `WEEKS_PER_MONTH = 52 / 12 = 4.3333333333`
- `DAYS_PER_WEEK = 5` (Annahme: Arbeitswoche 5 Tage)
  - Optional später: konfigurierbar. Für MVP fix.
- `HOURS_PER_DAY = hoursPerWeekPerEmployee / DAYS_PER_WEEK` (dynamisch)

### 3.2 Baseline: Gesamtzeit pro Monat ohne KI (in Stunden)
**Interpretation:** Stunden pro Woche sind **pro Mitarbeiter**.
- `totalHoursPerMonthNoAI = employeeCount * hoursPerWeekPerEmployee * WEEKS_PER_MONTH`

### 3.3 Gesamtkosten pro Monat ohne KI (in €)
**Fall A: Monatsbrutto-Modus**
- `totalCostPerMonthNoAI = employeeCount * monthlyGross`

**Fall B: Stundenlohn-Modus**
- Monatsstunden gesamt (ohne KI) sind `totalHoursPerMonthNoAI`
- `totalCostPerMonthNoAI = totalHoursPerMonthNoAI * hourlyWage`

> Validierung: hourlyWage > 0, monthlyGross > 0

### 3.4 Eingesparte Zeit pro Monat (in Stunden)
Zeitersparnis wird eingegeben als **Minuten** und gilt **pro Mitarbeiter**.

Zuerst: `savingMinutes = timeSavingValueMinutes` (>= 0)

Dann je Einheit:

#### (a) Zeitersparnis *pro Stunde*
Bedeutung: pro Arbeitsstunde spart ein Mitarbeiter `savingMinutes`.
- Pro Mitarbeiter pro Monat: `hoursPerWeekPerEmployee * WEEKS_PER_MONTH` Arbeitsstunden
- Ersparnis pro Mitarbeiter/Monat in Minuten:
  - `savedMinutesPerEmployee = savingMinutes * hoursPerWeekPerEmployee * WEEKS_PER_MONTH`
- Gesamt:
  - `savedMinutesTotal = employeeCount * savedMinutesPerEmployee`

#### (b) Zeitersparnis *pro Tag*
Bedeutung: pro Arbeitstag spart ein Mitarbeiter `savingMinutes`.
- Arbeitstage pro Woche: `DAYS_PER_WEEK` (5)
- Arbeitstage pro Monat: `DAYS_PER_WEEK * WEEKS_PER_MONTH`
- `savedMinutesPerEmployee = savingMinutes * DAYS_PER_WEEK * WEEKS_PER_MONTH`
- `savedMinutesTotal = employeeCount * savedMinutesPerEmployee`

#### (c) Zeitersparnis *pro Woche*
Bedeutung: pro Arbeitswoche spart ein Mitarbeiter `savingMinutes`.
- Wochen pro Monat: `WEEKS_PER_MONTH`
- `savedMinutesPerEmployee = savingMinutes * WEEKS_PER_MONTH`
- `savedMinutesTotal = employeeCount * savedMinutesPerEmployee`

Konvertierung in Stunden:
- `savedHoursTotal = savedMinutesTotal / 60`

**Deckelung (kritisch):**
- Eingesparte Zeit darf nicht > Gesamtzeit:
  - `savedHoursTotal = min(savedHoursTotal, totalHoursPerMonthNoAI)`
- Negative Werte verhindern:
  - `savedHoursTotal = max(savedHoursTotal, 0)`

### 3.5 Eingesparte Kosten pro Monat (in €)
- `savedCost = totalCostPerMonthNoAI * (savedHoursTotal / totalHoursPerMonthNoAI)`

Edge Case:
- wenn `totalHoursPerMonthNoAI == 0` (sollte bei min hours=20 nicht passieren, aber robust):
  - `savedCost = 0`

Zusätzlich:
- `savedCost` deckeln:
  - `savedCost <= totalCostPerMonthNoAI`

### 3.6 Ausgabeformatierung
- Zeit: `formatHours(x)` → z.B. `12.3 h`
- Euro: `Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" })`

---

## 4) Validierungen (UI + Logic)

### 4.1 UI Validierungen
- Mitarbeiter: clamp 1..500
- Stunden/Woche: clamp 20..40
- Zeitersparnis-Minuten:
  - clamp 0..(sinnvoller Max, z.B. 240)
  - Input darf leer sein → fallback auf last valid oder default
- Monatslohn:
  - clamp 1000..10000
  - step 100
- Stundenlohn:
  - clamp z.B. 1..500 (oder 10..200)
  - step 1

### 4.2 Logik Validierungen
- Saved hours nicht > total hours
- savedCost nicht > totalCost
- Keine NaNs:
  - wenn parsing fehlschlägt → fallback
- Unit: nur erlaubte Werte

---

## 5) Tests (Unit + Component + Smoke)

### 5.1 Unit Tests: Rechenmodul
Erstelle in `apps/ui/src/lib/calculator.ts` eine reine Funktion:
- `calculate(inputs): outputs`

Unit tests (Vitest) für:
1) Default Values → erwartete Zahlen (Snapshot-artig)
2) Grenzen:
   - employees=1, hours=20, saving=0 → saved=0
   - employees=500, hours=40, saving sehr hoch → savedHours capped
3) Units:
   - per_hour vs per_day vs per_week korrekt
4) Wage Modes:
   - monthly: totalCost = employees * monthlyGross
   - hourly: totalCost = totalHours * hourlyWage
5) NaN / invalid:
   - input leer / NaN → fallback greift (wenn implementiert)
6) Rundung/Formatierung:
   - Formatfunktionen separat testen (optional)

### 5.2 Component Tests: Inputs Sync
Mit React Testing Library:
- Slider ändern → Number Input zeigt gleichen Wert
- Number Input ändern → Slider folgt (nach Clamp)
- WageMode Toggle:
  - monthly aktiv → monthly controls sichtbar, hourly hidden
  - hourly aktiv → hourly controls sichtbar
- Dropdown Zeiteinheit ändert calculation

### 5.3 Smoke Test: Build UI
- `pnpm --filter ui build` muss laufen
- `pnpm --filter ui preview` optional lokal prüfen

---

## 6) Desktop Wrapper (apps/desktop) — Implementierungsplan

### 6.1 Kernidee
Electron startet:
- einen lokalen HTTP Server, der das gebaute UI ausliefert (`apps/ui/dist`)
- wählt freien Port
- wartet auf `/health`
- öffnet Default Browser auf `http://127.0.0.1:<port>/`

### 6.2 Desktop-Implementierung
- `main.ts` (Electron main process)
- Node HTTP Server:
  - Express oder `http` + `serve-static`
  - Route `/health` → 200 OK
  - Statische Auslieferung `ui/dist`
- Port Finding:
  - versuche Port 5173, sonst random free port
  - robust: `get-port` package oder eigene Routine
- Browser Open:
  - `shell.openExternal(url)`
- App Verhalten:
  - Kein BrowserWindow erzeugen (oder nur hidden minimal, falls Electron zwingend Fenster braucht; Ziel: kein UI-Fenster)

### 6.3 Logging / Troubleshooting
- minimal console logging
- optional write log file to userData

### 6.4 Desktop Smoke Tests
- Minimal:
  - Start script (dev) startet server
  - healthcheck reachable
- Optional: Playwright e2e später (nicht MVP)

---

## 7) Packaging (electron-builder)

### 7.1 Konfiguration
- App name: z.B. `SBS-KI-Rechner`
- productName: `SBS KI Rechner`
- appId: `com.sbs.ki-rechner`
- icons optional später (`.ico` / `.icns`)
- Windows target: `nsis` (liefert Setup.exe)
- macOS target: `dmg` (oder `zip`)

### 7.2 Build Pipeline Lokal
- `pnpm build`:
  - UI build → `apps/ui/dist`
  - Desktop build → packager nutzt UI dist
- `pnpm dist`:
  - electron-builder baut Installer/DMG

### 7.3 Validierung der Artefakte
- Windows:
  - Setup installieren
  - Start → Browser öffnet
- macOS:
  - .dmg öffnen, App starten
  - Hinweis Gatekeeper in README (Rechtsklick → Öffnen)

---

## 8) GitHub Actions Release Workflow

### 8.1 Trigger
- Tags `v*` (z.B. `v1.0.0`)

### 8.2 Jobs
- matrix:
  - `windows-latest`
  - `macos-latest`
- steps:
  1) checkout
  2) setup node
  3) install pnpm
  4) install deps
  5) run: lint, typecheck, test
  6) build UI
  7) build desktop dist
  8) upload artifacts to GitHub Release

### 8.3 Release Assets Naming
- Windows: `SBS-KI-Rechner-Setup.exe`
- macOS: `SBS-KI-Rechner.dmg`

---

## 9) README (für Mitarbeitende)

Inhalt:
- Download über GitHub Releases
- Installation Windows (SmartScreen Hinweis)
- Installation macOS (Gatekeeper Hinweis)
- Start: Doppelklick → Browser öffnet automatisch
- Troubleshooting:
  - Port belegt → App wählt automatisch anderen
  - Browser öffnet nicht → manuell URL aus Log/Popup
  - Antivirus false positive (selten) → Release signieren (später)

---

## 10) Definition of Done (Checklist)

### Funktional
- [ ] Single Page zeigt Logo + Titel + Inputs + Outputs (2x2)
- [ ] Alle Slider/Input Sync funktioniert
- [ ] WageMode monthly/hourly funktioniert korrekt
- [ ] Zeitersparnis Unit per hour/day/week korrekt + capped
- [ ] Monat = 4.33 Wochen

### Qualität
- [ ] `pnpm lint` grün
- [ ] `pnpm typecheck` grün
- [ ] `pnpm test` grün (Unit + Component)
- [ ] Keine NaNs / negative Werte im UI

### Distribution
- [ ] `pnpm dist` erzeugt Win+Mac Artefakte lokal (je OS)
- [ ] GitHub Actions baut Release bei Tag `vX.Y.Z`
- [ ] Download → Install/Run → Browser öffnet lokal

---

## 11) Konkrete To-Do Reihenfolge für Claude Code (Abarbeitung)

1) Repo initialisieren + Monorepo Struktur + pnpm workspace
2) UI scaffolden (Vite React TS) + Layout + Inputs + Outputs
3) Rechenlogik in `calculator.ts` kapseln + Unit Tests
4) Input-Komponenten + Sync + Validierungen + Component Tests
5) Assets/Logo einbinden + Styling minimal clean
6) Desktop app scaffolden (Electron + TS) + static server + health + browser open
7) electron-builder config + dist scripts
8) GitHub Actions release workflow
9) README schreiben + Troubleshooting
10) Finaler smoke check: build & run
