@echo off
title N-LAMS Frontend Web Portal
cd /d "%~dp0\frontend"

echo ===================================================
echo   N-LAMS Frontend - React + Vite + Tailwind CSS
echo ===================================================
echo.

echo [1/2] Checking npm...
call npm -v
if %errorlevel% neq 0 (
    echo [ERROR] Node.js / npm is not installed or not in PATH!
    pause
    exit /b %errorlevel%
)

echo.
echo [2/2] Launching Frontend Web Portal on http://localhost:3008 ...
call npm run dev
pause
