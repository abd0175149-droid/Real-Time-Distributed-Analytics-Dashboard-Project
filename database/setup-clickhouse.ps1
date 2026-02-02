# =============================================================================
# ClickHouse Setup Script - تشغيل وبناء قاعدة البيانات
# =============================================================================
# Requires: Docker Desktop installed and running
# Run: .\setup-clickhouse.ps1
# =============================================================================

$ErrorActionPreference = "Stop"
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $ScriptDir

Write-Host "`n=== ClickHouse Setup ===" -ForegroundColor Cyan

# 1. Check Docker
Write-Host "`n[1/4] Checking Docker..." -ForegroundColor Yellow
try {
    $null = docker --version
    Write-Host "   Docker found." -ForegroundColor Green
} catch {
    Write-Host "   ERROR: Docker not found! Please install Docker Desktop first." -ForegroundColor Red
    Write-Host "   Download: https://www.docker.com/products/docker-desktop/" -ForegroundColor Yellow
    exit 1
}

# 2. Start ClickHouse
Write-Host "`n[2/4] Starting ClickHouse container..." -ForegroundColor Yellow
try {
    docker compose up -d
    Write-Host "   ClickHouse container started." -ForegroundColor Green
} catch {
    Write-Host "   ERROR: Failed to start container. Try: docker compose up -d" -ForegroundColor Red
    exit 1
}

# 3. Wait for ClickHouse to be ready
Write-Host "`n[3/4] Waiting for ClickHouse to be ready..." -ForegroundColor Yellow
$maxAttempts = 30
$attempt = 0
$ready = $false

while ($attempt -lt $maxAttempts) {
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:8123/" -UseBasicParsing -TimeoutSec 2 -ErrorAction SilentlyContinue
        if ($response.StatusCode -eq 200) {
            $ready = $true
            break
        }
    } catch { }
    
    $attempt++
    Start-Sleep -Seconds 2
    Write-Host "   Attempt $attempt/$maxAttempts..." -NoNewline
}

if (-not $ready) {
    Write-Host "`n   ERROR: ClickHouse did not start in time." -ForegroundColor Red
    exit 1
}
Write-Host "`n   ClickHouse is ready!" -ForegroundColor Green

# 4. Create analytics database and run schema
Write-Host "`n[4/4] Creating database and tables..." -ForegroundColor Yellow
try {
    # Create analytics database
    docker exec -i clickhouse clickhouse-client --user default --password root --query "CREATE DATABASE IF NOT EXISTS analytics"
    
    # Run schema script
    Get-Content ".\init\create_tables.v3.sql" -Raw -Encoding UTF8 | docker exec -i clickhouse clickhouse-client --user default --password root --database analytics --multiquery
    
    Write-Host "   Database and tables created successfully!" -ForegroundColor Green
} catch {
    Write-Host "   ERROR: Failed to create tables: $_" -ForegroundColor Red
    exit 1
}

Write-Host "`n=== Setup Complete ===" -ForegroundColor Green
Write-Host "ClickHouse is running on:"
Write-Host "  - HTTP:  http://localhost:8123"
Write-Host "  - Native: localhost:9000"
Write-Host "  - Database: analytics"
Write-Host "`nTest connection: curl http://localhost:8000/api/analytics/test-connection" -ForegroundColor Cyan
Write-Host ""
