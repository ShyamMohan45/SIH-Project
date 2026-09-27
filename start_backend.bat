@echo off
title N-LAMS Backend Server (FastAPI)
cd /d "%~dp0"

echo ===================================================
echo   N-LAMS Backend - FastAPI + ML & SQLite Database
echo ===================================================
echo.

echo [1/3] Checking Python installation...
python --version
if %errorlevel% neq 0 (
    echo [ERROR] Python is not installed or not in PATH!
    pause
    exit /b %errorlevel%
)

echo.
echo [2/3] Installing / Verifying Backend Dependencies...
pip install -r backend/requirements.txt python-multipart
if %errorlevel% neq 0 (
    echo [WARNING] Pip install had issues. Proceeding anyway...
)

echo.
echo [3/3] Launching FastAPI Backend on http://127.0.0.1:8000 ...
echo API Swagger Docs: http://127.0.0.1:8000/docs
echo.
python -m uvicorn backend.main:app --host 127.0.0.1 --port 8000 --reload
pause
