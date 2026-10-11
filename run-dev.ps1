param(
    [switch]$Popup  # Nếu truyền -Popup sẽ mở 2 cửa sổ riêng ngoài desktop. Mặc định: chạy trực tiếp trong terminal hiện tại.
)

$root = $PSScriptRoot
if (-not $root) { $root = (Get-Location).Path }
Set-Location $root

Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "   Personal Expense Tracker - Full Dev Runner" -ForegroundColor Cyan
Write-Host "========================================================" -ForegroundColor Cyan

# 1. Kiểm tra và khởi chạy Docker PostgreSQL
$dockerReady = $false
try {
    $null = docker info 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "`n[1/3] Docker đang hoạt động. Khởi động PostgreSQL..." -ForegroundColor Yellow
        docker compose up -d postgres | Out-Null
        
        # Đợi Postgres sẵn sàng
        $retry = 0
        while ($retry -lt 10) {
            $null = docker exec expense-tracker-postgres pg_isready -U postgres 2>&1
            if ($LASTEXITCODE -eq 0) {
                $dockerReady = $true
                break
            }
            Start-Sleep -Seconds 1
            $retry++
        }
        
        if ($dockerReady) {
            Write-Host "  -> PostgreSQL 16 (Docker) sẵn sàng tại port 5433 (Database: expense_tracker)" -ForegroundColor Green
            $env:SPRING_PROFILES_ACTIVE = "postgres"
        } else {
            Write-Host "  -> PostgreSQL chưa sẵn sàng. Tự động chuyển sang H2 Database." -ForegroundColor Yellow
            $env:SPRING_PROFILES_ACTIVE = "dev"
        }
    } else {
        Write-Host "`n[1/3] Docker chưa bật. Tự động sử dụng H2 in-memory Database." -ForegroundColor Yellow
        $env:SPRING_PROFILES_ACTIVE = "dev"
    }
} catch {
    Write-Host "`n[1/3] Không thể kết nối Docker. Tự động sử dụng H2 in-memory Database." -ForegroundColor Yellow
    $env:SPRING_PROFILES_ACTIVE = "dev"
}

Write-Host "`n[2/3] Cấu hình môi trường:" -ForegroundColor Cyan
Write-Host "  - Profile Spring Boot : $($env:SPRING_PROFILES_ACTIVE)" -ForegroundColor White
Write-Host "  - Backend API         : http://localhost:8088/api/health" -ForegroundColor White
Write-Host "  - Frontend UI         : http://localhost:5180" -ForegroundColor White
if ($env:SPRING_PROFILES_ACTIVE -eq "dev") {
    Write-Host "  - H2 Console          : http://localhost:8088/h2-console" -ForegroundColor White
}

if ($Popup) {
    Write-Host "`n[3/3] Đang mở 2 cửa sổ PowerShell riêng biệt ngoài Desktop..." -ForegroundColor Yellow
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$root\backend'; Write-Host '=== SPRING BOOT BACKEND ===' -ForegroundColor Green; mvn spring-boot:run"
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$root\frontend'; Write-Host '=== REACT VITE FRONTEND ===' -ForegroundColor Green; npm run dev"
    Write-Host "Đã khởi chạy trong 2 cửa sổ ngoài.`n" -ForegroundColor Green
} else {
    Write-Host "`n[3/3] Khởi chạy Backend + Frontend TRỰC TIẾP trong Terminal này..." -ForegroundColor Green
    Write-Host "  (Nhấn Ctrl + C để dừng cả 2 cùng lúc)`n" -ForegroundColor DarkGray
    npm run dev
}
