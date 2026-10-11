@echo off
title Personal Expense Tracker Launcher
echo ========================================================
echo  Starting Personal Expense Tracker (Backend + Frontend)
echo ========================================================
echo.
echo [1/2] Starting Spring Boot Backend (Port 8088)...
start "Backend - Spring Boot (Port 8088)" cmd /k "cd /d "%~dp0backend" && mvn spring-boot:run"

echo [2/2] Starting React Vite Frontend (Port 5180)...
start "Frontend - Vite React (Port 5180)" cmd /k "cd /d "%~dp0frontend" && npm run dev"

echo.
echo ========================================================
echo  Both services have been launched in separate terminals!
echo.
echo  - Backend API:   http://localhost:8088/api/health
echo  - Frontend UI:   http://localhost:5180
echo  - H2 Console:    http://localhost:8088/h2-console
echo ========================================================
echo.
