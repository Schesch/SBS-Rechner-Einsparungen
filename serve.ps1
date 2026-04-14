# SBS KI Rechner — PowerShell HTTP-Server fuer Windows
# Wird von start.bat aufgerufen. Nicht direkt ausfuehren.

$Root = Join-Path $PSScriptRoot "apps\ui\dist"
$Port = 8080

# Freien Port finden
while ($Port -le 8100) {
    try {
        $testListener = [System.Net.HttpListener]::new()
        $testListener.Prefixes.Add("http://localhost:$Port/")
        $testListener.Start()
        $testListener.Stop()
        $testListener.Close()
        break
    } catch {
        $Port++
    }
}

if ($Port -gt 8100) {
    Write-Host "[FEHLER] Kein freier Port gefunden (8080-8100 belegt)."
    Read-Host "Druecke Enter zum Schliessen"
    exit 1
}

# MIME-Types fuer statische Dateien
$mimeTypes = @{
    '.html' = 'text/html; charset=utf-8'
    '.js'   = 'application/javascript; charset=utf-8'
    '.css'  = 'text/css; charset=utf-8'
    '.jpg'  = 'image/jpeg'
    '.jpeg' = 'image/jpeg'
    '.png'  = 'image/png'
    '.svg'  = 'image/svg+xml'
    '.json' = 'application/json; charset=utf-8'
    '.ico'  = 'image/x-icon'
    '.woff' = 'font/woff'
    '.woff2'= 'font/woff2'
}

# HTTP-Server starten
$listener = [System.Net.HttpListener]::new()
$listener.Prefixes.Add("http://localhost:$Port/")
$listener.Start()

$url = "http://localhost:$Port"
Write-Host ""
Write-Host "  SBS KI Rechner laeuft auf $url"
Write-Host "  Zum Beenden: dieses Fenster schliessen oder Ctrl+C druecken."
Write-Host ""

# Browser oeffnen
Start-Process $url

# Anfragen verarbeiten
try {
    while ($listener.IsListening) {
        $context = $listener.GetContext()
        $requestPath = $context.Request.Url.LocalPath.TrimStart('/')

        if ($requestPath -eq '') { $requestPath = 'index.html' }

        $filePath = Join-Path $Root $requestPath

        if (Test-Path $filePath -PathType Leaf) {
            $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
            $contentType = $mimeTypes[$ext]
            if (-not $contentType) { $contentType = 'application/octet-stream' }

            $content = [System.IO.File]::ReadAllBytes($filePath)
            $context.Response.ContentType = $contentType
            $context.Response.StatusCode = 200
        } else {
            # SPA-Fallback: unbekannte Pfade -> index.html
            $indexPath = Join-Path $Root 'index.html'
            $content = [System.IO.File]::ReadAllBytes($indexPath)
            $context.Response.ContentType = 'text/html; charset=utf-8'
            $context.Response.StatusCode = 200
        }

        $context.Response.ContentLength64 = $content.Length
        $context.Response.OutputStream.Write($content, 0, $content.Length)
        $context.Response.Close()
    }
} finally {
    $listener.Stop()
    $listener.Close()
}
