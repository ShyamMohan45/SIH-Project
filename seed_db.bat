@echo off
title N-LAMS Database Seed
cd /d "%~dp0"

echo ===================================================
echo   N-LAMS - Seed Database (Projects, Parcels, Field)
echo ===================================================
echo.
python -m backend.app.seed
echo.
echo Seeding complete!
pause
