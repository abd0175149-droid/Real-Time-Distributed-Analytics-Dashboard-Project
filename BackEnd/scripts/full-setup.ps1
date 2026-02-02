# =============================================================================
# إعداد كامل للمشروع مع بيانات الاختبار
# =============================================================================

$ErrorActionPreference = "Stop"
$BackEndDir = Split-Path -Parent (Split-Path -Parent $PSScriptRoot)
Set-Location $BackEndDir

Write-Host "`n=== Full Analytics Setup ===" -ForegroundColor Cyan

Write-Host "`n[1] Migrating MySQL..." -ForegroundColor Yellow
php artisan migrate --force
if ($LASTEXITCODE -ne 0) { exit 1 }

Write-Host "`n[2] Seeding users (RolesSeeder + TestUsersSeeder with fixed IDs)..." -ForegroundColor Yellow
php artisan db:seed --force
if ($LASTEXITCODE -ne 0) { exit 1 }

Write-Host "`n[3] Seeding ClickHouse sample data..." -ForegroundColor Yellow
php artisan clickhouse:seed-sample
if ($LASTEXITCODE -ne 0) { exit 1 }

Write-Host "`n[4] Running diagnostics..." -ForegroundColor Yellow
php artisan check:analytics-setup

Write-Host "`n=== Setup Complete ===" -ForegroundColor Green
Write-Host "Test users: admin@test.com, user@test.com, analyst@test.com"
Write-Host "Password: password123"
Write-Host "`nRun: php artisan serve"
Write-Host "Frontend: cd ..\frontend\react-analytics-dashboard-updated\react-analytics-dashboard; npm run dev"
Write-Host ""
