@echo off
title UniWiz Backend (PHP Server - Port 80)
cd /d "%~dp0"
echo ========================================================
echo Starting UniWiz PHP API server on http://127.0.0.1:80
echo Mapping to: http://uniwiz-backend.test/api
echo ========================================================
php -S 127.0.0.1:80 -t uniwiz-backend
pause
