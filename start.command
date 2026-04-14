#!/bin/bash
# SBS KI Rechner — Startscript für macOS
# Doppelklick auf diese Datei um den Rechner zu starten.

cd "$(dirname "$0")"

echo "========================================="
echo "  SBS KI Rechner — wird gestartet..."
echo "========================================="
echo ""

# Quarantäne-Attribut entfernen (behebt macOS Gatekeeper-Warnung bei zukünftigen Starts)
if command -v xattr &> /dev/null; then
    xattr -d com.apple.quarantine "$0" 2>/dev/null || true
fi

# Execute-Permission sicherstellen (selbstheilend für ZIP-Downloads)
chmod +x "$0" 2>/dev/null || true

# PATH erweitern: Homebrew (Intel + Apple Silicon) und nvm
export PATH="/opt/homebrew/bin:/usr/local/bin:$PATH"
if [ -d "$HOME/.nvm/versions/node" ]; then
    NVM_NODE=$(ls "$HOME/.nvm/versions/node" 2>/dev/null | sort -V | tail -1)
    if [ -n "$NVM_NODE" ]; then
        export PATH="$HOME/.nvm/versions/node/$NVM_NODE/bin:$PATH"
    fi
fi

# Node.js prüfen
if ! command -v node &> /dev/null; then
    echo "❌ Node.js ist nicht installiert!"
    echo ""
    echo "Bitte installiere Node.js:"
    echo "  1. Gehe zu https://nodejs.org"
    echo "  2. Lade die LTS-Version herunter"
    echo "  3. Installiere und starte dieses Script erneut"
    echo ""
    echo "Drücke Enter zum Schließen..."
    read
    exit 1
fi

echo "✅ Node.js gefunden: $(node --version)"

# pnpm prüfen, bei Bedarf installieren
if ! command -v pnpm &> /dev/null; then
    echo "⏳ pnpm wird installiert..."
    npm install -g pnpm
    if [ $? -ne 0 ]; then
        echo "❌ pnpm konnte nicht installiert werden."
        echo "   Versuche: npm install -g pnpm"
        echo ""
        echo "Drücke Enter zum Schließen..."
        read
        exit 1
    fi
fi

echo "✅ pnpm gefunden: $(pnpm --version)"

# Dependencies installieren falls nötig (nur UI-Abhängigkeiten, kein Electron)
if [ ! -d "node_modules" ]; then
    echo ""
    echo "⏳ Dependencies werden installiert (erster Start)..."
    pnpm install --filter ui...
    if [ $? -ne 0 ]; then
        echo "❌ Installation fehlgeschlagen."
        echo ""
        echo "Drücke Enter zum Schließen..."
        read
        exit 1
    fi
fi

echo ""
echo "🚀 Starte den Rechner..."
echo "   Der Browser öffnet sich gleich automatisch."
echo "   Zum Beenden: dieses Fenster schließen oder Ctrl+C drücken."
echo ""

pnpm dev
