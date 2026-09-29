Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "  Starting Personal Expense Tracker (Backend + Frontend)" -ForegroundColor Cyan
Write-Host "========================================================" -ForegroundColor Cyan

$root = $PSScriptRoot
if (-not $root) { $root = (Get-Location).Path }

Write-Host "`n[1/2] Launching Spring Boot Backend (Port 8080)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$root\backend'; Write-Host '=== SPRING BOOT BACKEND (Port 8080) ===' -ForegroundColor Green; mvn spring-boot:run"

Write-Host "[2/2] Launching React Vite Frontend (Port 5173)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$root\frontend'; Write-Host '=== REACT VITE FRONTEND (Port 5173) ===' -ForegroundColor Green; npm run dev"

Write-Host "`n========================================================" -ForegroundColor Green
Write-Host " Both services have been launched in separate windows!" -ForegroundColor Green
Write-Host " - Backend API:   http://localhost:8080/api/health" -ForegroundColor White
Write-Host " - Frontend UI:   http://localhost:5173" -ForegroundColor White
Write-Host " - H2 Console:    http://localhost:8080/h2-console" -ForegroundColor White
Write-Host "========================================================`n" -ForegroundColor Green
