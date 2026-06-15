@echo off
cd /d "%~dp0"
start "Last Survivor Server" cmd /k node server.js
timeout /t 2 /nobreak >nul
start "" http://localhost:8765
exit
