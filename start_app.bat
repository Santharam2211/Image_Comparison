@echo off
echo Starting DigiFlash Image Comparison App...

:: Start Backend
start cmd /k "cd backend && python main.py"

:: Start Frontend
start cmd /k "cd frontend && npm run dev"

echo Both servers are starting...
echo Backend will be available at http://localhost:8000
echo Frontend will be available at http://localhost:5173
