#!/bin/bash
# SBS KI Rechner — Startscript für macOS
# Doppelklick auf diese Datei um den Rechner zu starten.
# Benötigt: python3 (auf jedem Mac seit macOS 10.15 vorinstalliert)

cd "$(dirname "$0")"

# Quarantäne-Attribut entfernen + Execute-Permission setzen (selbstheilend für ZIP-Downloads)
xattr -d com.apple.quarantine "$0" 2>/dev/null || true
chmod +x "$0" 2>/dev/null || true

echo "========================================="
echo "  SBS KI Rechner — wird gestartet..."
echo "========================================="
echo ""

# Prüfe ob der vorgebaute UI-Ordner existiert
if [ ! -f "apps/ui/dist/index.html" ]; then
    echo "❌ Die Anwendungsdateien fehlen (apps/ui/dist/)."
    echo "   Bitte lade das Repository erneut herunter."
    echo ""
    echo "Drücke Enter zum Schließen..."
    read
    exit 1
fi

# Python 3 prüfen (vorinstalliert auf macOS seit 10.15 Catalina)
if ! command -v python3 &> /dev/null; then
    echo "⚠️  Python 3 wird benötigt."
    echo "   macOS wird die Installation vorschlagen — bitte bestätigen"
    echo "   und danach dieses Script erneut starten."
    echo ""
    echo "Drücke Enter zum Schließen..."
    read
    exit 1
fi

# Freien Port finden (Standard: 8080)
PORT=8080
while lsof -i:$PORT >/dev/null 2>&1; do
    PORT=$((PORT + 1))
    if [ $PORT -gt 8100 ]; then
        echo "❌ Kein freier Port gefunden (8080-8100 belegt)."
        echo ""
        echo "Drücke Enter zum Schließen..."
        read
        exit 1
    fi
done

echo "✅ Starte auf http://localhost:$PORT"
echo ""
echo "   Der Browser öffnet sich gleich automatisch."
echo "   Zum Beenden: dieses Fenster schließen oder Ctrl+C drücken."
echo ""

# Browser nach kurzer Verzögerung öffnen
(sleep 1 && open "http://localhost:$PORT") &

# Statischen Webserver starten (Python 3 — auf macOS vorinstalliert)
cd apps/ui/dist
python3 -m http.server $PORT 2>/dev/null
