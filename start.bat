@echo off
REM SBS KI Rechner — Startscript fuer Windows
REM Doppelklick auf diese Datei um den Rechner zu starten.
REM Benoetigt: PowerShell (auf jedem Windows 10/11 vorinstalliert)

cd /d "%~dp0"

echo =========================================
echo   SBS KI Rechner — wird gestartet...
echo =========================================
echo.

REM Pruefen ob die vorgebaute UI existiert
if not exist "apps\ui\dist\index.html" (
    echo [FEHLER] Die Anwendungsdateien fehlen (apps\ui\dist\).
    echo    Bitte lade das Repository erneut herunter.
    echo.
    pause
    exit /b 1
)

REM PowerShell-Server starten (auf jedem Windows 10/11 vorinstalliert)
echo Der Browser oeffnet sich gleich automatisch.
echo Zum Beenden: dieses Fenster schliessen oder Ctrl+C druecken.
echo.

powershell -ExecutionPolicy Bypass -NoProfile -File "%~dp0serve.ps1"
