# Script PowerShell pour démarrer le serveur FIXƆ
# Utilise plusieurs méthodes selon ce qui est disponible

Write-Host "🚀 Démarrage du serveur FIXƆ..." -ForegroundColor Cyan

# Méthode 1 : Node.js http-server (recommandé)
if (Get-Command node -ErrorAction SilentlyContinue) {
    Write-Host "✅ Node.js détecté - Utilisation de http-server" -ForegroundColor Green
    Write-Host "📡 Serveur démarré sur http://localhost:8080" -ForegroundColor Yellow
    Write-Host "Appuyez sur Ctrl+C pour arrêter" -ForegroundColor Gray
    npx --yes http-server -p 8080 -o
    exit
}

# Méthode 2 : Python 3 (si disponible)
if (Get-Command python -ErrorAction SilentlyContinue) {
    $pythonVersion = python --version 2>&1
    Write-Host "✅ Python détecté ($pythonVersion) - Tentative de démarrage..." -ForegroundColor Green
    try {
        Write-Host "📡 Serveur démarré sur http://localhost:8080" -ForegroundColor Yellow
        Write-Host "Appuyez sur Ctrl+C pour arrêter" -ForegroundColor Gray
        python -m http.server 8080
        exit
    } catch {
        Write-Host "❌ Erreur avec Python, essayons une autre méthode..." -ForegroundColor Red
    }
}

# Méthode 3 : PHP (si disponible)
if (Get-Command php -ErrorAction SilentlyContinue) {
    Write-Host "✅ PHP détecté - Utilisation du serveur PHP intégré" -ForegroundColor Green
    Write-Host "📡 Serveur démarré sur http://localhost:8080" -ForegroundColor Yellow
    Write-Host "Appuyez sur Ctrl+C pour arrêter" -ForegroundColor Gray
    php -S localhost:8080
    exit
}

# Méthode 4 : Ruby (si disponible)
if (Get-Command ruby -ErrorAction SilentlyContinue) {
    Write-Host "✅ Ruby détecté - Utilisation du serveur WEBrick" -ForegroundColor Green
    Write-Host "📡 Serveur démarré sur http://localhost:8080" -ForegroundColor Yellow
    Write-Host "Appuyez sur Ctrl+C pour arrêter" -ForegroundColor Gray
    ruby -run -e httpd . -p 8080
    exit
}

# Aucune méthode disponible
Write-Host "❌ Aucun serveur web détecté !" -ForegroundColor Red
Write-Host ""
Write-Host "Options d'installation :" -ForegroundColor Yellow
Write-Host "1. Node.js : https://nodejs.org/ (puis: npx http-server -p 8080)" -ForegroundColor White
Write-Host "2. Python : Réinstallez Python 3.8+ depuis python.org" -ForegroundColor White
Write-Host "3. PHP : Installez PHP depuis php.net" -ForegroundColor White
Write-Host ""
Write-Host "Ou ouvrez simplement index.html dans votre navigateur (fonctionnalités limitées)" -ForegroundColor Gray

