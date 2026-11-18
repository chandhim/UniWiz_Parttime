@echo off
title UniWiz Socket.IO Server
echo ========================================================
echo Starting UniWiz Socket.IO Real-Time Chat Server (Port 4000)
echo ========================================================
echo.
cd /d "%~dp0"
node socket-server.js
pause
