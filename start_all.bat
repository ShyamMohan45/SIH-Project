@echo off
title N-LAMS Launch All Services
cd /d "%~dp0"

echo ===================================================
echo   N-LAMS - Starting Full-Stack Platform
echo ===================================================
echo.
echo Starting Backend in a separate window...
start "N-LAMS Backend (Port 8000)" cmd /k "call start_backend.bat"

timeout /t 3 /nobreak >nul

echo Starting Frontend in a separate window...
start "N-LAMS Frontend (Port 3008)" cmd /k "call start_frontend.bat"

echo.
echo ===================================================
echo   N-LAMS is now running:
echo   - Web Portal: http://localhost:3008/
echo   - Backend Docs: http://127.0.0.1:8000/docs
echo ===================================================
echo.
pause
