# Script PowerShell pour démarrer tous les serveurs Reflex Shot

Write-Host "🚀 Démarrage de Reflex Shot..." -ForegroundColor Cyan
Write-Host ""

# Fonction pour démarrer un processus en arrière-plan
function Start-Server {
    param (
        [string]$Name,
        [string]$Command,
        [string]$Color
    )

    Write-Host "▶️  Démarrage du serveur $Name..." -ForegroundColor $Color

    $job = Start-Job -ScriptBlock {
        param($cmd)
        Set-Location $using:PWD
        Invoke-Expression $cmd
    } -ArgumentList $Command

    return $job
}

# Démarrer les serveurs
$expressJob = Start-Server -Name "Express (HTTP)" -Command "npm start" -Color "Green"
Start-Sleep -Seconds 2

$reflexJob = Start-Server -Name "WebSocket Reflex Shot" -Command "npm run ws:reflex" -Color "Yellow"
Start-Sleep -Seconds 1

Write-Host ""
Write-Host "✅ Tous les serveurs sont démarrés !" -ForegroundColor Green
Write-Host ""
Write-Host "📡 Serveurs actifs :" -ForegroundColor Cyan
Write-Host "   - HTTP API: http://10.15.2.246:3000" -ForegroundColor White
Write-Host "   - WebSocket Reflex: ws://10.15.2.246:8081" -ForegroundColor White
Write-Host ""
Write-Host "🌐 Accédez au jeu : http://10.15.2.246:3000" -ForegroundColor Magenta
Write-Host ""
Write-Host "⚠️  Appuyez sur Ctrl+C pour arrêter tous les serveurs" -ForegroundColor Yellow
Write-Host ""

# Garder le script actif et afficher les logs
try {
    while ($true) {
        # Vérifier l'état des jobs
        $expressState = $expressJob.State
        $reflexState = $reflexJob.State

        if ($expressState -ne "Running") {
            Write-Host "❌ Serveur Express arrêté : $expressState" -ForegroundColor Red
            Receive-Job -Job $expressJob
        }

        if ($reflexState -ne "Running") {
            Write-Host "❌ Serveur Reflex arrêté : $reflexState" -ForegroundColor Red
            Receive-Job -Job $reflexJob
        }

        Start-Sleep -Seconds 5
    }
}
finally {
    Write-Host ""
    Write-Host "🛑 Arrêt de tous les serveurs..." -ForegroundColor Red
    Stop-Job -Job $expressJob, $reflexJob
    Remove-Job -Job $expressJob, $reflexJob
    Write-Host "✅ Tous les serveurs sont arrêtés." -ForegroundColor Green
}

