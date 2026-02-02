@echo off
chcp 65001 >nul
echo.
echo === ClickHouse Setup ===
echo.

REM Check Docker
echo [1/4] Checking Docker...
docker --version >nul 2>&1
if errorlevel 1 (
    echo    ERROR: Docker not found! Install Docker Desktop first.
    echo    Download: https://www.docker.com/products/docker-desktop/
    pause
    exit /b 1
)
echo    Docker found.

REM Start ClickHouse
echo.
echo [2/4] Starting ClickHouse...
docker compose up -d
if errorlevel 1 (
    echo    ERROR: Failed to start. Try: docker compose up -d
    pause
    exit /b 1
)
echo    Container started.

REM Wait
echo.
echo [3/4] Waiting 15 seconds for ClickHouse...
timeout /t 15 /nobreak >nul
echo    Done.

REM Create tables
echo.
echo [4/4] Creating database and tables...
docker exec -i clickhouse clickhouse-client --user default --password root --query "CREATE DATABASE IF NOT EXISTS analytics"
type init\create_tables.v3.sql | docker exec -i clickhouse clickhouse-client --user default --password root --database analytics --multiquery
if errorlevel 1 (
    echo    ERROR: Failed to create tables.
    pause
    exit /b 1
)
echo    Tables created!

echo.
echo === Setup Complete ===
echo ClickHouse: http://localhost:8123
echo Database: analytics
echo.
echo Test: curl http://localhost:8000/api/analytics/test-connection
echo.
pause
