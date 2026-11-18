@echo off
title UniWiz Launcher
echo ========================================================
echo Starting UniWiz Full-Stack Development Environment
echo ========================================================
echo.
echo [1/3] Launching Backend PHP Server on Port 80...
start "UniWiz Backend API" cmd /k "cd /d "%~dp0" && php -S 127.0.0.1:80 -t uniwiz-backend"

echo [2/3] Launching Real-Time Socket.IO Server on Port 4000...
start "UniWiz Socket.IO Chat" cmd /k "cd /d "%~dp0" && node socket-server.js"

echo [3/3] Launching Frontend React Server on Port 3000...
start "UniWiz React Frontend" cmd /k "cd /d "%~dp0uniwiz-frontend" && npm start"

echo.
echo ========================================================
echo All 3 servers have been launched in separate windows!
echo - Frontend:  http://localhost:3000
echo - Backend:   http://uniwiz-backend.test/api (or http://127.0.0.1:80)
echo - Socket.IO: http://localhost:4000
echo ========================================================
echo.
pause
