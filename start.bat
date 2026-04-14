@echo off
REM SBS KI Rechner — Startscript für Windows
REM Doppelklick auf diese Datei um den Rechner zu starten.

cd /d "%~dp0"

echo =========================================
echo   SBS KI Rechner — wird gestartet...
echo =========================================
echo.

REM Node.js prüfen
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Node.js ist nicht installiert!
    echo.
    echo Bitte installiere Node.js:
    echo   1. Gehe zu https://nodejs.org
    echo   2. Lade die LTS-Version herunter
    echo   3. Installiere und starte dieses Script erneut
    echo.
    pause
    exit /b 1
)

for /f "tokens=*" %%v in ('node --version') do echo ✅ Node.js gefunden: %%v

REM pnpm prüfen, bei Bedarf installieren
where pnpm >nul 2>nul
if %errorlevel% neq 0 (
    echo ⏳ pnpm wird installiert...
    call npm install -g pnpm
    if %errorlevel% neq 0 (
        echo ❌ pnpm konnte nicht installiert werden.
        echo    Versuche: npm install -g pnpm
        echo.
        pause
        exit /b 1
    )
)

for /f "tokens=*" %%v in ('pnpm --version') do echo ✅ pnpm gefunden: %%v

REM Dependencies installieren falls nötig
if not exist "node_modules" (
    echo.
    echo ⏳ Dependencies werden installiert (erster Start^)...
    call pnpm install --filter ui...
    if %errorlevel% neq 0 (
        echo ❌ Installation fehlgeschlagen.
        echo.
        pause
        exit /b 1
    )
)

echo.
echo 🚀 Starte den Rechner...
echo    Der Browser oeffnet sich gleich automatisch.
echo    Zum Beenden: dieses Fenster schliessen oder Ctrl+C druecken.
echo.

call pnpm dev
