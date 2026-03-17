@echo off
title LeetMind Dev Server

echo Stopping any process on port 3000...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":3000 "') do (
    taskkill /PID %%a /F >nul 2>&1
)

timeout /t 1 /nobreak >nul

echo Starting LeetMind...
cd /d "%~dp0"
npm run dev

pause
