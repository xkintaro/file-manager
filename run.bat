@echo off

echo Frontend...
start cmd /k "cd frontend && npm run dev"

echo Backend...
start cmd /k "cd backend && node src/server.js"

echo all services started!
pause
